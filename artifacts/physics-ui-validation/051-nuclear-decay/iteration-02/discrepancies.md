# Lesson 051 — Nuclear Decay and Half-Life

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The lab uses a generated true-alpha PNG chamber/Geiger apparatus with live 2D nuclei, decay flashes, counter, and graph overlays.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-f1675b9b-cea8-489e-9281-03cbf7567853.png`.
- App asset: `public/assets/experiments/nuclear-decay/decay-chamber.png` (1536 × 1024, RGBA with zero-alpha corners).

## Scientific behavior verified

- Ensemble expectation uses `N=N₀·2^(−t/T½)=N₀e^(−λt)` with `λ=ln(2)/T½`.
- Activity uses `A=λN`; detected rate applies efficiency and additive background.
- Each finite nucleus receives an independent exponential lifetime `t=−ln(1−u)/λ`.
- A seeded PRNG makes every lifetime and graph point repeat exactly for the same seed; a changed seed produces a different run.
- Isotope, initial population, half-life, time scale, random seed, detector efficiency, and background all update the authoritative state.
- The unknown-sample mission validates a 12.5-year estimate from the 50% curve crossing and rejects a poor estimate with specific feedback.

## Browser and responsive evidence

- Playback advanced the live clock and stochastic remaining count; pause stopped it.
- Desktop: 1440 × 900 requested viewport, document width 1430 px.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; stage remains live, the lesson uses a single-column layout, and document width is 380 px.
- Browser console errors: none.

## Validation

- TypeScript build passed after correcting numeric state typing.
- Physics regression: 437/437 passed before the final full repository gate.
