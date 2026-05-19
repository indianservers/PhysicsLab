import { useEffect, useRef } from "react";
import { useSimulationEngine } from "../engine/useSimulationEngine";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance, SimulationSettings, ViewportState } from "../types";

export function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  const stateRef = useRef(useLabStore.getState());
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const panRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const copiedRef = useRef<PhysicsObjectInstance | null>(null);
  const lastStepSignal = useRef(useLabStore.getState().stepSignal);
  const engine = useSimulationEngine(useLabStore.getState().objects);

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
      draw(engine.workerEnabled);
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

  const draw = (workerEnabled: boolean) => {
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
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, state.theme === "dark" ? "#07111f" : "#eef6ff");
    gradient.addColorStop(1, state.theme === "dark" ? "#101827" : "#ffffff");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    if (state.showGrid) drawGrid(ctx, width, height, state.viewport);
    drawAxes(ctx, state.viewport);
    state.objects.forEach((object) => drawObject(ctx, object, object.id === state.selectedId, state.showVectors, state.showTrails, state.viewport));
    drawHud(ctx, state.running, state.simulationTime, state.viewport.zoom, workerEnabled);
  };

  const pointerToWorld = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const screen = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    return screenToWorld(screen.x, screen.y, stateRef.current.viewport);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.button === 1 || event.button === 2 || event.altKey) {
      panRef.current = { x: event.clientX, y: event.clientY, offsetX: stateRef.current.viewport.offsetX, offsetY: stateRef.current.viewport.offsetY };
      event.currentTarget.setPointerCapture(event.pointerId);
      return;
    }
    const point = pointerToWorld(event);
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
      useLabStore.getState().setViewport({ offsetX: pan.offsetX + event.clientX - pan.x, offsetY: pan.offsetY + event.clientY - pan.y });
      return;
    }
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointerToWorld(event);
    const snap = event.shiftKey ? 25 : 1;
    const nextX = Math.round((point.x + drag.dx) / snap) * snap;
    const nextY = Math.round((point.y + drag.dy) / snap) * snap;
    useLabStore.getState().updateObject(drag.id, { x: nextX, y: nextY, vx: 0, vy: 0, trail: [] });
    engine.setObjectPosition(drag.id, nextX, nextY);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = null;
    panRef.current = null;
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
    const zoom = clamp(store.viewport.zoom * (event.deltaY < 0 ? 1.1 : 0.9), 0.25, 3);
    const nextOffsetX = mouseX - before.x * zoom;
    const nextOffsetY = mouseY - before.y * zoom;
    store.setViewport({ zoom, offsetX: nextOffsetX, offsetY: nextOffsetY });
  };

  return (
    <canvas
      ref={canvasRef}
      data-physics-canvas="true"
      className="h-full w-full cursor-crosshair rounded-md"
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      aria-label="Interactive physics simulation canvas"
    />
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
  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  for (let x = Math.floor(topLeft.x / 25) * 25; x < bottomRight.x; x += 25) {
    const a = worldToScreen(x, topLeft.y, viewport);
    const b = worldToScreen(x, bottomRight.y, viewport);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  for (let y = Math.floor(topLeft.y / 25) * 25; y < bottomRight.y; y += 25) {
    const a = worldToScreen(topLeft.x, y, viewport);
    const b = worldToScreen(bottomRight.x, y, viewport);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
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

function drawObject(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, selected: boolean, vectors: boolean, trails: boolean, viewport: ViewportState) {
  withViewport(ctx, viewport, () => {
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
    ctx.fillStyle = object.color ?? "#38bdf8";
    ctx.strokeStyle = selected ? "#22d3ee" : "rgba(255,255,255,0.32)";
    ctx.lineWidth = selected ? 3 / viewport.zoom : 1 / viewport.zoom;
    if (["ball", "pendulum", "wheel", "disc", "pulley", "charge"].includes(object.kind)) {
      ctx.beginPath();
      ctx.arc(0, 0, object.radius ?? 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (object.kind === "wheel" || object.kind === "disc" || object.kind === "pulley") {
        ctx.beginPath();
        ctx.moveTo(-(object.radius ?? 22), 0);
        ctx.lineTo(object.radius ?? 22, 0);
        ctx.moveTo(0, -(object.radius ?? 22));
        ctx.lineTo(0, object.radius ?? 22);
        ctx.stroke();
      }
    } else if (object.kind === "spring") {
      drawSpring(ctx, object.width ?? 130, object.height ?? 22);
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
    } else {
      ctx.fillRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
      ctx.strokeRect(-(object.width ?? 48) / 2, -(object.height ?? 48) / 2, object.width ?? 48, object.height ?? 48);
    }
    ctx.restore();
    if (vectors && !object.isStatic) {
      drawArrow(ctx, object.x, object.y, object.x + object.vx * 18, object.y + object.vy * 18, "#38bdf8", viewport.zoom);
      drawArrow(ctx, object.x, object.y, object.x, object.y + 38, "#f43f5e", viewport.zoom);
      drawArrow(ctx, object.x, object.y, object.x + object.vx * object.mass * 8, object.y + object.vy * object.mass * 8, "#34d399", viewport.zoom);
    }
  });
}

function drawSpring(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "#a78bfa";
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
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge"].includes(object.kind)) return Math.hypot(x - object.x, y - object.y) <= (object.radius ?? 22);
  return Math.abs(x - object.x) <= (object.width ?? 48) / 2 && Math.abs(y - object.y) <= (object.height ?? 48) / 2;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
