import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CartesianGrid, ErrorBar, Legend, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fft } from "../lib/fft";
import { coreFormulae, evaluateFormula, renderFormula } from "../lib/formulas";
import { formatValue, percentageError, validateUnit } from "../lib/units";
import { useLabStore } from "../store/useLabStore";
import { GraphPoint, GraphVariable } from "../types";
import { sendStatement } from "../lib/xapi";

const tabs = ["Graphs", "Data table", "Formula", "Instruments", "Errors", "Steps", "Questions", "Lab report", "Log"];
const graphVariables: GraphVariable[] = ["t", "x", "y", "vx", "vy", "speed", "acceleration", "force", "momentum", "kineticEnergy", "potentialEnergy", "totalEnergy", "pressure", "volume", "temperature", "voltage", "current", "intensity", "angle", "wavelength", "frequency"];

export function BottomPanel() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Graphs");
  const [domain, setDomain] = useState<"time" | "frequency">("time");
  const graphRef = useRef<HTMLDivElement>(null);
  const state = useLabStore();
  const graphData = state.graphData.map((point) => ({ ...point, error: Object.fromEntries(state.graphTraces.map((trace) => [trace.yKey, Math.abs(Number(point[trace.yKey] ?? 0)) * ((trace.errorPercent ?? 0) / 100)])) }));
  const selected = state.objects.find((object) => object.id === state.selectedId);
  const activePanel = state.running || state.graphSplit ? "Graphs" : selected ? "Data table" : "Overview";
  const enabledTraces = state.graphTraces.filter((trace) => trace.enabled);
  const activeTrace = enabledTraces[0];
  const cursor = graphData[Math.min(state.cursorIndex, Math.max(0, graphData.length - 1))];
  const stats = useMemo(() => activeTrace ? calculateStats(graphData, activeTrace.xKey, activeTrace.yKey) : undefined, [graphData, activeTrace]);
  const frequencyAnalysis = useMemo(() => activeTrace ? analyzeFrequency(state.graphData, activeTrace.yKey) : undefined, [state.graphData, activeTrace]);

  const csv = () => {
    const header = graphVariables.join(",");
    const rows = state.graphData.map((point) => graphVariables.map((key) => point[key] ?? "").join(","));
    download(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }), "physicslab-data.csv");
    sendStatement("interacted", "/graphs/export-csv");
  };

  const json = () => {
    download(new Blob([JSON.stringify(state.graphData, null, 2)], { type: "application/json" }), "physicslab-data.json");
    sendStatement("interacted", "/graphs/export-json");
  };

  const graphPng = async () => {
    const svg = graphRef.current?.querySelector("svg");
    if (!svg) return;
    const text = new XMLSerializer().serializeToString(svg);
    const image = new Image();
    const url = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 420;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob && download(blob, "physicslab-graph.png"));
      sendStatement("interacted", "/graphs/export-png");
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  return (
    <section className="panel min-h-0 p-3">
      <div className="mb-3 flex items-center gap-2 overflow-x-auto">
        <div>
          <div className="ui-label">{state.running ? "Live simulation" : selected ? "Paused data" : "Ready"}</div>
          <h2 className="ui-title">{activePanel === "Graphs" ? "Live Graph" : activePanel === "Data table" ? "Data + Export" : "Experiment Guide"}</h2>
        </div>
        {activePanel === "Graphs" && <button className={state.graphSplit ? "tab-active ml-auto" : "tab-btn ml-auto"} onClick={() => state.setGraphSplit(!state.graphSplit)}>{state.graphSplit ? "Dock graph" : "Split view"}</button>}
        <button className="tool-btn ml-auto" onClick={csv}>{t("bottom.csv")}</button>
        <button className="tool-btn" onClick={json}>{t("bottom.json")}</button>
      </div>
      {activePanel === "Graphs" && (
        <div className={state.graphSplit ? "grid h-full gap-3 lg:grid-cols-1" : "grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_220px]"}>
          <div className="space-y-2 text-xs">
            <button className="tool-btn w-full" onClick={() => state.setGraphPaused(!state.graphPaused)}>{state.graphPaused ? "Resume graph" : "Pause graph"}</button>
            <button className="tool-btn w-full" onClick={graphPng}>Export graph PNG</button>
            <button className="tool-btn w-full" onClick={() => state.addGraphTrace("t", "momentum")}>Add trace</button>
            <div className="grid grid-cols-2 rounded border border-slate-300/60 p-1 dark:border-lab-line">
              <button className={domain === "time" ? "tab-active" : "tab-btn"} onClick={() => setDomain("time")}>Time Domain</button>
              <button className={domain === "frequency" ? "tab-active" : "tab-btn"} onClick={() => setDomain("frequency")}>Frequency Domain</button>
            </div>
            {state.graphTraces.map((trace) => (
              <div key={trace.id} className="rounded border border-slate-300/60 p-2 dark:border-lab-line">
                <label className="flex items-center gap-2"><input type="checkbox" checked={trace.enabled} onChange={(event) => state.setGraphTrace(trace.id, { enabled: event.target.checked })} /> {trace.label}</label>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <Select value={trace.xKey} onChange={(xKey) => state.setGraphTrace(trace.id, { xKey, label: `${String(trace.yKey)} vs ${String(xKey)}` })} />
                  <Select value={trace.yKey} onChange={(yKey) => state.setGraphTrace(trace.id, { yKey, label: `${String(yKey)} vs ${String(trace.xKey)}` })} />
                </div>
                <label className="mt-2 flex items-center justify-between gap-2">Error %
                  <input className="w-16 rounded bg-slate-100 px-1 dark:bg-slate-800" type="number" value={trace.errorPercent ?? 0} onChange={(event) => state.setGraphTrace(trace.id, { errorPercent: Number(event.target.value) })} />
                </label>
              </div>
            ))}
          </div>
          <div ref={graphRef} className={state.graphSplit ? "h-[calc(100vh-190px)] min-w-0" : "h-56 min-w-0"}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={domain === "frequency" ? frequencyAnalysis?.data ?? [] : graphData}>
                <CartesianGrid stroke="rgba(148,163,184,0.18)" />
                <XAxis dataKey={domain === "frequency" ? "frequency" : activeTrace?.xKey ?? "t"} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.25)", color: "#e2e8f0" }} />
                <Legend />
                {domain === "time" && enabledTraces.map((trace) => (
                    <Line key={trace.id} type="monotone" dataKey={trace.yKey} stroke={trace.color} dot={false} name={trace.label}>
                      {(trace.errorPercent ?? 0) > 0 && <ErrorBar dataKey={`error.${String(trace.yKey)}`} width={4} stroke={trace.color} />}
                    </Line>
                  ))}
                {domain === "frequency" && <Line type="monotone" dataKey="magnitude" stroke={activeTrace?.color ?? "#22d3ee"} dot={false} name="Magnitude" />}
                {domain === "frequency" && frequencyAnalysis?.dominant && <ReferenceLine x={frequencyAnalysis.dominant.frequency} stroke="#facc15" strokeDasharray="4 4" label={`f = ${frequencyAnalysis.dominant.frequency.toFixed(2)} Hz`} />}
                {domain === "time" && cursor && activeTrace && <ReferenceDot x={cursor[activeTrace.xKey] as number} y={cursor[activeTrace.yKey] as number} r={5} fill="#facc15" stroke="none" />}
              </LineChart>
            </ResponsiveContainer>
            {domain === "frequency" && (
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Peak Frequencies: {frequencyAnalysis?.peaks.length ? frequencyAnalysis.peaks.map((peak) => `${peak.frequency.toFixed(2)} Hz (${peak.magnitude.toFixed(3)})`).join(", ") : "-"}
              </div>
            )}
          </div>
          <div className="space-y-2 text-xs">
            <label className="block">Cursor
              <input className="w-full accent-cyan-400" type="range" min={0} max={Math.max(0, graphData.length - 1)} value={Math.min(state.cursorIndex, Math.max(0, graphData.length - 1))} onChange={(event) => state.setCursorIndex(Number(event.target.value))} />
            </label>
            <Metric label="Cursor x" value={activeTrace && cursor ? formatValue(Number(cursor[activeTrace.xKey] ?? 0), "", state.unitSystem, state.significantFigures) : "-"} />
            <Metric label="Cursor y" value={activeTrace && cursor ? formatValue(Number(cursor[activeTrace.yKey] ?? 0), "", state.unitSystem, state.significantFigures) : "-"} />
            <Metric label="Slope" value={stats ? formatValue(stats.slope) : "-"} />
            <Metric label="Area" value={stats ? formatValue(stats.area) : "-"} />
            <Metric label="Best fit" value={stats ? `y=${stats.slope.toFixed(3)}x+${stats.intercept.toFixed(3)}` : "-"} />
            <Metric label="Quadratic fit" value={stats ? `a=${stats.quadraticA.toExponential(2)}` : "-"} />
          </div>
        </div>
      )}
      {activePanel === "Data table" && <ObservationTable />}
      {activePanel === "Overview" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Info title="Experiment Steps" body="Add an object, run the simulation, watch the live graph, then pause to inspect and export data." />
          <FormulaPanel />
        </div>
      )}
    </section>
  );
}

