# Lesson 007 visual comparison and verification

## Match to the supplied mockup

- Recreated the large electrolysis vessel stage, anode/cathode polarity labels, setup sidebar, five live readings, mass–charge graph, reaction panel, Faraday-law panel, observation table, and safety-constrained challenge.
- The supplied GLB is intentionally stylized and shares its compact battery/electrolyte geometry with the asset preview. It remains the actual orbitable experiment core; the mockup's photorealistic power supply, beaker, magnifier, and gas cylinder were not flattened into a background image.
- Electrode material is fixed to the chemically specified copper-plating setup; electrolyte type, voltage, spacing, concentration, and duration remain the learner controls required by the prompt.
- The app shell and navigation rail remain intact, so the lab starts beneath the global toolbar rather than replacing it with the mockup header.

## Interaction and scientific verification

- Desktop 1440×900, tablet 900×1100, and mobile 390×844 have no horizontal overflow.
- CuSO₄ at 6.0 V, 3.0 cm, relative concentration 1.0 gives I = 1.200 A. At 300 s, Q = 360 C, copper mass = 0.119 g, and the mission completes at 40.4 °C (below 42 °C).
- Acidified water produces H₂/O₂ and zero solid deposit; NaCl produces H₂/Cl₂ and zero solid deposit.
- Polarity reversal swaps the labelled physical electrodes while cations still move to the cathode and anions to the anode.
- Charge/electron-equivalent values and the linear m–Q graph read from the same Faraday-law state.
- Voltage, spacing, concentration, duration, and all electrolyte options were exercised at minimum, typical, and maximum values.
- Start, pause, resume, step, scrub/full run, 0.25×–2× speed, reduced motion, pointer/touch orbit, wheel zoom, part selection, Reset View, and Rinse & Reset were exercised.
- Browser runtime reported no error-level console entries; only pre-existing React Router future-flag warnings remained.

