# Phase 6 Magnetism Visualization Report

## Scope

Phase 6 completed the remaining magnetism-specific pending pane and polished existing magnetism visuals for clearer current direction, field direction, polarity, and right-hand-rule language.

## Files Changed

| File | Change |
|---|---|
| `src/components/Experiment3DAnimation.tsx` | Added `lorentz3d` animation kind, config, dispatch, palette support, and custom Lorentz force 3D builder; polished electromagnet labels. |
| `src/components/GuidedVisualization.tsx` | Improved 2D magnetism labels for electromagnet and straight-wire magnetic field scenes. |
| `src/lib/experimentVisualizationSpecs.ts` | Updated Lorentz 3D status to `custom`; added magnetism assumptions and limitation copy. |
| `EXPERIMENT_VISUALIZATION_STATUS.md` | Regenerated from `npm run audit:visualizations`. |

## New Files

| File | Purpose |
|---|---|
| `PHASE_06_MAGNETISM_VISUALIZATION_REPORT.md` | Phase 6 implementation record, validation summary, and Phase 7 handoff. |

## Status Counts

| Metric | Before Phase 6 | After Phase 6 |
|---|---:|---:|
| Total experiments | 80 | 80 |
| Already specific | 58 | 59 |
| Needs 2D only | 3 | 3 |
| Needs 3D only | 8 | 7 |
| Needs both | 11 | 11 |

## Experiment Summary

| Experiment | 2D Status | 3D Status | Implementation |
|---|---|---|---|
| `lorentz-force` | `specific-shared-engine` | `custom` | Added 3D uniform magnetic field region, charged particle, velocity vector, B vector, force vector, positive/negative sign reversal, curved trajectory, and radius cue. |
| `electromagnet` | `specific-shared-engine` | `custom` | Preserved existing specific scene; added clearer current, core, N/S polarity, and ideal-solenoid assumption labels. |
| `magnetic-field-current` | `specific-shared-engine` | `custom` | Preserved existing specific scene; improved straight-wire current direction, circular field rings, right-hand-rule wording, and assumptions. |

## Scientific Assumptions and Limitations Added

| Experiment | Assumptions / Limitations |
|---|---|
| `lorentz-force` | Uniform magnetic field; non-relativistic charged particle; velocity perpendicular to B for radius cue; not to scale. |
| `electromagnet` | Ideal solenoid approximation; qualitative field-line density; conventional current shown; not to scale. |
| `magnetic-field-current` | Straight-wire approximation; qualitative field-line density; conventional current shown; not to scale. |

## UI Notes

| Area | Result |
|---|---|
| Normal view | Lorentz 3D now renders a dedicated apparatus instead of a pending card. |
| Fullscreen | Lorentz vectors, field region, radius cue, and assumption labels are inside the existing 3D canvas/guide shell. |
| Mobile | Existing responsive 3D shell is unchanged; 2D magnetism labels remain compact. |
| Trust UX | Magnetism assumptions now appear in visualization metadata instead of being blank. |

## Commands Run

| Command | Result |
|---|---|
| `npx tsc -b` | Passed. |
| `npm run audit:visualizations` | Passed. 80 experiments; 59 already specific; 3 needs 2D only; 7 needs 3D only; 11 needs both. |
| `npm run test:physics` | Passed. 201/201 physics validation tests passed. |
| `npm run build` | Passed. Existing large chunk warning remains; main JS chunk is about 3.53 MB. |

## Known Limitations

| Item | Notes |
|---|---|
| Lorentz path model | The 3D view is a teaching visualization for perpendicular velocity in a uniform magnetic field, not a particle accelerator simulation. |
| Browser screenshot QA | Not added in this phase. |
| Bundle size | Production build still warns about the large main JavaScript chunk. |

## Recommended Phase 7 Starting Point

Start Phase 7 with optics-specific pending 3D and both-pane work: `reflection-plane-mirror`, `glass-slab-refraction`, `shadows-eclipses`, `multiple-reflection`, and `optical-instruments`. Keep each optics scene distinct: plane mirror law of reflection, slab lateral shift, eclipse umbra/penumbra geometry, kaleidoscope multiple images, and microscope/telescope ray paths.
