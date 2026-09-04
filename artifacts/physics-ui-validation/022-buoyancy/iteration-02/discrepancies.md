# Lesson 022 — Buoyancy visual review

- The supplied GLB and orbit controls were deliberately not loaded under the user's current 2D-first direction. The named `test_object` interaction is represented by a code-rendered, vertically draggable SVG object over a generated transparent apparatus.
- The generated PNG supplies only the tank, stand, spring scale, graduated cylinder and bench scale. Object position/size, suspension line, waterline, force arrows, live readings, status and graph are derived from one simulation state.
- The mockup's three-column bench structure is retained inside the existing app shell: object/fluid/immersion controls, large tank, measurements, force balance, force-versus-immersion graph and prediction mission.
- SI calculations use `Vdisplaced = f Vobject`, `Fb = ρfluid gVdisplaced`, `W = ρobject gVobject`, and `ΣFy = Fb − W`. For a freely floating body, `f = ρobject/ρfluid`; ratios above one produce sinking at full immersion.
- The purposeful eight-second entry sequence moves through entry, partial immersion, damped oscillation and settling. Reduced motion moves directly to the same equilibrium without removing the scientific result.
- Browser verification covered keyboard vertical movement, the live immersion control, cork-like floating (45%), neutral buoyancy (100%), aluminum sinking, play/pause/step, 2× speed and reduced motion. The prompt's input ranges are clamped in the shared solver and exposed in every range control.
- The mission was completed with a 60% prediction for `720/1200`; feedback confirmed `Fb = W` at equilibrium. The force benchmark uses 100 cm³ displaced in water: `Fb = 0.980665 N`.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-e33ed1af-676d-4a1a-962a-f6726ea94e05.png`; app copy: `public/assets/experiments/buoyancy/buoyancy-bench.png` (1536×1024, 32-bit alpha).
- Desktop 1440×900, tablet 1024×768 and mobile 390×844 layouts were captured. A fresh browser console had no runtime errors; the two React Router future-flag warnings are pre-existing.
