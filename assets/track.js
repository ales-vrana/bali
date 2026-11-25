/* First-party visit tracking for balibeach.cloud.
   Sends page views, engaged time, scroll depth and button clicks to /api/track.
   Open any page with ?notrack=1 to exclude this browser (your own visits),
   and with ?notrack=0 to include it again. */
(function () {
  'use strict';

  var ENDPOINT = '/api/track';
  var SESSION_TIMEOUT = 30 * 60 * 1000;
  var PING_EVERY = 15000;

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { /* private mode */ } }
  };

  var params = new URLSearchParams(window.location.search);
  if (params.get('notrack') === '1') store.set('bb_notrack', '1');
  if (params.get('notrack') === '0') store.del('bb_notrack');
  if (store.get('bb_notrack') === '1') return;

  function id() {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
    return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
  }

  // Visitor: one id per browser.
  var isNew = false;
  var vid = store.get('bb_vid');
  if (!vid) { vid = id(); isNew = true; store.set('bb_vid', vid); }

  var visibleSince = document.visibilityState === 'visible' ? Date.now() : null;

  // Session: continues across pages until 30 minutes of inactivity.
  var now = Date.now();
  var session = null;
  try { session = JSON.parse(store.get('bb_session') || 'null'); } catch (e) { session = null; }

  var utm = {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    content: params.get('utm_content'),
    term: params.get('utm_term')
  };
  var hasUtm = !!(utm.source || utm.medium || utm.campaign || utm.content || utm.term);
  var hasFbclid = params.has('fbclid');

  // A new campaign link always starts a new session, so each ad click is counted.
  if (!session || now - session.last > SESSION_TIMEOUT || hasUtm) {
    session = {
      id: id(),
      last: now,
      ms: 0,
      scroll: 0,
      isNew: isNew,
      landing: window.location.pathname,
      ref: document.referrer || '',
      utm: utm,
      fbclid: hasFbclid
    };
  }

  function save() {
    // Fold the visible time so far into the stored total, so it survives a page change.
    if (typeof visibleSince === 'number') { session.ms += Date.now() - visibleSince; visibleSince = Date.now(); }
    session.last = Date.now();
    store.set('bb_session', JSON.stringify(session));
  }
  save();

  // Engaged time: counted only while the tab is visible.
  function engaged() {
    return session.ms + (visibleSince ? Date.now() - visibleSince : 0);
  }
  function settle() {
    if (visibleSince) { session.ms += Date.now() - visibleSince; visibleSince = null; }
  }

  function readScroll() {
    var doc = document.documentElement;
    var total = Math.max(doc.scrollHeight, document.body ? document.body.scrollHeight : 0);
    if (!total) return;
    var pct = Math.round(((window.scrollY || doc.scrollTop || 0) + window.innerHeight) / total * 100);
    if (pct > session.scroll) session.scroll = Math.min(100, pct);
  }

  function send(type, extra) {
    var payload = {
      t: type,
      sid: session.id,
      vid: vid,
      isNew: session.isNew,
      path: window.location.pathname,
      landing: session.landing,
      lang: document.documentElement.lang || '',
      ref: session.ref,
      utm: session.utm,
      fbclid: session.fbclid,
      sw: window.screen ? window.screen.width : null,
      ms: engaged(),
      scroll: session.scroll
    };
    if (extra) { for (var k in extra) payload[k] = extra[k]; }
    var body = JSON.stringify(payload);
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))) return;
    } catch (e) { /* fall through to fetch */ }
    try {
      fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true });
    } catch (e) { /* nothing else to try */ }
  }

  readScroll();
  send('pv');

  var lastPing = '';
  function ping(type) {
    readScroll();
    var mark = Math.round(engaged() / 1000) + ':' + session.scroll;
    if (type === 'ping' && mark === lastPing) return;
    lastPing = mark;
    save();
    send(type);
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  window.setInterval(function () {
    if (document.visibilityState === 'visible') ping('ping');
  }, PING_EVERY);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      settle();
      ping('leave');
    } else {
      visibleSince = Date.now();
    }
  });
  window.addEventListener('pagehide', function () {
    settle();
    ping('leave');
  });

  // Clicks: WhatsApp buttons, the map link and the language switcher.
  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a') : null;
    if (!link) return;
    readScroll();
    if (link.hasAttribute('data-wa')) {
      send('cta', { placement: link.getAttribute('data-wa') });
    } else if (link.classList.contains('map')) {
      send('map', { placement: 'final' });
    } else if (link.parentElement && link.parentElement.classList.contains('lang')) {
      send('lang', { placement: link.getAttribute('hreflang') || '' });
    }
    save();
  });
})();
