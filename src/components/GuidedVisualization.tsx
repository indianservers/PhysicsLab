import { useRef } from "react";
import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { makePrismModel } from "../lib/prism";
import { FullscreenButton } from "./FullscreenButton";
import { getExperimentVisualizationSpec, isPanePending } from "../lib/experimentVisualizationSpecs";
import { PendingVisualizationCard } from "./PendingVisualizationCard";

interface GuidedVisualizationProps {
  experiment: ExperimentDefinition;
  values: [number, number, number];
  outputs: { label: string; value: string }[];
  controls?: { label: string }[];
}

export function GuidedVisualization({ experiment, values, outputs, controls = [] }: GuidedVisualizationProps) {
  const [a, b, c] = values;
  const visualizationSpec = getExperimentVisualizationSpec(experiment.id);
  if (!visualizationSpec || isPanePending(visualizationSpec.twoD)) {
    // VISUALIZATION_PHASE_2: Replace pending 2D roadmap cards with experiment-specific apparatus scenes by assigned phase.
    return <PendingVisualizationCard experiment={experiment} pane="twoD" />;
  }
  const domain = experiment.curriculumTags?.domains[0] ?? experiment.category;
  const title = visualizationTitle(experiment);
  const animation = animationPlan(experiment);
  const panelRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={panelRef} className="guided-visualization-card fullscreen-target rounded-lg border border-slate-300/70 bg-slate-950 p-3 dark:border-lab-line">
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
          <FullscreenButton targetRef={panelRef} compact />
          <span className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-xs font-bold text-cyan-200">{domain}</span>
          <span className="rounded-full border border-amber-300/40 bg-amber-300/10 px-2 py-1 text-xs font-bold text-amber-200">animated</span>
        </div>
      </div>
      <div className="guided-visualization-main mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
      <svg className="guided-visualization-svg h-72 w-full rounded-md bg-slate-900" viewBox="0 0 760 300" role="img" aria-label={`${experiment.title} visualization`}>
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
      </svg>
      <div className="guided-visualization-aside grid content-start gap-2">
        <div className="rounded-md border border-cyan-300/30 bg-cyan-300/10 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-200">watch while changing</div>
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-200">
            <span className="text-cyan-200">{controls[0]?.label ?? "Input A"}</span>
            <span className="text-slate-400"> to </span>
            <span className="text-cyan-200">{outputs[0]?.label ?? "main output"}</span>
          </p>
          <p className="mt-1 text-[11px] leading-4 text-slate-400">One variable at a time gives the cleanest pattern.</p>
        </div>
        <div className="rounded-md border border-slate-700 bg-slate-900 p-3">
          <div className="text-xs font-black uppercase tracking-widest text-cyan-300">visual key</div>
          <LegendItem color="#22d3ee" label="blue arrow: motion, ray, current, or measured output" />
          <LegendItem color="#f43f5e" label="red arrow: force, field effect, loss, or threshold" />
          <LegendItem color="#facc15" label="yellow marker: reference, energy, photon, or guide value" />
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
      <div className="guided-visualization-outputs mt-3 grid gap-2 md:grid-cols-3">
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
  if (["mirror-formula", "lens-formula", "glass-slab-refraction", "prism-dispersion", "reflection-plane-mirror", "shadows-eclipses", "multiple-reflection", "human-eye-defects", "total-internal-reflection", "optical-instruments"].includes(experiment.id)) return <OpticsScene id={experiment.id} a={a} b={b} c={c} />;
  if (["ohms-law", "series-parallel-resistance", "electric-power", "heating-effect-current", "chemical-effects-current", "kirchhoff-circuit", "capacitor-lab", "semiconductor-diode", "ac-lcr-resonance", "meter-bridge", "internal-resistance-cell", "ac-generator", "transformer-lab", "logic-gates", "sources-of-energy"].includes(experiment.id)) return <CircuitScene id={experiment.id} a={a} b={b} c={c} />;
  if (["wave-lab", "single-slit-diffraction", "sound-pitch-loudness", "echo-speed-sound", "young-double-slit", "em-spectrum", "chladni-plate", "shm-spring", "simple-pendulum", "sound-wave-anatomy", "polarization-lab"].includes(experiment.id)) return <WaveScene id={experiment.id} a={a} b={b} c={c} />;
  if (["heat-and-temperature", "heat-transfer", "gas-laws", "thermodynamic-process", "calorimetry-mixing", "statistical-ensemble-lab"].includes(experiment.id)) return <ThermalScene id={experiment.id} a={a} b={b} c={c} />;
  if (["force-and-pressure", "fluid-pressure", "buoyancy", "bernoulli-fluid-flow"].includes(experiment.id)) return <FluidScene id={experiment.id} a={a} b={b} c={c} />;
  if (["static-electricity", "electrostatic-field-potential", "lorentz-force", "emi-faraday", "magnetic-field-current", "electromagnet"].includes(experiment.id)) return <FieldScene id={experiment.id} a={a} b={b} c={c} />;
  if (["photoelectric-equation", "nuclear-decay", "de-broglie-wavelength", "bohr-model", "special-relativity-bridge", "advanced-quantum-operators"].includes(experiment.id)) return <ModernScene id={experiment.id} a={a} b={b} c={c} />;
  if (["measurement-errors", "computational-physics-workflow"].includes(experiment.id)) return <MeasurementWorkflowScene id={experiment.id} a={a} b={b} c={c} />;
  return <MechanicsScene id={experiment.id} a={a} b={b} c={c} />;
}

function MechanicsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "free-fall") return <FreeFallScene a={a} b={b} c={c} />;
  if (id === "mass-and-weight") return <MassWeightScene a={a} b={b} c={c} />;
  if (id === "rotational-dynamics") return <RotationalDynamicsScene a={a} b={b} c={c} />;
  if (id === "satellite-orbit") return <SatelliteOrbitScene a={a} b={b} c={c} />;
  if (id === "distance-time-graph" || id === "uniform-motion") return <UniformMotionGraphScene id={id} a={a} b={b} c={c} />;
  if (id === "universal-gravitation") return <UniversalGravitationScene a={a} b={b} c={c} />;
  if (id === "elastic-collision") return <ElasticCollisionScene a={a} b={b} c={c} />;
  if (id === "hooke-s-law") return <HookesLawScene a={a} b={b} c={c} />;
  if (id === "newton-s-second-law" || id === "balanced-unbalanced-forces") return <FreeBodyScene id={id} a={a} b={b} c={c} />;
  if (id === "friction") return <FrictionScene a={a} b={b} c={c} />;
  if (id === "inclined-plane") return <InclineComponentsScene a={a} b={b} c={c} />;
  if (id === "conservation-of-energy" || id === "work-power") return <EnergyBarsScene id={id} a={a} b={b} c={c} />;
  if (id === "circular-motion") return <CircularForceScene a={a} b={b} c={c} />;
  if (id === "simple-pendulum" || id === "shm-spring") return <OscillationScene id={id} a={a} b={b} c={c} />;
  if (id === "chaotic-coupled-oscillators") return <CoupledOscillatorScene a={a} b={b} c={c} />;
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

function FreeFallScene({ a, b, c }: { a: number; b: number; c: number }) {
  const height = clamp(a, 5, 120);
  const g = clamp(c || 9.81, 1, 20);
  const time = Math.sqrt((2 * height) / g);
  const velocity = b + g * time;
  const ballY = clamp(78 + (height / 120) * 150, 94, 226);
  return (
    <g>
      <rect x="120" y="42" width="155" height="216" rx="10" fill="rgba(15,23,42,.72)" stroke="#475569" strokeWidth="4" />
      <line x1="198" y1="62" x2="198" y2="244" stroke="#94a3b8" strokeWidth="3" strokeDasharray="7 6" />
      {[0, 1, 2, 3, 4].map((gate) => <line key={gate} x1="138" y1={70 + gate * 40} x2="258" y2={70 + gate * 40} stroke="#22d3ee" strokeWidth="2" opacity=".75" />)}
      {[0, 1, 2, 3, 4].map((ghost) => <circle key={ghost} cx="198" cy={76 + ghost * ghost * 9.5} r="8" fill="#67e8f9" opacity={0.18 + ghost * 0.12} />)}
      <circle cx="198" cy={ballY} r="18" fill="#facc15" stroke="#fde68a" strokeWidth="3" className="lab-anim-glow" />
      <line x1="236" y1={ballY - 4} x2="236" y2={ballY + clamp(velocity * 2, 45, 130)} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x="245" y={ballY + 52} fill="#f43f5e" fontSize="13" fontWeight="900">v down</text>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">drop tower: equal time gaps widen</text>
      <text x="82" y="274" fill="#94a3b8" fontSize="13">Air resistance ignored. s = ut + 1/2 gt^2, v = u + gt.</text>
      <rect x="350" y="58" width="320" height="176" rx="12" fill="rgba(15,23,42,.7)" stroke="#334155" />
      <line x1="390" y1="200" x2="635" y2="200" stroke="#64748b" />
      <line x1="390" y1="200" x2="390" y2="82" stroke="#64748b" />
      <polyline points={`390,190 445,172 500,148 555,118 620,82`} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <circle cx={clamp(390 + time * 45, 400, 635)} cy={clamp(200 - velocity * 3, 86, 190)} r="6" fill="#facc15" />
      <text x="408" y="78" fill="#67e8f9" fontSize="13" fontWeight="900">velocity-time graph</text>
      <text x="392" y="230" fill="#e2e8f0" fontSize="13" fontWeight="900">h {height.toFixed(1)} m | t {time.toFixed(2)} s | v {velocity.toFixed(1)} m/s</text>
    </g>
  );
}

function MassWeightScene({ a, b }: { a: number; b: number; c: number }) {
  const mass = clamp(a, 0.2, 80);
  const g = clamp(b || 9.81, 1.6, 25);
  const weight = mass * g;
  const spring = clamp(weight / 30, 20, 120);
  return (
    <g>
      <text x="82" y="38" fill="#e2e8f0" fontSize="16" fontWeight="900">mass stays same; weight changes with g</text>
      <rect x="94" y="78" width="250" height="166" rx="14" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <line x1="135" y1="174" x2="305" y2="174" stroke="#facc15" strokeWidth="5" />
      <polygon points="220,174 200,230 240,230" fill="#64748b" />
      <circle cx="145" cy="150" r={clamp(18 + mass / 6, 20, 45)} fill="#22d3ee" opacity=".9" />
      <circle cx="295" cy="150" r={clamp(18 + mass / 6, 20, 45)} fill="#22d3ee" opacity=".9" />
      <text x="126" y="102" fill="#67e8f9" fontSize="13" fontWeight="900">beam balance</text>
      <text x="128" y="266" fill="#94a3b8" fontSize="13">mass = {mass.toFixed(1)} kg on every planet</text>
      <rect x="410" y="62" width="170" height="206" rx="14" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <line x1="495" y1="86" x2="495" y2={86 + spring} stroke="#67e8f9" strokeWidth="4" strokeDasharray="6 5" />
      <rect x="455" y={86 + spring} width="80" height="46" rx="8" fill="#facc15" stroke="#fde68a" strokeWidth="3" />
      <line x1="590" y1="94" x2="590" y2={94 + clamp(g * 5, 30, 130)} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x="604" y="132" fill="#f43f5e" fontSize="13" fontWeight="900">g</text>
      <text x="432" y="42" fill="#e2e8f0" fontSize="14" fontWeight="900">spring scale on selected body</text>
      <text x="428" y="286" fill="#facc15" fontSize="14" fontWeight="900">Weight = {weight.toFixed(1)} N, g = {g.toFixed(2)} m/s^2</text>
    </g>
  );
}

function RotationalDynamicsScene({ a, b, c }: { a: number; b: number; c: number }) {
  const force = clamp(a, 0, 120);
  const radius = clamp(b, 0.2, 3);
  const inertia = clamp(c || 1, 0.2, 12);
  const torque = force * radius;
  const alpha = torque / inertia;
  const cx = 260;
  const cy = 154;
  const r = clamp(radius * 42, 46, 118);
  return (
    <g>
      <text x="82" y="38" fill="#e2e8f0" fontSize="16" fontWeight="900">torque wheel: larger radius gives more turning effect</text>
      <circle cx={cx} cy={cy} r={r} fill="rgba(34,211,238,.16)" stroke="#67e8f9" strokeWidth="5" />
      <circle cx={cx} cy={cy} r="8" fill="#facc15" />
      <line x1={cx} y1={cy} x2={cx + r} y2={cy} stroke="#facc15" strokeWidth="4" />
      <line x1={cx + r} y1={cy} x2={cx + r} y2={cy - clamp(force, 35, 120)} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <path d={`M ${cx - 76} ${cy} A 76 76 0 0 1 ${cx} ${cy - 76}`} fill="none" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x={cx + r + 12} y={cy - 72} fill="#f43f5e" fontSize="13" fontWeight="900">F</text>
      <text x="106" y="272" fill="#94a3b8" fontSize="13">tau = rF, alpha = tau/I</text>
      <rect x="450" y="62" width="230" height="174" rx="12" fill="rgba(15,23,42,.7)" stroke="#334155" />
      <text x="470" y="92" fill="#67e8f9" fontSize="13" fontWeight="900">torque {torque.toFixed(1)} N m</text>
      <text x="470" y="122" fill="#facc15" fontSize="13" fontWeight="900">I {inertia.toFixed(2)} kg m^2</text>
      <text x="470" y="152" fill="#22d3ee" fontSize="13" fontWeight="900">alpha {alpha.toFixed(2)} rad/s^2</text>
      <rect x="470" y="180" width="170" height="12" rx="6" fill="#334155" />
      <rect x="470" y="180" width={clamp(alpha * 18, 12, 170)} height="12" rx="6" fill="#22d3ee" />
    </g>
  );
}

function SatelliteOrbitScene({ a, b, c }: { a: number; b: number; c: number }) {
  const massFactor = clamp(a || 1, 0.2, 10);
  const radius = clamp(b, 1, 12);
  const speed = clamp(c, 0, 20);
  const circular = Math.sqrt(massFactor / radius) * 7;
  const escape = circular * Math.SQRT2;
  const state = speed > escape ? "escape" : speed > circular * 0.75 ? "orbit" : "suborbital";
  const cx = 310;
  const cy = 152;
  const r = clamp(radius * 13, 58, 138);
  const sx = cx + r * 0.76;
  const sy = cy - r * 0.48;
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">orbit vs escape speed</text>
      <circle cx={cx} cy={cy} r="42" fill="#38bdf8" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={state === "escape" ? "#f43f5e" : "#22d3ee"} strokeWidth="4" strokeDasharray={state === "suborbital" ? "12 8" : undefined} />
      {state === "escape" && <path d={`M ${sx} ${sy} C 500 60 600 48 690 80`} fill="none" stroke="#f43f5e" strokeWidth="4" />}
      <circle cx={sx} cy={sy} r="14" fill="#facc15" className="lab-anim-glow" />
      <line x1={sx} y1={sy} x2={sx + 92} y2={sy + 54} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1={sx} y1={sy} x2={cx} y2={cy} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x={sx + 66} y={sy + 40} fill="#22d3ee" fontSize="13" fontWeight="900">v</text>
      <text x={(sx + cx) / 2 - 10} y={(sy + cy) / 2 - 8} fill="#f43f5e" fontSize="13" fontWeight="900">g</text>
      <rect x="490" y="126" width="190" height="96" rx="12" fill="rgba(15,23,42,.7)" stroke="#334155" />
      <text x="510" y="154" fill="#e2e8f0" fontSize="14" fontWeight="900">regime: {state}</text>
      <text x="510" y="180" fill="#67e8f9" fontSize="12" fontWeight="900">circular {circular.toFixed(1)}</text>
      <text x="510" y="200" fill="#f43f5e" fontSize="12" fontWeight="900">escape {escape.toFixed(1)}</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Not to scale. Point-mass planet; circular and escape thresholds are separated.</text>
    </g>
  );
}

function UniformMotionGraphScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const speed = clamp(a, -20, 40);
  const time = clamp(b || c || 5, 1, 20);
  const start = id === "uniform-motion" ? clamp(c, -50, 50) : 0;
  const distance = start + speed * time;
  const cartX = clamp(130 + (distance + 60) * 3, 110, 420);
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">{id === "uniform-motion" ? "ticker tape: equal spacing means constant velocity" : "distance-time graph builder"}</text>
      <line x1="90" y1="210" x2="430" y2="210" stroke="#64748b" strokeWidth="7" />
      {Array.from({ length: 8 }, (_, i) => <line key={i} x1={110 + i * 42} y1="196" x2={110 + i * 42} y2="224" stroke="#94a3b8" strokeWidth="2" />)}
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={130 + i * clamp(Math.abs(speed) * 3, 18, 48)} cy="238" r="5" fill="#facc15" opacity=".85" />)}
      <rect x={cartX} y="162" width="70" height="46" rx="7" fill="#38bdf8" stroke="#67e8f9" strokeWidth="3" />
      <circle cx={cartX + 16} cy="210" r="8" fill="#020617" />
      <circle cx={cartX + 54} cy="210" r="8" fill="#020617" />
      <line x1={cartX + 78} y1="182" x2={cartX + 78 + clamp(speed * 4, -90, 110)} y2="182" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <rect x="480" y="62" width="220" height="178" rx="12" fill="rgba(15,23,42,.7)" stroke="#334155" />
      <line x1="510" y1="206" x2="670" y2="206" stroke="#64748b" />
      <line x1="510" y1="206" x2="510" y2="86" stroke="#64748b" />
      <line x1="510" y1={206 - clamp(start, -20, 60)} x2="670" y2={206 - clamp(start + speed * 6, -20, 115)} stroke="#22d3ee" strokeWidth="4" />
      <circle cx="620" cy={206 - clamp(distance, -20, 115)} r="6" fill="#facc15" />
      <text x="536" y="82" fill="#67e8f9" fontSize="13" fontWeight="900">distance-time</text>
      <text x="92" y="276" fill="#94a3b8" fontSize="13">Slope = speed. x = x0 + vt. Speed {speed.toFixed(1)} m/s, distance {distance.toFixed(1)} m.</text>
    </g>
  );
}

function UniversalGravitationScene({ a, b, c }: { a: number; b: number; c: number }) {
  const m1 = clamp(a, 1, 12);
  const m2 = clamp(b, 1, 12);
  const distance = clamp(c, 1, 20);
  const force = (m1 * m2) / (distance * distance);
  const cx = 260;
  const cy = 150;
  const tx = clamp(cx + distance * 18, 340, 650);
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">inverse-square gravitational field map</text>
      {[55, 90, 125, 160].map((r, index) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="8 8" opacity={1 - index * 0.15} />)}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = cx + Math.cos(angle) * 120;
        const y = cy + Math.sin(angle) * 120;
        return <line key={i} x1={x} y1={y} x2={x - Math.cos(angle) * 32} y2={y - Math.sin(angle) * 32} stroke="#22d3ee" strokeWidth="3" markerEnd="url(#arrow-default)" opacity=".75" />;
      })}
      <circle cx={cx} cy={cy} r={clamp(20 + m1 * 2, 24, 48)} fill="#38bdf8" stroke="#67e8f9" strokeWidth="4" />
      <circle cx={tx} cy={cy} r={clamp(12 + m2, 14, 32)} fill="#facc15" stroke="#fde68a" strokeWidth="3" />
      <line x1={tx} y1={cy} x2={cx + 44} y2={cy} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1={cx} y1="244" x2={tx} y2="244" stroke="#94a3b8" strokeWidth="3" />
      <text x={(cx + tx) / 2 - 28} y="236" fill="#94a3b8" fontSize="13" fontWeight="900">r = {distance.toFixed(1)}</text>
      <text x="440" y="72" fill="#e2e8f0" fontSize="14" fontWeight="900">F = G m1 m2 / r^2</text>
      <text x="440" y="100" fill="#f43f5e" fontSize="13" fontWeight="900">relative force {force.toFixed(2)}</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Point-mass model; not to scale; distance is clamped away from zero.</text>
    </g>
  );
}

function ElasticCollisionScene({ a, b, c }: { a: number; b: number; c: number }) {
  const m1 = clamp(a, 0.5, 10);
  const m2 = clamp(b, 0.5, 10);
  const u1 = clamp(c || 4, -10, 10);
  const u2 = -u1 * 0.35;
  const v1 = ((m1 - m2) / (m1 + m2)) * u1 + (2 * m2 / (m1 + m2)) * u2;
  const v2 = (2 * m1 / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">ideal elastic collision: momentum and KE conserved</text>
      <line x1="80" y1="190" x2="710" y2="190" stroke="#64748b" strokeWidth="8" />
      <line x1="380" y1="146" x2="380" y2="220" stroke="#facc15" strokeWidth="3" strokeDasharray="6 5" />
      <rect x="170" y="142" width={clamp(48 + m1 * 6, 54, 112)} height="48" rx="7" fill="#38bdf8" stroke="#67e8f9" strokeWidth="3" />
      <rect x="510" y="142" width={clamp(48 + m2 * 6, 54, 112)} height="48" rx="7" fill="#facc15" stroke="#fde68a" strokeWidth="3" />
      <line x1="170" y1="132" x2={170 + clamp(u1 * 18, -90, 120)} y2="132" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-default)" />
      <line x1="510" y1="132" x2={510 + clamp(u2 * 18, -90, 120)} y2="132" stroke="#f43f5e" strokeWidth="4" markerEnd="url(#arrow-default)" />
      <line x1="240" y1="222" x2={240 + clamp(v1 * 18, -90, 120)} y2="222" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-default)" />
      <line x1="580" y1="222" x2={580 + clamp(v2 * 18, -90, 120)} y2="222" stroke="#f43f5e" strokeWidth="4" markerEnd="url(#arrow-default)" />
      <text x="96" y="88" fill="#67e8f9" fontSize="13" fontWeight="900">before</text>
      <text x="96" y="250" fill="#facc15" fontSize="13" fontWeight="900">after: v1 {v1.toFixed(1)}, v2 {v2.toFixed(1)} m/s</text>
      <rect x="442" y="54" width="238" height="54" rx="10" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <text x="456" y="78" fill="#e2e8f0" fontSize="12" fontWeight="900">momentum conserved</text>
      <text x="456" y="96" fill="#94a3b8" fontSize="11">ideal low-friction track</text>
    </g>
  );
}

