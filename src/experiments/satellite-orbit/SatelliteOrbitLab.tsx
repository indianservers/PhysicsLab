import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Application, Assets, Container, FederatedPointerEvent, Graphics, Sprite, Texture } from "pixi.js";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { PixiStage, type PixiSceneController } from "../shared-2d/PixiStage";
import {
  buildSpeedCurves,
  deriveOrbit,
  EARTH_RADIUS,
  initialOrbitState,
  type OrbitDerived,
  type OrbitVectorState,
  type SatelliteOrbitInput,
  stepOrbit,
} from "./satelliteOrbitPhysics";
import "./satellite-orbit.css";

const ASSET_ROOT = "/assets/experiments/satellite-orbit";
const DEFAULT_INPUT: SatelliteOrbitInput = {
  planetMassEarths: 1,
  altitudeKm: 700,
  launchSpeedKmS: 7.49,
  directionDeg: 0,
  satelliteMassKg: 500,
};

type RunState = "idle" | "running" | "paused" | "result";

export function SatelliteOrbitLab({ experiment }: DedicatedExperimentLabProps) {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [vectorState, setVectorState] = useState(() => initialOrbitState(DEFAULT_INPUT));
  const [trail, setTrail] = useState<OrbitVectorState[]>(() => [initialOrbitState(DEFAULT_INPUT)]);
  const [runState, setRunState] = useState<RunState>("idle");
  const [playback, setPlayback] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  const [resetViewSignal, setResetViewSignal] = useState(0);
  const [mission, setMission] = useState({ circular: false, escape: false });
  const [prediction, setPrediction] = useState<"collision" | "orbit" | "escape" | "">("");
  const [predictionFeedback, setPredictionFeedback] = useState("");
  const lastFrameRef = useRef<number | null>(null);
  const inputRef = useRef(input);
  const stateRef = useRef(vectorState);
  const runRef = useRef(runState);
  const playbackRef = useRef(playback);
  const derived = useMemo(() => deriveOrbit(input, vectorState), [input, vectorState]);
  const launchDerived = useMemo(() => deriveOrbit(input, initialOrbitState(input)), [input]);

  useEffect(() => { inputRef.current = input; }, [input]);
  useEffect(() => { stateRef.current = vectorState; }, [vectorState]);
  useEffect(() => { runRef.current = runState; }, [runState]);
  useEffect(() => { playbackRef.current = playback; }, [playback]);

  useEffect(() => {
    let animationFrame = 0;
    const frame = (time: number) => {
      const previous = lastFrameRef.current ?? time;
      lastFrameRef.current = time;
      if (runRef.current === "running") {
        const simulatedSeconds = Math.min(45, ((time - previous) / 1000) * 900 * playbackRef.current);
        const substeps = Math.max(1, Math.ceil(simulatedSeconds / 3));
        let next = stateRef.current;
        for (let i = 0; i < substeps; i += 1) next = stepOrbit(next, inputRef.current, simulatedSeconds / substeps);
        stateRef.current = next;
        setVectorState(next);
        if (!reducedMotion || Math.floor(next.elapsed) % 120 < 5) {
          setTrail((points) => [...points.slice(-419), next]);
        }
        const live = deriveOrbit(inputRef.current, next);
        const radius = Math.hypot(next.x, next.y);
        if (radius <= EARTH_RADIUS || (live.specificEnergy >= 0 && radius > (EARTH_RADIUS + inputRef.current.altitudeKm * 1000) * 3.2)) {
          setRunState("result");
          runRef.current = "result";
        }
      }
      animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [reducedMotion]);

  useEffect(() => {
    if (runState === "idle") return;
    if (launchDerived.regime === "circular") setMission((value) => ({ ...value, circular: true }));
    const atChallengeAltitude = Math.abs(input.altitudeKm - 400) <= 5;
    const atEscapeThreshold = Math.abs(input.launchSpeedKmS * 1000 - launchDerived.escapeSpeed) / launchDerived.escapeSpeed <= 0.012;
    if (mission.circular && atChallengeAltitude && atEscapeThreshold && Math.abs(input.directionDeg) <= 1) {
      setMission({ circular: true, escape: true });
    }
  }, [input, launchDerived, mission.circular, runState]);

  const resetTrajectory = (nextInput = input, nextState: RunState = "idle") => {
    const initial = initialOrbitState(nextInput);
    inputRef.current = nextInput;
    stateRef.current = initial;
    runRef.current = nextState;
    setInput(nextInput);
    setVectorState(initial);
    setTrail([initial]);
    setRunState(nextState);
    lastFrameRef.current = null;
  };

  const updateInput = <K extends keyof SatelliteOrbitInput>(key: K, value: SatelliteOrbitInput[K]) => {
    resetTrajectory({ ...input, [key]: value });
  };

  const applyPreset = (kind: "leo" | "geo" | "escape") => {
    if (kind === "leo") {
      const next = { ...input, planetMassEarths: 1, altitudeKm: 400, launchSpeedKmS: 7.67, directionDeg: 0 };
      resetTrajectory(next);
    } else if (kind === "geo") {
      const next = { ...input, planetMassEarths: 1, altitudeKm: 35_786, launchSpeedKmS: 3.07, directionDeg: 0 };
      resetTrajectory(next);
    } else {
      const base = { ...input, planetMassEarths: 1, altitudeKm: 400, directionDeg: 0 };
      const threshold = deriveOrbit(base, initialOrbitState(base)).escapeSpeed / 1000;
      resetTrajectory({ ...base, launchSpeedKmS: Number(threshold.toFixed(3)) });
    }
  };

  const stepOnce = () => {
    let next = vectorState;
    for (let i = 0; i < 10; i += 1) next = stepOrbit(next, input, 3);
    setVectorState(next);
    stateRef.current = next;
    setTrail((points) => [...points, next]);
    setRunState("paused");
    runRef.current = "paused";
  };

  const status = statusCopy(launchDerived.regime);
  const play = () => {
    if (prediction) {
      const actual = launchDerived.regime === "collision" ? "collision" : launchDerived.regime === "escape" ? "escape" : "orbit";
      setPredictionFeedback(prediction === actual ? `Prediction confirmed: ${status.toLowerCase()}.` : `Observe the trail: this launch produces ${status.toLowerCase()}.`);
    }
    setRunState("running");
    runRef.current = "running";
  };

  return (
    <section className="satellite-lab" aria-label={`${experiment.title} interactive laboratory`} data-run-state={runState} data-regime={launchDerived.regime}>
      <header className="satellite-lab-head">
        <div>
          <span>ASTRONOMY · CLASS 11</span>
          <h2>Satellite Orbit &amp; Escape Speed</h2>
          <p>Change launch conditions, then watch gravity bend the path.</p>
        </div>
        <div className={`satellite-status satellite-status-${launchDerived.regime}`} role="status" aria-live="polite">
          <i /> {status}
        </div>
      </header>

      <div className="satellite-primary-grid">
        <div className="satellite-stage-card">
          <div className="satellite-legend" aria-label="Trajectory legend">
            <span><i className="legend-suborbital" />Collision path</span>
            <span><i className="legend-orbit" />Bound orbit</span>
            <span><i className="legend-escape" />Escape path</span>
          </div>
          <SatelliteScene
            input={input}
            state={vectorState}
            derived={derived}
            trail={trail}
            running={runState === "running"}
            reducedMotion={reducedMotion}
            resetViewSignal={resetViewSignal}
            onInput={(patch) => resetTrajectory({ ...inputRef.current, ...patch })}
          />
          <div className="satellite-stage-help">Drag satellite to place · Drag orange handle to launch · Wheel to zoom</div>
        </div>

        <aside className="satellite-controls" aria-label="Satellite launch controls">
          <div className="satellite-panel-title"><h3>Controls</h3><button type="button" onClick={() => setResetViewSignal((value) => value + 1)}>Reset view</button></div>
          <OrbitSlider label="Launch speed" symbol="v₀" value={input.launchSpeedKmS} min={0} max={30} step={0.01} unit="km/s" accent="orange" onChange={(value) => updateInput("launchSpeedKmS", value)} />
          <OrbitSlider label="Altitude" symbol="h" value={input.altitudeKm} min={200} max={36000} step={10} unit="km" accent="blue" onChange={(value) => updateInput("altitudeKm", value)} />
          <OrbitSlider label="Planet mass" symbol="M" value={input.planetMassEarths} min={0.2} max={3} step={0.05} unit="M⊕" accent="green" onChange={(value) => updateInput("planetMassEarths", value)} />
          <OrbitSlider label="Satellite mass" symbol="m" value={input.satelliteMassKg} min={100} max={10000} step={100} unit="kg" accent="green" onChange={(value) => updateInput("satelliteMassKg", value)} />
          <OrbitSlider label="Launch direction" symbol="θ" value={input.directionDeg} min={-90} max={90} step={1} unit="°" accent="purple" onChange={(value) => updateInput("directionDeg", value)} />

          <div className="satellite-presets" aria-label="Orbit presets">
            <button type="button" onClick={() => applyPreset("leo")}><strong>Low Earth Orbit</strong><small>400 km · 7.67 km/s</small></button>
            <button type="button" onClick={() => applyPreset("geo")}><strong>Geostationary</strong><small>35,786 km · 3.07 km/s</small></button>
            <button type="button" onClick={() => applyPreset("escape")}><strong>Escape</strong><small>400 km · {speed(deriveOrbit({ ...input, planetMassEarths: 1, altitudeKm: 400 }, initialOrbitState({ ...input, planetMassEarths: 1, altitudeKm: 400 })).escapeSpeed)}</small></button>
          </div>

          <div className="satellite-playback" aria-label="Simulation controls">
            <button className="satellite-primary-button" type="button" onClick={play}>▶ {runState === "paused" ? "Resume" : runState === "result" ? "Replay" : "Play"}</button>
            <button type="button" onClick={() => { setRunState("paused"); runRef.current = "paused"; }} disabled={runState !== "running"}>Ⅱ Pause</button>
            <button type="button" onClick={stepOnce}>▮▶ Step</button>
            <button type="button" onClick={() => resetTrajectory(DEFAULT_INPUT)}>↻ Reset</button>
          </div>
          <label className="satellite-select-label">Playback speed
            <select value={playback} onChange={(event) => setPlayback(Number(event.target.value))}>
              {[0.25, 0.5, 1, 1.5, 2].map((value) => <option key={value} value={value}>{value}×</option>)}
            </select>
          </label>
          <label className="satellite-motion-toggle"><input type="checkbox" checked={reducedMotion} onChange={(event) => setReducedMotion(event.target.checked)} /> Reduced motion</label>
        </aside>
      </div>

      <div className="satellite-data-grid">
        <Measurements derived={derived} input={input} />
        <SpeedGraph input={input} derived={launchDerived} />
        <section className="satellite-formula-card">
          <h3>Physics explained</h3>
          <div className="satellite-equations"><span>v<sub>orbit</sub> = √(GM/r)</span><span>v<sub>escape</sub> = √(2GM/r)</span></div>
          <dl><dt>G</dt><dd>6.67430 × 10⁻¹¹ N·m²/kg²</dd><dt>M</dt><dd>{input.planetMassEarths.toFixed(2)} Earth masses</dd><dt>r</dt><dd>{(EARTH_RADIUS / 1000 + input.altitudeKm).toLocaleString()} km from centre</dd></dl>
          <p>At one radius, escape speed is √2 times circular speed. Satellite mass cancels from both.</p>
        </section>
      </div>

      <div className="satellite-learning-grid">
        <article><span>◎</span><div><h3>Predict the launch</h3><p>Commit before pressing Play.</p><div className="satellite-predictions" role="group" aria-label="Launch prediction">{(["collision","orbit","escape"] as const).map(value => <button type="button" aria-pressed={prediction === value} onClick={() => { setPrediction(value); setPredictionFeedback(""); }} key={value}>{value}</button>)}</div>{predictionFeedback && <small aria-live="polite">{predictionFeedback}</small>}</div></article>
        <article><span>◌</span><div><h3>Observation prompt</h3><p>How do the path and total energy change as launch speed rises?</p></div></article>
        <article className={mission.escape ? "mission-complete" : ""}><span>♜</span><div><h3>Challenge</h3><p>{mission.escape ? "Mission complete: circular orbit and minimum escape found." : mission.circular ? "Circular orbit found. Now use Escape at 400 km and press Play." : "First place the satellite in circular orbit; then find minimum escape speed at 400 km."}</p></div></article>
      </div>
      <p className="satellite-sr-summary" aria-live="polite">{status}. Radius {(derived.radius / 1000).toFixed(0)} kilometres, speed {(derived.speed / 1000).toFixed(2)} kilometres per second, total energy {scientific(derived.totalEnergy)} joules, eccentricity {derived.eccentricity.toFixed(3)}.</p>
    </section>
  );
}

function OrbitSlider({ label, symbol, value, min, max, step, unit, accent, onChange }: { label: string; symbol: string; value: number; min: number; max: number; step: number; unit: string; accent: string; onChange: (value: number) => void }) {
  return <label className={`satellite-control satellite-control-${accent}`}>
    <span><strong>{label} <em>{symbol}</em></strong><span className="satellite-number-wrap"><input aria-label={`${label} value`} type="number" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Math.max(min, Math.min(max, Number(event.target.value))))} /><small>{unit}</small></span></span>
    <input aria-label={label} type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    <small><span>{min.toLocaleString()} {unit}</span><span>{max.toLocaleString()} {unit}</span></small>
  </label>;
}

