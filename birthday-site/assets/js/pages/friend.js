/* friend.html?id=… — one person's own wall */
document.addEventListener("site:ready", function () {
  var id = new URLSearchParams(location.search).get("id");
  var person = (window.SITE.people || []).find(function (p) { return p.id === id; });
  if (!person) return;                          // keep the placeholder

  document.title = person.name + " — A Bestie's Page";

  var photo = person.photo
    ? '<img src="' + Render.esc(person.photo) + '" alt="' + Render.esc(person.name) + '">'
    : '<span class="material-symbols-outlined" style="font-size:40px">person</span>';

  var gallery = (person.gallery || []).length
    ? '<div class="rule"><span class="material-symbols-outlined">photo_library</span></div>' +
      '<div class="memory-grid">' +
        person.gallery.map(function (src, i) {
          return Render.polaroid(src, "", ((i % 5) - 2) * 1.2);
        }).join("") +
      '</div>'
    : '';

  document.getElementById("friend-page").innerHTML =
    '<header class="page-head">' +
      '<div class="person-photo person-photo-lg">' + photo + '</div>' +
      '<h1 class="display-lg" style="margin-top:24px">' + Render.esc(person.name) + '</h1>' +
      '<p class="label-caps" style="color:var(--gold);margin-top:12px">' +
        Render.esc(person.relation || "") + '</p>' +
    '</header>' +
    (person.letter
      ? '<div class="card" style="max-width:680px;margin:0 auto">' +
          '<p class="note" style="font-size:18px;white-space:pre-wrap;margin:0">' +
            Render.esc(person.letter) + '</p>' +
        '</div>'
      : '') +
    gallery;

  document.getElementById("friend-placeholder").remove();
});
