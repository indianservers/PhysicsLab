# Lesson 038 — Hooke's Law verification

## Prompt and mockup coverage

- Rebuilt the route as a dedicated 2D precision spring-extension experiment using a generated transparent PNG spring stand.
- Implemented load mass, spring constant, natural length, damping, permanent-deformation option, and minimum/typical/maximum presets.
- Added calibrated 50 g, 100 g, 200 g, and 500 g mass controls that record real equilibrium measurements one at a time.
- Added damped oscillatory settling, play, pause, step, playback speed, reduced motion, extension marker, force/extension/length/energy readouts, graph, and data table.
- Added a hidden-spring mission that determines `k` from the measured force-extension slope.

## Physics verification

- Equilibrium uses `F = mg = kx`, hence `x = mg/k`.
- The elastic-region graph has slope `ΔF/Δx = k` with units N/m.
- Stored energy uses `U = ½kx²`.
- Exceeding the configured 0.18 m elastic limit always displays a warning.
- Permanent deformation is applied only when explicitly enabled and reports the residual set.

## Intentional deviations

- GLB/3D work is deferred per the user's direction. The generated apparatus PNG and live HTML/SVG overlays provide the animation.
- App asset: `public/assets/experiments/hooke-s-law/spring-stand.png`.
- Retained source: `C:/Users/saisa/.codex/generated_images/01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9/exec-5db96517-4938-4257-afcf-00d7baed1175.png`.

## Browser and responsive QA

- Exercised all condition presets, all four mass increments, pause, step, 2× playback, reduced motion, permanent deformation, and reset.
- Recorded three graph points, observed the elastic-limit warning and permanent-set reading, and completed the hidden-spring mission.
- Captured desktop, tablet, and mobile viewport evidence in this directory.
- A clean browser tab reported no application console errors; only the existing React Router future-flag warnings remain.
