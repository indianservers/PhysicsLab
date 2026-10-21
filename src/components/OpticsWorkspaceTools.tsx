import { RefObject, useEffect, useMemo, useState } from 'react';
import { OpticalGlass } from './OpticalGlass';
import { placedOutline, Point } from '../physics/opticalElements';
import { downloadBlob, OpticsSetup, parseOpticsSetup, rayDash, readSavedSetups, SavedOpticsSetup, traceOpticsSetup, TracedRay } from '../physics/opticsWorkspace';

const points = (p: Point[]) => p.map(v => `${v.x},${v.y}`).join(' ');
export function OpticsValueControl({ label, value, min, max, step, unit, update, begin, end, report }: { label: string; value: number; min: number; max: number; step: number; unit: string; update: (v: number) => void | boolean; begin: () => void; end: () => void; report: (s: string) => void }) {
  const [draft, setDraft] = useState(String(Math.round(value * 1000) / 1000));
  useEffect(() => setDraft(String(Math.round(value * 1000) / 1000)), [value]);
  function commit() { const n = Number(draft); if (!draft.trim() || !Number.isFinite(n) || n < min || n > max || (step === 1 && !Number.isInteger(n))) { report(`${label} must be ${step === 1 ? 'an integer ' : ''}between ${min} and ${max}${unit}.`); setDraft(String(value)); } else { const accepted = update(n); setDraft(accepted === false ? String(value) : String(n)); } end(); }
  return <div className="oe-slider oe-exact-control"><div><label>{label}<input aria-label={`${label} value`} type="number" min={min} max={max} step={step} value={draft} onFocus={begin} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} /><span>{unit}</span></label></div><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onPointerDown={begin} onPointerUp={end} onPointerCancel={end} onBlur={end} onChange={e => update(+e.target.value)} /></div>;
}
export async function exportOpticsDiagram(svg: SVGSVGElement, format: 'svg' | 'png') {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); clone.setAttribute('width', '1600'); clone.setAttribute('height', '900');
  clone.setAttribute('font-family', 'Arial, sans-serif');
  clone.querySelectorAll('.oe-glass-hit,.oe-rotation-control,.oe-pan-help').forEach(node => node.remove());
  const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  const box = svg.viewBox.baseVal;
  for (const [key, value] of Object.entries({ x: box.x, y: box.y, width: box.width, height: box.height, fill: '#f3f6fa' })) background.setAttribute(key, String(value));
  clone.prepend(background);
  const blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml;charset=utf-8' });
  if (format === 'svg') { downloadBlob(blob, 'optics-diagram.svg'); return; }
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error('Diagram could not be rasterized')); image.src = url; });
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 900;
    const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
    context.fillStyle = '#f3f6fa'; context.fillRect(0, 0, 1600, 900);
    context.drawImage(image, 0, 0, 1600, 900);
    const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('PNG export failed')), 'image/png'));
    downloadBlob(png, 'optics-diagram.png');
  } finally { URL.revokeObjectURL(url); }
}

