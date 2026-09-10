/* Filters and ranks the "Where to go next" resources.
 *
 * Design notes, because the failure modes matter more than the feature:
 *  - Intent chips come first. This site's reader often cannot name their
 *    problem in search terms, so one tap in their own words beats a text box.
 *    A chip's keyword soup drives matching but is never shown to them.
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
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-nsintent]'));
    if (!filter || !input || !list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('[data-res]'));
    if (items.length < 2) return;

    // Remember the authored order so we can always restore it.
    items.forEach(function (el, i) { el.dataset.order = String(i); });

    var freeOnly = false;
    var activeChip = null;

    function setChip(chip) {
      activeChip = chip;
      chips.forEach(function (c) {
        var on = c === chip;
        c.setAttribute('aria-pressed', on ? 'true' : 'false');
        c.classList.toggle('is-on', on);
      });
    }

    function currentQuery() {
      // A chip's keywords are internal; typing always overrides a chip.
      if (input.value.trim()) return input.value.toLowerCase().trim();
      if (activeChip) return (activeChip.dataset.query || '').toLowerCase().trim();
      return '';
    }

    // Crude singular/plural tolerance. Without it "passages" misses text that
    // says "passage", which silently drops obvious answers.
    function hit(hay, w) {
      if (hay.indexOf(w) !== -1) return true;
      if (w.length > 3 && w.charAt(w.length - 1) === 's' &&
          hay.indexOf(w.slice(0, -1)) !== -1) return true;
      if (w.length > 2 && hay.indexOf(w + 's') !== -1) return true;
      return false;
    }

    function score(el, words) {
      var hay = el.dataset.search || '';
      if (!words.length) return 1;
      var hits = 0;
      words.forEach(function (w) { if (hit(hay, w)) hits++; });
      return hits;
    }

    function apply() {
      var q = currentQuery();
      var words = q ? q.split(/\s+/).filter(Boolean) : [];
      var typed = input.value.trim();

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

      var count = matches.length +
        (matches.length === 1 ? ' resource' : ' resources');

      if (noMatch) {
        status.textContent =
          'Nothing here matches "' + typed +
          '". Everything available on this topic is listed below.';
        status.hidden = false;
      } else if (activeChip && !typed) {
        status.textContent =
          '“' + activeChip.textContent.trim() + '” — ' +
          count + ', most relevant first.';
        status.hidden = false;
      } else if (words.length) {
        status.textContent = count + ', most relevant first.';
        status.hidden = false;
      } else if (freeOnly) {
        status.textContent = 'Showing what costs nothing.';
        status.hidden = false;
      } else {
        status.hidden = true;
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        setChip(activeChip === chip ? null : chip);
        input.value = '';
        apply();
      });
    });

    input.addEventListener('input', function () {
      if (input.value.trim()) setChip(null);
      apply();
    });
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
        setChip(null);
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
