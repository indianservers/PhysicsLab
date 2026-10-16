import { useId } from "react";
import { fieldSolution, type FieldInput } from "../lib/fieldStudio";

export type FieldView = "Field View" | "Potential View" | "Trajectories";
export const FIELD_G = 6.674e-11;

export function fieldProbe(input: FieldInput, time: number) {
  const angle = Math.sqrt(FIELD_G * input.mass / input.radius ** 3) * time;
  return { angle, x: input.radius * Math.cos(angle), y: input.radius * Math.sin(angle), direction: ((angle * 180 / Math.PI + 180) % 360 + 360) % 360 };
}

export function GravitationalFieldScene({ input, view, time, zoom }: { input: FieldInput; view: FieldView; time: number; zoom: number }) {
  const id = useId().replace(/:/g, "");
  const probe = fieldProbe(input, time), s = fieldSolution(input);
  const radius = 160 + 60 * Math.log10(input.radius / 1e6);
  const scale = input.radius / radius;
  const count = Math.round(input.density), rows = Math.round(count * 760 / 900);
  const px = 450 + radius * Math.cos(probe.angle), py = 380 - radius * Math.sin(probe.angle);
  const vectors = Array.from({ length: count * rows }, (_, i) => {
    const x = (i % count + .5) * 900 / count, y = (Math.floor(i / count) + .5) * 760 / rows;
    const dx = x - 450, dy = y - 380, r = Math.hypot(dx, dy);
    if (r < 165) return null;
    const g = FIELD_G * input.mass / (r * scale) ** 2;
    const length = Math.min(48, 4 + 36 * Math.log10(1 + g / .1));
    return <line key={i} data-field-vector="" data-field-strength={g} x1={x} y1={y} x2={x - dx / r * length} y2={y - dy / r * length} stroke="#21c7ff" strokeWidth="1.5" opacity={Math.min(.95, .3 + length / 50)} markerEnd={`url(#${id}-arrow)`}/>;
  });
  return <svg viewBox="0 0 900 760" role="img" aria-label={`${view}: inward gravitational field of a point mass. Probe radius ${input.radius.toExponential(2)} metres; field strength ${s.g.toFixed(3)} metres per second squared.`}>
    <defs>
      <marker id={`${id}-arrow`} viewBox="0 0 8 8" markerWidth="6" markerHeight="6" refX="7" refY="4" orient="auto"><path d="M0 1L8 4L0 7Z" fill="#33d2ff"/></marker>
      <radialGradient id={`${id}-halo`}><stop offset=".6" stopColor="#1b81b9" stopOpacity="0"/><stop offset=".85" stopColor="#1b81b9" stopOpacity=".25"/><stop offset="1" stopColor="#1b81b9" stopOpacity="0"/></radialGradient>
    </defs>
    <rect width="900" height="760" fill="#020e1b"/>
    <image href="/assets/physics-atlas/starfield.png" width="900" height="760" preserveAspectRatio="xMidYMid slice" opacity=".65"/>
    <g transform={`translate(450 380) scale(${zoom}) translate(-450 -380)`}>
      {view === "Field View" && <g>{vectors}</g>}
      {view === "Potential View" && Array.from({length:7},(_,i)=>{
        const r=170+i*42, phi=-FIELD_G*input.mass/(r*scale);
        return <g key={i}><circle data-equipotential="" cx="450" cy="380" r={r} fill="none" stroke="#b291ff" strokeWidth="1.5" opacity=".7"/><text x="460" y={380-r+16} fill="#d2bfff" fontSize="12">{phi.toExponential(1)} J/kg</text></g>;
      })}
      {view === "Trajectories" && <circle data-orbit-path="" cx="450" cy="380" r={radius} fill="none" stroke="#3ed9ee" strokeWidth="2" strokeDasharray="6 5"/>}
      <circle cx="450" cy="380" r="168" fill={`url(#${id}-halo)`}/>
      <circle cx="450" cy="380" r="128" fill="#0b3456"/>
      <image href="/assets/experiments/satellite-orbit/sprites/earth.png" x="310" y="240" width="280" height="280"/>
      <line x1="450" y1="380" x2={px} y2={py} stroke="#ccefff" strokeDasharray="5 5" opacity=".6"/>
      <circle data-gravity-probe="" data-world-x={probe.x} data-world-y={probe.y} cx={px} cy={py} r="9" fill="#d9eaff" stroke="#67d9ff" strokeWidth="2"/>
      <text x={px+14} y={py+26} fill="#d5eaff" fontSize="17">Probe</text>
      <line x1={px} y1={py} x2={px-36*Math.cos(probe.angle)} y2={py+36*Math.sin(probe.angle)} stroke="#72e7ff" strokeWidth="3" markerEnd={`url(#${id}-arrow)`}/>
    </g>
    <g fill="#c4e7ff" fontSize="14"><rect x="16" y="16" width="340" height="74" rx="5" fill="#031321" stroke="#25526e"/><text x="30" y="43">r = {input.radius.toExponential(2)} m</text><text x="30" y="69">|g| = {s.g.toFixed(3)} m/s² · θ = {probe.direction.toFixed(1)}°</text><text x="20" y="718">{view === "Field View" ? "Inward vectors · length uses a logarithmic scale" : view === "Potential View" ? "Contours of equal gravitational potential" : "Circular test-particle orbit · v = √(GM/r)"}</text><text x="20" y="743">Point-mass model · planet marker is not to scale</text></g>
  </svg>;
}

export function InverseSquareGraph({ input }: { input: FieldInput }) {
  const points = Array.from({length:81},(_,i)=>{
    const logR=6+i/20, g=FIELD_G*input.mass/10**(2*logR);
    return `${44+(logR-6)/4*292},${18+(4-Math.log10(g))/12*154}`;
  }).join(" ");
  const g=fieldSolution(input).g;
  return <svg viewBox="0 0 365 210" role="img" aria-label="Field strength versus radius on logarithmic axes">
    <path d="M44 18V172H336" fill="none" stroke="#7b9cb9"/>
    {[6,7,8,9,10].map((n,i)=><g key={n}><path d={`M${44+i*73} 18V172`} stroke="#17425b"/><text x={44+i*73} y="190" textAnchor="middle" fill="#aecce5" fontSize="11">10^{n}</text></g>)}
    {[4,0,-4,-8].map((n,i)=><g key={n}><path d={`M44 ${18+i*154/3}H336`} stroke="#17425b"/><text x="39" y={22+i*154/3} textAnchor="end" fill="#aecce5" fontSize="10">10^{n}</text></g>)}
    <polyline data-inverse-square="" points={points} fill="none" stroke="#36daff" strokeWidth="2"/>
    <circle data-probe-graph="" cx={44+(Math.log10(input.radius)-6)/4*292} cy={18+(4-Math.log10(g))/12*154} r="4" fill="#c277ff"/>
    <text x="180" y="207" fill="#b9d9f0" fontSize="12">r (m) · log scale</text><text x="48" y="13" fill="#b9d9f0" fontSize="11">|g| (m/s²) · log scale</text>
  </svg>;
}
