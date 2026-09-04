# Lesson 065 — Calorimetry Mixing Lab

## Iteration 01

- The live thermometer initially displayed the energy-weighted mixture mean before the samples were poured. It now reads the calorimeter/cold-sample temperature at `t = 0` and follows the calorimeter temperature during exchange.
- The idle state originally read `POURING` and showed animated streams. It now reads `READY TO POUR`; streams appear only from `0 < t < 8 s` and their CSS animation pauses with the simulation.

## Iteration 02

- Desktop (1440×900), tablet (820×1180), and mobile (390×844) have no horizontal overflow, broken images, alerts, or off-screen lab controls.
- Keyboard range extrema, material presets, prediction feedback, unknown-specific-heat mission, replay, play/pause, step, speed, reduced motion, reset, and heat-loss toggle were exercised in the rendered app.
- Insulated equilibrium: predicted `49.53 °C`, rendered stable reading `49.52 °C`, `ΣQ = 0.0e+0 J`, closure `0.0e+0%` (rounding only).
- Heat-loss case at `27 °C` ambient: rendered `47.52 °C`, with `Qsurroundings = 2559.7 J` and `ΣQ = 0.0e+0 J`.
- The supplied `concept-effect.png` and `interaction-overlay.png` are retained beside the generated asset for traceability, but are not composited: their fixed particle states would conflict with the time-dependent SVG particles.
- Per the project direction, the GLB asset was deliberately not used. The visible station is a generated transparent PNG augmented with state-driven SVG fluids, pour streams, particles, thermometer, and graph.

## Result

No lesson-specific visual or functional discrepancy remains. The two console warnings are pre-existing React Router v7 future-flag notices; no runtime errors were recorded.
