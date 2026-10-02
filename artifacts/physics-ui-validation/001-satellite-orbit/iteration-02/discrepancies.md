# Iteration 02 verification record

## Corrected

- Rebuilt the first viewport around the target's large dark experiment stage, compact launch controls, measurement/graph/formula row, and three learning cards.
- Added synchronized launch speed, altitude, planet mass, satellite mass, and direction controls with bounded range and numeric input paths.
- Added inverse-square velocity-Verlet integration, continuous trajectory trail, inward gravity and tangential velocity vectors, collision/bound/circular/escape classification, energy sign, eccentricity, angular momentum, and live measurements.
- Loaded the supplied named-node GLB and both transparent PNG effects with alpha/additive blending.
- Added scene selection, part dragging, background orbit rotation, wheel/pinch zoom, keyboard rotation/zoom, Reset View, responsive camera framing, and reduced-motion behavior.
- Added Play, Pause, Resume, Step, Reset/Replay, 0.25×–2× playback, presets, and the two-stage circular-orbit/escape mission.
- Desktop, laptop, tablet, and 390×844 layouts have no horizontal overflow; mobile stacks controls below the real WebGL stage.
- A fresh browser load produced no console errors and loaded exactly one WebGL canvas.

## Deliberate deviations

- The existing application toolbar and side navigation remain intact, as required, instead of copying the mockup's unrelated navigation chrome.
- The supplied GLB is intentionally low-poly; it is used as authoritative rather than replacing it with the photorealistic Earth visible in the mockup.
- Planet mass is included in addition to the mockup's satellite-mass control because the lesson prompt explicitly requires planet-mass manipulation. Desktop pairs secondary controls to keep the full experiment within the first viewport.

## Evidence

- `desktop.png` — clean 1440×900 default state.
- `mobile.png` — clean 390×844 responsive state.
- `circular-orbit.png` — circular-orbit mission stage.
- `escape-mission.png` — live positive-energy escape trail and completed mission.
