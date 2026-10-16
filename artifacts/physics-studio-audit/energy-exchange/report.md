# Energy Exchange rebuild — 2026-10-17

Route `/motion/energy-exchange`, reference `08_oscillations/03_energy_exchange.png`.

Rebuilt the reference-specific layout: horizontal cart bench, live energy bars, phase/frequency/period panel, controls, energy and phase-space charts, equation and live values, five motion-view toggles, realistic/schematic switch and friction control. Existing sidebar markup retained. Four learning modes only; no unrelated 3D tabs. Original native Three.js spring/cart/track/wheels/ruler, rounded geometry, shadows, PBR materials and generated native cart label. Decorative background reuses the independently generated pendulum room. No reference crops. Native SVG fallback handles unavailable WebGL.

One exact damped oscillator state drives geometry, vectors, readings and graphs. Initial conditions x=A and v=0; underdamped, critical and overdamped branches supported. Ideal energy is conserved; viscous friction transfers energy at bv². Correct default E=1 J and T₀=0.889 s differ from the mockup's inconsistent samples. Friction input is explicitly labeled in N·s/m. Positive frame deltas prevent negative startup time; equivalent fix also applied to Spring SHM.

Passing checks: `node scripts/testEnergyExchangePhysics.mjs` (13,068 cases, plus critical/overdamped checks); `node scripts/testEnergyExchangeBrowser.mjs` (all visible controls, five toggles verified against actual render/trace changes, recording, keyboard release, zoom, schematic, six responsive widths, three mount/navigation cycles, WebGL fallback, no page errors). Raw JSON and deterministic time=2.84 s screenshots saved here. Three.js resources and observer disposed on unmount; no independent scene animation loop.

Visual inspection and sidebar-excluded comparison recorded. Material realism, camera composition and type scale still differ from the reference. Goal remains open for the complete 102-page inventory.
Production verification: `npm run build` completed successfully (TypeScript, Vite and PWA generation). Existing bundle-size warnings remain; this is not a performance acceptance claim.
