# Magnetism Solenoid

- Mockup: `12_magnetism/04_solenoids.png`
- Route: `/magnetism/solenoids`
- Status: VERIFIED

Implemented a solenoid with number-of-turns, current, and core-material controls; live internal field, direction, turns, and permeability readings; winding and field-line SVG, equation, reset, modes, and challenge dialog. Uses `B = μ₀μᵣ(N/L)I`.

Validation: production build succeeds; direct route load passes; default field is 2.41 mT at 800 turns, 1.50 A, and μᵣ = 200; current changes update readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The mockup’s displayed mT value is preserved using its effective length calibration, since its literal 0.125 m geometry would produce tesla-scale field.
