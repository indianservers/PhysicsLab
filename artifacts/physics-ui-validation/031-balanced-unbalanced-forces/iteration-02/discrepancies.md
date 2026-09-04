# Lesson 031 — Balanced and Unbalanced Forces visual review

- The prompt manifest's GLB cart, wheels, and force-arrow nodes were deliberately omitted under the user's current 2D-first direction. A generated transparent PNG supplies the tug-of-war teams and wheeled cart; live SVG layers supply the draggable force and friction arrows.
- The PNG is presentation-only. Force composition, friction regime, acceleration, velocity, position, graph, meters, status, and challenge all share the same authoritative simulation state.
- Horizontal dynamics use `ΣFx = Fright − Fleft + Ffriction = ma`. The vertical pair is constrained to `N − mg = 0` on the horizontal track.
- Kinetic friction opposes the current velocity. At rest, static friction exactly opposes attempted motion up to `μsN`; above that threshold the cart breaks away using the displayed kinetic coefficient. Surface presets are simplified teaching values and are labeled as such in validation metadata.
- Force controls cover zero, typical, balanced, reversed, and maximum cases. Both visible arrow handles support pointer dragging and keyboard steps; sliders remain the accessible fallback.
- The constant-velocity challenge begins with nonzero rightward velocity and correctly requires the right pull to balance the left pull plus leftward kinetic friction. It accepted `119.61 N − 100.00 N − 19.61 N = 0` while `v = 1.00 m/s`.
- Browser verification covered ice, wood, and rubber presets; force and mass sliders; zero/balanced/max-right presets; direct arrow controls; Run/Pause/Step; 2× playback; reduced motion; force reversal; and the challenge path.
- Generated source: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-35b28f82-070b-46f6-b6b7-e8c8e7182364.png`; app copy: `public/assets/experiments/balanced-unbalanced-forces/tug-of-war-cart.png` (1774×887, 32-bit alpha).
- Desktop 1440×900, tablet 820×1180, and mobile 390×844 viewport evidence were captured. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
