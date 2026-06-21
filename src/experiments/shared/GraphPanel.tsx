export type GraphShape = "linear" | "inverse" | "quadratic" | "square-root" | "exponential" | "constant" | "qualitative";

export interface GraphPoint {
  x: number;
  y: number;
}

export interface GraphPanelProps {
  title?: string;
  xLabel: string;
  yLabel: string;
  xUnit?: string;
  yUnit?: string;
  points: GraphPoint[];
  shape: GraphShape;
  caption?: string;
}

export function GraphPanel({ title = "Graph", xLabel, yLabel, xUnit, yUnit, points, shape, caption }: GraphPanelProps) {
  const path = makePath(points);
  return (
    <section className="dedicated-graph-panel" aria-label={`${title}: ${yLabel} versus ${xLabel}`}>
      <div className="dedicated-graph-head">
        <div>
          <p className="ui-label">Graph</p>
          <h3>{title}</h3>
        </div>
        <span>{shape}</span>
      </div>
      <svg viewBox="0 0 420 240" role="img" aria-label={`${shape} graph shape`}>
        <line x1="48" y1="198" x2="390" y2="198" />
        <line x1="48" y1="198" x2="48" y2="26" />
        <text x="210" y="229">{xUnit ? `${xLabel} (${xUnit})` : xLabel}</text>
        <text x="18" y="112" transform="rotate(-90 18 112)">{yUnit ? `${yLabel} (${yUnit})` : yLabel}</text>
        {path && <polyline points={path} />}
        {points.map((point, index) => {
          const mapped = mapPoint(point, points);
          return <circle key={`${point.x}-${point.y}-${index}`} cx={mapped.x} cy={mapped.y} r="4" />;
        })}
      </svg>
      {caption && <p>{caption}</p>}
    </section>
  );
}

function makePath(points: GraphPoint[]) {
  return points.map((point) => {
    const mapped = mapPoint(point, points);
    return `${mapped.x},${mapped.y}`;
  }).join(" ");
}

function mapPoint(point: GraphPoint, points: GraphPoint[]) {
  const xs = points.map((item) => item.x);
  const ys = points.map((item) => item.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 1);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 1);
  const x = 48 + ((point.x - minX) / Math.max(1e-9, maxX - minX)) * 330;
  const y = 198 - ((point.y - minY) / Math.max(1e-9, maxY - minY)) * 160;
  return { x, y };
}
