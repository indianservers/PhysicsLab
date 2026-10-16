# Physics issues report — verification

All 50 report entries were reviewed. Confirmed defects were repaired; behavior already implemented was retained and checked. Unimplemented 3D lessons explicitly identify their availability and direct students to Simulate. This change does not claim to implement every planned 3D lesson.

## Validation

- Production TypeScript/Vite build passed.
- 581/581 physics checks passed.
- Lesson teaching-content validation passed.
- 16 concept checks and 8 directory checks passed. Three obsolete checks were updated to reflect the existing subject-home and directory navigation.
- Browser audit covered all 92 experiment routes: no runtime errors, KaTeX errors, horizontal overflow, empty controls, or 3D panes missing either a canvas or an availability card.
- Focused browser checks cover playback freeze/resume, Bohr orbit/replay, Fourier Step, search in five subjects, seven logic gates, reset in density/vector/mass labs, learning levels, measurement Step and 3D transport, and four mobile layouts.
- Visual review: computational workflow guide, Fourier simulation, mobile guide and electrostatic simulation.

## Report entries

| # | Area / issue | Resolution |
|---|---|---|
| 1 | Common equations | Shared KaTeX components render stored equations and variable notation in guides, coaching, formula references and live panels. |
| 2 | Virtual lab tools overlap | Tools now occupy document flow below the lesson. |
| 3 | Home search | All categories remain searchable; multiword search matches each term. URL filters update when navigation changes. Searches checked in five subject groups. |
| 4 | Choose Experiment Play/Pause | Styled buttons expose pressed state; optical pulses and circuit current cues now follow playback time. |
| 5 | Settings | Home and launcher expose the complete settings page: theme, language, accessibility, units and precision. |
| 6 | Bernoulli learning level | Level-specific guidance changes. Selected Research level is preserved rather than silently converted to Undergraduate. |
| 7 | Bernoulli guide math | Shared equation and variable rendering. |
| 8 | Computational workflow math | Relative error and numerical/reference subscripts render with KaTeX. |
| 9 | Six information cards | Three desktop columns, two tablet columns, one mobile column; readable wrapping and spacing. |
| 10 | Density reset | Existing reset verified to restore changed control values. |
| 11 | Inclined-plane equation | Guide and reference equations use mathematical rendering. |
| 12 | Inclined-plane transport | Existing Play/Pause retained; Step includes acceleration displacement and clamps to track bounds. Static friction can correctly hold a block at rest. |
| 13 | Mass/weight transport | Existing interactive balance/scale controls retained. Reset verified; dedicated 3D pane and its transport remain available. |
| 14 | Measurement equations | Shared mathematical rendering. |
| 15 | Measurement Step | Starts from the first phase, advances phases and can repeat after completion. |
| 16 | Measurement 3D controls | Existing transport verified: pause, step advances scene time, restart resets scene time. |
| 17 | Newton Simulate/3D duplicates | 3D tab now opens the dedicated 3D animation rather than repeating the 2D lab. |
| 18 | Vector reset | Existing reset verified to restore changed values. |
| 19 | Force graph escapes screen | Dynamic symmetric velocity range, bounded coordinates, labeled range, bounded cart view and graph history updates on Step. |
| 20 | Balanced forces 3D | Explicit unavailable card with guidance to the interactive 2D lab. |
| 21 | Balance Art upcoming pane | Clear unavailable status replaces an unexplained upcoming pane; interactive balancing simulation remains available. |
| 22 | Motion 3D availability | Every route opens a working view or explicit availability card. |
| 23 | Calorimetry equation | Shared guide/reference mathematical rendering. |
| 24 | Sources of energy guide | Shared mathematical rendering. |
| 25 | Energy/matter guides and 3D | Equations render correctly; unfinished 3D views clearly explain availability. |
| 26 | Diffusion/states duplicate content | Two colored species mix in diffusion; solids vibrate in a lattice, liquids and gases use distinct arrangements. Diffusion controls affect spread and calculated evidence. |
| 27 | Generator rapid voltage/rotation | Labeled 0.01× playback keeps angle and voltage synchronized; normalization remains periodic and continuous. |
| 28 | AC LCR equations | Shared mathematical rendering. |
| 29 | Electrostatic text overlap | Guidance occupies its own layout area; playback wraps and buttons have minimum tap size. Mobile checked. |
| 30 | Kirchhoff unrelated 3D | Existing topic-specific circuit board, branch-current and voltage-drop model retained; working canvas verified. |
| 31 | Logic only AND | Existing AND, OR, NOT, NAND, NOR, XOR and XNOR selector retained; all seven options verified. |
| 32 | Electricity 3D failures | Available animations open; unfinished topics show explicit availability. |
| 33 | Coupled oscillator interface/math/duplicates | Common lesson navigation remains; mathematical guide rendering fixed; 3D now uses the 3D oscillator instead of the 2D lab. |
| 34 | Echo equation | Shared mathematical rendering. |
| 35 | EM spectrum equation | Shared mathematical rendering. |
| 36 | Prism formula | Shared mathematical rendering. |
| 37 | Chladni different interface | Existing topic-specific plate/boundary controls intentionally retained within the common lesson navigation. Working simulation and 3D pane verified. |
| 38 | Fourier unfinished | Play, Pause, Step and Reset drive the harmonic waveform; slider controls remain live. |
| 39 | Wave 3D unavailable | Explicit availability cards for unfinished views; available views verified. |
| 40 | Atomic interaction duplicated | Simulate shows a 2D separation diagram; 3D retains the draggable Three.js atoms. |
| 41 | Bohr electron stationary | Independent orbit angle advances during playback and freezes on Pause. |
| 42 | Bohr replay | Play restarts completed transitions; Replay starts a new recorded run; orbit continues after transition completion. |
| 43 | Photoelectric playback/state | CSS particles follow the React simulation clock, so Pause freezes them. Play/Pause expose pressed state. |
| 44 | Universal gravity controls | Existing field animation retained; larger controls and visible running highlight added. |
| 45 | Build a nucleus unfinished | Playback and live proton/neutron controls; zero neutrons are preserved; all nucleons are represented. Planned 3D remains explicitly unavailable. |
| 46 | Molecules/light unfinished | Photon motion and resonant molecular vibration respond to playback and controls; explicit 3D availability. |
| 47 | Rutherford unfinished | Animated alpha trajectory, energy/impact/charge controls and backward deflection for large scattering angles; explicit 3D availability. |
| 48 | Satellite orbit unfinished | Existing dedicated interactive orbit simulator retained and verified to expose controls and visualization; 3D availability explicit. |
| 49 | Relativity unfinished | Existing dedicated interactive relativity simulator retained and verified to expose controls and visualization; 3D availability explicit. |
| 50 | Modern 3D upcoming | Working views remain available; unfinished views identify availability and the alternative Simulate section. |

## Remaining scope

Planned 3D models that were not implemented are still unavailable. This follows the report's requested option to clearly identify unavailable sections. Chladni and other specialized lab interfaces intentionally retain controls appropriate to their topic. Production bundling still emits its pre-existing large-chunk warning.
