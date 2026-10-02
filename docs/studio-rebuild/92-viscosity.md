# Viscosity

- Route: `/fluid-mechanics/viscosity`
- Mockup: `15_fluid_mechanics/06_viscosity.png`
- Implementation: `src/pages/ViscosityStudioPage.tsx`, `src/lib/viscosityStudio.ts`

A falling sphere viscometer demonstrates Stokes’ drag law. Fluid, sphere radius, and temperature controls update dynamic viscosity, terminal speed, drag force, and Reynolds number in the live scene.

Validation: direct refresh, temperature boundary interaction, reset, six required viewport sizes with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
