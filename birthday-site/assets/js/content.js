/* ==========================================================================
   content.js — the ONE file that holds everything about her.
   Photos, letters, friends, timeline. Nothing else needs editing.

    Everything currently in here is placeholder scaffolding so the layout
   can be previewed — swap it out as the pictures and texts come in.
   ========================================================================== */

window.SITE = {

  /* ---- Who this is for ------------------------------------------------ */
  her: {
    name: "Raveena",
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
     One entry per friend. `id` is the page address: friend.html?id=sanjana
     Portraits go in assets/img/friends/, shared photos in assets/img/photos/.
     ------------------------------------------------------------------- */
  people: [
    {
      id: "sanjana",
      name: "Sanjana",
      relation: "",                     // e.g. "Best friend since school"
      photo: "",                        // assets/img/friends/sanjana.jpg
      note: "",                         // one line about Raveena
      letter: "",                       // her full message
      gallery: [
        { photo: "assets/img/photos/raveena-sanjana-1.jpg",
          caption: "A kiss on the cheek, and the whole garden behind us" },
        { photo: "assets/img/photos/raveena-sanjana-2.jpg",
          caption: "That look. No words needed." },
        { photo: "assets/img/photos/raveena-sanjana-3.jpg",
          caption: "Graffiti wall, and one of us refusing to take a normal photo" }
      ]
    },
    {
      id: "priya",
      name: "Priya",
      relation: "",
      photo: "",                        // assets/img/friends/priya.jpg
      note: "",
      letter: "",
      gallery: [
        { photo: "assets/img/photos/raveena-priya-1.jpg",
          caption: "College days, matching lanyards, matching trouble" },
        { photo: "assets/img/photos/raveena-priya-2.jpg",
          caption: "Temple lights, and a hug that went on a bit too long" },
        { photo: "assets/img/photos/raveena-priya-3.jpg",
          caption: "The laugh that made the whole mall turn around" },
        { photo: "assets/img/photos/raveena-priya-4.jpg",
          caption: "And then we pretended to be normal" }
      ]
    },
    {
      id: "bhavya",
      name: "Bhavya",
      relation: "",
      photo: "",                        // assets/img/friends/bhavya.jpg
      note: "",
      letter: "",
      gallery: [
        { photo: "assets/img/photos/raveena-bhavya-1.jpg",
          caption: "Saree day — as if we dress like this every morning" }
      ]
    },
    {
      id: "akshaya",
      name: "Akshaya",
      relation: "",
      photo: "",                        // assets/img/friends/akshaya.jpg
      note: "",
      letter: "",
      gallery: [
        { photo: "assets/img/photos/raveena-akshaya-1.jpg",
          caption: "College garden, lanyards still on" },
        { photo: "assets/img/photos/raveena-akshaya-2.jpg",
          caption: "Blue hour, silk sarees, and one very long hug" }
      ]
    }
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
