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
import { inclinedPlaneAssumptions, inclinedPlaneControls, inclinedPlaneDefaults, inclinedPlanePresets, inclinedPlaneSymbols } from "./inclined-planeData";
import { inclinedPlaneBenchmarks, simulateInclinedPlane } from "./inclined-planeSimulation";
import "./inclined-plane.css";

export function InclinedPlaneLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(inclinedPlaneDefaults);
  const [step, setStep] = useState("components");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateInclinedPlane(values), [values]);
  const controls = inclinedPlaneControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));
  const graphPoints = Array.from({ length: 9 }, (_, index) => {
    const angle = index * 10;
    return { x: angle, y: simulateInclinedPlane({ ...values, angle }).acceleration };
  });

  return (
    <ExperimentShell
      experiment={experiment}
      title="Inclined Plane Lab"
      subtitle="Split weight into parallel and normal components, then subtract friction correctly."
      controls={<ControlGroup title={simple ? "Angle control" : "Incline controls"} controls={controls} presets={inclinedPlanePresets} onChange={update} onReset={() => setValues(inclinedPlaneDefaults)} onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))} />}
      visual={<div className="mechanics-lab-card"><h3>Free-body diagram on a slope</h3><svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Inclined plane diagram"><defs><marker id="incline-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#fb7185" /></marker><marker id="incline-cyan-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs><g transform={`rotate(${-values.angle} 210 180)`}><rect x="70" y="175" width="280" height="24" rx="7" fill="#64748b" /><rect x="188" y="126" width="54" height="46" rx="6" fill="#22d3ee" /></g><line x1="210" y1="126" x2="210" y2="220" stroke="#facc15" strokeWidth="5" markerEnd="url(#incline-arrow)" /><line x1="210" y1="148" x2={210 + 76 * Math.cos((values.angle * Math.PI) / 180)} y2={148 + 76 * Math.sin((values.angle * Math.PI) / 180)} stroke="#fb7185" strokeWidth="5" markerEnd="url(#incline-arrow)" /><line x1="210" y1="148" x2={210 + 70 * Math.sin((values.angle * Math.PI) / 180)} y2={148 - 70 * Math.cos((values.angle * Math.PI) / 180)} stroke="#22d3ee" strokeWidth="5" markerEnd="url(#incline-cyan-arrow)" /><text x="222" y="218" fill="#fde68a" fontWeight="900">mg</text><text x="274" y="180" fill="#fecdd3" fontWeight="900">mg sinθ</text><text x="248" y="96" fill="#bae6fd" fontWeight="900">N</text></svg><div className="mechanics-output-grid"><div><span>Parallel weight</span><strong>{result.parallelWeight.toFixed(2)} N</strong></div><div><span>Normal</span><strong>{result.normalForce.toFixed(2)} N</strong></div><div><span>Friction</span><strong>{result.friction.toFixed(2)} N</strong></div><div><span>Acceleration</span><strong>{result.acceleration.toFixed(2)} m/s²</strong></div></div></div>}
      graph={!simple && <GraphPanel title="Angle versus acceleration" xLabel="angle" yLabel="acceleration" xUnit="deg" yUnit="m/s²" points={graphPoints} shape="qualitative" caption="Acceleration grows as the downhill weight component exceeds friction." />}
      observations={<ObservationPanel changed="Angle changes both downhill pull and normal force." why="As θ rises, mg sinθ grows while mg cosθ and friction shrink." observations={[{ label: "Net force down plane", value: `${result.netForce.toFixed(2)} N` }, { label: "Acceleration", value: `${result.acceleration.toFixed(2)} m/s²` }]} />}
      teacherReplay={<TeacherReplay activeStepId={step} onSelect={(item) => setStep(item.id)} steps={[{ id: "components", title: "Resolve weight", prompt: "Show mg sinθ.", explanation: "The parallel component pulls the block down the plane." }, { id: "friction", title: "Subtract friction", prompt: "Increase μ.", explanation: "Friction opposes down-slope motion and can hold the block." }, { id: "edge", title: "Flat edge case", prompt: "Set θ = 0.", explanation: "A flat plane must not create downhill acceleration." }]} />}
      mobileSheet={<MobileExperimentSheet title="Incline controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(inclinedPlaneDefaults)} /></MobileExperimentSheet>}
      footer={advanced && <><FormulaAssumptionBox formula="a = max(0, g(sinθ - μcosθ))" symbols={inclinedPlaneSymbols} assumptions={inclinedPlaneAssumptions} status={allBenchmarksPassed(inclinedPlaneBenchmarks) ? "validated" : "benchmark-pending"} /><div className="mechanics-benchmark-list">{inclinedPlaneBenchmarks.map((item) => <span key={item.id}>PASS {item.name}: {item.actual.toFixed(3)} {item.unit}</span>)}</div></>}
    />
  );
}
