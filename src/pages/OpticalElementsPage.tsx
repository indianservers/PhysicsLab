import { CSSProperties, PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { StudioLabNav } from '../components/StudioLabNav';
import {useStudioVisualModel} from '../lib/studioVisualModel';
import { OpticalGlass } from '../components/OpticalGlass';
import { OpticsChallenges, OpticsComparison, OpticsProtractor, OpticsSetupTools, OpticsValueControl } from '../components/OpticsWorkspaceTools';
import { useOpticsHistory } from '../hooks/useOpticsHistory';
import { defaultOpticsSetup, OpticsSetup, opticsResponse, parseOpticsSetup, rayDash, rayKey, shapeCategory, traceOpticsSetup } from '../physics/opticsWorkspace';
import { canPlaceElement, elementOutline, ElementKind, glasses, glassIndex, GLASS_CATALOG_SOURCE, opticalElementCatalog, placedOutline, PlacedElement, Point } from '../physics/opticalElements';
import './optical-elements.css';

const path = (points: Point[]) => points.map(p => `${p.x},${p.y}`).join(' ');
const initialScene = (): PlacedElement[] => [{ id: 1, kind: 'prism', material: 0, rotation: 0, x: 0, y: 0, scale: .75 }];
const MAX_ELEMENTS = 6;
const round = (v: number) => Math.round(v * 100) / 100;
const getShape = (kind: ElementKind) => opticalElementCatalog.find(e => e.id === kind)!;

export default function OpticalElementsPage() {
  const workspace = useOpticsHistory();
  const { scene, angle, wavelength, beams, spacing, on, normals, white } = workspace.setup;
  const setScene = workspace.setter('scene'), setAngle = workspace.setter('angle'), setWavelength = workspace.setter('wavelength'), setBeams = workspace.setter('beams'), setSpacing = workspace.setter('spacing'), setOn = workspace.setter('on'), setNormals = workspace.setter('normals'), setWhite = workspace.setter('white');
  const [selectedId, setSelectedId] = useState(1);
  const nextId = useRef(2);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('Choose a shape to add glass. Drag any piece on the bench to move it.');
  const [category, setCategory] = useState('All shapes'), [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<ElementKind[]>(() => { try { const value = JSON.parse(localStorage.getItem('optics-favorites-v1') ?? '[]'); return Array.isArray(value) ? value.filter(v => opticalElementCatalog.some(e => e.id === v)) : []; } catch { return []; } });
  const [snap, setSnap] = useState(false), [guides, setGuides] = useState(true), [accessible, setAccessible] = useState(false);
  const [zoom, setZoom] = useState(1), [pan, setPan] = useState({ x: 0, y: 0 }), [panMode, setPanMode] = useState(false);
  const [expanded, setExpanded] = useState(false), [drawerOpen, setDrawerOpen] = useState(() => window.innerWidth > 650), [drawerHeight, setDrawerHeight] = useState(70);
  const [raySelection, setRaySelection] = useState('all'), [protractor, setProtractor] = useState(false), [surface, setSurface] = useState(0), [protractorRadius, setProtractorRadius] = useState(.9);
  const [baseline, setBaseline] = useState<OpticsSetup | null>(null);
  const [context, setContext] = useState<{ id: number; x: number; y: number } | null>(null);
  const [tab, setTab] = useState('Measurements');
  const [materialInfoPinned,setMaterialInfoPinned]=useState(false);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  const panRef = useRef<{ pointerId: number; x: number; y: number; start: Point; scale: number } | null>(null);
  const dragRef = useRef<{ id: number; pointerId: number; offset: Point; mode?: 'rotate' } | null>(null);
  const selected = scene.find(e => e.id === selectedId) ?? scene[0];
  const description = selected ? getShape(selected.kind) : null;
  const n = selected ? glassIndex(selected.material, wavelength) : 1;
  const outlines = useMemo(() => scene.map(e => ({ ...e, polygon: placedOutline(e) })), [scene]);
  const thumbnailOutlines = useMemo(() => new Map(opticalElementCatalog.map(e => [e.id, elementOutline(e.id)])), []);
  const rays = useMemo(() => traceOpticsSetup(workspace.setup), [workspace.setup]);
  const central = rays.find(r => rayKey(r) === raySelection) ?? rays[Math.floor(beams / 2) * (white ? 3 : 1)];
  const visibleRays = raySelection === 'all' ? rays : [central];
  useStudioVisualModel({route:'/optics/optical-elements',input:{...workspace.setup,raySelection},outputs:{s:opticsResponse(workspace.setup,central)},
    apply:patch=>{const setup=parseOpticsSetup({...workspace.setup,...patch});endDrag();workspace.preview(setup);if(typeof patch.raySelection==='string')setRaySelection(patch.raySelection)},
    scene:{zoom,pan,layers:{grid:guides},accessible,panMode},sceneSetters:{zoom:setZoom,pan:setPan,layers:value=>setGuides(value.grid),accessible:setAccessible,panMode:setPanMode},
    resetSceneView:()=>{setZoom(1);setPan({x:0,y:0});setPanMode(false)}});
  const matchingShapes = opticalElementCatalog.filter(e => `${e.name} ${e.description}`.toLowerCase().includes(query.toLowerCase()) && (category === 'All shapes' || shapeCategory(e.id) === category) && (!favoritesOnly || favorites.includes(e.id)));

  useEffect(() => { nextId.current = Math.max(0, ...scene.map(e => e.id)) + 1; }, [scene]);
  useEffect(() => { if (location.hash.startsWith('#optics=')) { try { parseOpticsSetup(JSON.parse(decodeURIComponent(location.hash.slice(8)))); } catch { setMessage('This experiment link is invalid. A default bench has been opened.'); } } }, []);
  useEffect(() => { if (raySelection !== 'all' && !rays.some(r => rayKey(r) === raySelection)) setRaySelection('all'); if (surface >= central.events.length) setSurface(0); }, [rays, raySelection, surface, central.events.length]);
  useEffect(() => {
    const handler = () => setExpanded(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler); return () => document.removeEventListener('fullscreenchange', handler);
  }, []);
  useEffect(() => {
    const handler = () => { if (!location.hash.startsWith('#optics=')) return; try { loadSetup(parseOpticsSetup(JSON.parse(decodeURIComponent(location.hash.slice(8))))); setMessage('Shared experiment loaded.'); } catch { setMessage('This experiment link is invalid. The current bench has been kept.'); } };
    window.addEventListener('hashchange', handler); return () => window.removeEventListener('hashchange', handler);
  });
  useEffect(() => {
    const close = () => setContext(null);
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { close(); if (!document.fullscreenElement) setExpanded(false); } if ((event.target as HTMLElement)?.closest('input,select,textarea,[contenteditable=true]')) return; if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); endDrag(); event.shiftKey ? workspace.redo() : workspace.undo(); } if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); endDrag(); workspace.redo(); } };
    window.addEventListener('click', close); window.addEventListener('keydown', key);
    return () => { window.removeEventListener('click', close); window.removeEventListener('keydown', key); };
  });

  function loadSetup(setup: OpticsSetup) { endDrag(); workspace.replace(setup); setSelectedId(setup.scene[0]?.id ?? 0); nextId.current = Math.max(0, ...setup.scene.map(e => e.id)) + 1; setContext(null); }
  function toggleFavorite(kind: ElementKind) { const next = favorites.includes(kind) ? favorites.filter(k => k !== kind) : [...favorites, kind]; setFavorites(next); try { localStorage.setItem('optics-favorites-v1', JSON.stringify(next)); } catch { setMessage('Favorites are available for this visit; browser storage is unavailable.'); } }
  async function toggleFullscreen() { if (document.fullscreenElement) { await document.exitFullscreen(); return; } if (expanded) { setExpanded(false); return; } try { await benchRef.current?.requestFullscreen(); } catch { setExpanded(true); } }

  function updateElement(id: number, patch: Partial<PlacedElement>) {
    const existing = scene.find(e => e.id === id);
    if (!existing) return false;
    const candidate = { ...existing, ...patch, id };
    if (!canPlaceElement(candidate, scene)) { setMessage('Keep glass pieces apart and inside the bench. Move a neighbouring piece or reduce the size.'); return false; }
    setScene(scene.map(e => e.id === id ? candidate : e));
    setMessage(`Glass ${id} updated. Rays are recalculated through every surface.`);
    return true;
  }

  function addElement(kind: ElementKind, copy?: PlacedElement, position?: Point) {
    if (scene.length >= MAX_ELEMENTS) { setMessage('The bench holds six pieces. Remove one to add another.'); return; }
    const candidate: PlacedElement = { id: nextId.current, kind, material: selected?.material ?? 0, rotation: 0, x: 0, y: 0, scale: .65, ...copy };
    candidate.id = nextId.current;
    const slots = position ? [{ x: round(position.x), y: round(position.y) }] : [0, -3, 3].flatMap(y => [-6, -3, 0, 3, 6, 9, -9].map(x => ({ x, y })));
    for (const { x, y } of slots) {
      const placement = { ...candidate, x, y };
      if (canPlaceElement(placement, scene)) {
        setScene([...scene, placement]); setSelectedId(placement.id); nextId.current++;
        setMessage(`Added ${getShape(kind).name.toLowerCase()} as glass ${placement.id}. Drag it or use the position controls.`);
        return;
      }
    }
    setMessage(position ? 'Drop on a clear area inside the bench, leaving space between glass pieces.' : 'No free space for this piece. Reduce its size or move another piece, then try again.');
  }

  function removeElement(id: number) {
    const remaining = scene.filter(e => e.id !== id);
    setScene(remaining); setSelectedId(remaining[0]?.id ?? 0);
    setMessage('Glass removed. Choose a shape to add a new piece.');
  }
  function removeSelected() { if (selected) removeElement(selected.id); }

  function loadPreset(preset: 'single' | 'lenses' | 'prisms') {
    endDrag();
    const pieces = preset === 'single' ? initialScene() : preset === 'lenses' ? [
      { id: 1, kind: 'convex' as const, material: 0, rotation: 0, x: -3, y: 0, scale: .8 },
      { id: 2, kind: 'concave' as const, material: 1, rotation: 0, x: 3, y: 0, scale: .8 },
    ] : [
      { id: 1, kind: 'equilateral-prism' as const, material: 0, rotation: 20, x: -3, y: 0, scale: .8 },
      { id: 2, kind: 'equilateral-prism' as const, material: 25, rotation: -160, x: 3, y: 3, scale: .8 },
    ];
    workspace.patch({ scene: pieces, angle: 0, beams: 3, spacing: .65, on: true, white: preset === 'prisms' });
    setSelectedId(1); nextId.current = pieces.length + 1;
    setMessage('Preset loaded. Select either glass to change its material, rotation, size, or position.');
  }

  function reset() { loadSetup(defaultOpticsSetup()); setQuery(''); setCategory('All shapes'); setFavoritesOnly(false); setTab('Measurements'); setMessage('Experiment reset. Undo restores the previous setup.'); }

  function localPoint(event: { clientX: number; clientY: number }): Point | null {
    const matrix = svgRef.current?.getScreenCTM();
    if (!matrix) return null;
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  }

  function beginDrag(event: ReactPointerEvent<SVGGElement>, element: PlacedElement) {
    if (!event.isPrimary || event.button !== 0 || panMode) return;
    const p = localPoint(event);
    if (!p) return;
    event.preventDefault(); setSelectedId(element.id); setDraggingId(element.id);
    workspace.begin();
    dragRef.current = { id: element.id, pointerId: event.pointerId, offset: { x: p.x - element.x, y: p.y - element.y } };
    svgRef.current?.setPointerCapture(event.pointerId);
    setMessage(`Moving glass ${element.id}. Release to place it; the rays update as you drag.`);
  }

  function endDrag(event?: ReactPointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (event && drag && event.pointerId !== drag.pointerId) return;
    const panning = panRef.current;
    if (event && panning && event.pointerId !== panning.pointerId) return;
    panRef.current = null;
    dragRef.current = null; setDraggingId(null);
    workspace.end();
    if (drag && svgRef.current?.hasPointerCapture(drag.pointerId)) svgRef.current.releasePointerCapture(drag.pointerId);
    if (panning && svgRef.current?.hasPointerCapture(panning.pointerId)) svgRef.current.releasePointerCapture(panning.pointerId);
  }

  function startPan(event: ReactPointerEvent<SVGSVGElement>) {
    if (!event.isPrimary || (!panMode && event.button !== 1)) return;
    if ((event.target as Element).closest('.oe-rotation-control')) return;
    event.preventDefault(); const scale = svgRef.current?.getScreenCTM()?.a ?? 1;
    panRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, start: pan, scale };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function startRotate(event: ReactPointerEvent<SVGGElement>) {
    if (!selected || !event.isPrimary || event.button !== 0) return;
    const p = localPoint(event); if (!p) return;
    event.preventDefault(); event.stopPropagation(); workspace.begin(); setDraggingId(selected.id);
    dragRef.current = { id: selected.id, pointerId: event.pointerId, mode: 'rotate', offset: { x: Math.atan2(p.y - selected.y, p.x - selected.x) * 180 / Math.PI - selected.rotation, y: 0 } };
    svgRef.current?.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: ReactPointerEvent<SVGSVGElement>) {
    const panning = panRef.current;
    if (panning && panning.pointerId === event.pointerId) { setPan({ x: panning.start.x - (event.clientX - panning.x) / panning.scale, y: panning.start.y - (event.clientY - panning.y) / panning.scale }); return; }
    const drag = dragRef.current, p = localPoint(event);
    if (!drag || !p || event.pointerId !== drag.pointerId) return;
    const existing = scene.find(e => e.id === drag.id);
    if (!existing) { endDrag(); return; }
    if (drag.mode === 'rotate') { const step = event.shiftKey ? 15 : 1; const raw = Math.atan2(p.y - existing.y, p.x - existing.x) * 180 / Math.PI - drag.offset.x; updateElement(existing.id, { rotation: ((Math.round(raw / step) * step + 540) % 360) - 180 }); return; }
    const local = elementOutline(existing.kind, existing.rotation).map(v => ({ x: v.x * existing.scale, y: v.y * existing.scale }));
    // Keep the entire glass inside the bench even when the pointer leaves it.
    const targetX = snap ? Math.round((p.x - drag.offset.x) * 4) / 4 : p.x - drag.offset.x;
    const targetY = snap ? Math.round((p.y - drag.offset.y) * 4) / 4 : p.y - drag.offset.y;
    const x = Math.max(-11 - Math.min(...local.map(v => v.x)), Math.min(11 - Math.max(...local.map(v => v.x)), targetX));
    const y = Math.max(-5.5 - Math.min(...local.map(v => v.y)), Math.min(5.5 - Math.max(...local.map(v => v.y)), targetY));
    updateElement(drag.id, { x, y });
  }

  const slider = (label: string, value: number, min: number, max: number, step: number, unit: string, update: (v: number) => void) => <OpticsValueControl key={label} {...{ label, value, min, max, step, unit, update }} begin={workspace.begin} end={workspace.end} report={setMessage} />;

  return <div className="oe-lab">
    <header className="oe-header"><div><Link to="/concept-studio/optics">← Optics studio</Link><h1>Optical Elements & Beam Focusing Lab</h1><p>Build a light path with multiple glass pieces. Move, rotate, and explore.</p></div><span className="oe-badge">{opticalElementCatalog.length} SHAPES · {glasses.length} MATERIALS</span></header>
    <StudioLabNav studioId="optics" />
    <main>
      <OpticsSetupTools setup={workspace.setup} load={loadSetup} undo={() => { endDrag(); workspace.undo(); }} redo={() => { endDrag(); workspace.redo(); }} canUndo={workspace.canUndo} canRedo={workspace.canRedo} compare={() => setBaseline(workspace.setup)} svg={svgRef} report={setMessage} />
      <div className="oe-preset-bar"><span>Start with a setup</span><button onClick={() => loadPreset('single')}>Single prism</button><button onClick={() => loadPreset('lenses')}>Lens pair</button><button onClick={() => loadPreset('prisms')}>Two-glass spectrum</button><span className="oe-capacity">{scene.length} / {MAX_ELEMENTS} pieces</span></div>
      <div className="oe-workbench">
        <aside className="oe-panel oe-library"><h2>Glass shape library <span>{opticalElementCatalog.length}</span></h2><p>Click to add, or drag a shape onto the bench.</p>
          <input className="oe-search" aria-label="Search glass shapes" placeholder="Search lens, cone, prism…" value={query} onChange={e => setQuery(e.target.value)} />
          <label className="oe-select">Shape category<select aria-label="Shape category" value={category} onChange={e => setCategory(e.target.value)}>{['All shapes', 'Lenses', 'Prisms', 'Blocks', 'Curved glass'].map(c => <option key={c}>{c}</option>)}</select></label><label className="oe-check"><input type="checkbox" checked={favoritesOnly} onChange={e => setFavoritesOnly(e.target.checked)} />Favorites only</label>
          <div className="oe-elements">{matchingShapes.map(e => <div className="oe-library-card" key={e.id}><button disabled={scene.length >= MAX_ELEMENTS} draggable={scene.length < MAX_ELEMENTS} aria-label={`Add ${e.name}`} onDragStart={event => { event.dataTransfer.setData('application/x-optical-shape', e.id); event.dataTransfer.effectAllowed = 'copy'; endDrag(); }} onDragEnd={() => setDropActive(false)} onClick={() => addElement(e.id)}><svg viewBox="-3 -3 6 6" aria-hidden="true"><OpticalGlass points={thumbnailOutlines.get(e.id)!} /></svg><strong>{e.name}</strong><small>{e.description}</small><span className="oe-add-mark">+</span></button><button className="oe-favorite" aria-label={`Favorite ${e.name}`} aria-pressed={favorites.includes(e.id)} onClick={() => toggleFavorite(e.id)}>{favorites.includes(e.id) ? '★' : '☆'}</button></div>)}</div>
          {!matchingShapes.length && <p>No matching shapes. Change the category, favorites filter, or search.</p>}
          {scene.length >= MAX_ELEMENTS && <p>Six pieces placed. Remove a piece to add another.</p>}
        </aside>

        <section ref={benchRef} data-studio-scene className={`oe-bench${expanded ? ' oe-bench-expanded' : ''}`}>
          <div className="oe-bench-title"><span>INTERACTIVE RAY BENCH</span><span>Grid: 1 cm · air n = 1</span></div>
          <div className="oe-view-tools"><button aria-label="Zoom out" disabled={zoom <= .6} onClick={() => setZoom(z => Math.max(.6, z - .2))}>−</button><output aria-label="Bench zoom">{Math.round(zoom * 100)}%</output><button aria-label="Zoom in" disabled={zoom >= 3} onClick={() => setZoom(z => Math.min(3, z + .2))}>+</button><button aria-pressed={panMode} onClick={() => setPanMode(v => !v)}>Pan view</button><button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); setPanMode(false); }}>Reset view</button><button aria-pressed={expanded} onClick={toggleFullscreen}>{expanded ? 'Exit fullscreen' : 'Fullscreen bench'}</button></div>
          <div className="oe-view-options"><label><input type="checkbox" checked={snap} onChange={e => setSnap(e.target.checked)} />Snap to 0.25 cm grid</label><label><input type="checkbox" checked={guides} onChange={e => setGuides(e.target.checked)} />Alignment guides</label><label><input type="checkbox" checked={accessible} onChange={e => setAccessible(e.target.checked)} />Accessible ray patterns</label></div>
          <div className="oe-scene-list" aria-label="Glass pieces on bench">{scene.map(e => <button key={e.id} aria-pressed={e.id === selected?.id} onClick={() => setSelectedId(e.id)}>{e.id} · {getShape(e.kind).name}</button>)}{!scene.length && <span>The bench is empty. Add a glass shape.</span>}</div>
          <svg ref={svgRef} className={`oe-diagram${draggingId !== null ? ' oe-dragging' : ''}${panMode ? ' oe-pan-mode' : ''}${dropActive ? ' oe-drop-active' : ''}`} viewBox={`${-12 / zoom + pan.x} ${-6.5 / zoom + pan.y} ${24 / zoom} ${13 / zoom}`} role="group" aria-label={`Interactive optical bench with ${scene.length} glass pieces`} onPointerDown={startPan} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragOver={event => { if (event.dataTransfer.types.includes('application/x-optical-shape')) { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setDropActive(true); } }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropActive(false); }} onDrop={event => {
            event.preventDefault(); setDropActive(false);
            const kind = event.dataTransfer.getData('application/x-optical-shape'), position = localPoint(event);
            if (position && opticalElementCatalog.some(e => e.id === kind)) addElement(kind as ElementKind, undefined, snap ? { x: Math.round(position.x * 4) / 4, y: Math.round(position.y * 4) / 4 } : position);
          }}>
            <defs><pattern id="oe-grid" width="1" height="1" patternUnits="userSpaceOnUse"><path d="M 1 0 L 0 0 0 1" fill="none" stroke="#cbd5e1" strokeWidth=".016" /></pattern><linearGradient id="oe-glass"><stop stopColor="#ffffff" stopOpacity=".85" /><stop offset=".45" stopColor="#9dcaf1" stopOpacity=".4" /><stop offset="1" stopColor="#d5efff" stopOpacity=".85" /></linearGradient></defs>
            <rect x="-12" y="-6.5" width="24" height="13" fill="url(#oe-grid)" /><path d="M -12 0 H 12 M 0 -6.5 V 6.5" stroke="#94a3b8" strokeWidth=".02" strokeDasharray=".12 .12" />
            {draggingId !== null && guides && selected && scene.filter(e => e.id !== selected.id).map(e => <g className="oe-alignment-guide" key={e.id} pointerEvents="none">{Math.abs(e.x - selected.x) < .15 && <line x1={e.x} y1="-5.5" x2={e.x} y2="5.5" stroke="#a15cbd" strokeWidth=".025" strokeDasharray=".1 .1" />}{Math.abs(e.y - selected.y) < .15 && <line x1="-11" y1={e.y} x2="11" y2={e.y} stroke="#a15cbd" strokeWidth=".025" strokeDasharray=".1 .1" />}</g>)}
            {outlines.map(e => <g key={e.id} className="oe-glass-piece" role="button" tabIndex={0} aria-label={`Select glass ${e.id}: ${getShape(e.kind).name}`} aria-pressed={e.id === selected?.id} onContextMenu={event => { event.preventDefault(); setSelectedId(e.id); setContext({ id: e.id, x: Math.min(event.clientX, window.innerWidth - 180), y: Math.min(event.clientY, window.innerHeight - 120) }); }} onPointerDown={event => beginDrag(event, e)} onClick={() => setSelectedId(e.id)} onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedId(e.id); }
              const delta = event.shiftKey ? .5 : .1;
              const movement = ({ ArrowLeft: { x: e.x - delta }, ArrowRight: { x: e.x + delta }, ArrowUp: { y: e.y - delta }, ArrowDown: { y: e.y + delta } } as Record<string, Partial<PlacedElement>>)[event.key];
              if (movement) { event.preventDefault(); setSelectedId(e.id); updateElement(e.id, movement); }
            }}><OpticalGlass points={e.polygon} index={glassIndex(e.material, wavelength)} selected={e.id === selected?.id} /><polygon className="oe-glass-hit" points={path(e.polygon)} fill="transparent" stroke="transparent" strokeWidth="14" vectorEffect="non-scaling-stroke" pointerEvents="all" /><text className="oe-glass-label" x={e.x} y={Math.min(...e.polygon.map(p => p.y)) - .35} textAnchor="middle" fontSize=".3" fill="#36547b">{e.id} · {getShape(e.kind).name}</text></g>)}
            {on && visibleRays.map(r => <g key={rayKey(r)} className="oe-ray" data-ray={rayKey(r)} pointerEvents="none"><polyline points={path(r.points)} fill="none" stroke={r.color} strokeWidth=".15" opacity=".13" /><polyline className="oe-ray-path" points={path(r.points)} fill="none" stroke={r.color} strokeWidth={accessible ? '.055' : '.035'} strokeDasharray={rayDash(r.w, accessible)} strokeLinejoin="round" />{accessible && r.events[0] && <text x={r.events[0].point.x - .9} y={r.events[0].point.y - .15} fontSize=".2" fill={r.color}>{r.beam + 1}: {r.w}nm</text>}{normals && r === central && r.events.map((e, j) => <g key={j}><line x1={e.point.x - e.normal.x * .65} y1={e.point.y - e.normal.y * .65} x2={e.point.x + e.normal.x * .65} y2={e.point.y + e.normal.y * .65} stroke="#64748b" strokeWidth=".025" strokeDasharray=".08 .06" /><circle cx={e.point.x} cy={e.point.y} r=".07" fill={e.tir ? '#e59417' : '#2563eb'} /></g>)}</g>)}
            {on && protractor && <OpticsProtractor ray={central} surface={surface} radius={protractorRadius} />}
            {selected && <g className="oe-rotation-control" role="slider" tabIndex={0} aria-label="Rotate selected glass" aria-valuemin={-180} aria-valuemax={180} aria-valuenow={selected.rotation} onPointerDown={startRotate} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); updateElement(selected.id, { rotation: ((selected.rotation + (event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -5 : 5) + 540) % 360) - 180 }); } }}><line x1={selected.x} y1={selected.y} x2={selected.x} y2={Math.min(...placedOutline(selected).map(p => p.y)) - .85} stroke="#3478ef" strokeWidth=".025" strokeDasharray=".1 .1" pointerEvents="none" /><circle cx={selected.x} cy={Math.min(...placedOutline(selected).map(p => p.y)) - .85} r=".22" fill="#fff" stroke="#3478ef" strokeWidth=".04" /><text x={selected.x} y={Math.min(...placedOutline(selected).map(p => p.y)) - .77} textAnchor="middle" fontSize=".25" fill="#235da9" pointerEvents="none">↻</text></g>}
            {Array.from({ length: 23 }, (_, i) => <text key={i} x={i - 11} y="6.2" textAnchor="middle" fontSize=".25" fill="#64748b">{i - 11}</text>)}
          </svg>
          <div className="oe-inspection-tools"><label>Inspect ray<select aria-label="Inspect ray" value={raySelection} onChange={e => { setRaySelection(e.target.value); setSurface(0); }}><option value="all">All rays (measure central beam)</option>{rays.map(r => <option key={rayKey(r)} value={rayKey(r)}>Beam {r.beam + 1} · {r.w} nm</option>)}</select></label><label><input type="checkbox" checked={protractor} onChange={e => setProtractor(e.target.checked)} />Angle protractor</label>{protractor && <><label>Interface<select aria-label="Protractor interface" value={Math.min(surface, Math.max(0, central.events.length - 1))} onChange={e => setSurface(+e.target.value)} disabled={!central.events.length}>{central.events.length ? central.events.map((e, i) => <option key={i} value={i}>{i + 1} · Glass #{e.elementId}{e.tir ? ' · TIR' : ''}</option>) : <option value={0}>No interface hit</option>}</select></label><label>Radius<input aria-label="Protractor radius" type="range" min=".5" max="1.5" step=".1" value={protractorRadius} onChange={e => setProtractorRadius(+e.target.value)} /></label></>}</div>
          <div className="oe-bench-footer"><span><i className={on ? 'oe-live' : ''} />{on ? 'Laser active' : 'Laser off'}</span><span>Drag glass · Arrow keys move focused glass · Dashed lines: normals</span></div>
          <p className="oe-status" role="status">{message}</p>
        </section>

        <aside id="oe-controls-drawer" className={`oe-panel oe-controls${drawerOpen ? ' oe-drawer-open' : ''}`} style={{ '--oe-drawer-height': `${drawerHeight}vh` } as CSSProperties}>
          <h2>Selected glass {selected ? `#${selected.id}` : ''}</h2>
          {selected ? <div className="oe-selected-controls">
            <label className="oe-select">Shape<select aria-label="Selected glass shape" value={selected.kind} onChange={e => updateElement(selected.id, { kind: e.target.value as ElementKind })}>{opticalElementCatalog.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></label>
            <label className="oe-select">Optical material<select value={selected.material} onChange={e => updateElement(selected.id, { material: +e.target.value })}>{glasses.map((g, i) => <option key={g.name} value={i}>{g.name}</option>)}</select></label>
            <p className="oe-index">n = <strong>{n.toFixed(4)}</strong><small>at {wavelength} nm</small></p>
            <div className="oe-material-info" data-pinned={materialInfoPinned}><button type="button" aria-label="Material information" aria-describedby="oe-material-tooltip" aria-pressed={materialInfoPinned} onClick={()=>setMaterialInfoPinned(v=>!v)}>ⓘ {materialInfoPinned?'Unpin material information':'Material information'}</button><div role="tooltip" id="oe-material-tooltip"><strong>{glasses[selected.material].name}</strong><span>n at 587.6 nm: {glassIndex(selected.material, 587.5618).toFixed(5)}</span><span>Approximate Abbe number: {((glassIndex(selected.material, 587.5618) - 1) / (glassIndex(selected.material, 486.1327) - glassIndex(selected.material, 656.2725))).toFixed(1)}</span><span>A higher index usually bends an oblique ray more. A lower Abbe number means stronger colour dispersion. These are visible-band approximations.</span></div></div>
            {slider('Element rotation', selected.rotation, -180, 180, .1, '°', rotation => updateElement(selected.id, { rotation }))}
            {slider('Horizontal position', selected.x, -11, 11, .05, ' cm', x => updateElement(selected.id, { x }))}
            {slider('Vertical position', selected.y, -5.5, 5.5, .05, ' cm', y => updateElement(selected.id, { y }))}
            {slider('Glass size', selected.scale, .3, 1.4, .05, '×', scale => updateElement(selected.id, { scale }))}
            <div className="oe-piece-actions"><button disabled={scene.length >= MAX_ELEMENTS} onClick={() => addElement(selected.kind, selected)}>Duplicate</button><button onClick={removeSelected}>Remove glass</button></div>
          </div> : <p>Add a glass shape from the library.</p>}
          <hr /><h2>Laser source <button className="oe-switch" aria-pressed={on} onClick={() => setOn(!on)}>{on ? 'ON' : 'OFF'}</button></h2>
          <div className="oe-laser-controls"><label className="oe-select">Wavelength<select value={wavelength} onChange={e => setWavelength(+e.target.value)} disabled={white}><option value={650}>650 nm · Red</option><option value={530}>530 nm · Green</option><option value={450}>450 nm · Blue</option></select></label>
            <label className="oe-check"><input type="checkbox" checked={white} onChange={e => setWhite(e.target.checked)} />Three-colour spectrum</label>
            {slider('Number of beams', beams, 1, 7, 1, '', setBeams)}{slider('Beam spacing', spacing, .15, .9, .05, ' cm', setSpacing)}{slider('Beam direction', angle, -65, 65, .1, '°', setAngle)}
            <label className="oe-check"><input type="checkbox" checked={normals} onChange={e => setNormals(e.target.checked)} />Show surface normals</label>
          </div><button className="oe-reset" onClick={reset}>↻ Reset experiment</button><label className="oe-mobile-drawer-size">Drawer height<input aria-label="Mobile drawer height" type="range" min="45" max="90" value={drawerHeight} onChange={e => setDrawerHeight(+e.target.value)} /></label>
        </aside>
      </div>

      <button className="oe-mobile-toggle" aria-controls="oe-controls-drawer" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(v => !v)}>{drawerOpen ? 'Close controls' : 'Open controls'}</button>
      {baseline && <OpticsComparison baseline={baseline} current={workspace.setup} accessible={accessible} capture={() => setBaseline(workspace.setup)} close={() => setBaseline(null)} />}

      <div className="oe-bottom"><section className="oe-panel oe-readings">
        <div className="oe-tabs" role="tablist" aria-label="Optical investigation views">{['Measurements', 'Theory', 'Experiments'].map((t,i) => <button key={t} id={`oe-investigation-tab-${i}`} role="tab" tabIndex={tab===t?0:-1} aria-selected={tab===t} aria-controls="oe-investigation-panel" aria-pressed={tab === t} onClick={() => setTab(t)} onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;setTab(['Measurements','Theory','Experiments'][next]);document.getElementById(`oe-investigation-tab-${next}`)?.focus()}}>{t}</button>)}</div>
        <div role="tabpanel" id="oe-investigation-panel" aria-labelledby={`oe-investigation-tab-${['Measurements','Theory','Experiments'].indexOf(tab)}`}>
        {tab === 'Measurements' ? <><h2>Live interface measurements</h2><p>{raySelection === 'all' ? 'Central beam' : `Selected beam ${central.beam + 1}`}{white || raySelection !== 'all' ? ` · ${central.w} nm` : ''} · through all glass pieces · angles from the local normal</p>
          <div className="oe-table-scroll"><table><thead><tr><th>Glass</th><th>Index change</th><th>Incidence</th><th>Refraction</th><th>Behaviour</th></tr></thead><tbody>{on && central.events.map((e, i) => <tr key={i} className={e.elementId === selected?.id ? 'oe-selected-reading' : ''} onClick={() => { setSurface(i); setProtractor(true); }}><td>#{e.elementId}</td><td>{e.fromIndex.toFixed(3)} → {e.toIndex.toFixed(3)}</td><td><button className="oe-measure-angle" aria-label={`Measure interface ${i + 1}`} onClick={() => { setSurface(i); setProtractor(true); }}>{e.incidence.toFixed(2)}°</button></td><td>{e.refraction === null ? '—' : `${e.refraction.toFixed(2)}°`}</td><td>{e.tir ? 'Total internal reflection' : 'Transmission'}</td></tr>)}</tbody></table></div>
          {!on ? <p>Switch on the laser to take measurements.</p> : !central.events.length ? <p>The central ray misses the glass. Move a piece into the path or adjust the beam direction.</p> : central.truncated ? <p>Trace stops after 64 surface interactions.</p> : null}
        </> : tab === 'Theory' ? <><h2>Every surface changes the direction</h2><p className="oe-equation">n₁ sin θ₁ = n₂ sin θ₂</p><p>Light bends toward the normal when entering a higher index and away when leaving. Above the critical angle, it reflects internally. Rays can pass through several pieces or return to an earlier piece after reflection.</p><p>Each solid has its own material. Pieces are kept apart with an air gap; overlapping solids are not part of this model. Cone and cylinder shapes represent two-dimensional sections. Curved faces are sampled with up to 480 line segments.</p><p>Named catalog glasses use approximate two-term Cauchy dispersion fitted to d-line index and Abbe number. Generic glass, silica, borosilicate and acrylic use representative fits. Weak Fresnel reflections, absorption, diffraction and three-dimensional skew rays are omitted.</p><p>Zoom, panning, protractors, patterns and comparison views do not change physical coordinates. Grid snapping changes actual glass positions and is off by default. The protractor is anchored to the selected traced interface and measures angles from its local normal.</p><a href={GLASS_CATALOG_SOURCE} target="_blank" rel="noreferrer">Material data: SCHOTT Optical Glass catalog, pp. 102–108</a></> : <OpticsChallenges setup={workspace.setup} rays={rays} report={setMessage} />}
      </div></section><section className="oe-panel oe-about"><span className="oe-eyebrow">SELECTED PIECE {selected ? `#${selected.id}` : ''}</span><h2>{description?.name ?? 'An empty optical bench'}</h2><p>{description?.detail ?? `Add any of the ${opticalElementCatalog.length} shapes to begin tracing light.`}</p>
        {selected && <><p className="oe-material-caption">{glasses[selected.material].name} · size {selected.scale}× · rotation {selected.rotation}°</p><div className="oe-facts"><span>Glass → air critical angle<strong>{(Math.asin(1 / n) * 180 / Math.PI).toFixed(2)}°</strong></span><span>Light speed in glass<strong>{(299792458 / n / 1e8).toFixed(3)} × 10⁸ m/s</strong></span></div></>}
      </section></div>
    </main>
    {context && <div className="oe-context-menu" role="menu" aria-label="Glass actions" style={{ left: context.x, top: context.y }} onClick={e => e.stopPropagation()}><button role="menuitem" disabled={scene.length >= MAX_ELEMENTS} onClick={() => { const e = scene.find(e => e.id === context.id); if (e) addElement(e.kind, e); setContext(null); }}>Duplicate glass</button><button role="menuitem" onClick={() => { removeElement(context.id); setContext(null); }}>Delete glass</button><button role="menuitem" onClick={() => setContext(null)}>Close menu</button></div>}
  </div>;
}


