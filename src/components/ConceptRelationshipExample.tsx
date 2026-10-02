import { useId } from 'react';
import { relationshipReadings, type RelationshipFamily, type RelationshipParameters } from '../lib/conceptRelationships';

export function ConceptRelationshipExample({parameters:p,family}:{parameters:RelationshipParameters;family:RelationshipFamily}) {
 const id=useId().replace(/:/g,''),arrow=`${id}-arrow`,front=`${id}-front`,floor=`${id}-floor`;
 const vector=family==='kinetic'?p.speed:p.force,direction=vector<0?-1:1,length=Math.min(90,Math.abs(vector)*4.5);
 const rows=relationshipReadings(family,p);
 return <div className="cr-example-scene">
  <svg viewBox="0 0 300 180" role="img" aria-label={family==='dynamics'?`Mass ${p.mass} kilograms; net force ${p.force} newtons; acceleration ${(p.force/p.mass).toFixed(2)} metres per second squared`:`${family} relationship visual`}>
   <defs><linearGradient id={front}><stop stopColor="#7c8b95"/><stop offset="1" stopColor="#35434f"/></linearGradient><linearGradient id={floor} x2="0" y2="1"><stop stopColor="#173247"/><stop offset="1" stopColor="#020e1a"/></linearGradient><marker id={arrow} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3 0 6z" fill="#43b2ff"/></marker></defs>
   <path d="M0 76L300 105V180H0z" fill={`url(#${floor})`}/>
   {Array.from({length:12},(_,i)=><path key={i} d={`M${i*30-40} 75L${i*46-95} 180M0 ${88+i*9}L300 ${117+i*9}`} stroke="#365063" opacity=".45" strokeWidth=".65"/>)}
   {family==='dynamics'||family==='work'||family==='kinetic'||family==='power'?<>
    <ellipse cx="119" cy="129" rx="61" ry="12" fill="#010711" opacity=".85"/>
    <path d="M73 58L133 54L133 122L73 116z" fill={`url(#${front})`} stroke="#9aa9b4" strokeWidth=".65"/><path d="M133 54L165 44V106L133 122z" fill="#263743" stroke="#77848f" strokeWidth=".65"/><path d="M73 58L105 46L165 44L133 54z" fill="#99a6af" stroke="#bfccd2" strokeWidth=".65"/>
    {Array.from({length:60},(_,i)=><circle key={i} cx={77+(i*17)%52} cy={64+(i*23)%47} r=".5" fill="#d7e5e9" opacity=".25"/>)}
    {vector!==0&&<path data-vector={vector} d={`M${direction>0?153:110} 94h${direction*length}`} stroke="#269eff" strokeWidth="3" markerEnd={`url(#${arrow})`}/>}
    <text x="180" y="79" fill="#acd5ff" fontSize="13">{family==='kinetic'?`v = ${p.speed} m/s`:`F = ${p.force} N`}</text>
    {(family==='work'||family==='power')&&<><path d={`M150 147h${p.displacement*20}`} stroke="#43b2ff" strokeWidth="2" markerEnd={p.displacement?`url(#${arrow})`:undefined}/><text x="100" y="172" fill="#acd5ff" fontSize="12">d = {p.displacement} m (signed)</text></>}
    <path d="M0 121L300 177" stroke="#7794ad" strokeWidth="3"/><path d="M0 118L300 174" stroke="#bdd5e5" strokeWidth="1"/>
   </>:family==='potential'?<>
    <path d="M20 108H275" stroke="#6b91ad" strokeDasharray="5 4"/><text x="205" y="124" fill="#9abbd3" fontSize="12">h = 0</text>
    <rect x="90" y={93-p.height*4.5} width="42" height="30" rx="3" fill={`url(#${front})`} stroke="#adc8db"/>
    <path d={`M65 108v${-p.height*4.5}`} stroke="#43b2ff" strokeWidth="2" markerEnd={p.height?`url(#${arrow})`:undefined}/><text x="15" y="170" fill="#b2d9ff" fontSize="12">Height relative to chosen zero; U = {rows[2][2].toFixed(1)} J</text>
   </>:family==='fields'?<>
    {Array.from({length:11},(_,i)=><ellipse key={i} cx={48+i*18} cy="103" rx="9" ry="32" fill="none" stroke="#c88e62" strokeWidth="2"/>)}
    {p.current!==0&&[89,103,117].map(y=><path key={y} d={p.current>0?`M35 ${y}H252`:`M252 ${y}H35`} stroke="#43b2ff" strokeWidth={.5+Math.abs(p.current)*.5} markerEnd={`url(#${arrow})`}/>)}
    <text x="15" y="165" fill="#b2d9ff" fontSize="12">Ideal solenoid: signed B = {rows[2][2].toFixed(2)} mT</text>
   </>:<>
    <path d="M15 102H285M15 70V137" stroke="#5c7891" strokeWidth=".7"/>
    <path data-wave-path="true" d={Array.from({length:271},(_,i)=>{const coordinate=i/270*(family==='oscillation'?2:family==='light'?2000:3),period=family==='oscillation'?p.period:family==='light'?299792.458/p.opticalFrequency:p.wavelength;return `${i?'L':'M'}${15+i} ${102-Math.sin(coordinate/period*2*Math.PI)*25}`;}).join(' ')} fill="none" stroke="#51bfff" strokeWidth="2"/>
    <text x="15" y="156" fill="#b2d9ff" fontSize="12">{family==='oscillation'?'Displacement vs time: 0–2 s':family==='light'?'Electric field snapshot: 0–2,000 nm':'Displacement snapshot: 0–3 m'}</text>
    <text x="15" y="172" fill="#88a8c1" fontSize="10">{family==='oscillation'?'Fixed amplitude; changing T changes cycle spacing':'Fixed amplitude; spatial snapshot at t = 0'}</text>
   </>}
  </svg>
  <div className="cr-example-numbers">{(family==='dynamics'?[['m',p.mass,'kg'],['a',p.force/p.mass,'m/s²']]:rows.slice(0,2).map(r=>[r[1],r[2],r[3]])).map(([label,value,unit])=><span key={label}><i>{label}</i> = {Number(value).toFixed(1)} {unit}</span>)}</div>
 </div>;
}

