# JM — Portfolio (React)

A rebuilt, animated personal portfolio for JM — IT student & web developer.
Built with **React 19 + Vite 8**, no UI framework, no CSS framework — just
hand-written CSS and a few small hooks.

## Quick start

Double-click **`start.cmd`** — it installs nothing extra, starts the dev server
and prints the local URL (usually <http://localhost:5173>).

Or from a terminal:

```bash
npm install
npm run dev
```

> On Windows PowerShell, `npm` may be blocked by the execution policy. Use
> `npm.cmd run dev` (or the `start.cmd` shortcut) instead.

## Scripts

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Starts Vite with hot reload at `localhost:5173`                     |
| `npm run build`        | Production build in `dist/` (ready for GitHub Pages, Netlify, etc.) |
| `npm run preview`      | Serves the production build locally                                 |
| `npm run build:single` | Builds one self-contained `portfolio.html` you can share by email    |

## Project structure

```
index.html               Vite entry + meta tags
src/
  main.jsx               React root
  App.jsx                Page composition
  data.js                All content (services, skills, timeline, socials)
  hooks/
    useInView.js         Scroll-reveal observer
    useTypewriter.js     Hero role animation
    useCountUp.js        Animated skill percentages
    useActiveSection.js  Scroll-spy for the navbar
  components/
    Preloader.jsx        Loading screen with progress
    Background.jsx       Aurora, grid, dust particles, film grain
    Cursor.jsx           Custom dot + trailing ring cursor
    Navbar.jsx           Glass nav, scroll-spy, mobile menu
    Hero.jsx             Headline, typewriter, parallax portrait
    Marquee.jsx          Infinite tech strip
    About.jsx            Animated code card + quick facts
    Services.jsx         Spotlight/tilt cards
    Skills.jsx           Animated bars + daily-driver stack
    Journey.jsx          Scroll-filling timeline
    Contact.jsx          Validated Formspree form with status states
    Footer.jsx           Sitemap, socials, oversized wordmark
  styles/
    base.css             Tokens, reset, typography, reveal system
    components.css       Navigation, buttons, overlays, cards, footer
    sections.css         Per-section layout, hero animation, responsive
legacy/                  The original HTML/CSS/JS site (kept as a backup)
```

## Editing content

Almost everything lives in **`src/data.js`**:

- `SOCIALS` — social links shown in the hero, contact card and footer.
- `SERVICES` — the three service cards.
- `SKILLS` — skill groups and percentages (bars animate to these values).
- `JOURNEY` — education / experience timeline entries.
- `STATS`, `TECH_STACK`, `TYPED_WORDS` — hero details and the skill chips.
- `CONTACT_ENDPOINT` — your Formspree form URL.

The portrait is `src/assets/img/daniel-avatar.webp` — replace the file (keeping
the name) or update the import in `src/components/Hero.jsx`. It is a 720×720
WebP (~37 KB) for fast loading; the original PNG is kept in `legacy/img/`.

## Design tokens

Colors, radii, fonts and motion curves are CSS variables at the top of
`src/styles/base.css` (`--crimson`, `--gradient-accent`, `--section-y`, …).
Change `--crimson` and the whole site re-themes.

## Accessibility & performance

- Every animation respects `prefers-reduced-motion`.
- Semantic landmarks, skip link, visible focus rings, ARIA labels on icon links.
- Custom cursor only appears on precise-pointer devices.
- Canvas particles pause when the tab is hidden; animations are composited
  transforms/opacity.

## Deploying

`npm run build` outputs `dist/`. Upload that folder to any static host.
For GitHub Pages, set the repository name as the base path in `vite.config.js`
(`base: "/your-repo/"`), then publish `dist/`.