function analyzeFrequency(data: GraphPoint[], yKey: GraphVariable) {
  const usable = data.map((point) => ({ t: Number(point.t), y: Number(point[yKey]) })).filter((point) => Number.isFinite(point.t) && Number.isFinite(point.y));
  const count = Math.min(4096, Math.max(512, usable.length));
  const samples = usable.slice(-count);
  if (samples.length < 2) return { data: [], peaks: [], dominant: undefined };
  const elapsed = samples[samples.length - 1].t - samples[0].t;
  const sampleRate = elapsed > 0 ? samples.length / elapsed : 1;
  const mean = average(samples.map((sample) => sample.y));
  const spectrum = fft(Float64Array.from(samples.map((sample) => sample.y - mean)));
  const dataPoints = Array.from(spectrum.magnitudes).map((magnitude, index) => ({
    frequency: (spectrum.frequencies[index] * sampleRate) / (spectrum.magnitudes.length * 2),
    magnitude,
  })).slice(1);
  const peaks = dataPoints
    .filter((point, index, arr) => point.magnitude >= (arr[index - 1]?.magnitude ?? 0) && point.magnitude >= (arr[index + 1]?.magnitude ?? 0))
    .sort((a, b) => b.magnitude - a.magnitude)
    .slice(0, 3);
  return { data: dataPoints, peaks, dominant: peaks[0] };
}

