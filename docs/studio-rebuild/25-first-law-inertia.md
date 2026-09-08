# Force & Newton’s Laws — First Law / Inertia

Status: VERIFIED, page25/102. Reference: `05_force_newton/01_first_law_inertia.png` (1536×1024).

The reference is a dark Physics Studio lesson with a 218px navigation rail, Force & Newton’s Laws heading, four mode buttons, a photorealistic cart/stop demonstration, controls for surface drag, cart speed and object mass, live momentum/net-force/inertia readings, a velocity graph, prediction card, equation card, simulation controls and challenge footer.

Existing `balanced-unbalanced-forces` supplies the validated force/friction engine and remains unchanged. This dedicated page uses a page-specific inertia model: speed is constant at zero drag; nonzero drag produces a finite stopping time and distance; momentum is `mv`; mass changes inertia and required drag force. The reference’s “net force 0” callout is preserved as the idealized zero-drag law, while live readings expose the actual configured drag.

Implementation is in `src/pages/InertiaStudioPage.tsx`, `src/lib/inertiaStudio.ts`, `src/inertia-studio.css`, and generated asset `public/assets/first-law/inertia-track.png`. The asset was generated as an apparatus photograph; overlays, labels and graph are native SVG/HTML and the mockup is not used as UI.

Verification: `testInertiaPhysics.mjs` passes exact zero-drag constant velocity, finite-drag stopping, and all limits. `testInertiaStatic.mjs` passes all controls, min/max/negative numeric states, prediction feedback, six viewport widths, no errors and no horizontal overflow. `testInertiaFinal2.mjs` passes running animation live-velocity updates, pause, six viewport screenshots, no errors and no failed requests. Final 1536px screenshot was compared against the reference and the cart/stop composition, hierarchy, controls, graph, readings and dark visual system align closely; the generated apparatus differs in photographic details while native overlays remain separate. Production build emitted the Inertia page chunks successfully. No known page defects remain.
