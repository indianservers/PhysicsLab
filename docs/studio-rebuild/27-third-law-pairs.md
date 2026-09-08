# Force & Newton’s Laws — Third Law / Action–Reaction Pairs

Status: VERIFIED, page27/102. Reference: `05_force_newton/03_third_law_pairs.png` (1536×1024).

The reference presents two low-friction carts joined by a compressed spring, equal and opposite force labels, paired force graphs, live position/velocity/momentum/impulse readings, the equation `F12 = −F21`, three controls (cart A mass, cart B mass, spring compression), and reset/pause/zoom/challenge tools.

Existing balanced-force and Newton engines were inspected, but neither supplies a paired spring impulse model. A page-specific elastic interaction model will preserve equal/opposite force, impulse and momentum identities while reusing shared navigation and challenge dialog components. Existing routes remain unchanged.

Implementation is in `src/lib/thirdLawStudio.ts`, `src/components/ThirdLawVisuals.tsx`, `src/pages/ThirdLawStudioPage.tsx`, and `src/third-law-studio.css`. The page has native SVG paired carts, spring, equal/opposite arrows, force graphs, readings, equation, controls, modes and challenge dialog.

Verification: `testThirdLawPhysics.mjs` passes equal/opposite force and impulse, momentum conservation, default ±0.120 N·s impulse and all parameter limits. `testThirdLawBrowser.mjs` passes default readings, slider and numeric boundaries, prediction/experiment modes, reset, six responsive screenshots, no horizontal overflow, page errors or failed requests. Final 1536px screenshot was compared with the reference and the navigation, cart pair, controls, graphs, readings and challenge hierarchy align closely. `npx vite build` completed with 2249 modules and 832 precache entries. No known page defects remain.
