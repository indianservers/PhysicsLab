import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";

interface GuidedVisualizationProps {
  experiment: ExperimentDefinition;
  values: [number, number, number];
  outputs: { label: string; value: string }[];
  controls?: { label: string }[];
}

export function GuidedVisualization({ experiment, values, outputs, controls = [] }: GuidedVisualizationProps) {
  const [a, b, c] = values;
  const domain = experiment.curriculumTags?.domains[0] ?? experiment.category;
  const title = visualizationTitle(experiment);
  const animation = animationPlan(experiment);

  return (
    <div className="rounded-lg border border-slate-300/70 bg-slate-950 p-3 dark:border-lab-line">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/40 bg-cyan-300/10 text-cyan-200">
            <PhysicsIcon name={iconForExperiment(experiment)} />
          </span>
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-cyan-300">Interactive visualization</div>
            <h3 className="mt-1 font-black text-slate-100">{title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-xs font-bold text-cyan-200">{domain}</span>
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-1 text-xs font-bold text-amber-200">animated</span>
        </div>
      </div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
      <svg className="h-72 w-full rounded-md bg-slate-900" viewBox="0 0 760 300" role="img" aria-label={`${experiment.title} visualization`}>
        <defs>
          <pattern id={`grid-${experiment.id}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(148,163,184,.14)" strokeWidth="1" />
          </pattern>
          <marker id={`arrow-${experiment.id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" />
          </marker>
          {["default", "optics", "circuit", "fluid", "modern"].map((id) => (
            <marker key={id} id={`arrow-${id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" />
            </marker>
          ))}
        </defs>
        <rect width="760" height="300" fill={`url(#grid-${experiment.id})`} />
        {renderScene(experiment, a, b, c)}
        <g transform="translate(20 212)">
          <rect width="250" height="68" rx="10" fill="rgba(15,23,42,.78)" stroke="rgba(34,211,238,.28)" />
          <text x="14" y="22" fill="#67e8f9" fontSize="12" fontWeight="800">watch while changing</text>
          <text x="14" y="44" fill="#e2e8f0" fontSize="13">{controls[0]?.label ?? "Input A"} to {outputs[0]?.label ?? "main output"}</text>
          <text x="14" y="60" fill="#94a3b8" fontSize="11">one variable at a time gives the cleanest pattern</text>
        </g>
      </svg>
      <div className="grid content-start gap-2">
        <div className="rounded-md border border-slate-700 bg-slate-900 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-300">visual key</div>
          <LegendItem color="#22d3ee" label="active motion / output" />
          <LegendItem color="#f43f5e" label="force / field effect" />
          <LegendItem color="#facc15" label="reference / energy" />
        </div>
        <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-amber-200">{animation.title}</div>
          <p className="mt-2 text-xs text-slate-300">{animation.cue}</p>
        </div>
        {controls.slice(0, 3).map((control, index) => (
          <div key={control.label} className="rounded-md border border-slate-700 bg-slate-900 p-2">
            <div className="text-xs text-slate-400">{control.label}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-700">
              <span className="block h-full rounded-full bg-cyan-300" style={{ width: `${clamp(values[index] * 5, 8, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {outputs.slice(0, 3).map((output) => (
          <div key={output.label} className="rounded-md border border-slate-700 bg-slate-900 p-2">
            <div className="text-xs text-slate-400">{output.label}</div>
            <div className="mt-1 font-mono text-sm text-cyan-300">{output.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </div>
  );
}

function renderScene(experiment: ExperimentDefinition, a: number, b: number, c: number) {
  if (["mirror-formula", "lens-formula", "glass-slab-refraction", "prism-dispersion", "reflection-plane-mirror"].includes(experiment.id)) return <OpticsScene id={experiment.id} a={a} b={b} c={c} />;
  if (["ohms-law", "series-parallel-resistance", "electric-power", "heating-effect-current", "kirchhoff-circuit", "capacitor-lab", "semiconductor-diode", "ac-lcr-resonance"].includes(experiment.id)) return <CircuitScene id={experiment.id} a={a} b={b} c={c} />;
  if (["wave-lab", "single-slit-diffraction", "sound-pitch-loudness", "echo-speed-sound", "young-double-slit", "em-spectrum", "chladni-plate", "shm-spring", "simple-pendulum"].includes(experiment.id)) return <WaveScene id={experiment.id} a={a} b={b} c={c} />;
  if (["heat-and-temperature", "heat-transfer", "gas-laws", "thermodynamic-process"].includes(experiment.id)) return <ThermalScene id={experiment.id} a={a} b={b} c={c} />;
  if (["force-and-pressure", "fluid-pressure", "buoyancy", "bernoulli-fluid-flow"].includes(experiment.id)) return <FluidScene id={experiment.id} a={a} b={b} c={c} />;
  if (["static-electricity", "electrostatic-field-potential", "lorentz-force", "emi-faraday", "magnetic-field-current", "electromagnet"].includes(experiment.id)) return <FieldScene id={experiment.id} a={a} b={b} c={c} />;
  if (["photoelectric-equation", "nuclear-decay"].includes(experiment.id)) return <ModernScene id={experiment.id} a={a} b={b} c={c} />;
  return <MechanicsScene id={experiment.id} a={a} b={b} c={c} />;
}

function MechanicsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const blockX = clamp(120 + a * 12, 120, 520);
  const angle = clamp(b, 0, 80);
  const arrow = clamp(60 + c * 80, 40, 190);
  if (id === "vector-resolution") {
    const theta = (b * Math.PI) / 180;
    const sx = Math.cos(theta) * a * 3;
    const sy = Math.sin(theta) * a * 3;
    return (
      <g>
        <line x1="160" y1="235" x2="650" y2="235" stroke="#475569" />
        <line x1="160" y1="260" x2="160" y2="50" stroke="#475569" />
        <line x1="160" y1="235" x2={160 + sx} y2={235 - sy} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-vector-resolution)" />
        <circle r="6" fill="#22d3ee" className="lab-anim-glow">
          <animateMotion dur="1.8s" repeatCount="indefinite" path={`M 160 235 L ${160 + sx} ${235 - sy}`} />
        </circle>
        <line x1="160" y1="235" x2={160 + sx} y2="235" stroke="#34d399" strokeWidth="3" />
        <line x1={160 + sx} y1="235" x2={160 + sx} y2={235 - sy} stroke="#f59e0b" strokeWidth="3" />
        <text x="185" y="70" fill="#e2e8f0" fontSize="16">A = {a.toFixed(1)}, theta = {b.toFixed(0)} deg</text>
      </g>
    );
  }
  return (
    <g>
      <rect x="80" y="240" width="620" height="18" rx="4" fill="#475569" />
      <g className="lab-anim-float">
        <rect x={blockX} y="190" width="82" height="50" rx="6" fill="#38bdf8" />
        <circle cx={blockX + 18} cy="240" r="7" fill="#0f172a" />
        <circle cx={blockX + 64} cy="240" r="7" fill="#0f172a" />
      </g>
      <line className="lab-anim-pulse" x1={blockX + 92} y1="215" x2={blockX + 92 + arrow} y2="215" stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <path d={`M 120 240 L 340 240 L 340 ${240 - Math.sin((angle * Math.PI) / 180) * 120} Z`} fill="rgba(251,191,36,.32)" stroke="#fbbf24" />
      <text x="95" y="70" fill="#e2e8f0" fontSize="16">Mechanics model: vary controls and compare measured output</text>
      <text x="95" y="96" fill="#94a3b8" fontSize="13">Force, motion, energy, and geometry update from the live sliders.</text>
    </g>
  );
}

function OpticsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const rayY = 150;
  const bend = id === "prism-dispersion" ? 50 : id === "glass-slab-refraction" ? 28 : 0;
  const focus = clamp(120 + a * 4, 140, 330);
  return (
    <g>
      <line className="lab-anim-dash" x1="70" y1={rayY - 60} x2="330" y2={rayY} stroke="#fde047" strokeWidth="4" markerEnd="url(#arrow-optics)" />
      <circle r="5" fill="#fde047" className="lab-anim-glow">
        <animateMotion dur="1.7s" repeatCount="indefinite" path={`M 70 ${rayY - 60} L 330 ${rayY}`} />
      </circle>
      {id.includes("lens") && <ellipse cx="380" cy="150" rx="24" ry="105" fill="rgba(34,211,238,.24)" stroke="#67e8f9" strokeWidth="3" />}
      {id.includes("mirror") || id === "reflection-plane-mirror" ? <path d="M 410 55 Q 350 150 410 245" fill="none" stroke="#93c5fd" strokeWidth="6" /> : null}
      {id.includes("prism") || id.includes("glass") ? <path d="M 360 70 L 470 235 L 280 235 Z" fill="rgba(167,139,250,.28)" stroke="#c4b5fd" strokeWidth="3" /> : null}
      <line className="lab-anim-dash" x1="380" y1={rayY} x2="690" y2={rayY + bend} stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-optics)" />
      {id === "prism-dispersion" && [0, 1, 2, 3].map((item) => <line className="lab-anim-dash-fast" key={item} x1="470" y1="180" x2="690" y2={130 + item * 28} stroke={["#ef4444", "#facc15", "#22c55e", "#6366f1"][item]} strokeWidth="3" />)}
      <circle cx={380 + focus} cy="150" r="5" fill="#f43f5e" />
      <text x="80" y="40" fill="#e2e8f0" fontSize="16">Optics bench</text>
      <text x="80" y="266" fill="#94a3b8" fontSize="13">f/object/index controls reshape ray path and image prediction.</text>
    </g>
  );
}

function CircuitScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const brightness = clamp(a * b * 1.5, 12, 78);
  const current = clamp(a * 25, 8, 130);
  return (
    <g>
      <rect x="95" y="95" width="560" height="130" rx="16" fill="none" stroke="#64748b" strokeWidth="6" />
      <rect x="130" y="135" width="70" height="45" rx="6" fill="#22d3ee" />
      <text x="143" y="163" fill="#0f172a" fontSize="18" fontWeight="800">V</text>
      <rect x="315" y="126" width="118" height="62" rx="8" fill="#facc15" />
      <path d="M 330 157 L 348 137 L 366 177 L 384 137 L 402 177 L 420 157" fill="none" stroke="#0f172a" strokeWidth="4" />
      <circle className="lab-anim-glow" cx="575" cy="157" r="34" fill={`rgba(253,230,138,${brightness / 100})`} stroke="#fde68a" strokeWidth="4" />
      <line className="lab-anim-dash-fast" x1="210" y1="95" x2={210 + current} y2="95" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-circuit)" />
      {[0, 0.7, 1.4].map((delay) => (
        <circle key={delay} r="5" fill="#22d3ee">
          <animateMotion dur="2.1s" begin={`${delay}s`} repeatCount="indefinite" path="M130 95 H655 V225 H95 V95 H130" />
        </circle>
      ))}
      <text x="90" y="50" fill="#e2e8f0" fontSize="16">{id === "semiconductor-diode" ? "Diode/rectifier model" : "Circuit model"}</text>
      <text x="90" y="260" fill="#94a3b8" fontSize="13">Voltage, resistance, capacitance, or reactance controls update current and stored/output energy.</text>
    </g>
  );
}

function WaveScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const amp = clamp(b * 18, 8, 60);
  const frequency = clamp(a / 40, 0.3, 7);
  const points = Array.from({ length: 80 }, (_, index) => {
    const x = 70 + index * 8;
    const y = 150 + Math.sin(index / frequency) * amp;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  return (
    <g>
      <path className="lab-anim-dash" d={points} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <circle r="7" fill="#22d3ee" className="lab-anim-glow">
        <animateMotion dur="2.2s" repeatCount="indefinite" path={points} />
      </circle>
      {id === "young-double-slit" || id === "single-slit-diffraction" ? <g><rect x="320" y="55" width="14" height="190" fill="#94a3b8" /><line x1="334" y1="135" x2="690" y2="80" stroke="#a78bfa" /><line x1="334" y1="165" x2="690" y2="220" stroke="#a78bfa" /></g> : null}
      <circle className="lab-anim-pulse" cx="90" cy="150" r={clamp(c * 14 + 8, 8, 28)} fill="#34d399" />
      <text x="80" y="45" fill="#e2e8f0" fontSize="16">Wave pattern</text>
      <text x="80" y="265" fill="#94a3b8" fontSize="13">Frequency compresses wavelength; amplitude controls height/intensity.</text>
    </g>
  );
}

function ThermalScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const temp = clamp(a, -20, 800);
  const fill = clamp((temp + 20) / 820, 0.05, 1);
  return (
    <g>
      <rect x="110" y="70" width="92" height="175" rx="42" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
      <rect className="lab-anim-glow" x="140" y={230 - fill * 130} width="32" height={fill * 130} rx="16" fill="#ef4444" />
      <circle cx="156" cy="232" r="28" fill="#ef4444" />
      <rect x="330" y="100" width="245" height="110" rx="14" fill="rgba(249,115,22,.2)" stroke="#fb923c" strokeWidth="4" />
      {Array.from({ length: 22 }, (_, index) => (
        <circle key={index} cx={350 + (index % 8) * 28} cy={120 + Math.floor(index / 8) * 28} r={clamp(3 + b, 4, 10)} fill="#fbbf24" opacity={0.75}>
          <animate attributeName="cy" values={`${120 + Math.floor(index / 8) * 28};${114 + Math.floor(index / 8) * 28};${125 + Math.floor(index / 8) * 28};${120 + Math.floor(index / 8) * 28}`} dur={`${1.1 + (index % 5) * 0.18}s`} repeatCount="indefinite" />
          <animate attributeName="cx" values={`${350 + (index % 8) * 28};${356 + (index % 8) * 28};${344 + (index % 8) * 28};${350 + (index % 8) * 28}`} dur={`${1.25 + (index % 4) * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="90" y="45" fill="#e2e8f0" fontSize="16">{id === "gas-laws" ? "Gas particle model" : "Thermal energy model"}</text>
      <text x="90" y="268" fill="#94a3b8" fontSize="13">Temperature, mass, volume, and process controls update heat or pressure trends.</text>
    </g>
  );
}

function FluidScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const depth = clamp(c * 18, 18, 180);
  const pressure = clamp(a / 10 + b * 12, 40, 230);
  return (
    <g>
      <rect x="110" y="75" width="250" height="180" rx="10" fill="rgba(56,189,248,.18)" stroke="#38bdf8" strokeWidth="4" />
      <rect x="110" y={255 - depth} width="250" height={depth} fill="rgba(56,189,248,.42)">
        <animate attributeName="y" values={`${255 - depth};${252 - depth};${255 - depth}`} dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="height" values={`${depth};${depth + 3};${depth}`} dur="2.4s" repeatCount="indefinite" />
      </rect>
      <rect x="470" y="135" width="160" height="55" rx="28" fill="#34d399" opacity={id === "bernoulli-fluid-flow" ? 0.7 : 0.95} />
      <line className="lab-anim-dash-fast" x1="420" y1="162" x2={420 + pressure} y2="162" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-fluid)" />
      {[0, 0.55, 1.1].map((delay) => (
        <circle key={delay} r="5" fill="#67e8f9">
          <animateMotion dur="1.65s" begin={`${delay}s`} repeatCount="indefinite" path="M420 162 H640" />
        </circle>
      ))}
      <text x="90" y="45" fill="#e2e8f0" fontSize="16">Fluid model</text>
      <text x="90" y="278" fill="#94a3b8" fontSize="13">Depth, density, speed, and area controls drive pressure, buoyancy, or Bernoulli flow.</text>
    </g>
  );
}

function FieldScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const leftCharge = a >= 0 ? "#ef4444" : "#38bdf8";
  const rightCharge = b >= 0 ? "#ef4444" : "#38bdf8";
  return (
    <g>
      {Array.from({ length: 8 }, (_, index) => {
        const y = 72 + index * 22;
        return <path className="lab-anim-dash" key={index} d={`M 190 ${y} C 300 ${y - 50} 450 ${y + 50} 570 ${y}`} fill="none" stroke="rgba(34,211,238,.35)" strokeWidth="2" />;
      })}
      <circle cx="190" cy="150" r="42" fill={leftCharge}><animate attributeName="r" values="39;44;39" dur="1.5s" repeatCount="indefinite" /></circle>
      <circle cx="570" cy="150" r="42" fill={rightCharge}><animate attributeName="r" values="44;39;44" dur="1.5s" repeatCount="indefinite" /></circle>
      <text x="180" y="158" fill="#fff" fontSize="26" fontWeight="900">{a >= 0 ? "+" : "-"}</text>
      <text x="560" y="158" fill="#fff" fontSize="26" fontWeight="900">{b >= 0 ? "+" : "-"}</text>
      {id.includes("magnetic") || id.includes("electromagnet") || id.includes("emi") ? <rect className="lab-anim-glow" x="320" y="118" width="110" height="64" rx="8" fill="#d946ef" /> : null}
      <text x="82" y="45" fill="#e2e8f0" fontSize="16">Field interaction</text>
      <text x="82" y="265" fill="#94a3b8" fontSize="13">Charge/current/field controls change force direction and strength.</text>
    </g>
  );
}

function ModernScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const emitted = a > b;
  const remaining = id === "nuclear-decay" ? clamp(220 * 0.5 ** (c / Math.max(1, b)), 10, 220) : 140;
  return (
    <g>
      <rect x="90" y="115" width="180" height="70" rx="10" fill="#475569" />
      <line className={emitted ? "lab-anim-dash-fast" : ""} x1="280" y1="150" x2="475" y2="150" stroke={emitted ? "#22d3ee" : "#64748b"} strokeWidth="5" markerEnd="url(#arrow-modern)" />
      {emitted && <circle r="6" fill="#22d3ee"><animateMotion dur="1.3s" repeatCount="indefinite" path="M280 150 H475" /></circle>}
      <circle className={emitted ? "lab-anim-pulse" : ""} cx="520" cy="150" r={emitted ? 20 : 8} fill={emitted ? "#22d3ee" : "#64748b"} />
      {id === "nuclear-decay" ? <rect x="90" y="220" width={remaining} height="18" rx="9" fill="#f43f5e" /> : null}
      <text x="82" y="45" fill="#e2e8f0" fontSize="16">{id === "nuclear-decay" ? "Half-life model" : "Photoelectric model"}</text>
      <text x="82" y="265" fill="#94a3b8" fontSize="13">Quantum inputs determine emission, energy, or remaining nuclei.</text>
    </g>
  );
}

function visualizationTitle(experiment: ExperimentDefinition) {
  if (experiment.category === "Optics") return "Ray and image model";
  if (experiment.category === "Electricity") return "Circuit response model";
  if (experiment.category === "Waves") return "Wave pattern model";
  if (experiment.category === "Thermodynamics") return "Thermal state model";
  if (experiment.category === "Fluid Mechanics") return "Fluid pressure model";
  return `${experiment.category} model`;
}

function animationPlan(experiment: ExperimentDefinition) {
  if (experiment.category === "Optics") return { title: "ray animation", cue: "Follow the moving photon and dashed ray path to see reflection, refraction, focus, or dispersion." };
  if (experiment.category === "Electricity" || experiment.category === "Electronics") return { title: "charge flow", cue: "Moving dots show conventional current; bulb glow and arrow speed show stronger electrical response." };
  if (experiment.category === "Waves") return { title: "wave phase", cue: "The traveling marker follows the crest pattern, making wavelength and amplitude easier to compare." };
  if (experiment.category === "Thermodynamics") return { title: "particle motion", cue: "Particle jitter and thermometer glow increase as thermal activity becomes more intense." };
  if (experiment.category === "Fluid Mechanics") return { title: "flow and pressure", cue: "Flow markers and pulsing water level show how depth, density, pressure, and speed are linked." };
  if (experiment.category === "Magnetism") return { title: "field pulse", cue: "Animated field lines show direction and strength changes around currents, magnets, and charges." };
  if (experiment.category === "Modern Physics") return { title: "quantum event", cue: "Animated emission marks when energy conditions allow electrons, photons, or nuclear change." };
  return { title: "motion cue", cue: "The moving object and pulsing vector show the changing force, velocity, or geometry." };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