function HookesLawScene({ a, b, c }: { a: number; b: number; c: number }) {
  const k = clamp(a, 5, 200);
  const force = clamp(b || c || 10, 0, 80);
  const extension = force / k;
  const px = clamp(extension * 900, 18, 132);
  const limit = extension > 0.45;
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">spring extension rig</text>
      <line x1="155" y1="62" x2="340" y2="62" stroke="#64748b" strokeWidth="8" />
      <line x1="247" y1="62" x2="247" y2="88" stroke="#64748b" strokeWidth="5" />
      <path d={`M 247 88 ${Array.from({ length: 18 }, (_, i) => `L ${247 + (i % 2 ? -22 : 22)} ${98 + i * (px / 18)}`).join(" ")} L 247 ${108 + px}`} fill="none" stroke="#67e8f9" strokeWidth="4" />
      <rect x="207" y={108 + px} width="80" height="44" rx="8" fill={limit ? "#f43f5e" : "#facc15"} stroke="#fde68a" strokeWidth="3" />
      <line x1="305" y1={124 + px} x2="305" y2={124 + px + 56} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1="247" y1={108 + px} x2="247" y2="88" stroke="#22d3ee" strokeWidth="3" strokeDasharray="6 5" />
      <line x1="360" y1="88" x2="360" y2={108 + px} stroke="#94a3b8" strokeWidth="3" />
      <text x="372" y={104 + px / 2} fill="#94a3b8" fontSize="13" fontWeight="900">x = {extension.toFixed(3)} m</text>
      <rect x="470" y="62" width="210" height="172" rx="12" fill="rgba(15,23,42,.7)" stroke="#334155" />
      <line x1="500" y1="204" x2="650" y2="204" stroke="#64748b" />
      <line x1="500" y1="204" x2="500" y2="90" stroke="#64748b" />
      <line x1="500" y1="204" x2="650" y2={204 - clamp(force * 1.3, 0, 110)} stroke="#22d3ee" strokeWidth="4" />
      <circle cx={500 + clamp(extension * 260, 0, 150)} cy={204 - clamp(force * 1.3, 0, 110)} r="6" fill="#facc15" />
      <text x="522" y="84" fill="#67e8f9" fontSize="13" fontWeight="900">F-x graph</text>
      <text x="82" y="276" fill={limit ? "#fb7185" : "#94a3b8"} fontSize="13">F = kx. {limit ? "Elastic limit warning: model should not be trusted beyond this region." : "Spring within elastic limit."}</text>
    </g>
  );
}

function CoupledOscillatorScene({ a, b, c }: { a: number; b: number; c: number }) {
  const angle1 = clamp(a, 5, 90);
  const angle2 = clamp(b, 5, 90);
  const coupling = clamp(c, 0, 1);
  const theta1 = (angle1 * Math.PI) / 180;
  const theta2 = ((angle2 + coupling * 42) * Math.PI) / 180;
  const pivot1 = { x: 210, y: 76 };
  const length1 = 82;
  const length2 = 76;
  const joint = { x: pivot1.x + Math.sin(theta1) * length1, y: pivot1.y + Math.cos(theta1) * length1 };
  const bob = { x: joint.x + Math.sin(theta2) * length2, y: joint.y + Math.cos(theta2) * length2 };
  const regularPath = Array.from({ length: 70 }, (_, index) => {
    const t = index / 69;
    const x = 455 + Math.sin(t * Math.PI * 2.4) * (42 + angle1 * 0.32);
    const y = 158 + Math.cos(t * Math.PI * 2.4) * (30 + angle2 * 0.18);
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const chaoticPath = Array.from({ length: 120 }, (_, index) => {
    const t = index / 14;
    const spread = 22 + coupling * 72 + Math.max(0, angle1 + angle2 - 80) * 0.45;
    const x = 455 + Math.sin(t * 1.7 + Math.sin(t * 0.43) * 2.2) * spread + Math.cos(t * 0.71) * 28;
    const y = 158 + Math.cos(t * 1.31 + Math.sin(t * 0.37)) * (spread * 0.62) + Math.sin(t * 0.91) * 18;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
  const divergence = clamp((Math.abs(angle1 - angle2) / 40 + coupling + Math.max(0, angle1 + angle2 - 95) / 85) / 2, 0, 1);
  return (
    <g>
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">coupled nonlinear oscillator</text>
      <text x="82" y="68" fill="#94a3b8" fontSize="13">Two linked angles exchange energy; stronger coupling makes nearby starts separate faster.</text>
      <line x1="72" y1="76" x2="330" y2="76" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
      <circle cx={pivot1.x} cy={pivot1.y} r="7" fill="#67e8f9" />
      <line x1={pivot1.x} y1={pivot1.y} x2={joint.x} y2={joint.y} stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
      <line x1={joint.x} y1={joint.y} x2={bob.x} y2={bob.y} stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      <circle cx={joint.x} cy={joint.y} r="16" fill="#22d3ee" stroke="#67e8f9" strokeWidth="3" className="lab-anim-glow" />
      <circle cx={bob.x} cy={bob.y} r="18" fill="#f43f5e" stroke="#fb7185" strokeWidth="3" className="lab-anim-pulse" />
      <path d={`M ${pivot1.x - 54} ${pivot1.y + 32} A 54 54 0 0 1 ${pivot1.x + 54} ${pivot1.y + 32}`} fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="6 5" />
      <path d={`M ${joint.x - 42} ${joint.y + 28} A 42 42 0 0 1 ${joint.x + 42} ${joint.y + 28}`} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="6 5" />
      <text x="105" y="274" fill="#67e8f9" fontSize="13" fontWeight="900">theta1 {angle1.toFixed(0)} deg</text>
      <text x="220" y="274" fill="#fb7185" fontSize="13" fontWeight="900">theta2 {angle2.toFixed(0)} deg</text>
      <rect x="374" y="52" width="310" height="210" rx="12" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <line x1="400" y1="158" x2="660" y2="158" stroke="#475569" />
      <line x1="455" y1="72" x2="455" y2="244" stroke="#475569" />
      <text x="390" y="82" fill="#e2e8f0" fontSize="14" fontWeight="900">phase portrait</text>
      <path d={regularPath} fill="none" stroke="#22d3ee" strokeWidth="3" opacity={1 - divergence * 0.45} />
      <path d={chaoticPath} fill="none" stroke="#f43f5e" strokeWidth="3" opacity={0.35 + divergence * 0.65} />
      <circle r="6" fill="#facc15">
        <animateMotion dur="3.2s" repeatCount="indefinite" path={chaoticPath} />
      </circle>
      <text x="502" y="238" fill="#94a3b8" fontSize="12">theta vs angular velocity</text>
      <rect x="390" y="278" width="260" height="10" rx="5" fill="#334155" />
      <rect x="390" y="278" width={clamp(40 + divergence * 220, 40, 260)} height="10" rx="5" fill={divergence > 0.62 ? "#f43f5e" : "#22d3ee"} />
      <text x="390" y="270" fill="#e2e8f0" fontSize="13" fontWeight="900">sensitivity / phase spread</text>
      <text x="654" y="288" fill={divergence > 0.62 ? "#fb7185" : "#67e8f9"} fontSize="13" fontWeight="900">{divergence > 0.62 ? "chaotic-looking" : "mostly regular"}</text>
    </g>
  );
}

function FreeBodyScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const mass = Math.max(0.5, c || b || 1);
  const left = id === "balanced-unbalanced-forces" ? a : 0;
  const right = id === "balanced-unbalanced-forces" ? b : a;
  const net = right - left;
  const accel = net / mass;
  return (
    <g>
      <rect x="96" y="220" width="600" height="16" rx="5" fill="#475569" />
      <rect x="330" y="144" width="120" height="76" rx="8" fill="#38bdf8" stroke="#67e8f9" strokeWidth="4" />
      <text x="368" y="187" fill="#0f172a" fontSize="18" fontWeight="900">m</text>
      <line x1="390" y1="144" x2="390" y2="78" stroke="#34d399" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1="390" y1="220" x2="390" y2="270" stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line className="lab-anim-dash-fast" x1="330" y1="182" x2={330 - clamp(left, 20, 180)} y2="182" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line className="lab-anim-dash-fast" x1="450" y1="182" x2={450 + clamp(right, 20, 180)} y2="182" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1="390" y1="112" x2={390 + clamp(net * 1.5, -160, 160)} y2="112" stroke="#e879f9" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <text x="84" y="44" fill="#e2e8f0" fontSize="16" fontWeight="900">free-body diagram and net force</text>
      <text x="92" y="72" fill="#94a3b8" fontSize="13">Normal and weight cancel vertically; horizontal net force gives a = Fnet/m.</text>
      <text x="470" y="112" fill="#e879f9" fontSize="13" fontWeight="900">Fnet {net.toFixed(1)} N, a {accel.toFixed(2)}</text>
    </g>
  );
}

function FrictionScene({ a, b, c }: { a: number; b: number; c: number }) {
  const limit = Math.max(0, a * 9.81 * c);
  const moving = b > limit;
  return (
    <g>
      <rect x="90" y="224" width="620" height="18" rx="5" fill="#475569" />
      {Array.from({ length: 20 }, (_, i) => <line key={i} x1={100 + i * 31} y1="224" x2={115 + i * 31} y2="208" stroke="#64748b" strokeWidth="2" />)}
      <rect x={moving ? 380 : 330} y="150" width="120" height="74" rx="8" fill="#facc15" stroke="#fde68a" strokeWidth="4" className={moving ? "lab-anim-float" : ""} />
      <line x1={moving ? 500 : 450} y1="185" x2={moving ? 650 : 610} y2="185" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <line x1={moving ? 380 : 330} y1="185" x2={moving ? 260 : 210} y2="185" stroke="#f43f5e" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">static limit vs kinetic motion</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Friction adapts up to mu N, then motion begins.</text>
      <text x="475" y="118" fill={moving ? "#34d399" : "#f43f5e"} fontSize="14" fontWeight="900">{moving ? "moving: applied force crossed limit" : "static: friction still holds"}</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Limit = {limit.toFixed(1)} N, applied = {b.toFixed(1)} N.</text>
    </g>
  );
}

function InclineComponentsScene({ a, b, c }: { a: number; b: number; c: number }) {
  const theta = clamp(b, 0, 60);
  const rad = theta * Math.PI / 180;
  const parallel = a * 9.81 * Math.sin(rad);
  const normal = a * 9.81 * Math.cos(rad);
  return (
    <g>
      <path d="M 120 235 L 640 235 L 640 92 Z" fill="rgba(251,191,36,.2)" stroke="#facc15" strokeWidth="4" />
      <g transform={`translate(410 178) rotate(${-theta})`}>
        <rect x="-45" y="-28" width="90" height="56" rx="7" fill="#38bdf8" stroke="#67e8f9" strokeWidth="4" />
        <line x1="0" y1="0" x2="130" y2="0" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
        <line x1="0" y1="0" x2="0" y2="-105" stroke="#34d399" strokeWidth="5" markerEnd="url(#arrow-default)" />
      </g>
      <line x1="410" y1="178" x2="410" y2="270" stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x="84" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">gravity resolves on an incline</text>
      <text x="84" y="70" fill="#94a3b8" fontSize="13">mg sin theta pulls down the plane; mg cos theta sets the normal reaction.</text>
      <text x="506" y="150" fill="#22d3ee" fontSize="13" fontWeight="900">mg sin theta {parallel.toFixed(1)} N</text>
      <text x="360" y="86" fill="#34d399" fontSize="13" fontWeight="900">N ~ mg cos theta {normal.toFixed(1)} N</text>
    </g>
  );
}

function EnergyBarsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const pe = Math.max(0, a * 9.81 * b);
  const useful = pe * (1 - clamp(c, 0, 0.9));
  const loss = pe - useful;
  return (
    <g>
      <path d="M 100 236 C 240 90 390 90 650 218" fill="none" stroke="#64748b" strokeWidth="14" strokeLinecap="round" />
      <circle className="lab-anim-glow" cx="210" cy="148" r="22" fill="#facc15" />
      <rect x="95" y="70" width="72" height={clamp(pe / 60, 18, 150)} rx="7" fill="#facc15" />
      <rect x="185" y={220 - clamp(useful / 60, 18, 150)} width="72" height={clamp(useful / 60, 18, 150)} rx="7" fill="#22d3ee" />
      <rect x="275" y={220 - clamp(loss / 60, 8, 150)} width="72" height={clamp(loss / 60, 8, 150)} rx="7" fill="#f43f5e" />
      <text x="96" y="52" fill="#e2e8f0" fontSize="16" fontWeight="900">{id === "work-power" ? "work transfers energy" : "energy bar exchange"}</text>
      <text x="96" y="246" fill="#facc15" fontSize="12" fontWeight="900">PE</text>
      <text x="188" y="246" fill="#22d3ee" fontSize="12" fontWeight="900">KE/useful</text>
      <text x="278" y="246" fill="#f43f5e" fontSize="12" fontWeight="900">losses</text>
      <text x="390" y="275" fill="#94a3b8" fontSize="13">Mechanical energy shrinks only when losses convert it to heat/sound.</text>
    </g>
  );
}

function CircularForceScene({ a, b, c }: { a: number; b: number; c: number }) {
  const cx = 380;
  const cy = 155;
  const r = clamp(b * 18, 50, 115);
  const angle = clamp(c, 0, 6.28);
  const x = cx + Math.cos(angle) * r;
  const y = cy + Math.sin(angle) * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#475569" strokeWidth="4" />
      <circle cx={x} cy={y} r="18" fill="#facc15" className="lab-anim-glow" />
      <line x1={x} y1={y} x2={cx} y2={cy} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <line x1={x} y1={y} x2={x - Math.sin(angle) * 100} y2={y + Math.cos(angle) * 100} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">velocity tangent, acceleration inward</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Centripetal force points to the centre; speed direction is tangent.</text>
      <text x={cx - 38} y={cy + 5} fill="#f43f5e" fontSize="13" fontWeight="900">Fc</text>
    </g>
  );
}

function OscillationScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const isSpring = id === "shm-spring";
  const amp = isSpring ? clamp(c * 45, 18, 95) : clamp(42 * (1 - c * 1.2), 14, 42);
  const length = isSpring ? 128 : clamp(82 + a * 30, 85, 220);
  const pivotX = 380;
  const pivotY = 54;
  const bobX = pivotX + Math.sin((amp * Math.PI) / 180) * length;
  const bobY = pivotY + Math.cos((amp * Math.PI) / 180) * length;
  const shadowY = clamp(pivotY + length + 34, 190, 276);
  return (
    <g>
      <line x1="100" y1={isSpring ? 150 : shadowY} x2="680" y2={isSpring ? 150 : shadowY} stroke="#475569" strokeWidth="3" />
      <line x1={pivotX} y1={pivotY} x2={pivotX} y2={isSpring ? 236 : pivotY + length + 8} stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      {isSpring ? (
        <path d={`M 120 150 ${Array.from({ length: 24 }, (_, i) => `L ${130 + i * 10} ${150 + (i % 2 ? -22 : 22)}`).join(" ")} L ${370 + amp} 150`} fill="none" stroke="#67e8f9" strokeWidth="4" />
      ) : (
        <g>
          <circle cx={pivotX} cy={pivotY} r="7" fill="#67e8f9" />
          <path d={`M ${pivotX - Math.sin((amp * Math.PI) / 180) * length} ${pivotY + Math.cos((amp * Math.PI) / 180) * length} Q ${pivotX} ${pivotY + length + 26} ${bobX} ${bobY}`} fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="7 6" />
          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#0f172a" strokeWidth="5" />
          <line x1={pivotX} y1={pivotY} x2={bobX} y2={bobY} stroke="#e2e8f0" strokeWidth="3" />
          <circle cx={bobX} cy={bobY} r={clamp(14 + b * 12, 14, 34)} fill="#facc15" stroke="#f59e0b" strokeWidth="3" className="lab-anim-glow" />
          <path d={`M ${pivotX - 42} ${pivotY + length + 18} Q ${pivotX} ${pivotY + length + 34} ${pivotX + 42} ${pivotY + length + 18}`} fill="none" stroke="#22d3ee" strokeWidth="4" />
          <text x={pivotX + 22} y={pivotY + length / 2} fill="#67e8f9" fontSize="13" fontWeight="900">L = {a.toFixed(2)} m</text>
          <text x={bobX + 18} y={bobY + 8} fill="#facc15" fontSize="13" fontWeight="900">mass</text>
        </g>
      )}
      {isSpring && <path d={`M ${380 - amp} 230 Q 380 260 ${380 + amp} 230`} fill="none" stroke="#22d3ee" strokeWidth="4" />}
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">{isSpring ? "spring-mass SHM" : "simple pendulum small-angle SHM"}</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">{isSpring ? "Amplitude is maximum displacement; period is one complete cycle." : "Drag Length: longer string means a longer period; mass should not change the ideal period."}</text>
      <text x="408" y={isSpring ? 143 : pivotY + length + 6} fill="#34d399" fontSize="13" fontWeight="900">mean position</text>
    </g>
  );
}

function OpticsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "prism-dispersion") return <PrismScene a={a} b={b} c={c} />;
  if (id === "glass-slab-refraction") return <GlassSlabScene a={a} b={b} c={c} />;
  if (id === "total-internal-reflection") return <TirScene a={a} b={b} c={c} />;
  if (id === "lens-formula" || id === "mirror-formula" || id === "reflection-plane-mirror") return <RayOpticsBench id={id} a={a} b={b} c={c} />;
  if (id === "human-eye-defects") return <EyeDefectScene a={a} b={b} c={c} />;
  if (id === "optical-instruments") return <OpticalInstrumentScene a={a} b={b} c={c} />;
  if (id === "shadows-eclipses") return <ShadowsEclipsesScene a={a} b={b} c={c} />;
  if (id === "multiple-reflection") return <MultipleReflectionScene a={a} b={b} c={c} />;
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

function ShadowsEclipsesScene({ a, b, c }: { a: number; b: number; c: number }) {
  const mode = Math.abs(Math.round(c || 0)) % 3;
  const sourceR = clamp(a * 2.5, 26, 58);
  const occluderR = clamp(18 + b * 3, 22, 52);
  const sourceX = 112;
  const sourceY = 150;
  const occluderX = mode === 1 ? 360 : 320;
  const occluderY = 150;
  const screenX = 650;
  const screenR = mode === 2 ? 42 : 70;
  const label = mode === 1 ? "solar eclipse: Moon shadow on Earth" : mode === 2 ? "lunar eclipse: Earth shadow on Moon" : "extended source shadow";
  const bodyNames = mode === 1
    ? { source: "Sun/source", occluder: "Moon occluder", screen: "Earth screen" }
    : mode === 2
      ? { source: "Sun/source", occluder: "Earth occluder", screen: "Moon screen" }
      : { source: "light source", occluder: "opaque object", screen: "screen" };
  const upperOuter = occluderY - occluderR - sourceR * 0.7;
  const lowerOuter = occluderY + occluderR + sourceR * 0.7;
  const upperUmbra = occluderY - occluderR * 0.55;
  const lowerUmbra = occluderY + occluderR * 0.55;
  return (
    <g>
      <rect x="46" y="44" width="680" height="220" rx="18" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <circle cx={sourceX} cy={sourceY} r={sourceR} fill="#facc15" opacity="0.9" className="lab-anim-glow" />
      <circle cx={occluderX} cy={occluderY} r={occluderR} fill={mode === 2 ? "#38bdf8" : "#94a3b8"} stroke="#e2e8f0" strokeWidth="3" />
      <circle cx={screenX} cy={sourceY} r={screenR} fill={mode === 1 ? "#38bdf8" : mode === 2 ? "#94a3b8" : "#e2e8f0"} opacity="0.78" />
      <path d={`M ${sourceX} ${sourceY - sourceR} L ${screenX} ${upperOuter} L ${screenX} ${lowerOuter} L ${sourceX} ${sourceY + sourceR} Z`} fill="rgba(250,204,21,.12)" stroke="#fde047" strokeWidth="2" strokeDasharray="8 7" />
      <path d={`M ${occluderX} ${occluderY - occluderR} L ${screenX} ${upperUmbra} L ${screenX} ${lowerUmbra} L ${occluderX} ${occluderY + occluderR} Z`} fill="rgba(2,6,23,.74)" stroke="#64748b" strokeWidth="2" />
      <line className="lab-anim-dash" x1={sourceX + sourceR} y1={sourceY - sourceR * 0.72} x2={screenX} y2={upperOuter} stroke="#fde047" strokeWidth="2.5" />
      <line className="lab-anim-dash" x1={sourceX + sourceR} y1={sourceY + sourceR * 0.72} x2={screenX} y2={lowerOuter} stroke="#fde047" strokeWidth="2.5" />
      <line x1={occluderX} y1={sourceY} x2={screenX} y2={sourceY} stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      <text x="70" y="38" fill="#e2e8f0" fontSize="16" fontWeight="900">{label}</text>
      <text x={sourceX - 48} y={sourceY + sourceR + 28} fill="#fde68a" fontSize="12" fontWeight="900">{bodyNames.source}</text>
      <text x={occluderX - 48} y={occluderY + occluderR + 26} fill="#e2e8f0" fontSize="12" fontWeight="900">{bodyNames.occluder}</text>
      <text x={screenX - 42} y={sourceY + screenR + 25} fill="#67e8f9" fontSize="12" fontWeight="900">{bodyNames.screen}</text>
      <text x={(occluderX + screenX) / 2 - 28} y={sourceY - 8} fill="#cbd5e1" fontSize="13" fontWeight="900">umbra</text>
      <text x={(occluderX + screenX) / 2 - 36} y={sourceY - 78} fill="#fde047" fontSize="13" fontWeight="900">penumbra</text>
      <g transform="translate(70 232)">
        <rect width="166" height="24" rx="12" fill="rgba(250,204,21,.14)" stroke="#facc15" />
        <text x="14" y="16" fill="#fde68a" fontSize="11" fontWeight="900">simplified eclipse geometry</text>
      </g>
      <g transform="translate(248 232)">
        <rect width="88" height="24" rx="12" fill="rgba(103,232,249,.12)" stroke="#67e8f9" />
        <text x="14" y="16" fill="#a5f3fc" fontSize="11" fontWeight="900">not to scale</text>
      </g>
      <text x="372" y="250" fill="#94a3b8" fontSize="12">Umbra is full shadow; penumbra is partial shadow from an extended source.</text>
    </g>
  );
}

