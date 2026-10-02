# Physics Syllabus Gap Audit

Audit date: 10 September 2026  
Scope: Physics theory and practical work from Grade 6 through PhD, comparing the current Physics Simulator source tree with Andhra Pradesh SCERT/BSE AP, CBSE/NCERT, representative state-board curricula, and representative Indian university/research curricula.

## Executive result

The app has a strong breadth-first foundation, but its current syllabus coverage indicator substantially overstates completeness. The source contains 92 registered lesson/lab records and 74 curriculum-topic records. Every internal curriculum topic has at least one linked experiment, yet the mapping logic treats that alone as “covered”; it does not verify required subtopics, prescribed experiments, measurement workflow, uncertainty, precautions, evidence, or assessment.

After normalizing overlap between boards, this audit identifies:

- 118 missing or incomplete theory topics: 96 partial and 22 missing.
- 48 practical or virtual-lab gaps.
- 46 critical, 64 high, 3 medium, and 5 advanced-priority theory candidates.
- 9 registered lessons with generic starter theory/procedure text.
- 89 of 92 registered lessons with zero or one viva question.
- 17 registered lessons that are not linked to an app curriculum topic.

These are normalized development candidates, not 118 mutually exclusive statutory mandates. Similar requirements from multiple boards have been consolidated. The complete row-level list, nearest current lesson, status, evidence source, priority, and roadmap are in the accompanying workbook.

## What is already strong

The app already covers the major school-level headings: motion and forces, gravitation, work and energy, heat, sound, electricity, magnetism, ray and wave optics, atoms, nuclei, semiconductors, and introductory astronomy. It also contains useful higher-level simulations in quantum physics, relativity, plasma/astrophysics, electronics, and computation.

Twelve lessons have been added since the earlier internal catalogue, including Blackbody Spectrum, Rutherford Scattering, Build a Nucleus, Fourier: Making Waves, Resistance in a Wire, States of Matter, Diffusion, Greenhouse Effect, Molecules and Light, Color Vision, Atomic Interactions, and Balancing Act. Several dedicated studios also exist outside the registered experiment list. That registry mismatch is itself a discoverability and curriculum-governance problem: content can exist without appearing in syllabus coverage.

## What is missed in theory

### Grades 6–8

The major incomplete areas are speed–velocity–acceleration distinctions; velocity–time graphs; atmospheric pressure; Pascal’s law and hydraulic machines; Archimedes’ principle and relative density; mirror and lens ray diagrams; the ear, hearing range and ultrasound/SONAR; electroscope charging methods; fuse/MCB/earthing and fault safety; motor and generator construction; earthquake waves and epicentre location; and efficiency/mechanical advantage.

For Andhra Pradesh specifically, the app has an AP framework lane, but it is only four broad bands. It does not enumerate AP textbook chapters or activities. The current AP textbook portal provides Classes 6–10 books, including dedicated Physical Science in the later grades.[1] AP Class 8 Semester 2 explicitly includes Light, Chemical Effects of Electric Current, Some Natural Phenomena, Combustion and Flame, and Stars and the Solar System.[2] The present app has related content, but electroscope work, earthquake/seismic analysis, electrical safety, and activity-level evidence remain incomplete.

### Grades 9–10

Missing depth includes derivation and use of uniformly accelerated-motion equations; momentum, impulse and impulse–time graphs; work–energy theorem; domestic wiring, energy billing, overload, short circuit and earthing; physical motor/generator construction and directional rules; electromagnetic-induction applications; prism deviation, refractive index and atmospheric optics; and comparative energy-source calculations.

The app broadly matches AP Class 9 themes—matter, atoms, motion, force, gravitation, work-energy and sound—but does not preserve AP chapter/activity identity.[1] It also lacks a board-year/version field, making it difficult to show that a simulation satisfies a current AP or CBSE requirement rather than a generic nearby concept. BSE AP’s current SSC model-paper page should be retained as assessment evidence.[3]

### Classes XI–XII

The largest theory gaps are dimensional analysis and error propagation; relative motion and projectile derivations; centre of mass; torque, angular momentum, rolling and rotational energy; elasticity; viscosity and terminal velocity; surface tension and capillarity; thermal expansion and heat transfer; entropy, reversible cycles and Carnot efficiency; standing waves and Doppler effect; Gauss-law applications and electrostatic dipoles; potentiometers; moving-coil galvanometers and conversions; cyclotron and charged-particle dynamics; magnetic materials and hysteresis; AC phasors, resonance and power factor; Huygens principle; transistor biasing/amplifiers; and communication-system fundamentals.

CBSE Physics 042 for 2026–27 prescribes both theory and a 30-mark practical programme. Class XI requires a record of at least eight experiments and six activities plus a project; Class XII has its own prescribed experiment/activity sets.[4] The app’s related animations should therefore not be counted as equivalent unless they include the expected apparatus, readings, analysis and assessment.

