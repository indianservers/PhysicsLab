import { useMemo, useState } from "react";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import { PremiumExperimentShell } from "./PremiumExperimentShell";
import { WaveCanvas } from "./WaveCanvas";
import { WavefrontLayer } from "./WavefrontLayer";
import { InterferenceMap } from "./InterferenceMap";
import { DetectorProbe } from "./DetectorProbe";
import { AmplitudeGraph } from "./AmplitudeGraph";
import { PhysicsHUD } from "./PhysicsHUD";
import { CauseEffectPanel } from "./CauseEffectPanel";
import { PredictionCard } from "./PredictionCard";
import { MisconceptionCard } from "./MisconceptionCard";
import { ReplayTimeline } from "./ReplayTimeline";
import { PresetStrip } from "./PresetStrip";
import { FormulaDerivationPanel } from "./FormulaDerivationPanel";
import { LabModeSwitcher } from "./LabModeSwitcher";
import type { PremiumWaveConfig, PremiumWaveId, WavePreset } from "./wavesPremiumLibrary";
import { computePremiumWave } from "./wavesPremiumLibrary";
import "./premiumWaves.css";

export function PremiumWaveLab({ experiment, config, mode }: { experiment: ExperimentDefinition; config: PremiumWaveConfig; mode: ExperimentMode }) {
  const [values, setValues] = useState(config.defaults);
  const [activePreset, setActivePreset] = useState(config.presets[0]?.id);
  const [activeStep, setActiveStep] = useState("setup");
  const simple = mode === "Beginner";
  const advanced = mode === "Advanced" || mode === "Teacher";
  const result = useMemo(() => computePremiumWave(config.id, values), [config.id, values]);
  const controls = config.controls.filter((control, index) => !simple || index === 0);
  const applyPreset = (preset: WavePreset) => {
    setActivePreset(preset.id);
    setValues((current) => ({ ...current, ...preset.values }));
  };

  return (
    <PremiumExperimentShell
      experiment={experiment}
      domain="waves"
      mode={mode}
      title={config.title}
      subtitle={config.subtitle}
      validationStatus={config.modelStatus}
      formulaStatus={simple ? "visual first" : config.formulae[0]}
      stage={<PremiumWaveStage id={config.id} values={values} result={result} />}
      controls={(
        <section className="premium-wave-controls" aria-label={`${config.title} controls`}>
          <p className="premium-mini-label">Wave controls</p>
          <span className="premium-wave-status">{config.modelStatus}</span>
          {controls.map((control) => (
            <label className="premium-wave-control" key={control.id}>
              <span>{control.label} ({control.unit || "unitless"})</span>
              <strong>{(values[control.id] ?? 0).toFixed(control.step < 1 ? 2 : 0)} {control.unit}</strong>
              <input type="range" min={control.min} max={control.max} step={control.step} value={values[control.id] ?? control.min} aria-label={`${control.label} in ${control.unit || "unitless"}`} onChange={(event) => setValues((current) => ({ ...current, [control.id]: Number(event.target.value) }))} />
            </label>
          ))}
        </section>
      )}
      hud={<PhysicsHUD items={result.outputs} title="Live wave readings" />}
      causeEffect={<CauseEffectPanel cause={result.cause} effect={result.effect} because={result.because} />}
      replay={<ReplayTimeline activeStep={activeStep} onStep={setActiveStep} />}
      secondary={(
        <>
          <PresetStrip presets={config.presets} activePreset={activePreset} onPreset={(preset) => applyPreset(preset as WavePreset)} />
          <PredictionCard prompt={config.prediction} hint={simple ? "Look at the visual pattern before using equations." : "Predict the detector or screen change first."} />
          <MisconceptionCard misconception={config.misconception} correction={config.correction} />
          {advanced && <FormulaDerivationPanel formula={config.formulae.join("  |  ")} steps={config.benchmarkText.map((text, index) => ({ label: `Check ${index + 1}`, expression: text, explanation: index === 0 ? "Benchmark or trend check used for trust." : "Classroom interpretation of the wave model." }))} />}
          {mode === "Teacher" && <section className="premium-shell-card"><p className="premium-mini-label">Teacher analogy</p><h3>{config.teacherAnalogy}</h3><p>Replay: setup, prediction, change variable, observe, explain, conclusion.</p></section>}
        </>
      )}
      mobileDock={<LabModeSwitcher mode={mode} />}
    />
  );
}

