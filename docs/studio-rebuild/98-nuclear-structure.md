# Nuclear Structure

- Route: `/modern-physics/nuclear-structure`
- Mockup: `16_modern_physics/05_nuclear_structure.png`
- Implementation: `src/pages/NuclearStructureStudioPage.tsx`, `src/lib/nuclearStructureStudio.ts`

The isotope studio exposes proton and neutron counts and computes mass number, semi-empirical binding energy, binding energy per nucleon, mass defect, and a stability estimate. The nucleus visualization updates its proton/neutron composition as controls change.

Validation: direct refresh, neutron-number boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
