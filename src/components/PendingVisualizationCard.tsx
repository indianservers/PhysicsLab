import { ExperimentDefinition } from "../types";
import { PhysicsIcon } from "../lib/icons";
import {
  ExperimentVisualizationSpec,
  VisualizationPane,
  VisualizationPaneSpec,
  getExperimentVisualizationSpec,
} from "../lib/experimentVisualizationSpecs";

interface PendingVisualizationCardProps {
  experiment: ExperimentDefinition;
  pane: VisualizationPane;
}

export function PendingVisualizationCard({ experiment, pane }: PendingVisualizationCardProps) {
  const spec = getExperimentVisualizationSpec(experiment.id);
  const paneSpec = pane === "twoD" ? spec?.twoD : spec?.threeD;

  if (!spec || !paneSpec) {
    return (
      <section className="pending-visualization-card" aria-label={`${experiment.title} visualization metadata missing`}>
        <PendingHeader experiment={experiment} pane={pane} title="Visualization metadata missing" />
        <p className="pending-visualization-goal">
          This route needs a visualization contract before it can safely render a lab scene.
        </p>
      </section>
    );
  }

  return (
    <section className="pending-visualization-card" aria-label={`${experiment.title} ${paneLabel(pane)} pending visualization`}>
      <PendingHeader experiment={experiment} pane={pane} title="Experiment-specific visualization pending" spec={spec} />
      <p className="pending-visualization-goal">{paneSpec.studentLearningGoal}</p>
      <div className="pending-visualization-grid">
        <SpecList title="Future visualization should show" items={paneSpec.requiredVisualElements} />
        <SpecList title="Required apparatus" items={paneSpec.apparatus} empty="Apparatus list pending." />
        <SpecList title="Measurements" items={paneSpec.requiredMeasurements} />
        <SpecList title="Graphs / readouts" items={paneSpec.requiredGraphs} empty="No graph required yet." />
      </div>
      <div className="pending-visualization-footer">
        <span className="status-chip status-chip-amber">Phase {spec.phaseAssigned ?? "TBD"}</span>
        <span className="status-chip">{paneSpec.status}</span>
        <span className="status-chip">{spec.domain}</span>
      </div>
      {paneSpec.limitationCopy && <p className="pending-visualization-note">{paneSpec.limitationCopy}</p>}
      <p className="pending-visualization-reason">{pendingReason(spec, paneSpec, pane)}</p>
    </section>
  );
}

function PendingHeader({ experiment, pane, title, spec }: { experiment: ExperimentDefinition; pane: VisualizationPane; title: string; spec?: ExperimentVisualizationSpec }) {
  return (
    <div className="pending-visualization-header">
      <span className="card-icon">
        <PhysicsIcon name="flask" className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="ui-label">{paneLabel(pane)} roadmap marker</p>
        <h3>{title}</h3>
        <p>{spec?.visualIdentity ?? experiment.title}</p>
      </div>
    </div>
  );
}

function SpecList({ title, items, empty = "Pending." }: { title: string; items?: string[]; empty?: string }) {
  const visibleItems = items?.filter(Boolean) ?? [];
  return (
    <div className="pending-visualization-list">
      <div>{title}</div>
      <ul>
        {(visibleItems.length ? visibleItems : [empty]).slice(0, 4).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function paneLabel(pane: VisualizationPane) {
  return pane === "twoD" ? "2D pane" : "3D pane";
}

function pendingReason(spec: ExperimentVisualizationSpec, paneSpec: VisualizationPaneSpec, pane: VisualizationPane) {
  const paneName = pane === "twoD" ? "2D" : "3D";
  return `${paneName} is marked ${paneSpec.status}; shared engines are allowed only if ${spec.allowSharedEngineOnlyIf?.join(" and ") ?? "the scene stays experiment-specific"}.`;
}
