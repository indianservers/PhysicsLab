# Matter Waves

- Route: `/modern-physics/matter-waves`
- Mockup: `16_modern_physics/03_matter_waves.png`
- Implementation: `src/pages/MatterWavesStudioPage.tsx`, `src/lib/matterWavesStudio.ts`

The electron diffraction studio computes the de Broglie wavelength from particle energy and uses Bragg geometry for first-order angle and detector ring radius. Energy, crystal spacing, and beam width controls update the diffraction scene and readings.

Validation: direct refresh, energy boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed. The mockup’s large angle label is physically inconsistent with its wavelength and spacing; the implementation preserves the correct Bragg result.
