import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function TunnelingSim() {
  const [energy, setEnergy] = useState(2);
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(1);
  const [mass, setMass] = useState(1);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((value) => value + 0.15), 50);
    return () => window.clearInterval(id);
  }, []);
  const { data, t, r } = useMemo(() => solve(energy, height, width, mass, phase), [energy, height, width, mass, phase]);
  return (
    <div className="panel p-4">
      <h2 className="panel-title">Quantum Tunneling</h2>
      <div className="mt-3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid stroke="rgba(148,163,184,0.18)" />
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area dataKey="probability" stroke="#22d3ee" fill="#22d3ee55" />
            <Area dataKey="barrier" stroke="#f43f5e" fill="#f43f5e33" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <label className="property-row"><span>E eV</span><input type="range" min={0.1} max={10} step={0.1} value={energy} onChange={(event) => setEnergy(Number(event.target.value))} /></label>
        <label className="property-row"><span>V0 eV</span><input type="range" min={0.1} max={10} step={0.1} value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
        <label className="property-row"><span>L nm</span><input type="range" min={0.1} max={5} step={0.1} value={width} onChange={(event) => setWidth(Number(event.target.value))} /></label>
        <label className="property-row"><span>Mass</span><select value={mass} onChange={(event) => setMass(Number(event.target.value))}><option value={1}>electron</option><option value={1836}>proton</option></select></label>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <Readout label="Transmission T" value={t.toFixed(3)} />
        <Readout label="Reflection R" value={r.toFixed(3)} />
      </div>
    </div>
  );
}

function solve(e: number, v0: number, widthNm: number, mass: number, phase: number) {
  const alpha = 5.12 * widthNm * Math.sqrt(Math.max(0.0001, mass * Math.abs(v0 - e)));
  const t = e > v0
    ? 1 / (1 + ((v0 * v0 * Math.sin(alpha) ** 2) / (4 * e * Math.max(0.0001, e - v0))))
    : 1 / (1 + ((v0 * v0 * Math.sinh(alpha) ** 2) / (4 * e * Math.max(0.0001, v0 - e))));
  const clampedT = Math.max(0, Math.min(1, t));
  const data = Array.from({ length: 220 }, (_, i) => {
    const x = -3 + (i / 219) * 6;
    const inBarrier = Math.abs(x) < widthNm / 2;
    const amp = x < -widthNm / 2 ? 1 + (1 - clampedT) * Math.cos(8 * x - phase) : inBarrier ? Math.exp(-Math.abs(x) * alpha / 4) : Math.sqrt(clampedT);
    return { x: Number(x.toFixed(2)), probability: Math.max(0, amp * amp * (0.75 + 0.25 * Math.cos(7 * x - phase))), barrier: inBarrier ? v0 / 5 : 0 };
  });
  return { data, t: clampedT, r: 1 - clampedT };
}

function Readout({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-slate-300/60 p-2 dark:border-lab-line"><div className="text-slate-500">{label}</div><div className="font-mono text-cyan-500">{value}</div></div>;
}
