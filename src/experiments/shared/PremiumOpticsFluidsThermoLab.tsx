import { useMemo, useState } from "react";
import type { ExperimentDefinition } from "../../types";
import { AngleArc } from "./AngleArc";
import { BuoyancyForceOverlay } from "./BuoyancyForceOverlay";
import { CauseEffectPanel } from "./CauseEffectPanel";
import { FluidTank } from "./FluidTank";
import { FocalPointOverlay } from "./FocalPointOverlay";
import { GasParticleBox } from "./GasParticleBox";
import { LabModeSwitcher } from "./LabModeSwitcher";
import { MisconceptionCard } from "./MisconceptionCard";
import { OpticalScreen } from "./OpticalScreen";
import { PhysicsHUD } from "./PhysicsHUD";
import { PredictionCard } from "./PredictionCard";
import { PremiumExperimentShell } from "./PremiumExperimentShell";
import { PresetStrip } from "./PresetStrip";
import { PressureGauge } from "./PressureGauge";
import { PressureProbe } from "./PressureProbe";
import { RayDiagram } from "./RayDiagram";
import { ReplayTimeline } from "./ReplayTimeline";
import { SpectrumBeam } from "./SpectrumBeam";
import { StreamlineLayer } from "./StreamlineLayer";
import type { ExperimentMode } from "./experimentModes";
import type { OftPreset, PremiumOftConfig, PremiumOftId } from "./opticsFluidsThermoPremiumLibrary";
import { computePremiumOft } from "./opticsFluidsThermoPremiumLibrary";
import "./premiumOpticsFluidsThermo.css";

export function PremiumOpticsFluidsThermoLab({ experiment, config, mode }: { experiment: ExperimentDefinition; config: PremiumOftConfig; mode: ExperimentMode }) {
  const [values, setValues] = useState(config.defaults);
  const [activePreset, setActivePreset] = useState(config.presets[0]?.id);
  const [activeStep, setActiveStep] = useState("setup");
  const simple = mode === "Beginner";
  const result = useMemo(() => computePremiumOft(config.id, values), [config.id, values]);
  const controls = config.controls.filter((_, index) => !simple || index === 0);
  const applyPreset = (preset: OftPreset) => {
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
      domain={config.domain}
      mode={mode}
      title={config.title}
      subtitle={config.subtitle}
      validationStatus={config.modelStatus}
      formulaStatus={simple ? "visual first" : config.formulae[0]}
      stage={<PremiumOftStage id={config.id} values={values} result={result} />}
      controls={(
        <section className="premium-oft-controls" aria-label={`${config.title} controls`}>
          <div className="premium-control-head">
            <p className="premium-mini-label">Lab controls</p>
            <button type="button" aria-label={`Reset ${config.title} lab`} onClick={resetLab}>Reset</button>
          </div>
          <span className="premium-oft-status">{result.warning}</span>
          {controls.map((control) => (
            <label className="premium-oft-control" key={control.id}>
              <span>{control.label} ({control.unit || "unitless"})</span>
              <strong>{(values[control.id] ?? 0).toFixed(control.step < 1 ? 2 : 0)} {control.unit}</strong>
              <input type="range" min={control.min} max={control.max} step={control.step} value={values[control.id] ?? control.min} aria-label={`${control.label} in ${control.unit || "unitless"}`} onChange={(event) => setValues((current) => ({ ...current, [control.id]: Number(event.target.value) }))} />
            </label>
          ))}
        </section>
      )}
      hud={<PhysicsHUD items={result.outputs} title="Live measurements" />}
      causeEffect={<CauseEffectPanel cause={result.cause} effect={result.effect} because={result.because} />}
      replay={<ReplayTimeline activeStep={activeStep} onStep={setActiveStep} />}
      secondary={(
        <>
          <PresetStrip presets={config.presets} activePreset={activePreset} onPreset={(preset) => applyPreset(preset as OftPreset)} />
          <PredictionCard prompt={config.prediction} hint="Predict the ray, gauge, or focus change before adjusting the slider." />
          <MisconceptionCard misconception={config.misconception} correction={config.correction} />
          <section className="premium-shell-card">
            <p className="premium-mini-label">Formula, benchmarks, limits</p>
            <h3>{config.formulae.join(" | ")}</h3>
            {config.benchmarkText.map((item) => <p key={item}>{item}</p>)}
            {mode === "Teacher" && <p><strong>Teacher analogy:</strong> {config.teacherAnalogy}</p>}
          </section>
        </>
      )}
      mobileDock={<LabModeSwitcher mode={mode} />}
    />
  );
}

