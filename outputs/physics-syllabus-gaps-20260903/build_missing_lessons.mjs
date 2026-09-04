import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "file:///C:/Users/saisa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const outputDir = fileURLToPath(new URL("./", import.meta.url));
const catalog = JSON.parse(await fs.readFile(new URL("../lesson-catalog-20260902/lesson_data.json", import.meta.url), "utf8"));
const sortedExisting = catalog.lessonProfiles.slice().sort((a,b)=>(a.category||"").localeCompare(b.category||"")||(a.title||"").localeCompare(b.title||""));
const existingByTitle = new Map(sortedExisting.map((x,i)=>[x.title,{id:i+1,...x}]));

const sources = {
  NCF_FS: ["NCERT NCF Foundational Stage 2022", "https://www.ncert.nic.in/pdf/NCF_for_Foundational_Stage_20_October_2022.pdf"],
  NCF_SE: ["NCERT NCF School Education 2023", "https://ncert.nic.in/focus-group.php?ln=en"],
  CBSE: ["CBSE Curriculum 2026-27", "https://cbseacademic.nic.in/curriculum_2027.html"],
  CBSE_PHY: ["CBSE Physics 042, Classes XI-XII, 2026-27", "https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart2/Physics_SecP2_2026-27.pdf"],
  ICSE: ["CISCE ICSE Physics, Examination Year 2027", "https://cisce.org/wp-content/uploads/2025/03/10.-Physics.pdf"],
  ISC: ["CISCE ISC Physics, Examination Year 2027", "https://www.cisce.org/wp-content/uploads/2025/02/18.-ISC-Physics.pdf"],
  MH: ["Maharashtra SCERT Std. XII Physics Question Bank", "https://maa.ac.in/documents/examcontent1012/12/ExamContent_Std_12_Physics_Science.pdf"],
  KERALA: ["Kerala SCERT Curriculum 2024", "https://scert.kerala.gov.in/curriculum-2024/"],
  UGC: ["UGC Curriculum and Credit Framework for Undergraduate Programmes", "https://www.ugc.gov.in/KeyInitiative?ID=yiPY1rgAlvz9%2F1chFf86gg%3D%3D"],
  DU: ["University of Delhi — Physics and Astrophysics syllabi", "https://academicaffairs.du.ac.in/syllabi/department-of-physics-and-astrophysics/"],
  IISC: ["IISc BS Physics course structure", "https://bs-ug.iisc.ac.in/course-structure/physics?from=home"],
  CSIR: ["CSIR-UGC NET Physical Sciences syllabus", "https://www.csirhrdg.res.in/SiteContent/ManagedContent/ContentFiles/20181113115324688mcs_ph_sylbs.pdf"],
};

const groups = [];
function addGroup(stage, level, applicability, sourceKeys, entries) {
  for (const e of entries) groups.push({stage, level, applicability, sourceKeys, ...e});
}
const E=(title,category,subcategory,concepts,lab,near="",coverage="Missing",priority="High")=>({title,category,subcategory,concepts,lab,near,coverage,priority});

addGroup("Foundational", "KG–Grade 2", "NCF-FS; CBSE/CISCE/State foundational programmes", ["NCF_FS"], [
 E("Push, Pull, Roll and Slide","Mechanics","Everyday motion","push/pull; start/stop; roll/slide; direction","Toy-ramp and object-motion sorting lab","Balanced and Unbalanced Forces","Partial","High"),
 E("Fast, Slow, Near and Far","Measurement","Motion language","relative speed; distance language; observation","Timed toy-car race with floor markers","Uniform Motion","Partial","High"),
 E("Heavy, Light and Balance","Measurement","Comparing quantities","qualitative mass; balance; comparison","Pan-balance play station","Mass and Weight","Partial","High"),
 E("Hot, Warm and Cold by Safe Observation","Thermodynamics","Senses and temperature","temperature language; safe sensing; comparison","Warm/cool water comparison with teacher-safe thermometer","Heat and Temperature","Partial","High"),
 E("Light Sources and Darkness","Optics","Light around us","natural/artificial sources; darkness; visibility","Dark-box light-source exploration","Shadows and Eclipses","Partial","High"),
 E("Make and Change Shadows","Optics","Shadows","source-object-screen; size; direction","Torch, puppet and screen shadow play","Shadows and Eclipses","Partial","High"),
 E("Sounds Around Us","Waves","Sound sources","sound/no sound; loud/soft; source identification","Sound walk and source-matching station","Sound Pitch and Loudness","Partial","High"),
 E("Vibration Makes Sound","Waves","Vibration","visible/tactile vibration; sound production","Rubber-band box and rice-on-drum activity","Longitudinal Sound Wave","Partial","High"),
 E("Float or Sink: Predict and Test","Fluid Mechanics","Buoyancy foundations","prediction; material/shape; floating/sinking","Water-tub object sorting","Density Float-or-Sink Tank","Partial","High"),
 E("Magnet Play: Attract and Repel","Magnetism","Magnetic interactions","magnetic/non-magnetic; poles; attract/repel","Magnet treasure hunt","Electromagnet","Partial","High"),
 E("Day, Night and Moving Shadows","Astronomy","Sky observations","day/night; Sun position; shadow change","Hourly playground shadow record","Shadows and Eclipses","Partial","Medium"),
 E("Weather Watch: Sun, Wind and Rain","Measurement","Environmental observation","weather symbols; wind; rainfall; temperature","Class weather station","Heat and Temperature","Partial","Medium"),
]);

