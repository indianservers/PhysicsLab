export interface WavefrontLayerProps {
  kind?: "plane" | "circular" | "longitudinal";
  sourceX?: number;
  sourceY?: number;
  count?: number;
  spacing?: number;
  amplitude?: number;
  label?: string;
}

export function WavefrontLayer({ kind = "plane", sourceX = 160, sourceY = 250, count = 8, spacing = 34, amplitude = 1, label = "wavefronts" }: WavefrontLayerProps) {
  if (kind === "circular") {
    return (
      <g aria-label={label}>
        {Array.from({ length: count }, (_, index) => (
          <circle key={index} cx={sourceX} cy={sourceY} r={(index + 1) * spacing} fill="none" stroke="#60a5fa" strokeWidth={2 + amplitude} opacity={0.18 + index * 0.045} strokeDasharray={index % 2 ? "8 8" : undefined} />
        ))}
        <circle cx={sourceX} cy={sourceY} r="8" fill="#facc15" />
        <text x={sourceX + 14} y={sourceY - 12} fill="#e0f2fe" fontWeight="900">source</text>
      </g>
    );
  }
  if (kind === "longitudinal") {
    return (
      <g aria-label={label}>
        {Array.from({ length: 24 }, (_, index) => {
          const x = 80 + index * 30;
          const dense = index % 6 < 3;
          return <circle key={index} cx={x} cy={sourceY + Math.sin(index) * amplitude * 7} r={dense ? 7 : 4} fill={dense ? "#93c5fd" : "#c4b5fd"} opacity={dense ? 0.95 : 0.58} />;
        })}
        <text x="82" y={sourceY - 46} fill="#e0f2fe" fontWeight="900">compressions and rarefactions</text>
      </g>
    );
  }
  return (
    <g aria-label={label}>
      {Array.from({ length: count }, (_, index) => {
        const x = sourceX + index * spacing;
        return <path key={index} d={`M ${x} 90 C ${x + 18} 150, ${x - 18} 220, ${x} 310`} fill="none" stroke="#60a5fa" strokeWidth={2 + amplitude} opacity={0.3 + index * 0.06} />;
      })}
      <text x={sourceX} y="70" fill="#e0f2fe" fontWeight="900">incoming plane wavefronts</text>
    </g>
  );
}
