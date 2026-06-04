export type SolverDifficulty = "Basic" | "Intermediate" | "Difficult";

export interface SolverQuestion {
  id: string;
  classRange: string;
  difficulty: SolverDifficulty;
  prompt: string;
  answer: string;
  conceptTags: string[];
}

export interface SolverSubcategory {
  id: string;
  title: string;
  description: string;
  questions: SolverQuestion[];
}

export interface SolverCategory {
  id: string;
  title: string;
  domain: string;
  classRange: string;
  conceptTags: string[];
  subcategories: SolverSubcategory[];
}

const q = (
  id: string,
  classRange: string,
  difficulty: SolverDifficulty,
  prompt: string,
  answer: string,
  conceptTags: string[]
): SolverQuestion => ({ id, classRange, difficulty, prompt, answer, conceptTags });

export const solverCategories: SolverCategory[] = [
  {
    id: "measurement-units",
    title: "Measurement, Units, and Dimensions",
    domain: "Measurement",
    classRange: "Class 7-11",
    conceptTags: ["SI units", "conversion", "dimensions", "errors"],
    subcategories: [
      {
        id: "unit-conversion",
        title: "Unit Conversion",
        description: "Convert everyday and lab values into consistent SI units.",
        questions: [
          q("mu-1", "Class 7-9", "Basic", "A cart travels 180 m in 30 s. Find its speed in m/s and km/h.", "Speed = 180/30 = 6 m/s. In km/h, multiply by 3.6, so speed = 21.6 km/h.", ["speed", "unit conversion"]),
          q("mu-2", "Class 9-11", "Intermediate", "Convert 72 km/h to m/s and use it to find distance covered in 12 s.", "72 km/h = 72 x 5/18 = 20 m/s. Distance = vt = 20 x 12 = 240 m.", ["velocity", "distance", "SI units"]),
        ],
      },
      {
        id: "errors-dimensions",
        title: "Errors and Dimensions",
        description: "Check formulas and report measurements with uncertainty.",
        questions: [
          q("ed-1", "Class 11", "Intermediate", "A length is measured as 12.4 cm with least count 0.1 cm. Write it with absolute uncertainty.", "The measurement can be reported as 12.4 +/- 0.1 cm if the instrument uncertainty is one least count.", ["least count", "absolute error"]),
          q("ed-2", "Class 11", "Difficult", "Use dimensions to test whether s = ut + at is correct.", "s has dimension L. ut has LT^-1 x T = L, but at has LT^-2 x T = LT^-1. Terms cannot be added, so the formula is dimensionally wrong. Correct form is s = ut + 1/2 at^2.", ["dimensional analysis", "kinematics"]),
        ],
      },
    ],
  },
  {
    id: "motion-kinematics",
    title: "Motion and Kinematics",
    domain: "Mechanics",
    classRange: "Class 7-11",
    conceptTags: ["speed", "velocity", "acceleration", "graphs"],
    subcategories: [
      {
        id: "uniform-motion",
        title: "Uniform and Non-Uniform Motion",
        description: "Use distance, displacement, speed, and acceleration.",
        questions: [
          q("mk-1", "Class 7-9", "Basic", "A cyclist covers 500 m in 100 s. What is the average speed?", "Average speed = total distance/total time = 500/100 = 5 m/s.", ["average speed"]),
          q("mk-2", "Class 9-11", "Intermediate", "A body starts from rest and reaches 20 m/s in 5 s. Find acceleration.", "Acceleration = change in velocity/time = (20 - 0)/5 = 4 m/s^2.", ["acceleration", "uniform acceleration"]),
        ],
      },
      {
        id: "motion-graphs",
        title: "Motion Graphs",
        description: "Interpret distance-time and velocity-time graphs.",
        questions: [
          q("mg-1", "Class 9", "Intermediate", "A velocity-time graph is a horizontal line at 8 m/s for 6 s. Find displacement.", "Area under v-t graph = velocity x time = 8 x 6 = 48 m.", ["velocity-time graph", "area"]),
          q("mg-2", "Class 11", "Difficult", "A v-t graph goes from 0 to 12 m/s in 4 s, then stays at 12 m/s for 3 s. Find total displacement.", "First part area = 1/2 x 4 x 12 = 24 m. Second part area = 12 x 3 = 36 m. Total displacement = 60 m.", ["graph area", "piecewise motion"]),
        ],
      },
    ],
  },
  {
    id: "forces-laws",
    title: "Forces and Newton's Laws",
    domain: "Mechanics",
    classRange: "Class 8-11",
    conceptTags: ["force", "inertia", "momentum", "friction"],
    subcategories: [
      {
        id: "newton-laws",
        title: "Newton's Laws",
        description: "Connect force, mass, acceleration, and inertia.",
        questions: [
          q("nl-1", "Class 9", "Intermediate", "A 4 kg block has a net force of 20 N. Find acceleration.", "Using F = ma, a = F/m = 20/4 = 5 m/s^2.", ["F=ma", "acceleration"]),
          q("nl-2", "Class 11", "Difficult", "A 10 kg box is pushed with 60 N. Friction is 15 N. Find acceleration.", "Net force = 60 - 15 = 45 N. Acceleration = 45/10 = 4.5 m/s^2.", ["net force", "friction"]),
        ],
      },
      {
        id: "momentum-impulse",
        title: "Momentum and Impulse",
        description: "Use momentum conservation and impulse change.",
        questions: [
          q("mi-1", "Class 9-11", "Intermediate", "A 2 kg ball moving at 5 m/s stops. Find change in momentum magnitude.", "Initial momentum = mv = 2 x 5 = 10 kg m/s. Final momentum is 0. Change magnitude = 10 kg m/s.", ["momentum"]),
          q("mi-2", "Class 11", "Difficult", "A 0.1 kg ball changes velocity from +20 m/s to -10 m/s. Find impulse.", "Impulse = change in momentum = m(v-u) = 0.1(-10 - 20) = -3 N s. Magnitude = 3 N s opposite initial direction.", ["impulse", "sign convention"]),
        ],
      },
    ],
  },
  {
    id: "work-energy-power",
    title: "Work, Energy, and Power",
    domain: "Mechanics",
    classRange: "Class 9-11",
    conceptTags: ["work", "energy", "power", "conservation"],
    subcategories: [
      {
        id: "work-power",
        title: "Work and Power",
        description: "Calculate energy transfer and rate of doing work.",
        questions: [
          q("wp-1", "Class 9", "Basic", "A force of 15 N moves a box 4 m in the force direction. Find work.", "Work = Fs = 15 x 4 = 60 J.", ["work", "force"]),
          q("wp-2", "Class 9-11", "Intermediate", "A machine does 600 J of work in 12 s. Find power.", "Power = work/time = 600/12 = 50 W.", ["power", "work"]),
        ],
      },
      {
        id: "energy-conservation",
        title: "Conservation of Energy",
        description: "Convert potential energy to kinetic energy.",
        questions: [
          q("ec-1", "Class 9-11", "Intermediate", "A 2 kg object is lifted 5 m. Find gain in gravitational potential energy. Take g = 10 m/s^2.", "Potential energy = mgh = 2 x 10 x 5 = 100 J.", ["potential energy"]),
          q("ec-2", "Class 11", "Difficult", "A body falls from height h without air resistance. Show why impact speed is independent of mass.", "mgh = 1/2 mv^2. Mass cancels, so v = sqrt(2gh), independent of mass.", ["energy conservation", "free fall"]),
        ],
      },
    ],
  },
  {
    id: "gravitation-fluids",
    title: "Gravitation and Fluids",
    domain: "Mechanics",
    classRange: "Class 8-11",
    conceptTags: ["gravity", "pressure", "buoyancy", "Bernoulli"],
    subcategories: [
      {
        id: "gravity-weight",
        title: "Gravity, Mass, and Weight",
        description: "Distinguish mass from weight and use gravitational field strength.",
        questions: [
          q("gw-1", "Class 9", "Basic", "Find weight of a 50 kg student on Earth. Take g = 9.8 m/s^2.", "Weight = mg = 50 x 9.8 = 490 N.", ["mass", "weight"]),
          q("gw-2", "Class 11", "Difficult", "Why does orbital speed not depend on satellite mass?", "For circular orbit, gravitational force provides centripetal force: GMm/r^2 = mv^2/r. The satellite mass cancels, so v = sqrt(GM/r).", ["orbit", "gravitation"]),
        ],
      },
      {
        id: "pressure-buoyancy",
        title: "Pressure and Buoyancy",
        description: "Use pressure, depth, density, and Archimedes' principle.",
        questions: [
          q("pb-1", "Class 8-9", "Intermediate", "A force of 100 N acts on area 0.5 m^2. Find pressure.", "Pressure = F/A = 100/0.5 = 200 Pa.", ["pressure"]),
          q("pb-2", "Class 9-11", "Difficult", "An object displaces 0.003 m^3 of water. Find buoyant force. Take water density = 1000 kg/m^3 and g = 10 m/s^2.", "Buoyant force = rho g V = 1000 x 10 x 0.003 = 30 N.", ["Archimedes principle", "buoyancy"]),
        ],
      },
    ],
  },
  {
    id: "heat-thermodynamics",
    title: "Heat and Thermodynamics",
    domain: "Thermodynamics",
    classRange: "Class 7-11",
    conceptTags: ["temperature", "heat transfer", "calorimetry", "gas laws"],
    subcategories: [
      {
        id: "temperature-heat",
        title: "Temperature and Heat",
        description: "Connect temperature scales and heat energy.",
        questions: [
          q("th-1", "Class 7", "Basic", "Convert 27 C to kelvin.", "K = C + 273.15 = 27 + 273.15 = 300.15 K.", ["temperature conversion"]),
          q("th-2", "Class 11", "Intermediate", "How much heat is needed to raise 2 kg water by 5 C? Use c = 4200 J/kg C.", "Q = mc DeltaT = 2 x 4200 x 5 = 42000 J.", ["specific heat", "calorimetry"]),
        ],
      },
      {
        id: "gas-thermo",
        title: "Gas Laws and Work",
        description: "Use PV = nRT and work done by gases.",
        questions: [
          q("gt-1", "Class 11", "Intermediate", "At constant volume, gas temperature doubles in kelvin. What happens to pressure?", "From P/T = constant at fixed volume and moles, pressure doubles.", ["Gay-Lussac law"]),
          q("gt-2", "Class 11", "Difficult", "A gas expands at 200 kPa by 3 L. Find work done by gas.", "Work = P DeltaV = 200000 x 0.003 = 600 J.", ["thermodynamic work", "unit conversion"]),
        ],
      },
    ],
  },
  {
    id: "oscillations-waves",
    title: "Oscillations and Waves",
    domain: "Waves",
    classRange: "Class 8-12",
    conceptTags: ["SHM", "frequency", "wavelength", "interference"],
    subcategories: [
      {
        id: "shm",
        title: "Simple Harmonic Motion",
        description: "Use period relations for pendulum and spring systems.",
        questions: [
          q("shm-1", "Class 11", "Intermediate", "A pendulum length is 1 m. Estimate period. Take g = 9.8 m/s^2.", "T = 2 pi sqrt(L/g) = 2 pi sqrt(1/9.8) about 2.0 s.", ["pendulum", "period"]),
          q("shm-2", "Class 11", "Difficult", "A spring has k = 200 N/m and mass = 2 kg. Find angular frequency.", "omega = sqrt(k/m) = sqrt(200/2) = sqrt(100) = 10 rad/s.", ["spring mass", "angular frequency"]),
        ],
      },
      {
        id: "wave-relations",
        title: "Wave Relations",
        description: "Relate speed, frequency, wavelength, and interference.",
        questions: [
          q("wr-1", "Class 8-11", "Intermediate", "A wave has speed 340 m/s and frequency 170 Hz. Find wavelength.", "lambda = v/f = 340/170 = 2 m.", ["wave speed", "wavelength"]),
          q("wr-2", "Class 12", "Difficult", "In YDSE, lambda = 600 nm, D = 2 m, d = 0.5 mm. Find fringe width.", "beta = lambda D/d = (600e-9 x 2)/(0.5e-3) = 2.4e-3 m = 2.4 mm.", ["YDSE", "interference"]),
        ],
      },
    ],
  },
  {
    id: "sound",
    title: "Sound",
    domain: "Waves",
    classRange: "Class 8-9",
    conceptTags: ["sound speed", "echo", "pitch", "loudness"],
    subcategories: [
      {
        id: "pitch-loudness",
        title: "Pitch and Loudness",
        description: "Separate frequency, amplitude, and intensity ideas.",
        questions: [
          q("pl-1", "Class 8", "Basic", "Which physical quantity mainly decides pitch?", "Frequency decides pitch. Higher frequency means higher pitch.", ["frequency", "pitch"]),
          q("pl-2", "Class 8-9", "Intermediate", "If amplitude doubles, what happens to intensity in a simple model?", "Intensity is proportional to amplitude squared, so it becomes 4 times.", ["amplitude", "intensity"]),
        ],
      },
      {
        id: "echo-ultrasound",
        title: "Echo and Ultrasound",
        description: "Use round-trip sound travel time.",
        questions: [
          q("eu-1", "Class 9", "Intermediate", "An echo returns in 2 s. Speed of sound is 340 m/s. Find wall distance.", "Sound travels to wall and back, so distance = vt/2 = 340 x 2 / 2 = 340 m.", ["echo", "speed of sound"]),
          q("eu-2", "Class 9", "Difficult", "Why is ultrasound useful in medical imaging?", "Ultrasound has high frequency and short wavelength, so it can reflect from small internal structures and form images without ionizing radiation.", ["ultrasound", "reflection"]),
        ],
      },
    ],
  },
  {
    id: "optics",
    title: "Light and Geometrical Optics",
    domain: "Optics",
    classRange: "Class 7-12",
    conceptTags: ["reflection", "refraction", "lenses", "prism", "dispersion", "TIR", "interference", "diffraction", "polarization", "EM spectrum"],
    subcategories: [
      {
        id: "mirrors-lenses",
        title: "Mirrors and Lenses",
        description: "Use ray diagrams, mirror formula, and lens formula.",
        questions: [
          q("ml-1", "Class 10", "Intermediate", "A concave mirror has f = -15 cm and object distance u = -30 cm. Find v.", "1/f = 1/v + 1/u. 1/v = 1/f - 1/u = -1/15 + 1/30 = -1/30, so v = -30 cm.", ["mirror formula"]),
          q("ml-2", "Class 10-12", "Difficult", "A convex lens has f = 20 cm and object at 30 cm. Find image distance using Cartesian sign convention.", "Use f = +20 cm, u = -30 cm. 1/v = 1/f + 1/u = 1/20 - 1/30 = 1/60, so v = +60 cm.", ["lens formula", "sign convention"]),
        ],
      },
      {
        id: "refraction-tir",
        title: "Refraction and Total Internal Reflection",
        description: "Use Snell's law and critical angle.",
        questions: [
          q("rt-1", "Class 10", "Intermediate", "Light enters glass from air. If speed in glass is 2 x 10^8 m/s, find refractive index.", "n = c/v = 3 x 10^8 / 2 x 10^8 = 1.5.", ["refractive index"]),
          q("rt-2", "Class 12", "Difficult", "Find critical angle for glass-air interface with n_glass = 1.5.", "sin C = n_air/n_glass = 1/1.5 = 0.667. C = sin^-1(0.667) about 41.8 degrees.", ["critical angle", "TIR"]),
        ],
      },
      {
        id: "prism-dispersion",
        title: "Prism and Dispersion",
        description: "Label prism rays, VIBGYOR order, deviation, and minimum deviation.",
        questions: [
          q("pd-1", "Class 8-10", "Basic", "What happens when white light passes through a glass prism?", "The prism refracts the light at two faces and separates it into a VIBGYOR spectrum.", ["prism", "dispersion", "VIBGYOR"]),
          q("pd-2", "Class 10-12", "Basic", "Which colour deviates more in normal glass: red or violet?", "Violet deviates more because glass has a larger refractive index for shorter wavelengths.", ["violet", "red", "dispersion"]),
          q("pd-3", "Class 10-12", "Intermediate", "A thin prism has A = 60 degrees and n = 1.5. Estimate mean deviation.", "Using delta approximately (n - 1)A, delta = (1.5 - 1) x 60 = 30 degrees.", ["prism deviation"]),
          q("pd-4", "Class 12", "Difficult", "Write the refractive-index formula for a prism at minimum deviation.", "At minimum deviation, n = sin((A + Dm)/2) / sin(A/2), where A is prism angle and Dm is minimum deviation.", ["minimum deviation", "prism formula"]),
          q("pd-5", "Class 10-12", "Basic", "From where should prism incidence and emergence angles be measured?", "They must be measured from the normal to the prism face, not from the surface.", ["normal", "angle measurement"]),
        ],
      },
      {
        id: "wave-optics",
        title: "Wave Optics",
        description: "Use interference, diffraction, and polarization patterns.",
        questions: [
          q("wo-1", "Class 12", "Basic", "What condition is needed for a stable Young's double-slit fringe pattern?", "The two sources must be coherent, meaning they maintain a fixed phase difference.", ["coherence", "YDSE"]),
          q("wo-2", "Class 12", "Intermediate", "In YDSE, what happens to fringe width if slit separation is doubled?", "Fringe width beta = lambda D/d, so doubling d halves the fringe width.", ["fringe width", "YDSE"]),
          q("wo-3", "Class 12", "Basic", "Why is the central maximum broad in single-slit diffraction?", "Light from different parts of one aperture interferes; the central maximum lies between the first minima on both sides and is the widest bright region.", ["single slit", "diffraction"]),
          q("wo-4", "Class 12", "Intermediate", "What happens to single-slit diffraction spread when slit width decreases?", "The spread increases because minima satisfy a sin theta = m lambda; smaller a gives larger theta.", ["aperture", "diffraction"]),
          q("wo-5", "Class 12", "Basic", "What does polarization prove about light?", "Polarization proves that light is transverse, because longitudinal waves cannot be plane-polarized.", ["polarization", "transverse wave"]),
          q("wo-6", "Class 12", "Intermediate", "State Malus' law for polarized light through an analyzer.", "Malus' law is I = I0 cos^2 theta, where theta is the angle between polarizer and analyzer axes.", ["Malus law", "polarization"]),
        ],
      },
      {
        id: "em-spectrum",
        title: "Electromagnetic Spectrum",
        description: "Connect frequency, wavelength, photon energy, and spectrum bands.",
        questions: [
          q("ems-1", "Class 12", "Basic", "Do electromagnetic waves need a material medium?", "No. Electromagnetic waves can travel through vacuum.", ["EM waves", "vacuum"]),
          q("ems-2", "Class 12", "Basic", "Which has higher frequency: infrared or ultraviolet?", "Ultraviolet has higher frequency and therefore higher photon energy.", ["frequency", "UV", "IR"]),
          q("ems-3", "Class 12", "Intermediate", "If frequency increases, what happens to wavelength in vacuum?", "Since c = f lambda and c is constant, wavelength decreases when frequency increases.", ["frequency", "wavelength"]),
          q("ems-4", "Class 12", "Intermediate", "What formula connects photon energy and frequency?", "Photon energy is E = hf, where h is Planck's constant and f is frequency.", ["photon energy", "Planck relation"]),
        ],
      },
    ],
  },
  {
    id: "electricity",
    title: "Electricity and Circuits",
    domain: "Electricity",
    classRange: "Class 7-12",
    conceptTags: ["current", "voltage", "resistance", "power"],
    subcategories: [
      {
        id: "ohms-law-circuits",
        title: "Ohm's Law and Resistance",
        description: "Solve simple resistor circuits.",
        questions: [
          q("ol-1", "Class 10", "Basic", "A 6 V battery is connected to a 3 ohm resistor. Find current.", "I = V/R = 6/3 = 2 A.", ["Ohm's law"]),
          q("ol-2", "Class 10-12", "Intermediate", "Two resistors 4 ohm and 6 ohm are in series across 20 V. Find current.", "Series resistance = 4 + 6 = 10 ohm. Current = 20/10 = 2 A.", ["series resistance"]),
        ],
      },
      {
        id: "power-heating",
        title: "Electrical Power and Heating",
        description: "Connect electrical energy to appliances and heating.",
        questions: [
          q("ph-1", "Class 10", "Intermediate", "A device uses 2 A at 220 V. Find power.", "P = VI = 220 x 2 = 440 W.", ["electric power"]),
          q("ph-2", "Class 10", "Difficult", "A 1000 W heater runs for 2 h. Find energy in kWh and joules.", "Energy = 1 kW x 2 h = 2 kWh. In joules, 2 x 3.6 x 10^6 = 7.2 x 10^6 J.", ["kWh", "Joule heating"]),
        ],
      },
    ],
  },
  {
    id: "electrostatics-capacitance",
    title: "Electrostatics and Capacitance",
    domain: "Electricity",
    classRange: "Class 8-12",
    conceptTags: ["charge", "field", "potential", "capacitance"],
    subcategories: [
      {
        id: "charge-field",
        title: "Charge, Field, and Potential",
        description: "Use Coulomb force, electric field, and potential.",
        questions: [
          q("cf-1", "Class 8-12", "Intermediate", "Two like charges are brought closer. What happens to force?", "The force increases because Coulomb force is inversely proportional to r^2. Like charges repel.", ["Coulomb law", "inverse square"]),
          q("cf-2", "Class 12", "Difficult", "A 2 microC charge is at 0.5 m. Find potential. Take k = 9 x 10^9.", "V = kq/r = 9e9 x 2e-6 / 0.5 = 36000 V.", ["electric potential"]),
        ],
      },
      {
        id: "capacitors",
        title: "Capacitors",
        description: "Calculate charge, energy, and equivalent capacitance.",
        questions: [
          q("cap-1", "Class 12", "Intermediate", "A 10 microF capacitor is connected to 12 V. Find charge.", "Q = CV = 10 microF x 12 V = 120 microC.", ["capacitance", "charge"]),
          q("cap-2", "Class 12", "Difficult", "Find energy stored in 100 microF capacitor at 20 V.", "U = 1/2 CV^2 = 0.5 x 100e-6 x 20^2 = 0.02 J.", ["capacitor energy"]),
        ],
      },
    ],
  },
  {
    id: "magnetism",
    title: "Magnetism and Magnetic Effects",
    domain: "Magnetism",
    classRange: "Class 7-12",
    conceptTags: ["magnetic field", "electromagnet", "Lorentz force", "motor"],
    subcategories: [
      {
        id: "current-magnetism",
        title: "Magnetic Field of Current",
        description: "Use right-hand rules and current-field relations.",
        questions: [
          q("cm-1", "Class 7-10", "Intermediate", "How can you make an electromagnet stronger?", "Increase current, increase number of turns, or insert a soft iron core.", ["electromagnet"]),
          q("cm-2", "Class 12", "Difficult", "A long wire carries 5 A. Find B at 0.1 m. Use B = mu0 I/(2 pi r) and mu0/(2pi)=2e-7.", "B = 2e-7 x 5 / 0.1 = 1e-5 T.", ["wire field"]),
        ],
      },
      {
        id: "lorentz-force",
        title: "Lorentz Force and Motion",
        description: "Find force on moving charges and current-carrying wires.",
        questions: [
          q("lf-1", "Class 12", "Intermediate", "A charge 3 microC moves at 2 x 10^5 m/s perpendicular to 0.5 T field. Find force.", "F = qvB = 3e-6 x 2e5 x 0.5 = 0.3 N.", ["Lorentz force"]),
          q("lf-2", "Class 10-12", "Difficult", "When is magnetic force on a moving charge zero?", "F = qvB sin theta, so force is zero if charge is zero, speed is zero, field is zero, or velocity is parallel/antiparallel to field.", ["magnetic force", "angle"]),
        ],
      },
    ],
  },
  {
    id: "emi-ac",
    title: "EMI and Alternating Current",
    domain: "Electricity",
    classRange: "Class 12",
    conceptTags: ["Faraday law", "Lenz law", "AC", "transformer"],
    subcategories: [
      {
        id: "emi-transformer",
        title: "EMI, Generator, and Transformer",
        description: "Use changing flux and turns ratio.",
        questions: [
          q("et-1", "Class 12", "Intermediate", "A coil of 100 turns has flux change 0.02 Wb in 0.1 s. Find induced emf magnitude.", "|emf| = N DeltaPhi/Deltat = 100 x 0.02/0.1 = 20 V.", ["Faraday law"]),
          q("et-2", "Class 12", "Difficult", "A transformer has Np = 500, Ns = 2000, Vp = 120 V. Find Vs for ideal transformer.", "Vs/Vp = Ns/Np = 2000/500 = 4. Vs = 4 x 120 = 480 V.", ["transformer ratio"]),
        ],
      },
      {
        id: "ac-lcr",
        title: "AC and LCR Circuits",
        description: "Calculate reactance, impedance, and resonance trends.",
        questions: [
          q("ac-1", "Class 12", "Intermediate", "In an AC circuit, what happens to capacitive reactance when frequency increases?", "Xc = 1/(2 pi f C), so capacitive reactance decreases as frequency increases.", ["capacitive reactance"]),
          q("ac-2", "Class 12", "Difficult", "At series LCR resonance, what is impedance and power factor?", "At resonance XL = XC, so impedance is minimum and equals R. Power factor is 1.", ["resonance", "power factor"]),
        ],
      },
    ],
  },
  {
    id: "modern-physics",
    title: "Modern Physics",
    domain: "Modern Physics",
    classRange: "Class 12",
    conceptTags: ["photoelectric effect", "Bohr model", "nuclei", "de Broglie"],
    subcategories: [
      {
        id: "photoelectric-atom",
        title: "Photoelectric Effect and Atoms",
        description: "Use photon energy, work function, and atomic energy levels.",
        questions: [
          q("pa-1", "Class 12", "Intermediate", "Photon energy is 4 eV and work function is 2.5 eV. Find maximum kinetic energy.", "Kmax = hf - phi = 4 - 2.5 = 1.5 eV.", ["photoelectric equation"]),
          q("pa-2", "Class 12", "Difficult", "In Bohr model, find energy of n = 2 level of hydrogen.", "En = -13.6/n^2 eV = -13.6/4 = -3.4 eV.", ["Bohr model"]),
        ],
      },
      {
        id: "nuclei-matter-waves",
        title: "Nuclei and Matter Waves",
        description: "Use half-life and de Broglie relation.",
        questions: [
          q("nm-1", "Class 12", "Intermediate", "A sample has 800 nuclei and half-life 5 min. How many remain after 10 min?", "10 min is two half-lives. Remaining = 800 x (1/2)^2 = 200 nuclei.", ["half-life"]),
          q("nm-2", "Class 12", "Difficult", "If electron accelerating voltage increases, what happens to de Broglie wavelength?", "Electron wavelength is proportional to 1/sqrt(V), so it decreases as voltage increases.", ["de Broglie wavelength"]),
        ],
      },
    ],
  },
  {
    id: "electronics",
    title: "Semiconductors and Digital Electronics",
    domain: "Electronics",
    classRange: "Class 12",
    conceptTags: ["diode", "rectifier", "logic gates", "truth table"],
    subcategories: [
      {
        id: "diodes-rectifiers",
        title: "Diodes and Rectifiers",
        description: "Model forward bias, reverse bias, and rectification.",
        questions: [
          q("dr-1", "Class 12", "Intermediate", "A silicon diode has 0.7 V drop. With 5 V input and 1 kohm load, estimate current.", "Output across load is 5 - 0.7 = 4.3 V. Current = 4.3/1000 = 0.0043 A = 4.3 mA.", ["diode", "forward bias"]),
          q("dr-2", "Class 12", "Difficult", "What is the main output difference between half-wave and full-wave rectifiers?", "Half-wave uses one half-cycle and has lower average DC output. Full-wave uses both half-cycles, giving higher average output and lower ripple.", ["rectifier"]),
        ],
      },
      {
        id: "logic-gates",
        title: "Logic Gates",
        description: "Solve truth-table outputs for common gates.",
        questions: [
          q("lg-1", "Class 12", "Intermediate", "Find output of NAND gate for A = 1, B = 1.", "AND output is 1, so NAND output is 0.", ["NAND", "truth table"]),
          q("lg-2", "Class 12", "Difficult", "Which gate gives output 1 only when both inputs are 0?", "NOR gate. OR is 0 only for 0,0, and NOR inverts OR, so output is 1.", ["NOR", "logic gates"]),
        ],
      },
    ],
  },
  {
    id: "data-graphs-experiments",
    title: "Data, Graphs, and Practical Skills",
    domain: "Measurement",
    classRange: "Class 7-12",
    conceptTags: ["graphs", "slope", "observation", "practical"],
    subcategories: [
      {
        id: "graph-skills",
        title: "Graph Skills",
        description: "Read slope, area, intercept, and trend from graphs.",
        questions: [
          q("gs-1", "Class 9-10", "Intermediate", "In a V-I graph for a resistor, what does slope represent if V is on y-axis and I on x-axis?", "Slope = V/I = R, so it represents resistance.", ["V-I graph", "slope"]),
          q("gs-2", "Class 11-12", "Difficult", "Why does a straight-line graph through origin show direct proportionality?", "A straight line through origin has y = mx, so y/x is constant. This means y is directly proportional to x.", ["direct proportionality", "graph interpretation"]),
        ],
      },
      {
        id: "practical-reasoning",
        title: "Practical Reasoning",
        description: "Handle variables, errors, and conclusions in experiments.",
        questions: [
          q("pr-1", "Class 7-12", "Intermediate", "Why should only one variable be changed at a time in an experiment?", "Changing one variable isolates its effect, so the observed result can be linked to that variable.", ["controlled variables"]),
          q("pr-2", "Class 11-12", "Difficult", "A repeated reading set has one value far from all others. What should you do?", "Do not blindly delete it. Check for instrument/parallax/procedure error, repeat the reading, and report treatment clearly.", ["outlier", "experimental error"]),
        ],
      },
    ],
  },
];

