// Returns aggregated traffic statistics for the admin page.
// Protected by the ADMIN_PASSWORD environment variable (sent as a Bearer token).
const crypto = require('crypto');
const { query } = require('./_lib/db');

function authorized(req) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return null;
  const header = req.headers.authorization || '';
  const given = header.startsWith('Bearer ') ? header.slice(7) : '';
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ZONES = new Set(['Europe/Prague', 'Asia/Makassar', 'UTC']);

// Columns that can be used as a breakdown. Fixed list, never user input.
const DIMENSIONS = {
  utm: `COALESCE(utm_source, '(none)') || ' / ' || COALESCE(utm_medium, '(none)') || ' / ' || COALESCE(utm_campaign, '(none)')`,
  utm_content: `COALESCE(utm_content, '(none)')`,
  lang: `COALESCE(lang, '?')`,
  device: `COALESCE(device, '?')`,
  browser: `COALESCE(browser, '?')`,
  country: `COALESCE(country, '?')`,
  referrer: `COALESCE(ref_host, '(direct)')`,
};

const METRICS = `
  count(*)::int                                                   AS sessions,
  count(DISTINCT visitor_id)::int                                 AS visitors,
  COALESCE(sum(pageviews), 0)::int                                AS pageviews,
  count(*) FILTER (WHERE cta_clicks > 0)::int                     AS cta_sessions,
  COALESCE(sum(cta_clicks), 0)::int                               AS cta_clicks,
  COALESCE(round(avg(engaged_ms)), 0)::int                        AS avg_ms,
  COALESCE(round(percentile_cont(0.5) WITHIN GROUP (ORDER BY engaged_ms)), 0)::int AS median_ms,
  count(*) FILTER (WHERE engaged_ms < 10000 AND cta_clicks = 0)::int AS bounces
`;

module.exports = async (req, res) => {
  const ok = authorized(req);
  if (ok === null) return send(res, 503, { error: 'ADMIN_PASSWORD is not set on the server' });
  if (!ok) return send(res, 401, { error: 'Wrong password' });

  const q = req.query || {};
  const tz = ZONES.has(q.tz) ? q.tz : 'Europe/Prague';
  const to = DATE.test(q.to) ? q.to : new Date().toISOString().slice(0, 10);
  const from = DATE.test(q.from) ? q.from : to;

  const RANGE = `started_at >= ($1::date)::timestamp AT TIME ZONE $3
             AND started_at <  (($2::date) + 1)::timestamp AT TIME ZONE $3`;
  const params = [from, to, tz];

  try {
    const totals = await query(
      `SELECT ${METRICS},
         count(*) FILTER (WHERE is_new_visitor)::int AS new_visitors,
         COALESCE(round(avg(max_scroll)), 0)::int AS avg_scroll,
         round(percentile_cont(0.5) WITHIN GROUP (ORDER BY first_cta_ms)
               FILTER (WHERE first_cta_ms IS NOT NULL))::int AS median_first_cta_ms
       FROM sessions WHERE ${RANGE}`,
      params
    );

    const daily = await query(
      `SELECT to_char(started_at AT TIME ZONE $3, 'YYYY-MM-DD') AS day, ${METRICS}
       FROM sessions WHERE ${RANGE} GROUP BY 1 ORDER BY 1`,
      params
    );

    const breakdowns = {};
    for (const [name, expr] of Object.entries(DIMENSIONS)) {
      const r = await query(
        `SELECT ${expr} AS label, ${METRICS}
         FROM sessions WHERE ${RANGE} GROUP BY 1 ORDER BY sessions DESC, label LIMIT 50`,
        params
      );
      breakdowns[name] = r.rows;
    }

    const duration = await query(
      `SELECT
         count(*) FILTER (WHERE engaged_ms < 10000)::int                          AS "0-10 s",
         count(*) FILTER (WHERE engaged_ms >= 10000 AND engaged_ms < 30000)::int  AS "10-30 s",
         count(*) FILTER (WHERE engaged_ms >= 30000 AND engaged_ms < 60000)::int  AS "30-60 s",
         count(*) FILTER (WHERE engaged_ms >= 60000 AND engaged_ms < 180000)::int AS "1-3 min",
         count(*) FILTER (WHERE engaged_ms >= 180000)::int                        AS "3+ min"
       FROM sessions WHERE ${RANGE}`,
      params
    );

    const scroll = await query(
      `SELECT
         count(*) FILTER (WHERE max_scroll < 25)::int                       AS "0-25 %",
         count(*) FILTER (WHERE max_scroll >= 25 AND max_scroll < 50)::int  AS "25-50 %",
         count(*) FILTER (WHERE max_scroll >= 50 AND max_scroll < 75)::int  AS "50-75 %",
         count(*) FILTER (WHERE max_scroll >= 75)::int                      AS "75-100 %"
       FROM sessions WHERE ${RANGE}`,
      params
    );

    const EVENT_RANGE = RANGE.replace(/started_at/g, 'ts');
    const placements = await query(
      `SELECT COALESCE(placement, '?') AS label, count(*)::int AS clicks,
              count(DISTINCT session_id)::int AS sessions,
              COALESCE(round(percentile_cont(0.5) WITHIN GROUP (ORDER BY engaged_ms)), 0)::int AS median_ms
       FROM events WHERE type = 'cta' AND ${EVENT_RANGE} GROUP BY 1 ORDER BY clicks DESC`,
      params
    );

    const other = await query(
      `SELECT type AS label, count(*)::int AS clicks, count(DISTINCT session_id)::int AS sessions
       FROM events WHERE type IN ('map', 'lang', 'form') AND ${EVENT_RANGE} GROUP BY 1 ORDER BY clicks DESC`,
      params
    );

    const recent = await query(
      `SELECT to_char(started_at AT TIME ZONE $3, 'YYYY-MM-DD HH24:MI') AS started,
              lang, device, browser, country, city, COALESCE(ref_host, '(direct)') AS referrer,
              utm_source, utm_medium, utm_campaign, utm_content,
              pageviews, engaged_ms, max_scroll, cta_clicks, first_cta_ms, is_new_visitor
       FROM sessions WHERE ${RANGE} ORDER BY started_at DESC LIMIT 100`,
      params
    );

    const LEAD_RANGE = RANGE.replace(/started_at/g, 'l.ts');
    const leads = await query(
      `SELECT to_char(l.ts AT TIME ZONE $3, 'YYYY-MM-DD HH24:MI') AS sent, l.email, l.lang, l.country, l.status, l.error,
              s.utm_source, s.utm_medium, s.utm_campaign, s.utm_content
       FROM leads l LEFT JOIN sessions s ON s.session_id = l.session_id
       WHERE ${LEAD_RANGE} ORDER BY l.ts DESC LIMIT 200`,
      params
    );

    return send(res, 200, {
      leads: leads.rows,
      range: { from, to, tz },
      totals: totals.rows[0],
      daily: daily.rows,
      breakdowns,
      duration: duration.rows[0],
      scroll: scroll.rows[0],
      placements: placements.rows,
      other: other.rows,
      recent: recent.rows,
    });
  } catch (err) {
    console.error('stats failed:', err.code || '', err.message);
    if (err.code === 'NO_DB') return send(res, 503, { error: 'Database is not connected (DATABASE_URL is missing)' });
    return send(res, 500, { error: 'Database query failed' });
  }
};
