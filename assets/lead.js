/* "Send me info by email" form: opens the dialog, posts the address to /api/lead. */
(function () {
  'use strict';

  var dialog = document.getElementById('lead-dialog');
  var form = document.getElementById('lead-form');
  if (!dialog || !form) return;

  var input = form.querySelector('input[type=email]');
  var status = document.getElementById('lead-status');
  var submit = form.querySelector('button[type=submit]');
  var submitLabel = submit.textContent;
  var placement = '';

  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function sessionId() {
    try { return (JSON.parse(read('bb_session') || '{}') || {}).id || null; } catch (e) { return null; }
  }
  function say(text, kind) {
    status.textContent = text;
    status.className = 'lead-status' + (kind ? ' ' + kind : '');
  }

  function open(from) {
    placement = from || '';
    say('', '');
    form.hidden = false;
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    input.focus();
    if (typeof window.bbTrack === 'function') window.bbTrack('form', { placement: placement });
  }
  function close() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  document.querySelectorAll('[data-lead-open]').forEach(function (button) {
    button.addEventListener('click', function () { open(button.getAttribute('data-lead-open')); });
  });
  dialog.querySelectorAll('[data-lead-close]').forEach(function (button) {
    button.addEventListener('click', close);
  });
  // A click on the dimmed area around the box closes it.
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) close();
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var email = input.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) {
      say(form.getAttribute('data-msg-invalid'), 'err');
      input.focus();
      return;
    }
    submit.disabled = true;
    submit.textContent = form.getAttribute('data-msg-sending');
    say('', '');

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        lang: document.documentElement.lang || 'en',
        sid: sessionId(),
        vid: read('bb_vid'),
        placement: placement,
        website: form.querySelector('input[name=website]').value
      })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.ok && data.ok) {
          form.hidden = true;
          say(form.getAttribute('data-msg-ok'), 'ok');
          input.value = '';
          if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { language: document.documentElement.lang });
        } else if (data.error === 'invalid') {
          say(form.getAttribute('data-msg-invalid'), 'err');
        } else {
          say(form.getAttribute('data-msg-err'), 'err');
        }
      });
    }).catch(function () {
      say(form.getAttribute('data-msg-err'), 'err');
    }).then(function () {
      submit.disabled = false;
      submit.textContent = submitLabel;
    });
  });
})();
