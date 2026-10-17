# Electromagnets asset provenance

The native scene uses original Three.js rounded iron core meshes, actual instanced layered copper turns, a clamped armature and four dimensioned 100 g weights. Original seeded canvas textures provide core microtexture, scratched table finish, supply digits and weight labels. No reference image is used as an application asset. Live SVG mode and reading icons are reconstructed from paths; the no-WebGL fallback is a calculated two-gap SVG with explicitly schematic winding.

The closed flux guides indicate circuit orientation and instantaneous field colour; they are explicitly schematic, not a finite-element field map. The colourbar is in tesla. Two vertical pole gaps each equal half the total controlled gap; the clamp makes the fixed-gap assumption visible. Original mounting geometry and the corrected pole arrangement differ from the reference photograph. Material realism and scene composition remain open.

Source: `src/components/ElectromagnetBench.tsx`, `src/pages/ElectromagnetsStudioPage.tsx`, `src/pages/electromagnet-studio.css`.