function MultipleReflectionScene({ a, b, c }: { a: number; b: number; c: number }) {
  const angle = clamp(a || b || 60, 20, 120);
  const rawCount = 360 / angle;
  const exact = Math.abs(rawCount - Math.round(rawCount)) < 0.02;
  const imageCount = exact ? Math.max(0, Math.round(rawCount) - 1) : Math.floor(rawCount);
  const center = { x: 320, y: 158 };
  const mirrorLength = 220;
  const half = (angle * Math.PI) / 360;
  const upper = { x: center.x + Math.cos(half) * mirrorLength, y: center.y - Math.sin(half) * mirrorLength };
  const lower = { x: center.x + Math.cos(half) * mirrorLength, y: center.y + Math.sin(half) * mirrorLength };
  const images = Array.from({ length: Math.min(imageCount, 9) }, (_, index) => {
    const theta = (-angle / 2 + ((index + 1) * angle) / Math.max(2, Math.min(imageCount, 9))) * Math.PI / 180;
    const radius = 74 + index * 10;
    return { x: center.x + Math.cos(theta) * radius, y: center.y + Math.sin(theta) * radius, alpha: 0.25 + (index % 3) * 0.15 };
  });
  return (
    <g>
      <rect x="46" y="42" width="680" height="224" rx="18" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <line x1={center.x} y1={center.y} x2={upper.x} y2={upper.y} stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
      <line x1={center.x} y1={center.y} x2={lower.x} y2={lower.y} stroke="#93c5fd" strokeWidth="7" strokeLinecap="round" />
      <path d={`M ${center.x + 58} ${center.y - 26} A 64 64 0 0 1 ${center.x + 58} ${center.y + 26}`} fill="none" stroke="#facc15" strokeWidth="4" />
      <circle cx={center.x + 42} cy={center.y} r="14" fill="#f43f5e" />
      <text x={center.x + 22} y={center.y + 38} fill="#fecdd3" fontSize="12" fontWeight="900">object</text>
      {images.map((image, index) => (
        <g key={`reflection-image-${index}`}>
          <circle cx={image.x} cy={image.y} r="11" fill="#34d399" opacity={image.alpha} />
          <text x={image.x - 10} y={image.y - 16} fill="#86efac" fontSize="10" fontWeight="900">image</text>
        </g>
      ))}
      <path className="lab-anim-dash" d={`M ${center.x + 42} ${center.y} L ${center.x + 116} ${center.y - 38} L ${center.x + 168} ${center.y + 44}`} fill="none" stroke="#fde047" strokeWidth="3.5" markerEnd="url(#arrow-optics)" />
      <text x="78" y="38" fill="#e2e8f0" fontSize="16" fontWeight="900">Two plane mirrors: repeated virtual images</text>
      <text x={center.x + 76} y={center.y + 6} fill="#facc15" fontSize="13" fontWeight="900">theta = {angle.toFixed(0)} deg</text>
      <text x="82" y="245" fill="#94a3b8" fontSize="12">Image count cue: {exact ? "n = 360/theta - 1" : "non-integer 360/theta, use floor rule carefully"}; ideal mirrors assumed.</text>
      <g transform="translate(540 72)">
        <rect width="150" height="132" rx="12" fill="rgba(2,6,23,.82)" stroke="#334155" />
        <text x="18" y="24" fill="#67e8f9" fontSize="12" fontWeight="900">kaleidoscope preview</text>
        {Array.from({ length: 8 }, (_, index) => (
          <path
            key={`kaleidoscope-${index}`}
            d={`M 75 70 L ${75 + Math.cos(index * Math.PI / 4) * 44} ${70 + Math.sin(index * Math.PI / 4) * 44} L ${75 + Math.cos((index + 0.45) * Math.PI / 4) * 28} ${70 + Math.sin((index + 0.45) * Math.PI / 4) * 28} Z`}
            fill={["#22d3ee", "#f43f5e", "#facc15", "#34d399"][index % 4]}
            opacity="0.72"
          />
        ))}
        <text x="18" y="116" fill="#e2e8f0" fontSize="12" fontWeight="900">images: {imageCount}</text>
      </g>
      <g transform="translate(82 64)">
        <rect width="100" height="24" rx="12" fill="rgba(103,232,249,.12)" stroke="#67e8f9" />
        <text x="14" y="16" fill="#a5f3fc" fontSize="11" fontWeight="900">ideal mirrors</text>
      </g>
    </g>
  );
}

function GlassSlabScene({ a, b, c }: { a: number; b: number; c: number }) {
  const i = (clamp(a, 0, 75) * Math.PI) / 180;
  const r = Math.asin(clamp(Math.sin(i) / Math.max(1.01, b), -1, 1));
  const thickness = clamp(c * 5, 36, 98);
  const shift = thickness * Math.sin(i - r) / Math.max(0.2, Math.cos(r));
  const p1 = { x: 300, y: 120 };
  const p2 = { x: 440, y: 120 + Math.tan(r) * 140 };
  const p3 = { x: 690, y: p2.y + Math.tan(i) * 210 };
  return (
    <g>
      <rect x="300" y={150 - thickness} width="140" height={thickness * 2} rx="5" fill="rgba(103,232,249,.2)" stroke="#67e8f9" strokeWidth="3" />
      <line x1="300" y1="42" x2="300" y2="258" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="440" y1="42" x2="440" y2="258" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
      <line className="lab-anim-dash" x1="85" y1={p1.y - Math.tan(i) * 215} x2={p1.x} y2={p1.y} stroke="#fde047" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#22d3ee" strokeWidth="5" />
      <line className="lab-anim-dash-fast" x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#fde047" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <line x1="85" y1={p1.y - Math.tan(i) * 215 + shift} x2={p3.x} y2={p3.y} stroke="#f43f5e" strokeWidth="2" strokeDasharray="7 6" />
      <path d={`M 520 ${p3.y - 36} L 520 ${p3.y} L 548 ${p3.y}`} fill="none" stroke="#f43f5e" strokeWidth="3" />
      <text x="554" y={p3.y - 8} fill="#f43f5e" fontSize="13" fontWeight="900">lateral shift</text>
      <text x="315" y="54" fill="#67e8f9" fontSize="14" fontWeight="900">glass slab n={b.toFixed(2)}</text>
      <text x="112" y="48" fill="#e2e8f0" fontSize="16" fontWeight="900">parallel emergent ray</text>
      <text x="306" y="104" fill="#facc15" fontSize="13" fontWeight="900">i</text>
      <text x="360" y="146" fill="#22d3ee" fontSize="13" fontWeight="900">r</text>
      <text x="82" y="268" fill="#94a3b8" fontSize="13">The ray bends twice; final direction is parallel but displaced sideways.</text>
    </g>
  );
}

function TirScene({ a, b, c }: { a: number; b: number; c: number }) {
  const n1 = Math.max(a, b + 0.01);
  const n2 = Math.max(1, b);
  const incidence = clamp(c, 0, 89);
  const critical = Math.asin(clamp(n2 / n1, -1, 1)) * 180 / Math.PI;
  const tir = incidence > critical;
  const hit = { x: 385, y: 150 };
  const rayInY = hit.y + Math.tan((incidence * Math.PI) / 180) * 180;
  const outY = tir ? hit.y + Math.tan((incidence * Math.PI) / 180) * 170 : hit.y - Math.tan(((90 - critical) * Math.PI) / 360) * 170;
  return (
    <g>
      <rect x="80" y="150" width="600" height="96" fill="rgba(34,211,238,.18)" stroke="#22d3ee" strokeWidth="3" />
      <rect x="80" y="54" width="600" height="96" fill="rgba(15,23,42,.45)" stroke="#334155" strokeWidth="2" />
      <line x1={hit.x} y1="42" x2={hit.x} y2="258" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
      <line className="lab-anim-dash" x1="160" y1={rayInY} x2={hit.x} y2={hit.y} stroke="#fde047" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      {tir ? (
        <line className="lab-anim-dash-fast" x1={hit.x} y1={hit.y} x2="620" y2={outY} stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      ) : (
        <line className="lab-anim-dash-fast" x1={hit.x} y1={hit.y} x2="620" y2={outY} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      )}
      <path d="M 385 150 L 450 150 A 65 65 0 0 0 426 101" fill="none" stroke="#f43f5e" strokeWidth="3" />
      <text x="438" y="107" fill="#f43f5e" fontSize="13" fontWeight="900">C={critical.toFixed(1)} deg</text>
      <text x="100" y="230" fill="#67e8f9" fontSize="13" fontWeight="900">denser medium n1={n1.toFixed(2)}</text>
      <text x="100" y="78" fill="#94a3b8" fontSize="13" fontWeight="900">rarer medium n2={n2.toFixed(2)}</text>
      <text x="500" y="52" fill={tir ? "#facc15" : "#22d3ee"} fontSize="16" fontWeight="900">{tir ? "total internal reflection" : "refracted ray escapes"}</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">TIR needs denser-to-rarer travel and incidence greater than the critical angle.</text>
    </g>
  );
}

function RayOpticsBench({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const isLens = id === "lens-formula";
  const isPlane = id === "reflection-plane-mirror";
  const f = clamp(a, 5, 55);
  const u = clamp(b, 8, 130);
  const lensX = 390;
  const objectX = lensX - u * 2.2;
  const imageX = isPlane ? lensX + u * 1.2 : lensX + clamp((u * f) / Math.max(1, u - f), -120, 210) * 1.5;
  const objectH = clamp(c * 5, 28, 90);
  return (
    <g>
      <line x1="70" y1="150" x2="700" y2="150" stroke="#475569" strokeWidth="3" />
      <line x1={lensX - f * 2.2} y1="138" x2={lensX - f * 2.2} y2="162" stroke="#facc15" strokeWidth="3" />
      <line x1={lensX + f * 2.2} y1="138" x2={lensX + f * 2.2} y2="162" stroke="#facc15" strokeWidth="3" />
      <text x={lensX - f * 2.2 - 6} y="132" fill="#facc15" fontSize="12" fontWeight="900">F</text>
      <text x={lensX + f * 2.2 - 6} y="132" fill="#facc15" fontSize="12" fontWeight="900">F</text>
      {isLens ? <ellipse cx={lensX} cy="150" rx="20" ry="100" fill="rgba(103,232,249,.24)" stroke="#67e8f9" strokeWidth="4" /> : isPlane ? <line x1={lensX} y1="62" x2={lensX} y2="238" stroke="#93c5fd" strokeWidth="7" /> : <path d="M 430 62 Q 350 150 430 238" fill="none" stroke="#93c5fd" strokeWidth="7" />}
      <line x1={objectX} y1="150" x2={objectX} y2={150 - objectH} stroke="#f43f5e" strokeWidth="6" />
      <polygon points={`${objectX},${150 - objectH - 10} ${objectX - 7},${150 - objectH + 4} ${objectX + 7},${150 - objectH + 4}`} fill="#f43f5e" />
      <line className="lab-anim-dash" x1={objectX} y1={150 - objectH} x2={lensX} y2={150 - objectH} stroke="#fde047" strokeWidth="3" />
      <line className="lab-anim-dash-fast" x1={lensX} y1={150 - objectH} x2={imageX} y2="150" stroke="#fde047" strokeWidth="3" markerEnd="url(#arrow-optics)" />
      <line x1={objectX} y1={150 - objectH} x2={lensX} y2="150" stroke="#22d3ee" strokeWidth="3" />
      <line className="lab-anim-dash-fast" x1={lensX} y1="150" x2={imageX} y2={isPlane ? 150 - objectH : 150 + objectH * 0.7} stroke="#22d3ee" strokeWidth="3" markerEnd="url(#arrow-optics)" />
      <line x1={imageX} y1="150" x2={imageX} y2={isPlane ? 150 - objectH : 150 + objectH * 0.7} stroke="#34d399" strokeWidth="5" />
      <text x="82" y="46" fill="#e2e8f0" fontSize="16" fontWeight="900">{isLens ? "convex lens principal rays" : isPlane ? "plane mirror equal distances" : "concave mirror ray construction"}</text>
      <text x="82" y="268" fill="#94a3b8" fontSize="13">Use focal marks and principal rays before applying signs in the formula.</text>
    </g>
  );
}

function EyeDefectScene({ a, b, c }: { a: number; b: number; c: number }) {
  const mode = Math.round(c);
  const retinaX = 606;
  const uncorrectedFocusX = mode === 0 ? retinaX + clamp((a - b) * 44, -46, 46) : retinaX + clamp((a - b) * 76, -88, 88);
  const correctedFocusX = mode === 0 ? uncorrectedFocusX : retinaX;
  const focusStatus = uncorrectedFocusX < retinaX - 18 ? "focus before retina" : uncorrectedFocusX > retinaX + 18 ? "focus behind retina" : "clear on retina";
  const defectName = mode === 1 ? "myopia" : mode === 2 ? "hypermetropia" : "normal vision";
  const correctionName = mode === 1 ? "concave correction" : mode === 2 ? "convex correction" : "no correction lens";
  const correctionPower = mode === 0 ? 0 : (1 / Math.max(0.01, b / 100)) - (1 / Math.max(0.01, a / 100));
  const lensColor = mode === 1 ? "#a78bfa" : mode === 2 ? "#34d399" : "#67e8f9";
  return (
    <g>
      <clipPath id="eye-realistic-clip">
        <rect x="42" y="36" width="676" height="228" rx="18" />
      </clipPath>
      <image
        href="/assets/experiments/human-eye-defects/realistic-eye-cutaway.png"
        x="42"
        y="36"
        width="676"
        height="228"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#eye-realistic-clip)"
        opacity="0.78"
      />
      <rect x="42" y="36" width="676" height="228" rx="18" fill="rgba(2,6,23,.28)" stroke="#67e8f9" strokeWidth="2" />
      <rect x="60" y="50" width="190" height="74" rx="12" fill="rgba(2,6,23,.82)" stroke="#22d3ee" strokeWidth="1.5" />
      <text x="76" y="76" fill="#e2e8f0" fontSize="17" fontWeight="900">{defectName}</text>
      <text x="76" y="99" fill="#94a3b8" fontSize="12" fontWeight="700">{correctionName}</text>
      <text x="76" y="116" fill={mode === 0 ? "#34d399" : "#facc15"} fontSize="11" fontWeight="900">P approx {correctionPower.toFixed(2)} D</text>

      {mode > 0 && (
        <g>
          <ellipse cx="192" cy="150" rx={mode === 1 ? 14 : 28} ry="77" fill="rgba(15,23,42,.52)" stroke={lensColor} strokeWidth="4" />
          <text x="134" y="249" fill={lensColor} fontSize="12" fontWeight="900">{mode === 1 ? "diverging lens" : "converging lens"}</text>
        </g>
      )}

      <path d="M 606 59 Q 658 150 606 241" fill="none" stroke="#f43f5e" strokeWidth="6" opacity="0.88" />
      <text x="584" y="54" fill="#fecdd3" fontSize="13" fontWeight="900">retina</text>
      <ellipse cx="333" cy="150" rx="22" ry="68" fill="rgba(250,204,21,.16)" stroke="#facc15" strokeWidth="3.5" />
      <text x="306" y="230" fill="#fde68a" fontSize="12" fontWeight="900">eye lens</text>

      {[108, 150, 192].map((y, index) => {
        const midY = mode === 1 ? 150 + (y - 150) * 0.54 : mode === 2 ? 150 + (y - 150) * 0.18 : 150 + (y - 150) * 0.35;
        return (
          <g key={y}>
            <path className="lab-anim-dash" d={`M 76 ${y} C 124 ${y} 148 ${midY} 192 ${midY}`} fill="none" stroke="#fde047" strokeWidth="3.5" />
            <path d={`M 192 ${midY} C 248 ${midY} 292 150 333 150`} fill="none" stroke={mode > 0 ? lensColor : "#fde047"} strokeWidth="3.5" opacity="0.9" />
            <path d={`M 333 150 C 415 ${128 + index * 22} ${uncorrectedFocusX - 48} 150 ${uncorrectedFocusX} 150`} fill="none" stroke="#fb7185" strokeWidth="2.4" strokeDasharray="8 7" opacity="0.8" />
            <path className="lab-anim-dash-fast" d={`M 333 150 C 421 ${122 + index * 28} ${correctedFocusX - 48} 150 ${correctedFocusX} 150`} fill="none" stroke="#22d3ee" strokeWidth="3.8" markerEnd="url(#arrow-optics)" />
          </g>
        );
      })}

      <circle cx={uncorrectedFocusX} cy="150" r="8" fill={Math.abs(uncorrectedFocusX - retinaX) < 18 ? "#34d399" : "#fb7185"} opacity="0.9" />
      <circle cx={correctedFocusX} cy="150" r="11" fill={Math.abs(correctedFocusX - retinaX) < 18 ? "#34d399" : "#f43f5e"} className="lab-anim-glow" />
      <text x={Math.min(626, uncorrectedFocusX - 54)} y="133" fill="#fecdd3" fontSize="12" fontWeight="900">uncorrected</text>
      <text x="508" y="181" fill="#67e8f9" fontSize="12" fontWeight="900">corrected image</text>
      <rect x="430" y="204" width="266" height="42" rx="10" fill="rgba(2,6,23,.78)" stroke="#334155" />
      <text x="445" y="225" fill="#e2e8f0" fontSize="12" fontWeight="900">{focusStatus}</text>
      <text x="445" y="241" fill="#94a3b8" fontSize="11">Retina {b.toFixed(1)} cm, eye focus {a.toFixed(1)} cm</text>
    </g>
  );
}

function OpticalInstrumentScene({ a, b, c }: { a: number; b: number; c: number }) {
  const mode = c < 0.5 ? "telescope" : "microscope";
  const objX = 250;
  const eyeX = 540;
  const mag = Math.max(0.1, a / Math.max(1, b));
  return (
    <g>
      <line x1="80" y1="150" x2="700" y2="150" stroke="#475569" strokeWidth="3" />
      <ellipse cx={objX} cy="150" rx={mode === "telescope" ? 34 : 20} ry="105" fill="rgba(103,232,249,.2)" stroke="#67e8f9" strokeWidth="4" />
      <ellipse cx={eyeX} cy="150" rx="22" ry="82" fill="rgba(167,139,250,.2)" stroke="#a78bfa" strokeWidth="4" />
      <line className="lab-anim-dash" x1="90" y1="92" x2={objX} y2="130" stroke="#fde047" strokeWidth="3" />
      <line x1={objX} y1="130" x2={eyeX} y2="98" stroke="#22d3ee" strokeWidth="3" />
      <line className="lab-anim-dash-fast" x1={eyeX} y1="98" x2="690" y2="72" stroke="#fde047" strokeWidth="3" markerEnd="url(#arrow-optics)" />
      <line className="lab-anim-dash" x1="90" y1="208" x2={objX} y2="170" stroke="#fde047" strokeWidth="3" />
      <line x1={objX} y1="170" x2={eyeX} y2="202" stroke="#22d3ee" strokeWidth="3" />
      <line className="lab-anim-dash-fast" x1={eyeX} y1="202" x2="690" y2="228" stroke="#fde047" strokeWidth="3" markerEnd="url(#arrow-optics)" />
      <rect x="270" y="250" width={clamp((a + b) * 1.2, 90, 330)} height="9" rx="4" fill="#34d399" />
      <text x="221" y="42" fill="#67e8f9" fontSize="13" fontWeight="900">objective</text>
      <text x="514" y="42" fill="#a78bfa" fontSize="13" fontWeight="900">eyepiece</text>
      <text x="84" y="46" fill="#e2e8f0" fontSize="16" fontWeight="900">{mode}: M = {mag.toFixed(1)}x</text>
      <text x="84" y="278" fill="#94a3b8" fontSize="13">Short eyepiece focal length increases angular magnification.</text>
    </g>
  );
}

function PrismScene({ a, b, c }: { a: number; b: number; c: number }) {
  const prism = makePrismModel(a, b, c);
  const apex = { x: 380, y: 60 };
  const leftBase = { x: 270, y: 235 };
  const rightBase = { x: 500, y: 235 };
  const hit1 = { x: 340, y: 124 };
  const hit2 = { x: 456, y: 168 };
  const screenX = 690;
  const meanY = 164 + clamp(prism.meanDeviationDeg / 2, 14, 68);
  const monochrome = prism.dispersion < 0.006;
  const normal1 = "M 308 102 L 374 145";
  const normal2 = "M 428 138 L 484 198";
  return (
    <g>
      <rect x="667" y="58" width="12" height="192" rx="4" fill="#e2e8f0" opacity="0.8" />
      <text x="646" y="48" fill="#e2e8f0" fontSize="13" fontWeight="800">screen</text>
      <path d={`M ${apex.x} ${apex.y} L ${rightBase.x} ${rightBase.y} L ${leftBase.x} ${leftBase.y} Z`} fill="rgba(167,139,250,.28)" stroke="#c4b5fd" strokeWidth="3" />
      <path d="M 354 228 A 42 42 0 0 1 399 228" fill="none" stroke="#facc15" strokeWidth="3" />
      <text x="370" y="218" fill="#facc15" fontSize="14" fontWeight="900">A</text>
      <path d={normal1} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      <path d={normal2} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
      <text x="292" y="96" fill="#94a3b8" fontSize="12">normal</text>
      <text x="474" y="198" fill="#94a3b8" fontSize="12">normal</text>
      <line className="lab-anim-dash" x1="70" y1="84" x2={hit1.x} y2={hit1.y} stroke="#ffffff" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <circle r="5" fill="#ffffff" className="lab-anim-glow">
        <animateMotion dur="1.8s" repeatCount="indefinite" path={`M 70 84 L ${hit1.x} ${hit1.y}`} />
      </circle>
      <line x1={hit1.x} y1={hit1.y} x2={hit2.x} y2={hit2.y} stroke="#fde047" strokeWidth="4" />
      {prism.tirInside ? (
        <g>
          <line className="lab-anim-dash-fast" x1={hit2.x} y1={hit2.y} x2="365" y2="218" stroke="#facc15" strokeWidth="4" />
          <text x="505" y="118" fill="#f43f5e" fontSize="14" fontWeight="900">TIR: incidence inside exceeds critical angle</text>
        </g>
      ) : monochrome ? (
        <line className="lab-anim-dash-fast" x1={hit2.x} y1={hit2.y} x2={screenX} y2={meanY} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      ) : (
        prism.rays.map((ray) => (
          <line
            key={ray.name}
            className="lab-anim-dash-fast"
            x1={hit2.x}
            y1={hit2.y}
            x2={screenX}
            y2={meanY + ray.yOffset}
            stroke={ray.color}
            strokeWidth="3"
          />
        ))
      )}
      <line x1="70" y1="84" x2={screenX} y2="84" stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      <path d={`M 590 84 A 68 68 0 0 1 612 ${meanY}`} fill="none" stroke="#f43f5e" strokeWidth="3" />
      <text x="616" y={(84 + meanY) / 2} fill="#f43f5e" fontSize="14" fontWeight="900">delta</text>
      <text x="246" y="82" fill="#e2e8f0" fontSize="13" fontWeight="800">i = {prism.incidenceDeg.toFixed(0)} deg</text>
      <text x="364" y="142" fill="#e2e8f0" fontSize="13" fontWeight="800">r1</text>
      <text x="424" y="158" fill="#e2e8f0" fontSize="13" fontWeight="800">r2</text>
      <text x="505" y={meanY - 12} fill="#e2e8f0" fontSize="13" fontWeight="800">e</text>
      <text x="78" y="40" fill="#e2e8f0" fontSize="16" fontWeight="900">Prism ray diagram</text>
      <text x="78" y="266" fill="#94a3b8" fontSize="13">Two refractions create deviation; wavelength-dependent n creates dispersion.</text>
      <g transform="translate(548 58)">
        <rect width="92" height="88" rx="6" fill="rgba(15,23,42,.82)" stroke="#334155" />
        <text x="10" y="18" fill="#67e8f9" fontSize="11" fontWeight="900">material</text>
        <text x="10" y="36" fill="#e2e8f0" fontSize="12">{prism.material.name}</text>
        <text x="10" y="56" fill="#94a3b8" fontSize="11">n {prism.meanIndex.toFixed(3)}</text>
        <text x="10" y="73" fill="#94a3b8" fontSize="11">Dm {prism.minimumDeviationDeg.toFixed(1)} deg</text>
      </g>
      {!monochrome && prism.rays.map((ray, index) => (
        <g key={ray.name} transform={`translate(704 ${meanY + ray.yOffset - 5})`}>
          <rect width="34" height="8" rx="4" fill={ray.color} />
          {index === 0 || index === prism.rays.length - 1 ? <text x="-56" y="8" fill={ray.color} fontSize="10" fontWeight="900">{ray.name}</text> : null}
        </g>
      ))}
      {monochrome && <text x="575" y={meanY + 24} fill="#22d3ee" fontSize="12" fontWeight="900">monochromatic / weak spread</text>}
    </g>
  );
}

function CircuitScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "ohms-law") return <OhmsLawCircuitScene a={a} b={b} c={c} />;
  if (id === "series-parallel-resistance") return <SeriesParallelResistanceScene a={a} b={b} c={c} />;
  if (id === "electric-power") return <ElectricPowerScene a={a} b={b} c={c} />;
  if (id === "heating-effect-current") return <JouleHeatingScene a={a} b={b} c={c} />;
  if (id === "chemical-effects-current") return <ElectrolysisScene a={a} b={b} c={c} />;
  if (id === "meter-bridge") return <MeterBridgeScene a={a} b={b} c={c} />;
  if (id === "internal-resistance-cell") return <InternalResistanceCellScene a={a} b={b} c={c} />;
  if (id === "capacitor-lab") return <CapacitorScene a={a} b={b} c={c} />;
  if (id === "kirchhoff-circuit") return <KirchhoffScene a={a} b={b} c={c} />;
  if (id === "ac-generator") return <GeneratorScene a={a} b={b} c={c} />;
  if (id === "transformer-lab") return <TransformerScene a={a} b={b} c={c} />;
  if (id === "ac-lcr-resonance") return <LcrScene a={a} b={b} c={c} />;
  if (id === "semiconductor-diode") return <SemiconductorDiodeScene a={a} b={b} c={c} />;
  if (id === "logic-gates") return <LogicGatesScene a={a} b={b} c={c} />;
  if (id === "sources-of-energy") return <SourcesOfEnergyScene a={a} b={b} c={c} />;
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

