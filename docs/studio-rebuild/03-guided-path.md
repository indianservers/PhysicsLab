# Concept Overview — Guided Learning Path

Route: `/roadmap`. Reference: `01_concept_overview/03_guided_path.png`, 1536 × 1024.

Status: VERIFIED for implementation, interaction, physics, screenshot comparison, responsive layout and production build. Page 3 of 102 unique mockups. No later page has been started.

## Existing implementation and integration

Inspected RoadmapPage, masteryRoadmap, curriculum data, existing experiment IDs and App routing before implementation. The prior class/topic curriculum browser remains at `/roadmap?view=curriculum`; existing `/roadmap?class=...` and `?topic=...` URLs continue to open that browser. Library links to it. The new page is lazily loaded so its code does not enlarge the main precached bundle. Existing lesson definitions and engines are preserved.

## Visual implementation

The desktop reference composition is recreated with a 207-pixel sidebar, 98-pixel header, 108-pixel configuration row, 328-pixel cosmic milestone scene, 340-pixel workbench and 120-pixel progress panel. The workbench starts at x=222, y=534; progress starts at x=222, y=886. SVG implements the apparatus, diagrams, labels and live scenes. Separately generated Earth, starfield and galaxy assets from the first page are reused, and a new independent Saturn asset is included. The full reference is never loaded by the application.

Iterations corrected inherited section-width rules, apparatus positions and proportions, sphere lighting, transparent prism faces, solenoid curves, ruler placement, rocky platform texture, equation typography, icons, tablet layout, short-desktop overlap and mobile controls. The mobile milestone scene can be swiped horizontally at a readable scale; every topic is also available through the workspace selector and progress buttons.

## Physics and learning corrections

The reference shows a ball still at its release height but gives impact time, velocity and kinetic energy as live values. The implementation separates instantaneous live readings from the impact-speed prediction. At release the speed and kinetic energy are zero; at impact from 5 m, t = 1.009637... s, v = 9.904544... m/s and KE = 49.05 J for 1 kg. The ball stops at the platform, and Replay restarts it. Default playback is explicitly labeled 0.25×.

Seven lesson-specific models:

- Measurement: centimetre/metre conversion, ruler division in millimetres, ± half-division uncertainty and percentage uncertainty. Calibration/systematic error is explicitly outside this simple estimate.
- Free fall: h(t) = h0 − gt²/2, v(t) = gt, KE = mv²/2, with g=9.81 m/s², from rest, no air drag, positive velocity downward. Positive mass and zero release height are handled.
- Waves: y=0.10 sin[2π(x/λ−ft)] m, with v=fλ. Zero frequency freezes the wave. The 0–4 m axis and amplitude are identified.
- Heating water: Q=Pt, ΔT=Q/(mc), c=4,184 J/(kg·K), initial 20 °C, no losses. Allowed controls and 60-second run keep even the fastest heating case below 100 °C. A live thermometer follows calculated temperature; the workspace does not depict boiling at room temperature.
- Solenoid: B=μ0 n I, n=1,000 m⁻¹, μ0 approximately 4π×10⁻⁷ H/m. Zero and reversed current produce zero and reversed signed axial field, respectively.
- Quantum: electron de Broglie wavelength h/(mv), using Planck's constant and electron mass, with speed 0.1–10 million m/s. The range remains nonrelativistic. The matter-wave plot is explicitly a spatial schematic, not an electron trajectory; the map icon is symbolic.
- Astronomy: circular Earth orbit, v=√(GM/r), T=2πr/v, radius = Earth radius + altitude. Altitude changes the drawn orbit radius and angular speed. Motion is labeled 120 simulated seconds per real second. Earth and orbit are explicitly not drawn to the same scale.

Path length and learning goal change the milestone sequence. Starting level changes the guidance and mechanics challenge from conceptual through numerical impact speed to energy. Progress is only earned after a correct answer; no personal completion is invented to match the reference's illuminated nodes. Notes and completed milestones persist locally. Reset restores example parameters, time, camera zoom and Observe mode; the selected lesson and chosen path remain under the user's control.

## Evidence

`node scripts/testGuidedPath.mjs` covers every workspace, independent numerical results, all parameter limits including zero/signed values, path and goal configuration, levels, search, keyboard selection, pause/resume/replay/reset, physical scene updates, zoom bounds, all seven challenges plus the advanced energy question, persistence, progress clearing, all existing full-lab IDs, and the original curriculum browser.

`artifacts/studio-rebuild/03-guided-path/results.json` records the checks, six viewport measurements and zero page errors, warnings or failed responses. Screenshots for 1536×1024, 1440×900, 1280×720, 1024×768, 768×1024 and 390×844 are in the same folder. Default desktop sizes fit without scrolling; smaller sizes stack without clipped controls or horizontal document overflow.

Final production build after the playback optimization passed (exit 0), including PWA generation. The existing large-bundle advisory remains.

Playback profiling: the unchanged milestone map is memoized with stable inputs. The local 90-frame trace after this change had a 13.9 ms median interval and 20.9 ms 95th percentile, down from 20.9 ms and 34.6 ms respectively. This is local browser evidence, not a guarantee for other devices. Exact desktop geometry is recorded in geometry-and-playback.json.
