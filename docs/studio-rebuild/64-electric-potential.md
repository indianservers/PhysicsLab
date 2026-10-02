# Electricity Electric Potential

- Mockup: `11_electricity/03_electric_potential.png`
- Route: `/electricity/electric-potential`
- Status: VERIFIED

Implemented a three point-charge potential surface with probe height control, live potential, potential energy, and gradient readings; SVG surface and contour visualization, scalar-potential equation, reset, modes, and challenge dialog. Uses `V = kΣqᵢ/rᵢ` and `U = qV`.

Validation: production build succeeds; direct route load passes; probe-height movement changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. Surface, contours, and charge markers are live SVG geometry.
