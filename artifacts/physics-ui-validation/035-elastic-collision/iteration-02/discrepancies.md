# Lesson 035 — Elastic Collision visual review

- The supplied GLB was deliberately omitted under the user's current 2D-first direction. A generated transparent air-track PNG supplies the apparatus; the two carts, velocity labels, compression, phase status, timeline and conservation displays are live elements.
- Analytic 1D collision velocities use momentum conservation with `v₂f−v₁f=e(u₁−u₂)`. Momentum is conserved for every restitution value from 0 to 1; kinetic energy is additionally conserved when `e=1`.
- Cart centres meet continuously at `t=0`. The contact window visibly compresses both bumpers and advances at one-quarter local speed before separation; the timeline can also be stepped or scrubbed.
- Controls cover mass A/B, signed velocity A/B, restitution, minimum/elastic/maximum presets, Play/Pause/Step, 0.25×–2× playback, reduced motion and Reset. Non-closing initial conditions disable Run with a specific explanation.
- The mission correctly accepted equal masses, stationary B and `e=1`: cart A stopped at `0.00 m/s` and cart B departed at `3.00 m/s`.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-47eaa8d5-71ad-4946-abe7-bd4e7d24c345.png`; app copy: `public/assets/experiments/elastic-collision/air-track.png`.
- Desktop 1440×900, tablet 820×1180, mobile 390×844 and a contact-state frame were captured. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
