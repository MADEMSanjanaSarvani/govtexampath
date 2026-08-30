# A Little World Made For You

A small, private birthday site — a museum of one person, built out of the
photos and the messages everyone sent.

This commit is **the outer layer only**: the design system, the navigation,
the page shells and the empty frames. No real content yet.

## Run it

It's plain HTML, CSS and JS — no build step, no dependencies.

```bash
cd birthday-site
python3 -m http.server 8000
# open http://localhost:8000
```

## Adding the content

Everything lives in **one file**: `assets/js/content.js`.
Nothing else needs to be edited — the pages read from it and render
themselves. Where an array is still empty, the page shows a soft
placeholder instead of breaking.

| What you have | Where it goes |
|---|---|
| Her name, tagline, main photo | `her` |
| Each friend (photo, one-liner, their message) | `people` |
| The texts people sent you | `letters` |
| Life milestones | `timeline` |
| The photo archive | `memories` |
| Inside jokes, catchphrases | `funZone` |
| The closing message | `surprise` |

Photos go in `assets/img/photos/`, friend portraits in `assets/img/friends/`,
then reference them by path, e.g. `"assets/img/photos/goa.jpg"`.

Optional: drop an mp3 at `assets/audio/theme.mp3` and the speaker button in
the nav starts working. Without it the button stays silent — nothing breaks.

## The pages

| File | Room |
|---|---|
| `index.html` | Home — the hero and the doors into everything else |
| `our-people.html` | A wall of everyone who loves her |
| `friend.html?id=…` | One person's own page |
| `her-story.html` | A vertical timeline of her life |
| `memories.html` | The polaroid archive |
| `letters.html` | Envelopes that open when tapped |
| `fun-zone.html` | Quotes and the incidents |
| `surprise.html` | The last thing, behind a gate |

## Design

Follows the *Aura of Connection* system from the Stitch pack: creamy white
ground, blush and lavender mesh gradient, champagne-gold accents,
Playfair Display for headings, Manrope for body, Epilogue italic for the
handwritten notes. Glassmorphic nav, polaroid cards, soft ambient shadows.

Tokens live at the top of `assets/css/site.css` — change a colour there and
it changes everywhere.
