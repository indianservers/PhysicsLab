# Iteration 02 comparison

- Passed: desktop composition follows the reference with apparatus controls, central rig, live readings, time series, phase portrait, divergence plot, prediction, and beat challenge.
- Passed: generated frame PNG is true RGBA with transparent pixels and no white rectangle.
- Passed: mobile pane now stays inside the host grid at 390×844; desktop and tablet also have no horizontal overflow.
- Passed: displayed rotating angles wrap to ±180° while integration retains continuous angular state.
- Passed: symmetric and antisymmetric mode relationships, conservative energy, beat-period prediction, mission feedback, and bounded nearby-state separation are all driven by one simulation trajectory.
- Deliberate deviation: no GLB/orbit camera, following the user's 2D-first direction. Bobs remain pointer-draggable and keyboard adjustable.
- Deliberate deviation: supplied decorative waveform PNGs are preserved in the lesson asset folder but not rendered because their fixed waveforms would not match the calculated trajectory.
