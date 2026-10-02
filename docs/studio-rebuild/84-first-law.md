# First Law of Thermodynamics

- Route: `/thermodynamics/first-law`
- Mockup: `14_thermodynamics/04_first_law.png`
- Implementation: `src/pages/FirstLawStudioPage.tsx`, `src/lib/firstLawStudio.ts`

The studio models the first law, ΔU = Q − W, with bounded heat input, external pressure, and process type controls. Readings update synchronously for temperature, pressure, volume, heat, work, and internal-energy change. Reset restores the reference state; mode and challenge buttons open the learning dialog.

Validation: direct refresh on the dedicated route, slider/input updates, process selection (including isochoric zero-work state), reset, challenge dialog, six required viewport sizes, and production build. No page console errors observed.
