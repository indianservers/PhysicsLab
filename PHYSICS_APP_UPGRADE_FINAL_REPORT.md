# Physics App Experiment Upgrade Final Report

## Summary

This pass finalized the experiment upgrade architecture, routed dedicated labs through the existing `/experiments/:id` pages, preserved the generic fallback, tightened validation language, and ran release checks for build, physics validation, priority routes, mobile behavior, and fallback continuity.

The app is ready for manual browser review. The main remaining technical warning is bundle size from the existing single large Vite chunk.

## Dedicated Experiments Migrated

The dedicated registry now selectively renders these upgraded labs:

- `uniform-motion`
- `friction`
- `inclined-plane`
- `elastic-collision`
- `hooke-s-law`
- `circular-motion`
- `chladni-plate`
- `single-slit-diffraction`
- `wave-lab`

Each migrated lab keeps the same public route and is loaded through the existing experiment detail page.

## Shared Architecture Added

The shared experiment layer now includes:

- `ExperimentShell` for the standard lab frame, mode hierarchy, visual-first layout, sticky observation, graph area, and mobile sheet slot.
- `FormulaAssumptionBox` for formula, symbols, units, assumptions, and claim status.
- `ControlGroup` for labeled controls, units, min/max context, reset, default presets, concept-specific presets, and accessible preset buttons.
- `ObservationPanel` for "what changed and why" feedback.
- `GraphPanel` for reusable graph rendering with axes, units, captions, and graph-shape metadata.
- `TeacherReplay` for classroom steps, prediction prompts, and board-friendly replay.
- `MobileExperimentSheet` for mobile controls.
- `experimentRegistry` for sparse migration: registered labs render dedicated UI; unregistered ids continue using the legacy guided/generic flow.
- `validation` helpers and `experimentValidationRegistry` for benchmark metadata, statuses, graph expectations, units, ranges, and warnings.

## Validation Coverage

The central validation system now distinguishes:

- `validated`
- `formula-only`
- `qualitative-visual`
- `needs-benchmark`
- `unsafe-claim`

Current metadata summary from `npm run test:physics`:

- Total validation metadata experiments: 13
- Validated: 12
- Formula-only: 0
- Qualitative: 1
- Failed: 0
- Warnings: 11
- Physics validation tests: 201/201 passed

The qualitative Chladni plate model is clearly treated as a school-level visual model, not an exact finite-element plate solver.

## UI/UX Upgrades

- Added global experiment modes: Beginner, Normal, Advanced, Teacher.
- Beginner mode reduces clutter with fewer controls and simpler observations.
- Normal mode keeps school-level controls, formula, graph, and observation.
- Advanced mode exposes assumptions, benchmark cases, model limits, and edge cases.
- Teacher mode supports replay steps and classroom-ready explanation prompts.
- Dedicated labs use distinct domain language:
  - Mechanics: force arrows, free-body diagrams, motion trails, energy/quantity outputs.
  - Waves: wavefronts, phase/interference visuals, diffraction patterns, qualitative warnings.
- Presets are available on desktop and mobile, including default, low value, high value, misconception demo, real-world demo, and lab-specific cases.
- Generic fallback pages remain available for unregistered experiments.

## Mobile And Accessibility

Mobile improvements verified or implemented:

- Dedicated labs expose controls through the mobile experiment sheet.
- Control buttons and replay steps use a 44px minimum touch target.
- Inputs include labels, units, min/max, and range accessibility metadata.
- Preset and reset buttons include aria labels.
- Graph sections are collapsible through the shared shell.
- The layout keeps visual content first and avoids removing the existing fallback panels.
- Validation labels avoid overclaiming "Validated Simulation" when benchmark metadata is missing.

## Route QA

Smoke-tested routes:

- `/experiments`
- `/experiments/uniform-motion`
- `/experiments/friction`
- `/experiments/inclined-plane`
- `/experiments/elastic-collision`
- `/experiments/hooke-s-law`
- `/experiments/circular-motion`
- `/experiments/chladni-plate`
- `/experiments/single-slit-diffraction`
- `/experiments/wave-lab`
- `/experiments/conservation-of-energy`
- `/experiments/newton-s-second-law`
- `/experiments/projectile-motion`
- `/experiments/free-fall`
- `/experiments/ohms-law`

All priority migrated routes loaded. The sampled non-migrated routes loaded through the existing fallback path.

## Fallback Experiments

Any experiment id not listed in `dedicatedExperimentRegistry` still uses the existing generic/guided experiment flow. Confirmed fallback smoke routes include:

- `conservation-of-energy`
- `newton-s-second-law`
- `projectile-motion`
- `free-fall`
- `ohms-law`

These routes should stay on fallback until dedicated lab folders, engines, benchmark cases, and domain-specific visuals are added.

## Known Limitations

- Vite reports one large JavaScript chunk: `assets/index-C7B8EqNs.js` around 3.2 MB minified, 905 KB gzip. Build still passes. Code splitting is recommended as a separate controlled performance task.
- The browser wrapper timed out on a mobile screenshot capture, so final mobile evidence is based on route smoke, DOM inspection, CSS target fixes, and successful build.
- Some legacy fallback labs still rely on generic visualization and should not be treated as fully dedicated simulations.
- Fallback pages may still show high trust percentages from legacy metadata, but benchmark status chips now avoid the old "Validated Simulation" overclaim when central validation metadata is absent.
- Chladni plate remains qualitative by design.

## Recommended Next 10 Experiments To Migrate

1. `projectile-motion`
2. `free-fall`
3. `newton-s-second-law`
4. `conservation-of-energy`
5. `ohms-law`
6. `simple-pendulum`
7. `lens-formula`
8. `mirror-formula`
9. `buoyancy`
10. `gas-laws`

## Commands Run

```bash
npm run build
```

Result: passed. Vite bundle-size warning remains.

```bash
npm run test:physics
```

Result: passed, 201/201 validation tests.

## Release Readiness

Acceptance criteria status:

- Build passes: yes.
- Physics validation passes: yes.
- Final report exists: yes.
- Priority migrated routes load: yes.
- Non-migrated fallback routes still load: yes.
- Dedicated labs are selectively routed through the registry: yes.
- Existing generic behavior is preserved: yes.
- App is ready for manual browser review: yes.
