import { ReactNode, useMemo, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLabStore } from "../store/useLabStore";
import { ExperimentDefinition } from "../types";
import { ExperimentLearningCoach } from "./ExperimentLearningCoach";
import { PhysicsIcon } from "../lib/icons";
import { Experiment3DAnimation, has3DAnimation } from "./Experiment3DAnimation";
import { AnimationExplanationTimeline, AnimationMoment } from "./AnimationExplanationTimeline";
import { FullscreenButton } from "./FullscreenButton";

type ProjectileView = "timeline" | "three" | "trajectory" | "graphs";

export function ProjectileExperiment({ experiment }: { experiment: ExperimentDefinition }) {
  const { projectile, updateProjectile } = useLabStore();
  const [activeMoment, setActiveMoment] = useState<AnimationMoment | null>(null);
  const hasThreeD = has3DAnimation(experiment.id);
  const [view, setView] = useState<ProjectileView>(hasThreeD ? "three" : "trajectory");
  const angleRad = (projectile.angle * Math.PI) / 180;
  const dragFactor = projectile.airResistance ? 0.86 : 1;
  const range = ((projectile.speed ** 2 * Math.sin(2 * angleRad)) / projectile.gravity) * dragFactor;
  const maxHeight = ((projectile.speed ** 2 * Math.sin(angleRad) ** 2) / (2 * projectile.gravity)) * dragFactor;
  const time = ((2 * projectile.speed * Math.sin(angleRad)) / projectile.gravity) * dragFactor;
  const points = useMemo(() => {
    const vx = projectile.speed * Math.cos(angleRad);
    const vy = projectile.speed * Math.sin(angleRad);
    return Array.from({ length: 80 }, (_, index) => {
      const t = (time * index) / 79;
      const x = vx * t * dragFactor;
      const y = Math.max(0, vy * t - 0.5 * projectile.gravity * t * t);
      return { t: Number(t.toFixed(2)), x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
    });
  }, [angleRad, dragFactor, projectile.gravity, projectile.speed, time]);
  const coachControls = [
    { label: "Initial speed (m/s)", min: 1, max: 60, step: 1 },
    { label: "Launch angle (deg)", min: 1, max: 89, step: 1 },
    { label: "Gravity (m/s^2)", min: 1, max: 25, step: 0.1 },
  ];
  const outputs = projectileOutputs(projectile.speed, projectile.angle, projectile.gravity, projectile.airResistance);
  const views: Array<{ id: ProjectileView; label: string; icon: Parameters<typeof PhysicsIcon>[0]["name"] }> = [
    ...(hasThreeD ? [{ id: "three" as const, label: "3D", icon: "orbit" as const }] : []),
    { id: "trajectory", label: "Trajectory", icon: "rocket" },
    { id: "graphs", label: "Graphs", icon: "chart" },
    { id: "timeline", label: "Timeline", icon: "step" },
  ];

  return (
    <div className="projectile-cockpit">
      <section className="projectile-control-column">
      <ProjectilePanel title="Guided Experiment" icon="rocket" className="panel min-h-0 p-4 projectile-control-panel">
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{experiment.aim}</p>
        <div className="mt-5 space-y-4">
          <Slider label="Initial speed" unit="m/s" min={1} max={60} step={1} value={projectile.speed} onChange={(speed) => updateProjectile({ speed })} />
          <Slider label="Launch angle" unit="deg" min={1} max={89} step={1} value={projectile.angle} onChange={(angle) => updateProjectile({ angle })} />
          <Slider label="Gravity" unit="m/s^2" min={1} max={25} step={0.1} value={projectile.gravity} onChange={(gravity) => updateProjectile({ gravity })} />
          <Slider label="Mass" unit="kg" min={0.1} max={20} step={0.1} value={projectile.mass} onChange={(mass) => updateProjectile({ mass })} />
          <label className="property-row">
            <span>Air resistance</span>
            <input type="checkbox" checked={projectile.airResistance} onChange={(event) => updateProjectile({ airResistance: event.target.checked })} />
          </label>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
          {outputs.map((output) => <Metric key={output.label} label={output.label} value={output.value} />)}
        </div>
        <div className="mt-5 rounded border border-slate-300/60 p-3 text-sm dark:border-lab-line">
          <div className="flex items-center gap-2 font-semibold text-cyan-500"><PhysicsIcon name="ruler" className="h-4 w-4" />Formula</div>
          <p className="mt-1 font-mono">R = u^2 sin(2 theta) / g</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {projectile.speed.toFixed(1)}^2 x sin({(2 * projectile.angle).toFixed(0)} deg) / {projectile.gravity.toFixed(2)} = {range.toFixed(2)} m
          </p>
        </div>
        <details className="projectile-coach-disclosure mt-4">
          <summary>
            <span className="inline-flex items-center gap-2"><PhysicsIcon name="teacher" className="h-4 w-4 text-cyan-500" />Easy learning mode</span>
          </summary>
          <ExperimentLearningCoach
            experiment={experiment}
            controls={coachControls}
            values={[projectile.speed, projectile.angle, projectile.gravity]}
            outputs={outputs}
            formula="R = u^2 sin(2 theta) / g"
            onSetValues={(values) => updateProjectile({ speed: values[0], angle: values[1], gravity: values[2] })}
            makeTrialOutputs={(values) => projectileOutputs(values[0], values[1], values[2], projectile.airResistance)}
          />
        </details>
      </ProjectilePanel>
      </section>
      <section className="projectile-stage-column">
        <div className="projectile-stage-header">
          <div>
            <p className="ui-label">Interactive visualization</p>
            <h2 className="text-xl font-black">Change controls, watch here</h2>
          </div>
          <div className="projectile-stage-tabs" aria-label="Projectile visualization views">
            {views.map((item) => (
              <button key={item.id} className={view === item.id ? "projectile-stage-tab projectile-stage-tab-active" : "projectile-stage-tab"} type="button" onClick={() => setView(item.id)}>
                <PhysicsIcon name={item.icon} className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="projectile-stage-stack">
          {view === "timeline" && <AnimationExplanationTimeline experiment={experiment} activeMomentId={activeMoment?.id ?? null} onMomentChange={setActiveMoment} />}
          {view === "three" && hasThreeD && <Experiment3DAnimation experiment={experiment} values={[projectile.speed, projectile.angle, projectile.gravity]} outputs={outputs} timelineTime={activeMoment?.time ?? null} fixedShell />}
          {view === "trajectory" && (
            <ProjectilePanel title="Trajectory" icon="rocket" className="panel p-4 projectile-stage-fill">
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">Interactive visualization</div>
          <svg className="projectile-trajectory-svg mt-3 w-full rounded bg-slate-950" viewBox="0 0 820 300" role="img" aria-label="Projectile trajectory">
            <defs>
              <pattern id="projectile-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,.18)" strokeWidth="1" />
              </pattern>
              <marker id="projectile-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" />
              </marker>
            </defs>
            <rect width="820" height="300" fill="url(#projectile-grid)" />
            <rect x="34" y="260" width="746" height="5" rx="2.5" fill="#475569" />
            <path d={areaPath(points, range, maxHeight)} fill="rgba(34,211,238,.10)" stroke="none" />
            <path className="lab-anim-dash" d={toPath(points, range, maxHeight)} fill="none" stroke="#22d3ee" strokeWidth="4" />
            <circle r="8" fill="#22d3ee" className="lab-anim-glow">
              <animateMotion dur="3s" repeatCount="indefinite" path={toPath(points, range, maxHeight)} />
            </circle>
            <circle cx="34" cy="260" r="10" fill="#38bdf8" />
            <line x1="34" y1="260" x2={34 + 70 * Math.cos(angleRad)} y2={260 - 70 * Math.sin(angleRad)} stroke="#38bdf8" strokeWidth="3" markerEnd="url(#projectile-arrow)" />
            <line x1="34" y1="40" x2="780" y2="40" stroke="#facc15" strokeDasharray="6 6" opacity=".65" />
            <text x="42" y="34" fill="#e2e8f0" fontSize="14">Range {range.toFixed(2)} m - Height {maxHeight.toFixed(2)} m</text>
            <text x="42" y="56" fill="#94a3b8" fontSize="12">Increase speed for a longer arc; change angle to trade range and height.</text>
          </svg>
        </ProjectilePanel>
          )}
          {view === "graphs" && (
            <ProjectilePanel title="x-y, x-time, y-time Graphs" icon="chart" className="panel p-4 projectile-stage-fill">
          <div className="projectile-graph-frame mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points}>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey="t" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.25)", color: "#e2e8f0" }} />
                <Legend />
                <Line dataKey="x" name="x-time" stroke="#22d3ee" dot={false} />
                <Line dataKey="y" name="y-time" stroke="#34d399" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ProjectilePanel>
          )}
        </div>
      </section>
    </div>
  );
}

function ProjectilePanel({ title, icon, className, children }: { title: string; icon: Parameters<typeof PhysicsIcon>[0]["name"]; className: string; children: ReactNode }) {
  const panelRef = useRef<HTMLDetailsElement>(null);
  return (
    <details ref={panelRef} className={`${className} projectile-disclosure fullscreen-target`} open>
      <summary className="projectile-disclosure-summary">
        <span className="panel-title flex items-center gap-2">
          <PhysicsIcon name={icon} className="h-5 w-5 text-cyan-500" />
          {title}
        </span>
        <FullscreenButton targetRef={panelRef} compact />
      </summary>
      <div className="projectile-disclosure-body">{children}</div>
    </details>
  );
}

function Slider({ label, unit, value, min, max, step, onChange }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-cyan-500">{value} {unit}</span>
      </div>
      <input className="w-full accent-cyan-400" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-100 p-2 dark:bg-slate-900">
      <div className="text-slate-500 dark:text-slate-400">{label}</div>
      <div className="font-mono text-cyan-500">{value}</div>
    </div>
  );
}

function projectileOutputs(speed: number, angle: number, gravity: number, airResistance: boolean) {
  const angleRad = (angle * Math.PI) / 180;
  const dragFactor = airResistance ? 0.86 : 1;
  const range = ((speed ** 2 * Math.sin(2 * angleRad)) / gravity) * dragFactor;
  const maxHeight = ((speed ** 2 * Math.sin(angleRad) ** 2) / (2 * gravity)) * dragFactor;
  const time = ((2 * speed * Math.sin(angleRad)) / gravity) * dragFactor;
  return [
    { label: "Range", value: `${range.toFixed(2)} m` },
    { label: "Max height", value: `${maxHeight.toFixed(2)} m` },
    { label: "Flight time", value: `${time.toFixed(2)} s` },
  ];
}

function toPath(points: { x: number; y: number }[], range: number, maxHeight: number) {
  const sx = 750 / Math.max(1, range);
  const sy = 220 / Math.max(1, maxHeight);
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${34 + point.x * sx} ${260 - point.y * sy}`).join(" ");
}

function areaPath(points: { x: number; y: number }[], range: number, maxHeight: number) {
  return `${toPath(points, range, maxHeight)} L 784 260 L 34 260 Z`;
}