function PremiumWaveStage({ id, values, result }: { id: PremiumWaveId; values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  return (
    <WaveCanvas title={`${id} premium wave scene`} caption={stageCaption(id)}>
      {id === "chladni-plate" && <ChladniScene values={values} result={result} />}
      {id === "single-slit-diffraction" && <SingleSlitScene values={values} result={result} />}
      {id === "wave-lab" && <WaveLabScene values={values} result={result} />}
      {id === "young-double-slit" && <YoungScene values={values} result={result} />}
      {id === "sound-wave-anatomy" && <SoundScene values={values} result={result} />}
      <AmplitudeGraph amplitude={Math.max(0.5, Math.min(2, result.amplitude))} wavelength={Math.max(24, result.wavelength)} label={result.graphLabel} />
    </WaveCanvas>
  );
}

function ChladniScene({ values }: { values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  return (
    <g>
      <rect x="130" y="76" width="360" height="260" rx="24" fill="rgba(96,165,250,.12)" stroke="#93c5fd" strokeWidth="4" />
      {Array.from({ length: values.n }, (_, index) => <line key={`n-${index}`} x1={130 + ((index + 1) * 360) / (values.n + 1)} y1="84" x2={130 + ((index + 1) * 360) / (values.n + 1)} y2="328" stroke="#facc15" strokeWidth="4" strokeDasharray="10 8" />)}
      {Array.from({ length: values.m }, (_, index) => <line key={`m-${index}`} x1="138" y1={76 + ((index + 1) * 260) / (values.m + 1)} x2="482" y2={76 + ((index + 1) * 260) / (values.m + 1)} stroke="#c084fc" strokeWidth="4" strokeDasharray="6 9" />)}
      {Array.from({ length: 80 }, (_, index) => <circle key={index} cx={145 + ((index * 47) % 320)} cy={92 + ((index * 31) % 230)} r="2.6" fill="#fde68a" opacity="0.75" />)}
      <text x="150" y="56" fill="#e0f2fe" fontWeight="900">sand settles on nodal lines: n={values.n}, m={values.m}</text>
      <text x="520" y="148" fill="#facc15" fontWeight="900">qualitative school model</text>
    </g>
  );
}

function SingleSlitScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  return (
    <g>
      <WavefrontLayer kind="plane" sourceX={80} count={7} spacing={34} amplitude={0.8} />
      <rect x="330" y="82" width="18" height="112" fill="#94a3b8" /><rect x="330" y="250" width="18" height="112" fill="#94a3b8" />
      <text x="294" y="230" fill="#e0f2fe">slit a={values.slitWidth.toFixed(2)} mm</text>
      <WavefrontLayer kind="circular" sourceX={360} sourceY={222} count={6} spacing={30} amplitude={0.7} />
      <InterferenceMap fringeWidth={Math.max(12, result.amplitude * 16)} label="diffraction intensity screen" />
      <DetectorProbe x={610} y={238} reading={`y1 ${result.outputs[0].value} m`} label="screen scan" />
    </g>
  );
}

function WaveLabScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  return (
    <g>
      <WavefrontLayer kind="circular" sourceX={260} sourceY={205 - values.sourceSpacing * 8} count={7} spacing={Math.max(24, result.wavelength)} amplitude={0.6} label="source A wavefronts" />
      <WavefrontLayer kind="circular" sourceX={260} sourceY={205 + values.sourceSpacing * 8} count={7} spacing={Math.max(24, result.wavelength)} amplitude={0.6} label="source B wavefronts" />
      <InterferenceMap x={560} y={74} fringeWidth={28} label="constructive destructive map" />
      <DetectorProbe x={650} y={250} reading={`A ${result.outputs[1].value}`} label="draggable detector" />
      <text x="92" y="72" fill="#e0f2fe" fontWeight="900">path difference overlay: constructive / destructive zones</text>
    </g>
  );
}

function YoungScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  const hue = Math.max(240, Math.min(680, values.wavelength));
  return (
    <g>
      <rect x="120" y="112" width="220" height="20" rx="10" fill={`hsl(${(700 - hue) / 1.2}, 90%, 62%)`} />
      <rect x="356" y="72" width="18" height="130" fill="#94a3b8" /><rect x="356" y="252" width="18" height="130" fill="#94a3b8" />
      <line x1="374" y1="182" x2="584" y2="152" stroke="#fef08a" strokeWidth="3" /><line x1="374" y1="272" x2="584" y2="302" stroke="#fef08a" strokeWidth="3" />
      <InterferenceMap x={584} y={82} fringeWidth={Math.max(10, result.amplitude * 18)} label="Young fringe screen" />
      <DetectorProbe x={700} y={240} reading={`beta ${result.outputs[0].value} m`} label="fringe ruler" />
      <text x="118" y="88" fill="#e0f2fe" fontWeight="900">coherent color beam: {values.wavelength.toFixed(0)} nm</text>
    </g>
  );
}

function SoundScene({ values, result }: { values: Record<string, number>; result: ReturnType<typeof computePremiumWave> }) {
  return (
    <g>
      <rect x="74" y="130" width="720" height="156" rx="28" fill="rgba(96,165,250,.1)" stroke="#93c5fd" />
      <WavefrontLayer kind="longitudinal" sourceX={92} sourceY={208} count={24} spacing={26} amplitude={values.amplitude} label="longitudinal particle motion" />
      <line x1="130" y1="316" x2="760" y2="316" stroke="#facc15" strokeWidth="5" markerEnd="url(#wave-arrow)" />
      <text x="140" y="348" fill="#fde68a" fontWeight="900">wave travels this way; particles oscillate back and forth</text>
      <DetectorProbe x={630} y={190} reading={`lambda ${result.outputs[0].value} m`} label="pressure probe" />
    </g>
  );
}

function stageCaption(id: PremiumWaveId) {
  if (id === "chladni-plate") return "Qualitative model: node count and sand-settling trend are trustworthy, exact plate boundary physics is not claimed.";
  if (id === "sound-wave-anatomy") return "Longitudinal model: particles oscillate locally while the disturbance travels through the medium.";
  return "Quantitative school model: formulas, unit conversions, detector readouts, and visual rulers are linked.";
}
