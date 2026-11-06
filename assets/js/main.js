/* tiny progressive enhancement: prefetch internal pages on hover/touch
   so navigation feels instant. site works fine without it. */
(function () {
  'use strict';
  var seen = {};
  var conn = navigator.connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;

  function prefetch(a) {
    if (!a || a.origin !== location.origin || seen[a.href]) return;
    if (a.pathname === location.pathname || /^mailto:/.test(a.href)) return;
    seen[a.href] = true;
    var l = document.createElement('link');
    l.rel = 'prefetch';
    l.href = a.href;
    document.head.appendChild(l);
  }

  function handler(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    prefetch(a);
  }

  document.addEventListener('mouseover', handler, { passive: true });
  document.addEventListener('touchstart', handler, { passive: true });

  // warm up the other nav pages when the browser is idle
  var idle = window.requestIdleCallback || function (f) { setTimeout(f, 1500); };
  idle(function () {
    var links = document.querySelectorAll('#sitenav a');
    for (var i = 0; i < links.length; i++) prefetch(links[i]);
  });
})();