function PremiumOftStage({ id, values, result }: { id: PremiumOftId; values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  return (
    <RayDiagram title={`${id} premium scene`}>
      {id === "reflection-plane-mirror" && <MirrorScene values={values} result={result} />}
      {id === "lens-formula" && <LensScene values={values} result={result} />}
      {id === "prism-dispersion" && <PrismScene values={values} result={result} />}
      {id === "total-internal-reflection" && <TirScene values={values} result={result} />}
      {id === "human-eye-defects" && <EyeScene values={values} result={result} />}
      {id === "buoyancy" && <BuoyancyScene values={values} result={result} />}
      {id === "bernoulli-fluid-flow" && <BernoulliScene values={values} result={result} />}
      {id === "gas-laws" && <GasScene values={values} result={result} />}
    </RayDiagram>
  );
}

function rayEnd(cx: number, cy: number, length: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + Math.cos(rad) * length, y: cy + Math.sin(rad) * length };
}

function MirrorScene({ values }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  const p = rayEnd(420, 250, 210, 180 + values.angle);
  const q = rayEnd(420, 250, 210, -values.angle);
  return (
    <g>
      <line x1="420" y1="70" x2="420" y2="430" stroke="#e0f2fe" strokeWidth="8" />
      <line x1="420" y1="70" x2="420" y2="430" stroke="#0f172a" strokeWidth="2" strokeDasharray="10 10" />
      <line x1="420" y1="250" x2="690" y2="250" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 8" />
      <line x1={p.x} y1={p.y} x2="420" y2="250" stroke="#facc15" strokeWidth="5" markerEnd="url(#ray-arrow)" />
      <line x1="420" y1="250" x2={q.x} y2={q.y} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#ray-arrow)" />
      <AngleArc cx={420} cy={250} startDeg={180} endDeg={180 + values.angle} label={`i=${values.angle.toFixed(0)} deg`} />
      <AngleArc cx={420} cy={250} startDeg={-values.angle} endDeg={0} label={`r=${values.angle.toFixed(0)} deg`} />
      <circle cx={320} cy="330" r="20" fill="#f97316" /><circle cx={520} cy="330" r="20" fill="none" stroke="#f97316" strokeDasharray="7 6" />
      <text x="286" y="368" fill="#fed7aa" fontWeight="900">object</text><text x="492" y="368" fill="#fed7aa" fontWeight="900">virtual image</text>
    </g>
  );
}

function LensScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  const uPx = Math.min(300, values.objectDistance * 4);
  const v = Number(result.raw.v);
  const imageX = Number.isFinite(v) ? 450 + Math.max(-320, Math.min(330, v * 4)) : 800;
  return (
    <g>
      <FocalPointOverlay centerX={450} y={260} focalPx={values.focalLength * 4} />
      <ellipse cx="450" cy="260" rx="30" ry="170" fill="rgba(125,211,252,.18)" stroke="#67e8f9" strokeWidth="5" />
      <line x1={450 - uPx} y1="260" x2={450 - uPx} y2="150" stroke="#fb923c" strokeWidth="7" markerEnd="url(#ray-arrow)" />
      <line x1={450 - uPx} y1="150" x2="450" y2="150" stroke="#facc15" strokeWidth="4" />
      <line x1="450" y1="150" x2={imageX} y2="320" stroke="#facc15" strokeWidth="4" markerEnd="url(#ray-arrow)" />
      <line x1={450 - uPx} y1="150" x2="450" y2="260" stroke="#22d3ee" strokeWidth="4" />
      <line x1="450" y1="260" x2={imageX} y2="320" stroke="#22d3ee" strokeWidth="4" markerEnd="url(#ray-arrow)" />
      <OpticalScreen x={735} y={120} label="screen" />
      <line x1={imageX} y1="260" x2={imageX} y2="320" stroke="#a78bfa" strokeWidth="6" />
      <text x="92" y="88" fill="#fde68a" fontWeight="900">sign convention shown: classroom magnitude model</text>
    </g>
  );
}

function PrismScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  return (
    <g>
      <line x1="90" y1="250" x2="315" y2="250" stroke="#fff7ed" strokeWidth="8" markerEnd="url(#ray-arrow)" />
      <polygon points="330,120 330,390 560,260" fill="rgba(125,211,252,.14)" stroke="#bae6fd" strokeWidth="5" />
      <line x1="326" y1="250" x2="400" y2="188" stroke="#94a3b8" strokeDasharray="8 8" strokeWidth="3" />
      <SpectrumBeam x1={538} y1={260} spread={80 + values.dispersion * 80} />
      <OpticalScreen x={820} y={118} label="spectrum screen" />
      <text x="112" y="104" fill="#fde68a" fontWeight="900">deviation approx {Number(result.raw.dev).toFixed(1)} deg</text>
    </g>
  );
}

function TirScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  const tir = Number(result.raw.tir) === 1;
  return (
    <g>
      <rect x="80" y="80" width="740" height="180" fill="rgba(14,165,233,.18)" />
      <rect x="80" y="260" width="740" height="180" fill="rgba(251,191,36,.1)" />
      <line x1="80" y1="260" x2="820" y2="260" stroke="#e0f2fe" strokeWidth="5" />
      <line x1="450" y1="120" x2="450" y2="400" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 8" />
      <line x1="270" y1="390" x2="450" y2="260" stroke="#facc15" strokeWidth="5" markerEnd="url(#ray-arrow)" />
      <line x1="450" y1="260" x2={tir ? 650 : 610} y2={tir ? 150 : 310} stroke={tir ? "#22d3ee" : "#a78bfa"} strokeWidth="5" markerEnd="url(#ray-arrow)" />
      {!tir && <line x1="450" y1="260" x2="610" y2="330" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#ray-arrow)" />}
      <AngleArc cx={450} cy={260} startDeg={90} endDeg={90 + values.angle} label={`i=${values.angle.toFixed(0)} deg`} />
      <text x="104" y="112" fill="#e0f2fe" fontWeight="900">n2={values.n2.toFixed(2)}</text><text x="104" y="424" fill="#fde68a" fontWeight="900">n1={values.n1.toFixed(2)}</text>
      <text x="548" y="94" fill="#fde68a" fontWeight="900">{tir ? "reflected-only: TIR" : "refraction visible"}</text>
    </g>
  );
}

function EyeScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  const defect = String(result.raw.defect);
  const focusX = defect === "myopia" ? 575 : defect === "hypermetropia" ? 735 : 650;
  return (
    <g>
      <ellipse cx="520" cy="260" rx="230" ry="145" fill="rgba(125,211,252,.12)" stroke="#bfdbfe" strokeWidth="5" />
      <path d="M680 150 C742 210 742 310 680 370" fill="none" stroke="#f97316" strokeWidth="8" />
      <ellipse cx="360" cy="260" rx="28" ry="74" fill="rgba(34,211,238,.25)" stroke="#67e8f9" strokeWidth="4" />
      <line x1="90" y1="210" x2="360" y2="245" stroke="#facc15" strokeWidth="4" markerEnd="url(#ray-arrow)" />
      <line x1="90" y1="310" x2="360" y2="275" stroke="#facc15" strokeWidth="4" markerEnd="url(#ray-arrow)" />
      <line x1="360" y1="245" x2={focusX} y2="260" stroke="#22d3ee" strokeWidth="4" />
      <line x1="360" y1="275" x2={focusX} y2="260" stroke="#22d3ee" strokeWidth="4" />
      <circle cx={focusX} cy="260" r="9" fill={Number(result.raw.correct) ? "#22c55e" : "#ef4444"} />
      <text x="578" y="414" fill="#fde68a" fontWeight="900">retina; focus {defect}</text>
    </g>
  );
}

function BuoyancyScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  const y = 220 + Number(result.raw.fraction) * 90;
  return (
    <g>
      <FluidTank waterLevel={250} label="buoyancy tank">
        <rect x="270" y={y} width="95" height="95" rx="16" fill="#f97316" stroke="#fed7aa" strokeWidth="5" />
        <BuoyancyForceOverlay x={318} y={y + 48} up={80 + Number(result.raw.fraction) * 60} down={100} />
      </FluidTank>
      <PressureProbe x={700} y={260} value={Number(result.raw.fb)} unit="N" label="upthrust" />
      <text x="600" y="390" fill="#fde68a" fontWeight="900">density decides float/sink, not mass alone</text>
    </g>
  );
}

function BernoulliScene({ result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  return (
    <g>
      <path d="M90 190 H320 C370 190 370 310 430 310 H810 V390 H430 C370 390 370 270 320 270 H90 Z" fill="rgba(14,165,233,.22)" stroke="#93c5fd" strokeWidth="5" />
      <StreamlineLayer speed={result.strength * 6} narrow />
      <PressureProbe x={220} y={110} value={Number(result.raw.pWide)} label="wide pressure" />
      <PressureProbe x={560} y={110} value={Number(result.raw.pNarrow)} label="narrow pressure" />
      <text x="278" y="450" fill="#fde68a" fontWeight="900">narrow throat: higher speed, lower static pressure</text>
    </g>
  );
}

function GasScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumOft> }) {
  return (
    <g>
      <GasParticleBox volume={values.volume} temperature={values.temperature} count={48} />
      <PressureGauge x={740} y={270} value={Number(result.raw.pressure)} max={25000} label="pressure Pa" />
      <rect x="118" y="414" width="320" height="36" rx="18" fill="rgba(251,191,36,.18)" stroke="#facc15" />
      <text x="136" y="438" fill="#fde68a" fontWeight="900">Kelvin temperature only in PV = nRT</text>
    </g>
  );
}
