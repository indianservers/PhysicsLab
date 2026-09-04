# Lesson 034 — Distance–Time Graph Builder visual review

- The supplied GLB was deliberately omitted under the user's 2D-first direction. Separate generated PNG layers provide the classroom track and robot cart; the cart position/direction, graph, cursor, endpoints, markers and table remain live state-driven elements.
- The editor represents each journey as positive-duration constant-slope segments. Each segment begins at the exact previous endpoint, so vertical distance jumps (`Δt=0`) cannot be created.
- In distance-only mode, negative slopes are clamped to zero because accumulated distance cannot decrease. Position/return mode permits signed slopes and flips the vehicle for a returning journey.
- Graph slope is evaluated as `Δd/Δt` in m/s. A horizontal segment gives zero speed while time advances. The graph cursor, summary, vehicle and table all sample the same compiled journey.
- Browser verification covered adding motion and pause segments, endpoint keyboard adjustment, return mode, the playback scrubber, Play/Pause/Step, 2× speed, reduced motion, reset, and the mission.
- The mission accepted a continuous three-part journey containing 1.0 m/s slow motion, 0.0 m/s rest, and 4.0 m/s fast motion.
- Generated sources: `C:\Users\saisa\.codex\generated_images\01a064f9-4270-7ab3-88a1-9c5c3aa9a5a9\exec-5947412d-2927-432b-8c63-7319cd213a70.png` and `exec-31f6d427-14ce-4a26-b41d-325e9bf30229.png`; app copies are under `public/assets/experiments/distance-time-graph/`.
- Desktop 1440×900, tablet 820×1180, and mobile 390×844 were captured. A fresh console had no runtime errors; its only warnings were the two pre-existing React Router future-flag notices.
