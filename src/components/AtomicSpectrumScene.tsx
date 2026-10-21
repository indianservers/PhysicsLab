import { useId } from 'react';
import type { spectraSolution } from '../lib/atomicSpectraStudio';

export function AtomicSpectrumScene({solution:s,ni,nf}:{solution:ReturnType<typeof spectraSolution>;ni:number;nf:number}) {
  const marker=useId().replace(/:/g,'');
  const y=(n:number)=>346-(n-1)*49;
  const spectralX=(lambda:number)=>520+(lambda-380)/(750-380)*330;
  const color=(lambda:number)=>lambda<380?'#bca1ff':lambda<450?'#9988ff':lambda<500?'#6fe3ff':lambda<570?'#8aee99':lambda<620?'#ffe281':'#ff9a87';
  return <svg viewBox="0 0 900 415" role="img" aria-label={`Hydrogen-like transition n=${ni} to n=${nf}; ${s.energy.toFixed(3)} electron volts; ${s.lambda.toFixed(2)} nanometres. Level spacing is schematic; spectral positions are to wavelength scale.`}>
    <defs><marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#ffe1a0"/></marker></defs>
    <rect width="900" height="415" rx="12" fill="#08182c"/>
    <text x="35" y="32" fill="#e4f1ff" fontSize="17">Quantized levels · schematic spacing</text>
    {s.levels.map(level=><g key={level.n}><line x1="64" x2="334" y1={y(level.n)} y2={y(level.n)} stroke={level.n===ni||level.n===nf?'#a5eaff':'#55738f'} strokeWidth={level.n===ni||level.n===nf?3:1.5}/><text x="35" y={y(level.n)+5} fill="#c7e4fb" fontSize="15">{level.n}</text><text x="345" y={y(level.n)+5} fill="#c7e4fb" fontSize="14">{level.energy.toFixed(3)} eV</text></g>)}
    <path d={`M270 ${y(ni)}V${y(nf)-8}`} stroke="#ffe1a0" strokeWidth="4" markerEnd={`url(#${marker})`}/><text x="70" y="384" fill="#eaf4ff" fontSize="15">n = {ni} → {nf} · photon {s.energy.toFixed(3)} eV</text>
    <text x="505" y="32" fill="#e4f1ff" fontSize="17">Emission spectrum · {s.series} series</text>
    <rect x="520" y="65" width="330" height="230" fill="#02070e" stroke="#597895"/>
    {[380,450,550,650,750].map(lambda=><g key={lambda}><path d={`M${spectralX(lambda)} 295V302`} stroke="#9ebbd8"/><text x={spectralX(lambda)} y="322" fill="#d6e9fb" fontSize="13" textAnchor="middle">{lambda}</text></g>)}
    {s.lines.filter(line=>line.lambda>=380&&line.lambda<=750).map(line=><g key={line.ni}><line x1={spectralX(line.lambda)} x2={spectralX(line.lambda)} y1="85" y2="280" stroke={color(line.lambda)} strokeWidth={line.ni===ni?5:2} strokeDasharray={line.ni===ni?undefined:'5 4'}/>{line.ni===ni&&<path d={`M${spectralX(line.lambda)-7} 73h14l-7 9z`} fill="#fff0b9"/>}</g>)}
    <text x="685" y="348" fill="#e4f1ff" fontSize="14" textAnchor="middle">Wavelength λ (nm), 380–750 nm window</text>
    <text x="505" y="378" fill="#ffe1a0" fontSize="15">Selected: {s.lambda.toFixed(2)} nm{s.lambda<380?' · ultraviolet':s.lambda>750?' · infrared':' · visible'}</text>
    <text x="505" y="401" fill="#b7cee2" fontSize="12">Solid line / triangle = selected transition; dashed = other lines.</text>
  </svg>;
}
