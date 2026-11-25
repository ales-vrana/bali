// Receives tracking events from assets/track.js and stores them.
// One row per session in "sessions", one row per event in "events".
const { query } = require('./_lib/db');

const BOT = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|monitor|headless|lighthouse|pingdom|curl|wget|python|node-fetch/i;
const TYPES = new Set(['pv', 'ping', 'leave', 'cta', 'map', 'lang']);

function str(value, max) {
  if (typeof value !== 'string') return null;
  const s = value.trim().slice(0, max || 200);
  return s || null;
}

function int(value, min, max) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

function parseUA(ua) {
  const u = ua || '';
  let device = 'desktop';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(u)) device = 'tablet';
  else if (/mobi|iphone|ipod|android/i.test(u)) device = 'mobile';

  let os = 'other';
  if (/iphone|ipad|ipod/i.test(u)) os = 'iOS';
  else if (/android/i.test(u)) os = 'Android';
  else if (/windows/i.test(u)) os = 'Windows';
  else if (/mac os x/i.test(u)) os = 'macOS';
  else if (/linux/i.test(u)) os = 'Linux';

  let browser = 'other';
  if (/fban|fbav|fb_iab/i.test(u)) browser = 'Facebook app';
  else if (/instagram/i.test(u)) browser = 'Instagram app';
  else if (/edg\//i.test(u)) browser = 'Edge';
  else if (/samsungbrowser/i.test(u)) browser = 'Samsung Internet';
  else if (/firefox|fxios/i.test(u)) browser = 'Firefox';
  else if (/chrome|crios/i.test(u)) browser = 'Chrome';
  else if (/safari/i.test(u)) browser = 'Safari';

  return { device, os, browser };
}

function refHost(referrer, ownHost) {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    if (!host || host === (ownHost || '').replace(/^www\./, '')) return null;
    return host.slice(0, 100);
  } catch (e) {
    return null;
  }
}

function header(req, name) {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end();
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    res.statusCode = 400;
    return res.end();
  }

  const ua = header(req, 'user-agent') || '';
  const type = str(body.t, 10);
  const sid = str(body.sid, 40);
  const vid = str(body.vid, 40);
  if (!TYPES.has(type) || !sid || !vid || BOT.test(ua)) {
    res.statusCode = 204;
    return res.end();
  }

  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const { device, os, browser } = parseUA(ua);
  const referrer = str(body.ref, 300);
  let city = header(req, 'x-vercel-ip-city') || null;
  try { city = city ? decodeURIComponent(city).slice(0, 80) : null; } catch (e) { /* keep raw */ }

  const engaged = int(body.ms, 0, 6 * 60 * 60 * 1000) || 0;
  const scroll = int(body.scroll, 0, 100) || 0;
  const path = str(body.path, 120);
  const lang = str(body.lang, 5);
  const placement = str(body.placement, 30);

  try {
    // Make sure the session row exists. Attribution is fixed by the first event.
    await query(
      `INSERT INTO sessions (session_id, visitor_id, is_new_visitor, landing_path, lang, referrer, ref_host,
         utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid,
         device, browser, os, country, city, screen_w)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (session_id) DO NOTHING`,
      [
        sid, vid, body.isNew === true, str(body.landing, 120) || path, lang, referrer,
        refHost(referrer, header(req, 'host')),
        str(utm.source, 100), str(utm.medium, 100), str(utm.campaign, 150),
        str(utm.content, 150), str(utm.term, 150), body.fbclid === true,
        device, browser, os, str(header(req, 'x-vercel-ip-country'), 2), city,
        int(body.sw, 0, 10000),
      ]
    );

    await query(
      `UPDATE sessions SET
         last_seen   = now(),
         pageviews   = pageviews + $2,
         engaged_ms  = GREATEST(engaged_ms, $3),
         max_scroll  = GREATEST(max_scroll, $4),
         cta_clicks  = cta_clicks + $5,
         first_cta_ms = CASE WHEN $5 = 1 THEN COALESCE(first_cta_ms, $3) ELSE first_cta_ms END
       WHERE session_id = $1`,
      [sid, type === 'pv' ? 1 : 0, engaged, scroll, type === 'cta' ? 1 : 0]
    );

    if (type !== 'ping' && type !== 'leave') {
      await query(
        `INSERT INTO events (session_id, visitor_id, type, path, lang, placement, engaged_ms, scroll)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [sid, vid, type, path, lang, placement, engaged, scroll]
      );
    }
  } catch (err) {
    // Tracking must never break the page. Log and answer quietly.
    console.error('track failed:', err.code || '', err.message);
    res.statusCode = err.code === 'NO_DB' ? 503 : 500;
    return res.end();
  }

  res.statusCode = 204;
  res.setHeader('Cache-Control', 'no-store');
  return res.end();
};
