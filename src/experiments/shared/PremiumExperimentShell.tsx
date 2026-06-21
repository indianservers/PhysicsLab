import type { CSSProperties, ReactNode } from "react";
import type { ExperimentDefinition } from "../../types";
import type { ExperimentMode } from "./experimentModes";
import type { PhysicsVisualDomain } from "./domainVisualContracts";
import { visualContractForDomain } from "./domainVisualContracts";
import { themeForDomain } from "./visualThemes";
import "./premiumExperimentShell.css";

export interface PremiumExperimentShellProps {
  experiment: ExperimentDefinition;
  domain: PhysicsVisualDomain;
  mode: ExperimentMode;
  title?: string;
  subtitle?: string;
  validationStatus?: string;
  formulaStatus?: string;
  stage: ReactNode;
  controls?: ReactNode;
  hud?: ReactNode;
  causeEffect?: ReactNode;
  replay?: ReactNode;
  inspector?: ReactNode;
  secondary?: ReactNode;
  mobileDock?: ReactNode;
}

export function PremiumExperimentShell({
  experiment,
  domain,
  mode,
  title = experiment.title,
  subtitle,
  validationStatus = "needs-benchmark",
  formulaStatus = "Formula linked to visual",
  stage,
  controls,
  hud,
  causeEffect,
  replay,
  inspector,
  secondary,
  mobileDock,
}: PremiumExperimentShellProps) {
  const theme = themeForDomain(domain);
  const contract = visualContractForDomain(domain);
  const style = {
    "--premium-accent": theme.accent,
    "--premium-accent-2": theme.accent2,
    "--premium-warning": theme.warning,
    "--premium-surface": theme.surface,
    "--premium-grid": theme.grid,
    "--premium-glow": theme.glow,
  } as CSSProperties;

  return (
    <section className="premium-experiment-shell" style={style} data-domain={domain} aria-label={`${title} premium lab`}>
      <header className="premium-shell-header">
        <div>
          <p className="premium-shell-kicker">{theme.label}</p>
          <h2 className="premium-shell-title">{title}</h2>
          <p className="premium-shell-subtitle">{subtitle ?? contract.stageLanguage}</p>
        </div>
        <div className="premium-shell-badges" aria-label="Lab status">
          <span className="premium-shell-badge">{mode}</span>
          <span className="premium-shell-badge">{validationStatus}</span>
          <span className="premium-shell-badge">{formulaStatus}</span>
        </div>
      </header>

      <div className="premium-shell-main">
        <div className="premium-shell-center">
          {stage}
          {replay}
        </div>
        <aside className="premium-shell-side" aria-label="Controls and live explanation">
          {controls}
          {hud}
          {causeEffect}
          {inspector}
        </aside>
      </div>

      {secondary && <div className="premium-shell-secondary">{secondary}</div>}
      {mobileDock && <div className="mobile-lab-dock">{mobileDock}</div>}
    </section>
  );
}
