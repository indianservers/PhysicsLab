import { ExperimentDefinition } from "../types";
import { iconForExperiment, PhysicsIcon } from "../lib/icons";
import { makePrismModel } from "../lib/prism";

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
      </svg>
      <div className="grid content-start gap-2">
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
  if (["mirror-formula", "lens-formula", "glass-slab-refraction", "prism-dispersion", "reflection-plane-mirror", "shadows-eclipses", "multiple-reflection", "human-eye-defects", "total-internal-reflection", "optical-instruments"].includes(experiment.id)) return <OpticsScene id={experiment.id} a={a} b={b} c={c} />;
  if (["ohms-law", "series-parallel-resistance", "electric-power", "heating-effect-current", "kirchhoff-circuit", "capacitor-lab", "semiconductor-diode", "ac-lcr-resonance", "meter-bridge", "internal-resistance-cell", "ac-generator", "transformer-lab", "logic-gates", "sources-of-energy"].includes(experiment.id)) return <CircuitScene id={experiment.id} a={a} b={b} c={c} />;
  if (["wave-lab", "single-slit-diffraction", "sound-pitch-loudness", "echo-speed-sound", "young-double-slit", "em-spectrum", "chladni-plate", "shm-spring", "simple-pendulum", "sound-wave-anatomy", "polarization-lab"].includes(experiment.id)) return <WaveScene id={experiment.id} a={a} b={b} c={c} />;
  if (["heat-and-temperature", "heat-transfer", "gas-laws", "thermodynamic-process"].includes(experiment.id)) return <ThermalScene id={experiment.id} a={a} b={b} c={c} />;
  if (["force-and-pressure", "fluid-pressure", "buoyancy", "bernoulli-fluid-flow"].includes(experiment.id)) return <FluidScene id={experiment.id} a={a} b={b} c={c} />;
  if (["static-electricity", "electrostatic-field-potential", "lorentz-force", "emi-faraday", "magnetic-field-current", "electromagnet"].includes(experiment.id)) return <FieldScene id={experiment.id} a={a} b={b} c={c} />;
  if (["photoelectric-equation", "nuclear-decay", "de-broglie-wavelength", "bohr-model", "special-relativity-bridge"].includes(experiment.id)) return <ModernScene id={experiment.id} a={a} b={b} c={c} />;
  return <MechanicsScene id={experiment.id} a={a} b={b} c={c} />;
}