function Measurements({ derived, input }: { derived: OrbitDerived; input: SatelliteOrbitInput }) {
  const items = [
    ["Orbital radius", `${(derived.radius / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km`],
    ["Speed", `${(derived.speed / 1000).toFixed(2)} km/s`],
    ["Orbital period", `${(derived.period / 60).toFixed(1)} min`],
    ["Gravity", `${derived.acceleration.toFixed(2)} m/s²`],
    ["Kinetic energy", `${scientific(derived.kineticEnergy)} J`],
    ["Potential energy", `${scientific(derived.potentialEnergy)} J`],
    ["Total energy", `${scientific(derived.totalEnergy)} J`],
    ["Specific energy", `${scientific(derived.specificEnergy)} J/kg`],
    ["Angular momentum", `${scientific(derived.angularMomentum * input.satelliteMassKg)} kg·m²/s`],
    ["Eccentricity", `${derived.eccentricity.toFixed(3)} (${derived.regime})`],
  ];
  return <section className="satellite-measurements"><h3>Live measurements</h3><div>{items.map(([label, value]) => <dl key={label}><dt>{label}</dt><dd>{value}</dd></dl>)}</div><div className="energy-meter"><span>Negative · bound</span><i style={{ left: `${Math.max(2, Math.min(98, 50 + (derived.specificEnergy / Math.max(1, derived.escapeSpeed ** 2)) * 100))}%` }} /><span>Positive · unbound</span></div></section>;
}

