# Lesson 073 — Electromagnetic Spectrum

## Reference comparison

- Inspected the supplied 1430 × 900 desktop mockup at full resolution, asset preview, manifest, and both transparent effect layers.
- Preserved the mockup's dark-blue identity header, seven-band selector, three-column apparatus workspace, live measurements, governing equations, and lower challenge area.
- Reflowed the desktop three-column layout to stage-first stacked panels on narrow screens; the band selector remains horizontally scrollable and the full interaction remains available.

## Deliberate deviations

- The supplied GLB and orbit controls are deferred under the current project direction to leave 3D work aside. The route's 3D tab is disabled.
- The apparatus uses a generated transparent PNG (`em-apparatus.png`) while electric and magnetic fields, spectrum transitions, measurements, transport controls, and mission feedback remain live 2D SVG/DOM layers.
- Medium control demonstrates the physically important distinction that frequency and photon energy remain invariant while speed and wavelength change with refractive index; this replaces the mockup's obstacle attenuation controls to match the lesson's stated acceptance test.
- The wave spacing is explicitly labeled as a logarithmic visual encoding because radio-to-gamma wavelengths cannot be drawn to one linear spatial scale.

## Verification evidence

- `desktop.png`: 1440 × 900 desktop apparatus and spectrum view.
- `mobile.png`: 390 × 844 mobile apparatus view with both generated instruments and the live wave visible.
- `interaction-state.png`: completed four-technology placement mission.
- Browser console: no errors after final reload and interaction run.
