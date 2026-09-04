# Lesson 054 — Glass Slab Refraction

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The lab uses a generated true-alpha PNG ray box, protractor, and glass slab with live SVG ray tracing and measurements.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-4e8a5be2-fdd0-496f-afb5-f74c27e634c2.png`.
- App asset: `public/assets/experiments/glass-slab-refraction/optical-bench.png`.

## Scientific behavior verified

- Refraction uses `n₁ sin i=n₂(λ) sin r`, with all angles measured from the normal.
- Lateral displacement uses `d=t sin(i−r)/cos r` for a plane-parallel slab.
- The emergent angle equals the incidence angle whenever transmission occurs, so the incident and emergent rays remain parallel.
- A representative normal-dispersion correction makes violet light’s effective index slightly larger than red light’s; violet therefore bends closer to the normal.
- The light-speed readout uses `v=c/n₂(λ)`.
- Browser presets verified zero shift at normal incidence and 2.40 cm at the maximum air/glass setup. The water-surrounding case remains supported and physically computed.
- The target setup produces `d=0.81 cm`, satisfying the 0.80 cm mission within the stated 0.03 cm tolerance.

## Browser and responsive evidence

- Play, pause, step, replay, minimum/typical/maximum/target presets, wavelength, surrounding medium, fan-of-rays, record-trial, and mission controls were exercised in the real route.
- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the live optical bench remains interactive in the single-column layout.
- No application error surfaced during route loading or interaction checks.

## Validation

- TypeScript build passed.
- Physics regression: 452/452 passed before the final full repository gate.
