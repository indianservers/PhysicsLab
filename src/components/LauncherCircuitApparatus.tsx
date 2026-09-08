import type { LauncherParameters } from '../lib/experimentLauncher';

export function LauncherCircuitApparatus({p,id}:{p:LauncherParameters;id:string}){
 const current=p.voltage/p.resistance;
 return <g>
  <ellipse cx="312" cy="453" rx="140" ry="17" fill="#000" opacity=".4"/>
  <path d="M195 265l31-20h199l-28 20z" fill="#455765" stroke="#8c9dab" strokeWidth=".8"/>
  <path d="M397 265l28-20v187l-28 16z" fill="#10212e" stroke="#607583" strokeWidth=".8"/>
  <rect x="195" y="265" width="202" height="183" rx="5" fill={`url(#${id}case)`} stroke="#8a9dab" strokeWidth="1.2"/>
  <path d="M201 269h190M201 443h190" stroke="#9cb0bd" strokeWidth=".7" opacity=".7"/>
  <rect x="217" y="282" width="161" height="78" rx="4" fill="#010c12" stroke="#4f6878"/>
  <path d="M221 286h153" stroke="#8bb0c6" strokeWidth=".8" opacity=".5"/>
  <text x="228" y="301" fill="#85a9b9" fontSize="10" letterSpacing="1.3">DC SUPPLY</text>
  <text x="364" y="327" textAnchor="end" fill="#b8f5df" fontSize="25" fontFamily="monospace">{p.voltage.toFixed(1)} V</text>
  <text x="364" y="347" textAnchor="end" fill="#84bbaa" fontSize="12" fontFamily="monospace">{current.toFixed(3)} A</text>
  <circle cx="226" cy="375" r="3" fill={p.voltage?'#77d2a8':'#29413d'}/><text x="237" y="379" fill="#9eb5c6" fontSize="9">IDEAL SOURCE</text>
  {Array.from({length:8},(_,i)=><path key={i} d={`M213 ${394+i*5}h69`} stroke="#010911" strokeWidth="2.3"/>)}
  {[205,387].flatMap(x=>[275,438].map(y=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="2.5" fill="#8b9ba7"/><path d={`M${x-1} ${y-1}l2 2m0-2-2 2`} stroke="#172834" strokeWidth=".7"/></g>))}
  <path d="M211 448v7h32v-7M359 448v7h28v-7" fill="#070f17"/>

  <ellipse cx="632" cy="452" rx="143" ry="12" fill="#000" opacity=".3"/>
  <path d="M510 345h233l15 11v93H510z" fill="#183f35" stroke="#69786d"/>
  <path d="M510 345h233v94H510z" fill="#07503e" stroke="#6e9380"/>
  <path d="M511 439h232l15 10H511z" fill="#092e24"/>
  {[524,730].flatMap(x=>[355,429].map(y=><g key={`${x}-${y}`}><circle cx={x} cy={y} r="4" fill="#c7c2a1"/><circle cx={x} cy={y} r="2" fill="#122d26"/></g>))}
  {Array.from({length:14},(_,i)=><g key={i}><circle cx={541+i*12} cy="394" r="1.5" fill="#a4b99f"/><circle cx={541+i*12} cy="417" r="1.5" fill="#a4b99f"/></g>)}
  <path d="M550 370v24h25m120-24v47h-24" fill="none" stroke="#b4b687" strokeWidth="2"/>
  <path d="M550 370h30M660 370h35" stroke="#bccbd4" strokeWidth="5"/>
  <rect x="579" y="358" width="82" height="24" rx="7" fill="#ae956e" stroke="#d5c19d"/>
  <path d="M585 359v22M655 359v22" stroke="#e3d9c0" strokeWidth="5"/>
  <path d="M591 361h58" stroke="#eedbb8" strokeWidth=".9" opacity=".8"/>
  <text x="620" y="374" textAnchor="middle" fill="#30281d" fontSize="11">{p.resistance} Ω</text>
  <text x="548" y="432" fill="#c6dfcf" fontSize="9" letterSpacing="1">RESISTOR TEST BOARD</text>

  <path d="M378 413C428 448 492 332 550 370" fill="none" stroke="#421717" strokeWidth="7"/>
  <path d="M378 411C428 446 492 330 550 368" fill="none" stroke="#ca5147" strokeWidth="4"/>
  <path d="M695 370C748 402 727 468 589 463S336 468 330 413" fill="none" stroke="#030a10" strokeWidth="7"/>
  <path d="M695 369C748 401 727 467 589 462S336 467 330 412" fill="none" stroke="#52636e" strokeWidth="1"/>
  {[{x:330,color:'#111c24',label:'−'},{x:378,color:'#a63a31',label:'+'}].map(({x,color,label})=><g key={x}><circle cx={x} cy="413" r="9" fill="#778996"/><circle cx={x} cy="413" r="7" fill={color}/><circle cx={x} cy="413" r="3" fill="#02080b"/><text x={x} y="398" textAnchor="middle" fill="#c7d9e5" fontSize="14">{label}</text></g>)}
  {[550,695].map(x=><g key={x}><circle cx={x} cy="370" r="4" fill="#d0d4bb"/><circle cx={x} cy="370" r="2" fill="#122019"/></g>)}
  <text x="779" y="292" fill="#cee7f6" fontSize="21">I = {current.toFixed(3)} A</text>
  <text x="779" y="319" fill="#a8c5d9" fontSize="15">P = {(p.voltage*current).toFixed(2)} W</text>
 </g>;
}
