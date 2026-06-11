import { useEffect, useRef, useState } from "react";
import { doublePendulumPoints } from "../engine/doublePendulumSolver";
import { castRay, OpticsObject, wavelengthToRgba } from "../engine/opticsEngine";
import { useSimulationEngine } from "../engine/useSimulationEngine";
import { barriersFromObjects, sourcesFromObjects, WaveEngine } from "../engine/waveEngine";
import { playTone, stopTone } from "../lib/audioEngine";
import { isCircuitObject } from "../lib/circuitSolver";
import { renderFormula } from "../lib/formulas";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance, SimulationSettings, TerminalKind, ViewportState } from "../types";

const collisionFlashes: { x: number; y: number; started: number }[] = [];
let lastTotalEnergy: number | null = null;
let energyPulse = 0;

type VectorType = "velocity" | "weight" | "normal" | "friction" | "netForce";
type FieldType = "electrostatic" | "magnetic" | "gravity" | "optics";
type MeasurementTool = "select" | "ruler" | "protractor" | "velocity";
type CanvasTheme = "space" | "bench" | "blueprint" | "whiteboard";
type MeasurementOverlay =
  | { id: string; type: "ruler"; points: [{ x: number; y: number }, { x: number; y: number }]; label?: string }
  | { id: string; type: "protractor"; points: [{ x: number; y: number }, { x: number; y: number }, { x: number; y: number }]; label?: string }
  | { id: string; type: "velocity"; objectId: string; label?: string };

const vectorLabels: Record<VectorType, string> = {
  velocity: "v",
  weight: "W",
  normal: "N",
  friction: "f",
  netForce: "F_net",
};