addGroup("Preparatory", "Grades 3–5", "CBSE/CISCE/State primary science; NCF-SE", ["NCF_SE","CBSE","KERALA"], [
 E("Length, Mass, Time and Temperature Tools","Measurement","Measurement skills","scale choice; reading instruments; units; estimation","Measurement stations with ruler, balance, clock and thermometer","Measurement, Error, and Significant Figures","Partial","Critical"),
 E("Volume and Capacity","Measurement","Measurement skills","litre; millilitre; displacement; capacity","Graduated-cylinder and overflow-can lab","Density Float-or-Sink Tank","Partial","High"),
 E("States of Matter and Particle Model","Thermodynamics","Matter","solid/liquid/gas; particle spacing; change of state","Particle-role-play and syringe model","Gas Laws and Kinetic Theory","Partial","High"),
 E("Melting, Freezing, Evaporation and Condensation","Thermodynamics","Changes of state","heating/cooling; reversible change; water cycle links","Ice-melt and covered-cup condensation lab","Heat Transfer","Partial","High"),
 E("Simple Machines: Lever","Mechanics","Machines","load; effort; fulcrum; mechanical advantage","Ruler-and-fulcrum lifting lab","Work and Power","Partial","High"),
 E("Simple Machines: Pulley, Wheel and Axle","Mechanics","Machines","direction of force; effort; wheel and axle","Fixed/movable pulley comparison","Work and Power","Partial","High"),
 E("Simple Machines: Inclined Plane, Wedge and Screw","Mechanics","Machines","force-distance trade-off; everyday examples","Adjustable ramp force test","Inclined Plane","Partial","High"),
 E("Forms of Energy and Energy Chains","Energy","Energy foundations","motion; light; sound; heat; electrical; transformation","Build energy-chain cards and hand-generator demo","Conservation of Energy","Partial","High"),
 E("Transparent, Translucent and Opaque Materials","Optics","Light and materials","transmission; blocking; material classification","Torch transmission tester","Glass Slab Refraction","Partial","High"),
 E("How Sound Travels Through Materials","Waves","Sound propagation","vibration through solids/liquids/gases; medium","Cup telephone and table-tap investigation","Longitudinal Sound Wave","Partial","High"),
 E("Electric Cell, Bulb and Closed Circuit","Electricity","Circuit foundations","cell terminals; open/closed circuit; circuit symbols","Build a cell-switch-bulb circuit","Series and Parallel Resistance","Partial","Critical"),
 E("Conductors and Insulators","Electricity","Materials in circuits","conductivity; fair testing; safety","Material conductivity tester","Ohm's Law V-I Graph","Partial","High"),
 E("Permanent Magnets, Poles and Compass","Magnetism","Magnetism foundations","poles; field direction; compass; Earth as magnet","Map a bar magnet with compasses","Electromagnet","Partial","High"),
 E("Friction in Everyday Life","Mechanics","Forces","surface effects; useful/harmful friction; lubrication","Toy-block pull test on surfaces","Friction","Partial","High"),
 E("Air Resistance and Streamlining","Mechanics","Forces","drag; area; shape; falling objects","Paper-drop and parachute design lab","Free Fall","Partial","Medium"),
 E("Earth, Moon and Sun System","Astronomy","Solar system foundations","rotation; revolution; scale; gravity overview","Lamp-globe-orbit model","Satellite Orbit and Escape Speed","Partial","High"),
 E("Moon Phases","Astronomy","Observational astronomy","Sun-Earth-Moon geometry; phase sequence","Lamp-and-ball lunar phase model","Shadows and Eclipses","Partial","High"),
 E("Seasons and Length of Day","Astronomy","Earth-Sun system","axial tilt; revolution; hemispheres","Tilted-globe seasons model","Shadows and Eclipses","Partial","Medium"),
]);

addGroup("Middle", "Grades 6–8", "CBSE/CISCE/State middle-stage science", ["NCF_SE","CBSE","KERALA"], [
 E("Speed, Velocity and Acceleration","Mechanics","Kinematics","distance/displacement; speed/velocity; acceleration","Motion sensor or video-tracking lab","Distance-Time Graph Builder","Partial","Critical"),
 E("Velocity-Time Graphs","Mechanics","Kinematics graphs","slope; area; uniform acceleration","Interactive velocity-time graph builder","Distance-Time Graph Builder","Partial","High"),
 E("Pressure in Liquids, Gases and Atmosphere","Fluid Mechanics","Pressure","pressure transmission; atmospheric pressure; barometer","Cartesian diver and suction demonstrations","Fluid Pressure with Depth","Partial","High"),
 E("Pascal's Law and Hydraulic Machines","Fluid Mechanics","Fluid statics","pressure transmission; force multiplication","Syringe hydraulic lift","Fluid Pressure with Depth","Partial","High"),
 E("Archimedes' Principle and Relative Density","Fluid Mechanics","Buoyancy","upthrust; displaced fluid; relative density","Overflow-can buoyancy measurement","Buoyancy","Partial","High"),
 E("Spherical Mirrors and Ray Diagrams","Optics","Geometrical optics","principal rays; image position; magnification","Ray-box concave/convex mirror lab","Mirror Formula","Partial","High"),
 E("Lenses and Everyday Optical Devices","Optics","Geometrical optics","convex/concave lenses; focus; cameras; spectacles","Lens image screen investigation","Lens Formula","Partial","High"),
 E("Human Voice, Ear and Hearing Range","Waves","Sound and hearing","vocal cords; ear pathway; audible range; hearing care","Frequency hearing demo and ear model","Sound Pitch and Loudness","Partial","High"),
 E("Ultrasound and SONAR","Waves","Sound applications","ultrasonic waves; echo ranging; imaging","Virtual pulse-echo depth finder","Echo and Speed of Sound","Partial","Medium"),
 E("Electroscope and Charging Methods","Electricity","Electrostatics","friction; conduction; induction; charge detection","Leaf electroscope and induction lab","Static Electricity and Lightning","Partial","High"),
 E("Electrical Safety: Fuse, MCB and Earthing","Electricity","Domestic electricity","overload; short circuit; fuse; MCB; earth wire","Fault-current safety simulator","Heating Effect of Current","Partial","Critical"),
 E("Electric Motor: Force on a Current","Magnetism","Electromagnetism","motor effect; coil; commutator; energy conversion","Build a simple DC motor","Lorentz Force on Moving Charge","Partial","Critical"),
 E("Generator and Electromagnetic Induction Foundations","Electricity","Electromagnetic induction","changing flux; induced current; generator principle","Hand-crank generator investigation","AC Generator","Partial","High"),
 E("Earthquakes, Seismic Waves and Safety","Waves","Earth physics","P/S waves; epicentre; magnitude; preparedness","Virtual seismograph and triangulation lab","Wave Lab","Partial","High"),
 E("Efficiency and Mechanical Advantage","Mechanics","Work and machines","input/output work; efficiency; mechanical advantage","Pulley efficiency investigation","Work and Power","Partial","High"),
]);

