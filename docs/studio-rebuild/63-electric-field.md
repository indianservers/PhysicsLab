# Electricity Electric Field

- Mockup: `11_electricity/02_electric_field.png`
- Route: `/electricity/electric-field`
- Status: VERIFIED

Implemented a two-source-charge electric field exploration with charge, probe position, and field-line density controls; live vector components, magnitude, and direction; SVG field-line visualization; superposition equation, reset, modes, and challenge dialog. Uses `E = kq(r-rᵢ)/|r-rᵢ|³` and vector superposition.

Validation: production build succeeds; direct route load passes; default net field is 2.83 × 10⁵ N/C at −25.5°; probe movement changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. Charge spheres and field lines are live SVG geometry.
