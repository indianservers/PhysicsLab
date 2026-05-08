import { useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLabStore } from "../store/useLabStore";
import { ExperimentDefinition } from "../types";

export function ProjectileExperiment({ experiment }: { experiment: ExperimentDefinition }) {
  const { projectile, updateProjectile } = useLabStore();
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

  return (
    <div className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
      <section className="panel min-h-0 p-4">
        <h2 className="panel-title">Guided Experiment</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{experiment.aim}</p>
        <div className="mt-5 space-y-4">
          <Slider label="Initial speed" unit="m/s" min={1} max={60} step={1} value={projectile.speed} onChange={(speed) => updateProjectile({ speed })} />
          <Slider label="Launch angle" unit="deg" min={1} max={89} step={1} value={projectile.angle} onChange={(angle) => updateProjectile({ angle })} />
          <Slider label="Gravity" unit="m/s²" min={1} max={25} step={0.1} value={projectile.gravity} onChange={(gravity) => updateProjectile({ gravity })} />
          <Slider label="Mass" unit="kg" min={0.1} max={20} step={0.1} value={projectile.mass} onChange={(mass) => updateProjectile({ mass })} />
          <label className="property-row">
            <span>Air resistance</span>
            <input type="checkbox" checked={projectile.airResistance} onChange={(event) => updateProjectile({ airResistance: event.target.checked })} />
          </label>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
          <Metric label="Range" value={`${range.toFixed(2)} m`} />
          <Metric label="Max height" value={`${maxHeight.toFixed(2)} m`} />
          <Metric label="Flight time" value={`${time.toFixed(2)} s`} />
        </div>
        <div className="mt-5 rounded border border-slate-300/60 p-3 text-sm dark:border-lab-line">
          <div className="font-semibold text-cyan-500">Formula</div>
          <p className="mt-1 font-mono">R = u² sin(2θ) / g</p>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {projectile.speed.toFixed(1)}² × sin({(2 * projectile.angle).toFixed(0)}°) / {projectile.gravity.toFixed(2)} = {range.toFixed(2)} m
          </p>
        </div>
      </section>
      <section className="grid gap-4">
        <div className="panel p-4">
          <h2 className="panel-title">Trajectory</h2>
          <svg className="mt-3 h-72 w-full rounded bg-slate-950" viewBox="0 0 820 300" role="img" aria-label="Projectile trajectory">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,.18)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="820" height="300" fill="url(#grid)" />
            <path d={toPath(points, range, maxHeight)} fill="none" stroke="#22d3ee" strokeWidth="4" />
            <circle cx="34" cy="260" r="10" fill="#38bdf8" />
            <line x1="34" y1="260" x2={34 + 70 * Math.cos(angleRad)} y2={260 - 70 * Math.sin(angleRad)} stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="42" y="34" fill="#e2e8f0" fontSize="14">Range {range.toFixed(2)} m · Height {maxHeight.toFixed(2)} m</text>
          </svg>
        </div>
        <div className="panel p-4">
          <h2 className="panel-title">x-y, x-time, y-time Graphs</h2>
          <div className="mt-3 h-72">
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
        </div>
      </section>
    </div>
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

function toPath(points: { x: number; y: number }[], range: number, maxHeight: number) {
  const sx = 750 / Math.max(1, range);
  const sy = 220 / Math.max(1, maxHeight);
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${34 + point.x * sx} ${260 - point.y * sy}`).join(" ");
}
