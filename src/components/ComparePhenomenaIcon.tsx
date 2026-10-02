import { PhysicsAtlasIcon } from './PhysicsAtlasIcon';
import type { PhysicsIconName } from '../lib/icons';
export function ComparePhenomenaIcon({name}:{name:PhysicsIconName|'grid'|'trophy'|'notebook'|'lightbulb'}) {
  if(name==='trophy') return <PhysicsAtlasIcon name="teacher"/>;
  if(name==='notebook') return <PhysicsAtlasIcon name="clipboard"/>;
  const drawing=name==='grid'?<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>:name==='lightbulb'?<><path d="M8 17c0-5-4-5-4-10a8 8 0 0 1 16 0c0 5-4 5-4 10zM9 21h6M10 24h4"/></>:name==='chart'?<><path d="M2 21l6-7 5 3 8-12M16 5h5v5"/></>:null;
  return drawing?<svg viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>:<PhysicsAtlasIcon name={name as PhysicsIconName}/>;
}
