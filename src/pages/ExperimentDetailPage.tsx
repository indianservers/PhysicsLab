import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { ProjectileExperiment } from "../components/ProjectileExperiment";
import { LearningPanel } from "../components/LearningPanel";
import { getAssignment } from "../lib/teacher";
import { GuidedVisualization } from "../components/GuidedVisualization";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { GuidePanel } from "../components/GuidePanel";
import { guideForExperiment } from "../lib/guides";
import { ExperimentLearningCoach } from "../components/ExperimentLearningCoach";

export function ExperimentDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const experiment = experiments.find((item) => item.id === id) ?? experiments[0];
  const assignment = getAssignment(new URLSearchParams(location.search).get("assignment"));
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div id="content" className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-md border border-cyan-400/40 bg-cyan-400/10 text-cyan-500">
              <PhysicsIcon name={iconForExperiment(experiment)} className="h-6 w-6" />
            </span>
            <div>
            <Link to="/experiments" className="text-sm text-cyan-500">Experiments</Link>
            <h1 className="text-3xl font-bold">{experiment.title}</h1>
            {experiment.curriculumTags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {experiment.curriculumTags.classes.map((grade) => <span key={grade} className="badge">Class {grade}</span>)}
                {experiment.curriculumTags.domains.map((domain) => <span key={domain} className="badge">{domain}</span>)}
              </div>
            )}
            </div>
          </div>
          <Link to="/lab" className="hero-btn-secondary inline-flex items-center gap-2"><PhysicsIcon name="flask" className="h-4 w-4" />Open full lab workspace</Link>
        </div>
        {assignment && <AssignmentBanner assignment={assignment} />}
        <GuidePanel guide={guideForExperiment(experiment)} defaultOpen />
        {experiment.id === "projectile-motion" ? <ProjectileExperiment experiment={experiment} /> : <GenericExperiment experiment={experiment} />}
        <LearningPanel experiment={experiment} />
      </div>
    </div>
  );
}

function AssignmentBanner({ assignment }: { assignment: NonNullable<ReturnType<typeof getAssignment>> }) {
  return (
    <section className="panel mb-4 border-cyan-400/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Assigned lab</p>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-black"><PhysicsIcon name="teacher" className="h-5 w-5 text-cyan-500" />{assignment.title}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{assignment.instructions}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {assignment.dueDate && <span className="badge">Due {assignment.dueDate}</span>}
          {assignment.lockVariables && <span className="badge">Variables locked</span>}
          {assignment.requireNotebook && <span className="badge">Notebook required</span>}
          {assignment.requireQuiz && <span className="badge">Quiz required</span>}
        </div>
      </div>
    </section>
  );
}

