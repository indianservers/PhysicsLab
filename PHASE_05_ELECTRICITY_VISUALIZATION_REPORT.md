# Phase 5 Electricity Visualization Report

## Scope

Phase 5 upgraded electricity, circuit, electrostatics, electrolysis, meter bridge, internal resistance, and AC/LCR target visuals. Existing specific electricity labs were left stable.

## Files Changed

| File | Change |
|---|---|
| `src/components/GuidedVisualization.tsx` | Added custom 2D scenes for Ohm's law, series/parallel resistance, electric power, Joule heating, electrolysis, meter bridge, and internal resistance. |
| `src/components/Experiment3DAnimation.tsx` | Added 3D animation kinds and builders for static electricity, field/potential, electrolysis, Kirchhoff circuit, LCR resonance, meter bridge, and internal resistance. |
| `src/lib/experimentVisualizationSpecs.ts` | Updated Phase 5 pane statuses, apparatus metadata, assumptions, and limitation copy. |
| `EXPERIMENT_VISUALIZATION_STATUS.md` | Regenerated from `npm run audit:visualizations`. |

## New Files

| File | Purpose |
|---|---|
| `PHASE_05_ELECTRICITY_VISUALIZATION_REPORT.md` | Phase 5 implementation record, validation summary, and Phase 6 handoff. |

## Status Counts

| Metric | Before Phase 5 | After Phase 5 |
|---|---:|---:|
| Total experiments | 80 | 80 |
| Already specific | 47 | 58 |
| Needs 2D only | 7 | 3 |
| Needs 3D only | 12 | 8 |
| Needs both | 14 | 11 |

## Experiment Summary

| Experiment | 2D Status | 3D Status | Implementation |
|---|---|---|---|
| `ohms-law` | `custom` | `specific-shared-engine` | Battery, resistor, ammeter, voltmeter, current arrows, V-I graph, slope/resistance label, `V = IR`. |
| `series-parallel-resistance` | `custom` | `specific-shared-engine` | Series/parallel topology view, R1/R2 labels, equivalent resistance, same-current vs current-split cues. |
| `electric-power` | `custom` | `specific-shared-engine` | Supply, appliance/load, wattmeter, energy counter, `P = VI`, `E = Pt`, brightness/energy growth. |
| `heating-effect-current` | `custom` | `specific-shared-engine` | Battery, ammeter, glowing resistor, thermometer, heat waves, `H = I^2Rt`, squared-current emphasis. |
| `chemical-effects-current` | `custom` | `custom` | 2D/3D electrolysis cell with anode, cathode, electrolyte, ion motion, bubbles, and deposit cue. |
| `meter-bridge` | `custom` | `custom` | 2D/3D meter bridge board, one-meter wire, jockey, galvanometer null, known/unknown resistors, length labels. |
| `internal-resistance-cell` | `custom` | `custom` | 2D/3D cell model separating EMF, internal resistor, external load, terminal voltage, and internal drop. |
| `static-electricity` | `specific-shared-engine` | `custom` | 3D charged bodies, charge sign markers, field lines, attraction/repulsion arrows, spark cue. |
| `electrostatic-field-potential` | `specific-shared-engine` | `custom` | 3D point charge, field arrows, equipotential rings, potential cue, test-charge force vector. |
| `kirchhoff-circuit` | `specific-shared-engine` | `custom` | 3D two-loop board with junction nodes, branch current paths, KCL label, and voltage-drop labels. |
| `ac-lcr-resonance` | `specific-shared-engine` | `custom` | 3D series RLC circuit, phasor wheel, resonance curve marker, RMS/steady-state cue. |

## Scientific Assumptions and Limitations Added

| Experiment | Assumptions / Limitations |
|---|---|
| `ohms-law` | Ohmic conductor assumed; steady DC; ideal wires; meter resistance ignored. |
| `series-parallel-resistance` | Ideal wires/meters; steady DC; idealized circuit elements. |
| `electric-power` | Ideal load model; steady DC; ideal wires; power and energy kept distinct. |
| `heating-effect-current` | Uniform resistor heating assumed; material failure not modeled. |
| `chemical-effects-current` | Simplified electrolysis model; exact chemistry not specified; ideal DC supply. |
| `meter-bridge` | Uniform wire assumed; contact resistance ignored; null point requires valid ratio. |
| `internal-resistance-cell` | Linear internal resistance model; ideal meters; EMF distinguished from terminal voltage. |
| `static-electricity` | Qualitative charge model; lightning-scale behavior not modeled. |
| `electrostatic-field-potential` | Point-charge model; near-charge singularities visually clamped. |
| `kirchhoff-circuit` | Ideal circuit elements; sign convention follows calculator. |
| `ac-lcr-resonance` | Sinusoidal steady state; RMS values used; parasitic losses not modeled. |

## UI Notes

| Area | Result |
|---|---|
| Normal view | All Phase 5 pending panes now show apparatus-specific visuals instead of pending roadmap cards. |
| Fullscreen | Scenes fit inside existing 2D SVG and 3D fullscreen shells with labels inside the active viewport. |
| Mobile | 2D panes carry core concepts independently; 3D panes use existing responsive controls and side-guide layout. |
| Trust UX | Assumptions and limitation metadata are now present for the upgraded electricity panes. |

## Commands Run

| Command | Result |
|---|---|
| `npx tsc -b` | Passed. |
| `npm run audit:visualizations` | Passed. 80 experiments; 58 already specific; 3 needs 2D only; 8 needs 3D only; 11 needs both. |
| `npm run test:physics` | Passed. 201/201 physics validation tests passed. |
| `npm run build` | Passed. Existing large chunk warning remains; main JS chunk is about 3.53 MB. |

## Known Limitations

| Item | Notes |
|---|---|
| Shared 3D circuit scenes | `ohms-law`, `series-parallel-resistance`, `electric-power`, and `heating-effect-current` keep specific shared 3D engines, with custom 2D carrying the exact apparatus identity. |
| Numerical validation | Existing physics tests pass, but this phase did not add independent new numerical validation cases. |
| Browser screenshot QA | Not added in this phase. |
| Bundle size | Production build still warns about the large main JavaScript chunk. |

## Recommended Phase 6 Starting Point

Start Phase 6 with magnetism-specific pending work: `lorentz-force` needs a custom 3D scene, while `electromagnet` and `magnetic-field-current` should receive a careful polish pass for field-line readability, current direction labels, and assumption metadata. Keep Lorentz force separate from generic magnet scenes by showing charge velocity, magnetic field direction, force vector, and circular-radius cue.
