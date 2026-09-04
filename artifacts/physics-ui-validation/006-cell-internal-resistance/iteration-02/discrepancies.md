# Lesson 006 visual comparison and verification

## Match to the supplied mockup

- Recreated the pale instrument-panel layout, large apparatus stage, right-side circuit parameters, analog/digital meters, observation table, V–I graph, physics equations, presets, and challenge card.
- The supplied GLB is rendered as the real orbitable apparatus instead of rebuilding the mockup's photorealistic bench as a flat image. The GLB itself is deliberately stylized and contains a cell/electrolyte assembly rather than separate photorealistic panel meters and rheostat; computed meters and the load control remain live UI around it.
- The app shell and its compact navigation rail are preserved as required, so the lab begins below the existing global toolbar instead of replacing it with the mockup's header.
- The mockup's optional wire-drag mode is represented by an explicit, testable meter-connection control because the lesson prompt requires connection validation; incorrect wiring isolates the simulation and gives non-colour feedback.

## Interaction and scientific verification

- Desktop 1440×900, tablet 900×1100, and mobile 390×844: no horizontal overflow.
- Default closed circuit: I = 0.259 A and V = 1.293 V for E = 1.50 V, r = 0.80 Ω, R = 5.0 Ω.
- Automatic series recorded R = 20, 10, 5, 2, 1, 0.5 Ω. The graph fit returned intercept 1.500 V, slope −0.800 V/A, and R² = 1.000.
- Hidden-cell mission completed with r = 0.80 Ω and specific slope feedback.
- Protected short and incorrect meter connection both returned zero current with explicit warnings.
- Play, pause, resume, step, 0.25×–2× speed, reduced motion, orbit drag, touch drag, wheel zoom, named-part selection, Reset View, and Reset Experiment were exercised.
- Transparent effect textures remain alpha/additive sprites and pause with the run state.
- Browser runtime had no error-level console entries; the only warnings were pre-existing React Router future-flag notices.

