# Lesson 018 — Logic Gates visual review

- The supplied GLB was deliberately not loaded under the current 2D-first product direction. The manifest's `logic_gate_body`, `input_0`, `input_1`, and `output` roles are represented by keyboard/clickable SVG terminals, a gate body, a delayed output wire and an LED.
- A generated transparent PNG sprite sheet supplies realistic AND, OR, NOT, NAND, NOR, XOR and XNOR modules in the component panel; live circuit wiring, inversion bubbles, signal edges and truth-table highlights are code-driven.
- The existing application shell remains intact. Inside it, the mockup's toolbar, component rail, gridded circuit stage, timing plot, truth table, Boolean analysis and mission hierarchy are preserved in a responsive three-column layout.
- The learner selects the gate and cycles each input through LOW, HIGH and floating. Floating is explicitly `X`; it is never coerced to zero. NOT/NAND/NOR/XNOR display output inversion bubbles, and XOR/XNOR use the extra curved input line.
- Physical propagation delay is displayed in nanoseconds but deliberately time-stretched for perceivable animation. Output state is scheduled only after the selected delay, and the timing track shifts consistently.
- The generated source is `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-50ce4f08-f229-4dc8-ae01-5f1f68f2c74d.png`; the app copy is `public/assets/experiments/logic-gates/gate-modules.png` (2172×724, 32-bit alpha).
- Browser verification covered gate selection, NAND inversion, floating-input handling, clock drive, play/pause/step, 2× speed, responsive layouts, and the exact four-NAND XOR mission. A fresh console had no errors; the two React Router future-flag warnings are pre-existing framework notices.
