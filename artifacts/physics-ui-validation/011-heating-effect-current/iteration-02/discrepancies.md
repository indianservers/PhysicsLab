# Lesson 011 visual and interaction review

- The dedicated page follows the supplied control / calorimeter / live-readout / lower graph-and-challenge structure using a generated transparent 2D calorimeter apparatus.
- Per user direction, the supplied GLB is deliberately not loaded. The existing application-wide 3D navigation tab remains untouched, while the lesson simulation itself is entirely 2D.
- The generated apparatus has transparent corner pixels (`alpha = 0`) and is composited over a dark thermal-camera stage; there is no rectangular image background. The live supply display, thermometer, heat layer, electron drift, lattice vibration, wire glow, and collision narration are separate computed layers.
- The mockup's voltage-source framing is adapted to the prompt's authoritative current control. Material, diameter, resistance and time are explicit learner controls.
- Tablet moves the readouts below the apparatus; mobile presents the real stage before stacked controls/readouts. Root width remains within 900 px and 390 px viewports.

## Scientific and interaction verification

- Implemented `H_in = I²Rt`, temperature/material/diameter dependent `R(T)`, `C dT/dt = I²R - k(T-T_a)`, and exact stepwise energy balance `input = stored + loss`.
- Halving wire diameter gives four times the resistance; equal-geometry nichrome resistance exceeds copper resistance.
- Minimum, typical and maximum setup presets exercised current, reference resistance, diameter and duration endpoints; the material selector was tested with copper.
- Eighteen 5 s steps reached `59.1 °C`, passing the `60 °C` target mission while remaining below the safe limit.
- Switching off cooled the wire from `59.1 °C` to `56.6 °C` while preserving a `0.00 J` energy residual.
- Maximum setup clamped exactly at the nichrome melting point (`1400.0 °C`) and produced explicit `Wire melted` feedback without non-finite values.
- Play, pause, resume, step, 2× playback, reduced motion, prediction feedback and reset were exercised.
- Desktop, tablet, mission and mobile screenshots were captured with no browser console errors.

## Generated asset

- `public/assets/experiments/heating-effect-current/joule-calorimeter.png`
- Built-in image generation prompt: transparent front-view Joule-heating calorimeter with DC supply, insulated water vessel, exposed resistance coil, thermometer and infrared camera; no people, labels, logos, arrows, watermark, rectangle or cropped parts. A background-extraction pass preserved the apparatus and alpha-isolated the outer canvas.