export function OpticsSetupTools({ setup, load, undo, redo, canUndo, canRedo, compare, svg, report }: { setup: OpticsSetup; load: (s: OpticsSetup) => void; undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean; compare: () => void; svg: RefObject<SVGSVGElement>; report: (s: string) => void }) {
  const [saved, setSaved] = useState<SavedOpticsSetup[]>(readSavedSetups);
  const [name, setName] = useState('My optics experiment'), [savedId, setSavedId] = useState('');
  const [link, setLink] = useState(''), [busy, setBusy] = useState(false);
  function persist(next: SavedOpticsSetup[]) { try { localStorage.setItem('optics-saved-v1', JSON.stringify(next)); setSaved(next); return true; } catch { report('Browser storage is unavailable or full. Download the setup JSON to keep a copy.'); return false; } }
  function save() {
    if (!name.trim()) { report('Give the experiment a name before saving.'); return; }
    if (saved.length >= 30) { report('Thirty experiments are saved. Delete a saved experiment or download this setup as JSON before saving another.'); return; }
    const entry = { id: crypto.randomUUID(), name: name.trim().slice(0, 80), setup: parseOpticsSetup(setup) };
    if (persist([...saved, entry])) { setSavedId(entry.id); report(`Saved “${entry.name}” in this browser.`); }
  }
  async function share() {
    const value = `${location.origin}${location.pathname}#optics=${encodeURIComponent(JSON.stringify(setup))}`;
    setLink(value);
    try { await navigator.clipboard.writeText(value); report('Setup link copied. It includes all glass positions, materials and laser settings.'); } catch { report('Select and copy the setup link below.'); }
  }
  async function exportImage(format: 'svg' | 'png') {
    if (!svg.current) return; setBusy(true);
    try { await exportOpticsDiagram(svg.current, format); report(`${format.toUpperCase()} diagram downloaded.`); } catch { report('Diagram export failed. Try the other format.'); } finally { setBusy(false); }
  }
  return <section className="oe-setup-tools" aria-label="Experiment tools">
    <div className="oe-tool-row"><button onClick={undo} disabled={!canUndo} title="Undo (Ctrl/Cmd+Z)">↶ Undo</button><button onClick={redo} disabled={!canRedo} title="Redo (Ctrl/Cmd+Shift+Z)">↷ Redo</button><button onClick={share}>Share setup</button><button onClick={compare}>Compare setups</button><button disabled={busy} onClick={() => exportImage('png')}>Export PNG</button><button disabled={busy} onClick={() => exportImage('svg')}>Export SVG</button></div>
    <div className="oe-tool-row oe-save-row"><input aria-label="Experiment name" maxLength={80} value={name} onChange={e => setName(e.target.value)} /><button onClick={save}>Save setup</button><select aria-label="Saved experiments" value={savedId} onChange={e => setSavedId(e.target.value)}><option value="">Choose saved experiment</option>{saved.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select><button disabled={!savedId} onClick={() => { const entry = saved.find(s => s.id === savedId); if (entry) { load(parseOpticsSetup(entry.setup)); report(`Loaded “${entry.name}”.`); } }}>Load setup</button><button disabled={!savedId} onClick={() => { if (persist(saved.filter(s => s.id !== savedId))) setSavedId(''); }}>Delete saved</button><button onClick={() => downloadBlob(new Blob([JSON.stringify(setup, null, 2)], { type: 'application/json' }), 'optics-setup.json')}>Download setup</button><label className="oe-file-button">Import setup<input aria-label="Import setup JSON" type="file" accept="application/json,.json" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; try { if (file.size > 50000) throw new Error('Too large'); load(parseOpticsSetup(JSON.parse(await file.text()))); report('Imported experiment.'); } catch { report('Invalid setup file. Use a saved optics JSON file with separated glass pieces.'); } e.target.value = ''; }} /></label></div>
    {link && <div className="oe-share-link"><label>Shareable experiment link<input aria-label="Shareable experiment link" readOnly value={link} onFocus={e => e.target.select()} /></label><button onClick={() => setLink('')}>Hide link</button><small>This local address works on this computer; a hosted copy needs the same application route.</small></div>}
  </section>;
}

function Preview({ setup, title, accessible }: { setup: OpticsSetup; title: string; accessible: boolean }) {
  const rays = useMemo(() => traceOpticsSetup(setup), [setup]);
  const central = rays[Math.floor(setup.beams / 2) * (setup.white ? 3 : 1)];
  const end = central.points[central.points.length - 1], previous = central.points[central.points.length - 2];
  const exit = Math.atan2(end.y - previous.y, end.x - previous.x) * 180 / Math.PI;
  const deviation = ((exit - setup.angle + 540) % 360) - 180;
  return <article><h3>{title}</h3><svg viewBox="-12 -6.5 24 13" role="img" aria-label={`${title} ray diagram`}><rect x="-12" y="-6.5" width="24" height="13" fill="#f0f4f8" /><path d="M -12 0 H 12" stroke="#9aacc2" strokeWidth=".025" strokeDasharray=".15 .15" />{setup.scene.map(e => <OpticalGlass key={e.id} points={placedOutline(e)} />)}{setup.on && rays.map((r, i) => <polyline key={i} points={points(r.points)} fill="none" stroke={r.color} strokeWidth=".06" strokeDasharray={rayDash(r.w, accessible)} />)}</svg><dl><div><dt>Glass pieces</dt><dd>{setup.scene.length}</dd></div><div><dt>Incident direction</dt><dd>{setup.angle}°</dd></div><div><dt>Central-ray deviation</dt><dd>{!setup.on ? 'Laser off' : central.truncated ? 'Trace limit' : !central.events.length ? 'Misses glass' : `${deviation.toFixed(2)}°`}</dd></div><div><dt>Central-ray interfaces / TIR</dt><dd>{setup.on ? `${central.events.length} / ${central.events.filter(e => e.tir).length}` : '—'}</dd></div></dl></article>;
}
export function OpticsComparison({ baseline, current, accessible, capture, close }: { baseline: OpticsSetup; current: OpticsSetup; accessible: boolean; capture: () => void; close: () => void }) {
  return <section className="oe-panel oe-comparison"><div className="oe-tool-row"><h2>Compare experiments</h2><button onClick={capture}>Replace baseline</button><button onClick={close}>Close comparison</button></div><p>The baseline is frozen. Edit the live bench to compare the resulting paths and measurements.</p><div className="oe-comparison-grid"><Preview setup={baseline} title="Baseline" accessible={accessible} /><Preview setup={current} title="Live setup" accessible={accessible} /></div></section>;
}

