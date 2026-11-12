/* kaise: tick the steps (kept in this browser), print, filter the guide list */
(function () {
  'use strict';
  var d = document;
  var art = d.querySelector('[data-guide]');
  if (art) {
    var key = 'kaise-' + art.getAttribute('data-guide'), done = [];
    try { done = JSON.parse(localStorage.getItem(key)) || []; } catch (e) {}
    var boxes = art.querySelectorAll('[data-step]');
    boxes.forEach(function (b) {
      var i = +b.getAttribute('data-step'); b.checked = done.indexOf(i) > -1; b.closest('li').classList.toggle('done', b.checked);
      b.addEventListener('change', function () {
        var now = []; boxes.forEach(function (x) { if (x.checked) now.push(+x.getAttribute('data-step')); x.closest('li').classList.toggle('done', x.checked); });
        try { localStorage.setItem(key, JSON.stringify(now)); } catch (e) {}
      });
    });
  }
  var pr = d.querySelector('[data-print]'); if (pr) pr.addEventListener('click', function () { window.print(); });
  var q = d.querySelector('[data-filter]');
  if (q) {
    var items = d.querySelectorAll('[data-list] li'), none = d.querySelector('[data-none]');
    q.addEventListener('input', function () {
      var words = q.value.toLowerCase().split(/\s+/).filter(Boolean), shown = 0;
      items.forEach(function (li) { var s = li.getAttribute('data-q'), ok = words.every(function (w) { return s.indexOf(w) > -1; }); li.hidden = !ok; if (ok) shown++; });
      d.querySelectorAll('[data-list]').forEach(function (ul) { var any = ul.querySelector('li:not([hidden])'), h = ul.previousElementSibling; ul.hidden = !any; if (h && h.tagName === 'H2') h.hidden = !any; });
      none.hidden = shown > 0;
    });
  }
})();
