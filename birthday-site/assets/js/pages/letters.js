/* Letters — sealed envelopes that open on click */
document.addEventListener("site:ready", function () {
  var ok = Render.list(window.SITE.letters || [], "#letters-grid", function (l, i) {
    return '<article class="envelope reveal is-in" tabindex="0" role="button" aria-expanded="false"' +
             ' aria-label="Open the letter from ' + Render.esc(l.from) + '">' +
             '<div class="envelope-flap" aria-hidden="true"></div>' +
             '<div class="envelope-front">' +
               '<span class="material-symbols-outlined" style="color:var(--gold)">mail</span>' +
               '<h2 class="headline-md" style="font-size:20px;margin:12px 0 4px">' + Render.esc(l.from) + '</h2>' +
               '<p class="label-caps muted" style="margin:0">' + Render.esc(l.relation || "") + '</p>' +
               '<p class="label-caps" style="color:var(--gold);margin-top:18px">Tap to open</p>' +
             '</div>' +
             '<div class="envelope-letter"><p class="note" style="font-size:16px;white-space:pre-wrap;margin:0">' +
               Render.esc(l.body) + '</p>' +
               (l.date ? '<p class="label-caps muted" style="margin-top:20px">' + Render.esc(l.date) + '</p>' : '') +
             '</div>' +
           '</article>';
  });
  if (!ok) return;

  document.querySelectorAll(".envelope").forEach(function (env) {
    function toggle() {
      var open = env.classList.toggle("is-open");
      env.setAttribute("aria-expanded", String(open));
    }
    env.addEventListener("click", toggle);
    env.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });
});
