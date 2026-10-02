# Lesson 021 — Bernoulli Fluid Flow visual review

- The supplied GLB was deliberately not loaded under the current 2D-first direction. A generated transparent Venturi apparatus supplies the reservoir, pump, pipe and three pressure taps; all fluid markers, pressure columns, labels and readings are code-driven overlays.
- The mockup's bench structure is retained inside the existing app shell: setup controls, large Venturi stage, three measurement stations, energy accounting, cavitation warning and a measurable throat-speed mission.
- Continuity uses `Q = Av` at all three stations. Bernoulli pressure uses `P + ½ρv² + ρgz = constant` with SI conversions for L/s, mm and kPa; the live residual checks close at machine precision.
- Pressure is absolute. Water vapor pressure is fixed at 2.34 kPa for the cavitation comparison; temperature dependence, viscosity, turbulence, wall losses and compressibility are deliberately outside this ideal-flow lesson.
- The explicit cavitation preset was browser-verified at `Pmin = -89.66 kPa abs` and a `-92.00 kPa` margin. Negative absolute pressure is retained as an unmistakable ideal-model failure signal rather than clamped into a physically misleading safe state.
- The mission was browser-verified at `v₂ = 2.44 m/s`, `Pmin = 87.69 kPa abs` and an `85.35 kPa` safety margin. Playback, stepping, 2× speed and reduced motion were also exercised.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-8432a35c-5369-44dc-9150-4cca57465b4b.png`; app copy: `public/assets/experiments/bernoulli-fluid-flow/venturi-bench.png` (1672×941, 32-bit alpha).
- Browser checks covered default continuity/Bernoulli values, safe and cavitating regimes, mission completion, desktop/tablet/mobile layouts and a fresh console. No runtime errors appeared; the two React Router future-flag warnings are pre-existing.
