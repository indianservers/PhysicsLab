import { PhysicsIconName } from "./icons";

export type DictionaryCategory =
  | "Measurement"
  | "Mechanics"
  | "Waves"
  | "Optics"
  | "Thermal Physics"
  | "Electricity"
  | "Magnetism"
  | "Modern Physics"
  | "Fluids"
  | "Astronomy";

export interface PhysicsDictionaryTerm {
  id: string;
  term: string;
  category: DictionaryCategory;
  visual: PhysicsIconName;
  definition: string;
  example: string;
  formula?: string;
  tags: string[];
}

export const dictionaryCategories: DictionaryCategory[] = [
  "Measurement",
  "Mechanics",
  "Waves",
  "Optics",
  "Thermal Physics",
  "Electricity",
  "Magnetism",
  "Modern Physics",
  "Fluids",
  "Astronomy",
];

const corePhysicsDictionary: PhysicsDictionaryTerm[] = [
  { id: "acceleration", term: "Acceleration", category: "Mechanics", visual: "rocket", definition: "Rate at which velocity changes with time.", example: "A falling ball speeds up downward due to gravity.", formula: "a = Delta v / Delta t", tags: ["motion", "velocity", "kinematics"] },
  { id: "accuracy", term: "Accuracy", category: "Measurement", visual: "ruler", definition: "Closeness of a measured value to the true or accepted value.", example: "A thermometer reading 100.1 C for boiling water is accurate.", tags: ["measurement", "error", "experiment"] },
  { id: "amplitude", term: "Amplitude", category: "Waves", visual: "wave", definition: "Maximum displacement of a vibrating particle from its mean position.", example: "A louder sound wave usually has a larger amplitude.", tags: ["wave", "oscillation", "sound"] },
  { id: "angular-momentum", term: "Angular Momentum", category: "Mechanics", visual: "orbit", definition: "Rotational momentum of a body about an axis.", example: "A spinning skater rotates faster when arms are pulled inward.", formula: "L = I omega", tags: ["rotation", "momentum", "inertia"] },
  { id: "archimedes-principle", term: "Archimedes' Principle", category: "Fluids", visual: "drop", definition: "A body in a fluid experiences an upward buoyant force equal to the weight of displaced fluid.", example: "A ship floats because it displaces enough water.", formula: "F_b = rho V g", tags: ["buoyancy", "fluid", "density"] },
  { id: "atom", term: "Atom", category: "Modern Physics", visual: "atom", definition: "Smallest unit of an element that retains its chemical identity.", example: "A hydrogen atom contains one proton and one electron.", tags: ["matter", "atomic", "particle"] },
  { id: "atomic-number", term: "Atomic Number", category: "Modern Physics", visual: "atom", definition: "Number of protons in the nucleus of an atom.", example: "Carbon has atomic number 6.", formula: "Z = number of protons", tags: ["nucleus", "element", "proton"] },
  { id: "average-speed", term: "Average Speed", category: "Mechanics", visual: "gauge", definition: "Total distance travelled divided by total time taken.", example: "Travelling 100 km in 2 h gives 50 km/h average speed.", formula: "v_avg = distance / time", tags: ["motion", "speed", "distance"] },
  { id: "bernoulli-principle", term: "Bernoulli's Principle", category: "Fluids", visual: "drop", definition: "For steady ideal fluid flow, higher speed corresponds to lower pressure.", example: "Air moving faster over a wing helps create lift.", tags: ["pressure", "flow", "fluid"] },
  { id: "boyles-law", term: "Boyle's Law", category: "Thermal Physics", visual: "flask", definition: "At constant temperature, pressure of a gas is inversely proportional to volume.", example: "Compressing air in a syringe increases its pressure.", formula: "P V = constant", tags: ["gas", "pressure", "volume"] },
  { id: "buoyancy", term: "Buoyancy", category: "Fluids", visual: "drop", definition: "Upward force exerted by a fluid on an immersed object.", example: "A cork rises in water because buoyancy exceeds its weight.", tags: ["fluid", "force", "floating"] },
  { id: "capacitance", term: "Capacitance", category: "Electricity", visual: "battery", definition: "Ability of a system to store electric charge per unit potential difference.", example: "A camera flash capacitor stores charge before discharge.", formula: "C = Q / V", tags: ["capacitor", "charge", "voltage"] },
  { id: "centripetal-force", term: "Centripetal Force", category: "Mechanics", visual: "orbit", definition: "Net inward force that keeps an object moving in a circular path.", example: "Tension provides centripetal force for a stone on a string.", formula: "F_c = m v^2 / r", tags: ["circular motion", "force", "radius"] },
  { id: "charge", term: "Charge", category: "Electricity", visual: "field", definition: "Property of matter that causes electric forces and fields.", example: "Electrons carry negative charge.", formula: "Q = n e", tags: ["electricity", "electron", "field"] },
  { id: "charles-law", term: "Charles' Law", category: "Thermal Physics", visual: "flask", definition: "At constant pressure, volume of a gas is directly proportional to absolute temperature.", example: "A balloon expands when heated.", formula: "V / T = constant", tags: ["gas", "temperature", "volume"] },
  { id: "coefficient-friction", term: "Coefficient of Friction", category: "Mechanics", visual: "gauge", definition: "Ratio of frictional force to normal reaction between two surfaces.", example: "Rubber on dry road has a larger coefficient than ice.", formula: "mu = F / N", tags: ["friction", "force", "surface"] },
  { id: "concave-lens", term: "Concave Lens", category: "Optics", visual: "prism", definition: "Diverging lens that is thinner at the center than at the edges.", example: "Concave lenses are used in spectacles for myopia.", tags: ["lens", "refraction", "image"] },
  { id: "conduction", term: "Conduction", category: "Thermal Physics", visual: "thermometer", definition: "Transfer of heat through a material without bulk motion of the material.", example: "A metal spoon gets hot in tea by conduction.", tags: ["heat transfer", "thermal", "solid"] },
  { id: "conservation-energy", term: "Conservation of Energy", category: "Mechanics", visual: "flame", definition: "Energy cannot be created or destroyed, only transferred or transformed.", example: "Potential energy becomes kinetic energy in a falling object.", tags: ["energy", "work", "principle"] },
  { id: "conservation-momentum", term: "Conservation of Momentum", category: "Mechanics", visual: "gauge", definition: "Total momentum of an isolated system remains constant.", example: "Two carts colliding on a smooth track conserve momentum.", formula: "m1u1 + m2u2 = m1v1 + m2v2", tags: ["collision", "momentum", "system"] },
  { id: "convex-lens", term: "Convex Lens", category: "Optics", visual: "prism", definition: "Converging lens that is thicker at the center than at the edges.", example: "A magnifying glass uses a convex lens.", tags: ["lens", "image", "focus"] },
  { id: "coulombs-law", term: "Coulomb's Law", category: "Electricity", visual: "field", definition: "Electric force between two point charges is proportional to the product of charges and inversely proportional to square of distance.", example: "Two like charges repel more strongly when closer.", formula: "F = k q1 q2 / r^2", tags: ["charge", "force", "electrostatics"] },
  { id: "critical-angle", term: "Critical Angle", category: "Optics", visual: "prism", definition: "Angle of incidence in denser medium for which angle of refraction is 90 degrees.", example: "Total internal reflection starts beyond the critical angle.", formula: "sin C = 1 / n", tags: ["TIR", "refraction", "optics"] },
  { id: "current", term: "Current", category: "Electricity", visual: "battery", definition: "Rate of flow of electric charge through a conductor.", example: "A bulb glows when current flows through its filament.", formula: "I = Q / t", tags: ["charge", "circuit", "ampere"] },
  { id: "density", term: "Density", category: "Measurement", visual: "ruler", definition: "Mass per unit volume of a substance.", example: "Iron is denser than wood.", formula: "rho = m / V", tags: ["mass", "volume", "material"] },
  { id: "diffraction", term: "Diffraction", category: "Waves", visual: "wave", definition: "Bending and spreading of waves around obstacles or through narrow openings.", example: "Sound bends around a doorway.", tags: ["wave", "slit", "spreading"] },
  { id: "dimension", term: "Dimension", category: "Measurement", visual: "ruler", definition: "Expression of a physical quantity in terms of base quantities.", example: "Velocity has dimensions L T^-1.", tags: ["units", "analysis", "quantity"] },
  { id: "displacement", term: "Displacement", category: "Mechanics", visual: "rocket", definition: "Shortest directed change in position from initial to final point.", example: "Walking in a circle back to start gives zero displacement.", tags: ["motion", "vector", "position"] },
  { id: "doppler-effect", term: "Doppler Effect", category: "Waves", visual: "volume", definition: "Apparent change in frequency due to relative motion between source and observer.", example: "A siren sounds higher pitched as it approaches.", tags: ["sound", "frequency", "motion"] },
  { id: "efficiency", term: "Efficiency", category: "Mechanics", visual: "gauge", definition: "Ratio of useful output energy or power to input energy or power.", example: "A motor with less heat loss has higher efficiency.", formula: "eta = output / input x 100%", tags: ["energy", "power", "machine"] },
  { id: "elastic-collision", term: "Elastic Collision", category: "Mechanics", visual: "gauge", definition: "Collision in which total kinetic energy and momentum are conserved.", example: "Ideal gas molecule collisions are treated as elastic.", tags: ["collision", "momentum", "kinetic energy"] },
  { id: "electric-field", term: "Electric Field", category: "Electricity", visual: "field", definition: "Force experienced per unit positive test charge at a point.", example: "A charge creates an electric field around it.", formula: "E = F / q", tags: ["charge", "force", "field"] },
  { id: "electric-potential", term: "Electric Potential", category: "Electricity", visual: "battery", definition: "Work done per unit charge in bringing a positive test charge to a point.", example: "A battery maintains potential difference across terminals.", formula: "V = W / q", tags: ["voltage", "charge", "energy"] },
  { id: "electromagnetic-induction", term: "Electromagnetic Induction", category: "Magnetism", visual: "magnet", definition: "Production of emf due to changing magnetic flux.", example: "A generator works by electromagnetic induction.", formula: "emf = -dPhi/dt", tags: ["Faraday", "flux", "emf"] },
  { id: "electron", term: "Electron", category: "Modern Physics", visual: "atom", definition: "Negatively charged subatomic particle found around atomic nuclei.", example: "Electric current in metals is due to drifting electrons.", tags: ["particle", "charge", "atom"] },
  { id: "emf", term: "EMF", category: "Electricity", visual: "battery", definition: "Energy supplied per unit charge by a source.", example: "A cell has an emf of about 1.5 V.", formula: "E = W / q", tags: ["voltage", "battery", "energy"] },
  { id: "entropy", term: "Entropy", category: "Thermal Physics", visual: "thermometer", definition: "Measure of energy dispersal or disorder in a thermodynamic system.", example: "Entropy increases when heat spreads from hot to cold.", tags: ["thermodynamics", "heat", "disorder"] },
  { id: "escape-velocity", term: "Escape Velocity", category: "Astronomy", visual: "rocket", definition: "Minimum speed needed to escape a body's gravitational field without further propulsion.", example: "Rockets need escape velocity to leave Earth permanently.", formula: "v_e = sqrt(2GM/R)", tags: ["gravity", "planet", "orbit"] },
  { id: "faradays-law", term: "Faraday's Law", category: "Magnetism", visual: "magnet", definition: "Induced emf is proportional to the rate of change of magnetic flux.", example: "Moving a magnet near a coil induces voltage.", formula: "emf = -N dPhi/dt", tags: ["induction", "flux", "coil"] },
  { id: "focal-length", term: "Focal Length", category: "Optics", visual: "prism", definition: "Distance between the optical center or pole and the principal focus.", example: "A shorter focal length lens bends light more strongly.", tags: ["lens", "mirror", "focus"] },
  { id: "force", term: "Force", category: "Mechanics", visual: "gauge", definition: "Push or pull that can change the state of motion of a body.", example: "Kicking a ball applies force to it.", formula: "F = m a", tags: ["Newton", "motion", "interaction"] },
  { id: "frequency", term: "Frequency", category: "Waves", visual: "wave", definition: "Number of oscillations or waves passing a point per second.", example: "Middle A sound has frequency 440 Hz.", formula: "f = 1 / T", tags: ["wave", "period", "hertz"] },
  { id: "friction", term: "Friction", category: "Mechanics", visual: "gauge", definition: "Force that opposes relative motion between surfaces in contact.", example: "Friction helps shoes grip the ground.", formula: "F = mu N", tags: ["force", "surface", "motion"] },
  { id: "gravitational-field", term: "Gravitational Field", category: "Astronomy", visual: "orbit", definition: "Region where a mass experiences gravitational force.", example: "Earth's gravitational field pulls objects downward.", formula: "g = GM / r^2", tags: ["gravity", "mass", "planet"] },
  { id: "gravity", term: "Gravity", category: "Astronomy", visual: "orbit", definition: "Attractive force between masses.", example: "Gravity keeps the Moon in orbit around Earth.", formula: "F = GMm / r^2", tags: ["mass", "force", "universe"] },
  { id: "half-life", term: "Half-Life", category: "Modern Physics", visual: "atom", definition: "Time taken for half the radioactive nuclei in a sample to decay.", example: "Carbon-14 dating uses radioactive half-life.", tags: ["radioactivity", "decay", "nuclear"] },
  { id: "heat", term: "Heat", category: "Thermal Physics", visual: "flame", definition: "Energy transferred due to temperature difference.", example: "Heat flows from hot tea to a cooler cup.", formula: "Q = m c Delta T", tags: ["thermal", "energy", "temperature"] },
  { id: "hookes-law", term: "Hooke's Law", category: "Mechanics", visual: "spring", definition: "Extension of a spring is proportional to applied force within elastic limit.", example: "A spring balance works using Hooke's law.", formula: "F = -k x", tags: ["spring", "elasticity", "force"] },
  { id: "impulse", term: "Impulse", category: "Mechanics", visual: "gauge", definition: "Product of force and time interval, equal to change in momentum.", example: "Airbags increase collision time and reduce average force.", formula: "J = F Delta t = Delta p", tags: ["force", "momentum", "collision"] },
  { id: "inertia", term: "Inertia", category: "Mechanics", visual: "gauge", definition: "Tendency of a body to resist change in its state of motion.", example: "Passengers lurch forward when a bus stops suddenly.", tags: ["Newton", "mass", "motion"] },
  { id: "interference", term: "Interference", category: "Waves", visual: "wave", definition: "Redistribution of wave intensity when two or more coherent waves superpose.", example: "Young's double-slit experiment shows bright and dark fringes.", tags: ["wave", "superposition", "YDSE"] },
  { id: "kinetic-energy", term: "Kinetic Energy", category: "Mechanics", visual: "rocket", definition: "Energy possessed by a body due to its motion.", example: "A moving car has kinetic energy.", formula: "K = 1/2 m v^2", tags: ["energy", "motion", "work"] },
  { id: "latent-heat", term: "Latent Heat", category: "Thermal Physics", visual: "thermometer", definition: "Heat absorbed or released during a phase change without temperature change.", example: "Ice absorbs latent heat while melting.", formula: "Q = m L", tags: ["phase change", "heat", "melting"] },
  { id: "lens-formula", term: "Lens Formula", category: "Optics", visual: "prism", definition: "Relation connecting object distance, image distance, and focal length for a thin lens.", example: "It predicts image position formed by a convex lens.", formula: "1/f = 1/v - 1/u", tags: ["lens", "image", "focal length"] },
  { id: "lenzs-law", term: "Lenz's Law", category: "Magnetism", visual: "magnet", definition: "Direction of induced current opposes the change causing it.", example: "A falling magnet slows inside a conducting tube.", tags: ["induction", "current", "magnetism"] },
  { id: "magnetic-field", term: "Magnetic Field", category: "Magnetism", visual: "magnet", definition: "Region where magnetic forces can be experienced.", example: "Iron filings reveal field lines around a magnet.", tags: ["magnet", "force", "field"] },
  { id: "magnetic-flux", term: "Magnetic Flux", category: "Magnetism", visual: "field", definition: "Measure of magnetic field passing through a surface.", example: "Rotating a coil changes magnetic flux through it.", formula: "Phi = B A cos theta", tags: ["field", "area", "induction"] },
  { id: "mass", term: "Mass", category: "Measurement", visual: "ruler", definition: "Amount of matter in a body and measure of inertia.", example: "A 2 kg object has twice the mass of a 1 kg object.", tags: ["matter", "inertia", "kilogram"] },
  { id: "moment-of-inertia", term: "Moment of Inertia", category: "Mechanics", visual: "orbit", definition: "Rotational analogue of mass; resistance to angular acceleration.", example: "A ring has larger moment of inertia than a solid disk of same mass and radius.", formula: "I = sum m r^2", tags: ["rotation", "mass", "axis"] },
  { id: "momentum", term: "Momentum", category: "Mechanics", visual: "gauge", definition: "Product of mass and velocity of a body.", example: "A fast truck has large momentum.", formula: "p = m v", tags: ["motion", "collision", "vector"] },
  { id: "newtons-first-law", term: "Newton's First Law", category: "Mechanics", visual: "gauge", definition: "A body remains at rest or uniform motion unless acted on by a net external force.", example: "A book stays at rest on a table until pushed.", tags: ["inertia", "force", "motion"] },
  { id: "newtons-second-law", term: "Newton's Second Law", category: "Mechanics", visual: "rocket", definition: "Net force equals rate of change of momentum; for constant mass, F equals ma.", example: "A lighter cart accelerates more for the same push.", formula: "F = m a", tags: ["force", "acceleration", "motion"] },
  { id: "newtons-third-law", term: "Newton's Third Law", category: "Mechanics", visual: "rocket", definition: "Every action force has an equal and opposite reaction force.", example: "A rocket moves upward by pushing gases downward.", tags: ["force", "interaction", "motion"] },
  { id: "nuclear-fission", term: "Nuclear Fission", category: "Modern Physics", visual: "atom", definition: "Splitting of a heavy nucleus into lighter nuclei with energy release.", example: "Uranium-235 fission powers many nuclear reactors.", tags: ["nuclear", "energy", "reactor"] },
  { id: "nuclear-fusion", term: "Nuclear Fusion", category: "Modern Physics", visual: "atom", definition: "Joining of light nuclei to form a heavier nucleus with energy release.", example: "Fusion powers the Sun.", tags: ["nuclear", "star", "energy"] },
  { id: "ohms-law", term: "Ohm's Law", category: "Electricity", visual: "battery", definition: "Current through an ohmic conductor is directly proportional to potential difference.", example: "Doubling voltage doubles current if resistance is constant.", formula: "V = I R", tags: ["current", "voltage", "resistance"] },
  { id: "period", term: "Period", category: "Waves", visual: "wave", definition: "Time taken for one complete oscillation or cycle.", example: "A pendulum taking 2 s per swing has period 2 s.", formula: "T = 1 / f", tags: ["oscillation", "frequency", "wave"] },
  { id: "photoelectric-effect", term: "Photoelectric Effect", category: "Modern Physics", visual: "atom", definition: "Emission of electrons from a material when light of sufficient frequency falls on it.", example: "Photocells use the photoelectric effect.", formula: "K_max = h f - phi", tags: ["quantum", "light", "electron"] },
  { id: "plancks-constant", term: "Planck's Constant", category: "Modern Physics", visual: "atom", definition: "Fundamental constant linking photon energy with frequency.", example: "Photon energy is calculated using Planck's constant.", formula: "E = h f", tags: ["quantum", "photon", "energy"] },
  { id: "polarization", term: "Polarization", category: "Waves", visual: "wave", definition: "Restriction of vibrations of a transverse wave to one plane.", example: "Polarized sunglasses reduce glare.", tags: ["light", "transverse", "optics"] },
  { id: "potential-energy", term: "Potential Energy", category: "Mechanics", visual: "flame", definition: "Stored energy due to position or configuration.", example: "A raised stone has gravitational potential energy.", formula: "U = m g h", tags: ["energy", "height", "gravity"] },
  { id: "power", term: "Power", category: "Mechanics", visual: "flame", definition: "Rate of doing work or transferring energy.", example: "A powerful motor lifts the same load faster.", formula: "P = W / t", tags: ["work", "energy", "watt"] },
  { id: "pressure", term: "Pressure", category: "Fluids", visual: "drop", definition: "Force acting normally per unit area.", example: "A sharp knife cuts better because it creates more pressure.", formula: "P = F / A", tags: ["force", "area", "fluid"] },
  { id: "projectile-motion", term: "Projectile Motion", category: "Mechanics", visual: "rocket", definition: "Two-dimensional motion under gravity after launch.", example: "A thrown ball follows a parabolic path.", tags: ["motion", "gravity", "trajectory"] },
  { id: "quantum", term: "Quantum", category: "Modern Physics", visual: "atom", definition: "Smallest discrete packet of a physical quantity such as energy.", example: "Light energy is exchanged in photons.", tags: ["modern physics", "discrete", "energy"] },
  { id: "radiation", term: "Radiation", category: "Thermal Physics", visual: "flame", definition: "Transfer of energy by electromagnetic waves without needing a medium.", example: "Sunlight reaches Earth by radiation.", tags: ["heat transfer", "light", "energy"] },
  { id: "radioactivity", term: "Radioactivity", category: "Modern Physics", visual: "atom", definition: "Spontaneous decay of unstable nuclei with emission of particles or radiation.", example: "Radium is radioactive.", tags: ["nuclear", "decay", "radiation"] },
  { id: "reflection", term: "Reflection", category: "Optics", visual: "eye", definition: "Bouncing back of light from a surface into the same medium.", example: "A plane mirror forms an image by reflection.", tags: ["light", "mirror", "ray"] },
  { id: "refraction", term: "Refraction", category: "Optics", visual: "prism", definition: "Change in direction of light when it passes between media due to speed change.", example: "A straw appears bent in water because of refraction.", tags: ["light", "medium", "Snell"] },
  { id: "resistance", term: "Resistance", category: "Electricity", visual: "battery", definition: "Opposition offered by a conductor to electric current.", example: "A resistor limits current in an LED circuit.", formula: "R = V / I", tags: ["current", "voltage", "ohm"] },
  { id: "resonance", term: "Resonance", category: "Waves", visual: "volume", definition: "Large amplitude vibration when driving frequency matches natural frequency.", example: "A swing goes higher when pushed at the right rhythm.", tags: ["oscillation", "frequency", "amplitude"] },
  { id: "scalar", term: "Scalar", category: "Measurement", visual: "ruler", definition: "Physical quantity with magnitude only.", example: "Mass and temperature are scalar quantities.", tags: ["quantity", "magnitude", "units"] },
  { id: "simple-harmonic-motion", term: "Simple Harmonic Motion", category: "Waves", visual: "spring", definition: "Oscillation where restoring force is proportional to displacement and opposite in direction.", example: "An ideal mass-spring system performs SHM.", formula: "a = -omega^2 x", tags: ["oscillation", "spring", "periodic"] },
  { id: "snells-law", term: "Snell's Law", category: "Optics", visual: "prism", definition: "Relation between angles of incidence and refraction for two media.", example: "It predicts bending of light entering glass from air.", formula: "n1 sin i = n2 sin r", tags: ["refraction", "light", "index"] },
  { id: "specific-heat", term: "Specific Heat Capacity", category: "Thermal Physics", visual: "thermometer", definition: "Heat required to raise temperature of unit mass by one degree.", example: "Water has high specific heat capacity.", formula: "c = Q / (m Delta T)", tags: ["heat", "temperature", "material"] },
  { id: "speed", term: "Speed", category: "Mechanics", visual: "gauge", definition: "Distance travelled per unit time.", example: "A car moving 60 km in 1 hour has speed 60 km/h.", formula: "v = d / t", tags: ["motion", "distance", "time"] },
  { id: "superposition", term: "Superposition", category: "Waves", visual: "wave", definition: "Net displacement due to overlapping waves equals the sum of individual displacements.", example: "Superposition explains interference patterns.", tags: ["waves", "interference", "addition"] },
  { id: "temperature", term: "Temperature", category: "Thermal Physics", visual: "thermometer", definition: "Measure of hotness related to average kinetic energy of particles.", example: "A fever thermometer measures body temperature.", tags: ["heat", "thermal", "kelvin"] },
  { id: "terminal-velocity", term: "Terminal Velocity", category: "Fluids", visual: "drop", definition: "Constant maximum speed reached when drag balances weight.", example: "A falling raindrop reaches terminal velocity.", tags: ["drag", "fluid", "motion"] },
  { id: "torque", term: "Torque", category: "Mechanics", visual: "gauge", definition: "Turning effect of a force about an axis.", example: "A longer wrench gives more torque for the same force.", formula: "tau = r F sin theta", tags: ["rotation", "force", "lever"] },
  { id: "total-internal-reflection", term: "Total Internal Reflection", category: "Optics", visual: "prism", definition: "Complete reflection of light inside a denser medium when incidence angle exceeds critical angle.", example: "Optical fibers guide light using total internal reflection.", tags: ["TIR", "critical angle", "fiber"] },
  { id: "transformer", term: "Transformer", category: "Magnetism", visual: "magnet", definition: "Device that changes AC voltage using mutual induction between coils.", example: "Power adapters use transformers to step voltage down.", formula: "Vs/Vp = Ns/Np", tags: ["AC", "induction", "voltage"] },
  { id: "uncertainty", term: "Uncertainty", category: "Measurement", visual: "ruler", definition: "Estimated range within which a measured value may lie.", example: "A ruler marked in millimetres may have uncertainty about +-0.5 mm.", tags: ["measurement", "error", "precision"] },
  { id: "vector", term: "Vector", category: "Measurement", visual: "compass", definition: "Physical quantity with both magnitude and direction.", example: "Velocity and force are vector quantities.", tags: ["direction", "quantity", "components"] },
  { id: "velocity", term: "Velocity", category: "Mechanics", visual: "rocket", definition: "Rate of change of displacement with time, including direction.", example: "10 m/s east is a velocity.", formula: "v = Delta s / Delta t", tags: ["motion", "vector", "speed"] },
  { id: "viscosity", term: "Viscosity", category: "Fluids", visual: "drop", definition: "Internal resistance of a fluid to flow.", example: "Honey has greater viscosity than water.", tags: ["fluid", "flow", "drag"] },
  { id: "voltage", term: "Voltage", category: "Electricity", visual: "battery", definition: "Potential difference that drives charge through a circuit.", example: "A 9 V battery provides voltage across a circuit.", formula: "V = W / Q", tags: ["potential", "charge", "circuit"] },
  { id: "wavelength", term: "Wavelength", category: "Waves", visual: "wave", definition: "Distance between two consecutive points in the same phase of a wave.", example: "Distance from crest to crest is one wavelength.", formula: "lambda = v / f", tags: ["wave", "frequency", "speed"] },
  { id: "weight", term: "Weight", category: "Mechanics", visual: "gauge", definition: "Gravitational force acting on a mass.", example: "An astronaut's weight is less on the Moon.", formula: "W = m g", tags: ["gravity", "force", "mass"] },
  { id: "work", term: "Work", category: "Mechanics", visual: "flame", definition: "Energy transferred when a force causes displacement.", example: "Lifting a bag does work against gravity.", formula: "W = F s cos theta", tags: ["energy", "force", "displacement"] },
];

