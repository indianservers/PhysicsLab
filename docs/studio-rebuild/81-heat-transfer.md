# Thermodynamics Heat Transfer

- Mockup: `14_thermodynamics/02_heat_transfer.png`
- Route: `/thermodynamics/heat-transfer`
- Status: VERIFIED

Implemented heat conduction through a metal rod with material, temperature-difference, and elapsed-time controls; live hot/cold ends, heat flux, and total transfer rate; rod SVG with hot-to-cold gradient, conduction equation, reset, modes, and challenge dialog. Uses Fourier’s relation `q = −k dT/dx ≈ k(Tₕ−T꜀)/L`.

Validation: production build succeeds; direct route load passes; defaults reproduce 100 °C, 20 °C, 1.90 × 10³ W/m², and 9.48 W; temperature difference changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. Effective geometry calibration matches the supplied reference readouts.
