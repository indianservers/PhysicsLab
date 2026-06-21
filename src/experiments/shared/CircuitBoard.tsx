import type { ReactNode } from "react";

export interface CircuitBoardProps {
  title: string;
  children: ReactNode;
  glow?: number;
  width?: number;
  height?: number;
}

export function CircuitBoard({ title, children, glow = 0.5, width = 900, height = 520 }: CircuitBoardProps) {
  const currentGlow = Math.max(0.12, Math.min(1, glow));

  return (
    <section className="circuit-board-card" aria-label={title}>
      <div className="circuit-board-head">
        <div>
          <p className="premium-mini-label">Live circuit / field stage</p>
          <h3>{title}</h3>
        </div>
        <span>glow = current</span>
      </div>
      <svg className="circuit-board-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <defs>
          <pattern id="circuit-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="rgba(125,211,252,.14)" />
          </pattern>
          <marker id="em-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#facc15" />
          </marker>
          <filter id="wire-glow">
            <feGaussianBlur stdDeviation={5 + currentGlow * 6} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width={width} height={height} rx="24" fill="rgba(3, 7, 18, .88)" />
        <rect width={width} height={height} rx="24" fill="url(#circuit-grid)" />
        {children}
      </svg>
    </section>
  );
}
