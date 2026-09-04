# Lesson 023 — Density Float-or-Sink Tank visual review

- The supplied GLB was deliberately not loaded under the user's current 2D-first direction. Its `test_object` role is implemented as a pointer/touch/keyboard-draggable SVG shape over a generated transparent layered tank.
- The image provides only glass, ruler and four translucent liquids. Shape, size, position, splash, depth, density labels, state, equilibrium and force measurements all come from authoritative simulation state.
- The mockup's tank, layered-fluid key, object builder, measurements and neutral-density challenge are retained in the existing application shell. Controls cover mass, volume, single-fluid density, layered/single mode, cube/sphere/cylinder and drop depth.
- Density uses `ρobject=(m[g]/V[cm³])×1000 kg/m³`; force uses `Fb=ρlocal gVdisplaced` and `W=mg`. Surface equilibrium uses the submerged fraction; interface equilibrium uses the adjacent liquids' volume-weighted effective density.
- Layer decisions are deterministic: below oil density floats at the surface; exact layer density suspends; intermediate density rests at the corresponding interface; density above the bottom layer sinks. Shape changes stable-orientation feedback and rendered geometry without changing average-density physics.
- The eight-second release sequence includes splash, vertical acceleration cue, damped oscillation and settling; reduced motion jumps to the same equilibrium result. Play/pause/step, 2× speed and keyboard depth movement were browser-tested.
- The mission was completed at 205 g and 200 cm³: `ρobject=1025 kg/m³`, `Fb=W=2.010 N`, matching saltwater.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-2bcd57a8-219a-4014-a8db-d33775567650.png`; app copy: `public/assets/experiments/density-float-sink/layered-tank.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 were captured. A fresh console showed no errors; the two React Router future-flag warnings are pre-existing.
