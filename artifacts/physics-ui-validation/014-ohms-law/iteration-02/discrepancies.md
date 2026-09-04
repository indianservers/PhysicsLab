# Lesson 014 — Ohm's Law V-I Graph verification

## Deliberate deviations

- The supplied GLB is dominated by a generic inductor coil and does not match the mockup's DC supply, meters, rheostat, and test sample. Following the user's 2D-first direction, the dedicated lesson uses a generated transparent apparatus PNG with live readings and graph overlays; no GLB is loaded.
- The app shell is preserved, while the lesson workspace follows the mockup's controls / apparatus / analysis arrangement.

## Scientific and interaction checks

- Ohmic samples use `R(T)=R20·factor·[1+α(T−20°C)]` and `I=V/R(T)`.
- The tungsten-lamp sample uses a deterministic voltage-dependent hot resistance, producing a curved non-ohmic V–I trace.
- The graph explicitly plots V in volts vertically against I in amperes horizontally, so `ΔV/ΔI` is resistance in ohms.
- Seven sweep points run from 0 to 12 V; play, pause, resume, step, replay, 2× speed, and reduced motion were exercised.
- Minimum, typical, and maximum controls remained finite. The hidden-sample mission was correctly completed as non-ohmic.
- Responsive screenshots: desktop 1440×900, tablet 900×1100, mobile 390×844. Fresh-tab console errors: 0.

## Generated asset

- Runtime: `public/assets/experiments/ohms-law/apparatus.png`
- Original: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-ad048ac1-1d3c-4863-81d6-013f11b0b263.png`
- Alpha: 1536×1024; sampled corner alpha values are 0.
- Prompt: "Create a high-resolution transparent-background PNG asset for an educational Ohm's law V-I graph laboratory web simulator, realistic slightly elevated front view. Arrange a pale wooden lab board with a DC bench power supply at left showing green digits, a knife switch, a large analog ammeter in series, a large analog voltmeter connected across a cylindrical resistor-under-test, and a sliding rheostat below. Use neat red and blue/black insulated wires forming a scientifically plausible circuit. Warm wood, cream meter faces, black instrument cases, brass terminals, clear small labels A, V, DC SUPPLY, RHEOSTAT, SAMPLE. No people, no room or scenery, no graph, no explanatory text, no white rectangle, fully transparent alpha outside the complete apparatus group. Leave some uncluttered space above the instruments for live needle/current overlays."
