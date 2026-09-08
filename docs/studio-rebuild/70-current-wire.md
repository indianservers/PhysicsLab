# Magnetism Current-Carrying Wire

- Mockup: `12_magnetism/03_current_wire.png`
- Route: `/magnetism/current-wire`
- Status: VERIFIED

Implemented a straight current-carrying wire simulation with current, wire-direction, and probe-radius controls; live magnetic field strength, radius, and current readings; concentric field-line SVG, right-hand-rule direction cue, equation, reset, modes, and challenge dialog. Uses `B = μ₀I/(2πr)`.

Validation: production build succeeds; direct route load passes; default field is 12.00 μT at 3.0 A and 5.0 cm, matching the reference; current changes update readings and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