function GenericExperiment({ experiment }: { experiment: typeof experiments[number] }) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const [c, setC] = useState(0.2);
  const results = calculateStarterLab(experiment.id, a, b, c);
  const setters = [setA, setB, setC];
  const setAll = (values: number[]) => {
    setA(values[0] ?? a);
    setB(values[1] ?? b);
    setC(values[2] ?? c);
  };
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="panel p-4">
        <h2 className="panel-title flex items-center gap-2"><PhysicsIcon name="compass" className="h-5 w-5 text-cyan-500" />Aim</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{experiment.aim}</p>
        <h2 className="panel-title mt-5 flex items-center gap-2"><PhysicsIcon name="clipboard" className="h-5 w-5 text-cyan-500" />Procedure</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
          {experiment.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h2 className="panel-title mt-5 flex items-center gap-2"><PhysicsIcon name="check" className="h-5 w-5 text-cyan-500" />Viva Questions</h2>
        <div className="mt-2 space-y-2 text-sm">
          {experiment.vivaQuestions.map((question) => (
            <details key={question.prompt} className="rounded border border-slate-300/60 p-2 dark:border-lab-line">
              <summary>{question.prompt}</summary>
              <p className="mt-1 text-cyan-500">{question.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="panel p-4">
        <GuidedVisualization experiment={experiment} values={[a, b, c]} outputs={results.outputs} controls={results.controls} />
        <h2 className="panel-title mt-5 flex items-center gap-2"><PhysicsIcon name="calculator" className="h-5 w-5 text-cyan-500" />Interactive Calculator</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{results.description}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {results.controls.map((control, index) => (
            <LabSlider
              key={control.label}
              label={control.label}
              value={index === 0 ? a : index === 1 ? b : c}
              min={control.min}
              max={control.max}
              step={control.step}
              onChange={setters[index]}
            />
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {results.outputs.map((output) => (
            <div key={output.label} className="rounded border border-slate-300/60 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70">
              <div className="text-xs text-slate-500 dark:text-slate-400">{output.label}</div>
              <div className="mt-1 font-mono text-lg text-cyan-500">{output.value}</div>
            </div>
          ))}
        </div>
        <ExperimentLearningCoach
          experiment={experiment}
          controls={results.controls}
          values={[a, b, c]}
          outputs={results.outputs}
          formula={results.formula}
          onSetValues={setAll}
          makeTrialOutputs={(values) => calculateStarterLab(experiment.id, values[0], values[1], values[2]).outputs}
        />
        <div className="mt-5 rounded border border-slate-300/60 p-3 text-sm dark:border-lab-line">
          <div className="flex items-center gap-2 font-semibold text-cyan-500"><PhysicsIcon name="ruler" className="h-4 w-4" />Formula</div>
          <div className="mt-1 font-mono">{results.formula}</div>
        </div>
        <Link to="/lab" className="hero-btn-secondary mt-5 inline-flex items-center gap-2"><PhysicsIcon name="flask" className="h-4 w-4" />Run with physics canvas</Link>
      </section>
    </div>
  );
}

function LabSlider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-cyan-500">{value.toFixed(step < 0.1 ? 2 : 1)}</span>
      </div>
      <input className="w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

interface LabControl {
  label: string;
  min: number;
  max: number;
  step: number;
}

interface LabResult {
  description: string;
  controls: LabControl[];
  formula: string;
  outputs: { label: string; value: string }[];
}

const controls = (one: string, two: string, three: string, ranges?: Partial<Record<"a" | "b" | "c", Partial<LabControl>>>): LabControl[] => [
  { label: one, min: 0.1, max: 20, step: 0.1, ...ranges?.a },
  { label: two, min: 0.1, max: 20, step: 0.1, ...ranges?.b },
  { label: three, min: 0, max: 2, step: 0.01, ...ranges?.c },
];

function calculateStarterLab(id: string, a: number, b: number, c: number): LabResult {
  const g = 9.81;
  const calculators: Record<string, () => LabResult> = {
    "uniform-motion": () => ({
      description: "Distance grows linearly with time when velocity is constant.",
      controls: controls("Velocity (m/s)", "Time (s)", "Initial x (m)"),
      formula: "x = x0 + vt",
      outputs: [{ label: "Displacement", value: `${(a * b).toFixed(2)} m` }, { label: "Position", value: `${(c + a * b).toFixed(2)} m` }, { label: "Acceleration", value: "0.00 m/s^2" }],
    }),
    "newton-s-second-law": () => ({
      description: "Acceleration is directly proportional to net force and inversely proportional to mass.",
      controls: controls("Force (N)", "Mass (kg)", "Friction force (N)"),
      formula: "a = (F - f) / m",
      outputs: [{ label: "Acceleration", value: `${((a - c) / b).toFixed(2)} m/s^2` }, { label: "Velocity after 2 s", value: `${(((a - c) / b) * 2).toFixed(2)} m/s` }, { label: "Verification", value: `F = ${(b * ((a - c) / b)).toFixed(2)} N` }],
    }),
    friction: () => ({
      description: "Friction resists motion and scales with normal force.",
      controls: controls("Mass (kg)", "Applied force (N)", "mu"),
      formula: "f = mu mg",
      outputs: [{ label: "Normal force", value: `${(a * g).toFixed(2)} N` }, { label: "Friction force", value: `${(c * a * g).toFixed(2)} N` }, { label: "Moves?", value: b > c * a * g ? "Yes" : "No" }],
    }),
    "inclined-plane": () => ({
      description: "Gravity splits into parallel and normal components on an incline.",
      controls: controls("Mass (kg)", "Angle (deg)", "mu", { b: { min: 1, max: 80, step: 1 } }),
      formula: "a = g(sin theta - mu cos theta)",
      outputs: [{ label: "Normal force", value: `${(a * g * Math.cos((b * Math.PI) / 180)).toFixed(2)} N` }, { label: "Friction", value: `${(c * a * g * Math.cos((b * Math.PI) / 180)).toFixed(2)} N` }, { label: "Acceleration", value: `${Math.max(0, g * (Math.sin((b * Math.PI) / 180) - c * Math.cos((b * Math.PI) / 180))).toFixed(2)} m/s^2` }],
    }),
    "elastic-collision": () => ({
      description: "One-dimensional collision outputs momentum and energy checks.",
      controls: controls("Mass 1 (kg)", "Mass 2 (kg)", "Restitution", { c: { min: 0, max: 1, step: 0.01 } }),
      formula: "v1' = ((m1 - em2)/(m1 + m2))v1, v2' = ((1+e)m1/(m1+m2))v1",
      outputs: [{ label: "v1 final", value: `${(((a - c * b) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "v2 final", value: `${((((1 + c) * a) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "Momentum before", value: `${(a * 5).toFixed(2)} kg m/s` }],
    }),
    "conservation-of-energy": () => ({
      description: "Potential energy becomes kinetic energy when losses are small.",
      controls: controls("Mass (kg)", "Height (m)", "Loss fraction", { c: { min: 0, max: 0.9, step: 0.01 } }),
      formula: "mgh = 1/2 mv^2",
      outputs: [{ label: "Potential energy", value: `${(a * g * b).toFixed(2)} J` }, { label: "Speed at bottom", value: `${Math.sqrt(2 * g * b * (1 - c)).toFixed(2)} m/s` }, { label: "Remaining energy", value: `${(a * g * b * (1 - c)).toFixed(2)} J` }],
    }),
    "hooke-s-law": () => ({
      description: "Spring force is proportional to extension within the elastic limit.",
      controls: controls("k (N/m)", "Mass (kg)", "Extension (m)", { a: { max: 100, step: 1 }, c: { max: 1, step: 0.01 } }),
      formula: "F = kx, T = 2pi sqrt(m/k)",
      outputs: [{ label: "Spring force", value: `${(a * c).toFixed(2)} N` }, { label: "Weight", value: `${(b * g).toFixed(2)} N` }, { label: "Period", value: `${(2 * Math.PI * Math.sqrt(b / a)).toFixed(2)} s` }],
    }),
    "simple-pendulum": () => ({
      description: "For small angles, pendulum period depends on length and gravity, not mass.",
      controls: controls("Length (m)", "Mass (kg)", "Damping", { a: { min: 0.1, max: 5, step: 0.05 }, c: { min: 0, max: 0.5, step: 0.01 } }),
      formula: "T = 2pi sqrt(L/g)",
      outputs: [{ label: "Period", value: `${(2 * Math.PI * Math.sqrt(a / g)).toFixed(2)} s` }, { label: "Frequency", value: `${(1 / (2 * Math.PI * Math.sqrt(a / g))).toFixed(2)} Hz` }, { label: "Damping", value: `${c.toFixed(2)}` }],
    }),
    "circular-motion": () => ({
      description: "Centripetal acceleration points toward the center of rotation.",
      controls: controls("Mass (kg)", "Radius (m)", "Angular speed (rad/s)", { c: { min: 0, max: 10, step: 0.1 } }),
      formula: "F = mr omega^2, v = r omega",
      outputs: [{ label: "Centripetal force", value: `${(a * b * c ** 2).toFixed(2)} N` }, { label: "Tangential speed", value: `${(b * c).toFixed(2)} m/s` }, { label: "Acceleration", value: `${(b * c ** 2).toFixed(2)} m/s^2` }],
    }),
    "heat-and-temperature": () => ({
      description: "Compare Celsius, Fahrenheit, and Kelvin while noticing that temperature is a measure, not heat itself.",
      controls: controls("Temperature (C)", "Mass (kg)", "Specific heat (kJ/kg C)", { a: { min: -20, max: 120, step: 1 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 0.2, max: 4.2, step: 0.1 } }),
      formula: "K = C + 273.15, Q = mcDeltaT",
      outputs: [{ label: "Kelvin", value: `${(a + 273.15).toFixed(2)} K` }, { label: "Fahrenheit", value: `${((a * 9) / 5 + 32).toFixed(1)} F` }, { label: "Energy for 10 C rise", value: `${(b * c * 10).toFixed(2)} kJ` }],
    }),
    "heat-transfer": () => ({
      description: "Estimate heat flow through a slab and compare how thickness and area affect conduction.",
      controls: controls("k (W/m C)", "Area (m2)", "Thickness (m)", { a: { min: 0.1, max: 400, step: 1 }, b: { min: 0.01, max: 5, step: 0.01 }, c: { min: 0.01, max: 1, step: 0.01 } }),
      formula: "H = kA(Th - Tc) / L",
      outputs: [{ label: "Heat rate, DeltaT=40 C", value: `${((a * b * 40) / c).toFixed(1)} W` }, { label: "Heat in 60 s", value: `${(((a * b * 40) / c) * 60 / 1000).toFixed(2)} kJ` }, { label: "Thickness effect", value: c > 0.5 ? "Slower" : "Faster" }],
    }),
    "heating-effect-current": () => ({
      description: "Joule heating shows why bulbs glow, fuses melt, and appliances consume power.",
      controls: controls("Current (A)", "Resistance (ohm)", "Time (s)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 1, max: 120, step: 1 } }),
      formula: "H = I^2Rt, P = I^2R",
      outputs: [{ label: "Power", value: `${(a * a * b).toFixed(2)} W` }, { label: "Heat produced", value: `${(a * a * b * c).toFixed(2)} J` }, { label: "Bulb brightness", value: a * a * b > 60 ? "High" : "Low/medium" }],
    }),
    electromagnet: () => ({
      description: "A current-carrying coil behaves like a magnet; more turns or current produce a stronger field.",
      controls: controls("Turns", "Current (A)", "Core factor", { a: { min: 10, max: 500, step: 10 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 1, max: 5, step: 0.1 } }),
      formula: "Relative field proportional to NI x core factor",
      outputs: [{ label: "Relative field", value: `${(a * b * c).toFixed(0)}` }, { label: "Polarity flips?", value: "Reverse current" }, { label: "Core effect", value: c > 2 ? "Strong iron core" : "Air/weak core" }],
    }),
    "reflection-plane-mirror": () => ({
      description: "Plane mirror reflection keeps the angle of incidence equal to the angle of reflection.",
      controls: controls("Incidence angle (deg)", "Object distance (cm)", "Mirror tilt (deg)", { a: { min: 0, max: 80, step: 1 }, b: { min: 1, max: 100, step: 1 }, c: { min: -45, max: 45, step: 1 } }),
      formula: "i = r, image distance = object distance",
      outputs: [{ label: "Reflection angle", value: `${a.toFixed(0)} deg` }, { label: "Image distance", value: `${b.toFixed(1)} cm` }, { label: "Ray turns by", value: `${(2 * a).toFixed(0)} deg` }],
    }),
    "force-and-pressure": () => ({
      description: "Pressure increases with force and decreases when the same force spreads over a larger area.",
      controls: controls("Force (N)", "Area (m2)", "Depth (m)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0.01, max: 5, step: 0.01 }, c: { min: 0, max: 10, step: 0.1 } }),
      formula: "P = F/A",
      outputs: [{ label: "Solid pressure", value: `${(a / b).toFixed(2)} Pa` }, { label: "Water pressure at depth", value: `${(1000 * g * c).toFixed(0)} Pa` }, { label: "Area effect", value: b > 1 ? "Pressure reduced" : "Pressure concentrated" }],
    }),
    "fluid-pressure": () => ({
      description: "Pressure in a liquid grows with depth and density, independent of container shape.",
      controls: controls("Density (kg/m3)", "Depth (m)", "Atmospheric P (kPa)", { a: { min: 700, max: 1400, step: 10 }, b: { min: 0, max: 20, step: 0.1 }, c: { min: 80, max: 120, step: 1 } }),
      formula: "P = Patm + rho gh",
      outputs: [{ label: "Gauge pressure", value: `${(a * g * b / 1000).toFixed(2)} kPa` }, { label: "Absolute pressure", value: `${(c + a * g * b / 1000).toFixed(2)} kPa` }, { label: "Depth trend", value: b > 5 ? "High pressure" : "Low pressure" }],
    }),
    "sound-pitch-loudness": () => ({
      description: "Frequency controls pitch while amplitude controls loudness.",
      controls: controls("Frequency (Hz)", "Amplitude", "Distance (m)", { a: { min: 20, max: 2000, step: 10 }, b: { min: 0.1, max: 2, step: 0.1 }, c: { min: 1, max: 50, step: 1 } }),
      formula: "lambda = v/f, intensity proportional to A^2/r^2",
      outputs: [{ label: "Wavelength in air", value: `${(343 / a).toFixed(2)} m` }, { label: "Relative intensity", value: `${((b * b) / (c * c)).toFixed(4)}` }, { label: "Pitch", value: a > 500 ? "High" : "Low/medium" }],
    }),
    "static-electricity": () => ({
      description: "Charged objects exert force; the force gets weaker very quickly as distance increases.",
      controls: controls("Charge 1 (microC)", "Charge 2 (microC)", "Distance (m)", { a: { min: -10, max: 10, step: 0.5 }, b: { min: -10, max: 10, step: 0.5 }, c: { min: 0.05, max: 2, step: 0.01 } }),
      formula: "F = kq1q2/r^2",
      outputs: [{ label: "Force magnitude", value: `${(8.99e9 * Math.abs(a * 1e-6 * b * 1e-6) / (c * c)).toExponential(2)} N` }, { label: "Interaction", value: a * b >= 0 ? "Repulsion" : "Attraction" }, { label: "Field from q1", value: `${(8.99e9 * Math.abs(a * 1e-6) / (c * c)).toExponential(2)} N/C` }],
    }),
    "chemical-effects-current": () => ({
      description: "A conducting liquid lets charge flow; deposited mass increases with current and time.",
      controls: controls("Current (A)", "Time (min)", "Electrochemical factor", { a: { min: 0.1, max: 5, step: 0.1 }, b: { min: 1, max: 60, step: 1 }, c: { min: 0.1, max: 2, step: 0.1 } }),
      formula: "m proportional to It",
      outputs: [{ label: "Charge passed", value: `${(a * b * 60).toFixed(1)} C` }, { label: "Relative deposit", value: `${(a * b * c).toFixed(2)} units` }, { label: "Current path", value: "Ions in solution" }],
    }),
    "free-fall": () => ({
      description: "Objects in ideal free fall accelerate downward at g, independent of mass.",
      controls: controls("Height (m)", "Initial speed (m/s)", "g (m/s2)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0, max: 50, step: 1 }, c: { min: 1, max: 20, step: 0.1 } }),
      formula: "v^2 = u^2 + 2gh",
      outputs: [{ label: "Impact speed", value: `${Math.sqrt(b * b + 2 * c * a).toFixed(2)} m/s` }, { label: "Drop time from rest", value: `${Math.sqrt((2 * a) / c).toFixed(2)} s` }, { label: "Acceleration", value: `${c.toFixed(2)} m/s^2` }],
    }),
    "mass-and-weight": () => ({
      description: "Mass stays the same, but weight changes with gravitational field strength.",
      controls: controls("Mass (kg)", "g (m/s2)", "Spring stretch per N (mm/N)", { a: { min: 0.1, max: 100, step: 0.1 }, b: { min: 1, max: 25, step: 0.1 }, c: { min: 0.1, max: 5, step: 0.1 } }),
      formula: "W = mg",
      outputs: [{ label: "Weight", value: `${(a * b).toFixed(2)} N` }, { label: "Balance reading", value: `${a.toFixed(2)} kg` }, { label: "Spring stretch", value: `${(a * b * c).toFixed(1)} mm` }],
    }),
    "work-power": () => ({
      description: "Work measures energy transferred by force over displacement; power measures the rate of doing work.",
      controls: controls("Force (N)", "Displacement (m)", "Time (s)", { a: { min: 1, max: 500, step: 1 }, b: { min: 0.1, max: 100, step: 0.1 }, c: { min: 0.1, max: 60, step: 0.1 } }),
      formula: "W = Fs, P = W/t",
      outputs: [{ label: "Work done", value: `${(a * b).toFixed(2)} J` }, { label: "Power", value: `${((a * b) / c).toFixed(2)} W` }, { label: "Energy transfer", value: `${(a * b).toFixed(2)} J` }],
    }),
    "echo-speed-sound": () => ({
      description: "Echo time measures a round trip, so distance to the wall is half the sound travel distance.",
      controls: controls("Echo time (s)", "Temperature (C)", "Reflector distance (m)", { a: { min: 0.1, max: 5, step: 0.1 }, b: { min: -10, max: 45, step: 1 }, c: { min: 10, max: 1000, step: 10 } }),
      formula: "v approx 331 + 0.6T, d = vt/2",
      outputs: [{ label: "Speed of sound", value: `${(331 + 0.6 * b).toFixed(1)} m/s` }, { label: "Measured distance", value: `${(((331 + 0.6 * b) * a) / 2).toFixed(1)} m` }, { label: "Expected echo time", value: `${((2 * c) / (331 + 0.6 * b)).toFixed(2)} s` }],
    }),
    "mirror-formula": () => {
      const f = -Math.max(1, a);
      const u = -Math.max(1, b);
      const v = 1 / (1 / f - 1 / u);
      return {
        description: "Concave mirror image distance and magnification change as the object crosses focus and centre of curvature.",
        controls: controls("Focal length (cm)", "Object distance (cm)", "Object height (cm)", { a: { min: 5, max: 50, step: 1 }, b: { min: 5, max: 120, step: 1 }, c: { min: 1, max: 20, step: 0.5 } }),
        formula: "1/f = 1/v + 1/u, m = -v/u",
        outputs: [{ label: "Image distance", value: `${v.toFixed(2)} cm` }, { label: "Magnification", value: `${(-v / u).toFixed(2)}` }, { label: "Image height", value: `${((-v / u) * c).toFixed(2)} cm` }],
      };
    },
    "lens-formula": () => {
      const f = Math.max(1, a);
      const u = -Math.max(1, b);
      const v = 1 / (1 / f + 1 / u);
      return {
        description: "Convex lens image position depends strongly on whether the object is outside or inside the focal length.",
        controls: controls("Focal length (cm)", "Object distance (cm)", "Object height (cm)", { a: { min: 5, max: 50, step: 1 }, b: { min: 5, max: 120, step: 1 }, c: { min: 1, max: 20, step: 0.5 } }),
        formula: "1/f = 1/v - 1/u, m = v/u",
        outputs: [{ label: "Image distance", value: `${v.toFixed(2)} cm` }, { label: "Magnification", value: `${(v / u).toFixed(2)}` }, { label: "Image type", value: v > 0 ? "Real" : "Virtual" }],
      };
    },
    "glass-slab-refraction": () => ({
      description: "A rectangular glass slab bends light twice, making the emergent ray parallel but laterally shifted.",
      controls: controls("Incidence angle (deg)", "Refractive index", "Thickness (cm)", { a: { min: 0, max: 75, step: 1 }, b: { min: 1, max: 2, step: 0.01 }, c: { min: 1, max: 20, step: 0.5 } }),
      formula: "sin i / sin r = n",
      outputs: [{ label: "Refraction angle", value: `${(Math.asin(Math.sin((a * Math.PI) / 180) / b) * 180 / Math.PI).toFixed(2)} deg` }, { label: "Speed in slab", value: `${(3e8 / b).toExponential(2)} m/s` }, { label: "Emergent ray", value: "Parallel to incident ray" }],
    }),
    "prism-dispersion": () => ({
      description: "A prism disperses white light because refractive index changes slightly with wavelength.",
      controls: controls("Prism angle (deg)", "Mean refractive index", "Dispersion factor", { a: { min: 20, max: 70, step: 1 }, b: { min: 1.3, max: 1.8, step: 0.01 }, c: { min: 0, max: 0.08, step: 0.001 } }),
      formula: "Deviation approx (n - 1)A",
      outputs: [{ label: "Mean deviation", value: `${((b - 1) * a).toFixed(2)} deg` }, { label: "Violet-red spread", value: `${(c * a).toFixed(2)} deg` }, { label: "Visible result", value: c > 0.02 ? "Clear spectrum" : "Weak spread" }],
    }),
    "ohms-law": () => ({
      description: "For an ohmic conductor, voltage is directly proportional to current and the V-I graph is a straight line.",
      controls: controls("Current (A)", "Resistance (ohm)", "Internal resistance (ohm)", { a: { min: 0, max: 5, step: 0.1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 0, max: 10, step: 0.1 } }),
      formula: "V = IR, terminal V = I(R + r)",
      outputs: [{ label: "Voltage across resistor", value: `${(a * b).toFixed(2)} V` }, { label: "Supply voltage needed", value: `${(a * (b + c)).toFixed(2)} V` }, { label: "Graph slope", value: `${b.toFixed(2)} ohm` }],
    }),
    "series-parallel-resistance": () => ({
      description: "Series resistance adds directly, while parallel resistance is smaller than the smallest branch.",
      controls: controls("R1 (ohm)", "R2 (ohm)", "Voltage (V)", { a: { min: 1, max: 100, step: 1 }, b: { min: 1, max: 100, step: 1 }, c: { min: 1, max: 24, step: 0.5 } }),
      formula: "Rs = R1 + R2, Rp = R1R2/(R1+R2)",
      outputs: [{ label: "Series current", value: `${(c / (a + b)).toFixed(3)} A` }, { label: "Parallel equivalent", value: `${((a * b) / (a + b)).toFixed(2)} ohm` }, { label: "Parallel current", value: `${(c / ((a * b) / (a + b))).toFixed(3)} A` }],
    }),
    "electric-power": () => ({
      description: "Electrical energy depends on power rating and time, which connects lab circuits to home electricity bills.",
      controls: controls("Voltage (V)", "Current (A)", "Time (h)", { a: { min: 1, max: 240, step: 1 }, b: { min: 0.1, max: 10, step: 0.1 }, c: { min: 0.1, max: 24, step: 0.1 } }),
      formula: "P = VI, E = Pt",
      outputs: [{ label: "Power", value: `${(a * b).toFixed(2)} W` }, { label: "Energy", value: `${((a * b * c) / 1000).toFixed(3)} kWh` }, { label: "Heat per second", value: `${(a * b).toFixed(2)} J/s` }],
    }),
    "magnetic-field-current": () => ({
      description: "Magnetic field around a long straight wire increases with current and decreases with distance.",
      controls: controls("Current (A)", "Distance (cm)", "Turns in coil", { a: { min: 0.1, max: 20, step: 0.1 }, b: { min: 1, max: 50, step: 1 }, c: { min: 1, max: 500, step: 1 } }),
      formula: "B = mu0 I / 2pi r, coil strength proportional to NI",
      outputs: [{ label: "Wire field", value: `${((2e-7 * a) / (b / 100)).toExponential(2)} T` }, { label: "Relative coil strength", value: `${(a * c).toFixed(1)}` }, { label: "Right-hand rule", value: "Thumb=current, curl=field" }],
    }),
    "measurement-errors": () => ({
      description: "Quantify uncertainty using absolute error, percentage error, and sensible significant figures.",
      controls: controls("Measured value", "Absolute error", "Readings", { a: { min: 0.1, max: 200, step: 0.1 }, b: { min: 0.001, max: 10, step: 0.001 }, c: { min: 1, max: 20, step: 1 } }),
      formula: "percentage error = Delta x / x x 100",
      outputs: [{ label: "Percentage error", value: `${((b / a) * 100).toFixed(3)} %` }, { label: "Mean uncertainty", value: `${(b / Math.sqrt(Math.max(1, c))).toFixed(4)}` }, { label: "Suggested report", value: `${a.toFixed(b < 0.01 ? 3 : b < 0.1 ? 2 : 1)} +/- ${b.toFixed(b < 0.01 ? 3 : 2)}` }],
    }),
    "vector-resolution": () => ({
      description: "Resolve a vector into x and y components, then reconstruct its magnitude.",
      controls: controls("Magnitude", "Angle (deg)", "Scale", { a: { min: 0, max: 100, step: 1 }, b: { min: 0, max: 360, step: 1 }, c: { min: 0.1, max: 5, step: 0.1 } }),
      formula: "Ax = A cos theta, Ay = A sin theta",
      outputs: [{ label: "x-component", value: `${(a * Math.cos((b * Math.PI) / 180)).toFixed(2)}` }, { label: "y-component", value: `${(a * Math.sin((b * Math.PI) / 180)).toFixed(2)}` }, { label: "Scaled drawing length", value: `${(a * c).toFixed(2)} px units` }],
    }),
    "rotational-dynamics": () => ({
      description: "Use tau = I alpha to compare angular acceleration for different rotating bodies.",
      controls: controls("Torque (N m)", "Moment of inertia", "Time (s)", { a: { min: 0.1, max: 100, step: 0.1 }, b: { min: 0.1, max: 50, step: 0.1 }, c: { min: 0.1, max: 20, step: 0.1 } }),
      formula: "alpha = tau / I, omega = alpha t",
      outputs: [{ label: "Angular acceleration", value: `${(a / b).toFixed(3)} rad/s^2` }, { label: "Angular speed", value: `${((a / b) * c).toFixed(3)} rad/s` }, { label: "Angular displacement", value: `${(0.5 * (a / b) * c * c).toFixed(3)} rad` }],
    }),
    "satellite-orbit": () => {
      const earthMu = 3.986e14;
      const radius = Math.max(1, b) * 1e6;
      const mu = earthMu * Math.max(0.1, a);
      const orbital = Math.sqrt(mu / radius);
      return {
        description: "Compare circular orbital speed, escape speed, and orbital period for a satellite.",
        controls: controls("Planet mass factor", "Orbital radius (10^6 m)", "Satellite mass (kg)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 1, max: 50, step: 0.1 }, c: { min: 1, max: 5000, step: 10 } }),
        formula: "vo = sqrt(GM/r), ve = sqrt(2GM/r)",
        outputs: [{ label: "Orbital speed", value: `${(orbital / 1000).toFixed(2)} km/s` }, { label: "Escape speed", value: `${((Math.sqrt(2) * orbital) / 1000).toFixed(2)} km/s` }, { label: "Orbital period", value: `${((2 * Math.PI * radius) / orbital / 3600).toFixed(2)} h` }],
      };
    },
    "bernoulli-fluid-flow": () => ({
      description: "Estimate dynamic pressure and static pressure left after speed and height terms.",
      controls: controls("Density (kg/m3)", "Speed (m/s)", "Height (m)", { a: { min: 500, max: 1400, step: 10 }, b: { min: 0, max: 50, step: 0.5 }, c: { min: 0, max: 20, step: 0.1 } }),
      formula: "P + 1/2 rho v^2 + rho gh = constant",
      outputs: [{ label: "Dynamic pressure", value: `${(0.5 * a * b * b / 1000).toFixed(2)} kPa` }, { label: "Height pressure", value: `${(a * g * c / 1000).toFixed(2)} kPa` }, { label: "Energy demand", value: `${((0.5 * a * b * b + a * g * c) / 1000).toFixed(2)} kPa` }],
    }),
    "gas-laws": () => ({
      description: "Connect moles, absolute temperature, volume, and pressure with PV = nRT.",
      controls: controls("Moles", "Temperature (K)", "Volume (m3)", { a: { min: 0.1, max: 10, step: 0.1 }, b: { min: 100, max: 800, step: 10 }, c: { min: 0.1, max: 10, step: 0.1 } }),
      formula: "P = nRT / V",
      outputs: [{ label: "Pressure", value: `${((a * 8.314 * b) / c / 1000).toFixed(2)} kPa` }, { label: "PV/T", value: `${(((a * 8.314 * b) / c) * c / b).toFixed(2)} J/K` }, { label: "Molecular trend", value: b > 400 ? "Fast particles" : "Slower particles" }],
    }),
    "thermodynamic-process": () => ({
      description: "Compare work in a gas process using pressure and volume change.",
      controls: controls("Pressure (kPa)", "Delta volume (L)", "Process factor", { a: { min: 10, max: 500, step: 10 }, b: { min: -20, max: 20, step: 0.5 }, c: { min: 0, max: 1.5, step: 0.1 } }),
      formula: "W = P Delta V x process factor",
      outputs: [{ label: "Work", value: `${(a * 1000 * b * 0.001 * c).toFixed(2)} J` }, { label: "Isochoric comparison", value: "0 J if Delta V = 0" }, { label: "Gas does work?", value: b > 0 ? "Expansion" : "Compression/on gas" }],
    }),
    "shm-spring": () => ({
      description: "Spring-mass SHM period depends on mass and spring constant; max speed depends on amplitude.",
      controls: controls("k (N/m)", "Mass (kg)", "Amplitude (m)", { a: { min: 1, max: 200, step: 1 }, b: { min: 0.1, max: 20, step: 0.1 }, c: { min: 0.01, max: 2, step: 0.01 } }),
      formula: "T = 2pi sqrt(m/k), vmax = omega A",
      outputs: [{ label: "Period", value: `${(2 * Math.PI * Math.sqrt(b / a)).toFixed(3)} s` }, { label: "Angular frequency", value: `${Math.sqrt(a / b).toFixed(3)} rad/s` }, { label: "Max speed", value: `${(Math.sqrt(a / b) * c).toFixed(3)} m/s` }],
    }),
    "electrostatic-field-potential": () => ({
      description: "Compare inverse-square electric field with inverse-distance electric potential.",
      controls: controls("Charge (microC)", "Distance (m)", "Test charge (microC)", { a: { min: -20, max: 20, step: 0.5 }, b: { min: 0.05, max: 5, step: 0.01 }, c: { min: -10, max: 10, step: 0.5 } }),
      formula: "E = kq/r^2, V = kq/r",
      outputs: [{ label: "Electric field", value: `${(8.99e9 * Math.abs(a * 1e-6) / (b * b)).toExponential(2)} N/C` }, { label: "Potential", value: `${(8.99e9 * a * 1e-6 / b).toExponential(2)} V` }, { label: "Force on test charge", value: `${(8.99e9 * Math.abs(a * 1e-6 * c * 1e-6) / (b * b)).toExponential(2)} N` }],
    }),
    "capacitor-lab": () => ({
      description: "Estimate capacitor charge, stored energy, and two-capacitor equivalents.",
      controls: controls("C1 (microF)", "Voltage (V)", "C2 (microF)", { a: { min: 0.1, max: 1000, step: 0.1 }, b: { min: 0, max: 500, step: 1 }, c: { min: 0.1, max: 1000, step: 0.1 } }),
      formula: "Q = CV, U = 1/2 CV^2",
      outputs: [{ label: "Charge on C1", value: `${(a * b).toFixed(2)} microC` }, { label: "Energy", value: `${(0.5 * a * 1e-6 * b * b).toFixed(4)} J` }, { label: "Parallel equivalent", value: `${(a + c).toFixed(2)} microF` }],
    }),
    "kirchhoff-circuit": () => ({
      description: "Analyse a simple two-branch circuit using junction and loop ideas.",
      controls: controls("Voltage (V)", "R1 (ohm)", "R2 (ohm)", { a: { min: 1, max: 240, step: 1 }, b: { min: 1, max: 200, step: 1 }, c: { min: 1, max: 200, step: 1 } }),
      formula: "I1 = V/R1, I2 = V/R2, Itotal = I1 + I2",
      outputs: [{ label: "Branch I1", value: `${(a / b).toFixed(3)} A` }, { label: "Branch I2", value: `${(a / c).toFixed(3)} A` }, { label: "Total current", value: `${(a / b + a / c).toFixed(3)} A` }],
    }),
    "lorentz-force": () => ({
      description: "Calculate magnetic force and circular path radius for a charge moving perpendicular to B.",
      controls: controls("Charge (microC)", "Speed (10^5 m/s)", "B (T)", { a: { min: 0.1, max: 20, step: 0.1 }, b: { min: 0.1, max: 50, step: 0.1 }, c: { min: 0.01, max: 5, step: 0.01 } }),
      formula: "F = qvB",
      outputs: [{ label: "Magnetic force", value: `${(a * 1e-6 * b * 1e5 * c).toExponential(2)} N` }, { label: "Direction", value: "Use Fleming/right-hand rule" }, { label: "If mass=proton radius", value: `${((1.67e-27 * b * 1e5) / (a * 1e-6 * c)).toExponential(2)} m` }],
    }),
    "emi-faraday": () => ({
      description: "Induced emf grows with coil turns and rate of magnetic flux change.",
      controls: controls("Turns", "Flux change (mWb)", "Time (ms)", { a: { min: 1, max: 1000, step: 1 }, b: { min: 0.1, max: 100, step: 0.1 }, c: { min: 1, max: 1000, step: 1 } }),
      formula: "emf = N DeltaPhi / Deltat",
      outputs: [{ label: "Induced emf", value: `${(a * b * 1e-3 / (c * 1e-3)).toFixed(2)} V` }, { label: "Lenz response", value: "Opposes flux change" }, { label: "Fast motion effect", value: c < 100 ? "Large emf" : "Smaller emf" }],
    }),
    "ac-lcr-resonance": () => {
      const xl = 2 * Math.PI * b * c;
      const xc = c === 0 ? 0 : 1000 / (2 * Math.PI * b * c);
      const z = Math.sqrt(a * a + (xl - xc) ** 2);
      return {
        description: "Explore impedance and current near series LCR resonance.",
        controls: controls("Resistance (ohm)", "Frequency (Hz)", "L/C factor", { a: { min: 1, max: 500, step: 1 }, b: { min: 1, max: 1000, step: 1 }, c: { min: 0.1, max: 10, step: 0.1 } }),
        formula: "Z = sqrt(R^2 + (XL - XC)^2)",
        outputs: [{ label: "XL approx", value: `${xl.toFixed(2)} ohm` }, { label: "XC approx", value: `${xc.toFixed(2)} ohm` }, { label: "Current at 12 V", value: `${(12 / z).toFixed(4)} A` }],
      };
    },
    "em-spectrum": () => {
      const frequency = a * 1e12;
      const wavelength = 3e8 / frequency;
      const energyEv = 4.136e-15 * frequency;
      return {
        description: "Relate frequency, wavelength, photon energy, and EM spectrum region.",
        controls: controls("Frequency (THz)", "Display scale", "Intensity", { a: { min: 0.001, max: 3000, step: 1 }, b: { min: 0.1, max: 10, step: 0.1 }, c: { min: 0, max: 1, step: 0.01 } }),
        formula: "c = f lambda, E = hf",
        outputs: [{ label: "Wavelength", value: `${wavelength.toExponential(2)} m` }, { label: "Photon energy", value: `${energyEv.toFixed(3)} eV` }, { label: "Band", value: a < 0.3 ? "Radio/microwave" : a < 400 ? "Infrared" : a < 790 ? "Visible" : "UV/X-ray range" }],
      };
    },
    "young-double-slit": () => ({
      description: "Calculate fringe width for double-slit interference.",
      controls: controls("Wavelength (nm)", "Screen distance (m)", "Slit separation (mm)", { a: { min: 380, max: 700, step: 1 }, b: { min: 0.1, max: 5, step: 0.1 }, c: { min: 0.01, max: 2, step: 0.01 } }),
      formula: "beta = lambda D / d",
      outputs: [{ label: "Fringe width", value: `${((a * 1e-9 * b) / (c * 1e-3) * 1000).toFixed(3)} mm` }, { label: "5-fringe span", value: `${(5 * (a * 1e-9 * b) / (c * 1e-3) * 1000).toFixed(3)} mm` }, { label: "Pattern trend", value: c < 0.2 ? "Wide fringes" : "Narrower fringes" }],
    }),
    "photoelectric-equation": () => ({
      description: "Compare photon energy with work function and find maximum kinetic energy.",
      controls: controls("Photon energy (eV)", "Work function (eV)", "Intensity", { a: { min: 0.5, max: 10, step: 0.1 }, b: { min: 0.5, max: 6, step: 0.1 }, c: { min: 0, max: 1, step: 0.01 } }),
      formula: "Kmax = hf - phi, Vs = Kmax/e",
      outputs: [{ label: "Kmax", value: `${Math.max(0, a - b).toFixed(2)} eV` }, { label: "Stopping potential", value: `${Math.max(0, a - b).toFixed(2)} V` }, { label: "Emission?", value: a > b && c > 0 ? "Yes" : "No" }],
    }),
    "nuclear-decay": () => ({
      description: "Model remaining undecayed nuclei after a chosen elapsed time.",
      controls: controls("Initial nuclei", "Half-life", "Elapsed time", { a: { min: 100, max: 100000, step: 100 }, b: { min: 1, max: 100, step: 1 }, c: { min: 0, max: 500, step: 1 } }),
      formula: "N = N0(1/2)^(t/T)",
      outputs: [{ label: "Remaining nuclei", value: `${(a * 0.5 ** (c / b)).toFixed(0)}` }, { label: "Decayed nuclei", value: `${(a - a * 0.5 ** (c / b)).toFixed(0)}` }, { label: "Remaining fraction", value: `${(100 * 0.5 ** (c / b)).toFixed(2)} %` }],
    }),
    "semiconductor-diode": () => ({
      description: "Estimate forward diode current and half-wave rectifier output.",
      controls: controls("Input voltage (V)", "Diode drop (V)", "Load (ohm)", { a: { min: -20, max: 20, step: 0.1 }, b: { min: 0.1, max: 1, step: 0.01 }, c: { min: 10, max: 10000, step: 10 } }),
      formula: "I = max(0, Vin - Vd) / R",
      outputs: [{ label: "Forward current", value: `${(Math.max(0, a - b) / c * 1000).toFixed(3)} mA` }, { label: "Output voltage", value: `${Math.max(0, a - b).toFixed(2)} V` }, { label: "Bias state", value: a > b ? "Forward conducting" : "Blocked/reverse" }],
    }),
  };
  return (calculators[id] ?? calculators["uniform-motion"])();
}
