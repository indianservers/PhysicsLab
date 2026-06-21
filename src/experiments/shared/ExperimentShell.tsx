import type { ReactNode } from "react";
import type { ExperimentDefinition } from "../../types";

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
}: ExperimentShellProps) {
  return (
    <section className="dedicated-experiment-shell" aria-label={`${title} dedicated experiment`}>
      <header className="dedicated-experiment-head">
        <div>
          <p className="ui-label">Dedicated lab</p>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="dedicated-experiment-badges" aria-label="Experiment metadata">
          <span>{experiment.category}</span>
          <span>{experiment.difficulty}</span>
          <span>{experiment.evidenceType ?? "Evidence pending"}</span>
        </div>
      </header>

      <div className="dedicated-experiment-layout">
        {controls && <aside className="dedicated-experiment-controls">{controls}</aside>}
        <main className="dedicated-experiment-main">
          <div className="dedicated-experiment-visual">{visual}</div>
          {graph && <div className="dedicated-experiment-graph">{graph}</div>}
          {teacherReplay}
        </main>
        {observations && <aside className="dedicated-experiment-observations">{observations}</aside>}
      </div>

      {mobileSheet}
      {footer && <footer className="dedicated-experiment-footer">{footer}</footer>}
    </section>
  );
}
