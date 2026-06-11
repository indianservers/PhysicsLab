import { PhysicsIconName } from "./icons";

export type FormulaAccent = "science" | "quantum" | "warning";

export interface PhysicsFormulaEntry {
  id: string;
  name: string;
  expression: string;
  variables: string[];
  tags: string[];
}

export interface PhysicsFormulaCategory {
  id: string;
  title: string;
  domain: string;
  classRange: string;
  icon: PhysicsIconName;
  accent: FormulaAccent;
  formulas: PhysicsFormulaEntry[];
}

type FormulaSeed = [id: string, name: string, expression: string, variables: string[], tags: string[]];

function makeFormula(seed: FormulaSeed): PhysicsFormulaEntry {
  const [id, name, expression, variables, tags] = seed;
  return { id, name, expression, variables, tags };
}

function makeCategory(category: Omit<PhysicsFormulaCategory, "formulas">, formulas: FormulaSeed[]): PhysicsFormulaCategory {
  return { ...category, formulas: formulas.map(makeFormula) };
}

export const formulaCategories: PhysicsFormulaCategory[] = [
  makeCategory(
    { id: "measurements-units", title: "Measurements & Units", domain: "Measurement", classRange: "Class 7-11", icon: "ruler", accent: "science" },
    [
      ["least-count", "Least count", "LC = \\frac{\\text{value of 1 main scale division}}{\\text{number of vernier divisions}}", ["LC", "MSD", "VSD"], ["measurement", "vernier"]],
      ["percentage-error", "Percentage error", "\\%\\,error = \\frac{|\\Delta x|}{x}\\times 100", ["Delta x", "x"], ["error", "accuracy"]],
      ["relative-density", "Relative density", "RD = \\frac{\\rho_{object}}{\\rho_{water}}", ["RD", "rho"], ["density", "unitless"]],
      ["dimensional-formula-force", "Force dimensions", "[F] = MLT^{-2}", ["M", "L", "T"], ["dimensions", "force"]],
      ["significant-figures", "Fractional uncertainty", "\\frac{\\Delta z}{z}=\\frac{\\Delta x}{x}+\\frac{\\Delta y}{y}", ["Delta z", "z"], ["uncertainty", "product"]],
      ["scientific-notation", "Scientific notation", "N = a \\times 10^n", ["a", "n"], ["powers", "standard form"]],
    ]
  ),
  makeCategory(
    { id: "kinematics", title: "Kinematics", domain: "Mechanics", classRange: "Class 9-11", icon: "rocket", accent: "science" },
    [
      ["average-speed", "Average speed", "v_{avg}=\\frac{d}{t}", ["v_avg", "d", "t"], ["speed", "distance"]],
      ["average-velocity", "Average velocity", "\\vec v_{avg}=\\frac{\\Delta \\vec x}{\\Delta t}", ["v", "Delta x", "Delta t"], ["velocity", "displacement"]],
      ["first-equation-motion", "First equation of motion", "v=u+at", ["v", "u", "a", "t"], ["constant acceleration"]],
      ["second-equation-motion", "Second equation of motion", "s=ut+\\frac{1}{2}at^2", ["s", "u", "a", "t"], ["displacement"]],
      ["third-equation-motion", "Third equation of motion", "v^2=u^2+2as", ["v", "u", "a", "s"], ["motion"]],
      ["projectile-range-basic", "Projectile range", "R=\\frac{u^2\\sin 2\\theta}{g}", ["R", "u", "theta", "g"], ["projectile"]],
    ]
  ),
  makeCategory(
    { id: "dynamics", title: "Dynamics", domain: "Mechanics", classRange: "Class 9-11", icon: "gauge", accent: "science" },
    [
      ["newton-second-law", "Newton's second law", "F=ma", ["F", "m", "a"], ["force", "mass"]],
      ["weight", "Weight", "W=mg", ["W", "m", "g"], ["gravity"]],
      ["friction-limiting", "Limiting friction", "f_{max}=\\mu_s N", ["f", "mu_s", "N"], ["friction"]],
      ["kinetic-friction", "Kinetic friction", "f_k=\\mu_k N", ["f_k", "mu_k", "N"], ["friction"]],
      ["centripetal-force", "Centripetal force", "F_c=\\frac{mv^2}{r}", ["F_c", "m", "v", "r"], ["circular motion"]],
      ["impulse", "Impulse", "J=F\\Delta t=\\Delta p", ["J", "F", "Delta t", "Delta p"], ["momentum"]],
    ]
  ),
  makeCategory(
    { id: "work-energy-power", title: "Work, Energy & Power", domain: "Energy", classRange: "Class 9-12", icon: "flame", accent: "warning" },
    [
      ["work-done", "Work done", "W=Fs\\cos\\theta", ["W", "F", "s", "theta"], ["work"]],
      ["kinetic-energy", "Kinetic energy", "K=\\frac{1}{2}mv^2", ["K", "m", "v"], ["energy"]],
      ["potential-energy", "Gravitational potential energy", "U=mgh", ["U", "m", "g", "h"], ["energy", "gravity"]],
      ["power", "Power", "P=\\frac{W}{t}", ["P", "W", "t"], ["power"]],
      ["work-energy-theorem", "Work-energy theorem", "W_{net}=\\Delta K", ["W_net", "Delta K"], ["energy theorem"]],
      ["efficiency", "Efficiency", "\\eta=\\frac{P_{out}}{P_{in}}\\times 100", ["eta", "P_out", "P_in"], ["efficiency"]],
    ]
  ),
  makeCategory(
    { id: "momentum-collisions", title: "Momentum & Collisions", domain: "Mechanics", classRange: "Class 9-12", icon: "gauge", accent: "science" },
    [
      ["linear-momentum", "Linear momentum", "p=mv", ["p", "m", "v"], ["momentum"]],
      ["conservation-momentum", "Momentum conservation", "m_1u_1+m_2u_2=m_1v_1+m_2v_2", ["m", "u", "v"], ["collision"]],
      ["coefficient-restitution", "Coefficient of restitution", "e=\\frac{v_2-v_1}{u_1-u_2}", ["e", "u", "v"], ["collision"]],
      ["perfectly-inelastic", "Perfectly inelastic final speed", "v=\\frac{m_1u_1+m_2u_2}{m_1+m_2}", ["v", "m", "u"], ["inelastic"]],
      ["elastic-ke-conservation", "Elastic kinetic energy", "\\frac{1}{2}m_1u_1^2+\\frac{1}{2}m_2u_2^2=\\frac{1}{2}m_1v_1^2+\\frac{1}{2}m_2v_2^2", ["m", "u", "v"], ["elastic"]],
      ["impulse-momentum", "Impulse-momentum theorem", "F_{avg}\\Delta t=m(v-u)", ["F_avg", "Delta t", "m", "v", "u"], ["impulse"]],
    ]
  ),
  makeCategory(
    { id: "rotational-motion", title: "Rotational Motion", domain: "Mechanics", classRange: "Class 11-12", icon: "orbit", accent: "science" },
    [
      ["angular-velocity", "Angular velocity", "\\omega=\\frac{\\Delta \\theta}{\\Delta t}", ["omega", "theta", "t"], ["rotation"]],
      ["angular-acceleration", "Angular acceleration", "\\alpha=\\frac{\\Delta \\omega}{\\Delta t}", ["alpha", "omega", "t"], ["rotation"]],
      ["torque", "Torque", "\\tau=rF\\sin\\theta", ["tau", "r", "F", "theta"], ["torque"]],
      ["moment-inertia-ring", "Moment of inertia - ring", "I=MR^2", ["I", "M", "R"], ["inertia"]],
      ["rotational-ke", "Rotational kinetic energy", "K=\\frac{1}{2}I\\omega^2", ["K", "I", "omega"], ["energy"]],
      ["angular-momentum", "Angular momentum", "L=I\\omega", ["L", "I", "omega"], ["momentum"]],
    ]
  ),
  makeCategory(
    { id: "gravitation", title: "Gravitation", domain: "Astronomy", classRange: "Class 9-12", icon: "orbit", accent: "quantum" },
    [
      ["universal-gravitation", "Newton's law of gravitation", "F=G\\frac{m_1m_2}{r^2}", ["F", "G", "m", "r"], ["gravity"]],
      ["field-strength", "Gravitational field", "g=\\frac{GM}{r^2}", ["g", "G", "M", "r"], ["field"]],
      ["orbital-speed", "Orbital speed", "v=\\sqrt{\\frac{GM}{r}}", ["v", "G", "M", "r"], ["orbit"]],
      ["escape-speed", "Escape speed", "v_e=\\sqrt{\\frac{2GM}{R}}", ["v_e", "G", "M", "R"], ["escape"]],
      ["kepler-third", "Kepler's third law", "T^2\\propto r^3", ["T", "r"], ["kepler"]],
      ["potential-gravitation", "Gravitational potential energy", "U=-G\\frac{Mm}{r}", ["U", "G", "M", "m", "r"], ["potential"]],
    ]
  ),
  makeCategory(
    { id: "oscillations", title: "Oscillations", domain: "Mechanics", classRange: "Class 11-12", icon: "pendulum", accent: "science" },
    [
      ["shm-displacement", "SHM displacement", "x=A\\sin(\\omega t+\\phi)", ["x", "A", "omega", "t", "phi"], ["shm"]],
      ["shm-velocity", "SHM velocity", "v=\\omega\\sqrt{A^2-x^2}", ["v", "omega", "A", "x"], ["shm"]],
      ["shm-acceleration", "SHM acceleration", "a=-\\omega^2x", ["a", "omega", "x"], ["shm"]],
      ["spring-period", "Spring period", "T=2\\pi\\sqrt{\\frac{m}{k}}", ["T", "m", "k"], ["spring"]],
      ["pendulum-period", "Simple pendulum period", "T=2\\pi\\sqrt{\\frac{l}{g}}", ["T", "l", "g"], ["pendulum"]],
      ["hooke-law", "Hooke's law", "F=-kx", ["F", "k", "x"], ["spring"]],
    ]
  ),
  makeCategory(
    { id: "waves", title: "Waves", domain: "Waves", classRange: "Class 9-12", icon: "wave", accent: "science" },
    [
      ["wave-speed", "Wave speed", "v=f\\lambda", ["v", "f", "lambda"], ["wave"]],
      ["period-frequency", "Period-frequency relation", "T=\\frac{1}{f}", ["T", "f"], ["frequency"]],
      ["string-wave-speed", "Wave speed on string", "v=\\sqrt{\\frac{T}{\\mu}}", ["v", "T", "mu"], ["string"]],
      ["wave-equation", "Travelling wave", "y=A\\sin(kx-\\omega t)", ["y", "A", "k", "x", "omega", "t"], ["wave equation"]],
      ["intensity-amplitude", "Intensity-amplitude relation", "I\\propto A^2", ["I", "A"], ["intensity"]],
      ["beat-frequency", "Beat frequency", "f_b=|f_1-f_2|", ["f_b", "f_1", "f_2"], ["beats"]],
    ]
  ),
  makeCategory(
    { id: "sound", title: "Sound", domain: "Waves", classRange: "Class 8-12", icon: "volume", accent: "science" },
    [
      ["echo-distance", "Echo distance", "d=\\frac{vt}{2}", ["d", "v", "t"], ["echo"]],
      ["doppler-moving-source", "Doppler effect - source", "f'=f\\frac{v}{v-v_s}", ["f'", "f", "v", "v_s"], ["doppler"]],
      ["doppler-moving-observer", "Doppler effect - observer", "f'=f\\frac{v+v_o}{v}", ["f'", "f", "v", "v_o"], ["doppler"]],
      ["sound-level", "Sound level", "\\beta=10\\log_{10}\\frac{I}{I_0}", ["beta", "I", "I_0"], ["decibel"]],
      ["closed-pipe", "Closed pipe fundamental", "f=\\frac{v}{4L}", ["f", "v", "L"], ["resonance"]],
      ["open-pipe", "Open pipe fundamental", "f=\\frac{v}{2L}", ["f", "v", "L"], ["resonance"]],
    ]
  ),
  makeCategory(
    { id: "fluid-mechanics", title: "Fluid Mechanics", domain: "Fluid Mechanics", classRange: "Class 9-12", icon: "drop", accent: "science" },
    [
      ["pressure", "Pressure", "P=\\frac{F}{A}", ["P", "F", "A"], ["pressure"]],
      ["liquid-pressure", "Liquid pressure", "P=\\rho gh", ["P", "rho", "g", "h"], ["hydrostatics"]],
      ["buoyant-force", "Buoyant force", "F_b=\\rho gV", ["F_b", "rho", "g", "V"], ["buoyancy"]],
      ["continuity", "Continuity equation", "A_1v_1=A_2v_2", ["A", "v"], ["flow"]],
      ["bernoulli", "Bernoulli equation", "P+\\frac{1}{2}\\rho v^2+\\rho gh=constant", ["P", "rho", "v", "h"], ["bernoulli"]],
      ["viscous-force", "Stokes' law", "F=6\\pi\\eta rv", ["F", "eta", "r", "v"], ["viscosity"]],
    ]
  ),
  makeCategory(
    { id: "thermal-physics", title: "Thermal Physics", domain: "Thermodynamics", classRange: "Class 8-12", icon: "thermometer", accent: "warning" },
    [
      ["heat-capacity", "Heat transfer", "Q=mc\\Delta T", ["Q", "m", "c", "Delta T"], ["heat"]],
      ["latent-heat", "Latent heat", "Q=mL", ["Q", "m", "L"], ["phase change"]],
      ["linear-expansion", "Linear expansion", "\\Delta L=\\alpha L\\Delta T", ["Delta L", "alpha", "L", "Delta T"], ["expansion"]],
      ["thermal-conduction", "Conduction rate", "\\frac{Q}{t}=\\frac{kA\\Delta T}{L}", ["Q", "t", "k", "A", "Delta T", "L"], ["conduction"]],
      ["radiation-power", "Stefan-Boltzmann law", "P=\\sigma eAT^4", ["P", "sigma", "e", "A", "T"], ["radiation"]],
      ["celsius-kelvin", "Celsius to kelvin", "T_K=T_C+273.15", ["T_K", "T_C"], ["temperature"]],
    ]
  ),
  makeCategory(
    { id: "kinetic-theory-gases", title: "Kinetic Theory & Gas Laws", domain: "Thermodynamics", classRange: "Class 10-12", icon: "flask", accent: "warning" },
    [
      ["ideal-gas", "Ideal gas law", "PV=nRT", ["P", "V", "n", "R", "T"], ["gas"]],
      ["boyle-law", "Boyle's law", "P_1V_1=P_2V_2", ["P", "V"], ["gas"]],
      ["charles-law", "Charles' law", "\\frac{V_1}{T_1}=\\frac{V_2}{T_2}", ["V", "T"], ["gas"]],
      ["pressure-law", "Pressure law", "\\frac{P_1}{T_1}=\\frac{P_2}{T_2}", ["P", "T"], ["gas"]],
      ["rms-speed", "RMS speed", "v_{rms}=\\sqrt{\\frac{3RT}{M}}", ["v_rms", "R", "T", "M"], ["kinetic theory"]],
      ["average-ke-gas", "Average molecular kinetic energy", "K_{avg}=\\frac{3}{2}k_BT", ["K_avg", "k_B", "T"], ["kinetic theory"]],
    ]
  ),
  makeCategory(
    { id: "electrostatics", title: "Electrostatics", domain: "Electricity", classRange: "Class 10-12", icon: "field", accent: "quantum" },
    [
      ["coulomb-law", "Coulomb's law", "F=k\\frac{q_1q_2}{r^2}", ["F", "k", "q", "r"], ["charge"]],
      ["electric-field", "Electric field", "E=\\frac{F}{q}", ["E", "F", "q"], ["field"]],
      ["point-charge-field", "Point charge field", "E=k\\frac{q}{r^2}", ["E", "k", "q", "r"], ["field"]],
      ["electric-potential", "Electric potential", "V=k\\frac{q}{r}", ["V", "k", "q", "r"], ["potential"]],
      ["capacitance", "Capacitance", "C=\\frac{Q}{V}", ["C", "Q", "V"], ["capacitor"]],
      ["capacitor-energy", "Capacitor energy", "U=\\frac{1}{2}CV^2", ["U", "C", "V"], ["energy"]],
    ]
  ),
  makeCategory(
    { id: "current-electricity", title: "Current Electricity", domain: "Electricity", classRange: "Class 9-12", icon: "battery", accent: "science" },
    [
      ["ohms-law", "Ohm's law", "V=IR", ["V", "I", "R"], ["current", "resistance"]],
      ["electric-current", "Electric current", "I=\\frac{Q}{t}", ["I", "Q", "t"], ["current"]],
      ["resistivity", "Resistance of wire", "R=\\rho\\frac{L}{A}", ["R", "rho", "L", "A"], ["resistivity"]],
      ["series-resistance", "Series resistance", "R_s=R_1+R_2+R_3", ["R_s", "R"], ["series"]],
      ["parallel-resistance", "Parallel resistance", "\\frac{1}{R_p}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\frac{1}{R_3}", ["R_p", "R"], ["parallel"]],
      ["electric-power", "Electric power", "P=VI=I^2R=\\frac{V^2}{R}", ["P", "V", "I", "R"], ["power"]],
    ]
  ),
  makeCategory(
    { id: "magnetism", title: "Magnetism", domain: "Magnetism", classRange: "Class 10-12", icon: "magnet", accent: "quantum" },
    [
      ["lorentz-force", "Lorentz force", "F=qvB\\sin\\theta", ["F", "q", "v", "B", "theta"], ["magnetic force"]],
      ["force-wire", "Force on current wire", "F=BIL\\sin\\theta", ["F", "B", "I", "L", "theta"], ["current"]],
      ["field-long-wire", "Field near long wire", "B=\\frac{\\mu_0I}{2\\pi r}", ["B", "mu_0", "I", "r"], ["field"]],
      ["field-solenoid", "Field inside solenoid", "B=\\mu_0nI", ["B", "mu_0", "n", "I"], ["solenoid"]],
      ["cyclotron-radius", "Charged particle radius", "r=\\frac{mv}{qB}", ["r", "m", "v", "q", "B"], ["charged particle"]],
      ["magnetic-flux", "Magnetic flux", "\\Phi_B=BA\\cos\\theta", ["Phi_B", "B", "A", "theta"], ["flux"]],
    ]
  ),
  makeCategory(
    { id: "electromagnetic-induction", title: "Electromagnetic Induction", domain: "Magnetism", classRange: "Class 12", icon: "magnet", accent: "quantum" },
    [
      ["faraday-law", "Faraday's law", "\\mathcal{E}=-N\\frac{d\\Phi_B}{dt}", ["E", "N", "Phi_B", "t"], ["emi"]],
      ["motional-emf", "Motional emf", "\\mathcal{E}=Blv", ["E", "B", "l", "v"], ["emi"]],
      ["self-inductance", "Self induced emf", "\\mathcal{E}=-L\\frac{dI}{dt}", ["E", "L", "I", "t"], ["inductor"]],
      ["inductor-energy", "Energy in inductor", "U=\\frac{1}{2}LI^2", ["U", "L", "I"], ["energy"]],
      ["transformer-ratio", "Transformer ratio", "\\frac{V_s}{V_p}=\\frac{N_s}{N_p}", ["V", "N"], ["transformer"]],
      ["ac-generator", "AC generator emf", "\\mathcal{E}=NBA\\omega\\sin\\omega t", ["E", "N", "B", "A", "omega", "t"], ["generator"]],
    ]
  ),
  makeCategory(
    { id: "ac-circuits", title: "AC Circuits", domain: "Electricity", classRange: "Class 12", icon: "battery", accent: "quantum" },
    [
      ["capacitive-reactance", "Capacitive reactance", "X_C=\\frac{1}{\\omega C}", ["X_C", "omega", "C"], ["ac"]],
      ["inductive-reactance", "Inductive reactance", "X_L=\\omega L", ["X_L", "omega", "L"], ["ac"]],
      ["impedance-rlc", "RLC impedance", "Z=\\sqrt{R^2+(X_L-X_C)^2}", ["Z", "R", "X_L", "X_C"], ["rlc"]],
      ["rms-voltage", "RMS voltage", "V_{rms}=\\frac{V_0}{\\sqrt{2}}", ["V_rms", "V_0"], ["rms"]],
      ["resonant-frequency", "Resonant frequency", "f_0=\\frac{1}{2\\pi\\sqrt{LC}}", ["f_0", "L", "C"], ["resonance"]],
      ["ac-power", "AC power", "P_{avg}=V_{rms}I_{rms}\\cos\\phi", ["P_avg", "V_rms", "I_rms", "phi"], ["power factor"]],
    ]
  ),
  makeCategory(
    { id: "ray-optics", title: "Ray Optics", domain: "Optics", classRange: "Class 8-12", icon: "prism", accent: "science" },
    [
      ["mirror-formula", "Mirror formula", "\\frac{1}{f}=\\frac{1}{v}+\\frac{1}{u}", ["f", "v", "u"], ["mirror"]],
      ["lens-formula", "Lens formula", "\\frac{1}{f}=\\frac{1}{v}-\\frac{1}{u}", ["f", "v", "u"], ["lens"]],
      ["magnification", "Magnification", "m=\\frac{h_i}{h_o}=\\frac{v}{u}", ["m", "h_i", "h_o", "v", "u"], ["image"]],
      ["snell-law", "Snell's law", "n_1\\sin i=n_2\\sin r", ["n", "i", "r"], ["refraction"]],
      ["critical-angle", "Critical angle", "\\sin C=\\frac{n_2}{n_1}", ["C", "n_1", "n_2"], ["tir"]],
      ["lens-power", "Power of lens", "P=\\frac{1}{f}", ["P", "f"], ["diopter"]],
    ]
  ),
  makeCategory(
    { id: "wave-optics", title: "Wave Optics", domain: "Optics", classRange: "Class 12", icon: "wave", accent: "quantum" },
    [
      ["ydse-fringe-width", "YDSE fringe width", "\\beta=\\frac{\\lambda D}{d}", ["beta", "lambda", "D", "d"], ["interference"]],
      ["path-difference", "Path difference", "\\Delta x=d\\sin\\theta", ["Delta x", "d", "theta"], ["interference"]],
      ["single-slit-minima", "Single slit minima", "a\\sin\\theta=n\\lambda", ["a", "theta", "n", "lambda"], ["diffraction"]],
      ["malus-law", "Malus' law", "I=I_0\\cos^2\\theta", ["I", "I_0", "theta"], ["polarization"]],
      ["brewster-law", "Brewster's law", "\\tan i_B=\\frac{n_2}{n_1}", ["i_B", "n"], ["polarization"]],
      ["resolving-power", "Resolving power telescope", "RP=\\frac{D}{1.22\\lambda}", ["RP", "D", "lambda"], ["resolution"]],
    ]
  ),
  makeCategory(
    { id: "modern-physics", title: "Modern Physics", domain: "Modern Physics", classRange: "Class 11-12", icon: "atom", accent: "quantum" },
    [
      ["photon-energy", "Photon energy", "E=h\\nu=\\frac{hc}{\\lambda}", ["E", "h", "nu", "c", "lambda"], ["photon"]],
      ["photoelectric", "Photoelectric equation", "h\\nu=\\phi+K_{max}", ["h", "nu", "phi", "K_max"], ["photoelectric"]],
      ["de-broglie", "de Broglie wavelength", "\\lambda=\\frac{h}{p}", ["lambda", "h", "p"], ["matter wave"]],
      ["mass-energy", "Mass-energy equivalence", "E=mc^2", ["E", "m", "c"], ["relativity"]],
      ["uncertainty", "Uncertainty principle", "\\Delta x\\Delta p\\geq \\frac{\\hbar}{2}", ["Delta x", "Delta p", "hbar"], ["quantum"]],
      ["pair-production", "Pair production threshold", "E_{min}=2m_ec^2", ["E_min", "m_e", "c"], ["particle"]],
    ]
  ),
  makeCategory(
    { id: "atomic-physics", title: "Atomic Physics", domain: "Modern Physics", classRange: "Class 11-12", icon: "atom", accent: "quantum" },
    [
      ["bohr-radius", "Bohr radius level", "r_n=n^2a_0", ["r_n", "n", "a_0"], ["bohr"]],
      ["bohr-energy", "Hydrogen energy level", "E_n=-\\frac{13.6}{n^2}\\,eV", ["E_n", "n"], ["hydrogen"]],
      ["rydberg", "Rydberg formula", "\\frac{1}{\\lambda}=R\\left(\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right)", ["lambda", "R", "n"], ["spectrum"]],
      ["angular-momentum-quantized", "Bohr angular momentum", "mvr=\\frac{nh}{2\\pi}", ["m", "v", "r", "n", "h"], ["quantization"]],
      ["xray-min-wavelength", "X-ray minimum wavelength", "\\lambda_{min}=\\frac{hc}{eV}", ["lambda_min", "h", "c", "e", "V"], ["x-ray"]],
      ["spectral-frequency", "Spectral photon frequency", "\\nu=\\frac{E_2-E_1}{h}", ["nu", "E", "h"], ["spectrum"]],
    ]
  ),
  makeCategory(
    { id: "nuclear-physics", title: "Nuclear Physics", domain: "Modern Physics", classRange: "Class 11-12", icon: "atom", accent: "warning" },
    [
      ["radioactive-decay", "Radioactive decay", "N=N_0e^{-\\lambda t}", ["N", "N_0", "lambda", "t"], ["decay"]],
      ["activity", "Activity", "A=\\lambda N", ["A", "lambda", "N"], ["radioactivity"]],
      ["half-life", "Half life", "T_{1/2}=\\frac{0.693}{\\lambda}", ["T", "lambda"], ["decay"]],
      ["binding-energy", "Binding energy", "BE=\\Delta mc^2", ["BE", "Delta m", "c"], ["nucleus"]],
      ["mass-defect", "Mass defect", "\\Delta m=Zm_p+(A-Z)m_n-M", ["Delta m", "Z", "A", "m_p", "m_n", "M"], ["nucleus"]],
      ["q-value", "Nuclear Q-value", "Q=(m_{initial}-m_{final})c^2", ["Q", "m", "c"], ["reaction"]],
    ]
  ),
  makeCategory(
    { id: "electronics-logic", title: "Electronics & Logic", domain: "Electronics", classRange: "Class 10-12", icon: "spark", accent: "science" },
    [
      ["diode-current", "Diode equation", "I=I_s\\left(e^{\\frac{V}{nV_T}}-1\\right)", ["I", "I_s", "V", "n", "V_T"], ["diode"]],
      ["transistor-current-gain", "Current gain", "\\beta=\\frac{I_C}{I_B}", ["beta", "I_C", "I_B"], ["transistor"]],
      ["zener-regulator", "Series resistor for zener", "R_s=\\frac{V_{in}-V_Z}{I_L+I_Z}", ["R_s", "V_in", "V_Z", "I_L", "I_Z"], ["zener"]],
      ["rectifier-ripple", "Ripple frequency", "f_r=2f", ["f_r", "f"], ["rectifier"]],
      ["logic-not", "NOT gate", "Y=\\overline{A}", ["Y", "A"], ["logic"]],
      ["logic-and", "AND gate", "Y=A\\cdot B", ["Y", "A", "B"], ["logic"]],
    ]
  ),
  makeCategory(
    { id: "relativity-astrophysics", title: "Relativity & Astrophysics", domain: "Astronomy", classRange: "Class 11-12", icon: "orbit", accent: "quantum" },
    [
      ["lorentz-factor", "Lorentz factor", "\\gamma=\\frac{1}{\\sqrt{1-\\frac{v^2}{c^2}}}", ["gamma", "v", "c"], ["relativity"]],
      ["time-dilation", "Time dilation", "\\Delta t=\\gamma\\Delta t_0", ["Delta t", "gamma", "Delta t_0"], ["relativity"]],
      ["length-contraction", "Length contraction", "L=\\frac{L_0}{\\gamma}", ["L", "L_0", "gamma"], ["relativity"]],
      ["redshift", "Redshift", "z=\\frac{\\lambda_{obs}-\\lambda_{emit}}{\\lambda_{emit}}", ["z", "lambda"], ["redshift"]],
      ["hubble-law", "Hubble law", "v=H_0d", ["v", "H_0", "d"], ["cosmology"]],
      ["schwarzschild-radius", "Schwarzschild radius", "r_s=\\frac{2GM}{c^2}", ["r_s", "G", "M", "c"], ["black hole"]],
    ]
  ),
];

