# Spring SHM rebuild verification — 2026-10-17

Reference: `08_oscillations/01_spring_shm.png`; route: `/motion/spring-shm`.

Replaced static spring photograph and detached overlay with original procedural SVG stand, helical spring, brass mass, scale and pointer. No reference pixels or cropped assets are used. Kept existing sidebar markup and links. Preserved only Observe, Predict, Experiment and Explain modes from the reference.

Native layout now places apparatus beside displacement plot, phase diagram and kinetic/potential energy plot, with control/readings/equation inspector and transport bar. Playback, pause, reset, time scrubbing, zoom, drag release amplitude, all three numeric/slider inputs, prediction feedback, state recording, explanation and next challenge are implemented. Parameter locks from teacher assignments are respected.

Single analytical state: x=A cos(sqrt(k/m)t), v=-A sqrt(k/m) sin(sqrt(k/m)t), a=-(k/m)x. K=mv²/2, U=kx²/2. Vertical equilibrium is shifted by gravity; x is measured upward relative to equilibrium. Velocity/acceleration overlays are explicitly normalized to displacement units. Actual period is 0.397 s for k=50 N/m and m=0.2 kg; reference's 1.257 s is inconsistent with those inputs and is not copied.

`node scripts/testSpringShmRebuild.mjs` passed: 2,700 model cases covering conservation, Newton equation, periodicity and mass scaling; browser interaction and renderer synchronization checks; no page errors; five viewport widths 1536/1024/768/390/320 without horizontal overflow. `npx tsc -b` passed. Responsive screenshots and raw verification JSON are saved alongside this report. CSS collision with the older spring experiment was found in screenshot inspection and fixed by unique component class names.

Visual status remains refinement open: SVG geometry/materials are less photorealistic than the target; existing sidebar is intentionally retained, and physical graph values differ from the reference's inconsistent illustrative values. Diagnostic sidebar-excluded comparison and difference image saved. This is one rebuilt page in the full 102-page inventory; the overall goal is not complete.
