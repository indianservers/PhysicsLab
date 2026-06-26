import { useState } from "react";
import { ExperimentDefinition } from "../types";
import { LearningLevel } from "../lib/learningLevels";
import { PhysicsIcon } from "../lib/icons";

const stages = ["Aim", "Theory", "Apparatus / variables", "Prediction", "Run simulation", "Observe graph", "Record values", "Compare expected vs observed", "Conclusion", "Viva questions"] as const;

export function GuidedExperimentMode({ experiment, level, variables, outputs }: { experiment: ExperimentDefinition; level: LearningLevel; variables: Array<{ label: string; value: number }>; outputs: Array<{ label: string; value: string }> }) {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  return (
    <section className="phase4-panel">
      <div className="phase4-panel-head">
        <div>
          <p className="ui-label">Guided experiment mode</p>
          <h2>Lab assistant flow</h2>
        </div>
        <span className="status-chip status-chip-cyan">Stage {active + 1} of {stages.length}: {stage}</span>
      </div>
      <div className="guided-flow">
        {stages.map((item, index) => (
          <button key={item} className={index === active ? "guided-flow-step active" : "guided-flow-step"} type="button" onClick={() => setActive(index)}>
            {index + 1}
          </button>
        ))}
      </div>
      <div className="phase4-card mt-3">
        <div className="phase4-card-title"><PhysicsIcon name="flask" className="h-4 w-4" />{stage}</div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{contentFor(stage, experiment, variables, outputs, level)}</p>
      </div>
      <div className="mt-3 flex justify-between gap-2">
        <button className="tool-btn" type="button" onClick={() => setActive((value) => Math.max(0, value - 1))}>Back</button>
        <button className="tool-btn-primary" type="button" onClick={() => setActive((value) => Math.min(stages.length - 1, value + 1))}>Next step</button>
      </div>
    </section>
  );
}

function contentFor(stage: typeof stages[number], experiment: ExperimentDefinition, variables: Array<{ label: string; value: number }>, outputs: Array<{ label: string; value: string }>, level: LearningLevel) {
  switch (stage) {
    case "Aim": return experiment.aim;
    case "Theory": return experiment.theory;
    case "Apparatus / variables": return `${experiment.apparatus.join(", ")}. Active variables: ${variables.map((item) => `${item.label}=${item.value}`).join(", ")}.`;
    case "Prediction": return `Before running, predict how ${outputs[0]?.label ?? "the output"} changes when ${variables[0]?.label ?? "the first variable"} changes.`;
    case "Run simulation": return "Run or adjust the simulation once. Keep every other variable fixed for a clean comparison.";
    case "Observe graph": return level === "Simple" ? "Look for up, down, flat, or curved." : "Read slope, intercept, curvature, peaks, and units from the graph.";
    case "Record values": return `Record ${experiment.observationColumns.slice(0, 4).join(", ")}.`;
    case "Compare expected vs observed": return `Expected result: ${experiment.expectedResult}`;
    case "Conclusion": return "Write one sentence connecting the variable changed, formula used, graph shape, and result.";
    case "Viva questions": return vivaPrompt(experiment);
  }
}

function vivaPrompt(experiment: ExperimentDefinition) {
  const questions = [
    ...experiment.vivaQuestions,
    { prompt: "Which variable did you change first?", answer: "Change one input at a time so the effect on the output is clear." },
    { prompt: "Which assumption matters most in this lab?", answer: experiment.assumptions?.[0] ?? "Use the stated ideal model and keep units consistent." },
    { prompt: "How do you know your result is reasonable?", answer: "Check the units, graph trend, and whether the answer matches the expected result." },
  ].slice(0, 4);
  return questions.map((question, index) => `${index + 1}. ${question.prompt} Answer: ${question.answer}`).join(" ");
}
