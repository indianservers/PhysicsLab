# Resonance rebuild — 2026-10-17

Route `/motion/resonance`; target `08_oscillations/05_resonance.png`.

Replaced generic static spring layout with native Three.js shake-table apparatus, linked amplitude/phase response plots, compact three-parameter controls, six live-reading cards, response selector and reference transport actions. Existing sidebar markup and routes retained. Four reference learning modes remain. Scene uses original geometry, generated native label, PBR materials, lights, shadow receiver and the independently generated decorative lab room; no mockup crops.

Physics: analytical forced damped oscillator, m=.25 kg, k=40 N/m, cosine force. Steady-state amplitude/phase and zero-initial-state transient are both implemented. b=0 and exact resonance is explicitly singular: no fabricated finite steady amplitude; finite-time motion uses the exact linearly growing resonant response. Zero force yields zero response. Q can be infinite. Half-power frequency roots determine bandwidth; the peak frequency includes the damping shift. The scene uses a declared adaptive display scale; data and plots retain SI values. Target sample numbers/phase conventions are inconsistent with its specified inputs and are not copied.

Verification: `node scripts/testResonanceRebuild.mjs` passed 2,160 motion cases, independent finite-difference velocity/acceleration checks, rest initial conditions, singular and zero-force limits, peak/bandwidth trends, parameter sensitivity, all learning modes and transport controls, actual zoom render change, response switch, graph keyboard control, state recording, explanation/prediction/challenge and six viewport sizes. Raw evidence in verification.json. Exact reference-size after image, comparison and difference saved. No browser page errors. No independent scene animation loop; observer/geometries/materials/texture/environment/renderer disposed on unmount.

Physics reference: [OpenStax forced oscillations](https://openstax.org/books/university-physics-volume-1/pages/15-6-forced-oscillations), governing differential equation and amplitude expression. Peak shift and exact half-power roots are derived from that response rather than copying the source's weak-damping simplifications.

Visual status: layout substantially rebuilt, but metal realism, backdrop/camera and type scale remain different from the reference. Metrics are diagnostic, not proof of pixel-perfect completion. Full 102-page goal remains active.

Final production check: `npm run build` passed (TypeScript, Vite, PWA). Raw log: `resonance/build.log`. Broad physics regression passed 581/581; raw output `resonance/physics-regression.log`. Bundle-size/performance acceptance remains open.
