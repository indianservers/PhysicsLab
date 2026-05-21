import { useEffect, useRef, useState } from "react";
import { wavelengthToRgba } from "../../engine/opticsEngine";

interface Transition { from: number; to: number; energy: number; wavelength: number; series: string }

export function BohrModelSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shell, setShell] = useState(2);
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const last = transitions[0];

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
    const energy = 13.6 * (1 / (to * to) - 1 / (shell * shell));
    const wavelength = 1240 / energy;
    const series = to === 1 ? "Lyman" : to === 2 ? "Balmer" : "Paschen";
    setTransitions((items) => [{ from: shell, to, energy, wavelength, series }, ...items]);
    setShell(to);
  };

  return (
    <div className="panel p-4">
      <h2 className="panel-title">Bohr Model / Atomic Emission</h2>
      <canvas ref={canvasRef} className="mt-3 h-72 w-full rounded bg-slate-950" />
      <div className="mt-3 flex flex-wrap gap-2">
        <select className="rounded bg-slate-100 p-2 dark:bg-slate-800" value={shell} onChange={(event) => setShell(Number(event.target.value))}>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>n = {n}</option>)}</select>
        <button className="tool-btn" onClick={() => setShell(Math.min(6, shell + 1))}>Excite</button>
        {[1, 2, 3, 4, 5].map((n) => <button key={n} className="tool-btn" onClick={() => drop(n)}>Drop to n={n}</button>)}
      </div>
      <div className="mt-4 h-8 rounded" style={{ background: "linear-gradient(90deg, violet, blue, cyan, green, yellow, orange, red)" }}>
        {last && last.wavelength >= 380 && last.wavelength <= 700 && <div className="h-8 w-1 rounded bg-white shadow" style={{ marginLeft: `${((last.wavelength - 380) / 320) * 100}%`, boxShadow: `0 0 12px ${wavelengthToRgba(last.wavelength)}` }} />}
      </div>
      <table className="mt-4 w-full text-left text-xs"><thead><tr><th>Series</th><th>Transition</th><th>Delta E</th><th>Lambda</th></tr></thead><tbody>{transitions.map((item, index) => <tr key={index} className="border-t border-slate-300/40 dark:border-lab-line"><td>{item.series}</td><td>{item.from} to {item.to}</td><td>{item.energy.toFixed(2)} eV</td><td>{item.wavelength.toFixed(1)} nm</td></tr>)}</tbody></table>
    </div>
  );
}

function orbitRadius(n: number) {
  return 18 + n * n * 4;
}
