# JM — Portfolio

A static personal portfolio for JM — IT student & web developer. Plain
HTML, CSS and JavaScript: no framework, no build step, no dependencies.

## Project structure

```
index.html                 Whole page markup + content
assets/
  css/style.css            Design tokens, layout, animation, responsive rules
  js/main.js               Scroll reveal, nav, lightbox, cursor, form handling
  images/                  Avatar, textures, favicons
    projects/              Project screenshots (full size + thumbnails)
projects/                  Self-contained interactive demos, linked from the
                           Projects section (camper-cafe, js-live-demo,
                           shoesite, tnc-login)
.github/workflows/deploy.yml   Publishes the site to GitHub Pages on push
```

## Local preview

There is nothing to install. Open `index.html` directly, or serve the folder so
the demo links resolve the same way they will in production:

```bash
python -m http.server 8080      # then open http://localhost:8080
```

## Editing content

- **Text and sections** live directly in `index.html`, in the order they appear
  on the page. Project cards carry a `src` thumbnail and a `data-image`
  full-size path used by the lightbox.
- **Colours, radii, fonts and spacing** are CSS variables at the top of
  `assets/css/style.css`. Change the accent variable and the site re-themes.
- **Behaviour** (scroll reveal, sticky nav, scroll-spy, project lightbox,
  back-to-top, contact form) is a single IIFE in `assets/js/main.js`.

## Contact form

`assets/js/main.js` posts the field values as JSON to Formspree
(`https://formspree.io/f/xdeezyqq`). On failure it shows a mailto fallback to
`jmmarquez@gmail.com`. Swap the endpoint URL to point the form somewhere else.

## Accessibility & performance

- Every animation is gated on `prefers-reduced-motion` in both
  `assets/js/main.js` and `assets/css/style.css`.
- The custom cursor only initialises on fine-pointer, hover-capable devices.
- Images are served at their original PNG/JPG quality; the largest ones are the
  project screenshots under `assets/images/projects/`.

## Deploying

`.github/workflows/deploy.yml` uploads the site directory straight to GitHub
Pages — no build job, because there is nothing to compile.

1. In repo **Settings → Pages → Build and deployment**, set **Source** to
   **GitHub Actions**.
2. Push to `main`. Edits to `index.html`, `assets/**` or `projects/**` trigger a
   deploy; a **Run workflow** button is also available for manual deploys.
