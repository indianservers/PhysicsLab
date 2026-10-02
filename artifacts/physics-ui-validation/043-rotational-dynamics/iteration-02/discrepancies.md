# Lesson 043 — Rotational Dynamics

## Deliberate visual deviation

- Per the current product direction, the supplied GLB was not integrated. A generated true-alpha PNG supplies the flywheel apparatus; rotation, radial mass handles, tangential force, measurements, history, graphs, and mission remain live 2D DOM/SVG.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-1cbb70ff-929b-4b7e-87bd-17056338e900.png`.
- Application asset: `public/assets/experiments/rotational-dynamics/rotational-rig.png`.
- Alpha was verified as RGBA with transparent pixels present.

## Scientific behavior implemented

- Tangential torque uses `tau = rF`.
- Total inertia uses `I = 1/2 M R^2 + 2 m r^2` for the solid disk and two symmetric point masses.
- Angular acceleration uses `alpha = (tau_applied - b omega)/I`.
- Angular momentum and rotational energy use `L = I omega` and `K = 1/2 I omega^2`.
- Releasing torque produces constant-speed coasting at zero damping and deceleration with viscous axle damping.
- The matched-alpha mission verifies two distinct mass-distribution/torque configurations within 0.05 rad/s^2.

## Interaction and responsive verification

- Exercised minimum, typical, and maximum presets; play, pause, step, apply torque, release/coast, reset, speed, reduced-motion semantics, and mission completion.
- Direct pointer dragging changed both radial mass position and tangential force (`0.25 m` and `2.65 N` observed after drag).
- Verified desktop, 820x1180 tablet, and 390x844 mobile layouts with no runtime console errors.
