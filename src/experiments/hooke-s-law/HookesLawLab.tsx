import { useMemo, useState } from "react";
import { ControlGroup } from "../shared/ControlGroup";
import { ExperimentShell } from "../shared/ExperimentShell";
import { FormulaAssumptionBox } from "../shared/FormulaAssumptionBox";
import { GraphPanel } from "../shared/GraphPanel";
import { MobileExperimentSheet } from "../shared/MobileExperimentSheet";
import { ObservationPanel } from "../shared/ObservationPanel";
import { TeacherReplay } from "../shared/TeacherReplay";
import { allBenchmarksPassed } from "../shared/validation";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { hookesLawAssumptions, hookesLawControls, hookesLawDefaults, hookesLawPresets, hookesLawSymbols } from "./hooke-s-lawData";
import { hookesLawBenchmarks, simulateHookesLaw } from "./hooke-s-lawSimulation";
import "./hooke-s-law.css";

export function HookesLawLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(hookesLawDefaults);
  const [step, setStep] = useState("stretch");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateHookesLaw(values), [values]);
  const controls = hookesLawControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));
  const massX = 205 + values.x * 260;

  return (
    <ExperimentShell
      experiment={experiment}
      title="Hooke's Law Lab"
      subtitle="Stretch or compress a spring and compare restoring force with stored elastic energy."
      controls={<ControlGroup title={simple ? "Stretch control" : "Spring controls"} controls={controls} presets={hookesLawPresets} onChange={update} onReset={() => setValues(hookesLawDefaults)} onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))} />}
      visual={<div className="mechanics-lab-card"><h3>Spring restoring force</h3><svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Hooke spring diagram"><defs><marker id="hooke-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#facc15" /></marker></defs><rect x="42" y="80" width="22" height="120" rx="6" fill="#64748b" /><path d={`M64 140 ${Array.from({ length: 13 }, (_, i) => `L${80 + i * ((massX - 100) / 13)} ${i % 2 ? 120 : 160}`).join(" ")} L${massX - 35} 140`} fill="none" stroke="#67e8f9" strokeWidth="5" /><rect x={massX - 32} y="112" width="64" height="56" rx="9" fill="#fb7185" /><line x1={massX} y1="92" x2={massX - Math.sign(values.x || 1) * 80} y2="92" stroke="#facc15" strokeWidth="5" markerEnd="url(#hooke-arrow)" /><text x="145" y="45" fill="#bae6fd" fontWeight="900">x = {values.x.toFixed(2)} m</text><text x="205" y="88" fill="#fde68a" fontWeight="900">F = {result.restoringForce.toFixed(1)} N</text></svg><div className="mechanics-output-grid"><div><span>Restoring force</span><strong>{result.restoringForce.toFixed(2)} N</strong></div><div><span>Magnitude</span><strong>{result.forceMagnitude.toFixed(2)} N</strong></div><div><span>Direction</span><strong>{result.direction}</strong></div><div><span>Energy</span><strong>{result.energyStored.toFixed(3)} J</strong></div></div></div>}
      graph={<GraphPanel title="Force-extension graph" xLabel="extension" yLabel="force" xUnit="m" yUnit="N" points={result.points} shape="linear" caption="Hooke's law gives a straight F-x graph while the spring remains elastic." />}
      observations={<ObservationPanel changed="Extension changes force linearly and energy quadratically." why="Force follows |F| = kx, but energy is the area under the F-x graph: U = 1/2 kx²." observations={[{ label: "Force magnitude", value: `${result.forceMagnitude.toFixed(2)} N` }, { label: "Energy stored", value: `${result.energyStored.toFixed(3)} J` }]} />}
      teacherReplay={<TeacherReplay activeStepId={step} onSelect={(item) => setStep(item.id)} steps={[{ id: "stretch", title: "Stretch", prompt: "Move x.", explanation: "Restoring force points back to equilibrium." }, { id: "stiffness", title: "Stiffness", prompt: "Raise k.", explanation: "A stiffer spring needs more force for the same extension." }, { id: "energy", title: "Energy", prompt: "Double x.", explanation: "Energy grows with x squared." }]} />}
      mobileSheet={<MobileExperimentSheet title="Spring controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(hookesLawDefaults)} /></MobileExperimentSheet>}
      footer={advanced && <><FormulaAssumptionBox formula="F = -kx, U = 1/2 kx²" symbols={hookesLawSymbols} assumptions={hookesLawAssumptions} status={allBenchmarksPassed(hookesLawBenchmarks) ? "validated" : "benchmark-pending"} /><div className="mechanics-benchmark-list">{hookesLawBenchmarks.map((item) => <span key={item.id}>PASS {item.name}: {item.actual.toFixed(3)} {item.unit}</span>)}</div></>}
    />
  );
}