const particlePhysicsDictionary: PhysicsDictionaryTerm[] = [
  { id: "standard-model-particle-physics", term: "Standard Model", category: "Modern Physics", visual: "atom", definition: "Quantum field theory framework that classifies known elementary particles and their electromagnetic, weak, and strong interactions.", example: "Electrons are leptons, protons contain quarks, and photons are gauge bosons in the Standard Model.", tags: ["particle physics", "quarks", "leptons", "gauge bosons"] },
  { id: "quantum-field-theory", term: "Quantum Field Theory", category: "Modern Physics", visual: "field", definition: "Theory in which particles are quantized excitations of fields rather than tiny classical objects.", example: "A photon is an excitation of the electromagnetic field.", formula: "E^2 = p^2 c^2 + m^2 c^4", tags: ["QFT", "fields", "particles"] },
  { id: "higgs-field", term: "Higgs Field", category: "Modern Physics", visual: "field", definition: "Field with a nonzero vacuum value that is connected to the masses of W and Z bosons and fermions.", example: "Particles that couple more strongly to the Higgs field have larger rest mass.", tags: ["Higgs", "mass", "electroweak"] },
  { id: "higgs-boson", term: "Higgs Boson", category: "Modern Physics", visual: "atom", definition: "Quantum excitation of the Higgs field, observed through decay signatures in high-energy collisions.", example: "The LHC discovery near 125 GeV confirmed the Higgs boson.", formula: "m_H ~= 125 GeV/c^2", tags: ["Higgs", "boson", "particle physics"] },
  { id: "quarks-particle-physics", term: "Quarks", category: "Modern Physics", visual: "atom", definition: "Elementary particles that carry color charge and combine into hadrons such as protons and neutrons.", example: "A proton contains two up quarks and one down quark as valence quarks.", tags: ["quark", "hadrons", "color charge"] },
  { id: "leptons", term: "Leptons", category: "Modern Physics", visual: "atom", definition: "Elementary matter particles that do not experience the strong interaction.", example: "Electrons and neutrinos are leptons.", tags: ["electron", "neutrino", "particle physics"] },
  { id: "gluon", term: "Gluon", category: "Modern Physics", visual: "field", definition: "Gauge boson that carries the strong interaction between color-charged particles.", example: "Gluons bind quarks inside protons and neutrons.", tags: ["strong force", "color charge", "QCD"] },
  { id: "color-charge", term: "Color Charge", category: "Modern Physics", visual: "field", definition: "The strong-interaction charge carried by quarks and gluons; it is not a visible color.", example: "Quarks combine so observed hadrons are color neutral.", tags: ["quarks", "gluons", "strong interaction"] },
  { id: "gauge-boson", term: "Gauge Boson", category: "Modern Physics", visual: "atom", definition: "Force-carrying boson associated with a gauge symmetry, such as the photon, gluon, W boson, or Z boson.", example: "Photons mediate electromagnetic interactions.", tags: ["forces", "photon", "weak force", "strong force"] },
  { id: "neutrino-oscillation", term: "Neutrino Oscillation", category: "Modern Physics", visual: "wave", definition: "Flavor change of neutrinos during travel, caused by mixing between flavor states and mass states.", example: "Solar electron neutrinos can arrive at Earth as muon or tau neutrinos.", tags: ["neutrino", "flavor", "mass"] },
  { id: "symmetry-breaking", term: "Symmetry Breaking", category: "Modern Physics", visual: "spark", definition: "Situation where symmetric laws produce a state with less visible symmetry.", example: "Electroweak symmetry breaking is part of the Higgs mechanism.", tags: ["Higgs mechanism", "fields", "electroweak"] },
  { id: "quark-confinement", term: "Quark Confinement", category: "Modern Physics", visual: "atom", definition: "Property that quarks and gluons are not observed as isolated particles at ordinary energies.", example: "High-energy collisions produce hadron jets rather than free quarks.", tags: ["quarks", "gluons", "QCD", "hadrons"] },
  { id: "antimatter-particle-physics", term: "Antimatter", category: "Modern Physics", visual: "atom", definition: "Matter made of antiparticles with opposite electric charge and corresponding quantum numbers.", example: "An electron and positron can annihilate into photons.", formula: "E = mc^2", tags: ["antiparticle", "annihilation", "pair production"] },
];

