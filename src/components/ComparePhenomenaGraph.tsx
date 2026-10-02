import { memo, useId, useMemo } from 'react';
import { compareModel, compareValue, PHENOMENA, type CompareCard } from '../lib/comparePhenomena';
export const ComparePhenomenaGraph = memo(function ComparePhenomenaGraph({ card, seconds }: { card: CompareCard; seconds: number }) {
  const { kind, p } = card, id = useId().replace(/:/g, ''), m = compareModel(kind, p), color = PHENOMENA.find(s => s.id === kind)!.color;
  const baseSpan = kind === 'orbit' ? 30 : kind === 'pendulum' ? 8 : kind === 'wave' ? 3 : 1.5;
  const span = Math.max(baseSpan, Math.ceil(m.period / m.timeScale / baseSpan) * baseSpan);
  const limit = Math.max(kind === 'lc' ? 1 : kind === 'pendulum' ? .05 : kind === 'orbit' ? 1 : .1, Math.abs(m.amplitude));
  const y = (v: number) => 65 - v / limit * 49, x = (v: number) => 68 + v / span * 248;
  const path = useMemo(() => Array.from({ length: 501 }, (_, i) => { const t = i / 500 * span; return `${i ? 'L' : 'M'}${68 + t / span * 248} ${65 - compareValue(kind, p, t * m.timeScale) / limit * 49}`; }).join(' '), [kind, p, span, m.timeScale, limit]);
  const markerTime = seconds / m.timeScale, value = compareValue(kind, p, seconds);
  // The marker wraps the fixed time window only after an integral number of cycles.
  // Otherwise show its current physical phase at the equivalent first-cycle time.
  const graphTime = seconds / m.timeScale <= span ? markerTime : (seconds % m.period) / m.timeScale;
  const format = (v: number) => Number(v.toFixed(2)).toString();
  return <svg className="cp-graph" viewBox="0 0 330 176" role="img" aria-label={`${m.axis} versus time in ${m.timeUnit}`}>
    <defs><pattern id={id+'grid'} width="24.8" height="12.25" patternUnits="userSpaceOnUse" x="68" y="10"><path d="M24.8 0H0V12.25" fill="none" stroke="#183951" strokeWidth=".45"/></pattern><clipPath id={id+'clip'}><rect x="68" y="10" width="248" height="110"/></clipPath></defs>
    <rect x="68" y="10" width="248" height="110" fill={`url(#${id}grid)`} stroke="#244b68" strokeWidth=".7"/>
    <path d="M68 10V120H316M68 65H316" fill="none" stroke="#638fb2" strokeWidth=".7"/>
    <g clipPath={`url(#${id}clip)`}><path d={path} stroke={color} strokeWidth="1.6" fill="none"/><circle cx={x(graphTime)} cy={y(value)} r="3" fill={color}/></g>
    {[limit,0,-limit].map(v => <text key={v} x="58" y={y(v)+4} textAnchor="end" fill="#bfdbef" fontSize="12">{format(v)}</text>)}
    {[0,1,2,3,4].map(i => <g key={i}><path d={`M${x(i*span/4)} 120v4`} stroke="#648caa"/><text x={x(i*span/4)} y="140" textAnchor="middle" fill="#bad6ed" fontSize="12">{format(i*span/4)}</text></g>)}
    <text x="192" y="161" textAnchor="middle" fill="#c9e0f3" fontSize="13">Time ({m.timeUnit})</text><text transform="translate(13 67) rotate(-90)" textAnchor="middle" fill="#c9e0f3" fontSize="12">{m.axis}</text>
  </svg>;
});
