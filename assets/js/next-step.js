/* Filters and ranks the "Where to go next" resources.
 *
 * Design notes, because the failure modes matter more than the feature:
 *  - Ranking is by how many query words a resource matches, so the most
 *    relevant answer moves to the top rather than the reader scanning a list.
 *  - A query that matches nothing NEVER empties the panel. A reader who typed
 *    their actual problem and got "no results" is worse off than one who was
 *    never offered a box. We say so plainly and put every resource back.
 *  - No dependencies, no network, nothing typed ever leaves the page.
 */
(function () {
  'use strict';

  var panels = document.querySelectorAll('[data-nextstep]');
  if (!panels.length) return;

  Array.prototype.forEach.call(panels, function (panel) {
    var filter = panel.querySelector('[data-nsfilter]');
    var input = panel.querySelector('[data-nsinput]');
    var list = panel.querySelector('[data-nslist]');
    var status = panel.querySelector('[data-nsstatus]');
    var freeBtn = panel.querySelector('[data-nsfree]');
    var clearBtn = panel.querySelector('[data-nsclear]');
    if (!filter || !input || !list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('[data-res]'));
    if (items.length < 2) return;

    // Remember the authored order so we can always restore it.
    items.forEach(function (el, i) { el.dataset.order = String(i); });

    var freeOnly = false;

    function score(el, words) {
      var hay = el.dataset.search || '';
      if (!words.length) return 1;
      var hits = 0;
      words.forEach(function (w) { if (hay.indexOf(w) !== -1) hits++; });
      return hits;
    }

    function apply() {
      var q = input.value.toLowerCase().trim();
      var words = q ? q.split(/\s+/).filter(Boolean) : [];

      var pool = items.filter(function (el) {
        return !freeOnly || el.dataset.stance === 'free';
      });

      var scored = pool.map(function (el) {
        return { el: el, s: score(el, words) };
      });

      var matches = words.length ? scored.filter(function (x) { return x.s > 0; }) : scored;
      var noMatch = words.length > 0 && matches.length === 0;

      // Never leave the reader with nothing.
      if (noMatch) matches = scored;

      matches.sort(function (a, b) {
        if (b.s !== a.s) return b.s - a.s;
        return Number(a.el.dataset.order) - Number(b.el.dataset.order);
      });

      items.forEach(function (el) { el.hidden = true; });
      matches.forEach(function (x) {
        x.el.hidden = false;
        list.appendChild(x.el);
      });

      var active = words.length > 0 || freeOnly;
      if (clearBtn) clearBtn.hidden = !active;

      if (noMatch) {
        status.textContent =
          'Nothing here matches "' + input.value.trim() +
          '". Everything available on this topic is listed below.';
        status.hidden = false;
      } else if (words.length) {
        status.textContent =
          matches.length + (matches.length === 1 ? ' resource' : ' resources') +
          ', most relevant first.';
        status.hidden = false;
      } else if (freeOnly) {
        status.textContent = 'Showing what costs nothing.';
        status.hidden = false;
      } else {
        status.hidden = true;
      }
    }

    input.addEventListener('input', apply);
    input.addEventListener('search', apply);

    if (freeBtn) {
      freeBtn.addEventListener('click', function () {
        freeOnly = !freeOnly;
        freeBtn.setAttribute('aria-pressed', freeOnly ? 'true' : 'false');
        freeBtn.classList.toggle('is-on', freeOnly);
        apply();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        freeOnly = false;
        if (freeBtn) {
          freeBtn.setAttribute('aria-pressed', 'false');
          freeBtn.classList.remove('is-on');
        }
        apply();
        input.focus();
      });
    }

    filter.hidden = false;
  });
})();
