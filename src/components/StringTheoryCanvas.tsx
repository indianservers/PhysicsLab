import { useEffect, useRef, useState } from "react";
import type { StringTheoryLesson } from "../lib/stringTheoryStudio";

interface Props {
  lesson: StringTheoryLesson;
  values: [number, number];
  playing: boolean;
  speed: number;
  stage: number;
  reducedMotion: boolean;
}

const TAU = Math.PI * 2;

export function StringTheoryCanvas({ lesson, values, playing, speed, stage, reducedMotion }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);
  const lastRef = useRef(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const render = (now: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(rect.width * dpr) || canvas.height !== Math.round(rect.height * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (playing && !reducedMotion) timeRef.current += Math.min(40, now - lastRef.current) * 0.001 * speed;
      lastRef.current = now;
      drawScene(context, rect.width, rect.height, lesson, values, timeRef.current, stage, pointer);
      frameRef.current = requestAnimationFrame(render);
    };
    frameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameRef.current);
  }, [lesson, values, playing, speed, stage, reducedMotion, pointer]);

  return (
    <canvas
      ref={canvasRef}
      className="st-canvas"
      aria-label={`${lesson.title} interactive scientific visualization`}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({ x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 });
      }}
      onPointerLeave={() => setPointer({ x: 0, y: 0 })}
    />
  );
}

function drawScene(
  ctx: CanvasRenderingContext2D, w: number, h: number, lesson: StringTheoryLesson,
  values: [number, number], t: number, stage: number, pointer: { x: number; y: number },
) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h) * 0.75);
  bg.addColorStop(0, "#062a3a"); bg.addColorStop(0.48, "#03151f"); bg.addColorStop(1, "#01080d");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  grid(ctx, w, h, pointer);
  stars(ctx, w, h, lesson.number);

  const p = normal(values[0], lesson.controls[0]);
  const q = normal(values[1], lesson.controls[1]);
  const phase = t + stage * 0.65;
  ctx.save();
  ctx.translate(pointer.x * 9, pointer.y * 7);

  switch (lesson.visual) {
    case "scale": scaleScene(ctx, w, h, p, q, phase); break;
    case "comparison": comparisonScene(ctx, w, h, p, q, phase); break;
    case "modes": modesScene(ctx, w, h, values[0], q, phase); break;
    case "topology": topologyScene(ctx, w, h, p, values[1], phase); break;
    case "worldsheet": worldsheetScene(ctx, w, h, p, q, phase); break;
    case "levels": levelScene(ctx, w, h, values[0], q, phase); break;
    case "spectrum": spectrumScene(ctx, w, h, values[0], values[1], phase); break;
    case "interaction": interactionScene(ctx, w, h, p, q, phase); break;
    case "dimensions": dimensionScene(ctx, w, h, values[0], lesson.title.includes("10"), phase); break;
    case "partners": partnersScene(ctx, w, h, p, q, phase); break;
    case "network": networkScene(ctx, w, h, p, q, phase); break;
    case "compact": compactScene(ctx, w, h, p, q, phase); break;
    case "calabi": calabiScene(ctx, w, h, p, q, phase); break;
    case "tower": towerScene(ctx, w, h, values[0], values[1], phase); break;
    case "brane": braneScene(ctx, w, h, p, q, phase, lesson.id === "brane-worlds"); break;
    case "duality": dualityScene(ctx, w, h, p, q, phase, lesson.id); break;
    case "ads": adsScene(ctx, w, h, p, q, phase); break;
    case "graviton": gravitonScene(ctx, w, h, values[0], q, phase); break;
    case "emergent": emergentScene(ctx, w, h, p, values[1], phase); break;
    case "holographic": holographicScene(ctx, w, h, p, values[1], phase); break;
    case "landscape": landscapeScene(ctx, w, h, values[0], values[1], phase); break;
    case "blackhole": blackHoleScene(ctx, w, h, p, q, phase); break;
    case "pagecurve": pageCurveScene(ctx, w, h, p, q, phase); break;
    case "cosmos": cosmosScene(ctx, w, h, p, q, phase); break;
    case "cosmic-string": cosmicStringScene(ctx, w, h, p, q, phase); break;
  }
  ctx.restore();
  // The reference compositions keep the flagship scale and duality views
  // visually clean. Their equations and current state already live in the
  // adjacent semantic controls, so duplicating a canvas HUD only adds noise.
  if (lesson.visual !== "scale" && lesson.visual !== "network") {
    hud(ctx, w, h, lesson.formula, lesson.phases[stage] ?? lesson.phases[0]);
  }
}

