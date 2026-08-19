import { DragEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Toolbar } from "../components/Toolbar";

type Phase = "brief" | "integrate" | "propellant" | "checks" | "launch";
type PartId = "engine" | "tanks" | "avionics" | "payload";

const parts: { id: PartId; name: string; system: string; detail: string }[] = [
  { id: "engine", name: "Engine section", system: "Propulsion", detail: "Combustion chamber, turbopumps and nozzle" },
  { id: "tanks", name: "Propellant tanks", system: "Propulsion", detail: "Separate RP-1 fuel and LOX oxidizer tanks" },
  { id: "avionics", name: "Avionics ring", system: "Guidance", detail: "Flight computer, IMU and telemetry" },
  { id: "payload", name: "Payload + fairing", system: "Payload", detail: "Instrument payload inside an aerodynamic fairing" },
];

const checks = [
  ["imu", "GN&C / IMU alignment", "Inertial Measurement Unit reference aligned"],
  ["press", "Tank pressurization", "Propellant feed pressure is in launch band"],
  ["telemetry", "Telemetry link", "Vehicle data received by ground station"],
  ["afts", "AFTS armed", "Autonomous Flight Termination System ready"],
  ["range", "Range is green", "Launch area clear and weather within limits"],
] as const;

export function ProLabPage() {
  const [phase, setPhase] = useState<Phase>("brief");
  const [installed, setInstalled] = useState<PartId[]>([]);
  const [fuel, setFuel] = useState(0);
  const [lox, setLox] = useState(0);
  const [payload, setPayload] = useState(1200);
  const [verified, setVerified] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flightTime, setFlightTime] = useState(0);
  const [flightState, setFlightState] = useState<"pad" | "flight" | "orbit">("pad");

  const dryMass = 31_800 + payload;
  const propellantMass = Math.round((fuel / 100) * 119_000 + (lox / 100) * 291_000);
  const wetMass = dryMass + propellantMass;
  const thrust = 7_600_000;
  const twr = thrust / (wetMass * 9.80665);
  const deltaV = propellantMass > 0 ? 311 * 9.80665 * Math.log(wetMass / dryMass) : 0;
  const integrationComplete = installed.length === parts.length;
  const loadComplete = fuel >= 90 && lox >= 90;
  const checksComplete = verified.length === checks.length;

  const telemetry = useMemo(() => {
    if (flightState === "pad") return { altitude: 0, velocity: 0, acceleration: 0, downrange: 0 };
    if (flightState === "orbit") return { altitude: 200, velocity: 7.79, acceleration: 0, downrange: 1260 };
    const t = flightTime;
    return {
      altitude: Math.min(200, 0.035 * t * t + 0.42 * t),
      velocity: Math.min(7.79, 0.055 * t + 0.0025 * t * t),
      acceleration: Math.max(0.4, 1.15 + t * 0.012),
      downrange: Math.max(0, 0.014 * t * t),
    };
  }, [flightState, flightTime]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      setFlightState("flight");
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value === null ? null : value - 1), 800);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (flightState !== "flight") return;
    const timer = window.setInterval(() => {
      setFlightTime((time) => {
        const next = time + 1;
        if (next >= 165) setFlightState("orbit");
        return next;
      });
    }, 80);
    return () => window.clearInterval(timer);
  }, [flightState]);

  const install = (id: PartId) => {
    const expected = parts[installed.length]?.id;
    if (id === expected && !installed.includes(id)) setInstalled((current) => [...current, id]);
  };

  const dropPart = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    install(event.dataTransfer.getData("application/x-prolab-part") as PartId);
  };

  const resetMission = () => {
    setPhase("brief"); setInstalled([]); setFuel(0); setLox(0); setVerified([]);
    setCountdown(null); setFlightTime(0); setFlightState("pad");
  };

  const phases: { id: Phase; label: string; eyebrow: string; purpose: string; operator: string; evidence: string }[] = [
    { id: "brief", label: "Mission brief", eyebrow: "01", purpose: "Define the mission objective, operating limits and success criteria before any hardware is configured.", operator: "Review the complete sequence and understand what constitutes a safe, successful mission.", evidence: "Mission plan understood · target orbit confirmed" },
    { id: "integrate", label: "Vehicle integration", eyebrow: "02", purpose: "Create a continuous structural and functional launch stack from the thrust structure to the protected payload.", operator: "Install propulsion, tankage, avionics and payload systems in their required physical order.", evidence: "Four major systems integrated · load path closed" },
    { id: "propellant", label: "Propellant loading", eyebrow: "03", purpose: "Load the onboard fuel and oxidizer that the engine converts into thrust while preserving the planned mass ratio.", operator: "Command RP-1 and cryogenic LOX loading, then verify fill levels and liftoff thrust-to-weight ratio.", evidence: "Both tanks ≥ 90% · fill lines secured · T/W > 1" },
    { id: "checks", label: "Go / no-go", eyebrow: "04", purpose: "Demonstrate that navigation, propulsion support, telemetry and range-safety systems can protect the mission and the public.", operator: "Run each launch commit criterion and issue GO only when its independent verification passes.", evidence: "GN&C, pressure, telemetry, AFTS and range all GO" },
    { id: "launch", label: "Launch", eyebrow: "05", purpose: "Execute terminal count and continuously compare measured vehicle performance with the planned ascent profile.", operator: "Initiate launch, monitor telemetry and confirm insertion into the 200 km target orbit.", evidence: "Positive liftoff · stable ascent · target orbit achieved" },
  ];

  const unlocked = (id: Phase) => id === "brief" || id === "integrate" || (id === "propellant" && integrationComplete) || (id === "checks" && integrationComplete && loadComplete) || (id === "launch" && integrationComplete && loadComplete && checksComplete);
  const currentPhase = phases.find((item) => item.id === phase)!;

  return (
    <div className="pro-lab-page min-h-screen" data-ui-theme="dark">
      <Toolbar />
      <main id="content" className="pro-lab-shell">
        <header className="pro-lab-header">
          <div>
            <div className="pro-lab-kicker"><span>PRO LAB</span><i /> Mission PL-01</div>
            <h1>Build a launch vehicle.<br /><em>Fly the mission.</em></h1>
            <p>Integrate a two-propellant training vehicle, load RP-1 and liquid oxygen, complete the launch commit criteria, then fly to a 200 km target orbit.</p>
          </div>
          <div className="mission-patch" aria-label="Pro Lab mission patch"><span>PL</span><b>01</b><small>EARTH · 200 KM</small></div>
        </header>

        <nav className="pro-lab-steps" aria-label="Mission phases">
          {phases.map((item, index) => (
            <button key={item.id} disabled={!unlocked(item.id)} className={phase === item.id ? "active" : ""} onClick={() => setPhase(item.id)} title={item.purpose}>
              <small>{item.eyebrow}</small><span>{item.label}</span>
              {index < phases.length - 1 && <i />}
            </button>
          ))}
        </nav>

        <section className="step-purpose-panel" key={`purpose-${phase}`} aria-live="polite">
          <div className="purpose-index"><small>STEP</small><strong>{currentPhase.eyebrow}</strong><i /></div>
          <div><small>WHY THIS STEP EXISTS</small><p>{currentPhase.purpose}</p></div>
          <div><small>YOUR RESPONSIBILITY</small><p>{currentPhase.operator}</p></div>
          <div><small>COMPLETION EVIDENCE</small><p>{currentPhase.evidence}</p></div>
          <span className="purpose-scan" />
        </section>

        {phase === "brief" && (
          <section className="pro-brief pro-panel phase-stage" key="brief-stage">
            <div className="pro-section-copy">
              <span className="section-number">01 / MISSION BRIEF</span>
              <h2>Your path to the pad</h2>
              <p>This lab mirrors the logic of launch operations while keeping the vehicle manageable. Every action uses standard aerospace terminology; values are simplified for learning.</p>
              <button className="pro-primary" onClick={() => setPhase("integrate")}>Begin vehicle integration <span>→</span></button>
            </div>
            <div className="procedure-grid">
              <PhaseReference src="/pro-lab/launch-pad.png" eyebrow="MISSION ORIENTATION" title="High-desert launch complex" detail="Pad systems, service tower, umbilicals and cleared safety perimeter" />
              {[
                ["A", "Integrate", "Build from the engine section upward. Structure, propulsion, guidance and payload form the launch vehicle."],
                ["B", "Load", "Fill the RP-1 fuel tank and LOX oxidizer tank. A rocket carries oxidizer; it does not use atmospheric oxygen."],
                ["C", "Verify", "Poll guidance, tank pressure, telemetry, range safety and the Autonomous Flight Termination System."],
                ["D", "Launch", "Enter terminal count, release hold-downs and monitor altitude, velocity, acceleration and downrange distance."],
              ].map(([mark, title, text]) => <article key={mark}><b>{mark}</b><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </section>
        )}

        {phase === "integrate" && (
          <section className="pro-workspace phase-stage" key="integration-stage">
            <div className="parts-rack pro-panel">
              <span className="section-number">COMPONENT RACK</span>
              <h2>Select in stack order</h2>
              <p className="microcopy">Drag a component to the integration stand, or click it. Start at the thrust structure.</p>
              <div className="parts-list">
                {parts.map((part, index) => {
                  const done = installed.includes(part.id); const next = index === installed.length;
                  return <button key={part.id} draggable={!done && next} disabled={done || !next} className={done ? "installed" : next ? "next" : ""}
                    onDragStart={(event) => event.dataTransfer.setData("application/x-prolab-part", part.id)} onClick={() => install(part.id)}>
                    <span className={`part-symbol ${part.id}`} /><span><small>{part.system}</small><strong>{part.name}</strong><em>{part.detail}</em></span><b>{done ? "✓" : String(index + 1).padStart(2, "0")}</b>
                  </button>;
                })}
              </div>
            </div>
            <div className="integration-bay pro-panel" onDragOver={(event) => event.preventDefault()} onDrop={dropPart}>
              <div className="bay-label"><span>VEHICLE INTEGRATION BAY</span><strong>{installed.length} / 4 SYSTEMS</strong></div>
              <div className="phase-reference-stack">
                <PhaseReference src="/pro-lab/vehicle-cutaway.png" eyebrow="ENGINEERING REFERENCE" title="Integrated vehicle cutaway" detail="Payload · avionics · LOX · RP-1 · feed system · engine" portrait />
                {!integrationComplete && <RocketVisual installed={installed} state="assembly" />}
              </div>
              {!integrationComplete ? <div className="drop-callout">↓ DROP {parts[installed.length]?.name.toUpperCase()} HERE</div> : <button className="pro-primary" onClick={() => setPhase("propellant")}>Proceed to propellant loading →</button>}
            </div>
          </section>
        )}

        {phase === "propellant" && (
          <section className="pro-workspace propellant-workspace phase-stage" key="propellant-stage">
            <div className="pro-panel load-console">
              <span className="section-number">GROUND SUPPORT EQUIPMENT</span><h2>Propellant loading</h2>
              <p className="microcopy">Drag each loading command toward FULL. RP-1 is refined kerosene fuel. Cryogenic LOX is the oxidizer.</p>
              <PropellantControl label="RP-1 fuel" sublabel="Rocket Propellant-1" value={fuel} setValue={setFuel} color="#ffad45" mass="119,000 kg at 100%" />
              <PropellantControl label="LOX oxidizer" sublabel="Liquid oxygen · cryogenic" value={lox} setValue={setLox} color="#47c8ff" mass="291,000 kg at 100%" />
              <div className="load-note"><b>Why two tanks?</b><span>Fuel releases chemical energy; oxidizer supports combustion. Both are propellants.</span></div>
            </div>
            <div className="pro-panel vehicle-status">
              <div className="bay-label"><span>VEHICLE MASS MODEL</span><strong>{Math.round(wetMass / 1000).toLocaleString()} t WET MASS</strong></div>
              <div className="phase-reference-stack fuel-reference-stack">
                <PhaseReference src="/pro-lab/propellant-loading.png" eyebrow="LIVE PAD REFERENCE" title="Ground-support propellant loading" detail="Cryogenic transfer lines · umbilicals · controlled LOX venting" />
                <RocketVisual installed={installed} state="fuel" fuel={fuel} lox={lox} />
              </div>
              <div className="performance-strip">
                <Metric label="Sea-level thrust" value="7.60 MN" />
                <Metric label="T/W at liftoff" value={`${twr.toFixed(2)} : 1`} ok={twr > 1} />
                <Metric label="Ideal Δv" value={`${(deltaV / 1000).toFixed(2)} km/s`} />
              </div>
              {loadComplete && <button className="pro-primary" onClick={() => setPhase("checks")}>Secure fill lines · Start checks →</button>}
            </div>
          </section>
        )}

        {phase === "checks" && (
          <section className="pro-workspace checks-workspace phase-stage" key="checks-stage">
            <div className="pro-panel commit-board">
              <span className="section-number">LAUNCH COMMIT CRITERIA</span><h2>Go / no-go poll</h2>
              <p className="microcopy">Run each verification. A failed critical criterion would hold or scrub the launch.</p>
              <div className="check-list">
                {checks.map(([id, label, detail], index) => { const done = verified.includes(id); return <button key={id} className={done ? "verified" : ""} onClick={() => !done && setVerified((current) => [...current, id])}>
                  <b>{String(index + 1).padStart(2, "0")}</b><span><strong>{label}</strong><small>{detail}</small></span><em>{done ? "GO" : "VERIFY"}</em>
                </button>; })}
              </div>
            </div>
            <div className="pro-panel readiness-card">
              <PhaseReference src="/pro-lab/avionics-checkout.png" eyebrow="CHECKOUT REFERENCE" title="Launch-vehicle avionics bay" detail="Redundant flight computers · IMU · telemetry · harness continuity" />
              <div className={`readiness-ring ${checksComplete ? "go" : ""}`}><strong>{Math.round((verified.length / checks.length) * 100)}%</strong><span>FLIGHT READY</span></div>
              <h3>{checksComplete ? "Vehicle is GO" : "Poll in progress"}</h3>
              <p>{checksComplete ? "All simulated launch commit criteria are green. The vehicle may enter terminal count." : `${checks.length - verified.length} critical verification${checks.length - verified.length === 1 ? "" : "s"} remain.`}</p>
              {checksComplete && <button className="pro-primary" onClick={() => setPhase("launch")}>Proceed to launch control →</button>}
            </div>
          </section>
        )}

        {phase === "launch" && (
          <section className="launch-deck pro-panel phase-stage" key="launch-stage">
            <div
              className={`launch-sky launch-sky-${flightState}`}
              style={{ backgroundImage: `linear-gradient(rgba(2, 8, 13, ${flightState === "pad" ? ".16" : ".28"}), rgba(2, 8, 13, ${flightState === "pad" ? ".38" : ".2"})), url(${flightState === "pad" ? "/pro-lab/launch-pad.png" : "/pro-lab/powered-ascent.png"})` }}
              role="img"
              aria-label={flightState === "pad" ? "Launch vehicle on a high-desert pad before liftoff" : "Launch vehicle climbing above the cloud layer"}
            >
              <div className="orbit-line" /><div className="earth-limb" />
              {countdown !== null && <div className="pad-live-indicator"><i /> LIVE PAD CAMERA</div>}
              {countdown !== null && <div className="countdown-display"><small>TERMINAL COUNT</small><strong>T−{countdown}</strong></div>}
              {flightState === "orbit" && <div className="orbit-achieved"><small>MISSION PL-01</small><strong>ORBIT ACHIEVED</strong><span>200 km circular target · simulated</span></div>}
            </div>
            <div className="launch-console">
              <div><span className="section-number">FLIGHT TELEMETRY</span><h2>{flightState === "pad" ? "Awaiting launch commit" : flightState === "orbit" ? "Payload orbit insertion" : `MET +${String(flightTime).padStart(3, "0")} s`}</h2></div>
              <div className="telemetry-grid"><Metric label="Altitude" value={`${telemetry.altitude.toFixed(1)} km`} /><Metric label="Velocity" value={`${telemetry.velocity.toFixed(2)} km/s`} /><Metric label="Acceleration" value={`${telemetry.acceleration.toFixed(2)} g`} /><Metric label="Downrange" value={`${telemetry.downrange.toFixed(0)} km`} /></div>
              {flightState === "pad" && countdown === null && <button className="launch-button" onClick={() => setCountdown(10)}><span>ARMED</span><strong>INITIATE LAUNCH</strong><small>Starts terminal count</small></button>}
              {flightState === "orbit" && <div className="mission-actions"><button className="pro-primary" onClick={resetMission}>Run mission again</button><Link to="/experiments" className="pro-secondary">Explore more labs</Link></div>}
              <p className="simulation-notice">Educational simulation · ascent telemetry is illustrative, not a flight-certified prediction.</p>
            </div>
          </section>
        )}

        <footer className="pro-lab-sources"><span>TERMINOLOGY REFERENCES</span><a href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/rocket-parts/" target="_blank" rel="noreferrer">NASA · Rocket systems ↗</a><a href="https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/ideal-rocket-equation/" target="_blank" rel="noreferrer">NASA · Ideal rocket equation ↗</a><a href="https://www.nasa.gov/missions/artemis/orion/artemis-i-launch-countdown-101/" target="_blank" rel="noreferrer">NASA · Launch countdown ↗</a></footer>
      </main>
    </div>
  );
}

function PropellantControl({ label, sublabel, value, setValue, color, mass }: { label: string; sublabel: string; value: number; setValue: (v: number) => void; color: string; mass: string }) {
  return <label className="prop-control" style={{ "--prop-color": color } as React.CSSProperties}><span><strong>{label}</strong><small>{sublabel}</small></span><b>{value}%</b><input type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} aria-label={`Load ${label}`} /><em><i style={{ width: `${value}%` }} />{mass}</em></label>;
}

