/* friend.html?id=… — one person's own wall, and the photos they share with her */
document.addEventListener("site:ready", function () {
  var id = new URLSearchParams(location.search).get("id");
  var person = (window.SITE.people || []).find(function (p) { return p.id === id; });
  if (!person) return;                          // no match: keep the placeholder

  var her = (window.SITE.her || {}).name || "Her";
  var pair = her + " & " + person.name;

  document.title = pair + " — A Little World Made For You";

  var portrait = person.photo
    ? '<img src="' + Render.esc(person.photo) + '" alt="' + Render.esc(person.name) + '">'
    : '<span style="font-family:var(--font-display);font-size:2rem">' +
        Render.esc(person.name.charAt(0)) + '</span>';

  // Gallery entries accept either "path.jpg" or { photo, caption }.
  var gallery = "";
  if ((person.gallery || []).length) {
    gallery =
      '<div class="rule"><span>' + Render.esc(pair) + '</span></div>' +
      '<div class="memory-grid">' +
        person.gallery.map(function (item, i) {
          var src = typeof item === "string" ? item : item.photo;
          var cap = typeof item === "string" ? "" : (item.caption || "");
          return Render.polaroid(src, cap, ((i % 5) - 2) * 1.2);
        }).join("") +
      "</div>";
  }

  document.getElementById("friend-page").innerHTML =
    '<header class="page-head">' +
      '<div class="person-photo person-photo-lg">' + portrait + "</div>" +
      '<h1 class="display-lg" style="margin-top:24px">' + Render.esc(person.name) + "</h1>" +
      (person.relation
        ? '<p class="label-caps" style="color:var(--gold);margin-top:12px">' +
            Render.esc(person.relation) + "</p>"
        : "") +
      (person.note
        ? '<p class="note" style="margin-top:16px">“' + Render.esc(person.note) + '”</p>'
        : "") +
    "</header>" +
    (person.letter
      ? '<div class="card" style="max-width:680px;margin:0 auto">' +
          '<p class="note" style="font-size:18px;white-space:pre-wrap;margin:0">' +
            Render.esc(person.letter) + "</p>" +
        "</div>"
      : "") +
    gallery;

  document.getElementById("friend-placeholder").remove();
});
