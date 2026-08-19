import { KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { flowDefinitions, purposeGroups, rocketPartById, rocketParts, rocketSystems, systemCounts, type BuildConfiguration, type RocketPart } from "../../data/rocketParts";

export const SYSTEM_MARKS: Record<string, string> = {
  "Complete Rocket": "LV", "Payload System": "PL", "Structural System": "ST", "Aerodynamic Control": "AC", "Propulsion System": "PR",
  "Propellant Storage & Feed": "PF", Avionics: "AV", "Guidance, Navigation & Control": "GN", "Electrical Power": "EP",
  "Communications & Telemetry": "TM", "Flight Safety": "FS", "Stage Separation": "SS", "Thermal Protection": "TP",
  "Recovery System": "RC", "Ground Interface": "GI",
};

export function RocketProgramNav() {
  return <nav className="rp-program-nav" aria-label="Rocket Building Lab">
    <Link to="/pro-lab">Dashboard</Link><Link to="/pro-lab/launch-vehicle">Build Lab</Link><Link className="active" to="/rocket-lab/parts">Rocket Parts</Link>
    <span aria-disabled="true">Mission Planner</span><span aria-disabled="true">Launch & Ascent</span><span aria-disabled="true">Data Analysis</span>
  </nav>;
}

export function PartsHero({ onExplore, onCutaway, activeSystem, setActiveSystem }: { onExplore: () => void; onCutaway: () => void; activeSystem: string; setActiveSystem: (value: string) => void }) {
  const highlights = ["Payload System", "Structural System", "Guidance, Navigation & Control", "Propulsion System", "Flight Safety", "Recovery System", "Ground Interface"];
  return <section className="rp-hero">
    <div className="rp-hero-copy"><span className="rp-eyebrow">PRO LAB · SYSTEM REFERENCE PL-225</span><h1>Rocket Parts <em>&amp; Systems</em></h1>
      <p>A launch vehicle is an integrated system of structures, propulsion, avionics, safety equipment, payload hardware, and recovery systems. Select any component to inspect its construction and mission purpose.</p>
      <div className="rp-actions"><button onClick={onExplore}>Explore Components</button><button className="secondary" onClick={onCutaway}>View Complete Cutaway</button></div>
      <div className="rp-program-metrics"><span><b>225</b> documented components</span><span><b>14</b> vehicle systems</span><span><i /> Training configuration nominal</span></div>
    </div>
    <div className="rp-hero-visual" aria-label={`Launch vehicle cutaway highlighting ${activeSystem}`}>
      <img src="/pro-lab/vehicle-cutaway.png" alt="Vertical cutaway of the educational launch vehicle showing payload, avionics, propellant tanks, feed system, and engine" />
      <div className={`rp-scan-band system-${SYSTEM_MARKS[activeSystem]?.toLowerCase() ?? "lv"}`} />
      <div className="rp-hero-labels">{highlights.map((system) => <button key={system} className={activeSystem === system ? "active" : ""} onMouseEnter={() => setActiveSystem(system)} onFocus={() => setActiveSystem(system)} onClick={() => setActiveSystem(system)}><i />{system.replace(" System", "")}</button>)}</div>
      <span className="rp-visual-tag">CUTAWAY · LV-01</span>
    </div>
  </section>;
}

export function SystemCategoryNav({ active, onChange }: { active: string; onChange: (value: string) => void }) {
  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = rocketSystems.indexOf(active as typeof rocketSystems[number]);
    if (event.key === "ArrowRight") onChange(rocketSystems[(index + 1) % rocketSystems.length]);
    if (event.key === "ArrowLeft") onChange(rocketSystems[(index - 1 + rocketSystems.length) % rocketSystems.length]);
  };
  return <div className="rp-category-scroll" role="tablist" aria-label="Vehicle system categories" onKeyDown={handleKeys}>{rocketSystems.map((system) =>
    <button key={system} role="tab" aria-selected={active === system} tabIndex={active === system ? 0 : -1} className={active === system ? "active" : ""} onClick={() => onChange(system)} title={`Browse ${system.toLowerCase()} components`}>
      <span>{SYSTEM_MARKS[system]}</span><b>{system}</b><small>{systemCounts[system]} parts</small>
    </button>)}</div>;
}

