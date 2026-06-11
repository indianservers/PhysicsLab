import { ExperimentDefinition } from "../types";
import { commonMistakesForExperiment } from "../lib/commonMistakes";
import { LearningLevel } from "../lib/learningLevels";
import { PhysicsIcon } from "../lib/icons";

export function PhysicsCoachPanel({ experiment, level, variables, outputs, formula }: { experiment: ExperimentDefinition; level: LearningLevel; variables: Array<{ label: string; value: number }>; outputs: Array<{ label: string; value: string }>; formula: string }) {
  const mainVariable = variables[0];
  const mainOutput = outputs[0];
  const assumption = (experiment.assumptions ?? [])[0] ?? "Use the displayed model assumptions.";
  const mistake = commonMistakesForExperiment(experiment)[0] ?? "Changing multiple variables at once.";
  return (
    <section className="phase4-panel">
      <div className="phase4-panel-head">
        <div>
          <p className="ui-label">Physics coach</p>
          <h2>Built-in tutor explanation</h2>
        </div>
        <span className="status-chip">{level}</span>
      </div>
      <div className="phase4-grid">
        <CoachCell title="Current state" body={`${mainVariable?.label ?? "Input"} is ${mainVariable?.value ?? "-"}; ${mainOutput?.label ?? "output"} is ${mainOutput?.value ?? "not measured yet"}.`} />
        <CoachCell title="What changed?" body={`Changing ${mainVariable?.label ?? "the first variable"} changes the model input. Watch whether the output changes proportionally, inversely, quadratically, or by threshold.`} />
        <CoachCell title="Why graph changed" body="The graph changes because the plotted dependent variable is recalculated from the active formula/model after the input changes." />
        <CoachCell title="Formula applies" body={formula || experiment.formulae[0]?.expression || "Use observation first; formula is not specified for this visual model."} />
        <CoachCell title="Active assumption" body={assumption} />
        <CoachCell title="Mistake warning" body={mistake} />
      </div>
    </section>
  );
}

function CoachCell({ title, body }: { title: string; body: string }) {
  return (
    <article className="phase4-card">
      <div className="phase4-card-title"><PhysicsIcon name="teacher" className="h-4 w-4" />{title}</div>
      <p>{body}</p>
    </article>
  );
}
