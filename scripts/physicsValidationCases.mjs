const deg = (value) => (value * Math.PI) / 180;
const round = (value, places = 12) => Number(value.toFixed(places));

const caseOf = (domain, name, actual, expected, tolerance = 1e-9) => ({ domain, name, actual, expected, tolerance });
const throwsCase = (domain, name, fn) => ({ domain, name, throws: fn });

function freeFallDistance(u, g, t) { return u * t + 0.5 * g * t * t; }
function freeFallVelocity(u, g, t) { return u + g * t; }
function projectileRange(v, angle, g) { return (v * v * Math.sin(2 * deg(angle))) / g; }
function projectileTime(v, angle, g) { return (2 * v * Math.sin(deg(angle))) / g; }
function newtonSecondLaw(force, mass) { if (mass <= 0) throw new Error("Mass must be positive."); return force / mass; }
function hookeForce(k, x) { return -k * x; }
function pendulumPeriod(length, g) { if (length <= 0 || g <= 0) throw new Error("Length and gravity must be positive."); return 2 * Math.PI * Math.sqrt(length / g); }
function kineticEnergy(m, v) { if (m <= 0) throw new Error("Mass must be positive."); return 0.5 * m * v * v; }
function potentialEnergy(m, g, h) { if (m <= 0) throw new Error("Mass must be positive."); return m * g * h; }
function pressure(force, area) { if (area <= 0) throw new Error("Area must be positive."); return force / area; }
function hydrostaticPressure(rho, g, h, p0 = 0) { return p0 + rho * g * h; }
function buoyantForce(rho, g, volume) { return rho * g * volume; }
function idealGasPressure(n, t, v) { if (v <= 0 || t < 0) throw new Error("Volume must be positive and temperature must be absolute."); return (n * 8.31446261815324 * t) / v; }
function ohmsLawVoltage(i, r) { return i * r; }
function seriesResistance(...rs) { return rs.reduce((sum, value) => sum + value, 0); }
function parallelResistance(...rs) { if (rs.some((value) => value <= 0)) throw new Error("Parallel resistances must be positive."); return 1 / rs.reduce((sum, value) => sum + 1 / value, 0); }
function snellRefractionAngle(i, n1, n2) { const x = (n1 * Math.sin(deg(i))) / n2; if (Math.abs(x) > 1) throw new Error("Total internal reflection; no refracted ray."); return Math.asin(x) * 180 / Math.PI; }
function lensImageDistance(f, u) { const d = 1 / f + 1 / u; if (d === 0) throw new Error("Image at infinity."); return 1 / d; }
function mirrorImageDistance(f, u) { const d = 1 / f - 1 / u; if (d === 0) throw new Error("Image at infinity."); return 1 / d; }
function waveSpeed(f, lambda) { return f * lambda; }
function photoelectricKineticEnergy(photon, work) { return Math.max(0, photon - work); }
function halfLifeRemaining(n0, elapsed, halfLife) { if (halfLife <= 0) throw new Error("Half-life must be positive."); return n0 * 0.5 ** (elapsed / halfLife); }