const canvasThemes: Record<CanvasTheme, { label: string; short: string }> = {
  space: { label: "Deep Space", short: "Space" },
  bench: { label: "Lab Bench", short: "Bench" },
  blueprint: { label: "Blueprint", short: "Print" },
  whiteboard: { label: "Whiteboard", short: "Board" },
};

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
  const fKeyRef = useRef(false);
  const lastCollisionCountRef = useRef(0);
  const slowMoTimerRef = useRef<number>();
  const restoreSpeedRef = useRef(1);
  const maxEnergyRef = useRef(1);
  const sparkHistoryRef = useRef(new Map<string, { t: number; speed: number; ke: number; force: number; voltage: number; current: number }[]>());
  const lastStepSignal = useRef(useLabStore.getState().stepSignal);
  const fpsRef = useRef({ last: performance.now(), frames: 0, fps: 0, lastHud: 0 });
  const engine = useSimulationEngine(useLabStore.getState().objects);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; object: PhysicsObjectInstance } | null>(null);
  const [guide, setGuide] = useState<{ x?: number; y?: number; label: string } | null>(null);
  const [dragGhost, setDragGhost] = useState<{ kind: string; x: number; y: number } | null>(null);
  const [cursorWorld, setCursorWorld] = useState<{ x: number; y: number } | null>(null);
  const [hud, setHud] = useState({ fps: 0, time: 0, running: false, mode: "Select", engine: "main", zoom: 1 });
  const [inspector, setInspector] = useState<{ x: number; y: number; object: PhysicsObjectInstance } | null>(null);
  const [vectorVisibility, setVectorVisibility] = useState<Record<VectorType, boolean>>({ velocity: true, weight: true, normal: true, friction: true, netForce: true });
  const [measurementTool, setMeasurementTool] = useState<MeasurementTool>("select");
  const [measurementDraft, setMeasurementDraft] = useState<{ x: number; y: number }[]>([]);
  const [measurements, setMeasurements] = useState<MeasurementOverlay[]>([]);
  const [energyHud, setEnergyHud] = useState({ kinetic: 0, potential: 0, thermal: 0, total: 0, stable: true });
  const [pinnedInspectors, setPinnedInspectors] = useState<PhysicsObjectInstance[]>([]);
  const [fbdObject, setFbdObject] = useState<PhysicsObjectInstance | null>(null);
  const [autoSlowMo, setAutoSlowMo] = useState(() => localStorage.getItem("physicslab_auto_slowmo") !== "0");
  const [slowMoEvent, setSlowMoEvent] = useState<{ label: string; started: number; x?: number; y?: number } | null>(null);
  const [showFieldLines, setShowFieldLines] = useState(true);
  const [fieldVisibility, setFieldVisibility] = useState<Record<FieldType, boolean>>({ electrostatic: true, magnetic: true, gravity: true, optics: true });
  const [formulaOverlay, setFormulaOverlay] = useState(() => localStorage.getItem("physicslab_formula_overlay") !== "0");
  const [formulaDetail, setFormulaDetail] = useState<{ name: string; expression: string; derivation: string } | null>(null);
  const [canvasTheme, setCanvasTheme] = useState<CanvasTheme>(() => (localStorage.getItem("physicslab_canvas_theme") as CanvasTheme) || "space");
  const [multiSelectedIds, setMultiSelectedIds] = useState<string[]>([]);
  const [momentumBaseline, setMomentumBaseline] = useState<{ px: number; py: number } | null>(null);
  const graphData = useLabStore((state) => state.graphData);
  const cursorIndex = useLabStore((state) => state.cursorIndex);
  const selectedId = useLabStore((state) => state.selectedId);

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
      draw(engine.workerEnabled, dt, now);
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
      if (event.key.toLowerCase() === "e") {
        setFormulaOverlay((enabled) => {
          localStorage.setItem("physicslab_formula_overlay", enabled ? "0" : "1");
          return !enabled;
        });
      }
      if (event.key.toLowerCase() === "t") store.toggleTrails();
      if (event.key.toLowerCase() === "f") fKeyRef.current = true;
      if (event.key.toLowerCase() === "m") store.addObject("ruler", 300, 220);
      if (event.key.toLowerCase() === "s" && !event.ctrlKey) event.preventDefault();
      if (event.ctrlKey && event.key.toLowerCase() === "z") store.undo();
      if (event.ctrlKey && event.key.toLowerCase() === "y") store.redo();
      if (event.key === "Delete") store.removeSelected();
      if (event.key === "+") store.setViewport({ zoom: store.viewport.zoom * 1.1 });
      if (event.key === "-") store.setViewport({ zoom: store.viewport.zoom / 1.1 });
      if (event.key === "Escape") {
        store.selectObject(undefined);
        setContextMenu(null);
        setTooltip(null);
        setInspector(null);
        setPinnedInspectors([]);
        setFbdObject(null);
        setFormulaDetail(null);
        setGuide(null);
      }
      if (event.ctrlKey && event.key.toLowerCase() === "c") {
        copiedRef.current = store.objects.find((object) => object.id === store.selectedId) ?? null;
      }
      if (event.ctrlKey && event.key.toLowerCase() === "v" && copiedRef.current) {
        const copy = { ...copiedRef.current, id: crypto.randomUUID(), x: copiedRef.current.x + 30, y: copiedRef.current.y + 30, trail: [] };
        store.setObjects([...store.objects, copy]);
        store.selectObject(copy.id);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "f") fKeyRef.current = false;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [engine]);

  useEffect(() => {
    localStorage.setItem("physicslab_auto_slowmo", autoSlowMo ? "1" : "0");
  }, [autoSlowMo]);

  useEffect(() => {
    localStorage.setItem("physicslab_canvas_theme", canvasTheme);
  }, [canvasTheme]);

  const makeSettings = (): SimulationSettings => {
    const state = stateRef.current;
    return {
      gravity: state.gravity,
      timeScale: state.timeScale,
      airResistance: state.airResistance,
      airDensity: state.airDensity,
    };
  };

  const draw = (workerEnabled: boolean, dt: number, now: number) => {
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
    fpsRef.current.frames += 1;
    if (now - fpsRef.current.last >= 500) {
      fpsRef.current.fps = Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.last));
      fpsRef.current.frames = 0;
      fpsRef.current.last = now;
    }
    ctx.clearRect(0, 0, width, height);
    drawCanvasBackdrop(ctx, width, height, canvasTheme, state.theme);
    if (state.showGrid) drawScientificGrid(ctx, width, height, state.viewport, canvasTheme);
    drawVignette(ctx, width, height);
    updateSparkHistory(state.objects, now, sparkHistoryRef.current);
    maxEnergyRef.current = Math.max(maxEnergyRef.current, ...state.objects.map((object) => objectEnergy(object)));
    if (!state.running) drawGhostPredictions(ctx, state.objects, state.viewport, state.gravity);
    if (showFieldLines) drawFieldLines(ctx, state.objects, state.viewport, width, height, fieldVisibility, now);
    const collisionBefore = collisionFlashes.length;
    detectCollisionFlashes(state.objects);
    if (autoSlowMo && collisionFlashes.length > collisionBefore && collisionFlashes.length !== lastCollisionCountRef.current) {
      const flash = collisionFlashes[collisionFlashes.length - 1];
      triggerSlowMo("COLLISION", flash.x, flash.y);
      lastCollisionCountRef.current = collisionFlashes.length;
    }
    detectEnergyPulse(state.graphData[state.graphData.length - 1]?.totalEnergy);
    state.objects.filter((object) => object.kind === "wire").forEach((wire) => drawWire(ctx, wire, state.objects, wire.id === state.selectedId, state.viewport));
    state.objects.filter((object) => object.kind !== "wire").forEach((object) => {
      const started = spawnRef.current.get(object.id);
      const scale = started ? clamp((performance.now() - started) / 150, 0, 1) : 1;
      if (started && scale >= 1) spawnRef.current.delete(object.id);
      drawObject(ctx, object, object.id === state.selectedId || multiSelectedIds.includes(object.id), state.showVectors, state.showTrails, state.viewport, state.running, vectorVisibility, maxEnergyRef.current, canvasTheme, 0.8 + 0.2 * scale);
    });
    drawOptics(ctx, state.objects, state.viewport);
    drawWaveOverlay(ctx, state.objects, width, height, dt);
    drawMeasurements(ctx, measurements, state.objects, state.viewport);
    drawMeasurementDraft(ctx, measurementDraft, state.viewport);
    drawCenterOfMass(ctx, state.objects.filter((object) => multiSelectedIds.includes(object.id)), state.viewport);
    drawCursorCrosshair(ctx, cursorWorld, state.viewport, width, height);
    drawCollisionFlashes(ctx, state.viewport);
    if (energyPulse > 0) energyPulse *= 0.88;
    if (now - fpsRef.current.lastHud > 160) {
      fpsRef.current.lastHud = now;
      const latestEnergy = energyFromState(state.objects, state.graphData[state.graphData.length - 1]?.totalEnergy);
      setHud({
        fps: fpsRef.current.fps,
        time: state.simulationTime,
        running: state.running,
        mode: state.selectedTool === "wire" ? "Wire" : dragRef.current ? "Drag" : panRef.current ? "Pan" : "Select",
        engine: workerEnabled ? "worker" : "main",
        zoom: state.viewport.zoom,
      });
      setEnergyHud(latestEnergy);
      const selected = state.objects.find((object) => object.id === state.selectedId);
      setInspector(selected ? makeInspector(selected, state.viewport) : null);
    }
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
    if (measurementTool !== "select") {
      handleMeasurementPoint(point);
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
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
    if (fKeyRef.current && object) {
      useLabStore.getState().selectObject(object.id);
      setFbdObject(object);
      return;
    }
    if (event.shiftKey && object) {
      useLabStore.getState().selectObject(object.id);
      setMultiSelectedIds((ids) => {
        const next = ids.includes(object.id) ? ids.filter((id) => id !== object.id) : [...ids, object.id];
        if (next.length === 2) setMomentumBaseline(totalMomentum(useLabStore.getState().objects.filter((item) => next.includes(item.id))));
        if (next.length < 2) setMomentumBaseline(null);
        return next;
      });
      return;
    }
    if (!event.shiftKey) {
      setMultiSelectedIds(object?.id ? [object.id] : []);
      setMomentumBaseline(null);
    }
    useLabStore.getState().selectObject(object?.id);
    if (object) {
      dragRef.current = { id: object.id, dx: object.x - point.x, dy: object.y - point.y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    rect.width;
  };

  const handleMeasurementPoint = (point: { x: number; y: number }) => {
    const store = useLabStore.getState();
    if (measurementTool === "velocity") {
      const object = [...store.objects].reverse().find((candidate) => hitTest(candidate, point.x, point.y));
      if (object) {
        setMeasurements((items) => [...items, { id: crypto.randomUUID(), type: "velocity", objectId: object.id, label: `${object.name} velocity` }]);
        setMeasurementTool("select");
      }
      return;
    }
    const nextPoints = [...measurementDraft, point];
    const required = measurementTool === "protractor" ? 3 : 2;
    if (nextPoints.length < required) {
      setMeasurementDraft(nextPoints);
      return;
    }
    if (measurementTool === "ruler") {
      setMeasurements((items) => [...items, { id: crypto.randomUUID(), type: "ruler", points: [nextPoints[0], nextPoints[1]] }]);
    } else {
      setMeasurements((items) => [...items, { id: crypto.randomUUID(), type: "protractor", points: [nextPoints[0], nextPoints[1], nextPoints[2]] }]);
    }
    setMeasurementDraft([]);
    setMeasurementTool("select");
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const pan = panRef.current;
    const point = pointerToWorld(event);
    setCursorWorld({ x: point.x, y: point.y });
    if (pan) {
      const nextOffsetX = pan.offsetX + event.clientX - pan.x;
      const nextOffsetY = pan.offsetY + event.clientY - pan.y;
      panVelocityRef.current = { vx: event.movementX, vy: event.movementY };
      useLabStore.getState().setViewport({ offsetX: nextOffsetX, offsetY: nextOffsetY });
      return;
    }
    const drag = dragRef.current;
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

  const triggerSlowMo = (label: string, x?: number, y?: number) => {
    window.clearTimeout(slowMoTimerRef.current);
    const store = useLabStore.getState();
    restoreSpeedRef.current = store.timeScale;
    store.setTimeScale(0.1);
    setSlowMoEvent({ label, started: performance.now(), x, y });
    if (x !== undefined && y !== undefined) {
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (rect) {
        store.setViewport({
          zoom: store.viewport.zoom * 1.2,
          offsetX: rect.width / 2 - x * store.viewport.zoom * 1.2,
          offsetY: rect.height / 2 - y * store.viewport.zoom * 1.2,
        });
      }
    }
    slowMoTimerRef.current = window.setTimeout(() => {
      useLabStore.getState().setTimeScale(restoreSpeedRef.current);
      setSlowMoEvent(null);
    }, 1800);
  };

  const selectedContextObject = contextMenu ? useLabStore.getState().objects.find((object) => object.id === contextMenu.id) : undefined;
  const scrubIndex = Math.min(cursorIndex, Math.max(0, graphData.length - 1));
  const scrubPoint = graphData[scrubIndex];
  const scrubSimulation = (index: number) => {
    const point = graphData[index];
    useLabStore.getState().setCursorIndex(index);
    if (!point || !selectedId) return;
    useLabStore.getState().setRunning(false);
    useLabStore.getState().updateObject(selectedId, { x: point.x, y: point.y, vx: point.vx, vy: point.vy, trail: [] });
  };

  return (
    <div
      className="physics-canvas-shell relative h-full w-full"
      data-canvas-theme={canvasTheme}
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
        className="physics-canvas h-full w-full cursor-crosshair rounded-md"
        onContextMenu={handleContextMenu}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        aria-label="Interactive physics simulation canvas"
      />
      <div className="canvas-hud canvas-hud-mode">{hud.mode}</div>
      <div className="canvas-hud canvas-hud-info">
        <span>{hud.fps || "--"} FPS</span>
        <span>t {hud.time.toFixed(2)}s</span>
        <span>{Math.round(hud.zoom * 100)}%</span>
      </div>
      <div className="canvas-hud canvas-hud-coords">
        x {cursorWorld ? cursorWorld.x.toFixed(1) : "0.0"} · y {cursorWorld ? cursorWorld.y.toFixed(1) : "0.0"}
      </div>
      <div className="canvas-scale-bar">
        <span />
        <strong>1 grid = {meters(100 / hud.zoom).toFixed(2)} m</strong>
      </div>
      <div className="canvas-vector-strip" aria-label="Vector visibility">
        {(Object.keys(vectorVisibility) as VectorType[]).map((type) => (
          <button key={type} className={vectorVisibility[type] ? "active" : ""} type="button" title={type} onClick={() => setVectorVisibility((state) => ({ ...state, [type]: !state[type] }))}>
            {vectorLabels[type]}
          </button>
        ))}
      </div>
      <div className="canvas-measure-strip" aria-label="Measurement tools">
        {(["select", "ruler", "protractor", "velocity"] as MeasurementTool[]).map((tool) => (
          <button key={tool} className={measurementTool === tool ? "active" : ""} type="button" onClick={() => { setMeasurementTool(tool); setMeasurementDraft([]); }} title={tool}>
            {tool === "select" ? "S" : tool === "ruler" ? "R" : tool === "protractor" ? "deg" : "v"}
          </button>
        ))}
        <button type="button" onClick={() => { setMeasurements([]); setMeasurementDraft([]); }} title="Clear measurements">x</button>
      </div>
      <div className="canvas-theme-strip" aria-label="Canvas themes">
        {(Object.keys(canvasThemes) as CanvasTheme[]).map((themeName) => (
          <button key={themeName} className={canvasTheme === themeName ? "active" : ""} type="button" onClick={() => setCanvasTheme(themeName)} title={canvasThemes[themeName].label}>
            {canvasThemes[themeName].short}
          </button>
        ))}
      </div>
      <div className="canvas-analysis-strip" aria-label="Analysis overlays">
        <button className={showFieldLines ? "active" : ""} type="button" onClick={() => setShowFieldLines((value) => !value)}>Fields</button>
        {(Object.keys(fieldVisibility) as FieldType[]).map((field) => (
          <button key={field} className={fieldVisibility[field] ? "active" : ""} type="button" onClick={() => setFieldVisibility((state) => ({ ...state, [field]: !state[field] }))}>
            {field === "electrostatic" ? "E" : field === "magnetic" ? "B" : field === "gravity" ? "g" : "ray"}
          </button>
        ))}
        <button className={formulaOverlay ? "active" : ""} type="button" onClick={() => setFormulaOverlay((value) => !value)}>Eq</button>
        <button className={autoSlowMo ? "active" : ""} type="button" onClick={() => setAutoSlowMo((value) => !value)}>Slo</button>
      </div>
      <EnergyAuditPanel energy={energyHud} />
      {slowMoEvent && <div className="canvas-slowmo-overlay"><span>{slowMoEvent.label} · 0.1x</span></div>}
      {formulaOverlay && <FormulaOverlay objects={stateRef.current.objects} viewport={stateRef.current.viewport} time={hud.time} onOpen={setFormulaDetail} />}
      {formulaDetail && <FormulaDetailCard detail={formulaDetail} onClose={() => setFormulaDetail(null)} />}
      {graphData.length > 4 && (
        <div className="canvas-timeline">
          <div className="canvas-timeline-meta">
            <span>Replay</span>
            <strong>{scrubPoint ? `t ${scrubPoint.t.toFixed(2)}s` : "ready"}</strong>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(0, graphData.length - 1)}
            value={scrubIndex}
            onChange={(event) => scrubSimulation(Number(event.target.value))}
            aria-label="Simulation replay timeline"
          />
          <div className="canvas-timeline-bookmarks">
            {makeTimelineBookmarks(graphData).map((bookmark) => (
              <span key={`${bookmark.kind}-${bookmark.index}`} className={`bookmark-${bookmark.kind}`} style={{ left: `${(bookmark.index / Math.max(1, graphData.length - 1)) * 100}%` }} title={bookmark.label} />
            ))}
          </div>
        </div>
      )}
      {inspector && (
        <HoverInspector
          inspector={inspector}
          histories={sparkHistoryRef.current}
          pinned={false}
          onPin={(object) => setPinnedInspectors((items) => [object, ...items.filter((item) => item.id !== object.id)].slice(0, 3))}
          onClose={() => {
            useLabStore.getState().selectObject(undefined);
            setInspector(null);
          }}
        />
      )}
      {pinnedInspectors.map((object, index) => (
        <HoverInspector
          key={object.id}
          inspector={{ ...makeInspector(object, stateRef.current.viewport), object }}
          histories={sparkHistoryRef.current}
          pinned
          offset={index}
          onUnpin={(id) => setPinnedInspectors((items) => items.filter((item) => item.id !== id))}
          onClose={(id) => setPinnedInspectors((items) => items.filter((item) => item.id !== id))}
        />
      ))}
      {fbdObject && <FreeBodyDiagramPanel object={stateRef.current.objects.find((object) => object.id === fbdObject.id) ?? fbdObject} onClose={() => setFbdObject(null)} />}
      {multiSelectedIds.length > 1 && <SystemStatsBar objects={stateRef.current.objects.filter((object) => multiSelectedIds.includes(object.id))} baseline={momentumBaseline} />}
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
      {selectedId && !contextMenu && <SelectedObjectStrip objectId={selectedId} />}
    </div>
  );
}

function CanvasInspector({ inspector, running }: { inspector: { x: number; y: number; object: PhysicsObjectInstance }; running: boolean }) {
  const speed = Math.hypot(inspector.object.vx, inspector.object.vy);
  const energy = 0.5 * inspector.object.mass * speed * speed;
  return (
    <div className={running ? "canvas-inspector canvas-inspector-live" : "canvas-inspector"} style={{ left: inspector.x, top: inspector.y }}>
      <div className="canvas-inspector-title">{inspector.object.name}</div>
      <div>v {speed.toFixed(2)} m/s</div>
      <div>m {inspector.object.mass.toFixed(2)} kg</div>
      <div>E {energy.toFixed(2)} J</div>
    </div>
  );
}

function makeInspector(object: PhysicsObjectInstance, viewport: ViewportState) {
  const p = worldToScreen(object.x, object.y, viewport);
  const width = object.width ?? (object.radius ?? 22) * 2;
  const height = object.height ?? (object.radius ?? 22) * 2;
  return {
    x: p.x + (width * viewport.zoom) / 2 + 16,
    y: p.y - (height * viewport.zoom) / 2,
    object,
  };
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
  drawScientificGrid(ctx, width, height, viewport, "space");
}

function drawScientificGrid(ctx: CanvasRenderingContext2D, width: number, height: number, viewport: ViewportState, canvasTheme: CanvasTheme = "space") {
  const topLeft = screenToWorld(0, 0, viewport);
  const bottomRight = screenToWorld(width, height, viewport);
  const minor = 20;
  const major = 100;
  const majorColor = canvasTheme === "blueprint" ? "rgba(255,255,255,0.36)" : canvasTheme === "whiteboard" ? "rgba(15,23,42,0.14)" : canvasTheme === "bench" ? "rgba(255,255,255,0.2)" : "rgba(0, 229, 255, 0.22)";
  const minorColor = canvasTheme === "blueprint" ? "rgba(255,255,255,0.14)" : canvasTheme === "whiteboard" ? "rgba(15,23,42,0.08)" : canvasTheme === "bench" ? "rgba(255,255,255,0.08)" : "rgba(148, 163, 184, 0.09)";
  const axisColor = canvasTheme === "whiteboard" ? "rgba(15,23,42,0.5)" : canvasTheme === "blueprint" ? "rgba(255,255,255,0.68)" : "rgba(0, 229, 255, 0.62)";
  ctx.save();
  ctx.lineCap = "butt";
  for (let x = Math.floor(topLeft.x / minor) * minor; x <= bottomRight.x; x += minor) {
    const p = worldToScreen(x, 0, viewport);
    const isMajor = Math.abs(Math.round(x / major) * major - x) < 0.001;
    ctx.strokeStyle = isMajor ? majorColor : minorColor;
    ctx.lineWidth = isMajor ? 1 : 0.65;
    ctx.beginPath();
    ctx.moveTo(Math.round(p.x) + 0.5, 0);
    ctx.lineTo(Math.round(p.x) + 0.5, height);
    ctx.stroke();
  }
  for (let y = Math.floor(topLeft.y / minor) * minor; y <= bottomRight.y; y += minor) {
    const p = worldToScreen(0, y, viewport);
    const isMajor = Math.abs(Math.round(y / major) * major - y) < 0.001;
    ctx.strokeStyle = isMajor ? majorColor : minorColor;
    ctx.lineWidth = isMajor ? 1 : 0.65;
    ctx.beginPath();
    ctx.moveTo(0, Math.round(p.y) + 0.5);
    ctx.lineTo(width, Math.round(p.y) + 0.5);
    ctx.stroke();
  }
  const origin = worldToScreen(0, 0, viewport);
  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.stroke();
  ctx.fillStyle = "rgba(226, 232, 240, 0.86)";
  ctx.font = "700 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textBaseline = "top";
  for (let x = Math.floor(topLeft.x / major) * major; x <= bottomRight.x; x += major) {
    const p = worldToScreen(x, 0, viewport);
    ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(p.x, origin.y - 5);
    ctx.lineTo(p.x, origin.y + 5);
    ctx.stroke();
    ctx.fillText(`${meters(x).toFixed(0)}m`, p.x + 4, clamp(origin.y + 7, 8, height - 18));
  }
  for (let y = Math.floor(topLeft.y / major) * major; y <= bottomRight.y; y += major) {
    const p = worldToScreen(0, y, viewport);
    ctx.strokeStyle = "rgba(0, 229, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(origin.x - 5, p.y);
    ctx.lineTo(origin.x + 5, p.y);
    ctx.stroke();
    ctx.fillText(`${meters(y).toFixed(0)}m`, clamp(origin.x + 8, 8, width - 48), p.y + 4);
  }
  ctx.fillStyle = "rgba(0, 229, 255, 0.92)";
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText("origin", origin.x + 8, origin.y - 18);
  ctx.restore();
}

function drawAxes(ctx: CanvasRenderingContext2D, viewport: ViewportState) {
  drawScientificGrid(ctx, ctx.canvas.width, ctx.canvas.height, viewport, "space");
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const vignette = ctx.createRadialGradient(width / 2, height / 2, Math.min(width, height) * 0.12, width / 2, height / 2, Math.max(width, height) * 0.7);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.72, "rgba(0, 0, 0, 0.12)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.48)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawObject(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, selected: boolean, vectors: boolean, trails: boolean, viewport: ViewportState, running: boolean, vectorVisibility: Record<VectorType, boolean>, maxEnergy: number, canvasTheme: CanvasTheme, spawnScale = 1) {
  withViewport(ctx, viewport, () => {
    if (object.kind === "double-pendulum") {
      drawDoublePendulum(ctx, object, selected, trails, viewport.zoom);
      return;
    }
    if (trails && object.trail.length > 1) {
      const base = object.color ?? "#22d3ee";
      const r = parseInt(base.slice(1, 3), 16) || 34;
      const g = parseInt(base.slice(3, 5), 16) || 211;
      const b = parseInt(base.slice(5, 7), 16) || 238;
      const len = object.trail.length;
      for (let i = 1; i < len; i++) {
        const t = i / len;
        ctx.beginPath();
        ctx.moveTo(object.trail[i - 1].x, object.trail[i - 1].y);
        ctx.lineTo(object.trail[i].x, object.trail[i].y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(t * 0.85).toFixed(2)})`;
        ctx.lineWidth = (0.8 + t * 2.4) / viewport.zoom;
        ctx.lineCap = "round";
        ctx.stroke();
      }
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
    applyEnergyGlow(ctx, object, maxEnergy, canvasTheme);
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
      drawArrow(ctx, -(object.width ?? 80) / 2, 0, (object.width ?? 80) / 2, 0, object.color ?? "#38bdf8", viewport.zoom, running);
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
    } else if (object.kind === "rope") {
      const w = object.width ?? 150;
      ctx.beginPath();
      ctx.moveTo(-w / 2, 0);
      for (let i = 1; i <= 10; i++) {
        const x = -w / 2 + (i / 10) * w;
        ctx.lineTo(x, (i % 2 === 0 ? -1 : 1) * 4);
      }
      ctx.strokeStyle = object.color ?? "#cbd5e1";
      ctx.lineWidth = 5;
      ctx.stroke();
    } else if (object.kind === "cart") {
      const w = object.width ?? 76;
      const h = object.height ?? 36;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      const r = 9;
      ctx.fillStyle = "#1e293b";
      ctx.beginPath(); ctx.arc(-w / 2 + r + 4, h / 2 - 1, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(w / 2 - r - 4, h / 2 - 1, r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#94a3b8";
      ctx.beginPath(); ctx.arc(-w / 2 + r + 4, h / 2 - 1, r, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2 - r - 4, h / 2 - 1, r, 0, Math.PI * 2); ctx.stroke();
    } else if (object.kind === "rod") {
      const w = object.width ?? 140;
      const h = object.height ?? 14;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(-w / 2 + 4, -h / 2 + 3, w - 8, 3);
    } else if (object.kind === "stopwatch") {
      const r = (object.width ?? 54) / 2;
      ctx.beginPath(); ctx.arc(0, 2, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-4, -r - 8, 8, 8);
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(0, -(r - 8)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 2); ctx.lineTo(r * 0.6, 2 + r * 0.3); ctx.stroke();
    } else if (object.kind === "ruler") {
      const w = object.width ?? 180;
      const h = object.height ?? 18;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 1;
      const ticks = 10;
      for (let i = 0; i <= ticks; i++) {
        const x = -w / 2 + (i / ticks) * w;
        const tickH = i % 5 === 0 ? h * 0.65 : h * 0.35;
        ctx.beginPath(); ctx.moveTo(x, -h / 2); ctx.lineTo(x, -h / 2 + tickH); ctx.stroke();
      }
      ctx.fillStyle = "#78350f";
      ctx.font = "8px sans-serif";
      ctx.fillText("0", -w / 2 + 2, h / 2 - 2);
      ctx.fillText("cm", w / 2 - 16, h / 2 - 2);
    } else if (object.kind === "graph-plotter") {
      const w = object.width ?? 68;
      const h = object.height ?? 52;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 6, h / 2 - 6);
      ctx.lineTo(-w / 2 + 6, -h / 2 + 6);
      ctx.moveTo(-w / 2 + 6, h / 2 - 6);
      ctx.lineTo(w / 2 - 6, h / 2 - 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 10, h / 4);
      ctx.lineTo(-w / 2 + 18, -h / 8);
      ctx.lineTo(-w / 2 + 28, h / 6);
      ctx.lineTo(w / 2 - 10, -h / 4);
      ctx.stroke();
    } else if (object.kind === "motion-sensor") {
      const w = object.width ?? 62;
      const h = object.height ?? 34;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.beginPath(); ctx.arc(-w / 2 + 12, 0, 8, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#818cf8"; ctx.lineWidth = 1.5;
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(-w / 2 + 12, 0, 8 + i * 6, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
      }
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "8px sans-serif";
      ctx.fillText("MOT", w / 2 - 26, 4);
    } else if (object.kind === "force-sensor") {
      const w = object.width ?? 62;
      const h = object.height ?? 34;
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "#fb7185"; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, h * 0.3, -Math.PI * 0.6, Math.PI * 0.6);
      ctx.stroke();
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "8px sans-serif";
      ctx.fillText("F", -4, 4);
    } else if (object.kind === "electric-field-region") {
      const w = object.width ?? 180;
      const h = object.height ?? 110;
      ctx.fillStyle = "rgba(6,182,212,0.1)";
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeStyle = "#06b6d4";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.setLineDash([]);
      ctx.strokeStyle = "rgba(6,182,212,0.6)";
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const x = -w / 2 + (i / 4) * w;
        drawArrow(ctx, x, -h / 2 + 10, x, h / 2 - 10, "rgba(6,182,212,0.7)", 1, running);
      }
    } else if (object.kind === "gas-container") {
      const w = object.width ?? 150;
      const h = object.height ?? 110;
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(249,115,22,0.12)";
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "#f97316";
      ctx.font = "10px sans-serif";
      ctx.fillText(`T=${Math.round(object.temperature ?? 300)}K`, -w / 2 + 6, -h / 2 + 14);
      const dots = [[0.2, 0.3], [0.5, 0.6], [0.75, 0.35], [0.35, 0.7], [0.65, 0.2]];
      dots.forEach(([px, py]) => {
        ctx.beginPath();
        ctx.arc(-w / 2 + px * w, -h / 2 + py * h, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (object.kind === "plane-mirror") {
      const w = object.width ?? 18;
      const h = object.height ?? 150;
      ctx.fillStyle = "#bfdbfe";
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillRect(-w / 2 + 2, -h / 2 + 4, w - 4, 6);
    } else {
      ctx.fillRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
      ctx.strokeRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
    }
    if (isCircuitObject(object)) drawTerminals(ctx, object);
    if (selected) drawSelectionRing(ctx, object, viewport.zoom);
    ctx.restore();
    if (vectors && !object.isStatic) {
      drawObjectVectors(ctx, object, viewport.zoom, running, vectorVisibility);
    }
  });
}

function drawSelectionRing(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, zoom: number) {
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 180);
  const color = categoryColor(object.kind);
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 18 + pulse * 18;
  ctx.strokeStyle = hexToRgba(color, 0.68);
  ctx.lineWidth = (5 + pulse * 2) / zoom;
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge", "bulb", "ammeter", "voltmeter", "wave-source"].includes(object.kind)) {
    ctx.beginPath();
    ctx.arc(0, 0, (object.radius ?? 22) + 8 + pulse * 3, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const w = (object.width ?? 48) + 14 + pulse * 4;
    const h = (object.height ?? 48) + 14 + pulse * 4;
    roundedRectPath(ctx, -w / 2, -h / 2, w, h, Math.min(18, Math.max(10, Math.min(w, h) / 4)));
    ctx.stroke();
  }
  ctx.restore();
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
    const prism = objects.find((object) => object.kind === "prism");
    if (prism) drawContinuousSpectrum(ctx, prism, viewport.zoom);
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
  drawOscilloscope(ctx, objects, width, height);
  if (objects.filter((object) => object.kind === "wave-source").length >= 2 || objects.some((object) => object.kind === "wave-barrier")) {
    drawInterferenceBar(ctx, objects, width, height);
  }
}

function drawContinuousSpectrum(ctx: CanvasRenderingContext2D, prism: PhysicsObjectInstance, zoom: number) {
  const x = prism.x + (prism.width ?? 86) / 2 + 76;
  const y = prism.y - 52;
  const width = 210;
  const height = 24;
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  [
    [0, "#6d28d9"],
    [0.14, "#4f46e5"],
    [0.28, "#2563eb"],
    [0.45, "#22c55e"],
    [0.62, "#facc15"],
    [0.78, "#f97316"],
    [1, "#ef4444"],
  ].forEach(([stop, color]) => gradient.addColorStop(Number(stop), String(color)));
  ctx.save();
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 14 / zoom;
  roundedRectPath(ctx, x, y, width, height, 10 / zoom);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(226,232,240,0.78)";
  ctx.lineWidth = 1 / zoom;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#e2e8f0";
  ctx.font = `${11 / zoom}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.fillText("380nm", x, y - 7 / zoom);
  ctx.fillText("700nm", x + width - 40 / zoom, y - 7 / zoom);
  ctx.fillText(`n(lambda) via Cauchy - ${((prism.refractiveIndex ?? 1.5) + 0.02).toFixed(3)} to ${((prism.refractiveIndex ?? 1.5) - 0.01).toFixed(3)}`, x + 8 / zoom, y + height + 14 / zoom);
  ctx.restore();
}

function drawOscilloscope(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], width: number, height: number) {
  const source = objects.find((object) => object.kind === "wave-source");
  if (!source) return;
  const panel = { x: 18, y: height - 178, w: 280, h: 124 };
  const frequency = source.frequency ?? 2;
  const amplitude = source.amplitude ?? 1;
  ctx.save();
  roundedRectPath(ctx, panel.x, panel.y, panel.w, panel.h, 14);
  ctx.fillStyle = "rgba(2, 6, 17, 0.84)";
  ctx.fill();
  ctx.strokeStyle = "rgba(34, 197, 94, 0.38)";
  ctx.stroke();
  ctx.strokeStyle = "rgba(34,197,94,0.16)";
  ctx.lineWidth = 1;
  for (let x = panel.x + 20; x < panel.x + panel.w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, panel.y + 10); ctx.lineTo(x, panel.y + panel.h - 20); ctx.stroke();
  }
  for (let y = panel.y + 20; y < panel.y + panel.h - 20; y += 20) {
    ctx.beginPath(); ctx.moveTo(panel.x + 10, y); ctx.lineTo(panel.x + panel.w - 10, y); ctx.stroke();
  }
  ctx.strokeStyle = "#22c55e";
  ctx.shadowColor = "#22c55e";
  ctx.shadowBlur = 10;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= panel.w - 24; i += 2) {
    const t = i / (panel.w - 24);
    const x = panel.x + 12 + i;
    const y = panel.y + panel.h / 2 + Math.sin(t * Math.PI * 4 * frequency + performance.now() / 260) * amplitude * 22;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#bbf7d0";
  ctx.font = "800 11px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText(`OSC  f=${frequency.toFixed(2)}Hz  A=${amplitude.toFixed(2)}`, panel.x + 12, panel.y + panel.h - 9);
  ctx.restore();
}

function drawInterferenceBar(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], width: number, height: number) {
  const panel = { x: width - 300, y: height - 50, w: 260, h: 18 };
  const sources = objects.filter((object) => object.kind === "wave-source");
  const separation = sources.length >= 2 ? Math.abs(sources[1].x - sources[0].x) : 80;
  ctx.save();
  roundedRectPath(ctx, panel.x, panel.y, panel.w, panel.h, 9);
  ctx.clip();
  for (let i = 0; i < panel.w; i += 1) {
    const phase = Math.cos((i / panel.w) * Math.PI * 18 * (separation / 100));
    const intensity = Math.pow((phase + 1) / 2, 1.8);
    ctx.fillStyle = `rgba(${Math.round(255 * intensity)}, ${Math.round(210 * intensity)}, ${Math.round(70 * intensity)}, 0.95)`;
    ctx.fillRect(panel.x + i, panel.y, 1, panel.h);
  }
  ctx.restore();
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "800 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.fillText("live interference intensity", panel.x + 5, panel.y - 6);
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

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, zoom: number, running = false) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const length = Math.hypot(x2 - x1, y2 - y1);
  if (length < 2) return;
  const breathe = running ? 1 + Math.sin(performance.now() / 190) * 0.18 : 1;
  const tip = (9 * breathe) / zoom;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2 / zoom;
  ctx.lineCap = "round";
  ctx.shadowColor = color;
  ctx.shadowBlur = running ? 12 : 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - Math.cos(angle) * tip * 0.65, y2 - Math.sin(angle) * tip * 0.65);
  ctx.stroke();
  ctx.globalAlpha = 0.24;
  ctx.lineWidth = 6 / zoom;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - Math.cos(angle) * tip, y2 - Math.sin(angle) * tip);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - tip * Math.cos(angle - 0.42), y2 - tip * Math.sin(angle - 0.42));
  ctx.lineTo(x2 - tip * 0.55 * Math.cos(angle), y2 - tip * 0.55 * Math.sin(angle));
  ctx.lineTo(x2 - tip * Math.cos(angle + 0.42), y2 - tip * Math.sin(angle + 0.42));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawObjectVectors(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, zoom: number, running: boolean, visible: Record<VectorType, boolean>) {
  const speed = Math.hypot(object.vx, object.vy);
  const scale = clamp(22 / Math.max(0.5, zoom), 12, 42);
  if (visible.velocity && speed > 0.05) {
    const length = clamp(speed * scale, 24 / zoom, 130 / zoom);
    const angle = Math.atan2(object.vy, object.vx);
    const end = { x: object.x + Math.cos(angle) * length, y: object.y + Math.sin(angle) * length };
    drawLabeledArrow(ctx, object.x, object.y, end.x, end.y, "#38bdf8", zoom, running, "v", `${speed.toFixed(1)} m/s`);
    drawComponentVector(ctx, object.x, object.y, end.x, object.y, "#38bdf8", zoom, "v_x");
    drawComponentVector(ctx, end.x, object.y, end.x, end.y, "#60a5fa", zoom, "v_y");
  }
  if (visible.weight) {
    const weight = object.mass * 9.81;
    drawLabeledArrow(ctx, object.x - 10 / zoom, object.y, object.x - 10 / zoom, object.y + clamp(weight * 0.9, 28, 92) / zoom, "#f59e0b", zoom, running, "W", `${weight.toFixed(1)} N`);
  }
  if (visible.normal) {
    drawLabeledArrow(ctx, object.x + 10 / zoom, object.y, object.x + 10 / zoom, object.y - 42 / zoom, "#a7f3d0", zoom, running, "N", `${(object.mass * 9.81).toFixed(1)} N`);
  }
  if (visible.friction && speed > 0.05) {
    const sign = object.vx >= 0 ? -1 : 1;
    drawLabeledArrow(ctx, object.x, object.y + 10 / zoom, object.x + sign * 46 / zoom, object.y + 10 / zoom, "#fb7185", zoom, running, "f", `${Math.abs(object.friction ?? 0).toFixed(2)}`);
  }
  if (visible.netForce) {
    const ax = object.ax || 0;
    const ay = object.ay || 0;
    const force = Math.hypot(ax, ay) * object.mass;
    if (force > 0.05) drawLabeledArrow(ctx, object.x, object.y, object.x + ax * 10, object.y + ay * 10, "#34d399", zoom, running, "F_net", `${force.toFixed(1)} N`);
  }
  if (Math.abs(object.angle) > 0.05 || Math.abs(object.omega1 ?? object.omega2 ?? 0) > 0.05) {
    drawAngleArc(ctx, object.x, object.y, object.angle, zoom);
  }
}

function drawLabeledArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, zoom: number, running: boolean, label: string, magnitude: string) {
  drawArrow(ctx, x1, y1, x2, y2, color, zoom, running);
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const mid = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  const tip = { x: x2 + Math.cos(angle) * 10 / zoom, y: y2 + Math.sin(angle) * 10 / zoom };
  drawVectorChip(ctx, tip.x, tip.y, label, color, zoom);
  drawVectorChip(ctx, mid.x, mid.y, magnitude, color, zoom, true);
}

function drawComponentVector(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, zoom: number, label: string) {
  if (Math.hypot(x2 - x1, y2 - y1) < 8 / zoom) return;
  ctx.save();
  ctx.setLineDash([7 / zoom, 5 / zoom]);
  drawArrow(ctx, x1, y1, x2, y2, color, zoom, false);
  ctx.setLineDash([]);
  drawVectorChip(ctx, x2, y2, label, color, zoom);
  ctx.restore();
}

function drawVectorChip(ctx: CanvasRenderingContext2D, x: number, y: number, text: string, color: string, zoom: number, small = false) {
  ctx.save();
  ctx.font = `${small ? 9 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  const width = ctx.measureText(text).width + 12;
  const height = small ? 16 : 18;
  ctx.fillStyle = "rgba(5, 12, 24, 0.82)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 1 / zoom;
  roundedRectPath(ctx, x - width / 2, y - height / 2, width, height, height / 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e2e8f0";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawAngleArc(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, zoom: number) {
  const radius = 34 / zoom;
  ctx.save();
  ctx.strokeStyle = "rgba(124, 58, 237, 0.78)";
  ctx.fillStyle = "rgba(124, 58, 237, 0.12)";
  ctx.lineWidth = 2 / zoom;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, angle, angle < 0);
  ctx.stroke();
  const degrees = ((angle * 180) / Math.PI) % 360;
  drawVectorChip(ctx, x + radius * Math.cos(angle / 2), y + radius * Math.sin(angle / 2), `${degrees.toFixed(0)} deg`, "#7c3aed", zoom, true);
  ctx.restore();
}

function drawCursorCrosshair(ctx: CanvasRenderingContext2D, cursor: { x: number; y: number } | null, viewport: ViewportState, width: number, height: number) {
  if (!cursor) return;
  const p = worldToScreen(cursor.x, cursor.y, viewport);
  ctx.save();
  ctx.strokeStyle = "rgba(0, 229, 255, 0.36)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.moveTo(p.x, 0);
  ctx.lineTo(p.x, height);
  ctx.moveTo(0, p.y);
  ctx.lineTo(width, p.y);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawCanvasBackdrop(ctx: CanvasRenderingContext2D, width: number, height: number, canvasTheme: CanvasTheme, appTheme: "dark" | "light") {
  if (canvasTheme === "whiteboard") {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (canvasTheme === "blueprint") {
    ctx.fillStyle = "#08204a";
    ctx.fillRect(0, 0, width, height);
    return;
  }
  if (canvasTheme === "bench") {
    ctx.fillStyle = "#1f2328";
    ctx.fillRect(0, 0, width, height);
    const wood = ctx.createLinearGradient(0, height - 92, 0, height);
    wood.addColorStop(0, "rgba(93, 64, 45, 0.15)");
    wood.addColorStop(1, "rgba(142, 93, 48, 0.34)");
    ctx.fillStyle = wood;
    ctx.fillRect(0, height - 92, width, 92);
    return;
  }
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.76);
  gradient.addColorStop(0, appTheme === "dark" ? "#0b1b31" : "#ffffff");
  gradient.addColorStop(0.52, appTheme === "dark" ? "#071121" : "#eef6ff");
  gradient.addColorStop(1, appTheme === "dark" ? "#020611" : "#dbeafe");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawGhostPredictions(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], viewport: ViewportState, gravity: number) {
  withViewport(ctx, viewport, () => {
    objects.filter((object) => !object.isStatic).forEach((object) => {
      const speed = Math.hypot(object.vx, object.vy);
      if (object.kind === "pendulum") {
        const length = object.length ?? 120;
        const pivot = { x: object.pivotX ?? object.x, y: object.pivotY ?? object.y - length };
        ctx.strokeStyle = "rgba(0,229,255,0.32)";
        ctx.setLineDash([8 / viewport.zoom, 8 / viewport.zoom]);
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.beginPath();
        ctx.arc(pivot.x, pivot.y, length, Math.PI / 2 - 0.55, Math.PI / 2 + 0.55);
        ctx.stroke();
        ctx.setLineDash([]);
        drawVectorChip(ctx, pivot.x + length * 0.52, pivot.y + length * 0.82, "predicted swing", "#00e5ff", viewport.zoom, true);
        return;
      }
      if (object.kind === "charge" && Math.abs(object.charge ?? 0) > 0) {
        ctx.strokeStyle = "rgba(124,58,237,0.36)";
        ctx.setLineDash([6 / viewport.zoom, 7 / viewport.zoom]);
        ctx.lineWidth = 2 / viewport.zoom;
        ctx.beginPath();
        ctx.ellipse(object.x, object.y, 54 + Math.abs(object.charge ?? 1) * 8, 34 + speed * 4, object.angle, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        drawVectorChip(ctx, object.x + 60, object.y - 38, "field orbit", "#7c3aed", viewport.zoom, true);
        return;
      }
      if (speed < 0.05) return;
      const points: { x: number; y: number; t: number }[] = [];
      for (let t = 0; t <= 4; t += 0.08) {
        const x = object.x + object.vx * 55 * t;
        const y = object.y + object.vy * 55 * t + 0.5 * gravity * 18 * t * t;
        points.push({ x, y, t });
        if (y > 650) break;
      }
      if (points.length < 2) return;
      ctx.strokeStyle = "rgba(0,229,255,0.34)";
      ctx.setLineDash([9 / viewport.zoom, 8 / viewport.zoom]);
      ctx.lineWidth = 2 / viewport.zoom;
      ctx.beginPath();
      points.forEach((point, index) => index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y));
      ctx.stroke();
      ctx.setLineDash([]);
      const peak = points.reduce((best, point) => point.y < best.y ? point : best, points[0]);
      const land = points[points.length - 1];
      drawVectorChip(ctx, peak.x, peak.y - 18 / viewport.zoom, `peak ${meters(560 - peak.y).toFixed(2)}m`, "#00e5ff", viewport.zoom, true);
      drawVectorChip(ctx, land.x, land.y + 16 / viewport.zoom, `landing ${meters(land.x - object.x).toFixed(2)}m`, "#f59e0b", viewport.zoom, true);
    });
  });
}

function drawFieldLines(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], viewport: ViewportState, width: number, height: number, visible: Record<FieldType, boolean>, now: number) {
  const charges = objects.filter((object) => object.kind === "charge" && Math.abs(object.charge ?? 0) > 0);
  const magnets = objects.filter((object) => object.kind === "bar-magnet");
  const masses = objects.filter((object) => !object.isStatic && object.mass > 2);
  const optics = objects.filter((object) => object.kind === "convex-lens" || object.kind === "concave-mirror");
  withViewport(ctx, viewport, () => {
    if (visible.electrostatic) charges.forEach((charge) => {
      const sign = (charge.charge ?? 1) >= 0 ? 1 : -1;
      for (let i = 0; i < 16; i += 1) {
        const angle = (i / 16) * Math.PI * 2;
        traceFieldLine(ctx, { x: charge.x + Math.cos(angle) * 18, y: charge.y + Math.sin(angle) * 18 }, charges, sign, viewport.zoom, now, i, sign > 0 ? "#ef4444" : "#2563eb");
      }
    });
    if (visible.magnetic) magnets.forEach((magnet) => {
      for (let i = -3; i <= 3; i += 1) {
        ctx.strokeStyle = "rgba(167,139,250,0.34)";
        ctx.lineWidth = 1.4 / viewport.zoom;
        const rx = 80;
        const ry = 28 + Math.abs(i) * 10;
        ctx.beginPath();
        ctx.ellipse(magnet.x, magnet.y + i * 7, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        const phase = ((now / 900 + i * 0.13) % 1) * Math.PI * 2;
        drawFieldDot(ctx, magnet.x + Math.cos(phase) * rx, magnet.y + i * 7 + Math.sin(phase) * ry, "#a78bfa", viewport.zoom);
      }
    });
    if (visible.gravity) masses.slice(0, 4).forEach((mass) => {
      ctx.strokeStyle = "rgba(245,158,11,0.2)";
      ctx.lineWidth = 1 / viewport.zoom;
      for (let i = 0; i < 12; i += 1) {
        const angle = (i / 12) * Math.PI * 2;
        const alpha = clamp(mass.mass / 8, 0.16, 0.5);
        ctx.strokeStyle = `rgba(245,158,11,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(mass.x + Math.cos(angle) * 145, mass.y + Math.sin(angle) * 145);
        ctx.lineTo(mass.x, mass.y);
        ctx.stroke();
        const flow = 145 - ((now / 12 + i * 9) % 120);
        drawFieldDot(ctx, mass.x + Math.cos(angle) * flow, mass.y + Math.sin(angle) * flow, "#f59e0b", viewport.zoom);
      }
    });
    if (visible.optics) optics.forEach((optic) => {
      ctx.strokeStyle = "rgba(0,229,255,0.32)";
      ctx.lineWidth = 1.5 / viewport.zoom;
      for (let i = -3; i <= 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(optic.x - 170, optic.y + i * 18);
        ctx.quadraticCurveTo(optic.x, optic.y + i * 5, optic.x + (optic.focalLength ?? 130), optic.y);
        ctx.stroke();
      }
    });
  });
}

