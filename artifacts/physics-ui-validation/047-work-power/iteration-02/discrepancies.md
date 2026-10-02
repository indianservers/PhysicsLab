# Lesson 047 — Work and Power

- Followed the user's current direction to defer 3D. The generated transparent crate/trolley PNG is the moving load; warehouse, path, force-angle handle, friction/displacement vectors, meters, timelines, and energy accounting are live 2D layers.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-06d2ff65-a69b-4f69-b5f9-bcf936d33c0d.png`.
- App asset: `public/assets/experiments/work-power/warehouse-load.png` (1536×1024 RGBA; transparent alpha verified).
- Physics uses `W=∫F·ds=Fd cosθ`, `N=max(0,mg−F sinθ)`, `fₖ=μₖN`, `P̄=W/Δt`, `P=F·v`, and `Wnet=ΔK` for a constant-force rest-start load.
- Added force, path distance, force angle, duration, and friction controls; min/typical/max presets; draggable force direction and path target; play, pause, step, replay, scrub, speed, and reduced motion.
- The mission delivered 599.9 J at 114.3 W average under the 150 W limit. Browser readings showed applied 1290.3 J plus friction −690.4 J equals 599.9 J kinetic energy.
- Checked at 1440×900, 820×1180, and 390×844. No console errors were reported. Mobile preserves the animated load and all controls/readings/graphs in a stacked layout.
