import { useId, useRef, type PointerEvent } from 'react';
import { meterScaleState, type MeterScaleInput } from '../lib/meterScale';

export function MeterScaleScene({ input, camera, zoom = 1, preview = false, onMove }: { input: MeterScaleInput; camera: number; zoom?: number; preview?: boolean; onMove?: (value: number) => void }) {
  const id = useId().replace(/:/g, ''), state = meterScaleState(input), root = useRef<SVGSVGElement>(null), drag = useRef<{ x: number; position: number } | null>(null);
  const scale = 930 / 11.5, x = (cm: number) => (cm - state.windowStart) * scale;
  const left = x(state.position), right = x(state.position + state.length), depth = 47 * Math.sin(camera * Math.PI / 180), top = 320 - scale * Math.cos(camera * Math.PI / 180) / Math.cos(40 * Math.PI / 180);
  const pointerX = (event: PointerEvent<SVGElement>) => { const svg = root.current; if (!svg) return 0; const point = svg.createSVGPoint(); point.x = event.clientX; point.y = event.clientY; return point.matrixTransform(svg.getScreenCTM()!.inverse()).x; };
  const down = (event: PointerEvent<SVGGElement>) => { if (!onMove) return; drag.current = { x: pointerX(event), position: state.position }; event.currentTarget.setPointerCapture(event.pointerId); };
  const move = (event: PointerEvent<SVGGElement>) => { if (drag.current !== null) onMove?.(Math.round((drag.current.position + (pointerX(event) - drag.current.x) / scale) * 100) / 100); };
  const ticks = Array.from({ length: Math.round(100 / state.division) + 1 }, (_, n) => n * state.division).filter(cm => cm >= state.windowStart - 1 && cm <= state.windowStart + 12.5);
  return <svg ref={root} className={`msr-apparatus ${preview ? 'msr-preview-svg' : ''}`} viewBox={`${465 - 465 / zoom} ${275 - 275 / zoom} ${930 / zoom} ${550 / zoom}`} role="img" aria-label={`Meter rule: left ${state.left.toFixed(state.decimals)} cm, right ${state.right.toFixed(state.decimals)} cm; eye angle ${state.angle} degrees`}>
    <defs>
      <pattern id={`${id}oak`} width="1" height="1" patternContentUnits="objectBoundingBox"><image href="/assets/meter-scale/oak-grain.png" width="1" height="1" preserveAspectRatio="none"/></pattern>
      <linearGradient id={`${id}steel`} x2="0" y2="1"><stop stopColor="#dbdcda"/><stop offset=".3" stopColor="#a8a9a6"/><stop offset=".55" stopColor="#c3c2bd"/><stop offset="1" stopColor="#737778"/></linearGradient>
      <linearGradient id={`${id}wood`} x2="0" y2="1"><stop stopColor="#b08a65"/><stop offset=".35" stopColor="#805938"/><stop offset=".7" stopColor="#9b714e"/><stop offset="1" stopColor="#6f492f"/></linearGradient>
      <linearGradient id={`${id}edge`}><stop stopColor="#3d281e"/><stop offset="1" stopColor="#775438"/></linearGradient>
      <filter id={`${id}grain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".013 .5" numOctaves="3" seed="14"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feComponentTransfer><feFuncA type="linear" slope=".22"/></feComponentTransfer><feBlend in2="SourceGraphic" mode="multiply"/></filter>
      <filter id={`${id}metalgrain`} x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".4 .8" numOctaves="2" seed="3"/><feColorMatrix type="saturate" values="0"/><feComposite in2="SourceGraphic" operator="in"/><feComponentTransfer><feFuncA type="linear" slope=".22"/></feComponentTransfer><feBlend in2="SourceGraphic" mode="multiply"/></filter>
      <filter id={`${id}shadow`}><feGaussianBlur stdDeviation="5"/></filter>
      <clipPath id={`${id}ruleclip`}><rect x="0" y="320" width="930" height="144"/></clipPath>
    </defs>
    <g transform={preview ? "translate(28 -12) rotate(7 465 320) scale(.94 1)" : undefined}>
    <ellipse cx="470" cy="464" rx="510" ry="17" fill="#000" opacity=".6" filter={`url(#${id}shadow)`}/>
    <path d="M-50 320H980V458H-50z" fill={`url(#${id}steel)`} filter={`url(#${id}metalgrain)`}/>
    <path d="M-50 458H980v12H-50z" fill="#484c4d"/><path d="M-50 458H980" stroke="#e4e4de" strokeWidth="2"/>
    <g clipPath={`url(#${id}ruleclip)`} fill="#121715" fontFamily="Georgia,serif" fontWeight="600">
      {ticks.map(cm => { const whole = Math.abs(cm - Math.round(cm)) < 1e-7, half = Math.abs(cm * 2 - Math.round(cm * 2)) < 1e-7; return <g key={cm}><path d={`M${x(cm)} 320v${whole ? 40 : half ? 29 : 22}`} stroke="#111717" strokeWidth={whole ? 1.5 : .85}/>{whole && <text x={x(cm)} y="393" textAnchor="middle" fontSize="27">{Math.round(cm)}</text>}</g>; })}
      <text x="22" y="364" fontFamily="Arial,sans-serif" fontSize="19">cm</text>
    </g>
    <g className={onMove ? 'msr-draggable' : undefined} role={onMove ? 'slider' : undefined} tabIndex={onMove ? 0 : undefined} aria-label={onMove ? 'Drag block position' : undefined} aria-valuemin={onMove ? 0 : undefined} aria-valuemax={onMove ? 100 - state.length : undefined} aria-valuenow={onMove ? state.position : undefined} onPointerDown={down} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onKeyDown={event => { if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) { event.preventDefault(); onMove?.(event.key === 'Home' ? 0 : event.key === 'End' ? 100 - state.length : state.position + (event.key === 'ArrowRight' ? .1 : -.1)); } }}>
      <path d={`M${left} ${top}l10 ${-depth}h${right-left}l-10 ${depth}z`} fill={`url(#${id}oak)`}/>
      <path d={`M${right} ${top}l10 ${-depth}v${320-top}l-10 ${depth}z`} fill={`url(#${id}edge)`}/>
      <path d={`M${left} ${top}H${right}V320H${left}z`} fill={`url(#${id}oak)`}/>
      <path d={`M${left} ${top}H${right}`} stroke="#e6bb91" strokeWidth="1.5"/>
    </g>
    {[{from:left,to:x(state.apparentLeft)},{from:right,to:x(state.apparentRight)}].map(({from,to},i)=><g key={i} stroke="#8de3ed" fill="#08bcea"><path d={`M${from} ${top-18}V${top}L${to} 320v37`} strokeDasharray="5 4" fill="none" strokeWidth="1.4"/><path d={`M${to-8} 312h16l-8 17z`} strokeWidth="1.5"/></g>)}
    </g>

  </svg>;
}
