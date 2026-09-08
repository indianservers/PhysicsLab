# Bernoulli

- Route: `/fluid-mechanics/bernoulli`
- Mockup: `15_fluid_mechanics/05_bernoulli.png`
- Implementation: `src/pages/BernoulliStudioPage.tsx`, `src/lib/bernoulliStudio.ts`

The Venturi tube model applies Bernoulli’s equation to relate flow speed, throat diameter, fluid density, pressure drop, volumetric flow, and Reynolds number. Controls update the SVG tube and all readings synchronously.

Validation: direct refresh, throat-diameter boundary interaction, reset, six viewport sizes with no horizontal overflow, TypeScript check, and production build. No page console errors observed.