interface SolverExpansionTopic {
  subcategoryId: string;
  prefix: string;
  classRange: string;
  tags: string[];
  basic: { prompt: string; answer: string };
  intermediate: { prompt: string; answer: string };
  difficult: { prompt: string; answer: string };
  challenge: { prompt: string; answer: string };
}

const solverExpansionTopics: SolverExpansionTopic[] = [
  {
    subcategoryId: "unit-conversion",
    prefix: "new-unit",
    classRange: "Class 7-9",
    tags: ["unit conversion", "speed", "SI units"],
    basic: { prompt: "Convert 2.5 km into metres.", answer: "1 km = 1000 m, so 2.5 km = 2.5 x 1000 = 2500 m." },
    intermediate: { prompt: "A bus moves at 54 km/h. Convert this speed to m/s.", answer: "54 km/h = 54 x 5/18 = 15 m/s." },
    difficult: { prompt: "A runner covers 1.2 km in 4 min. Find speed in m/s.", answer: "Distance = 1200 m and time = 4 x 60 = 240 s. Speed = 1200/240 = 5 m/s." },
    challenge: { prompt: "Why is converting units before substitution safer than converting only the final answer?", answer: "Most physics formulae assume consistent units. Converting before substitution prevents hidden mistakes such as mixing km with s or cm with m." },
  },
  {
    subcategoryId: "errors-dimensions",
    prefix: "new-error",
    classRange: "Class 11",
    tags: ["errors", "dimensions", "least count"],
    basic: { prompt: "What is the absolute error if a reading is 5.20 cm with instrument uncertainty 0.01 cm?", answer: "The reading is reported as 5.20 +/- 0.01 cm, so absolute error is 0.01 cm." },
    intermediate: { prompt: "A measured value is 25.0 g and absolute error is 0.5 g. Find percentage error.", answer: "Percentage error = (0.5/25.0) x 100 = 2%." },
    difficult: { prompt: "Check dimensions of T = 2 pi sqrt(L/g).", answer: "L/g has dimension L/(LT^-2) = T^2. Its square root has dimension T, so the formula is dimensionally consistent." },
    challenge: { prompt: "Why can dimensional analysis not prove a formula completely correct?", answer: "It only checks dimensional consistency. It cannot confirm numerical constants, signs, or whether the physical model is valid." },
  },
  {
    subcategoryId: "uniform-motion",
    prefix: "new-motion",
    classRange: "Class 7-11",
    tags: ["speed", "average velocity", "acceleration"],
    basic: { prompt: "A toy car covers 36 m in 9 s. Find average speed.", answer: "Average speed = distance/time = 36/9 = 4 m/s." },
    intermediate: { prompt: "A body moves 20 m east and then 20 m west in 10 s. Find average speed and average velocity.", answer: "Total distance = 40 m, so average speed = 4 m/s. Displacement = 0, so average velocity = 0 m/s." },
    difficult: { prompt: "A train speeds up from 10 m/s to 25 m/s in 5 s. Find acceleration.", answer: "Acceleration = (v - u)/t = (25 - 10)/5 = 3 m/s^2." },
    challenge: { prompt: "Why can average speed be non-zero while average velocity is zero?", answer: "Speed uses total distance, while velocity uses displacement. A round trip can cover distance but end at the starting point." },
  },
  {
    subcategoryId: "motion-graphs",
    prefix: "new-graph",
    classRange: "Class 9-11",
    tags: ["motion graphs", "slope", "area"],
    basic: { prompt: "What does slope of a distance-time graph represent?", answer: "Slope of a distance-time graph represents speed." },
    intermediate: { prompt: "A distance-time graph rises from 0 m to 50 m in 10 s. Find speed.", answer: "Speed = slope = change in distance/change in time = 50/10 = 5 m/s." },
    difficult: { prompt: "A velocity-time graph forms a triangle with base 8 s and height 12 m/s. Find displacement.", answer: "Displacement = area under graph = 1/2 x 8 x 12 = 48 m." },
    challenge: { prompt: "How can you tell from a v-t graph that acceleration is negative?", answer: "The line slopes downward as time increases, meaning velocity is decreasing with time." },
  },
  {
    subcategoryId: "newton-laws",
    prefix: "new-newton",
    classRange: "Class 9-11",
    tags: ["Newton laws", "net force", "acceleration"],
    basic: { prompt: "State Newton's first law in simple words.", answer: "An object remains at rest or in uniform straight-line motion unless acted on by a net external force." },
    intermediate: { prompt: "A 5 kg object accelerates at 3 m/s^2. Find net force.", answer: "F = ma = 5 x 3 = 15 N." },
    difficult: { prompt: "A 12 kg box is pulled by 80 N and friction is 20 N. Find acceleration.", answer: "Net force = 80 - 20 = 60 N. Acceleration = 60/12 = 5 m/s^2." },
    challenge: { prompt: "Why does a passenger move forward when a bus stops suddenly?", answer: "Due to inertia, the passenger's body tends to continue its forward motion even when the bus slows down." },
  },
  {
    subcategoryId: "momentum-impulse",
    prefix: "new-momentum",
    classRange: "Class 9-11",
    tags: ["momentum", "impulse", "collision"],
    basic: { prompt: "Find momentum of a 3 kg object moving at 4 m/s.", answer: "Momentum = mv = 3 x 4 = 12 kg m/s." },
    intermediate: { prompt: "A 0.2 kg ball at rest is hit to 15 m/s. Find impulse.", answer: "Impulse = change in momentum = 0.2 x 15 - 0 = 3 N s." },
    difficult: { prompt: "A 2 kg body moving at 6 m/s collides and stops. If stopping time is 0.2 s, find average force magnitude.", answer: "Change in momentum = 12 kg m/s. Average force = impulse/time = 12/0.2 = 60 N." },
    challenge: { prompt: "Why do airbags reduce injury during collisions?", answer: "They increase the stopping time, so the same change in momentum occurs with smaller average force." },
  },
  {
    subcategoryId: "work-power",
    prefix: "new-work",
    classRange: "Class 9-11",
    tags: ["work", "power", "energy transfer"],
    basic: { prompt: "When is work done by a force zero?", answer: "Work is zero when displacement is zero or when force is perpendicular to displacement." },
    intermediate: { prompt: "A 25 N force moves a box 6 m. Find work done.", answer: "Work = Fs = 25 x 6 = 150 J." },
    difficult: { prompt: "A pump lifts 200 kg of water through 5 m in 20 s. Find power. Take g = 10 m/s^2.", answer: "Work = mgh = 200 x 10 x 5 = 10000 J. Power = 10000/20 = 500 W." },
    challenge: { prompt: "Two students do the same work, but one finishes faster. Which has greater power?", answer: "The faster student has greater power because power = work/time." },
  },
  {
    subcategoryId: "energy-conservation",
    prefix: "new-energy",
    classRange: "Class 9-11",
    tags: ["kinetic energy", "potential energy", "conservation"],
    basic: { prompt: "Write the formula for kinetic energy.", answer: "Kinetic energy = 1/2 mv^2." },
    intermediate: { prompt: "Find kinetic energy of a 4 kg object moving at 5 m/s.", answer: "KE = 1/2 x 4 x 5^2 = 2 x 25 = 50 J." },
    difficult: { prompt: "A 1 kg ball is dropped from 20 m. Find impact speed ignoring air resistance. Take g = 10 m/s^2.", answer: "mgh = 1/2 mv^2, so v = sqrt(2gh) = sqrt(2 x 10 x 20) = 20 m/s." },
    challenge: { prompt: "Why is mechanical energy not conserved when friction acts?", answer: "Friction converts mechanical energy into heat and sound, so mechanical energy decreases though total energy is conserved." },
  },
  {
    subcategoryId: "gravity-weight",
    prefix: "new-gravity",
    classRange: "Class 9-11",
    tags: ["mass", "weight", "gravity"],
    basic: { prompt: "Is mass or weight measured in newtons?", answer: "Weight is measured in newtons. Mass is measured in kilograms." },
    intermediate: { prompt: "A 20 kg object is on a planet where g = 4 m/s^2. Find weight.", answer: "Weight = mg = 20 x 4 = 80 N." },
    difficult: { prompt: "If g on the Moon is about one-sixth of Earth, what happens to a person's mass and weight on the Moon?", answer: "Mass stays the same because amount of matter does not change. Weight becomes one-sixth because W = mg." },
    challenge: { prompt: "Why do astronauts feel weightless in orbit though gravity still acts?", answer: "They are in continuous free fall around Earth, so there is no normal reaction pushing on them." },
  },
  {
    subcategoryId: "pressure-buoyancy",
    prefix: "new-fluid",
    classRange: "Class 8-11",
    tags: ["pressure", "buoyancy", "density"],
    basic: { prompt: "Why does a sharp knife cut more easily than a blunt one?", answer: "The same force acts over a smaller area, producing greater pressure." },
    intermediate: { prompt: "Find pressure when 300 N acts on 2 m^2.", answer: "Pressure = F/A = 300/2 = 150 Pa." },
    difficult: { prompt: "A 0.004 m^3 object is fully submerged in water. Find buoyant force. Use rho = 1000 kg/m^3, g = 10 m/s^2.", answer: "Buoyant force = rho g V = 1000 x 10 x 0.004 = 40 N." },
    challenge: { prompt: "Why does an iron ship float even though iron is denser than water?", answer: "The ship's hollow shape makes its average density less than water and lets it displace enough water for buoyant force to balance weight." },
  },
  {
    subcategoryId: "temperature-heat",
    prefix: "new-heat",
    classRange: "Class 7-11",
    tags: ["heat", "temperature", "specific heat"],
    basic: { prompt: "What is the difference between heat and temperature?", answer: "Heat is energy transferred due to temperature difference. Temperature measures hotness or average thermal state." },
    intermediate: { prompt: "Convert 100 C to kelvin.", answer: "K = C + 273.15 = 100 + 273.15 = 373.15 K." },
    difficult: { prompt: "How much heat raises 0.5 kg water by 20 C? Use c = 4200 J/kg C.", answer: "Q = mc DeltaT = 0.5 x 4200 x 20 = 42000 J." },
    challenge: { prompt: "Why does water heat more slowly than many metals for the same heat input?", answer: "Water has a high specific heat capacity, so more energy is needed for the same temperature rise." },
  },
  {
    subcategoryId: "gas-thermo",
    prefix: "new-gas",
    classRange: "Class 11",
    tags: ["gas laws", "pressure", "thermodynamics"],
    basic: { prompt: "At constant temperature, what happens to gas pressure if volume decreases?", answer: "Pressure increases because Boyle's law gives P inversely proportional to V." },
    intermediate: { prompt: "A gas has pressure 100 kPa and volume 2 L. If volume becomes 1 L at constant temperature, find pressure.", answer: "P1V1 = P2V2, so P2 = 100 x 2 / 1 = 200 kPa." },
    difficult: { prompt: "A gas does 450 J work while receiving 1000 J heat. Find change in internal energy.", answer: "First law: DeltaU = Q - W = 1000 - 450 = 550 J." },
    challenge: { prompt: "Why must gas law temperatures be in kelvin?", answer: "Gas laws use absolute temperature. Celsius has an arbitrary zero, so ratios like doubling temperature only make physical sense in kelvin." },
  },
  {
    subcategoryId: "shm",
    prefix: "new-shm",
    classRange: "Class 11",
    tags: ["SHM", "period", "oscillation"],
    basic: { prompt: "What is one complete oscillation?", answer: "One complete oscillation is motion from a starting state back to the same position and direction of motion." },
    intermediate: { prompt: "A pendulum completes 20 oscillations in 40 s. Find its period.", answer: "Period = total time/number of oscillations = 40/20 = 2 s." },
    difficult: { prompt: "If pendulum length is made four times, what happens to period?", answer: "T is proportional to sqrt(L). If L becomes 4L, period becomes 2T." },
    challenge: { prompt: "Why is the simple pendulum formula valid only for small angles?", answer: "For small angles, sin theta is approximately theta, making the restoring torque proportional to displacement and the motion nearly SHM." },
  },
  {
    subcategoryId: "wave-relations",
    prefix: "new-wave",
    classRange: "Class 8-12",
    tags: ["waves", "frequency", "wavelength"],
    basic: { prompt: "Write the relation between wave speed, frequency, and wavelength.", answer: "v = f lambda." },
    intermediate: { prompt: "A wave has wavelength 0.5 m and frequency 20 Hz. Find speed.", answer: "v = f lambda = 20 x 0.5 = 10 m/s." },
    difficult: { prompt: "If wave speed is fixed and frequency doubles, what happens to wavelength?", answer: "From v = f lambda, wavelength becomes half when frequency doubles." },
    challenge: { prompt: "Why do wavefronts get closer together when frequency increases in the same medium?", answer: "Wave speed remains roughly fixed in the medium, so higher frequency requires shorter wavelength." },
  },
  {
    subcategoryId: "pitch-loudness",
    prefix: "new-sound-pitch",
    classRange: "Class 8-9",
    tags: ["sound", "pitch", "amplitude"],
    basic: { prompt: "Which sound has higher pitch: 200 Hz or 500 Hz?", answer: "500 Hz has higher pitch because pitch increases with frequency." },
    intermediate: { prompt: "What sound property mainly changes when amplitude increases?", answer: "Loudness increases. In a simple model, intensity increases with amplitude squared." },
    difficult: { prompt: "If amplitude triples, how does intensity change in the simple square-law model?", answer: "Intensity becomes 3^2 = 9 times." },
    challenge: { prompt: "Why should pitch and loudness not be treated as the same quantity?", answer: "Pitch depends mainly on frequency, while loudness depends mainly on amplitude/intensity." },
  },
  {
    subcategoryId: "echo-ultrasound",
    prefix: "new-echo",
    classRange: "Class 9",
    tags: ["echo", "ultrasound", "sound speed"],
    basic: { prompt: "Why is echo distance calculated with division by 2?", answer: "The measured time is for sound to travel to the reflector and back, so one-way distance is half the total sound path." },
    intermediate: { prompt: "An echo returns after 1.5 s. If speed of sound is 340 m/s, find reflector distance.", answer: "Distance = vt/2 = 340 x 1.5 / 2 = 255 m." },
    difficult: { prompt: "A sonar pulse returns in 0.8 s in water where sound speed is 1500 m/s. Find depth.", answer: "Depth = vt/2 = 1500 x 0.8 / 2 = 600 m." },
    challenge: { prompt: "Why can bats use ultrasound for navigation?", answer: "Ultrasound has short wavelength and reflects from small objects, helping bats detect position and distance." },
  },
  {
    subcategoryId: "mirrors-lenses",
    prefix: "new-lens",
    classRange: "Class 10-12",
    tags: ["mirror formula", "lens formula", "ray optics"],
    basic: { prompt: "What type of lens is commonly used as a magnifying glass?", answer: "A convex lens is used as a magnifying glass when the object is within its focal length." },
    intermediate: { prompt: "A convex lens has focal length 10 cm. Find power in dioptres.", answer: "f = 10 cm = 0.10 m. Power P = 1/f = 10 D." },
    difficult: { prompt: "A concave mirror has f = -20 cm and u = -40 cm. Find v.", answer: "1/v = 1/f - 1/u = -1/20 + 1/40 = -1/40, so v = -40 cm." },
    challenge: { prompt: "Why are sign conventions important in mirror and lens problems?", answer: "They encode direction and image type. Ignoring signs can give a numerically plausible but physically wrong image position." },
  },
  {
    subcategoryId: "refraction-tir",
    prefix: "new-refraction",
    classRange: "Class 10-12",
    tags: ["refraction", "Snell law", "TIR"],
    basic: { prompt: "What happens to a light ray when it enters a denser medium from air?", answer: "It bends towards the normal because its speed decreases." },
    intermediate: { prompt: "Speed of light in a medium is 1.5 x 10^8 m/s. Find refractive index.", answer: "n = c/v = 3 x 10^8 / 1.5 x 10^8 = 2." },
    difficult: { prompt: "Find critical angle for n1 = 2 and n2 = 1.", answer: "sin C = n2/n1 = 1/2. Therefore C = 30 degrees." },
    challenge: { prompt: "State the two conditions needed for total internal reflection.", answer: "Light must travel from denser to rarer medium, and incidence angle must be greater than critical angle." },
  },
  {
    subcategoryId: "prism-dispersion",
    prefix: "new-prism",
    classRange: "Class 8-12",
    tags: ["prism", "dispersion", "deviation", "VIBGYOR"],
    basic: { prompt: "Name the seven colours seen after white light disperses through a prism.", answer: "The colours are violet, indigo, blue, green, yellow, orange, and red." },
    intermediate: { prompt: "Why is dispersion not the same as deviation?", answer: "Deviation is the bending of a ray from its original direction; dispersion is the separation of colours because different wavelengths deviate differently." },
    difficult: { prompt: "For A = 50 degrees and n = 1.6, estimate thin-prism deviation.", answer: "delta approximately (n - 1)A = (1.6 - 1) x 50 = 30 degrees." },
    challenge: { prompt: "Why does a prism path become symmetric at minimum deviation?", answer: "At minimum deviation, incidence equals emergence and the two internal refraction angles are equal, giving the least total turning through the prism." },
  },
  {
    subcategoryId: "ohms-law-circuits",
    prefix: "new-ohm",
    classRange: "Class 10-12",
    tags: ["Ohm law", "resistance", "circuits"],
    basic: { prompt: "What is current through a 5 ohm resistor connected to 10 V?", answer: "I = V/R = 10/5 = 2 A." },
    intermediate: { prompt: "Two resistors 3 ohm and 6 ohm are in parallel. Find equivalent resistance.", answer: "1/R = 1/3 + 1/6 = 1/2, so R = 2 ohm." },
    difficult: { prompt: "A 12 V battery has internal resistance 1 ohm and external resistance 5 ohm. Find current.", answer: "Total resistance = 5 + 1 = 6 ohm. Current = 12/6 = 2 A." },
    challenge: { prompt: "Why are household appliances connected in parallel?", answer: "Each appliance gets full supply voltage and can be switched independently." },
  },
  {
    subcategoryId: "power-heating",
    prefix: "new-power",
    classRange: "Class 10",
    tags: ["electric power", "heating", "kWh"],
    basic: { prompt: "Write two formulae for electric power.", answer: "P = VI, P = I^2R, and P = V^2/R are common forms depending on given quantities." },
    intermediate: { prompt: "A bulb rated 60 W runs for 5 h. Find energy used in kWh.", answer: "Energy = 0.060 kW x 5 h = 0.30 kWh." },
    difficult: { prompt: "A 4 A current flows through 10 ohm for 3 min. Find heat produced.", answer: "H = I^2Rt = 4^2 x 10 x 180 = 28800 J." },
    challenge: { prompt: "Why does fuse wire heat strongly when current becomes too large?", answer: "Heating varies as I^2R, so a large current produces much larger heat and melts the fuse." },
  },
  {
    subcategoryId: "charge-field",
    prefix: "new-charge",
    classRange: "Class 8-12",
    tags: ["Coulomb law", "electric field", "potential"],
    basic: { prompt: "Do like charges attract or repel?", answer: "Like charges repel and unlike charges attract." },
    intermediate: { prompt: "Find force between 1 microC and 2 microC charges separated by 1 m. Use k = 9 x 10^9.", answer: "F = kq1q2/r^2 = 9e9 x 1e-6 x 2e-6 = 0.018 N." },
    difficult: { prompt: "Find electric field 0.3 m from a 3 microC charge. Use k = 9 x 10^9.", answer: "E = kq/r^2 = 9e9 x 3e-6 / 0.09 = 3.0 x 10^5 N/C." },
    challenge: { prompt: "Why is electric field defined using a small positive test charge?", answer: "A small test charge reduces disturbance of the source field, and positive charge fixes the direction convention." },
  },
  {
    subcategoryId: "capacitors",
    prefix: "new-cap",
    classRange: "Class 12",
    tags: ["capacitance", "charge", "energy"],
    basic: { prompt: "What does a capacitor store?", answer: "A capacitor stores electric charge and energy in the electric field between its plates." },
    intermediate: { prompt: "A 5 microF capacitor is charged to 20 V. Find charge.", answer: "Q = CV = 5 microF x 20 V = 100 microC." },
    difficult: { prompt: "Two capacitors 4 microF and 6 microF are in parallel. Find equivalent capacitance.", answer: "Parallel capacitances add, so C_eq = 4 + 6 = 10 microF." },
    challenge: { prompt: "Why does inserting a dielectric increase capacitance?", answer: "The dielectric reduces effective electric field for the same charge, allowing more charge to be stored at the same voltage." },
  },
  {
    subcategoryId: "current-magnetism",
    prefix: "new-mag-current",
    classRange: "Class 7-12",
    tags: ["magnetic field", "electromagnet", "right hand rule"],
    basic: { prompt: "What surrounds a current-carrying wire?", answer: "A magnetic field surrounds a current-carrying wire." },
    intermediate: { prompt: "How does magnetic field near a long straight wire change if current doubles?", answer: "B is proportional to I, so magnetic field doubles." },
    difficult: { prompt: "A wire carries 10 A. Find B at 0.2 m using B = 2e-7 I/r.", answer: "B = 2e-7 x 10 / 0.2 = 1e-5 T." },
    challenge: { prompt: "How can the polarity of an electromagnet be reversed?", answer: "Reverse the direction of current through the coil." },
  },
  {
    subcategoryId: "lorentz-force",
    prefix: "new-lorentz",
    classRange: "Class 10-12",
    tags: ["Lorentz force", "magnetic force", "motion"],
    basic: { prompt: "When is magnetic force on a moving charge maximum?", answer: "It is maximum when velocity is perpendicular to the magnetic field, because sin 90 degrees = 1." },
    intermediate: { prompt: "A 2 microC charge moves at 1 x 10^5 m/s perpendicular to 0.4 T. Find force.", answer: "F = qvB = 2e-6 x 1e5 x 0.4 = 0.08 N." },
    difficult: { prompt: "A 0.5 m wire carries 3 A perpendicular to 0.2 T. Find magnetic force.", answer: "F = BIL = 0.2 x 3 x 0.5 = 0.3 N." },
    challenge: { prompt: "Why does magnetic force do no work on a freely moving charged particle?", answer: "Magnetic force is perpendicular to velocity, so it changes direction of motion but not speed or kinetic energy." },
  },
  {
    subcategoryId: "emi-transformer",
    prefix: "new-emi",
    classRange: "Class 12",
    tags: ["EMI", "transformer", "Faraday law"],
    basic: { prompt: "What condition is necessary for electromagnetic induction?", answer: "There must be a change in magnetic flux linked with a circuit or coil." },
    intermediate: { prompt: "A 50-turn coil has flux change 0.01 Wb in 0.05 s. Find induced emf magnitude.", answer: "emf = N DeltaPhi/Deltat = 50 x 0.01 / 0.05 = 10 V." },
    difficult: { prompt: "An ideal transformer has Vp = 240 V, Np = 1000, Ns = 250. Find Vs.", answer: "Vs/Vp = Ns/Np = 250/1000 = 0.25. Vs = 0.25 x 240 = 60 V." },
    challenge: { prompt: "State Lenz's law in terms of energy conservation.", answer: "The induced current opposes the flux change that produces it; otherwise energy could be created without work." },
  },
];