function SemiconductorDiodeScene({ a, b, c }: { a: number; b: number; c: number }) {
  const forward = (a || 0.7) >= 0;
  const voltage = clamp(a || 0.7, -5, 5);
  const threshold = clamp(b || 0.7, 0.2, 1.2);
  const conducts = forward && voltage > threshold;
  const current = conducts ? clamp((voltage - threshold) * 38, 4, 110) : 2;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">PN junction diode and half-wave rectifier</text>
      <rect x="82" y="72" width="270" height="112" rx="14" fill="rgba(15,23,42,.78)" stroke="#334155" />
      <rect x="108" y="96" width="96" height="64" rx="8" fill="#f472b6" opacity="0.8" /><text x="134" y="133" fill="#fff" fontSize="18" fontWeight="900">P-side</text>
      <rect x="228" y="96" width="96" height="64" rx="8" fill="#38bdf8" opacity="0.8" /><text x="254" y="133" fill="#082f49" fontSize="18" fontWeight="900">N-side</text>
      <rect x="204" y="88" width="24" height="80" rx="8" fill="#facc15" opacity={conducts ? 0.35 : 0.78} />
      <text x="174" y="184" fill="#fde68a" fontSize="12" fontWeight="900">depletion region</text>
      <line x1="96" y1="220" x2="328" y2="220" stroke="#64748b" strokeWidth="6" />
      <path d="M 164 220 l38 -28 v56 Z" fill="#e2e8f0" /><line x1="214" y1="190" x2="214" y2="250" stroke="#e2e8f0" strokeWidth="6" />
      {conducts ? <line className="lab-anim-dash-fast" x1="110" y1="220" x2="316" y2="220" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-circuit)" /> : <text x="112" y="254" fill="#f43f5e" fontSize="12" fontWeight="900">reverse/blocking or below threshold</text>}
      <text x="82" y="278" fill="#94a3b8" fontSize="13">{forward ? "forward bias" : "reverse bias"}; idealized knee near {threshold.toFixed(2)} V. Current {current.toFixed(1)} mA</text>

      <rect x="410" y="62" width="280" height="94" rx="12" fill="rgba(15,23,42,.76)" stroke="#334155" />
      <line x1="430" y1="132" x2="670" y2="132" stroke="#64748b" /><line x1="450" y1="142" x2="450" y2="76" stroke="#64748b" />
      <path d={`M 450 132 C 510 132 532 128 552 ${132 - current * 0.42} S 625 ${132 - current * 0.5} 670 ${132 - current * 0.52}`} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="462" y="82" fill="#67e8f9" fontSize="12" fontWeight="900">I-V curve knee</text>
      <rect x="410" y="174" width="280" height="84" rx="12" fill="rgba(15,23,42,.76)" stroke="#334155" />
      <path d="M 426 222 C 450 178 474 266 498 222 S 546 178 570 222 S 618 178 642 222" fill="none" stroke="#64748b" strokeWidth="3" />
      <path d="M 426 222 C 450 178 474 222 498 222 S 546 178 570 222 S 618 178 642 222" fill="none" stroke="#34d399" strokeWidth="4" />
      <text x="428" y="194" fill="#86efac" fontSize="12" fontWeight="900">rectified output</text>
    </g>
  );
}

function LogicGatesScene({ a, b, c }: { a: number; b: number; c: number }) {
  const gateIndex = Math.abs(Math.round(c || 0)) % 6;
  const gates = ["AND", "OR", "NOT", "NAND", "NOR", "XOR"];
  const gate = gates[gateIndex];
  const inputA = (a || 0) >= 0.5;
  const inputB = gate === "NOT" ? false : (b || 0) >= 0.5;
  const output = gate === "AND" ? inputA && inputB : gate === "OR" ? inputA || inputB : gate === "NOT" ? !inputA : gate === "NAND" ? !(inputA && inputB) : gate === "NOR" ? !(inputA || inputB) : inputA !== inputB;
  const rows = [[false, false], [false, true], [true, false], [true, true]];
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">logic gate: ideal 0/1 levels</text>
      <rect x="88" y="86" width="72" height="44" rx="10" fill={inputA ? "#34d399" : "#334155"} /><text x="112" y="114" fill="#fff" fontSize="15" fontWeight="900">A {inputA ? 1 : 0}</text>
      {gate !== "NOT" && <><rect x="88" y="168" width="72" height="44" rx="10" fill={inputB ? "#34d399" : "#334155"} /><text x="112" y="196" fill="#fff" fontSize="15" fontWeight="900">B {inputB ? 1 : 0}</text></>}
      <line x1="160" y1="108" x2="260" y2="126" stroke={inputA ? "#34d399" : "#64748b"} strokeWidth="5" />
      {gate !== "NOT" && <line x1="160" y1="190" x2="260" y2="174" stroke={inputB ? "#34d399" : "#64748b"} strokeWidth="5" />}
      <path d="M 260 92 H 350 Q 420 150 350 208 H 260 Z" fill="rgba(34,211,238,.18)" stroke="#67e8f9" strokeWidth="5" />
      <text x="305" y="158" fill="#e2e8f0" fontSize="24" fontWeight="900">{gate}</text>
      <line x1="420" y1="150" x2="548" y2="150" stroke={output ? "#34d399" : "#64748b"} strokeWidth="6" markerEnd="url(#arrow-circuit)" />
      <circle cx="604" cy="150" r="36" fill={output ? "#fde68a" : "#334155"} className={output ? "lab-anim-glow" : ""} />
      <text x="582" y="156" fill={output ? "#0f172a" : "#e2e8f0"} fontSize="16" fontWeight="900">Y {output ? 1 : 0}</text>
      <g transform="translate(456 56)">
        <rect width="224" height="74" rx="10" fill="rgba(15,23,42,.78)" stroke="#334155" />
        <text x="14" y="20" fill="#67e8f9" fontSize="12" fontWeight="900">truth table</text>
        {rows.map(([ra, rb], index) => {
          const y = 36 + index * 8;
          const active = ra === inputA && (gate === "NOT" || rb === inputB);
          const val = gate === "AND" ? ra && rb : gate === "OR" ? ra || rb : gate === "NOT" ? !ra : gate === "NAND" ? !(ra && rb) : gate === "NOR" ? !(ra || rb) : ra !== rb;
          return <text key={index} x="16" y={y} fill={active ? "#facc15" : "#94a3b8"} fontSize="9" fontWeight={active ? "900" : "700"}>{Number(ra)} {gate === "NOT" ? "-" : Number(rb)} | {Number(val)}</text>;
        })}
      </g>
      <text x="82" y="274" fill="#94a3b8" fontSize="13">Boolean expression: {gate === "NOT" ? "Y = NOT A" : `Y = A ${gate} B`}. Ideal logic levels.</text>
    </g>
  );
}

function SourcesOfEnergyScene({ a, b, c }: { a: number; b: number; c: number }) {
  const selected = Math.abs(Math.round(a || 0)) % 5;
  const sources = [
    { name: "solar", color: "#facc15", output: 62, reliability: 45, emissions: 8 },
    { name: "wind", color: "#67e8f9", output: 58, reliability: 50, emissions: 6 },
    { name: "hydro", color: "#38bdf8", output: 78, reliability: 82, emissions: 10 },
    { name: "fossil", color: "#f97316", output: 92, reliability: 88, emissions: 86 },
    { name: "nuclear", color: "#a78bfa", output: 96, reliability: 90, emissions: 14 },
  ];
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">energy source comparison dashboard</text>
      {sources.map((source, index) => (
        <g key={source.name} transform={`translate(${72 + index * 132} 72)`}>
          <rect width="114" height="178" rx="12" fill={index === selected ? "rgba(250,204,21,.16)" : "rgba(15,23,42,.76)"} stroke={index === selected ? "#facc15" : "#334155"} />
          <circle cx="57" cy="34" r="20" fill={source.color} opacity="0.86" />
          <text x="16" y="70" fill="#e2e8f0" fontSize="13" fontWeight="900">{source.name}</text>
          <text x="14" y="94" fill="#94a3b8" fontSize="10">output</text><rect x="54" y="84" width={source.output * 0.48} height="9" rx="4" fill="#34d399" />
          <text x="14" y="118" fill="#94a3b8" fontSize="10">reliable</text><rect x="54" y="108" width={source.reliability * 0.48} height="9" rx="4" fill="#22d3ee" />
          <text x="14" y="142" fill="#94a3b8" fontSize="10">emission</text><rect x="54" y="132" width={source.emissions * 0.48} height="9" rx="4" fill="#f43f5e" />
          <text x="14" y="166" fill="#cbd5e1" fontSize="10">{source.emissions > 60 ? "high CO2 tradeoff" : source.reliability < 60 ? "intermittent" : "low-carbon firm"}</text>
        </g>
      ))}
      <text x="82" y="282" fill="#94a3b8" fontSize="13">Illustrative comparison data: output, reliability, and emissions are teaching cues, not live rankings.</text>
    </g>
  );
}

function OhmsLawCircuitScene({ a, b, c }: { a: number; b: number; c: number }) {
  const current = clamp(a || 1, 0.05, 10);
  const resistance = clamp(b || c || 10, 0.5, 100);
  const voltage = current * resistance;
  const graphHeight = clamp(voltage / 2, 24, 112);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">Ohm's law circuit: V = IR</text>
      <path d="M 92 158 H 210 H 310 H 430 H 610 V 228 H 92 Z" fill="none" stroke="#64748b" strokeWidth="6" strokeLinejoin="round" />
      <rect x="112" y="132" width="58" height="52" rx="8" fill="#22d3ee" /><text x="128" y="163" fill="#082f49" fontSize="15" fontWeight="900">DC</text>
      <circle cx="254" cy="158" r="25" fill="#0f172a" stroke="#facc15" strokeWidth="4" /><text x="245" y="164" fill="#facc15" fontSize="17" fontWeight="900">A</text>
      <rect x="338" y="132" width="96" height="52" rx="8" fill="#facc15" /><path d="M 350 158 l12 -18 l14 36 l14 -36 l14 36 l14 -18" fill="none" stroke="#0f172a" strokeWidth="4" />
      <circle cx="386" cy="88" r="25" fill="#0f172a" stroke="#67e8f9" strokeWidth="4" /><text x="378" y="94" fill="#67e8f9" fontSize="17" fontWeight="900">V</text>
      <path d="M 362 88 H 326 V 132 M 410 88 H 454 V 132" fill="none" stroke="#67e8f9" strokeWidth="3" />
      {[0, 1, 2].map((i) => <line key={i} className="lab-anim-dash-fast" x1={186 + i * 120} y1="158" x2={244 + i * 120} y2="158" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />)}
      <rect x="500" y="72" width="190" height="152" rx="12" fill="rgba(15,23,42,.78)" stroke="#334155" />
      <line x1="530" y1="196" x2="656" y2="196" stroke="#94a3b8" /><line x1="530" y1="196" x2="530" y2="92" stroke="#94a3b8" />
      <path d={`M 530 196 L 656 ${196 - graphHeight}`} stroke="#22d3ee" strokeWidth="4" fill="none" />
      <text x="540" y="88" fill="#67e8f9" fontSize="12" fontWeight="900">V-I graph</text>
      <text x="548" y="218" fill="#94a3b8" fontSize="11">slope = R = {resistance.toFixed(1)} ohm</text>
      <text x="86" y="262" fill="#94a3b8" fontSize="13">Ohmic conductor assumed: V/I remains constant only for linear materials.</text>
      <text x="230" y="112" fill="#facc15" fontSize="12" fontWeight="900">I {current.toFixed(2)} A</text>
      <text x="330" y="214" fill="#fde68a" fontSize="12" fontWeight="900">R {resistance.toFixed(1)} ohm</text>
      <text x="430" y="112" fill="#67e8f9" fontSize="12" fontWeight="900">V {voltage.toFixed(1)} V</text>
    </g>
  );
}

function SeriesParallelResistanceScene({ a, b, c }: { a: number; b: number; c: number }) {
  const r1 = clamp(a || 10, 1, 100);
  const r2 = clamp(b || 20, 1, 100);
  const modeParallel = Math.round(c || 0) % 2 === 1;
  const req = modeParallel ? 1 / (1 / r1 + 1 / r2) : r1 + r2;
  const current = clamp(12 / req, 0.05, 3);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">resistor network: {modeParallel ? "parallel current split" : "series voltage split"}</text>
      <rect x="92" y="122" width="72" height="54" rx="8" fill="#22d3ee" /><text x="111" y="154" fill="#082f49" fontSize="14" fontWeight="900">12 V</text>
      {modeParallel ? (
        <>
          <path d="M 164 150 H 265 M 265 150 V 92 H 470 V 150 M 265 150 V 208 H 470 V 150 M 470 150 H 626" fill="none" stroke="#64748b" strokeWidth="6" />
          <rect x="332" y="72" width="78" height="38" rx="6" fill="#facc15" /><text x="348" y="96" fill="#0f172a" fontSize="12" fontWeight="900">R1</text>
          <rect x="332" y="190" width="78" height="38" rx="6" fill="#a78bfa" /><text x="348" y="214" fill="#0f172a" fontSize="12" fontWeight="900">R2</text>
          <line x1="284" y1="92" x2="328" y2="92" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
          <line x1="284" y1="208" x2="328" y2="208" stroke="#a78bfa" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
          <text x="494" y="94" fill="#67e8f9" fontSize="12">same V</text><text x="494" y="212" fill="#c4b5fd" fontSize="12">current splits</text>
        </>
      ) : (
        <>
          <path d="M 164 150 H 626" fill="none" stroke="#64748b" strokeWidth="6" />
          <rect x="270" y="124" width="82" height="52" rx="8" fill="#facc15" /><text x="292" y="155" fill="#0f172a" fontSize="13" fontWeight="900">R1</text>
          <rect x="414" y="124" width="82" height="52" rx="8" fill="#a78bfa" /><text x="436" y="155" fill="#0f172a" fontSize="13" fontWeight="900">R2</text>
          <line x1="190" y1="150" x2="258" y2="150" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
          <line x1="360" y1="150" x2="404" y2="150" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
          <text x="300" y="106" fill="#facc15" fontSize="12">same current</text><text x="428" y="106" fill="#c4b5fd" fontSize="12">voltage divides</text>
        </>
      )}
      <rect x="92" y="224" width="236" height="48" rx="10" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <text x="108" y="246" fill="#e2e8f0" fontSize="12" fontWeight="900">Req = {req.toFixed(2)} ohm</text>
      <text x="108" y="264" fill="#67e8f9" fontSize="11">I total = {current.toFixed(2)} A</text>
      <text x="390" y="250" fill="#94a3b8" fontSize="13">{modeParallel ? "1/Req = 1/R1 + 1/R2" : "Req = R1 + R2"}; ideal wires/meters.</text>
    </g>
  );
}

function ElectricPowerScene({ a, b, c }: { a: number; b: number; c: number }) {
  const voltage = clamp(a || 12, 1, 240);
  const current = clamp(b || 2, 0.1, 20);
  const time = clamp(c || 10, 1, 3600);
  const power = voltage * current;
  const energy = power * time;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">electric power and energy are different</text>
      <path d="M 88 154 H 228 H 354 H 540 H 650 V 224 H 88 Z" fill="none" stroke="#64748b" strokeWidth="6" />
      <rect x="110" y="128" width="66" height="52" rx="8" fill="#22d3ee" /><text x="126" y="158" fill="#082f49" fontSize="14" fontWeight="900">V</text>
      <rect x="246" y="126" width="86" height="58" rx="9" fill="#0f172a" stroke="#facc15" strokeWidth="4" /><text x="258" y="158" fill="#facc15" fontSize="13" fontWeight="900">W meter</text>
      <circle cx="464" cy="154" r={clamp(18 + power / 60, 22, 52)} fill="#fde68a" opacity={clamp(0.25 + power / 600, 0.28, 0.9)} className="lab-anim-glow" />
      <text x="433" y="158" fill="#0f172a" fontSize="13" fontWeight="900">load</text>
      <rect x="548" y="74" width="126" height="70" rx="10" fill="rgba(15,23,42,.82)" stroke="#34d399" />
      <text x="562" y="102" fill="#86efac" fontSize="12" fontWeight="900">energy counter</text>
      <rect x="562" y="116" width={clamp(energy / 500, 12, 94)} height="10" rx="5" fill="#34d399" />
      <line className="lab-anim-dash-fast" x1="188" y1="154" x2="238" y2="154" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
      <text x="98" y="262" fill="#94a3b8" fontSize="13">P = VI = {power.toFixed(1)} W; E = Pt = {energy.toFixed(0)} J. Ideal load model.</text>
    </g>
  );
}

