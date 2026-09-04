# Lesson 042 — Projectile Motion

## Deliberate visual deviation

- Per the current product direction, the supplied GLB was not integrated. The launcher and target use a generated true-alpha PNG sprite while the trajectory, projectile, component ghosts, vectors, graphs, and target position remain live 2D DOM/SVG.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-b2f22c50-396b-4160-beb0-5d24015d0a69.png`.
- Application asset: `public/assets/experiments/projectile-motion/launcher-target.png`.
- Alpha was verified as RGBA with a 0–255 alpha range.

## Scientific behavior implemented

- No-drag motion uses `x = v0 cos(theta)t`, `y = h0 + v0 sin(theta)t - gt^2/2`, `vx = v0 cos(theta)`, and `vy = v0 sin(theta) - gt`.
- Time of flight is solved for the positive ground-intersection root; peak height follows the vertical component.
- The shortcut `R = v0^2 sin(2theta)/g` is declared valid only for level-ground, no-drag trials.
- Optional air resistance uses deterministic small-step quadratic-drag integration and changes the trajectory, velocity, peak, time, and range.
- Complementary-angle comparison is limited to its valid level-ground/no-drag case.
- The target mission evaluates closest approach and accepts a hit within 1.5 m.

## Interaction and responsive verification

- Exercised minimum, typical, and maximum presets; air resistance and its coefficient; play, pause, step, scrub model, complementary comparison, reset, and successful target solution.
- Verified desktop, 820×1180 tablet, and 390×844 mobile layouts.
- No runtime console errors were observed. Existing React Router future-flag warnings remain unchanged.
