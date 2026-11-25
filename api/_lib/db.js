// Shared database access for the tracking endpoints.
// Needs a Postgres connection string in DATABASE_URL (or POSTGRES_URL).
const { Pool } = require('pg');

let pool;
let ready;

function getPool() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    const err = new Error('DATABASE_URL is not set');
    err.code = 'NO_DB';
    throw err;
  }
  if (!pool) {
    pool = new Pool({ connectionString: url, max: 3, idleTimeoutMillis: 10000 });
  }
  return pool;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS sessions (
  session_id     text PRIMARY KEY,
  visitor_id     text NOT NULL,
  started_at     timestamptz NOT NULL DEFAULT now(),
  last_seen      timestamptz NOT NULL DEFAULT now(),
  is_new_visitor boolean NOT NULL DEFAULT false,
  landing_path   text,
  lang           text,
  referrer       text,
  ref_host       text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_content    text,
  utm_term       text,
  fbclid         boolean NOT NULL DEFAULT false,
  device         text,
  browser        text,
  os             text,
  country        text,
  city           text,
  screen_w       integer,
  pageviews      integer NOT NULL DEFAULT 0,
  engaged_ms     integer NOT NULL DEFAULT 0,
  max_scroll     integer NOT NULL DEFAULT 0,
  cta_clicks     integer NOT NULL DEFAULT 0,
  first_cta_ms   integer
);
CREATE TABLE IF NOT EXISTS events (
  id          bigserial PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  session_id  text NOT NULL,
  visitor_id  text NOT NULL,
  type        text NOT NULL,
  path        text,
  lang        text,
  placement   text,
  engaged_ms  integer,
  scroll      integer
);
CREATE TABLE IF NOT EXISTS leads (
  id          bigserial PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  email       text NOT NULL,
  lang        text,
  session_id  text,
  visitor_id  text,
  ip_hash     text,
  country     text,
  status      text NOT NULL,
  resend_id   text,
  error       text
);
CREATE INDEX IF NOT EXISTS leads_ts_idx ON leads (ts);
CREATE INDEX IF NOT EXISTS sessions_started_at_idx ON sessions (started_at);
CREATE INDEX IF NOT EXISTS events_ts_type_idx ON events (ts, type);
`;

// Creates the tables on first use, once per server instance.
function ensureSchema() {
  if (!ready) {
    ready = getPool().query(SCHEMA).catch((err) => {
      ready = null;
      throw err;
    });
  }
  return ready;
}

async function query(text, params) {
  await ensureSchema();
  return getPool().query(text, params);
}

module.exports = { query };
