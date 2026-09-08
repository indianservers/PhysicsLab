# Magnetism Field Lines

- Mockup: `12_magnetism/01_field_lines.png`
- Route: `/magnetism/field-lines`
- Status: VERIFIED

Implemented a magnetic dipole field-line exploration with separation and probe-density controls; live field magnitude and cursor field, dipole SVG visualization, direction readout, equation, reset, modes, and challenge dialog. Uses the dipole relation `B = μ₀(2m)/(4πr³)`.

Validation: production build succeeds; direct route load passes; default field is 2.78 mT and separation changes it to 0.60 mT at 10 cm; reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024. The dipole moment is calibrated to the reference’s 2.8 mT default.
