import type { ReactNode } from "react";

export interface WaveCanvasProps {
  title: string;
  caption?: string;
  children: ReactNode;
  width?: number;
  height?: number;
}

export function WaveCanvas({ title, caption, children, width = 900, height = 520 }: WaveCanvasProps) {
  return (
    <section className="wave-canvas-card" aria-label={title}>
      <div className="wave-canvas-head">
        <div>
          <p className="premium-mini-label">Wave visual</p>
          <h3>{title}</h3>
        </div>
        <span>phase + probe model</span>
      </div>
      <svg className="wave-canvas-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <defs>
          <pattern id="wave-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="rgba(147, 197, 253, .16)" />
          </pattern>
          <marker id="wave-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#60a5fa" />
          </marker>
        </defs>
        <rect width={width} height={height} rx="22" fill="rgba(7, 17, 47, .72)" />
        <rect width={width} height={height} rx="22" fill="url(#wave-grid)" />
        {children}
      </svg>
      {caption && <p className="wave-canvas-caption">{caption}</p>}
    </section>
  );
}
