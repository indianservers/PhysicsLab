import { useMemo, useState } from "react";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import { PremiumExperimentShell } from "./PremiumExperimentShell";
import { CinematicStage } from "./CinematicStage";
import { PhysicsHUD } from "./PhysicsHUD";
import { CauseEffectPanel } from "./CauseEffectPanel";
import { PredictionCard } from "./PredictionCard";
import { MisconceptionCard } from "./MisconceptionCard";
import { FormulaDerivationPanel } from "./FormulaDerivationPanel";
import { MeasurementProbe } from "./MeasurementProbe";
import { EnergyBarSystem } from "./EnergyBarSystem";
import { ReplayTimeline } from "./ReplayTimeline";
import { PresetStrip } from "./PresetStrip";
import { LabModeSwitcher } from "./LabModeSwitcher";
import { VariableInspector } from "./VariableInspector";
import type { ValidationClaimStatus } from "./validation";
import "./premiumMechanics.css";

type MechanicsId =
  | "circular-motion"
  | "elastic-collision"
  | "friction"
  | "hooke-s-law"
  | "inclined-plane"
  | "uniform-motion"
  | "newton-s-second-law"
  | "conservation-of-energy"
  | "simple-pendulum"
  | "projectile-motion";

export interface MechanicsControl {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export interface MechanicsPreset {
  id: "beginner-demo" | "misconception-demo" | "real-world-demo" | string;
  label: string;
  description: string;
  values: Record<string, number>;
}

export interface MechanicsLabConfig {
  id: MechanicsId;
  title: string;
  subtitle: string;
  formulae: string[];
  controls: Omit<MechanicsControl, "value">[];
  defaults: Record<string, number>;
  presets: MechanicsPreset[];
  prediction: string;
  misconception: string;
  correction: string;
  causeLabel: string;
  effectLabel: string;
  because: string;
  validationStatus: ValidationClaimStatus;
  benchmarkText: string[];
}

export interface MechanicsResult {
  outputs: { label: string; value: string; unit?: string }[];
  graph: { x: number; y: number }[];
  energyBars: { label: string; value: number; max: number; unit?: string }[];
  vectors: { label: string; magnitude: number; tone: "cyan" | "rose" | "amber" | "green" }[];
  observation: string;
}

export interface PremiumMechanicsLabProps {
  experiment: ExperimentDefinition;
  config: MechanicsLabConfig;
  mode: ExperimentMode;
  compute: (values: Record<string, number>) => MechanicsResult;
}

export function PremiumMechanicsLab({ experiment, config, mode, compute }: PremiumMechanicsLabProps) {
  const [values, setValues] = useState(config.defaults);
  const [activePreset, setActivePreset] = useState(config.presets[0]?.id);
  const [activeStep, setActiveStep] = useState("setup");
  const [showVectors, setShowVectors] = useState(true);
  const simple = mode === "Beginner";
  const advanced = mode === "Advanced" || mode === "Teacher";
  const result = useMemo(() => compute(values), [compute, values]);
  const controls = config.controls
    .filter((control, index) => !simple || index === 0)
    .map((control) => ({ ...control, value: values[control.id] ?? config.defaults[control.id] ?? control.min }));

  const updateValue = (id: string, value: number) => {
    setValues((current) => ({ ...current, [id]: value }));
  };

  const applyPreset = (preset: MechanicsPreset) => {
    setActivePreset(preset.id);
    setValues((current) => ({ ...current, ...preset.values }));
  };

  const resetLab = () => {
    setActivePreset(config.presets[0]?.id);
    setActiveStep("setup");
    setValues(config.defaults);
  };

  return (
    <PremiumExperimentShell
      experiment={experiment}
      domain="mechanics"
      mode={mode}
      title={config.title}
      subtitle={config.subtitle}
      validationStatus={config.validationStatus}
      formulaStatus={config.formulae[0]}
      stage={(
        <CinematicStage domain="mechanics" title={`${config.title} cinematic stage`}>
          <MechanicsScene id={config.id} values={values} result={result} showVectors={showVectors} />
        </CinematicStage>
      )}
      controls={(
        <section className="premium-shell-card mechanics-premium-controls" aria-label={`${config.title} controls`}>
          <div className="mechanics-control-head">
            <p className="premium-mini-label">Controls</p>
            <div className="premium-control-actions">
              <button type="button" aria-label={`Reset ${config.title} lab`} onClick={resetLab}>Reset</button>
              <button type="button" aria-pressed={showVectors} onClick={() => setShowVectors((value) => !value)}>
                {showVectors ? "Hide vectors" : "Show vectors"}
              </button>
            </div>
          </div>
          <div className="mechanics-control-list">
            {controls.map((control) => (
              <label key={control.id} className="mechanics-premium-control">
                <span>{control.label} ({control.unit || "unitless"})</span>
                <strong>{control.value.toFixed(control.step < 1 ? 2 : 0)} {control.unit}</strong>
                <input
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={control.value}
                  aria-label={`${control.label} in ${control.unit || "unitless"}`}
                  onChange={(event) => updateValue(control.id, Number(event.target.value))}
                />
              </label>
            ))}
          </div>
        </section>
      )}
      hud={<PhysicsHUD items={result.outputs.slice(0, 4)} title="Live mechanics readings" />}
      causeEffect={<CauseEffectPanel cause={config.causeLabel} effect={config.effectLabel} because={config.because} />}
      inspector={<VariableInspector items={controls.map((control) => ({ symbol: control.id, label: control.label, value: control.value.toFixed(control.step < 1 ? 2 : 0), unit: control.unit, validRange: `${control.min}-${control.max}` }))} />}
      replay={<ReplayTimeline activeStep={activeStep} onStep={setActiveStep} />}
      secondary={(
        <>
          <PresetStrip presets={config.presets} activePreset={activePreset} onPreset={(preset) => applyPreset(preset as MechanicsPreset)} />
          <PredictionCard prompt={config.prediction} hint={simple ? "Change only one control, then explain the observation aloud." : "Write a prediction before moving the sliders."} />
          <MisconceptionCard misconception={config.misconception} correction={config.correction} />
          <EnergyBarSystem bars={result.energyBars} title="Energy and conservation" />
          {advanced && (
            <FormulaDerivationPanel
              formula={config.formulae.join("  |  ")}
              steps={[
                { label: "Model", expression: config.formulae[0], explanation: "Use the stated ideal assumptions and SI units." },
                { label: "Benchmark", expression: config.benchmarkText[0] ?? "Benchmark pending", explanation: "Validated labels require executable benchmark cases." },
                { label: "Limit", expression: "School-level model", explanation: "Air drag, rolling losses, deformation, and non-ideal constraints are shown only when the lab explicitly includes them." },
              ]}
            />
          )}
          {mode === "Teacher" && (
            <section className="premium-shell-card">
              <p className="premium-mini-label">Teacher board prompt</p>
              <h3>Ask: which vector changed first, and which graph feature proves it?</h3>
              <p>Conclusion starter: When we changed the cause, the measured effect changed because {config.because.toLowerCase()}</p>
            </section>
          )}
        </>
      )}
      mobileDock={<LabModeSwitcher mode={mode} />}
    />
  );
}

function MechanicsScene({ id, values, result, showVectors }: { id: MechanicsId; values: Record<string, number>; result: MechanicsResult; showVectors: boolean }) {
  const graphPath = pointsToPath(result.graph, 520, 140);
  return (
    <div className={`mechanics-cinema mechanics-cinema-${id}`}>
      <svg viewBox="0 0 900 520" role="img" aria-label={`${id} premium mechanics visualization`}>
        <defs>
          <marker id={`arrow-${id}`} markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
            <path d="M0,0 L0,8 L11,4 z" fill="currentColor" />
          </marker>
          <linearGradient id={`track-${id}`} x1="0" x2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#164e63" />
          </linearGradient>
        </defs>
        <rect x="24" y="24" width="852" height="472" rx="28" fill="rgba(2,6,23,.42)" stroke="rgba(125,211,252,.28)" />
        {sceneArtwork(id, values, showVectors)}
        <g transform="translate(536 312)">
          <rect x="0" y="0" width="300" height="150" rx="18" fill="rgba(15,23,42,.78)" stroke="rgba(125,211,252,.28)" />
          <text x="18" y="28" fill="#67e8f9" fontWeight="900">Real-time graph</text>
          <line x1="34" y1="118" x2="270" y2="118" stroke="#94a3b8" />
          <line x1="34" y1="24" x2="34" y2="118" stroke="#94a3b8" />
          <path d={graphPath} transform="translate(34 24)" fill="none" stroke="#facc15" strokeWidth="4" />
          <circle cx="248" cy="54" r="7" fill="#22d3ee" />
          <text x="40" y="140" fill="#cbd5e1" fontSize="12">input</text>
          <text x="7" y="34" fill="#cbd5e1" fontSize="12">output</text>
        </g>
        <g transform="translate(52 332)">
          <rect x="0" y="0" width="228" height="130" rx="18" fill="rgba(15,23,42,.78)" stroke="rgba(125,211,252,.28)" />
          <text x="16" y="28" fill="#67e8f9" fontWeight="900">Free-body mini-panel</text>
          {result.vectors.slice(0, 4).map((vector, index) => (
            <g key={vector.label} transform={`translate(28 ${52 + index * 18})`}>
              <line x1="0" y1="0" x2={Math.min(118, Math.max(30, vector.magnitude * 8))} y2="0" className={`mechanics-vector mechanics-vector-${vector.tone}`} markerEnd={`url(#arrow-${id})`} />
              <text x="130" y="5" fill="#e2e8f0" fontSize="12">{vector.label}</text>
            </g>
          ))}
        </g>
      </svg>
      <MeasurementProbe label="Observation" value={result.observation} x={5} y={5} />
    </div>
  );
}

function sceneArtwork(id: MechanicsId, values: Record<string, number>, showVectors: boolean) {
  if (id === "circular-motion") return <CircularArtwork values={values} showVectors={showVectors} />;
  if (id === "elastic-collision") return <CollisionArtwork values={values} showVectors={showVectors} />;
  if (id === "friction") return <FrictionArtwork values={values} showVectors={showVectors} />;
  if (id === "hooke-s-law") return <HookeArtwork values={values} showVectors={showVectors} />;
  if (id === "inclined-plane") return <InclineArtwork values={values} showVectors={showVectors} />;
  if (id === "uniform-motion") return <UniformArtwork values={values} showVectors={showVectors} />;
  if (id === "newton-s-second-law") return <NewtonArtwork values={values} showVectors={showVectors} />;
  if (id === "conservation-of-energy") return <EnergyArtwork values={values} showVectors={showVectors} />;
  if (id === "simple-pendulum") return <PendulumArtwork values={values} showVectors={showVectors} />;
  return <ProjectileArtwork values={values} showVectors={showVectors} />;
}

function CircularArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const r = 70 + values.radius * 24;
  const angle = values.omega * 22;
  const x = 330 + r * Math.cos(angle * Math.PI / 180);
  const y = 210 + r * Math.sin(angle * Math.PI / 180);
  return (
    <g>
      <circle cx="330" cy="210" r={r} fill="none" stroke="#155e75" strokeWidth="18" opacity="0.36" />
      <circle cx="330" cy="210" r="8" fill="#facc15" />
      <line x1="330" y1="210" x2={x} y2={y} stroke="#facc15" strokeWidth="4" />
      <circle cx={x} cy={y} r={18 + values.mass * 2} fill="#22d3ee" className="premium-orbiting-body" />
      <path d={`M ${x} ${y} q 34 -38 80 -18`} stroke="#34d399" strokeWidth="5" fill="none" markerEnd="url(#arrow-circular-motion)" />
      {showVectors && <line x1={x} y1={y} x2="330" y2="210" stroke="#fb7185" strokeWidth="5" markerEnd="url(#arrow-circular-motion)" />}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">top-view rotating object</text>
      <text x="534" y="102" fill="#facc15" fontSize="16">omega dial: {values.omega.toFixed(1)} rad/s</text>
    </g>
  );
}

function CollisionArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const left = 230 + values.u1 * 14;
  const right = 548 + values.u2 * 14;
  return (
    <g>
      <line x1="100" y1="244" x2="760" y2="244" stroke="#64748b" strokeWidth="18" />
      <rect x={left} y="180" width={70 + values.m1 * 8} height="56" rx="10" fill="#38bdf8" />
      <rect x={right} y="180" width={70 + values.m2 * 8} height="56" rx="10" fill="#facc15" />
      {showVectors && <><line x1={left + 85} y1="168" x2={left + 165} y2="168" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#arrow-elastic-collision)" /><line x1={right} y1="168" x2={right + values.u2 * 18} y2="168" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-elastic-collision)" /></>}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">before and after collision track</text>
      <text x="354" y="294" fill="#cbd5e1">Momentum and kinetic energy meters compare before/after.</text>
    </g>
  );
}

function FrictionArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  return (
    <g>
      <rect x="92" y="246" width="640" height="34" rx="10" fill="url(#track-friction)" />
      {Array.from({ length: 24 }, (_, index) => <line key={index} x1={102 + index * 26} y1="280" x2={118 + index * 26} y2="256" stroke="#94a3b8" />)}
      <rect x="330" y="166" width="126" height="78" rx="14" fill="#facc15" />
      {showVectors && <><line x1="456" y1="204" x2={456 + values.appliedForce * 2} y2="204" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow-friction)" /><line x1="330" y1="224" x2={330 - values.mu * 80} y2="224" stroke="#fb7185" strokeWidth="6" markerEnd="url(#arrow-friction)" /><line x1="393" y1="166" x2="393" y2="92" stroke="#34d399" strokeWidth="5" markerEnd="url(#arrow-friction)" /><line x1="393" y1="244" x2="393" y2="310" stroke="#facc15" strokeWidth="5" markerEnd="url(#arrow-friction)" /></>}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">surface texture and friction threshold</text>
    </g>
  );
}

function HookeArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const end = 330 + values.x * 460;
  const coils = Array.from({ length: 12 }, (_, i) => `${150 + i * ((end - 150) / 12)},${206 + (i % 2 ? 28 : -28)}`).join(" ");
  return (
    <g>
      <line x1="100" y1="100" x2="100" y2="310" stroke="#94a3b8" strokeWidth="12" />
      <polyline points={`100,206 ${coils} ${end},206`} fill="none" stroke="#22d3ee" strokeWidth="7" />
      <rect x={end} y="168" width="76" height="76" rx="12" fill="#facc15" />
      <line x1="150" y1="288" x2={end} y2="288" stroke="#e2e8f0" strokeDasharray="8 8" />
      <text x={(150 + end) / 2 - 20} y="314" fill="#e2e8f0">x = {values.x.toFixed(2)} m</text>
      {showVectors && <line x1={end} y1="156" x2={end - Math.max(60, values.k * values.x * 3)} y2="156" stroke="#fb7185" strokeWidth="6" markerEnd="url(#arrow-hooke-s-law)" />}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">spring extension and restoring force</text>
    </g>
  );
}

function InclineArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const angle = values.angle;
  return (
    <g>
      <path d="M 110 294 L 720 294 L 720 124 Z" fill="rgba(250,204,21,.16)" stroke="#facc15" strokeWidth="6" />
      <g transform={`translate(430 214) rotate(${-angle})`}>
        <rect x="-48" y="-34" width="96" height="68" rx="12" fill="#22d3ee" />
        {showVectors && <line x1="0" y1="0" x2="135" y2="0" stroke="#fb7185" strokeWidth="6" markerEnd="url(#arrow-inclined-plane)" />}
      </g>
      {showVectors && <><line x1="430" y1="214" x2="430" y2="316" stroke="#facc15" strokeWidth="6" markerEnd="url(#arrow-inclined-plane)" /><line x1="430" y1="214" x2="475" y2="125" stroke="#34d399" strokeWidth="6" markerEnd="url(#arrow-inclined-plane)" /></>}
      <path d="M150 294 A70 70 0 0 1 218 274" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <text x="178" y="264" fill="#e2e8f0">{angle.toFixed(0)} deg</text>
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">weight resolved on a slope</text>
    </g>
  );
}

function UniformArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const x = 140 + (values.x0 + values.v * values.t) * 10;
  return (
    <g>
      <line x1="90" y1="260" x2="760" y2="260" stroke="#64748b" strokeWidth="14" />
      {Array.from({ length: 12 }, (_, i) => <g key={i}><line x1={120 + i * 52} y1="238" x2={120 + i * 52} y2="282" stroke="#94a3b8" /><text x={112 + i * 52} y="306" fill="#cbd5e1" fontSize="12">{i}s</text></g>)}
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={140 + (values.x0 + values.v * i) * 10} cy={230 - i * 8} r="6" fill="#22d3ee" opacity={0.24 + i * 0.1} />)}
      <rect x={Math.max(110, Math.min(710, x))} y="206" width="74" height="44" rx="9" fill="#38bdf8" />
      {showVectors && <line x1={x + 80} y1="202" x2={x + 80 + values.v * 15} y2="202" stroke="#34d399" strokeWidth="5" markerEnd="url(#arrow-uniform-motion)" />}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">equal distance markers per second</text>
    </g>
  );
}

function NewtonArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const net = values.force - values.friction;
  return (
    <g>
      <line x1="96" y1="260" x2="760" y2="260" stroke="#64748b" strokeWidth="16" />
      <rect x="350" y="182" width={80 + values.mass * 4} height={58 + values.mass * 2} rx="12" fill="#38bdf8" />
      {showVectors && <><line x1="450" y1="176" x2={450 + values.force * 2} y2="176" stroke="#22d3ee" strokeWidth="6" markerEnd="url(#arrow-newton-s-second-law)" /><line x1="350" y1="226" x2={350 - values.friction * 3} y2="226" stroke="#fb7185" strokeWidth="6" markerEnd="url(#arrow-newton-s-second-law)" /><line x1="450" y1="128" x2={450 + net * 2} y2="128" stroke="#facc15" strokeWidth="6" markerEnd="url(#arrow-newton-s-second-law)" /></>}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">net force drives acceleration</text>
      <text x="470" y="122" fill="#facc15">Fnet = {net.toFixed(1)} N</text>
    </g>
  );
}

function EnergyArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const y = 120 + (12 - values.height) * 12;
  return (
    <g>
      <path d="M 92 120 C 250 80, 350 350, 720 260" fill="none" stroke="#facc15" strokeWidth="18" strokeLinecap="round" />
      <circle cx="176" cy={y} r="22" fill="#22d3ee" />
      <line x1="90" y1="300" x2="90" y2="120" stroke="#e2e8f0" strokeWidth="3" />
      <text x="104" y="152" fill="#e2e8f0">h = {values.height.toFixed(1)} m</text>
      {showVectors && <line x1="176" y1={y} x2="245" y2={y + 48} stroke="#34d399" strokeWidth="6" markerEnd="url(#arrow-conservation-of-energy)" />}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">height becomes speed</text>
    </g>
  );
}

function PendulumArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const length = 110 + values.length * 80;
  const theta = values.angle * Math.PI / 180;
  const px = 420 + length * Math.sin(theta);
  const py = 104 + length * Math.cos(theta);
  return (
    <g>
      <line x1="250" y1="104" x2="590" y2="104" stroke="#94a3b8" strokeWidth="10" />
      <line x1="420" y1="104" x2={px} y2={py} stroke="#e2e8f0" strokeWidth="5" />
      <circle cx={px} cy={py} r={20 + values.mass * 2} fill="#22d3ee" />
      <path d="M340 330 Q420 378 500 330" fill="none" stroke="#22d3ee" strokeDasharray="8 8" />
      <path d="M420 154 A72 72 0 0 1 456 164" fill="none" stroke="#facc15" strokeWidth="4" />
      {showVectors && <line x1={px} y1={py} x2={px - 44} y2={py + 42} stroke="#fb7185" strokeWidth="5" markerEnd="url(#arrow-simple-pendulum)" />}
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">pendulum period timer</text>
    </g>
  );
}

function ProjectileArtwork({ values, showVectors }: { values: Record<string, number>; showVectors: boolean }) {
  const angle = values.angle * Math.PI / 180;
  const speed = values.speed;
  const pts = Array.from({ length: 28 }, (_, i) => {
    const t = i / 3.2;
    const x = 112 + speed * Math.cos(angle) * t * 3;
    const y = 326 - (speed * Math.sin(angle) * t - 0.5 * values.gravity * t * t) * 3;
    return `${x},${Math.min(330, y)}`;
  }).join(" ");
  return (
    <g>
      <line x1="80" y1="330" x2="780" y2="330" stroke="#64748b" strokeWidth="14" />
      <rect x="86" y="286" width="78" height="34" rx="8" fill="#f97316" transform={`rotate(${-values.angle} 125 303)`} />
      <polyline points={pts} fill="none" stroke="#22d3ee" strokeWidth="5" strokeDasharray="10 8" />
      {showVectors && <><line x1="132" y1="286" x2={132 + speed * Math.cos(angle) * 4} y2={286 - speed * Math.sin(angle) * 4} stroke="#34d399" strokeWidth="6" markerEnd="url(#arrow-projectile-motion)" /><line x1="132" y1="286" x2={132 + speed * Math.cos(angle) * 4} y2="286" stroke="#facc15" strokeWidth="4" markerEnd="url(#arrow-projectile-motion)" /></>}
      <circle cx="680" cy="308" r="22" fill="none" stroke="#fb7185" strokeWidth="5" />
      <text x="84" y="78" fill="#e2e8f0" fontSize="24" fontWeight="900">cannon trajectory and target challenge</text>
    </g>
  );
}

function pointsToPath(points: { x: number; y: number }[], width: number, height: number) {
  if (!points.length) return "";
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  return points.map((point, index) => {
    const x = ((point.x - minX) / Math.max(1e-9, maxX - minX)) * width;
    const y = height - ((point.y - minY) / Math.max(1e-9, maxY - minY)) * height;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}
