# Radioactivity

- Route: `/modern-physics/radioactivity`
- Mockup: `16_modern_physics/06_radioactivity.png`
- Implementation: `src/pages/RadioactivityStudioPage.tsx`, `src/lib/radioactivityStudio.ts`

The decay studio models alpha, beta, and gamma isotopes with exponential half-life decay. Isotope, shielding material, shield thickness, and elapsed-time controls update remaining nuclei and detector count rate live.

Validation: direct refresh, elapsed-time boundary interaction, reset, six responsive viewports with no horizontal overflow, TypeScript check, and production build. No page console errors observed. The implementation preserves the physically correct isotope half-lives even where the reference combines inconsistent sample values.
