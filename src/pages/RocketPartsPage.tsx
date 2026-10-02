import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";
import {
  AssetCoverageReport, CompleteRocketExplorer, LearningActivities, PartsHero, PartsSearchBar, PurposeBrowser,
  RocketPartCard, RocketPartWorkspace, RocketProgramNav, SystemCategoryNav, SystemFlowDiagrams, type PartFilters,
} from "../components/rocket-parts/RocketPartsComponents";
import { rocketPartById, rocketParts, type BuildConfiguration, type RocketPart } from "../data/rocketParts";

const initialFilters: PartFilters = { query: "", position: "all", difficulty: "all", stage: "all", buildOnly: false, propulsion: "all", sort: "learning" };
const defaultBuild: BuildConfiguration = { partIds: [], massKg: 0, readiness: 18, updatedAt: new Date(0).toISOString() };

function loadBuild(): BuildConfiguration {
  try { return JSON.parse(localStorage.getItem("rocket-build-configuration-v1") ?? "null") ?? defaultBuild; } catch { return defaultBuild; }
}

export function RocketPartsPage() {
  const { partId } = useParams(); const navigate = useNavigate(); const libraryRef = useRef<HTMLElement>(null); const explorerRef = useRef<HTMLDivElement>(null);
  const [activeSystem, setActiveSystem] = useState("Complete Rocket"); const [mode, setMode] = useState<"system" | "purpose">("system");
  const [filters, setFilters] = useState(initialFilters); const [build, setBuild] = useState(loadBuild); const [buildMessage, setBuildMessage] = useState("");
  const selected = rocketPartById.get(partId ?? "") ?? rocketPartById.get("payload-fairing") ?? rocketParts[0];

  useEffect(() => { document.title = "Rocket Parts & Systems · Pro Lab"; }, []);
  useEffect(() => { if (partId && !rocketPartById.has(partId)) navigate("/rocket-lab/parts", { replace: true }); }, [partId, navigate]);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === "/" && !(event.target instanceof HTMLInputElement)) { event.preventDefault(); document.querySelector<HTMLInputElement>(".rp-search input")?.focus(); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);

  const filtered = useMemo(() => {
    const terms = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const list = rocketParts.filter((part) => {
      const search = [part.name, part.shortName, part.abbreviation, part.alternativeNames.join(" "), part.system, part.subsystem, part.purpose, part.howItWorks, part.inputs.join(" "), part.outputs.join(" ")].join(" ").toLowerCase();
      return (activeSystem === "Complete Rocket" || part.system === activeSystem) && terms.every((term) => search.includes(term)) &&
        (filters.position === "all" || part.position === filters.position) && (filters.difficulty === "all" || part.difficulty === filters.difficulty) &&
        (filters.stage === "all" || part.stageLocation.includes(filters.stage)) && (!filters.buildOnly || part.buildLabCompatible) &&
        (filters.propulsion === "all" || part.propulsionType === filters.propulsion);
    });
    return [...list].sort((a, b) => filters.sort === "name" ? a.name.localeCompare(b.name) : filters.sort === "system" ? a.system.localeCompare(b.system) : filters.sort === "position" ? a.position.localeCompare(b.position) : filters.sort === "complexity" ? ["beginner", "intermediate", "advanced"].indexOf(a.difficulty) - ["beginner", "intermediate", "advanced"].indexOf(b.difficulty) : a.learningOrder - b.learningOrder);
  }, [activeSystem, filters]);

  const inspect = (part: RocketPart, scroll = true) => { navigate(`/rocket-lab/parts/${part.id}`); if (scroll) requestAnimationFrame(() => document.getElementById("part-workspace")?.scrollIntoView({ behavior: "smooth", block: "start" })); };
  const locate = (part: RocketPart) => { navigate(`/rocket-lab/parts/${part.id}`); explorerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const changeSystem = (system: string) => { setActiveSystem(system); setMode("system"); libraryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const addToBuild = (part: RocketPart) => {
    if (!part.buildLabCompatible) { setBuildMessage(`${part.name} is supplied within a parent assembly and cannot be independently added.`); return; }
    const exists = build.partIds.includes(part.id); const partMass = Number(part.keyParameters[0].value);
    const nextIds = exists ? build.partIds.filter((id) => id !== part.id) : [...build.partIds, part.id];
    const required = ["rocket-engine", "fuel-tank", "oxidizer-tank", "flight-computer", "telemetry-transmitter", "payload-adapter"];
    const readiness = Math.min(100, 18 + Math.round((required.filter((id) => nextIds.includes(id)).length / required.length) * 70) + Math.min(12, nextIds.length));
    const next = { partIds: nextIds, massKg: Math.max(0, build.massKg + (exists ? -partMass : partMass)), readiness, updatedAt: new Date().toISOString() };
    setBuild(next); localStorage.setItem("rocket-build-configuration-v1", JSON.stringify(next));
    const missing = required.filter((id) => !nextIds.includes(id)).map((id) => rocketPartById.get(id)?.shortName).filter(Boolean);
    setBuildMessage(exists ? `${part.name} removed. Configuration mass and readiness recalculated.` : `${part.name} added. ${missing.length ? `Open integration constraints: ${missing.slice(0, 3).join(", ")}.` : "Core mission systems are present."}`);
  };

  return <div className="rocket-parts-page" data-ui-theme="dark"><Toolbar /><main id="content" className="rp-shell">
    <header className="rp-module-header"><div><span className="rp-mark">↗</span><p><b>ROCKET BUILDING LAB</b><small>Pro Lab · Engineering Reference</small></p></div><RocketProgramNav /><div className="rp-readiness"><span>ACTIVE BUILD</span><b>{build.readiness}% READY</b></div></header>
    <PartsHero activeSystem={activeSystem} setActiveSystem={setActiveSystem} onExplore={() => libraryRef.current?.scrollIntoView({ behavior: "smooth" })} onCutaway={() => explorerRef.current?.scrollIntoView({ behavior: "smooth" })} />
    <SystemCategoryNav active={activeSystem} onChange={changeSystem} />
    <section className="rp-library" ref={libraryRef}><header className="rp-section-head"><div><span>COMPONENT LIBRARY · CONTROLLED REFERENCE</span><h2>{activeSystem === "Complete Rocket" ? "Complete launch-vehicle catalog" : activeSystem}</h2><p>Inspect purpose, construction, interfaces, failure effects, and Build Lab compatibility.</p></div><div className="rp-mode-toggle" role="group" aria-label="Browse mode"><button className={mode === "system" ? "active" : ""} onClick={() => setMode("system")}>Browse by System</button><button className={mode === "purpose" ? "active" : ""} onClick={() => setMode("purpose")}>Browse by Purpose</button></div></header>
      {mode === "purpose" ? <PurposeBrowser onSystem={changeSystem} /> : <><PartsSearchBar filters={filters} setFilters={setFilters} count={filtered.length} /><div className="rp-library-layout"><aside className="rp-system-sidebar"><span>VEHICLE SYSTEMS</span>{["Complete Rocket", ...Array.from(new Set(rocketParts.map((part) => part.system)))].map((system) => <button key={system} className={activeSystem === system ? "active" : ""} onClick={() => setActiveSystem(system)}><b>{system}</b><small>{system === "Complete Rocket" ? rocketParts.length : rocketParts.filter((part) => part.system === system).length}</small></button>)}</aside><div className="rp-grid">{filtered.slice(0, 225).map((part) => <RocketPartCard key={part.id} part={part} selected={selected.id === part.id} onInspect={() => inspect(part)} onLocate={() => locate(part)} onAdd={() => addToBuild(part)} />)}{filtered.length === 0 && <div className="rp-empty"><b>No components match this control set.</b><button onClick={() => { setFilters(initialFilters); setActiveSystem("Complete Rocket"); }}>Reset catalog filters</button></div>}</div></div></>}
    </section>
    <RocketPartWorkspace part={selected} onSelect={inspect} onAdd={addToBuild} build={build} />
    <div ref={explorerRef}><CompleteRocketExplorer selected={selected} onSelect={inspect} /></div>
    <SystemFlowDiagrams onSelect={inspect} /><LearningActivities onSelect={inspect} /><AssetCoverageReport />
    <footer className="rp-footer"><div><span>ROCKET PARTS &amp; SYSTEMS</span><p>Educational systems reference. Example values are configuration-dependent and are not flight-certified data.</p></div><Link to="/pro-lab/launch-vehicle">Continue to Build Lab →</Link></footer>
    {buildMessage && <div className="rp-toast" role="status"><span>CONFIGURATION MODEL UPDATED</span><p>{buildMessage}</p><button onClick={() => setBuildMessage("")} aria-label="Dismiss">×</button></div>}
  </main></div>;
}
