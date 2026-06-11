import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import { experiments } from "../lib/experiments";
import { PhysicsIcon } from "../lib/icons";

interface Node {
  id: string; x: number; y: number; vx: number; vy: number;
  label: string; category: string; color: string; r: number;
}
interface Edge { a: string; b: string; }

const CATEGORY_COLORS: Record<string, string> = {
  Mechanics: "#22d3ee", Waves: "#a78bfa", Optics: "#f59e0b",
  Electricity: "#34d399", Magnetism: "#f472b6", Thermodynamics: "#fb923c",
  "Fluid Mechanics": "#60a5fa", "Modern Physics": "#c084fc", Measurement: "#94a3b8",
  Electronics: "#4ade80", Energy: "#facc15", default: "#94a3b8",
};

function getColor(cat: string) {
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (cat.includes(key)) return val;
  }
  return CATEGORY_COLORS.default;
}

function buildGraph() {
  const nodes: Node[] = experiments.map((e, i) => {
    const angle = (i / experiments.length) * Math.PI * 2;
    const r = 180 + Math.random() * 80;
    return {
      id: e.id, x: 600 + Math.cos(angle) * r, y: 400 + Math.sin(angle) * r,
      vx: 0, vy: 0, label: e.title, category: e.category,
      color: getColor(e.category), r: 7 + (e.difficulty === "Advanced" ? 4 : e.difficulty === "Intermediate" ? 2 : 0),
    };
  });

  const edges: Edge[] = [];
  const catMap = new Map<string, string[]>();
  experiments.forEach((e) => {
    const key = e.category;
    if (!catMap.has(key)) catMap.set(key, []);
    catMap.get(key)!.push(e.id);
  });
  catMap.forEach((ids) => {
    for (let i = 0; i < ids.length - 1; i++) {
      edges.push({ a: ids[i], b: ids[i + 1] });
    }
  });
  return { nodes, edges };
}

