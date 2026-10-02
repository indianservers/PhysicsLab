# Lesson 015 — Series and Parallel Resistance verification

## Deliberate deviations

- The supplied GLB is a generic inductor-coil scene and does not match the resistor construction board. Per the user's current 2D-first direction, the lesson uses a generated transparent board PNG plus live SVG circuits and does not load the GLB.
- The mockup's two simultaneous finished circuits are replaced with one editable construction state and a saved comparison state. This keeps each resistor, switch, topology, current, voltage drop, and mission result driven by one authoritative solver.

## Scientific and interaction checks

- Series default: `R_eq = 2 + 3 + 6 = 11 Ω`, total current `12/11 = 1.091 A`, and drops sum to 12 V.
- Parallel default: `1/R_eq = 1/2 + 1/3 + 1/6`, so `R_eq = 1 Ω`; branch currents 6 A, 4 A, and 2 A recombine to 12 A.
- Both KCL and `VI = ΣI_i²R_i` residuals display zero at numerical precision.
- Pointer drag from the open R1 component to the board was exercised and reconnected the branch. Tap/click and keyboard-operable buttons provide the touch/accessibility path.
- Minimum, typical, maximum, individual switch, topology, resistor, and voltage controls remained finite.
- Play, pause, resume, step, replay, 2× speed, reduced motion, and current-proportional line thickness were exercised.
- Mission completed with Network A (`2 Ω + 4 Ω` in series) and a different Network B (one active `6 Ω` branch in parallel mode), both `6.00 Ω`.
- Responsive screenshots: desktop 1440×900, tablet 900×1100, mobile 390×844. Fresh-tab console errors: 0.

## Generated asset

- Runtime: `public/assets/experiments/series-parallel-resistance/construction-board.png`
- Original: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-1a8f0bca-9597-4eed-b601-a0139e93d1f8.png`
- Alpha: 1536×1024; sampled corner alpha values are 0.
- Prompt: "Create a high-resolution transparent-background PNG asset for a polished educational series-versus-parallel resistor construction web simulator. Show a pale wooden laboratory pegboard/breadboard viewed nearly top-down with subtle perspective, two clearly separated empty circuit workspaces side by side, each with brass terminal posts at the corners. Along the bottom edge include a realistic 12 V battery, a small DC supply, three loose plug-in resistor modules with red, green, and blue bands, and compact analog ammeter/voltmeter modules as available components. Warm wood, cream faces, dark hardware, physically plausible school laboratory style. Do not draw completed circuit wires or topology because live SVG overlays will supply those. No people, no room/background, no graph, no explanatory paragraphs, no white rectangle; fully transparent alpha outside the apparatus group. Leave both central workspaces uncluttered and large."