### Undergraduate

The 30 normalized UG gaps cluster into:

- Mathematical physics: vector calculus, ordinary differential equations, Fourier methods, Laplace transforms, complex analysis and tensors.
- Classical physics: Lagrangian/Hamiltonian mechanics, central-force motion, coupled oscillations and normal modes.
- Electromagnetism: boundary-value electrostatics, Maxwell equations, electromagnetic waves, waveguides and antennas.
- Electronics: circuit/network theorems, AC bridges, op-amps and feedback, active filters, digital sequential systems, ADC/DAC and instrumentation.
- Quantum and atomic physics: spin and angular momentum, approximation methods, identical particles and deeper spectroscopy.
- Condensed matter: crystallography/X-ray diffraction, bands, transport, magnetism and superconductivity.
- Nuclear/statistical/optical physics: detectors, ensembles, quantum statistics, phase transitions, interferometry, coherence, lasers and fibre optics.
- Computation and experimental practice: numerical ODE/PDE methods, Monte Carlo, data acquisition, calibration, noise and uncertainty.

There is no single binding Indian UG physics syllabus. The audit therefore uses the UGC model-curriculum portal and representative current programmes from the University of Delhi and IISc.[10][11][13]

### Postgraduate

The 20 normalized PG gaps include advanced classical mechanics; covariant electrodynamics; advanced quantum mechanics and scattering; relativistic quantum theory; quantum field theory; many-body physics; group theory; advanced statistical mechanics; condensed-matter methods; superconductivity; nuclear and particle physics; plasma physics; advanced optics/photonics; nonlinear dynamics; computational physics; detector electronics; materials-characterization methods; vacuum/cryogenic/high-field practice; and deeper mathematical methods.

The app currently represents PG work with only a few broad curriculum topics. A useful simulation in a domain is not equivalent to a coherent MSc sequence. The University of Delhi’s current MSc framework and IISc’s research pathways demonstrate the expected mathematical, theoretical and experimental depth.[12][14]

### PhD and research training

A PhD does not have one universal subject syllabus: coursework depends on institution, department and specialization. The common omissions are instead research infrastructure and method: research design; advanced uncertainty and metrology; Bayesian inference and inverse problems; reproducible computing and version control; FAIR data and metadata; ethics, plagiarism and authorship; literature review; scientific writing and peer review; experiment design; instrument control and DAQ; vacuum/cryogenic/high-field safety; radiation/laser/electrical safety; detector calibration; high-performance computing; advanced numerical methods; and specialization pathways in quantum, condensed matter, particle/nuclear, plasma, astrophysics and photonics.

UGC PhD regulations provide the programme baseline, while institutional requirements and CSIR-HRDG Physical Sciences provide representative breadth—not a single national PhD physics syllabus.[15][16][17]

## What is missed in labs

The most urgent school and senior-secondary practical gaps are:

1. Motion trials with stopwatch/video data, graph fitting, residuals and uncertainty.
2. Household wiring, fuse/MCB/earthing, overload and short-circuit safety.
3. A buildable DC motor and hand-crank generator with direction rules.
4. Young’s modulus by wire extension.
5. Surface tension by capillary rise and/or drop method.
6. Resonance-tube speed-of-sound experiment.
7. Potentiometer comparison of EMFs and internal resistance.
8. Moving-coil galvanometer resistance and conversion to ammeter/voltmeter.
9. Meter-bridge/resistivity workflows with uncertainty and precautions.
10. Optics labs for focal length, prism deviation, glass-slab refraction and diode/LDR characteristics.

NCERT maintains dedicated science and physics laboratory-manual resources,[7] and the current CBSE Physics 042 document explicitly lists experiments and activities.[4] For equivalence, each app lab should include: stated aim, apparatus, least count/zero correction, controllable procedure, observation table, graph or fit, calculation, uncertainty, precautions, result, viva and saved evidence.

At UG/PG/PhD level, the largest missing practical systems are a calibrated CRO/signal-generator lab; op-amp feedback and filters; sequential logic/ADC/DAC; X-ray diffraction; Hall effect and band-gap measurements; interferometry and coherence; laser cavity/fibre link; radiation-detector calibration and statistics; DAQ/sensors/lock-in/noise; Raman/SEM/TEM/magnetometry workflows; plasma PIC/MHD work; vacuum/cryogenic/high-field commissioning; Bayesian parameter estimation; and auditable reproducible research workflows.

## Board and framework gaps

