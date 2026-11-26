// Handles the "send me info by email" form.
// Stores the address as a lead and sends the info email through Resend.
//
// Environment variables:
//   RESEND_API_KEY   required, API key from resend.com
//   EMAIL_FROM       optional, default "Aleš Vrána <ales@coachville.eu>"
//   EMAIL_REPLY_TO   optional, only needed if replies should go somewhere other than the sender
const crypto = require('crypto');
const { query } = require('./_lib/db');

const RESEND_URL = (process.env.RESEND_API_BASE || 'https://api.resend.com') + '/emails';
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;
const WHATSAPP = 'https://wa.me/420604276271';
const WHATSAPP_DISPLAY = '+420 604 276 271';

const MAX_PER_IP_PER_HOUR = 5;
const MAX_PER_DAY = 150; // stays inside the day-one sending limit of a new domain

const MAIL = {
  en: {
    subject: 'Bali Beach land for sale 400 m² - details here',
    link: 'https://www.balibeach.cloud',
    hello: 'Hello,',
    intro: 'here is the link with the offer:',
    questions: 'If you have any questions, feel free to contact us.',
    owners: 'direct owners',
  },
  id: {
    subject: 'Dijual tanah 400 m² di Pantai Jumpai, Bali - detail di sini',
    link: 'https://www.balibeach.cloud/id/',
    hello: 'Halo,',
    intro: 'berikut tautan penawarannya:',
    questions: 'Jika ada pertanyaan, silakan hubungi kami.',
    owners: 'pemilik langsung',
  },
};

function buildMail(lang) {
  const m = MAIL[lang] || MAIL.en;
  const tracked = m.link + (m.link.endsWith('/') ? '' : '/') + '?utm_source=email&utm_medium=info-request';
  const text = [
    m.hello, '',
    m.intro, m.link, '',
    m.questions,
    'WhatsApp: ' + WHATSAPP_DISPLAY + ' (' + WHATSAPP + ')', '',
    'Aleš Vrána & Meira Dewi',
    m.owners,
  ].join('\n');
  const html =
    '<div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #10201F">' +
    '<p>' + m.hello + '</p>' +
    '<p>' + m.intro + '<br><a href="' + tracked + '" style="color: #0F3B3A">' + m.link + '</a></p>' +
    '<p>' + m.questions + '<br>WhatsApp: <a href="' + WHATSAPP + '" style="color: #0F3B3A">' + WHATSAPP_DISPLAY + '</a></p>' +
    '<p>Aleš Vrána &amp; Meira Dewi<br>' + m.owners + '</p>' +
    '</div>';
  return { subject: m.subject, text, html };
}

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

function header(req, name) {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v;
}

function clean(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) || null : null;
}

// The database is used for the lead list and for rate limiting.
// If it is unavailable the email is still sent, so the visitor is not left waiting.
async function db(text, params) {
  try {
    return await query(text, params);
  } catch (err) {
    console.error('lead db:', err.code || '', err.message);
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { ok: false });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') return send(res, 400, { ok: false, error: 'invalid' });

  // Honeypot: real visitors never fill this hidden field.
  if (body.website) return send(res, 200, { ok: true });

  const email = (clean(body.email, 254) || '').toLowerCase();
  if (!EMAIL_RE.test(email)) return send(res, 400, { ok: false, error: 'invalid' });

  const lang = body.lang === 'id' ? 'id' : 'en';
  const sid = clean(body.sid, 40);
  const vid = clean(body.vid, 40);
  const ip = (header(req, 'x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const ipHash = crypto.createHash('sha256').update(ip + '|' + (process.env.ADMIN_PASSWORD || 'bali')).digest('hex').slice(0, 32);
  const country = clean(header(req, 'x-vercel-ip-country'), 2);

  const limits = await db(
    `SELECT
       count(*) FILTER (WHERE ip_hash = $1 AND ts > now() - interval '1 hour')::int AS by_ip,
       count(*) FILTER (WHERE ts > now() - interval '1 day' AND status = 'sent')::int AS by_day,
       count(*) FILTER (WHERE email = $2 AND ts > now() - interval '1 day' AND status = 'sent')::int AS by_email
     FROM leads`,
    [ipHash, email]
  );
  if (limits && limits.rows[0]) {
    const l = limits.rows[0];
    // Already sent to this address today: answer as success, do not send twice.
    if (l.by_email > 0) return send(res, 200, { ok: true, repeat: true });
    if (l.by_ip >= MAX_PER_IP_PER_HOUR || l.by_day >= MAX_PER_DAY) return send(res, 429, { ok: false, error: 'rate' });
  }

  async function record(status, resendId, error) {
    await db(
      `INSERT INTO leads (email, lang, session_id, visitor_id, ip_hash, country, status, resend_id, error)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [email, lang, sid, vid, ipHash, country, status, resendId || null, error || null]
    );
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    await record('not_configured', null, 'RESEND_API_KEY is not set');
    return send(res, 503, { ok: false, error: 'config' });
  }

  const mail = buildMail(lang);
  const payload = {
    from: process.env.EMAIL_FROM || 'Aleš Vrána <ales@coachville.eu>',
    to: [email],
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  };
  if (process.env.EMAIL_REPLY_TO) payload.reply_to = process.env.EMAIL_REPLY_TO;

  const day = new Date().toISOString().slice(0, 10);
  const idem = 'info-request/' + crypto.createHash('sha256').update(email + '|' + lang + '|' + day).digest('hex').slice(0, 40);

  try {
    const r = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json',
        'Idempotency-Key': idem,
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const message = (data && (data.message || data.name)) || ('HTTP ' + r.status);
      console.error('resend failed:', r.status, message);
      await record('failed', null, String(message).slice(0, 300));
      return send(res, 502, { ok: false, error: 'send' });
    }
    await record('sent', data.id);
    return send(res, 200, { ok: true });
  } catch (err) {
    console.error('resend error:', err.message);
    await record('failed', null, String(err.message).slice(0, 300));
    return send(res, 502, { ok: false, error: 'send' });
  }
};
