# Lesson 005 visual correction record

## Target fidelity

- Recreated the reference's light capacitor workbench with live GLB geometry, field arrows, controls, network board, equivalent comparison, readings, equations, and mission strip.
- Bound the four named GLB plates to spacing and area; dielectric, voltage, and charging state drive field/effect intensity.
- Included both supplied transparent effect layers.

## Deliberate deviations

- The supplied GLB is a compact stylized four-plate assembly rather than the photoreal rail apparatus, so dimensions and field arrows remain readable screen-space annotations.
- Network capacitors are identical copies of the main geometry capacitor; this makes the single/series/parallel comparison directly traceable to C=κε₀A/d.
- The network board offers both native drag/drop cards and explicit arrangement buttons, preserving full keyboard and touch access.
- The mockup's disconnected constant-charge extension is replaced by an explicit discharge state, avoiding an unsupported held-charge assumption while making the control physically deterministic.

## Verification

- Desktop 1440×900, tablet 900×1100, mobile 390×844; no horizontal overflow.
- Plate area, spacing, dielectric constant, and voltage tested at minimum, typical, and maximum values; material presets update real calculations.
- Charge/pause/resume/step, discharge/reconnect, 0.25–2× playback, reduced motion, reset, named plate selection, camera rotation/zoom/reset tested.
- Acceptance: C=κε₀A/d, Q=CV, U=½CV²; three equal series capacitors give C/3 and parallel gives 3C.
- Maximum-energy mission completed with three capacitors in parallel; click/touch fallback and drag/drop handlers share the same state transition.
- WebGL canvas loaded, no Vite error overlay, invalid numbers, clipping, or horizontal overflow. Pre-existing React Router future warnings are unchanged.