function traceFieldLine(ctx: CanvasRenderingContext2D, start: { x: number; y: number }, charges: PhysicsObjectInstance[], sign: number, zoom: number, now: number, seed: number, dotColor: string) {
  let point = { ...start };
  const points: { x: number; y: number }[] = [point];
  ctx.strokeStyle = sign > 0 ? "rgba(250,204,21,0.34)" : "rgba(124,58,237,0.34)";
  ctx.lineWidth = 1.2 / zoom;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  for (let step = 0; step < 90; step += 1) {
    const field = charges.reduce((sum, charge) => {
      const dx = point.x - charge.x;
      const dy = point.y - charge.y;
      const r2 = Math.max(120, dx * dx + dy * dy);
      const q = charge.charge ?? 1;
      return { x: sum.x + (q * dx) / r2, y: sum.y + (q * dy) / r2 };
    }, { x: 0, y: 0 });
    const mag = Math.hypot(field.x, field.y) || 1;
    point = { x: point.x + (field.x / mag) * 9 * sign, y: point.y + (field.y / mag) * 9 * sign };
    points.push(point);
    ctx.lineTo(point.x, point.y);
  }
  ctx.stroke();
  const index = Math.floor(((now / 45 + seed * 11) % Math.max(1, points.length)));
  drawFieldDot(ctx, points[index].x, points[index].y, dotColor, zoom);
}

