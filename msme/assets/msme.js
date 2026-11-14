/* MSME delayed-payment interest estimate: three times the bank rate you type, compounded monthly, runs in the browser only. */
(function () {
  'use strict';
  function addDays(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function dayDiff(a, b) { return Math.round((b - a) / 86400000); }
  /* months and leftover days between start and end (end exclusive): whole calendar months, then days */
  function monthsAndDays(start, end) {
    var m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    var anchor = new Date(start.getFullYear(), start.getMonth() + m, start.getDate());
    if (anchor > end) { m -= 1; anchor = new Date(start.getFullYear(), start.getMonth() + m, start.getDate()); }
    return { months: Math.max(m, 0), days: Math.max(dayDiff(anchor, end), 0) };
  }
  function calc(p) {
    var accept = new Date(p.accept + 'T00:00:00'), pay = new Date(p.pay + 'T00:00:00');
    var start;
    if (p.agreed > 0) { start = addDays(accept, p.agreed + 1); } else { start = addDays(accept, 16); }
    var res = { start: start, rate: 3 * p.bank };
    if (pay < start) { res.late = false; res.interest = 0; res.months = 0; res.days = 0; res.total = p.principal; return res; }
    var md = monthsAndDays(start, pay);
    var i = res.rate / 12 / 100;
    var amount = p.principal * Math.pow(1 + i, md.months) * (1 + i * (md.days / 30));
    res.late = true; res.months = md.months; res.days = md.days; res.total = amount; res.interest = amount - p.principal;
    return res;
  }
  if (typeof module !== 'undefined') { module.exports = { calc: calc }; }
  var f = typeof document !== 'undefined' && document.getElementById('msme-calc');
  if (!f) return;
  function fmt(n) { return n.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }); }
  function fd(d) { function z(n) { return (n < 10 ? '0' : '') + n; } return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()); }
  function run(e) {
    if (e) e.preventDefault();
    var out = document.getElementById('msme-out');
    var p = { principal: parseFloat(f.principal.value), accept: f.accept.value, agreed: parseInt(f.agreed.value || '0', 10), pay: f.pay.value, bank: parseFloat(f.bank.value) };
    if (!(p.principal > 0) || !p.accept || !p.pay || !(p.bank > 0) || p.agreed < 0 || p.agreed > 45) {
      out.textContent = 'Please fill every box. The agreed days must be from 0 to 45 (0 if nothing was agreed in writing), and the bank rate must be a number above 0.';
      return;
    }
    var r = calc(p);
    if (!r.late) { out.textContent = 'Payment on ' + p.pay + ' is not later than the day interest starts (' + fd(r.start) + '), so this estimate shows no interest.'; return; }
    out.innerHTML = '';
    var lines = ['Interest starts on ' + fd(r.start) + '.', 'Rate used: 3 x ' + p.bank + '% = ' + r.rate.toFixed(2) + '% a year, compounded monthly.', 'Period: ' + r.months + ' full month(s) and ' + r.days + ' day(s).', 'Interest estimate: Rs ' + fmt(r.interest), 'Principal plus interest: Rs ' + fmt(r.total)];
    lines.forEach(function (t) { var d = document.createElement('p'); d.textContent = t; out.appendChild(d); });
  }
  f.addEventListener('submit', run);
})();
