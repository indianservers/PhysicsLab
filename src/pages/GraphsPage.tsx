import { useMemo, useRef, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { Toolbar } from "../components/Toolbar";
import { useLabStore } from "../store/useLabStore";
import { PhysicsIcon } from "../lib/icons";

interface DataRow {
  id: string;
  x: string;
  y: string;
}

const COLORS = ["#22d3ee", "#f43f5e", "#a78bfa", "#34d399", "#fb923c", "#facc15"];

const PRESETS: { label: string; xLabel: string; yLabel: string; rows: { x: string; y: string }[] }[] = [
  {
    label: "Uniform motion (d–t)", xLabel: "Time (s)", yLabel: "Distance (m)",
    rows: [{ x: "0", y: "0" }, { x: "1", y: "3" }, { x: "2", y: "6" }, { x: "3", y: "9" }, { x: "4", y: "12" }],
  },
  {
    label: "Free fall (v–t)", xLabel: "Time (s)", yLabel: "Velocity (m/s)",
    rows: [{ x: "0", y: "0" }, { x: "0.5", y: "4.9" }, { x: "1", y: "9.8" }, { x: "1.5", y: "14.7" }, { x: "2", y: "19.6" }],
  },
  {
    label: "Ohm's law (V–I)", xLabel: "Current I (A)", yLabel: "Voltage V (V)",
    rows: [{ x: "0.1", y: "1" }, { x: "0.2", y: "2" }, { x: "0.3", y: "3" }, { x: "0.4", y: "4" }, { x: "0.5", y: "5" }],
  },
  {
    label: "Pendulum period vs length", xLabel: "Length (m)", yLabel: "Period T (s)",
    rows: [{ x: "0.1", y: "0.63" }, { x: "0.25", y: "1.0" }, { x: "0.5", y: "1.42" }, { x: "1", y: "2.0" }, { x: "2", y: "2.83" }],
  },
];

function makeId() { return Math.random().toString(36).slice(2); }
function emptyRow(): DataRow { return { id: makeId(), x: "", y: "" }; }

function parsedPoints(rows: DataRow[]) {
  return rows
    .map((row) => ({ x: parseFloat(row.x), y: parseFloat(row.y) }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
}

function linearRegression(points: { x: number; y: number }[]) {
  if (points.length < 2) return null;
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const yMean = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - yMean) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { slope, intercept, r2 };
}

interface Series {
  id: string;
  label: string;
  xLabel: string;
  yLabel: string;
  rows: DataRow[];
}

function makeSeries(label = "Series 1", xLabel = "x", yLabel = "y"): Series {
  return {
    id: makeId(),
    label,
    xLabel,
    yLabel,
    rows: [emptyRow(), emptyRow(), emptyRow()],
  };
}

export function GraphsPage() {
  const [series, setSeries] = useState<Series[]>([makeSeries()]);
  const [activeSid, setActiveSid] = useState<string>(series[0].id);
  const [chartType, setChartType] = useState<"scatter" | "line">("scatter");
  const [showBestFit, setShowBestFit] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const labGraphData = useLabStore((state) => state.graphData);

  const activeSeries = series.find((s) => s.id === activeSid) ?? series[0];

  const updateSeries = (id: string, patch: Partial<Series>) => {
    setSeries((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const updateRow = (sid: string, rid: string, patch: Partial<DataRow>) => {
    setSeries((prev) =>
      prev.map((s) =>
        s.id === sid
          ? { ...s, rows: s.rows.map((row) => (row.id === rid ? { ...row, ...patch } : row)) }
          : s
      )
    );
  };

  const addRow = (sid: string) => {
    setSeries((prev) =>
      prev.map((s) => (s.id === sid ? { ...s, rows: [...s.rows, emptyRow()] } : s))
    );
  };

  const removeRow = (sid: string, rid: string) => {
    setSeries((prev) =>
      prev.map((s) =>
        s.id === sid ? { ...s, rows: s.rows.filter((r) => r.id !== rid) } : s
      )
    );
  };

  const addSeries = () => {
    const s = makeSeries(`Series ${series.length + 1}`);
    setSeries((prev) => [...prev, s]);
    setActiveSid(s.id);
  };

  const removeSeries = (id: string) => {
    if (series.length === 1) return;
    const remaining = series.filter((s) => s.id !== id);
    setSeries(remaining);
    if (activeSid === id) setActiveSid(remaining[0].id);
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setSeries((prev) =>
      prev.map((s) =>
        s.id === activeSid
          ? { ...s, label: preset.label, xLabel: preset.xLabel, yLabel: preset.yLabel, rows: preset.rows.map((r) => ({ ...r, id: makeId() })) }
          : s
      )
    );
  };

  const importLabData = () => {
    if (labGraphData.length === 0) return;
    const s = makeSeries("Lab simulation data", "Time (s)", "KE (J)");
    s.rows = labGraphData.slice(0, 200).map((point) => ({ id: makeId(), x: String(point.t.toFixed(3)), y: String(point.kineticEnergy.toFixed(3)) }));
    setSeries((prev) => [...prev, s]);
    setActiveSid(s.id);
  };

  const exportCsv = () => {
    const rows = ["series,x,y"];
    series.forEach((s) => {
      parsedPoints(s.rows).forEach((p) => rows.push(`"${s.label}",${p.x},${p.y}`));
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "physicslab-graph-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (file: File) => {
    const text = await file.text();
    const lines = text.trim().split("\n").slice(1);
    const imported = makeSeries(`Imported: ${file.name}`);
    imported.rows = lines
      .map((line) => {
        const parts = line.split(",");
        return { id: makeId(), x: parts[0]?.trim() ?? "", y: parts[1]?.trim() ?? "" };
      })
      .filter((r) => r.x && r.y);
    setSeries((prev) => [...prev, imported]);
    setActiveSid(imported.id);
  };

  const allChartData = useMemo(() => {
    return series.map((s) => ({ ...s, points: parsedPoints(s.rows) }));
  }, [series]);

  const activePoints = allChartData.find((s) => s.id === activeSid)?.points ?? [];
  const regression = useMemo(() => (showBestFit ? linearRegression(activePoints) : null), [activePoints, showBestFit]);
  const bestFitLine = useMemo(() => {
    if (!regression || activePoints.length < 2) return [];
    const xs = activePoints.map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    return [
      { x: minX, y: regression.slope * minX + regression.intercept },
      { x: maxX, y: regression.slope * maxX + regression.intercept },
    ];
  }, [regression, activePoints]);

  const allXs = allChartData.flatMap((s) => s.points.map((p) => p.x));
  const allYs = allChartData.flatMap((s) => s.points.map((p) => p.y));
  const xMin = allXs.length ? Math.min(...allXs) : 0;
  const xMax = allXs.length ? Math.max(...allXs) : 10;
  const yMin = allYs.length ? Math.min(...allYs) : 0;
  const yMax = allYs.length ? Math.max(...allYs) : 10;
  const xPad = (xMax - xMin) * 0.08 || 1;
  const yPad = (yMax - yMin) * 0.08 || 1;

  return (
    <div className="min-h-screen">
      <Toolbar compact />
      <main id="content" className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Data analysis workspace</p>
            <h1 className="mt-1 text-3xl font-black text-gradient">Graph Studio</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Enter data, plot multiple series, fit a best-fit line, and export to CSV.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tool-btn" onClick={importLabData} title="Import kinetic energy data from the current lab simulation">
              <PhysicsIcon name="flask" className="h-4 w-4" />Import from lab
            </button>
            <button className="tool-btn" onClick={() => fileRef.current?.click()}>
              <PhysicsIcon name="upload" className="h-4 w-4" />Import CSV
            </button>
            <button className="tool-btn" onClick={exportCsv}>
              <PhysicsIcon name="download" className="h-4 w-4" />Export CSV
            </button>
            <input ref={fileRef} className="hidden" type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
          {/* Left: series list + data entry */}
          <div className="flex flex-col gap-4">
            {/* Series tabs */}
            <div className="panel p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="ui-label">Data series</span>
                <button className="tool-btn" onClick={addSeries}><PhysicsIcon name="spark" className="h-4 w-4" />Add series</button>
              </div>
              <div className="flex flex-col gap-2">
                {series.map((s, si) => (
                  <div key={s.id} className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer ${s.id === activeSid ? "border-cyan-400 bg-cyan-500/10" : "border-slate-300/60 dark:border-lab-line"}`} onClick={() => setActiveSid(s.id)}>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[si % COLORS.length] }} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.label}</span>
                    <span className="text-xs text-slate-500">{parsedPoints(s.rows).length} pts</span>
                    {series.length > 1 && (
                      <button className="tool-btn ml-1 px-1 py-0.5 text-rose-400" onClick={(e) => { e.stopPropagation(); removeSeries(s.id); }}>×</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active series config */}
            <div className="panel p-3">
              <div className="mb-3 grid gap-2">
                <label className="property-row">
                  <span>Series name</span>
                  <input value={activeSeries.label} onChange={(e) => updateSeries(activeSid, { label: e.target.value })} className="w-36 rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800" />
                </label>
                <label className="property-row">
                  <span>X axis label</span>
                  <input value={activeSeries.xLabel} onChange={(e) => updateSeries(activeSid, { xLabel: e.target.value })} className="w-36 rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800" />
                </label>
                <label className="property-row">
                  <span>Y axis label</span>
                  <input value={activeSeries.yLabel} onChange={(e) => updateSeries(activeSid, { yLabel: e.target.value })} className="w-36 rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800" />
                </label>
              </div>

              {/* Preset loader */}
              <div className="mb-3">
                <span className="ui-label mb-1 block">Presets</span>
                <div className="flex flex-wrap gap-1">
                  {PRESETS.map((preset) => (
                    <button key={preset.label} className="tool-btn text-xs" onClick={() => applyPreset(preset)}>{preset.label}</button>
                  ))}
                </div>
              </div>

              {/* Data table */}
              <div className="mb-2 grid grid-cols-[1fr_1fr_28px] gap-1 text-xs font-bold text-slate-500">
                <span>{activeSeries.xLabel || "x"}</span>
                <span>{activeSeries.yLabel || "y"}</span>
                <span />
              </div>
              <div className="max-h-56 overflow-y-auto">
                {activeSeries.rows.map((row) => (
                  <div key={row.id} className="mb-1 grid grid-cols-[1fr_1fr_28px] gap-1">
                    <input value={row.x} onChange={(e) => updateRow(activeSid, row.id, { x: e.target.value })} className="rounded border border-slate-300/60 bg-slate-100 px-2 py-1 text-sm dark:border-lab-line dark:bg-slate-800" placeholder="0" />
                    <input value={row.y} onChange={(e) => updateRow(activeSid, row.id, { y: e.target.value })} className="rounded border border-slate-300/60 bg-slate-100 px-2 py-1 text-sm dark:border-lab-line dark:bg-slate-800" placeholder="0" />
                    <button className="tool-btn px-1 py-0.5 text-rose-400" onClick={() => removeRow(activeSid, row.id)}>×</button>
                  </div>
                ))}
              </div>
              <button className="tool-btn mt-2 w-full" onClick={() => addRow(activeSid)}>+ Add row</button>
            </div>

            {/* Regression summary */}
            {regression && activePoints.length >= 2 && (
              <div className="panel p-3">
                <span className="ui-label">Best-fit line</span>
                <div className="mt-2 font-mono text-sm">
                  <div>y = {regression.slope.toFixed(4)} x {regression.intercept >= 0 ? "+" : "−"} {Math.abs(regression.intercept).toFixed(4)}</div>
                  <div className="mt-1 text-slate-500">R² = {regression.r2.toFixed(5)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right: chart */}
          <div className="flex flex-col gap-4">
            <div className="panel p-3">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <div className="flex gap-1 rounded-md border border-slate-300/60 p-0.5 dark:border-lab-line">
                  {(["scatter", "line"] as const).map((t) => (
                    <button key={t} className={`rounded px-3 py-1 text-sm font-semibold capitalize transition-colors ${chartType === t ? "bg-cyan-500 text-slate-950" : "text-slate-500 hover:text-slate-200"}`} onClick={() => setChartType(t)}>{t}</button>
                  ))}
                </div>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="checkbox" checked={showBestFit} onChange={(e) => setShowBestFit(e.target.checked)} />
                  Best-fit line (active series)
                </label>
              </div>

              <ResponsiveContainer width="100%" height={420}>
                {chartType === "scatter" ? (
                  <ScatterChart margin={{ top: 10, right: 24, bottom: 24, left: 10 }}>
                    <XAxis dataKey="x" type="number" name={activeSeries.xLabel} domain={[xMin - xPad, xMax + xPad]} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.xLabel, position: "insideBottom", offset: -14, fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis dataKey="y" type="number" name={activeSeries.yLabel} domain={[yMin - yPad, yMax + yPad]} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.yLabel, angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(5,12,24,0.94)", border: "1px solid rgba(0,229,255,0.28)", color: "#e2e8f0", borderRadius: 10, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    {allChartData.map((s, si) => (
                      <Scatter key={s.id} name={s.label} data={s.points} fill={COLORS[si % COLORS.length]} opacity={0.9} isAnimationActive animationDuration={700} />
                    ))}
                    {showBestFit && bestFitLine.length === 2 && (
                      <Scatter name="Best-fit" data={bestFitLine} line={{ stroke: "#f43f5e", strokeWidth: 2, strokeDasharray: "6 3" }} shape={() => null as unknown as React.ReactElement} fill="transparent" legendType="line" />
                    )}
                  </ScatterChart>
                ) : (
                  <LineChart margin={{ top: 10, right: 24, bottom: 24, left: 10 }}>
                    <XAxis dataKey="x" type="number" domain={[xMin - xPad, xMax + xPad]} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.xLabel, position: "insideBottom", offset: -14, fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis domain={[yMin - yPad, yMax + yPad]} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.yLabel, angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "rgba(5,12,24,0.94)", border: "1px solid rgba(0,229,255,0.28)", color: "#e2e8f0", borderRadius: 10, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    {allChartData.map((s, si) => (
                      <Line key={s.id} data={s.points} dataKey="y" name={s.label} dot={{ r: 4 }} stroke={COLORS[si % COLORS.length]} strokeWidth={2.4} connectNulls isAnimationActive animationDuration={700} />
                    ))}
                    {showBestFit && bestFitLine.length === 2 && (
                      <Line data={bestFitLine} dataKey="y" name="Best-fit" stroke="#f43f5e" strokeWidth={2.4} strokeDasharray="6 3" dot={false} isAnimationActive animationDuration={700} />
                    )}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Stats summary table */}
            {allChartData.some((s) => s.points.length > 0) && (
              <div className="panel p-3 overflow-x-auto">
                <span className="ui-label">Series statistics</span>
                <table className="notebook-table data-table mt-2 w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-500">
                      <th className="pb-1 pr-4">Series</th>
                      <th className="pb-1 pr-4">Points</th>
                      <th className="pb-1 pr-4">x̄</th>
                      <th className="pb-1 pr-4">ȳ</th>
                      <th className="pb-1 pr-4">x range</th>
                      <th className="pb-1">y range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allChartData.filter((s) => s.points.length > 0).map((s, si) => {
                      const xs = s.points.map((p) => p.x);
                      const ys = s.points.map((p) => p.y);
                      const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
                      return (
                        <tr key={s.id} className="data-row">
                          <td className="py-1 pr-4 font-semibold" style={{ color: COLORS[si % COLORS.length] }}>{s.label}</td>
                          <td className="py-1 pr-4 font-mono">{s.points.length}</td>
                          <td className="py-1 pr-4 font-mono">{mean(xs).toFixed(3)}</td>
                          <td className="py-1 pr-4 font-mono">{mean(ys).toFixed(3)}</td>
                          <td className="py-1 pr-4 font-mono">{Math.min(...xs).toFixed(2)} – {Math.max(...xs).toFixed(2)}</td>
                          <td className="py-1 font-mono">{Math.min(...ys).toFixed(2)} – {Math.max(...ys).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