const supplementalFormulaSeeds: Record<string, FormulaSeed[]> = {
  "measurements-units": [
    ["absolute-error", "Absolute error", "\\Delta x=|x_{measured}-x_{true}|", ["Delta x", "x"], ["error", "measurement"]],
    ["mean-value", "Mean value", "\\bar{x}=\\frac{x_1+x_2+\\cdots+x_n}{n}", ["x", "n"], ["average", "measurement"]],
    ["percentage-uncertainty", "Percentage uncertainty", "\\%\\,uncertainty=\\frac{\\Delta x}{x}\\times100", ["Delta x", "x"], ["uncertainty"]],
    ["density", "Density", "\\rho=\\frac{m}{V}", ["rho", "m", "V"], ["density"]],
    ["area-rectangle", "Area of rectangle", "A=lb", ["A", "l", "b"], ["area"]],
    ["volume-cuboid", "Volume of cuboid", "V=lbh", ["V", "l", "b", "h"], ["volume"]],
    ["unit-conversion", "Unit conversion", "value_{new}=value_{old}\\times conversion\\,factor", ["value"], ["units"]],
    ["dimensional-homogeneity", "Dimensional homogeneity", "[LHS]=[RHS]", ["LHS", "RHS"], ["dimensions"]],
  ],
  kinematics: [
    ["displacement-position", "Displacement", "\\Delta x=x_f-x_i", ["Delta x", "x_f", "x_i"], ["displacement"]],
    ["instantaneous-velocity", "Instantaneous velocity", "v=\\frac{dx}{dt}", ["v", "x", "t"], ["calculus", "velocity"]],
    ["instantaneous-acceleration", "Instantaneous acceleration", "a=\\frac{dv}{dt}", ["a", "v", "t"], ["calculus", "acceleration"]],
    ["free-fall-height", "Free fall distance", "h=\\frac{1}{2}gt^2", ["h", "g", "t"], ["free fall"]],
    ["vertical-motion", "Vertical velocity", "v_y=u_y-gt", ["v_y", "u_y", "g", "t"], ["projectile"]],
    ["projectile-time-flight", "Projectile time of flight", "T=\\frac{2u\\sin\\theta}{g}", ["T", "u", "theta", "g"], ["projectile"]],
    ["projectile-max-height", "Projectile maximum height", "H=\\frac{u^2\\sin^2\\theta}{2g}", ["H", "u", "theta", "g"], ["projectile"]],
    ["relative-velocity", "Relative velocity", "\\vec v_{AB}=\\vec v_A-\\vec v_B", ["v_AB", "v_A", "v_B"], ["relative motion"]],
  ],
  dynamics: [
    ["newton-first-law", "Equilibrium condition", "\\sum \\vec F=0", ["F"], ["equilibrium"]],
    ["net-force", "Net force", "\\vec F_{net}=\\sum \\vec F", ["F_net", "F"], ["force"]],
    ["normal-horizontal", "Normal reaction on horizontal surface", "N=mg", ["N", "m", "g"], ["normal force"]],
    ["normal-incline", "Normal reaction on incline", "N=mg\\cos\\theta", ["N", "m", "g", "theta"], ["inclined plane"]],
    ["incline-acceleration", "Smooth incline acceleration", "a=g\\sin\\theta", ["a", "g", "theta"], ["inclined plane"]],
    ["friction-angle", "Angle of friction", "\\tan\\phi=\\mu", ["phi", "mu"], ["friction"]],
    ["drag-linear", "Linear drag", "F_d=bv", ["F_d", "b", "v"], ["drag"]],
    ["terminal-speed-simple", "Terminal speed with linear drag", "v_t=\\frac{mg}{b}", ["v_t", "m", "g", "b"], ["drag"]],
  ],
  "work-energy-power": [
    ["spring-potential-energy", "Spring potential energy", "U_s=\\frac{1}{2}kx^2", ["U_s", "k", "x"], ["spring", "energy"]],
    ["gravitational-potential-general", "Gravitational potential energy - general", "U=-\\frac{GMm}{r}", ["U", "G", "M", "m", "r"], ["gravity", "energy"]],
    ["mechanical-energy", "Mechanical energy", "E=K+U", ["E", "K", "U"], ["energy"]],
    ["conservation-energy", "Energy conservation", "K_i+U_i=K_f+U_f", ["K", "U"], ["conservation"]],
    ["instantaneous-power", "Instantaneous power", "P=Fv\\cos\\theta", ["P", "F", "v", "theta"], ["power"]],
    ["energy-from-power", "Energy from power", "E=Pt", ["E", "P", "t"], ["power"]],
    ["work-variable-force", "Work by variable force", "W=\\int F\\,dx", ["W", "F", "x"], ["calculus", "work"]],
    ["loss-efficiency", "Energy loss", "E_{loss}=E_{in}-E_{out}", ["E_loss", "E_in", "E_out"], ["efficiency"]],
  ],
  "momentum-collisions": [
    ["momentum-vector", "Vector momentum", "\\vec p=m\\vec v", ["p", "m", "v"], ["momentum"]],
    ["impulse-integral", "Impulse from force-time graph", "J=\\int F\\,dt", ["J", "F", "t"], ["impulse"]],
    ["average-force-collision", "Average impact force", "F_{avg}=\\frac{\\Delta p}{\\Delta t}", ["F_avg", "Delta p", "Delta t"], ["collision"]],
    ["elastic-head-on-v1", "Elastic collision final velocity 1", "v_1=\\frac{m_1-m_2}{m_1+m_2}u_1+\\frac{2m_2}{m_1+m_2}u_2", ["v_1", "m", "u"], ["elastic"]],
    ["elastic-head-on-v2", "Elastic collision final velocity 2", "v_2=\\frac{2m_1}{m_1+m_2}u_1+\\frac{m_2-m_1}{m_1+m_2}u_2", ["v_2", "m", "u"], ["elastic"]],
    ["recoil-speed", "Recoil speed", "Mv=mu", ["M", "v", "m", "u"], ["recoil"]],
    ["center-mass-position", "Centre of mass", "x_{cm}=\\frac{m_1x_1+m_2x_2}{m_1+m_2}", ["x_cm", "m", "x"], ["center of mass"]],
    ["center-mass-velocity", "Centre of mass velocity", "v_{cm}=\\frac{m_1v_1+m_2v_2}{m_1+m_2}", ["v_cm", "m", "v"], ["center of mass"]],
  ],
  "rotational-motion": [
    ["angular-displacement", "Angular displacement", "\\theta=\\frac{s}{r}", ["theta", "s", "r"], ["rotation"]],
    ["linear-angular-speed", "Linear and angular speed", "v=r\\omega", ["v", "r", "omega"], ["circular motion"]],
    ["centripetal-acceleration", "Centripetal acceleration", "a_c=\\frac{v^2}{r}=r\\omega^2", ["a_c", "v", "r", "omega"], ["circular motion"]],
    ["rotational-second-law", "Rotational second law", "\\tau=I\\alpha", ["tau", "I", "alpha"], ["torque"]],
    ["rolling-condition", "Rolling condition", "v_{cm}=R\\omega", ["v_cm", "R", "omega"], ["rolling"]],
    ["moment-inertia-disc", "Moment of inertia - disc", "I=\\frac{1}{2}MR^2", ["I", "M", "R"], ["inertia"]],
    ["moment-inertia-rod-center", "Moment of inertia - rod center", "I=\\frac{1}{12}ML^2", ["I", "M", "L"], ["inertia"]],
    ["rotational-work", "Rotational work", "W=\\tau\\theta", ["W", "tau", "theta"], ["work"]],
  ],
  gravitation: [
    ["surface-gravity", "Surface gravity", "g=\\frac{GM}{R^2}", ["g", "G", "M", "R"], ["gravity"]],
    ["gravity-height", "Gravity at height", "g_h=g\\left(\\frac{R}{R+h}\\right)^2", ["g_h", "g", "R", "h"], ["gravity"]],
    ["gravity-depth", "Gravity at depth", "g_d=g\\left(1-\\frac{d}{R}\\right)", ["g_d", "g", "d", "R"], ["gravity"]],
    ["satellite-period", "Satellite period", "T=2\\pi\\sqrt{\\frac{r^3}{GM}}", ["T", "r", "G", "M"], ["orbit"]],
    ["orbital-energy", "Orbital total energy", "E=-\\frac{GMm}{2r}", ["E", "G", "M", "m", "r"], ["orbit"]],
    ["gravitational-potential", "Gravitational potential", "V=-\\frac{GM}{r}", ["V", "G", "M", "r"], ["potential"]],
    ["kepler-newton-form", "Kepler law - Newton form", "T^2=\\frac{4\\pi^2}{GM}r^3", ["T", "G", "M", "r"], ["kepler"]],
    ["escape-energy", "Escape condition", "\\frac{1}{2}mv_e^2=\\frac{GMm}{R}", ["m", "v_e", "G", "M", "R"], ["escape"]],
  ],
  oscillations: [
    ["shm-angular-frequency", "SHM angular frequency", "\\omega=\\frac{2\\pi}{T}", ["omega", "T"], ["shm"]],
    ["shm-time-period", "SHM period", "T=\\frac{2\\pi}{\\omega}", ["T", "omega"], ["shm"]],
    ["shm-frequency", "SHM frequency", "f=\\frac{1}{T}", ["f", "T"], ["shm"]],
    ["shm-energy", "SHM total energy", "E=\\frac{1}{2}kA^2", ["E", "k", "A"], ["energy", "shm"]],
    ["shm-ke", "SHM kinetic energy", "K=\\frac{1}{2}k(A^2-x^2)", ["K", "k", "A", "x"], ["energy", "shm"]],
    ["shm-pe", "SHM potential energy", "U=\\frac{1}{2}kx^2", ["U", "k", "x"], ["energy", "shm"]],
    ["damped-amplitude", "Damped amplitude", "A=A_0e^{-bt}", ["A", "A_0", "b", "t"], ["damping"]],
    ["resonance-condition", "Resonance condition", "f_{driving}=f_0", ["f", "f_0"], ["resonance"]],
  ],
  waves: [
    ["angular-frequency", "Angular frequency", "\\omega=2\\pi f", ["omega", "f"], ["wave"]],
    ["wave-number", "Wave number", "k=\\frac{2\\pi}{\\lambda}", ["k", "lambda"], ["wave"]],
    ["wave-speed-omega-k", "Wave speed using omega and k", "v=\\frac{\\omega}{k}", ["v", "omega", "k"], ["wave"]],
    ["phase-difference", "Phase difference", "\\Delta\\phi=\\frac{2\\pi\\Delta x}{\\lambda}", ["Delta phi", "Delta x", "lambda"], ["phase"]],
    ["standing-wave-string", "String standing wave", "f_n=\\frac{nv}{2L}", ["f_n", "n", "v", "L"], ["standing wave"]],
    ["intensity-distance", "Inverse square intensity", "I\\propto\\frac{1}{r^2}", ["I", "r"], ["intensity"]],
    ["superposition", "Superposition", "y=y_1+y_2", ["y", "y_1", "y_2"], ["superposition"]],
    ["energy-wave-amplitude", "Wave energy relation", "E\\propto A^2", ["E", "A"], ["energy"]],
  ],
  sound: [
    ["sound-speed-temperature", "Speed of sound in air", "v\\approx331+0.6T_C", ["v", "T_C"], ["sound speed"]],
    ["intensity-sphere", "Sound intensity", "I=\\frac{P}{4\\pi r^2}", ["I", "P", "r"], ["intensity"]],
    ["intensity-level-difference", "Level difference", "\\Delta\\beta=10\\log_{10}\\frac{I_2}{I_1}", ["Delta beta", "I_2", "I_1"], ["decibel"]],
    ["fundamental-string", "String fundamental frequency", "f=\\frac{1}{2L}\\sqrt{\\frac{T}{\\mu}}", ["f", "L", "T", "mu"], ["resonance"]],
    ["open-pipe-harmonics", "Open pipe harmonics", "f_n=\\frac{nv}{2L}", ["f_n", "n", "v", "L"], ["pipe"]],
    ["closed-pipe-harmonics", "Closed pipe harmonics", "f_n=\\frac{nv}{4L}\\;(n=1,3,5...)", ["f_n", "n", "v", "L"], ["pipe"]],
    ["doppler-general", "Doppler effect - general", "f'=f\\frac{v\\pm v_o}{v\\mp v_s}", ["f'", "f", "v", "v_o", "v_s"], ["doppler"]],
    ["resonance-tube", "Resonance tube", "L+e=\\frac{\\lambda}{4}", ["L", "e", "lambda"], ["resonance"]],
  ],
  "fluid-mechanics": [
    ["pascal-law", "Pascal hydraulic press", "\\frac{F_1}{A_1}=\\frac{F_2}{A_2}", ["F", "A"], ["pascal"]],
    ["atmospheric-pressure", "Atmospheric pressure", "P=\\rho gh", ["P", "rho", "g", "h"], ["barometer"]],
    ["upthrust-weight-loss", "Apparent weight", "W_{app}=W-F_b", ["W_app", "W", "F_b"], ["buoyancy"]],
    ["float-fraction", "Floating fraction", "\\frac{V_{sub}}{V}=\\frac{\\rho_{object}}{\\rho_{fluid}}", ["V_sub", "V", "rho"], ["floating"]],
    ["flow-rate", "Volume flow rate", "Q=Av", ["Q", "A", "v"], ["flow"]],
    ["poiseuille", "Poiseuille law", "Q=\\frac{\\pi r^4\\Delta P}{8\\eta L}", ["Q", "r", "Delta P", "eta", "L"], ["viscosity"]],
    ["terminal-speed-stokes", "Terminal speed in viscous fluid", "v_t=\\frac{2r^2(\\rho_s-\\rho_f)g}{9\\eta}", ["v_t", "r", "rho", "g", "eta"], ["viscosity"]],
    ["reynolds-number", "Reynolds number", "Re=\\frac{\\rho vD}{\\eta}", ["Re", "rho", "v", "D", "eta"], ["flow"]],
  ],
  "thermal-physics": [
    ["heat-mixture", "Heat balance", "m_1c_1(T_f-T_1)+m_2c_2(T_f-T_2)=0", ["m", "c", "T_f", "T"], ["calorimetry"]],
    ["thermal-capacity", "Thermal capacity", "C=mc", ["C", "m", "c"], ["heat"]],
    ["area-expansion", "Area expansion", "\\Delta A=2\\alpha A\\Delta T", ["Delta A", "alpha", "A", "Delta T"], ["expansion"]],
    ["volume-expansion", "Volume expansion", "\\Delta V=\\gamma V\\Delta T", ["Delta V", "gamma", "V", "Delta T"], ["expansion"]],
    ["newton-cooling", "Newton's law of cooling", "\\frac{dT}{dt}=-k(T-T_s)", ["T", "t", "k", "T_s"], ["cooling"]],
    ["heat-engine-efficiency", "Heat engine efficiency", "\\eta=1-\\frac{Q_c}{Q_h}", ["eta", "Q_c", "Q_h"], ["engine"]],
    ["carnot-efficiency", "Carnot efficiency", "\\eta=1-\\frac{T_c}{T_h}", ["eta", "T_c", "T_h"], ["engine"]],
    ["radiation-net", "Net radiation power", "P=\\sigma eA(T^4-T_s^4)", ["P", "sigma", "e", "A", "T", "T_s"], ["radiation"]],
  ],
  "kinetic-theory-gases": [
    ["combined-gas-law", "Combined gas law", "\\frac{P_1V_1}{T_1}=\\frac{P_2V_2}{T_2}", ["P", "V", "T"], ["gas"]],
    ["avogadro-law", "Avogadro law", "\\frac{V}{n}=constant", ["V", "n"], ["gas"]],
    ["gas-density", "Gas density", "\\rho=\\frac{PM}{RT}", ["rho", "P", "M", "R", "T"], ["gas"]],
    ["pressure-kinetic", "Kinetic gas pressure", "P=\\frac{1}{3}\\rho v_{rms}^2", ["P", "rho", "v_rms"], ["kinetic theory"]],
    ["internal-energy-ideal-gas", "Internal energy of ideal gas", "U=\\frac{f}{2}nRT", ["U", "f", "n", "R", "T"], ["internal energy"]],
    ["monoatomic-energy", "Monoatomic gas energy", "U=\\frac{3}{2}nRT", ["U", "n", "R", "T"], ["gas"]],
    ["mayer-relation", "Mayer relation", "C_p-C_v=R", ["C_p", "C_v", "R"], ["specific heat"]],
    ["adiabatic-law", "Adiabatic law", "PV^\\gamma=constant", ["P", "V", "gamma"], ["thermodynamics"]],
  ],
  electrostatics: [
    ["electric-flux", "Electric flux", "\\Phi_E=EA\\cos\\theta", ["Phi_E", "E", "A", "theta"], ["flux"]],
    ["gauss-law", "Gauss law", "\\Phi_E=\\frac{q_{enc}}{\\epsilon_0}", ["Phi_E", "q", "epsilon_0"], ["gauss"]],
    ["potential-energy-charges", "Electric potential energy", "U=k\\frac{q_1q_2}{r}", ["U", "k", "q", "r"], ["potential"]],
    ["uniform-field-potential", "Potential difference in uniform field", "\\Delta V=Ed", ["Delta V", "E", "d"], ["field"]],
    ["capacitor-parallel-plate", "Parallel plate capacitance", "C=\\frac{\\epsilon_0A}{d}", ["C", "epsilon_0", "A", "d"], ["capacitor"]],
    ["capacitors-series", "Capacitors in series", "\\frac{1}{C_s}=\\frac{1}{C_1}+\\frac{1}{C_2}", ["C_s", "C"], ["capacitor"]],
    ["capacitors-parallel", "Capacitors in parallel", "C_p=C_1+C_2+\\cdots", ["C_p", "C"], ["capacitor"]],
    ["energy-density-electric", "Electric field energy density", "u=\\frac{1}{2}\\epsilon_0E^2", ["u", "epsilon_0", "E"], ["energy"]],
  ],
  "current-electricity": [
    ["drift-current", "Current by drift", "I=nAev_d", ["I", "n", "A", "e", "v_d"], ["drift"]],
    ["current-density", "Current density", "J=\\frac{I}{A}", ["J", "I", "A"], ["current"]],
    ["microscopic-ohm", "Microscopic Ohm law", "\\vec J=\\sigma\\vec E", ["J", "sigma", "E"], ["conductivity"]],
    ["conductance", "Conductance", "G=\\frac{1}{R}", ["G", "R"], ["resistance"]],
    ["emf-terminal-voltage", "Terminal voltage", "V=\\mathcal{E}-Ir", ["V", "E", "I", "r"], ["cell"]],
    ["kirchhoff-junction", "Kirchhoff current law", "\\sum I_{in}=\\sum I_{out}", ["I"], ["kirchhoff"]],
    ["kirchhoff-loop", "Kirchhoff voltage law", "\\sum V=0", ["V"], ["kirchhoff"]],
    ["wheatstone-balance", "Wheatstone bridge balance", "\\frac{R_1}{R_2}=\\frac{R_3}{R_4}", ["R"], ["bridge"]],
  ],
  magnetism: [
    ["magnetic-force-moving-charge", "Magnetic force magnitude", "F=|q|vB\\sin\\theta", ["F", "q", "v", "B", "theta"], ["magnetic force"]],
    ["ampere-force-two-wires", "Force between parallel wires", "\\frac{F}{L}=\\frac{\\mu_0I_1I_2}{2\\pi r}", ["F", "L", "mu_0", "I", "r"], ["wire"]],
    ["field-circular-loop", "Field at centre of circular loop", "B=\\frac{\\mu_0I}{2R}", ["B", "mu_0", "I", "R"], ["field"]],
    ["magnetic-dipole-moment", "Magnetic dipole moment", "\\mu=NI A", ["mu", "N", "I", "A"], ["dipole"]],
    ["torque-current-loop", "Torque on current loop", "\\tau=NIAB\\sin\\theta", ["tau", "N", "I", "A", "B", "theta"], ["torque"]],
    ["cyclotron-frequency", "Cyclotron frequency", "f=\\frac{qB}{2\\pi m}", ["f", "q", "B", "m"], ["charged particle"]],
    ["hall-voltage", "Hall voltage", "V_H=\\frac{BI}{nqt}", ["V_H", "B", "I", "n", "q", "t"], ["hall effect"]],
    ["magnetic-energy-density", "Magnetic energy density", "u=\\frac{B^2}{2\\mu_0}", ["u", "B", "mu_0"], ["energy"]],
  ],
  "electromagnetic-induction": [
    ["flux-change-emf", "Average induced emf", "\\mathcal{E}=-N\\frac{\\Delta\\Phi_B}{\\Delta t}", ["E", "N", "Delta Phi_B", "Delta t"], ["emi"]],
    ["rotating-coil-emf", "Rotating coil emf", "\\mathcal{E}=NBA\\omega\\sin\\omega t", ["E", "N", "B", "A", "omega", "t"], ["generator"]],
    ["peak-generator-emf", "Peak generator emf", "\\mathcal{E}_0=NBA\\omega", ["E_0", "N", "B", "A", "omega"], ["generator"]],
    ["mutual-inductance-emf", "Mutual induced emf", "\\mathcal{E}_s=-M\\frac{dI_p}{dt}", ["E_s", "M", "I_p", "t"], ["inductor"]],
    ["inductive-time-constant", "LR time constant", "\\tau=\\frac{L}{R}", ["tau", "L", "R"], ["transient"]],
    ["rc-time-constant", "RC time constant", "\\tau=RC", ["tau", "R", "C"], ["transient"]],
    ["capacitor-charging", "Capacitor charging", "Q=Q_0(1-e^{-t/RC})", ["Q", "Q_0", "t", "R", "C"], ["transient"]],
    ["inductor-current-growth", "Inductor current growth", "I=I_0(1-e^{-Rt/L})", ["I", "I_0", "R", "t", "L"], ["transient"]],
  ],
  "ac-circuits": [
    ["angular-frequency-ac", "AC angular frequency", "\\omega=2\\pi f", ["omega", "f"], ["ac"]],
    ["rms-current", "RMS current", "I_{rms}=\\frac{I_0}{\\sqrt2}", ["I_rms", "I_0"], ["rms"]],
    ["capacitor-current-lead", "Capacitor current relation", "I_C=\\frac{V}{X_C}", ["I_C", "V", "X_C"], ["capacitor"]],
    ["inductor-current", "Inductor current relation", "I_L=\\frac{V}{X_L}", ["I_L", "V", "X_L"], ["inductor"]],
    ["phase-angle-rlc", "RLC phase angle", "\\tan\\phi=\\frac{X_L-X_C}{R}", ["phi", "X_L", "X_C", "R"], ["phase"]],
    ["quality-factor", "Quality factor", "Q=\\frac{\\omega_0L}{R}", ["Q", "omega_0", "L", "R"], ["resonance"]],
    ["bandwidth", "Bandwidth", "\\Delta f=\\frac{f_0}{Q}", ["Delta f", "f_0", "Q"], ["resonance"]],
    ["power-factor", "Power factor", "\\cos\\phi=\\frac{R}{Z}", ["phi", "R", "Z"], ["power factor"]],
  ],
  "ray-optics": [
    ["reflection-law", "Law of reflection", "i=r", ["i", "r"], ["reflection"]],
    ["refractive-index", "Refractive index", "n=\\frac{c}{v}", ["n", "c", "v"], ["refraction"]],
    ["apparent-depth", "Apparent depth", "d' = \\frac{d}{n}", ["d", "n"], ["refraction"]],
    ["prism-deviation", "Prism deviation", "\\delta=i+e-A", ["delta", "i", "e", "A"], ["prism"]],
    ["minimum-deviation-prism", "Prism refractive index", "n=\\frac{\\sin\\frac{A+D_m}{2}}{\\sin\\frac{A}{2}}", ["n", "A", "D_m"], ["prism"]],
    ["lens-makers", "Lens maker formula", "\\frac{1}{f}=(n-1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)", ["f", "n", "R"], ["lens"]],
    ["combination-lenses", "Lens combination", "P=P_1+P_2", ["P", "P_1", "P_2"], ["lens"]],
    ["simple-microscope", "Simple microscope magnification", "M=1+\\frac{D}{f}", ["M", "D", "f"], ["instrument"]],
  ],
  "wave-optics": [
    ["constructive-interference", "Constructive interference", "\\Delta x=n\\lambda", ["Delta x", "n", "lambda"], ["interference"]],
    ["destructive-interference", "Destructive interference", "\\Delta x=\\left(n+\\frac{1}{2}\\right)\\lambda", ["Delta x", "n", "lambda"], ["interference"]],
    ["ydse-bright-position", "YDSE bright fringe position", "y_n=\\frac{n\\lambda D}{d}", ["y_n", "n", "lambda", "D", "d"], ["interference"]],
    ["single-slit-width", "Single slit central width", "w=\\frac{2\\lambda D}{a}", ["w", "lambda", "D", "a"], ["diffraction"]],
    ["diffraction-grating", "Diffraction grating", "d\\sin\\theta=n\\lambda", ["d", "theta", "n", "lambda"], ["diffraction"]],
    ["polarizer-intensity", "Unpolarized light through polarizer", "I=\\frac{I_0}{2}", ["I", "I_0"], ["polarization"]],
    ["thin-film-reflection", "Thin film condition", "2nt=m\\lambda", ["n", "t", "m", "lambda"], ["interference"]],
    ["rayleigh-criterion", "Rayleigh criterion", "\\theta=1.22\\frac{\\lambda}{D}", ["theta", "lambda", "D"], ["resolution"]],
  ],
  "modern-physics": [
    ["work-function-threshold", "Threshold frequency", "\\nu_0=\\frac{\\phi}{h}", ["nu_0", "phi", "h"], ["photoelectric"]],
    ["stopping-potential", "Stopping potential", "eV_s=K_{max}", ["e", "V_s", "K_max"], ["photoelectric"]],
    ["compton-shift", "Compton shift", "\\Delta\\lambda=\\frac{h}{m_ec}(1-\\cos\\theta)", ["Delta lambda", "h", "m_e", "c", "theta"], ["compton"]],
    ["relativistic-energy", "Relativistic total energy", "E=\\gamma mc^2", ["E", "gamma", "m", "c"], ["relativity"]],
    ["relativistic-momentum", "Relativistic momentum", "p=\\gamma mv", ["p", "gamma", "m", "v"], ["relativity"]],
    ["matter-wave-voltage", "Electron de Broglie wavelength", "\\lambda=\\frac{h}{\\sqrt{2meV}}", ["lambda", "h", "m", "e", "V"], ["matter wave"]],
    ["blackbody-wien", "Wien displacement law", "\\lambda_{max}T=b", ["lambda_max", "T", "b"], ["blackbody"]],
    ["planck-radiation", "Planck quantum relation", "E=n h\\nu", ["E", "n", "h", "nu"], ["quantum"]],
  ],
  "atomic-physics": [
    ["atomic-transition-energy", "Atomic transition energy", "\\Delta E=E_i-E_f", ["Delta E", "E_i", "E_f"], ["spectrum"]],
    ["emission-wavelength", "Emission wavelength", "\\lambda=\\frac{hc}{\\Delta E}", ["lambda", "h", "c", "Delta E"], ["spectrum"]],
    ["bohr-speed", "Bohr electron speed", "v_n=\\frac{v_1}{n}", ["v_n", "v_1", "n"], ["bohr"]],
    ["bohr-radius-hydrogen", "Hydrogen orbit radius", "r_n=0.529n^2\\,\\text{angstrom}", ["r_n", "n"], ["bohr"]],
    ["ionization-energy-hydrogen", "Hydrogen ionization energy", "E_{ion}=13.6\\,eV", ["E_ion"], ["hydrogen"]],
    ["mosley-law", "Moseley law", "\\sqrt{\\nu}=a(Z-b)", ["nu", "a", "Z", "b"], ["x-ray"]],
    ["xray-energy", "X-ray photon energy", "E=h\\nu", ["E", "h", "nu"], ["x-ray"]],
    ["rydberg-frequency", "Spectral line frequency", "\\nu=cR\\left(\\frac{1}{n_1^2}-\\frac{1}{n_2^2}\\right)", ["nu", "c", "R", "n"], ["spectrum"]],
  ],
  "nuclear-physics": [
    ["decay-constant-mean-life", "Mean life", "\\tau=\\frac{1}{\\lambda}", ["tau", "lambda"], ["decay"]],
    ["remaining-fraction", "Remaining radioactive fraction", "\\frac{N}{N_0}=\\left(\\frac{1}{2}\\right)^{t/T_{1/2}}", ["N", "N_0", "t", "T"], ["decay"]],
    ["activity-half-life", "Activity after half-lives", "A=A_0\\left(\\frac{1}{2}\\right)^n", ["A", "A_0", "n"], ["radioactivity"]],
    ["binding-energy-per-nucleon", "Binding energy per nucleon", "\\frac{BE}{A}", ["BE", "A"], ["nucleus"]],
    ["radius-nucleus", "Nuclear radius", "R=R_0A^{1/3}", ["R", "R_0", "A"], ["nucleus"]],
    ["atomic-mass-energy", "Atomic mass energy", "E=931.5\\Delta m\\,MeV", ["E", "Delta m"], ["nucleus"]],
    ["alpha-decay-q", "Alpha decay Q-value", "Q=(M_X-M_Y-M_\\alpha)c^2", ["Q", "M"], ["decay"]],
    ["fission-energy", "Fission energy", "E=(m_{reactants}-m_{products})c^2", ["E", "m", "c"], ["fission"]],
  ],
  "electronics-logic": [
    ["logic-or", "OR gate", "Y=A+B", ["Y", "A", "B"], ["logic"]],
    ["logic-nand", "NAND gate", "Y=\\overline{A\\cdot B}", ["Y", "A", "B"], ["logic"]],
    ["logic-nor", "NOR gate", "Y=\\overline{A+B}", ["Y", "A", "B"], ["logic"]],
    ["logic-xor", "XOR gate", "Y=A\\oplus B", ["Y", "A", "B"], ["logic"]],
    ["voltage-divider", "Voltage divider", "V_{out}=V_{in}\\frac{R_2}{R_1+R_2}", ["V_out", "V_in", "R"], ["circuit"]],
    ["rc-filter-cutoff", "RC cutoff frequency", "f_c=\\frac{1}{2\\pi RC}", ["f_c", "R", "C"], ["filter"]],
    ["op-amp-gain-inverting", "Inverting amplifier gain", "A_v=-\\frac{R_f}{R_{in}}", ["A_v", "R_f", "R_in"], ["op amp"]],
    ["op-amp-gain-noninverting", "Non-inverting amplifier gain", "A_v=1+\\frac{R_f}{R_1}", ["A_v", "R_f", "R_1"], ["op amp"]],
  ],
  "relativity-astrophysics": [
    ["relativistic-mass-energy", "Energy-momentum relation", "E^2=(pc)^2+(mc^2)^2", ["E", "p", "c", "m"], ["relativity"]],
    ["velocity-addition", "Relativistic velocity addition", "u' = \\frac{u+v}{1+uv/c^2}", ["u", "v", "c"], ["relativity"]],
    ["gravitational-redshift-simple", "Gravitational redshift", "\\frac{\\Delta\\lambda}{\\lambda}\\approx\\frac{GM}{Rc^2}", ["Delta lambda", "lambda", "G", "M", "R", "c"], ["redshift"]],
    ["escape-speed-black-hole", "Black hole escape condition", "v_e=c", ["v_e", "c"], ["black hole"]],
    ["luminosity-flux", "Luminosity flux relation", "F=\\frac{L}{4\\pi d^2}", ["F", "L", "d"], ["astronomy"]],
    ["distance-modulus", "Distance modulus", "m-M=5\\log_{10}d-5", ["m", "M", "d"], ["astronomy"]],
    ["stefan-luminosity-star", "Star luminosity", "L=4\\pi R^2\\sigma T^4", ["L", "R", "sigma", "T"], ["star"]],
    ["kepler-binary-mass", "Binary mass relation", "M_1+M_2=\\frac{4\\pi^2a^3}{GT^2}", ["M", "a", "G", "T"], ["binary star"]],
  ],
};

for (const category of formulaCategories) {
  const extra = supplementalFormulaSeeds[category.id] ?? [];
  category.formulas.push(...extra.map(makeFormula));
}

export const allPhysicsFormulas = formulaCategories.flatMap((category) =>
  category.formulas.map((formula) => ({ ...formula, category }))
);

export const formulaBankStats = {
  categories: formulaCategories.length,
  formulas: allPhysicsFormulas.length,
  minPerCategory: Math.min(...formulaCategories.map((category) => category.formulas.length)),
  maxPerCategory: Math.max(...formulaCategories.map((category) => category.formulas.length)),
};
