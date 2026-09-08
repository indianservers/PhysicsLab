# Electricity Charge & Coulomb Force

- Mockup: `11_electricity/01_coulomb_force.png`
- Route: `/electricity/coulomb-force`
- Status: VERIFIED

Implemented two point charges with charge and separation sliders, live signed and magnitude force, electric fields at each charge, force vectors, field-line SVG, Coulomb equation, reset, mode tabs, and challenge dialog. Uses `F = kq₁q₂/r²` with `k = 8.99 × 10⁹` and `E = k|q|/r²`.

Validation: production build succeeds; direct route load passes; default force magnitude is 2.50 N; separation slider changes readings and reset restores defaults; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024; no page console errors observed. The optical bench raster is reused from the existing generated asset, while charges and field lines are live SVG.
