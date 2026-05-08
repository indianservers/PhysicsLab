import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { ProjectileExperiment } from "../components/ProjectileExperiment";

export function ExperimentDetailPage() {
  const { id } = useParams();
  const experiment = experiments.find((item) => item.id === id) ?? experiments[0];
  return (
    <div className="min-h-screen">
      <Toolbar />
      <div className="mx-auto max-w-7xl px-5 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link to="/experiments" className="text-sm text-cyan-500">Experiments</Link>
            <h1 className="text-3xl font-bold">{experiment.title}</h1>
          </div>
          <Link to="/lab" className="hero-btn-secondary">Open full lab workspace</Link>
        </div>
        {experiment.id === "projectile-motion" ? <ProjectileExperiment experiment={experiment} /> : <GenericExperiment experiment={experiment} />}
      </div>
    </div>
  );
}

function GenericExperiment({ experiment }: { experiment: typeof experiments[number] }) {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const [c, setC] = useState(0.2);
  const results = calculateStarterLab(experiment.id, a, b, c);
  return (
    <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="panel p-4">
        <h2 className="panel-title">Aim</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{experiment.aim}</p>
        <h2 className="panel-title mt-5">Procedure</h2>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
          {experiment.procedure.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <h2 className="panel-title mt-5">Viva Questions</h2>
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
        <h2 className="panel-title">Interactive Calculator</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{results.description}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <LabSlider label={results.controls[0]} value={a} min={0.1} max={20} step={0.1} onChange={setA} />
          <LabSlider label={results.controls[1]} value={b} min={0.1} max={20} step={0.1} onChange={setB} />
          <LabSlider label={results.controls[2]} value={c} min={0} max={2} step={0.01} onChange={setC} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {results.outputs.map((output) => (
            <div key={output.label} className="rounded border border-slate-300/60 bg-slate-100 p-3 dark:border-lab-line dark:bg-slate-900/70">
              <div className="text-xs text-slate-500 dark:text-slate-400">{output.label}</div>
              <div className="mt-1 font-mono text-lg text-cyan-500">{output.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded border border-slate-300/60 p-3 text-sm dark:border-lab-line">
          <div className="font-semibold text-cyan-500">Formula</div>
          <div className="mt-1 font-mono">{results.formula}</div>
        </div>
        <Link to="/lab" className="hero-btn-secondary mt-5 inline-block">Run with physics canvas</Link>
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

function calculateStarterLab(id: string, a: number, b: number, c: number) {
  const g = 9.81;
  const calculators: Record<string, () => { description: string; controls: string[]; formula: string; outputs: { label: string; value: string }[] }> = {
    "uniform-motion": () => ({
      description: "Distance grows linearly with time when velocity is constant.",
      controls: ["Velocity (m/s)", "Time (s)", "Initial x (m)"],
      formula: "x = x0 + vt",
      outputs: [{ label: "Displacement", value: `${(a * b).toFixed(2)} m` }, { label: "Position", value: `${(c + a * b).toFixed(2)} m` }, { label: "Acceleration", value: "0.00 m/s^2" }],
    }),
    "newton-s-second-law": () => ({
      description: "Acceleration is directly proportional to net force and inversely proportional to mass.",
      controls: ["Force (N)", "Mass (kg)", "Friction force (N)"],
      formula: "a = (F - f) / m",
      outputs: [{ label: "Acceleration", value: `${((a - c) / b).toFixed(2)} m/s^2` }, { label: "Velocity after 2 s", value: `${(((a - c) / b) * 2).toFixed(2)} m/s` }, { label: "Verification", value: `F = ${(b * ((a - c) / b)).toFixed(2)} N` }],
    }),
    friction: () => ({
      description: "Friction resists motion and scales with normal force.",
      controls: ["Mass (kg)", "Applied force (N)", "mu"],
      formula: "f = mu mg",
      outputs: [{ label: "Normal force", value: `${(a * g).toFixed(2)} N` }, { label: "Friction force", value: `${(c * a * g).toFixed(2)} N` }, { label: "Moves?", value: b > c * a * g ? "Yes" : "No" }],
    }),
    "inclined-plane": () => ({
      description: "Gravity splits into parallel and normal components on an incline.",
      controls: ["Mass (kg)", "Angle (deg)", "mu"],
      formula: "a = g(sin theta - mu cos theta)",
      outputs: [{ label: "Normal force", value: `${(a * g * Math.cos((b * Math.PI) / 180)).toFixed(2)} N` }, { label: "Friction", value: `${(c * a * g * Math.cos((b * Math.PI) / 180)).toFixed(2)} N` }, { label: "Acceleration", value: `${Math.max(0, g * (Math.sin((b * Math.PI) / 180) - c * Math.cos((b * Math.PI) / 180))).toFixed(2)} m/s^2` }],
    }),
    "elastic-collision": () => ({
      description: "One-dimensional collision outputs momentum and energy checks.",
      controls: ["Mass 1 (kg)", "Mass 2 (kg)", "Restitution"],
      formula: "v1' = ((m1 - em2)/(m1 + m2))v1, v2' = ((1+e)m1/(m1+m2))v1",
      outputs: [{ label: "v1 final", value: `${(((a - c * b) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "v2 final", value: `${((((1 + c) * a) / (a + b)) * 5).toFixed(2)} m/s` }, { label: "Momentum before", value: `${(a * 5).toFixed(2)} kg m/s` }],
    }),
    "conservation-of-energy": () => ({
      description: "Potential energy becomes kinetic energy when losses are small.",
      controls: ["Mass (kg)", "Height (m)", "Loss fraction"],
      formula: "mgh = 1/2 mv^2",
      outputs: [{ label: "Potential energy", value: `${(a * g * b).toFixed(2)} J` }, { label: "Speed at bottom", value: `${Math.sqrt(2 * g * b * (1 - c)).toFixed(2)} m/s` }, { label: "Remaining energy", value: `${(a * g * b * (1 - c)).toFixed(2)} J` }],
    }),
    "hooke-s-law": () => ({
      description: "Spring force is proportional to extension within the elastic limit.",
      controls: ["k (N/m)", "Mass (kg)", "Extension (m)"],
      formula: "F = kx, T = 2pi sqrt(m/k)",
      outputs: [{ label: "Spring force", value: `${(a * c).toFixed(2)} N` }, { label: "Weight", value: `${(b * g).toFixed(2)} N` }, { label: "Period", value: `${(2 * Math.PI * Math.sqrt(b / a)).toFixed(2)} s` }],
    }),
    "simple-pendulum": () => ({
      description: "For small angles, pendulum period depends on length and gravity, not mass.",
      controls: ["Length (m)", "Mass (kg)", "Damping"],
      formula: "T = 2pi sqrt(L/g)",
      outputs: [{ label: "Period", value: `${(2 * Math.PI * Math.sqrt(a / g)).toFixed(2)} s` }, { label: "Frequency", value: `${(1 / (2 * Math.PI * Math.sqrt(a / g))).toFixed(2)} Hz` }, { label: "Damping", value: `${c.toFixed(2)}` }],
    }),
    "circular-motion": () => ({
      description: "Centripetal acceleration points toward the center of rotation.",
      controls: ["Mass (kg)", "Radius (m)", "Angular speed (rad/s)"],
      formula: "F = mr omega^2, v = r omega",
      outputs: [{ label: "Centripetal force", value: `${(a * b * c ** 2).toFixed(2)} N` }, { label: "Tangential speed", value: `${(b * c).toFixed(2)} m/s` }, { label: "Acceleration", value: `${(b * c ** 2).toFixed(2)} m/s^2` }],
    }),
  };
  return (calculators[id] ?? calculators["uniform-motion"])();
}
