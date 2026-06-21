import type { ReactNode } from "react";
import type { PhysicsVisualDomain } from "./domainVisualContracts";

export interface CinematicStageProps {
  domain: PhysicsVisualDomain;
  title: string;
  children?: ReactNode;
  overlay?: ReactNode;
}

export function CinematicStage({ domain, title, children, overlay }: CinematicStageProps) {
  return (
    <section className="cinematic-stage" data-domain={domain} aria-label={title}>
      <div className="cinematic-stage-grid" aria-hidden="true" />
      <div className="cinematic-stage-content">
        {children ?? (
          <div className="cinematic-stage-placeholder">
            <div>
              <strong>{title}</strong>
              <span>Premium interactive scene placeholder ready for the dedicated lab renderer.</span>
            </div>
          </div>
        )}
        {overlay}
      </div>
    </section>
  );
}
