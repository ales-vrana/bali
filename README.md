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

Two things run on every page:

- **Meta Pixel** `884397061610419` ("Ales Vrana's Pixel"). Sends `PageView`, and `Contact` on every WhatsApp click.
  The ID lives in `build/content.py` (`pixel_id`).
- **Own first-party tracking** (`assets/track.js` -> `/api/track` -> Postgres). Stores visits, visitors, UTM
  parameters, engaged time, scroll depth and clicks. No IP address is stored.

### Admin

`/admin/` shows the statistics. It needs two environment variables in Vercel
(Project -> Settings -> Environment Variables):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Postgres connection string. Added automatically when you create a Neon database under the project's Storage tab. |
| `ADMIN_PASSWORD` | Password for `/admin/`. Choose a long one. |

Redeploy after adding them. Tables are created automatically on the first visit.

### Excluding your own visits

Open the site once with `?notrack=1` at the end of the address. That browser is ignored from then on.
`?notrack=0` turns tracking back on.

### UTM links for ads

`https://balibeach.cloud/?utm_source=facebook&utm_medium=paid&utm_campaign=NAME&utm_content=CREATIVE`
(use `/id/` for the Bahasa version).
