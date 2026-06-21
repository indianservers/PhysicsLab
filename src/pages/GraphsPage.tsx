import { useEffect, useMemo, useRef, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { Toolbar } from "../components/Toolbar";
import { useLabStore } from "../store/useLabStore";
import { PhysicsIcon } from "../lib/icons";
import { trackGraphPlot } from "../lib/achievements";
import { graphPresetCategories, graphPresets, type GraphPreset, type GraphPresetCategory } from "../lib/graphPresets";

interface DataRow {
  id: string;
  x: string;
  y: string;
}

interface Series {
  id: string;
  label: string;
  xLabel: string;
  yLabel: string;
  rows: DataRow[];
}

const COLORS = ["#22d3ee", "#f43f5e", "#a78bfa", "#34d399", "#fb923c", "#facc15", "#60a5fa", "#f59e0b"];

function makeId() { return Math.random().toString(36).slice(2); }
function emptyRow(): DataRow { return { id: makeId(), x: "", y: "" }; }

function makeSeries(label = "Series 1", xLabel = "x", yLabel = "y"): Series {
  return { id: makeId(), label, xLabel, yLabel, rows: [emptyRow(), emptyRow(), emptyRow()] };
}

function parsedPoints(rows: DataRow[]) {
  return rows
    .map((row) => ({ x: parseFloat(row.x), y: parseFloat(row.y) }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y))
    .sort((left, right) => left.x - right.x);
}

function sortedRows(rows: DataRow[]) {
  return [...rows].sort((left, right) => {
    const lx = parseFloat(left.x);
    const rx = parseFloat(right.x);
    if (!Number.isFinite(lx) && !Number.isFinite(rx)) return 0;
    if (!Number.isFinite(lx)) return 1;
    if (!Number.isFinite(rx)) return -1;
    return lx - rx;
  });
}

function linearRegression(points: { x: number; y: number }[]) {
  if (points.length < 2) return null;
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denominator = n * sumXX - sumX * sumX;
  if (Math.abs(denominator) < 1e-12) return null;
  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  const yMean = sumY / n;
  const ssTot = points.reduce((s, p) => s + (p.y - yMean) ** 2, 0);
  const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 1;
  return { slope, intercept, r2 };
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  if (Math.abs(value) >= 100000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) return value.toExponential(3);
  return Number(value.toFixed(4)).toString();
}

function presetToSeries(preset: GraphPreset): Series {
  return {
    id: makeId(),
    label: preset.label,
    xLabel: preset.xLabel,
    yLabel: preset.yLabel,
    rows: preset.rows.map((row) => ({ ...row, id: makeId() })),
  };
}

export function GraphsPage() {
  useEffect(() => { trackGraphPlot(); }, []);

  const [series, setSeries] = useState<Series[]>([presetToSeries(graphPresets[0])]);
  const [activeSid, setActiveSid] = useState<string>(series[0].id);
  const [chartType, setChartType] = useState<"scatter" | "line">("scatter");
  const [showBestFit, setShowBestFit] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [connectPoints, setConnectPoints] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [chartHeight, setChartHeight] = useState(460);
  const [axisMode, setAxisMode] = useState<"auto" | "zero" | "manual">("auto");
  const [manualAxis, setManualAxis] = useState({ xMin: "", xMax: "", yMin: "", yMax: "" });
  const [presetQuery, setPresetQuery] = useState("");
  const [presetCategory, setPresetCategory] = useState<"All" | GraphPresetCategory>("All");
  const [selectedPresetId, setSelectedPresetId] = useState(graphPresets[0]?.id ?? "");
  const fileRef = useRef<HTMLInputElement>(null);
  const labGraphData = useLabStore((state) => state.graphData);

  const activeSeries = series.find((s) => s.id === activeSid) ?? series[0];
  const selectedPreset = graphPresets.find((preset) => preset.id === selectedPresetId) ?? graphPresets[0];

  const filteredPresets = useMemo(() => {
    const q = presetQuery.trim().toLowerCase();
    return graphPresets.filter((preset) => {
      const categoryMatch = presetCategory === "All" || preset.category === presetCategory;
      const text = `${preset.label} ${preset.category} ${preset.xLabel} ${preset.yLabel} ${preset.relation} ${preset.note}`.toLowerCase();
      return categoryMatch && (!q || text.includes(q));
    });
  }, [presetCategory, presetQuery]);

  const updateSeries = (id: string, patch: Partial<Series>) => {
    setSeries((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const updateRow = (sid: string, rid: string, patch: Partial<DataRow>) => {
    setSeries((prev) => prev.map((s) => s.id === sid ? { ...s, rows: s.rows.map((row) => row.id === rid ? { ...row, ...patch } : row) } : s));
  };

  const addRow = (sid: string) => {
    setSeries((prev) => prev.map((s) => (s.id === sid ? { ...s, rows: [...s.rows, emptyRow()] } : s)));
  };

  const removeRow = (sid: string, rid: string) => {
    setSeries((prev) => prev.map((s) => (s.id === sid ? { ...s, rows: s.rows.filter((r) => r.id !== rid) } : s)));
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

  const applyPreset = (preset: GraphPreset) => {
    const next = presetToSeries(preset);
    setSeries((prev) => prev.map((s) => s.id === activeSid ? { ...next, id: s.id } : s));
    setSelectedPresetId(preset.id);
  };

  const addPresetAsSeries = (preset: GraphPreset) => {
    const next = presetToSeries(preset);
    setSeries((prev) => [...prev, next]);
    setActiveSid(next.id);
    setSelectedPresetId(preset.id);
  };

  const sortActiveRows = () => updateSeries(activeSid, { rows: sortedRows(activeSeries.rows) });
  const clearActiveRows = () => updateSeries(activeSid, { rows: [emptyRow(), emptyRow(), emptyRow()] });

  const importLabData = () => {
    if (labGraphData.length === 0) return;
    const s = makeSeries("Lab simulation data", "Time (s)", "KE (J)");
    s.rows = labGraphData
      .slice(0, 200)
      .filter((point) => Number.isFinite(point.kineticEnergy))
      .map((point) => ({ id: makeId(), x: String(point.t.toFixed(3)), y: String(Number(point.kineticEnergy).toFixed(3)) }));
    setSeries((prev) => [...prev, s]);
    setActiveSid(s.id);
  };

  const exportCsv = () => {
    const rows = ["series,x,y"];
    series.forEach((s) => parsedPoints(s.rows).forEach((p) => rows.push(`"${s.label}",${p.x},${p.y}`)));
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
    const lines = text.trim().split("\n").filter(Boolean);
    const body = lines[0]?.toLowerCase().includes("x") ? lines.slice(1) : lines;
    const imported = makeSeries(`Imported: ${file.name}`);
    imported.rows = body
      .map((line) => {
        const parts = line.split(",");
        const xPart = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
        const yPart = parts.length >= 2 ? parts[parts.length - 1] : parts[1];
        return { id: makeId(), x: xPart?.trim() ?? "", y: yPart?.trim() ?? "" };
      })
      .filter((r) => r.x && r.y);
    setSeries((prev) => [...prev, imported]);
    setActiveSid(imported.id);
  };

  const allChartData = useMemo(() => series.map((s) => ({ ...s, points: parsedPoints(s.rows) })), [series]);
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
  const rawXMin = allXs.length ? Math.min(...allXs) : 0;
  const rawXMax = allXs.length ? Math.max(...allXs) : 10;
  const rawYMin = allYs.length ? Math.min(...allYs) : 0;
  const rawYMax = allYs.length ? Math.max(...allYs) : 10;
  const xPad = (rawXMax - rawXMin) * 0.08 || 1;
  const yPad = (rawYMax - rawYMin) * 0.08 || 1;
  const manual = { xMin: parseFloat(manualAxis.xMin), xMax: parseFloat(manualAxis.xMax), yMin: parseFloat(manualAxis.yMin), yMax: parseFloat(manualAxis.yMax) };
  const xDomain: [number, number] = axisMode === "manual" && Number.isFinite(manual.xMin) && Number.isFinite(manual.xMax) && manual.xMin < manual.xMax ? [manual.xMin, manual.xMax] : axisMode === "zero" ? [Math.min(0, rawXMin - xPad), rawXMax + xPad] : [rawXMin - xPad, rawXMax + xPad];
  const yDomain: [number, number] = axisMode === "manual" && Number.isFinite(manual.yMin) && Number.isFinite(manual.yMax) && manual.yMin < manual.yMax ? [manual.yMin, manual.yMax] : axisMode === "zero" ? [Math.min(0, rawYMin - yPad), rawYMax + yPad] : [rawYMin - yPad, rawYMax + yPad];
  const activeInvalidRows = activeSeries.rows.length - parsedPoints(activeSeries.rows).length;

  return (
    <div className="min-h-screen">
      <Toolbar compact />
      <main id="content" className="desktop-page graph-studio-page">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="ui-label">Data analysis workspace</p>
            <h1 className="mt-1 text-3xl font-black text-gradient">Graph Studio</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Load 100+ verified physics presets, edit readings, compare series, fit a line, and export CSV evidence.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="tool-btn" onClick={importLabData} title="Import kinetic energy data from the current lab simulation"><PhysicsIcon name="flask" className="h-4 w-4" />Import from lab</button>
            <button className="tool-btn" onClick={() => fileRef.current?.click()}><PhysicsIcon name="upload" className="h-4 w-4" />Import CSV</button>
            <button className="tool-btn" onClick={exportCsv}><PhysicsIcon name="download" className="h-4 w-4" />Export CSV</button>
            <input ref={fileRef} className="hidden" type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} />
          </div>
        </div>

        <section className="panel mb-4 grid gap-3 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
          <div>
            <p className="ui-label">How to use this</p>
            <div className="mt-2 grid gap-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300 sm:grid-cols-2 xl:grid-cols-4">
              <div><strong className="text-slate-950 dark:text-white">1. Pick a preset</strong><br />Search by topic or formula, then load it into the active series.</div>
              <div><strong className="text-slate-950 dark:text-white">2. Read slope/shape</strong><br />Straight means proportional; curves show square, inverse, root, or exponential patterns.</div>
              <div><strong className="text-slate-950 dark:text-white">3. Edit readings</strong><br />Change rows or add another series to compare conditions.</div>
              <div><strong className="text-slate-950 dark:text-white">4. Export evidence</strong><br />Export CSV after units, graph, and fit look correct.</div>
            </div>
          </div>
          <div className="rounded-lg border border-cyan-300/20 bg-cyan-400/10 p-3">
            <p className="ui-label">Selected preset</p>
            <h2 className="mt-1 font-black text-slate-950 dark:text-white">{selectedPreset.label}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{selectedPreset.relation}</p>
            <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">{selectedPreset.note}</p>
          </div>
        </section>

        <div className="grid gap-5 xl:grid-cols-[410px_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <PresetBrowser
              filteredPresets={filteredPresets}
              selectedPreset={selectedPreset}
              selectedPresetId={selectedPresetId}
              presetQuery={presetQuery}
              presetCategory={presetCategory}
              setPresetQuery={setPresetQuery}
              setPresetCategory={setPresetCategory}
              setSelectedPresetId={setSelectedPresetId}
              applyPreset={applyPreset}
              addPresetAsSeries={addPresetAsSeries}
            />

            <div className="panel p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="ui-label">Data series</span>
                <button className="tool-btn" onClick={addSeries}><PhysicsIcon name="spark" className="h-4 w-4" />Add series</button>
              </div>
              <div className="flex flex-col gap-2">
                {series.map((s, si) => (
                  <div key={s.id} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 ${s.id === activeSid ? "border-cyan-400 bg-cyan-500/10" : "border-slate-300/60 dark:border-lab-line"}`} onClick={() => setActiveSid(s.id)}>
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: COLORS[si % COLORS.length] }} />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.label}</span>
                    <span className="text-xs text-slate-500">{parsedPoints(s.rows).length} pts</span>
                    {series.length > 1 && <button className="tool-btn ml-1 px-1 py-0.5 text-rose-400" onClick={(e) => { e.stopPropagation(); removeSeries(s.id); }}>x</button>}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-3">
              <div className="mb-3 grid gap-2">
                <EditLabel label="Series name" value={activeSeries.label} onChange={(value) => updateSeries(activeSid, { label: value })} />
                <EditLabel label="X axis label" value={activeSeries.xLabel} onChange={(value) => updateSeries(activeSid, { xLabel: value })} />
                <EditLabel label="Y axis label" value={activeSeries.yLabel} onChange={(value) => updateSeries(activeSid, { yLabel: value })} />
              </div>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="grid flex-1 grid-cols-[1fr_1fr_28px] gap-1 text-xs font-bold text-slate-500">
                  <span>{activeSeries.xLabel || "x"}</span>
                  <span>{activeSeries.yLabel || "y"}</span>
                  <span />
                </div>
                {activeInvalidRows > 0 && <span className="status-chip status-chip-amber">{activeInvalidRows} ignored</span>}
              </div>
              <div className="max-h-64 overflow-y-auto pr-1">
                {activeSeries.rows.map((row) => (
                  <div key={row.id} className="mb-1 grid grid-cols-[1fr_1fr_28px] gap-1">
                    <input value={row.x} onChange={(e) => updateRow(activeSid, row.id, { x: e.target.value })} className="rounded border border-slate-300/60 bg-slate-100 px-2 py-1 text-sm dark:border-lab-line dark:bg-slate-800" placeholder="0" />
                    <input value={row.y} onChange={(e) => updateRow(activeSid, row.id, { y: e.target.value })} className="rounded border border-slate-300/60 bg-slate-100 px-2 py-1 text-sm dark:border-lab-line dark:bg-slate-800" placeholder="0" />
                    <button className="tool-btn px-1 py-0.5 text-rose-400" onClick={() => removeRow(activeSid, row.id)}>x</button>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <button className="tool-btn w-full" onClick={() => addRow(activeSid)}>+ Add row</button>
                <button className="tool-btn w-full" onClick={sortActiveRows}>Sort x</button>
                <button className="tool-btn w-full text-rose-400" onClick={clearActiveRows}>Clear</button>
              </div>
            </div>

            {regression && activePoints.length >= 2 && (
              <div className="panel p-3">
                <span className="ui-label">Best-fit line</span>
                <div className="mt-2 font-mono text-sm">
                  <div>y = {regression.slope.toFixed(4)}x {regression.intercept >= 0 ? "+" : "-"} {Math.abs(regression.intercept).toFixed(4)}</div>
                  <div className="mt-1 text-slate-500">R^2 = {regression.r2.toFixed(5)}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <div className="panel p-3">
              <GraphControls
                chartType={chartType}
                setChartType={setChartType}
                showBestFit={showBestFit}
                setShowBestFit={setShowBestFit}
                showGrid={showGrid}
                setShowGrid={setShowGrid}
                showLegend={showLegend}
                setShowLegend={setShowLegend}
                connectPoints={connectPoints}
                setConnectPoints={setConnectPoints}
                showStats={showStats}
                setShowStats={setShowStats}
                axisMode={axisMode}
                setAxisMode={setAxisMode}
                manualAxis={manualAxis}
                setManualAxis={setManualAxis}
                chartHeight={chartHeight}
                setChartHeight={setChartHeight}
              />

              <ResponsiveContainer width="100%" height={chartHeight}>
                {chartType === "scatter" ? (
                  <ScatterChart margin={{ top: 10, right: 24, bottom: 24, left: 10 }}>
                    {showGrid && <CartesianGrid stroke="rgba(148,163,184,0.22)" strokeDasharray="3 3" />}
                    <XAxis dataKey="x" type="number" name={activeSeries.xLabel} domain={xDomain} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.xLabel, position: "insideBottom", offset: -14, fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis dataKey="y" type="number" name={activeSeries.yLabel} domain={yDomain} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.yLabel, angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "rgba(5,12,24,0.94)", border: "1px solid rgba(0,229,255,0.28)", color: "#e2e8f0", borderRadius: 10, fontSize: 12 }} />
                    {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
                    {allChartData.map((s, si) => <Scatter key={s.id} name={s.label} data={s.points} line={connectPoints ? { stroke: COLORS[si % COLORS.length], strokeWidth: 1.6 } : false} fill={COLORS[si % COLORS.length]} opacity={0.9} isAnimationActive animationDuration={500} />)}
                    {showBestFit && bestFitLine.length === 2 && <Scatter name="Best-fit" data={bestFitLine} line={{ stroke: "#f43f5e", strokeWidth: 2, strokeDasharray: "6 3" }} shape={() => null as unknown as React.ReactElement} fill="transparent" legendType="line" />}
                  </ScatterChart>
                ) : (
                  <LineChart margin={{ top: 10, right: 24, bottom: 24, left: 10 }}>
                    {showGrid && <CartesianGrid stroke="rgba(148,163,184,0.22)" strokeDasharray="3 3" />}
                    <XAxis dataKey="x" type="number" domain={xDomain} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.xLabel, position: "insideBottom", offset: -14, fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis domain={yDomain} tick={{ fontSize: 11, fill: "#94a3b8" }} label={{ value: activeSeries.yLabel, angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "rgba(5,12,24,0.94)", border: "1px solid rgba(0,229,255,0.28)", color: "#e2e8f0", borderRadius: 10, fontSize: 12 }} />
                    {showLegend && <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />}
                    {allChartData.map((s, si) => <Line key={s.id} data={s.points} dataKey="y" name={s.label} dot={{ r: 4 }} stroke={COLORS[si % COLORS.length]} strokeWidth={connectPoints ? 2.4 : 0} connectNulls isAnimationActive animationDuration={500} />)}
                    {showBestFit && bestFitLine.length === 2 && <Line data={bestFitLine} dataKey="y" name="Best-fit" stroke="#f43f5e" strokeWidth={2.4} strokeDasharray="6 3" dot={false} isAnimationActive animationDuration={500} />}
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="panel p-3">
                <span className="ui-label">Active relationship</span>
                <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{activeSeries.label}</h2>
                <p className="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">{activePoints.length} valid points. X range {formatNumber(rawXMin)} to {formatNumber(rawXMax)}; Y range {formatNumber(rawYMin)} to {formatNumber(rawYMax)}.</p>
              </div>
              <div className="panel p-3">
                <span className="ui-label">Graph reading cue</span>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">Use slope for rate or proportionality, area for accumulated quantity, curvature for squared/inverse/exponential relations, and intercept for starting value or threshold.</p>
              </div>
            </div>

            {showStats && allChartData.some((s) => s.points.length > 0) && <StatsTable data={allChartData} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function PresetBrowser({
  filteredPresets,
  selectedPreset,
  selectedPresetId,
  presetQuery,
  presetCategory,
  setPresetQuery,
  setPresetCategory,
  setSelectedPresetId,
  applyPreset,
  addPresetAsSeries,
}: {
  filteredPresets: GraphPreset[];
  selectedPreset: GraphPreset;
  selectedPresetId: string;
  presetQuery: string;
  presetCategory: "All" | GraphPresetCategory;
  setPresetQuery: (value: string) => void;
  setPresetCategory: (value: "All" | GraphPresetCategory) => void;
  setSelectedPresetId: (value: string) => void;
  applyPreset: (preset: GraphPreset) => void;
  addPresetAsSeries: (preset: GraphPreset) => void;
}) {
  return (
    <div className="panel p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="ui-label">Verified physics presets</span>
          <div className="mt-1 text-sm font-black text-cyan-500">{filteredPresets.length} / {graphPresets.length} shown</div>
        </div>
        <button className="tool-btn-primary inline-flex items-center gap-2" onClick={() => applyPreset(selectedPreset)}><PhysicsIcon name="play" className="h-4 w-4" />Load selected</button>
      </div>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_150px]">
        <label className="grid gap-1">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Search preset</span>
          <input value={presetQuery} onChange={(event) => setPresetQuery(event.target.value)} className="rounded-md border border-slate-300/60 bg-slate-100 px-3 py-2 text-sm font-semibold dark:border-lab-line dark:bg-slate-800" placeholder="Ohm, projectile, decay..." />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Category</span>
          <select value={presetCategory} onChange={(event) => setPresetCategory(event.target.value as "All" | GraphPresetCategory)} className="rounded-md border border-slate-300/60 bg-slate-100 px-3 py-2 text-sm font-semibold dark:border-lab-line dark:bg-slate-800">
            {graphPresetCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-3 max-h-72 overflow-y-auto pr-1">
        <div className="grid gap-2">
          {filteredPresets.map((preset) => (
            <button key={preset.id} type="button" className={selectedPresetId === preset.id ? "graph-preset-card graph-preset-card-active" : "graph-preset-card"} onClick={() => setSelectedPresetId(preset.id)}>
              <span>{preset.category}</span>
              <strong>{preset.label}</strong>
              <small>{preset.relation}</small>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <button className="tool-btn w-full" onClick={() => applyPreset(selectedPreset)}>Replace active series</button>
        <button className="tool-btn w-full" onClick={() => addPresetAsSeries(selectedPreset)}>Add as new series</button>
      </div>
    </div>
  );
}

function GraphControls(props: {
  chartType: "scatter" | "line";
  setChartType: (value: "scatter" | "line") => void;
  showBestFit: boolean;
  setShowBestFit: (value: boolean) => void;
  showGrid: boolean;
  setShowGrid: (value: boolean) => void;
  showLegend: boolean;
  setShowLegend: (value: boolean) => void;
  connectPoints: boolean;
  setConnectPoints: (value: boolean) => void;
  showStats: boolean;
  setShowStats: (value: boolean) => void;
  axisMode: "auto" | "zero" | "manual";
  setAxisMode: (value: "auto" | "zero" | "manual") => void;
  manualAxis: { xMin: string; xMax: string; yMin: string; yMax: string };
  setManualAxis: (value: { xMin: string; xMax: string; yMin: string; yMax: string }) => void;
  chartHeight: number;
  setChartHeight: (value: number) => void;
}) {
  return (
    <div className="mb-4 grid gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-md border border-slate-300/60 p-0.5 dark:border-lab-line">
          {(["scatter", "line"] as const).map((type) => <button key={type} className={`rounded px-3 py-1 text-sm font-semibold capitalize transition-colors ${props.chartType === type ? "bg-cyan-500 text-slate-950" : "text-slate-500 hover:text-slate-200"}`} onClick={() => props.setChartType(type)}>{type}</button>)}
        </div>
        <Toggle label="Best-fit" checked={props.showBestFit} onChange={props.setShowBestFit} />
        <Toggle label="Grid" checked={props.showGrid} onChange={props.setShowGrid} />
        <Toggle label="Legend" checked={props.showLegend} onChange={props.setShowLegend} />
        <Toggle label="Connect points" checked={props.connectPoints} onChange={props.setConnectPoints} />
        <Toggle label="Stats" checked={props.showStats} onChange={props.setShowStats} />
      </div>
      <div className="graph-control-grid">
        <label>
          <span>Axis mode</span>
          <select value={props.axisMode} onChange={(event) => props.setAxisMode(event.target.value as "auto" | "zero" | "manual")}>
            <option value="auto">Auto padded</option>
            <option value="zero">Include zero</option>
            <option value="manual">Manual</option>
          </select>
        </label>
        <label>
          <span>Chart height</span>
          <input type="range" min="320" max="720" step="20" value={props.chartHeight} onChange={(event) => props.setChartHeight(Number(event.target.value))} />
          <b>{props.chartHeight}px</b>
        </label>
        {(["xMin", "xMax", "yMin", "yMax"] as const).map((key) => (
          <label key={key}>
            <span>{key}</span>
            <input value={props.manualAxis[key]} disabled={props.axisMode !== "manual"} onChange={(event) => props.setManualAxis({ ...props.manualAxis, [key]: event.target.value })} placeholder={key.includes("Min") ? "min" : "max"} />
          </label>
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
}

function EditLabel({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="property-row">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="w-40 rounded bg-slate-100 px-2 py-1 text-sm dark:bg-slate-800" />
    </label>
  );
}

function StatsTable({ data }: { data: Array<Series & { points: { x: number; y: number }[] }> }) {
  return (
    <div className="panel overflow-x-auto p-3">
      <span className="ui-label">Series statistics</span>
      <table className="notebook-table data-table mt-2 w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500">
            <th className="pb-1 pr-4">Series</th>
            <th className="pb-1 pr-4">Points</th>
            <th className="pb-1 pr-4">x mean</th>
            <th className="pb-1 pr-4">y mean</th>
            <th className="pb-1 pr-4">x range</th>
            <th className="pb-1">y range</th>
          </tr>
        </thead>
        <tbody>
          {data.filter((s) => s.points.length > 0).map((s, si) => {
            const xs = s.points.map((p) => p.x);
            const ys = s.points.map((p) => p.y);
            const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
            return (
              <tr key={s.id} className="data-row">
                <td className="py-1 pr-4 font-semibold" style={{ color: COLORS[si % COLORS.length] }}>{s.label}</td>
                <td className="py-1 pr-4 font-mono">{s.points.length}</td>
                <td className="py-1 pr-4 font-mono">{formatNumber(mean(xs))}</td>
                <td className="py-1 pr-4 font-mono">{formatNumber(mean(ys))}</td>
                <td className="py-1 pr-4 font-mono">{formatNumber(Math.min(...xs))} - {formatNumber(Math.max(...xs))}</td>
                <td className="py-1 font-mono">{formatNumber(Math.min(...ys))} - {formatNumber(Math.max(...ys))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
