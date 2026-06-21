export type GraphPresetCategory =
  | "Mechanics"
  | "Waves"
  | "Electricity"
  | "Magnetism"
  | "Optics"
  | "Thermal Physics"
  | "Fluids"
  | "Modern Physics"
  | "Astronomy";

export interface GraphPreset {
  id: string;
  label: string;
  category: GraphPresetCategory;
  xLabel: string;
  yLabel: string;
  relation: string;
  note: string;
  rows: { x: string; y: string }[];
}

type PresetSpec = Omit<GraphPreset, "rows"> & {
  xs: number[];
  fn: (x: number) => number;
  decimals?: number;
};

const g = 9.8;
const c = 3e8;
const h = 6.626e-34;
const k = 8.99e9;
const mu0Over2Pi = 2e-7;
const sigma = 5.67e-8;
const sbc = 1.38e-23;
const eCharge = 1.602e-19;

const range = (start: number, end: number, count: number) => Array.from({ length: count }, (_, index) => start + ((end - start) * index) / Math.max(1, count - 1));
const values = (...items: number[]) => items;
const fmt = (value: number, decimals = 3) => {
  if (!Number.isFinite(value)) return "";
  if (Math.abs(value) >= 100000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(Math.min(4, decimals + 1));
  return Number(value.toFixed(decimals)).toString();
};

function spec(input: PresetSpec): GraphPreset {
  return {
    ...input,
    rows: input.xs.map((x) => ({ x: fmt(x, input.decimals ?? 3), y: fmt(input.fn(x), input.decimals ?? 3) })),
  };
}

const mechanics: GraphPreset[] = [
  spec({ id: "uniform-motion-2", label: "Uniform motion: s = 2t", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Displacement s (m)", relation: "s = vt", note: "Straight line through origin; slope is speed.", xs: range(0, 10, 9), fn: (t) => 2 * t }),
  spec({ id: "uniform-motion-5", label: "Uniform motion: s = 5t", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Displacement s (m)", relation: "s = vt", note: "Higher slope means higher constant speed.", xs: range(0, 10, 9), fn: (t) => 5 * t }),
  spec({ id: "constant-acceleration-vt-2", label: "Constant acceleration: v = 2t", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Velocity v (m/s)", relation: "v = u + at", note: "Velocity-time slope is acceleration.", xs: range(0, 8, 9), fn: (t) => 2 * t }),
  spec({ id: "constant-acceleration-vt-4", label: "Constant acceleration: v = 4t", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Velocity v (m/s)", relation: "v = u + at", note: "Twice the acceleration gives twice the slope.", xs: range(0, 6, 9), fn: (t) => 4 * t }),
  spec({ id: "free-fall-vt", label: "Free fall velocity", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Velocity v (m/s)", relation: "v = gt", note: "Ideal free fall near Earth with no air resistance.", xs: range(0, 3, 10), fn: (t) => g * t }),
  spec({ id: "free-fall-st", label: "Free fall distance", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Distance s (m)", relation: "s = 1/2 gt^2", note: "Parabolic distance-time graph.", xs: range(0, 3, 10), fn: (t) => 0.5 * g * t * t }),
  spec({ id: "projectile-range-angle-20", label: "Projectile range vs angle: u = 20 m/s", category: "Mechanics", xLabel: "Launch angle theta (deg)", yLabel: "Range R (m)", relation: "R = u^2 sin(2theta) / g", note: "Maximum range occurs at 45 degrees on level ground.", xs: values(5, 15, 25, 35, 45, 55, 65, 75, 85), fn: (deg) => (20 ** 2 * Math.sin((2 * deg * Math.PI) / 180)) / g }),
  spec({ id: "projectile-range-speed-45", label: "Projectile range vs speed at 45 deg", category: "Mechanics", xLabel: "Speed u (m/s)", yLabel: "Range R (m)", relation: "R = u^2 / g", note: "At 45 degrees, range varies as speed squared.", xs: values(5, 10, 15, 20, 25, 30, 35), fn: (u) => (u * u) / g }),
  spec({ id: "projectile-height-speed-30", label: "Projectile max height at 30 deg", category: "Mechanics", xLabel: "Speed u (m/s)", yLabel: "Max height H (m)", relation: "H = u^2 sin^2(theta) / 2g", note: "Height depends on the square of vertical launch speed.", xs: values(5, 10, 15, 20, 25, 30, 35), fn: (u) => (u * u * Math.sin(Math.PI / 6) ** 2) / (2 * g) }),
  spec({ id: "centripetal-v", label: "Centripetal acceleration vs speed", category: "Mechanics", xLabel: "Speed v (m/s)", yLabel: "Acceleration a_c (m/s^2)", relation: "a_c = v^2 / r", note: "For r = 2 m, centripetal acceleration is quadratic in speed.", xs: range(0, 12, 9), fn: (v) => (v * v) / 2 }),
  spec({ id: "centripetal-r", label: "Centripetal acceleration vs radius", category: "Mechanics", xLabel: "Radius r (m)", yLabel: "Acceleration a_c (m/s^2)", relation: "a_c = v^2 / r", note: "For v = 10 m/s, acceleration falls inversely with radius.", xs: values(1, 1.5, 2, 3, 4, 5, 8, 10), fn: (r) => 100 / r }),
  spec({ id: "newton-second-mass", label: "Newton's second law: F vs m", category: "Mechanics", xLabel: "Mass m (kg)", yLabel: "Force F (N)", relation: "F = ma", note: "At fixed acceleration 3 m/s^2, force is proportional to mass.", xs: range(0, 10, 9), fn: (m) => 3 * m }),
  spec({ id: "newton-second-acceleration", label: "Newton's second law: F vs a", category: "Mechanics", xLabel: "Acceleration a (m/s^2)", yLabel: "Force F (N)", relation: "F = ma", note: "At fixed mass 4 kg, force is proportional to acceleration.", xs: range(0, 10, 9), fn: (a) => 4 * a }),
  spec({ id: "hooke-law-soft", label: "Hooke's law: k = 50 N/m", category: "Mechanics", xLabel: "Extension x (m)", yLabel: "Force F (N)", relation: "F = kx", note: "Linear elastic spring region.", xs: range(0, 0.5, 8), fn: (x) => 50 * x }),
  spec({ id: "hooke-law-stiff", label: "Hooke's law: k = 120 N/m", category: "Mechanics", xLabel: "Extension x (m)", yLabel: "Force F (N)", relation: "F = kx", note: "Stiffer spring gives larger slope.", xs: range(0, 0.4, 8), fn: (x) => 120 * x }),
  spec({ id: "spring-energy", label: "Spring energy vs extension", category: "Mechanics", xLabel: "Extension x (m)", yLabel: "Elastic energy U (J)", relation: "U = 1/2 kx^2", note: "For k = 80 N/m, stored energy is quadratic.", xs: range(0, 0.5, 8), fn: (x) => 0.5 * 80 * x * x }),
  spec({ id: "kinetic-energy-speed-1kg", label: "Kinetic energy vs speed: 1 kg", category: "Mechanics", xLabel: "Speed v (m/s)", yLabel: "Kinetic energy K (J)", relation: "K = 1/2 mv^2", note: "Kinetic energy grows as speed squared.", xs: range(0, 20, 9), fn: (v) => 0.5 * v * v }),
  spec({ id: "kinetic-energy-speed-5kg", label: "Kinetic energy vs speed: 5 kg", category: "Mechanics", xLabel: "Speed v (m/s)", yLabel: "Kinetic energy K (J)", relation: "K = 1/2 mv^2", note: "Larger mass scales the same quadratic curve upward.", xs: range(0, 20, 9), fn: (v) => 0.5 * 5 * v * v }),
  spec({ id: "gravitational-pe-height", label: "Gravitational PE vs height", category: "Mechanics", xLabel: "Height h (m)", yLabel: "Potential energy U (J)", relation: "U = mgh", note: "For m = 2 kg near Earth, potential energy is linear in height.", xs: range(0, 20, 9), fn: (h0) => 2 * g * h0 }),
  spec({ id: "power-work-time", label: "Power vs time for fixed work", category: "Mechanics", xLabel: "Time t (s)", yLabel: "Power P (W)", relation: "P = W / t", note: "For W = 600 J, power decreases inversely with time.", xs: values(2, 3, 4, 5, 6, 8, 10, 12), fn: (t) => 600 / t }),
  spec({ id: "momentum-speed-2kg", label: "Momentum vs speed: 2 kg", category: "Mechanics", xLabel: "Speed v (m/s)", yLabel: "Momentum p (kg m/s)", relation: "p = mv", note: "Momentum is linear in speed for fixed mass.", xs: range(0, 20, 9), fn: (v) => 2 * v }),
  spec({ id: "impulse-force-time", label: "Impulse vs force", category: "Mechanics", xLabel: "Force F (N)", yLabel: "Impulse J (N s)", relation: "J = F Delta t", note: "For contact time 0.2 s, impulse is proportional to force.", xs: range(0, 100, 9), fn: (f) => 0.2 * f }),
  spec({ id: "pendulum-period-length", label: "Pendulum period vs length", category: "Mechanics", xLabel: "Length L (m)", yLabel: "Period T (s)", relation: "T = 2pi sqrt(L/g)", note: "Small-angle ideal pendulum near Earth.", xs: values(0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2), fn: (l) => 2 * Math.PI * Math.sqrt(l / g) }),
  spec({ id: "pendulum-frequency-length", label: "Pendulum frequency vs length", category: "Mechanics", xLabel: "Length L (m)", yLabel: "Frequency f (Hz)", relation: "f = 1 / 2pi sqrt(g/L)", note: "Frequency falls as pendulum length increases.", xs: values(0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2), fn: (l) => (1 / (2 * Math.PI)) * Math.sqrt(g / l) }),
];

const waves: GraphPreset[] = [
  spec({ id: "wave-speed-frequency", label: "Wave speed vs frequency", category: "Waves", xLabel: "Frequency f (Hz)", yLabel: "Speed v (m/s)", relation: "v = f lambda", note: "For wavelength 0.8 m, speed is proportional to frequency.", xs: range(1, 12, 10), fn: (f) => 0.8 * f }),
  spec({ id: "wave-wavelength-frequency", label: "Wavelength vs frequency", category: "Waves", xLabel: "Frequency f (Hz)", yLabel: "Wavelength lambda (m)", relation: "lambda = v / f", note: "For sound speed 340 m/s, wavelength decreases inversely with frequency.", xs: values(100, 170, 250, 340, 500, 680, 850, 1000), fn: (f) => 340 / f }),
  spec({ id: "string-frequency-length", label: "String fundamental vs length", category: "Waves", xLabel: "Length L (m)", yLabel: "Frequency f (Hz)", relation: "f = v / 2L", note: "For wave speed 120 m/s, a longer string has lower fundamental frequency.", xs: values(0.2, 0.3, 0.4, 0.5, 0.75, 1, 1.25, 1.5), fn: (l) => 120 / (2 * l) }),
  spec({ id: "string-frequency-tension", label: "String frequency vs tension", category: "Waves", xLabel: "Tension T (N)", yLabel: "Frequency f (Hz)", relation: "f = (1/2L) sqrt(T/mu)", note: "For L = 1 m and mu = 0.01 kg/m.", xs: values(5, 10, 20, 30, 40, 60, 80, 100), fn: (t) => 0.5 * Math.sqrt(t / 0.01) }),
  spec({ id: "sound-intensity-distance", label: "Sound intensity vs distance", category: "Waves", xLabel: "Distance r (m)", yLabel: "Intensity I (relative)", relation: "I proportional 1/r^2", note: "Point-source spreading in open space.", xs: values(1, 1.5, 2, 3, 4, 5, 8, 10), fn: (r) => 1 / (r * r), decimals: 5 }),
  spec({ id: "doppler-approach", label: "Doppler frequency: source approaching", category: "Waves", xLabel: "Source speed v_s (m/s)", yLabel: "Observed frequency f' (Hz)", relation: "f' = f v/(v-v_s)", note: "Observer at rest, source approaches; f = 500 Hz, sound speed = 340 m/s.", xs: values(0, 20, 40, 60, 80, 100, 120), fn: (vs) => (500 * 340) / (340 - vs) }),
  spec({ id: "doppler-recede", label: "Doppler frequency: source receding", category: "Waves", xLabel: "Source speed v_s (m/s)", yLabel: "Observed frequency f' (Hz)", relation: "f' = f v/(v+v_s)", note: "Observer at rest, source recedes; f = 500 Hz.", xs: values(0, 20, 40, 60, 80, 100, 120), fn: (vs) => (500 * 340) / (340 + vs) }),
  spec({ id: "shm-displacement-time", label: "SHM displacement vs time", category: "Waves", xLabel: "Time t (s)", yLabel: "Displacement x (m)", relation: "x = A sin(omega t)", note: "A = 0.2 m, period = 2 s.", xs: range(0, 4, 17), fn: (t) => 0.2 * Math.sin(Math.PI * t) }),
  spec({ id: "shm-velocity-time", label: "SHM velocity vs time", category: "Waves", xLabel: "Time t (s)", yLabel: "Velocity v (m/s)", relation: "v = A omega cos(omega t)", note: "A = 0.2 m, omega = pi rad/s.", xs: range(0, 4, 17), fn: (t) => 0.2 * Math.PI * Math.cos(Math.PI * t) }),
  spec({ id: "spring-oscillator-period-mass", label: "Spring oscillator period vs mass", category: "Waves", xLabel: "Mass m (kg)", yLabel: "Period T (s)", relation: "T = 2pi sqrt(m/k)", note: "For spring constant k = 40 N/m.", xs: values(0.1, 0.2, 0.4, 0.6, 0.8, 1, 1.5, 2), fn: (m) => 2 * Math.PI * Math.sqrt(m / 40) }),
  spec({ id: "spring-oscillator-period-k", label: "Spring oscillator period vs spring constant", category: "Waves", xLabel: "Spring constant k (N/m)", yLabel: "Period T (s)", relation: "T = 2pi sqrt(m/k)", note: "For mass m = 1 kg.", xs: values(10, 20, 30, 40, 60, 80, 100, 150), fn: (k0) => 2 * Math.PI * Math.sqrt(1 / k0) }),
  spec({ id: "beats-frequency-difference", label: "Beat frequency", category: "Waves", xLabel: "Frequency difference |f1-f2| (Hz)", yLabel: "Beat frequency (Hz)", relation: "f_beat = |f1 - f2|", note: "Beat frequency equals difference between source frequencies.", xs: range(0, 20, 9), fn: (df) => df }),
];

const electricity: GraphPreset[] = [
  ...[2, 5, 10, 20, 50, 100].map((r) => spec({ id: `ohm-v-i-${r}`, label: `Ohm's law: R = ${r} ohm`, category: "Electricity" as const, xLabel: "Current I (A)", yLabel: "Voltage V (V)", relation: "V = IR", note: "Slope of V-I graph is resistance.", xs: range(0, 1, 9), fn: (i) => r * i })),
  spec({ id: "resistance-length", label: "Resistance vs wire length", category: "Electricity", xLabel: "Length L (m)", yLabel: "Resistance R (ohm)", relation: "R = rho L/A", note: "For fixed material and area, resistance is proportional to length.", xs: range(0.1, 2, 10), fn: (l) => 4 * l }),
  spec({ id: "resistance-area", label: "Resistance vs cross-section area", category: "Electricity", xLabel: "Area A (mm^2)", yLabel: "Resistance R (relative)", relation: "R proportional 1/A", note: "Wider wire has lower resistance.", xs: values(0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3), fn: (a) => 1 / a }),
  spec({ id: "power-current-resistor", label: "Power vs current in resistor", category: "Electricity", xLabel: "Current I (A)", yLabel: "Power P (W)", relation: "P = I^2 R", note: "For R = 10 ohm, heating power is quadratic.", xs: range(0, 2, 9), fn: (i) => 10 * i * i }),
  spec({ id: "power-voltage-resistor", label: "Power vs voltage in resistor", category: "Electricity", xLabel: "Voltage V (V)", yLabel: "Power P (W)", relation: "P = V^2 / R", note: "For R = 8 ohm, power grows as voltage squared.", xs: range(0, 24, 9), fn: (v) => (v * v) / 8 }),
  spec({ id: "capacitor-charge-voltage", label: "Capacitor charge vs voltage", category: "Electricity", xLabel: "Voltage V (V)", yLabel: "Charge Q (mC)", relation: "Q = CV", note: "For C = 2 mF.", xs: range(0, 12, 9), fn: (v) => 2 * v }),
  spec({ id: "capacitor-energy-voltage", label: "Capacitor energy vs voltage", category: "Electricity", xLabel: "Voltage V (V)", yLabel: "Energy U (mJ)", relation: "U = 1/2 CV^2", note: "For C = 2 mF, result shown in mJ.", xs: range(0, 12, 9), fn: (v) => v * v }),
  spec({ id: "coulomb-force-distance", label: "Coulomb force vs distance", category: "Electricity", xLabel: "Distance r (m)", yLabel: "Force F (N)", relation: "F = kq1q2/r^2", note: "For q1 = q2 = 1 microC.", xs: values(0.05, 0.075, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5), fn: (r) => (k * 1e-12) / (r * r) }),
  spec({ id: "electric-field-distance", label: "Electric field vs distance", category: "Electricity", xLabel: "Distance r (m)", yLabel: "Electric field E (N/C)", relation: "E = kq/r^2", note: "For q = 1 microC.", xs: values(0.05, 0.075, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5), fn: (r) => (k * 1e-6) / (r * r) }),
  spec({ id: "rc-charging", label: "RC charging curve", category: "Electricity", xLabel: "Time t (s)", yLabel: "Capacitor voltage V (V)", relation: "V = V0(1 - e^(-t/RC))", note: "V0 = 10 V, RC = 2 s.", xs: range(0, 10, 12), fn: (t) => 10 * (1 - Math.exp(-t / 2)) }),
  spec({ id: "rc-discharging", label: "RC discharging curve", category: "Electricity", xLabel: "Time t (s)", yLabel: "Capacitor voltage V (V)", relation: "V = V0 e^(-t/RC)", note: "V0 = 10 V, RC = 2 s.", xs: range(0, 10, 12), fn: (t) => 10 * Math.exp(-t / 2) }),
  spec({ id: "ac-voltage-time", label: "AC voltage vs time", category: "Electricity", xLabel: "Time t (s)", yLabel: "Voltage V (V)", relation: "V = V0 sin(2pi ft)", note: "Peak voltage 12 V, frequency 1 Hz.", xs: range(0, 2, 17), fn: (t) => 12 * Math.sin(2 * Math.PI * t) }),
  spec({ id: "inductor-energy-current", label: "Inductor energy vs current", category: "Electricity", xLabel: "Current I (A)", yLabel: "Energy U (J)", relation: "U = 1/2 LI^2", note: "For L = 0.8 H.", xs: range(0, 5, 9), fn: (i) => 0.4 * i * i }),
];

const magnetism: GraphPreset[] = [
  spec({ id: "wire-field-current", label: "Magnetic field near wire vs current", category: "Magnetism", xLabel: "Current I (A)", yLabel: "Magnetic field B (microT)", relation: "B = mu0 I / 2pi r", note: "At r = 5 cm from a long straight wire.", xs: range(0, 20, 9), fn: (i) => (mu0Over2Pi * i / 0.05) * 1e6 }),
  spec({ id: "wire-field-distance", label: "Magnetic field near wire vs distance", category: "Magnetism", xLabel: "Distance r (m)", yLabel: "Magnetic field B (microT)", relation: "B = mu0 I / 2pi r", note: "For current I = 10 A.", xs: values(0.02, 0.04, 0.06, 0.08, 0.1, 0.15, 0.2), fn: (r) => (mu0Over2Pi * 10 / r) * 1e6 }),
  spec({ id: "magnetic-force-current", label: "Force on wire vs current", category: "Magnetism", xLabel: "Current I (A)", yLabel: "Force F (N)", relation: "F = BIL", note: "For B = 0.2 T, L = 0.5 m, sin theta = 1.", xs: range(0, 20, 9), fn: (i) => 0.2 * i * 0.5 }),
  spec({ id: "magnetic-force-length", label: "Force on wire vs length", category: "Magnetism", xLabel: "Length L (m)", yLabel: "Force F (N)", relation: "F = BIL", note: "For B = 0.2 T, I = 5 A.", xs: range(0, 2, 9), fn: (l) => 0.2 * 5 * l }),
  spec({ id: "cyclotron-radius-speed", label: "Charged particle radius vs speed", category: "Magnetism", xLabel: "Speed v (10^6 m/s)", yLabel: "Radius r (cm)", relation: "r = mv/qB", note: "Electron in B = 0.01 T; x-axis is millions of m/s.", xs: range(1, 10, 10), fn: (v) => ((9.11e-31 * v * 1e6) / (eCharge * 0.01)) * 100 }),
  spec({ id: "flux-emf-rate", label: "Induced emf vs flux-change rate", category: "Magnetism", xLabel: "dPhi/dt (Wb/s)", yLabel: "emf magnitude (V)", relation: "|epsilon| = N dPhi/dt", note: "For N = 50 turns.", xs: range(0, 0.2, 9), fn: (rate) => 50 * rate }),
];

const optics: GraphPreset[] = [
  spec({ id: "snell-air-glass", label: "Snell's law: air to glass", category: "Optics", xLabel: "Incident angle i (deg)", yLabel: "Refracted angle r (deg)", relation: "n1 sin i = n2 sin r", note: "n1 = 1.00, n2 = 1.50.", xs: values(0, 10, 20, 30, 40, 50, 60, 70), fn: (i) => (180 / Math.PI) * Math.asin(Math.sin((i * Math.PI) / 180) / 1.5) }),
  spec({ id: "snell-glass-air", label: "Snell's law: glass to air", category: "Optics", xLabel: "Incident angle i (deg)", yLabel: "Refracted angle r (deg)", relation: "n1 sin i = n2 sin r", note: "Only below critical angle; n1 = 1.5, n2 = 1.0.", xs: values(0, 5, 10, 15, 20, 25, 30, 35, 40), fn: (i) => (180 / Math.PI) * Math.asin(1.5 * Math.sin((i * Math.PI) / 180)) }),
  spec({ id: "lens-image-distance", label: "Convex lens image distance", category: "Optics", xLabel: "Object distance u (cm)", yLabel: "Image distance v (cm)", relation: "1/f = 1/u + 1/v", note: "For focal length f = 10 cm and u > f.", xs: values(12, 14, 16, 18, 20, 25, 30, 40, 60), fn: (u) => (10 * u) / (u - 10) }),
  spec({ id: "lens-magnification", label: "Convex lens magnification", category: "Optics", xLabel: "Object distance u (cm)", yLabel: "Magnification |m|", relation: "|m| = v/u", note: "For focal length f = 10 cm and u > f.", xs: values(12, 14, 16, 18, 20, 25, 30, 40, 60), fn: (u) => ((10 * u) / (u - 10)) / u }),
  spec({ id: "mirror-image-distance", label: "Concave mirror image distance", category: "Optics", xLabel: "Object distance u (cm)", yLabel: "Image distance v (cm)", relation: "1/f = 1/u + 1/v", note: "Magnitude form for f = 15 cm and u > f.", xs: values(18, 20, 25, 30, 40, 50, 70, 90), fn: (u) => (15 * u) / (u - 15) }),
  spec({ id: "young-fringe-wavelength", label: "Young fringe width vs wavelength", category: "Optics", xLabel: "Wavelength lambda (nm)", yLabel: "Fringe width beta (mm)", relation: "beta = lambda D / d", note: "D = 1 m, d = 0.5 mm.", xs: values(400, 450, 500, 550, 600, 650, 700), fn: (lambdaNm) => ((lambdaNm * 1e-9 * 1) / 0.0005) * 1000 }),
  spec({ id: "young-fringe-distance", label: "Young fringe width vs screen distance", category: "Optics", xLabel: "Screen distance D (m)", yLabel: "Fringe width beta (mm)", relation: "beta = lambda D / d", note: "lambda = 600 nm, d = 0.5 mm.", xs: range(0.2, 2, 10), fn: (dScreen) => ((600e-9 * dScreen) / 0.0005) * 1000 }),
  spec({ id: "diffraction-angle-wavelength", label: "Single-slit first minimum angle", category: "Optics", xLabel: "Wavelength lambda (nm)", yLabel: "Angle theta (deg)", relation: "sin theta = lambda/a", note: "Slit width a = 10 micrometre.", xs: values(400, 450, 500, 550, 600, 650, 700), fn: (lambdaNm) => (180 / Math.PI) * Math.asin((lambdaNm * 1e-9) / 10e-6) }),
  spec({ id: "malus-law", label: "Malus law intensity", category: "Optics", xLabel: "Analyzer angle theta (deg)", yLabel: "Relative intensity I/I0", relation: "I = I0 cos^2 theta", note: "Polarized light through an analyzer.", xs: values(0, 15, 30, 45, 60, 75, 90), fn: (theta) => Math.cos((theta * Math.PI) / 180) ** 2 }),
  spec({ id: "inverse-square-light", label: "Light intensity vs distance", category: "Optics", xLabel: "Distance r (m)", yLabel: "Relative intensity", relation: "I proportional 1/r^2", note: "Point-source light in open space.", xs: values(1, 1.5, 2, 3, 4, 5, 8, 10), fn: (r) => 1 / (r * r), decimals: 5 }),
];

const thermal: GraphPreset[] = [
  spec({ id: "heat-temperature-water", label: "Heating water: Q vs Delta T", category: "Thermal Physics", xLabel: "Temperature change Delta T (C)", yLabel: "Heat Q (kJ)", relation: "Q = mc Delta T", note: "For 1 kg water, c = 4180 J/kg C.", xs: range(0, 80, 9), fn: (dt) => (1 * 4180 * dt) / 1000 }),
  spec({ id: "heat-mass-water", label: "Heating water: Q vs mass", category: "Thermal Physics", xLabel: "Mass m (kg)", yLabel: "Heat Q (kJ)", relation: "Q = mc Delta T", note: "For Delta T = 20 C.", xs: range(0.1, 2, 10), fn: (m) => (m * 4180 * 20) / 1000 }),
  spec({ id: "ideal-gas-pressure-volume", label: "Boyle's law", category: "Thermal Physics", xLabel: "Volume V (L)", yLabel: "Pressure P (kPa)", relation: "PV = constant", note: "Constant temperature with PV = 240 kPa L.", xs: values(1, 1.5, 2, 3, 4, 5, 6, 8), fn: (v) => 240 / v }),
  spec({ id: "charles-law", label: "Charles' law", category: "Thermal Physics", xLabel: "Temperature T (K)", yLabel: "Volume V (L)", relation: "V proportional T", note: "At constant pressure, V/T = 0.01 L/K.", xs: values(250, 275, 300, 325, 350, 375, 400), fn: (t) => 0.01 * t }),
  spec({ id: "gay-lussac-law", label: "Pressure law", category: "Thermal Physics", xLabel: "Temperature T (K)", yLabel: "Pressure P (kPa)", relation: "P proportional T", note: "At constant volume, P/T = 0.33 kPa/K.", xs: values(250, 275, 300, 325, 350, 375, 400), fn: (t) => 0.33 * t }),
  spec({ id: "rms-speed-temperature", label: "RMS gas speed vs temperature", category: "Thermal Physics", xLabel: "Temperature T (K)", yLabel: "RMS speed (m/s)", relation: "v_rms = sqrt(3RT/M)", note: "For nitrogen gas, M = 0.028 kg/mol.", xs: values(200, 250, 300, 350, 400, 500, 600), fn: (t) => Math.sqrt((3 * 8.314 * t) / 0.028) }),
  spec({ id: "radiation-power-temperature", label: "Blackbody radiation vs temperature", category: "Thermal Physics", xLabel: "Temperature T (K)", yLabel: "Power per area (W/m^2)", relation: "P/A = sigma T^4", note: "Stefan-Boltzmann law for an ideal blackbody.", xs: values(250, 300, 350, 400, 450, 500, 600), fn: (t) => sigma * t ** 4 }),
  spec({ id: "conduction-rate-area", label: "Conduction rate vs area", category: "Thermal Physics", xLabel: "Area A (m^2)", yLabel: "Heat rate H (W)", relation: "H = kA Delta T/L", note: "For k = 0.8 W/mK, Delta T = 20 K, L = 0.1 m.", xs: range(0.01, 0.2, 9), fn: (a) => (0.8 * a * 20) / 0.1 }),
  spec({ id: "conduction-rate-thickness", label: "Conduction rate vs thickness", category: "Thermal Physics", xLabel: "Thickness L (m)", yLabel: "Heat rate H (W)", relation: "H = kA Delta T/L", note: "For k = 0.8 W/mK, A = 0.1 m^2, Delta T = 20 K.", xs: values(0.02, 0.04, 0.06, 0.08, 0.1, 0.15, 0.2), fn: (l) => (0.8 * 0.1 * 20) / l }),
  spec({ id: "newton-cooling", label: "Newton's law of cooling", category: "Thermal Physics", xLabel: "Time t (min)", yLabel: "Temperature T (C)", relation: "T = T_env + (T0-T_env)e^(-kt)", note: "T0 = 90 C, environment = 25 C, k = 0.12 per min.", xs: range(0, 30, 11), fn: (t) => 25 + 65 * Math.exp(-0.12 * t) }),
];

const fluids: GraphPreset[] = [
  spec({ id: "pressure-force-area", label: "Pressure vs force", category: "Fluids", xLabel: "Force F (N)", yLabel: "Pressure P (Pa)", relation: "P = F/A", note: "For area A = 0.25 m^2.", xs: range(0, 100, 9), fn: (f) => f / 0.25 }),
  spec({ id: "hydrostatic-depth-water", label: "Hydrostatic pressure vs depth", category: "Fluids", xLabel: "Depth h (m)", yLabel: "Gauge pressure P (kPa)", relation: "P = rho gh", note: "For water, rho = 1000 kg/m^3.", xs: range(0, 20, 9), fn: (h0) => (1000 * g * h0) / 1000 }),
  spec({ id: "buoyant-force-volume", label: "Buoyant force vs displaced volume", category: "Fluids", xLabel: "Volume V (m^3)", yLabel: "Buoyant force F_b (N)", relation: "F_b = rho g V", note: "For water.", xs: range(0, 0.1, 9), fn: (v) => 1000 * g * v }),
  spec({ id: "bernoulli-dynamic-pressure", label: "Dynamic pressure vs speed", category: "Fluids", xLabel: "Speed v (m/s)", yLabel: "Dynamic pressure q (Pa)", relation: "q = 1/2 rho v^2", note: "For air, rho = 1.2 kg/m^3.", xs: range(0, 40, 9), fn: (v) => 0.5 * 1.2 * v * v }),
  spec({ id: "continuity-speed-area", label: "Continuity speed vs area", category: "Fluids", xLabel: "Area A (cm^2)", yLabel: "Speed v (m/s)", relation: "Av = constant", note: "Flow rate = 0.001 m^3/s; x-axis in cm^2.", xs: values(2, 4, 6, 8, 10, 15, 20, 25), fn: (areaCm2) => 0.001 / (areaCm2 * 1e-4) }),
  spec({ id: "poiseuille-radius", label: "Poiseuille flow vs radius", category: "Fluids", xLabel: "Tube radius r (mm)", yLabel: "Relative flow rate", relation: "Q proportional r^4", note: "Laminar tube flow is extremely sensitive to radius.", xs: values(0.5, 0.75, 1, 1.25, 1.5, 2, 2.5), fn: (r) => r ** 4 }),
  spec({ id: "terminal-speed-radius", label: "Stokes terminal speed vs radius", category: "Fluids", xLabel: "Radius r (mm)", yLabel: "Relative terminal speed", relation: "v_t proportional r^2", note: "Small sphere in viscous flow under Stokes law.", xs: values(0.2, 0.4, 0.6, 0.8, 1, 1.5, 2), fn: (r) => r * r }),
  spec({ id: "surface-tension-force", label: "Surface tension force vs length", category: "Fluids", xLabel: "Contact length L (m)", yLabel: "Force F (N)", relation: "F = gamma L", note: "For gamma = 0.072 N/m.", xs: range(0, 0.5, 9), fn: (l) => 0.072 * l }),
];

const modern: GraphPreset[] = [
  spec({ id: "photon-energy-frequency", label: "Photon energy vs frequency", category: "Modern Physics", xLabel: "Frequency f (10^14 Hz)", yLabel: "Energy E (eV)", relation: "E = hf", note: "Photon energy expressed in electron-volts.", xs: range(1, 10, 10), fn: (f14) => (h * f14 * 1e14) / eCharge }),
  spec({ id: "photoelectric-ke-frequency", label: "Photoelectric KE vs frequency", category: "Modern Physics", xLabel: "Frequency f (10^14 Hz)", yLabel: "Max KE (eV)", relation: "Kmax = hf - phi", note: "Work function phi = 2 eV; negative values clipped to zero.", xs: range(3, 12, 10), fn: (f14) => Math.max(0, (h * f14 * 1e14) / eCharge - 2) }),
  spec({ id: "de-broglie-electron", label: "de Broglie wavelength vs momentum", category: "Modern Physics", xLabel: "Momentum p (10^-24 kg m/s)", yLabel: "Wavelength lambda (nm)", relation: "lambda = h/p", note: "Matter wavelength falls inversely with momentum.", xs: values(0.5, 0.75, 1, 1.5, 2, 3, 4, 5), fn: (p24) => (h / (p24 * 1e-24)) * 1e9 }),
  spec({ id: "radioactive-decay", label: "Radioactive decay", category: "Modern Physics", xLabel: "Time t (half-lives)", yLabel: "Remaining fraction", relation: "N/N0 = (1/2)^t", note: "Classic exponential decay.", xs: range(0, 6, 13), fn: (t) => 0.5 ** t, decimals: 5 }),
  spec({ id: "activity-decay", label: "Activity decay", category: "Modern Physics", xLabel: "Time t (half-lives)", yLabel: "Activity A (relative)", relation: "A/A0 = (1/2)^t", note: "Activity follows the same exponential factor as undecayed nuclei.", xs: range(0, 6, 13), fn: (t) => 0.5 ** t, decimals: 5 }),
  spec({ id: "mass-energy", label: "Mass-energy equivalence", category: "Modern Physics", xLabel: "Mass m (microgram)", yLabel: "Energy E (GJ)", relation: "E = mc^2", note: "Even tiny mass corresponds to large energy.", xs: range(0, 10, 9), fn: (microgram) => ((microgram * 1e-9) * c * c) / 1e9 }),
  spec({ id: "relativistic-gamma", label: "Lorentz factor vs speed", category: "Modern Physics", xLabel: "Speed v/c", yLabel: "Gamma", relation: "gamma = 1/sqrt(1-v^2/c^2)", note: "Relativistic effects grow rapidly near light speed.", xs: values(0, 0.1, 0.2, 0.4, 0.6, 0.75, 0.85, 0.9, 0.95), fn: (beta) => 1 / Math.sqrt(1 - beta * beta) }),
  spec({ id: "bohr-energy-level", label: "Hydrogen energy level", category: "Modern Physics", xLabel: "Quantum number n", yLabel: "Energy E_n (eV)", relation: "E_n = -13.6/n^2", note: "Bound-state energy levels of hydrogen.", xs: values(1, 2, 3, 4, 5, 6, 8, 10), fn: (n) => -13.6 / (n * n) }),
  spec({ id: "blackbody-peak", label: "Wien peak wavelength", category: "Modern Physics", xLabel: "Temperature T (K)", yLabel: "Peak wavelength lambda_max (micrometre)", relation: "lambda_max T = 2.898e-3 m K", note: "Hotter blackbodies peak at shorter wavelengths.", xs: values(2500, 3000, 4000, 5000, 5800, 7000, 9000), fn: (t) => (2.898e-3 / t) * 1e6 }),
  spec({ id: "brownian-rms", label: "Thermal energy vs temperature", category: "Modern Physics", xLabel: "Temperature T (K)", yLabel: "kT (meV)", relation: "E = kT", note: "Thermal energy scale expressed in meV.", xs: values(50, 100, 150, 200, 250, 300, 350, 400), fn: (t) => ((sbc * t) / eCharge) * 1000 }),
];

const astronomy: GraphPreset[] = [
  spec({ id: "orbital-speed-radius-earth", label: "Orbital speed vs radius around Earth", category: "Astronomy", xLabel: "Orbital radius r (Earth radii)", yLabel: "Speed v (km/s)", relation: "v = sqrt(GM/r)", note: "Circular orbit speed around Earth.", xs: values(1, 1.2, 1.5, 2, 3, 5, 8, 10), fn: (rEarth) => Math.sqrt(3.986e14 / (rEarth * 6.371e6)) / 1000 }),
  spec({ id: "orbital-period-radius-earth", label: "Orbital period vs radius around Earth", category: "Astronomy", xLabel: "Orbital radius r (Earth radii)", yLabel: "Period T (hours)", relation: "T = 2pi sqrt(r^3/GM)", note: "Keplerian circular orbit period around Earth.", xs: values(1, 1.2, 1.5, 2, 3, 5, 8, 10), fn: (rEarth) => (2 * Math.PI * Math.sqrt((rEarth * 6.371e6) ** 3 / 3.986e14)) / 3600 }),
  spec({ id: "escape-speed-radius-earth", label: "Escape speed vs radius", category: "Astronomy", xLabel: "Radius r (Earth radii)", yLabel: "Escape speed v_e (km/s)", relation: "v_e = sqrt(2GM/r)", note: "Escape speed decreases with distance from Earth.", xs: values(1, 1.2, 1.5, 2, 3, 5, 8, 10), fn: (rEarth) => Math.sqrt((2 * 3.986e14) / (rEarth * 6.371e6)) / 1000 }),
  spec({ id: "gravity-radius-earth", label: "Gravity vs distance from Earth", category: "Astronomy", xLabel: "Radius r (Earth radii)", yLabel: "g (m/s^2)", relation: "g = GM/r^2", note: "Inverse-square gravitational field.", xs: values(1, 1.2, 1.5, 2, 3, 5, 8, 10), fn: (rEarth) => 9.8 / (rEarth * rEarth) }),
  spec({ id: "kepler-third-law", label: "Kepler third law", category: "Astronomy", xLabel: "Semi-major axis a (AU)", yLabel: "Period T (years)", relation: "T = a^(3/2)", note: "Solar-system form using AU and years.", xs: values(0.39, 0.72, 1, 1.52, 2, 3, 5.2, 9.5), fn: (a) => a ** 1.5 }),
  spec({ id: "stellar-luminosity-radius", label: "Luminosity vs radius", category: "Astronomy", xLabel: "Radius R (solar radii)", yLabel: "Luminosity L (solar units)", relation: "L proportional R^2 T^4", note: "At fixed temperature equal to the Sun.", xs: values(0.2, 0.5, 1, 1.5, 2, 3, 5, 10), fn: (r) => r * r }),
  spec({ id: "hubble-law", label: "Hubble law", category: "Astronomy", xLabel: "Distance d (Mpc)", yLabel: "Recession speed v (km/s)", relation: "v = H0 d", note: "Using H0 = 70 km/s/Mpc.", xs: range(0, 500, 9), fn: (d) => 70 * d }),
  spec({ id: "redshift-speed-small", label: "Small-redshift speed", category: "Astronomy", xLabel: "Redshift z", yLabel: "Speed v (km/s)", relation: "v approximately cz", note: "Low-redshift approximation.", xs: values(0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.08, 0.1), fn: (z) => 300000 * z }),
];

const extraValidationPresets: GraphPreset[] = [
  spec({ id: "density-mass-volume", label: "Density relation: mass vs volume", category: "Fluids", xLabel: "Volume V (m^3)", yLabel: "Mass m (kg)", relation: "m = rho V", note: "For water, rho = 1000 kg/m^3.", xs: range(0, 0.02, 9), fn: (v) => 1000 * v }),
  spec({ id: "pressure-depth-mercury", label: "Hydrostatic pressure in mercury", category: "Fluids", xLabel: "Depth h (m)", yLabel: "Gauge pressure P (kPa)", relation: "P = rho gh", note: "For mercury, rho = 13600 kg/m^3.", xs: range(0, 1, 9), fn: (h0) => (13600 * g * h0) / 1000 }),
  spec({ id: "thermal-expansion-linear", label: "Linear thermal expansion", category: "Thermal Physics", xLabel: "Temperature change Delta T (C)", yLabel: "Expansion Delta L (mm)", relation: "Delta L = alpha L Delta T", note: "Steel rod, alpha = 12e-6 /C, L = 2 m.", xs: range(0, 100, 9), fn: (dt) => 12e-6 * 2 * dt * 1000 }),
  spec({ id: "lens-power-focal-length", label: "Lens power vs focal length", category: "Optics", xLabel: "Focal length f (m)", yLabel: "Power P (diopter)", relation: "P = 1/f", note: "Shorter focal length gives stronger lens power.", xs: values(0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 0.75, 1), fn: (f) => 1 / f }),
  spec({ id: "transformer-voltage-turns", label: "Transformer output voltage", category: "Electricity", xLabel: "Secondary turns N_s", yLabel: "Secondary voltage V_s (V)", relation: "V_s/V_p = N_s/N_p", note: "V_p = 12 V, N_p = 100 turns.", xs: values(25, 50, 75, 100, 150, 200, 300, 400), fn: (ns) => (12 * ns) / 100 }),
  spec({ id: "gravitational-force-distance", label: "Gravitational force vs distance", category: "Astronomy", xLabel: "Separation r (Earth radii)", yLabel: "Relative force", relation: "F proportional 1/r^2", note: "Inverse-square gravity normalized to 1 at one Earth radius.", xs: values(1, 1.25, 1.5, 2, 3, 4, 6, 8, 10), fn: (r) => 1 / (r * r), decimals: 5 }),
];

export const graphPresets: GraphPreset[] = [
  ...mechanics,
  ...waves,
  ...electricity,
  ...magnetism,
  ...optics,
  ...thermal,
  ...fluids,
  ...modern,
  ...astronomy,
  ...extraValidationPresets,
];

export const graphPresetCategories: ("All" | GraphPresetCategory)[] = [
  "All",
  "Mechanics",
  "Waves",
  "Electricity",
  "Magnetism",
  "Optics",
  "Thermal Physics",
  "Fluids",
  "Modern Physics",
  "Astronomy",
];
