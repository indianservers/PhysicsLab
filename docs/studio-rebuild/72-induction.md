# Magnetism Electromagnetic Induction

- Mockup: `12_magnetism/05_induction.png`
- Route: `/magnetism/induction`
- Status: VERIFIED

Implemented a moving bar magnet and coil with magnet-speed, coil-turn, and motion-direction controls; live magnetic flux and induced EMF readings; coil and flux SVG, Faraday/Lenz equation, reset, modes, and challenge dialog. Uses `ε = −N dΦ/dt` with `Φ = BA` and the induced EMF magnitude proportional to speed, turns, and field area.

Validation: production build succeeds; direct route load passes; defaults reproduce Φ = 3.06 mWb and ε = 153 mV; speed changes EMF and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