function SpeedGraph({ input, derived }: { input: SatelliteOrbitInput; derived: OrbitDerived }) {
  const points = useMemo(() => buildSpeedCurves(input.planetMassEarths), [input.planetMassEarths]);
  const width = 460, height = 205, left = 42, right = 12, top = 20, bottom = 35;
  const x = (altitude: number) => left + (Math.log10(altitude) - Math.log10(200)) / (Math.log10(36000) - Math.log10(200)) * (width - left - right);
  const maxSpeed = Math.max(16, points[0].escapeKmS * 1.08);
  const y = (value: number) => top + (1 - value / maxSpeed) * (height - top - bottom);
  const line = (key: "circularKmS" | "escapeKmS") => points.map((point, index) => `${index ? "L" : "M"}${x(point.altitudeKm).toFixed(1)},${y(point[key]).toFixed(1)}`).join(" ");
  return <section className="satellite-graph"><h3>Orbital &amp; escape speed vs. altitude</h3><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Orbital and escape speed decrease as altitude increases">
    {[0, 5, 10, 15, 20].filter((tick) => tick <= maxSpeed).map((tick) => <g key={tick}><line x1={left} x2={width-right} y1={y(tick)} y2={y(tick)} /><text x={left-7} y={y(tick)+4} textAnchor="end">{tick}</text></g>)}
    <path className="graph-orbit-line" d={line("circularKmS")} /><path className="graph-escape-line" d={line("escapeKmS")} />
    <line className="graph-current-line" x1={x(input.altitudeKm)} x2={x(input.altitudeKm)} y1={top} y2={height-bottom} />
    <circle className="graph-orbit-dot" cx={x(input.altitudeKm)} cy={y(derived.circularSpeed/1000)} r="5" /><circle className="graph-escape-dot" cx={x(input.altitudeKm)} cy={y(derived.escapeSpeed/1000)} r="5" />
    <text x={left} y={height-8}>200 km</text><text x={width-right} y={height-8} textAnchor="end">36,000 km</text>
  </svg><div><span><i className="graph-key-orbit" />Orbital speed</span><span><i className="graph-key-escape" />Escape speed</span></div></section>;
}

