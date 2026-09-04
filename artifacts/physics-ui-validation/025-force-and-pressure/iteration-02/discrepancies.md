# Lesson 025 — Force and Pressure visual review

- The supplied GLB was deliberately not loaded under the user's current 2D-first direction. The `test_object` interaction is a pointer/touch/keyboard-rotatable SVG block over a generated transparent loading press and force plate.
- The generated PNG supplies only the physical rig. Block orientation, footprint, pressure heatmap, applied-force arrow, deformation, graph and display values are driven by authoritative simulation state.
- The mockup's station layout is retained inside the existing app shell: force/area controls, face and surface selectors, large force plate, live readings, inverse-area graph and fragile-surface mission.
- Pressure uses `P=F/A` in SI units. Broad/side/end faces use 0.080/0.040/0.020 m², producing 7.5/15/30 kPa at 600 N while total normal force remains exactly 600 N.
- Steel, foam and clay use illustrative elastic moduli for `strain=P/E`; changing material affects deformation but never the contact-pressure calculation. The heatmap represents uniform average pressure and omits edge stress concentrations.
- Load animation ramps from zero to the selected force while redistributing the footprint. Play/pause/step, 2× speed, reduced motion, face buttons and keyboard rotation were browser-tested.
- The mission was completed at constant 600 N using a 0.160 m² snowshoe pad, giving 3.75 kPa below the 12 kPa limit.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-6e45ca38-88b0-41a1-aa47-908e12e7477c.png`; app copy: `public/assets/experiments/force-and-pressure/contact-pressure-rig.png` (1024×1536, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 were captured. A fresh console had no runtime errors; the two React Router future-flag warnings are pre-existing.
- Adding the lesson moved the monolithic application chunk just beyond the prior 4 MiB Workbox ceiling. `vite.config.ts` now uses a 5 MiB precache ceiling; the full production/PWA build subsequently passed.
