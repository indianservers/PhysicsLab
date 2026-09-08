# Sound Spectrum

- Mockup: `09_waves_sound/05_sound_spectrum.png`
- Route: `/motion/sound-spectrum`
- Status: VERIFIED

Implemented a sound source/microphone visualization with frequency, gain, and time controls; live frequency, sound level, dominant harmonic, wavelength, period, FFT-style spectrum, acoustic pressure equation, reset, and challenge dialog. Uses `λ = c/f` with c = 343 m/s and `T = 1/f`.

Validation: production build succeeds; direct route load passes; default frequency 440 Hz, level 74.2 dB SPL, wavelength 0.780 m; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
