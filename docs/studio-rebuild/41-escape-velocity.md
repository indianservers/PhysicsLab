# Escape Velocity

- Mockup: `07_gravitation/05_escape_velocity.png`
- Route: `/motion/escape-velocity`
- Status: VERIFIED

Implemented a launch visualization with generated spacecraft/Earth asset, bound and unbound trajectories, controls for radius, mass, and launch speed, live escape velocity, residual speed, energy, bound status, equation, reset, and challenge dialog. Physics uses `v_esc = sqrt(2GM/R)` and `v_inf = sqrt(v0^2 - v_esc^2)` when unbound.

Validation: production build succeeds; direct route load passes; default escape velocity 11.18 km/s and status UNBOUND; controls update; required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