const atmosphereDictionary: PhysicsDictionaryTerm[] = [
  { id: "earth-atmosphere", term: "Earth's Atmosphere", category: "Astronomy", visual: "orbit", definition: "Layered envelope of gases surrounding Earth, held by gravity and shaped by radiation, temperature, density, and composition.", example: "Weather occurs in the troposphere while auroras appear mainly in the thermosphere.", tags: ["atmosphere", "layers", "weather", "space"] },
  { id: "troposphere", term: "Troposphere", category: "Astronomy", visual: "rocket", definition: "Lowest atmospheric layer, extending from the ground to about 12-18 km, where weather and clouds form.", example: "Passenger aircraft usually cruise near the upper troposphere.", tags: ["weather", "clouds", "atmosphere"] },
  { id: "stratosphere", term: "Stratosphere", category: "Astronomy", visual: "rocket", definition: "Layer above the troposphere, about 12-18 to 50 km, containing the ozone layer.", example: "Ozone in the stratosphere absorbs ultraviolet radiation.", tags: ["ozone", "UV", "atmosphere"] },
  { id: "mesosphere", term: "Mesosphere", category: "Astronomy", visual: "spark", definition: "Cold atmospheric layer about 50 to 80-90 km above Earth where many meteors burn.", example: "Meteor streaks are often produced in the mesosphere.", tags: ["meteors", "coldest layer", "atmosphere"] },
  { id: "thermosphere", term: "Thermosphere", category: "Astronomy", visual: "spark", definition: "Very thin, high-energy layer about 80-90 to 800 km where auroras and ionospheric effects occur.", example: "Charged particles from the Sun can produce auroras in the thermosphere.", tags: ["aurora", "ionosphere", "satellites"] },
  { id: "exosphere", term: "Exosphere", category: "Astronomy", visual: "orbit", definition: "Outermost atmospheric region where particles are so sparse that they may travel far before colliding.", example: "Many satellites orbit through the exosphere and nearby space.", tags: ["satellite", "outer atmosphere", "space"] },
  { id: "ozone-layer", term: "Ozone Layer", category: "Astronomy", visual: "field", definition: "Region in the stratosphere with elevated ozone concentration that absorbs much of the Sun's ultraviolet radiation.", example: "The ozone layer helps protect living organisms from harmful UV radiation.", tags: ["stratosphere", "UV", "radiation"] },
  { id: "aurora", term: "Aurora", category: "Astronomy", visual: "spark", definition: "Light display produced when charged particles excite atoms and molecules in the upper atmosphere.", example: "Auroras are common near polar regions during geomagnetic activity.", tags: ["thermosphere", "solar wind", "magnetosphere"] },
];