function drawFieldDot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, zoom: number) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 8 / zoom;
  ctx.beginPath();
  ctx.arc(x, y, 3.5 / zoom, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function applyEnergyGlow(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, maxEnergy: number, canvasTheme: CanvasTheme) {
  if (canvasTheme === "blueprint") {
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = "#f8fafc";
    ctx.shadowBlur = 0;
    return;
  }
  if (canvasTheme === "whiteboard") {
    ctx.shadowBlur = 0;
    return;
  }
  const speed = Math.hypot(object.vx, object.vy);
  const kinetic = 0.5 * object.mass * speed * speed;
  const potential = object.mass * 9.81 * Math.max(0, 560 - object.y) / 100;
  const intensity = clamp((kinetic + potential) / Math.max(1, maxEnergy), 0, 1);
  if (object.kind === "charge") {
    ctx.shadowColor = (object.charge ?? 0) >= 0 ? "#facc15" : "#7c3aed";
    ctx.shadowBlur = 16 + Math.abs(object.charge ?? 1) * 8;
    return;
  }
  if (object.kind === "gas-container") {
    const hot = clamp(((object.temperature ?? 300) - 250) / 300, 0, 1);
    ctx.shadowColor = `rgb(${Math.round(80 + hot * 175)}, ${Math.round(140 - hot * 70)}, ${Math.round(255 - hot * 220)})`;
    ctx.shadowBlur = 10 + hot * 26;
    return;
  }
  if (object.kind === "spring") {
    const strain = object.width ? (object.width - 120) / 120 : 0;
    ctx.shadowColor = strain < 0 ? "#ef4444" : "#38bdf8";
    ctx.shadowBlur = Math.min(28, Math.abs(strain) * 40);
    return;
  }
  ctx.shadowColor = kinetic >= potential ? "#e0faff" : "#f59e0b";
  ctx.shadowBlur = intensity > 0.04 ? 6 + intensity * 28 : 0;
}

function objectEnergy(object: PhysicsObjectInstance) {
  return 0.5 * object.mass * Math.hypot(object.vx, object.vy) ** 2 + object.mass * 9.81 * Math.max(0, 560 - object.y) / 100;
}

function drawMeasurements(ctx: CanvasRenderingContext2D, measurements: MeasurementOverlay[], objects: PhysicsObjectInstance[], viewport: ViewportState) {
  withViewport(ctx, viewport, () => {
    measurements.forEach((measurement) => {
      if (measurement.type === "ruler") drawRulerMeasurement(ctx, measurement.points[0], measurement.points[1], viewport.zoom);
      if (measurement.type === "protractor") drawProtractorMeasurement(ctx, measurement.points[0], measurement.points[1], measurement.points[2], viewport.zoom);
      if (measurement.type === "velocity") {
        const object = objects.find((item) => item.id === measurement.objectId);
        if (object && object.trail.length > 1) {
          object.trail.slice(-22).forEach((point, index, arr) => {
            if (index === 0) return;
            const prev = arr[index - 1];
            ctx.strokeStyle = `rgba(0, 229, 255, ${index / arr.length})`;
            ctx.lineWidth = 2 / viewport.zoom;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          });
          drawLabeledArrow(ctx, object.x, object.y, object.x + object.vx * 16, object.y + object.vy * 16, "#00e5ff", viewport.zoom, true, "trace v", `${Math.hypot(object.vx, object.vy).toFixed(1)} m/s`);
        }
      }
    });
  });
}

function drawMeasurementDraft(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[], viewport: ViewportState) {
  if (!points.length) return;
  withViewport(ctx, viewport, () => {
    points.forEach((point, index) => {
      ctx.fillStyle = "#00e5ff";
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4 / viewport.zoom, 0, Math.PI * 2);
      ctx.fill();
      drawVectorChip(ctx, point.x + 12 / viewport.zoom, point.y - 12 / viewport.zoom, `${index + 1}`, "#00e5ff", viewport.zoom, true);
    });
  });
}

