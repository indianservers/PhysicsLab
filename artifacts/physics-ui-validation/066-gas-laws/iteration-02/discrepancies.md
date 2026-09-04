# Lesson 066 — Gas Laws and Kinetic Theory

## Baseline

- The pre-existing route used a shared generic premium panel with three generic sliders, a schematic box, no process modes, no piston manipulation, no Maxwell–Boltzmann distribution, no complete playback, and no Boyle-law mission.
- Baseline evidence is saved in `../iteration-00/pre-existing.png`.

## Iteration 01

- Replaced the generic route body with the mockup's three-column composition: process controls, piston chamber, live measurements, process graph, molecular-speed graph, and challenge.
- The first generated apparatus had a checkerboard baked into RGB. It was rejected and replaced by an RGBA edit with genuine alpha (`0–254`, 1,016,903 fully transparent pixels).
- Added deterministic reflecting particles, state-linked supplied blue/orange effect layers, dynamic piston/gauge/thermometer overlays, graph tabs, and all three locked processes.
- The first tablet breakpoint left two compact selects slightly beyond the content edge. The single-column breakpoint was raised to 900 px.
- Replaced the custom SVG-only piston hit area with a native vertical range over the illustrated handle. Pointer/touch manipulation and the explicit horizontal volume slider share the same state; Home/End/arrow keyboard operation is verified.

## Iteration 02

- Desktop 1440×900, laptop 1180×800, tablet 820×1180, and mobile 390×844 have no document overflow, broken images, alerts, or off-screen lesson controls.
- Default reference state: `N=200` display packets, `T=350 K`, `V=2.50 L`, `P=101.3 kPa`, `PV=253.31 J`.
- Boyle check: `V=1.25 L` gives `P=202.7 kPa` at `350 K`; `PV` drift is zero.
- Charles check: at `P=101.3 kPa`, changing `T` from `250 K` to `600 K` changes `V` from `1.79 L` to `4.29 L`; `V/T` drift is zero.
- Isochoric check: at `V=2.50 L`, changing `T` from `250 K` to `500 K` doubles `P` from `72.4 kPa` to `144.8 kPa`; `P/T` drift is zero.
- Playback, pause/resume, replay, step, 0.25×–2× speed, reduced motion, timeline, molecule-count/volume/temperature extrema, velocity/collision toggles, graph tabs, molecule selection, reset, invalid mission input, wrong prediction, precondition feedback, and successful mission were exercised.
- The isothermal mission compresses `4.00 L → 2.00 L`, predicts `126.7 kPa`, and reports invariant success.
- The GLB is intentionally not loaded per the active 2D-first project direction. Its named piston/particle behavior is represented by the dynamic 2D state. The supplied transparent effect PNGs are used as temperature-linked chamber layers and animate only while running.

## Result

No material lesson-specific visual, scientific, interaction, or responsive discrepancy remains. A clean final reload records only the two pre-existing React Router v7 future-flag warnings.
