import { Dispatch, SetStateAction, useCallback, useReducer } from 'react';
import { defaultOpticsSetup, OpticsSetup, parseOpticsSetup } from '../physics/opticsWorkspace';
interface History { present: OpticsSetup; past: OpticsSetup[]; future: OpticsSetup[]; transaction: OpticsSetup | null }
type Action = { type: 'patch'; patch: Partial<OpticsSetup> | ((s: OpticsSetup) => Partial<OpticsSetup>) } | { type: 'replace'; setup: OpticsSetup } | { type: 'preview'; setup: OpticsSetup } | { type: 'undo' | 'redo' | 'begin' | 'end' };
const same = (a: OpticsSetup, b: OpticsSetup) => JSON.stringify(a) === JSON.stringify(b);
export function opticsHistoryReducer(s: History, action: Action): History {
  if(action.type==='preview')return same(action.setup,s.present)?s:{...s,present:action.setup};
  if (action.type === 'begin') return s.transaction ? s : { ...s, transaction: s.present };
  if (action.type === 'end') return !s.transaction ? s : { ...s, past: same(s.transaction, s.present) ? s.past : [...s.past, s.transaction].slice(-80), transaction: null };
  if (action.type === 'undo') { const past = s.transaction && !same(s.transaction, s.present) ? [...s.past, s.transaction] : s.past; return !past.length ? { ...s, transaction: null } : { present: past[past.length - 1], past: past.slice(0, -1), future: [s.present, ...s.future].slice(0, 80), transaction: null }; }
  if (action.type === 'redo') return !s.future.length ? s : { present: s.future[0], past: [...s.past, s.present].slice(-80), future: s.future.slice(1), transaction: null };
  if (action.type !== 'patch' && action.type !== 'replace') return s;
  const present = action.type === 'replace' ? action.setup : { ...s.present, ...(typeof action.patch === 'function' ? action.patch(s.present) : action.patch) };
  return same(present, s.present) ? s : { present, past: s.transaction ? s.past : [...s.past, s.present].slice(-80), future: [], transaction: s.transaction };
}
export function useOpticsHistory() {
  const [history, dispatch] = useReducer(opticsHistoryReducer, undefined, () => {
    let present = defaultOpticsSetup();
    try { if (location.hash.startsWith('#optics=')) present = parseOpticsSetup(JSON.parse(decodeURIComponent(location.hash.slice(8)))); } catch { /* Invalid links leave a usable default bench. */ }
    return { present, past: [], future: [], transaction: null };
  });
  const patch = useCallback((patch: Partial<OpticsSetup> | ((s: OpticsSetup) => Partial<OpticsSetup>)) => dispatch({ type: 'patch', patch }), []);
  function setter<K extends keyof OpticsSetup>(key: K): Dispatch<SetStateAction<OpticsSetup[K]>> { return value => patch(s => ({ [key]: typeof value === 'function' ? (value as (v: OpticsSetup[K]) => OpticsSetup[K])(s[key]) : value })); }
  return { setup: history.present, setter, patch, preview:(setup:OpticsSetup)=>dispatch({type:'preview',setup}), replace: (setup: OpticsSetup) => dispatch({ type: 'replace', setup }), begin: () => dispatch({ type: 'begin' }), end: () => dispatch({ type: 'end' }), undo: () => dispatch({ type: 'undo' }), redo: () => dispatch({ type: 'redo' }), canUndo: history.past.length > 0 || !!history.transaction, canRedo: history.future.length > 0 };
}
