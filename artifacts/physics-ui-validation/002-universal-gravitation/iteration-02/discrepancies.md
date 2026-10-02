# Lesson 002 visual correction record

## Target fidelity

- Matched the reference's dark scientific-workstation composition: large field viewport, narrow parameter bank, and lower readings/graph/formula strip.
- Used the supplied `universal-gravitation.glb` and both supplied effect textures.
- Replaced the generic route content with a lesson-scoped experience while preserving the global app navigation.

## Deliberate deviations

- Field arrows and equipotential contours are computed live from the two-mass model instead of being static artwork.
- The supplied 3D masses sit beneath an SVG scientific overlay so the field, probe, and analytic zero point remain crisp and measurable.
- The narrow-screen layout stacks the controls and data panels to preserve readable input labels and prevent horizontal overflow.
- Explicit Mass A/Mass B selectors supplement direct mesh selection for keyboard and touch accessibility.

## Verification

- Desktop: 1440×900, no horizontal overflow.
- Tablet: 900×1100, no horizontal overflow; two-column control bank.
- Mobile: 390×844, no horizontal overflow; single-column controls and adaptive 3D camera.
- Interaction: min/mid/max parameter values, draggable and keyboard-operable probe, play/pause/resume/step/reset, 0.25–2× playback, reduced motion, four presets, zero-field mission, 3D rotation/zoom/reset, and named mass selection.
- Runtime: WebGL canvas loaded, no Vite error overlay, no `NaN` or `Infinity` output on a clean route load. Only the app's pre-existing React Router future warnings were observed during development.
- Scientific validation: Earth–Moon force, Newton's third law, inverse-square scaling, vector superposition, and singularity protection all pass.
