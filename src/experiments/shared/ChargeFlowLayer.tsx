export function ChargeFlowLayer({ path = "M120 270H760", count = 16, speed = 1, direction = 1 }: { path?: string; count?: number; speed?: number; direction?: number }) {
  return (
    <g aria-label="moving charge particles">
      <path d={path} fill="none" stroke="rgba(34,211,238,.22)" strokeWidth="18" strokeLinecap="round" />
      {Array.from({ length: count }, (_, index) => {
        const x = 130 + ((index * 43 * direction + speed * 18 + 900) % 620);
        return (
          <g key={index}>
            <circle cx={x} cy="270" r="6" fill="#67e8f9" stroke="#ecfeff" />
            <text x={x - 4} y="274" fill="#082f49" fontSize="9" fontWeight="900">e</text>
          </g>
        );
      })}
      <text x="118" y="246" fill="#e0f2fe" fontWeight="900">charge flow direction</text>
    </g>
  );
}
