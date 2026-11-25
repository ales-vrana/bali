# balibeach.cloud

Landing page for a 400 m² freehold plot near Jumpai Beach, East Bali.
Static site, two languages, no build step on the server.

| URL | File | Language |
|---|---|---|
| `/` | `index.html` | English |
| `/id/` | `id/index.html` | Bahasa Indonesia |

## Editing texts

1. Change the text in `build/content.py` (both languages live there, same keys).
2. Run `python3 build/build.py`.
3. Commit and push. Vercel deploys automatically.

Layout lives in `build/template.html`, styling in `assets/styles.css`.
Do not edit `index.html` or `id/index.html` by hand, the build overwrites them.

## Deploying on Vercel

Import this repository in Vercel with framework preset "Other", no build command,
output directory left empty (the repository root is served as is).

## Tracking

The Meta Pixel base code goes into the marked comment in `build/template.html`.
Every WhatsApp button already sends the `Contact` event when the Pixel is present.