addGroup("Secondary", "Grades 9–10", "CBSE Science; ICSE Physics; State-board science", ["CBSE","ICSE","NCF_SE","KERALA"], [
 E("Equations of Uniformly Accelerated Motion","Mechanics","Kinematics","derivation and application of motion equations","Ticker-tape/video data fit","Uniform Motion","Partial","Critical"),
 E("Momentum, Impulse and Conservation","Mechanics","Dynamics","momentum; impulse; conservation; recoil","Low-friction cart collision lab","Elastic Collision","Partial","Critical"),
 E("Gravitational Potential Energy and Free-Fall Graphs","Mechanics","Gravitation","g; potential energy; kinematics of fall","Drop-timer and energy graph lab","Free Fall","Partial","High"),
 E("Work-Energy Theorem","Mechanics","Energy","net work; kinetic energy change; sign of work","Cart-on-track work-energy test","Work and Power","Partial","High"),
 E("Sound Wave Equation and Resonance","Waves","Sound","v=fλ; amplitude/frequency; resonance","Resonance tube or string lab","Wave Lab","Partial","High"),
 E("Domestic Electric Wiring and Power Billing","Electricity","Domestic electricity","parallel wiring; live/neutral/earth; kWh; safety","Virtual home wiring and bill calculator","Electric Power and Energy","Partial","Critical"),
 E("Magnetic Field of Solenoid and Electromagnet Design","Magnetism","Electromagnetism","solenoid field; core; turns/current effects","Optimize an electromagnet","Electromagnet","Partial","High"),
 E("DC Motor Construction and Fleming's Left-Hand Rule","Magnetism","Electromagnetic devices","force direction; commutator; torque","Interactive motor assembly","Lorentz Force on Moving Charge","Partial","High"),
 E("AC Generator and Fleming's Right-Hand Rule","Electricity","Electromagnetic devices","induced current direction; slip rings; waveform","Generator polarity and waveform lab","AC Generator","Partial","High"),
 E("Electromagnetic Induction in Everyday Devices","Electricity","Electromagnetic applications","induction cooktop; microphone; pickup; eddy currents","Eddy-current brake simulator","Faraday Induction","Partial","Medium"),
 E("Prism, Spectrum and Atmospheric Optical Phenomena","Optics","Dispersion","spectrum; scattering; rainbow; sky colour","Prism spectroscope and scattering tank","Prism Dispersion","Partial","High"),
 E("Energy Resource Calculations and Environmental Trade-offs","Energy","Energy systems","capacity; efficiency; intermittency; emissions","Microgrid resource comparison lab","Sources of Energy Comparator","Partial","High"),
]);

addGroup("Senior Secondary", "Grades 11–12", "CBSE Physics; ISC Physics; State-board Physics", ["CBSE_PHY","ISC","MH"], [
 E("Dimensional Analysis and Error Propagation","Measurement","Physical world and measurement","dimensions; homogeneity; uncertainty propagation","Dimensional-consistency and uncertainty calculator","Measurement, Error, and Significant Figures","Partial","Critical"),
 E("Relative Motion in One and Two Dimensions","Mechanics","Kinematics","reference frames; relative velocity; rain-boat problems","Moving-frame vector simulator","Vector Resolution","Partial","High"),
 E("Centre of Mass and Motion of a System","Mechanics","System of particles","centre of mass; momentum; two-body motion","Adjustable-mass centre-of-mass track","Rotational Dynamics","Partial","Critical"),
 E("Torque, Angular Momentum and Rolling Motion","Mechanics","Rotational mechanics","torque; angular momentum; rolling constraint","Rolling objects and rotating-platform lab","Rotational Dynamics","Partial","High"),
 E("Elasticity: Stress, Strain and Elastic Moduli","Mechanics","Mechanical properties of solids","stress-strain curve; Young/bulk/shear modulus","Wire-extension stress-strain lab","Hooke's Law","Partial","Critical"),
 E("Viscosity, Stokes' Law and Terminal Velocity","Fluid Mechanics","Mechanical properties of fluids","viscosity; drag; terminal speed; Reynolds number","Falling-sphere viscometer","Bernoulli Fluid Flow","Partial","Critical"),
 E("Surface Tension and Capillarity","Fluid Mechanics","Mechanical properties of fluids","surface energy; excess pressure; capillary rise","Capillary-tube and soap-film lab","Fluid Pressure with Depth","Partial","Critical"),
 E("Thermal Expansion of Solids, Liquids and Gases","Thermodynamics","Thermal properties of matter","linear/area/volume expansion; anomalous water expansion","Expansion bridge and liquid-column lab","Heat and Temperature","Partial","High"),
 E("Second Law, Entropy and Carnot Engine","Thermodynamics","Thermodynamics","irreversibility; entropy; Carnot cycle; efficiency","PV/TS Carnot-cycle simulator","Thermodynamic Processes","Partial","Critical"),
 E("Standing Waves in Strings and Organ Pipes","Waves","Waves","nodes; antinodes; harmonics; open/closed pipes","Sonometer and resonance-tube lab","Chladni Plate","Partial","Critical"),
 E("Doppler Effect","Waves","Waves","source/observer motion; frequency shift; applications","Moving-source Doppler simulator","Wave Lab","Partial","High"),
 E("Gauss's Law and Symmetric Charge Distributions","Electricity","Electrostatics","electric flux; Gaussian surfaces; field derivations","Flux-through-surface field visualizer","Electrostatic Field and Potential","Partial","Critical"),
 E("Electric Dipole: Field, Potential and Torque","Electricity","Electrostatics","dipole field; potential; torque; potential energy","Dipole field-line and torque lab","Electrostatic Field and Potential","Partial","High"),
 E("Potentiometer: EMF and Internal Resistance","Electricity","Current electricity practicals","null method; EMF comparison; internal resistance","Virtual potentiometer","Cell Internal Resistance","Partial","Critical"),
 E("Moving-Coil Galvanometer and Conversion","Magnetism","Magnetic effects","torque on coil; sensitivity; ammeter/voltmeter conversion","Galvanometer conversion simulator","Magnetic Field Around Current","Partial","Critical"),
 E("Motion of Charged Particles and Cyclotron","Magnetism","Moving charges","helical motion; velocity selector; cyclotron","Charged-particle trajectory lab","Lorentz Force on Moving Charge","Partial","High"),
 E("Magnetism in Matter and Hysteresis","Magnetism","Magnetism and matter","dia/para/ferromagnetism; B-H curve; domains","Hysteresis-loop material comparator","Electromagnet","Partial","Critical"),
 E("Alternating Current Phasors and Power","Electricity","Alternating current","RLC phasors; impedance; power factor; resonance","AC phasor and power-factor lab","AC LCR Resonance","Partial","High"),
 E("Wavefronts and Huygens Principle","Optics","Wave optics","wavefront; reflection/refraction by Huygens principle","Wavefront construction simulator","Young's Double Slit","Partial","High"),
 E("Transistor Characteristics and Amplifier","Electronics","Semiconductor electronics","BJT action; CE characteristics; gain; switch/amplifier","Transistor curve tracer and amplifier lab","Semiconductor Diode and Rectifier","Partial","Critical"),
 E("Communication Systems and Signal Modulation","Electronics","Communication physics","bandwidth; AM/FM; propagation; noise","AM modulation/demodulation lab","Electromagnetic Spectrum","Partial","Medium"),
]);

