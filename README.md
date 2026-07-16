# Meridian Software — Landing Page

A dark, technical "blueprint" landing page for a software house offering
Web, Mobile, UI/UX and QA services. Built with React + TypeScript, Three.js,
GSAP (ScrollTrigger), and Tailwind CSS.

## Design system

| Token       | Value                          |
|-------------|---------------------------------|
| `ink-950`   | `#05070C` — page background     |
| `ink-800`   | `#0D1220` — card surfaces       |
| `cyan`      | `#5EEBFF` — primary accent      |
| `violet`    | `#9D7CFF` — secondary accent    |
| Display     | Space Grotesk                   |
| Body        | Inter                           |
| Mono/labels | JetBrains Mono                  |

**Signature element:** the hero's wireframe "lattice" (four ring layers
connected by struts) assembles itself node-by-node on load, then the same
layer metaphor reappears in the Tech Stack section as a literal
Client → Application → Data → Infrastructure diagram — the page's visual
language *is* the architecture it's selling.

## File structure

```
software-house-landing/
├── index.html
├── package.json
├── vite.config.ts              # manualChunks splits three/gsap into their own bundles
├── tailwind.config.ts          # design tokens (colors, fonts, blueprint grid bg)
├── tsconfig.json
├── postcss.config.js
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # composes all sections
    ├── index.css                # Tailwind layers + base/reduced-motion rules
    ├── lib/
    │   └── gsap.ts              # registers ScrollTrigger exactly once
    ├── hooks/
    │   ├── useThreeScene.ts     # generic Three.js lifecycle (setup/frame/dispose)
    │   └── useTilt.ts           # CSS 3D hover tilt for bento cards (no extra WebGL ctx)
    └── components/
        ├── layout/
        │   ├── Navbar.tsx
        │   └── Footer.tsx
        ├── Hero/
        │   ├── Hero.tsx         # headline overlay + entrance animation
        │   └── HeroScene.tsx    # the 3D lattice: build-in, parallax, scroll-scrub
        ├── Services/
        │   ├── ServicesGrid.tsx # bento grid, scroll reveal
        │   └── ServiceCard.tsx  # single card with tilt micro-interaction
        ├── TechStack/
        │   └── TechStackSection.tsx  # layered architecture diagram
        └── CTA/
            └── CTASection.tsx
```

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build to dist/
```

## Performance & memory notes

- **One `useThreeScene` hook, one lifecycle.** Every Three.js consumer
  creates its scene/camera/renderer in `setup()`, returns a cleanup
  function, and the hook still walks the full scene graph on unmount to
  dispose any geometry/material/texture a consumer's own cleanup missed —
  belt and suspenders against leaks.
- **Single draw call for all lattice nodes** via `THREE.InstancedMesh`
  instead of 40 individual meshes.
- **Pixel ratio capped at 2** (`maxPixelRatio`) so 3x/4x DPI phones don't
  render at a wasteful resolution.
- **Render loop pauses off-screen**: an `IntersectionObserver` on the hero
  container plus a `visibilitychange` listener stop `renderer.render()`
  calls entirely once the hero scrolls past or the tab is backgrounded.
- **No extra WebGL contexts for hover effects.** The Services bento grid
  uses a GSAP-driven CSS 3D tilt (`useTilt`) instead of mounting four more
  Three.js scenes — same perceived depth, near-zero GPU cost.
- **Code splitting**: `vite.config.ts` puts `three` and `gsap` in their own
  chunks so they're cached independently of app code changes.
- **Respects `prefers-reduced-motion`**: global CSS disables transitions/
  animations, and `useTilt` skips entirely when the media query matches or
  on touch devices (`hover: none`).
- **Visible focus states** are preserved (`:focus-visible` outline) rather
  than suppressed for aesthetics.

## Extending

- Swap the placeholder copy/tools in `ServicesGrid.tsx` and
  `TechStackSection.tsx` with real case studies and your actual stack.
- The lattice geometry (`LAYER_COUNT`, `NODES_PER_LAYER` in
  `HeroScene.tsx`) is parametric — raising `NODES_PER_LAYER` costs nothing
  extra per-node since it's a single instanced draw call.
- Wire `CTASection.tsx`'s form `onSubmit` to your backend/API endpoint.
