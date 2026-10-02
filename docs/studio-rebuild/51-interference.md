# Interference

- Mockup: `09_waves_sound/03_interference.png`
- Route: `/motion/interference`
- Status: VERIFIED

Implemented a coherent-source water-wave interference visualization with generated ripple tank asset, source separation, frequency, phase, and detector-position controls; live path lengths, path difference, wavelength, intensity, equation, reset, and challenge dialog. Intensity uses `I/I₀ = cos²((2πΔr/λ + Δφ)/2)`.

Validation: production build succeeds; direct route load passes; default path difference 7.1 cm, wavelength 8.3 cm, intensity 0.10; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