function drawRulerMeasurement(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }, zoom: number) {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  ctx.save();
  ctx.strokeStyle = "#00e5ff";
  ctx.fillStyle = "#00e5ff";
  ctx.lineWidth = 2 / zoom;
  drawArrow(ctx, a.x, a.y, b.x, b.y, "#00e5ff", zoom, false);
  drawArrow(ctx, b.x, b.y, a.x, a.y, "#00e5ff", zoom, false);
  drawVectorChip(ctx, (a.x + b.x) / 2, (a.y + b.y) / 2 - 12 / zoom, `${meters(distance).toFixed(2)} m`, "#00e5ff", zoom);
  ctx.restore();
}

function drawProtractorMeasurement(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }, zoom: number) {
  const angleA = Math.atan2(a.y - b.y, a.x - b.x);
  const angleC = Math.atan2(c.y - b.y, c.x - b.x);
  const angle = Math.abs((((angleC - angleA + Math.PI * 3) % (Math.PI * 2)) - Math.PI));
  ctx.save();
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2 / zoom;
  ctx.beginPath();
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(a.x, a.y);
  ctx.moveTo(b.x, b.y);
  ctx.lineTo(c.x, c.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(b.x, b.y, 42 / zoom, angleA, angleC);
  ctx.stroke();
  drawVectorChip(ctx, b.x + 48 / zoom, b.y - 20 / zoom, `${((angle * 180) / Math.PI).toFixed(1)} deg`, "#f59e0b", zoom);
  ctx.restore();
}

function energyFromState(objects: PhysicsObjectInstance[], totalEnergy?: number) {
  const kinetic = objects.reduce((sum, object) => sum + (object.isStatic ? 0 : 0.5 * object.mass * Math.hypot(object.vx, object.vy) ** 2), 0);
  const potential = objects.reduce((sum, object) => sum + (object.isStatic ? 0 : object.mass * 9.81 * Math.max(0, 560 - object.y) / 100), 0);
  const total = Number.isFinite(totalEnergy) ? Number(totalEnergy) : kinetic + potential;
  const thermal = Math.max(0, kinetic + potential - total);
  const stable = Math.abs(total - (lastTotalEnergy ?? total)) < Math.max(2, Math.abs(total) * 0.08);
  return { kinetic, potential, thermal, total, stable };
}

const MAX_ENERGY_HISTORY = 50;

function EnergyAuditPanel({ energy }: { energy: { kinetic: number; potential: number; thermal: number; total: number; stable: boolean } }) {
  const histRef = useRef<{ ke: number; pe: number; total: number }[]>([]);
  const prevRef = useRef(energy);

  if (prevRef.current !== energy) {
    prevRef.current = energy;
    histRef.current.push({ ke: energy.kinetic, pe: energy.potential, total: Math.abs(energy.total) });
    if (histRef.current.length > MAX_ENERGY_HISTORY) histRef.current.shift();
  }

  const W = 120; const H = 40;
  const hist = histRef.current;
  const maxVal = Math.max(1, ...hist.map((h) => Math.max(h.ke, h.pe, h.total)));

  const toPath = (key: keyof typeof hist[0]) => {
    if (hist.length < 2) return "";
    return hist.map((h, i) => {
      const x = (i / (MAX_ENERGY_HISTORY - 1)) * W;
      const y = H - (h[key] / maxVal) * H;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  };

  const rows = [
    { label: "KE", value: energy.kinetic, color: "#22d3ee" },
    { label: "PE", value: energy.potential, color: "#f59e0b" },
    { label: "TE", value: energy.total, color: "#a78bfa" },
  ];

  return (
    <div className="canvas-energy-panel canvas-energy-panel-v2">
      <div className="energy-sparkline">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} aria-hidden="true">
          <defs>
            <linearGradient id="ke-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pe-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          {hist.length >= 2 && (
            <>
              <path d={`${toPath("pe")} L${W},${H} L0,${H} Z`} fill="url(#pe-fill)" />
              <path d={`${toPath("ke")} L${W},${H} L0,${H} Z`} fill="url(#ke-fill)" />
              <path d={toPath("pe")} fill="none" stroke="#f59e0b" strokeWidth="1.2" />
              <path d={toPath("ke")} fill="none" stroke="#22d3ee" strokeWidth="1.5" />
              <path d={toPath("total")} fill="none" stroke="#a78bfa" strokeWidth="1" strokeDasharray="3,2" />
            </>
          )}
        </svg>
      </div>
      <div className="energy-values-v2">
        {rows.map((row) => (
          <div key={row.label} className="energy-val-row" style={{ "--ecolor": row.color } as React.CSSProperties}>
            <span>{row.label}</span>
            <strong>{Math.abs(row.value).toFixed(1)}J</strong>
          </div>
        ))}
      </div>
      <div className={energy.stable ? "energy-conservation stable" : "energy-conservation unstable"} title={energy.stable ? "Energy conserved" : "Energy not conserved"} />
    </div>
  );
}