addGroup("Undergraduate", "BSc/BS Years 1–4", "UGC-aligned university core; representative DU/IISc curricula", ["UGC","DU","IISC"], [
 E("Vector Calculus for Physics","Mathematical Physics","Vector analysis","gradient; divergence; curl; integral theorems","Field calculus visualizer","Vector Resolution","Partial","Critical"),
 E("Ordinary Differential Equations in Physical Systems","Mathematical Physics","Differential equations","first/second-order ODEs; boundary/initial conditions","Numerical oscillator and decay solver","Computational Physics Workflow","Partial","Critical"),
 E("Fourier Series, Fourier Transform and Spectra","Mathematical Physics","Transforms","harmonic decomposition; transform pairs; convolution","Interactive Fourier synthesizer","Wave Lab","Partial","Critical"),
 E("Laplace Transforms and Linear Systems","Mathematical Physics","Transforms","Laplace methods; transfer functions; transients","RC/RLC transient solver","AC LCR Resonance","Partial","High"),
 E("Complex Variables and Contour Integration","Mathematical Physics","Complex analysis","analytic functions; residues; contour methods","Complex-plane mapping explorer","","Missing","High"),
 E("Tensors and Coordinate Transformations","Mathematical Physics","Tensor analysis","index notation; metric; transformations","Tensor component transformation lab","","Missing","High"),
 E("Lagrangian Mechanics","Mechanics","Analytical mechanics","generalized coordinates; constraints; Euler-Lagrange equations","Double-pendulum Lagrangian builder","Chaotic and Coupled Oscillators","Partial","Critical"),
 E("Hamiltonian Mechanics and Phase Space","Mechanics","Analytical mechanics","canonical variables; Hamilton equations; phase portraits","Phase-space orbit explorer","Chaotic and Coupled Oscillators","Partial","High"),
 E("Central-Force Motion and Scattering","Mechanics","Classical mechanics","effective potential; orbits; Rutherford scattering","Central-potential orbit and scattering lab","Universal Gravitation Field Map","Partial","High"),
 E("Normal Modes and Coupled Oscillations","Oscillations","Oscillations","eigenfrequencies; normal coordinates; beats","Coupled-pendulum normal-mode lab","Chaotic and Coupled Oscillators","Partial","High"),
 E("Boundary-Value Electrostatics and Method of Images","Electricity","Electromagnetic theory","Laplace/Poisson equations; conductors; image charges","Boundary-condition field solver","Electrostatic Field and Potential","Partial","High"),
 E("Maxwell Equations and Electromagnetic Waves","Electricity","Electromagnetic theory","Maxwell equations; potentials; Poynting vector; waves","EM field propagation lab","Electromagnetic Spectrum","Partial","Critical"),
 E("Transmission Lines, Waveguides and Antennas","Electricity","Applied electromagnetics","impedance; standing waves; modes; radiation","Smith-chart/waveguide mode simulator","AC LCR Resonance","Partial","High"),
 E("Network Theorems and Transient Circuits","Electronics","Circuit analysis","Thevenin/Norton; superposition; RC/RL transients","Circuit network analyzer","Kirchhoff Circuit Rules","Partial","Critical"),
 E("Operational Amplifiers and Active Filters","Electronics","Analog electronics","ideal op-amp; feedback; filters; oscillators","Virtual op-amp workbench","Logic Gates","Partial","Critical"),
 E("Digital Systems, Counters and Data Conversion","Electronics","Digital electronics","flip-flops; registers; counters; ADC/DAC","Digital logic timing lab","Logic Gates","Partial","High"),
 E("Quantum States, Spin and Angular Momentum","Modern Physics","Quantum mechanics","Hilbert space; spin; commutators; addition of angular momentum","Stern-Gerlach and spin-state lab","Advanced Quantum Operators","Partial","Critical"),
 E("Approximation Methods in Quantum Mechanics","Modern Physics","Quantum mechanics","perturbation; variational; WKB methods","Approximation comparison for model potentials","Advanced Quantum Operators","Partial","High"),
 E("Identical Particles and Quantum Statistics","Modern Physics","Quantum mechanics","symmetrization; fermions/bosons; Pauli principle","Two-particle state builder","Statistical Ensemble Lab","Partial","High"),
 E("Crystal Structure and X-Ray Diffraction","Condensed Matter","Solid state physics","lattices; reciprocal lattice; Bragg law","Powder diffraction pattern indexer","","Missing","Critical"),
 E("Electronic Band Theory and Semiconductors","Condensed Matter","Solid state physics","bands; Fermi level; carriers; Hall effect","Band-structure and Hall-effect lab","Semiconductor Diode and Rectifier","Partial","Critical"),
 E("Magnetic Materials and Superconductivity","Condensed Matter","Solid state physics","magnetic order; Meissner effect; critical fields","Material phase-map simulator","Electromagnet","Partial","High"),
 E("Atomic and Molecular Spectroscopy","Modern Physics","Spectroscopy","fine structure; rotational/vibrational spectra; selection rules","Spectrum assignment lab","Bohr Atom Transitions","Partial","Critical"),
 E("Nuclear Models, Reactions and Detectors","Modern Physics","Nuclear physics","liquid-drop/shell models; Q value; cross section; detectors","Nuclear reaction and detector response lab","Nuclear Decay and Half-Life","Partial","Critical"),
 E("Statistical Mechanics: Ensembles and Partition Functions","Thermodynamics","Statistical mechanics","microcanonical/canonical/grand canonical; partition functions","Ensemble sampling lab","Statistical Ensemble Lab","Partial","Critical"),
 E("Phase Transitions and Critical Phenomena","Thermodynamics","Statistical mechanics","order parameters; Ising model; critical exponents","2D Ising Monte Carlo lab","Statistical Ensemble Lab","Partial","High"),
 E("Physical Optics: Interferometers and Coherence","Optics","Advanced optics","Michelson/Fabry-Perot; temporal/spatial coherence","Virtual interferometer","Young's Double Slit","Partial","High"),
 E("Lasers, Fiber Optics and Photonics","Optics","Photonics","population inversion; resonators; modes; fiber dispersion","Laser cavity and fiber link simulator","Total Internal Reflection","Partial","Critical"),
 E("Numerical Methods and Monte Carlo Physics","Computational Physics","Scientific computing","root finding; integration; ODE/PDE; random sampling","Notebook-style numerical methods lab","Computational Physics Workflow","Partial","Critical"),
 E("Experimental Data Acquisition and Instrumentation","Measurement","Experimental physics","sensors; calibration; lock-in detection; DAQ","Virtual oscilloscope and sensor calibration","Measurement, Error, and Significant Figures","Partial","Critical"),
]);