function JouleHeatingScene({ a, b, c }: { a: number; b: number; c: number }) {
  const current = clamp(a || 2, 0.1, 20);
  const resistance = clamp(b || 10, 0.5, 100);
  const time = clamp(c || 5, 0.5, 120);
  const heat = current * current * resistance * time;
  const glow = clamp(heat / 1200, 0.18, 0.95);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">Joule heating: H = I^2Rt</text>
      <path d="M 94 154 H 248 H 428 H 620 V 226 H 94 Z" fill="none" stroke="#64748b" strokeWidth="6" />
      <rect x="116" y="128" width="62" height="52" rx="8" fill="#22d3ee" /><text x="132" y="160" fill="#082f49" fontSize="13" fontWeight="900">DC</text>
      <circle cx="238" cy="154" r="25" fill="#0f172a" stroke="#facc15" strokeWidth="4" /><text x="229" y="160" fill="#facc15" fontSize="16" fontWeight="900">A</text>
      <rect x="330" y="126" width="112" height="56" rx="10" fill={`rgba(249,115,22,${glow})`} stroke="#f97316" strokeWidth="4" className="lab-anim-glow" />
      <path d="M 344 154 l14 -20 l16 40 l16 -40 l16 40 l16 -20" fill="none" stroke="#fff7ed" strokeWidth="4" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${350 + i * 30} 112 C ${340 + i * 30} 94 ${364 + i * 30} 84 ${354 + i * 30} 66`} fill="none" stroke="#fb923c" strokeWidth="3" opacity={glow} />)}
      <rect x="486" y="82" width="28" height="126" rx="14" fill="#111827" stroke="#cbd5e1" />
      <rect x="495" y={194 - glow * 96} width="10" height={glow * 96} rx="5" fill="#f97316" />
      <rect x="554" y="84" width="130" height="120" rx="10" fill="rgba(15,23,42,.74)" stroke="#334155" />
      <line x1="578" y1="178" x2="660" y2="178" stroke="#94a3b8" /><line x1="578" y1="178" x2="578" y2="104" stroke="#94a3b8" />
      <path d={`M 578 178 C 604 ${178 - glow * 45} 632 ${178 - glow * 66} 660 ${178 - glow * 82}`} fill="none" stroke="#f97316" strokeWidth="4" />
      <text x="92" y="262" fill="#94a3b8" fontSize="13">Current is squared: heat {heat.toFixed(0)} J. Uniform resistor heating assumed.</text>
    </g>
  );
}

function ElectrolysisScene({ a, b, c }: { a: number; b: number; c: number }) {
  const current = clamp(a || 1, 0.1, 10);
  const time = clamp(b || 20, 1, 120);
  const deposit = clamp(current * time * (c || 1) / 20, 0.05, 42);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">electrolysis cell: ions carry charge through liquid</text>
      <rect x="90" y="70" width="74" height="46" rx="8" fill="#22d3ee" /><text x="108" y="99" fill="#082f49" fontSize="14" fontWeight="900">DC</text>
      <path d="M 126 116 V 152 H 252 M 164 93 H 510 V 152" fill="none" stroke="#64748b" strokeWidth="5" />
      <path d="M 238 90 L 560 90 L 522 244 L 276 244 Z" fill="rgba(56,189,248,.18)" stroke="#67e8f9" strokeWidth="4" />
      <rect x="306" y="108" width="26" height="112" rx="5" fill="#f97316" /><text x="282" y="236" fill="#fdba74" fontSize="12" fontWeight="900">anode +</text>
      <rect x="466" y="108" width="26" height="112" rx="5" fill="#94a3b8" /><rect x="466" y={220 - deposit} width="26" height={deposit} fill="#facc15" /><text x="438" y="236" fill="#fde68a" fontSize="12" fontWeight="900">cathode -</text>
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={358 + (i % 5) * 24} cy={128 + Math.floor(i / 5) * 34} r="6" fill={i % 2 ? "#38bdf8" : "#f43f5e"}><animate attributeName="cx" values={`${358 + (i % 5) * 24};${i % 2 ? 472 : 320};${358 + (i % 5) * 24}`} dur={`${2.4 - current * 0.08}s`} repeatCount="indefinite" /></circle>)}
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={476 + i * 5} cy="118" r="4" fill="#e0f2fe"><animate attributeName="cy" values="190;120;92" dur={`${1.8 + i * 0.2}s`} repeatCount="indefinite" /></circle>)}
      <circle cx="636" cy="154" r="27" fill="#0f172a" stroke="#facc15" strokeWidth="4" /><text x="627" y="160" fill="#facc15" fontSize="16" fontWeight="900">A</text>
      <text x="92" y="270" fill="#94a3b8" fontSize="13">Simplified electrolysis model; deposit grows with charge passed ({(current * time).toFixed(1)} C).</text>
    </g>
  );
}

function MeterBridgeScene({ a, b, c }: { a: number; b: number; c: number }) {
  const known = clamp(a || 10, 1, 100);
  const unknown = clamp(c || b || 20, 1, 100);
  const length = clamp((known / (known + unknown)) * 100, 8, 92);
  const jockeyX = 102 + length * 5.2;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">meter bridge: null point locates resistance ratio</text>
      <rect x="80" y="96" width="600" height="128" rx="12" fill="#7c2d12" opacity=".45" stroke="#fdba74" />
      <line x1="102" y1="178" x2="622" y2="178" stroke="#facc15" strokeWidth="7" />
      {[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1={102 + tick * 5.2} y1="170" x2={102 + tick * 5.2} y2="190" stroke="#fde68a" /><text x={94 + tick * 5.2} y="205" fill="#fde68a" fontSize="10">{tick}</text></g>)}
      <rect x="126" y="116" width="94" height="38" rx="7" fill="#22d3ee" /><text x="138" y="140" fill="#082f49" fontSize="12" fontWeight="900">Known R</text>
      <rect x="504" y="116" width="94" height="38" rx="7" fill="#a78bfa" /><text x="512" y="140" fill="#1e1b4b" fontSize="12" fontWeight="900">Unknown X</text>
      <line x1={jockeyX} y1="82" x2={jockeyX} y2="178" stroke="#e2e8f0" strokeWidth="5" markerEnd="url(#arrow-circuit)" />
      <circle cx={jockeyX} cy="76" r="21" fill="#0f172a" stroke="#34d399" strokeWidth="4" /><text x={jockeyX - 7} y="82" fill="#86efac" fontSize="15" fontWeight="900">J</text>
      <circle cx="360" cy="72" r="25" fill="#0f172a" stroke="#facc15" strokeWidth="4" /><path d="M 360 72 L 360 52" stroke="#facc15" strokeWidth="4" /><text x="386" y="78" fill="#facc15" fontSize="12" fontWeight="900">galvanometer null</text>
      <text x="94" y="252" fill="#94a3b8" fontSize="13">l = {length.toFixed(1)} cm; 100-l = {(100 - length).toFixed(1)} cm. Uniform wire, contact resistance ignored.</text>
    </g>
  );
}

function InternalResistanceCellScene({ a, b, c }: { a: number; b: number; c: number }) {
  const emf = clamp(a || 12, 1, 24);
  const externalR = clamp(b || 8, 0.5, 100);
  const internalR = clamp(c || 1, 0.1, 10);
  const current = emf / (externalR + internalR);
  const terminalV = emf - current * internalR;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">cell internal resistance: V = E - Ir</text>
      <path d="M 92 154 H 220 H 360 H 508 H 650 V 226 H 92 Z" fill="none" stroke="#64748b" strokeWidth="6" />
      <rect x="110" y="112" width="98" height="84" rx="12" fill="#22d3ee" /><text x="124" y="140" fill="#082f49" fontSize="13" fontWeight="900">EMF E</text><text x="124" y="166" fill="#082f49" fontSize="12">{emf.toFixed(1)} V</text>
      <rect x="244" y="128" width="84" height="52" rx="8" fill="#f97316" /><text x="256" y="158" fill="#fff7ed" fontSize="12" fontWeight="900">internal r</text>
      <rect x="414" y="128" width="98" height="52" rx="8" fill="#facc15" /><text x="426" y="158" fill="#0f172a" fontSize="12" fontWeight="900">load R</text>
      <circle cx="590" cy="96" r="25" fill="#0f172a" stroke="#67e8f9" strokeWidth="4" /><text x="582" y="102" fill="#67e8f9" fontSize="16" fontWeight="900">V</text>
      <path d="M 566 96 H 514 V 128 M 614 96 H 650 V 154" fill="none" stroke="#67e8f9" strokeWidth="3" />
      <rect x="244" y="88" width={clamp((emf - terminalV) * 34, 14, 100)} height="10" rx="5" fill="#f97316" />
      <text x="92" y="262" fill="#94a3b8" fontSize="13">Terminal V {terminalV.toFixed(2)} V; current {current.toFixed(2)} A. Linear internal resistance model.</text>
    </g>
  );
}

function CapacitorScene({ a, b, c }: { a: number; b: number; c: number }) {
  const charge = clamp(a * b / 100, 0, 100);
  return (
    <g>
      <line x1="100" y1="150" x2="285" y2="150" stroke="#facc15" strokeWidth="5" />
      <line x1="475" y1="150" x2="660" y2="150" stroke="#facc15" strokeWidth="5" />
      <rect x="315" y="74" width="28" height="152" rx="5" fill="#67e8f9" />
      <rect x="415" y="74" width="28" height="152" rx="5" fill="#a78bfa" />
      {Array.from({ length: 9 }, (_, i) => <text key={i} x="322" y={98 + i * 16} fill="#0f172a" fontSize="14" fontWeight="900">+</text>)}
      {Array.from({ length: 9 }, (_, i) => <text key={i} x="423" y={98 + i * 16} fill="#0f172a" fontSize="14" fontWeight="900">-</text>)}
      <rect x="352" y={226 - charge * 1.4} width="26" height={charge * 1.4} fill="#34d399" opacity="0.75" />
      <rect x="383" y={226 - clamp(c, 0, 1000) / 8} width="26" height={clamp(c, 0, 1000) / 8} fill="#f43f5e" opacity="0.65" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">capacitor stores charge in an electric field</text>
      <text x="82" y="72" fill="#94a3b8" fontSize="13">Q = CV, energy = 1/2 CV^2; parallel capacitance adds.</text>
      <text x="334" y="252" fill="#34d399" fontSize="12" fontWeight="900">charge</text>
      <text x="382" y="252" fill="#f43f5e" fontSize="12" fontWeight="900">C2</text>
    </g>
  );
}

function KirchhoffScene({ a, b, c }: { a: number; b: number; c: number }) {
  const i1 = a / Math.max(1, b);
  const i2 = a / Math.max(1, c);
  return (
    <g>
      <path d="M 130 150 H 300 M 300 150 C 360 86 470 86 540 150 M 300 150 C 360 214 470 214 540 150 M 540 150 H 680" fill="none" stroke="#64748b" strokeWidth="7" strokeLinecap="round" />
      <circle cx="300" cy="150" r="13" fill="#facc15" />
      <circle cx="540" cy="150" r="13" fill="#facc15" />
      <rect x="392" y="75" width="70" height="30" rx="5" fill="#22d3ee" />
      <rect x="392" y="195" width="70" height="30" rx="5" fill="#a78bfa" />
      <line className="lab-anim-dash-fast" x1="150" y1="150" x2="285" y2="150" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
      <line className="lab-anim-dash-fast" x1="320" y1="136" x2="390" y2="95" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
      <line className="lab-anim-dash-fast" x1="320" y1="164" x2="390" y2="205" stroke="#a78bfa" strokeWidth="4" markerEnd="url(#arrow-circuit)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Kirchhoff junction rule</text>
      <text x="82" y="72" fill="#94a3b8" fontSize="13">Current entering a junction equals current leaving it; each branch obeys V = IR.</text>
      <text x="382" y="62" fill="#22d3ee" fontSize="13" fontWeight="900">I1 {i1.toFixed(2)} A</text>
      <text x="382" y="248" fill="#a78bfa" fontSize="13" fontWeight="900">I2 {i2.toFixed(2)} A</text>
    </g>
  );
}

function GeneratorScene({ a, b, c }: { a: number; b: number; c: number }) {
  const emf = a * b * c * 0.03;
  return (
    <g>
      <rect x="130" y="82" width="400" height="170" rx="16" fill="rgba(15,23,42,.5)" stroke="#475569" strokeWidth="3" />
      <rect x="170" y="118" width="70" height="94" fill="#ef4444" /><text x="196" y="170" fill="#fff" fontSize="24" fontWeight="900">N</text>
      <rect x="430" y="118" width="70" height="94" fill="#3b82f6" /><text x="456" y="170" fill="#fff" fontSize="24" fontWeight="900">S</text>
      <g className="lab-anim-float" transform="translate(335 164)">
        <rect x="-60" y="-32" width="120" height="64" rx="8" fill="none" stroke="#facc15" strokeWidth="5" />
        <line x1="-70" y1="0" x2="-105" y2="0" stroke="#e2e8f0" strokeWidth="4" />
        <line x1="70" y1="0" x2="105" y2="0" stroke="#e2e8f0" strokeWidth="4" />
      </g>
      <path d="M 145 270 C 220 236 280 304 345 270 S 480 236 555 270" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">AC generator: rotating coil cuts flux</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Changing flux induces alternating emf; frequency controls reversal rate.</text>
      <text x="568" y="270" fill="#22d3ee" fontSize="13" fontWeight="900">E0 {emf.toFixed(1)} V</text>
    </g>
  );
}

function TransformerScene({ a, b, c }: { a: number; b: number; c: number }) {
  const ratio = c / Math.max(1, b);
  return (
    <g>
      <rect x="320" y="76" width="120" height="172" rx="12" fill="rgba(148,163,184,.22)" stroke="#94a3b8" strokeWidth="5" />
      {Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx="280" cy={92 + i * 20} rx="38" ry="10" fill="none" stroke="#22d3ee" strokeWidth="3" />)}
      {Array.from({ length: 12 }, (_, i) => <ellipse key={i} cx="480" cy={76 + i * 15} rx="38" ry="8" fill="none" stroke="#a78bfa" strokeWidth="3" />)}
      {Array.from({ length: 5 }, (_, i) => <path key={i} className="lab-anim-dash" d={`M 330 ${104 + i * 28} C 370 ${86 + i * 22} 394 ${86 + i * 22} 430 ${104 + i * 28}`} fill="none" stroke="#facc15" strokeWidth="3" />)}
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">transformer: shared changing flux</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Vs/Vp = Ns/Np; more secondary turns steps voltage up.</text>
      <text x="210" y="260" fill="#22d3ee" fontSize="13" fontWeight="900">primary {b.toFixed(0)} turns</text>
      <text x="456" y="260" fill="#a78bfa" fontSize="13" fontWeight="900">secondary {c.toFixed(0)} turns</text>
      <text x="560" y="96" fill="#facc15" fontSize="14" fontWeight="900">{ratio > 1 ? "step-up" : ratio < 1 ? "step-down" : "isolation"}</text>
    </g>
  );
}

function LcrScene({ a, b, c }: { a: number; b: number; c: number }) {
  const resonance = 1 / (2 * Math.PI * Math.sqrt(0.1 * Math.max(0.1, c) * 1e-6));
  const near = Math.abs(b - resonance) / resonance < 0.12;
  return (
    <g>
      <path d="M 105 150 H 210 L 225 130 L 245 170 L 265 130 L 285 170 L 305 150 H 385" fill="none" stroke="#facc15" strokeWidth="5" />
      <path d="M 385 150 h30 m0 -45 v90 m34 -90 v90 m0 -45 h110" fill="none" stroke="#67e8f9" strokeWidth="5" />
      <path d="M 560 150 c20 -45 50 45 70 0 c20 -45 50 45 70 0" fill="none" stroke="#a78bfa" strokeWidth="5" />
      <path d={`M 125 260 C 210 ${near ? 110 : 210} 285 250 360 ${near ? 98 : 215} S 540 ${near ? 98 : 215} 650 250`} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">series LCR resonance</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">At resonance XL = XC, impedance is minimum and current is maximum.</text>
      <text x="430" y="104" fill={near ? "#34d399" : "#f43f5e"} fontSize="14" fontWeight="900">{near ? "near resonance" : `f0 ${resonance.toFixed(0)} Hz`}</text>
    </g>
  );
}

function WaveScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "young-double-slit" || id === "single-slit-diffraction") return <InterferenceDiffractionScene id={id} a={a} b={b} c={c} />;
  if (id === "polarization-lab") return <PolarizationScene a={a} b={b} c={c} />;
  if (id === "em-spectrum") return <EmSpectrumScene a={a} b={b} c={c} />;
  if (id === "sound-wave-anatomy" || id === "sound-pitch-loudness") return <SoundAnatomyScene a={a} b={b} c={c} />;
  if (id === "wave-lab") return <WaveLabScene a={a} b={b} c={c} />;
  if (id === "chladni-plate") return <ChladniPlateScene a={a} b={b} c={c} />;
  if (id === "echo-speed-sound") return <EchoSpeedSoundScene a={a} b={b} c={c} />;
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

function WaveLabScene({ a, b, c }: { a: number; b: number; c: number }) {
  const frequency = clamp(a || 2, 0.5, 12);
  const amplitude = clamp((b || 1) * 18, 14, 58);
  const wavelength = clamp(420 / frequency, 42, 190);
  const speed = frequency * wavelength;
  const points = Array.from({ length: 110 }, (_, index) => {
    const x = 72 + index * 5.7;
    const y = 150 + Math.sin((index / 109) * Math.PI * 2 * (640 / wavelength)) * amplitude;
    return `${index === 0 ? "M" : "L"} ${x} ${y}`;
  }).join(" ");
  const crestX = 160 + wavelength / 4;
  return (
    <g>
      <line x1="72" y1="150" x2="704" y2="150" stroke="#64748b" strokeWidth="2" strokeDasharray="8 6" />
      <path className="lab-anim-dash" d={points} fill="none" stroke="#22d3ee" strokeWidth="5" />
      {Array.from({ length: 15 }, (_, index) => {
        const x = 92 + index * 40;
        const y = 150 + Math.sin((x - 72) / wavelength * Math.PI * 2) * amplitude;
        return <circle key={index} cx={x} cy={y} r="6" fill={index % 2 ? "#facc15" : "#67e8f9"} opacity="0.9" />;
      })}
      <line x1={crestX} y1="150" x2={crestX} y2={150 - amplitude} stroke="#f43f5e" strokeWidth="4" />
      <text x={crestX + 10} y={150 - amplitude / 2} fill="#f43f5e" fontSize="12" fontWeight="900">amplitude</text>
      <line x1="180" y1="236" x2={180 + wavelength} y2="236" stroke="#34d399" strokeWidth="5" />
      <line x1="180" y1="226" x2="180" y2="246" stroke="#34d399" strokeWidth="3" />
      <line x1={180 + wavelength} y1="226" x2={180 + wavelength} y2="246" stroke="#34d399" strokeWidth="3" />
      <text x={188 + wavelength / 3} y="226" fill="#34d399" fontSize="12" fontWeight="900">wavelength</text>
      <line x1="610" y1="108" x2="690" y2="108" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-optics)" />
      <text x="594" y="96" fill="#facc15" fontSize="12" fontWeight="900">wave propagation</text>
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Wave lab: medium oscillates locally</text>
      <text x="82" y="68" fill="#94a3b8" fontSize="13">Crests travel forward, while particles move up and down around equilibrium.</text>
      <g transform="translate(500 210)">
        <rect width="188" height="48" rx="10" fill="rgba(2,6,23,.78)" stroke="#334155" />
        <text x="14" y="21" fill="#67e8f9" fontSize="12" fontWeight="900">f {frequency.toFixed(1)} Hz | T {(1 / frequency).toFixed(2)} s</text>
        <text x="14" y="39" fill="#facc15" fontSize="12" fontWeight="900">v = f lambda = {speed.toFixed(0)} rel.</text>
      </g>
      <g transform="translate(78 250)">
        <rect width="124" height="24" rx="12" fill="rgba(34,211,238,.12)" stroke="#67e8f9" />
        <text x="14" y="16" fill="#a5f3fc" fontSize="11" fontWeight="900">linear wave model</text>
      </g>
      <g transform="translate(212 250)">
        <rect width="106" height="24" rx="12" fill="rgba(250,204,21,.12)" stroke="#facc15" />
        <text x="14" y="16" fill="#fde68a" fontSize="11" fontWeight="900">uniform medium</text>
      </g>
    </g>
  );
}

function ChladniPlateScene({ a, b, c }: { a: number; b: number; c: number }) {
  const mode = Math.max(1, Math.round(clamp(a || b || 3, 1, 7)));
  const plateX = 112;
  const plateY = 54;
  const size = 210;
  const grains = Array.from({ length: 90 }, (_, index) => {
    const band = index % 4;
    const t = (index * 37) % size;
    const offset = ((index * 19) % 18) - 9;
    const vertical = band < 2;
    const x = vertical ? plateX + size * (band + 1) / (mode + 2) + offset : plateX + t;
    const y = vertical ? plateY + t : plateY + size * ((band % 2) + 1) / (mode + 1) + offset;
    return { x: clamp(x, plateX + 8, plateX + size - 8), y: clamp(y, plateY + 8, plateY + size - 8) };
  });
  return (
    <g>
      <rect x={plateX} y={plateY} width={size} height={size} rx="18" fill="rgba(15,23,42,.86)" stroke="#67e8f9" strokeWidth="4" />
      {Array.from({ length: mode }, (_, index) => {
        const x = plateX + ((index + 1) * size) / (mode + 1);
        return <line key={`node-v-${index}`} x1={x} y1={plateY + 12} x2={x} y2={plateY + size - 12} stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="7 5" />;
      })}
      {Array.from({ length: Math.max(1, Math.floor(mode / 2)) }, (_, index) => {
        const y = plateY + ((index + 1) * size) / (Math.floor(mode / 2) + 1);
        return <line key={`node-h-${index}`} x1={plateX + 12} y1={y} x2={plateX + size - 12} y2={y} stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="7 5" />;
      })}
      {grains.map((grain, index) => <circle key={index} cx={grain.x} cy={grain.y} r={index % 5 === 0 ? 3.4 : 2.2} fill="#facc15" opacity="0.9" />)}
      <circle className="lab-anim-pulse" cx={plateX + size * 0.72} cy={plateY + size * 0.34} r={clamp(c * 5, 18, 44)} fill="rgba(244,63,94,.18)" stroke="#f43f5e" />
      <text x="370" y="60" fill="#e2e8f0" fontSize="16" fontWeight="900">Chladni plate: sand collects on nodes</text>
      <text x="370" y="88" fill="#94a3b8" fontSize="13">Frequency changes mode shape; antinodes vibrate, nodal lines stay almost still.</text>
      <text x="370" y="128" fill="#22d3ee" fontSize="13" fontWeight="900">node lines</text>
      <text x="370" y="158" fill="#f43f5e" fontSize="13" fontWeight="900">antinode vibration region</text>
      <text x="370" y="188" fill="#facc15" fontSize="13" fontWeight="900">sand accumulation</text>
      <text x="370" y="224" fill="#67e8f9" fontSize="13" fontWeight="900">mode / frequency index: {mode}</text>
      <g transform="translate(370 244)">
        <rect width="164" height="24" rx="12" fill="rgba(250,204,21,.12)" stroke="#facc15" />
        <text x="14" y="16" fill="#fde68a" fontSize="11" fontWeight="900">illustrative nodal pattern</text>
      </g>
    </g>
  );
}

function EchoSpeedSoundScene({ a, b, c }: { a: number; b: number; c: number }) {
  const echoTime = clamp(a || c || 2, 0.2, 8);
  const speed = clamp(b || 343, 250, 420);
  const distance = speed * echoTime / 2;
  const sourceX = 104;
  const wallX = 622;
  return (
    <g>
      <rect x="84" y="118" width="54" height="76" rx="18" fill="#38bdf8" />
      <circle cx="111" cy="94" r="22" fill="#facc15" />
      <rect x={wallX} y="62" width="28" height="188" rx="8" fill="#64748b" stroke="#cbd5e1" strokeWidth="3" />
      <path className="lab-anim-dash" d={`M ${sourceX + 54} 128 C 250 88 420 88 ${wallX} 128`} fill="none" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <path className="lab-anim-dash-fast" d={`M ${wallX} 174 C 430 224 252 224 ${sourceX + 54} 174`} fill="none" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <text x="164" y="86" fill="#67e8f9" fontSize="12" fontWeight="900">outgoing pulse</text>
      <text x="250" y="232" fill="#fde68a" fontSize="12" fontWeight="900">reflected echo pulse</text>
      <line x1={sourceX + 42} y1="264" x2={wallX} y2="264" stroke="#34d399" strokeWidth="5" />
      <text x="238" y="256" fill="#34d399" fontSize="13" fontWeight="900">one-way distance = v x t / 2 = {distance.toFixed(0)} m</text>
      <g transform="translate(170 42)">
        <rect width="330" height="30" rx="10" fill="rgba(2,6,23,.76)" stroke="#334155" />
        <circle cx="22" cy="15" r="7" fill="#22d3ee" />
        <circle cx="165" cy="15" r="7" fill="#94a3b8" />
        <circle cx="308" cy="15" r="7" fill="#facc15" />
        <line x1="22" y1="15" x2="308" y2="15" stroke="#64748b" strokeWidth="2" />
        <text x="38" y="20" fill="#67e8f9" fontSize="11" fontWeight="900">send</text>
        <text x="181" y="20" fill="#cbd5e1" fontSize="11" fontWeight="900">reflect</text>
        <text x="246" y="20" fill="#fde68a" fontSize="11" fontWeight="900">return {echoTime.toFixed(2)} s</text>
      </g>
      <text x="82" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">Echo timing uses round-trip sound travel</text>
      <text x="82" y="286" fill="#94a3b8" fontSize="13">The measured echo time includes outbound plus inbound travel, so distance uses half the time.</text>
      <text x="522" y="52" fill="#94a3b8" fontSize="12" fontWeight="900">wall / cliff</text>
    </g>
  );
}

function InterferenceDiffractionScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const isDouble = id === "young-double-slit";
  const lambda = clamp(a, 380, 700);
  const separation = Math.max(0.01, c);
  const fringe = clamp((lambda / 560) * b / separation * 18, 9, 54);
  const screenX = 690;
  const bands = Array.from({ length: 11 }, (_, index) => index - 5);
  return (
    <g>
      <line className="lab-anim-dash" x1="75" y1="150" x2="245" y2="150" stroke="#fde047" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <rect x="300" y="52" width="16" height="196" rx="5" fill="#94a3b8" />
      {isDouble ? (
        <>
          <rect x="296" y="122" width="24" height="14" rx="4" fill="#0f172a" />
          <rect x="296" y="164" width="24" height="14" rx="4" fill="#0f172a" />
        </>
      ) : (
        <rect x="296" y="140" width="24" height={clamp(26 / Math.max(0.2, c), 12, 52)} rx="4" fill="#0f172a" />
      )}
      {isDouble ? [129, 171].map((slitY) => bands.slice(3, 8).map((band) => (
        <line key={`${slitY}-${band}`} x1="316" y1={slitY} x2={screenX} y2={150 + band * fringe} stroke="rgba(167,139,250,.28)" strokeWidth="2" />
      ))) : bands.map((band) => (
        <path key={band} d={`M 316 150 Q 470 ${150 + band * fringe * 0.4} ${screenX} ${150 + band * fringe}`} fill="none" stroke="rgba(167,139,250,.28)" strokeWidth="2" />
      ))}
      <rect x="684" y="42" width="14" height="216" rx="5" fill="#e2e8f0" opacity="0.8" />
      {bands.map((band) => {
        const intensity = isDouble ? Math.cos((band * Math.PI) / 2) ** 2 : band === 0 ? 1 : 1 / (Math.abs(band) * 2.6);
        return <rect key={band} x="704" y={146 + band * fringe} width={clamp(intensity * 58, 8, 58)} height={band === 0 && !isDouble ? 16 : 9} rx="4" fill={band === 0 ? "#facc15" : "#22d3ee"} opacity={clamp(intensity, 0.18, 1)} />;
      })}
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">{isDouble ? "Young double slit: path difference makes fringes" : "single slit: central maximum dominates"}</text>
      <text x="330" y="82" fill="#a78bfa" fontSize="13" fontWeight="900">{isDouble ? "two coherent slits" : "one narrow aperture"}</text>
      <text x="610" y="278" fill="#facc15" fontSize="13" fontWeight="900">beta ~ {fringe.toFixed(1)} px</text>
      <text x="82" y="278" fill="#94a3b8" fontSize="13">Wavelength and screen distance widen the pattern; slit spacing/aperture controls spread.</text>
    </g>
  );
}

function PolarizationScene({ a, b, c }: { a: number; b: number; c: number }) {
  const theta = clamp(b, 0, 180);
  const transmitted = clamp(a * Math.cos((theta * Math.PI) / 180) ** 2 * c, 0, 100);
  return (
    <g>
      <line className="lab-anim-dash" x1="70" y1="150" x2="225" y2="150" stroke="#fde047" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      {[0, 1, 2, 3, 4].map((index) => <path key={index} d={`M ${90 + index * 28} 106 Q ${104 + index * 28} 150 ${90 + index * 28} 194`} fill="none" stroke="#fde047" strokeWidth="2" opacity="0.55" />)}
      <g transform="translate(265 150)">
        <rect x="-22" y="-92" width="44" height="184" rx="8" fill="rgba(103,232,249,.18)" stroke="#67e8f9" strokeWidth="4" />
        <line x1="0" y1="-76" x2="0" y2="76" stroke="#67e8f9" strokeWidth="3" />
      </g>
      <g transform={`translate(445 150) rotate(${theta})`}>
        <rect x="-22" y="-92" width="44" height="184" rx="8" fill="rgba(167,139,250,.18)" stroke="#a78bfa" strokeWidth="4" />
        <line x1="0" y1="-76" x2="0" y2="76" stroke="#a78bfa" strokeWidth="3" />
      </g>
      <line x1="287" y1="150" x2="423" y2="150" stroke="#22d3ee" strokeWidth="5" />
      <line className="lab-anim-dash-fast" x1="467" y1="150" x2="680" y2="150" stroke="#34d399" strokeWidth={clamp(2 + transmitted / 16, 2, 8)} opacity={clamp(transmitted / 100, 0.15, 1)} markerEnd="url(#arrow-optics)" />
      <circle cx="650" cy="150" r={clamp(12 + transmitted / 5, 12, 32)} fill="#34d399" opacity={clamp(transmitted / 100, 0.12, 0.8)} className="lab-anim-glow" />
      <text x="234" y="42" fill="#67e8f9" fontSize="13" fontWeight="900">polarizer</text>
      <text x="405" y="42" fill="#a78bfa" fontSize="13" fontWeight="900">analyzer {theta.toFixed(0)} deg</text>
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Malus law: I = I0 cos^2 theta</text>
      <text x="560" y="222" fill="#34d399" fontSize="14" fontWeight="900">transmitted {transmitted.toFixed(1)}</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Extinction happens near crossed axes; polarization proves light is transverse.</text>
    </g>
  );
}

function EmSpectrumScene({ a, c }: { a: number; b: number; c: number }) {
  const bands = [
    ["Radio", 0.001, 0.3, "#38bdf8"],
    ["IR", 0.3, 400, "#fb923c"],
    ["Visible", 400, 790, "#22c55e"],
    ["UV", 790, 3000, "#a78bfa"],
  ] as const;
  const x = clamp(95 + (Math.log10(Math.max(0.001, a)) + 3) / 6 * 560, 95, 655);
  const glow = clamp(0.25 + c, 0.25, 1);
  return (
    <g>
      <rect x="90" y="118" width="570" height="46" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      {bands.map(([name, start, end, color]) => {
        const x1 = 95 + (Math.log10(start) + 3) / 6 * 560;
        const x2 = 95 + (Math.log10(end) + 3) / 6 * 560;
        return <g key={name}><rect x={x1} y="122" width={Math.max(8, x2 - x1)} height="38" fill={color} opacity="0.72" /><text x={x1 + 4} y="184" fill={color} fontSize="12" fontWeight="900">{name}</text></g>;
      })}
      <line x1={x} y1="82" x2={x} y2="216" stroke="#facc15" strokeWidth="4" />
      <circle cx={x} cy="104" r={18 + glow * 10} fill="#facc15" opacity={0.2 + glow * 0.35} className="lab-anim-glow" />
      <path className="lab-anim-dash" d={`M 90 242 C 190 204 270 282 360 242 S 540 204 660 242`} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="82" y="44" fill="#e2e8f0" fontSize="16" fontWeight="900">electromagnetic spectrum</text>
      <text x={x - 38} y="72" fill="#facc15" fontSize="13" fontWeight="900">{a.toFixed(a < 1 ? 3 : 0)} THz</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Higher frequency means shorter wavelength and larger photon energy.</text>
    </g>
  );
}

function SoundAnatomyScene({ a, b, c }: { a: number; b: number; c: number }) {
  const wavelength = clamp(343 / Math.max(20, a) * 90, 18, 160);
  const amp = clamp(b * 22, 8, 50);
  const particles = Array.from({ length: 36 }, (_, index) => {
    const x = 88 + index * 18;
    const phase = Math.sin(index / wavelength * 60);
    return { x: x + phase * amp * 0.22, y: 150 + phase * 18 };
  });
  return (
    <g>
      <path className="lab-anim-dash" d={Array.from({ length: 90 }, (_, index) => {
        const x = 80 + index * 7;
        const y = 150 + Math.sin(index / clamp(900 / Math.max(20, a), 4, 28)) * amp;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      }).join(" ")} fill="none" stroke="#22d3ee" strokeWidth="4" />
      {particles.map((particle, index) => <circle key={index} cx={particle.x} cy={particle.y} r={clamp(3 + b, 4, 8)} fill={index % 5 === 0 ? "#facc15" : "#94a3b8"} opacity="0.86" />)}
      <rect x="104" y="220" width={wavelength} height="8" rx="4" fill="#34d399" />
      <text x="112" y="214" fill="#34d399" fontSize="13" fontWeight="900">wavelength</text>
      <line x1="635" y1={150 - amp} x2="635" y2={150 + amp} stroke="#f43f5e" strokeWidth="4" />
      <text x="644" y="154" fill="#f43f5e" fontSize="13" fontWeight="900">amplitude</text>
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">sound wave anatomy</text>
      <text x="82" y="276" fill="#94a3b8" fontSize="13">Frequency changes pitch; amplitude changes loudness; distance reduces intensity.</text>
    </g>
  );
}

function ThermalScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "heat-and-temperature") return <HeatTemperatureScene a={a} b={b} c={c} />;
  if (id === "heat-transfer") return <HeatTransferBenchScene a={a} b={b} c={c} />;
  if (id === "gas-laws") return <GasLawsPistonScene a={a} b={b} c={c} />;
  if (id === "thermodynamic-process") return <ThermodynamicProcessScene a={a} b={b} c={c} />;
  if (id === "calorimetry-mixing") return <CalorimetryMixingScene a={a} b={b} c={c} />;
  if (id === "statistical-ensemble-lab") return <StatisticalEnsembleScene a={a} b={b} c={c} />;
  return (
    <g>
      <text x="90" y="45" fill="#e2e8f0" fontSize="16" fontWeight="900">Thermal model needs a mapped scene</text>
      <text x="90" y="72" fill="#94a3b8" fontSize="13">This experiment is guarded by the visualization contract.</text>
    </g>
  );
}

function HeatTemperatureScene({ a, b, c }: { a: number; b: number; c: number }) {
  const tempC = clamp(a, -20, 120);
  const mass = clamp(b || 1, 0.2, 10);
  const heat = clamp(c || tempC * mass * 4.18, 0, 5000);
  const fill = clamp((tempC + 20) / 140, 0.05, 1);
  const particleSpeed = clamp((tempC + 30) / 90, 0.3, 2.1);
  return (
    <g>
      <text x="76" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">heat transfer raises temperature reading</text>
      <rect x="94" y="76" width="78" height="162" rx="36" fill="#111827" stroke="#cbd5e1" strokeWidth="4" />
      <rect x="122" y={218 - fill * 112} width="22" height={fill * 112} rx="11" fill="#ef4444" className="lab-anim-glow" />
      <circle cx="133" cy="225" r="24" fill="#ef4444" />
      {[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1="174" y1={216 - tick * 1.1} x2="194" y2={216 - tick * 1.1} stroke="#94a3b8" /><text x="200" y={220 - tick * 1.1} fill="#94a3b8" fontSize="10">{tick} C</text></g>)}
      <text x="102" y="264" fill="#fca5a5" fontSize="13" fontWeight="900">Thermometer {tempC.toFixed(1)} C</text>
      <rect x="286" y="78" width="220" height="142" rx="16" fill="rgba(249,115,22,.16)" stroke="#fb923c" strokeWidth="4" />
      {Array.from({ length: 24 }, (_, index) => {
        const x = 310 + (index % 8) * 24;
        const y = 104 + Math.floor(index / 8) * 36;
        return (
          <circle key={index} cx={x} cy={y} r={4 + particleSpeed} fill={index % 3 === 0 ? "#facc15" : "#fb923c"} opacity="0.84">
            <animate attributeName="cx" values={`${x};${x + 4 * particleSpeed};${x - 5 * particleSpeed};${x}`} dur={`${1.2 / particleSpeed}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values={`${y};${y - 3 * particleSpeed};${y + 4 * particleSpeed};${y}`} dur={`${1.35 / particleSpeed}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
      <line x1="238" y1="184" x2="286" y2="164" stroke="#f97316" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <text x="218" y="210" fill="#fdba74" fontSize="13" fontWeight="900">Heat = energy in transfer</text>
      <text x="304" y="62" fill="#fde68a" fontSize="13" fontWeight="900">Particle speed: average kinetic energy cue</text>
      <rect x="548" y="78" width="138" height="54" rx="10" fill="rgba(34,211,238,.12)" stroke="#22d3ee" />
      <text x="562" y="101" fill="#67e8f9" fontSize="12" fontWeight="900">Kelvin {(tempC + 273.15).toFixed(1)} K</text>
      <text x="562" y="120" fill="#94a3b8" fontSize="11">formula scale</text>
      <rect x="548" y="146" width="138" height="54" rx="10" fill="rgba(250,204,21,.12)" stroke="#facc15" />
      <text x="562" y="169" fill="#fde68a" fontSize="12" fontWeight="900">Heat {heat.toFixed(0)} J</text>
      <text x="562" y="188" fill="#94a3b8" fontSize="11">depends on mass c DeltaT</text>
      <text x="286" y="264" fill="#94a3b8" fontSize="13">Same temperature can represent different heat energy when mass changes. Mass {mass.toFixed(1)} kg.</text>
    </g>
  );
}

function HeatTransferBenchScene({ a, b, c }: { a: number; b: number; c: number }) {
  const deltaT = clamp(a || 40, 5, 220);
  const thickness = clamp(b || 2, 0.5, 10);
  const rate = clamp((deltaT * (c || 1)) / thickness, 1, 180);
  return (
    <g>
      <text x="74" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">three heat-transfer mechanisms</text>
      <g transform="translate(70 62)">
        <rect width="190" height="178" rx="14" fill="rgba(239,68,68,.1)" stroke="#fb7185" />
        <text x="18" y="28" fill="#fecdd3" fontSize="13" fontWeight="900">Conduction</text>
        <rect x="26" y="82" width="136" height="26" rx="6" fill="#64748b" />
        <rect x="26" y="82" width={clamp(136 - thickness * 7, 58, 132)} height="26" rx="6" fill="#f97316" opacity=".75" />
        {[0, 1, 2].map((i) => <line key={i} x1={42 + i * 36} y1="95" x2={82 + i * 36} y2="95" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-default)" />)}
        <text x="24" y="134" fill="#94a3b8" fontSize="11">solid bar only</text>
        <text x="24" y="152" fill="#facc15" fontSize="11" fontWeight="900">DeltaT {deltaT.toFixed(0)} C</text>
      </g>
      <g transform="translate(286 62)">
        <rect width="190" height="178" rx="14" fill="rgba(34,211,238,.1)" stroke="#22d3ee" />
        <text x="18" y="28" fill="#bae6fd" fontSize="13" fontWeight="900">Convection</text>
        <rect x="42" y="55" width="108" height="102" rx="14" fill="rgba(14,165,233,.25)" stroke="#38bdf8" />
        <path d="M 70 132 C 38 86 78 54 112 76 C 152 102 124 154 82 140" fill="none" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-default)" />
        <path d="M 126 72 C 156 108 128 148 92 142" fill="none" stroke="#38bdf8" strokeWidth="4" markerEnd="url(#arrow-default)" />
        <text x="22" y="152" fill="#94a3b8" fontSize="11">warm fluid rises; cool fluid sinks</text>
      </g>
      <g transform="translate(502 62)">
        <rect width="190" height="178" rx="14" fill="rgba(250,204,21,.1)" stroke="#facc15" />
        <text x="18" y="28" fill="#fde68a" fontSize="13" fontWeight="900">Radiation</text>
        <circle cx="58" cy="104" r="25" fill="#f97316" className="lab-anim-glow" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${86 + i * 6} ${84 + i * 15} C ${112 + i * 6} ${74 + i * 9}, ${132 + i * 7} ${72 + i * 18}, 154 ${78 + i * 20}`} fill="none" stroke="#facc15" strokeWidth="3" markerEnd="url(#arrow-default)" />)}
        <rect x="142" y="75" width="18" height="72" rx="8" fill="#94a3b8" />
        <text x="24" y="152" fill="#94a3b8" fontSize="11">no medium required</text>
      </g>
      <rect x="224" y="258" width={clamp(rate * 1.6, 20, 250)} height="12" rx="6" fill="#22d3ee" />
      <text x="74" y="269" fill="#67e8f9" fontSize="13" fontWeight="900">heat-transfer rate {rate.toFixed(1)} W</text>
      <text x="506" y="269" fill="#94a3b8" fontSize="13">Simplified heat rate; uniform material approximation.</text>
    </g>
  );
}

