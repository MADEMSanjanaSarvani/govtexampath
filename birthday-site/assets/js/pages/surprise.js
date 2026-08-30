/* Surprise — the gate, then the final message */
document.addEventListener("site:ready", function () {
  var s = window.SITE.surprise || {};
  var gate = document.getElementById("surprise-gate");
  var reveal = document.getElementById("surprise-reveal");
  var body = document.getElementById("surprise-body");

  if (s.heading) gate.querySelector("h1").textContent = s.heading;

  if (s.body || s.photo || s.video) {
    body.innerHTML =
      (s.photo ? '<img src="' + Render.esc(s.photo) + '" alt="" ' +
                 'style="width:100%;border-radius:12px;margin-bottom:24px">' : '') +
      (s.body ? '<p class="note" style="font-size:19px;white-space:pre-wrap;margin:0">' +
                Render.esc(s.body) + '</p>' : '') +
      (s.video ? '<div style="position:relative;padding-top:56.25%;margin-top:24px">' +
                 '<iframe src="' + Render.esc(s.video) + '" title="A message for you" ' +
                 'style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px" ' +
                 'allowfullscreen></iframe></div>' : '');
    var ph = document.getElementById("surprise-placeholder");
    if (ph) ph.remove();
  }

  document.getElementById("open-surprise").addEventListener("click", function () {
    gate.hidden = true;
    reveal.hidden = false;
    reveal.classList.add("is-in");
    confetti();
  });

  // A short, gentle burst of hearts — no library needed.
  function confetti() {
    var layer = document.createElement("div");
    layer.className = "confetti-layer";
    layer.setAttribute("aria-hidden", "true");
    for (var i = 0; i < 28; i++) {
      var bit = document.createElement("span");
      bit.textContent = i % 3 === 0 ? "✨" : "❤️";
      bit.style.left = Math.random() * 100 + "%";
      bit.style.animationDelay = (Math.random() * 1.2) + "s";
      bit.style.animationDuration = (2.6 + Math.random() * 1.8) + "s";
      bit.style.fontSize = (12 + Math.random() * 14) + "px";
      layer.appendChild(bit);
    }
    document.body.appendChild(layer);
    setTimeout(function () { layer.remove(); }, 6000);
  }
});