addGroup("Postgraduate", "MSc/MS", "Common MSc physics core and advanced electives; representative Indian universities", ["DU","IISC","CSIR"], [
 E("Green Functions in Classical and Quantum Physics","Mathematical Physics","Advanced methods","Green functions; propagators; boundary problems","Green-function solution explorer","","Missing","High"),
 E("Group Theory and Symmetry in Physics","Mathematical Physics","Symmetry methods","groups; representations; Lie algebras; selection rules","Symmetry-operation visualizer","","Missing","High"),
 E("Advanced Classical Mechanics and Canonical Transformations","Mechanics","Advanced mechanics","Poisson brackets; action-angle; Hamilton-Jacobi","Canonical transformation phase-space lab","Chaotic and Coupled Oscillators","Partial","High"),
 E("Nonlinear Dynamics, Bifurcations and Chaos","Mechanics","Dynamical systems","maps; bifurcations; Lyapunov exponent; strange attractors","Logistic-map and Lorenz-system lab","Chaotic and Coupled Oscillators","Partial","High"),
 E("Advanced Quantum Scattering Theory","Modern Physics","Quantum mechanics","partial waves; Born approximation; S-matrix","Quantum scattering cross-section lab","Advanced Quantum Operators","Partial","Critical"),
 E("Relativistic Quantum Mechanics","Modern Physics","Quantum mechanics","Klein-Gordon; Dirac equation; spinors; antiparticles","Relativistic dispersion and spinor lab","Special Relativity Bridge","Partial","Critical"),
 E("Quantum Field Theory Foundations","Modern Physics","Field theory","field quantization; diagrams; gauge symmetry","Scalar-field lattice visualization","","Missing","High"),
 E("Many-Body Quantum Physics","Condensed Matter","Many-body physics","second quantization; quasiparticles; correlations","Few-site Hubbard model lab","","Missing","High"),
 E("Advanced Condensed Matter and Band Topology","Condensed Matter","Condensed matter","Bloch theory; Fermi surfaces; Berry phase; topology","Topological band-structure explorer","","Missing","High"),
 E("Superconductivity and Superfluidity","Condensed Matter","Quantum matter","BCS ideas; vortices; Josephson effects; superfluid flow","Josephson junction simulator","","Missing","High"),
 E("Plasma Physics and Magnetohydrodynamics","Plasma Physics","Plasma","Debye shielding; waves; instabilities; MHD","Particle-in-cell plasma lab","Lorentz Force on Moving Charge","Partial","High"),
 E("General Relativity and Curved Spacetime","Relativity","Gravitation","metric; geodesics; Einstein equations; black holes","Geodesic and gravitational-lensing lab","Universal Gravitation Field Map","Partial","High"),
 E("Astrophysics: Stars, Galaxies and Cosmology","Astronomy","Astrophysics","stellar structure; spectra; galaxies; expansion","HR diagram and cosmology parameter lab","Bohr Atom Transitions","Partial","High"),
 E("Particle Physics and the Standard Model","Modern Physics","High-energy physics","quarks/leptons; interactions; symmetries; detectors","Event-display particle-identification lab","Nuclear Decay and Half-Life","Partial","High"),
 E("Advanced Nuclear Structure and Reactions","Modern Physics","Nuclear physics","collective models; reaction mechanisms; accelerators","Nuclear level-scheme and reaction lab","Nuclear Decay and Half-Life","Partial","High"),
 E("Advanced Statistical Mechanics and Nonequilibrium Systems","Thermodynamics","Statistical mechanics","fluctuations; transport; kinetic equations; nonequilibrium","Random walk and transport lab","Statistical Ensemble Lab","Partial","High"),
 E("Advanced Optics, Nonlinear Optics and Quantum Optics","Optics","Advanced optics","nonlinear susceptibility; photon statistics; entanglement","Interferometric quantum optics lab","Polarization Lab","Partial","High"),
 E("Materials Characterization Techniques","Condensed Matter","Experimental methods","XRD; SEM/TEM; Raman; transport; magnetometry","Multi-technique characterization workflow","","Missing","Critical"),
 E("Radiation Detection, Dosimetry and Safety","Modern Physics","Experimental nuclear physics","detectors; counting statistics; shielding; dose","Detector calibration and shielding lab","Nuclear Decay and Half-Life","Partial","Critical"),
 E("Advanced Computational Physics and Molecular Dynamics","Computational Physics","Scientific computing","PDE solvers; molecular dynamics; parallel computation","Molecular dynamics and convergence lab","Computational Physics Workflow","Partial","Critical"),
]);

