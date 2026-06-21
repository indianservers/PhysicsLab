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
import { circularMotionAssumptions, circularMotionControls, circularMotionDefaults, circularMotionPresets, circularMotionSymbols } from "./circular-motionData";
import { circularMotionBenchmarks, simulateCircularMotion } from "./circular-motionSimulation";
import "./circular-motion.css";

export function CircularMotionLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(circularMotionDefaults);
  const [step, setStep] = useState("speed");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateCircularMotion(values), [values]);
  const controls = circularMotionControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));
  const orbitRadius = 28 + values.radius * 13;
  const graphPoints = Array.from({ length: 8 }, (_, index) => {
    const omega = 0.5 + index;
    return { x: omega, y: simulateCircularMotion({ ...values, omega }).centripetalForce };
  });

  return (
    <ExperimentShell
      experiment={experiment}
      title="Circular Motion Lab"
      subtitle="Connect angular speed, tangential speed, inward acceleration, force, and period."
      controls={<ControlGroup title={simple ? "Speed control" : "Orbit controls"} controls={controls} presets={circularMotionPresets} onChange={update} onReset={() => setValues(circularMotionDefaults)} onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))} />}
      visual={<div className="mechanics-lab-card"><h3>Top-view orbit with inward force</h3><svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Circular motion diagram"><defs><marker id="circular-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#facc15" /></marker><marker id="circular-cyan-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker></defs><circle cx="210" cy="135" r={orbitRadius} fill="none" stroke="#38bdf8" strokeWidth="3" strokeDasharray="7 7" /><circle cx="210" cy="135" r="7" fill="#facc15" /><circle cx={210 + orbitRadius} cy="135" r={10 + values.mass * 1.3} fill="#fb7185" /><line x1={210 + orbitRadius} y1="135" x2={210} y2="135" stroke="#22d3ee" strokeWidth="5" markerEnd="url(#circular-cyan-arrow)" /><line x1={210 + orbitRadius} y1="135" x2={210 + orbitRadius} y2="80" stroke="#facc15" strokeWidth="5" markerEnd="url(#circular-arrow)" /><text x="225" y="128" fill="#bae6fd" fontWeight="900">Fc inward</text><text x={218 + orbitRadius} y="86" fill="#fde68a" fontWeight="900">v</text></svg><div className="mechanics-output-grid"><div><span>Tangential speed</span><strong>{result.tangentialSpeed.toFixed(2)} m/s</strong></div><div><span>Centripetal acc.</span><strong>{result.centripetalAcceleration.toFixed(2)} m/s²</strong></div><div><span>Centripetal force</span><strong>{result.centripetalForce.toFixed(2)} N</strong></div><div><span>Period</span><strong>{result.period.toFixed(2)} s</strong></div></div></div>}
      graph={!simple && <GraphPanel title="Angular speed versus force" xLabel="angular speed" yLabel="centripetal force" xUnit="rad/s" yUnit="N" points={graphPoints} shape="quadratic" caption="Centripetal force rises with the square of angular speed." />}
      observations={<ObservationPanel changed="Angular speed strongly changes inward force." why="Fc = mrω², so doubling angular speed needs four times the centripetal force." observations={[{ label: "Inward force", value: `${result.centripetalForce.toFixed(2)} N` }, { label: "Period", value: `${result.period.toFixed(2)} s` }]} />}
      teacherReplay={<TeacherReplay activeStepId={step} onSelect={(item) => setStep(item.id)} steps={[{ id: "speed", title: "Speed", prompt: "Increase ω.", explanation: "Tangential speed is v = rω." }, { id: "force", title: "Force", prompt: "Watch inward arrow.", explanation: "The force vector points to the center, not along the motion." }, { id: "period", title: "Period", prompt: "Compare cycles.", explanation: "Higher angular speed means a shorter period." }]} />}
      mobileSheet={<MobileExperimentSheet title="Circular motion controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(circularMotionDefaults)} /></MobileExperimentSheet>}
      footer={advanced && <><FormulaAssumptionBox formula="Fc = mrω², v = rω, T = 2π/ω" symbols={circularMotionSymbols} assumptions={circularMotionAssumptions} status={allBenchmarksPassed(circularMotionBenchmarks) ? "validated" : "benchmark-pending"} /><div className="mechanics-benchmark-list">{circularMotionBenchmarks.map((item) => <span key={item.id}>PASS {item.name}: {item.actual.toFixed(3)} {item.unit}</span>)}</div></>}
    />
  );
}
