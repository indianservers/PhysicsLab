# Electronics — Logic Gates native schematic rebuild

Route `/electronics/logic-gates` · reference `13_electronics/05_logic_gates.png`.

Status: rebuilt with recorded model/browser checks; final visual acceptance and full project goal remain open. The former VERIFIED claim is withdrawn because the old generic page lacked the timing diagram, truth table, real gate-specific symbols, playback and functional learning modes. Its LOW inputs were incorrectly labelled 5 V.

## Reference layout and interactions

The original sidebar is preserved byte-for-byte. Only Observe, Predict, Experiment and Explain remain; no extra 3D tab/dock. The new native SVG schematic matches the subject: AND/OR/NOT topology for the complex network and proper AND/OR/XOR/NAND symbols for direct choices. Top and diagram switches, wire colors, gate nodes, output LED, current truth-table row, numerical readings and timing cursor share the event history. SVG is appropriate for this digital schematic and works without WebGL.

The reference's A=1, B=0, Y=1 lamp contradicts its formula and truth table. This implementation shows settled Y=0. Timing displays the calculated complete test sequence; its cursor, live switches and readings follow current physical time. Input edits restart from a settled initial state. The trace is a forecast for the declared test stimulus, not a fabricated measurement. Default mode is paused Observe; the reference's selected Experiment/running Pause state can be reached through controls.

Five networks remain selectable. Zoom buttons and slider alter the actual schematic. Modes provide working prediction, inspection/record/export/clear and model explanation. Reset restores initial bits/network/time/zoom and preserves records; challenge checks the current initial configuration. Nonexistent NOT/AND nodes export blank for single-gate networks.

## Digital model

Internally all time is seconds. Boolean HIGH/LOW are ideal 5 V/0 V. Each gate has illustrative inertial LOW→HIGH delay 6.05 ns and HIGH→LOW delay 6.35 ns. The complex network's nominal two-gate average is 12.4 ns; direct choices use one gate. A new target invalidates obsolete pending output events, so short pulses can be rejected. Simultaneous events update together. This declared model does not represent analog thresholds, slew, loading/fanout, metastability, supply current, transistor device physics or power. Delays are educational assumptions rather than measurements or a calibrated logic-family fit.

A toggles relative to its initial bit at 20, 40, 65 and 80 ns; B at 25, 50, 85 and 100 ns. The run ends at 120 ns, allowing the last two-stage transition to settle. Playback advances 10 ns per wall second, independently of render rate. Current delayed Y may differ from the settled truth-table result during propagation; the status explicitly distinguishes this. Truth-table highlighting follows the inputs, not a falsely instantaneous output.

Sources: [MIT Computation Structures: combinational specification and delay](https://www.ocw.mit.edu/courses/6-004-computation-structures-spring-2017/pages/c2/c2s1/) and [MIT 6.012: average rise/fall propagation delay](https://ocw.mit.edu/courses/6-012-microelectronic-devices-and-circuits-spring-2009/de333d22ec4230412f4e7bdd4da3d6ce_MIT6_012S09_lec13.pdf). The fixed delay values, stimulus and inertial rejection policy are explicit implementation assumptions.

## Evidence and limits

Model checks cover all 20 network/input truth cases with an independent Boolean expression, one- and two-gate rise timings, short-pulse rejection/cancellation, simultaneous XOR inputs, pending-vs-settled distinction and ideal voltage levels. An independently written fixed-step simulator at 0.1/0.05/0.025 ns matches 7200 integer-ns state samples and converges to the event solver's transition times.

Browser checks cover all 20 configurations, distinct symbols, both switch locations and keyboard operation, mode keyboard navigation, zoom buttons/range, formula changes, prediction/challenge, records preserve/clear and 11-column SI CSV. Eight viewport interior bounds pass after compacting tablet switches and short-desktop table cells. Controlled 10/30/60 fps tests confirm shared timing/network state, pause, hidden no catch-up, automatic stop/replay and owned clock cleanup on SPA route exit. Real CDP touch passes switches, zoom drag and play/pause. Rendering remains fully functional with WebGL deliberately unavailable.

All evidence resides in `artifacts/physics-studio-audit/logic-gates/`. Sidebar-excluded image MAE initially improves 18.634 → 11.476, Gaussian SSIM 0.6483 → 0.7124. Metrics are diagnostics, not completion percentages. Fine typography, gate artwork, selected/running reference state and remaining reference-specific spacing need further refinement. Analog device/family calibration and broader browser/device performance remain open, as do the app's large bundle/PWA precache and full 102-reference task. Final build/source/production checks are recorded in the verification status when completed.
