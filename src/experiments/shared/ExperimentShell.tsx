import type { ReactNode } from "react";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import { canonicalAccuracyStatus, type AccuracyStatus } from "./validation";
import "./experimentShell.css";

export interface ExperimentShellProps {
  experiment: ExperimentDefinition;
  title?: string;
  subtitle?: string;
  controls?: ReactNode;
  visual: ReactNode;
  observations?: ReactNode;
  graph?: ReactNode;
  teacherReplay?: ReactNode;
  mobileSheet?: ReactNode;
  footer?: ReactNode;
  mode?: ExperimentMode;
  formulaStatus?: AccuracyStatus;
  modelStatus?: string;
  beginnerHint?: string;
  teacherPrompt?: ReactNode;
}

// Dedicated labs should use this frame so migrated experiments stay visually consistent
// while their physics model, visuals, and controls remain lab-specific.
export function ExperimentShell({
  experiment,
  title = experiment.title,
  subtitle = experiment.aim,
  controls,
  visual,
  observations,
  graph,
  teacherReplay,
  mobileSheet,
  footer,
  mode = "Normal",
  formulaStatus = "needs-benchmark",
  modelStatus = experiment.modelClass,
  beginnerHint = "Change only one control, then describe what changed.",
  teacherPrompt,
}: ExperimentShellProps) {
  const isBeginner = mode === "Beginner";
  const isTeacher = mode === "Teacher";
  const showSecondary = !isBeginner || isTeacher;
  const normalizedFormulaStatus = canonicalAccuracyStatus(formulaStatus);

  return (
    <section className={`dedicated-experiment-shell dedicated-experiment-shell-${mode.toLowerCase()}`} aria-label={`${title} dedicated experiment`}>
      <header className="dedicated-experiment-head">
        <div>
          <p className="ui-label">Dedicated lab · {mode} mode</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="dedicated-experiment-badges" aria-label="Experiment metadata">
          <span>{experiment.classLevel}</span>
          <span>{experiment.category}</span>
          <span>{modelStatus}</span>
          <span data-status={normalizedFormulaStatus}>{normalizedFormulaStatus}</span>
        </div>
      </header>

      {isBeginner && <div className="dedicated-beginner-hint">{beginnerHint}</div>}
      {isTeacher && (
        <section className="dedicated-teacher-board" aria-label="Teacher mode board prompts">
          <p className="ui-label">Teacher board</p>
          {teacherPrompt ?? (
            <div className="dedicated-teacher-board-grid">
              <span><strong>Prediction:</strong> What will change first?</span>
              <span><strong>Misconception:</strong> Which common idea might be wrong?</span>
              <span><strong>Conclusion starter:</strong> I observed that...</span>
            </div>
          )}
        </section>
      )}

      <div className="dedicated-experiment-layout">
        <main className="dedicated-experiment-main">
          <div className="dedicated-experiment-visual">{visual}</div>
          {showSecondary && graph && <details className="dedicated-secondary-panel" open><summary>Graph and data</summary><div className="dedicated-experiment-graph">{graph}</div></details>}
          {showSecondary && teacherReplay && <details className="dedicated-secondary-panel" open={isTeacher}><summary>Teacher replay and notes</summary>{teacherReplay}</details>}
        </main>
        {controls && <aside className="dedicated-experiment-controls">{controls}</aside>}
        {observations && <aside className="dedicated-experiment-observations">{observations}</aside>}
      </div>

      {mobileSheet}
      {showSecondary && footer && <details className="dedicated-experiment-footer" open={mode === "Advanced"}><summary>Assumptions, benchmarks, and model limits</summary>{footer}</details>}
    </section>
  );
}
