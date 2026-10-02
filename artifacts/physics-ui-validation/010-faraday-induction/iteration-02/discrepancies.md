# Lesson 010 visual and interaction review

- The production lesson follows the supplied mockup's control / apparatus / live-graph composition and uses a generated transparent 2D apparatus cutout for the coil, galvanometer, oscilloscope, wiring, and rail.
- Per user direction, the supplied GLB is deliberately not loaded. The global application's existing 3D navigation tab remains unchanged, but the dedicated lesson itself uses only 2D image, DOM, and SVG animation.
- The bar magnet, field-effect layer, galvanometer needle, current cue, phase narration, and graph cursor are independent live layers rather than a pre-rendered animation.
- The existing PhysicsLab header, navigation rail, lesson metadata, mode tabs, and footer remain around the mockup-specific lab.
- At tablet width the graph panel moves below the apparatus; at mobile width the stage appears before the stacked controls and graphs. Root-page width remains within the viewport at 900 px and 390 px.

## Scientific and interaction verification

- Implemented `Φ = BA exp[-(x/σ)²]`, `dΦ/dt = (dΦ/dx)v`, `ε = -N dΦ/dt`, and `I = ε/R` in SI units.
- Entry and withdrawal at symmetric positions produced `-11.30 V` and `+11.30 V`, with clockwise and counter-clockwise current respectively.
- Centre crossing and rest both displayed `0.00 V`; no negative-zero notation remains after clamping numerical roundoff.
- Minimum, typical, and maximum setup presets exercised all control endpoints.
- Play, pause, resume, step, replay, playback rate, and reduced-motion controls were exercised.
- A complete pass recorded equal and opposite `+22.60 V` / `-22.60 V` peaks and passed the mission at 0.0% mismatch.
- Prediction feedback, pole/direction controls, keyboard magnet motion, and mobile touch drag were exercised.
- Desktop, tablet, mission, and mobile screenshots were captured with no browser console errors.

## Generated asset

- `public/assets/experiments/emi-faraday/faraday-apparatus.png`
- Built-in image generation prompt: transparent front-view scientific apparatus cutout with a copper solenoid, optical bench, center-zero galvanometer, oscilloscope and wiring; clear left rail for a separately animated magnet; no magnet, labels, field lines, logos, watermark, background rectangle, or halo.
