# Motion Showreel

A code-driven personal showreel built with **Remotion** (React for video). Every cut, title, 3D card wall, counter and transition is a React component timed to the music's beat grid, so the whole reel can be re-edited by changing data instead of scrubbing a timeline.

> Only the code is published. Footage, music and thumbnails are third-party or personal media and are not included, so the project does not render as-is.

## What's in it

- **Beat-synced editing:** each segment is declared in beats (`{beats: 4, render: ...}`); `tools/beats.py` estimates the track's tempo and energy so cuts land on the beat.
- **Kinetic typography:** slam words, chapter cards and knock-out text over footage (`kinetic.tsx`).
- **3D scenes:** perspective title wall, 3D grids of vertical videos, triptychs with animated view counters and an end card (`space.tsx`).
- **Story scenes:** kill-shot wall, event-staff index, AI-video reel with talking segments, manifesto wall (`scenes.tsx`).
- **Shared look:** film grain, vignette, reveal animations, index card navigation and a small design-token theme (`components.tsx`, `theme.ts`).
- **Clip prep scripts:** PowerShell + FFmpeg scripts that cut, crop and normalise every source moment to 30 fps H.264 (`tools/cut*.ps1`).

## Structure

```text
src/
  Root.tsx        composition (1920x1080, 30 fps)
  Showreel.tsx    the edit: sections, segments and beat timing
  space.tsx       3D title wall, grids, triptych, statement, end card
  scenes.tsx      kill wall, event index, AI reel, manifesto wall
  kinetic.tsx     words, chapters, knock-out clips, flashes
  components.tsx  grain, vignette, footage, reveal, counters, index card
  theme.ts        colours and fonts
tools/
  beats.py        tempo and beat detection for the music track
  cut.ps1 cut2.ps1  FFmpeg clip preparation
```

## Run

```bash
npm install
npm run studio   # opens Remotion Studio (needs media in public/)
npm run render   # renders out/showreel.mp4
```

## Tech stack

TypeScript · React · Remotion · FFmpeg · Python (beat detection) · PowerShell

---

© 2026 yunalhoshi. All rights reserved. See [NOTICE](NOTICE).
