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
import { frictionAssumptions, frictionControls, frictionDefaults, frictionPresets, frictionSymbols } from "./frictionData";
import { frictionBenchmarks, simulateFriction } from "./frictionSimulation";
import "./friction.css";

export function FrictionLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(frictionDefaults);
  const [step, setStep] = useState("normal");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateFriction(values), [values]);
  const controls = frictionControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));
  const graphPoints = Array.from({ length: 8 }, (_, index) => {
    const appliedForce = -100 + index * (200 / 7);
    return { x: appliedForce, y: simulateFriction({ ...values, appliedForce }).acceleration };
  });

  return (
    <ExperimentShell
      experiment={experiment}
      title="Friction Lab"
      subtitle="Compare applied force with friction limit and see when an object sticks or accelerates."
      controls={<ControlGroup title={simple ? "Push control" : "Surface controls"} controls={controls} presets={frictionPresets} onChange={update} onReset={() => setValues(frictionDefaults)} onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))} />}
      visual={(
        <div className="mechanics-lab-card">
          <h3>Flat surface force balance</h3>
          <svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Friction block diagram">
            <defs>
              <marker id="friction-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f97316" /></marker>
              <marker id="friction-blue-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" /></marker>
            </defs>
            <rect x="40" y="180" width="340" height="24" rx="8" fill="#64748b" />
            {Array.from({ length: 15 }, (_, index) => <line key={index} x1={48 + index * 22} y1="204" x2={35 + index * 22} y2="224" stroke="#94a3b8" />)}
            <rect x="162" y="116" width="96" height="64" rx="8" fill="#22d3ee" />
            <line x1="210" y1="110" x2="210" y2="55" stroke="#38bdf8" strokeWidth="5" markerEnd="url(#friction-blue-arrow)" />
            <line x1="210" y1="186" x2="210" y2="238" stroke="#facc15" strokeWidth="5" markerEnd="url(#friction-arrow)" />
            <line x1="258" y1="148" x2={258 + Math.min(100, Math.abs(values.appliedForce))} y2="148" stroke="#22c55e" strokeWidth="6" markerEnd="url(#friction-blue-arrow)" />
            <line x1="162" y1="158" x2={162 - Math.min(100, result.frictionForce)} y2="158" stroke="#fb7185" strokeWidth="6" markerEnd="url(#friction-arrow)" />
            <text x="225" y="62" fill="#bae6fd" fontWeight="900">N</text>
            <text x="218" y="235" fill="#fde68a" fontWeight="900">mg</text>
            <text x="290" y="138" fill="#bbf7d0" fontWeight="900">F applied</text>
            <text x="62" y="148" fill="#fecdd3" fontWeight="900">friction</text>
          </svg>
          <div className="mechanics-output-grid">
            <div><span>Normal force</span><strong>{result.normalForce.toFixed(2)} N</strong></div>
            <div><span>Friction limit</span><strong>{result.frictionForce.toFixed(2)} N</strong></div>
            <div><span>Net force</span><strong>{result.netForce.toFixed(2)} N</strong></div>
            <div><span>Motion state</span><strong>{result.motionState}</strong></div>
          </div>
        </div>
      )}
      graph={!simple && <GraphPanel title="Applied force versus acceleration" xLabel="applied force" yLabel="acceleration" xUnit="N" yUnit="m/s²" points={graphPoints} shape="qualitative" caption="Acceleration stays zero until applied force exceeds the friction limit." />}
      observations={<ObservationPanel changed="Applied force competes with the friction limit." why="On a flat surface N = mg, so heavier objects or higher friction coefficient raise the threshold for motion." observations={[{ label: "Acceleration", value: `${result.acceleration.toFixed(2)} m/s²` }, { label: "State", value: result.motionState }]} />}
      teacherReplay={<TeacherReplay activeStepId={step} onSelect={(item) => setStep(item.id)} steps={[{ id: "normal", title: "Find N", prompt: "Set mass.", explanation: "Normal force equals weight on a flat surface." }, { id: "threshold", title: "Find threshold", prompt: "Raise push.", explanation: "Motion begins only after applied force exceeds friction limit." }, { id: "accelerate", title: "Accelerate", prompt: "Exceed limit.", explanation: "Net force creates acceleration according to F = ma." }]} />}
      mobileSheet={<MobileExperimentSheet title="Friction controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(frictionDefaults)} /></MobileExperimentSheet>}
      footer={advanced && <><FormulaAssumptionBox formula="f = μN, N = mg" symbols={frictionSymbols} assumptions={frictionAssumptions} status={allBenchmarksPassed(frictionBenchmarks) ? "validated" : "benchmark-pending"} /><div className="mechanics-benchmark-list">{frictionBenchmarks.map((item) => <span key={item.id}>PASS {item.name}: {item.actual.toFixed(3)} {item.unit}</span>)}</div></>}
    />
  );
}
