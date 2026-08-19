import { useEffect, useMemo, useState } from "react";
import { Toolbar } from "../components/Toolbar";

type MissionId = "launch" | "docking" | "mars" | "satellite" | "fusion" | "observatory";
type RunState = "configuration" | "ready" | "running" | "hold" | "complete" | "scrubbed";
type Severity = "INFO" | "CAUTION" | "WARNING";

type Parameter = { key: string; label: string; unit: string; min: number; max: number; step: number; initial: number; nominal: [number, number] };
type Mission = {
  id: MissionId; code: string; name: string; discipline: string; summary: string; objective: string; target: string;
  symbol: string; accent: string; phases: string[]; roles: string[]; parameters: Parameter[];
  channels: { label: string; unit: string; base: number; rate: number }[]; constraints: string[];
};

const missions: Mission[] = [
  {
    id: "launch", code: "PL-LV-001", name: "Launch Vehicle Operations", discipline: "Aerospace systems",
    summary: "Integrate, fuel and launch a liquid-propellant vehicle into a 200 km parking orbit.",
    objective: "Achieve orbital insertion while satisfying range, structural and propulsion constraints.", target: "200 km circular orbit",
    symbol: "↑", accent: "#ff9d45", roles: ["FLIGHT", "PROP", "GNC", "BOOSTER", "RANGE"],
    phases: ["Airframe integration", "RP-1 / LOX loading", "GN&C and FTS verification", "Terminal count", "Ascent and insertion"],
    parameters: [
      { key: "payload", label: "Payload mass", unit: "kg", min: 500, max: 2500, step: 50, initial: 1200, nominal: [800, 1800] },
      { key: "mixture", label: "Oxidizer / fuel ratio", unit: "O/F", min: 2.2, max: 2.8, step: .01, initial: 2.45, nominal: [2.35, 2.55] },
      { key: "pitch", label: "Pitch-program start", unit: "s", min: 8, max: 22, step: 1, initial: 14, nominal: [11, 17] },
    ],
    channels: [{ label: "Altitude", unit: "km", base: 0, rate: 1.67 }, { label: "Velocity", unit: "km/s", base: 0, rate: .065 }, { label: "Dynamic pressure", unit: "kPa", base: 0, rate: .41 }, { label: "Acceleration", unit: "g", base: 1.08, rate: .018 }],
    constraints: ["T/W > 1.20 at release", "Max Q < 42 kPa", "AFTS armed before T−5 min", "Orbital insertion error < 5 km"],
  },
  {
    id: "docking", code: "PL-RV-002", name: "Orbital Rendezvous & Docking", discipline: "Orbital mechanics",
    summary: "Plan phasing burns, enter proximity operations and capture a cooperative target vehicle.",
    objective: "Complete hard-dock without violating approach corridor or contact-rate limits.", target: "Hard-dock at Node 2",
    symbol: "◎", accent: "#65d6ff", roles: ["FLIGHT", "GUIDO", "FDO", "CAPCOM", "DOCK"],
    phases: ["Phasing-burn solution", "R-bar approach", "250 m hold point", "Soft capture", "Hard-dock and leak check"],
    parameters: [
      { key: "dv", label: "Phasing burn Δv", unit: "m/s", min: 1, max: 12, step: .1, initial: 5.4, nominal: [4.5, 6.5] },
      { key: "closure", label: "Final closure rate", unit: "cm/s", min: 1, max: 18, step: .5, initial: 7, nominal: [4, 10] },
      { key: "alignment", label: "Alignment error", unit: "deg", min: 0, max: 8, step: .1, initial: 1.2, nominal: [0, 2] },
    ],
    channels: [{ label: "Range", unit: "m", base: 400, rate: -3.2 }, { label: "Range rate", unit: "m/s", base: -.08, rate: -.002 }, { label: "LOS error", unit: "deg", base: 1.4, rate: -.01 }, { label: "Propellant", unit: "%", base: 93, rate: -.08 }],
    constraints: ["Remain inside approach ellipsoid", "Contact rate < 0.10 m/s", "Attitude error < 2°", "Two-fault retreat capability available"],
  },
  {
    id: "mars", code: "PL-EDL-003", name: "Mars Entry, Descent & Landing", discipline: "Planetary flight",
    summary: "Fly atmospheric entry, deploy the supersonic parachute and command powered descent.",
    objective: "Land within the certified ellipse while respecting heat-load and deceleration limits.", target: "Jezero analog ellipse",
    symbol: "◇", accent: "#ff795e", roles: ["FLIGHT", "EDL", "GNC", "THERMAL", "SURFACE"],
    phases: ["Cruise-stage separation", "Entry guidance", "Parachute deployment", "Radar terrain acquisition", "Powered descent and touchdown"],
    parameters: [
      { key: "fpa", label: "Entry flight-path angle", unit: "deg", min: -17, max: -10, step: .1, initial: -14.5, nominal: [-15.2, -13.8] },
      { key: "bank", label: "Initial bank angle", unit: "deg", min: 20, max: 80, step: 1, initial: 52, nominal: [45, 60] },
      { key: "deploy", label: "Parachute deploy Mach", unit: "M", min: 1.4, max: 2.2, step: .05, initial: 1.75, nominal: [1.6, 1.9] },
    ],
    channels: [{ label: "Altitude", unit: "km", base: 125, rate: -1.02 }, { label: "Velocity", unit: "km/s", base: 5.6, rate: -.045 }, { label: "Heat flux", unit: "W/cm²", base: 18, rate: 1.35 }, { label: "Deceleration", unit: "g", base: .3, rate: .074 }],
    constraints: ["Peak heat flux < 180 W/cm²", "Peak deceleration < 12 g", "Deploy within Mach corridor", "Touchdown vertical rate < 0.75 m/s"],
  },
  {
    id: "satellite", code: "PL-SO-004", name: "Satellite Mission Operations", discipline: "Spacecraft engineering",
    summary: "Commission a spacecraft bus and maintain power, attitude and thermal balance through eclipse.",
    objective: "Complete a science pass without entering low-power or attitude safe mode.", target: "Nominal science operations",
    symbol: "✦", accent: "#78e1a7", roles: ["FLIGHT", "ADCO", "EPS", "THERMAL", "PAYLOAD"],
    phases: ["Deployment and acquisition", "EPS activation", "ADCS detumble", "Thermal stabilization", "Science-pass execution"],
    parameters: [
      { key: "array", label: "Solar-array incidence", unit: "deg", min: 0, max: 70, step: 1, initial: 12, nominal: [0, 25] },
      { key: "battery", label: "Battery reserve", unit: "%", min: 20, max: 100, step: 1, initial: 82, nominal: [65, 100] },
      { key: "wheel", label: "Wheel momentum", unit: "Nms", min: 0, max: 18, step: .2, initial: 5.2, nominal: [0, 9] },
    ],
    channels: [{ label: "Bus voltage", unit: "V", base: 28.4, rate: -.006 }, { label: "Battery SOC", unit: "%", base: 82, rate: -.12 }, { label: "Pointing error", unit: "arcsec", base: 7.2, rate: -.045 }, { label: "Bus temperature", unit: "°C", base: 21, rate: .03 }],
    constraints: ["Battery SOC > 35%", "Bus voltage 26–32 V", "Pointing error < 5 arcsec", "Wheel momentum < 12 Nms"],
  },
  {
    id: "fusion", code: "PL-FU-005", name: "Fusion Tokamak Control Room", discipline: "Plasma physics",
    summary: "Prepare the vacuum vessel, establish plasma and sustain a controlled high-confinement discharge.",
    objective: "Maintain an H-mode pulse without exceeding density, coil-current or disruption limits.", target: "Stable 12 s H-mode pulse",
    symbol: "⊙", accent: "#c68cff", roles: ["PULSE", "MAGNET", "VACUUM", "HEATING", "MACHINE"],
    phases: ["Vacuum-vessel pumpdown", "Toroidal-field energization", "Gas prefill and breakdown", "Auxiliary heating", "H-mode sustain and ramp-down"],
    parameters: [
      { key: "field", label: "Toroidal field", unit: "T", min: 1.2, max: 5.5, step: .1, initial: 3.8, nominal: [3.2, 4.5] },
      { key: "density", label: "Electron density", unit: "10¹⁹/m³", min: 1, max: 12, step: .2, initial: 7.2, nominal: [5.5, 8.5] },
      { key: "heating", label: "Auxiliary heating", unit: "MW", min: 2, max: 24, step: .5, initial: 14, nominal: [10, 18] },
    ],
    channels: [{ label: "Plasma current", unit: "MA", base: .1, rate: .014 }, { label: "Core temp.", unit: "keV", base: .8, rate: .07 }, { label: "Confinement", unit: "s", base: .12, rate: .006 }, { label: "Fusion power", unit: "MW", base: 0, rate: 1.2 }],
    constraints: ["Greenwald fraction < 0.85", "q95 > 2.5", "Coil current below thermal limit", "Disruption predictor remains green"],
  },
  {
    id: "observatory", code: "PL-OB-006", name: "Deep-Space Observatory", discipline: "Observational astronomy",
    summary: "Acquire a guide star, calibrate the optical train and collect a science-grade exoplanet spectrum.",
    objective: "Produce a calibrated spectrum with the required signal-to-noise ratio and pointing stability.", target: "Transit spectrum · S/N ≥ 50",
    symbol: "◉", accent: "#f3cf67", roles: ["MISSION", "POINTING", "INSTRUMENT", "THERMAL", "SCIENCE"],
    phases: ["Guide-star acquisition", "Wavefront sensing", "Filter and grating selection", "Science exposure", "Dark / flat calibration"],
    parameters: [
      { key: "exposure", label: "Exposure duration", unit: "s", min: 10, max: 300, step: 5, initial: 120, nominal: [90, 180] },
      { key: "gain", label: "Detector gain", unit: "e⁻/ADU", min: .5, max: 4, step: .1, initial: 1.6, nominal: [1.2, 2.2] },
      { key: "jitter", label: "Pointing jitter", unit: "mas", min: 0, max: 25, step: .5, initial: 4.5, nominal: [0, 8] },
    ],
    channels: [{ label: "S/N ratio", unit: "", base: 4, rate: .52 }, { label: "Jitter", unit: "mas", base: 5.1, rate: -.018 }, { label: "Detector temp.", unit: "K", base: 42.1, rate: -.008 }, { label: "Data volume", unit: "GB", base: 0, rate: .34 }],
    constraints: ["Guide-star lock maintained", "Detector < 45 K", "Jitter < 8 mas", "Cosmic-ray rejection enabled"],
  },
];

