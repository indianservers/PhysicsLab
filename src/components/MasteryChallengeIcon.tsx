import { ComparePhenomenaIcon } from './ComparePhenomenaIcon';
import type { ComponentProps } from 'react';

export function MasteryChallengeIcon({ name }: { name: ComponentProps<typeof ComparePhenomenaIcon>['name'] | 'levels' | 'flag' | 'tools' }) {
  const drawing = name === 'levels' ? <><path d="M4 21v-5h3v5zM10 21V10h3v11zM16 21V4h3v17z" /></> : name === 'flag' ? <><path d="M5 23V3m0 1c5-5 9 5 16 0v11c-7 5-11-5-16 0" /></> : name === 'tools' ? <><path d="M15 3a6 6 0 0 0-7 8L2 18a3 3 0 0 0 4 4l7-7a6 6 0 0 0 8-7l-4 4-5-5z" /></> : name === 'atom' ? <><ellipse cx="12" cy="13" rx="11" ry="4" /><ellipse cx="12" cy="13" rx="11" ry="4" transform="rotate(60 12 13)" /><ellipse cx="12" cy="13" rx="11" ry="4" transform="rotate(120 12 13)" /><circle cx="12" cy="13" r="1.4" fill="currentColor" /></> : null;
  return drawing ? <svg viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{drawing}</svg> : <ComparePhenomenaIcon name={name as ComponentProps<typeof ComparePhenomenaIcon>['name']} />;
}
