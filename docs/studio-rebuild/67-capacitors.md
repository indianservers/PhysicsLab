# Electricity Capacitors

- Mockup: `11_electricity/06_capacitors.png`
- Route: `/electricity/capacitors`
- Status: VERIFIED

Implemented a parallel plate capacitor with plate-area, separation, voltage, and dielectric controls; live capacitance, stored charge, and energy; animated-style SVG plates and dielectric, capacitor equations, reset, modes, and challenge dialog. Uses `C = εᵣε₀A/d`, `Q = CV`, and `U = ½CV²`.

Validation: production build succeeds; direct route load passes; default readings are 8.63 μF, 43.2 μC, and 107.9 μJ, matching the supplied mockup scale; separation changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The reference’s effective plate scale is retained so displayed values match its 8.85 μF calibration.
