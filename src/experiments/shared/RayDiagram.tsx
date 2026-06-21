import type { ReactNode } from "react";

export function RayDiagram({ title, children, width = 900, height = 520 }: { title: string; children: ReactNode; width?: number; height?: number }) {
  return (
    <section className="ray-stage-card" aria-label={title}>
      <div className="ray-stage-head">
        <div>
          <p className="premium-mini-label">Optics / fluids / gas stage</p>
          <h3>{title}</h3>
        </div>
        <span>visual + measured model</span>
      </div>
      <svg className="ray-stage-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <defs>
          <pattern id="ray-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="rgba(147,197,253,.13)" />
          </pattern>
          <marker id="ray-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#facc15" />
          </marker>
        </defs>
        <rect width={width} height={height} rx="24" fill="rgba(2,6,23,.9)" />
        <rect width={width} height={height} rx="24" fill="url(#ray-grid)" />
        {children}
      </svg>
    </section>
  );
}
