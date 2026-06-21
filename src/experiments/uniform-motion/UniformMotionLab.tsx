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
import { simulateUniformMotion, uniformMotionBenchmarks } from "./uniform-motionSimulation";
import { uniformMotionAssumptions, uniformMotionControls, uniformMotionDefaults, uniformMotionPresets, uniformMotionSymbols } from "./uniform-motionData";
import "./uniform-motion.css";

export function UniformMotionLab({ experiment, learningLevel }: DedicatedExperimentLabProps) {
  const [values, setValues] = useState(uniformMotionDefaults);
  const [replayStep, setReplayStep] = useState("setup");
  const [mobileOpen, setMobileOpen] = useState(false);
  const simple = learningLevel === "Simple";
  const advanced = learningLevel === "Undergraduate" || learningLevel === "Research";
  const result = useMemo(() => simulateUniformMotion(values), [values]);
  const validated = allBenchmarksPassed(uniformMotionBenchmarks);
  const carX = Math.max(46, Math.min(354, 200 + result.displacement * 7));

  const controls = uniformMotionControls(values, simple);
  const update = (id: string, value: number) => setValues((current) => ({ ...current, [id]: value }));

  return (
    <ExperimentShell
      experiment={experiment}
      title="Uniform Motion Lab"
      subtitle="Track a body moving with constant velocity and read slope as velocity."
      controls={(
        <ControlGroup
          title={simple ? "Beginner control" : "Motion controls"}
          controls={controls}
          presets={uniformMotionPresets}
          onChange={update}
          onReset={() => setValues(uniformMotionDefaults)}
          onPreset={(preset) => setValues((current) => ({ ...current, ...preset.values }))}
        />
      )}
      visual={(
        <div className="mechanics-lab-card">
          <h3>Position track with motion trail</h3>
          <svg className="mechanics-track-svg" viewBox="0 0 420 260" role="img" aria-label="Uniform motion track">
            <defs>
              <marker id="uniform-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#facc15" />
              </marker>
            </defs>
            <line x1="40" y1="180" x2="380" y2="180" stroke="#7dd3fc" strokeWidth="4" />
            {Array.from({ length: 9 }, (_, index) => <line key={index} x1={40 + index * 42} y1="170" x2={40 + index * 42} y2="192" stroke="#38bdf8" opacity="0.5" />)}
            {result.distancePoints.map((point, index) => (
              <circle key={index} cx={Math.max(46, Math.min(374, 200 + (point.y - values.x0) * 7))} cy={180 - index * 9} r={3 + index * 0.4} fill="#22d3ee" opacity={0.25 + index * 0.1} />
            ))}
            <rect x={carX - 28} y="132" width="56" height="34" rx="7" fill="#38bdf8" />
            <circle cx={carX - 17} cy="170" r="8" fill="#0f172a" />
            <circle cx={carX + 17} cy="170" r="8" fill="#0f172a" />
            <line x1={carX} y1="115" x2={carX + Math.sign(values.velocity || 1) * 70} y2="115" stroke="#facc15" strokeWidth="5" markerEnd="url(#uniform-arrow)" />
            <text x={carX - 22} y="105" fill="#fde68a" fontWeight="900">v = {values.velocity.toFixed(1)} m/s</text>
          </svg>
          <div className="mechanics-output-grid">
            <div><span>Final position</span><strong>{result.finalPosition.toFixed(2)} m</strong></div>
            <div><span>Displacement</span><strong>{result.displacement.toFixed(2)} m</strong></div>
            <div><span>Graph slope</span><strong>{values.velocity.toFixed(2)} m/s</strong></div>
          </div>
        </div>
      )}
      graph={(
        <>
          <GraphPanel title="Distance-time graph" xLabel="time" yLabel="position" xUnit="s" yUnit="m" points={result.distancePoints} shape="linear" caption={result.slopeExplanation} />
          {!simple && <GraphPanel title="Velocity-time graph" xLabel="time" yLabel="velocity" xUnit="s" yUnit="m/s" points={result.velocityPoints} shape="constant" caption="A horizontal velocity-time graph means velocity is constant." />}
        </>
      )}
      observations={(
        <ObservationPanel
          changed={`Velocity controls the steepness of the distance-time line.`}
          why="For x = x0 + vt, changing v changes position by the same amount every second."
          observations={[
            { label: "Position now", value: `${result.finalPosition.toFixed(2)} m`, explanation: "Read from the cart location and formula output." },
            ...(simple ? [] : [{ label: "Slope", value: `${values.velocity.toFixed(2)} m/s`, explanation: "Rise over run on the position graph." }]),
          ]}
        />
      )}
      teacherReplay={(
        <TeacherReplay
          activeStepId={replayStep}
          onSelect={(step) => setReplayStep(step.id)}
          steps={[
            { id: "setup", title: "Set x0", prompt: "Place the cart.", explanation: "Initial position shifts the entire graph up or down without changing slope." },
            { id: "vary", title: "Vary velocity", prompt: "Change only v.", explanation: "Velocity is the graph slope, so students can see speed and direction together." },
            { id: "negative", title: "Reverse", prompt: "Use negative v.", explanation: "Negative velocity lowers position with time; it is not negative distance." },
          ]}
        />
      )}
      mobileSheet={<MobileExperimentSheet title="Uniform motion controls" open={mobileOpen} onToggle={() => setMobileOpen((open) => !open)}><ControlGroup controls={controls} onChange={update} onReset={() => setValues(uniformMotionDefaults)} /></MobileExperimentSheet>}
      footer={advanced && (
        <>
          <FormulaAssumptionBox formula="x = x0 + vt" symbols={uniformMotionSymbols} assumptions={uniformMotionAssumptions} status={validated ? "validated" : "benchmark-pending"} />
          <div className="mechanics-benchmark-list">{uniformMotionBenchmarks.map((caseResult) => <span key={caseResult.id}>{caseResult.pass ? "PASS" : "CHECK"} {caseResult.name}: {caseResult.actual.toFixed(3)} {caseResult.unit}</span>)}</div>
        </>
      )}
    />
  );
}
