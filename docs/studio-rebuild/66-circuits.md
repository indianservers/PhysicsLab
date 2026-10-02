# Electricity Circuits

- Mockup: `11_electricity/05_circuits.png`
- Route: `/electricity/circuits`
- Status: VERIFIED

Implemented a parallel DC circuit with supply-voltage slider, selectable branch resistors, switch toggle, live branch and total currents, total power, circuit SVG, reset, modes, and challenge dialog. Uses `I₁ = V/R₁`, `I₂ = V/R₂`, `Iₜ = I₁ + I₂`, and `P = VI`.

Validation: production build succeeds; direct route load passes; defaults reproduce 6.00 V, 27.3 mA, 12.8 mA, and 40.0 mA; opening the switch drives all currents to zero and reset restores the closed circuit; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
