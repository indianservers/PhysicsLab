# Lesson 037 — Friction verification

## Prompt and mockup coverage

- Rebuilt the route as a dedicated 2D block-and-force-sensor bench using a generated transparent PNG apparatus.
- Implemented applied force, mass, static coefficient, kinetic coefficient, incline toggle, and minimum/typical/maximum presets.
- Added play, pause, step, slow automatic force ramp, playback speed, reduced motion, force vectors, breakaway highlighting, and live block travel.
- Added a force sensor, static limit, signed friction, net force, acceleration, and friction-versus-applied-force plot.
- Added a measurement mission that recovers both coefficients from threshold and sliding readings.

## Physics verification

- Static friction is signed opposite the force tendency and satisfies `|fs| ≤ μsN`.
- At breakaway the magnitude drops to kinetic friction, `|fk| = μkN`.
- The incline branch uses `N = mg cosθ` and subtracts `mg sinθ` along the plane.
- The default setup breaks away at 7.06 N and slides with 5.88 N kinetic friction.
- The interface enforces `μk ≤ μs`.

## Intentional deviations

- GLB/3D work is deferred per the user’s direction. Live HTML/CSS/SVG layers supply the scientific animation.
- The generated app asset is `public/assets/experiments/friction/friction-bench.png`; its retained source is `C:/Users/saisa/.codex/generated_images/01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9/exec-c4646b0a-9c9b-4f34-8b5a-b76e8583f6a5.png`.
- The supplied generic radial-arrow effects were inspected but not used because they do not encode friction direction or magnitude.

## Browser and responsive QA

- Exercised minimum, typical, maximum, incline, playback, pause, step, 2× ramp, reduced motion, and reset.
- Observed the transition from adaptive static friction through impending motion to kinetic sliding.
- Completed the coefficient-measurement mission with immediate specific feedback.
- Corrected an apparatus stacking issue discovered during pointer testing so controls remain unobstructed.
- Captured desktop, tablet, and mobile viewport evidence in this directory.
- A clean browser tab reported no application console errors; only the existing React Router future-flag warnings remain.
