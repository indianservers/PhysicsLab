# Entropy — Two-Chamber Gas Mixing

- Route: `/thermodynamics/entropy`
- Mockup: `14_thermodynamics/05_entropy.png`
- Implementation: `src/pages/EntropyStudioPage.tsx`, `src/lib/entropyStudio.ts`

The simulation exposes particle count, initial partition, and temperature difference. Removing the divider distributes particles across both chambers and updates the live populations and entropy according to ΔS = 2NkB ln 2 on the reference classroom scale. Reset, mode buttons, and challenge dialog are wired.

Validation: direct route refresh, divider removal/reset, control updates, six required viewport sizes, and production build. No page console errors observed.
