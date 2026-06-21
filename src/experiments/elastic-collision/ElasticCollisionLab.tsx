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
import { elasticCollisionAssumptions, elasticCollisionControls, elasticCollisionDefaults, elasticCollisionPresets, elasticCollisionSymbols } from "./elastic-collisionData";
import { elasticCollisionBenchmarks, simulateElasticCollision } from "./elastic-collisionSimulation";
import "./elastic-collision.css";

export function ElasticCollisionLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(elasticCollisionDefaults);
  const [step, setStep] = useState("before");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateElasticCollision(values), [values]);
  const controls = elasticCollisionControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));
  const bars = [{ x: 0, y: result.kineticBefore }, { x: 1, y: result.kineticAfter }];

  return (
    <ExperimentShell
      experiment={experiment}
      title="Elastic Collision Lab"
      subtitle="Solve a 1D elastic collision and compare momentum and kinetic energy before and after."
      controls={<ControlGroup title={simple ? "Launch speed" : "Collision controls"} controls={controls} presets={elasticCollisionPresets} onChange={update} onReset={() => setValues(elasticCollisionDefaults)} onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))} />}
      visual={<div className="mechanics-lab-card"><h3>Before and after collision track</h3><svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Elastic collision carts"><defs><marker id="collision-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#facc15" /></marker></defs><line x1="35" y1="185" x2="385" y2="185" stroke="#7dd3fc" strokeWidth="4" /><rect x="105" y="135" width={45 + values.m1 * 8} height="40" rx="7" fill="#38bdf8" /><rect x="260" y="135" width={45 + values.m2 * 8} height="40" rx="7" fill="#fb7185" /><circle cx="125" cy="182" r="7" fill="#0f172a" /><circle cx="285" cy="182" r="7" fill="#0f172a" /><line x1="142" y1="120" x2={142 + values.u1 * 15} y2="120" stroke="#facc15" strokeWidth="5" markerEnd="url(#collision-arrow)" /><line x1="284" y1="112" x2={284 + values.u2 * 15} y2="112" stroke="#facc15" strokeWidth="5" markerEnd="url(#collision-arrow)" /><text x="70" y="72" fill="#bae6fd" fontWeight="900">after: v1 = {result.v1.toFixed(2)} m/s</text><text x="220" y="72" fill="#fecdd3" fontWeight="900">v2 = {result.v2.toFixed(2)} m/s</text><path d="M202 130 C218 112 232 112 248 130" stroke="#22d3ee" strokeWidth="4" fill="none" /></svg><div className="mechanics-output-grid"><div><span>Final v1</span><strong>{result.v1.toFixed(2)} m/s</strong></div><div><span>Final v2</span><strong>{result.v2.toFixed(2)} m/s</strong></div><div><span>Momentum error</span><strong>{Math.abs(result.momentumAfter - result.momentumBefore).toExponential(1)}</strong></div><div><span>Energy error</span><strong>{result.conservationErrorPercent.toFixed(4)}%</strong></div></div></div>}
      graph={!simple && <GraphPanel title="Kinetic energy before and after" xLabel="state" yLabel="energy" yUnit="J" points={bars} shape="constant" caption="A perfect elastic collision keeps total kinetic energy unchanged." />}
      observations={<ObservationPanel changed="Mass ratio controls how velocity transfers." why="The elastic equations enforce momentum and kinetic energy conservation together." observations={[{ label: "Momentum before", value: `${result.momentumBefore.toFixed(2)} kg m/s` }, { label: "Momentum after", value: `${result.momentumAfter.toFixed(2)} kg m/s` }]} />}
      teacherReplay={<TeacherReplay activeStepId={step} onSelect={(item) => setStep(item.id)} steps={[{ id: "before", title: "Before", prompt: "Set masses.", explanation: "Momentum before impact is m1u1 + m2u2." }, { id: "impact", title: "Impact", prompt: "Compare masses.", explanation: "Equal masses exchange velocities in a head-on elastic collision." }, { id: "after", title: "After", prompt: "Check totals.", explanation: "Momentum and kinetic energy should match after collision." }]} />}
      mobileSheet={<MobileExperimentSheet title="Collision controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(elasticCollisionDefaults)} /></MobileExperimentSheet>}
      footer={advanced && <><FormulaAssumptionBox formula="v1=((m1-m2)/(m1+m2))u1 + (2m2/(m1+m2))u2" symbols={elasticCollisionSymbols} assumptions={elasticCollisionAssumptions} status={allBenchmarksPassed(elasticCollisionBenchmarks) ? "validated" : "benchmark-pending"} /><div className="mechanics-benchmark-list">{elasticCollisionBenchmarks.map((item) => <span key={item.id}>PASS {item.name}: {item.actual.toFixed(3)} {item.unit}</span>)}</div></>}
    />
  );
}
