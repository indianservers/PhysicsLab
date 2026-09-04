# Lesson 070 visual and interaction review

## Reference comparison

- Preserved the mockup's four process selectors, three-column laboratory composition, piston chamber, large P–V graph, state readouts, first-law check, and lower comparison mission.
- Replaced the requested 3D chamber with a generated true-alpha PNG apparatus and live 2D SVG/DOM overlays, following the current project direction to defer GLB work.
- Kept the existing PhysicsLab application shell rather than reproducing the mockup's standalone page chrome.

## Iteration 01 findings

- The process invariant value could visually collide with its formula in the narrow right column.
- Full-page browser stitching duplicated a sticky viewport fragment; this was a capture artifact, not a duplicate DOM lab (one `.thermo-lab` was verified).
- Mobile needed a separate stage-focused capture to demonstrate the full piston/graph interaction below the controls.

## Iteration 02 corrections and result

- Reflowed the invariant bar and normalized value into a non-overlapping grid.
- Captured viewport-based desktop interaction evidence and separate mobile controls/stage evidence.
- Verified 390 px viewport has no horizontal overflow (`scrollWidth === clientWidth`).
- Verified correct mission and incorrect-answer feedback, keyboard slider boundaries, play/pause/resume, step, scrub control presence, reset, 0.25–2× speed, reduced motion, and all four process tabs.
- Runtime console has no errors; only pre-existing React Router future-flag warnings remain.
- All PNG and manifest requests return HTTP 200. Generated apparatus and supplied effects are 32-bit ARGB with alpha.

## Physics checks

- Isothermal expansion: ΔU = 0 and Q = W; compression produces negative Q and W.
- Reversible adiabatic expansion: Q ≈ 0 and normalized PVᵞ = 1.000000.
- Isobaric path: W = PΔV and normalized P = 1.000000.
- Isochoric path: W = 0 and normalized V = 1.000000.
- Every displayed state satisfies PV = nRT; every energy ledger satisfies ΔU = Q − W to numerical precision.
- Same-endpoint mission correctly demonstrates equal ΔU but path-dependent W and Q.