export function KnowledgeGraphPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const rafRef = useRef<number>(0);
  const { nodes, edges } = useRef(buildGraph()).current;
  const nodesRef = useRef(nodes);
  const mouseRef = useRef({ x: -9999, y: -9999, down: false });
  const dragRef = useRef<Node | null>(null);
  const [hovered, setHovered] = useState<Node | null>(null);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? nodesRef.current.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()))
    : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.clientWidth * Math.min(devicePixelRatio, 1.5);
      canvas.height = canvas.clientHeight * Math.min(devicePixelRatio, 1.5);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let hovNode: Node | null = null;

    const simulate = () => {
      const ns = nodesRef.current;
      const REPEL = 2200; const ATTRACT = 0.015; const DAMPING = 0.88; const IDEAL = 120;

      for (let i = 0; i < ns.length; i++) {
        const a = ns[i];
        if (dragRef.current === a) continue;
        let fx = 0; let fy = 0;
        // Repulsion
        for (let j = 0; j < ns.length; j++) {
          if (i === j) continue;
          const b = ns[j];
          const dx = a.x - b.x; const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy || 0.01;
          const f = REPEL / d2;
          fx += (dx / Math.sqrt(d2)) * f;
          fy += (dy / Math.sqrt(d2)) * f;
        }
        // Gravity to center
        const cx = canvas.width / 2 / Math.min(devicePixelRatio, 1.5);
        const cy = canvas.height / 2 / Math.min(devicePixelRatio, 1.5);
        fx += (cx - a.x) * 0.002;
        fy += (cy - a.y) * 0.002;
        a.vx = (a.vx + fx * 0.016) * DAMPING;
        a.vy = (a.vy + fy * 0.016) * DAMPING;
        a.x += a.vx;
        a.y += a.vy;
      }
      // Spring forces along edges
      edges.forEach(({ a: aid, b: bid }) => {
        const a = ns.find((n) => n.id === aid)!;
        const b = ns.find((n) => n.id === bid)!;
        if (!a || !b) return;
        if (dragRef.current === a || dragRef.current === b) return;
        const dx = b.x - a.x; const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - IDEAL) * ATTRACT;
        const nx2 = dx / d; const ny2 = dy / d;
        a.vx += nx2 * f; a.vy += ny2 * f;
        b.vx -= nx2 * f; b.vy -= ny2 * f;
      });
    };

    const render = () => {
      const W = canvas.width; const H = canvas.height;
      const DPR = Math.min(devicePixelRatio, 1.5);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(5,12,24,0.96)";
      ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.scale(DPR, DPR);
      const logW = W / DPR; const logH = H / DPR;
      const ns = nodesRef.current;

      simulate();

      // Edges
      edges.forEach(({ a: aid, b: bid }) => {
        const a = ns.find((n) => n.id === aid)!;
        const b = ns.find((n) => n.id === bid)!;
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(34,211,238,0.08)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Nodes
      ns.forEach((node) => {
        const isHov = node === hovNode;
        const isFiltered = filtered.length > 0 && !filtered.includes(node);
        const alpha = isFiltered ? 0.2 : 1;
        ctx.globalAlpha = alpha;

        const grd = ctx.createRadialGradient(node.x - node.r * 0.3, node.y - node.r * 0.3, 0, node.x, node.y, node.r * (isHov ? 1.8 : 1.4));
        grd.addColorStop(0, node.color + "ff");
        grd.addColorStop(1, node.color + "22");
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * (isHov ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        if (isHov) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.r * 2.2, 0, Math.PI * 2);
          ctx.strokeStyle = node.color + "55";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        if (logW > 600 || isHov) {
          ctx.fillStyle = isHov ? "#ffffff" : "rgba(255,255,255,0.75)";
          ctx.font = isHov ? `bold ${12}px Inter,sans-serif` : `${10}px Inter,sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          const maxW = 80;
          const text = node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label;
          ctx.fillText(text, node.x, node.y + node.r + 4, maxW);
        }
        ctx.globalAlpha = 1;
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    const getNode = (ex: number, ey: number) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (ex - rect.left); const my = (ey - rect.top);
      return nodesRef.current.find((n) => Math.hypot(n.x - mx, n.y - my) < n.r * 2 + 6) ?? null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, down: mouseRef.current.down };
      const found = getNode(e.clientX, e.clientY);
      hovNode = found;
      setHovered(found);
      if (dragRef.current) {
        dragRef.current.x = mouseRef.current.x;
        dragRef.current.y = mouseRef.current.y;
        dragRef.current.vx = 0;
        dragRef.current.vy = 0;
      }
      canvas.style.cursor = found ? "pointer" : "default";
    };
    const onMouseDown = (e: MouseEvent) => {
      dragRef.current = getNode(e.clientX, e.clientY);
    };
    const onMouseUp = (e: MouseEvent) => {
      const wasDrag = dragRef.current !== null;
      dragRef.current = null;
      if (!wasDrag) {
        const clicked = getNode(e.clientX, e.clientY);
        if (clicked) navigate(`/experiments/${clicked.id}`);
      }
    };

    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categories = [...new Set(nodesRef.current.map((n) => n.category))];

  return (
    <div className="min-h-screen" style={{ display: "flex", flexDirection: "column" }}>
      <Toolbar />
      <main className="knowledge-graph-page" style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem 1.5rem 1rem 80px" }}>
        <div className="knowledge-graph-header">
          <div>
            <p className="ui-label">Interactive Physics Universe</p>
            <h1 className="section-heading-gradient">Knowledge Graph</h1>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", marginTop: "0.25rem" }}>
              {experiments.length} experiments · {categories.length} domains · Drag nodes · Click to open
            </p>
          </div>
          <div className="knowledge-graph-controls">
            <label className="home-experiment-search" style={{ maxWidth: 260 }}>
              <PhysicsIcon name="search" className="h-4 w-4" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter experiments..." />
              {search && <button onClick={() => setSearch("")}>✕</button>}
            </label>
          </div>
        </div>
        {/* Legend */}
        <div className="knowledge-graph-legend">
          {categories.slice(0, 8).map((cat) => (
            <span key={cat} className="kg-legend-item">
              <span className="kg-dot" style={{ background: getColor(cat) }} />
              {cat}
            </span>
          ))}
        </div>
        {/* Canvas */}
        <div style={{ flex: 1, position: "relative", minHeight: "500px", borderRadius: "1.25rem", overflow: "hidden", border: "1px solid rgba(34,211,238,0.12)" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
          {hovered && (
            <div className="kg-tooltip">
              <strong>{hovered.label}</strong>
              <span style={{ color: getColor(hovered.category) }}>{hovered.category}</span>
              <span className="kg-tooltip-hint">Click to open experiment →</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
