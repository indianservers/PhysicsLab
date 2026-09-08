# Density & Pressure

- Route: `/fluid-mechanics/density-pressure`
- Mockup: `15_fluid_mechanics/01_density_pressure.png`
- Implementation: `src/pages/DensityPressureStudioPage.tsx`, `src/lib/densityPressureStudio.ts`

The fluid probe scene computes gauge pressure with P = ρgh. Fluid type, probe depth, and gravity controls update density, pressure, and the SVG apparatus in real time. Reset and learning challenge controls are included.

Validation: bounded control behavior, reset, direct route refresh, responsive viewport checks, TypeScript check, and production build. No page console errors observed.
