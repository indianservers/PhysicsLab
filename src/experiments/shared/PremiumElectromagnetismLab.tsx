import { useMemo, useState } from "react";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import { CircuitBoard } from "./CircuitBoard";
import { ChargeFlowLayer } from "./ChargeFlowLayer";
import { CompassNeedleGrid } from "./CompassNeedleGrid";
import { FieldLineLayer } from "./FieldLineLayer";
import { FluxLoopVisualizer } from "./FluxLoopVisualizer";
import { LabModeSwitcher } from "./LabModeSwitcher";
import { MeterGauge } from "./MeterGauge";
import { MisconceptionCard } from "./MisconceptionCard";
import { PhysicsHUD } from "./PhysicsHUD";
import { PredictionCard } from "./PredictionCard";
import { PremiumExperimentShell } from "./PremiumExperimentShell";
import { PresetStrip } from "./PresetStrip";
import { ReplayTimeline } from "./ReplayTimeline";
import { CauseEffectPanel } from "./CauseEffectPanel";
import { SwitchControl } from "./SwitchControl";
import type { EmPreset, PremiumEmConfig, PremiumEmId } from "./electromagnetismPremiumLibrary";
import { computePremiumEm } from "./electromagnetismPremiumLibrary";
import "./premiumElectromagnetism.css";