const stringTheoryDictionary: PhysicsDictionaryTerm[] = [
  { id: "string-theory", term: "String Theory", category: "Modern Physics", visual: "wave", definition: "Theoretical framework in which fundamental objects are tiny one-dimensional strings rather than point particles.", example: "Different vibration modes of a string may correspond to different particle properties.", tags: ["theoretical physics", "quantum gravity", "extra dimensions"] },
  { id: "extra-dimensions-string-theory", term: "Extra Dimensions", category: "Modern Physics", visual: "orbit", definition: "Additional spatial dimensions used in some theories beyond ordinary three-dimensional space.", example: "String theory often models extra dimensions as compact curled dimensions.", tags: ["string theory", "compactification", "spacetime"] },
  { id: "graviton", term: "Graviton", category: "Modern Physics", visual: "wave", definition: "Hypothetical quantum particle associated with gravitational interaction.", example: "String theory naturally includes a vibration mode interpreted as a graviton.", tags: ["quantum gravity", "string theory", "gravity"] },
  { id: "quantum-gravity", term: "Quantum Gravity", category: "Modern Physics", visual: "field", definition: "Research area seeking a quantum description of gravity and spacetime.", example: "String theory is one candidate approach to quantum gravity.", tags: ["gravity", "quantum", "relativity"] },
];