addGroup("Doctoral / Research", "PhD and research training", "Cross-university research preparation; specialization-dependent", ["UGC","IISC","CSIR"], [
 E("Research Design and Reproducible Physics Workflows","Research Methods","Research practice","questions; controls; provenance; reproducibility; preregistration","Reproduce a published analysis pipeline","Computational Physics Workflow","Partial","Critical"),
 E("Advanced Uncertainty, Bayesian Inference and Model Selection","Research Methods","Data analysis","likelihoods; priors; posterior; evidence; systematics","Bayesian parameter-estimation lab","Measurement, Error, and Significant Figures","Partial","Critical"),
 E("Scientific Programming, Version Control and Testing","Computational Physics","Research software","modular code; git; tests; environments; documentation","Test-driven simulation project","Computational Physics Workflow","Partial","Critical"),
 E("High-Performance and GPU Computing for Physics","Computational Physics","HPC","parallelism; scaling; GPU kernels; job schedulers","Parallel scaling benchmark","Computational Physics Workflow","Partial","High"),
 E("Machine Learning for Physical Sciences","Computational Physics","Data-driven physics","regression; classification; neural networks; physics-informed ML","Surrogate model for a physics simulator","","Missing","High"),
 E("Inverse Problems and Parameter Estimation","Research Methods","Data analysis","regularization; identifiability; optimization; uncertainty","Recover source parameters from synthetic data","","Missing","High"),
 E("Advanced Experimental Design and Noise Reduction","Measurement","Experimental methods","noise spectra; shielding; grounding; lock-in methods","Signal recovery below noise lab","Measurement, Error, and Significant Figures","Partial","Critical"),
 E("Vacuum, Cryogenic and High-Field Techniques","Measurement","Laboratory techniques","vacuum systems; cryogen safety; superconducting magnets","Virtual vacuum/cryostat commissioning lab","","Missing","High"),
 E("Detector Calibration and Response Unfolding","Measurement","Instrumentation","efficiency; resolution; response matrices; unfolding","Calibrate and unfold a simulated spectrum","","Missing","High"),
 E("Optical Alignment and Laser Safety","Optics","Laboratory techniques","beam alignment; Gaussian beams; laser classes; interlocks","Virtual optical table alignment","","Missing","Critical"),
 E("Radiation Protection and Laboratory Safety","Research Methods","Safety","ALARA; dose limits; contamination; emergency procedures","Radiation work-planning scenario","Nuclear Decay and Half-Life","Partial","Critical"),
 E("Scientific Literature Review and Citation Mapping","Research Methods","Scholarship","search strategy; evidence quality; citation networks","Systematic mini-review and citation map","","Missing","High"),
 E("Scientific Writing, Peer Review and Research Ethics","Research Methods","Communication and ethics","papers; figures; peer review; authorship; integrity","Mock manuscript and peer-review exercise","","Missing","Critical"),
 E("Open Data, FAIR Principles and Metadata","Research Methods","Data stewardship","FAIR data; metadata; repositories; licensing","Publish a reusable research dataset package","","Missing","High"),
 E("Seminar, Proposal and Viva Communication","Research Methods","Communication","research pitch; proposal; defense; visual explanation","Proposal defense and seminar rubric lab","","Missing","High"),
 E("Specialized Frontier Module: Quantum Information","Modern Physics","Frontier elective","qubits; gates; entanglement; measurement; algorithms","Quantum circuit simulator","Advanced Quantum Operators","Partial","Advanced"),
 E("Specialized Frontier Module: Topological Quantum Matter","Condensed Matter","Frontier elective","topological invariants; edge states; quantum Hall effects","Chern-band and edge-state explorer","","Missing","Advanced"),
 E("Specialized Frontier Module: Gravitational Waves","Astronomy","Frontier elective","wave generation; interferometric detection; signals","Gravitational-wave matched-filter lab","","Missing","Advanced"),
 E("Specialized Frontier Module: Soft and Biological Matter","Condensed Matter","Frontier elective","polymers; membranes; active matter; biophysical forces","Brownian and active-matter simulation","","Missing","Advanced"),
 E("Specialized Frontier Module: Climate and Earth-System Physics","Earth Physics","Frontier elective","radiative balance; fluids; feedbacks; remote sensing","Zero-dimensional climate model","Heat Transfer","Partial","Advanced"),
]);

const nextId = sortedExisting.length + 1;
const gaps = groups.map((g,i)=>{
  const refs = g.sourceKeys.map(k=>sources[k]);
  const near = g.near ? g.near.split(";").map(x=>x.trim()).filter(Boolean).map(t=>existingByTitle.has(t)?`${existingByTitle.get(t).id}: ${t}`:t).join(" • ") : "None";
  return {lessonId:nextId+i,...g,near,sourceNames:refs.map(x=>x[0]).join(" • "),sourceUrls:refs.map(x=>x[1]).join(" • ")};
});

const wb = Workbook.create();
const summary = wb.worksheets.add("Summary");
const gapsSheet = wb.worksheets.add("Missing Lessons");
const matrix = wb.worksheets.add("Framework Matrix");
const existingSheet = wb.worksheets.add("Existing 80");
const sourceSheet = wb.worksheets.add("Sources & Scope");
const navy="#13213C", blue="#2155A6", pale="#EAF1FB", gold="#F5B942", ink="#1F2937", muted="#64748B", line="#D7DEE8";

function title(sheet,text,subtitle,lastCol){
  sheet.getRange(`A1:${lastCol}1`).merge(); sheet.getRange("A1").values=[[text]];
  sheet.getRange(`A2:${lastCol}2`).merge(); sheet.getRange("A2").values=[[subtitle]];
  sheet.getRange(`A1:${lastCol}1`).format={fill:navy,font:{bold:true,color:"#FFFFFF",size:18},verticalAlignment:"center"};
  sheet.getRange(`A2:${lastCol}2`).format={fill:pale,font:{color:muted,italic:true,size:10},wrapText:true,verticalAlignment:"center"};
  sheet.getRange(`A1:${lastCol}1`).format.rowHeight=32; sheet.getRange(`A2:${lastCol}2`).format.rowHeight=32; sheet.showGridLines=false;
}
function tableSheet(sheet,subtitle,headers,rows,lastCol,name,widths){
  title(sheet,sheet.name,subtitle,lastCol); const all=[headers,...rows]; sheet.getRangeByIndexes(3,0,all.length,headers.length).values=all;
  const t=sheet.tables.add(`A4:${lastCol}${rows.length+4}`,true,name); t.style="TableStyleMedium2"; t.showBandedRows=true; t.showFilterButton=true;
  sheet.getRange(`A4:${lastCol}4`).format={fill:blue,font:{bold:true,color:"#FFFFFF"},wrapText:true,verticalAlignment:"center"}; sheet.getRange(`A4:${lastCol}4`).format.rowHeight=36;
  sheet.getRange(`A5:${lastCol}${rows.length+4}`).format={font:{color:ink,size:9},verticalAlignment:"top",wrapText:true};
  sheet.getRange(`A4:${lastCol}${rows.length+4}`).format.borders={insideHorizontal:{style:"thin",color:line},bottom:{style:"thin",color:line}};
  widths.forEach((w,i)=>sheet.getRangeByIndexes(0,i,rows.length+4,1).format.columnWidth=w); sheet.freezePanes.freezeRows(4); sheet.freezePanes.freezeColumns(3); sheet.getUsedRange().format.font.name="Aptos";
}