const minimumQuestionsPerSubcategory = 10;

function supplementSolverBank() {
  for (const category of solverCategories) {
    for (const subcategory of category.subcategories) {
      const needed = minimumQuestionsPerSubcategory - subcategory.questions.length;
      if (needed <= 0) continue;
      subcategory.questions.push(...buildSupplementalQuestions(category, subcategory).slice(0, needed));
    }
  }
}

function addSolverExpansionQuestions() {
  const subcategories = new Map<string, SolverSubcategory>();
  for (const category of solverCategories) {
    for (const subcategory of category.subcategories) {
      subcategories.set(subcategory.id, subcategory);
    }
  }

  for (const topic of solverExpansionTopics) {
    const subcategory = subcategories.get(topic.subcategoryId);
    if (!subcategory) continue;
    subcategory.questions.push(
      q(`${topic.prefix}-basic`, topic.classRange, "Basic", topic.basic.prompt, topic.basic.answer, topic.tags),
      q(`${topic.prefix}-intermediate`, topic.classRange, "Intermediate", topic.intermediate.prompt, topic.intermediate.answer, topic.tags),
      q(`${topic.prefix}-difficult`, topic.classRange, "Difficult", topic.difficult.prompt, topic.difficult.answer, topic.tags),
      q(`${topic.prefix}-challenge`, topic.classRange, "Difficult", topic.challenge.prompt, topic.challenge.answer, [...topic.tags, "reasoning"])
    );
  }
}

