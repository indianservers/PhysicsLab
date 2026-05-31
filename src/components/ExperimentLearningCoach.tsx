import { ExperimentDefinition } from "../types";
import { PhysicsIcon } from "../lib/icons";

export interface CoachControl {
  label: string;
  min: number;
  max: number;
  step: number;
}

export interface CoachOutput {
  label: string;
  value: string;
}

interface ExperimentLearningCoachProps {
  experiment: ExperimentDefinition;
  controls: CoachControl[];
  values: number[];
  outputs: CoachOutput[];
  formula: string;
  onSetValues?: (values: number[]) => void;
  makeTrialOutputs?: (values: number[]) => CoachOutput[];
}

export function ExperimentLearningCoach({ experiment, controls, values, outputs, formula, onSetValues, makeTrialOutputs }: ExperimentLearningCoachProps) {
  const primaryControl = controls[0];
  const primaryOutput = outputs[0];
  const relationship = relationshipFor(experiment, primaryControl?.label ?? "input", primaryOutput?.label ?? "output");
  const trialValues = makeTrialValues(controls, values);
  const trialRows = makeTrialOutputs ? trialValues.map((trial) => ({ values: trial, outputs: makeTrialOutputs(trial) })) : [];

  return (
    <section className="mt-5 rounded-lg border border-slate-300/70 bg-slate-50 p-4 dark:border-lab-line dark:bg-slate-900/70">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-500">
            <PhysicsIcon name="spark" className="h-4 w-4" />
            Easy learning mode
          </div>
          <h3 className="mt-1 text-lg font-black">Predict, change, observe, explain</h3>
        </div>
        {onSetValues && (
          <div className="flex flex-wrap gap-2">
            <button className="tool-btn" onClick={() => onSetValues(controls.map((control) => control.min))}>Low setup</button>
            <button className="tool-btn" onClick={() => onSetValues(controls.map((control) => midpoint(control)))}>Middle setup</button>
            <button className="tool-btn" onClick={() => onSetValues(controls.map((control) => control.max))}>High setup</button>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <CoachStep icon="compass" title="1. Predict" body={`If ${primaryControl?.label ?? "the main input"} increases, what should happen to ${primaryOutput?.label ?? "the result"}?`} />
        <CoachStep icon="eye" title="2. Observe" body={`${primaryOutput?.label ?? "Main result"} is now ${primaryOutput?.value ?? "ready to measure"}. Watch whether it rises, falls, or changes direction.`} />
        <CoachStep icon="book" title="3. Explain" body={`${relationship} Formula focus: ${formula}.`} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-slate-300/60 bg-white p-3 text-sm dark:border-lab-line dark:bg-slate-950">
          <div className="flex items-center gap-2 font-black text-cyan-500"><PhysicsIcon name="ruler" className="h-4 w-4" />What to change</div>
          <div className="mt-3 space-y-2">
            {controls.map((control, index) => {
              const percent = ((values[index] - control.min) / Math.max(0.0001, control.max - control.min)) * 100;
              return (
                <div key={control.label}>
                  <div className="flex justify-between text-xs">
                    <span>{control.label}</span>
                    <span className="font-mono text-cyan-500">{values[index]?.toFixed(control.step < 0.1 ? 2 : 1)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <span className="block h-full rounded-full bg-cyan-400" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-slate-300/60 bg-white p-3 dark:border-lab-line dark:bg-slate-950">
          <div className="flex items-center gap-2 text-sm font-black text-cyan-500"><PhysicsIcon name="chart" className="h-4 w-4" />Quick trial table</div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-1">Trial</th>
                  <th>{primaryControl?.label ?? "Input"}</th>
                  <th>{primaryOutput?.label ?? "Output"}</th>
                  <th>Learning note</th>
                </tr>
              </thead>
              <tbody>
                {(trialRows.length ? trialRows : [{ values, outputs }]).map((row, index) => (
                  <tr key={`${index}-${row.values.join("-")}`} className="border-t border-slate-300/40 dark:border-lab-line">
                    <td className="py-2">Trial {index + 1}</td>
                    <td className="font-mono text-cyan-500">{row.values[0]?.toFixed(primaryControl?.step && primaryControl.step < 0.1 ? 2 : 1)}</td>
                    <td>{row.outputs[0]?.value ?? "-"}</td>
                    <td>{index === 0 ? "Start low" : index === 1 ? "Compare middle" : "Check high"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoachStep({ icon, title, body }: { icon: "book" | "compass" | "eye"; title: string; body: string }) {
  return (
    <div className="rounded-md border border-slate-300/60 bg-white p-3 dark:border-lab-line dark:bg-slate-950">
      <div className="flex items-center gap-2 font-black"><PhysicsIcon name={icon} className="h-4 w-4 text-cyan-500" />{title}</div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}

function makeTrialValues(controls: CoachControl[], values: number[]) {
  if (!controls.length) return [values];
  const base = values.length ? values : controls.map(midpoint);
  return [0.2, 0.5, 0.8].map((fraction) => controls.map((control, index) => {
    if (index > 0) return base[index] ?? midpoint(control);
    return control.min + (control.max - control.min) * fraction;
  }));
}

function midpoint(control: CoachControl) {
  return control.min + (control.max - control.min) / 2;
}

function relationshipFor(experiment: ExperimentDefinition, input: string, output: string) {
  if (experiment.category === "Electricity") return `${output} usually responds through circuit resistance, voltage, current, or power.`;
  if (experiment.category === "Optics") return `${output} changes because ray geometry changes when optical distance, angle, or material changes.`;
  if (experiment.category === "Waves") return `${output} follows the wave pattern: frequency, amplitude, wavelength, and speed are linked.`;
  if (experiment.category === "Thermodynamics") return `${output} changes with thermal state, material, mass, or process path.`;
  if (experiment.category === "Fluid Mechanics") return `${output} depends on pressure, depth, density, area, or speed.`;
  if (experiment.category === "Magnetism") return `${output} changes with current, field strength, turns, distance, and direction.`;
  if (experiment.category === "Modern Physics") return `${output} changes when the quantum condition or energy balance changes.`;
  return `${output} responds when ${input} changes because the motion or force balance changes.`;
}
