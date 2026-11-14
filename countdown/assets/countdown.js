/* countdown: live countdown to the next date of an event (rules mirror build.py), custom countdown with share link */
(function () {
  'use strict';
  var d = document, SYG = window.SYG;
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - dd - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  function nth(y, mo, wd, n) { /* wd 0=Monday */
    if (n > 0) { var first = new Date(y, mo - 1, 1), off = (wd - ((first.getDay() + 6) % 7) + 7) % 7; return new Date(y, mo - 1, 1 + off + 7 * (n - 1)); }
    var last = new Date(y, mo, 0), back = (((last.getDay() + 6) % 7) - wd + 7) % 7; return new Date(y, mo - 1, last.getDate() - back);
  }
  function dateOf(rule, y) {
    if (rule[0] === 'fixed') return new Date(y, rule[1] - 1, rule[2]);
    if (rule[0] === 'nth') return nth(y, rule[1], rule[2], rule[3]);
    if (rule[0] === 'easter') return easter(y);
    if (rule[0] === 'bf') { var t = nth(y, 11, 3, 4); return new Date(y, 10, t.getDate() + 1); }
    return null;
  }
  function nextOf(rule, now) {
    var y = now.getFullYear(), t = dateOf(rule, y);
    var end = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1);
    if (now >= end) t = dateOf(rule, y + 1);
    return t;
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function render(box, target, label) {
    var now = new Date(), diff = target - now, today = now.getFullYear() === target.getFullYear() && now.getMonth() === target.getMonth() && now.getDate() === target.getDate() && !box.hasAttribute('data-timed');
    var fmt = target.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (today) { box.innerHTML = '<p class="cd-done">It is ' + SYG.esc(label) + ' today!</p><p class="cd-date">' + SYG.esc(fmt) + '</p>'; return; }
    if (diff <= 0) { box.innerHTML = '<p class="cd-done">' + SYG.esc(label) + ' has arrived.</p><p class="cd-date">' + SYG.esc(fmt) + '</p>'; return; }
    var s = Math.floor(diff / 1000), days = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), sec = s % 60;
    box.innerHTML = '<div class="cd-grid" role="timer" aria-label="Time left until ' + SYG.esc(label) + '"><div><b>' + days + '</b><span>days</span></div><div><b>' + pad(h) + '</b><span>hours</span></div><div><b>' + pad(m) + '</b><span>minutes</span></div><div><b>' + pad(sec) + '</b><span>seconds</span></div></div>' +
      '<p class="cd-date">' + SYG.esc(fmt) + ' · about ' + (days >= 14 ? Math.round(days / 7) + ' weeks' : days + (days === 1 ? ' day' : ' days')) + ' to go</p>';
  }
  d.querySelectorAll('[data-rule]').forEach(function (box) {
    var rule = JSON.parse(box.getAttribute('data-rule')), label = box.getAttribute('data-label');
    function tick() { render(box, nextOf(rule, new Date()), label); }
    tick(); setInterval(tick, 1000);
  });
  /* live "days left" chips on list pages */
  d.querySelectorAll('[data-left]').forEach(function (el) {
    var t = nextOf(JSON.parse(el.getAttribute('data-left')), new Date()), n = Math.round((new Date(t.getFullYear(), t.getMonth(), t.getDate()) - new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 864e5);
    el.textContent = n === 0 ? 'today' : n + (n === 1 ? ' day' : ' days');
  });
  /* custom countdown */
  var C = d.getElementById('cd-custom');
  if (C) {
    var out = d.getElementById('cd-custom-out'), nm = C.elements.cname, dt = C.elements.cdate, tm = C.elements.ctime, timer = null;
    function show() {
      if (!dt.value) { out.innerHTML = '<p class="hint">Pick a date to start the countdown.</p>'; return; }
      var p = dt.value.split('-'), q = (tm.value || '00:00').split(':'), target = new Date(+p[0], +p[1] - 1, +p[2], +q[0], +q[1]);
      out.setAttribute('data-timed', '1');
      clearInterval(timer); render(out, target, nm.value || 'your date'); timer = setInterval(function () { render(out, target, nm.value || 'your date'); }, 1000);
      var u = location.origin + location.pathname + '?n=' + encodeURIComponent(nm.value) + '&d=' + dt.value + '&t=' + (tm.value || '00:00');
      d.getElementById('cd-link').value = u;
    }
    var qs = new URLSearchParams(location.search);
    if (qs.get('d')) { dt.value = qs.get('d'); nm.value = qs.get('n') || ''; tm.value = qs.get('t') || '00:00'; }
    C.addEventListener('input', show); C.addEventListener('submit', function (e) { e.preventDefault(); show(); });
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-share]'); if (!b) return;
      var u = d.getElementById('cd-link').value; if (!u) return show();
      if (b.getAttribute('data-share') === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent((nm.value || 'Countdown') + ': ' + u), '_blank', 'noopener'); else SYG.copy(u, 'Link copied');
    });
    show();
  }
})();
