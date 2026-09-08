import { memo, useId } from 'react';
import { compareModel, compareWave, type CompareCard } from '../lib/comparePhenomena';

export const ComparePhenomenaScene = memo(function ComparePhenomenaScene({ card, seconds, zoom, trails }: { card: CompareCard; seconds: number; zoom: number; trails: boolean }) {
  const id = useId().replace(/:/g, ''), { kind, p } = card, m = compareModel(kind, p), phase = m.angular * seconds;
  const angle = p.angle * Math.cos(phase), orbitX = 125 + 101 * Math.cos(phase), orbitY = 141 - 101 * Math.sin(phase);
  const wavePath = Array.from({ length: 181 }, (_, i) => `${i ? 'L' : 'M'}${9 + i * 1.28} ${144 - 49 * compareWave(p, i / 180 * 2, seconds)}`).join(' ');
  const coil = 'M69 84' + 'c-4-32 12-32 8 0'.repeat(6);
  return <svg viewBox="0 0 330 275" className="cp-apparatus" role="img" aria-label={`${kind} animated apparatus`}>
    <defs>
      <linearGradient id={id + 'metal'} x2=".4" y2="1"><stop stopColor="#eaf5ff"/><stop offset=".16" stopColor="#718697"/><stop offset=".45" stopColor="#213442"/><stop offset=".73" stopColor="#9facbb"/><stop offset="1" stopColor="#142532"/></linearGradient>
      <radialGradient id={id + 'bob'} cx="30%" cy="25%"><stop stopColor="#edf6ff"/><stop offset=".18" stopColor="#bbcbd7"/><stop offset=".55" stopColor="#526372"/><stop offset="1" stopColor="#15222e"/></radialGradient>
      <radialGradient id={id + 'moon'} cx="25%" cy="30%"><stop stopColor="#e6e9eb"/><stop offset=".6" stopColor="#9ca6b0"/><stop offset="1" stopColor="#172330"/></radialGradient>
      <filter id={id + 'glow'} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>
      <clipPath id={id + 'moonclip'}><circle cx="0" cy="0" r="10"/></clipPath>
    </defs>
    <g data-scene-zoom="true" transform={`translate(150 140) scale(${zoom}) translate(-150 -140)`}>
      {kind === 'pendulum' && <>
        <path d="M128 8h78v9h-78z" fill={`url(#${id}metal)`} stroke="#bdcad7"/><path d="M128 8l-4 5v10l4-6h78" fill="#394b5d" stroke="#60778b"/>
        <circle cx="164" cy="26" r="6" fill={`url(#${id}bob)`}/>
        <path d="M44 166Q164 282 254 170" fill="none" stroke="#c4dbea" strokeDasharray="5 5" opacity=".65"/>
        {trails && [-1, 1].map(sign => <g key={sign} transform={`rotate(${sign * p.angle * 180 / Math.PI} 164 26)`} opacity=".13"><path d="M164 26v188" stroke="#92b7d6"/><circle cx="164" cy="214" r="22" fill="#8cabcb"/></g>)}
        <g transform={`rotate(${angle * 180 / Math.PI} 164 26)`}><path d="M163 29v185" stroke="#405d73" strokeWidth="3"/><path d="M165 29v185" stroke="#d4e2ec" strokeWidth="1.2"/><circle cx="164" cy="214" r="22" fill={`url(#${id}bob)`} stroke="#c3d0dc"/><ellipse cx="159" cy="205" rx="10" ry="6" fill="#eaf7ff" opacity=".2"/></g>
      </>}
      {kind === 'orbit' && <>
        {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={16 + ((i * 83) % 225)} cy={18 + ((i * 47) % 232)} r={i % 5 === 0 ? .65 : .35} fill="#749ec7" opacity={.2 + (i % 4) * .1}/>)}
        <circle cx="125" cy="141" r="101" stroke="#c9d7f7" strokeDasharray="5 5" fill="none"/>
        <image href="/assets/physics-atlas/earth.png" x="70" y="86" width="110" height="110"/>
        <path d="M140 41l12 3-8 3" fill="none" stroke="#ccdff3" transform="rotate(180 146 44)"/>
        <g transform={`translate(${orbitX} ${orbitY})`}><circle r="10" fill={`url(#${id}moon)`} stroke="#c4d2e1" strokeWidth=".6"/><g clipPath={`url(#${id}moonclip)`} fill="#566373" opacity=".35">{[[-3,-3,2],[2,4,3],[-6,3,2],[3,-6,1.7],[7,0,2]].map(([x,y,r],i)=><circle key={i} cx={x} cy={y} r={r}/>)}</g></g>
      </>}
      {kind === 'wave' && <>
        <path d="M9 144H246" stroke="#5a95bd" strokeDasharray="6 4"/>
        <path d={wavePath} stroke="#238de1" strokeWidth="6" opacity=".4" fill="none" filter={`url(#${id}glow)`}/>
        <path d={wavePath} stroke="#c2e2ff" strokeWidth="2" fill="none"/>
        <circle cx="9" cy={144 - 49 * compareWave(p, 0, seconds)} r="3" fill="#29e4f1"/><text x="12" y="220" fill="#729bbb" fontSize="10">0</text><text x="192" y="220" fill="#729bbb" fontSize="10">x = 2 m →</text>
      </>}
      {kind === 'lc' && <>
        <path d="M40 128V84H69M117 84h60v47m0 13v50H40v-54" stroke="#cde1f3" strokeWidth="1.5" fill="none"/>
        <path d={coil} stroke="#cde1f3" strokeWidth="1.3" fill="none"/>
        <path d="M19 128h20q29 7 0 12H19M155 131h46M155 144h46" fill="none" stroke="#cde1f3" strokeWidth="1.5"/>
        <text x="88" y="45" fill="#d6e4f4" fontFamily="Georgia,serif" fontStyle="italic" fontSize="23">L</text><text x="199" y="116" fill="#d6e4f4" fontFamily="Georgia,serif" fontStyle="italic" fontSize="23">C</text>
        <path d="M155 131h46" stroke={p.voltage * Math.cos(phase) >= 0 ? '#7fdfff' : '#b99bff'} strokeWidth="4" opacity={Math.abs(Math.cos(phase)) * Math.min(1, Math.abs(p.voltage) / 5) * .6}/>
        <path d="M155 144h46" stroke={p.voltage * Math.cos(phase) >= 0 ? '#b99bff' : '#7fdfff'} strokeWidth="4" opacity={Math.abs(Math.cos(phase)) * Math.min(1, Math.abs(p.voltage) / 5) * .6}/>
        <text x="208" y="135" fill="#a4c7e0" fontSize="13">{Math.abs(p.voltage * Math.cos(phase)) < 1e-9 ? '' : p.voltage * Math.cos(phase) > 0 ? '+' : '−'}</text>
        <text x="208" y="148" fill="#a4c7e0" fontSize="13">{Math.abs(p.voltage * Math.cos(phase)) < 1e-9 ? '' : p.voltage * Math.cos(phase) > 0 ? '−' : '+'}</text>
        <text x="29" y="224" fill="#8db4cf" fontSize="10">I = {(p.capacitance / 1000 * p.voltage * m.angular * Math.sin(phase)).toFixed(3)} A ↺</text>
      </>}
    </g>
  </svg>;
});
