# Studio physics, teaching content and tab audit

Scope: the 96 dedicated lab routes assigned to the 16 studios in `studioReferenceLabs.ts`, plus a source interaction scan of all 144 page components. The separate experiment library retains its existing 80 lesson chapters and validation suite.

## Validation results

| Check | Result |
| --- | --- |
| Studio numerical and invariant checks | 264 passed across 96 routes |
| Route-specific textbook chapters | 96 complete |
| Page source interaction audit | 144 pages; no unhandled buttons, empty click handlers, duplicate attributes or known Observe-handler omissions |
| Studio browser checks | 96/96 routes and 288/288 Predict/Experiment/Explain checks passed, including the diffraction aperture/camera/challenge checks and all 15 labs with inline learning modes |
| Existing physics suite | 581/581 passed |
| Existing experiment-library teaching coverage | 80/80 passed |
| TypeScript | Passed |
| Production bundle and service worker | Built successfully; existing large-chunk warning remains |

Desktop and mobile textbook screenshots were inspected visually. The reader's contrast is explicitly scoped to avoid global page text rules overriding it. Headless UI checks limit animation rendering to five callbacks per second to keep software WebGL responsive; this is not an animation frame-rate benchmark.

## Physics corrections

- Inertia uses the selected resistance and mass to calculate stopping time and distance; it no longer imposes an arbitrary 1.5-second physical stop.
- Third-law cart positions integrate the half-sine force pulse and subsequent coasting; displayed impulse is accumulated impulse at the selected time.
- Incline multi-force friction balances subthreshold forces and opposes incipient motion in either direction. A suspended two-string load has no additional supporting normal force.
- Conservation of energy starts from rest with the actual selected `mgh`. Potential energy, kinetic energy and dissipation sum to the initial budget.
- Gravitational torque about the source is zero for a central force. Two-source potential uses Euclidean source distances and the full vector gradient, including probe angle.
- Tangential orbital launches use conic eccentricity, specific energy, semi-major axis and Kepler period. Unbound paths have no bound period; surface-intersecting paths are identified. Kepler swept area includes both ellipse axes.
- Gas laws use the SI molar gas constant and atmospheric plus piston-load pressure. The four first-law process constraints use consistent ideal-gas states; adiabatic heat is zero and its control specifies work. Heat-engine outputs form a consistent reversible Carnot reference cycle.
- Conduction uses explicit rod dimensions and exposes time-integrated energy. Entropy uses actual molecule counts, signed thermodynamic changes and distinguishable-species assumptions. Buoyancy uses a single object volume for weight and displacement.
- Electron diffraction uses relativistic momentum at the supported keV energies, the doubled Bragg scattering angle and centimetre screen geometry. Hydrogenic helium is labelled He⁺; spectral series include Brackett and Pfund.
- Nuclear pairing coefficients use a consistent convention; a smooth mass formula no longer certifies decay stability. Decay activity converts years to seconds and detector rates distinguish radiation types and assumed efficiency.
- Quantum ideas uses a stated Gaussian/dephasing/phase model rather than fabricated counts or arbitrary packet spread. Thermistor resistance follows an NTC temperature trend.
- Galaxy circular speed and enclosed mass use consistent units and separate halo profiles. Cosmology follows a stated flat matter–Lambda model, parameter-dependent age and consistent Mpc/light-year conversion. Transit depth includes inclination and grazing overlap; inferred mass and the distance band are labelled assumptions.
- Circular-motion velocity changes direction correctly for reversed rotation. Efficiency is undefined when input and output power both vanish.
- Enum lookups reject inherited object keys, inactive controls were removed where no corresponding physical model exists, and several misdirected subject links were corrected.

## Content and interaction fixes

Every studio route has its own original chapter: principle, equation and units, derivation, worked calculation, assumptions, misconception, investigation, self-test answer and extension. The reader provides contextual links to university, standards and textbook resources. Educational approximations are distinguished from measured data and exact predictions.

The shared learning dialog now imports its own stylesheet. A direct visit to `/optics/diffraction` therefore does not depend on a previous visit to a route that happens to load dialog CSS. Predict, Experiment and Explain receive different chapter content while preserving existing specialised controls. Predict supports a written prediction and reference reasoning; Experiment supplies a controlled investigation; Explain supplies derivation and calculation. Observe returns to the apparatus and updates selected state. Dead navigation buttons are links to the appropriate studio.

The shared dialog and textbook reader support focus containment, Escape, focus restoration and scrolling on small screens. Answers require an explicit reveal; reference calculations are identified separately from live readings.

Written predictions and investigation plans are saved locally per route and learning mode, so returning to the apparatus does not discard them. Informational overlays do not intercept the Inertia mode buttons, and the textbook launcher sits above the transport row.

## Reproduce the checks

```sh
python scripts/buildStudioTheory.py
npm run test:studios
npm run test:studio-tabs
npm run test:physics
npm run test:lesson-content
node scripts/buildStudioBrowserAudit.mjs
node scripts/auditStudioBrowser.mjs
```

`artifacts/studio-physics-audit/results.json` records numerical/invariant checks for every studio route. `page-interactions.json` records source findings, including duplicate JSX attributes. The browser audit records mode behaviour, chapter visibility, revealed answers, runtime errors and mobile reader overflow in `browser-results.json` and saves representative screenshots.

The isolated browser bundle disables service workers and serves existing public assets; it is a test harness, not a deployment build. The production build and TypeScript checks are separate checks. Passing these finite tests does not establish that every numerical input or teaching claim has been independently peer reviewed. In particular, dipole magnet fields, core magnetisation, semiconductor mobilities, radiation attenuation, stellar evolution scaling and galaxy mass profiles retain the approximations documented in their chapters.
