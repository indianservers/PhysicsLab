# Phase 7 Optics Visualization Report

## Scope

Phase 7 completed optics-specific visualization upgrades only. Existing specific optics labs were preserved: `mirror-formula`, `lens-formula`, `prism-dispersion`, `human-eye-defects`, and `total-internal-reflection`.

## Files Changed

| File | Change |
|---|---|
| `src/components/GuidedVisualization.tsx` | Added dedicated 2D SVG scenes for `shadows-eclipses` and `multiple-reflection`; kept existing optics scenes stable. |
| `src/components/Experiment3DAnimation.tsx` | Added explicit 3D animation kinds, configs, dispatch, and builders for five Phase 7 optics targets. |
| `src/lib/experimentVisualizationSpecs.ts` | Moved Phase 7 target panes from `pending-custom` to `custom` and added experiment-specific apparatus, assumptions, and limitations. |
| `EXPERIMENT_VISUALIZATION_STATUS.md` | Regenerated with `npm run audit:visualizations`. |

## New Files Created

| File | Purpose |
|---|---|
| `PHASE_07_OPTICS_VISUALIZATION_REPORT.md` | Phase 7 implementation, validation, and remaining-work report. |

## Before And After Counts

| Metric | Before Phase 7 | After Phase 7 |
|---|---:|---:|
| Total experiments | 80 | 80 |
| Already specific | 59 | 64 |
| Needs 2D only | 3 | 3 |
| Needs 3D only | 7 | 4 |
| Needs both | 11 | 9 |

## Experiment Summary

| Experiment | Previous status | Phase 7 result | Student/professor/UI note |
|---|---|---|---|
| `reflection-plane-mirror` | 2D specific shared engine, 3D pending | Custom 3D plane mirror scene | Shows object, virtual image, mirror plane, incident/reflected rays, normal, equal angle arcs, and equal object-image distance markers. |
| `glass-slab-refraction` | 2D specific shared engine, 3D pending | Custom 3D glass slab scene | Shows transparent slab thickness, Snell-law bending at two faces, normals, parallel emergent ray, refractive index, and lateral shift. |
| `shadows-eclipses` | 2D pending, 3D pending | Custom 2D and custom 3D eclipse/shadow scenes | Shows source/Sun, occluder, receiver/screen, umbra, penumbra, and simplified solar/lunar/simple-shadow modes. |
| `multiple-reflection` | 2D pending, 3D pending | Custom 2D and custom 3D mirror-pair scenes | Shows two mirrors, mirror angle, object, repeated virtual images, reflection path, conditional image-count cue, and kaleidoscope preview. |
| `optical-instruments` | 2D specific shared engine, 3D pending | Custom 3D instrument tube scene | Shows objective, eyepiece, ray bundles, intermediate image, final virtual image direction, focal points, and microscope/telescope distinction. |
| `mirror-formula` | Already specific | Preserved | No generic fallback introduced. |
| `lens-formula` | Already specific | Preserved | No generic fallback introduced. |
| `prism-dispersion` | Already specific | Preserved | No generic fallback introduced. |
| `human-eye-defects` | Already specific | Preserved | No generic fallback introduced. |
| `total-internal-reflection` | Already specific | Preserved | No generic fallback introduced. |

## Scientific Assumptions And Limitations Added

| Experiment | Assumption / limitation wording |
|---|---|
| `reflection-plane-mirror` | Ideal plane mirror; ray model of light; virtual image is schematic; not to scale. |
| `glass-slab-refraction` | Plane parallel slab; Snell's law ray model; no absorption/scattering; not to scale. |
| `shadows-eclipses` | Simplified eclipse geometry; ray model of light; astronomical distances and sizes are not to scale. |
| `multiple-reflection` | Ideal mirrors; image-count formula depends on mirror angle condition; ray model of light; not to scale. |
| `optical-instruments` | Thin lens approximation; paraxial rays; ideal optical instrument; no aberrations modeled; not to scale. |

## UI / Fullscreen / Mobile Notes

| Check | Result |
|---|---|
| First viewport identity | Phase 7 targets now show experiment-specific 2D and/or 3D apparatus instead of generic optics fallback cards. |
| Fullscreen controls | Existing fullscreen controls remain wired through the shared visual/3D shell; Phase 7 did not change fullscreen CSS. |
| Browser smoke | Chrome headless channel loaded all five Phase 7 target routes with 3D canvas present and no console errors. |
| Pending cards | Chrome check found zero `Pending visualization` cards on all five Phase 7 target routes. |
| Mobile | Not separately screenshot-tested in this phase; responsive behavior relies on the existing shared experiment layout. |

## Commands Run

| Command | Result |
|---|---|
| `npx tsc -b` | Passed. |
| `npm run audit:visualizations` | Passed. Counts: 80 total, 64 already specific, 3 needs 2D only, 4 needs 3D only, 9 needs both. |
| `npm run test:physics` | Passed: 201/201 physics validation tests. |
| `npm run build` | Passed. Existing large chunk warning remains: main JS chunk about 3,550.82 kB before gzip. |
| Chrome route smoke via Playwright using installed Chrome channel | Passed for `shadows-eclipses`, `multiple-reflection`, `reflection-plane-mirror`, `glass-slab-refraction`, and `optical-instruments`; no console errors and zero pending visualization cards. |

## Known Limitations

| Area | Limitation |
|---|---|
| Numerical validation | Phase 7 visuals are formula-aligned educational diagrams, not independently numerically validated optical ray solvers. |
| 3D scale | Eclipse, mirror, slab, and instrument distances are schematic for classroom clarity. |
| Optical instruments | Aberrations, aperture stops, diffraction limits, and real multi-element lens behavior are not modeled. |
| Multiple reflection | Image-count cue distinguishes exact and non-integer angle cases, but virtual image positions are schematic. |
| Bundle size | The existing large main bundle warning remains and should be handled by code splitting in a later performance phase. |

## Recommended Phase 8 Starting Point

| Priority | Experiment | Reason |
|---:|---|---|
| 1 | `wave-lab` | Needs both 2D and 3D; foundational for later sound, diffraction, and interference understanding. |
| 2 | `chladni-plate` | Needs both panes and benefits strongly from experiment-specific nodal pattern visuals. |
| 3 | `echo-speed-sound` | Needs both panes; classroom-friendly timing/round-trip model with direct misconception value. |
| 4 | `sound-pitch-loudness` | Needs 3D; should separate amplitude, frequency, wavelength, particle motion, and perceived loudness. |
| 5 | `shm-spring` | Needs 3D; should distinguish oscillation, equilibrium, amplitude, period, spring force, and energy exchange. |

