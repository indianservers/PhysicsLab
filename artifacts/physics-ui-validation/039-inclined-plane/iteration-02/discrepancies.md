# Lesson 039 — Inclined Plane verification

## Prompt and mockup coverage

- Rebuilt the route as a dedicated 2D adjustable-ramp experiment using a generated transparent PNG apparatus.
- Implemented incline angle, mass, friction coefficient, signed applied upslope force, and minimum/typical/maximum presets.
- Added resolved weight, normal, friction and applied-force behavior, conditional block motion, play, pause, step, playback speed, and reduced motion.
- Added a slow angle sweep through the critical angle with held, impending and sliding states.
- Added an angle-of-repose mission that recovers `μs` from `tan θcritical`.

## Physics verification

- Parallel weight is `mg sinθ` and normal force is `mg cosθ`.
- Static friction matches the force tendency up to `μsN`; kinetic friction is modeled as `0.8 μsN` after breakaway.
- The critical angle is `θcritical = atan(μs)`, so `tanθcritical = μs`.
- Positive applied force is explicitly defined upslope and friction remains opposite motion or impending motion.

## Intentional deviations

- GLB/3D work is deferred per the user's direction. The generated PNG and live HTML/CSS overlays provide the ramp rotation, block travel and vectors.
- App asset: `public/assets/experiments/inclined-plane/inclined-plane-rig.png`.
- Retained source: `C:/Users/saisa/.codex/generated_images/01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9/exec-fa7864bd-e8d7-441a-ba46-73f7aa853f4a.png`.

## Browser and responsive QA

- Exercised minimum, typical and maximum inputs, pause, step, 2× angle sweep, reduced motion, and reset.
- Observed breakaway above the default 19.29° critical angle and completed the coefficient mission.
- Captured desktop, breakaway interaction, tablet and mobile evidence in this directory.
- A clean browser tab reported no application console errors; only existing React Router future-flag warnings remain.