function buildSupplementalQuestions(category: SolverCategory, subcategory: SolverSubcategory): SolverQuestion[] {
  const tags = uniqueTags([...category.conceptTags, ...subcategory.questions.flatMap((question) => question.conceptTags)]).slice(0, 5);
  const primaryTag = tags[0] ?? category.domain;
  const secondaryTag = tags[1] ?? subcategory.title;
  const baseId = subcategory.id;
  const classRange = category.classRange;

  return [
    q(
      `${baseId}-core-idea`,
      classRange,
      "Basic",
      `In ${subcategory.title}, what is the main physics idea a student must identify before substituting numbers?`,
      `The main idea is: ${subcategory.description} Start by naming the physical model, then list the known values, unknown value, formula, and SI units before calculation.`,
      [primaryTag, "concept check"]
    ),
    q(
      `${baseId}-known-unknown`,
      classRange,
      "Basic",
      `For a ${subcategory.title} problem, write the first two lines of a neat solution.`,
      `Line 1 should list the given data with units. Line 2 should state the required unknown. This prevents mixing ${primaryTag} and ${secondaryTag} values or using the wrong relation.`,
      [primaryTag, "problem setup"]
    ),
    q(
      `${baseId}-unit-check`,
      classRange,
      "Basic",
      `What unit-check habit should be used before solving a ${subcategory.title} numerical?`,
      `Convert all quantities to one consistent unit system, usually SI. Then check that the final unit matches the unknown, for example newton for force, joule for energy, metre for distance, or second for time.`,
      [primaryTag, "units"]
    ),
    q(
      `${baseId}-formula-choice`,
      classRange,
      "Intermediate",
      `A question includes ${primaryTag} and asks about ${secondaryTag}. How should you choose the formula?`,
      `Choose the relation that directly links the given quantities to the unknown. If two formulas seem possible, pick the one with the fewest extra unknowns, then verify the answer using units and physical reasonableness.`,
      [primaryTag, secondaryTag, "formula selection"]
    ),
    q(
      `${baseId}-controlled-variable`,
      classRange,
      "Intermediate",
      `In an interactive ${subcategory.title} lab, why should only one slider be changed at a time?`,
      `Changing one variable at a time isolates cause and effect. If several variables change together, the new result cannot be confidently linked to ${primaryTag}, ${secondaryTag}, or any single physical factor.`,
      [primaryTag, "controlled variables"]
    ),
    q(
      `${baseId}-graph-pattern`,
      classRange,
      "Intermediate",
      `What graph or table pattern would show a clean relationship in ${subcategory.title}?`,
      `A clean pattern has one independent variable column, one measured/result column, and fixed remaining conditions. A straight line suggests direct proportionality; a curve may suggest square, inverse, or inverse-square behavior.`,
      [primaryTag, "graph interpretation"]
    ),
    q(
      `${baseId}-mistake-check`,
      classRange,
      "Intermediate",
      `A learner gets an answer that is negative when the quantity should be a magnitude in ${subcategory.title}. What should be checked?`,
      `Check sign convention, direction, unit conversion, and whether the answer is a vector component or a magnitude. Negative signs can be meaningful for direction, but magnitudes should be reported as positive values.`,
      [primaryTag, "sign convention"]
    ),
    q(
      `${baseId}-hard-reasoning`,
      classRange,
      "Difficult",
      `Explain how to judge whether a final answer in ${subcategory.title} is physically reasonable.`,
      `Compare it with limiting cases. If the main cause increases, the effect should usually follow the expected trend. Also check units, order of magnitude, sign, and whether the result violates the model assumptions.`,
      [primaryTag, "reasonableness"]
    ),
    q(
      `${baseId}-experiment-design`,
      classRange,
      "Difficult",
      `Design a short experiment or simulation trial to test ${subcategory.title}.`,
      `Keep all conditions fixed except one independent variable related to ${primaryTag}. Record at least three readings, calculate the result each time, plot or compare the trend, and write a conclusion using the observed pattern.`,
      [primaryTag, "experimental design"]
    ),
    q(
      `${baseId}-explain-to-junior`,
      classRange,
      "Difficult",
      `Explain ${subcategory.title} to a junior student in three steps without skipping the physics.`,
      `Step 1: name the physical situation. Step 2: connect the important quantities such as ${primaryTag} and ${secondaryTag}. Step 3: show the formula or rule, substitute carefully, and interpret the answer in words.`,
      [primaryTag, secondaryTag, "explanation"]
    ),
  ];
}

function uniqueTags(tags: string[]) {
  return Array.from(new Set(tags.filter(Boolean)));
}

supplementSolverBank();
addSolverExpansionQuestions();

const questionCounts = solverCategories.flatMap((category) => category.subcategories.map((subcategory) => subcategory.questions.length));

export const solverStats = {
  categories: solverCategories.length,
  subcategories: solverCategories.reduce((sum, category) => sum + category.subcategories.length, 0),
  questions: solverCategories.reduce((sum, category) => sum + category.subcategories.reduce((inner, subcategory) => inner + subcategory.questions.length, 0), 0),
  addedExpansionQuestions: solverExpansionTopics.length * 4,
  minQuestionsPerSubcategory: Math.min(...questionCounts),
  targetQuestionsPerSubcategory: minimumQuestionsPerSubcategory,
};

export function allSolverQuestions() {
  return solverCategories.flatMap((category) =>
    category.subcategories.flatMap((subcategory) =>
      subcategory.questions.map((question) => ({ ...question, category, subcategory }))
    )
  );
}
