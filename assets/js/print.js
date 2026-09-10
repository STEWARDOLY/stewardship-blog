/* Reveals the "Save as PDF" control, which is meaningless without a print
 * dialog, and wires it to the browser's own. Hidden in markup so a reader
 * with JavaScript off never sees a button that cannot work — Ctrl/Cmd+P
 * still prints the page correctly for them.
 */
(function () {
  'use strict';
  var bar = document.querySelector('[data-printbar]');
  var btn = document.querySelector('[data-print]');
  if (!bar || !btn || typeof window.print !== 'function') return;
  btn.addEventListener('click', function () { window.print(); });
  bar.hidden = false;
})();
