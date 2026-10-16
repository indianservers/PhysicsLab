import { useId } from "react";
import { workSolution, type WorkInput } from "../lib/workStudio";

export function WorkApparatus({ input }: { input: WorkInput }) {
  const id = useId().replace(/:/g, "");
  const s = workSolution(input);
  const x = 180 + input.distance * 138;
  const angle = input.angle * Math.PI / 180;
  const tipX = x + input.force * .7 * Math.cos(angle);
  const tipY = 230 - input.force * .7 * Math.sin(angle);
  return <svg viewBox="0 0 1100 400" role="img" aria-label={`Cart displaced ${input.distance.toFixed(2)} metres. Applied force ${input.force.toFixed(1)} newtons at ${input.angle.toFixed(1)} degrees. Work ${s.work.toFixed(1)} joules.`}>
    <defs>
      <linearGradient id={`${id}-metal`} x2="0" y2="1"><stop stopColor="#a2b5c4"/><stop offset=".3" stopColor="#243d50"/><stop offset=".55" stopColor="#d2e0e9"/><stop offset="1" stopColor="#20394b"/></linearGradient>
      <linearGradient id={`${id}-crate`} x2="1" y2="1"><stop stopColor="#a87f4a"/><stop offset=".5" stopColor="#725130"/><stop offset="1" stopColor="#332b24"/></linearGradient>
      <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#15364d" strokeWidth=".6"/></pattern>
      <marker id={`${id}-arrow`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#5bd9ff"/></marker>
    </defs>
    <rect width="1100" height="400" fill="#071a29"/>
    <rect width="1100" height="400" fill={`url(#${id}-grid)`}/>
    <g fill="#c9e6ff" fontFamily="monospace" fontSize="18">
      <rect x="28" y="24" width="255" height="105" rx="6" fill="#03111f" stroke="#2b5875"/>
      <text x="44" y="53">Fₓ = {s.fx.toFixed(1)} N</text><text x="44" y="82">Fᵧ = {s.fy.toFixed(1)} N</text><text x="44" y="111">F  = {input.force.toFixed(1)} N</text>
      <rect x="690" y="24" width="380" height="105" rx="6" fill="#03111f" stroke="#2b5875"/>
      <text x="710" y="55" fontFamily="Georgia" fontSize="26">W = Fd cos θ</text>
      <text x="710" y="86" fontSize="16">{input.force.toFixed(1)} × {input.distance.toFixed(2)} × cos {input.angle.toFixed(1)}°</text>
      <text x="710" y="114">W = {s.work.toFixed(1)} J</text>
    </g>
    <rect x="30" y="280" width="1040" height="35" rx="5" fill={`url(#${id}-metal)`}/>
    <path d="M55 315V350H90V315M1010 315V350H1045V315" fill="#1f3849" stroke="#7892a5"/>
    {Array.from({length:51},(_,i)=><g key={i}><line x1={180+i*13.8} y1="296" x2={180+i*13.8} y2={i%10===0?318:309} stroke="#d5e6f1"/>{i%10===0&&<text x={180+i*13.8} y="338" textAnchor="middle" fill="#bedbf1" fontSize="14">{i/10}</text>}</g>)}
    <text x="900" y="338" fill="#bedbf1" fontSize="14">m</text>
    <g data-work-cart="" data-distance={input.distance} transform={`translate(${x} 0)`}>
      <rect x="-68" y="190" width="136" height="70" rx="5" fill={`url(#${id}-crate)`} stroke="#c4a87a" strokeWidth="2"/>
      <path d="M-58 191V259M58 191V259M-67 213H67M-67 239H67" stroke="#d2b58b" strokeWidth="3" opacity=".5"/>
      <rect x="-79" y="259" width="158" height="13" rx="4" fill={`url(#${id}-metal)`}/>
      <circle cx="-48" cy="273" r="8" fill="#09131d" stroke="#a8bfce" strokeWidth="2"/><circle cx="48" cy="273" r="8" fill="#09131d" stroke="#a8bfce" strokeWidth="2"/>
      <circle cy="230" r="5" fill="#d4e8f4"/>
    </g>
    {input.force>0&&<g><line data-work-force="" x1={x} y1="230" x2={tipX} y2={tipY} stroke="#5bd9ff" strokeWidth="4" markerEnd={`url(#${id}-arrow)`}/><line x1={x} y1="230" x2={tipX} y2="230" stroke="#55b9ef" strokeDasharray="5 4"/><line x1={tipX} y1="230" x2={tipX} y2={tipY} stroke="#bb91ff" strokeDasharray="5 4"/></g>}
    <line x1="180" y1="367" x2={x} y2="367" stroke="#48dded" strokeWidth="3"/>
    <path d={`M180 356V378M${x} 356V378`} stroke="#48dded" strokeWidth="2"/>
    <text x={(180+x)/2} y="391" textAnchor="middle" fill="#55e7f7" fontSize="17">d = {input.distance.toFixed(2)} m</text>
    <text x="35" y="163" fill="#80a5bd" fontSize="13">IDEAL HORIZONTAL TRACK · APPLIED FORCE AND PRESCRIBED DISPLACEMENT</text>
  </svg>;
}

export function WorkVectorDiagram({ input }: { input: WorkInput }) {
  const s = workSolution(input);
  const x = 42 + s.fx * 1.2, y = 250 - s.fy * 1.2;
  return <svg viewBox="0 0 330 300" role="img" aria-label="Applied force and its horizontal and vertical components">
    <path d="M42 15V250H320" stroke="#7ca7c8" fill="none"/>
    <path d={`M42 250H${x}V${y}`} stroke="#60d9ef" fill="none" strokeDasharray="5 4" strokeWidth="2"/>
    <line x1="42" y1="250" x2={x} y2={y} stroke="#d3e6ff" strokeWidth="3"/>
    <circle cx={x} cy={y} r="4" fill="#6be2f7"/>
    <g fill="#c8e2f6" fontSize="15"><text x="50" y="25">y</text><text x="310" y="270">x</text><text x="52" y="285">Fₓ = {s.fx.toFixed(1)} N</text><text x="80" y="48">Fᵧ = {s.fy.toFixed(1)} N</text><text x="80" y="72">θ = {input.angle.toFixed(1)}°</text></g>
  </svg>;
}
