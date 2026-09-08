# Continuity

- Route: `/fluid-mechanics/continuity`
- Mockup: `15_fluid_mechanics/04_continuity.png`
- Implementation: `src/pages/ContinuityStudioPage.tsx`, `src/lib/continuityStudio.ts`

A variable-area pipe demonstrates A₁v₁ = A₂v₂. Inlet area, outlet area, and volumetric flow controls update both velocity readings, mass flow, and the SVG flow path in real time.

Validation: direct refresh, outlet-area boundary interaction, reset, six required viewport sizes with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
