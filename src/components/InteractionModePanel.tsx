import { Link } from "react-router-dom";
import { ExperimentDefinition } from "../types";
import { PhysicsIcon, PhysicsIconName, iconForExperiment } from "../lib/icons";
import { has3DAnimation } from "./Experiment3DAnimation";

export interface InteractionModePanelProps {
  experiment?: ExperimentDefinition;
  conceptTitle?: string;
  compact?: boolean;
}

type InteractionMode = {
  id: string;
  label: string;
  icon: PhysicsIconName;
  detail: string;
  href?: string;
  active: boolean;
};

export function InteractionModePanel({ experiment, conceptTitle, compact = false }: InteractionModePanelProps) {
  const modes = interactionModes(experiment);
  const title = experiment?.title ?? conceptTitle ?? "Selected concept";
  return (
    <section className={compact ? "interaction-mode-panel interaction-mode-panel-compact" : "interaction-mode-panel"}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="ui-label">Phase 3 interaction map</p>
          <h2 className={compact ? "text-lg font-black" : "text-xl font-black"}>{title}</h2>
        </div>
        <span className="status-chip status-chip-cyan">
          <PhysicsIcon name={experiment ? iconForExperiment(experiment) : "spark"} className="h-3.5 w-3.5" />
          2D + 3D ready
        </span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {modes.map((mode) => {
          const content = (
            <>
              <span className={mode.active ? "interaction-mode-icon interaction-mode-icon-active" : "interaction-mode-icon"}>
                <PhysicsIcon name={mode.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <strong>{mode.label}</strong>
                <span>{mode.detail}</span>
              </span>
            </>
          );
          if (mode.href) {
            const isInternalAnchor = mode.href.startsWith("#");
            return isInternalAnchor ? (
              <a key={mode.id} className={mode.active ? "interaction-mode-item interaction-mode-item-active" : "interaction-mode-item"} href={mode.href}>
                {content}
              </a>
            ) : (
              <Link key={mode.id} className={mode.active ? "interaction-mode-item interaction-mode-item-active" : "interaction-mode-item"} to={mode.href}>
                {content}
              </Link>
            );
          }
          return (
            <div key={mode.id} className={mode.active ? "interaction-mode-item interaction-mode-item-active" : "interaction-mode-item interaction-mode-item-muted"}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function interactionModes(experiment?: ExperimentDefinition): InteractionMode[] {
  const experimentPath = experiment ? `/experiments/${experiment.id}` : undefined;
  const threeReady = experiment ? has3DAnimation(experiment.id) : true;
  const graphReady = Boolean(experiment?.formulae.length);
  const notebookReady = Boolean(experiment?.observationColumns.length);
  return [
    {
      id: "two-d",
      label: "2D visual",
      icon: "eye",
      detail: "Animated SVG explains the cause-effect pattern.",
      href: experimentPath ?? "#",
      active: true,
    },
    {
      id: "three-d",
      label: "3D model",
      icon: "orbit",
      detail: "WebGL model supports rotate, zoom, and spatial inspection.",
      href: experimentPath ? `${experimentPath}#three-d` : undefined,
      active: threeReady,
    },
    {
      id: "sliders",
      label: "Sliders",
      icon: "settings",
      detail: "Change one variable at a time and compare output.",
      href: experimentPath ? `${experimentPath}#simulation` : undefined,
      active: true,
    },
    {
      id: "graphs",
      label: "Graphing",
      icon: "chart",
      detail: "Plot input-output trends and trial data.",
      href: experimentPath ? `${experimentPath}#simulation` : "/graphs",
      active: graphReady,
    },
    {
      id: "prediction",
      label: "Predict",
      icon: "teacher",
      detail: "Use low, middle, and high trials before concluding.",
      href: experimentPath ? `${experimentPath}#coach` : "/quiz",
      active: true,
    },
    {
      id: "notebook",
      label: "Notebook",
      icon: "clipboard",
      detail: "Record observations, formula, result, and viva checks.",
      href: experimentPath ? `${experimentPath}#notebook` : "/projects",
      active: notebookReady,
    },
  ];
}
