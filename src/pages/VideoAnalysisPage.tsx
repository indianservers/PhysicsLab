import { useMemo, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Toolbar } from "../components/Toolbar";
import { GuidePanel } from "../components/GuidePanel";
import { videoGuide } from "../lib/guides";

interface TrackPoint {
  frame: number;
  timeSeconds: number;
  xPx: number;
  yPx: number;
  xM: number;
  yM: number;
}

type Mode = "calibrate" | "origin" | "track";

export function VideoAnalysisPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [fps, setFps] = useState(30);
  const [mode, setMode] = useState<Mode>("calibrate");
  const [realDistance, setRealDistance] = useState(0.5);
  const [calibration, setCalibration] = useState<{ a: Point; b: Point; pixelsPerMeter: number }>();
  const [origin, setOrigin] = useState<Point>({ x: 0, y: 0 });
  const [pendingCalibration, setPendingCalibration] = useState<Point>();
  const [points, setPoints] = useState<TrackPoint[]>([]);
  const analysis = useMemo(() => analyze(points), [points]);

  const loadVideo = (file: File) => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(URL.createObjectURL(file));
    setPoints([]);
  };

  const step = (direction: 1 | -1) => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + direction / fps));
    drawOverlay();
  };

  const handleCanvasClick = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (mode === "origin") {
      setOrigin(point);
      drawOverlay();
      return;
    }
    if (mode === "calibrate") {
      if (!pendingCalibration) {
        setPendingCalibration(point);
      } else {
        const pixels = Math.hypot(point.x - pendingCalibration.x, point.y - pendingCalibration.y);
        setCalibration({ a: pendingCalibration, b: point, pixelsPerMeter: pixels / Math.max(0.0001, realDistance) });
        setPendingCalibration(undefined);
      }
      window.setTimeout(drawOverlay);
      return;
    }
    const video = videoRef.current;
    const ppm = calibration?.pixelsPerMeter;
    if (!video || !ppm) return;
    const next = {
      frame: Math.round(video.currentTime * fps),
      timeSeconds: video.currentTime,
      xPx: point.x,
      yPx: point.y,
      xM: (point.x - origin.x) / ppm,
      yM: -(point.y - origin.y) / ppm,
    };
    setPoints((items) => [...items, next]);
    window.setTimeout(() => step(1));
  };

  const drawOverlay = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = "#facc15";
    ctx.fillStyle = "#facc15";
    ctx.lineWidth = 2;
    const line = calibration ?? (pendingCalibration ? { a: pendingCalibration, b: pendingCalibration, pixelsPerMeter: 0 } : undefined);
    if (line) {
      ctx.beginPath();
      ctx.moveTo(line.a.x, line.a.y);
      ctx.lineTo(line.b.x, line.b.y);
      ctx.stroke();
    }
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
    ctx.fill();
    if (points.length) {
      ctx.strokeStyle = "#22d3ee";
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      points.forEach((point, index) => index ? ctx.lineTo(point.xPx, point.yPx) : ctx.moveTo(point.xPx, point.yPx));
      ctx.stroke();
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.xPx, point.yPx, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      const last = points[points.length - 1];
      const velocity = analysis.find((item) => item.frame === last.frame);
      if (velocity) drawArrow(ctx, last.xPx, last.yPx, last.xPx + velocity.vx * 30, last.yPx - velocity.vy * 30);
    }
  };

  const exportCsv = () => {
    const rows = [["frame", "timeSeconds", "xPx", "yPx", "xM", "yM", "vx", "vy", "ax", "ay"], ...analysis.map((row) => [row.frame, row.timeSeconds, row.xPx, row.yPx, row.xM, row.yM, row.vx, row.vy, row.ax, row.ay])];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-video-analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Toolbar />
      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="panel min-h-0 p-3">
          <GuidePanel guide={videoGuide} compact />
          <div className="relative aspect-video w-full overflow-hidden rounded bg-slate-950">
            {videoUrl && <video ref={videoRef} src={videoUrl} className="h-full w-full" onLoadedMetadata={drawOverlay} onSeeked={drawOverlay} />}
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" onPointerDown={handleCanvasClick} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input type="file" accept="video/*" onChange={(event) => event.target.files?.[0] && loadVideo(event.target.files[0])} />
            <button className="tool-btn" onClick={() => videoRef.current?.paused ? videoRef.current.play() : videoRef.current?.pause()}>Play/Pause</button>
            <button className="tool-btn" onClick={() => step(-1)}>Step Back</button>
            <button className="tool-btn" onClick={() => step(1)}>Step Forward</button>
            <label className="toolbar-field">FPS <input className="w-16 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" type="number" value={fps} onChange={(event) => setFps(Number(event.target.value) || 30)} /></label>
            <label className="toolbar-field">Known m <input className="w-20 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800" type="number" step="0.01" value={realDistance} onChange={(event) => setRealDistance(Number(event.target.value) || 0.5)} /></label>
            {(["calibrate", "origin", "track"] as Mode[]).map((item) => <button key={item} className={mode === item ? "tab-active" : "tab-btn"} onClick={() => setMode(item)}>{item}</button>)}
          </div>
          <div className="mt-3 grid gap-3 xl:grid-cols-2">
            <Chart data={analysis} keys={["xM", "yM"]} />
            <Chart data={analysis} keys={["vx", "vy"]} />
            <Chart data={analysis} keys={["ax", "ay"]} />
          </div>
        </section>
        <aside className="panel min-h-0 overflow-auto p-3">
          <div className="mb-3 flex items-center justify-between">
            <h1 className="panel-title">Video Data</h1>
            <button className="tool-btn" onClick={exportCsv}>Export CSV</button>
          </div>
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
            <Metric label="Scale" value={calibration ? `${calibration.pixelsPerMeter.toFixed(1)} px/m` : "-"} />
            <Metric label="Points" value={String(points.length)} />
          </div>
          <table className="w-full text-left text-xs">
            <thead className="text-slate-400"><tr><th>Frame</th><th>t</th><th>x</th><th>y</th></tr></thead>
            <tbody>{analysis.map((point) => <tr key={`${point.frame}-${point.xPx}`} className="border-t border-slate-300/40 dark:border-lab-line"><td>{point.frame}</td><td>{point.timeSeconds.toFixed(3)}</td><td>{point.xM.toFixed(3)}</td><td>{point.yM.toFixed(3)}</td></tr>)}</tbody>
          </table>
        </aside>
      </div>
    </div>
  );
}

interface Point {
  x: number;
  y: number;
}

function analyze(points: TrackPoint[]) {
  return points.map((point, index) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dt = Math.max(0.0001, next.timeSeconds - prev.timeSeconds);
    const vx = (next.xM - prev.xM) / dt;
    const vy = (next.yM - prev.yM) / dt;
    const prevV = index > 0 ? (point.xM - prev.xM) / Math.max(0.0001, point.timeSeconds - prev.timeSeconds) : vx;
    const nextV = index < points.length - 1 ? (next.xM - point.xM) / Math.max(0.0001, next.timeSeconds - point.timeSeconds) : vx;
    const prevVy = index > 0 ? (point.yM - prev.yM) / Math.max(0.0001, point.timeSeconds - prev.timeSeconds) : vy;
    const nextVy = index < points.length - 1 ? (next.yM - point.yM) / Math.max(0.0001, next.timeSeconds - point.timeSeconds) : vy;
    return { ...point, vx, vy, ax: (nextV - prevV) / Math.max(0.0001, dt), ay: (nextVy - prevVy) / Math.max(0.0001, dt) };
  });
}

function Chart({ data, keys }: { data: ReturnType<typeof analyze>; keys: string[] }) {
  return (
    <div className="h-48 min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148,163,184,0.18)" />
          <XAxis dataKey="timeSeconds" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.25)", color: "#e2e8f0" }} />
          <Legend />
          {keys.map((key, index) => <Line key={key} type="monotone" dataKey={key} stroke={index ? "#34d399" : "#22d3ee"} dot={false} />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded border border-slate-300/60 bg-slate-100 p-2 dark:border-lab-line dark:bg-slate-900/70"><div className="text-slate-500 dark:text-slate-400">{label}</div><div className="font-mono text-cyan-500">{value}</div></div>;
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = "#22c55e";
  ctx.fillStyle = "#22c55e";
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
