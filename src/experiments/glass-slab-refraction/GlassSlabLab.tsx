import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { DedicatedExperimentLabProps } from "../shared/experimentRegistry";
import { solveGlassSlab } from "./glassSlabSimulation";
import "./glass-slab.css";

const wavelengths = [
  [405, "Violet"],
  [470, "Blue"],
  [520, "Green"],
  [589.3, "Yellow"],
  [650, "Red"],
] as const;

const rayColor = (nm: number) => {
  if (nm < 440) return "#7c3cff";
  if (nm < 490) return "#1769ff";
  if (nm < 565) return "#12a83b";
  if (nm < 610) return "#f3b500";
  return "#ef352f";
};

type Trial = {
  id: number;
  incidence: number;
  refraction: number;
  shift: number;
  difference: number;
};

export function GlassSlabLab({ experiment }: DedicatedExperimentLabProps) {
  const [incidence, setIncidence] = useState(40),
    [referenceIndex, setReferenceIndex] = useState(1.5),
    [thickness, setThickness] = useState(1.5),
    [wavelength, setWavelength] = useState(520),
    [surroundingIndex, setSurroundingIndex] = useState(1),
    [brightness, setBrightness] = useState(80),
    [running, setRunning] = useState(false),
    [direction, setDirection] = useState(1),
    [playback, setPlayback] = useState(1),
    [reduced, setReduced] = useState(false),
    [fan, setFan] = useState(false),
    [feedback, setFeedback] = useState(""),
    [trials, setTrials] = useState<Trial[]>([]);
  const solution = useMemo(
    () =>
      solveGlassSlab({
        incidenceDeg: incidence,
        referenceIndex,
        wavelengthNm: wavelength,
        thicknessCm: thickness,
        surroundingIndex,
      }),
    [incidence, referenceIndex, surroundingIndex, thickness, wavelength],
  );
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(
      () => {
        setIncidence((current) => {
          let next = current + direction * (reduced ? 2 : 0.8) * playback;
          if (next >= 70) {
            next = 70;
            setDirection(-1);
          } else if (next <= 10) {
            next = 10;
            setDirection(1);
          }
          return next;
        });
      },
      reduced ? 260 : 40,
    );
    return () => clearInterval(id);
  }, [direction, playback, reduced, running]);

  const reset = () => {
    setIncidence(40);
    setReferenceIndex(1.5);
    setThickness(1.5);
    setWavelength(520);
    setSurroundingIndex(1);
    setBrightness(80);
    setRunning(false);
    setDirection(1);
    setPlayback(1);
    setReduced(false);
    setFan(false);
    setFeedback("");
    setTrials([]);
  };
  const recordTrial = () => {
    if (!solution.transmitted) return;
    setTrials((old) => [
      ...old.slice(-4),
      {
        id: (old[old.length - 1]?.id ?? 0) + 1,
        incidence,
        refraction: solution.refractionDeg,
        shift: solution.lateralShiftCm,
        difference: Math.abs(solution.snellLeft - solution.snellRight),
      },
    ]);
  };
  const checkMission = () => {
    if (!solution.transmitted) {
      setFeedback(
        "No transmitted ray: choose parameters that allow refraction.",
      );
      return;
    }
    const error = Math.abs(solution.lateralShiftCm - 0.8);
    setFeedback(
      error <= 0.03
        ? `✓ Match: d=${solution.lateralShiftCm.toFixed(2)} cm is within 0.03 cm.`
        : `Adjust angle, index, or thickness by ${error.toFixed(2)} cm to reach 0.80 cm.`,
    );
  };
  const style = {
    "--ray": rayColor(wavelength),
    "--ray-opacity": brightness / 100,
  } as CSSProperties;

  return (
    <section
      className="gs-lab"
      style={style}
      aria-label={`${experiment.title} interactive laboratory`}
    >
      <header className="gs-head" data-ui-theme="dark">
        <div>
          <span>PARALLEL-SLAB OPTICS LAB</span>
          <h2>Trace the bend. Measure the shift.</h2>
          <p>Two refractions restore direction—not the original ray line.</p>
        </div>
        <button onClick={reset}>↻ Reset experiment</button>
      </header>
      <div className="gs-layout">
        <aside className="gs-controls">
          <h3>Apparatus controls</h3>
          <Range
            label="Incidence angle i"
            value={incidence}
            min={0}
            max={75}
            step={1}
            unit="°"
            onChange={setIncidence}
          />
          <Range
            label="Refractive index n₂"
            value={referenceIndex}
            min={1.3}
            max={1.8}
            step={0.01}
            unit=""
            onChange={setReferenceIndex}
          />
          <Range
            label="Slab thickness t"
            value={thickness}
            min={0.5}
            max={3}
            step={0.05}
            unit=" cm"
            onChange={setThickness}
          />
          <label>
            Surrounding medium n₁
            <select
              aria-label="Surrounding medium"
              value={surroundingIndex}
              onChange={(e) => setSurroundingIndex(+e.target.value)}
            >
              <option value="1">Air (1.000)</option>
              <option value="1.333">Water (1.333)</option>
            </select>
          </label>
          <h3>Ray box</h3>
          <label>
            Wavelength
            <select
              aria-label="Wavelength"
              value={wavelength}
              onChange={(e) => setWavelength(+e.target.value)}
            >
              {wavelengths.map(([nm, name]) => (
                <option key={nm} value={nm}>
                  {name} ({nm} nm)
                </option>
              ))}
            </select>
          </label>
          <Range
            label="Ray brightness"
            value={brightness}
            min={20}
            max={100}
            step={5}
            unit="%"
            onChange={setBrightness}
          />
          <button
            className={fan ? "active" : ""}
            aria-pressed={fan}
            onClick={() => setFan((v) => !v)}
          >
            ⌁ Fan of rays
          </button>
          <div className="gs-presets" aria-label="Parameter presets">
            <button
              onClick={() => {
                setIncidence(0);
                setReferenceIndex(1.3);
                setThickness(0.5);
              }}
            >
              Minimums
            </button>
            <button
              onClick={() => {
                setIncidence(40);
                setReferenceIndex(1.5);
                setThickness(1.5);
              }}
            >
              Typical
            </button>
            <button
              onClick={() => {
                setIncidence(75);
                setReferenceIndex(1.8);
                setThickness(3);
              }}
            >
              Maximums
            </button>
            <button
              onClick={() => {
                setIncidence(50);
                setReferenceIndex(1.5);
                setThickness(2.1);
              }}
            >
              Target setup
            </button>
          </div>
        </aside>

        <main className="gs-main">
          <div className="gs-transport" aria-label="Playback controls">
            <button onClick={() => setRunning(true)}>▶ Play</button>
            <button onClick={() => setRunning(false)}>Ⅱ Pause</button>
            <button
              onClick={() => {
                setRunning(false);
                setIncidence((v) => Math.min(75, v + 1));
              }}
            >
              ▷ Step
            </button>
            <button
              onClick={() => {
                setRunning(false);
                setIncidence(10);
                setDirection(1);
              }}
            >
              ↺ Replay
            </button>
            <label>
              Speed{" "}
              <select
                aria-label="Playback speed"
                value={playback}
                onChange={(e) => setPlayback(+e.target.value)}
              >
                {[0.25, 0.5, 1, 2].map((v) => (
                  <option key={v} value={v}>
                    {v}×
                  </option>
                ))}
              </select>
            </label>
            <label className="gs-check">
              <input
                type="checkbox"
                checked={reduced}
                onChange={(e) => setReduced(e.target.checked)}
              />{" "}
              Reduced motion
            </label>
          </div>
          <RayBench solution={solution} thickness={thickness} fan={fan} />
          <p className="gs-caption" role="status">
            {solution.transmitted
              ? `At ${incidence.toFixed(1)}°, the ray bends to ${solution.refractionDeg.toFixed(1)}° inside the slab and exits parallel with a ${solution.lateralShiftCm.toFixed(2)} cm shift.`
              : "Total internal reflection occurs at the first face; no emergent ray is available."}
          </p>
        </main>

        <aside className="gs-readings">
          <h3>Live measurements</h3>
          <dl>
            <dt>i (incidence)</dt>
            <dd>{incidence.toFixed(1)}°</dd>
            <dt>r (refraction)</dt>
            <dd>
              {solution.transmitted
                ? `${solution.refractionDeg.toFixed(1)}°`
                : "TIR"}
            </dd>
            <dt>e (emergent)</dt>
            <dd>
              {solution.transmitted
                ? `${solution.emergentDeg.toFixed(1)}°`
                : "—"}
            </dd>
            <dt>Lateral shift d</dt>
            <dd>
              {solution.transmitted
                ? `${solution.lateralShiftCm.toFixed(2)} cm`
                : "—"}
            </dd>
            <dt>n₂ at {wavelength} nm</dt>
            <dd>{solution.slabIndex.toFixed(4)}</dd>
            <dt>Light speed in slab</dt>
            <dd>{(solution.lightSpeedMps / 1e8).toFixed(3)}×10⁸ m/s</dd>
          </dl>
          <div className="gs-equation">
            n₁ sin i = n₂ sin r<br />d = t sin(i−r) / cos r
          </div>
          <div className="gs-snell">
            Δ Snell ={" "}
            {solution.transmitted
              ? Math.abs(
                  solution.snellLeft - solution.snellRight,
                ).toExponential(1)
              : "—"}
            <strong>
              {solution.transmitted ? "✓ balanced" : "transmission blocked"}
            </strong>
          </div>
        </aside>
      </div>

      <div className="gs-lower">
        <section className="gs-data">
          <div className="gs-section-head">
            <h3>Measurement table</h3>
            <button onClick={recordTrial} disabled={!solution.transmitted}>
              ＋ Record trial
            </button>
          </div>
          <div className="gs-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Trial</th>
                  <th>i</th>
                  <th>r</th>
                  <th>d</th>
                  <th>|n₁sin i−n₂sin r|</th>
                </tr>
              </thead>
              <tbody>
                {trials.length ? (
                  trials.map((t) => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.incidence.toFixed(1)}°</td>
                      <td>{t.refraction.toFixed(1)}°</td>
                      <td>{t.shift.toFixed(2)} cm</td>
                      <td>{t.difference.toExponential(1)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>Record a ray trace to compare trials.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        <RefractionGraph
          referenceIndex={referenceIndex}
          wavelength={wavelength}
          surroundingIndex={surroundingIndex}
        />
        <section className="gs-mission">
          <span>CHALLENGE</span>
          <h3>Match the target displacement</h3>
          <p>
            Adjust i, n₂, and t until the live result reaches{" "}
            <strong>0.80 cm</strong>.
          </p>
          <div className="gs-target">
            <b>Target 0.80 cm</b>
            <b>
              Current{" "}
              {solution.transmitted ? solution.lateralShiftCm.toFixed(2) : "—"}{" "}
              cm
            </b>
          </div>
          <button onClick={checkMission}>◎ Check match</button>
          {feedback && (
            <p
              className={feedback.startsWith("✓") ? "success" : "hint"}
              role="status"
            >
              {feedback}
            </p>
          )}
        </section>
      </div>
    </section>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      {label}
      <output>
        {value.toFixed(step < 0.1 ? 2 : 1)}
        {unit}
      </output>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <small>
        <span>{min}</span>
        <span>{max}</span>
      </small>
    </label>
  );
}

function RayBench({
  solution,
  thickness,
  fan,
}: {
  solution: ReturnType<typeof solveGlassSlab>;
  thickness: number;
  fan: boolean;
}) {
  const top = 245,
    slabHeight = 58 + thickness * 34,
    bottom = top + slabHeight,
    entryX = 510;
  const i = solution.incidenceRad,
    r = solution.transmitted ? solution.refractionRad : 0;
  const startX = entryX - 240 * Math.sin(i),
    startY = top - 240 * Math.cos(i);
  const exitX = entryX + slabHeight * Math.tan(r);
  const endX = exitX + 240 * Math.sin(i),
    endY = bottom + 240 * Math.cos(i);
  const signed = (exitX - entryX) * Math.cos(i) - slabHeight * Math.sin(i);
  const qx = exitX - signed * Math.cos(i),
    qy = bottom + signed * Math.sin(i);
  return (
    <div className="gs-stage">
      <img
        src="/assets/experiments/glass-slab-refraction/optical-bench.png"
        alt="Top-view ray box, protractor, and rectangular glass slab"
      />
      <svg
        viewBox="0 0 900 600"
        role="img"
        aria-label={`Ray diagram: incidence ${solution.incidenceDeg.toFixed(1)} degrees, ${solution.transmitted ? `refraction ${solution.refractionDeg.toFixed(1)} degrees and displacement ${solution.lateralShiftCm.toFixed(2)} centimetres` : "total internal reflection"}`}
      >
        <defs>
          <marker
            id="gs-arrow"
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="3"
            orient="auto"
          >
            <path d="M0 0L6 3L0 6Z" fill="var(--ray)" />
          </marker>
        </defs>
        <rect
          x="360"
          y={top}
          width="360"
          height={slabHeight}
          rx="5"
          className="gs-slab"
        />
        <line
          x1={entryX}
          y1={top - 130}
          x2={entryX}
          y2={bottom + 130}
          className="gs-normal"
        />
        <line
          x1={startX}
          y1={startY}
          x2={entryX}
          y2={top}
          className="gs-ray"
          markerEnd="url(#gs-arrow)"
        />
        {fan &&
          [-6, -3, 3, 6].map((offset) => (
            <line
              key={offset}
              x1={startX}
              y1={startY + offset * 2}
              x2={entryX + offset}
              y2={top}
              className="gs-fan-ray"
            />
          ))}
        {solution.transmitted ? (
          <>
            <line
              x1={entryX}
              y1={top}
              x2={exitX}
              y2={bottom}
              className="gs-ray gs-inside"
              markerEnd="url(#gs-arrow)"
            />
            <line
              x1={exitX}
              y1={bottom}
              x2={endX}
              y2={endY}
              className="gs-ray"
              markerEnd="url(#gs-arrow)"
            />
            <line
              x1={entryX}
              y1={top}
              x2={entryX + (bottom + 220 - top) * Math.tan(i)}
              y2={bottom + 220}
              className="gs-ghost"
            />
            <line x1={exitX} y1={bottom} x2={qx} y2={qy} className="gs-shift" />
            <text
              x={(exitX + qx) / 2 + 10}
              y={(bottom + qy) / 2}
              className="gs-label"
            >
              d={solution.lateralShiftCm.toFixed(2)} cm
            </text>
          </>
        ) : (
          <path
            d={`M ${entryX} ${top} L ${entryX + 210 * Math.sin(i)} ${top - 210 * Math.cos(i)}`}
            className="gs-ray"
          />
        )}
        <path
          d={`M ${entryX} ${top - 62} A 62 62 0 0 0 ${entryX - 62 * Math.sin(i)} ${top - 62 * Math.cos(i)}`}
          className="gs-angle"
        />
        <text x={entryX - 92} y={top - 66} className="gs-label">
          i {solution.incidenceDeg.toFixed(1)}°
        </text>
        {solution.transmitted && (
          <text x={entryX + 18} y={top + 67} className="gs-label">
            r {solution.refractionDeg.toFixed(1)}°
          </text>
        )}
        <text x="376" y={bottom - 16} className="gs-medium">
          n₂={solution.slabIndex.toFixed(4)}
        </text>
      </svg>
    </div>
  );
}

function RefractionGraph({
  referenceIndex,
  wavelength,
  surroundingIndex,
}: {
  referenceIndex: number;
  wavelength: number;
  surroundingIndex: number;
}) {
  const points = Array.from({ length: 15 }, (_, k) =>
    solveGlassSlab({
      incidenceDeg: k * 5,
      referenceIndex,
      wavelengthNm: wavelength,
      thicknessCm: 1,
      surroundingIndex,
    }),
  )
    .filter((s) => s.transmitted)
    .map((s) => `${35 + s.incidenceDeg * 3.5},${205 - s.refractionDeg * 2.55}`)
    .join(" ");
  return (
    <section className="gs-graph">
      <h3>Refraction graph · i vs r</h3>
      <svg
        viewBox="0 0 330 230"
        role="img"
        aria-label="Incidence angle versus refraction angle graph"
      >
        <line x1="35" y1="15" x2="35" y2="205" />
        <line x1="35" y1="205" x2="310" y2="205" />
        <polyline points={points} />
        <text x="145" y="226">
          i (degrees)
        </text>
        <text x="5" y="20">
          r
        </text>
      </svg>
    </section>
  );
}