function angleArc(center: Point, a: Point, b: Point, radius: number) {
  const start = Math.atan2(a.y, a.x), end = Math.atan2(b.y, b.x);
  const delta = ((end - start + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
  return `M ${center.x + radius * Math.cos(start)} ${center.y + radius * Math.sin(start)} A ${radius} ${radius} 0 0 ${delta >= 0 ? 1 : 0} ${center.x + radius * Math.cos(end)} ${center.y + radius * Math.sin(end)}`;
}
export function OpticsProtractor({ ray, surface, radius }: { ray: TracedRay; surface: number; radius: number }) {
  const event = ray.events[surface]; if (!event) return null;
  const before = ray.points[surface], after = ray.points[surface + 2], p = event.point;
  const incoming = { x: before.x - p.x, y: before.y - p.y };
  const outgoing = after ? { x: after.x - p.x, y: after.y - p.y } : null;
  return <g className="oe-protractor" pointerEvents="none" aria-label={`Incidence ${event.incidence.toFixed(2)} degrees`}><circle cx={p.x} cy={p.y} r={radius} fill="#fff" fillOpacity=".6" stroke="#506a87" strokeWidth=".025" />{Array.from({ length: 36 }, (_, i) => { const t = i * Math.PI / 18; return <line key={i} x1={p.x + radius * .9 * Math.cos(t)} y1={p.y + radius * .9 * Math.sin(t)} x2={p.x + radius * Math.cos(t)} y2={p.y + radius * Math.sin(t)} stroke="#8193aa" strokeWidth=".015" />; })}<line x1={p.x - event.normal.x * radius} y1={p.y - event.normal.y * radius} x2={p.x + event.normal.x * radius} y2={p.y + event.normal.y * radius} stroke="#547080" strokeWidth=".025" strokeDasharray=".08 .06" /><path d={angleArc(p, event.normal, incoming, radius * .65)} stroke="#2455ad" strokeWidth=".05" fill="none" />{outgoing && <path d={angleArc(p, event.tir ? event.normal : { x: -event.normal.x, y: -event.normal.y }, outgoing, radius * .48)} stroke="#a24b19" strokeWidth=".05" fill="none" />}<text x={p.x + radius + .12} y={p.y - .15} fontSize=".25" fill="#244e85">θi {event.incidence.toFixed(2)}°</text><text x={p.x + radius + .12} y={p.y + .2} fontSize=".25" fill="#9a4319">{event.tir ? `θr ${event.incidence.toFixed(2)}° · TIR` : `θt ${event.refraction?.toFixed(2)}°`}</text></g>;
}

export function OpticsChallenges({ setup, rays, report }: { setup: OpticsSetup; rays: TracedRay[]; report: (s: string) => void }) {
  const [completed, setCompleted] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem('optics-challenges-v1') ?? '[]').filter((v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 4); } catch { return []; } });
  const [challenge, setChallenge] = useState(0);
  const tasks = [
    { name: 'Bend a beam', instruction: 'Make a ray enter and leave glass at an oblique angle. At least one transmitted interface must bend the ray by more than 1°.', check: () => setup.on && rays.some(r => r.events.some(e => !e.tir && e.refraction !== null && Math.abs(e.incidence - e.refraction) > 1)) },
    { name: 'Chain two glasses', instruction: 'Place two separated glass pieces so that one ray passes through both.', check: () => setup.on && rays.some(r => new Set(r.events.map(e => e.elementId)).size >= 2) },
    { name: 'Separate colours', instruction: 'Enable the three-colour source and make red and blue emerge from glass in different directions (at least 0.1° apart).', check: () => { if (!setup.on || !setup.white) return false; return Array.from({ length: setup.beams }, (_, beam) => { const blue = rays.find(r => r.beam === beam && r.w === 450), red = rays.find(r => r.beam === beam && r.w === 650); if (!blue?.events.length || !red?.events.length || blue.truncated || red.truncated) return false; const angle = (r: TracedRay) => { const a = r.points[r.points.length - 2], b = r.points[r.points.length - 1]; return Math.atan2(b.y - a.y, b.x - a.x); }; return Math.abs(Math.atan2(Math.sin(angle(blue) - angle(red)), Math.cos(angle(blue) - angle(red)))) > .1 * Math.PI / 180; }).some(Boolean); } },
    { name: 'Trap light internally', instruction: 'Rotate a prism or a curved body until a ray undergoes total internal reflection. Look for an amber interface point.', check: () => setup.on && rays.some(r => r.events.some(e => e.tir)) },
  ];
  function check() { if (!tasks[challenge].check()) { report('Not yet. Follow the challenge instructions and inspect the actual ray measurements.'); return; } const next = [...new Set([...completed, challenge])]; setCompleted(next); try { localStorage.setItem('optics-challenges-v1', JSON.stringify(next)); } catch { /* Progress remains available for this visit. */ } report(`Challenge complete: ${tasks[challenge].name}. Verified from the current traced rays.`); }
  return <section className="oe-challenges"><h2>Guided challenges</h2><label>Progress <progress max={4} value={completed.length} /> {completed.length} / 4 completed</label><div className="oe-tool-row">{tasks.map((task, i) => <button key={task.name} aria-pressed={challenge === i} onClick={() => setChallenge(i)}>{completed.includes(i) ? '✓ ' : ''}{task.name}</button>)}</div><p>{tasks[challenge].instruction}</p><button onClick={check}>Check challenge</button></section>;
}

