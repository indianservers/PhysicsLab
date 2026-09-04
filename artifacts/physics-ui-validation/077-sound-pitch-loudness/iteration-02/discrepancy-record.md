# Lesson 077 — Sound Pitch and Loudness discrepancy record

- Target inspected: `077__lesson__sound-pitch-and-loudness__sound-pitch-loudness__Mockup.png`, exact prompt, supplied preview/effects, README, and asset manifest.
- Match: the delivered lesson retains the mockup's warm studio bench, source controls, live readouts, oscilloscope, harmonic content, prediction, safety state, and pitch/loudness matching challenge.
- Deliberate asset deviation: the supplied GLB is deferred under the current 2D-first direction and the lesson's 3D tab is disabled. A generated 1916×821 true-alpha PNG provides the studio speaker, microphone, stands, and bench; cone motion, pressure waveform, air-particle displacement, period ruler, oscilloscope, spectrum, and meters are state-driven SVG/HTML.
- Scientific model: `T=1/f`; sinusoidal-equivalent `p_rms=p_peak/sqrt(2)`; `L_p=20 log10(p_rms/20 micropascals)`; relative intensity scales with pressure amplitude squared. Frequency changes pitch and period without altering the modeled pressure level; waveform changes timbre without changing the fundamental.
- Audio safety: optional hearing is off by default. Web Audio gain is independently capped at 0.035 and the interface explicitly states that the pressure/SPL model is not a calibrated output measurement. The high modeled level is visibly flagged above 85 dB.
- Verified behaviour: minimum/reference/maximum controls; all four waveforms; pitch-only and loudness-only comparisons; correct prediction; 523 Hz / 0.25 Pa mission; hearing toggle; play/pause; step; 2× speed; reset; reduced motion.
- Responsive result: desktop and 390×844 mobile views inspected. The mobile layout is stage-first with no horizontal document overflow (`scrollWidth 380 <= innerWidth 390`).
- Runtime result: fresh post-build tab has no application console errors. Only the two existing React Router v7 future-flag warnings remain.
- Automated result: 566/566 physics checks, directory 8/8, concepts 16/16, visual contrast 7/7, TypeScript, and production build passed.
