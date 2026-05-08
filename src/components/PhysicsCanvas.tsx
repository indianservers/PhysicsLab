import Matter from "matter-js";
import { useEffect, useRef } from "react";
import { useLabStore } from "../store/useLabStore";
import { PhysicsObjectInstance } from "../types";

const SCALE = 50;

export function PhysicsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine>();
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const rafRef = useRef<number>();
  const lastRef = useRef<number>(performance.now());
  const stateRef = useRef(useLabStore.getState());
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const copiedRef = useRef<PhysicsObjectInstance | null>(null);

  useEffect(() => useLabStore.subscribe((state) => (stateRef.current = state)), []);

  useEffect(() => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    engine.gravity.y = 0;
    engineRef.current = engine;
    rebuildWorld();
    const loop = (now: number) => {
      const state = stateRef.current;
      const dt = Math.min(32, now - lastRef.current) / 1000;
      lastRef.current = now;
      if (state.running) {
        engine.gravity.y = state.gravity / SCALE;
        Matter.Engine.update(engine, dt * 1000 * state.timeScale);
        syncFromBodies(now / 1000);
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => useLabStore.subscribe((state, previous) => {
    if (state.objects.length !== previous.objects.length || state.objects.some((object, index) => object.id !== previous.objects[index]?.id)) {
      rebuildWorld();
      draw();
    } else {
      syncToBodies(state.objects);
    }
  }), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      const store = useLabStore.getState();
      if (event.code === "Space") {
        event.preventDefault();
        store.toggleRunning();
      }
      if (event.key.toLowerCase() === "r") store.resetSandbox();
      if (event.key.toLowerCase() === "g") store.toggleGrid();
      if (event.key.toLowerCase() === "v") store.toggleVectors();
      if (event.key.toLowerCase() === "t") store.toggleTrails();
      if (event.key === "Delete") store.removeSelected();
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
  }, []);

  const rebuildWorld = () => {
    const engine = engineRef.current;
    if (!engine) return;
    Matter.Composite.clear(engine.world, false);
    bodiesRef.current.clear();
    useLabStore.getState().objects.forEach((object) => {
      const body = createBody(object);
      bodiesRef.current.set(object.id, body);
      Matter.Composite.add(engine.world, body);
    });
  };

  const syncToBodies = (objects: PhysicsObjectInstance[]) => {
    objects.forEach((object) => {
      const body = bodiesRef.current.get(object.id);
      if (!body) return;
      Matter.Body.setPosition(body, { x: object.x, y: object.y });
      Matter.Body.setAngle(body, object.angle);
      Matter.Body.setVelocity(body, { x: object.vx * SCALE, y: object.vy * SCALE });
      Matter.Body.setStatic(body, object.isStatic || Boolean(object.locked));
      body.friction = object.friction;
      body.restitution = object.restitution;
    });
  };

  const syncFromBodies = (time: number) => {
    const store = useLabStore.getState();
    const objects = store.objects.map((object) => {
      const body = bodiesRef.current.get(object.id);
      if (!body) return object;
      const vx = body.velocity.x / SCALE;
      const vy = body.velocity.y / SCALE;
      const updated = {
        ...object,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
        vx,
        vy,
        ax: 0,
        ay: object.isStatic ? 0 : store.gravity,
        trail: object.isStatic ? object.trail : [...object.trail.slice(-90), { x: body.position.x, y: body.position.y, t: time }],
      };
      return updated;
    });
    useLabStore.setState({ objects });
    const tracked = objects.find((object) => !object.isStatic);
    if (tracked) {
      const h = Math.max(0, (560 - tracked.y) / SCALE);
      store.pushGraphPoint({
        t: Number((store.simulationTime + 1 / 60).toFixed(3)),
        x: tracked.x / SCALE,
        y: h,
        vx: tracked.vx,
        vy: -tracked.vy,
        speed: Math.hypot(tracked.vx, tracked.vy),
        kineticEnergy: 0.5 * tracked.mass * (tracked.vx ** 2 + tracked.vy ** 2),
        potentialEnergy: tracked.mass * store.gravity * h,
      });
    }
  };

  const draw = () => {
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
    if (state.showGrid) drawGrid(ctx, width, height);
    state.objects.forEach((object) => drawObject(ctx, object, object.id === state.selectedId, state.showVectors, state.showTrails));
    drawHud(ctx, state.running, state.simulationTime);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const object = [...useLabStore.getState().objects].reverse().find((candidate) => hitTest(candidate, x, y));
    useLabStore.getState().selectObject(object?.id);
    if (object) {
      dragRef.current = { id: object.id, dx: object.x - x, dy: object.y - y };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left + drag.dx;
    const y = event.clientY - rect.top + drag.dy;
    const store = useLabStore.getState();
    const snap = event.shiftKey ? 25 : 1;
    const nextX = Math.round(x / snap) * snap;
    const nextY = Math.round(y / snap) * snap;
    store.updateObject(drag.id, { x: nextX, y: nextY, vx: 0, vy: 0, trail: [] });
    const body = bodiesRef.current.get(drag.id);
    if (body) {
      Matter.Body.setPosition(body, { x: nextX, y: nextY });
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      data-physics-canvas="true"
      className="h-full w-full cursor-crosshair rounded-md"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      aria-label="Interactive physics simulation canvas"
    />
  );
}

function createBody(object: PhysicsObjectInstance) {
  const options: Matter.IBodyDefinition = {
    friction: object.friction,
    restitution: object.restitution,
    isStatic: object.isStatic || Boolean(object.locked),
    angle: object.angle,
  };
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge"].includes(object.kind)) {
    return Matter.Bodies.circle(object.x, object.y, object.radius ?? 22, options);
  }
  return Matter.Bodies.rectangle(object.x, object.y, object.width ?? 48, object.height ?? 48, options);
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 25) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 25) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawObject(ctx: CanvasRenderingContext2D, object: PhysicsObjectInstance, selected: boolean, vectors: boolean, trails: boolean) {
  ctx.save();
  if (trails && object.trail.length > 1) {
    ctx.strokeStyle = "rgba(34, 211, 238, 0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    object.trail.forEach((point, index) => (index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y)));
    ctx.stroke();
  }
  ctx.translate(object.x, object.y);
  ctx.rotate(object.angle);
  ctx.fillStyle = object.color ?? "#38bdf8";
  ctx.strokeStyle = selected ? "#22d3ee" : "rgba(255,255,255,0.32)";
  ctx.lineWidth = selected ? 3 : 1;
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
    drawArrow(ctx, -(object.width ?? 80) / 2, 0, (object.width ?? 80) / 2, 0, object.color ?? "#38bdf8");
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
  if (object.kind === "pendulum") {
    ctx.strokeStyle = "rgba(251, 146, 60, 0.85)";
    ctx.beginPath();
    ctx.moveTo(object.pivotX ?? object.x, object.pivotY ?? object.y - 140);
    ctx.lineTo(object.x, object.y);
    ctx.stroke();
  }
  if (vectors && !object.isStatic) {
    drawArrow(ctx, object.x, object.y, object.x + object.vx * 18, object.y + object.vy * 18, "#38bdf8");
    drawArrow(ctx, object.x, object.y, object.x, object.y + 38, "#f43f5e");
  }
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

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
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

function drawHud(ctx: CanvasRenderingContext2D, running: boolean, time: number) {
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.fillRect(14, 14, 180, 58);
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "13px sans-serif";
  ctx.fillText(`Status: ${running ? "running" : "paused"}`, 28, 38);
  ctx.fillText(`t = ${time.toFixed(2)} s`, 28, 58);
}

function hitTest(object: PhysicsObjectInstance, x: number, y: number) {
  if (["ball", "pendulum", "wheel", "disc", "pulley", "charge"].includes(object.kind)) return Math.hypot(x - object.x, y - object.y) <= (object.radius ?? 22);
  return Math.abs(x - object.x) <= (object.width ?? 48) / 2 && Math.abs(y - object.y) <= (object.height ?? 48) / 2;
}