function updateSparkHistory(objects: PhysicsObjectInstance[], now: number, history: Map<string, { t: number; speed: number; ke: number; force: number; voltage: number; current: number }[]>) {
  objects.forEach((object) => {
    const speed = Math.hypot(object.vx, object.vy);
    const force = Math.hypot(object.ax || 0, object.ay || 0) * object.mass;
    const values = history.get(object.id) ?? [];
    values.push({ t: now, speed, ke: 0.5 * object.mass * speed * speed, force, voltage: object.voltageDiff ?? object.voltage ?? 0, current: object.current ?? 0 });
    history.set(object.id, values.filter((point) => now - point.t <= 3000));
  });
}

function HoverInspector({
  inspector,
  histories,
  pinned,
  offset = 0,
  onPin,
  onUnpin,
  onClose,
}: {
  inspector: { x: number; y: number; object: PhysicsObjectInstance };
  histories: Map<string, { t: number; speed: number; ke: number; force: number; voltage: number; current: number }[]>;
  pinned: boolean;
  offset?: number;
  onPin?: (object: PhysicsObjectInstance) => void;
  onUnpin?: (id: string) => void;
  onClose?: (id: string) => void;
}) {
  const object = inspector.object;
  const speed = Math.hypot(object.vx, object.vy);
  const force = Math.hypot(object.ax || 0, object.ay || 0) * object.mass;
  const history = histories.get(object.id) ?? [];
  const style = pinned ? { left: 14, top: 190 + offset * 192 } : { left: inspector.x, top: inspector.y };
  return (
    <div className={pinned ? "hover-inspector hover-inspector-pinned" : "hover-inspector"} style={style}>
      <div className="hover-inspector-head">
        <strong>{object.name}</strong>
        <span className="hover-inspector-actions">
          {pinned ? <button onClick={() => onUnpin?.(object.id)}>Unpin</button> : <button onClick={() => onPin?.(object)}>Pin</button>}
          <button onClick={() => onClose?.(object.id)}>Close</button>
        </span>
      </div>
      <InspectorRow label="m" value={`${object.mass.toFixed(2)} kg`} data={history.map((item) => item.ke)} />
      <InspectorRow label="pos" value={`${meters(object.x).toFixed(2)}, ${meters(object.y).toFixed(2)} m`} data={history.map((item) => item.speed)} />
      <InspectorRow label="v" value={`${object.vx.toFixed(2)}, ${object.vy.toFixed(2)} | ${speed.toFixed(2)} m/s`} data={history.map((item) => item.speed)} />
      <InspectorRow label="a/F" value={`${force.toFixed(2)} N`} data={history.map((item) => item.force)} />
      <InspectorRow label="KE" value={`${(0.5 * object.mass * speed * speed).toFixed(2)} J`} data={history.map((item) => item.ke)} />
      {isCircuitObject(object) && <InspectorRow label="VI" value={`${(object.voltageDiff ?? 0).toFixed(2)} V, ${(object.current ?? 0).toFixed(2)} A`} data={history.map((item) => item.current)} />}
      {object.kind === "wave-source" && <InspectorRow label="wave" value={`${(object.frequency ?? 0).toFixed(2)} Hz, A ${(object.amplitude ?? 0).toFixed(2)}`} data={history.map((item) => item.speed)} />}
    </div>
  );
}

