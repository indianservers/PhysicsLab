import { useEffect, useRef, useState } from "react";
import { wavelengthToRgba } from "../../engine/opticsEngine";
import { QuantumSimulationCard } from "../../physics/quantum/components/QuantumSimulationCard";
import { quantumSimulationById, QuantumLearningMode } from "../../physics/quantum/quantumLabData";
import { bohrEnergyLevelEv, bohrSeries, bohrTransitionEnergyEv, energyEvToWavelengthNm, formatEnergyEv, formatWavelengthNm } from "../../physics/quantum/quantumUtils";

interface Transition { from: number; to: number; energy: number; wavelength: number; series: string }

export function BohrModelSim({ mode = "normal", highlighted = false }: { mode?: QuantumLearningMode; highlighted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shell, setShell] = useState(2);
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const last = transitions[0];
  const info = quantumSimulationById("bohr");

  useEffect(() => {
    let angle = 0;
    let raf = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      ctx.strokeStyle = "rgba(148,163,184,0.45)";
      for (let n = 1; n <= 6; n += 1) {
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRadius(n), 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      const r = orbitRadius(shell);
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 7, 0, Math.PI * 2);
      ctx.fill();
      angle += 0.03 / shell;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [shell]);

  const drop = (to: number) => {
    if (to >= shell) return;
    const energy = bohrTransitionEnergyEv(shell, to);
    const wavelength = energyEvToWavelengthNm(energy);
    const series = bohrSeries(to);
    setTransitions((items) => [{ from: shell, to, energy, wavelength, series }, ...items]);
    setShell(to);
  };
  const reset = () => {
    setShell(2);
    setTransitions([]);
  };
  const region = last ? wavelengthRegion(last.wavelength) : "No emission yet";
  const observation = last
    ? mode === "advanced"
      ? `Electron dropped from n=${last.from} to n=${last.to}. Delta E = ${formatEnergyEv(last.energy)}, lambda = ${formatWavelengthNm(last.wavelength)}, ${last.series} series, ${region}.`
      : `The electron dropped to a lower level and emitted a photon in the ${last.series} series.`
    : `Excite the atom, then drop to a lower n value to emit a photon and create a spectral line.`;

  return (
    <QuantumSimulationCard
      info={info}
      mode={mode}
      className={`quantum-bohr ${highlighted ? "quantum-sim-highlight" : ""}`}
      observation={observation}
      onReset={reset}
      outputs={[
        { label: "Current level", value: `n = ${shell}`, detail: formatEnergyEv(bohrEnergyLevelEv(shell)) },
        { label: "Last series", value: last?.series ?? "--" },
        { label: "Delta E", value: last ? formatEnergyEv(last.energy) : "-- eV" },
        { label: "Wavelength", value: last ? formatWavelengthNm(last.wavelength) : "-- nm", detail: region },
      ]}
      controls={(
        <div className="quantum-bohr-controls">
          <label className="quantum-select-control">
            <span>Current shell</span>
            <select value={shell} onChange={(event) => setShell(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>n = {n}</option>)}</select>
          </label>
          <button className="tool-btn" onClick={() => setShell(Math.min(6, shell + 1))}>Excite</button>
          {[1, 2, 3, 4, 5].map((n) => <button key={n} className="tool-btn" onClick={() => drop(n)} disabled={n >= shell}>Drop to n={n}</button>)}
        </div>
      )}
    >
      <canvas ref={canvasRef} className="quantum-canvas quantum-bohr-canvas" />
      <div className="quantum-spectrum-strip">
        {last && last.wavelength >= 380 && last.wavelength <= 700 && <div className="h-8 w-1 rounded bg-white shadow" style={{ marginLeft: `${((last.wavelength - 380) / 320) * 100}%`, boxShadow: `0 0 12px ${wavelengthToRgba(last.wavelength)}` }} />}
      </div>
      <table className="quantum-transition-table"><thead><tr><th>Series</th><th>Transition</th><th>Delta E</th><th>Lambda</th></tr></thead><tbody>{transitions.map((item, index) => <tr key={index}><td>{item.series}</td><td>{item.from} to {item.to}</td><td>{item.energy.toFixed(2)} eV</td><td>{item.wavelength.toFixed(1)} nm</td></tr>)}</tbody></table>
    </QuantumSimulationCard>
  );
}

function orbitRadius(n: number) {
  return 18 + n * n * 4;
}

function wavelengthRegion(wavelength: number) {
  if (!Number.isFinite(wavelength)) return "--";
  if (wavelength < 380) return "ultraviolet";
  if (wavelength <= 700) return "visible";
  return "infrared";
}
