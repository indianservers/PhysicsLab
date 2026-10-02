# Iteration 02 comparison

- Passed: three-column desktop composition, large unobstructed bench, left controls, right live readings/equation/graph, prediction and fibre challenge.
- Passed: generated bench PNG has genuine alpha (`RGBA`, alpha range `0..255`) and no white rectangle.
- Passed: exact critical-angle state, subcritical transmission, TIR, leakage, and successful fibre mission are all rendered from simulation state.
- Passed: no horizontal overflow at 1440×900, 820×1180, or 390×844; no broken images or browser console errors.
- Deliberate deviation: no GLB/orbit camera. This follows the user's 2D-first direction; the medium shape remains switchable and keyboard/touch-accessible through controls.
- Deliberate deviation: supplied fan-ray effect PNGs were retained in the project asset folder but not rendered because their fixed multi-ray geometry would contradict the live single-ray angle and energy state.
