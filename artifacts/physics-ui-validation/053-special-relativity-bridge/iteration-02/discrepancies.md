# Lesson 053 — Special Relativity Bridge

## Implementation decision

- The supplied GLB is intentionally deferred per the user’s instruction. The lab uses a generated true-alpha PNG spacecraft with live 2D light-clock, world-line, clock, and event animations.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-5722e7e1-aa5d-431a-a18a-73d46d21b740.png`.
- App asset: `public/assets/experiments/special-relativity-bridge/spacecraft.png`.

## Scientific behavior verified

- The Lorentz factor uses `γ=1/√(1−β²)` and remains finite because massive-frame speed is clamped to `0.99c`.
- The ship light clock uses the proper one-way time `H/c`; the Earth-frame time is `γH/c`, while the diagonal light path keeps the measured speed exactly `c`.
- The moving spacecraft contracts to `L₀/γ` only along the direction of motion.
- Event coordinates use the Lorentz transformation, and the interval `c²Δt²−Δx²` remains invariant.
- Events simultaneous in Earth frame S are non-simultaneous in ship frame S′ when their positions differ. The mission accepts S and explains why S′ is incorrect.
- Browser preset checks gave γ=1.0000 at rest and γ=7.0888 at `0.99c`.

## Browser and responsive evidence

- Play, pause, replay, preset, reference-frame, playback-speed, and mission controls were exercised in the real route.
- Desktop: 1440 × 900 requested viewport.
- Tablet: 820 × 1180 requested viewport.
- Mobile: 390 × 844 requested viewport; the lab reflows to one column and the 2D spacecraft remains visible.
- No application error surfaced during route loading or interaction checks.

## Validation

- TypeScript build passed.
- Physics regression: 447/447 passed before the final full repository gate.
