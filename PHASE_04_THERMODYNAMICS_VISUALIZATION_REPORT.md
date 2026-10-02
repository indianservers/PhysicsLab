# Phase 4 Thermodynamics Visualization Report

## Scope

Phase 4 upgraded the thermodynamics, heat, gas-law, calorimetry, and statistical-ensemble targets from pending or generic panes to experiment-specific classroom visuals.

## Files Changed

| File | Change |
|---|---|
| `src/components/GuidedVisualization.tsx` | Added explicit Phase 4 dispatch and six custom 2D thermal/statistical scenes. |
| `src/components/Experiment3DAnimation.tsx` | Added `thermoProcess` and `statisticalEnsemble` 3D animation kinds, configs, palettes, and builders. |
| `src/lib/experimentVisualizationSpecs.ts` | Updated Phase 4 pane statuses and trust metadata/assumption chips. |
| `EXPERIMENT_VISUALIZATION_STATUS.md` | Regenerated from `npm run audit:visualizations`. |

## New Files

| File | Purpose |
|---|---|
| `PHASE_04_THERMODYNAMICS_VISUALIZATION_REPORT.md` | Phase 4 implementation record, validation summary, and Phase 5 handoff. |

## Status Counts

| Metric | Before Phase 4 | After Phase 4 |
|---|---:|---:|
| Total experiments | 80 | 80 |
| Already specific | 41 | 47 |
| Needs 2D only | 11 | 7 |
| Needs 3D only | 12 | 12 |
| Needs both | 16 | 14 |

## Experiment Summary

| Experiment | 2D Status | 3D Status | Implementation |
|---|---|---|---|
| `heat-and-temperature` | `custom` | `specific-shared-engine` | Dedicated thermometer, heat-transfer arrow, particle-agitation box, Kelvin display, heat-energy/mass distinction. |
| `heat-transfer` | `custom` | `specific-shared-engine` | Three-panel bench separating conduction, convection, and radiation with rate cue and mechanism labels. |
| `gas-laws` | `custom` | `specific-shared-engine` | Piston-cylinder, moving gas particles, pressure gauge, P-V-T dashboard, and Boyle curve cue. |
| `thermodynamic-process` | `custom` | `custom` | 2D and 3D piston-cylinder scenes synchronized with process-specific P-V paths, heat/insulation cue, pressure gauge, and work readout. |
| `calorimetry-mixing` | `custom` | `custom` | Insulated calorimeter, hot/cold samples, heat-flow arrows, equilibrium thermometer, and heat-balance equation cue. |
| `statistical-ensemble-lab` | `custom` | `custom` | 2D particle ensemble plus histogram/mean/spread; 3D state-space particle cloud plus histogram wall and mean marker. |

## Scientific Assumptions and Limitations Added

| Experiment | Assumptions / Limitations |
|---|---|
| `heat-and-temperature` | Heat is energy in transfer; molecular motion is illustrative; Kelvin used for absolute-temperature formulas; not to scale. |
| `heat-transfer` | Simplified heat rate; uniform material approximation; radiation does not require a medium; not to scale. |
| `gas-laws` | Ideal gas assumption; absolute temperature used; closed system; volume clamped above zero; not to scale. |
| `thermodynamic-process` | Quasi-static idealized process; ideal gas assumption; instructional P-V path, not a full integration solver. |
| `calorimetry-mixing` | No heat loss; insulated system; uniform mixing; constant heat capacity. |
| `statistical-ensemble-lab` | Qualitative distribution model; illustrative ensemble; not molecular dynamics; not to scale. |

## UI Notes

| Area | Result |
|---|---|
| Normal view | Each Phase 4 experiment now has a domain-specific apparatus in the first visualization pane. |
| Fullscreen | Scenes use the existing guided/fullscreen shell and keep labels inside the 760 x 300 SVG viewport or 3D side panel. |
| Mobile | 2D views carry the teaching point independently of 3D; existing responsive layout stacks the panes. |
| Trust UX | Status metadata now includes explicit assumptions and limitation copy for the upgraded panes. |

## Commands Run

| Command | Result |
|---|---|
| `npx tsc -b` | Passed. |
| `npm run audit:visualizations` | Passed. 80 experiments; 47 already specific; 7 needs 2D only; 12 needs 3D only; 14 needs both. |
| `npm run test:physics` | Passed. 201/201 physics validation tests passed. |
| `npm run build` | Passed. Existing large chunk warning remains for `assets/index-*.js` at about 3.5 MB. |

## Known Limitations

| Item | Notes |
|---|---|
| Shared 3D thermal scenes | `heat-and-temperature`, `heat-transfer`, and `gas-laws` still use `specific-shared-engine` 3D, but their 2D scenes now carry the classroom-specific apparatus identity. |
| Numerical validation | These visual scenes align with current outputs but do not add new independent numerical validation cases. |
| Browser screenshot QA | Phase 4 was validated by compiler, audit, physics tests, and production build; automated route screenshots were not added in this phase. |
| Bundle size | Production build still warns about the large main JavaScript chunk. |

## Recommended Phase 5 Starting Point

Begin with electricity labs that still need 2D or 3D work: `ohms-law`, `series-parallel-resistance`, `electric-power`, `heating-effect-current`, `static-electricity`, `electrostatic-field-potential`, `kirchhoff-circuit`, `chemical-effects-current`, `meter-bridge`, `internal-resistance-cell`, and `ac-lcr-resonance`. Start with the core circuit quartet first because they are high classroom-frequency labs and share safe primitives: battery, resistor, meters, branch currents, V-I graph, wattmeter, and energy counter.
