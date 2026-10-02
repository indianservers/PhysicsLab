# Electricity Electric Current

- Mockup: `11_electricity/04_current.png`
- Route: `/electricity/current`
- Status: VERIFIED

Implemented a direct-current wire experiment with voltage, wire diameter, and temperature controls; live current, drift speed, resistance, and current density; electron-drift SVG visualization, Ohm’s law and resistivity equations, reset, modes, and challenge dialog. Uses `R = ρL/A`, `I = V/R`, `J = I/A`, and `v_d = J/(nq)` with copper temperature dependence `ρ = ρ₂₀[1+α(T−20°C)]` and a 186 m wire matching the reference resistance.

Validation: production build succeeds; direct route load passes; default readings are 0.314 A, 15.91 Ω, and 1.60 × 10⁶ A/m²; voltage slider changes readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
