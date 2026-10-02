import type { ReactNode } from 'react';
import { PhysicsIcon, type PhysicsIconName } from '../lib/icons';

const drawings: Partial<Record<PhysicsIconName,ReactNode>> = {
 atom: <><circle cx="12" cy="4" r="2.5"/><circle cx="4" cy="19" r="2.5"/><circle cx="20" cy="19" r="2.5"/><path d="M10.5 6.5l-5 10M13.5 6.5l5 10M6.5 19h11"/></>,
 folder: <><path d="M2 8l10-6 10 6-10 6zM2 13l10 6 10-6M2 18l10 6 10-6"/></>,
 teacher: <><path d="M7 3h10v6c0 4-2 6-5 6s-5-2-5-6zM7 5H3v3c0 3 2 5 5 5M17 5h4v3c0 3-2 5-5 5M12 15v5M8 22h8M9 20h6"/></>,
 clipboard: <><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M8 7h8M8 11h8M8 15h5M8 19h4"/></>,
 book: <><path d="M12 5C8 2 4 2 2 3v17c3-1 6-1 10 2 4-3 7-3 10-2V3c-3-1-6-1-10 2zM12 5v17"/></>,
 settings: <><path d="M9 2h6l.8 3 2 .9 2.9-.8 2.7 4.8-2.1 2.2v2.2l2.1 2.2-2.7 4.7-2.9-.7-2 .9-.8 3H9l-.8-3-2-.9-2.9.7-2.7-4.7 2.1-2.2v-2.2L.6 9.9l2.7-4.8 2.9.8 2-.9z" transform="translate(1 0) scale(.9)"/><circle cx="12" cy="12" r="4"/></>,
 orbit: <><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4.5" ry="10"/><path d="M3 8c6 2 12 2 18 0M3 16c6-2 12-2 18 0M2 12h20"/></>,
 field: <path d="M3 3h18l-7 8v10l-4-2V11z"/>,
 spark: <><path d="M8 16c0-3-4-4-4-8a8 8 0 0 1 16 0c0 4-4 5-4 8zM8 19h8M10 22h4"/></>,
 chart: <><circle cx="16" cy="4" r="2"/><path d="M14 8l-4 6-4 1M15 8l-1 7 4 3v4M10 14l-1 6H4M19 7v15M3 22h19"/></>,
};

export function PhysicsAtlasIcon({name}:{name:PhysicsIconName}) {
 const drawing=drawings[name];
 return drawing?<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg>:<PhysicsIcon name={name}/>;
}
