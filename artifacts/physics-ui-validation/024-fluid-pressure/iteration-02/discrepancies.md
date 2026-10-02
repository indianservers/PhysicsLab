# Lesson 024 — Fluid Pressure with Depth visual review

- The supplied GLB was deliberately not loaded under the user's current 2D-first direction. A generated transparent connected-vessel/manometer bench replaces it; probes, pressure markers, gradient, normal-force arrows and jets are code-driven SVG overlays.
- The mockup's hydrostatic layout is retained inside the app shell: fluid/planet controls, selectable vessel geometry, large bench, manometer reading, pressure-depth graph, live measurements and equal-depth challenge.
- Absolute pressure uses `P=P0+ρgh`; gauge pressure is `ρgh`. All three vessel readings derive from the same depth and remain identical when shape changes.
- Side-hole speeds use Torricelli's law `v=√(2gh)`. Ranges use `R=2√(h(H−h))` for a two-metre water column and a landing plane at the vessel base; this correctly shows that maximum range occurs near mid-depth rather than simply increasing forever with depth.
- The displayed hatch force is gauge pressure times 0.12 m². SVG arrows are drawn normal to vertical and sloped walls, with a zero dot-product benchmark for perpendicularity.
- Browser verification covered all three vessel shapes, keyboard probe movement from 0.75 to 0.80 m, shape-independent readings, play/pause/step, 2× speed, reduced motion, and the fill → gradient → jets sequence.
- The mission was completed with probes at 0.60 m in narrow and tapered vessels: both read 6.031 kPa gauge.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-44a095e3-9ffc-4d2a-aaf3-c0ede705fc5b.png`; app copy: `public/assets/experiments/fluid-pressure/hydrostatic-vessels.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 layouts were captured. A fresh console had no runtime errors; the two React Router future-flag warnings are pre-existing.
