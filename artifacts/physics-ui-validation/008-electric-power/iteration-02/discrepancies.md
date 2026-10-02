# Lesson 008 visual comparison and verification

## Match to the supplied mockup

- Recreated the warm household-energy visual language with a large apparatus stage, setup sidebar, appliance cards, live voltage/current/power/energy/heat readings, cumulative timeline, identity panel, fuse safety state, and challenge.
- The supplied GLB depicts a compact battery, heater coil/resistor, capacitor, and meter rather than the mockup's photorealistic cutaway house. It remains the real orbitable apparatus and its named coil parts glow from computed power; the house was not flattened into a background image.
- Appliance selection uses four focused rated-load cards instead of the mockup's full 24-hour seven-appliance scheduler. This preserves the requested voltage, resistance, operating-time, and appliance experiment while keeping every visible control physically active.
- The global app shell is preserved, so the lab begins beneath the existing toolbar.

## Interaction and scientific verification

- Desktop 1440×900, tablet 900×1100, and mobile 390×844 have no horizontal overflow.
- At 230 V and 881.67 Ω, the lamp produces 0.261 A and all three identities return 60.000 W.
- Four hours accumulates 864000 J = 0.2400 kWh; the mission completes below the 5 A limit.
- The 2000 W kettle draws 8.696 A at 230 V and correctly reports overload with a 5 A fuse.
- Voltage, resistance, and operating time were exercised at minimum, typical, and maximum values; every appliance and all fuse/playback options were exercised.
- Ramp/start, pause, resume, 15-minute step, full run, 0.25×–2× speed, reduced motion, pointer/touch orbit, wheel zoom, named-part selection, Reset View, and Reset Experiment were verified.
- Browser runtime reported no error-level console entries; only pre-existing React Router future-flag warnings remained.