export type PartFilters = { query: string; position: string; difficulty: string; stage: string; buildOnly: boolean; propulsion: string; sort: string };
export function PartsSearchBar({ filters, setFilters, count }: { filters: PartFilters; setFilters: (filters: PartFilters) => void; count: number }) {
  const update = (key: keyof PartFilters, value: string | boolean) => setFilters({ ...filters, [key]: value });
  const clear = () => setFilters({ query: "", position: "all", difficulty: "all", stage: "all", buildOnly: false, propulsion: "all", sort: "learning" });
  return <section className="rp-search-panel" aria-label="Search and filter rocket parts">
    <label className="rp-search"><span>⌕</span><input value={filters.query} onChange={(event) => update("query", event.target.value)} placeholder="Search rocket parts, systems, functions, or abbreviations..." /><kbd>/</kbd></label>
    <div className="rp-filter-row">
      <Filter label="Position" value={filters.position} onChange={(v) => update("position", v)} options={["all", "internal", "external", "interface"]} />
      <Filter label="Difficulty" value={filters.difficulty} onChange={(v) => update("difficulty", v)} options={["all", "beginner", "intermediate", "advanced"]} />
      <Filter label="Stage" value={filters.stage} onChange={(v) => update("stage", v)} options={["all", "Payload section", "Upper stage", "Core stage", "Engine section", "Launch complex"]} />
      <Filter label="Propulsion" value={filters.propulsion} onChange={(v) => update("propulsion", v)} options={["all", "liquid", "solid", "hybrid", "electric"]} />
      <label className="rp-check"><input type="checkbox" checked={filters.buildOnly} onChange={(event) => update("buildOnly", event.target.checked)} />Build Lab ready</label>
      <Filter label="Sort" value={filters.sort} onChange={(v) => update("sort", v)} options={["learning", "name", "system", "position", "complexity"]} />
      <button className="rp-clear" onClick={clear}>Clear filters</button><span className="rp-result-count"><b>{count}</b> matches</span>
    </div>
  </section>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <label className="rp-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option === "all" ? `All ${label.toLowerCase()}` : option}</option>)}</select></label>;
}

export function TechnicalPartVisual({ part, mode = "external", compact = false }: { part: RocketPart; mode?: "external" | "cutaway" | "installed"; compact?: boolean }) {
  const real = part.status === "available" && mode === "external";
  return <div className={`rp-part-visual rp-visual-${mode} ${compact ? "compact" : ""}`} style={{ "--part-index": part.catalogNumber, "--part-shape": `${36 + (part.catalogNumber % 42)}%` } as React.CSSProperties}>
    {real ? <img loading={compact ? "lazy" : "eager"} decoding="async" src={part.image} alt={part.imageAlt} /> : <div className="rp-tech-placeholder" role="img" aria-label={`${part.imageAlt} Asset tracked as image pending.`}><span className="rp-axis x" /><span className="rp-axis y" /><i className="rp-part-geometry" /><b>{String(part.catalogNumber).padStart(3, "0")}</b><small>{mode.toUpperCase()} · IMAGE PENDING</small></div>}
    {!compact && <span className="rp-view-status">{real ? "PHOTOREAL REFERENCE" : "TECHNICAL PLACEHOLDER · MANIFEST READY"}</span>}
  </div>;
}