function normal(value: number, spec: { min: number; max: number }) { return (value - spec.min) / (spec.max - spec.min || 1); }
function glow(ctx: CanvasRenderingContext2D, color: string, blur = 16) { ctx.shadowColor = color; ctx.shadowBlur = blur; }
function line(ctx: CanvasRenderingContext2D, color: string, width = 2) { ctx.strokeStyle = color; ctx.lineWidth = width; }
function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = "#a9c7d2", size = 11, align: CanvasTextAlign = "left") { ctx.fillStyle = color; ctx.font = `600 ${size}px Inter, Arial`; ctx.textAlign = align; ctx.fillText(text, x, y); }

function grid(ctx: CanvasRenderingContext2D, w: number, h: number, pointer: { x: number; y: number }) {
  ctx.save(); ctx.strokeStyle = "rgba(36,193,220,.075)"; ctx.lineWidth = 1;
  const gap = 36, ox = (pointer.x * 7) % gap, oy = (pointer.y * 7) % gap;
  for (let x = ox; x < w; x += gap) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = oy; y < h; y += gap) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.restore();
}
function stars(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  ctx.fillStyle = "rgba(172,234,244,.42)";
  for (let i = 0; i < 42; i++) { const x = ((i * 97 + seed * 31) % 997) / 997 * w; const y = ((i * 53 + seed * 71) % 541) / 541 * h; ctx.fillRect(x, y, i % 7 === 0 ? 1.5 : 1, i % 7 === 0 ? 1.5 : 1); }
}
function hud(ctx: CanvasRenderingContext2D, w: number, h: number, formula: string, phase: string) {
  ctx.save(); ctx.fillStyle = "rgba(1,11,16,.72)"; ctx.fillRect(18, 16, Math.min(320, w * .52), 34);
  ctx.strokeStyle = "rgba(31,192,218,.38)"; ctx.strokeRect(18.5, 16.5, Math.min(320, w * .52), 34);
  label(ctx, formula, 32, 38, "#80eaff", 12);
  ctx.fillStyle = "rgba(1,11,16,.74)"; ctx.fillRect(w - 160, h - 48, 142, 30);
  label(ctx, `NOW · ${phase.toUpperCase()}`, w - 89, h - 29, "#ffb13c", 10, "center"); ctx.restore();
}

