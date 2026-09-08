# Gravitational Field

- Mockup: `07_gravitation/02_gravitational_field.png`
- Route: `/motion/gravitational-field`
- Status: VERIFIED

Implemented a responsive field visualization with generated Earth asset, radial vectors, probe marker, controls for planet mass, probe radius, and vector density, live field strength and gravitational potential, inverse-square graph, equation, reset, zoom, and challenge dialog. Physics uses `g = GM/r²` and `Φ = −GM/r` with bounded SI controls.

Validation: production build succeeds; direct load and refresh pass; default readings are 0.92 m/s² and −1.92e7 J/kg; controls clamp and update; required responsive viewports have no horizontal overflow. Console output contains only existing React Router future-flag warnings.