interface SatelliteSceneProps {
  input: SatelliteOrbitInput;
  state: OrbitVectorState;
  derived: OrbitDerived;
  trail: OrbitVectorState[];
  running: boolean;
  reducedMotion: boolean;
  resetViewSignal: number;
  onInput: (patch: Partial<SatelliteOrbitInput>) => void;
}

function SatelliteScene(props: SatelliteSceneProps) {
  const createScene = useCallback((app: Application, initial: SatelliteSceneProps): PixiSceneController<SatelliteSceneProps> => {
    const viewport = new Container();
    const stars = new Graphics();
    const trajectory = new Graphics();
    const vectors = new Graphics();
    const orbitGuide = new Graphics();
    const satelliteHit = new Graphics();
    const velocityHit = new Graphics();
    viewport.addChild(stars, orbitGuide, trajectory, vectors);
    app.stage.addChild(viewport);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;

    for (let index = 0; index < 150; index += 1) {
      const x = (index * 173.17) % 760;
      const y = (index * index * 17.31 + 29) % 430;
      const radius = index % 13 === 0 ? 1.4 : 0.65;
      stars.circle(x, y, radius).fill({ color: 0xdff7ff, alpha: 0.35 + (index % 5) * 0.1 });
    }

    let earth: Sprite | undefined;
    let satellite: Sprite | undefined;
    let latest = initial;
    let width = 760;
    let height = 430;
    let zoom = 1;
    let resetSeen = initial.resetViewSignal;
    let drag: "satellite" | "velocity" | "pan" | null = null;
    let panStart = { x: 0, y: 0, px: 0, py: 0 };

    void Promise.all([
      Assets.load<Texture>(`${ASSET_ROOT}/sprites/earth.png`),
      Assets.load<Texture>(`${ASSET_ROOT}/sprites/satellite.png`),
    ]).then(([earthTexture, satelliteTexture]) => {
      earth = new Sprite(earthTexture);
      earth.anchor.set(0.5);
      earth.width = 250;
      earth.height = 242;
      earth.position.set(350, 218);
      satellite = new Sprite(satelliteTexture);
      satellite.anchor.set(0.5);
      satellite.width = 92;
      satellite.height = 61;
      satellite.eventMode = "static";
      satellite.cursor = "grab";
      satellite.on("pointerdown", (event: FederatedPointerEvent) => {
        event.stopPropagation();
        drag = "satellite";
      });
      viewport.addChildAt(earth, 2);
      viewport.addChildAt(satellite, viewport.children.indexOf(vectors));
      viewport.addChild(satelliteHit, velocityHit);
      draw(latest);
    });

    satelliteHit.eventMode = "static";
    satelliteHit.cursor = "grab";
    satelliteHit.on("pointerdown", (event: FederatedPointerEvent) => {
      event.stopPropagation();
      drag = "satellite";
    });
    velocityHit.eventMode = "static";
    velocityHit.cursor = "crosshair";
    velocityHit.on("pointerdown", (event: FederatedPointerEvent) => {
      event.stopPropagation();
      drag = "velocity";
    });
    app.stage.on("pointerdown", (event: FederatedPointerEvent) => {
      drag = "pan";
      panStart = { x: event.global.x, y: event.global.y, px: viewport.x, py: viewport.y };
    });
    app.stage.on("globalpointermove", (event: FederatedPointerEvent) => {
      if (!drag) return;
      if (drag === "pan") {
        viewport.position.set(panStart.px + event.global.x - panStart.x, panStart.py + event.global.y - panStart.y);
        return;
      }
      const local = viewport.toLocal(event.global);
      const dx = local.x - 350;
      const dy = -(local.y - 218);
      if (drag === "satellite") {
        const radiusPx = Math.max(130, Math.min(275, Math.hypot(dx, dy)));
        const ratio = (radiusPx - 130) / 145;
        const altitudeKm = 200 * (36_000 / 200) ** ratio;
        latest.onInput({ altitudeKm: Math.round(altitudeKm / 10) * 10, launchPositionDeg: Math.atan2(dy, dx) * 180 / Math.PI });
      } else {
        const satellitePoint = scenePoint(latest.state, latest.input);
        const vx = local.x - satellitePoint.x;
        const vy = -(local.y - satellitePoint.y);
        const radialAngle = Math.atan2(latest.state.y, latest.state.x);
        const velocityAngle = Math.atan2(vy, vx);
        const tangentAngle = radialAngle + Math.PI / 2;
        const directionDeg = normalizeSignedDegrees((velocityAngle - tangentAngle) * 180 / Math.PI);
        const launchSpeedKmS = Math.max(0, Math.min(30, Math.hypot(vx, vy) / 10));
        latest.onInput({ directionDeg: Math.max(-90, Math.min(90, directionDeg)), launchSpeedKmS: Number(launchSpeedKmS.toFixed(2)) });
      }
    });
    const endDrag = () => { drag = null; };
    app.stage.on("pointerup", endDrag);
    app.stage.on("pointerupoutside", endDrag);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      zoom = Math.max(0.7, Math.min(1.8, zoom * Math.exp(-event.deltaY * 0.001)));
      fit();
    };
    app.canvas.addEventListener("wheel", wheel, { passive: false });

    const fit = () => {
      const scale = Math.min(width / 760, height / 430) * zoom;
      viewport.scale.set(scale);
      if (!drag) viewport.position.set((width - 760 * scale) / 2, (height - 430 * scale) / 2);
    };

    const draw = (next: SatelliteSceneProps) => {
      latest = next;
      if (next.resetViewSignal !== resetSeen) {
        resetSeen = next.resetViewSignal;
        zoom = 1;
        fit();
      }
      const point = scenePoint(next.state, next.input);
      const scale = visualRadius(next.input.altitudeKm) / (EARTH_RADIUS + next.input.altitudeKm * 1000);
      orbitGuide.clear();
      orbitGuide.circle(350, 218, visualRadius(next.input.altitudeKm)).stroke({ color: 0x7ee787, width: 1.5, alpha: 0.35 });
      trajectory.clear();
      if (next.trail.length > 1) {
        next.trail.forEach((sample, index) => {
          const p = { x: 350 + sample.x * scale, y: 218 - sample.y * scale };
          if (index === 0) trajectory.moveTo(p.x, p.y); else trajectory.lineTo(p.x, p.y);
        });
        trajectory.stroke({ color: regimeColor(next.derived.regime), width: 3, alpha: 0.92 });
      }
      if (satellite) {
        satellite.position.set(point.x, point.y);
        satellite.rotation = -Math.atan2(next.state.vy, next.state.vx);
        satellite.alpha = next.derived.radius <= EARTH_RADIUS ? 0.45 : 1;
      }
      satelliteHit.clear().circle(point.x, point.y, 34).fill({ color: 0xffffff, alpha: 0.001 });
      const velocityLength = Math.max(38, Math.min(150, next.derived.speed / 100));
      const speed = Math.max(1, next.derived.speed);
      const velocityEnd = { x: point.x + next.state.vx / speed * velocityLength, y: point.y - next.state.vy / speed * velocityLength };
      const gravityLength = Math.max(34, Math.min(95, next.derived.acceleration * 6));
      const radius = Math.max(1, next.derived.radius);
      const gravityEnd = { x: point.x - next.state.x / radius * gravityLength, y: point.y + next.state.y / radius * gravityLength };
      vectors.clear();
      drawArrow(vectors, point.x, point.y, velocityEnd.x, velocityEnd.y, 0xfb923c);
      drawArrow(vectors, point.x, point.y, gravityEnd.x, gravityEnd.y, 0xfacc15);
      velocityHit.clear().circle(velocityEnd.x, velocityEnd.y, 16).fill({ color: 0xfb923c, alpha: 0.9 }).circle(velocityEnd.x, velocityEnd.y, 23).stroke({ color: 0xffffff, width: 2, alpha: 0.8 });
    };

    return {
      update: draw,
      resize: (nextWidth, nextHeight) => { width = nextWidth; height = nextHeight; fit(); },
      destroy: () => app.canvas.removeEventListener("wheel", wheel),
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const patch: Partial<SatelliteOrbitInput> = {};
    if (event.key === "ArrowUp") patch.launchSpeedKmS = Math.min(30, props.input.launchSpeedKmS + (event.shiftKey ? 0.01 : 0.1));
    if (event.key === "ArrowDown") patch.launchSpeedKmS = Math.max(0, props.input.launchSpeedKmS - (event.shiftKey ? 0.01 : 0.1));
    if (event.key === "ArrowLeft") patch.directionDeg = Math.max(-90, props.input.directionDeg - 1);
    if (event.key === "ArrowRight") patch.directionDeg = Math.min(90, props.input.directionDeg + 1);
    if (Object.keys(patch).length) { event.preventDefault(); props.onInput(patch); }
  };

  return <PixiStage className="satellite-three-scene satellite-two-d-scene" ariaLabel="Interactive two-dimensional orbital launch stage. Drag the satellite to place it. Drag the orange velocity handle to choose launch speed and direction." sceneProps={props} createScene={createScene} onKeyDown={onKeyDown} />;
}

function visualRadius(altitudeKm: number) {
  return 130 + Math.log(Math.max(200, altitudeKm) / 200) / Math.log(36_000 / 200) * 145;
}

function scenePoint(state: OrbitVectorState, input: SatelliteOrbitInput) {
  const scale = visualRadius(input.altitudeKm) / (EARTH_RADIUS + input.altitudeKm * 1000);
  return { x: 350 + state.x * scale, y: 218 - state.y * scale };
}

function drawArrow(graphics: Graphics, x1: number, y1: number, x2: number, y2: number, color: number) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  graphics.moveTo(x1, y1).lineTo(x2, y2).stroke({ color, width: 4, alpha: 0.95 });
  graphics.moveTo(x2, y2).lineTo(x2 - 12 * Math.cos(angle - 0.55), y2 - 12 * Math.sin(angle - 0.55)).lineTo(x2 - 12 * Math.cos(angle + 0.55), y2 - 12 * Math.sin(angle + 0.55)).closePath().fill({ color, alpha: 0.95 });
}

function normalizeSignedDegrees(value: number) {
  return ((value + 180) % 360 + 360) % 360 - 180;
}

function regimeColor(regime: OrbitDerived["regime"]) {
  if (regime === "escape") return 0xc084fc;
  if (regime === "collision") return 0xfb923c;
  return 0x7ee787;
}

function statusCopy(regime: OrbitDerived["regime"]) {
  if (regime === "circular") return "Stable circular orbit";
  if (regime === "elliptical") return "Stable elliptical orbit";
  if (regime === "escape") return "Unbound escape trajectory";
  return "Collision trajectory";
}

function scientific(value: number) { return value.toExponential(2).replace("e+", " × 10^").replace("e-", " × 10^−"); }
function speed(value: number) { return `${(value / 1000).toFixed(2)} km/s`; }
