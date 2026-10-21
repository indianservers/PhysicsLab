import { memo, useId } from 'react';
import type { Point } from '../physics/opticalElements';

/** Decorative glass finish. The unshifted front outline remains the ray boundary. */
export const OpticalGlass = memo(function OpticalGlass({ points, index = 1.52, selected = false }: { points: Point[]; index?: number; selected?: boolean }) {
  const id = `glass-${useId().replace(/:/g, '')}`;
  const outline = points.map(p => `${p.x},${p.y}`).join(' ');
  const left = Math.min(...points.map(p => p.x)), right = Math.max(...points.map(p => p.x));
  const top = Math.min(...points.map(p => p.y)), bottom = Math.max(...points.map(p => p.y));
  const width = right - left, height = bottom - top;
  const edge = index > 1.65 ? '#527e92' : '#6a91a1';
  return <g className="oe-glass-finish" aria-hidden="true" pointerEvents="none">
    <defs>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2=".8">
        <stop stopColor="#ecfbff" stopOpacity=".22" /><stop offset=".18" stopColor="#fff" stopOpacity=".8" />
        <stop offset=".35" stopColor="#c0dfeb" stopOpacity=".28" /><stop offset=".64" stopColor="#f5fdff" stopOpacity=".1" />
        <stop offset=".88" stopColor="#9fc9d7" stopOpacity=".4" /><stop offset="1" stopColor="#edfaff" stopOpacity=".75" />
      </linearGradient>
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#fff" /><stop offset=".3" stopColor="#b4d1da" /><stop offset=".65" stopColor={edge} /><stop offset="1" stopColor="#e5faff" /></linearGradient>
      <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2=".25"><stop stopColor="#fff" stopOpacity="0" /><stop offset=".38" stopColor="#fff" stopOpacity="0" /><stop offset=".45" stopColor="#fff" stopOpacity=".65" /><stop offset=".52" stopColor="#fff" stopOpacity=".1" /><stop offset=".7" stopColor="#fff" stopOpacity="0" /></linearGradient>
      <clipPath id={`${id}-clip`}><polygon points={outline} /></clipPath>
      <filter id={`${id}-shadow`} x="-50%" y="-30%" width="200%" height="180%" colorInterpolationFilters="sRGB"><feDropShadow dx=".09" dy=".16" stdDeviation=".09" floodColor="#294858" floodOpacity=".24" /></filter>
    </defs>
    <g filter={`url(#${id}-shadow)`}>
      <polygon points={outline} transform="translate(.065 .085)" fill="#a1c1cb" fillOpacity=".38" stroke={edge} strokeWidth=".05" strokeOpacity=".65" strokeLinejoin="round" />
      <polygon points={outline} fill={`url(#${id}-body)`} stroke={`url(#${id}-edge)`} strokeWidth=".09" strokeLinejoin="round" />
    </g>
    <g clipPath={`url(#${id}-clip)`}>
      <rect x={left} y={top} width={width} height={height} fill={`url(#${id}-sheen)`} />
      <path d={`M ${left + width * .2} ${top - .1} L ${left + width * .7} ${bottom + .1}`} stroke="#fff" strokeOpacity=".42" strokeWidth=".045" fill="none" />
      <polygon points={outline} fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth=".035" transform="translate(-.025 -.035)" />
    </g>
    {selected && <polygon className="oe-glass-selection" points={outline} fill="none" stroke="#3478ef" strokeWidth=".025" strokeOpacity=".65" strokeLinejoin="round" />}
  </g>;
});
