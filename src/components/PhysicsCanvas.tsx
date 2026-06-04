import { useEffect, useRef, useState } from "react";
import { doublePendulumPoints } from "../engine/doublePendulumSolver";
import { castRay, OpticsObject, wavelengthToRgba } from "../engine/opticsEngine";
import { useSimulationEngine } from "../engine/useSimulationEngine";
import { barriersFromObjects, sourcesFromObjects, WaveEngine } from "../engine/waveEngine";
import { playTone, stopTone } from "../lib/audioEngine";
import { isCircuitObject } from "../lib/circuitSolver";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance, SimulationSettings, TerminalKind, ViewportState } from "../types";

const collisionFlashes: { x: number; y: number; started: number }[] = [];
let lastTotalEnergy: number | null = null;
let energyPulse = 0;

export function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  const stateRef = useRef(useLabStore.getState());
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const panRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const copiedRef = useRef<PhysicsObjectInstance | null>(null);
  const wireStartRef = useRef<{ id: string; terminal: TerminalKind } | null>(null);
  const tooltipTimerRef = useRef<number>();
  const panVelocityRef = useRef<{ vx: number; vy: number } | null>(null);
  const inertiaRef = useRef<number>();
  const spawnRef = useRef(new Map<string, number>());
  const lastStepSignal = useRef(useLabStore.getState().stepSignal);
  const engine = useSimulationEngine(useLabStore.getState().objects);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; object: PhysicsObjectInstance } | null>(null);
  const [guide, setGuide] = useState<{ x?: number; y?: number; label: string } | null>(null);
  const [dragGhost, setDragGhost] = useState<{ kind: string; x: number; y: number } | null>(null);

  useEffect(() => useLabStore.subscribe((state) => {
    stateRef.current = state;
    engine.syncObjects(state.objects);
  }), [engine]);

  useEffect(() => {
    const loop = async (now: number) => {
      const state = stateRef.current;
      const dt = Math.min(32, now - lastRef.current) / 1000;
      lastRef.current = now;
      const shouldStep = state.running || state.stepSignal !== lastStepSignal.current;
      if (shouldStep) {
        lastStepSignal.current = state.stepSignal;
        const snapshot = await engine.step(state.running ? dt : 1 / 60, makeSettings());
        useLabStore.setState({ objects: snapshot.objects, simulationTime: snapshot.simulationTime, engineWarnings: snapshot.warnings });
        if (snapshot.graphPoint) useLabStore.getState().pushGraphPoint(snapshot.graphPoint);
      }
      draw(engine.workerEnabled, dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [engine]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      const store = useLabStore.getState();
      if (event.code === "Space") {
        event.preventDefault();
        store.toggleRunning();
      }
      if (event.key.toLowerCase() === "r") {
        store.resetSandbox();
        engine.resetTime();
      }
      if (event.key.toLowerCase() === "g") store.toggleGrid();
      if (event.key.toLowerCase() === "v") store.toggleVectors();
      if (event.key.toLowerCase() === "t") store.toggleTrails();
      if (event.key.toLowerCase() === "f") store.addObject("force-arrow", 300, 180);
      if (event.key.toLowerCase() === "m") store.addObject("ruler", 300, 220);
      if (event.key.toLowerCase() === "s" && !event.ctrlKey) event.preventDefault();
      if (event.ctrlKey && event.key.toLowerCase() === "z") store.undo();
      if (event.ctrlKey && event.key.toLowerCase() === "y") store.redo();
      if (event.key === "Delete") store.removeSelected();
      if (event.key === "+") store.setViewport({ zoom: store.viewport.zoom * 1.1 });
      if (event.key === "-") store.setViewport({ zoom: store.viewport.zoom / 1.1 });
      if (event.key === "Escape") store.selectObject(undefined);
      if (event.ctrlKey && event.key.toLowerCase() === "c") {
        copiedRef.current = store.objects.find((object) => object.id === store.selectedId) ?? null;
      }
      if (event.ctrlKey && event.key.toLowerCase() === "v" && copiedRef.current) {
        const copy = { ...copiedRef.current, id: crypto.randomUUID(), x: copiedRef.current.x + 30, y: copiedRef.current.y + 30, trail: [] };
        store.setObjects([...store.objects, copy]);
        store.selectObject(copy.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engine]);

  const makeSettings = (): SimulationSettings => {
    const state = stateRef.current;
    return {
      gravity: state.gravity,
      timeScale: state.timeScale,
      airResistance: state.airResistance,
      airDensity: state.airDensity,
    };
  };

  const draw = (workerEnabled: boolean, dt: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const state = stateRef.current;
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.72);
    gradient.addColorStop(0, state.theme === "dark" ? "#12233c" : "#ffffff");
    gradient.addColorStop(0.48, state.theme === "dark" ? "#0b1728" : "#eef6ff");
    gradient.addColorStop(1, state.theme === "dark" ? "#030712" : "#dbeafe");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    if (state.showGrid) drawGrid(ctx, width, height, state.viewport);
    drawAxes(ctx, state.viewport);
    detectCollisionFlashes(state.objects);
    detectEnergyPulse(state.graphData[state.graphData.length - 1]?.totalEnergy);
    state.objects.filter((object) => object.kind === "wire").forEach((wire) => drawWire(ctx, wire, state.objects, wire.id === state.selectedId, state.viewport));
    state.objects.filter((object) => object.kind !== "wire").forEach((object) => {
      const started = spawnRef.current.get(object.id);
      const scale = started ? clamp((performance.now() - started) / 150, 0, 1) : 1;
      if (started && scale >= 1) spawnRef.current.delete(object.id);
      drawObject(ctx, object, object.id === state.selectedId, state.showVectors, state.showTrails, state.viewport, 0.8 + 0.2 * scale);
    });
    drawOptics(ctx, state.objects, state.viewport);
    drawWaveOverlay(ctx, state.objects, width, height, dt);
    drawCollisionFlashes(ctx, state.viewport);
    if (energyPulse > 0) {
      ctx.fillStyle = `rgba(251, 191, 36, ${energyPulse * 0.14})`;
      ctx.fillRect(0, 0, width, height);
      energyPulse *= 0.88;
    }
    drawHud(ctx, state.running, state.simulationTime, state.viewport.zoom, workerEnabled);
  };

  const pointerToWorld = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const screen = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    return screenToWorld(screen.x, screen.y, stateRef.current.viewport);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    setContextMenu(null);
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.button === 1 || event.button === 2 || event.altKey) {
      if (inertiaRef.current) cancelAnimationFrame(inertiaRef.current);
      panVelocityRef.current = { vx: 0, vy: 0 };
      panRef.current = { x: event.clientX, y: event.clientY, offsetX: stateRef.current.viewport.offsetX, offsetY: stateRef.current.viewport.offsetY };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    const point = pointerToWorld(event);
    if (useLabStore.getState().selectedTool === "wire") {
      const terminal = findTerminal(useLabStore.getState().objects, point.x, point.y);
      if (!terminal) return;
      if (!wireStartRef.current) {
        wireStartRef.current = terminal;
        useLabStore.getState().selectObject(terminal.id);
        return;
      }
      if (wireStartRef.current.id !== terminal.id || wireStartRef.current.terminal !== terminal.terminal) {
        useLabStore.getState().addObject("wire", 0, 0, {
          fromId: wireStartRef.current.id,
          fromTerminal: wireStartRef.current.terminal,
          toId: terminal.id,
          toTerminal: terminal.terminal,
        });
      }
      wireStartRef.current = null;
      return;
    }
    const object = [...useLabStore.getState().objects].reverse().find((candidate) => hitTest(candidate, point.x, point.y));
    useLabStore.getState().selectObject(object?.id);
    if (object) {
      dragRef.current = { id: object.id, dx: object.x - point.x, dy: object.y - point.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    rect.width;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const pan = panRef.current;
    if (pan) {
      const nextOffsetX = pan.offsetX + event.clientX - pan.x;
      const nextOffsetY = pan.offsetY + event.clientY - pan.y;
      panVelocityRef.current = { vx: event.movementX, vy: event.movementY };
      useLabStore.getState().setViewport({ offsetX: nextOffsetX, offsetY: nextOffsetY });
      return;
    }
    const drag = dragRef.current;
    const point = pointerToWorld(event);
    if (!drag) {
      updateHover(event, point);
      return;
    }
    const snap = event.shiftKey ? 25 : 1;
    const rawX = Math.round((point.x + drag.dx) / snap) * snap;
    const rawY = Math.round((point.y + drag.dy) / snap) * snap;
    const snapped = snapToObjects(drag.id, rawX, rawY);
    const nextX = snapped.x;
    const nextY = snapped.y;
    setGuide(snapped.guide);
    useLabStore.getState().updateObject(drag.id, { x: nextX, y: nextY, vx: 0, vy: 0, trail: [] });
    engine.setObjectPosition(drag.id, nextX, nextY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const hadPan = Boolean(panRef.current);
    dragRef.current = null;
    panRef.current = null;
    setGuide(null);
    if (hadPan) startPanInertia();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    const store = useLabStore.getState();
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const before = screenToWorld(mouseX, mouseY, store.viewport);
    if (event.ctrlKey) event.preventDefault();
    const factor = event.ctrlKey ? Math.exp(-event.deltaY * 0.01) : event.deltaY < 0 ? 1.1 : 0.9;
    const zoom = clamp(store.viewport.zoom * factor, 0.25, 3);
    const nextOffsetX = mouseX - before.x * zoom;
    const nextOffsetY = mouseY - before.y * zoom;
    store.setViewport({ zoom, offsetX: nextOffsetX, offsetY: nextOffsetY });
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const point = pointerToWorld(event as unknown as React.PointerEvent<HTMLCanvasElement>);
    const object = [...useLabStore.getState().objects].reverse().find((candidate) => hitTest(candidate, point.x, point.y));
    if (object) {
      useLabStore.getState().selectObject(object.id);
      setContextMenu({ x: event.clientX, y: event.clientY, id: object.id });
    }
  };

  const updateHover = (event: React.PointerEvent<HTMLCanvasElement>, point: { x: number; y: number }) => {
    window.clearTimeout(tooltipTimerRef.current);
    const object = [...useLabStore.getState().objects].reverse().find((candidate) => hitTest(candidate, point.x, point.y));
    if (object) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({ x: event.clientX - rect.left + 14, y: event.clientY - rect.top + 14, object });
    } else {
      tooltipTimerRef.current = window.setTimeout(() => setTooltip(null), 300);
    }
  };

  const snapToObjects = (id: string, x: number, y: number) => {
    const dragged = useLabStore.getState().objects.find((object) => object.id === id);
    if (!dragged) return { x, y, guide: null };
    const width = dragged.width ?? (dragged.radius ?? 24) * 2;
    const height = dragged.height ?? (dragged.radius ?? 24) * 2;
    const candidates = useLabStore.getState().objects.filter((object) => object.id !== id);
    let nextX = x;
    let nextY = y;
    let nextGuide: { x?: number; y?: number; label: string } | null = null;
    for (const object of candidates) {
      const targetWidth = object.width ?? (object.radius ?? 24) * 2;
      const targetHeight = object.height ?? (object.radius ?? 24) * 2;
      const xTargets = [object.x, object.x - targetWidth / 2, object.x + targetWidth / 2];
      const xSources = [nextX, nextX - width / 2, nextX + width / 2];
      for (const target of xTargets) {
        for (const source of xSources) {
          const delta = target - source;
          if (Math.abs(delta) <= 8) {
            nextX += delta;
            nextGuide = { x: target, label: `${Math.round(Math.abs(delta))} px` };
          }
        }
      }
      const yTargets = [object.y, object.y - targetHeight / 2, object.y + targetHeight / 2];
      const ySources = [nextY, nextY - height / 2, nextY + height / 2];
      for (const target of yTargets) {
        for (const source of ySources) {
          const delta = target - source;
          if (Math.abs(delta) <= 8) {
            nextY += delta;
            nextGuide = { ...(nextGuide ?? {}), y: target, label: `${Math.round(Math.abs(delta))} px` };
          }
        }
      }
    }
    return { x: nextX, y: nextY, guide: nextGuide };
  };

  const startPanInertia = () => {
    const velocity = panVelocityRef.current;
    if (!velocity || Math.hypot(velocity.vx, velocity.vy) < 0.5) return;
    const step = () => {
      const current = panVelocityRef.current;
      if (!current) return;
      const store = useLabStore.getState();
      store.setViewport({ offsetX: store.viewport.offsetX + current.vx, offsetY: store.viewport.offsetY + current.vy });
      current.vx *= 0.92;
      current.vy *= 0.92;
      if (Math.hypot(current.vx, current.vy) > 0.3) inertiaRef.current = requestAnimationFrame(step);
      else panVelocityRef.current = null;
    };
    inertiaRef.current = requestAnimationFrame(step);
  };

  const dropObject = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const kind = event.dataTransfer.getData("application/x-physics-object") as PhysicsObjectInstance["kind"];
    if (!kind) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = screenToWorld(event.clientX - rect.left, event.clientY - rect.top, stateRef.current.viewport);
    useLabStore.getState().addObject(kind, point.x, point.y);
    window.setTimeout(() => {
      const id = useLabStore.getState().selectedId;
      if (id) spawnRef.current.set(id, performance.now());
    });
    setDragGhost(null);
  };

  const selectedContextObject = contextMenu ? useLabStore.getState().objects.find((object) => object.id === contextMenu.id) : undefined;

  return (
    <div
      className="relative h-full w-full"
      onDragOver={(event) => {
        event.preventDefault();
        const kind = event.dataTransfer.types.includes("application/x-physics-object") ? event.dataTransfer.getData("application/x-physics-object") || "object" : "object";
        const rect = event.currentTarget.getBoundingClientRect();
        setDragGhost({ kind, x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      onDragLeave={() => setDragGhost(null)}
      onDrop={dropObject}
    >
      <canvas
        ref={canvasRef}
        data-physics-canvas="true"
        className="h-full w-full cursor-crosshair rounded-md"
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        aria-label="Interactive physics simulation canvas"
      />
      {guide && <GuideOverlay guide={guide} viewport={stateRef.current.viewport} />}
      {dragGhost && <div className="canvas-drag-ghost" style={{ left: dragGhost.x, top: dragGhost.y }}>{dragGhost.kind}</div>}
      {tooltip && <div className="canvas-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
        <div className="font-semibold text-cyan-300">{tooltip.object.name}</div>
        <div>mass {tooltip.object.mass.toFixed(2)} kg</div>
        <div>speed {Math.hypot(tooltip.object.vx, tooltip.object.vy).toFixed(2)} m/s</div>
      </div>}
      {contextMenu && selectedContextObject && <div className="canvas-context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}>
        <button onClick={() => setContextMenu(null)}>Edit Properties</button>
        <button onClick={() => { useLabStore.getState().duplicateSelected(); setContextMenu(null); }}>Duplicate</button>
        <button onClick={() => { useLabStore.getState().updateObject(contextMenu.id, { locked: !selectedContextObject.locked }); setContextMenu(null); }}>{selectedContextObject.locked ? "Unlock" : "Lock"}</button>
        <button onClick={() => { useLabStore.getState().addObject("force-arrow", selectedContextObject.x + 55, selectedContextObject.y); setContextMenu(null); }}>Add Force</button>
        <button className="text-rose-300" onClick={() => { useLabStore.getState().removeSelected(); setContextMenu(null); }}>Delete</button>
      </div>}
    </div>
  );
}

function GuideOverlay({ guide, viewport }: { guide: { x?: number; y?: number; label: string }; viewport: ViewportState }) {
  const x = guide.x === undefined ? undefined : guide.x * viewport.zoom + viewport.offsetX;
  const y = guide.y === undefined ? undefined : guide.y * viewport.zoom + viewport.offsetY;
  return (
    <>
      {x !== undefined && <div className="snap-guide-v" style={{ left: x }}><span>{guide.label}</span></div>}
      {y !== undefined && <div className="snap-guide-h" style={{ top: y }}><span>{guide.label}</span></div>}
    </>
  );
}

function worldToScreen(x: number, y: number, viewport: ViewportState) {
  return { x: x * viewport.zoom + viewport.offsetX, y: y * viewport.zoom + viewport.offsetY };
}

function screenToWorld(x: number, y: number, viewport: ViewportState) {
  return { x: (x - viewport.offsetX) / viewport.zoom, y: (y - viewport.offsetY) / viewport.zoom };
}

function withViewport(ctx: CanvasRenderingContext2D, viewport: ViewportState, draw: () => void) {
  ctx.save();
  ctx.translate(viewport.offsetX, viewport.offsetY);
  ctx.scale(viewport.zoom, viewport.zoom);
  draw();
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, viewport: ViewportState) {
  const topLeft = screenToWorld(0, 0, viewport);
  const bottomRight = screenToWorld(width, height, viewport);
  ctx.fillStyle = "rgba(148, 163, 184, 0.25)";
  for (let x = Math.floor(topLeft.x / 40) * 40; x < bottomRight.x; x += 40) {
    for (let y = Math.floor(topLeft.y / 40) * 40; y < bottomRight.y; y += 40) {
      const p = worldToScreen(x, y, viewport);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawAxes(ctx: CanvasRenderingContext2D, viewport: ViewportState) {
  withViewport(ctx, viewport, () => {
    ctx.strokeStyle = "rgba(34, 211, 238, 0.35)";
    ctx.lineWidth = 1 / viewport.zoom;
    ctx.beginPath();
    ctx.moveTo(-10000, 0);
    ctx.lineTo(10000, 0);
    ctx.moveTo(0, -10000);
    ctx.lineTo(0, 10000);
    ctx.stroke();
  });
}

function drawObject(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, selected: boolean, vectors: boolean, trails: boolean, viewport: ViewportState, spawnScale = 1) {
  withViewport(ctx, viewport, () => {
    if (object.kind === "double-pendulum") {
      drawDoublePendulum(ctx, object, selected, trails, viewport.zoom);
      return;
    }
    if (trails && object.trail.length > 1) {
      ctx.strokeStyle = "rgba(34, 211, 238, 0.55)";
      ctx.lineWidth = 2 / viewport.zoom;
      ctx.beginPath();
      object.trail.forEach((point, index) => (index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
      ctx.stroke();
    }
    if (object.kind === "pendulum" || object.kind === "spring") {
      ctx.strokeStyle = object.kind === "pendulum" ? "rgba(251, 146, 60, 0.85)" : "rgba(167, 139, 250, 0.85)";
      ctx.lineWidth = 2 / viewport.zoom;
      ctx.beginPath();
      ctx.moveTo(object.pivotX ?? object.x, object.pivotY ?? object.y - (object.length ?? 120));
      ctx.lineTo(object.x, object.y);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(object.x, object.y);
    ctx.rotate(object.angle);
    ctx.scale(spawnScale, spawnScale);
    const speedGlow = clamp(Math.hypot(object.vx, object.vy) / 12, 0, 1);
    if (speedGlow > 0.03) {
      ctx.shadowColor = "rgba(34, 211, 238, 0.9)";
      ctx.shadowBlur = 4 + speedGlow * 24;
    }
    ctx.fillStyle = object.color ?? "#38bdf8";
    ctx.strokeStyle = "rgba(255,255,255,0.32)";
    ctx.lineWidth = 1 / viewport.zoom;
    if (object.kind === "bulb") {
      const glow = Math.round(120 + (object.brightness ?? 0) * 135);
      ctx.fillStyle = `rgb(${glow}, ${Math.round(glow * 0.86)}, 80)`;
      ctx.beginPath();
      ctx.arc(0, 0, object.radius ?? 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillText(`${Math.round((object.brightness ?? 0) * 100)}%`, -12, 4);
    } else if (["ball", "pendulum", "wheel", "disc", "pulley", "charge", "ammeter", "voltmeter"].includes(object.kind)) {
      ctx.beginPath();
      ctx.arc(0, 0, object.radius ?? 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (object.kind === "ammeter" || object.kind === "voltmeter") {
        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(object.kind === "ammeter" ? "A" : "V", -6, 6);
      }
      if (object.kind === "wheel" || object.kind === "disc" || object.kind === "pulley") {
        ctx.beginPath();
        ctx.moveTo(-(object.radius ?? 22), 0);
        ctx.lineTo(object.radius ?? 22, 0);
        ctx.moveTo(0, -(object.radius ?? 22));
        ctx.lineTo(0, object.radius ?? 22);
        ctx.stroke();
      }
    } else if (object.kind === "spring") {
      const rest = object.length ?? object.width ?? 130;
      const current = Math.hypot(object.x - (object.pivotX ?? object.x), object.y - (object.pivotY ?? object.y));
      drawSpring(ctx, object.width ?? 130, object.height ?? 22, clamp((current - rest) / Math.max(1, rest), -1, 1));
    } else if (object.kind.includes("arrow") || object.kind === "light-ray") {
      drawArrow(ctx, -(object.width ?? 80) / 2, 0, (object.width ?? 80) / 2, 0, object.color ?? "#38bdf8", viewport.zoom);
    } else if (object.kind === "protractor") {
      ctx.beginPath();
      ctx.arc(0, 18, object.width ?? 90, Math.PI, 0);
      ctx.stroke();
      ctx.fillText("0-180", -18, 12);
    } else if (object.kind === "thermometer") {
      ctx.fillRect(-5, -(object.height ?? 100) / 2, 10, object.height ?? 100);
      ctx.beginPath();
      ctx.arc(0, (object.height ?? 100) / 2, 13, 0, Math.PI * 2);
      ctx.fill();
    } else if (object.kind === "bar-magnet") {
      const width = object.width ?? 130;
      const height = object.height ?? 34;
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(-width / 2, -height / 2, width / 2, height);
      ctx.fillStyle = "#3b82f6";
      ctx.fillRect(0, -height / 2, width / 2, height);
      ctx.strokeRect(-width / 2, -height / 2, width, height);
      ctx.fillStyle = "#fff";
      ctx.fillText("N", -width / 4 - 4, 4);
      ctx.fillText("S", width / 4 - 4, 4);
    } else if (object.kind === "convex-lens") {
      ctx.beginPath();
      ctx.ellipse(0, 0, (object.width ?? 36) / 2, (object.height ?? 140) / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (object.kind === "concave-mirror") {
      ctx.beginPath();
      ctx.arc(18, 0, (object.height ?? 140) / 2, Math.PI / 2, -Math.PI / 2, true);
      ctx.stroke();
    } else if (object.kind === "prism") {
      const w = object.width ?? 86;
      const h = object.height ?? 74;
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(226,232,240,0.75)";
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(-w * 0.18, -h * 0.12);
      ctx.lineTo(w * 0.18, h * 0.18);
      ctx.moveTo(w * 0.18, -h * 0.1);
      ctx.lineTo(w * 0.42, h * 0.26);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#0f172a";
      ctx.font = "10px sans-serif";
      ctx.fillText(`n=${(object.refractiveIndex ?? 1.5).toFixed(2)}`, -w * 0.25, h * 0.18);
      ctx.fillText("A", -4, h * 0.38);
    } else if (object.kind === "wave-source") {
      ctx.beginPath();
      ctx.arc(0, 0, object.radius ?? 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, (object.radius ?? 18) + 8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (object.kind === "wave-barrier") {
      ctx.fillRect(-(object.width ?? 14) / 2, -(object.height ?? 220) / 2, object.width ?? 14, object.height ?? 220);
      ctx.strokeRect(-(object.width ?? 14) / 2, -(object.height ?? 220) / 2, object.width ?? 14, object.height ?? 220);
    } else if (object.kind === "fluid-region") {
      ctx.fillStyle = object.color ?? "rgba(56,189,248,0.28)";
      ctx.fillRect(-(object.width ?? 360) / 2, -(object.height ?? 190) / 2, object.width ?? 360, object.height ?? 190);
      ctx.strokeRect(-(object.width ?? 360) / 2, -(object.height ?? 190) / 2, object.width ?? 360, object.height ?? 190);
    } else if (object.kind === "chladni-plate") {
      drawChladni(ctx, object.width ?? 260, object.height ?? 180, object.frequency ?? 440);
      if (localStorage.getItem("audio_enabled") === "true") playTone(object.id, object.frequency ?? 440, object.amplitude ?? 0.4, "sine");
      else stopTone(object.id);
    } else if (object.kind === "battery") {
      ctx.fillRect(-(object.width ?? 70) / 2, -(object.height ?? 38) / 2, object.width ?? 70, object.height ?? 38);
      ctx.strokeRect(-(object.width ?? 70) / 2, -(object.height ?? 38) / 2, object.width ?? 70, object.height ?? 38);
      ctx.fillStyle = "#0f172a";
      ctx.fillText("+", 18, 5);
      ctx.fillText("-", -24, 5);
    } else if (object.kind === "resistor") {
      drawResistor(ctx, object.width ?? 74, object.height ?? 28);
    } else if (object.kind === "switch") {
      ctx.beginPath();
      ctx.moveTo(-24, 8);
      ctx.lineTo(-4, 8);
      ctx.moveTo(4, object.closed ? 8 : -8);
      ctx.lineTo(26, 8);
      ctx.stroke();
    } else {
      ctx.fillRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
      ctx.strokeRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
    }
    if (isCircuitObject(object)) drawTerminals(ctx, object);
    if (selected) drawSelectionRing(ctx, object, viewport.zoom);
    ctx.restore();
    if (vectors && !object.isStatic) {
      drawArrow(ctx, object.x, object.y, object.x + object.vx * 18, object.y + object.vy * 18, "#38bdf8", viewport.zoom);
      drawArrow(ctx, object.x, object.y, object.x, object.y + 38, "#f43f5e", viewport.zoom);
      drawArrow(ctx, object.x, object.y, object.x + object.vx * object.mass * 8, object.y + object.vy * object.mass * 8, "#34d399", viewport.zoom);
    }
  });
}

function drawSelectionRing(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, zoom: number) {
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 180);
  const color = categoryColor(object.kind);
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 12 + pulse * 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = (2.5 + pulse) / zoom;
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge", "bulb", "ammeter", "voltmeter", "wave-source"].includes(object.kind)) {
    ctx.beginPath();
    ctx.arc(0, 0, (object.radius ?? 22) + 7 + pulse * 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const w = (object.width ?? 48) + 14 + pulse * 4;
    const h = (object.height ?? 48) + 14 + pulse * 4;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
  }
  ctx.restore();
}

function categoryColor(kind: PhysicsObjectInstance["kind"]) {
  if (["battery", "resistor", "bulb", "switch", "ammeter", "voltmeter", "wire", "charge", "electric-field-region"].includes(kind)) return "#facc15";
  if (["light-ray", "plane-mirror", "convex-lens", "concave-mirror", "prism"].includes(kind)) return "#22d3ee";
  if (["wave-source", "wave-barrier", "chladni-plate"].includes(kind)) return "#a78bfa";
  return "#38bdf8";
}

function drawChladni(ctx: CanvasRenderingContext2D, width: number, height: number, frequency: number) {
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(-width / 2, -height / 2, width, height);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  const mode = Math.max(1, Math.min(6, Math.round(frequency / 220)));
  for (let x = -width / 2; x <= width / 2; x += 5) {
    for (let y = -height / 2; y <= height / 2; y += 5) {
      const value = Math.sin((mode * Math.PI * (x + width / 2)) / width) * Math.sin(((7 - mode) * Math.PI * (y + height / 2)) / height);
      if (Math.abs(value) < 0.08) {
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    }
  }
  ctx.strokeRect(-width / 2, -height / 2, width, height);
}

function drawOptics(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], viewport: ViewportState) {
  const opticsObjects = objects.flatMap(toOpticsObject);
  const emitters = objects.filter((object) => object.kind === "light-ray");
  withViewport(ctx, viewport, () => {
    emitters.forEach((emitter) => {
      const direction = { x: Math.cos(emitter.angle), y: Math.sin(emitter.angle) };
      const paths = castRay({ origin: { x: emitter.x, y: emitter.y }, direction, wavelength: emitter.wavelength ?? 540, intensity: emitter.intensity ?? 1 }, opticsObjects);
      paths.forEach((path) => {
        ctx.strokeStyle = wavelengthToRgba(path.wavelength, Math.min(1, path.intensity));
        ctx.lineWidth = 3 / viewport.zoom;
        ctx.beginPath();
        ctx.moveTo(path.from.x, path.from.y);
        ctx.lineTo(path.to.x, path.to.y);
        ctx.stroke();
      });
    });
  });
}

function toOpticsObject(object: PhysicsObjectInstance): OpticsObject[] {
  if (object.kind === "plane-mirror") return [{ type: "mirror", x: object.x, y: object.y, angle: object.angle, width: object.height ?? object.width ?? 150, reflectivity: object.reflectivity ?? 0.9 }];
  if (object.kind === "concave-mirror") return [{ type: "concave-mirror", x: object.x, y: object.y, angle: object.angle, width: object.height ?? 150, reflectivity: object.reflectivity ?? 0.9 }];
  if (object.kind === "convex-lens") return [{ type: "lens", x: object.x, y: object.y, angle: object.angle, height: object.height ?? 150, focalLength: object.focalLength ?? 160, refractiveIndex: object.refractiveIndex ?? 1.5 }];
  if (object.kind === "prism") return [{ type: "prism", x: object.x, y: object.y, angle: object.angle, width: object.width ?? 86, height: object.height ?? 74, refractiveIndex: object.refractiveIndex ?? 1.5 }];
  return [];
}

function drawWaveOverlay(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], width: number, height: number, dt: number) {
  if (!objects.some((object) => object.kind === "wave-source")) return;
  const engine = waveCanvasState.engine;
  engine.step(Math.min(dt, 1 / 30), sourcesFromObjects(objects, width, height), barriersFromObjects(objects, width, height));
  const canvas = waveCanvasState.canvas ?? (waveCanvasState.canvas = makeWaveCanvas(engine.width, engine.height));
  const waveCtx = canvas.getContext("2d");
  if (!waveCtx) return;
  const image = waveCtx.createImageData(engine.width, engine.height);
  for (let i = 0; i < engine.current.length; i += 1) {
    const value = Math.max(-1, Math.min(1, engine.current[i]));
    const offset = i * 4;
    if (value < 0) {
      image.data[offset] = Math.round(255 * (1 + value));
      image.data[offset + 1] = Math.round(255 * (1 + value));
      image.data[offset + 2] = 255;
    } else {
      image.data[offset] = 255;
      image.data[offset + 1] = Math.round(255 * (1 - value));
      image.data[offset + 2] = Math.round(255 * (1 - value));
    }
    image.data[offset + 3] = 160;
  }
  waveCtx.putImageData(image, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.drawImage(canvas as CanvasImageSource, 0, 0, width, height);
  ctx.restore();
}

const waveCanvasState: { engine: WaveEngine; canvas: HTMLCanvasElement | OffscreenCanvas | null } = {
  engine: new WaveEngine(),
  canvas: null,
};

function makeWaveCanvas(width: number, height: number) {
  if ("OffscreenCanvas" in window) return new OffscreenCanvas(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function drawWire(ctx: CanvasRenderingContext2D, wire: PhysicsObjectInstance, objects: PhysicsObjectInstance[], selected: boolean, viewport: ViewportState) {
  const from = objects.find((object) => object.id === wire.fromId);
  const to = objects.find((object) => object.id === wire.toId);
  if (!from || !to) return;
  const a = terminalPoint(from, wire.fromTerminal ?? "pos");
  const b = terminalPoint(to, wire.toTerminal ?? "neg");
  withViewport(ctx, viewport, () => {
    ctx.strokeStyle = Math.abs(wire.current ?? 0) > 0.0001 ? "#22c55e" : selected ? "#22d3ee" : "#64748b";
    ctx.lineWidth = (selected ? 5 : 3) / viewport.zoom;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });
}

function drawTerminals(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance) {
  (["neg", "pos"] as TerminalKind[]).forEach((terminal) => {
    const point = { x: terminal === "pos" ? 20 : -20, y: 0 };
    ctx.fillStyle = terminal === "pos" ? "#ef4444" : "#38bdf8";
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function terminalPoint(object: PhysicsObjectInstance, terminal: TerminalKind) {
  return { x: object.x + (terminal === "pos" ? 20 : -20), y: object.y };
}

function findTerminal(objects: PhysicsObjectInstance[], x: number, y: number) {
  for (const object of [...objects].reverse()) {
    if (!isCircuitObject(object)) continue;
    for (const terminal of ["pos", "neg"] as TerminalKind[]) {
      const point = terminalPoint(object, terminal);
      if (Math.hypot(point.x - x, point.y - y) <= 14) return { id: object.id, terminal };
    }
  }
  return undefined;
}

function drawResistor(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  for (let i = 0; i <= 6; i += 1) {
    const x = -width / 2 + 10 + (i / 6) * (width - 20);
    const y = i % 2 === 0 ? -height / 2 : height / 2;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width / 2, 0);
  ctx.stroke();
}

function drawDoublePendulum(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, selected: boolean, trails: boolean, zoom: number) {
  const { pivot, bob1, bob2 } = doublePendulumPoints(object);
  if (trails && object.trail.length > 1) {
    object.trail.forEach((point, index) => {
      if (index === 0) return;
      const prev = object.trail[index - 1];
      ctx.strokeStyle = `rgba(34, 211, 238, ${index / object.trail.length})`;
      ctx.lineWidth = 2 / zoom;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });
  }
  ctx.strokeStyle = selected ? "#22d3ee" : "rgba(251, 146, 60, 0.9)";
  ctx.lineWidth = 3 / zoom;
  ctx.beginPath();
  ctx.moveTo(pivot.x, pivot.y);
  ctx.lineTo(bob1.x, bob1.y);
  ctx.lineTo(bob2.x, bob2.y);
  ctx.stroke();
  ctx.fillStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.arc(pivot.x, pivot.y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = object.color ?? "#fb923c";
  ctx.beginPath();
  ctx.arc(bob1.x, bob1.y, 10 + Math.sqrt(object.mass1 ?? 1) * 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bob2.x, bob2.y, 10 + Math.sqrt(object.mass2 ?? 1) * 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpring(ctx: CanvasRenderingContext2D, width: number, height: number, strain = 0) {
  ctx.strokeStyle = strain < -0.05 ? "#f43f5e" : strain > 0.05 ? "#38bdf8" : "#a78bfa";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  for (let i = 0; i <= 12; i += 1) {
    const x = -width / 2 + (i / 12) * width;
    const y = i % 2 === 0 ? -height / 2 : height / 2;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(width / 2, 0);
  ctx.stroke();
}

function detectCollisionFlashes(objects: PhysicsObjectInstance[]) {
  const now = performance.now();
  for (const object of objects) {
    if (object.isStatic || object.kind === "floor" || object.kind === "wall") continue;
    const speed = Math.hypot(object.vx, object.vy);
    if (speed < 2) continue;
    const bottom = object.y + (object.height ?? (object.radius ?? 20) * 2) / 2;
    const floor = objects.find((candidate) => candidate.kind === "floor" && Math.abs(bottom - (candidate.y - (candidate.height ?? 28) / 2)) < 8 && Math.abs(object.x - candidate.x) < (candidate.width ?? 760) / 2);
    if (floor) {
      const recent = collisionFlashes.some((flash) => Math.hypot(flash.x - object.x, flash.y - bottom) < 30 && now - flash.started < 180);
      if (!recent) collisionFlashes.push({ x: object.x, y: bottom, started: now });
    }
  }
  for (let i = collisionFlashes.length - 1; i >= 0; i -= 1) {
    if (now - collisionFlashes[i].started >= 240) collisionFlashes.splice(i, 1);
  }
}

function drawCollisionFlashes(ctx: CanvasRenderingContext2D, viewport: ViewportState) {
  const now = performance.now();
  withViewport(ctx, viewport, () => {
    collisionFlashes.forEach((flash) => {
      const t = (now - flash.started) / 220;
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - t)})`;
      ctx.lineWidth = 2 / viewport.zoom;
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, 8 + t * 30, 0, Math.PI * 2);
      ctx.stroke();
    });
  });
}

function detectEnergyPulse(totalEnergy?: number) {
  if (!Number.isFinite(totalEnergy)) return;
  if (lastTotalEnergy !== null && totalEnergy! > lastTotalEnergy * 1.08 + 1) energyPulse = 1;
  lastTotalEnergy = totalEnergy!;
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, zoom: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2 / zoom;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 8 * Math.cos(angle - 0.45), y2 - 8 * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - 8 * Math.cos(angle + 0.45), y2 - 8 * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
}

function drawHud(ctx: CanvasRenderingContext2D, running: boolean, time: number, zoom: number, workerEnabled: boolean) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.fillRect(14, 14, 244, 78);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "13px sans-serif";
  ctx.fillText(`Status: ${running ? "running" : "paused"}`, 28, 38);
  ctx.fillText(`t = ${time.toFixed(2)} s`, 28, 58);
  ctx.fillText(`zoom = ${Math.round(zoom * 100)}% | ${workerEnabled ? "worker" : "main"} engine`, 28, 78);
}

function hitTest(object: PhysicsObjectInstance, x: number, y: number) {
  if (object.kind === "double-pendulum") {
    const { bob1, bob2, pivot } = doublePendulumPoints(object);
    return [pivot, bob1, bob2].some((point) => Math.hypot(x - point.x, y - point.y) <= 22);
  }
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge", "bulb", "ammeter", "voltmeter", "wave-source"].includes(object.kind)) return Math.hypot(x - object.x, y - object.y) <= (object.radius ?? 22);
  return Math.abs(x - object.x) <= (object.width ?? 48) / 2 && Math.abs(y - object.y) <= (object.height ?? 48) / 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
