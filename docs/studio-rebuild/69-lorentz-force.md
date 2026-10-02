# Magnetism Lorentz Force

- Mockup: `12_magnetism/02_lorentz_force.png`
- Route: `/magnetism/lorentz-force`
- Status: VERIFIED

Implemented a charged-particle orbit in a uniform magnetic field with charge-sign toggle, particle-speed slider, field-strength slider, live curvature radius, Lorentz force, period, circumference, and frequency; trajectory SVG, vector directions, equation, reset, modes, and challenge dialog. Uses `F = qv × B`, `r = mv/(|q|B)`, and `T = 2πm/(|q|B)` for a proton.

Validation: production build succeeds; direct route load passes; default readings are r = 0.261 m, |F| = 1.60 × 10⁻¹³ N, and f = 3.05 × 10⁶ Hz; field-strength changes update readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The mockup’s 0.106 m radius is inconsistent with its displayed proton constants, so the implementation preserves the correct proton physics.
