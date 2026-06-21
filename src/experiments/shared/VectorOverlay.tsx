export interface VectorOverlayVector {
  id: string;
  label: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}

export function VectorOverlay({ vectors, width = 640, height = 360 }: { vectors: VectorOverlayVector[]; width?: number; height?: number }) {
  return (
    <svg className="vector-overlay" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Vector overlay">
      <defs>
        {vectors.map((vector) => (
          <marker key={vector.id} id={`premium-vector-${vector.id}`} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill={vector.color ?? "var(--premium-accent)"} />
          </marker>
        ))}
      </defs>
      {vectors.map((vector) => (
        <g key={vector.id}>
          <line x1={vector.x1} y1={vector.y1} x2={vector.x2} y2={vector.y2} stroke={vector.color ?? "var(--premium-accent)"} strokeWidth="4" markerEnd={`url(#premium-vector-${vector.id})`} />
          <text x={(vector.x1 + vector.x2) / 2 + 8} y={(vector.y1 + vector.y2) / 2 - 8} fill={vector.color ?? "var(--premium-accent)"} fontWeight="900">{vector.label}</text>
        </g>
      ))}
    </svg>
  );
}
