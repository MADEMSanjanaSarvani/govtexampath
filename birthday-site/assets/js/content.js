/* ==========================================================================
   content.js — the ONE file that holds everything about her.
   Photos, letters, friends, timeline. Nothing else needs editing.

   >>> TODO: replace `name` below with your friend's real name. <<<
   Everything currently in here is placeholder scaffolding so the layout
   can be previewed — swap it out as the pictures and texts come in.
   ========================================================================== */

window.SITE = {

  /* ---- Who this is for ------------------------------------------------ */
  her: {
    name: "Emma",                       // TODO: her real name
    nickname: "",                       // optional — used in casual headings
    tagline: "One girl. So many memories. So many people who love her.",
    birthday: "",                       // e.g. "12 September"
    heroPhoto: "",                      // e.g. "assets/img/photos/hero.jpg"
    heroCaption: "The star of our world"
  },

  /* ---- Footer signature ----------------------------------------------- */
  signature: "Made with love by your besties",

  /* ---- Navigation — order here drives every nav on the site ----------- */
  nav: [
    { label: "Home",      short: "Home",     href: "index.html",      icon: "home" },
    { label: "Our People", short: "People",  href: "our-people.html", icon: "group" },
    { label: "Her Story",  short: "Story",   href: "her-story.html",  icon: "auto_stories" },
    { label: "Memories",   short: "Memories", href: "memories.html",  icon: "photo_library" },
    { label: "Letters",    short: "Letters", href: "letters.html",    icon: "mail" },
    { label: "Fun Zone",   short: "Fun",     href: "fun-zone.html",   icon: "celebration" },
    { label: "Surprise",   short: "Gift",    href: "surprise.html",   icon: "card_giftcard" }
  ],

  /* ---- The people who love her ----------------------------------------
     One entry per friend. `id` must be unique — it links the friend's own
     page (friend.html?id=...). Drop their photo in assets/img/friends/.
     ------------------------------------------------------------------- */
  people: [
    // {
    //   id: "sarah",
    //   name: "Sarah Jenkins",
    //   relation: "Best friend since class 6",
    //   photo: "assets/img/friends/sarah.jpg",
    //   note: "A one-line thing she'd say about her.",
    //   letter: "The full text they sent you, as long as you like.",
    //   gallery: ["assets/img/photos/sarah-1.jpg"]
    // }
  ],

  /* ---- Letters / the digital mailbox -----------------------------------
     Every message people texted you about her. `from` shows on the sealed
     envelope; `body` is revealed when it's opened.
     ------------------------------------------------------------------- */
  letters: [
    // { from: "Aditi", relation: "Roommate", body: "Paste their text here.", date: "" }
  ],

  /* ---- Her story — life timeline --------------------------------------
     Milestones, oldest first. `photo` is optional.
     ------------------------------------------------------------------- */
  timeline: [
    // { year: "2003", title: "The day the world got louder", body: "…", photo: "" }
  ],

  /* ---- Memories — the photo archive ------------------------------------
     Each memory is one polaroid in the grid.
     ------------------------------------------------------------------- */
  memories: [
    // { photo: "assets/img/photos/goa.jpg", caption: "Goa, 2 a.m.", tag: "trips" }
  ],

  /* ---- Fun zone — inside jokes, quotes, chaos -------------------------- */
  funZone: {
    quotes: [
      // { text: "Something she always says.", said: "her" }
    ],
    jokes: [
      // { title: "The pizza incident", body: "…" }
    ]
  },

  /* ---- The final surprise ---------------------------------------------- */
  surprise: {
    heading: "One last thing…",
    body: "",                           // the closing message to her
    photo: "",
    video: ""                           // optional YouTube/Drive embed URL
  }
};
