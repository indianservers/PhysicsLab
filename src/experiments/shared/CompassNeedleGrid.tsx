export function CompassNeedleGrid({ x = 110, y = 90, cols = 4, rows = 3, reverse = false }: { x?: number; y?: number; cols?: number; rows?: number; reverse?: boolean }) {
  return (
    <g aria-label="compass needle grid">
      {Array.from({ length: cols * rows }, (_, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const cx = x + col * 60;
        const cy = y + row * 60;
        return (
          <g key={index} transform={`rotate(${reverse ? 210 : 30} ${cx} ${cy})`}>
            <circle cx={cx} cy={cy} r="18" fill="rgba(15,23,42,.82)" stroke="#bfdbfe" />
            <path d={`M${cx - 14} ${cy} L${cx + 14} ${cy} L${cx + 5} ${cy - 5} M${cx + 14} ${cy} L${cx + 5} ${cy + 5}`} fill="none" stroke="#facc15" strokeWidth="3" />
          </g>
        );
      })}
      <text x={x} y={y + rows * 60 + 16} fill="#e0f2fe" fontWeight="900">compass needles show direction</text>
    </g>
  );
}
