# Lenses

- Mockup: `10_optics/03_lenses.png`
- Route: `/optics/lenses`
- Status: VERIFIED

Implemented an optical-bench lens visualization with focal length, object distance, and lens-type controls, synchronized image distance, magnification, image height, image nature, ray diagram, lens equation, reset, and challenge dialog. Uses `1/f = 1/d₀ + 1/dᵢ` and `m = −dᵢ/d₀`.

Validation: production build succeeds; direct route load passes; default image distance 20.0 cm, magnification −1.00, real inverted image; controls update; all required responsive viewports have no horizontal overflow; screenshot captured at 1536x1024.
