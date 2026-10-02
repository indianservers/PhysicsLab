/** Machined bench hardware; shared material ids are owned by each scene SVG. */
export function LauncherPost({x,y,id}:{x:number;y:number;id:string}){
 const sleeveTop=Math.max(y+45,421),screwY=y+36;
 return <g>
  <ellipse cx={x+3} cy="488" rx="35" ry="9" fill="#000" opacity=".55"/>
  <path d={`M${x-27} 469h48l9 8h-60z`} fill="#23313c" stroke="#75838e" strokeWidth=".7"/>
  <path d={`M${x-30} 477h60v8h-60z`} fill={`url(#${id}case)`}/>
  {[-20,20].map(dx=><g key={dx}><ellipse cx={x+dx} cy="474" rx="3.8" ry="2" fill="#b1bdc6"/><path d={`M${x+dx-1.6} 474h3.2`} stroke="#17222c" strokeWidth="1"/></g>)}
  <rect x={x-6} y={y} width="12" height={474-y} fill={`url(#${id}metal)`}/>
  <path d={`M${x-2} ${y+2}v${470-y}`} stroke="#d7e1e8" strokeWidth=".7" opacity=".6"/>
  <ellipse cx={x} cy={y} rx="6" ry="2" fill="#91a5b4" stroke="#36434d" strokeWidth=".7"/>
  <rect x={x-11} y={sleeveTop} width="22" height={474-sleeveTop} rx="2" fill={`url(#${id}case)`} stroke="#53616d" strokeWidth=".7"/>
  <ellipse cx={x} cy={sleeveTop} rx="11" ry="3" fill="#53636e"/><ellipse cx={x} cy={sleeveTop} rx="6" ry="1.6" fill="#a8b7c4"/>
  <rect x={x-12} y={y+26} width="25" height="21" rx="3" fill={`url(#${id}case)`} stroke="#80919e" strokeWidth=".65"/>
  <rect x={x+10} y={screwY-3} width="15" height="6" fill={`url(#${id}metal)`}/>
  <path d={`M${x+17} ${screwY-7}h9v14h-9z`} fill="#101820" stroke="#62727e" strokeWidth=".7"/>
  <ellipse cx={x+26} cy={screwY} rx="3" ry="7" fill="#101820" stroke="#768795" strokeWidth=".6"/>
  {[-4,-2,0,2,4].map(dy=><path key={dy} d={`M${x+18} ${screwY+dy}h7`} stroke="#80909b" strokeWidth=".5" opacity=".65"/>)}
 </g>;
}

export function LauncherRail({id}:{id:string}){
 return <g>
  <ellipse cx="505" cy="508" rx="445" ry="24" fill="#000" opacity=".4"/>
  {[91,457,850].map(x=><g key={x}><ellipse cx={x} cy="512" rx="23" ry="6" fill="#050b10"/><rect x={x-18} y="497" width="36" height="13" fill={`url(#${id}case)`}/><ellipse cx={x} cy="498" rx="18" ry="4" fill="#56616b"/></g>)}
  <path d="M58 461H893L919 478H32z" fill="#1b2730" stroke="#768a9b" strokeWidth=".7"/>
  <path d="M71 465H884L895 472H59z" fill="#060c12" stroke="#3a4d5a" strokeWidth=".7"/>
  <path d="M32 478H919V503H32z" fill={`url(#${id}case)`} stroke="#14222d"/>
  <path d="M33 480H918M33 502H918" stroke="#758c9e" strokeWidth=".6"/>
  <path d="M47 491H904v7H47z" fill="#060d15"/>
  {Array.from({length:151},(_,i)=><path key={i} d={`M${47+i*5.6} 480v${i%10===0?10:i%5===0?7:3.5}`} stroke="#a8b8c3" strokeWidth=".55"/>)}
  {[53,175,297,419,541,663,785,901].map(x=><g key={x}><circle cx={x} cy="496" r="2.6" fill="#77909f"/><path d={`M${x-1.2} 495l2.4 2m0-2-2.4 2`} stroke="#0c1720" strokeWidth=".7"/></g>)}
  <path d="M32 478l9 1v24h-9zM909 478h10v25h-10z" fill="#121e29" stroke="#6e8190" strokeWidth=".7"/>
 </g>;
}
