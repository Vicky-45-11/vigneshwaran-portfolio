# Vigneshwaran S — Portfolio

Personal portfolio built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion and Three.js. Deployed on Vercel from this repository.

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
npm run lint     # oxlint
```

## Editing content

All personal content (headline, skills, projects, experience, education, certifications, contact details) lives in [`src/data/portfolio.ts`](src/data/portfolio.ts). Components only read from it.

To add a repository or live link to a project, set `sourceUrl` or `liveUrl` on that project. Until then the card links to the GitHub profile and no "live project" button is shown.

## Structure

```
src/
  components/
    3d/            NeuralOrb (lazy three.js scene + CSS fallback)
    animations/    FadeIn, Magnet, AnimatedText, VaporType (hero name)
    Cursor/        SplashCursor (React Bits WebGL fluid cursor) + PortfolioCursor wrapper
    ui/            ContactButton, LiveProjectButton, SectionHeading, TechIcon
    Intro/ Navbar/ Hero/ Marquee/ About/ Focus/ Skills/
    Projects/ Experience/ Education/ Certifications/ Contact/ Footer/
  data/portfolio.ts
  hooks/           useReducedMotion, useMousePosition (useFinePointer), useScrollProgress, useMediaQuery
```

## Performance notes

- three.js is loaded with a dynamic import only when the orb is about to render, and is split into its own chunks (`vite.config.ts`), so it is not part of the initial download.
- The orb's render loop pauses when it is off screen or the tab is hidden, and caps the pixel ratio.
- Visitors who prefer reduced motion get static content, no fluid cursor and a scrollable (non-animated) technology strip.
- If WebGL is unavailable, a CSS version of the orb is shown instead.
- The fluid cursor (`SplashCursor`) is lazy-loaded after the intro, uses lower quality on touch devices, and draws nothing where WebGL2 is unavailable. Its canvas ignores pointer events, so links and buttons work as normal.
- The hero name uses `VaporType`: the text stays real DOM text, and a canvas behind it draws the vapor. It pauses off screen and is plain text for reduced-motion visitors. It is written for this site, not the React Bits Pro component, and can be swapped for that once the licensed registry is available.
