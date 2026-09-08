# Electronics Semiconductors

- Mockup: `13_electronics/01_semiconductors.png`
- Route: `/electronics/semiconductors`
- Status: VERIFIED

Implemented a silicon semiconductor lattice with material type, doping level, and temperature controls; live carrier density, band gap, and conductivity; animated-style lattice SVG, semiconductor relation, reset, modes, and challenge dialog. Uses temperature-dependent carrier density and conductivity with `n = N_C exp(−(E_C−E_F)/(k_BT))` as the teaching relation.

Validation: production build succeeds; direct route load passes; default readings are n = 1.00 × 10¹⁶ cm⁻³, E_g = 1.12 eV, and σ = 2.14 × 10¹ S/m; temperature changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