export function PremiumElectromagnetismLab({ experiment, config, mode }: { experiment: ExperimentDefinition; config: PremiumEmConfig; mode: ExperimentMode }) {
  const [values, setValues] = useState(config.defaults);
  const [activePreset, setActivePreset] = useState(config.presets[0]?.id);
  const [activeStep, setActiveStep] = useState("setup");
  const simple = mode === "Beginner";
  const result = useMemo(() => computePremiumEm(config.id, values), [config.id, values]);
  const controls = config.controls.filter((_, index) => !simple || index === 0);
  const applyPreset = (preset: EmPreset) => {
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
      stage={<PremiumEmStage id={config.id} values={values} result={result} />}
      controls={(
        <section className="premium-em-controls" aria-label={`${config.title} controls`}>
          <div className="premium-control-head">
            <p className="premium-mini-label">Electricity and magnetism controls</p>
            <button type="button" aria-label={`Reset ${config.title} lab`} onClick={resetLab}>Reset</button>
          </div>
          <span className="premium-em-status">{result.warning}</span>
          {controls.map((control) => (
            <label className="premium-em-control" key={control.id}>
              <span>{control.label} ({control.unit || "unitless"})</span>
              <strong>{(values[control.id] ?? 0).toFixed(control.step < 1 ? 2 : 0)} {control.unit}</strong>
              <input type="range" min={control.min} max={control.max} step={control.step} value={values[control.id] ?? control.min} aria-label={`${control.label} in ${control.unit || "unitless"}`} onChange={(event) => setValues((current) => ({ ...current, [control.id]: Number(event.target.value) }))} />
            </label>
          ))}
        </section>
      )}
      hud={<PhysicsHUD items={result.outputs} title="Live meter readings" />}
      causeEffect={<CauseEffectPanel cause={result.cause} effect={result.effect} because={result.because} />}
      replay={<ReplayTimeline activeStep={activeStep} onStep={setActiveStep} />}
      secondary={(
        <>
          <PresetStrip presets={config.presets} activePreset={activePreset} onPreset={(preset) => applyPreset(preset as EmPreset)} />
          <PredictionCard prompt={config.prediction} hint="Predict the meter or field change before moving the slider." />
          <MisconceptionCard misconception={config.misconception} correction={config.correction} />
          <section className="premium-shell-card">
            <p className="premium-mini-label">Benchmarks and model notes</p>
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

function PremiumEmStage({ id, values, result }: { id: PremiumEmId; values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <CircuitBoard title={`${id} premium E&M scene`} glow={result.glow}>
      {id === "ohms-law" && <OhmsScene values={values} result={result} />}
      {id === "series-parallel-resistance" && <SeriesParallelScene values={values} result={result} />}
      {id === "emi-faraday" && <FaradayScene values={values} result={result} />}
      {id === "ac-generator" && <GeneratorScene values={values} result={result} />}
      {id === "transformer-lab" && <TransformerScene values={values} result={result} />}
      {id === "electromagnet" && <ElectromagnetScene values={values} result={result} />}
      {id === "magnetic-field-current" && <MagneticFieldCurrentScene values={values} result={result} />}
    </CircuitBoard>
  );
}

function wirePath() {
  return "M120 270H250V150H650V270H760";
}

function OhmsScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <g>
      <path d={wirePath()} fill="none" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" filter="url(#wire-glow)" />
      <ChargeFlowLayer path={wirePath()} speed={result.glow * 10} />
      <rect x="404" y="124" width="104" height="52" rx="10" fill="#f97316" stroke="#fed7aa" strokeWidth="4" />
      <text x="456" y="156" textAnchor="middle" fill="#111827" fontWeight="900">R {values.resistance.toFixed(0)} ohm</text>
      <rect x="110" y="230" width="54" height="80" rx="8" fill="#0f172a" stroke="#fde68a" strokeWidth="4" />
      <text x="137" y="222" textAnchor="middle" fill="#fde68a" fontWeight="900">battery {values.voltage.toFixed(1)} V</text>
      <MeterGauge x={230} y={395} label="A" value={Number(result.raw.current)} unit="A" max={8} />
      <MeterGauge x={670} y={395} label="V" value={values.voltage} unit="V" max={24} />
      <path d="M120 80H360" stroke="#facc15" strokeWidth="4" /><text x="122" y="66" fill="#fde68a" fontWeight="900">V-I graph: slope is R only for V vs I</text>
    </g>
  );
}

function SeriesParallelScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  const parallel = values.mode >= 0.5;
  return (
    <g>
      <path d={parallel ? "M120 270H260M260 270V160H620V270M260 270V380H620V270M620 270H760" : "M120 270H300H430H560H760"} fill="none" stroke="#22d3ee" strokeWidth="10" strokeLinecap="round" filter="url(#wire-glow)" />
      <ChargeFlowLayer speed={result.glow * 10} />
      <rect x="310" y={parallel ? 134 : 244} width="96" height="52" rx="10" fill="#fb923c" stroke="#ffedd5" strokeWidth="4" />
      <text x="358" y={parallel ? 166 : 276} textAnchor="middle" fill="#111827" fontWeight="900">R1 {values.r1.toFixed(0)}</text>
      <rect x="484" y={parallel ? 354 : 244} width="96" height="52" rx="10" fill="#a78bfa" stroke="#ede9fe" strokeWidth="4" />
      <text x="532" y={parallel ? 386 : 276} textAnchor="middle" fill="#111827" fontWeight="900">R2 {values.r2.toFixed(0)}</text>
      <SwitchControl x={138} y={198} closed={parallel} label={parallel ? "parallel mode" : "series mode"} />
      <MeterGauge x={690} y={130} label="Req" value={Number(result.raw.req)} unit="ohm" max={80} />
      <text x="70" y="455" fill="#fde68a" fontWeight="900">{parallel ? "parallel: total R is less than smallest branch" : "series: resistances add in one path"}</text>
    </g>
  );
}

function FaradayScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <g>
      <FluxLoopVisualizer x={430} y={100} turns={values.turns / 28} flux={result.strength} label="changing flux through coil" />
      <rect x={160 + values.speed * 18} y="188" width="126" height="74" rx="14" fill="#ef4444" stroke="#fecaca" strokeWidth="4" />
      <text x={223 + values.speed * 18} y="232" textAnchor="middle" fill="#fff7ed" fontWeight="900">moving magnet</text>
      <line x1="170" y1="292" x2={250 + values.speed * 20} y2="292" stroke="#facc15" strokeWidth="5" markerEnd="url(#em-arrow)" />
      <MeterGauge x={700} y={390} label="G" value={Math.abs(Number(result.raw.emf))} unit="V" max={20} />
      <text x="92" y="80" fill="#fde68a" fontWeight="900">induced current: {String(result.raw.direction)}</text>
    </g>
  );
}

function GeneratorScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <g>
      <rect x="120" y="110" width="90" height="260" rx="16" fill="#1d4ed8" /><text x="165" y="96" textAnchor="middle" fill="#bfdbfe" fontWeight="900">N pole</text>
      <rect x="690" y="110" width="90" height="260" rx="16" fill="#dc2626" /><text x="735" y="96" textAnchor="middle" fill="#fecaca" fontWeight="900">S pole</text>
      <line x1="218" y1="160" x2="680" y2="160" stroke="#60a5fa" strokeWidth="4" markerEnd="url(#em-arrow)" />
      <line x1="218" y1="240" x2="680" y2="240" stroke="#60a5fa" strokeWidth="4" markerEnd="url(#em-arrow)" />
      <g transform={`rotate(${values.omega * 2} 450 240)`}>
        <rect x="374" y="174" width="152" height="132" fill="none" stroke="#facc15" strokeWidth="8" rx="12" />
        <line x1="450" y1="174" x2="450" y2="112" stroke="#facc15" strokeWidth="5" />
        <line x1="450" y1="306" x2="450" y2="370" stroke="#facc15" strokeWidth="5" />
      </g>
      <path d="M90 430 C170 370 250 490 330 430 S490 370 570 430 S730 490 810 430" fill="none" stroke="#22d3ee" strokeWidth="5" />
      <text x="110" y="468" fill="#e0f2fe" fontWeight="900">live sine emf, peak {Number(result.raw.peak).toFixed(1)} V</text>
      <MeterGauge x={760} y={430} label="Peak" value={Number(result.raw.peak)} unit="V" max={160} />
    </g>
  );
}

function TransformerScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  const active = Number(result.raw.active) === 1;
  return (
    <g>
      <rect x="310" y="102" width="280" height="300" rx="26" fill="rgba(148,163,184,.16)" stroke="#94a3b8" strokeWidth="12" />
      <FluxLoopVisualizer x={344} y={120} turns={6} flux={active ? result.strength : 0.08} label={active ? "AC linked flux" : "DC: no changing flux"} />
      <text x="210" y="250" textAnchor="middle" fill="#e0f2fe" fontWeight="900">Primary {values.np.toFixed(0)} turns</text>
      <text x="690" y="250" textAnchor="middle" fill="#e0f2fe" fontWeight="900">Secondary {values.ns.toFixed(0)} turns</text>
      <MeterGauge x={190} y={390} label="Vp" value={values.vp} unit="V" max={240} />
      <MeterGauge x={700} y={390} label="Vs" value={Number(result.raw.vs)} unit="V" max={300} />
      <text x="330" y="74" fill="#fde68a" fontWeight="900">{active ? "AC mode: transformer active" : "DC warning: no transformer action"}</text>
    </g>
  );
}

function ElectromagnetScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <g>
      <FieldLineLayer cx={455} cy={250} rings={7} strength={result.strength} label="electromagnet field lines" />
      <rect x="286" y="208" width="330" height="84" rx="34" fill="#64748b" stroke="#e2e8f0" strokeWidth="4" />
      {Array.from({ length: 9 }, (_, index) => <ellipse key={index} cx={320 + index * 34} cy="250" rx="22" ry="62" fill="none" stroke="#facc15" strokeWidth="4" />)}
      <CompassNeedleGrid x={90} y={105} reverse={values.current < 0} />
      <text x="315" y="195" fill="#fde68a" fontWeight="900">N pole: {String(result.raw.polarity)}</text>
      <MeterGauge x={730} y={390} label="Strength" value={Number(result.raw.strength) / 1000} unit="k" max={4} />
    </g>
  );
}

function MagneticFieldCurrentScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumEm> }) {
  return (
    <g>
      <FieldLineLayer cx={450} cy={250} rings={7} strength={result.strength} label={values.mode >= 0.5 ? "coil field lines" : "circular field around wire"} />
      <line x1="450" y1="80" x2="450" y2="420" stroke="#facc15" strokeWidth="14" strokeLinecap="round" />
      <text x="470" y="96" fill="#fde68a" fontWeight="900">{values.current >= 0 ? "current out/up" : "current reversed"}</text>
      <CompassNeedleGrid x={80} y={120} reverse={values.current < 0} />
      <MeterGauge x={730} y={390} label="B" value={Number(result.raw.field) * 1e6} unit="uT" max={200} />
      <text x="548" y="132" fill="#e0f2fe" fontWeight="900">right-hand rule overlay</text>
    </g>
  );
}
