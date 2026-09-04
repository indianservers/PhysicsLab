# Lesson 020 — Sources of Energy Comparator visual review

- The supplied GLB was deliberately not loaded under the current 2D-first direction. Its solar, wind and hydro roles are represented in a generated transparent grid landscape together with gas, coal, nuclear, storage and city demand required by the lesson.
- All animated power paths, source outputs, city status, hourly bars, battery state and metrics are code-driven. The generated scene is presentation-only and does not determine calculations.
- The mockup's dispatch-simulator structure is retained inside the existing app shell: scenario controls, large landscape, capacity controls, full-day chart, summary metrics and low-emission mission.
- Every one-hour step closes `ΣPgen + Pdischarge + Punmet = Pdemand + Pcharge`. Surplus beyond storage power/capacity is curtailed before reporting dispatched generation.
- Storage uses 90% round-trip efficiency split equally across charge/discharge. State of charge, charge/discharge power and losses use GWh/GW consistently. Lifecycle intensity is reported in gCO₂e/kWh and variable cost in $/MWh.
- Weather changes solar, wind and hydro factors independently; daily demand includes morning and evening peaks. The deterministic one-day model omits transmission constraints, commitment/ramp limits, capital costs and forecast uncertainty, as documented in validation metadata.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-c9674159-161e-4da0-8cd2-8cea37862d4f.png`; app copy: `public/assets/experiments/sources-of-energy/energy-landscape.png` (1994×789, 32-bit alpha).
- Browser checks covered clear/cloudy intermittency, hourly stepping, play/pause, 2× speed, reduced motion, storage accounting, desktop/tablet/mobile layouts and the low-carbon mission. Fresh console: no errors; two React Router future-flag warnings are pre-existing.
