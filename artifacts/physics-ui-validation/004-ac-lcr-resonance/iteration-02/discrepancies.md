# Lesson 004 visual correction record

## Target fidelity

- Recreated the reference's light instrument-bench layout with apparatus/controls, RMS meters, calculated values, resonance readout, oscilloscope, phasor diagram, response curve, equations, and guided mission.
- Loaded the supplied GLB and both transparent effect layers. The inductor's named mesh segments receive live current-dependent emissive intensity; the meter dial responds to current.

## Deliberate deviations

- The supplied GLB is a compact stylized circuit, so readable R/L/C/source labels remain screen-space annotations while the model rotates.
- The current-amplitude graph uses a locally adaptive frequency domain around f₀, making resonance visible across the full allowed L/C range.
- Named component buttons supplement orbit control for reliable keyboard and touch selection.
- Tablet/mobile stack controls and instruments to preserve the real graphs and inputs without horizontal scrolling.

## Verification

- Desktop 1440×900, tablet 900×1100, mobile 390×844; no horizontal overflow.
- Frequency, voltage, resistance, inductance, and capacitance tested at minimum, typical, and maximum values.
- Run/pause/resume/step, automatic frequency sweep, 0.25–2× playback, reduced motion, reset, component selection, camera rotation/zoom/reset all tested.
- Acceptance: at 25 Hz current leads; at 100 Hz current lags; at 50.329 Hz Z = R = 40.00 Ω and φ ≈ 0°.
- Frequency-only mission completed with immediate resonance feedback.
- WebGL canvas loaded, no Vite error overlay, no horizontal overflow or invalid numeric output. Pre-existing React Router future warnings are unchanged.