function InspectorRow({ label, value, data }: { label: string; value: string; data: number[] }) {
  return (
    <div className="inspector-row">
      <span>{label}</span>
      <strong>{value}</strong>
      <Sparkline values={data} />
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values.length
    ? values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 48},${28 - ((value - min) / Math.max(1e-6, max - min)) * 24}`).join(" ")
    : "";
  return (
    <svg className="sparkline" viewBox="0 0 48 30" aria-hidden="true">
      <polyline points={points} />
    </svg>
  );
}

function FormulaOverlay({ objects, viewport, time, onOpen }: { objects: PhysicsObjectInstance[]; viewport: ViewportState; time: number; onOpen: (detail: { name: string; expression: string; derivation: string }) => void }) {
  return (
    <>
      {objects.filter((object) => !object.isStatic || isCircuitObject(object)).slice(0, 8).map((object) => {
        const p = worldToScreen(object.x, object.y, viewport);
        const formula = formulaForObject(object, time);
        if (!formula) return null;
        return (
          <button
            key={object.id}
            className="canvas-formula-pill"
            style={{ left: p.x + 12, top: p.y - 42 }}
            title="Open equation details"
            onClick={() => onOpen(formula)}
            dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }}
          />
        );
      })}
    </>
  );
}

function formulaForObject(object: PhysicsObjectInstance, time: number) {
  if (object.kind === "ball" || object.kind === "block") {
    return {
      name: "Projectile height",
      expression: `y = v_0t - \\frac{1}{2}gt^2 = ${object.vy.toFixed(1)}(${time.toFixed(1)}) - 4.9(${(time * time).toFixed(1)})`,
      derivation: "Vertical motion is constant acceleration motion. Substitute acceleration -g into s = ut + 1/2 at^2.",
    };
  }
  if (object.kind === "pendulum") {
    return {
      name: "Pendulum period",
      expression: `T = 2\\pi\\sqrt{\\frac{L}{g}},\\ L=${((object.length ?? 120) / 100).toFixed(2)}m`,
      derivation: "For small oscillations, restoring torque is proportional to angular displacement, producing SHM.",
    };
  }
  if (object.kind === "spring") {
    return {
      name: "Hooke force",
      expression: `F = -kx,\\ k=${(object.springConstant ?? 10).toFixed(1)}`,
      derivation: "An ideal spring force is proportional and opposite to extension or compression from equilibrium.",
    };
  }
  if (isCircuitObject(object)) {
    return {
      name: "Ohm relation",
      expression: `V = IR,\\ ${(object.voltageDiff ?? 0).toFixed(2)} = ${(object.current ?? 0).toFixed(2)}R`,
      derivation: "For an ohmic element, current is proportional to voltage; resistance is the proportionality constant.",
    };
  }
  return undefined;
}

function FormulaDetailCard({ detail, onClose }: { detail: { name: string; expression: string; derivation: string }; onClose: () => void }) {
  return (
    <div className="formula-detail-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="ui-label">Equation link</p>
          <h3>{detail.name}</h3>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="formula-detail-expression" dangerouslySetInnerHTML={{ __html: renderFormula(detail.expression) }} />
      <p>{detail.derivation}</p>
    </div>
  );
}

function FreeBodyDiagramPanel({ object, onClose }: { object: PhysicsObjectInstance; onClose: () => void }) {
  const speed = Math.hypot(object.vx, object.vy);
  const forces = forceEntries(object);
  const exportSvg = () => {
    const svg = makeFbdSvg(object, forces);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${object.name.replace(/\s+/g, "-").toLowerCase()}-fbd.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="fbd-panel">
      <div className="fbd-head">
        <div>
          <span className="ui-label">Free Body Diagram</span>
          <strong>{object.name}</strong>
        </div>
        <div className="flex gap-2">
          <button onClick={exportSvg}>Export SVG</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
      <svg className="fbd-svg" viewBox="0 0 520 210">
        <rect x="232" y="78" width="56" height="48" rx="10" fill="#0f172a" stroke="#e2e8f0" />
        <text x="260" y="106" textAnchor="middle" fill="#e2e8f0" fontWeight="800">{object.name.slice(0, 10)}</text>
        {forces.map((force) => <FbdArrow key={force.label} {...force} />)}
        <text x="18" y="190" fill="#94a3b8" fontSize="12">speed {speed.toFixed(2)} m/s · mass {object.mass.toFixed(2)} kg</text>
      </svg>
    </div>
  );
}

function FbdArrow({ label, value, dx, dy, color }: { label: string; value: number; dx: number; dy: number; color: string }) {
  const mag = Math.max(28, Math.min(86, Math.abs(value) * 4));
  const x2 = 260 + dx * mag;
  const y2 = 102 + dy * mag;
  return (
    <g>
      <line x1="260" y1="102" x2={x2} y2={y2} stroke={color} strokeWidth="4" markerEnd="url(#arrow)" />
      <text x={x2 + dx * 12} y={y2 + dy * 12} fill={color} fontSize="12" fontWeight="900">{label}={value.toFixed(1)}N</text>
      <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill={color} /></marker></defs>
    </g>
  );
}

function forceEntries(object: PhysicsObjectInstance) {
  const weight = object.mass * 9.81;
  const speed = Math.hypot(object.vx, object.vy);
  return [
    { label: "W", value: weight, dx: 0, dy: 1, color: "#f59e0b" },
    { label: "N", value: weight, dx: 0, dy: -1, color: "#34d399" },
    { label: "f", value: Math.abs(object.friction ?? 0), dx: object.vx >= 0 ? -1 : 1, dy: 0, color: "#fb7185" },
    { label: "F_net", value: Math.hypot(object.ax || 0, object.ay || 0) * object.mass || speed * 0.2, dx: Math.sign(object.ax || object.vx || 1), dy: Math.sign(object.ay || 0), color: "#00e5ff" },
  ];
}

function makeFbdSvg(object: PhysicsObjectInstance, forces: ReturnType<typeof forceEntries>) {
  const arrows = forces.map((force) => {
    const mag = Math.max(28, Math.min(86, Math.abs(force.value) * 4));
    const x2 = 260 + force.dx * mag;
    const y2 = 102 + force.dy * mag;
    return `<line x1="260" y1="102" x2="${x2}" y2="${y2}" stroke="${force.color}" stroke-width="4"/><text x="${x2 + force.dx * 12}" y="${y2 + force.dy * 12}" fill="${force.color}" font-size="12" font-weight="900">${force.label}=${force.value.toFixed(1)}N</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 210"><rect width="520" height="210" fill="#050c18"/><rect x="232" y="78" width="56" height="48" rx="10" fill="#0f172a" stroke="#e2e8f0"/><text x="260" y="106" text-anchor="middle" fill="#e2e8f0" font-weight="800">${object.name}</text>${arrows}</svg>`;
}

function SystemStatsBar({ objects, baseline }: { objects: PhysicsObjectInstance[]; baseline: { px: number; py: number } | null }) {
  const mass = objects.reduce((sum, object) => sum + object.mass, 0);
  const { px, py } = totalMomentum(objects);
  const ke = objects.reduce((sum, object) => sum + 0.5 * object.mass * Math.hypot(object.vx, object.vy) ** 2, 0);
  const com = mass ? { x: objects.reduce((sum, object) => sum + object.mass * object.x, 0) / mass, y: objects.reduce((sum, object) => sum + object.mass * object.y, 0) / mass } : { x: 0, y: 0 };
  const p = Math.hypot(px, py);
  const baselineP = baseline ? Math.hypot(baseline.px, baseline.py) : p;
  const delta = baseline ? Math.hypot(px - baseline.px, py - baseline.py) : 0;
  const conserved = delta < Math.max(0.5, baselineP * 0.08);
  return (
    <div className="system-stats-bar">
      <span>sum m <strong>{mass.toFixed(2)} kg</strong></span>
      <span>sum p <strong>{p.toFixed(2)} kg m/s @{((Math.atan2(py, px) * 180) / Math.PI).toFixed(0)}deg</strong></span>
      <span>sum KE <strong>{ke.toFixed(2)} J</strong></span>
      <span>COM <strong>{meters(com.x).toFixed(2)}, {meters(com.y).toFixed(2)} m</strong></span>
      <span className={conserved ? "momentum-ok" : "momentum-watch"}>dp {delta.toFixed(2)}</span>
      <span className="momentum-balance"><i style={{ width: `${clamp(100 - (delta / Math.max(1, baselineP)) * 100, 0, 100)}%` }} /></span>
    </div>
  );
}

function totalMomentum(objects: PhysicsObjectInstance[]) {
  return {
    px: objects.reduce((sum, object) => sum + object.mass * object.vx, 0),
    py: objects.reduce((sum, object) => sum + object.mass * object.vy, 0),
  };
}

function drawCenterOfMass(ctx: CanvasRenderingContext2D, objects: PhysicsObjectInstance[], viewport: ViewportState) {
  if (objects.length < 2) return;
  const mass = objects.reduce((sum, object) => sum + object.mass, 0);
  if (!mass) return;
  const x = objects.reduce((sum, object) => sum + object.mass * object.x, 0) / mass;
  const y = objects.reduce((sum, object) => sum + object.mass * object.y, 0) / mass;
  withViewport(ctx, viewport, () => {
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2 / viewport.zoom;
    ctx.beginPath();
    ctx.moveTo(x - 14 / viewport.zoom, y);
    ctx.lineTo(x + 14 / viewport.zoom, y);
    ctx.moveTo(x, y - 14 / viewport.zoom);
    ctx.lineTo(x, y + 14 / viewport.zoom);
    ctx.stroke();
    drawVectorChip(ctx, x + 26 / viewport.zoom, y, "COM", "#f59e0b", viewport.zoom, true);
  });
}

function makeTimelineBookmarks(data: { t: number; y?: number; speed?: number }[]) {
  if (data.length < 6) return [];
  const heightPoints = data.map((point, index) => ({ point, index })).filter((item) => Number.isFinite(item.point.y));
  const speedPoints = data.map((point, index) => ({ point, index })).filter((item) => Number.isFinite(item.point.speed));
  const maxHeight = heightPoints.reduce((best, item) => (Number(item.point.y) > Number(best.point.y) ? item : best), heightPoints[0]);
  const maxSpeed = speedPoints.reduce((best, item) => (Number(item.point.speed) > Number(best.point.speed) ? item : best), speedPoints[0]);
  return [
    maxHeight ? { index: maxHeight.index, kind: "peak", label: `Peak height at t=${maxHeight.point.t.toFixed(2)}s` } : undefined,
    maxSpeed ? { index: maxSpeed.index, kind: "speed", label: `Max speed ${Number(maxSpeed.point.speed).toFixed(2)} m/s` } : undefined,
  ].filter(Boolean) as { index: number; kind: string; label: string }[];
}

function meters(px: number) {
  return px / 100;
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

function SelectedObjectStrip({ objectId }: { objectId: string }) {
  const obj = useLabStore((state) => state.objects.find((o) => o.id === objectId));
  if (!obj) return null;
  const speed = Math.hypot(obj.vx, obj.vy);
  const ke = (0.5 * obj.mass * speed * speed).toFixed(1);
  return (
    <div className="canvas-selected-strip">
      <span className="canvas-selected-kind">{obj.kind}</span>
      <span className="canvas-selected-divider" />
      <span><span className="canvas-selected-label">m</span>{obj.mass.toFixed(2)} kg</span>
      <span><span className="canvas-selected-label">v</span>{speed.toFixed(2)} m/s</span>
      <span><span className="canvas-selected-label">KE</span>{ke} J</span>
      <span className="canvas-selected-divider" />
      <button
        className="canvas-selected-btn"
        title="Duplicate"
        onClick={() => useLabStore.getState().duplicateSelected()}
      >⧉</button>
      <button
        className="canvas-selected-btn canvas-selected-btn-danger"
        title="Delete"
        onClick={() => useLabStore.getState().removeSelected()}
      >✕</button>
    </div>
  );
}