export function RocketPartCard({ part, selected, onInspect, onLocate, onAdd }: { part: RocketPart; selected: boolean; onInspect: () => void; onLocate: () => void; onAdd: () => void }) {
  return <article className={`rp-part-card ${selected ? "selected" : ""}`}>
    <button className="rp-card-image" onClick={onInspect} aria-label={`Inspect ${part.name}`}><TechnicalPartVisual part={part} compact /><span>{part.status.replace("-", " ")}</span></button>
    <div className="rp-card-body"><div className="rp-card-meta"><span>{SYSTEM_MARKS[part.system]}</span><small>PART {String(part.catalogNumber).padStart(3, "0")}</small></div><h3>{part.name}</h3>
      <div className="rp-badges"><span>{part.system}</span><span>{part.position}</span><span>{part.stageLocation[0]}</span></div><p>{part.purpose}</p>
      <footer><button onClick={onInspect}>Inspect Part</button><button onClick={onLocate}>Locate</button>{part.buildLabCompatible && <button className="add" onClick={onAdd}>+ Add</button>}</footer></div>
  </article>;
}

const detailTabs = ["Overview", "How It Works", "Internal Construction", "Connections", "Engineering Data", "Inspection", "Failure Effects", "Build Lab"];
export function RocketPartWorkspace({ part, onSelect, onAdd, build }: { part: RocketPart; onSelect: (part: RocketPart) => void; onAdd: (part: RocketPart) => void; build: BuildConfiguration }) {
  const [tab, setTab] = useState("Overview"); const [mode, setMode] = useState<"external" | "cutaway" | "installed">("external");
  useEffect(() => { setTab("Overview"); setMode("external"); }, [part.id]);
  return <section id="part-workspace" className="rp-workspace" aria-labelledby="part-title">
    <header className="rp-workspace-head"><div><span>{part.system} · PART {String(part.catalogNumber).padStart(3, "0")}</span><h2 id="part-title">{part.name}</h2><p>{part.abbreviation ? `${part.abbreviation} · ` : ""}{part.stageLocation.join(" · ")} · {part.position}</p></div><div><span className={`rp-status status-${part.status}`}>● {part.status.replace(/-/g, " ")}</span>{part.buildLabCompatible && <button onClick={() => onAdd(part)}>{build.partIds.includes(part.id) ? "✓ In active build" : "+ Add to Rocket Build"}</button>}</div></header>
    <div className="rp-workspace-grid"><div className="rp-inspector"><div className="rp-view-controls">{(["external", "cutaway", "installed"] as const).map((item) => <button key={item} className={mode === item ? "active" : ""} onClick={() => setMode(item)}>{item}</button>)}</div><TechnicalPartVisual part={part} mode={mode} />
      <div className="rp-view-data"><span><b>VIEW</b>{mode.toUpperCase()}</span><span><b>LOCATION</b>{part.stageLocation[0]}</span><span><b>POSITION</b>{part.position.toUpperCase()}</span></div></div>
      <div className="rp-detail"><div className="rp-tabs" role="tablist" aria-label="Component engineering information">{detailTabs.map((item) => <button key={item} role="tab" aria-selected={tab === item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}</div><div className="rp-tab-content" role="tabpanel" tabIndex={0}>{detailContent(tab, part, onSelect, onAdd, build)}</div></div>
      <RocketLocationMini part={part} />
    </div>
  </section>;
}

function detailContent(tab: string, part: RocketPart, onSelect: (part: RocketPart) => void, onAdd: (part: RocketPart) => void, build: BuildConfiguration): ReactNode {
  if (tab === "Overview") return <><p className="rp-purpose"><span>MISSION PURPOSE</span>{part.purpose}</p><InfoGrid items={[["System", part.system], ["Subsystem", part.subsystem], ["Installed position", part.stageLocation.join(" / ")], ["Configuration", part.configuration], ["Requirement", part.notes || "Vehicle-design dependent"], ["Difficulty", part.difficulty]]} /><h4>Typical materials</h4><div className="rp-tags">{part.materials.map((item) => <span key={item}>{item}</span>)}</div></>;
  if (tab === "How It Works") return <><p className="rp-purpose"><span>FUNCTIONAL PRINCIPLE</span>{part.howItWorks}</p><div className="rp-io"><section><span>INPUTS</span>{part.inputs.map((item) => <b key={item}>→ {item}</b>)}</section><i>PROCESS<br />{SYSTEM_MARKS[part.system]}</i><section><span>OUTPUTS</span>{part.outputs.map((item) => <b key={item}>→ {item}</b>)}</section></div><p className="rp-note">Purpose of this step: trace what the component receives, changes, and delivers so its role in the complete vehicle is unambiguous.</p></>;
  if (tab === "Internal Construction") return <><p className="rp-note">Purpose of this inspection: identify load paths, service interfaces, and condition indicators before integration. The cutaway is conceptual and configuration-dependent.</p><ol className="rp-hotspots">{part.hotspotCoordinates.map((spot) => <li key={spot.id}><b>{spot.label}</b><span>{spot.description}</span></li>)}<li><b>Primary structure</b><span>Carries the component's qualified mechanical or pressure loads.</span></li><li><b>Service layer</b><span>Provides sensing, protection, plumbing, or wiring where applicable.</span></li></ol></>;
  if (tab === "Connections") { const connected = part.connectedParts.map((id) => rocketPartById.get(id)).filter((item): item is RocketPart => Boolean(item)); return <><p className="rp-note">Purpose of this view: verify upstream and downstream interfaces before the component is approved for the integrated vehicle.</p><div className="rp-connection-chain">{connected.length ? connected.map((item, index) => <span key={item.id}><button onClick={() => onSelect(item)}>{item.shortName}</button>{index < connected.length - 1 && <i>→</i>}</span>) : <><span>UPSTREAM SERVICE</span><i>→</i><b>{part.shortName}</b><i>→</i><span>DOWNSTREAM SYSTEM</span></>}</div></> }
  if (tab === "Engineering Data") return <><p className="rp-config-note">Example training configuration — values vary by launch vehicle.</p><table className="rp-data-table"><tbody>{part.keyParameters.map((parameter) => <tr key={parameter.label}><th>{parameter.label}</th><td>{parameter.value} {parameter.unit}</td><td>{parameter.configurationDependent ? "CONFIG DEPENDENT" : "BASELINE"}</td></tr>)}</tbody></table></>;
  if (tab === "Inspection") return <><p className="rp-note">Purpose of this step: establish objective evidence that the installed hardware matches the controlled configuration and is ready for functional checkout.</p><ul className="rp-inspection-list">{part.inspectionPoints.map((item, index) => <li key={item}><span>0{index + 1}</span><b>{item}</b><em>PASS · RECORDED</em></li>)}</ul></>;
  if (tab === "Failure Effects") return <>{part.failureEffects.map((effect) => <article className="rp-failure" key={effect.symptom}><span>DIAGNOSTIC SCENARIO</span><h4>{effect.symptom}</h4><dl><div><dt>Mission consequence</dt><dd>{effect.consequence}</dd></div><div><dt>Detection</dt><dd>{effect.detection}</dd></div><div><dt>Mitigation</dt><dd>{effect.mitigation}</dd></div></dl></article>)}</>;
  return <><div className="rp-build-summary"><span>ACTIVE VEHICLE · LV-01</span><b>{build.partIds.length} components</b><b>{build.massKg.toFixed(1)} kg modeled mass</b><b>{build.readiness}% readiness</b></div><p className="rp-note">Purpose of this action: commit the component to the configuration model, recalculate mass and readiness, and expose missing-system conflicts. Existing components are never silently replaced.</p>{part.buildLabCompatible ? <button className="rp-primary-action" onClick={() => onAdd(part)}>{build.partIds.includes(part.id) ? "Remove from active build" : "Add and validate compatibility"}</button> : <p className="rp-config-note">This reference component is not independently selectable in Build Lab; it is included with its parent assembly.</p>}</>;
}

function InfoGrid({ items }: { items: string[][] }) { return <dl className="rp-info-grid">{items.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>; }
function RocketLocationMini({ part }: { part: RocketPart }) { return <aside className="rp-location"><span>INSTALLED LOCATION</span><div className="rp-mini-rocket"><i style={{ top: `${12 + (part.catalogNumber * 17) % 70}%` }} /><b /></div><p>Complete Rocket<br />→ {part.stageLocation[0]}<br />→ {part.system}<br />→ <b>{part.shortName}</b></p><small>Highlight position is representative; exact installation varies by vehicle.</small></aside>; }

export function CompleteRocketExplorer({ selected, onSelect }: { selected: RocketPart; onSelect: (part: RocketPart) => void }) {
  const [view, setView] = useState("Cutaway"); const [layers, setLayers] = useState(["Payload", "Structures", "Propulsion", "Avionics"]); const [zoom, setZoom] = useState(1);
  const layerNames = ["Payload", "Structures", "Fuel", "Oxidizer", "Propulsion", "Plumbing", "Avionics", "GNC", "Electrical", "Telemetry", "Flight Safety", "Recovery", "Ground Interfaces"];
  return <section id="rocket-explorer" className="rp-explorer"><header><div><span>COMPLETE ROCKET EXPLORER</span><h2>Locate systems in the integrated vehicle</h2><p>Purpose: connect every isolated component to its physical location, mission phase, and neighbouring systems.</p></div><b>LV-01 · CONFIGURATION C</b></header>
    <div className="rp-explorer-layout"><aside><span>VIEW MODE</span>{["External", "X-Ray", "Cutaway", "Exploded", "System Highlight", "Stage Separation"].map((item) => <button className={view === item ? "active" : ""} onClick={() => setView(item)} key={item}>{item}</button>)}<span>LAYERS</span>{layerNames.map((layer) => <label key={layer}><input type="checkbox" checked={layers.includes(layer)} onChange={() => setLayers(layers.includes(layer) ? layers.filter((item) => item !== layer) : [...layers, layer])} />{layer}</label>)}</aside>
      <div className={`rp-explorer-view view-${view.toLowerCase().replace(" ", "-")}`}><img src="/pro-lab/vehicle-cutaway.png" style={{ transform: `scale(${zoom})` }} alt="Interactive complete launch vehicle cutaway" /><i className="rp-locate-pulse" style={{ top: `${12 + (selected.catalogNumber * 17) % 70}%` }} /><div className="rp-zoom"><button onClick={() => setZoom(Math.max(.8, zoom - .1))}>−</button><b>{Math.round(zoom * 100)}%</b><button onClick={() => setZoom(Math.min(1.5, zoom + .1))}>+</button><button onClick={() => setZoom(1)}>Reset</button></div></div>
      <aside className="rp-explorer-readout"><span>SELECTION</span><h3>{selected.name}</h3><p>{selected.purpose}</p><InfoGrid items={[["System", selected.system], ["Location", selected.stageLocation[0]], ["Position", selected.position], ["Layers on", String(layers.length)]]} /><button onClick={() => onSelect(selected)}>Open engineering details</button></aside></div>
  </section>;
}

export function SystemFlowDiagrams({ onSelect }: { onSelect: (part: RocketPart) => void }) {
  const [active, setActive] = useState(flowDefinitions[0]);
  return <section className="rp-flow-section"><header><span>FUNCTIONAL FLOW TRAINER</span><h2>Trace energy, matter, commands, and data</h2></header><div className="rp-flow-tabs">{flowDefinitions.map((flow) => <button key={flow.id} className={active.id === flow.id ? "active" : ""} onClick={() => setActive(flow)}>{flow.label}</button>)}</div><div className="rp-flow" aria-label={`${active.label}: ${active.partNames.join(" then ")}`}>{active.partIds.map((id, index) => { const part = rocketPartById.get(id)!; return <span key={id}><button onClick={() => onSelect(part)}><small>{SYSTEM_MARKS[part.system]}</small>{part.shortName}</button>{index < active.partIds.length - 1 && <i>→</i>}</span>; })}</div></section>;
}

export function PurposeBrowser({ onSystem }: { onSystem: (system: string) => void }) { return <div className="rp-purpose-grid">{purposeGroups.map(([purpose, system]) => <button key={purpose} onClick={() => onSystem(system)}><span>{SYSTEM_MARKS[system]}</span><b>{purpose}</b><small>{systemCounts[system]} relevant reference parts</small><i>Explore →</i></button>)}</div>; }

export function LearningActivities({ onSelect }: { onSelect: (part: RocketPart) => void }) {
  const quizPart = rocketPartById.get("inertial-measurement-unit")!; const [answer, setAnswer] = useState(""); const [sequence, setSequence] = useState(["Injector", "Fuel Tank", "Combustion Chamber", "Fuel Pump"]);
  const move = (index: number, delta: number) => { const next = [...sequence]; const target = index + delta; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; setSequence(next); };
  const correct = sequence.join() === "Fuel Tank,Fuel Pump,Injector,Combustion Chamber";
  return <section className="rp-activities"><header><span>QUALIFICATION ACTIVITIES</span><h2>Check system recognition</h2><p>Immediate feedback explains the engineering purpose behind each answer.</p></header><div>
    <article><span>ACTIVITY 01 · IDENTIFY</span><TechnicalPartVisual part={quizPart} compact /><h3>Which component measures angular motion and linear acceleration?</h3>{["Main Battery", "Inertial Measurement Unit", "Telemetry Transmitter", "Pressure Regulator"].map((item) => <button className={answer === item ? "selected" : ""} onClick={() => setAnswer(item)} key={item}>{item}</button>)}{answer && <p className={answer === quizPart.name ? "correct" : "wrong"}>{answer === quizPart.name ? "Correct — the IMU supplies the measurements used to estimate attitude and motion." : "Not this one — trace the measurement function in the GNC system."}</p>}</article>
    <article><span>ACTIVITY 02 · LOCATE</span><div className="rp-activity-rocket"><i /><b /></div><h3>Locate the avionics bay</h3><p>Select the upper equipment section between the payload and propellant tanks.</p><button onClick={() => onSelect(rocketPartById.get("avionics-bay")!)}>Select upper equipment section</button><small>Purpose: relate the protected electronics enclosure to its physical load and wiring environment.</small></article>
    <article><span>ACTIVITY 03 · CONNECT</span><h3>Arrange the liquid-fuel path</h3><ol className="rp-sort-list">{sequence.map((item, index) => <li key={item}><b>{index + 1}</b>{item}<span><button aria-label={`Move ${item} up`} onClick={() => move(index, -1)}>↑</button><button aria-label={`Move ${item} down`} onClick={() => move(index, 1)}>↓</button></span></li>)}</ol><p className={correct ? "correct" : ""}>{correct ? "Sequence verified — storage, pressurization, metering, then energy conversion." : "Move components until the flow follows the physical path toward the chamber."}</p></article>
  </div></section>;
}

export function AssetCoverageReport() { const available = rocketParts.filter((part) => part.status === "available").length; return <details className="rp-coverage"><summary>Rocket Part Asset Coverage · development report</summary><div><span><b>{rocketParts.length}</b>Total parts</span><span><b>{available}</b>External images</span><span><b>0</b>Cutaways available</span><span><b>0</b>Installed views</span><span><b>{rocketParts.length - available}</b>Pending assets</span><span><b>0</b>Duplicate paths</span><span><b>0</b>Broken rendered assets</span></div><p>Pending files are never requested by the browser; each uses a unique manifest path, exact generation prompt, descriptive alt text, and an on-page technical placeholder.</p></details>; }
