import { useEffect, useRef, useState } from "react";

const metals = { Sodium: 2.3, Zinc: 4.3, Gold: 5.1 };
const hEv = 4.135667696e-15;

export function PhotoelectricSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequency, setFrequency] = useState(8e14);
  const [intensity, setIntensity] = useState(0.6);
  const [metal, setMetal] = useState<keyof typeof metals>("Sodium");
  const photonEnergy = hEv * frequency;
  const ke = Math.max(0, photonEnergy - metals[metal]);

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
    <div className="panel p-4">
      <h2 className="panel-title">Photoelectric Effect</h2>
      <canvas ref={canvasRef} className="mt-3 h-64 w-full rounded bg-slate-950" />
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <label className="property-row"><span>Frequency</span><input type="range" min={1e14} max={2e15} step={1e13} value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} /></label>
        <label className="property-row"><span>Intensity</span><input type="range" min={0} max={1} step={0.01} value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label>
        <label className="property-row"><span>Metal</span><select value={metal} onChange={(event) => setMetal(event.target.value as keyof typeof metals)}><option>Sodium</option><option>Zinc</option><option>Gold</option></select></label>
      </div>
      <div className="mt-3 grid gap-2 text-sm md:grid-cols-4">
        <Metric label="Photon E" value={`${photonEnergy.toFixed(2)} eV`} />
        <Metric label="Max KE" value={`${ke.toFixed(2)} eV`} />
        <Metric label="Stopping V" value={`${ke.toFixed(2)} V`} />
        <Metric label="Current" value={ke > 0 ? (intensity * ke).toFixed(2) : "0.00"} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-slate-300/60 p-2 dark:border-lab-line"><div className="text-slate-500">{label}</div><div className="font-mono text-cyan-500">{value}</div></div>;
}
