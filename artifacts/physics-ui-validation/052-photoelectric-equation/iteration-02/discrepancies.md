# Lesson 052 — Photoelectric Equation

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The lab uses a generated true-alpha PNG photoelectric tube with live 2D photons, photoelectrons, meters, and graphs.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-25621a9b-03e4-46ef-a441-d2ea10bc457f.png`.
- App asset: `public/assets/experiments/photoelectric-equation/photoelectric-tube.png`.

## Scientific behavior verified

- `Kmax=max(0,hf−φ)` and `|Vs|=Kmax/e`; because energies are displayed in eV, the numerical stopping potential in volts equals Kmax in eV.
- Threshold frequency uses `f₀=φ/h`.
- Increasing intensity changes emitted-electron count, saturation current, and photocurrent but leaves Kmax unchanged (browser comparison: 1.889 eV at both 10% and 90%).
- A retarding voltage at or beyond `−|Vs|` gives zero current; this is also covered by the physics benchmark.
- The supplied mockup shows positive Kmax for 365 nm light on zinc, but this is physically impossible: the photon energy is about 3.40 eV while zinc’s work function is 4.31 eV. The implemented default correctly reports no emission.
- The unknown-metal mission exposes the frequency-axis intercept and accepts φ=3.10 eV while rejecting a poor estimate.

## Browser and responsive evidence

- Minimum 800 nm is below threshold; maximum 200 nm produces Kmax=1.889 eV for zinc.
- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the animated tube remains live in a single-column layout.
- Reset-button contrast was corrected after screenshot review. Browser console errors: none.

## Validation

- TypeScript build passed.
- Physics regression: 442/442 passed before the final full repository gate.
