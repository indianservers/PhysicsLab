# Optics Diffraction

- Mockup: `10_optics/06_diffraction.png`
- Route: `/optics/diffraction`
- Status: VERIFIED

Implemented a single-slit diffraction experiment with aperture width, wavelength, screen distance, and detector position controls; live central-maximum width, angular spread, and sinc-squared detector intensity; apparatus visualization, diffraction equations, reset, mode tabs, and challenge dialog. Uses `a sin θ = mλ`, `Δy ≈ 2Lλ/a`, and `I/I₀ = (sin β/β)²` with `β = πay/(λL)`.

Validation: production build succeeds; direct route load passes; default central maximum width 6.32 mm and angular spread ±0.36°; aperture slider changes readings and reset restores defaults; challenge dialog opens; browser console has no page errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The page reuses the previously generated `reflection.png` optical-bench asset; no new raster asset was generated.
