# Lesson 078 — Spring-Mass SHM discrepancy record

- Target inspected: `078__lesson__spring-mass-shm__shm-spring__Mockup.png`, exact prompt, supplied preview/effects, README, and complete 221-part asset manifest.
- Match: the delivered lesson retains the mockup's horizontal spring cart, apparatus controls, state/phase panel, phased time plots, energy exchange, transport controls, prediction, and resonance challenge.
- Deliberate asset deviation: the supplied GLB is deferred under the current 2D-first direction and the lesson's 3D tab is disabled. Generated true-alpha PNGs provide the empty dynamics track and cart; the deforming spring, equilibrium line, vectors, graphs, phase circle, energy bars, and resonance meter are live SVG/HTML layers.
- Scientific model: free motion solves `m x'' + b x' + kx = 0` exactly in the underdamped, critically damped, and overdamped regimes from `x(0)=A`, `v(0)=0`. Driven mode shows the explicitly labeled steady-state response to a 0.2 N sinusoidal force. Natural frequency is `omega_0=sqrt(k/m)` and `T=2 pi/omega_0`.
- Verified behaviour: minimum/reference/maximum presets; free and driven modes; release, equilibrium, and turning-point phase landmarks; constant undamped total energy; damping; mass-period prediction; play/pause; step; speed; timeline; reset; reduced motion; and the frequency-matching resonance mission.
- Responsive result: desktop and 390×844 mobile views inspected. The mobile layout is stage-first with no horizontal document overflow (`scrollWidth 380 <= innerWidth 390`).
- Runtime result: fresh post-build tab has no application console errors. Only the two existing React Router v7 future-flag warnings remain.
- Automated result: 572/572 physics checks, directory 8/8, concepts 16/16, visual contrast 7/7, TypeScript, and production build passed.
