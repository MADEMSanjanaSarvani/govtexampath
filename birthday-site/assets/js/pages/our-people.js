/* Our People — renders one portrait card per friend in content.js */
document.addEventListener("site:ready", function () {
  var people = (window.SITE.people || []);
  Render.list(people, "#people-grid", function (p, i) {
    var tilt = (i % 3 - 1) * 1.4;
    var photo = p.photo
      ? '<img src="' + Render.esc(p.photo) + '" alt="' + Render.esc(p.name) + '" loading="lazy">'
      : '<span class="material-symbols-outlined">person</span>';
    return '<a class="person-card card reveal is-in" href="friend.html?id=' + encodeURIComponent(p.id) + '"' +
             ' style="--tilt:' + tilt + 'deg">' +
             '<div class="person-photo">' + photo + '</div>' +
             '<h2 class="headline-md" style="font-size:20px;margin:16px 0 4px">' + Render.esc(p.name) + '</h2>' +
             '<p class="label-caps" style="color:var(--gold);margin:0 0 12px">' + Render.esc(p.relation || "") + '</p>' +
             (p.note ? '<p class="note" style="font-size:16px;margin:0">“' + Render.esc(p.note) + '”</p>' : '') +
           '</a>';
  });
});
