import { useEffect, useRef, useState } from "react";
import { ELECTRON_CHARGE, PHOTOELECTRIC_METALS, PhotoelectricMetal, PLANCK_CONSTANT } from "../../physics/quantum/quantumConstants";
import { QuantumControlSlider } from "../../physics/quantum/components/QuantumControlSlider";
import { QuantumSimulationCard } from "../../physics/quantum/components/QuantumSimulationCard";
import { quantumSimulationById, QuantumLearningMode } from "../../physics/quantum/quantumLabData";
import { formatEnergyEv, formatScientific, frequencyToPhotonEnergyEv } from "../../physics/quantum/quantumUtils";

export function PhotoelectricSim({ mode = "normal", highlighted = false }: { mode?: QuantumLearningMode; highlighted?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequency, setFrequency] = useState(8e14);
  const [intensity, setIntensity] = useState(0.6);
  const [metal, setMetal] = useState<PhotoelectricMetal>("Sodium");
  const info = quantumSimulationById("photoelectric");
  const workFunction = PHOTOELECTRIC_METALS[metal];
  const photonEnergy = frequencyToPhotonEnergyEv(frequency);
  const ke = Math.max(0, photonEnergy - workFunction);
  const thresholdFrequency = (workFunction * ELECTRON_CHARGE) / PLANCK_CONSTANT;
  const current = ke > 0 ? intensity * Math.max(0.05, ke) : 0;
  const reset = () => {
    setFrequency(8e14);
    setIntensity(0.6);
    setMetal("Sodium");
  };
  const observation = ke <= 0
    ? `Photon energy ${formatEnergyEv(photonEnergy)} is below ${metal}'s work function ${formatEnergyEv(workFunction)}, so no electrons are emitted.`
    : mode === "advanced"
      ? `Emission occurs. Kmax = hf - phi = ${formatEnergyEv(ke)}, so stopping potential is ${ke.toFixed(2)} V. Intensity changes relative current, not Kmax.`
      : `Electrons are emitted. Increasing intensity now increases current, while frequency controls maximum kinetic energy.`;

  useEffect(() => {
    let frame = 0;
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
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(0, height - 55, width, 55);
      ctx.fillStyle = "#facc15";
      for (let i = 0; i < 30 * intensity; i += 1) {
        const x = (i * 47 + frame * (1 + intensity)) % width;
        const y = (i * 31 + frame * 2) % (height - 70);
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (ke > 0) {
        ctx.fillStyle = "#38bdf8";
        for (let i = 0; i < 24 * intensity; i += 1) {
          const x = (i * 53 + 30) % width;
          const y = height - 55 - ((frame * (1 + Math.sqrt(ke)) + i * 17) % (height - 75));
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = "#facc15";
        ctx.font = "20px sans-serif";
        ctx.fillText("No emission", 24, 36);
      }
      frame += 1;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [frequency, intensity, metal, ke]);

  return (
    <QuantumSimulationCard
      info={info}
      mode={mode}
      className={`quantum-photoelectric ${highlighted ? "quantum-sim-highlight" : ""}`}
      observation={observation}
      onReset={reset}
      outputs={[
        { label: "Photon E", value: formatEnergyEv(photonEnergy), detail: "from frequency" },
        { label: "Work phi", value: formatEnergyEv(workFunction), detail: metal },
        { label: "Max KE", value: formatEnergyEv(ke), detail: ke > 0 ? "emission" : "blocked" },
        { label: "Stopping V", value: `${ke.toFixed(2)} V`, detail: "Vs = Kmax/e" },
        { label: "Threshold f", value: formatScientific(thresholdFrequency, "Hz") },
        { label: "Current", value: current.toFixed(2), detail: "relative" },
      ]}
      controls={(
        <>
          <QuantumControlSlider label="Frequency" value={frequency} min={1e14} max={2e15} step={1e13} unit="Hz" onChange={setFrequency} />
          <QuantumControlSlider label="Intensity" value={intensity} min={0} max={1} step={0.01} onChange={setIntensity} />
          <label className="quantum-select-control">
            <span>Metal</span>
            <select value={metal} onChange={(event) => setMetal(event.target.value as PhotoelectricMetal)}>
              {Object.keys(PHOTOELECTRIC_METALS).map((name) => <option key={name}>{name}</option>)}
            </select>
          </label>
        </>
      )}
    >
      <canvas ref={canvasRef} className="quantum-canvas quantum-photoelectric-canvas" />
    </QuantumSimulationCard>
  );
}
