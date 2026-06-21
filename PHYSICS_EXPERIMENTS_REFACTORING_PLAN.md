# Physics Experiments Refactoring Plan

## Purpose
Create a migration path from shared generic visualizations to accurate, distinct, classroom-ready simulations without breaking existing routes.

## Recommended Folder Structure

```text
src/experiments/
  shared/
    ExperimentShell.tsx
    FormulaAssumptionBox.tsx
    ControlGroup.tsx
    ObservationPanel.tsx
    GraphPanel.tsx
    TeacherReplay.tsx
    MobileExperimentSheet.tsx
    validation.ts
  projectile-motion/
    projectileMotionSimulation.ts
    projectileMotionData.ts
    projectileMotion.css
    ProjectileMotionLab.tsx
  ohms-law/
    ohmsLawCircuitEngine.ts
    ohmsLawData.ts
    ohmsLaw.css
    OhmsLawLab.tsx
```

## Shared Utilities
- Unit conversion and symbol registry.
- Formula evaluator wrappers with assumptions.
- Benchmark case runner per experiment.
- Graph shape validators.
- Measurement probe primitives.
- Domain visual layers for vectors, rays, waves, fields, heat maps, and particle flows.

## Experiment-Specific JS/CSS Strategy
- Keep shared route /experiments/:id stable.
- Add an experiment registry that maps an id to a dedicated lab component when available.
- Fall back to GenericExperiment only during migration.
- Each dedicated lab owns its CSS, engine, presets, validation data, teacher replay steps, and mobile layout.

## Naming Convention
- Folder: kebab-case experiment id.
- React component: PascalCase + Lab.
- Engine: camelCase + Simulation/Engine.
- Data file: camelCase + Data.
- CSS: kebab-case experiment id.
- Tests: kebab-case experiment id + .validation.ts or benchmark data in shared runner.

## Migration Sequence
1. Add shared experiment shell and registry.
2. Migrate top 10 urgent fixes: circular-motion, elastic-collision, friction, hooke-s-law, inclined-plane, uniform-motion, chladni-plate, single-slit-diffraction, conservation-of-energy, newton-s-second-law.
3. Add benchmark cases for every migrated quantitative model.
4. Split domain visual components: mechanics, optics, waves, circuits, fields, thermal, fluids, modern physics, astronomy.
5. Add teacher replay and beginner/advanced modes.
6. Run desktop/tablet/mobile QA and update status metadata.

## Guardrails
- Do not remove GenericExperiment until all routes have replacements.
- Do not claim validated accuracy unless benchmark cases pass.
- Do not mix qualitative visual approximations with exact calculator labels.
- Keep reports, teacher links, search, and route paths compatible.