function ObservationTable() {
  const state = useLabStore();
  const rows = state.observationRows.length ? state.observationRows : state.graphData.slice(-6).map((point, index) => ({
    id: `auto-${point.t}-${index}`,
    label: `Auto ${index + 1}`,
    measured: point.y,
    expected: point.x,
    unit: "m",
    note: "auto-filled",
  }));
  const values = rows.map((row) => row.measured);
  const avg = average(values);
  const std = standardDeviation(values);
  return (
    <div className="min-h-0 overflow-auto">
      <div className="mb-2 flex gap-2">
        <button className="tool-btn" onClick={state.addObservationRow}>Add manual row</button>
        <button className="tool-btn" onClick={state.resetGraph}>Reset data</button>
        <label className="toolbar-field flex">Units
          <select value={state.unitSystem} onChange={(event) => state.setUnitSystem(event.target.value as "SI" | "CGS")} className="rounded bg-slate-100 dark:bg-slate-800">
            <option>SI</option>
            <option>CGS</option>
          </select>
        </label>
        <label className="toolbar-field flex">Sig figs
          <input className="w-12 rounded bg-slate-100 dark:bg-slate-800" type="number" value={state.significantFigures} onChange={(event) => state.setSignificantFigures(Number(event.target.value))} />
        </label>
      </div>
      <table className="w-full text-left text-xs">
        <thead className="text-slate-400">
          <tr><th>Label</th><th>Measured</th><th>Expected</th><th>Error %</th><th>Unit</th><th>Note</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-300/40 dark:border-lab-line">
              <td><Editable value={row.label} onChange={(value) => !row.id.startsWith("auto-") && state.updateObservationRow(row.id, { label: value })} /></td>
              <td><NumberEdit value={row.measured} onChange={(value) => !row.id.startsWith("auto-") && state.updateObservationRow(row.id, { measured: value })} /></td>
              <td><NumberEdit value={row.expected} onChange={(value) => !row.id.startsWith("auto-") && state.updateObservationRow(row.id, { expected: value })} /></td>
              <td>{Number.isFinite(percentageError(row.measured, row.expected)) ? percentageError(row.measured, row.expected).toFixed(2) : "-"}</td>
              <td><Editable value={row.unit} onChange={(value) => !row.id.startsWith("auto-") && state.updateObservationRow(row.id, { unit: value })} /></td>
              <td>{validateUnit(row.measured, row.unit) || row.note}</td>
              <td>{!row.id.startsWith("auto-") && <button className="text-rose-400" onClick={() => state.removeObservationRow(row.id)}>Delete</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 grid gap-2 text-xs md:grid-cols-3">
        <Metric label="Average" value={formatValue(avg, rows[0]?.unit ?? "", state.unitSystem, state.significantFigures)} />
        <Metric label="Std. deviation" value={formatValue(std, rows[0]?.unit ?? "", state.unitSystem, state.significantFigures)} />
        <Metric label="Rows" value={String(rows.length)} />
      </div>
    </div>
  );
}

function FormulaPanel() {
  const selected = useLabStore((state) => state.objects.find((object) => object.id === state.selectedId));
  const state = useLabStore();
  const values = {
    u: selected ? Math.hypot(selected.vx, selected.vy) : 20,
    theta: selected ? (selected.angle * 180) / Math.PI : 45,
    g: state.gravity,
    m: selected?.mass ?? 1,
    a: state.gravity,
    I: Math.abs(selected?.charge ?? 2) * 0.5,
    R: 10,
    k: selected?.springConstant ?? 10,
    x: 0.2,
    n: 1,
    T: selected?.temperature ?? 300,
    V: 1,
  };
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {coreFormulae.map((formula) => {
        const evaluation = evaluateFormula(formula.id, values);
        return (
          <div key={formula.id} className="rounded border border-slate-300/60 p-3 text-sm dark:border-lab-line">
            <div className="font-semibold text-cyan-500">{formula.name}</div>
            <div className="mt-2 text-lg" dangerouslySetInnerHTML={{ __html: renderFormula(formula.expression) }} />
            <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formula.variables.map((variable) => `${variable.symbol}: ${variable.name} (${variable.unit})`).join(", ")}</div>
            {evaluation && <div className="mt-2 font-mono text-xs">{evaluation.substituted} = {formatValue(evaluation.value, evaluation.unit, state.unitSystem, state.significantFigures)}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Warnings({ selected }: { selected?: { mass: number; x: number; y: number } }) {
  const { t } = useTranslation();
  const graphData = useLabStore((state) => state.graphData);
  const engineWarnings = useLabStore((state) => state.engineWarnings);
  return (
    <div className="rounded border border-slate-300/60 p-3 text-xs dark:border-lab-line">
      <div className="font-semibold text-cyan-500">{t("bottom.warnings")}</div>
      {!selected && <p>{t("bottom.noSelection")}</p>}
      {selected && selected.mass <= 0 && <p>{t("bottom.badMass")}</p>}
      {selected && (selected.x < -100 || selected.x > 2000 || selected.y < -100 || selected.y > 2000) && <p>{t("bottom.outside")}</p>}
      {graphData.length === 0 && <p>{t("bottom.noData")}</p>}
      {engineWarnings.map((warning) => <p key={warning}>{warning}</p>)}
    </div>
  );
}

function tabKey(item: string) {
  const map: Record<string, string> = {
    Graphs: "bottom.graphs",
    "Data table": "bottom.dataTable",
    Formula: "bottom.formula",
    Instruments: "bottom.instruments",
    Errors: "bottom.errors",
    Steps: "bottom.steps",
    Questions: "bottom.questions",
    "Lab report": "bottom.labReport",
    Log: "bottom.log",
  };
  return map[item] ?? item;
}

function Select({ value, onChange }: { value: GraphVariable; onChange: (value: GraphVariable) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as GraphVariable)} className="rounded bg-slate-100 px-1 py-1 dark:bg-slate-800">
      {graphVariables.map((variable) => <option key={variable} value={variable}>{variable}</option>)}
    </select>
  );
}

function Editable({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <input className="w-full rounded bg-transparent px-1" value={value} onChange={(event) => onChange(event.target.value)} />;
}

function NumberEdit({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <input className="w-24 rounded bg-transparent px-1 font-mono" type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-300/60 bg-slate-100 p-2 dark:border-lab-line dark:bg-slate-900/70">
      <div className="text-slate-500 dark:text-slate-400">{label}</div>
      <div className="font-mono text-cyan-500">{value}</div>
    </div>
  );
}

function Info({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded border border-slate-300/60 p-4 text-sm dark:border-lab-line">
      <h2 className="panel-title">{title}</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-300">{body}</p>
    </div>
  );
}

function calculateStats(data: GraphPoint[], xKey: GraphVariable, yKey: GraphVariable) {
  const points = data.map((point) => ({ x: Number(point[xKey]), y: Number(point[yKey]) })).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (points.length < 2) return undefined;
  const xAvg = average(points.map((point) => point.x));
  const yAvg = average(points.map((point) => point.y));
  const numerator = points.reduce((sum, point) => sum + (point.x - xAvg) * (point.y - yAvg), 0);
  const denominator = points.reduce((sum, point) => sum + (point.x - xAvg) ** 2, 0) || 1;
  const slope = numerator / denominator;
  const intercept = yAvg - slope * xAvg;
  const area = points.slice(1).reduce((sum, point, index) => sum + ((point.x - points[index].x) * (point.y + points[index].y)) / 2, 0);
  const quadraticA = quadraticCoefficient(points);
  return { slope, intercept, area, quadraticA };
}

function quadraticCoefficient(points: { x: number; y: number }[]) {
  const first = points[0];
  const mid = points[Math.floor(points.length / 2)];
  const last = points[points.length - 1];
  const denominator = (first.x - mid.x) * (first.x - last.x) * (mid.x - last.x);
  if (!denominator) return 0;
  return (last.x * (mid.y - first.y) + mid.x * (first.y - last.y) + first.x * (last.y - mid.y)) / denominator;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function standardDeviation(values: number[]) {
  const avg = average(values);
  return values.length ? Math.sqrt(average(values.map((value) => (value - avg) ** 2))) : 0;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
