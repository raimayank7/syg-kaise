/* printables: calendars, planners, trackers and charts drawn in the browser at true paper size, ready to print */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, F = d.getElementById('pr'), host = d.getElementById('pr-sheet'), wrap = d.getElementById('pr-wrap');
  if (!F) return;
  var type = F.getAttribute('data-type'), preset = {};
  try { preset = JSON.parse(F.getAttribute('data-preset') || '{}'); } catch (e) {}
  Object.keys(preset).forEach(function (k) { var e = F.elements[k]; if (e) e.value = preset[k]; });
  var SIZES = { a4: [210, 297], a5: [148, 210], a3: [297, 420], letter: [215.9, 279.4] };
  var EN = { m: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], d: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] };
  var HI = { m: ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्तूबर', 'नवंबर', 'दिसंबर'], d: ['सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार'] };
  var now = new Date();
  function v(id, dflt) { var e = F.elements[id]; return e && e.value !== '' ? e.value : dflt; }
  function n(id, dflt) { var x = parseFloat(v(id, '')); return isFinite(x) && x > 0 ? x : dflt; }
  function esc(s) { return SYG.esc(s); }
  function names() { return v('lang', 'en') === 'hi' ? HI : EN; }
  function dayOrder() { var ws = v('week', 'mon') === 'sun' ? 6 : 0, a = []; for (var i = 0; i < 7; i++) a.push((ws + i) % 7); return a; }
  function short(s, k) { return k === 'hi' ? s : s.slice(0, 3); }
  function daysIn(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function ym() { return { y: Math.round(n('year', now.getFullYear())), m: Math.min(12, Math.max(1, Math.round(n('month', now.getMonth() + 1)))) - 1 }; }

  function monthGrid(y, m, lineH, cls) {
    var first = new Date(y, m, 1), lead = ((first.getDay() + 6) % 7 - (v('week', 'mon') === 'sun' ? 6 : 0) + 7) % 7, tot = daysIn(y, m), rows = Math.ceil((lead + tot) / 7), c = 1, h = '';
    for (var r = 0; r < rows; r++) { h += '<tr' + (lineH ? ' style="height:' + lineH + 'mm"' : '') + '>'; for (var k = 0; k < 7; k++) { var i = r * 7 + k; h += '<td' + (cls ? ' class="' + cls + '"' : '') + '>' + (i >= lead && c <= tot ? '<b>' + (c++) + '</b>' : '') + '</td>'; } h += '</tr>'; }
    return { html: h, rows: rows };
  }
  function head(l, k) { var N = names(), o = dayOrder(), h = '<tr>'; o.forEach(function (i) { h += '<th>' + esc(k ? short(N.d[i], l) : N.d[i]) + '</th>'; }); return h + '</tr>'; }
  function title(t, sub) { return '<div class="ttl"><h2>' + esc(t) + '</h2>' + (sub ? '<span>' + esc(sub) + '</span>' : '') + '</div>'; }
  function box(x) { return '<span class="bx"></span>' + x; }

  var B = {
    monthly: function (W, H) {
      var o = ym(), N = names(), notes = v('notes', 'yes') === 'yes', g = monthGrid(o.y, o.m, 0), avail = H - 22 - (notes ? 42 : 0) - 8, rh = Math.floor((avail) / g.rows * 10) / 10;
      g = monthGrid(o.y, o.m, rh);
      return title(v('title', '') || N.m[o.m] + ' ' + o.y, '') + '<table class="cal">' + head(v('lang', 'en')) + g.html + '</table>' + (notes ? '<div class="notes" style="height:34mm"><b>' + (v('lang', 'en') === 'hi' ? 'टिप्पणियाँ' : 'Notes') + '</b></div>' : '');
    },
    yearly: function (W, H) {
      var y = Math.round(n('year', now.getFullYear())), N = names(), land = W > H, cols = land ? 4 : 3, rows = land ? 3 : 4, h = '';
      for (var m = 0; m < 12; m++) {
        var g = monthGrid(y, m, 0, 'mini'), o = dayOrder(), hh = '<tr>' + o.map(function (i) { return '<th>' + esc(v('lang', 'en') === 'hi' ? N.d[i].slice(0, 2) : N.d[i].slice(0, 1)) + '</th>'; }).join('') + '</tr>';
        h += '<div class="mini-m"><h3>' + esc(N.m[m]) + '</h3><table class="cal mini">' + hh + g.html + '</table></div>';
      }
      return title(v('title', '') || String(y), '') + '<div class="yg" style="grid-template-columns:repeat(' + cols + ',1fr);grid-template-rows:repeat(' + rows + ',auto)">' + h + '</div>';
    },
    weekly: function (W, H) {
      var N = names(), st = v('start', ''), s = st ? new Date(st + 'T00:00') : new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7)), h = '', i, dd;
      var bh = Math.floor((H - 22 - 40) / 4 * 10) / 10;
      for (i = 0; i < 7; i++) { dd = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i); h += '<div class="day" style="height:' + (i > 4 ? bh / 2 : bh) + 'mm"><b>' + esc(N.d[dd.getDay() === 0 ? 6 : dd.getDay() - 1]) + '</b> <span>' + dd.getDate() + ' ' + esc(N.m[dd.getMonth()]) + '</span></div>'; }
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'साप्ताहिक योजना' : 'Weekly planner'), '') + '<div class="wk"><div class="wk-l">' + h + '</div><div class="wk-r"><div class="notes" style="height:40%"><b>' + (v('lang', 'en') === 'hi' ? 'मुख्य काम' : 'Top priorities') + '</b></div><div class="notes" style="height:30%"><b>' + (v('lang', 'en') === 'hi' ? 'टिप्पणियाँ' : 'Notes') + '</b></div></div></div>';
    },
    daily: function (W, H) {
      var a = Math.round(n('from', 6)), b = Math.round(n('to', 22)), hrs = Math.max(1, b - a + 1), rh = Math.floor((H - 38) / hrs * 10) / 10, rows = '', i;
      for (i = a; i <= b; i++) rows += '<tr style="height:' + rh + 'mm"><th>' + (i % 12 || 12) + (i < 12 ? ' am' : ' pm') + '</th><td></td></tr>';
      var dt = v('date', ''), dd = dt ? new Date(dt + 'T00:00') : null, N = names();
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'दैनिक योजना' : 'Daily planner'), dd ? N.d[dd.getDay() === 0 ? 6 : dd.getDay() - 1] + ', ' + dd.getDate() + ' ' + N.m[dd.getMonth()] + ' ' + dd.getFullYear() : (v('lang', 'en') === 'hi' ? 'दिनांक: ______' : 'Date: ____________')) +
        '<div class="dl"><table class="sched">' + rows + '</table><div class="dl-r"><div class="notes" style="height:48%"><b>' + (v('lang', 'en') === 'hi' ? 'मुख्य काम' : 'Priorities') + '</b></div><div class="notes" style="height:48%"><b>' + (v('lang', 'en') === 'hi' ? 'टिप्पणियाँ' : 'Notes') + '</b></div></div></div>';
    },
    habit: function (W, H) {
      var o = ym(), N = names(), days = daysIn(o.y, o.m), rows = Math.round(n('rows', 10)), rh = Math.floor((H - 40) / (rows + 1) * 10) / 10, h = '<tr><th class="hb">' + (v('lang', 'en') === 'hi' ? 'आदत' : 'Habit') + '</th>', i, r;
      for (i = 1; i <= days; i++) h += '<th class="dn">' + i + '</th>'; h += '</tr>';
      for (r = 0; r < rows; r++) { h += '<tr style="height:' + rh + 'mm"><td class="hb"></td>'; for (i = 1; i <= days; i++) h += '<td><i class="ci"></i></td>'; h += '</tr>'; }
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'आदत ट्रैकर' : 'Habit tracker'), N.m[o.m] + ' ' + o.y) + '<table class="trk">' + h + '</table>';
    },
    timetable: function (W, H) {
      var days = Math.round(n('days', 6)), per = Math.round(n('periods', 8)), N = names(), rh = Math.floor((H - 40) / (per + 1) * 10) / 10, h = '<tr><th>' + (v('lang', 'en') === 'hi' ? 'कालांश' : 'Period') + '</th>', i, r;
      for (i = 0; i < days; i++) h += '<th>' + esc(N.d[i]) + '</th>'; h += '</tr>';
      for (r = 1; r <= per; r++) { h += '<tr style="height:' + rh + 'mm"><th>' + r + '</th>'; for (i = 0; i < days; i++) h += '<td></td>'; h += '</tr>'; }
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'समय सारणी' : 'Class timetable'), (v('lang', 'en') === 'hi' ? 'नाम: ________ कक्षा: ____' : 'Name: ____________ Class: ______')) + '<table class="trk tt">' + h + '</table>';
    },
    chore: function (W, H) {
      var ppl = v('people', 'Aarav, Diya, Mom, Dad').split(',').map(function (x) { return x.trim(); }).filter(Boolean), N = names(), o = dayOrder(), rh = Math.floor((H - 40) / (ppl.length + 1) * 10) / 10, h = '<tr><th></th>' + o.map(function (i) { return '<th>' + esc(short(N.d[i], v('lang', 'en'))) + '</th>'; }).join('') + '</tr>';
      ppl.forEach(function (p) { h += '<tr style="height:' + Math.min(rh, 40) + 'mm"><th>' + esc(p) + '</th>' + o.map(function () { return '<td></td>'; }).join('') + '</tr>'; });
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'घर के काम का चार्ट' : 'Chore chart'), v('lang', 'en') === 'hi' ? 'सप्ताह: ____' : 'Week of: ____________') + '<table class="trk">' + h + '</table>';
    },
    meal: function (W, H) {
      var N = names(), meals = v('lang', 'en') === 'hi' ? ['नाश्ता', 'दोपहर का खाना', 'शाम का नाश्ता', 'रात का खाना'] : ['Breakfast', 'Lunch', 'Snack', 'Dinner'], o = dayOrder(), rh = Math.floor((H - 40) / 8 * 10) / 10, h = '<tr><th></th>' + meals.map(function (m) { return '<th>' + m + '</th>'; }).join('') + '</tr>';
      o.forEach(function (i) { h += '<tr style="height:' + rh + 'mm"><th>' + esc(short(N.d[i], v('lang', 'en'))) + '</th>' + meals.map(function () { return '<td></td>'; }).join('') + '</tr>'; });
      return title(v('title', '') || (v('lang', 'en') === 'hi' ? 'साप्ताहिक भोजन योजना' : 'Weekly meal planner'), '') + '<div class="ml"><table class="trk">' + h + '</table><div class="notes ml-r"><b>' + (v('lang', 'en') === 'hi' ? 'खरीदारी की सूची' : 'Shopping list') + '</b></div></div>';
    },
    budget: function (W, H) {
      var rows = Math.round(n('rows', 12)), cur = v('cur', '₹'), rh = Math.floor((H - 60) / (rows * 2 + 4) * 10) / 10;
      function sec(t) { var h = '<table class="trk bg"><tr><th>' + t + '</th><th>Planned (' + esc(cur) + ')</th><th>Actual (' + esc(cur) + ')</th></tr>', i; for (i = 0; i < rows; i++) h += '<tr style="height:' + rh + 'mm"><td></td><td></td><td></td></tr>'; return h + '<tr class="tot"><th>Total</th><td></td><td></td></tr></table>'; }
      return title(v('title', '') || 'Monthly budget', 'Month: ____________') + sec('Income') + sec('Expenses') + '<div class="notes" style="height:20mm"><b>Balance (income minus expenses)</b></div>';
    },
    todo: function (W, H) {
      var rows = Math.round(n('rows', 20)), rh = Math.floor((H - 40) / rows * 10) / 10, h = '<tr><th class="cb"></th><th>Task</th><th class="pr">Priority</th><th class="pr">Due</th></tr>', i;
      for (i = 0; i < rows; i++) h += '<tr style="height:' + rh + 'mm"><td class="cb"><i class="sq"></i></td><td></td><td></td><td></td></tr>';
      return title(v('title', '') || 'To-do list', 'Date: ____________') + '<table class="trk">' + h + '</table>';
    },
    attendance: function (W, H) {
      var o = ym(), N = names(), days = daysIn(o.y, o.m), rows = Math.round(n('rows', 30)), rh = Math.floor((H - 48) / (rows + 1) * 10) / 10, h = '<tr><th class="no">No.</th><th class="hb">Name</th>', i, r;
      for (i = 1; i <= days; i++) h += '<th class="dn">' + i + '</th>'; h += '</tr>';
      for (r = 1; r <= rows; r++) { h += '<tr style="height:' + rh + 'mm"><td class="no">' + r + '</td><td class="hb"></td>'; for (i = 1; i <= days; i++) h += '<td></td>'; h += '</tr>'; }
      return title(v('title', '') || 'Attendance sheet', N.m[o.m] + ' ' + o.y + '  ·  Class: ______  Teacher: __________') + '<table class="trk att">' + h + '</table>';
    },
    reading: function (W, H) {
      var rows = Math.round(n('rows', 20)), rh = Math.floor((H - 40) / (rows + 1) * 10) / 10, h = '<tr><th class="no">#</th><th>Title</th><th>Author</th><th class="pr">Started</th><th class="pr">Finished</th><th class="pr">Rating</th></tr>', i;
      for (i = 1; i <= rows; i++) h += '<tr style="height:' + rh + 'mm"><td class="no">' + i + '</td><td></td><td></td><td></td><td></td><td class="st">☆ ☆ ☆ ☆ ☆</td></tr>';
      return title(v('title', '') || 'Reading log', 'Name: ____________') + '<table class="trk">' + h + '</table>';
    }
  };

  function build() {
    var s = SIZES[v('size', 'a4')] || SIZES.a4, land = v('orient', 'portrait') === 'landscape', W = land ? s[1] : s[0], H = land ? s[0] : s[1], m = n('margin', 10), col = v('color', '#2f7d6d');
    var iw = W - 2 * m, ih = H - 2 * m, html = B[type](iw, ih);
    host.innerHTML = '<div class="sheet" style="width:' + W + 'mm;height:' + H + 'mm;padding:' + m + 'mm;--ac:' + col + '"><div class="inner" style="width:' + iw + 'mm;height:' + ih + 'mm">' + html + '</div></div>';
    var px = W * 3.7795, avail = wrap.clientWidth - 24, sc = Math.min(1, avail / px);
    host.style.transform = 'scale(' + sc + ')'; host.style.transformOrigin = 'top left'; wrap.style.height = Math.ceil(H * 3.7795 * sc + 24) + 'px'; host.style.width = W + 'mm';
    host.setAttribute('data-scale', sc);
    var st = d.getElementById('pr-page') || d.head.appendChild(Object.assign(d.createElement('style'), { id: 'pr-page' }));
    st.textContent = '@page{size:' + W + 'mm ' + H + 'mm;margin:0}';
    d.getElementById('pr-info').textContent = v('size', 'a4').toUpperCase() + ' ' + (land ? 'landscape' : 'portrait') + ', ' + (Math.round(W * 10) / 10) + ' × ' + (Math.round(H * 10) / 10) + ' mm';
  }
  /* defaults the page script fills (current month and year) */
  var f = F.elements; if (f.year && !f.year.value) f.year.value = now.getFullYear(); if (f.month && !f.month.value) f.month.value = now.getMonth() + 1;
  F.addEventListener('input', build); window.addEventListener('resize', build);
  F.addEventListener('submit', function (e) { e.preventDefault(); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act="print"]'); if (!b) return;
    d.body.classList.add('pl'); window.print(); setTimeout(function () { d.body.classList.remove('pl'); }, 600);
  });
  build();
  if (location.search.indexOf('printtest') > -1) d.body.classList.add('pl');
})();
