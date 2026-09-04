# Lesson 041 — Newton's Second Law

## Deliberate visual deviation

- Per the current product direction, the supplied GLB was not integrated. The lesson uses a generated transparent PNG apparatus plus live 2D DOM/SVG motion, force vectors, ticker marks, graph points, and feedback.
- Final generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-fa56ccbc-26f1-4746-ab1b-ad210216b9c7.png`.
- Application asset: `public/assets/experiments/newton-s-second-law/dynamics-track.png`.
- Alpha was verified as RGBA with a 0–255 alpha range. An earlier checkerboard-baked draft was rejected and replaced.

## Scientific behavior implemented

- `Fnet = sign(Fapplied) max(0, |Fapplied| - Ffriction)` and `a = Fnet/m`.
- Every trial starts from `x0 = 0`, `v0 = 0`; motion uses `v = at` and `x = 1/2 at²`.
- Sampling interval controls deterministic ticker/position samples.
- Completed trials persist in the table and both graph overlays.
- Acceleration–net-force slope is `1/m`; acceleration–inverse-mass slope is `Fnet`.
- The mission accepts two distinct force–mass designs whose accelerations agree within 0.05 m/s².

## Interaction and responsive verification

- Exercised minimum, typical, and maximum presets; play, pause, step, reset, trial recording, and mission completion. Presets cover all four learner-control bounds.
- Verified responsive layouts at desktop, 820×1180 tablet, and 390×844 mobile widths.
- No runtime console errors were observed. Existing React Router future-flag warnings remain unchanged.
