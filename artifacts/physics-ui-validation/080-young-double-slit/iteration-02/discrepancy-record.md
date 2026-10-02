# Lesson 080 — Young's Double Slit discrepancy record

- Target inspected: `080__lesson__young-s-double-slit__young-double-slit__Mockup.png`, exact prompt, supplied preview/effects, README, and complete asset manifest.
- Match: the delivered lesson retains the mockup's laser/slit/screen optical rail, wavelength/slit-separation/screen-distance controls, coherence selector, progressive wavelets, screen fringes, selected-point path readings, phasor, intensity graph, prediction, and spacing challenge.
- Deliberate asset deviation: the supplied GLB is deferred under the current 2D-first direction and the lesson's 3D tab is disabled. A generated true-alpha PNG provides the laser, double-slit plate, detector, mounts, and rail; beam, wavelets, exact path rays, wavelength-colored fringes, probe, phasor, graph, and meters are state-driven SVG/HTML.
- Scientific model: the small-angle fringe spacing is `beta=lambda D/d`; selected-point paths use exact `r1` and `r2` geometry; phase is `delta=2 pi (r1-r2)/lambda`; normalized two-beam intensity is `(1+mu cos(delta))/2`, where `mu` is coherence. Bright points satisfy `Delta=m lambda`; dark points satisfy `Delta=(m+1/2) lambda`.
- Verified behaviour: minimum/reference/maximum controls; wavelength color; slit separation; screen distance; high/partial/zero coherence; draggable screen probe; exact path and phase readings; prediction; play/pause; step; 2× speed; reset; reduced motion; and the double-fringe-spacing mission.
- Responsive result: desktop and 390×844 mobile views inspected. The mobile layout is stage-first with no horizontal document overflow (`scrollWidth 380 <= innerWidth 390`).
- Runtime result: fresh post-build tab has no application console errors. Only the two existing React Router v7 future-flag warnings remain.
- Automated result: 581/581 physics checks, directory 8/8, concepts 16/16, visual contrast 7/7, TypeScript, and production build passed.