const scenarioLabels = { nominal: "Nominal", offNominal: "Off-nominal", contingency: "Contingency" } as const;

export function ProLabProgramPage() {
  const [activeId, setActiveId] = useState<MissionId | null>(null);
  const [mode, setMode] = useState("Training");
  const [scenario, setScenario] = useState<keyof typeof scenarioLabels>("nominal");
  const [completed, setCompleted] = useState<number[]>([]);
  const [runState, setRunState] = useState<RunState>("configuration");
  const [met, setMet] = useState(0);
  const [alert, setAlert] = useState<{ severity: Severity; message: string } | null>(null);
  const [events, setEvents] = useState<{ time: string; text: string; severity: Severity }[]>([]);
  const [activeConsole, setActiveConsole] = useState("FLIGHT");
  const [displayMode, setDisplayMode] = useState<"external" | "cutaway" | "xray">("cutaway");
  const [layers, setLayers] = useState(["Structure", "Propulsion", "Avionics"]);
  const [pinnedChannels, setPinnedChannels] = useState<string[]>([]);
  const [voiceLoops, setVoiceLoops] = useState(false);
  const [handover, setHandover] = useState(() => localStorage.getItem("pro-lab-handover") ?? "All stations staffed. No open constraints from previous shift.");
  const mission = missions.find((item) => item.id === activeId) ?? null;
  const [parameters, setParameters] = useState<Record<string, number>>({});

  const log = (text: string, severity: Severity = "INFO") => setEvents((current) => [{ time: stamp(met), text, severity }, ...current].slice(0, 40));

  const openMission = (selected: Mission) => {
    setActiveId(selected.id); setCompleted([]); setRunState("configuration"); setMet(0); setAlert(null); setEvents([]);
    setActiveConsole(selected.roles[0]); setParameters(Object.fromEntries(selected.parameters.map((item) => [item.key, item.initial])));
  };

  const exitMission = () => { setActiveId(null); setRunState("configuration"); setMet(0); };

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setInterval(() => setMet((value) => {
      const next = value + 1;
      if (next === 28) log("Maximum operating load passed", "INFO");
      if (next === 54 && scenario !== "nominal") {
        setAlert({ severity: scenario === "contingency" ? "WARNING" : "CAUTION", message: scenario === "contingency" ? "Primary control channel outside certified envelope" : "Telemetry residual trending above prediction" });
      }
      if (next >= 100) { setRunState("complete"); log("Mission success criteria satisfied", "INFO"); }
      return next;
    }), 180);
    return () => window.clearInterval(timer);
  }, [runState, scenario]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!mission || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key.toLowerCase() === "g" && runState === "ready") startRun();
      if (event.key.toLowerCase() === "h" && (runState === "running" || runState === "hold")) toggleHold();
      if (event.key.toLowerCase() === "a" && alert) acknowledgeAlert();
      if (event.key.toLowerCase() === "e") exportTelemetry();
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  const nextProcedure = mission ? mission.phases.findIndex((_, index) => !completed.includes(index)) : -1;
  const executeProcedure = (index: number) => {
    if (!mission || index !== nextProcedure) return;
    setCompleted((current) => [...current, index]); log(`${mission.phases[index]} verified`);
    if (index === mission.phases.length - 1) { setRunState("ready"); log("Flight Director poll complete — all stations GO"); }
  };
  const announce = (message: string) => { if (voiceLoops && "speechSynthesis" in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(message)); } };
  const startRun = () => { setRunState("running"); setMet(0); log("Execution sequence initiated"); announce("Flight, all stations go. Execution sequence initiated."); };
  const toggleHold = () => { const next = runState === "hold" ? "running" : "hold"; setRunState(next); log(next === "hold" ? "Flight Director called HOLD" : "HOLD released"); };
  const acknowledgeAlert = () => { if (alert) log(`${alert.severity} acknowledged by ${activeConsole}`, alert.severity); setAlert(null); };
  const injectAnomaly = () => { setAlert({ severity: "WARNING", message: mission?.id === "fusion" ? "Disruption predictor threshold crossed" : "Redundant navigation solution disagreement" }); log("Simulation controller injected anomaly", "WARNING"); };
  const scrub = () => { setRunState("scrubbed"); log("Mission scrub declared — vehicle/system safing required", "WARNING"); };

  const telemetry = useMemo(() => mission?.channels.map((channel, index) => {
    const wave = Math.sin((met + index * 8) / 13) * Math.abs(channel.rate) * 5;
    const raw = channel.base + channel.rate * met + wave;
    return { ...channel, value: Math.max(0, raw), history: Array.from({ length: 24 }, (_, point) => Math.max(4, Math.min(96, 48 + Math.sin((point + met / 4 + index * 4) / 4) * 25 + channel.rate * point * 2))) };
  }) ?? [], [mission, met]);
  const orderedTelemetry = [...telemetry].sort((a, b) => Number(pinnedChannels.includes(b.label)) - Number(pinnedChannels.includes(a.label)));

  const exportTelemetry = () => {
    if (!mission) return;
    const rows = ["mission,met,channel,value,unit", ...telemetry.map((channel) => `${mission.code},${met},${channel.label},${channel.value.toFixed(3)},${channel.unit}`)];
    const url = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${mission.code.toLowerCase()}-telemetry.csv`; anchor.click(); URL.revokeObjectURL(url);
  };

  if (!mission) return <ProgramDirectory onOpen={openMission} />;

  const readiness = Math.round(completed.length / mission.phases.length * 100);
  const allParametersNominal = mission.parameters.every((parameter) => parameters[parameter.key] >= parameter.nominal[0] && parameters[parameter.key] <= parameter.nominal[1]);

  return (
    <div className="pro-program-page" data-ui-theme="dark" style={{ "--mission-accent": mission.accent } as React.CSSProperties}>
      <Toolbar />
      <main id="content" className="pro-program-shell">
        <header className="program-command-bar">
          <button className="program-back" onClick={exitMission}>← PROGRAMS</button>
          <div className="mission-identity"><span>{mission.code}</span><strong>{mission.name}</strong><small>{mission.discipline}</small></div>
          <label>MODE<select value={mode} onChange={(event) => setMode(event.target.value)}><option>Training</option><option>Qualification</option><option>Examination</option></select></label>
          <label>SCENARIO<select value={scenario} onChange={(event) => setScenario(event.target.value as keyof typeof scenarioLabels)}><option value="nominal">Nominal</option><option value="offNominal">Off-nominal</option><option value="contingency">Contingency</option></select></label>
          <div className={`program-state state-${runState}`}><i />{runState.toUpperCase()}</div>
          <time>MET {stamp(met)}</time>
        </header>

        {alert && <div className={`mission-alert ${alert.severity.toLowerCase()}`}><b>{alert.severity}</b><span>{alert.message}</span><button onClick={acknowledgeAlert}>ACKNOWLEDGE [A]</button></div>}

        <section className="mission-objective-bar"><span>MISSION OBJECTIVE</span><p>{mission.objective}</p><b>{mission.target}</b></section>

        <section className="operations-grid">
          <aside className="ops-panel procedure-panel">
            <PanelTitle label="MISSION WORKFLOW" value={`${readiness}% READY`} />
            <div className="procedure-stack">
              {mission.phases.map((phase, index) => {
                const done = completed.includes(index); const active = index === nextProcedure;
                return <button key={phase} className={done ? "done" : active ? "active" : "locked"} onClick={() => executeProcedure(index)} disabled={!active}>
                  <b>{done ? "✓" : index + 1}</b><span><strong>{phase}</strong><small>{done ? "VERIFIED" : active ? "ACTION REQUIRED" : "INTERLOCKED"}</small></span><em>{done ? "GO" : active ? "EXECUTE" : "LOCK"}</em>
                </button>;
              })}
            </div>
            <div className="mission-profile"><PanelTitle label="MISSION PROFILE" /><dl><div><dt>Target</dt><dd>{mission.target}</dd></div><div><dt>Mode</dt><dd>{mode}</dd></div><div><dt>Scenario</dt><dd>{scenarioLabels[scenario]}</dd></div><div><dt>Shift</dt><dd>ALPHA / CONSOLE 1</dd></div></dl></div>
          </aside>

          <section className="ops-panel system-display">
            <PanelTitle label="SYSTEM CONFIGURATION & LIVE MODEL" value={activeConsole} />
            <div className="console-tabs">{mission.roles.map((role) => <button key={role} className={activeConsole === role ? "active" : ""} onClick={() => setActiveConsole(role)}>{role}</button>)}</div>
            <div className="display-control-row"><span>VIEW</span>{(["external", "cutaway", "xray"] as const).map((view) => <button key={view} className={displayMode === view ? "active" : ""} onClick={() => setDisplayMode(view)}>{view.toUpperCase()}</button>)}<i />{["Structure", "Propulsion", "Avionics", "Thermal", "Safety"].map((layer) => <label key={layer}><input type="checkbox" checked={layers.includes(layer)} onChange={() => setLayers((current) => current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer])} />{layer}</label>)}</div>
            <MissionVisual mission={mission} progress={readiness} runState={runState} displayMode={displayMode} layers={layers} />
            <div className="parameter-bank">
              {mission.parameters.map((parameter) => { const value = parameters[parameter.key] ?? parameter.initial; const nominal = value >= parameter.nominal[0] && value <= parameter.nominal[1]; return <label key={parameter.key}>
                <span><b>{parameter.label}</b><em className={nominal ? "nominal" : "limit"}>{nominal ? "NOMINAL" : "OUT OF FAMILY"}</em></span>
                <input type="range" min={parameter.min} max={parameter.max} step={parameter.step} value={value} onChange={(event) => setParameters((current) => ({ ...current, [parameter.key]: Number(event.target.value) }))} />
                <strong>{value.toFixed(parameter.step < 1 ? 2 : 0)} <small>{parameter.unit}</small></strong>
              </label>; })}
            </div>
          </section>

          <aside className="ops-right-column">
            <section className="ops-panel telemetry-panel"><PanelTitle label="REAL-TIME TELEMETRY" value="LIVE" /><div className="telemetry-bank">{orderedTelemetry.map((channel, index) => <article key={channel.label} className={pinnedChannels.includes(channel.label) ? "pinned" : ""}><button title={`Pin ${channel.label}`} onClick={() => setPinnedChannels((current) => current.includes(channel.label) ? current.filter((item) => item !== channel.label) : [...current, channel.label])}>{pinnedChannels.includes(channel.label) ? "◆" : "◇"}</button><span>{channel.label}<small>SNS-{mission.code.slice(-3)}-{String(index + 1).padStart(2, "0")}</small></span><strong>{channel.value.toFixed(channel.value >= 100 ? 0 : 2)} <small>{channel.unit}</small></strong><StripChart points={channel.history} /></article>)}</div></section>
            <section className="ops-panel constraint-panel"><PanelTitle label="OPERATING CONSTRAINTS" value={allParametersNominal ? "GREEN" : "REVIEW"} /><ul>{mission.constraints.map((constraint, index) => <li key={constraint}><i className={index === 0 && !allParametersNominal ? "amber" : ""} />{constraint}</li>)}</ul></section>
            <section className="ops-panel command-panel"><PanelTitle label="FLIGHT DIRECTOR" />
              {runState === "ready" && <button className="command-go" onClick={startRun}>EXECUTE MISSION [G]</button>}
              {(runState === "running" || runState === "hold") && <button className="command-hold" onClick={toggleHold}>{runState === "hold" ? "RELEASE HOLD" : "CALL HOLD"} [H]</button>}
              {runState === "configuration" && <p>Complete workflow verification to release execution interlocks.</p>}
              {runState === "complete" && <strong className="mission-success">MISSION SUCCESS</strong>}
              {runState === "scrubbed" && <strong className="mission-scrubbed">MISSION SCRUBBED</strong>}
              <div><button onClick={injectAnomaly}>INJECT ANOMALY</button><button onClick={scrub}>SCRUB</button><button onClick={exportTelemetry}>EXPORT [E]</button></div><label className="voice-loop-toggle"><input type="checkbox" checked={voiceLoops} onChange={(event) => setVoiceLoops(event.target.checked)} /> CONSOLE VOICE LOOPS & CAUTION CALLOUTS</label>
            </section>
          </aside>
        </section>

        <section className="lower-console-grid">
          <section className="ops-panel trajectory-panel"><PanelTitle label="PREDICTED / ACTUAL PROFILE" /><TrajectoryPlot progress={met} state={runState} /></section>
          <section className="ops-panel environment-panel"><PanelTitle label="ENVIRONMENT & SAFETY" value="RANGE GREEN" /><div className="env-grid"><span><b>WIND</b><strong>5.2 m/s</strong><small>NE 046°</small></span><span><b>THERMAL</b><strong>21.4 °C</strong><small>WITHIN BAND</small></span><span><b>LINK</b><strong>−62 dBm</strong><small>STRONG</small></span><span><b>REDUNDANCY</b><strong>2 / 2</strong><small>AVAILABLE</small></span></div></section>
          <section className="ops-panel event-panel"><PanelTitle label="EVENT LOG" value={`${events.length} EVENTS`} /><div className="event-log">{events.length ? events.map((event, index) => <div key={`${event.time}-${index}`} className={event.severity.toLowerCase()}><time>{event.time}</time><i /><span>{event.text}</span><b>{event.severity}</b></div>) : <p>No events recorded. Begin workflow verification.</p>}</div></section>
          <section className="ops-panel handover-panel"><PanelTitle label="SHIFT HANDOVER" /><textarea value={handover} onChange={(event) => setHandover(event.target.value)} /><button onClick={() => { localStorage.setItem("pro-lab-handover", handover); log("Shift handover note saved"); }}>SAVE HANDOVER</button></section>
        </section>
        <EngineeringConsole mission={mission} met={met} parameters={parameters} anomaly={Boolean(alert)} />

        {runState === "complete" && <section className="postflight-report"><span>POST-MISSION REPORT · {mission.code}</span><h2>All mission success criteria achieved</h2><div><b>100%</b><small>PROCEDURES COMPLETE</small><b>0</b><small>OPEN WARNINGS</small><b>{events.length}</b><small>LOGGED EVENTS</small><b>{mode}</b><small>ASSESSMENT MODE</small></div><button onClick={() => window.print()}>PRINT MISSION REPORT</button></section>}
      </main>
    </div>
  );
}

function ProgramDirectory({ onOpen }: { onOpen: (mission: Mission) => void }) {
  return <div className="pro-program-page" data-ui-theme="dark"><Toolbar /><main id="content" className="pro-program-shell directory-shell">
    <header className="program-hero"><div><span>PHYSICSLAB 100 · ADVANCED OPERATIONS</span><h1>Pro Lab<br /><em>Mission Program</em></h1><p>Operate authentic scientific systems through configuration, verification, execution, anomaly response and post-mission analysis.</p><a className="program-parts-link" href="/rocket-lab/parts">EXPLORE ALL ROCKET PARTS →</a></div><div className="program-status"><span><i /> PROGRAM ONLINE</span><strong>6</strong><small>OPERATIONAL LABORATORIES</small><b>201</b><small>LOCAL VALIDATION CHECKS</small></div></header>
    <section className="program-summary-strip"><span><b>ALPHA SHIFT</b> 06:00–14:00 UTC</span><span><b>ACTIVE RANGE</b> High Desert Analog</span><span><b>OPEN CONSTRAINTS</b> 0 critical</span><span><b>SIMULATION CLOCK</b> Synchronized</span></section>
    <section className="mission-directory"><div className="directory-heading"><span>MISSION DIRECTORY</span><h2>Select an operations program</h2><p>Every laboratory supports nominal, off-nominal and contingency scenarios.</p></div><div className="mission-card-grid">{missions.map((mission, index) => <button key={mission.id} className={`mission-program-card mission-card-${mission.id}`} style={{ "--mission-accent": mission.accent } as React.CSSProperties} onClick={() => mission.id === "launch" ? window.location.assign("/pro-lab/launch-vehicle") : onOpen(mission)}>
      <div className="mission-card-top"><span>{mission.code}</span><em>AVAILABLE</em></div><div className="mission-card-symbol">{mission.symbol}</div><small>{mission.discipline}</small><h3>{mission.name}</h3><p>{mission.summary}</p><dl><div><dt>Target</dt><dd>{mission.target}</dd></div><div><dt>Procedures</dt><dd>{mission.phases.length}</dd></div><div><dt>Consoles</dt><dd>{mission.roles.length}</dd></div></dl><strong>ENTER OPERATIONS <b>0{index + 1}</b></strong>
    </button>)}</div></section>
    <footer className="program-footer"><span>PRO LAB OPERATIONS SUITE</span><p>Educational simulations use authentic terminology and simplified models. They are not flight-, medical-, or facility-certified systems.</p><kbd>G</kbd> Execute <kbd>H</kbd> Hold <kbd>A</kbd> Acknowledge <kbd>E</kbd> Export</footer>
  </main></div>;
}

function PanelTitle({ label, value }: { label: string; value?: string }) { return <header className="ops-panel-title"><span>{label}</span>{value && <b>{value}</b>}</header>; }

function MissionVisual({ mission, progress, runState, displayMode, layers }: { mission: Mission; progress: number; runState: RunState; displayMode: string; layers: string[] }) {
  return <div className={`mission-visual visual-${mission.id} run-${runState} view-${displayMode}`}><div className="visual-grid" /><div className="visual-orbit" /><div className="visual-body"><span>{mission.symbol}</span><i /><i /><i /></div><div className="visual-vector v1" /><div className="visual-vector v2" /><div className="visual-callout c1"><b>SYSTEM A</b><span>{progress >= 40 ? "NOMINAL" : "CONFIG"}</span></div><div className="visual-callout c2"><b>CONTROL LOOP</b><span>{runState === "running" ? "ACTIVE" : "STANDBY"}</span></div><div className="visual-callout c3"><b>MISSION STATE</b><span>{runState.toUpperCase()}</span></div><div className="active-layer-readout">{layers.map((layer) => <span key={layer}>{layer}</span>)}</div></div>;
}

function EngineeringConsole({ mission, met, parameters, anomaly }: { mission: Mission; met: number; parameters: Record<string, number>; anomaly: boolean }) {
  const launchRows = [
    ["CONFIGURATION CONTROL", "LV-01 / REV C", "BASELINE LOCKED"], ["MASS BUDGET", `${(33 + (parameters.payload ?? 1200) / 1000).toFixed(1)} t DRY`, "410.0 t PROPELLANT"],
    ["LONGITUDINAL STABILITY", "CoM 26.4 m", "CoP 28.1 m · +1.7 m"], ["INTEGRATION INSPECTION", "PAF TORQUE 100%", "UMBILICAL CONTINUITY PASS"],
    ["CRYOGENIC TANK", "LOX 90.2 K · 310 kPa", "ULLAGE He NOMINAL"], ["FUEL SYSTEM", "RP-1 291 K · 275 kPa", "RECIRC VALVE OPEN"],
    ["INERTIAL NAVIGATION", "IMU ALIGN 0.018°", "DRIFT 0.003°/h"], ["GPS / ATTITUDE", "11 SV · SOLUTION 3D", "R +0.02° P −0.04° Y +0.01°"],
    ["THRUST VECTOR CONTROL", "ACT 1 +0.12°", "ACT 2 −0.08°"], ["RANGE SAFETY", "AFTS CH A/B ARMED", "IIP INSIDE CORRIDOR"],
    ["ATMOSPHERE", "SURFACE 5.2 m/s", "JET 28.4 m/s @ 11 km"], ["FLIGHT DYNAMICS", `M ${Math.max(0, met * .065).toFixed(2)} · AoA 0.7°`, `DOWNRANGE ${(met * met * .12).toFixed(0)} km`],
    ["ASCENT EVENTS", "MAX Q T+01:14", "MECO 02:41 · FAIRING 03:18"], ["ORBIT SOLUTION", "AP 202.4 / PE 198.7 km", "INC 28.50°"],
  ];
  const genericRows = [
    ["CONFIGURATION CONTROL", `${mission.code} / REV B`, "BASELINE LOCKED"], ["SYSTEM MARGIN", "18.4% AVAILABLE", "MASS / POWER CLOSED"],
    ["PRIMARY CONTROL", "CHANNEL A ACTIVE", anomaly ? "RESIDUAL INVALID" : "RESIDUAL NOMINAL"], ["REDUNDANT CONTROL", "CHANNEL B STANDBY", "AUTOMATIC FAILOVER"],
    ["NAVIGATION SOLUTION", "FILTER CONVERGED", "COVARIANCE NOMINAL"], ["THERMAL STATE", "21.4 °C", "GRADIENT 1.2 K"],
    ["DATA INTEGRITY", "CRC PASS", "LATENCY 42 ms"], ["SAFETY INTERLOCKS", "12 / 12 CLOSED", "NO BYPASSES"],
  ];
  const rows = mission.id === "launch" ? launchRows : genericRows;
  return <section className="engineering-console ops-panel"><PanelTitle label="ENGINEERING DETAIL / CONFIGURATION CONTROL" value={anomaly ? "1 OPEN ANOMALY" : "ALL SYSTEMS NOMINAL"} /><div>{rows.map(([title, value, detail]) => <article key={title} className={anomaly && title === "PRIMARY CONTROL" ? "invalid" : ""}><span>{title}</span><strong>{value}</strong><small>{detail}</small><i /></article>)}</div></section>;
}

function StripChart({ points }: { points: number[] }) { return <div className="strip-chart" aria-hidden="true">{points.map((point, index) => <i key={index} style={{ height: `${point}%` }} />)}</div>; }
function TrajectoryPlot({ progress, state }: { progress: number; state: RunState }) { const shown = state === "complete" ? 100 : progress; return <div className="trajectory-plot"><div className="plot-grid" /><div className="planned-curve" /><div className="actual-curve" style={{ clipPath: `inset(0 ${100 - Math.min(100, shown)}% 0 0)` }} /><div className="plot-marker" style={{ left: `${Math.min(96, shown)}%` }}><i /><span>MET {stamp(progress)}</span></div><div className="milestone m1">MAX LOAD</div><div className="milestone m2">PRIMARY EVENT</div><div className="milestone m3">TARGET</div><footer><span><i /> PLANNED</span><span><i /> ACTUAL</span><b>EXECUTION {Math.min(100, shown)}%</b></footer></div>; }
function stamp(seconds: number) { const min = Math.floor(seconds / 60); const sec = seconds % 60; return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`; }
