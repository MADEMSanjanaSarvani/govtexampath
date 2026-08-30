/* Her Story — vertical champagne timeline */
document.addEventListener("site:ready", function () {
  Render.list(window.SITE.timeline || [], "#timeline", function (m) {
    return '<li class="milestone reveal is-in">' +
             '<span class="dot" aria-hidden="true"></span>' +
             '<p class="label-caps" style="color:var(--gold);margin:0 0 8px">' + Render.esc(m.year || "") + '</p>' +
             '<h2 class="headline-md" style="font-size:22px;margin:0 0 8px">' + Render.esc(m.title || "") + '</h2>' +
             (m.body ? '<p class="body-sm muted" style="margin:0 0 16px">' + Render.esc(m.body) + '</p>' : '') +
             (m.photo ? '<img class="milestone-photo" src="' + Render.esc(m.photo) +
                        '" alt="' + Render.esc(m.title || "") + '" loading="lazy">' : '') +
           '</li>';
  });
});