const gapHeaders=["Lesson ID","Stage","Level","Board / Framework Applicability","Category","Subcategory","Missing Lesson","Core Concepts","Suggested Lab / Simulation","Coverage","Nearest Existing Lesson ID(s)","Priority","Evidence Source","Source URL","Scope Note"];
const gapRows=gaps.map(g=>[g.lessonId,g.stage,g.level,g.applicability,g.category,g.subcategory,g.title,g.concepts,g.lab,g.coverage,g.near,g.priority,g.sourceNames,g.sourceUrls,"Normalized gap: confirm exact placement against the adopting board/university's latest detailed syllabus."]);
tableSheet(gapsSheet,"India-focused normalized physics gap register, continuing numeric IDs after the existing 80 lessons.",gapHeaders,gapRows,"O","MissingLessonsTable",[10,17,18,36,20,27,36,46,44,12,42,12,38,55,48]);
gapsSheet.getRange(`A5:A${gapRows.length+4}`).format.numberFormat="0";
gapsSheet.getRange(`J5:J${gapRows.length+4}`).conditionalFormats.addCustom('=J5="Missing"',{fill:"#FDE2E2",font:{color:"#991B1B",bold:true}});
gapsSheet.getRange(`J5:J${gapRows.length+4}`).conditionalFormats.addCustom('=J5="Partial"',{fill:"#FEF3C7",font:{color:"#92400E",bold:true}});

const existingHeaders=["Lesson ID","Category","Lesson","Lesson Code","Class Level","Difficulty","Mapped Unit(s)","Mapped Topic(s)"];
const existingRows=sortedExisting.map((x,i)=>[i+1,x.category,x.title,x.lessonId,x.classLevel,x.difficulty,(x.mappedUnits||[]).join(" • ")||"Unmapped",(x.mappedTopics||[]).join(" • ")||"Unmapped"]);
tableSheet(existingSheet,"Baseline catalog used for gap comparison; IDs 1–80 are preserved.",existingHeaders,existingRows,"H","ExistingLessonsTable",[10,20,34,27,22,13,40,45]);
existingSheet.getRange(`A5:A${existingRows.length+4}`).format.numberFormat="0";

const frameworks=[
 ["Foundational","NCF-FS; school-foundational programmes","KG–Grade 2","Developmental continuum; physics is integrated into play and environmental exploration."],
 ["Preparatory","NCF-SE; CBSE/CISCE/State primary science","Grades 3–5","Integrated science/environmental studies rather than a standalone Physics subject."],
 ["Middle","NCF-SE; CBSE/CISCE/State middle science","Grades 6–8","Shared conceptual core; chapter order and depth vary by board/state."],
 ["Secondary","CBSE Science; ICSE Physics; State science","Grades 9–10","Board-specific inclusions are retained through applicability and source fields."],
 ["Senior Secondary","CBSE Physics; ISC Physics; State Physics","Grades 11–12","Topic-level comparison against current board documents and representative state content."],
 ["Undergraduate","UGC-aligned core; DU/IISc representative curricula","BSc/BS Years 1–4","Normalized common core plus frequently offered laboratory/computational areas."],
 ["Postgraduate","Representative MSc/MS curricula; CSIR-NET coverage","MSc/MS","Common advanced core and electives; not every module is compulsory everywhere."],
 ["Doctoral / Research","Research training and specialization modules","PhD","Research-methods gaps plus frontier electives; institution and thesis-area dependent."],
];
title(matrix,"Framework Matrix","Counts are formula-driven from the Missing Lessons sheet; filters there provide the full lesson-level evidence.","G");
matrix.getRange("A4:G4").values=[["Stage","Framework Coverage","Level","Method Note","Total Gaps","Missing","Partial"]];
matrix.getRange("A5:D12").values=frameworks;
for(let r=5;r<=12;r++){
  matrix.getRange(`E${r}`).formulas=[[`=COUNTIF('Missing Lessons'!$B$5:$B$${gapRows.length+4},A${r})`]];
  matrix.getRange(`F${r}`).formulas=[[`=COUNTIFS('Missing Lessons'!$B$5:$B$${gapRows.length+4},A${r},'Missing Lessons'!$J$5:$J$${gapRows.length+4},"Missing")`]];
  matrix.getRange(`G${r}`).formulas=[[`=COUNTIFS('Missing Lessons'!$B$5:$B$${gapRows.length+4},A${r},'Missing Lessons'!$J$5:$J$${gapRows.length+4},"Partial")`]];
}
matrix.getRange("A4:G12").format.borders={preset:"all",style:"thin",color:line}; matrix.getRange("A4:G4").format={fill:blue,font:{bold:true,color:"#FFFFFF"},wrapText:true};
matrix.getRange("A5:G12").format={wrapText:true,verticalAlignment:"top"}; matrix.getRange("E5:G12").format={fill:"#FFF4D6",font:{bold:true,color:navy},numberFormat:"0",horizontalAlignment:"right"};
[18,38,18,55,12,12,12].forEach((w,i)=>matrix.getRangeByIndexes(0,i,12,1).format.columnWidth=w); matrix.freezePanes.freezeRows(4); matrix.showGridLines=false; matrix.getUsedRange().format.font.name="Aptos";

