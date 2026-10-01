# William Wu — portfolio

Next.js (App Router) + TypeScript + three.js. A real-time Coast Mountains river valley
fills the background. Scrolling flies the camera down the river and dives it into a
deep fjord; projects float past as glass bubbles.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in /out (deploy to Vercel, Netlify, GitHub Pages…)
```

## Where things live

| File | What it does |
| --- | --- |
| `lib/content.ts` | All copy: bio, experience, projects, stack, links. Edit here. |
| `components/Scene.tsx` | The WebGL world: terrain, water (above + below), trees, kelp, light shafts, particles, scroll-driven camera path. |
| `components/ProjectBubbles.tsx` | Pinned right-to-left bubble carousel driven by scroll. |
| `components/Dock.tsx` | Depth gauge + Golden / Blue hour / Night switch. |
| `lib/sceneBus.ts` | Tiny store that connects the mood buttons to the scene. |
| `app/globals.css` | Design tokens and all styles. |

## Tuning

- **Camera path:** `KF` in `Scene.tsx` (one row per keyframe) is tied to the section
  ids `about`, `experience`, `work`, `stack` in `measure()`. Add a section → add a keyframe.
- **Where you dive:** keyframes 3→4 cross `y = 0`, which lines up with the top of `#work`.
- **Carousel length:** the pinned section is `N * 75 + 100` svh tall in `ProjectBubbles.tsx`;
  lower 75 for faster bubbles.
- **Bubble colour:** each project's `hue` in `content.ts`.
- **Fonts** load from Google Fonts in `app/layout.tsx`; swap to `next/font/google` if you like.
