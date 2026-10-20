# Vigneshwaran S — Portfolio

Personal portfolio built with React 19, TypeScript, Vite, Tailwind CSS and Framer Motion, themed as a block-building game. Deployed on Vercel from this repository.

## The block world

Scrolling the page travels down through a pixel-art world drawn in code (no image assets): sky and surface at the top, caves with ores, deepslate with diamonds, the Nether with lava and a portal, and finally The End for the contact section and footer. All textures are generated at runtime in [`src/components/World/textures.ts`](src/components/World/textures.ts) and exposed to CSS as `var(--tex-<block>)`.

Game features:
- **Hotbar** at the bottom: one slot per section; click a slot or press 1–9 to jump.
- **XP bar** that fills as you scroll, and a **level** that counts the sections you have visited.
- **"Advancement Made!" toasts** the first time you reach each section.
- **Block breaking**: clicking anywhere throws pixel particles in the colours of the layer you are in.
- **Day/night** toggle (sun/moon button in the navbar).
- **Weather**: clear, rain or thunder (cloud button in the navbar), with lightning flashes.
- **Mobs**: pigs, sheep and chickens wander the surface; bats flutter in the caves.
- **Chat console**: press `T` (or `/`, or the chat button) and type `/help`. Commands include `/tp skills`, `/time set night`, `/weather rain`, `/sound on`, `/whoami`, `/projects`, `/email` and `/github`.
- **Crafting table** under the skills: pick a project and its technologies are placed in a 3×3 grid to craft it (ingredients come from each project's `technologies` list).
- **Sound effects** made with the Web Audio API (clicks, block breaks, level-ups, thunder). Off by default; turn them on with the speaker button or `/sound on`.
- A **floating voxel island** in the hero built from CSS 3D cubes; drag it to spin.
- Yellow **splash text** beside the title, an inventory-style skills grid, a title-screen intro, and stone, green and end-stone UI.

This is an original theme inspired by block-building games; it does not use any game's assets, logo or fonts.

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
    World/         textures, worldGen, WorldBackground, Hud (hotbar, XP, advancements), BlockBreak, VoxelIsland
    animations/    FadeIn, Magnet, AnimatedText, VaporType (hero name)
    ui/            ContactButton, LiveProjectButton, SectionHeading, TechIcon
    Intro/ Navbar/ Hero/ Marquee/ About/ Focus/ Skills/
    Projects/ Experience/ (MagicTransform) Education/ Certifications/ Contact/ Footer/
  data/portfolio.ts
  hooks/           useReducedMotion, useMousePosition (useFinePointer), useScrollProgress, useMediaQuery
```

## Performance notes

- The world is baked once into an offscreen canvas at 16 px per block and scaled up with nearest-neighbour filtering, so each frame is a single image copy plus a few glowing light sources. Animation runs at 24 fps and stops while the tab is hidden.
- Visitors who prefer reduced motion get a still world (no drifting clouds, flicker or particles), no block breaking, a non-spinning island and a scrollable technology strip.
- The hero name uses `VaporType`: the text stays real DOM text, and a canvas behind it draws the vapor. It pauses off screen and is plain text for reduced-motion visitors. It is written for this site, not the React Bits Pro component, and can be swapped for that once the licensed registry is available.
- The Experience section uses `MagicTransform`: each responsibility starts as a plain document, flies into a glowing core and comes out as a coloured result card. The result cards are always in the markup, so screen readers and reduced-motion visitors get the full list. Like `VaporType`, it is written for this site rather than taken from React Bits Pro.
