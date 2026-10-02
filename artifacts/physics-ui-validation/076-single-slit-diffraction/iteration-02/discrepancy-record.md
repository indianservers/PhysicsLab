# Lesson 076 — Single Slit Diffraction discrepancy record

- Target inspected: `076__lesson__single-slit-diffraction__single-slit-diffraction__Mockup.png`, exact prompt, supplied preview/effects, README, and asset manifest.
- Match: the delivered lesson retains the mockup's warm optical bench, beam controls, screen pattern, prediction/data panel, intensity profile, movable minima selection, and target-position challenge.
- Deliberate asset deviation: the supplied GLB is deferred under the current 2D-first direction and the lesson's 3D tab is disabled. A generated 2172×724 true-alpha PNG provides the laser, single-slit plate, detector screen, and rail; incident fronts, forward Huygens wavelets, envelope, detector fringes, rays, rulers, graph, and labels remain state-driven SVG.
- Scientific model: minima use `a sin(theta_m) = m lambda`; screen position then uses exact geometry `y_m = L tan(theta_m)`. Detector intensity uses `I/I0 = (sin(beta)/beta)^2` with `beta = pi a sin(theta)/lambda`. The small-angle approximation is not used for displayed measurements.
- Verified behaviour: minimum/typical/maximum presets exercised every learner control; m=±1/±2/±3 markers move; narrower-slit widening and wavelength/distance monotonicity are automated; the 1.50 cm mission solves and evaluates successfully; prediction, play/pause, stepping, 2× speed, reset, and reduced motion respond.
- Responsive result: desktop and 390×844 mobile views inspected. The mobile layout is stage-first and the document has no horizontal overflow (`document scrollWidth 380 <= innerWidth 390`).
- Runtime result: a fresh post-build tab has no application console errors. Only the two existing React Router v7 future-flag warnings remain.
- Automated result: 561/561 physics checks, directory 8/8, concepts 16/16, visual contrast 7/7, TypeScript, and production build passed.