function GasLawsPistonScene({ a, b, c }: { a: number; b: number; c: number }) {
  const pressure = clamp(a || 100, 20, 500);
  const tempK = clamp(b || 300, 150, 800);
  const volume = clamp(c || 3, 0.5, 8);
  const pistonY = clamp(210 - volume * 14, 92, 204);
  const speed = clamp(tempK / 300, 0.5, 2.2);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">ideal gas piston: P, V, and absolute temperature</text>
      <rect x="92" y="78" width="210" height="150" rx="12" fill="rgba(34,211,238,.12)" stroke="#67e8f9" strokeWidth="4" />
      <rect x="104" y={pistonY} width="186" height="14" rx="5" fill="#94a3b8" />
      <line x1="197" y1={pistonY} x2="197" y2="54" stroke="#94a3b8" strokeWidth="5" />
      <text x="118" y="248" fill="#94a3b8" fontSize="12">Volume {volume.toFixed(2)} L</text>
      {Array.from({ length: 20 }, (_, index) => {
        const x = 120 + (index % 5) * 33;
        const y = pistonY + 24 + Math.floor(index / 5) * clamp((226 - pistonY) / 5, 9, 25);
        return <circle key={index} cx={x} cy={y} r="5" fill={index % 2 ? "#facc15" : "#22d3ee"}><animate attributeName="cx" values={`${x};${x + speed * 7};${x - speed * 6};${x}`} dur={`${1.4 / speed}s`} repeatCount="indefinite" /></circle>;
      })}
      <circle cx="390" cy="116" r="44" fill="rgba(15,23,42,.82)" stroke="#cbd5e1" strokeWidth="5" />
      <path d={`M 390 116 L ${390 + Math.cos(pressure / 120) * 31} ${116 - Math.sin(pressure / 120) * 31}`} stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
      <text x="342" y="178" fill="#fecdd3" fontSize="13" fontWeight="900">Pressure {pressure.toFixed(0)} kPa</text>
      <rect x="486" y="62" width="184" height="178" rx="12" fill="rgba(15,23,42,.75)" stroke="#334155" />
      <text x="508" y="92" fill="#67e8f9" fontSize="13" fontWeight="900">P-V-T dashboard</text>
      <text x="508" y="120" fill="#fde68a" fontSize="12">T = {tempK.toFixed(0)} K</text>
      <text x="508" y="142" fill="#bae6fd" fontSize="12">V = {volume.toFixed(2)} L</text>
      <text x="508" y="164" fill="#fecdd3" fontSize="12">P = {pressure.toFixed(0)} kPa</text>
      <line x1="520" y1="216" x2="646" y2="216" stroke="#94a3b8" />
      <line x1="520" y1="216" x2="520" y2="178" stroke="#94a3b8" />
      <path d="M 526 184 C 548 190 568 200 590 206 C 612 212 628 214 646 215" fill="none" stroke="#facc15" strokeWidth="3" />
      <text x="536" y="236" fill="#94a3b8" fontSize="11">Boyle P vs V curve</text>
      <text x="92" y="276" fill="#94a3b8" fontSize="13">Ideal gas assumption; gas-law formulas use absolute temperature, not Celsius.</text>
    </g>
  );
}

function ThermodynamicProcessScene({ a, b, c }: { a: number; b: number; c: number }) {
  const pressure = clamp(a || 120, 40, 400);
  const deltaV = clamp(b || 2, -4, 6);
  const processIndex = Math.abs(Math.round(c || 0)) % 4;
  const process = ["isothermal", "adiabatic", "isobaric", "isochoric"][processIndex];
  const volume = process === "isochoric" ? 3 : clamp(3 + deltaV, 0.8, 7);
  const pistonY = clamp(212 - volume * 15, 88, 200);
  const work = process === "isochoric" ? 0 : pressure * (volume - 3) / 100;
  const heatArrow = process !== "adiabatic";
  return (
    <g>
      <text x="74" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">thermodynamic process: piston synchronized with P-V path</text>
      <rect x="84" y="76" width="210" height="156" rx="12" fill="rgba(34,211,238,.12)" stroke={process === "adiabatic" ? "#facc15" : "#67e8f9"} strokeWidth="4" strokeDasharray={process === "adiabatic" ? "8 6" : undefined} />
      <rect x="102" y={pistonY} width="174" height="16" rx="5" fill="#cbd5e1" />
      <line x1="189" y1={pistonY} x2="189" y2="56" stroke="#94a3b8" strokeWidth="5" />
      {heatArrow && <line x1="44" y1="154" x2="84" y2="154" stroke="#f97316" strokeWidth="6" markerEnd="url(#arrow-default)" />}
      <text x={heatArrow ? 34 : 40} y="140" fill={heatArrow ? "#fdba74" : "#facc15"} fontSize="12" fontWeight="900">{heatArrow ? "Heat" : "insulated"}</text>
      {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={124 + (i % 3) * 48} cy={pistonY + 34 + Math.floor(i / 3) * 34} r="7" fill="#facc15" opacity=".82" />)}
      <text x="102" y="254" fill="#67e8f9" fontSize="12" fontWeight="900">P {pressure.toFixed(0)} kPa | V {volume.toFixed(1)} L</text>
      <rect x="360" y="64" width="300" height="190" rx="12" fill="rgba(15,23,42,.78)" stroke="#334155" />
      <line x1="400" y1="218" x2="620" y2="218" stroke="#94a3b8" />
      <line x1="400" y1="218" x2="400" y2="92" stroke="#94a3b8" />
      <text x="626" y="222" fill="#94a3b8" fontSize="11">V</text>
      <text x="388" y="86" fill="#94a3b8" fontSize="11">P</text>
      <path d={process === "isobaric" ? "M 420 150 H 590" : process === "isochoric" ? "M 500 210 V 106" : process === "adiabatic" ? "M 420 112 C 470 132 520 176 596 206" : "M 420 120 C 470 128 530 178 596 198"} fill="none" stroke={process === "adiabatic" ? "#facc15" : "#22d3ee"} strokeWidth="5" markerEnd="url(#arrow-default)" />
      <text x="424" y="78" fill="#e2e8f0" fontSize="13" fontWeight="900">P-V path: {process}</text>
      <text x="424" y="248" fill="#fde68a" fontSize="12" fontWeight="900">Work {work.toFixed(2)} kJ</text>
      <text x="74" y="276" fill="#94a3b8" fontSize="13">Quasi-static idealized process; heat/work signs are conceptual for the selected path.</text>
    </g>
  );
}

