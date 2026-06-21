# Physics Top 30 Visualization Upgrade Plan

## Goal

Upgrade the Top 30 Physics experiments into premium, cinematic, scientifically trustworthy, mobile-friendly, classroom-ready labs while keeping all existing `/experiments/:id` routes stable.

The migration remains registry-driven:

- Dedicated labs render only when they are registered in `src/experiments/shared/experimentRegistry.ts`.
- Non-migrated experiments continue through the existing generic/guided fallback.
- Top 30 metadata lives in `src/experiments/shared/top30Registry.ts` and does not replace current lab routing by itself.

## Top 30 Scope

1. `circular-motion`
2. `elastic-collision`
3. `friction`
4. `hooke-s-law`
5. `inclined-plane`
6. `uniform-motion`
7. `newton-s-second-law`
8. `conservation-of-energy`
9. `simple-pendulum`
10. `projectile-motion`
11. `chladni-plate`
12. `single-slit-diffraction`
13. `wave-lab`
14. `young-double-slit`
15. `sound-wave-anatomy`
16. `ohms-law`
17. `series-parallel-resistance`
18. `emi-faraday`
19. `ac-generator`
20. `transformer-lab`
21. `electromagnet`
22. `magnetic-field-current`
23. `reflection-plane-mirror`
24. `lens-formula`
25. `prism-dispersion`
26. `total-internal-reflection`
27. `human-eye-defects`
28. `buoyancy`
29. `bernoulli-fluid-flow`
30. `gas-laws`

## Shared Premium Components

New shared components are available under `src/experiments/shared/`:

- `PremiumExperimentShell.tsx`
- `CinematicStage.tsx`
- `PhysicsHUD.tsx`
- `VariableInspector.tsx`
- `CauseEffectPanel.tsx`
- `PredictionCard.tsx`
- `MisconceptionCard.tsx`
- `FormulaDerivationPanel.tsx`
- `MeasurementProbe.tsx`
- `VectorOverlay.tsx`
- `EnergyBarSystem.tsx`
- `ReplayTimeline.tsx`
- `PresetStrip.tsx`
- `LabModeSwitcher.tsx`
- `MobileLabDock.tsx`
- `visualThemes.ts`
- `domainVisualContracts.ts`
- `top30Registry.ts`

Styles are isolated in `src/experiments/shared/premiumExperimentShell.css`.

## Visual Contracts

Every upgraded lab must satisfy its domain contract.

### Mechanics

- Force arrows
- Velocity arrows
- Acceleration arrows
- Free-body diagram
- Motion trail
- Energy bars
- Graph cursor
- Slow-motion replay

### Waves

- Wavefronts
- Phase markers
- Amplitude ruler
- Detector probe
- Interference or intensity map
- Synchronized time graph

### Electricity

- Circuit-board style
- Glowing wires
- Moving charge particles
- Switch states
- Meters
- Voltage/current labels
- Safety or overload hints

### Magnetism

- Magnetic field lines
- Compass needles
- Polarity labels
- Flux loops
- Induced current direction
- Field strength heat map

### Optics

- Ray tracing
- Normal lines
- Focal points
- Angle arcs
- Screen/image formation
- Prism spectrum
- Sign convention overlay

### Fluids

- Streamlines
- Pressure probes
- Density coloring
- Buoyancy arrows
- Depth rulers
- Particle flow

### Thermodynamics

- Particles in container
- Temperature color map
- Collision density
- Pressure gauge
- Energy packets
- Heat flow arrows

## Six-Phase Migration Strategy

### Phase 1: Foundation

Create shared premium components, domain visual contracts, theme tokens, and the Top 30 metadata registry. No existing route should change behavior during this phase.

Exit criteria:

- Build passes.
- All 30 priority ids are in `top30Registry`.
- Existing dedicated labs still render through the old registry.
- Existing fallback labs still load.

### Phase 2: Mechanics Premium Pass

Upgrade the 10 mechanics labs:

- `circular-motion`
- `elastic-collision`
- `friction`
- `hooke-s-law`
- `inclined-plane`
- `uniform-motion`
- `newton-s-second-law`
- `conservation-of-energy`
- `simple-pendulum`
- `projectile-motion`

Focus:

- Cinematic force/motion stages
- Free-body diagrams
- Energy bars
- Replay timeline
- Benchmark cases and edge-case warnings

### Phase 3: Waves Premium Pass

Upgrade:

- `chladni-plate`
- `single-slit-diffraction`
- `wave-lab`
- `young-double-slit`
- `sound-wave-anatomy`

Focus:

- Wavefronts and phase markers
- Detector probes
- Interference/intensity maps
- Qualitative warning when exact physics is not solved

### Phase 4: Electricity And Magnetism Premium Pass

Upgrade:

- `ohms-law`
- `series-parallel-resistance`
- `emi-faraday`
- `ac-generator`
- `transformer-lab`
- `electromagnet`
- `magnetic-field-current`

Focus:

- Circuit-board style
- Moving charges
- Field lines and compass probes
- Flux loops and induced current direction
- Safety/overload hints

### Phase 5: Optics, Fluids, And Thermodynamics Premium Pass

Upgrade:

- `reflection-plane-mirror`
- `lens-formula`
- `prism-dispersion`
- `total-internal-reflection`
- `human-eye-defects`
- `buoyancy`
- `bernoulli-fluid-flow`
- `gas-laws`

Focus:

- Ray tracing and sign conventions
- Realistic eye/lens visuals
- Fluid probes and streamlines
- Particle-gas pressure/temperature coupling

### Phase 6: Polish, Validation, And Classroom QA

Run full release hardening:

- Validate benchmark cases.
- Verify no quantitative lab claims accuracy without executable benchmark metadata.
- Test desktop/tablet/mobile layouts.
- Test keyboard and screen-reader labels.
- Confirm every lab has three presets.
- Confirm replay timeline steps: setup, prediction, change variable, observe, explain, conclusion.
- Document known limits and remaining fallback labs.

## Scientific Accuracy Rules

- Do not display "validated" unless benchmark cases pass.
- Do not use exact calculator labels for qualitative visuals.
- Convert internally to SI where required.
- Show classroom units and converted SI values when the formula needs SI.
- Guard against divide-by-zero, impossible negative values, invalid angle/radius/wavelength, and silent NaN/Infinity.
- If a model is approximate, label the approximation near the formula and visual.

## Mobile Rules

- Visual first.
- Controls collapsed or in dock/sheet.
- Sticky observation remains readable.
- Touch targets around 44px minimum.
- Graphs and teacher notes collapsed by default.
- No horizontal overflow.
- No overlapping panels.

## Classroom Rules

Every premium lab should include:

- Prediction prompt
- Misconception card
- Cause-to-effect explanation
- Replay timeline
- Three presets: beginner demo, misconception demo, real-world demo
- Conclusion sentence starter

## Current Phase Status

Phase 1 foundation is implemented:

- Top 30 metadata registry added.
- Domain contracts added.
- Premium components added.
- Premium CSS isolated.
- Existing registry can expose premium metadata without changing route behavior.

Next recommended phase: Mechanics premium pass for `newton-s-second-law`, `conservation-of-energy`, `simple-pendulum`, and `projectile-motion`, while polishing the existing six mechanics labs with `PremiumExperimentShell`.