function MechanicsScene({ id, a, b, c }: { id: string; a: number; b: number; c: number }) {
  if (id === "newton-s-second-law" || id === "balanced-unbalanced-forces") return <FreeBodyScene id={id} a={a} b={b} c={c} />;
  if (id === "friction") return <FrictionScene a={a} b={b} c={c} />;
  if (id === "inclined-plane") return <InclineComponentsScene a={a} b={b} c={c} />;
  if (id === "conservation-of-energy" || id === "work-power") return <EnergyBarsScene id={id} a={a} b={b} c={c} />;
  if (id === "circular-motion") return <CircularForceScene a={a} b={b} c={c} />;
  if (id === "simple-pendulum" || id === "shm-spring") return <OscillationScene id={id} a={a} b={b} c={c} />;
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
  const amp = clamp(c * 45, 18, 95);
  return (
    <g>
      <line x1="100" y1="150" x2="680" y2="150" stroke="#475569" strokeWidth="3" />
      <line x1="380" y1="78" x2="380" y2="236" stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
      {isSpring ? (
        <path d={`M 120 150 ${Array.from({ length: 24 }, (_, i) => `L ${130 + i * 10} ${150 + (i % 2 ? -22 : 22)}`).join(" ")} L ${370 + amp} 150`} fill="none" stroke="#67e8f9" strokeWidth="4" />
      ) : (
        <g><line x1="380" y1="70" x2={380 + amp} y2="198" stroke="#e2e8f0" strokeWidth="3" /><circle cx={380 + amp} cy="198" r="24" fill="#facc15" /></g>
      )}
      <path d={`M ${380 - amp} 230 Q 380 260 ${380 + amp} 230`} fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">{isSpring ? "spring-mass SHM" : "simple pendulum small-angle SHM"}</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Amplitude is maximum displacement; period is one complete cycle.</text>
      <text x="408" y="143" fill="#34d399" fontSize="13" fontWeight="900">mean position</text>
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
  const focusX = mode === 1 ? 545 : mode === 2 ? 665 : 610 + clamp((a - b) * 18, -40, 40);
  const lensColor = mode === 1 ? "#a78bfa" : mode === 2 ? "#34d399" : "#67e8f9";
  return (
    <g>
      <ellipse cx="430" cy="150" rx="190" ry="96" fill="rgba(103,232,249,.12)" stroke="#67e8f9" strokeWidth="4" />
      <path d="M 590 72 Q 632 150 590 228" fill="none" stroke="#f43f5e" strokeWidth="6" />
      <ellipse cx="315" cy="150" rx="24" ry="72" fill="rgba(250,204,21,.25)" stroke="#facc15" strokeWidth="4" />
      {mode > 0 && <ellipse cx="230" cy="150" rx={mode === 1 ? 15 : 28} ry="74" fill="rgba(167,139,250,.2)" stroke={lensColor} strokeWidth="4" />}
      {[112, 150, 188].map((y) => (
        <line key={y} className="lab-anim-dash" x1="85" y1={y} x2="315" y2="150" stroke="#fde047" strokeWidth="3" />
      ))}
      <line className="lab-anim-dash-fast" x1="315" y1="150" x2={focusX} y2="150" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-optics)" />
      <circle cx={focusX} cy="150" r="8" fill={Math.abs(focusX - 590) < 20 ? "#34d399" : "#f43f5e"} className="lab-anim-glow" />
      <text x="575" y="62" fill="#f43f5e" fontSize="13" fontWeight="900">retina</text>
      <text x="84" y="44" fill="#e2e8f0" fontSize="16" fontWeight="900">{mode === 1 ? "myopia: concave correction" : mode === 2 ? "hypermetropia: convex correction" : "normal eye focus"}</text>
      <text x="84" y="268" fill="#94a3b8" fontSize="13">The correction lens shifts the focus back onto the retina.</text>
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
  if (id === "capacitor-lab") return <CapacitorScene a={a} b={b} c={c} />;
  if (id === "kirchhoff-circuit") return <KirchhoffScene a={a} b={b} c={c} />;
  if (id === "ac-generator") return <GeneratorScene a={a} b={b} c={c} />;
  if (id === "transformer-lab") return <TransformerScene a={a} b={b} c={c} />;
  if (id === "ac-lcr-resonance") return <LcrScene a={a} b={b} c={c} />;
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
  if (id === "buoyancy" || id === "density-float-sink") return <BuoyancyScene a={a} b={b} c={c} />;
  if (id === "bernoulli-fluid-flow") return <BernoulliScene a={a} b={b} c={c} />;
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
  return (
    <g>
      <rect x="330" y="62" width="60" height="180" rx="12" fill="#334155" />
      {Array.from({ length: turns }, (_, i) => <ellipse key={i} cx="360" cy={82 + i * (150 / Math.max(1, turns - 1))} rx="88" ry="22" fill="none" stroke="#a78bfa" strokeWidth="3" />)}
      {[52, 90, 128].map((r) => <ellipse key={r} cx="360" cy="150" rx={r * 2} ry={r} fill="none" stroke="rgba(34,211,238,.28)" strokeWidth="2" />)}
      <line className="lab-anim-dash-fast" x1="360" y1="248" x2="360" y2="52" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-modern)" />
      <text x="82" y="42" fill="#e2e8f0" fontSize="16" fontWeight="900">magnetic field around current</text>
      <text x="82" y="70" fill="#94a3b8" fontSize="13">Right-hand rule: thumb is current, curled fingers show field direction.</text>
      <text x="470" y="104" fill="#a78bfa" fontSize="13" fontWeight="900">NI strength {(a * b * Math.max(1, c)).toFixed(0)}</text>
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
  if (id === "photoelectric-equation") return <PhotoelectricScene a={a} b={b} c={c} />;
  if (id === "special-relativity-bridge") return <RelativityScene a={a} b={b} c={c} />;
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

function visualizationTitle(experiment: ExperimentDefinition) {
  if (experiment.category === "Optics") return "Ray and image model";
  if (experiment.category === "Electricity") return "Circuit response model";
  if (experiment.category === "Waves") return "Wave pattern model";
  if (experiment.category === "Thermodynamics") return "Thermal state model";
  if (experiment.category === "Fluid Mechanics") return "Fluid pressure model";
  if (experiment.category === "Energy") return "Energy source model";
  return `${experiment.category} model`;
}

function animationPlan(experiment: ExperimentDefinition) {
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
