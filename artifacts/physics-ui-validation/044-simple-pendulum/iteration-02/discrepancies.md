# Lesson 044 — Simple Pendulum

- Followed the user's current direction to defer 3D: the apparatus is a generated transparent PNG with a live CSS/React string-and-bob animation.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-49bcc5ec-aa9d-4295-a6f9-8bd578c4a71b.png`.
- App asset: `public/assets/experiments/simple-pendulum/pendulum-stand.png` (RGBA, transparent background verified).
- Physics uses the nonlinear equation `theta'' + b theta' + (g/L)sin(theta) = 0`; the small-angle period is explicitly labeled approximate and a finite-amplitude correction is displayed.
- Added string length, amplitude, gravity, damping, and bob-mass controls; min/typical/max presets; play, pause, step, replay, speed, reduced-motion, and draggable release controls.
- Photogate timing, angle/time trace, kinetic/potential energy graph, mass-independence readout, and a measured-period local-gravity mission are live. The mission recovered 9.81 m/s² with a 0.09 m/s² error in browser validation.
- Checked at 1440×900, 820×1180, and 390×844. No console errors were reported. The narrower layout intentionally stacks the controls, stage, readings, graphs, and mission.
