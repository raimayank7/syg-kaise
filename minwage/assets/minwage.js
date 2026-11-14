window.MW={"agriculture": {"name": "Agriculture", "cols": ["Area A", "Area B", "Area C"], "cats": {"Unskilled": [537, 491, 486], "Semi-skilled / unskilled supervisory": [587, 539, 496], "Skilled / clerical": [637, 587, 538], "Highly skilled": [705, 655, 587]}, "parts": {"Unskilled": [[333, 204], [303, 188], [300, 186]], "Semi-skilled / unskilled supervisory": [[364, 223], [335, 204], [307, 189]], "Skilled / clerical": [[395, 242], [364, 223], [334, 204]], "Highly skilled": [[438, 267], [407, 248], [364, 223]]}}, "construction": {"name": "Construction or maintenance of roads or runways, or building operations (including laying underground cables and pipe lines)", "cols": ["Area A", "Area B", "Area C"], "cats": {"Unskilled": [840, 704, 565], "Semi-skilled / unskilled supervisory": [933, 794, 661], "Skilled / clerical": [1024, 933, 794], "Highly skilled": [1111, 1024, 933]}, "parts": {"Unskilled": [[523, 317], [437, 267], [350, 215]], "Semi-skilled / unskilled supervisory": [[579, 354], [494, 300], [410, 251]], "Skilled / clerical": [[637, 387], [579, 354], [494, 300]], "Highly skilled": [[693, 418], [637, 387], [579, 354]]}}, "mines": {"name": "Mines listed in the order (gypsum, bauxite, iron ore, granite, marble and others)", "cols": ["Work above ground", "Work below ground"], "cats": {"Unskilled": [565, 704], "Semi-skilled / unskilled supervisory": [704, 840], "Skilled / clerical": [840, 979], "Highly skilled": [979, 1095]}, "parts": {"Unskilled": [[350, 215], [437, 267]], "Semi-skilled / unskilled supervisory": [[437, 267], [523, 317]], "Skilled / clerical": [[523, 317], [610, 369]], "Highly skilled": [[610, 369], [683, 412]]}}, "sweeping": {"name": "Sweeping and cleaning (excluding activities prohibited under the Employment of Manual Scavengers Act, 1993)", "cols": ["Area A", "Area B", "Area C"], "cats": {"All workers (one rate in the order)": [840, 704, 565]}, "parts": {"All workers (one rate in the order)": [[523, 317], [437, 267], [350, 215]]}}, "loading": {"name": "Loading and unloading (goods sheds, parcel offices of railways, godowns and warehouses, docks and ports, airports)", "cols": ["Area A", "Area B", "Area C"], "cats": {"All workers (one rate in the order)": [840, 704, 565]}, "parts": {"All workers (one rate in the order)": [[523, 317], [437, 267], [350, 215]]}}, "watch-without-arms": {"name": "Watch and ward without arms", "cols": ["Area A", "Area B", "Area C"], "cats": {"All workers (one rate in the order)": [1024, 933, 794]}, "parts": {"All workers (one rate in the order)": [[637, 387], [579, 354], [494, 300]]}}, "watch-with-arms": {"name": "Watch and ward with arms", "cols": ["Area A", "Area B", "Area C"], "cats": {"All workers (one rate in the order)": [1111, 1024, 933]}, "parts": {"All workers (one rate in the order)": [[693, 418], [637, 387], [579, 354]]}}};
/* Central minimum wage lookup: reads the table printed in the Labour Bureau order (data in window.MW), runs in the browser only. */
(function () {
  'use strict';
  var D = window.MW; if (!D) return;
  var f = document.getElementById('mw-form'); if (!f) return;
  var e = f.e, c = f.c, a = f.a, out = document.getElementById('mw-out');
  function opts(sel, arr) { sel.innerHTML = ''; arr.forEach(function (x, i) { var o = document.createElement('option'); o.value = i; o.textContent = x; sel.appendChild(o); }); }
  var keys = Object.keys(D);
  opts(e, keys.map(function (k) { return D[k].name; }));
  function fill() { var d = D[keys[e.value || 0]]; opts(c, Object.keys(d.cats)); opts(a, d.cols); show(); }
  function money(n) { return n.toLocaleString('en-IN'); }
  function show() {
    var d = D[keys[e.value || 0]], cat = Object.keys(d.cats)[c.value || 0], i = parseInt(a.value || '0', 10);
    var p = d.parts[cat][i];
    out.innerHTML = '';
    var t = document.createElement('p');
    t.textContent = d.name + ' | ' + cat + ' | ' + d.cols[i] + ': basic Rs ' + money(p[0]) + ' + variable dearness allowance Rs ' + money(p[1]) + ' = Rs ' + money(p[0] + p[1]) + ' per day, as printed in the order effective 1 October 2026.';
    out.appendChild(t);
  }
  e.addEventListener('change', fill); c.addEventListener('change', show); a.addEventListener('change', show);
  fill();
})();
