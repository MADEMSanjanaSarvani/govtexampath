/* ==========================================================================
   site.js — the outer layer.
   Builds the ambient background, navigation and footer on every page,
   then hands each page small helpers for rendering content.
   ========================================================================== */

(function () {
  "use strict";

  var S = window.SITE || {};
  var her = S.her || {};
  var nav = S.nav || [];

  /* -- utilities -------------------------------------------------------- */

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  // Which page are we on? Set via <body data-page="memories">.
  var current = document.body.getAttribute("data-page") || "index.html";

  function isActive(item) {
    return item.href === current || item.href.replace(".html", "") === current;
  }

  /* -- ambient background ------------------------------------------------ */

  function mountBackground() {
    document.body.prepend(el(
      '<div class="aura-bg" aria-hidden="true">' +
        '<span class="a1"></span><span class="a2"></span><span class="a3"></span>' +
      '</div>'
    ));
    document.body.prepend(el('<div class="aura-grain" aria-hidden="true"></div>'));
  }

  /* -- navigation -------------------------------------------------------- */

  function navLinks(cls) {
    return nav.map(function (item) {
      return '<a class="' + cls + (isActive(item) ? " is-active" : "") + '" href="' +
        esc(item.href) + '">' + esc(item.label) + "</a>";
    }).join("");
  }

  function mountNav() {
    var brand = her.name ? "A Little World Made For " + esc(her.name) : "A Little World Made For You";

    // Desktop pill
    document.body.appendChild(el(
      '<nav class="nav-desktop glass" aria-label="Main navigation">' +
        '<a class="nav-brand" href="index.html">A Little World Made For You</a>' +
        '<div class="nav-links label-caps">' + navLinks("") + "</div>" +
        '<button class="icon-btn" id="audio-toggle" aria-label="Play music" aria-pressed="false">' +
          '<span class="material-symbols-outlined">volume_off</span>' +
        "</button>" +
      "</nav>"
    ));

    // Mobile header
    document.body.appendChild(el(
      '<header class="nav-mobile glass" aria-label="Main navigation">' +
        '<a class="nav-brand" href="index.html" style="font-size:18px">A Little World</a>' +
        '<button class="icon-btn" id="menu-open" aria-label="Open menu" aria-expanded="false">' +
          '<span class="material-symbols-outlined">menu</span>' +
        "</button>" +
      "</header>"
    ));

    // Full-screen sheet
    document.body.appendChild(el(
      '<div class="nav-sheet" id="nav-sheet" role="dialog" aria-modal="true" aria-label="Menu">' +
        '<button class="icon-btn close" id="menu-close" aria-label="Close menu">' +
          '<span class="material-symbols-outlined">close</span>' +
        "</button>" +
        navLinks("") +
      "</div>"
    ));

    // Bottom bar — first five destinations
    document.body.appendChild(el(
      '<nav class="nav-bottom glass" aria-label="Quick navigation">' +
        nav.slice(0, 5).map(function (item) {
          return '<a href="' + esc(item.href) + '"' + (isActive(item) ? ' class="is-active"' : "") + ">" +
            '<span class="material-symbols-outlined"' +
            (isActive(item) ? ' style="font-variation-settings:\'FILL\' 1"' : "") + ">" +
            esc(item.icon) + "</span><span>" + esc(item.short) + "</span></a>";
        }).join("") +
      "</nav>"
    ));

    wireMenu();
    wireAudio();
  }

  function wireMenu() {
    var sheet = document.getElementById("nav-sheet");
    var open = document.getElementById("menu-open");
    var close = document.getElementById("menu-close");
    if (!sheet || !open) return;

    function setOpen(state) {
      sheet.classList.toggle("is-open", state);
      open.setAttribute("aria-expanded", String(state));
      document.body.style.overflow = state ? "hidden" : "";
    }
    open.addEventListener("click", function () { setOpen(true); });
    close.addEventListener("click", function () { setOpen(false); });
    sheet.addEventListener("click", function (e) {
      if (e.target.tagName === "A") setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // Optional background music: drop a file at assets/audio/theme.mp3.
  // If it isn't there the button simply stays quiet — nothing breaks.
  function wireAudio() {
    var btn = document.getElementById("audio-toggle");
    if (!btn) return;
    var audio = new Audio("assets/audio/theme.mp3");
    audio.loop = true;
    audio.volume = 0.35;

    btn.addEventListener("click", function () {
      var icon = btn.querySelector(".material-symbols-outlined");
      if (audio.paused) {
        audio.play().then(function () {
          icon.textContent = "volume_up";
          btn.setAttribute("aria-pressed", "true");
          btn.setAttribute("aria-label", "Pause music");
        }).catch(function () {
          // No audio file yet — leave the button as it was.
        });
      } else {
        audio.pause();
        icon.textContent = "volume_off";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Play music");
      }
    });
  }


  /* -- icon font guard ----------------------------------------------------
     Material Symbols renders by ligature: if the font is blocked or slow to
     arrive, the raw names ("add_a_photo") show up as text. Detect that and
     hide the glyphs instead of leaking them.
     -------------------------------------------------------------------- */

  function guardIcons() {
    // Measure rather than ask. `document.fonts.check()` answers "true" when no
    // matching @font-face exists at all, which is exactly the blocked-stylesheet
    // case we care about. A rendered ligature is one narrow glyph; the fallback
    // renders the whole word, so width tells the truth.
    function probe() {
      var span = document.createElement("span");
      span.className = "material-symbols-outlined";
      span.textContent = "home";
      span.style.cssText = "position:absolute;left:-9999px;top:0;font-size:24px;visibility:hidden";
      document.body.appendChild(span);
      var wide = span.offsetWidth > 40;
      span.remove();
      if (wide) document.documentElement.classList.add("no-icons");
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(probe);
    }
    // Belt and braces: if the font request just hangs, decide anyway.
    setTimeout(probe, 2500);
  }

  /* -- footer ------------------------------------------------------------ */

  function mountFooter() {
    document.body.appendChild(el(
      '<footer class="site-footer">' +
        '<div class="sig">' + esc(S.signature || "Made with love") + "</div>" +
        '<div class="links">' +
          '<a href="our-people.html">Our People</a>' +
          '<a href="letters.html">Letters</a>' +
          '<a href="surprise.html">One Last Thing</a>' +
        "</div>" +
      "</footer>"
    ));
  }

  /* -- scroll reveal ------------------------------------------------------ */

  function mountReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (n, i) {
      n.style.transitionDelay = Math.min(i, 6) * 90 + "ms";
      io.observe(n);
    });
  }

  /* -- name placeholders --------------------------------------------------
     Any element with data-her="name" | "tagline" | "nickname" gets filled
     from content.js, so her name lives in exactly one place.
     -------------------------------------------------------------------- */

  function fillHer() {
    document.querySelectorAll("[data-her]").forEach(function (node) {
      var key = node.getAttribute("data-her");
      var value = her[key];
      if (value) node.textContent = value;
    });
    if (her.name) {
      document.title = document.title.replace(/\{name\}/g, her.name);
    }
  }

  /* -- render helpers for the content pages ------------------------------- */

  var Render = {
    // Swap a section's placeholder for real content once the data arrives.
    // `list` is the array from content.js, `target` a CSS selector,
    // `tpl` a function turning one item into an HTML string.
    list: function (list, target, tpl) {
      var host = document.querySelector(target);
      if (!host) return false;
      if (!list || !list.length) return false;      // keep the placeholder
      host.innerHTML = list.map(tpl).join("");
      var ph = host.parentElement.querySelector(".placeholder");
      if (ph) ph.remove();
      return true;
    },

    polaroid: function (photo, caption, rotate) {
      var tilt = rotate ? ' style="transform:rotate(' + rotate + 'deg)"' : "";
      var inner = photo
        ? '<img src="' + esc(photo) + '" alt="' + esc(caption || "") + '" loading="lazy">'
        : '<span class="material-symbols-outlined">image</span>';
      return '<figure class="polaroid' + (photo ? "" : " is-empty") + '"' + tilt + ">" +
        '<div class="frame">' + inner + "</div>" +
        '<figcaption class="caption">' + esc(caption || "") + "</figcaption>" +
        "</figure>";
    },

    esc: esc
  };

  /* -- boot --------------------------------------------------------------- */

  function boot() {
    mountBackground();
    guardIcons();
    fillHer();
    mountNav();
    mountFooter();
    mountReveal();
    window.Render = Render;
    document.dispatchEvent(new CustomEvent("site:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
