# Lesson 036 — Free Fall verification

## Prompt and mockup coverage

- Rebuilt the lesson as a live 2D drop-tower experiment with a generated transparent PNG apparatus asset.
- Implemented initial height, initial velocity, gravity, air-resistance, planet, minimum, typical, and maximum presets.
- Added a three-count release, continuous vertical motion, velocity vector, impact marker, stopwatch, pause, step, playback speed, and reduced-motion controls.
- Added synchronized position, velocity, and acceleration plots plus live numerical readings.
- Added an impact-time prediction mission with a 0.02 s acceptance tolerance.

## Physics verification

- The no-drag model uses `y = y0 + v0 t - 0.5 g t^2`, `v = v0 - gt`, and `a = -g`.
- The default 20 m Earth-gravity drop reaches the ground at 2.019 s.
- The optional air-resistance branch is numerically integrated with a small fixed time step and is explicitly described as quadratic drag.
- The ideal branch is independent of object mass, matching the lesson objective.

## Intentional deviations

- GLB/3D apparatus work is deferred per the user’s direction. The lesson uses the generated 2D PNG at `public/assets/experiments/free-fall/drop-tower.png` and CSS animation.
- Generated source retained at `C:/Users/saisa/.codex/generated_images/01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9/exec-e52ae382-cb84-44d6-8b1d-3015d7c70a74.png`.

## Browser and responsive QA

- Exercised Moon, Earth, Jupiter, minimum, typical, and maximum presets.
- Exercised countdown, 2x playback, impact completion, and challenge success.
- Corrected the mobile dark-banner heading contrast found during visual inspection.
- Captured desktop, tablet, and mobile viewport evidence in this directory.
- Console contained no application errors; only the existing React Router future-flag warnings were present.