| Framework | Current diagnosis | Required change |
|---|---|---|
| AP SCERT, Classes 6–10 | Broad related content; chapter/activity mapping is absent | Add official chapter, semester, activity, source URL and board-year rows |
| AP Intermediate, XI–XII | No explicit BIEAP lane | Build a distinct AP Intermediate theory/practical mapping |
| NCERT/CBSE, 6–10 | Headline units are present; outcome/activity equivalence is incomplete | Map learning outcomes and prescribed activities, not keywords only |
| CBSE Physics 042, XI–XII | Strong topic breadth; practical equivalence is incomplete | Implement prescribed lab workflows and evidence records |
| Telangana SCERT | No dedicated lane | Import textbook chapter/activity structure from the official portal[5] |
| Kerala SCERT | No dedicated lane | Map revised curriculum and dedicated Physics IX–X texts[6] |
| Tamil Nadu | No dedicated lane | Add textbook-year, chapter and practical mappings[8] |
| Maharashtra Balbharati | No dedicated lane | Preserve Balbharati XI–XII sequencing and activities[9] |
| Karnataka | No dedicated lane in the app | Add state-textbook and PUC mappings after an official-source extraction |
| UG/PG/PhD | Only coarse generic levels | Use institution/version-specific pathways; do not label one pathway “the PhD syllabus” |

## Recommended implementation order

- Phase 1 — syllabus truthfulness and school essentials: replace the any-link-equals-covered rule; add item-level evidence; complete motion graphs, momentum/impulse, domestic electrical safety, motor/generator, and the five priority XI–XII labs.
- Phase 2 — full XI–XII and UG core: finish prescribed electrical/optical labs, uncertainty workflows, mathematical physics, Maxwell theory, electronics, solid state, photonics and instrumentation.
- Phase 3 — PG depth: advanced quantum/EM/statistical/condensed-matter/nuclear/plasma content and characterization labs.
- Phase 4 — PhD/research layer: inference, reproducibility, DAQ, HPC, safety, data stewardship, ethics and specialization pathways.

The coverage model should store, for every syllabus item: authority, programme/board, grade/semester, academic year/version, chapter/unit, learning outcome, theory depth, required practical, evidence URL, mapped lesson, equivalence status, reviewer and review date. “Covered” should require all mandatory outcomes and practical evidence; otherwise use “partial”, “related only”, “not mapped”, or “not applicable”.

## Method and limitations

The current app inventory was extracted from its registered curriculum and experiment source records on the audit date. Official/primary sources were preferred. State-board sampling is representative, not exhaustive across every Indian state and language edition. NCERT is a national curriculum/textbook authority while CBSE is an examining board; they are related but not interchangeable. University syllabi vary, and PhD training is specialization-dependent. A later implementation pass should perform a chapter-by-chapter extraction for every state the product formally promises to support.

## Sources

1. [AP Department of School Education textbook portal](https://cse.ap.gov.in/textBooksDownloadingPagetitleWise)
2. [AP Class 8 Physical Science, Semester 2](https://cse.ap.gov.in/downloadBooks/Physics%20Books/8_Physics_SEM-2_Textbook.pdf/8)
3. [BSE Andhra Pradesh SSC 2026 model papers](https://bse.ap.gov.in/SUBJECT_WISE_MODEL_PAPER_26.htm)
4. [CBSE Physics 042 curriculum, Classes XI–XII, 2026–27](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf)
5. [Telangana SCERT e-textbooks](https://www.scert.telangana.gov.in/Home.aspx/pdf/Pdf/Pdf/DisplayContent.aspx?encry=ammkNW4%2Fgx+NeApstGPX+A%3D%3D)
6. [Kerala SCERT Curriculum 2024](https://scert.kerala.gov.in/curriculum-2024/)
7. [NCERT science and physics laboratory manuals](https://ncert.nic.in/science-laboratory-manual.php)
8. [Tamil Nadu Textbook and Educational Services Corporation](https://www.textbookcorp.in/)
9. [Maharashtra Balbharati e-book library](https://ebooks.ebalbharati.in/)
10. [UGC Model Curriculum portal](https://www.ugc.gov.in/facultycorner/Model_Curriculum)
11. [University of Delhi BSc (Hons) Physics programme structure](https://academicaffairs.du.ac.in/syllabi/department-of-physics-and-astrophysics/)
12. [University of Delhi MSc Physics PGCF](https://physics.du.ac.in/pdfs/syll2025/MSc_PhysicsPGCF1stYear.pdf)
13. [IISc BS (Research) Physics course structure](https://bs-ug.iisc.ac.in/course-structure/physics?from=home)
14. [IISc CHEP academic programmes and PhD requirements](https://chep.iisc.ac.in/academic-programmes/)
15. [UGC PhD Regulations initiative page](https://www.ugc.gov.in/KeyInitiative?ID=5a+g5HaAjyPaGaXtnVc3+Q%3D%3D)
16. [CSIR-HRDG Physical Sciences syllabus portal](https://www.csirhrdg.res.in/Home/Index/1/Default/3485/78)
17. [NCERT National Curriculum Framework for School Education](https://ncert.nic.in/focus-group.php?ln=en)
