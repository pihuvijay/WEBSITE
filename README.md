# Pihu Vijaywargiya, Portfolio

A personal portfolio site built around a scroll-driven animation: a handbag
tips over and six objects spill down a set of stone steps, each one linking
to a project section. The bag is the styling; the substance is the
engineering work each object represents.

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [react-router-dom](https://reactrouter.com/) for routing
- [@react-spring/web](https://react-spring.dev/) for the Contact page's
  pen-drop animation
- Plain CSS (`src/styles/global.css`), no CSS framework
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
npm install
npm run dev       # start the dev server on http://localhost:3000
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
index.html                  Page shell, meta tags, font loading
src/
  main.jsx                  App entry point
  App.jsx                   Router setup
  context/SpillContext.jsx  Tracks whether the hero spill animation has finished
  components/
    Sidebar.jsx              Fixed left-hand nav (Work / About / Contact + socials)
    DriftingIcon.jsx         Ambient drifting GitHub mark shown post-spill
    icons.jsx                Inline SVG icon components
  pages/
    Home.jsx                 Hero scroll animation, hotspots, and all project sections
    About.jsx                About section content
    Contact.jsx              Contact section content and pen-drop animation
  styles/global.css          All site styling
public/
  frames/                    Sequential PNG frames for the scroll-scrubbed animation
  images/                    Background image(s)
  favicon.svg, robots.txt, _redirects
```

## How the hero animation works

`Home.jsx` renders a `<canvas>` inside a tall (`500vh`) scroll track. As the
user scrolls, scroll progress is mapped to a frame index and the matching
PNG from `public/frames/` is drawn each `requestAnimationFrame`. Once the
spill settles, invisible hotspot markers become clickable and scroll the
page to the matching project section; normal scrolling then continues
through the rest of the sections.

Frame configuration (path, filename pattern, frame count) lives in the
`FRAMES` constant at the top of `Home.jsx`. Hotspot positions and labels
live in the `HOTSPOTS` array in the same file, as percentages of the
viewport.

## Content

Project copy, metrics, and skills lists live directly in `Home.jsx`
(`SKILLS_BY_SECTION` and the JSX for each `<section>`), `About.jsx`, and
`Contact.jsx`. There is no CMS; content changes are made by editing these
files directly.

## Deployment

The site is a static Vite build deployed on Vercel. `vercel.json` rewrites
all routes to `index.html` (for client-side routing) and sets baseline
security headers (`X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`).
