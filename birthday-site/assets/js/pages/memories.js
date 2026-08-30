/* Memories — a scattered wall of polaroids */
document.addEventListener("site:ready", function () {
  var memories = window.SITE.memories || [];
  if (!memories.length) return;                 // leave the empty frames + placeholder
  var host = document.getElementById("memory-grid");
  host.innerHTML = memories.map(function (m, i) {
    var tilt = ((i % 5) - 2) * 1.2;
    return Render.polaroid(m.photo, m.caption, tilt);
  }).join("");
  var ph = document.querySelector(".placeholder");
  if (ph) ph.remove();
});
