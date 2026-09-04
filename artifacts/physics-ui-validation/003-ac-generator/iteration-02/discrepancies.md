# Lesson 003 visual correction record

## Target fidelity

- Recreated the reference's generator workbench: large apparatus viewport, light control bank, synchronized lower instrument strip, phase cue, and compact learning challenge.
- Loaded the supplied `ac-generator.glb`, preserved its hierarchy, and bound `rotating_coil` and `shaft` to the authoritative coil angle.
- Used both transparent effect textures with alpha/additive rendering.

## Deliberate deviations

- The supplied GLB is a simplified teaching asset rather than the photoreal apparatus shown in the mockup; screen-space N/S, field, angle, and phase labels retain the mockup's teaching structure.
- The oscilloscope uses coil angle on the horizontal axis so it remains inspectable while paused; frequency still derives from ω/(2π).
- Named part buttons supplement orbit interaction for reliable touch and keyboard selection.
- The mobile layout stacks the workbench, controls, instruments, and mission instead of shrinking the control bank into an unreadable overlay.

## Verification

- Desktop 1440×900, tablet 900×1100, and mobile 390×844; no horizontal overflow.
- GLB/WebGL loaded; orbit keyboard controls, zoom keys, Reset View, and five named part selectors tested.
- Angle, angular speed, turns, coil area, and field tested at minimum, typical, and maximum values.
- Narrated revolution, continuous rotation, pause/resume, 15° step, 0.25–2× playback, direction reversal, polarity reversal, reset, and reduced motion tested.
- Live acceptance checks: flux maximum/emf zero at 0°; positive emf peak/zero flux at 90°; flux minimum/emf zero at 180°; negative peak at 270°; field reversal flips sign.
- Mission completed at N = 320 and ω = 157 rad/s, producing 2.00× the default peak emf.
- Clean reload: WebGL canvas present, no Vite error overlay, no invalid numeric output. Pre-existing React Router future warnings are unchanged.
