/* paper: draws printable paper (graph, lined, dot grid, isometric, hexagon, music staff, Cornell, handwriting, calligraphy) as SVG in real millimetres */
(function () {
  'use strict';
  var d = document, SYG = window.SYG, F = d.getElementById('pp');
  if (!F) return;
  var type = F.getAttribute('data-type'), box = d.getElementById('pp-sheet'), preset = {};
  try { preset = JSON.parse(F.getAttribute('data-preset') || '{}'); } catch (e) {}
  var SIZES = { a4: [210, 297], a5: [148, 210], a3: [297, 420], a6: [105, 148], letter: [215.9, 279.4], legal: [215.9, 355.6], b5: [176, 250] };
  Object.keys(preset).forEach(function (k) { var e = F.elements[k]; if (e) e.value = preset[k]; });
  function num(id, dflt) { var e = F.elements[id], v = e ? parseFloat(e.value) : NaN; return isFinite(v) && v > 0 ? v : dflt; }
  function val(id) { return F.elements[id] ? F.elements[id].value : ''; }
  var COL = { grey: '#9aa0a6', blue: '#5b8def', green: '#5fa96b', black: '#222', red: '#e06a6a', light: '#c9cdd2' };
  function line(x1, y1, x2, y2, c, w, extra) { return '<line x1="' + r(x1) + '" y1="' + r(y1) + '" x2="' + r(x2) + '" y2="' + r(y2) + '" stroke="' + c + '" stroke-width="' + w + '"' + (extra || '') + '/>'; }
  function r(n) { return Math.round(n * 1000) / 1000; }

  function build() {
    var s = SIZES[val('size')] || SIZES.a4, land = val('orient') === 'landscape', W = land ? s[1] : s[0], H = land ? s[0] : s[1];
    var m = num('margin', 10), sp = num('space', 5), c = COL[val('color')] || COL.grey, w = num('weight', 0.2), big = Math.round(num('major', 5));
    var x0 = m, y0 = m, x1 = W - m, y1 = H - m, g = '', i, n;
    if (type === 'graph') {
      var nx = Math.floor((x1 - x0) / sp + 1e-6), ny = Math.floor((y1 - y0) / sp + 1e-6), xe = x0 + nx * sp, ye = y0 + ny * sp;
      for (i = 0; i <= nx; i++) g += line(x0 + i * sp, y0, x0 + i * sp, ye, c, big && i % big === 0 ? w * 2.2 : w);
      for (i = 0; i <= ny; i++) g += line(x0, y0 + i * sp, xe, y0 + i * sp, c, big && i % big === 0 ? w * 2.2 : w);
    } else if (type === 'lined') {
      n = Math.floor((y1 - y0 - num('header', 0)) / sp);
      for (i = 0; i <= n; i++) g += line(x0, y1 - i * sp, x1, y1 - i * sp, c, w);
      if (val('marginline') === 'yes') g += line(x0 + 25, y0, x0 + 25, y1, COL.red, w * 1.2);
    } else if (type === 'dots') {
      var ds = num('dot', 0.5);
      for (var yy = y0; yy <= y1 + 1e-6; yy += sp) for (var xx = x0; xx <= x1 + 1e-6; xx += sp) g += '<circle cx="' + r(xx) + '" cy="' + r(yy) + '" r="' + ds + '" fill="' + c + '"/>';
    } else if (type === 'iso') {
      var h = sp * Math.sqrt(3) / 2, k;
      for (k = 0; x0 + k * sp <= x1 + 1e-6; k++) g += line(x0 + k * sp, y0, x0 + k * sp, y1, c, w);
      /* two families of 30 degree lines, clipped to the page box */
      var t = Math.tan(Math.PI / 6), span = (y1 - y0) / t;
      for (k = -Math.ceil(span / sp) - 1; k <= Math.ceil((x1 - x0) / sp) + 1; k++) {
        g += '<line x1="' + r(x0 + k * sp) + '" y1="' + y1 + '" x2="' + r(x0 + k * sp + span) + '" y2="' + y0 + '" stroke="' + c + '" stroke-width="' + w + '"/>';
        g += '<line x1="' + r(x0 + k * sp) + '" y1="' + y0 + '" x2="' + r(x0 + k * sp + span) + '" y2="' + y1 + '" stroke="' + c + '" stroke-width="' + w + '"/>';
      }
      g = '<g clip-path="url(#cp)">' + g + '</g><clipPath id="cp"><rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '"/></clipPath>';
      void h;
    } else if (type === 'hex') {
      var R = sp, hw = R * Math.sqrt(3), rowH = R * 1.5, row = 0, p, cx, cy, pts;
      g = '<g clip-path="url(#cp)">';
      for (cy = y0; cy <= y1 + R; cy += rowH, row++) for (cx = x0 + (row % 2 ? hw / 2 : 0); cx <= x1 + hw; cx += hw) {
        pts = [];
        for (p = 0; p < 6; p++) { var a = Math.PI / 180 * (60 * p - 30); pts.push(r(cx + R * Math.cos(a)) + ',' + r(cy + R * Math.sin(a))); }
        g += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="' + c + '" stroke-width="' + w + '"/>';
      }
      g += '</g><clipPath id="cp"><rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '"/></clipPath>';
    } else if (type === 'music') {
      var gap = num('gap', 2), stave = gap * 4, between = num('between', 14), cy2 = y0 + 4, j;
      while (cy2 + stave <= y1 + 1e-6) {
        for (j = 0; j < 5; j++) g += line(x0, cy2 + j * gap, x1, cy2 + j * gap, c, w);
        g += line(x0, cy2, x0, cy2 + stave, c, w * 1.5) + line(x1, cy2, x1, cy2 + stave, c, w * 1.5);
        cy2 += stave + between;
      }
    } else if (type === 'cornell') {
      var cue = num('cue', 63.5), sum = num('summary', 50), body = y1 - sum, top = y0 + 18;
      g += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '" fill="none" stroke="' + COL.black + '" stroke-width="0.3"/>';
      g += line(x0, top, x1, top, COL.black, 0.3) + line(x0 + cue, top, x0 + cue, body, COL.black, 0.3) + line(x0, body, x1, body, COL.black, 0.3);
      for (i = 1; top + i * sp < body; i++) g += line(x0 + cue, top + i * sp, x1, top + i * sp, c, w);
      g += '<text x="' + (x0 + 2) + '" y="' + (y0 + 7) + '" font-size="4" fill="#555">Topic:</text><text x="' + (x1 - 50) + '" y="' + (y0 + 7) + '" font-size="4" fill="#555">Date:</text>';
      g += '<text x="' + (x0 + 2) + '" y="' + (top + 6) + '" font-size="3.6" fill="#777">Cues / questions</text><text x="' + (x0 + cue + 2) + '" y="' + (top + 4.5) + '" font-size="3.6" fill="#777">Notes</text><text x="' + (x0 + 2) + '" y="' + (body + 6) + '" font-size="3.6" fill="#777">Summary</text>';
    } else if (type === 'hand') {
      var x = num('xheight', 6), blk = x * 3.4, yy2 = y0 + 4;
      while (yy2 + blk <= y1 + 1e-6) {
        g += line(x0, yy2, x1, yy2, c, w) + line(x0, yy2 + x, x1, yy2 + x, c, w, ' stroke-dasharray="2 1.5"') + line(x0, yy2 + 2 * x, x1, yy2 + 2 * x, COL.blue, w * 1.5) + line(x0, yy2 + 2.9 * x, x1, yy2 + 2.9 * x, c, w);
        yy2 += blk + num('between', 6);
      }
    } else if (type === 'callig') {
      var ang = num('angle', 55) * Math.PI / 180, nib = num('nib', 3), line0 = y0 + 4, tt = Math.tan(Math.PI / 2 - ang), cr = nib * 7, gp = num('between', 8);
      g = '<g clip-path="url(#cp)">';
      for (var yy3 = line0; yy3 < y1; yy3 += cr + gp) {
        for (i = 0; i <= 8; i++) g += line(x0, yy3 + i * nib, x1, yy3 + i * nib, i % 8 === 0 || i === 4 ? c : COL.light, i === 4 ? w * 1.4 : w);
      }
      for (var xs = x0 - (y1 - y0) * tt; xs <= x1; xs += num('slant', 12)) g += '<line x1="' + r(xs) + '" y1="' + y1 + '" x2="' + r(xs + (y1 - y0) * tt) + '" y2="' + y0 + '" stroke="' + COL.light + '" stroke-width="' + w + '"/>';
      g += '</g><clipPath id="cp"><rect x="' + x0 + '" y="' + y0 + '" width="' + (x1 - x0) + '" height="' + (y1 - y0) + '"/></clipPath>';
    }
    var label = val('size').toUpperCase() + ' ' + (land ? 'landscape' : 'portrait') + ', ' + r(W) + ' × ' + r(H) + ' mm';
    box.setAttribute('data-w', W); box.setAttribute('data-h', H);
    box.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + 'mm" height="' + H + 'mm" role="img" aria-label="Preview of the paper: ' + label + '"><rect width="' + W + '" height="' + H + '" fill="#fff"/>' + g + '</svg>';
    d.getElementById('pp-info').textContent = label + (type === 'graph' ? '; ' + Math.floor((x1 - x0) / sp) + ' × ' + Math.floor((y1 - y0) / sp) + ' squares' : '');
    var st = d.getElementById('pp-page') || d.head.appendChild(Object.assign(d.createElement('style'), { id: 'pp-page' }));
    st.textContent = '@page{size:' + W + 'mm ' + H + 'mm;margin:0}';
  }
  F.addEventListener('input', build);
  F.addEventListener('submit', function (e) { e.preventDefault(); });
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    if (b.getAttribute('data-act') === 'print') { d.body.classList.add('pl'); window.print(); setTimeout(function () { d.body.classList.remove('pl'); }, 600); }
    else {
      var blob = new Blob([box.innerHTML], { type: 'image/svg+xml' }), a = d.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = type + '-paper-' + val('size') + '.svg'; d.body.appendChild(a); a.click(); a.remove();
    }
  });
  build();
  if (location.search.indexOf('printtest') > -1) d.body.classList.add('pl');
})();
