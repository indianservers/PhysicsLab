# Lesson 045 — Uniform Motion

- Followed the user's current direction to defer 3D. The generated transparent PNG supplies the track and sensors; the cart, velocity arrow, equal-time markers, readings, and graph cursors are live React/CSS/SVG layers.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-9b74271c-596a-40f1-8e8f-12f2595402b5.png`.
- App asset: `public/assets/experiments/uniform-motion/linear-track.png` (2172×724 RGBA; transparent alpha verified).
- Physics uses `x=x0+vt`, signed velocity, zero acceleration, constant x–t slope, horizontal v–t graph, and equal marker spacing `|v|Δt` from one authoritative state.
- Added speed, starting-position, direction, and observation-interval controls; min/typical/max presets; play, pause, step, replay, exact scrubbing, playback speed, and reduced motion.
- The future-position mission was completed in-browser at 1.55 m. Negative direction produced −0.45 m/s and −0.045 m displacement after 0.10 s.
- Checked at 1440×900, 820×1180, and 390×844. No console errors were reported. The mobile layout preserves the animated stage, controls, measurements, graphs, and mission in a vertical flow.
