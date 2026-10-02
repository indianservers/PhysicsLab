# Lesson 075 — Polarization Lab discrepancy record

- Target inspected: `075__lesson__polarization-lab__polarization-lab__Mockup.png`, the exact lesson prompt, supplied asset folder, and manifest.
- Match: the delivered lesson keeps the mockup's light-source controls, central optical bench, measurement panel, Malus-law graph, prediction task, and 25% challenge in a compact white/orange laboratory layout.
- Deliberate asset deviation: the supplied GLB objects are deferred under the current 2D-first direction. The 3D tab is disabled for this lesson. A generated true-alpha PNG optical bench provides the apparatus, while live SVG overlays animate the incident field, selected transverse field, analyser attenuation, axes, beam, and detector response.
- Scientific clarification: the first polarizer output is reported separately from the source intensity. Ideal unpolarized and circular input transmit one half through the first polarizer; linearly polarized input follows `cos²` relative to its fixed input axis. The analyser then follows `I = Iₚ cos²θ`, using the smallest axial separation modulo 180°.
- Verified states: parallel axes = 100% analyser transmission; 60° separation = 25%; crossed axes = extinction; 25% prediction accepted; 25% mission completed.
- Responsive result: desktop and 390×844 mobile views were inspected. Mobile is stage-first and has no horizontal document overflow (`scrollWidth = innerWidth = 390`).
- Runtime result: no application console errors. Two existing React Router v7 future-flag warnings remain unrelated to this lesson.
- Automated result: 558/558 physics checks, directory 8/8, concepts 16/16, visual contrast 7/7, and the production build passed.
