import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLabStore } from "../store/useLabStore";
import { useState } from "react";

const tabs = ["Graphs", "Data table", "Formula", "Instruments", "Errors", "Steps", "Questions", "Lab report", "Log"];

export function BottomPanel() {
  const [tab, setTab] = useState("Graphs");
  const graphData = useLabStore((state) => state.graphData);
  const selected = useLabStore((state) => state.objects.find((object) => object.id === state.selectedId));
  const csv = () => {
    const header = "t,x,y,vx,vy,speed,kineticEnergy,potentialEnergy";
    const rows = graphData.map((point) => [point.t, point.x, point.y, point.vx, point.vy, point.speed, point.kineticEnergy, point.potentialEnergy].join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "physicslab-data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="panel min-h-0 p-3">
      <div className="mb-3 flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button key={item} className={item === tab ? "tab-active" : "tab-btn"} onClick={() => setTab(item)}>
            {item}
          </button>
        ))}
        <button className="tool-btn ml-auto" onClick={csv}>Export CSV</button>
      </div>
      {tab === "Graphs" && (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={graphData}>
              <CartesianGrid stroke="rgba(148,163,184,0.18)" />
              <XAxis dataKey="t" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(148,163,184,0.25)", color: "#e2e8f0" }} />
              <Legend />
              <Line type="monotone" dataKey="x" stroke="#22d3ee" dot={false} name="x vs t" />
              <Line type="monotone" dataKey="y" stroke="#34d399" dot={false} name="y vs t" />
              <Line type="monotone" dataKey="speed" stroke="#fb923c" dot={false} name="speed" />
              <Line type="monotone" dataKey="kineticEnergy" stroke="#34d399" dot={false} name="KE" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {tab === "Data table" && (
        <div className="min-h-0 overflow-auto">
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-slate-400">
            <tr><th>t</th><th>x</th><th>y</th><th>vx</th><th>vy</th></tr>
          </thead>
          <tbody>
            {graphData.slice(-8).reverse().map((point) => (
              <tr key={`${point.t}-${point.x}`} className="border-t border-slate-300/40 dark:border-lab-line">
                <td>{point.t.toFixed(2)}</td>
                <td>{point.x.toFixed(2)}</td>
                <td>{point.y.toFixed(2)}</td>
                <td>{point.vx.toFixed(2)}</td>
                <td>{point.vy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {tab === "Formula" && <Info title="Formula" body="Kinematics: v = u + at, s = ut + 1/2 at^2. Energy: KE = 1/2 mv^2, PE = mgh. Momentum: p = mv." />}
      {tab === "Instruments" && <Info title="Instruments" body="Stopwatch, ruler, protractor, motion sensor, force sensor, graph plotter, thermometer, charge and field probes are available in the object library." />}
      {tab === "Errors" && (
        <div className="rounded border border-slate-300/60 p-3 text-xs dark:border-lab-line">
          <div className="font-semibold text-cyan-500">Warnings</div>
          {!selected && <p>No object selected for property inspection.</p>}
          {selected && selected.mass <= 0 && <p>Object has zero or negative mass.</p>}
          {selected && (selected.x < -100 || selected.x > 2000 || selected.y < -100 || selected.y > 2000) && <p>Selected object is outside the visible area.</p>}
          {graphData.length === 0 && <p>No data recorded yet.</p>}
        </div>
      )}
      {tab === "Steps" && <Info title="Experiment Steps" body="Choose a guided experiment, adjust variables, run or pause the simulation, record observations, inspect graphs, and export the lab report." />}
      {tab === "Questions" && <Info title="Questions" body="Viva and graph interpretation prompts are shown on experiment pages. Teacher and exam modes can reuse this panel architecture." />}
      {tab === "Lab report" && <Info title="Lab Report" body="Report sections: student name, aim, apparatus, theory, formulas, procedure, observations, graphs, calculations, result, precautions, viva, and teacher remarks." />}
      {tab === "Log" && <Info title="Simulation Log" body={`Samples recorded: ${graphData.length}. Selected object: ${selected?.name ?? "none"}.`} />}
    </section>
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
