# Page 28 - Friction

Studio: 05_force_newton
Mockup: 05_force_newton/04_friction.png
Route: /motion/friction
Status: VERIFIED

Physics: static friction holds up to mu_s*N; kinetic friction is mu_k*N after sliding. Normal load and pull force clamp to 0-30 N; surface pairs update coefficients.

Interaction validation: numeric and range controls, surface menu, mode dialogs, reset, play/pause, zoom and challenge actions passed. Six required responsive viewports passed with no horizontal overflow. Production build passed.

Evidence: artifacts/studio-rebuild/28-friction-initial.png, scripts/testFrictionStudioPhysics.mjs, scripts/smokeFriction.mjs, scripts/testFrictionResponsive.mjs.

Correction: mockup friction values disagree with its normal load; implementation uses consistent friction physics.
