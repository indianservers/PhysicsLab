# Lesson 057 visual comparison — iteration 02

- Matched the reference's warm white optical bench, microscope/telescope tabs, left controls, central ray stage, right live readings, mission card, and lower equation strip.
- Replaced the deferred GLB with a generated true-alpha 2D optical rail, two lenses, specimen and eye; live SVG rays and computed image markers remain interactive above it.
- Preserved the application shell instead of reproducing the mockup's standalone header.
- Corrected the reference's ambiguous magnification sign: both compound microscope and astronomical telescope report negative magnification for the inverted final image.
- Added staged play/pause/replay/step controls, reduced motion, explicit normal/near-point modes, and responsive stacking not visible in the static reference.
- Browser correction loop fixed reset so near-point mode cannot persist into the default setup.
- Verified 1440×900, 820×1180 and 390×844. The document viewport has no horizontal overflow; the project asset loads with natural dimensions and no broken images.
