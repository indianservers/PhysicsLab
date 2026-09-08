# Magnetism Electromagnets

- Mockup: `12_magnetism/06_electromagnets.png`
- Route: `/magnetism/electromagnets`
- Status: VERIFIED

Implemented an electromagnet with coil current, turn count, and air-gap controls; live lifting force, core saturation, coil power, and gap-field readings; wound-core SVG, field-gap equation, reset, modes, and challenge dialog. Uses `B ≈ μ₀NI/g`, magnetic pressure lifting force, and resistive coil power `P = I²R`.

Validation: production build succeeds; direct route load passes; defaults reproduce 3.90 N, 68% saturation, 8.1 W, and 0.84 T; increasing air gap lowers force to 0.24 N and reset restores defaults; no page console errors; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