export const numericValidationCases = [
  ...[
    [0, 9.8, 2, 19.6], [5, 9.8, 3, 59.1], [12, 9.81, 1.5, 29.03625], [-3, 10, 4, 68],
    [0, 1.62, 5, 20.25], [2, 3.7, 6, 78.6], [15, 9.8, 0, 0], [1.2, 9.81, 2.4, 31.1328],
  ].map(([u, g, t, expected], i) => caseOf("Kinematics", `Free fall distance ${i + 1}`, round(freeFallDistance(u, g, t)), expected)),
  ...[
    [0, 9.8, 3, 29.4], [5, 9.8, 2, 24.6], [-10, 10, 1, 0], [2.5, 1.62, 10, 18.7],
    [20, -9.8, 2, 0.4], [1, 3.7, 4, 15.8],
  ].map(([u, g, t, expected], i) => caseOf("Kinematics", `Free fall velocity ${i + 1}`, round(freeFallVelocity(u, g, t)), expected)),
  ...[
    [10, 45, 10, 10], [20, 30, 10, 34.641016151378], [15, 60, 9.8, 19.883236311377],
    [25, 40, 9.81, 62.742593846344], [12, 15, 9.8, 7.34693877551], [18, 75, 9.8, 16.530612244898],
  ].map(([v, a, g, expected], i) => caseOf("Kinematics", `Projectile range ${i + 1}`, projectileRange(v, a, g), expected, 1e-9)),
  ...[
    [10, 30, 10, 1], [20, 45, 10, 2.828427124746], [15, 60, 9.8, 2.65109817485],
    [28, 42, 9.81, 3.819705805922],
  ].map(([v, a, g, expected], i) => caseOf("Kinematics", `Projectile time ${i + 1}`, projectileTime(v, a, g), expected, 1e-9)),

  ...[
    [10, 2, 5], [50, 10, 5], [-12, 3, -4], [0, 5, 0], [1.5, 0.5, 3], [98, 10, 9.8],
  ].map(([f, m, expected], i) => caseOf("Dynamics", `Newton second law ${i + 1}`, newtonSecondLaw(f, m), expected)),
  ...[
    [100, 0.2, -20], [250, 0.04, -10], [50, -0.1, 5], [0, 4, 0], [12.5, 3.2, -40],
  ].map(([k, x, expected], i) => caseOf("Dynamics", `Hooke force ${i + 1}`, hookeForce(k, x), expected)),
  ...[
    [1, 9.80665, 2.006409292589], [0.25, 9.80665, 1.003204646294], [4, 9.80665, 4.012818585178],
    [1, 1.62, 4.936536597954], [2.5, 9.8, 3.17348781297],
  ].map(([l, g, expected], i) => caseOf("Dynamics", `Pendulum period ${i + 1}`, pendulumPeriod(l, g), expected, 1e-9)),
  throwsCase("Dynamics", "Newton rejects zero mass", () => newtonSecondLaw(10, 0)),
  throwsCase("Dynamics", "Pendulum rejects negative length", () => pendulumPeriod(-1, 9.8)),

  ...[
    [1, 10, 50], [2, 3, 9], [0.5, 20, 100], [75, 0, 0], [4.2, 6.5, 88.725], [0.1, 340, 5780],
  ].map(([m, v, expected], i) => caseOf("Energy", `Kinetic energy ${i + 1}`, kineticEnergy(m, v), expected)),
  ...[
    [1, 9.8, 10, 98], [2, 9.81, 5, 98.1], [0.5, 1.62, 20, 16.2], [10, 3.7, 2, 74],
    [12, 9.8, 0, 0], [1.5, 9.8, -2, -29.4],
  ].map(([m, g, h, expected], i) => caseOf("Energy", `Potential energy ${i + 1}`, potentialEnergy(m, g, h), expected)),
  throwsCase("Energy", "Kinetic energy rejects negative mass", () => kineticEnergy(-1, 2)),

  ...[
    [10, 2, 5], [100, 4, 25], [1, 0.5, 2], [0, 9, 0], [2500, 0.25, 10000],
  ].map(([f, a, expected], i) => caseOf("Fluids", `Pressure ${i + 1}`, pressure(f, a), expected)),
  ...[
    [1000, 9.8, 10, 98000], [1000, 9.81, 5, 49050], [1025, 9.8, 2, 20090],
    [800, 10, 1.5, 12000], [1000, 9.8, 0, 0], [1000, 9.8, 10, 101325, 199325],
  ].map(([rho, g, h, p0OrExpected, expectedMaybe], i) => caseOf("Fluids", `Hydrostatic pressure ${i + 1}`, hydrostaticPressure(rho, g, h, expectedMaybe === undefined ? 0 : p0OrExpected), expectedMaybe ?? p0OrExpected)),
  ...[
    [1000, 9.8, 0.01, 98], [1000, 9.81, 0.5, 4905], [800, 10, 2, 16000], [1.2, 9.8, 10, 117.6],
  ].map(([rho, g, v, expected], i) => caseOf("Fluids", `Buoyant force ${i + 1}`, buoyantForce(rho, g, v), expected)),
  throwsCase("Fluids", "Pressure rejects zero area", () => pressure(1, 0)),

  ...[
    [1, 300, 0.024943, 100000, 5], [2, 273.15, 0.0448, 101388.190364, 1e-6], [1, 600, 0.024943, 200000, 10],
    [0.5, 300, 0.01, 124716.939272, 1e-6], [10, 298, 1, 24777.098602, 1e-6], [1, 0, 1, 0, 1e-12],
  ].map(([n, t, v, expected, tol], i) => caseOf("Thermodynamics", `Ideal gas pressure ${i + 1}`, idealGasPressure(n, t, v), expected, tol)),
  throwsCase("Thermodynamics", "Ideal gas rejects zero volume", () => idealGasPressure(1, 300, 0)),
  throwsCase("Thermodynamics", "Ideal gas rejects negative absolute temperature", () => idealGasPressure(1, -1, 1)),

  ...[
    [2, 5, 10], [0.5, 100, 50], [-1, 10, -10], [0, 10, 0], [3.3, 4.7, 15.51],
  ].map(([i, r, expected], idx) => caseOf("Electricity", `Ohm law ${idx + 1}`, ohmsLawVoltage(i, r), expected)),
  ...[
    [[1, 2, 3], 6], [[10, 20], 30], [[0, 5], 5], [[2.5, 2.5, 2.5], 7.5], [[100], 100],
  ].map(([rs, expected], i) => caseOf("Electricity", `Series resistance ${i + 1}`, seriesResistance(...rs), expected)),
  ...[
    [[10, 10], 5], [[2, 3], 1.2], [[4, 4, 4], 1.333333333333], [[100, 200], 66.666666666667], [[6, 3, 2], 1],
  ].map(([rs, expected], i) => caseOf("Electricity", `Parallel resistance ${i + 1}`, parallelResistance(...rs), expected, 1e-9)),
  throwsCase("Electricity", "Parallel resistance rejects zero", () => parallelResistance(1, 0)),

  ...[
    [30, 1, 1.5, 19.471220634491], [45, 1, 1.41421356237, 30], [0, 1, 1.5, 0],
    [60, 1, 2, 25.658906273256], [20, 1.5, 1, 30.865882473087],
  ].map(([i, n1, n2, expected], idx) => caseOf("Optics", `Snell law ${idx + 1}`, snellRefractionAngle(i, n1, n2), expected, 1e-9)),
  ...[
    [10, 30, 7.5], [20, 20, 10], [15, 45, 11.25], [-10, 30, -15], [5, 100, 4.761904761905],
  ].map(([f, u, expected], i) => caseOf("Optics", `Lens formula ${i + 1}`, lensImageDistance(f, u), expected, 1e-9)),
  ...[
    [10, 30, 15], [20, 60, 30], [15, 45, 22.5], [-10, 30, -7.5], [5, 100, 5.263157894737],
  ].map(([f, u, expected], i) => caseOf("Optics", `Mirror formula ${i + 1}`, mirrorImageDistance(f, u), expected, 1e-9)),
  throwsCase("Optics", "Snell law detects total internal reflection", () => snellRefractionAngle(50, 1.5, 1)),
  throwsCase("Optics", "Mirror image at infinity rejected", () => mirrorImageDistance(10, 10)),

  ...[
    [10, 2, 20], [440, 0.78, 343.2], [50, 6.86, 343], [1, 3e8, 3e8], [2.4e9, 0.125, 3e8],
    [0, 10, 0], [100, 0, 0], [256, 1.34, 343.04], [60, 5.72, 343.2], [5, 0.2, 1],
  ].map(([f, lambda, expected], i) => caseOf("Waves", `Wave speed ${i + 1}`, waveSpeed(f, lambda), expected, Math.max(1e-9, Math.abs(expected) * 1e-12))),

  ...[
    [3, 2, 1], [2, 3, 0], [5.5, 2.25, 3.25], [0, 1, 0], [10, 4.7, 5.3],
  ].map(([photon, work, expected], i) => caseOf("Modern Physics", `Photoelectric energy ${i + 1}`, photoelectricKineticEnergy(photon, work), expected)),
  ...[
    [100, 20, 10, 25], [80, 5, 5, 40], [64, 18, 6, 8], [1000, 0, 10, 1000],
    [500, 30, 10, 62.5], [1, 100, 25, 0.0625],
  ].map(([n0, elapsed, halfLife, expected], i) => caseOf("Modern Physics", `Half-life ${i + 1}`, halfLifeRemaining(n0, elapsed, halfLife), expected)),
  throwsCase("Modern Physics", "Half-life rejects zero", () => halfLifeRemaining(100, 1, 0)),
];