const srcRows=Object.values(sources).map(([name,url])=>[name,url,"Official / primary source",new Date().toISOString().slice(0,10)]);
tableSheet(sourceSheet,"Authoritative references and interpretation limits for this normalized inventory.",["Source","URL","Type","Accessed"],srcRows,"D","SourcesTable",[46,72,24,14]);
sourceSheet.getRange(`A${srcRows.length+7}:D${srcRows.length+7}`).merge();
sourceSheet.getRange(`A${srcRows.length+7}`).values=[["Scope: India-focused. “All universities” is not a single fixed syllabus; universities retain autonomy and revise curricula. The workbook therefore uses UGC guidance plus representative DU/IISc curricula and CSIR-NET coverage to identify broadly reusable UG–PhD gaps. State boards are represented through national-framework overlap and official Maharashtra/Kerala examples, not a claim of line-by-line coverage of every state edition."]];
sourceSheet.getRange(`A${srcRows.length+7}:D${srcRows.length+7}`).format={fill:"#FFF4D6",font:{color:ink,italic:true},wrapText:true,verticalAlignment:"top"}; sourceSheet.getRange(`A${srcRows.length+7}:D${srcRows.length+7}`).format.rowHeight=72;

title(summary,"Physics Syllabus — Missing Lesson Inventory","Gap analysis against the existing 80 Physics Simulator lessons; new numeric Lesson IDs continue from 81.","H");
summary.getRange("A4:H4").merge(); summary.getRange("A4").values=[["Inventory at a glance"]]; summary.getRange("A4:H4").format={fill:gold,font:{bold:true,color:navy,size:12}};
summary.getRange("A6:B6").values=[["Metric","Value"]]; summary.getRange("A7:A12").values=[["Existing lessons"],["Proposed missing/partial lessons"],["Next Lesson ID"],["Last proposed Lesson ID"],["Fully missing"],["Partially covered"]];
summary.getRange("B7:B12").formulas=[[`=COUNTA('Existing 80'!$C$5:$C$${existingRows.length+4})`],[`=COUNTA('Missing Lessons'!$G$5:$G$${gapRows.length+4})`],[`=MIN('Missing Lessons'!$A$5:$A$${gapRows.length+4})`],[`=MAX('Missing Lessons'!$A$5:$A$${gapRows.length+4})`],[`=COUNTIF('Missing Lessons'!$J$5:$J$${gapRows.length+4},"Missing")`],[`=COUNTIF('Missing Lessons'!$J$5:$J$${gapRows.length+4},"Partial")`]];
summary.getRange("D6:H6").values=[["Sheet","Purpose","Best use","Rows","Important note"]];
summary.getRange("D7:H11").values=[
 ["Missing Lessons","Master proposed lesson list","Filter by stage, board, category or priority",gapRows.length,"IDs continue after the existing 80"],
 ["Framework Matrix","Stage-level totals","Estimate roadmap size",frameworks.length,"Counts are formulas"],
 ["Existing 80","Audit baseline","See nearby/current lessons",existingRows.length,"Preserves IDs 1–80"],
 ["Sources & Scope","Evidence and limitations","Validate curriculum provenance",srcRows.length,"Official sources only"],
 ["Summary","Workbook overview","Start here",1,"India-focused normalized coverage"],
];
summary.getRange("A6:B12").format.borders={preset:"all",style:"thin",color:line}; summary.getRange("D6:H11").format.borders={preset:"all",style:"thin",color:line};
summary.getRange("A6:B6").format={fill:blue,font:{bold:true,color:"#FFFFFF"}}; summary.getRange("D6:H6").format={fill:blue,font:{bold:true,color:"#FFFFFF"},wrapText:true};
summary.getRange("B7:B12").format={fill:"#FFF4D6",font:{bold:true,color:navy,size:14},numberFormat:"0",horizontalAlignment:"right"};
summary.getRange("A14:H14").merge(); summary.getRange("A14").values=[["Interpretation: “Missing” means no direct simulator lesson was found. “Partial” means the catalog has a nearby lesson but lacks the proposed syllabus-specific scope, derivation, application, practical, or level progression."]];
summary.getRange("A14:H14").format={fill:pale,font:{color:muted,italic:true},wrapText:true}; summary.getRange("A14:H14").format.rowHeight=42;
[25,16,4,22,30,34,12,46].forEach((w,i)=>summary.getRangeByIndexes(0,i,14,1).format.columnWidth=w); summary.freezePanes.freezeRows(2); summary.showGridLines=false; summary.getUsedRange().format.font.name="Aptos";

const checks=[];
checks.push((await wb.inspect({kind:"table",range:"Summary!A1:H14",include:"values,formulas",tableMaxRows:16,tableMaxCols:8})).ndjson);
checks.push((await wb.inspect({kind:"table",range:"Missing Lessons!A1:O12",include:"values,formulas",tableMaxRows:12,tableMaxCols:15})).ndjson);
checks.push((await wb.inspect({kind:"table",range:"Framework Matrix!A1:G12",include:"values,formulas",tableMaxRows:14,tableMaxCols:7})).ndjson);
checks.push((await wb.inspect({kind:"match",searchTerm:"#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",options:{useRegex:true,maxResults:100},summary:"final formula error scan"})).ndjson);
for(const [sheetName,range,file] of [["Summary","A1:H14","preview-summary.png"],["Missing Lessons","A1:O24","preview-missing.png"],["Framework Matrix","A1:G12","preview-matrix.png"],["Existing 80","A1:H22","preview-existing.png"],["Sources & Scope",`A1:D${srcRows.length+7}`,"preview-sources.png"]]){
  const img=await wb.render({sheetName,range,scale:1,format:"png"}); await fs.writeFile(new URL(`./${file}`,import.meta.url),new Uint8Array(await img.arrayBuffer()));
}
const out=await SpreadsheetFile.exportXlsx(wb); const outputPath=fileURLToPath(new URL("./physics_syllabus_missing_lessons_KG_to_PhD.xlsx",import.meta.url)); await out.save(outputPath);
await fs.writeFile(new URL("./gap_data.json",import.meta.url),JSON.stringify({generated:new Date().toISOString(),existingCount:existingRows.length,gaps},null,2));
console.log(JSON.stringify({output:outputPath,gapCount:gaps.length,firstId:gaps[0].lessonId,lastId:gaps.at(-1).lessonId,checks},null,2));
