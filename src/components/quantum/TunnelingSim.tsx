import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { QuantumControlSlider } from "../../physics/quantum/components/QuantumControlSlider";
import { QuantumSimulationCard } from "../../physics/quantum/components/QuantumSimulationCard";
import { quantumSimulationById, QuantumLearningMode } from "../../physics/quantum/quantumLabData";
import { formatScientific, tunnelingKappaPerMeter, tunnelingTransmissionEstimate } from "../../physics/quantum/quantumUtils";

export function TunnelingSim({ mode = "normal", highlighted = false }: { mode?: QuantumLearningMode; highlighted?: boolean }) {
  const [energy, setEnergy] = useState(2);
  const [height, setHeight] = useState(5);
  const [width, setWidth] = useState(1);
  const [mass, setMass] = useState(1);
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setPhase((value) => value + 0.15), 50);
    return () => window.clearInterval(id);
  }, []);
  const info = quantumSimulationById("tunneling");
  const { data, t, r, kappa } = useMemo(() => solve(energy, height, width, mass, phase), [energy, height, width, mass, phase]);
  const reset = () => {
    setEnergy(2);
    setHeight(5);
    setWidth(1);
    setMass(1);
  };
  const observation = energy < height
    ? mode === "advanced"
      ? `E < V0, so the WKB-style estimate gives T = ${t.toExponential(2)}. Wider barriers and larger mass increase kappa and suppress tunneling.`
      : `Classically the particle should not cross this barrier, but the quantum wave leaves a small transmission probability.`
    : `The particle energy is above the barrier height, so transmission is high in this simplified classroom model.`;
  return (
    <QuantumSimulationCard
      info={info}
      mode={mode}
      className={`quantum-tunneling ${highlighted ? "quantum-sim-highlight" : ""}`}
      observation={observation}
      onReset={reset}
      outputs={[
        { label: "Transmission T", value: t.toExponential(2), detail: "0 to 1" },
        { label: "Reflection R", value: r.toFixed(3), detail: "1 - T" },
        { label: "Classical", value: energy < height ? "No crossing" : "Allowed" },
        { label: "kappa", value: formatScientific(kappa, "m^-1") },
      ]}
      controls={(
        <>
          <QuantumControlSlider label="Energy E" value={energy} min={0.1} max={10} step={0.1} unit="eV" onChange={setEnergy} />
          <QuantumControlSlider label="Barrier V0" value={height} min={0.1} max={10} step={0.1} unit="eV" onChange={setHeight} />
          <QuantumControlSlider label="Width L" value={width} min={0.1} max={5} step={0.1} unit="nm" onChange={setWidth} />
          <label className="quantum-select-control">
            <span>Particle mass</span>
            <select value={mass} onChange={(event) => setMass(Number(event.target.value))}>
              <option value={1}>electron</option>
              <option value={1836}>proton</option>
            </select>
          </label>
        </>
      )}
    >
      <div className="quantum-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="x" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ background: "rgba(5,12,24,0.94)", border: "1px solid rgba(124,58,237,0.35)", color: "#e2e8f0", borderRadius: 10 }} />
            <Area dataKey="probability" stroke="#22d3ee" fill="#22d3ee55" isAnimationActive animationDuration={700} />
            <Area dataKey="barrier" stroke="#7c3aed" fill="#7c3aed33" isAnimationActive animationDuration={700} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </QuantumSimulationCard>
  );
}

function solve(e: number, v0: number, widthNm: number, mass: number, phase: number) {
  const kappa = tunnelingKappaPerMeter(e, v0, mass);
  const clampedT = tunnelingTransmissionEstimate(e, v0, widthNm, mass);
  const visualAlpha = 5.12 * widthNm * Math.sqrt(Math.max(0.0001, mass * Math.abs(v0 - e)));
  const data = Array.from({ length: 220 }, (_, i) => {
    const x = -3 + (i / 219) * 6;
    const inBarrier = Math.abs(x) < widthNm / 2;
    const amp = x < -widthNm / 2 ? 1 + (1 - clampedT) * Math.cos(8 * x - phase) : inBarrier ? Math.exp(-Math.abs(x) * visualAlpha / 4) : Math.sqrt(clampedT);
    return { x: Number(x.toFixed(2)), probability: Math.max(0, amp * amp * (0.75 + 0.25 * Math.cos(7 * x - phase))), barrier: inBarrier ? v0 / 5 : 0 };
  });
  return { data, t: clampedT, r: 1 - clampedT, kappa };
}