function wave(ctx: CanvasRenderingContext2D, x1: number, x2: number, cy: number, amp: number, harmonic: number, phase: number, color = "#34d8f1") {
  ctx.beginPath();
  for (let x = x1; x <= x2; x += 3) { const u = (x - x1) / (x2 - x1); const y = cy + Math.sin(u * Math.PI * harmonic + phase) * amp * Math.sin(u * Math.PI); if (x === x1) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
  line(ctx, color, 2.5); glow(ctx, color, 13); ctx.stroke(); ctx.shadowBlur = 0;
}
function scaleScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const levels = ["ATOM 10⁻¹⁰ m", "NUCLEUS 10⁻¹⁵ m", "QUARK SCALE 10⁻¹⁸ m", "PLANCK 10⁻³⁵ m"];
  levels.forEach((name, i) => { const y = h * (.25 + i * .18); const r = 42 - i * 7 + Math.sin(t * 2 + i) * 2; ctx.beginPath(); ctx.arc(w * .52, y, r, 0, TAU); line(ctx, i === 3 ? "#ffab36" : "#35d8f1", 1.5); glow(ctx, i === 3 ? "#ff9f2e" : "#27c8e3", 16); ctx.stroke(); ctx.shadowBlur = 0; label(ctx, name, w * .52 + 66, y + 4, i === 3 ? "#ffbf62" : "#93ddeb", 11); });
  const targetY = h * (.25 + p * .54); ctx.fillStyle = "rgba(255,174,53,.12)"; ctx.fillRect(w * .27, targetY - 24, w * .5, 48); line(ctx, "rgba(255,174,53,.7)", 1); ctx.strokeRect(w * .27, targetY - 24, w * .5, 48);
  for (let i = 0; i < 3 + Math.round(q * 4); i++) wave(ctx, w * .42, w * .62, h * .79 + i * 2, 8 + q * 12, 2 + i, t * 3 + i, "#ffad38");
}
function comparisonScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const mid = w / 2; line(ctx, "rgba(63,210,232,.25)", 1); ctx.beginPath(); ctx.moveTo(mid, 75); ctx.lineTo(mid, h - 50); ctx.stroke();
  label(ctx, "POINT PARTICLE", w * .25, 86, "#7de8f6", 12, "center"); label(ctx, "EXTENDED STRING", w * .75, 86, "#ffb044", 12, "center");
  ctx.beginPath(); ctx.arc(w * .25, h * .49, 5 + p * 8, 0, TAU); ctx.fillStyle = "#68e9ff"; glow(ctx, "#34d9f2", 22); ctx.fill(); ctx.shadowBlur = 0;
  wave(ctx, w * .61, w * .89, h * .49, 34 * q, 3, t * 3, "#ffad39");
  const probeX = w * (.08 + p * .4); ctx.beginPath(); ctx.arc(probeX, h * .31, 8, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill();
  ctx.beginPath(); ctx.moveTo(probeX, h * .31); ctx.lineTo(w * .25, h * .49); line(ctx, "rgba(255,255,255,.5)", 1); ctx.stroke();
}
function modesScene(ctx: CanvasRenderingContext2D, w: number, h: number, harmonic: number, q: number, t: number) {
  for (let n = 1; n <= 4; n++) { const y = h * (.2 + n * .14); ctx.beginPath(); ctx.moveTo(w * .18, y); ctx.lineTo(w * .82, y); line(ctx, "rgba(93,216,235,.16)", 1); ctx.stroke(); wave(ctx, w * .18, w * .82, y, (n === Math.round(harmonic) ? 38 : 17) * q, n, t * (n === Math.round(harmonic) ? 3 : .6), n === Math.round(harmonic) ? "#ffad37" : "#35d9ef"); label(ctx, `n = ${n}`, w * .12, y + 4, n === Math.round(harmonic) ? "#ffb85a" : "#8cbac4", 11); }
}
function topologyScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, mode: number, t: number) {
  const close = p; const cx = w / 2, cy = h / 2;
  if (close > .6) { ctx.beginPath(); for (let i = 0; i <= 160; i++) { const a = i / 160 * TAU; const r = Math.min(w, h) * .22 + Math.sin(a * mode + t * 2) * 14; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .55; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); line(ctx, "#ffac36", 3); glow(ctx, "#ffac36", 18); ctx.stroke(); }
  else { wave(ctx, w * .2, w * .8, cy, 58, Math.max(1, mode), t * 2, "#34d9ef"); [w * .2, w * .8].forEach(x => { ctx.beginPath(); ctx.arc(x, cy, 7, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); }); }
  label(ctx, close > .6 ? "CLOSED STRING · PERIODIC BOUNDARY" : "OPEN STRING · FIXED ENDPOINTS", cx, h * .82, close > .6 ? "#ffba5d" : "#7fe7f5", 12, "center");
}
function worldsheetScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2; for (let row = 0; row < 18; row++) { const z = row / 17; ctx.beginPath(); for (let i = 0; i <= 90; i++) { const a = i / 90 * TAU; const rx = w * (.08 + z * .22); const x = cx + Math.cos(a) * rx; const y = h * .18 + z * h * .62 + Math.sin(a * 3 + t * 2 - z * 5) * 12 * q; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); line(ctx, `rgba(${60 + row * 5},${205 - row * 2},235,${.18 + z * .5})`, row % 4 === 0 ? 1.4 : .7); ctx.stroke(); }
  const y = h * (.18 + p * .62); line(ctx, "#ffb13c", 2); ctx.beginPath(); ctx.moveTo(w * .2, y); ctx.lineTo(w * .8, y); ctx.stroke(); label(ctx, "τ", w * .82, y + 4, "#ffb13c", 13);
}
function levelScene(ctx: CanvasRenderingContext2D, w: number, h: number, level: number, q: number, t: number) {
  const count = 7; for (let i = 0; i < count; i++) { const y = h * .78 - i * h * .09; line(ctx, i === Math.round(level) ? "#ffad36" : "rgba(71,211,234,.38)", i === Math.round(level) ? 3 : 1); ctx.beginPath(); ctx.moveTo(w * .22, y); ctx.lineTo(w * .78, y); ctx.stroke(); label(ctx, `N = ${i}`, w * .16, y + 4, i === Math.round(level) ? "#ffbd61" : "#88aeb8", 11, "right"); if (i === Math.round(level)) { for (let j = 0; j < i + 1; j++) { ctx.beginPath(); ctx.arc(w * .38 + j * 36, y - 13 - Math.sin(t * 3 + j) * 4, 5 + q * 4, 0, TAU); ctx.fillStyle = "#fff"; glow(ctx, "#ffad36", 15); ctx.fill(); ctx.shadowBlur = 0; } } }
}
function spectrumScene(ctx: CanvasRenderingContext2D, w: number, h: number, mass: number, spin: number, t: number) {
  const colors = ["#42dff5", "#ffb03e", "#a485ff", "#60e4a2", "#ff6f82"]; for (let m = 0; m < 7; m++) for (let s = 0; s < 5; s++) { const x = w * .18 + m * w * .1, y = h * .73 - s * h * .12; const active = m === Math.round(mass) || s === Math.round(spin); ctx.beginPath(); ctx.arc(x, y, active ? 9 + Math.sin(t * 3) * 2 : 4, 0, TAU); ctx.fillStyle = active ? colors[s] : "rgba(111,180,195,.24)"; if (active) glow(ctx, colors[s], 14); ctx.fill(); ctx.shadowBlur = 0; }
  label(ctx, "MASS LEVEL →", w * .5, h * .88, "#8bc8d5", 11, "center"); ctx.save(); ctx.translate(w * .09, h * .5); ctx.rotate(-Math.PI / 2); label(ctx, "SPIN →", 0, 0, "#8bc8d5", 11, "center"); ctx.restore();
}
function interactionScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const x = w * (.18 + .64 * p); const cy = h * .5; line(ctx, "rgba(58,218,242,.22)", 1); ctx.beginPath(); ctx.moveTo(w * .1, cy); ctx.lineTo(w * .9, cy); ctx.stroke();
  if (p < .43) wave(ctx, w * .12, x, cy, 22 + q * 18, 3, t * 4); else { wave(ctx, w * .12, w * .45, cy, 24, 3, t * 4); wave(ctx, w * .45, Math.min(x, w * .88), cy - 58 * Math.sin((p - .43) * Math.PI), 18 + q * 12, 2, t * 4, "#ffad38"); wave(ctx, w * .45, Math.min(x, w * .88), cy + 58 * Math.sin((p - .43) * Math.PI), 18 + q * 12, 2, t * 4, "#54e5bd"); }
  ctx.beginPath(); ctx.arc(w * .45, cy, 8 + q * 9, 0, TAU); ctx.fillStyle = "#fff"; glow(ctx, "#ffad38", 20); ctx.fill(); ctx.shadowBlur = 0;
}
function dimensionScene(ctx: CanvasRenderingContext2D, w: number, h: number, dimensions: number, targetTen: boolean, t: number) {
  const target = targetTen ? 10 : 26, diff = Math.abs(dimensions - target), cx = w / 2, cy = h / 2; for (let i = 0; i < Math.min(26, Math.round(dimensions)); i++) { const a = i / Math.max(1, dimensions) * TAU + t * .16; const ring = 70 + (i % 5) * 28; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * ring, cy + Math.sin(a) * ring * .55, 4 + (i % 3), 0, TAU); ctx.fillStyle = diff < .5 ? "#57e6b3" : i < target ? "#3bdcf2" : "#ff765f"; ctx.fill(); }
  ctx.beginPath(); ctx.arc(cx, cy, 74, 0, TAU); line(ctx, diff < .5 ? "#57e6b3" : "#ffad38", 3); glow(ctx, diff < .5 ? "#57e6b3" : "#ffad38", 20); ctx.stroke(); ctx.shadowBlur = 0; label(ctx, `${dimensions}D`, cx, cy + 9, "#fff", 27, "center"); label(ctx, diff < .5 ? "ANOMALY CANCELLED" : `ANOMALY ΔD = ${Math.round(diff)}`, cx, cy + 110, diff < .5 ? "#69e7b8" : "#ffb14a", 11, "center");
}
function partnersScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const rows = 4; for (let i = 0; i < rows; i++) { const y = h * (.25 + i * .16), bx = w * .3, fx = w * .7; ctx.beginPath(); ctx.arc(bx, y, 18, 0, TAU); ctx.fillStyle = "#3eddf3"; glow(ctx, "#3eddf3", 12); ctx.fill(); ctx.shadowBlur = 0; ctx.beginPath(); for (let j = 0; j < 6; j++) { const a = j / 6 * TAU + t; const x = fx + Math.cos(a) * 20, yy = y + Math.sin(a) * 20; j ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.closePath(); ctx.fillStyle = "#ffad38"; ctx.fill(); line(ctx, p < .35 ? "rgba(132,244,211,.9)" : "rgba(255,255,255,.18)", 2); ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(bx + 25, y); ctx.lineTo(fx - 28, y + (p - q) * 25); ctx.stroke(); ctx.setLineDash([]); }
  label(ctx, "BOSONS", w * .3, h * .16, "#68e8f8", 12, "center"); label(ctx, "FERMIONS", w * .7, h * .16, "#ffbf63", 12, "center");
}
function networkScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const names = ["TYPE I", "TYPE IIA", "TYPE IIB", "HET SO(32)", "HET E₈×E₈"], cx = w / 2, cy = h / 2, r = Math.min(w, h) * .29; const pts = names.map((_, i) => ({ x: cx + Math.cos(-Math.PI / 2 + i * TAU / 5) * r, y: cy + Math.sin(-Math.PI / 2 + i * TAU / 5) * r }));
  for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); line(ctx, `rgba(57,216,239,${.12 + p * .3})`, 1 + q); ctx.stroke(); }
  pts.forEach((pt, i) => { const rr = 25 + Math.sin(t * 2 + i) * 2; ctx.beginPath(); ctx.arc(pt.x, pt.y, rr, 0, TAU); ctx.fillStyle = i % 2 ? "#0c4254" : "#15364b"; line(ctx, i === 0 ? "#ffad38" : "#39d9ef", 2); glow(ctx, i === 0 ? "#ffad38" : "#39d9ef", 12); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0; label(ctx, names[i], pt.x, pt.y + 44, i === 0 ? "#ffbd65" : "#9ed9e3", 9, "center"); });
}
function compactScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2, radius = 40 + p * 130; ctx.beginPath(); ctx.ellipse(cx, cy, radius, radius * .38, 0, 0, TAU); line(ctx, "#40dff4", 3); glow(ctx, "#40dff4", 18); ctx.stroke(); ctx.shadowBlur = 0; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t * .3; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * .38, 3, 0, TAU); ctx.fillStyle = "#ffad38"; ctx.fill(); } const waveSize = 25 + q * 130; ctx.beginPath(); ctx.arc(cx, cy, waveSize, 0, TAU); line(ctx, "rgba(255,255,255,.4)", 1); ctx.setLineDash([5, 6]); ctx.stroke(); ctx.setLineDash([]); label(ctx, q > p ? "DIMENSION UNRESOLVED" : "COMPACT CIRCLE RESOLVED", cx, h * .78, q > p ? "#8db5be" : "#ffb652", 11, "center");
}
function calabiScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2, rot = p * TAU + t * .08; for (let band = 0; band < 7; band++) { ctx.beginPath(); for (let i = 0; i <= 180; i++) { const a = i / 180 * TAU; const r = 115 + Math.sin(a * 3 + band) * 45; const x = cx + Math.cos(a + rot + band * .2) * r * (1 - band * .035), y = cy + Math.sin(a + rot) * r * .48 + Math.sin(a * 2 + band) * 22; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } line(ctx, band === Math.round(q * 6) ? "#ffad38" : `rgba(54,217,239,${.15 + band * .07})`, band === Math.round(q * 6) ? 3 : 1.2); if (band === Math.round(q * 6)) glow(ctx, "#ffad38", 15); ctx.stroke(); ctx.shadowBlur = 0; }
}
function towerScene(ctx: CanvasRenderingContext2D, w: number, h: number, mode: number, radius: number, t: number) {
  const spacing = Math.min(h * .1, 34 / Math.max(.2, radius)); for (let n = 0; n < 9; n++) { const y = h * .78 - n * spacing, active = n === Math.round(mode); line(ctx, active ? "#ffad38" : "rgba(65,213,237,.32)", active ? 3 : 1); ctx.beginPath(); ctx.moveTo(w * .28, y); ctx.lineTo(w * .72, y); ctx.stroke(); label(ctx, `n=${n}`, w * .24, y + 4, active ? "#ffbd66" : "#799da6", 10, "right"); if (active) { ctx.beginPath(); ctx.arc(w * .5 + Math.sin(t * 2) * 30, y, 9, 0, TAU); ctx.fillStyle = "#fff"; glow(ctx, "#ffad38", 18); ctx.fill(); ctx.shadowBlur = 0; } }
  ctx.beginPath(); ctx.ellipse(w * .5, h * .84, 70 * radius, 20 * radius, 0, 0, TAU); line(ctx, "#41dced", 2); ctx.stroke();
}
function braneScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number, world: boolean) {
  const sep = 80 + p * w * .35, left = w / 2 - sep / 2, right = w / 2 + sep / 2; [left, right].forEach((x, i) => { const grad = ctx.createLinearGradient(x - 20, 0, x + 20, 0); grad.addColorStop(0, "rgba(28,178,208,.08)"); grad.addColorStop(.5, i ? "rgba(255,173,56,.45)" : "rgba(44,218,240,.44)"); grad.addColorStop(1, "rgba(28,178,208,.08)"); ctx.fillStyle = grad; ctx.fillRect(x - 22, h * .16, 44, h * .65); line(ctx, i ? "#ffad38" : "#37d9ef", 1.5); ctx.strokeRect(x - 22, h * .16, 44, h * .65); });
  for (let i = 0; i < 4; i++) wave(ctx, left, right, h * (.32 + i * .12), 10 + q * 16, 2 + i, t * 3 + i, i % 2 ? "#ffad38" : "#38dbee");
  if (world) { for (let i = 0; i < 8; i++) { const a = t + i * .8; ctx.beginPath(); ctx.arc(w / 2 + Math.cos(a) * sep * .42, h * .51 + Math.sin(a * 1.7) * 90, 3, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); } label(ctx, "CLOSED STRINGS ENTER THE BULK", w / 2, h * .9, "#ffba5c", 10, "center"); }
}
function dualityScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number, id: string) {
  const cx1 = w * .3, cx2 = w * .7, cy = h * .48, r1 = 42 + p * 80, r2 = id === "t-duality" ? 42 + (1 - p) * 80 : 42 + (1 / (.2 + p)) * 26; [cx1, cx2].forEach((cx, i) => { const r = i ? r2 : r1; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); line(ctx, i ? "#ffad38" : "#3fdcf1", 2.5); glow(ctx, i ? "#ffad38" : "#3fdcf1", 14); ctx.stroke(); ctx.shadowBlur = 0; for (let j = 0; j < Math.max(1, Math.round(q * 5)); j++) { const a = t * (i ? -1 : 1) + j * TAU / 5; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, TAU); ctx.fillStyle = "#fff"; ctx.fill(); } });
  line(ctx, "rgba(255,255,255,.45)", 2); ctx.beginPath(); ctx.moveTo(cx1 + r1 + 18, cy); ctx.lineTo(cx2 - r2 - 18, cy); ctx.stroke(); label(ctx, id === "m-theory" ? "STRONG COUPLING OPENS R₁₁" : id === "s-duality" ? "gₛ ↔ 1/gₛ" : "R ↔ α′/R", w / 2, cy - 24, "#fff", 13, "center");
}
function adsScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, top = h * .14, bottom = h * .83; for (let i = 0; i < 13; i++) { const z = i / 12, y = top + z * (bottom - top), rw = w * (.42 - z * .25); ctx.beginPath(); ctx.ellipse(cx, y, rw, 16 + z * 12, 0, 0, TAU); line(ctx, `rgba(52,214,237,${.13 + z * .05})`, 1); ctx.stroke(); }
  line(ctx, "#ffad38", 3); ctx.beginPath(); ctx.ellipse(cx, top, w * .42, 18, 0, 0, TAU); glow(ctx, "#ffad38", 12); ctx.stroke(); ctx.shadowBlur = 0; const y = top + p * (bottom - top), x = cx + Math.sin(t * 1.4) * (w * (.36 - p * .22)); ctx.beginPath(); ctx.arc(x, y, 9 + q * 6, 0, TAU); ctx.fillStyle = "#fff"; glow(ctx, "#46dff2", 18); ctx.fill(); ctx.shadowBlur = 0; label(ctx, "CONFORMAL BOUNDARY", cx, top - 25, "#ffbc60", 11, "center");
}
function gravitonScene(ctx: CanvasRenderingContext2D, w: number, h: number, helicity: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2; for (let ring = 1; ring <= 7; ring++) { ctx.beginPath(); for (let i = 0; i <= 180; i++) { const a = i / 180 * TAU; const r = ring * 26 + Math.sin(a * 2 + t * 3) * 8 * q; const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * (1 + Math.cos(a * 2 + t) * q * .08); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); line(ctx, `rgba(${60 + ring * 8},${220 - ring * 5},240,${.16 + ring * .06})`, ring === 4 ? 2 : 1); ctx.stroke(); }
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(t * Math.sign(helicity || 1)); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(75, 0); line(ctx, "#ffad38", 3); glow(ctx, "#ffad38", 10); ctx.stroke(); } ctx.restore(); ctx.shadowBlur = 0; label(ctx, `HELICITY ${helicity >= 0 ? "+" : ""}${helicity}`, cx, h * .84, "#ffbd62", 11, "center");
}
function emergentScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, grain: number, t: number) {
  const cols = 8 + Math.round(grain), rows = 5, pts: {x:number;y:number}[] = []; for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) pts.push({ x: w * .13 + x * w * .74 / (cols - 1) + Math.sin(t + x + y) * 3, y: h * .2 + y * h * .57 / (rows - 1) });
  pts.forEach((a, i) => pts.slice(i + 1).forEach((b) => { const d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 105 * p + 25) { line(ctx, `rgba(57,216,239,${Math.max(.04, .5 - d / 220)})`, 1); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } })); pts.forEach((pt, i) => { ctx.beginPath(); ctx.arc(pt.x, pt.y, i % 7 === 0 ? 5 : 2.5, 0, TAU); ctx.fillStyle = i % 7 === 0 ? "#ffad38" : "#70eaff"; ctx.fill(); }); label(ctx, p > .48 ? "CONNECTED GEOMETRY" : "DISCONNECTED QUANTUM REGIONS", w / 2, h * .88, p > .48 ? "#70e9be" : "#ffb45a", 11, "center");
}
function holographicScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, cells: number, t: number) {
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * .28; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fillStyle = "rgba(32,184,212,.08)"; ctx.fill(); line(ctx, "#ffad38", 2); glow(ctx, "#ffad38", 15); ctx.stroke(); ctx.shadowBlur = 0; const n = Math.round(cells); for (let i = 0; i < n; i++) { const a = i / n * TAU; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, i / n < p ? 3.5 : 2, 0, TAU); ctx.fillStyle = i / n < p ? "#ffcf74" : "rgba(114,205,220,.35)"; ctx.fill(); } for (let i = 0; i < Math.round(p * 24); i++) { const a = i * 2.399 + t * .1, rr = r * Math.sqrt(i / 24); ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 3, 0, TAU); ctx.fillStyle = "#4ae0f3"; ctx.fill(); } label(ctx, `${Math.round(p * n)} / ${n} BOUNDARY CELLS ACTIVE`, cx, h * .88, "#ffbd62", 11, "center");
}
function landscapeScene(ctx: CanvasRenderingContext2D, w: number, h: number, flux: number, energy: number, t: number) {
  ctx.beginPath(); for (let x = 0; x <= w; x += 4) { const u = x / w; const y = h * .58 + Math.sin(u * TAU * (3 + flux % 5) + t * .2) * 38 + Math.sin(u * TAU * 9) * 14 - energy * 24; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); const g = ctx.createLinearGradient(0, h * .35, 0, h); g.addColorStop(0, "rgba(38,209,230,.35)"); g.addColorStop(1, "rgba(3,24,31,.1)"); ctx.fillStyle = g; ctx.fill(); line(ctx, "#46def0", 2); ctx.stroke(); for (let i = 0; i < 12; i++) { const x = w * (.08 + i * .075), y = h * .48 + Math.sin(i * 1.7 + flux) * 76 - energy * 24; ctx.beginPath(); ctx.arc(x, y, i === Math.round(flux) % 12 ? 9 : 4, 0, TAU); ctx.fillStyle = i === Math.round(flux) % 12 ? "#ffad38" : "#67dfee"; if (i === Math.round(flux) % 12) glow(ctx, "#ffad38", 16); ctx.fill(); ctx.shadowBlur = 0; }
}
function blackHoleScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2, r = 64 + p * 42; const disk = ctx.createRadialGradient(cx, cy, r * .7, cx, cy, r * 2.6); disk.addColorStop(0, "rgba(0,0,0,1)"); disk.addColorStop(.36, "rgba(0,0,0,1)"); disk.addColorStop(.42, "rgba(255,169,51,.8)"); disk.addColorStop(.55, "rgba(42,210,235,.2)"); disk.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = disk; ctx.beginPath(); ctx.arc(cx, cy, r * 2.6, 0, TAU); ctx.fill(); ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill(); const dots = 30 + Math.round(q * 70); for (let i = 0; i < dots; i++) { const a = i * 2.399 + t * .15, rr = r * (.4 + .45 * ((i * 17) % 19) / 19); ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 2, 0, TAU); ctx.fillStyle = i % 3 ? "#36d9ed" : "#ffad38"; ctx.fill(); } label(ctx, `${dots} RESOLVED MICROSTATES`, cx, h * .86, "#ffbd62", 11, "center");
}
function pageCurveScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const left = w * .15, right = w * .86, top = h * .18, bottom = h * .78; line(ctx, "rgba(109,189,201,.38)", 1); ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke(); ctx.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100, value = u < .5 ? u * 2 : (1 - u) * 2, x = left + u * (right - left), y = bottom - value * (bottom - top) * .78 * q; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } line(ctx, "#45dff2", 3); glow(ctx, "#45dff2", 12); ctx.stroke(); ctx.shadowBlur = 0; const u = p, value = u < .5 ? u * 2 : (1 - u) * 2, x = left + u * (right - left), y = bottom - value * (bottom - top) * .78 * q; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fillStyle = "#ffad38"; glow(ctx, "#ffad38", 18); ctx.fill(); ctx.shadowBlur = 0; line(ctx, "rgba(255,173,56,.5)", 1); ctx.setLineDash([4, 5]); ctx.beginPath(); ctx.moveTo((left + right) / 2, top); ctx.lineTo((left + right) / 2, bottom); ctx.stroke(); ctx.setLineDash([]); label(ctx, "PAGE TIME", (left + right) / 2, bottom + 25, "#ffba59", 10, "center");
}
function cosmosScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  const cx = w / 2, cy = h / 2; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * .05, rr = (50 + i * 22) * (1 + q * .45); ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .55, 3 + i % 3, 0, TAU); ctx.fillStyle = i % 2 ? "#48dff1" : "#ffad38"; ctx.fill(); line(ctx, `rgba(56,213,235,${.3 - i * .02})`, 1); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .55); ctx.stroke(); } const sep = 30 + p * 150; line(ctx, "#ffad38", 4); ctx.beginPath(); ctx.moveTo(cx - sep, h * .18); ctx.lineTo(cx - sep, h * .82); ctx.moveTo(cx + sep, h * .18); ctx.lineTo(cx + sep, h * .82); glow(ctx, "#ffad38", 12); ctx.stroke(); ctx.shadowBlur = 0;
}
function cosmicStringScene(ctx: CanvasRenderingContext2D, w: number, h: number, p: number, q: number, t: number) {
  for (let s = 0; s < 5; s++) { ctx.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100, x = u * w, y = h * (.2 + s * .14) + Math.sin(u * TAU * (2 + s) + t * (1 + s * .2)) * (12 + p * 24); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } line(ctx, s === 2 ? "#ffad38" : `rgba(58,219,239,${.32 + s * .08})`, s === 2 ? 3 : 1.4); if (s === 2) glow(ctx, "#ffad38", 15); ctx.stroke(); ctx.shadowBlur = 0; }
  for (let i = 0; i < Math.round(2 + q * 12); i++) { const x = w * (.15 + ((i * 37) % 70) / 100), y = h * (.24 + ((i * 29) % 53) / 100); ctx.beginPath(); ctx.ellipse(x, y, 16 + i % 4 * 4, 7 + i % 3 * 2, i, 0, TAU); line(ctx, "#7ee9f6", 1.5); ctx.stroke(); }
}