function Metric({ label, value, ok }: { label: string; value: string; ok?: boolean }) { return <div className="pro-metric"><small>{label}</small><strong>{value}</strong>{ok !== undefined && <span className={ok ? "ok" : "bad"}>{ok ? "GO" : "NO-GO"}</span>}</div>; }

function PhaseReference({ src, eyebrow, title, detail, portrait = false }: { src: string; eyebrow: string; title: string; detail: string; portrait?: boolean }) {
  return <figure className={`phase-reference ${portrait ? "portrait" : ""}`}>
    <img src={src} alt={`${title}: ${detail}`} />
    <figcaption><small>{eyebrow}</small><strong>{title}</strong><span>{detail}</span></figcaption>
    <i>REFERENCE / SIM</i>
  </figure>;
}

function RocketVisual({ installed, state, fuel = 0, lox = 0 }: { installed: PartId[]; state: "assembly" | "fuel" | "launch"; fuel?: number; lox?: number }) {
  return <div className={`rocket-visual ${state}`} aria-label="Assembled launch vehicle illustration">
    {installed.includes("payload") && <div className="rocket-fairing"><i /></div>}
    {installed.includes("avionics") && <div className="rocket-avionics"><i /><i /><i /></div>}
    {installed.includes("tanks") && <div className="rocket-tanks"><span className="lox-fill" style={{ height: `${lox}%` }} /><span className="fuel-fill" style={{ height: `${fuel}%` }} /><i>LOX</i><i>RP-1</i></div>}
    {installed.includes("engine") && <div className="rocket-engine"><span /><span /><span /></div>}
    {state === "launch" && <div className="engine-plume"><i /><i /></div>}
  </div>;
}
