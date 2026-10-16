# Damping rebuild — 2026-10-17

Reference `08_oscillations/04_damping.png`; route `/motion/damping`.

Rebuilt native layout: fluid chamber left, displacement/envelope plot right, decay/Q/regime cards, branch-specific equation, three controls and transport bar. Kept existing sidebar markup/links and exactly four reference learning modes. Original SVG glass, water, steel columns, helical spring, mass, ruler and viscosity gauge; decorative independently generated lab room reused. No screenshot crops. Scene is model-driven with pointer and keyboard release displacement and zoom.

Corrected old physics: a decaying cosine without the release-phase term gave nonzero initial velocity and incorrect critical/overdamped solutions. Uses exact analytical underdamped, critically damped and overdamped solution shared with Energy Exchange. Initial conditions x(0)=x₀, v(0)=0. True underdamped envelope bounds the phase-correct release solution. b=0 gives infinite Q. Period/regime, chamber, curve, measurements and recordings derive from the same model. k=50 N/m retained and explicitly explained. Reference's default δ=0.482 and Q=2.18 do not match b=.8, m=.25, k=50; correct δ=1.6 and Q=4.42 are shown.

Passing `node scripts/testDampingRebuild.mjs`: 9,648 model cases, energy dissipation, release from rest, Newton equation, envelope bound, all three regimes, Q at zero damping; browser checks for playback/reset/zoom, control sensitivity, model/chamber synchronization, recording, prediction/explanation/challenge, six viewport sizes, no page errors or horizontal overflow. Desktop panel overlap found during visual inspection and fixed; a geometry assertion now checks no overlap at every tested size. Raw results and deterministic screenshots at t=.2 s are saved alongside comparison/difference images.

Broad regression: `npm run test:physics` passed 581/581. Visual realism remains open: procedural glass and steel are less photographic than the target. This evidence verifies a rebuilt page, not completion of the whole 102-page goal.
Production verification: `npm run build` completed successfully (TypeScript, Vite and PWA generation). Existing bundle-size warnings remain; this is not a performance acceptance claim.
