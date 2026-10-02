import { PhysicsAtlasIcon } from './PhysicsAtlasIcon';
import type { PhysicsIconName } from '../lib/icons';
export function GuidedPathIcon({name,level=false}:{name:PhysicsIconName;level?:boolean}){
 const drawing=level?<><path d="M3 17h3v5H3zM9 12h3v10H9zM15 7h3v15h-3zM21 2h3v20h-3z" fill="currentColor" stroke="none"/></>:name==='folder'?<><path d="M1 8l11-6 11 6-11 6z" fill="currentColor" strokeWidth=".5"/><path d="M5 11v7q7 6 14 0v-7M23 8v9"/></>:name==='chart'?<><path d="M3 3v18h19M6 16l5-6 4 3 7-9M18 4h4v4"/></>:name==='atom'?<><circle cx="4" cy="21" r="3"/><circle cx="15" cy="12" r="3"/><circle cx="20" cy="2" r="3"/><path d="M5 18l3-6h4M17 9l2-4"/></>:null;
 return drawing?<svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>:<PhysicsAtlasIcon name={name}/>;
}
