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

export const allPhysicsFormulas = formulaCategories.flatMap((category) =>
  category.formulas.map((formula) => ({ ...formula, category }))
);

export const formulaBankStats = {
  categories: formulaCategories.length,
  formulas: allPhysicsFormulas.length,
  minPerCategory: Math.min(...formulaCategories.map((category) => category.formulas.length)),
  maxPerCategory: Math.max(...formulaCategories.map((category) => category.formulas.length)),
};
