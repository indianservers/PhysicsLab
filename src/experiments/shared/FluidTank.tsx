import type { ReactNode } from "react";

export function FluidTank({ children, waterLevel = 310, label = "fluid tank" }: { children: ReactNode; waterLevel?: number; label?: string }) {
  return (
    <g aria-label={label}>
      <rect x="100" y="110" width="420" height="300" rx="18" fill="rgba(15,23,42,.35)" stroke="#bfdbfe" strokeWidth="4" />
      <rect x="104" y={waterLevel} width="412" height={410 - waterLevel} rx="14" fill="rgba(14,165,233,.45)" />
      <line x1="104" y1={waterLevel} x2="516" y2={waterLevel} stroke="#67e8f9" strokeWidth="5" />
      <text x="116" y="96" fill="#e0f2fe" fontWeight="900">{label}</text>
      {children}
    </g>
  );
}
