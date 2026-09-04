# Lesson 048 — Advanced Quantum Operators

- Followed the user's current direction to defer 3D. A generated transparent glass Bloch-sphere PNG supplies the shell; state vector, measurement plane, operator transformations, probabilities, collapse state, and histogram are live 2D layers.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-c70e62a5-b878-4b6e-859c-4b916a755676.png`.
- App asset: `public/assets/experiments/advanced-quantum-operators/bloch-sphere.png` (1254×1254 RGBA; transparent alpha verified).
- The model uses normalized complex amplitudes, exact X/Y/Z/H/S/T matrices, unitary axis rotations, Bloch coordinates, Pauli expectation values, `P(±n)=(1±r·n)/2`, and correct X/Y/Z eigenstate collapse.
- Added amplitude, relative phase, operator-axis, rotation-angle, and measurement-basis controls; play/pause/step/replay, speed, reduced motion, single collapse, and an animated seeded histogram of 100 independently prepared copies.
- Pauli X changed the Z-basis probabilities from 70/30 to 30/70. A 100-copy run produced 74/26 against the expected 70/30 distribution. The mission prepared normalized 75/25 Born probabilities successfully.
- Checked at 1440×900, 820×1180, and 390×844. No console errors were reported; the full interactive sphere remains available on mobile.
