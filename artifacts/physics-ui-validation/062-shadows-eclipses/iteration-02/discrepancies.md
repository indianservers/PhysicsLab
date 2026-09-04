# Lesson 062 — iteration 02 comparison

- Replaced the generic fallback with a dedicated dark astronomical stage matching the reference's setup rail, solar/lunar tabs, transport and scrubber, ray-cone scene, live readouts, observer inset, equation, prediction, and challenge layout.
- Generated a true-alpha Sun/Earth/Moon texture atlas; all body positions, boundary rays, umbra/antumbra, penumbra, observer pin, classifications, and apparent-disk inset remain live 2D elements.
- Corrected the reference's visually ambiguous body order: solar is explicitly Sun → Moon → Earth; lunar is Sun → Earth → Moon.
- Verified Sun size, Moon distance, alignment, and observer latitude at minimum/nominal/maximum; Moon/observer keyboard targets; solar/lunar modes; partial, annular, total and none solar states; total lunar state; display switches; scrubber; replay/play/pause/step; all speeds; reduced motion; reset; prediction; and totality mission.
- Desktop, tablet, and mobile layouts have no unintended horizontal overflow, missing asset, essential clipped control, or runtime error. Existing React Router future-flag warnings remain unrelated.
- Intentional deviation: the supplied GLB and 3D orbit/zoom controls are deferred under the current project direction. The visual scale is schematic, while calculations use stated astronomical radii and mean distances.