const supplementalDictionarySeeds: Array<[term: string, category: DictionaryCategory, visual: PhysicsIconName, tags: string[]]> = [
  ...[
    "Absolute Error", "Calibration", "Derived Unit", "Fundamental Quantity", "Least Count", "Mean Value", "Parallax Error", "Percentage Error", "Precision", "Random Error", "Resolution", "SI Unit", "Significant Figures", "Systematic Error", "Unit Conversion", "Vernier Constant", "Zero Error", "Dimensional Homogeneity", "Order of Magnitude", "Standard Deviation",
  ].map((term) => [term, "Measurement", "ruler", ["measurement", "units"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Action", "Air Resistance", "Angular Acceleration", "Center of Mass", "Conservative Force", "Damping", "Drag Force", "Elasticity", "Equilibrium", "Free Body Diagram", "Impulse-Momentum Theorem", "Jerk", "Mechanical Advantage", "Normal Reaction", "Pseudo Force", "Rigid Body", "Rolling Motion", "Static Equilibrium", "Tension", "Work-Energy Theorem",
  ].map((term) => [term, "Mechanics", "gauge", ["mechanics", "motion"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Beat Frequency", "Coherence", "Compressions", "Constructive Interference", "Destructive Interference", "Fundamental Frequency", "Harmonic", "Longitudinal Wave", "Node", "Antinode", "Phase Difference", "Rarefaction", "Standing Wave", "Transverse Wave", "Wave Equation", "Wave Number", "Wave Pulse", "Wave Speed", "Wavefront", "Sound Intensity",
  ].map((term) => [term, "Waves", "wave", ["waves", "oscillation"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Aberration", "Angle of Deviation", "Brewster Angle", "Chromatic Dispersion", "Converging Mirror", "Diverging Mirror", "Focal Plane", "Image Distance", "Magnification", "Mirage", "Optical Axis", "Optical Fiber", "Plane Mirror", "Power of Lens", "Principal Focus", "Real Image", "Refractive Index", "Spherical Aberration", "Virtual Image", "Young's Double Slit",
  ].map((term) => [term, "Optics", "prism", ["optics", "light"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Adiabatic Process", "Calorimetry", "Carnot Engine", "Convection", "Critical Temperature", "Entropy Change", "First Law of Thermodynamics", "Heat Engine", "Heat Reservoir", "Isobaric Process", "Isochoric Process", "Isothermal Process", "Kelvin Scale", "Kinetic Theory", "Mean Free Path", "Molar Heat Capacity", "Second Law of Thermodynamics", "Thermal Conductivity", "Thermal Equilibrium", "Triple Point",
  ].map((term) => [term, "Thermal Physics", "thermometer", ["thermal", "heat"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Alternating Current", "Ammeter", "Conductance", "Current Density", "Dielectric", "Direct Current", "Drift Velocity", "Electric Dipole", "Electric Flux", "Electric Power", "Electrolyte", "Equipotential Surface", "Internal Resistance", "Kirchhoff's Laws", "Parallel Circuit", "Potential Difference", "Resistivity", "Series Circuit", "Superconductor", "Voltmeter",
  ].map((term) => [term, "Electricity", "battery", ["electricity", "circuit"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Ampere's Law", "Biot-Savart Law", "Cyclotron", "Diamagnetism", "Eddy Current", "Ferromagnetism", "Hall Effect", "Magnetic Dipole", "Magnetic Permeability", "Magnetic Susceptibility", "Magnetization", "Mutual Inductance", "Paramagnetism", "Right-Hand Rule", "Self Inductance", "Solenoid", "Tesla", "Torque on Coil", "Weber", "Lorentz Force",
  ].map((term) => [term, "Magnetism", "magnet", ["magnetism", "field"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Annihilation", "Blackbody Radiation", "Compton Effect", "De Broglie Wave", "Energy Level", "Excited State", "Ground State", "Isotope", "Mass Defect", "Neutrino", "Nuclear Binding Energy", "Pair Production", "Photon", "Quantum Number", "Quark", "Rydberg Constant", "Schrodinger Equation", "Threshold Frequency", "Uncertainty Principle", "Work Function",
  ].map((term) => [term, "Modern Physics", "atom", ["modern physics", "quantum"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Capillary Action", "Continuity Equation", "Dynamic Pressure", "Fluid Statics", "Hydraulic Lift", "Hydrostatic Pressure", "Ideal Fluid", "Laminar Flow", "Pascal's Law", "Poiseuille's Law", "Reynolds Number", "Streamline", "Surface Tension", "Turbulent Flow", "Upthrust", "Viscous Drag", "Volume Flow Rate", "Wetted Surface", "Manometer", "Barometer",
  ].map((term) => [term, "Fluids", "drop", ["fluids", "pressure"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
  ...[
    "Accretion Disk", "Apparent Magnitude", "Asteroid", "Big Bang", "Black Hole", "Cosmic Microwave Background", "Dark Energy", "Dark Matter", "Event Horizon", "Galaxy", "Hubble Constant", "Light Year", "Luminosity", "Main Sequence", "Nebula", "Neutron Star", "Parsec", "Redshift", "Supernova", "White Dwarf",
  ].map((term) => [term, "Astronomy", "orbit", ["astronomy", "space"]] as [string, DictionaryCategory, PhysicsIconName, string[]]),
];

const supplementalPhysicsDictionary: PhysicsDictionaryTerm[] = supplementalDictionarySeeds.map(([term, category, visual, tags]) => ({
  id: `supplemental-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
  term,
  category,
  visual,
  definition: `${term} is a physics term used in ${category.toLowerCase()} to describe a specific idea, quantity, law, effect, instrument, or model.`,
  example: `In ${category.toLowerCase()} problems, ${term.toLowerCase()} helps connect the concept to observations, formulas, or lab measurements.`,
  tags,
}));

export const physicsDictionary: PhysicsDictionaryTerm[] = [
  ...corePhysicsDictionary,
  ...particlePhysicsDictionary,
  ...atmosphereDictionary,
  ...stringTheoryDictionary,
  ...supplementalPhysicsDictionary,
].sort((left, right) => left.term.localeCompare(right.term));

export const dictionaryStats = {
  terms: physicsDictionary.length,
  categories: dictionaryCategories.length,
  formulas: physicsDictionary.filter((entry) => entry.formula).length,
};

export function normalizeDictionaryText(value: string) {
  return value.toLowerCase().replace(/[^\w\s.+-]/g, " ").replace(/\s+/g, " ").trim();
}