function CalorimetryMixingScene({ a, b, c }: { a: number; b: number; c: number }) {
  const hotMass = clamp(a || 1, 0.1, 5);
  const hotTemp = clamp(b || 80, 25, 100);
  const coldMass = clamp(c || 1, 0.1, 5);
  const coldTemp = 25;
  const finalTemp = (hotMass * hotTemp + coldMass * coldTemp) / (hotMass + coldMass);
  const fill = clamp((finalTemp - coldTemp) / Math.max(1, hotTemp - coldTemp), 0.08, 0.95);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">calorimetry mixing: heat lost equals heat gained</text>
      <rect x="92" y="70" width="130" height="82" rx="12" fill="rgba(249,115,22,.16)" stroke="#fb923c" />
      <rect x="540" y="70" width="130" height="82" rx="12" fill="rgba(34,211,238,.16)" stroke="#38bdf8" />
      <text x="116" y="104" fill="#fdba74" fontSize="13" fontWeight="900">Hot sample</text>
      <text x="560" y="104" fill="#bae6fd" fontSize="13" fontWeight="900">Cold sample</text>
      <text x="116" y="128" fill="#fdba74" fontSize="12">{hotMass.toFixed(1)} kg, {hotTemp.toFixed(1)} C</text>
      <text x="560" y="128" fill="#bae6fd" fontSize="12">{coldMass.toFixed(1)} kg, {coldTemp} C</text>
      <path d="M 220 128 C 286 148 300 176 330 196" fill="none" stroke="#f97316" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <path d="M 540 128 C 476 148 458 176 426 196" fill="none" stroke="#38bdf8" strokeWidth="6" markerEnd="url(#arrow-default)" />
      <path d="M 314 118 L 446 118 L 424 244 L 336 244 Z" fill="rgba(148,163,184,.18)" stroke="#cbd5e1" strokeWidth="4" />
      <path d={`M 332 ${238 - fill * 86} L 428 ${238 - fill * 86} L 420 238 L 340 238 Z`} fill="rgba(56,189,248,.42)" />
      <rect x="456" y="110" width="20" height="122" rx="10" fill="#111827" stroke="#cbd5e1" />
      <rect x="463" y={218 - fill * 88} width="6" height={fill * 88} rx="3" fill={finalTemp > 50 ? "#f97316" : "#facc15"} />
      <circle cx="466" cy="226" r="13" fill={finalTemp > 50 ? "#f97316" : "#facc15"} />
      <text x="338" y="268" fill="#fde68a" fontSize="13" fontWeight="900">Final temperature {finalTemp.toFixed(1)} C equilibrium</text>
      <text x="80" y="270" fill="#94a3b8" fontSize="12">No heat loss; uniform mixing and constant heat capacity assumed.</text>
      <text x="506" y="270" fill="#94a3b8" fontSize="12">q hot lost = q cold gained</text>
    </g>
  );
}

function StatisticalEnsembleScene({ a, b, c }: { a: number; b: number; c: number }) {
  const temperature = clamp(a || 300, 80, 900);
  const samples = Math.round(clamp(b || 80, 20, 200));
  const interaction = clamp(c || 0.4, 0, 1);
  const spread = clamp(temperature / 900 + interaction * 0.35, 0.18, 1);
  const bins = [0.25, 0.55, 0.9, 1.0, 0.76, 0.46, 0.25].map((height, index) => clamp(height * spread * 120 - Math.abs(index - 3) * 8, 12, 120));
  const meanX = 542;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">statistical ensemble: many microstates build a distribution</text>
      <rect x="82" y="64" width="300" height="190" rx="14" fill="rgba(34,211,238,.08)" stroke="#22d3ee" />
      {Array.from({ length: 42 }, (_, index) => {
        const x = 110 + ((index * 37) % 240);
        const y = 90 + ((index * 23) % 132);
        const hot = (index % 7) / 7 < spread;
        return <circle key={index} cx={x} cy={y} r={hot ? 5.5 : 3.8} fill={hot ? "#facc15" : "#38bdf8"} opacity=".82"><animate attributeName="cy" values={`${y};${y - 8 * spread};${y + 7 * spread};${y}`} dur={`${1.2 + (index % 6) * 0.1}s`} repeatCount="indefinite" /></circle>;
      })}
      <text x="104" y="238" fill="#67e8f9" fontSize="12" fontWeight="900">sample count {samples}</text>
      <text x="238" y="238" fill="#fde68a" fontSize="12" fontWeight="900">fluctuation spread {spread.toFixed(2)}</text>
      <rect x="432" y="64" width="244" height="190" rx="14" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <line x1="462" y1="222" x2="642" y2="222" stroke="#94a3b8" />
      <line x1="462" y1="222" x2="462" y2="88" stroke="#94a3b8" />
      {bins.map((height, index) => <rect key={index} x={478 + index * 22} y={222 - height} width="16" height={height} rx="4" fill={index === 3 ? "#facc15" : "#22d3ee"} opacity=".82" />)}
      <line x1={meanX} y1="86" x2={meanX} y2="228" stroke="#f43f5e" strokeWidth="4" strokeDasharray="7 5" />
      <text x="552" y="102" fill="#fecdd3" fontSize="12" fontWeight="900">Mean</text>
      <text x="490" y="244" fill="#94a3b8" fontSize="11">energy state</text>
      <text x="438" y="282" fill="#94a3b8" fontSize="13">Qualitative distribution model; ensemble average is over many possible states.</text>
    </g>
  );
}

function FluidScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "buoyancy" || id === "density-float-sink") return <BuoyancyScene a={a} b={b} c={c} />;
  if (id === "bernoulli-fluid-flow") return <BernoulliScene a={a} b={b} c={c} />;
  if (id === "force-and-pressure") return <ForceAndPressureScene a={a} b={b} c={c} />;
  if (id === "fluid-pressure") return <FluidPressureDepthScene a={a} b={b} c={c} />;
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

function ForceAndPressureScene({ a, b, c }: { a: number; b: number; c: number }) {
  const force = clamp(a, 1, 500);
  const area = Math.max(0.05, clamp(b || c || 1, 0.05, 8));
  const pressure = force / area;
  const smallAreaPressure = force / Math.max(0.1, area * 0.45);
  const largeAreaPressure = force / Math.max(0.1, area * 1.8);
  const pistonWidth = clamp(area * 38, 46, 210);
  const markCount = Math.round(clamp(pressure / 20, 4, 22));
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">force over area: pressure press</text>
      <rect x="110" y="206" width="270" height="24" rx="5" fill="#64748b" />
      <rect x={245 - pistonWidth / 2} y="104" width={pistonWidth} height="96" rx="12" fill="#38bdf8" stroke="#67e8f9" strokeWidth="4" />
      <rect x={245 - pistonWidth / 2 - 8} y="190" width={pistonWidth + 16} height="16" rx="4" fill="#facc15" />
      <line x1="245" y1="56" x2="245" y2="100" stroke="#f43f5e" strokeWidth={clamp(force / 60, 4, 10)} markerEnd="url(#arrow-fluid)" />
      <text x="262" y="84" fill="#f43f5e" fontSize="13" fontWeight="900">F = {force.toFixed(0)} N</text>
      {Array.from({ length: markCount }, (_, index) => (
        <line key={index} x1={122 + (index % 11) * 22} y1={214 + Math.floor(index / 11) * 7} x2={134 + (index % 11) * 22} y2={214 + Math.floor(index / 11) * 7} stroke="#facc15" strokeWidth="3" opacity=".88" />
      ))}
      <rect x="430" y="60" width="250" height="188" rx="14" fill="rgba(15,23,42,.72)" stroke="#334155" />
      <text x="452" y="90" fill="#e2e8f0" fontSize="14" fontWeight="900">P = F / A</text>
      <text x="452" y="120" fill="#67e8f9" fontSize="13" fontWeight="900">Area {area.toFixed(2)} m^2</text>
      <text x="452" y="148" fill="#facc15" fontSize="13" fontWeight="900">Pressure {pressure.toFixed(1)} Pa</text>
      <circle cx="560" cy="196" r="38" fill="none" stroke="#94a3b8" strokeWidth="5" />
      <path d={`M 560 196 L ${560 + Math.cos(pressure / 90) * 28} ${196 - Math.sin(pressure / 90) * 28}`} stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
      <text x="520" y="238" fill="#94a3b8" fontSize="12" fontWeight="900">pressure gauge</text>
      <g transform="translate(92 250)">
        <rect width="140" height="34" rx="8" fill="rgba(244,63,94,.14)" stroke="#f43f5e" />
        <text x="12" y="21" fill="#fecdd3" fontSize="12" fontWeight="900">small A: {smallAreaPressure.toFixed(0)} Pa</text>
      </g>
      <g transform="translate(250 250)">
        <rect width="140" height="34" rx="8" fill="rgba(34,211,238,.14)" stroke="#22d3ee" />
        <text x="12" y="21" fill="#bae6fd" fontSize="12" fontWeight="900">large A: {largeAreaPressure.toFixed(0)} Pa</text>
      </g>
      <text x="452" y="276" fill="#94a3b8" fontSize="13">Uniform contact pressure assumed.</text>
    </g>
  );
}

function FluidPressureDepthScene({ a, b, c }: { a: number; b: number; c: number }) {
  const density = clamp(a || b || 1000, 600, 1400);
  const depth = clamp(c || b || 2, 0.2, 10);
  const g = 9.81;
  const pressure = density * g * depth;
  const probeY = clamp(88 + depth * 14, 102, 228);
  const waterDark = clamp(depth / 10, 0.25, 0.9);
  return (
    <g>
      <text x="82" y="36" fill="#e2e8f0" fontSize="16" fontWeight="900">hydrostatic pressure increases with depth</text>
      <rect x="112" y="72" width="260" height="184" rx="12" fill="rgba(56,189,248,.12)" stroke="#38bdf8" strokeWidth="4" />
      <defs>
        <linearGradient id="fluid-depth-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(125,211,252,.28)" />
          <stop offset="100%" stopColor={`rgba(14,116,144,${waterDark})`} />
        </linearGradient>
      </defs>
      <rect x="112" y="102" width="260" height="154" fill="url(#fluid-depth-gradient)" />
      {[0, 1, 2, 3, 4].map((tick) => (
        <g key={tick}>
          <line x1="382" y1={102 + tick * 34} x2="404" y2={102 + tick * 34} stroke="#94a3b8" strokeWidth="2" />
          <text x="410" y={106 + tick * 34} fill="#94a3b8" fontSize="11">{(tick * 2.5).toFixed(1)} m</text>
        </g>
      ))}
      <circle cx="230" cy={probeY} r="12" fill="#facc15" stroke="#fde68a" strokeWidth="3" className="lab-anim-glow" />
      <line x1="242" y1={probeY} x2="482" y2={probeY} stroke="#facc15" strokeWidth="3" strokeDasharray="7 6" />
      {[0, 1, 2].map((jet) => <line key={jet} x1="372" y1={128 + jet * 45} x2={430 + jet * 34} y2={128 + jet * 45} stroke="#22d3ee" strokeWidth={2 + jet * 1.4} markerEnd="url(#arrow-fluid)" opacity=".72" />)}
      <path d={`M 505 86 V 218 Q 505 242 532 242 Q 560 242 560 218 V ${218 - clamp(pressure / 12000, 28, 112)}`} fill="none" stroke="#67e8f9" strokeWidth="8" strokeLinecap="round" />
      <circle cx="610" cy="148" r="42" fill="rgba(15,23,42,.72)" stroke="#94a3b8" strokeWidth="5" />
      <path d={`M 610 148 L ${610 + Math.cos(pressure / 45000) * 30} ${148 - Math.sin(pressure / 45000) * 30}`} stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
      <text x="525" y="62" fill="#67e8f9" fontSize="13" fontWeight="900">manometer</text>
      <text x="450" y="270" fill="#e2e8f0" fontSize="13" fontWeight="900">P = rho g h = {(pressure / 1000).toFixed(1)} kPa</text>
      <text x="128" y="278" fill="#94a3b8" fontSize="13">Gauge pressure shown; same depth has same pressure in all directions.</text>
      <text x="130" y="92" fill="#67e8f9" fontSize="12" fontWeight="900">rho {density.toFixed(0)} kg/m^3</text>
      <text x="244" y={probeY - 14} fill="#facc15" fontSize="12" fontWeight="900">depth {depth.toFixed(1)} m</text>
    </g>
  );
}

function BuoyancyScene({ a, b, c }: { a: number; b: number; c: number }) {
  const fluid = Math.max(1, b || 1000);
  const object = Math.max(1, c || a || 500);
  const fraction = clamp(object / fluid, 0.08, 1);
  const blockY = 82 + fraction * 112;
  return (
    <g>
      <rect x="120" y="80" width="300" height="176" rx="10" fill="rgba(56,189,248,.16)" stroke="#38bdf8" strokeWidth="4" />
      <rect x="120" y="128" width="300" height="128" fill="rgba(56,189,248,.45)" />
      <rect x="230" y={blockY} width="78" height="78" rx="8" fill="#facc15" stroke="#fde68a" strokeWidth="4" />
      <line x1="269" y1={blockY + 78} x2="269" y2={blockY + 142} stroke="#f43f5e" strokeWidth="5" markerEnd="url(#arrow-fluid)" />
      <line x1="269" y1={blockY} x2="269" y2={blockY - 70} stroke="#34d399" strokeWidth="5" markerEnd="url(#arrow-fluid)" />
      <rect x="500" y={256 - fraction * 120} width="80" height={fraction * 120} fill="#38bdf8" opacity="0.7" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Archimedes principle</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Buoyant force equals weight of displaced fluid; density ratio decides float/sink.</text>
      <text x="492" y="276" fill="#38bdf8" fontSize="13" fontWeight="900">displaced fluid</text>
    </g>
  );
}

function BernoulliScene({ a, b, c }: { a: number; b: number; c: number }) {
  const speed = clamp(b, 0, 50);
  const narrow = clamp(90 - speed, 28, 88);
  return (
    <g>
      <path d={`M 80 110 H 290 C 350 110 360 ${150 - narrow / 2} 430 ${150 - narrow / 2} H 690 V ${150 + narrow / 2} H 430 C 360 ${150 + narrow / 2} 350 190 290 190 H 80 Z`} fill="rgba(34,211,238,.18)" stroke="#22d3ee" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => <circle key={i} r="6" fill="#67e8f9"><animateMotion dur={`${2.3 - speed / 35}s`} begin={`${i * 0.28}s`} repeatCount="indefinite" path="M100 150 H680" /></circle>)}
      <rect x="150" y={80 - clamp(a / 25, 10, 50)} width="34" height={clamp(a / 25, 10, 50)} fill="#facc15" />
      <rect x="495" y={80 - clamp(70 - speed, 10, 58)} width="34" height={clamp(70 - speed, 10, 58)} fill="#f43f5e" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Bernoulli: faster flow, lower static pressure</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Pressure energy, kinetic energy, and height energy trade along a streamline.</text>
      <text x="472" y="238" fill="#f43f5e" fontSize="13" fontWeight="900">narrow fast section</text>
    </g>
  );
}

function ElectricFieldScene({ a, b, c }: { a: number; b: number; c: number }) {
  const chargeColor = a >= 0 ? "#f43f5e" : "#38bdf8";
  return (
    <g>
      {[55, 90, 125, 160, 195, 230].map((r, i) => <circle key={i} cx="360" cy="150" r={r} fill="none" stroke="rgba(148,163,184,.28)" strokeWidth="2" />)}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return <line key={i} x1="360" y1="150" x2={360 + Math.cos(angle) * 215} y2={150 + Math.sin(angle) * 105} stroke="#22d3ee" strokeWidth="3" markerEnd="url(#arrow-modern)" opacity="0.65" />;
      })}
      <circle cx="360" cy="150" r="38" fill={chargeColor} className="lab-anim-glow" />
      <text x="348" y="160" fill="#fff" fontSize="28" fontWeight="900">{a >= 0 ? "+" : "-"}</text>
      <circle cx={360 + clamp(b * 45, 45, 230)} cy="150" r="12" fill="#facc15" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">electric field lines and equipotentials</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Field falls as 1/r^2, potential falls as 1/r; equipotentials are perpendicular to field lines.</text>
      <text x="510" y="132" fill="#facc15" fontSize="13" fontWeight="900">test charge {c.toFixed(1)} microC</text>
    </g>
  );
}

function MagneticFieldScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  const turns = id === "electromagnet" ? Math.max(3, Math.round(a / 20)) : 1;
  const isElectromagnet = id === "electromagnet";
  return (
    <g>
      {isElectromagnet ? (
        <>
          <rect x="312" y="62" width="96" height="180" rx="18" fill="#334155" />
          <text x="324" y="86" fill="#cbd5e1" fontSize="12" fontWeight="900">iron core</text>
          <text x="426" y="92" fill="#f43f5e" fontSize="16" fontWeight="900">N</text>
          <text x="278" y="92" fill="#38bdf8" fontSize="16" fontWeight="900">S</text>
        </>
      ) : (
        <rect x="342" y="54" width="36" height="190" rx="18" fill="#facc15" />
      )}
      {Array.from({ length: turns }, (_, i) => <ellipse key={i} cx="360" cy={82 + i * (150 / Math.max(1, turns - 1))} rx={isElectromagnet ? 96 : 54} ry={isElectromagnet ? 22 : 16} fill="none" stroke="#a78bfa" strokeWidth="3" />)}
      {[52, 90, 128].map((r) => <ellipse key={r} cx="360" cy="150" rx={r * (isElectromagnet ? 2 : 1.25)} ry={r} fill="none" stroke="rgba(34,211,238,.28)" strokeWidth="2" markerEnd="url(#arrow-modern)" />)}
      <line className="lab-anim-dash-fast" x1="360" y1="248" x2="360" y2="52" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-modern)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">{isElectromagnet ? "electromagnet: coil and core strengthen field" : "straight current: circular magnetic field"}</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">{isElectromagnet ? "Right-hand grip rule: curled fingers follow current, thumb points toward north pole." : "Right-hand thumb rule: thumb is conventional current, curled fingers show B direction."}</text>
      <text x="372" y="52" fill="#facc15" fontSize="12" fontWeight="900">current direction</text>
      <text x="470" y="104" fill="#a78bfa" fontSize="13" fontWeight="900">NI strength {(a * b * Math.max(1, c)).toFixed(0)}</text>
      <text x="84" y="270" fill="#94a3b8" fontSize="12">{isElectromagnet ? "Ideal solenoid approximation; qualitative field-line density." : "Straight-wire approximation; conventional current shown."}</text>
    </g>
  );
}

function LorentzForceScene({ a, b, c }: { a: number; b: number; c: number }) {
  return (
    <g>
      {Array.from({ length: 40 }, (_, i) => <text key={i} x={90 + (i % 10) * 58} y={75 + Math.floor(i / 10) * 45} fill="#64748b" fontSize="18">x</text>)}
      <circle cx="315" cy="150" r="22" fill="#facc15" className="lab-anim-glow" />
      <line x1="315" y1="150" x2="515" y2="150" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow-modern)" />
      <line x1="315" y1="150" x2="315" y2={a >= 0 ? 55 : 245} stroke="#f43f5e" strokeWidth="6" markerEnd="url(#arrow-modern)" />
      <path d="M 315 150 C 380 88 470 90 535 150" fill="none" stroke="#34d399" strokeWidth="4" strokeDasharray="7 5" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Lorentz force: q v cross B</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Force is maximum when velocity is perpendicular to magnetic field; it bends path without doing work.</text>
    </g>
  );
}

function EmiScene({ a, b, c }: { a: number; b: number; c: number }) {
  const emf = a * b / Math.max(1, c);
  return (
    <g>
      <rect x="410" y="92" width="150" height="116" rx="14" fill="none" stroke="#67e8f9" strokeWidth="5" />
      {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={485} cy={105 + i * 22} rx="82" ry="14" fill="none" stroke="#67e8f9" strokeWidth="3" />)}
      <rect className="lab-anim-float" x="160" y="122" width="130" height="56" rx="8" fill="#ef4444" />
      <rect className="lab-anim-float" x="290" y="122" width="130" height="56" rx="8" fill="#3b82f6" />
      <text x="210" y="156" fill="#fff" fontSize="20" fontWeight="900">N</text>
      <text x="342" y="156" fill="#fff" fontSize="20" fontWeight="900">S</text>
      <line className="lab-anim-dash-fast" x1="285" y1="150" x2="420" y2="150" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-modern)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">Faraday induction and Lenz response</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Only changing magnetic flux induces emf; the induced current opposes the change.</text>
      <text x="566" y="150" fill="#facc15" fontSize="13" fontWeight="900">emf {emf.toFixed(1)} V</text>
    </g>
  );
}

function PhotoelectricScene({ a, b, c }: { a: number; b: number; c: number }) {
  const emits = a > b && c > 0;
  const kmax = Math.max(0, a - b);
  return (
    <g>
      <rect x="385" y="76" width="62" height="160" rx="8" fill="#94a3b8" />
      {Array.from({ length: 5 }, (_, i) => <line key={i} className="lab-anim-dash" x1="90" y1={88 + i * 28} x2="380" y2="150" stroke="#fde047" strokeWidth="4" markerEnd="url(#arrow-modern)" />)}
      {emits && Array.from({ length: 5 }, (_, i) => <circle key={i} r="7" fill="#22d3ee"><animateMotion dur={`${1.2 + i * 0.12}s`} repeatCount="indefinite" path={`M 448 ${112 + i * 18} H 650`} /></circle>)}
      <line x1="448" y1="150" x2="650" y2="150" stroke={emits ? "#22d3ee" : "#64748b"} strokeWidth="5" markerEnd="url(#arrow-modern)" />
      <rect x="116" y="244" width={clamp(a * 38, 20, 260)} height="12" rx="6" fill="#facc15" />
      <rect x="116" y="264" width={clamp(b * 38, 20, 260)} height="12" rx="6" fill="#f43f5e" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">photoelectric threshold</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Frequency controls electron energy; intensity controls number of emitted electrons after threshold.</text>
      <text x="500" y="98" fill={emits ? "#34d399" : "#f43f5e"} fontSize="14" fontWeight="900">{emits ? `emission, Kmax ${kmax.toFixed(2)} eV` : "no emission below threshold"}</text>
    </g>
  );
}

function FieldScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "electrostatic-field-potential" || id === "static-electricity") return <ElectricFieldScene a={a} b={b} c={c} />;
  if (id === "magnetic-field-current" || id === "electromagnet") return <MagneticFieldScene id={id} a={a} b={b} c={c} />;
  if (id === "lorentz-force") return <LorentzForceScene a={a} b={b} c={c} />;
  if (id === "emi-faraday") return <EmiScene a={a} b={b} c={c} />;
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
  if (id === "advanced-quantum-operators") return <AdvancedQuantumOperatorsScene a={a} b={b} c={c} />;
  if (id === "photoelectric-equation") return <PhotoelectricScene a={a} b={b} c={c} />;
  if (id === "special-relativity-bridge") return <RelativityScene a={a} b={b} c={c} />;
  if (id === "nuclear-decay") return <NuclearDecayScene a={a} b={b} c={c} />;
  if (id === "de-broglie-wavelength") return <DeBroglieScene a={a} b={b} c={c} />;
  if (id === "bohr-model") return <BohrTransitionScene a={a} b={b} c={c} />;
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

function NuclearDecayScene({ a, b, c }: { a: number; b: number; c: number }) {
  const initial = Math.round(clamp(a || 120, 40, 180));
  const halfLife = clamp(b || 5, 0.5, 20);
  const elapsed = clamp(c || 5, 0, 60);
  const remaining = Math.round(initial * 0.5 ** (elapsed / halfLife));
  const decayed = initial - remaining;
  const grid = Array.from({ length: 100 }, (_, index) => index < clamp((remaining / initial) * 100, 0, 100));
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">half-life decay: statistical population model</text>
      <g transform="translate(82 62)">
        {grid.map((alive, index) => <circle key={index} cx={(index % 10) * 18} cy={Math.floor(index / 10) * 18} r="6" fill={alive ? "#22d3ee" : "#f43f5e"} opacity={alive ? 0.9 : 0.62} />)}
        <text x="0" y="200" fill="#67e8f9" fontSize="12" fontWeight="900">remaining {remaining}</text>
        <text x="98" y="200" fill="#fb7185" fontSize="12" fontWeight="900">decayed {decayed}</text>
      </g>
      <g transform="translate(330 74)">
        <line x1="0" y1="150" x2="320" y2="150" stroke="#64748b" /><line x1="0" y1="150" x2="0" y2="12" stroke="#64748b" />
        <path d={Array.from({ length: 80 }, (_, index) => {
          const t = (index / 79) * halfLife * 4;
          const y = 150 - 130 * 0.5 ** (t / halfLife);
          return `${index === 0 ? "M" : "L"} ${index * 4} ${y}`;
        }).join(" ")} fill="none" stroke="#facc15" strokeWidth="4" />
        {[1, 2, 3].map((n) => <g key={n}><line x1={n * 70} y1="18" x2={n * 70} y2="150" stroke="#334155" strokeDasharray="5 5" /><text x={n * 70 - 18} y="168" fill="#94a3b8" fontSize="10">{n} T1/2</text></g>)}
        <text x="12" y="18" fill="#facc15" fontSize="12" fontWeight="900">N = N0(1/2)^(t/T1/2)</text>
        <text x="188" y="54" fill="#67e8f9" fontSize="12" fontWeight="900">activity falls with N</text>
      </g>
      <text x="82" y="282" fill="#94a3b8" fontSize="13">Random decay model: half-life predicts population behavior, not which nucleus decays next.</text>
    </g>
  );
}

function DeBroglieScene({ a, b, c }: { a: number; b: number; c: number }) {
  const momentum = clamp(a || b || 5, 0.2, 50);
  const wavelength = clamp(12.3 / Math.sqrt(Math.max(0.1, c || momentum)), 0.08, 8);
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">matter wave: electron beam wavelength</text>
      <rect x="86" y="126" width="78" height="48" rx="12" fill="#334155" stroke="#67e8f9" /><text x="104" y="155" fill="#67e8f9" fontSize="13" fontWeight="900">source</text>
      <line x1="170" y1="150" x2="606" y2="150" stroke="#64748b" strokeWidth="3" />
      <line className="lab-anim-dash-fast" x1="170" y1="150" x2="606" y2="150" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-modern)" />
      <path className="lab-anim-dash" d={`M 180 150 ${Array.from({ length: 80 }, (_, index) => {
        const x = 180 + index * 5;
        const y = 150 + Math.sin(index / clamp(wavelength, 0.8, 8) * 1.2) * 26;
        return `L ${x} ${y}`;
      }).join(" ")}`} fill="none" stroke="#facc15" strokeWidth="3" />
      <rect x="622" y="72" width="28" height="156" rx="8" fill="#e2e8f0" opacity="0.8" />
      {[-2, -1, 0, 1, 2].map((n) => <rect key={n} x="656" y={146 + n * 22} width={n === 0 ? 58 : 34} height="8" rx="4" fill={n === 0 ? "#facc15" : "#22d3ee"} opacity={n === 0 ? 1 : 0.55} />)}
      <line x1="250" y1="226" x2={250 + clamp(80 / wavelength, 20, 120)} y2="226" stroke="#34d399" strokeWidth="5" />
      <text x="244" y="216" fill="#34d399" fontSize="12" fontWeight="900">wavelength ruler</text>
      <text x="312" y="92" fill="#67e8f9" fontSize="13" fontWeight="900">momentum p = {momentum.toFixed(2)}</text>
      <text x="312" y="116" fill="#facc15" fontSize="13" fontWeight="900">lambda = h / p approx {wavelength.toFixed(2)}</text>
      <text x="82" y="282" fill="#94a3b8" fontSize="13">Non-relativistic matter-wave representation; wave scale is schematic, not a visible classical wave.</text>
    </g>
  );
}

function BohrTransitionScene({ a, b, c }: { a: number; b: number; c: number }) {
  const n1 = Math.max(1, Math.round(clamp(a || 3, 1, 5)));
  const n2 = Math.max(1, Math.round(clamp(b || 2, 1, 5)));
  const emission = n2 < n1;
  const levels = [1, 2, 3, 4, 5];
  const energyDiff = Math.abs(13.6 * (1 / (n2 * n2) - 1 / (n1 * n1)));
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">Bohr transition and spectral line</text>
      <circle cx="210" cy="150" r="18" fill="#f43f5e" />
      {levels.map((n) => <circle key={n} cx="210" cy="150" r={28 + n * 22} fill="none" stroke={n === n1 ? "#facc15" : n === n2 ? "#22d3ee" : "#475569"} strokeWidth={n === n1 || n === n2 ? 4 : 2} />)}
      <path d={`M ${210 + 28 + n1 * 22} 150 Q 282 80 ${210 + 28 + n2 * 22} 150`} fill="none" stroke={emission ? "#facc15" : "#22d3ee"} strokeWidth="4" markerEnd="url(#arrow-modern)" />
      <text x="92" y="264" fill="#94a3b8" fontSize="13">{emission ? "emission" : "absorption"}: electron moves n={n1} to n={n2}; DeltaE = hf = {energyDiff.toFixed(2)} eV</text>
      <g transform="translate(430 70)">
        {levels.map((n, index) => <g key={n}><line x1="0" y1={140 - index * 26} x2="170" y2={140 - index * 26} stroke={n === n1 ? "#facc15" : n === n2 ? "#22d3ee" : "#64748b"} strokeWidth="4" /><text x="184" y={144 - index * 26} fill="#94a3b8" fontSize="11">n={n}</text></g>)}
        <line x1="72" y1={140 - (n1 - 1) * 26} x2="72" y2={140 - (n2 - 1) * 26} stroke={emission ? "#facc15" : "#22d3ee"} strokeWidth="5" markerEnd="url(#arrow-modern)" />
        <rect x="0" y="168" width="210" height="16" rx="8" fill="#1e293b" />
        <rect x={clamp(c * 16, 0, 170)} y="168" width="32" height="16" rx="8" fill={emission ? "#facc15" : "#22d3ee"} />
        <text x="0" y="204" fill="#e2e8f0" fontSize="12" fontWeight="900">spectral line</text>
      </g>
      <text x="82" y="282" fill="#94a3b8" fontSize="13">Hydrogen-only Bohr model; simplified atomic picture for level transitions.</text>
    </g>
  );
}

function AdvancedQuantumOperatorsScene({ a, b, c }: { a: number; b: number; c: number }) {
  const stateAngle = ((clamp(a, 0, 100) / 100) * 120 + 20) * Math.PI / 180;
  const operatorAngle = ((clamp(c, 0, 10) / 10) * 75 + 18) * Math.PI / 180;
  const barrier = clamp(b, 0, 100);
  const projection = Math.cos(stateAngle - operatorAngle);
  const p1 = clamp(projection * projection, 0, 1);
  const p2 = 1 - p1;
  const transmission = clamp(Math.exp(-barrier / 32) * (0.35 + 0.65 * clamp(a, 1, 100) / 100), 0.02, 0.98);
  const cx = 250;
  const cy = 160;
  const r = 96;
  const sx = cx + Math.cos(stateAngle) * r;
  const sy = cy - Math.sin(stateAngle) * r;
  const ox = cx + Math.cos(operatorAngle) * (r + 36);
  const oy = cy - Math.sin(operatorAngle) * (r + 36);
  const p1Height = 125 * p1;
  const p2Height = 125 * p2;
  return (
    <g>
      <rect x="52" y="42" width="656" height="218" rx="18" fill="rgba(15,23,42,.72)" stroke="rgba(34,211,238,.35)" />
      <circle cx={cx} cy={cy} r={r} fill="rgba(34,211,238,.06)" stroke="rgba(148,163,184,.35)" strokeWidth="2" />
      <line x1={cx - 122} y1={cy} x2={cx + 134} y2={cy} stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-modern)" />
      <line x1={cx} y1={cy + 116} x2={cx} y2={cy - 128} stroke="#475569" strokeWidth="2" markerEnd="url(#arrow-modern)" />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow-modern)" />
      <line x1={cx} y1={cy} x2={ox} y2={oy} stroke="#facc15" strokeWidth="5" strokeDasharray="8 6" markerEnd="url(#arrow-modern)" />
      <circle cx={sx} cy={sy} r="10" fill="#22d3ee" className="lab-anim-glow" />
      <circle cx={ox} cy={oy} r="7" fill="#facc15" />
      <path d={`M ${sx} ${sy} C ${sx + 55} ${sy - 50}, ${ox - 40} ${oy + 45}, ${ox} ${oy}`} fill="none" stroke="#a78bfa" strokeWidth="3" strokeDasharray="6 5" />
      <text x="74" y="72" fill="#e2e8f0" fontSize="16" fontWeight="900">operator action in state space</text>
      <text x="74" y="96" fill="#94a3b8" fontSize="13">A quantum operator transforms a state; measurement reads projection onto allowed eigenstates.</text>
      <text x={sx + 10} y={sy - 8} fill="#67e8f9" fontSize="13" fontWeight="900">state psi</text>
      <text x={ox + 8} y={oy + 5} fill="#fde68a" fontSize="13" fontWeight="900">A psi</text>
      <text x={cx + 90} y={cy - 18} fill="#c4b5fd" fontSize="12">basis |a1&gt;</text>
      <text x={cx + 8} y={cy - 104} fill="#c4b5fd" fontSize="12">basis |a2&gt;</text>

      <g transform="translate(430 82)">
        <text x="0" y="0" fill="#67e8f9" fontSize="13" fontWeight="900">measurement probabilities</text>
        <rect x="0" y="36" width="42" height="132" rx="8" fill="#1e293b" stroke="#334155" />
        <rect x="62" y="36" width="42" height="132" rx="8" fill="#1e293b" stroke="#334155" />
        <rect x="0" y={168 - p1Height} width="42" height={p1Height} rx="8" fill="#22d3ee" />
        <rect x="62" y={168 - p2Height} width="42" height={p2Height} rx="8" fill="#a78bfa" />
        <text x="5" y="190" fill="#e2e8f0" fontSize="12">P(a1)</text>
        <text x="66" y="190" fill="#e2e8f0" fontSize="12">P(a2)</text>
        <text x="126" y="66" fill="#f8fafc" fontSize="12" fontWeight="900">{Math.round(p1 * 100)}% aligned</text>
        <text x="126" y="88" fill="#94a3b8" fontSize="12">projection = |&lt;a|psi&gt;|^2</text>
      </g>

      <g transform="translate(548 190)">
        <line x1="0" y1="34" x2="138" y2="34" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
        <rect x="50" y={34 - clamp(barrier, 18, 82)} width="34" height={clamp(barrier, 18, 82)} fill="rgba(244,63,94,.46)" stroke="#fb7185" />
        <path className="lab-anim-dash" d="M 0 34 C 24 6, 48 62, 72 34 S 120 34, 138 34" fill="none" stroke="#22d3ee" strokeWidth="4" />
        <line x1="88" y1="16" x2={88 + 45 * transmission} y2="16" stroke="#34d399" strokeWidth="4" markerEnd="url(#arrow-modern)" />
        <text x="-4" y="-6" fill="#fbbf24" fontSize="12" fontWeight="900">barrier / scattering</text>
        <text x="88" y="64" fill="#34d399" fontSize="12" fontWeight="900">T ~ {Math.round(transmission * 100)}%</text>
      </g>
    </g>
  );
}

function RelativityScene({ a, b, c }: { a: number; b: number; c: number }) {
  const beta = clamp(a / 100, 0.05, 0.96);
  const gamma = 1 / Math.sqrt(1 - beta * beta);
  const lightPath = clamp(70 + gamma * 24, 80, 220);
  const timeBar = clamp(70 * gamma, 70, 230);
  const contracted = clamp(190 / gamma, 70, 190);
  return (
    <g>
      <rect x="88" y="215" width="620" height="16" rx="6" fill="#475569" />
      <g transform="translate(150 72)">
        <rect x="0" y="0" width="120" height="150" rx="12" fill="#1e293b" stroke="#67e8f9" strokeWidth="3" />
        <line className="lab-anim-dash-fast" x1="60" y1="125" x2="60" y2="25" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-modern)" />
        <circle r="6" fill="#facc15"><animateMotion dur="1.4s" repeatCount="indefinite" path="M60 125 V25 V125" /></circle>
        <text x="6" y="174" fill="#94a3b8" fontSize="12">proper light clock</text>
      </g>
      <g transform="translate(350 72)">
        <rect x="0" y="0" width={contracted} height="86" rx="10" fill="#38bdf8" opacity="0.78" />
        <path d={`M 18 120 C 80 ${120 - lightPath / 3}, 130 ${120 + lightPath / 5}, 210 ${120 - lightPath / 4}`} fill="none" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-modern)" />
        <line x1="0" y1="150" x2={timeBar} y2="150" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" />
        <text x="0" y="180" fill="#94a3b8" fontSize="12">moving-frame time stretches</text>
      </g>
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">relativity bridge: beta {beta.toFixed(2)}c, gamma {gamma.toFixed(2)}</text>
      <text x="82" y="275" fill="#94a3b8" fontSize="13">Length contracts along motion while measured time grows with the Lorentz factor.</text>
    </g>
  );
}

function MeasurementWorkflowScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "computational-physics-workflow") return <ComputationalWorkflowScene a={a} b={b} c={c} />;
  return <MeasurementErrorsScene a={a} b={b} c={c} />;
}

function MeasurementErrorsScene({ a, b, c }: { a: number; b: number; c: number }) {
  const reading = clamp(a || 5.26, 0, 10);
  const leastCount = clamp(b || 0.01, 0.001, 0.5);
  const trueValue = clamp(c || reading * 0.98, 0, 10);
  const error = Math.abs(reading - trueValue);
  const percent = trueValue > 0 ? (error / trueValue) * 100 : 0;
  const repeats = [reading - leastCount * 2, reading - leastCount, reading, reading + leastCount, reading + leastCount * 2];
  const mean = repeats.reduce((sum, value) => sum + value, 0) / repeats.length;
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">measurement, uncertainty, and significant figures</text>
      <rect x="82" y="96" width="420" height="58" rx="10" fill="#1e293b" stroke="#94a3b8" />
      {Array.from({ length: 21 }, (_, index) => <g key={index}><line x1={100 + index * 18} y1="96" x2={100 + index * 18} y2={index % 5 === 0 ? 132 : 116} stroke="#cbd5e1" /><text x={94 + index * 18} y="148" fill="#94a3b8" fontSize="9">{index % 5 === 0 ? index / 2 : ""}</text></g>)}
      <rect x="120" y="66" width={clamp(reading * 36, 40, 360)} height="26" rx="8" fill="#67e8f9" opacity="0.72" />
      <line x1={100 + reading * 36} y1="72" x2={100 + reading * 36} y2="168" stroke="#facc15" strokeWidth="4" />
      <text x={108 + reading * 36} y="78" fill="#facc15" fontSize="12" fontWeight="900">reading {reading.toFixed(3)}</text>
      <line x1={100 + (mean - error) * 36} y1="186" x2={100 + (mean + error) * 36} y2="186" stroke="#f43f5e" strokeWidth="6" />
      <text x="96" y="210" fill="#f43f5e" fontSize="12" fontWeight="900">uncertainty / error bar</text>
      <g transform="translate(540 70)">
        <rect width="160" height="176" rx="12" fill="rgba(15,23,42,.78)" stroke="#334155" />
        <text x="14" y="24" fill="#67e8f9" fontSize="12" fontWeight="900">repeated readings</text>
        {repeats.map((value, index) => <text key={index} x="18" y={48 + index * 18} fill={index === 2 ? "#facc15" : "#e2e8f0"} fontSize="12">{index + 1}. {value.toFixed(3)}</text>)}
        <text x="18" y="146" fill="#34d399" fontSize="12" fontWeight="900">mean {mean.toFixed(3)}</text>
        <text x="18" y="166" fill="#f43f5e" fontSize="12" fontWeight="900">% error {percent.toFixed(2)}%</text>
      </g>
      <text x="82" y="258" fill="#94a3b8" fontSize="13">Least count {leastCount.toFixed(3)}; absolute error |x - true| = {error.toFixed(3)}; significant figures depend on instrument precision.</text>
      <text x="82" y="280" fill="#94a3b8" fontSize="13">Illustrative measurement model; zero error ignored.</text>
    </g>
  );
}

function ComputationalWorkflowScene({ a, b, c }: { a: number; b: number; c: number }) {
  const step = clamp(a || 0.1, 0.01, 1);
  const iterations = Math.round(clamp(b || 12, 3, 40));
  const error = clamp(c || Math.exp(-iterations / 8) * step, 0.001, 1);
  const steps = ["problem", "model", "discretize", "solver", "converge", "error", "result"];
  return (
    <g>
      <text x="76" y="34" fill="#e2e8f0" fontSize="16" fontWeight="900">computational physics workflow</text>
      {steps.map((stepName, index) => (
        <g key={stepName} transform={`translate(${68 + index * 94} 72)`}>
          <rect width="78" height="54" rx="10" fill={index < 4 ? "rgba(34,211,238,.16)" : "rgba(250,204,21,.14)"} stroke={index < 4 ? "#22d3ee" : "#facc15"} />
          <text x="8" y="30" fill="#e2e8f0" fontSize="10" fontWeight="900">{stepName}</text>
          {index < steps.length - 1 && <line x1="78" y1="27" x2="94" y2="27" stroke="#64748b" strokeWidth="3" markerEnd="url(#arrow-default)" />}
        </g>
      ))}
      <g transform="translate(92 164)">
        <rect width="230" height="88" rx="12" fill="rgba(15,23,42,.78)" stroke="#334155" />
        {Array.from({ length: 8 }, (_, index) => <line key={index} x1={24 + index * 24} y1="16" x2={24 + index * 24} y2="72" stroke="#334155" />)}
        {Array.from({ length: 4 }, (_, index) => <line key={index} x1="20" y1={20 + index * 16} x2="210" y2={20 + index * 16} stroke="#334155" />)}
        <text x="28" y="78" fill="#67e8f9" fontSize="11" fontWeight="900">mesh / step size h = {step.toFixed(3)}</text>
      </g>
      <g transform="translate(374 160)">
        <rect width="270" height="96" rx="12" fill="rgba(15,23,42,.78)" stroke="#334155" />
        <line x1="24" y1="76" x2="238" y2="76" stroke="#64748b" /><line x1="24" y1="76" x2="24" y2="18" stroke="#64748b" />
        <path d={Array.from({ length: 50 }, (_, index) => {
          const x = 24 + index * 4.2;
          const y = 76 - 54 * Math.exp(-index / clamp(iterations / 3, 2, 12));
          return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        }).join(" ")} fill="none" stroke="#34d399" strokeWidth="4" />
        <text x="34" y="18" fill="#86efac" fontSize="12" fontWeight="900">convergence graph</text>
        <text x="34" y="92" fill="#94a3b8" fontSize="11">iteration {iterations}, error {error.toFixed(4)}</text>
      </g>
      <text x="82" y="282" fill="#94a3b8" fontSize="13">Numerical method demonstration: smaller steps can improve accuracy but increase computation; convergence is method-dependent.</text>
    </g>
  );
}

function visualizationTitle(experiment: ExperimentDefinition) {
  if (experiment.id === "advanced-quantum-operators") return "Operator and state-space model";
  if (experiment.category === "Optics") return "Ray and image model";
  if (experiment.category === "Electricity") return "Circuit response model";
  if (experiment.category === "Waves") return "Wave pattern model";
  if (experiment.category === "Thermodynamics") return "Thermal state model";
  if (experiment.category === "Fluid Mechanics") return "Fluid pressure model";
  if (experiment.category === "Energy") return "Energy source model";
  return `${experiment.category} model`;
}

function animationPlan(experiment: ExperimentDefinition) {
  if (experiment.id === "advanced-quantum-operators") return { title: "operator projection", cue: "The blue state vector is transformed by the operator, then projected onto eigenbasis bars; the barrier cue shows scattering/tunneling probability." };
  if (experiment.category === "Optics") return { title: "ray animation", cue: "Follow the moving photon and dashed ray path to see reflection, refraction, focus, or dispersion." };
  if (experiment.category === "Electricity" || experiment.category === "Electronics") return { title: "charge flow", cue: "Moving dots show conventional current; bulb glow and arrow speed show stronger electrical response." };
  if (experiment.category === "Waves") return { title: "wave phase", cue: "The traveling marker follows the crest pattern, making wavelength and amplitude easier to compare." };
  if (experiment.category === "Thermodynamics") return { title: "particle motion", cue: "Particle jitter and thermometer glow increase as thermal activity becomes more intense." };
  if (experiment.category === "Fluid Mechanics") return { title: "flow and pressure", cue: "Flow markers and pulsing water level show how depth, density, pressure, and speed are linked." };
  if (experiment.category === "Energy") return { title: "energy flow", cue: "Charge-flow and glow cues show useful output while the sliders compare efficiency and impact." };
  if (experiment.category === "Magnetism") return { title: "field pulse", cue: "Animated field lines show direction and strength changes around currents, magnets, and charges." };
  if (experiment.category === "Modern Physics") return { title: "quantum event", cue: "Animated emission marks when energy conditions allow electrons, photons, or nuclear change." };
  return { title: "motion cue", cue: "The moving object and pulsing vector show the changing force, velocity, or geometry." };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}
