import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { StringTheoryCanvas } from "../components/StringTheoryCanvas";
import { StringTheoryThreeScene } from "../components/StringTheoryThreeScene";
import { StringTheoryNetworkThreeScene } from "../components/StringTheoryNetworkThreeScene";
import { getStringTheoryLesson, stringTheoryLessons, stringTheoryUnits } from "../lib/stringTheoryStudio";
import "../string-theory-studio.css";

export function StringTheoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const lesson = useMemo(() => getStringTheoryLesson(searchParams.get("concept")), [searchParams]);
  const [values, setValues] = useState<[number, number]>([lesson.controls[0].value, lesson.controls[1].value]);
  const [playing, setPlaying] = useState(true);
  const [stage, setStage] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const noteKey = `string-theory-note-${lesson.id}`;
  const [note, setNote] = useState(() => localStorage.getItem(noteKey) ?? "");
  const visibleOutline = lesson.outline.length === 7 ? lesson.outline : [
    "The Big Picture", "From Atoms", "Subatomic World", "Quarks and Gluons",
    lesson.title, lesson.outline[lesson.outline.length - 1] ?? "Connections", "Implications",
  ];
  const timelineLabels = ["Atoms", "Nucleus", "Quarks", "Planck Length", "Beyond"];

  useEffect(() => {
    setValues([lesson.controls[0].value, lesson.controls[1].value]);
    setStage(3);
    setPlaying(true);
    setNote(localStorage.getItem(`string-theory-note-${lesson.id}`) ?? "");
  }, [lesson]);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const id = window.setInterval(() => setStage((current) => (current + 1) % lesson.phases.length), 4200 / speed);
    return () => window.clearInterval(id);
  }, [lesson, playing, reducedMotion, speed]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.matches("input, textarea, select")) return;
      if (event.code === "Space") { event.preventDefault(); setPlaying((value) => !value); }
      if (event.code === "ArrowRight") setStage((value) => (value + 1) % lesson.phases.length);
      if (event.code === "ArrowLeft") setStage((value) => (value - 1 + lesson.phases.length) % lesson.phases.length);
      if (event.key.toLowerCase() === "r") resetLesson();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function resetLesson() {
    setValues([lesson.controls[0].value, lesson.controls[1].value]);
    setStage(3);
    setPlaying(false);
  }

  function selectLesson(id: string) {
    setSearchParams({ concept: id });
    setMenuOpen(false);
  }

  function moveLesson(delta: number) {
    const next = (lesson.number - 1 + delta + stringTheoryLessons.length) % stringTheoryLessons.length;
    selectLesson(stringTheoryLessons[next].id);
  }

  function saveNote(value: string) {
    setNote(value);
    localStorage.setItem(noteKey, value);
  }

  function captureStage() {
    const canvas = shellRef.current?.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const link = document.createElement("a");
    link.download = `string-theory-${lesson.number.toString().padStart(2, "0")}-${lesson.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="st-page" data-ui-theme="dark">
      <main id="content" ref={shellRef} className="st-shell">
        <header className="st-header">
          <div className="st-brandline">
            <Link className="st-brand st-brand-home" to="/" aria-label="Return to PhysicsLab home">PHYSICS STUDIO</Link><i>/</i><span>STRING THEORY</span><i>/</i><strong>{lesson.title.toUpperCase()}</strong>
          </div>
          <nav className="st-header-actions" aria-label="String Theory studio tools">
            <button type="button" onClick={() => setHelpOpen((value) => !value)} aria-pressed={helpOpen} title="Focus selected object">⌾</button>
            <button type="button" onClick={captureStage} title="Download a stage image">▣</button>
            <button className="st-grid-button" type="button" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)} title="Open lesson menu">⊞</button>
            <button type="button" onClick={() => shellRef.current?.requestFullscreen?.()} title="Full screen">⛶</button>
            <button type="button" onClick={() => setReducedMotion((value) => !value)} aria-pressed={reducedMotion} title="Animation settings">⚙</button>
          </nav>
        </header>

        {menuOpen && (
          <section className="st-mega-menu" aria-label="String Theory lessons">
            <div className="st-mega-head"><div><span>STRING THEORY CURRICULUM</span><h2>Choose a studio</h2></div><button type="button" onClick={() => setMenuOpen(false)}>Close ×</button></div>
            <div className="st-mega-units">
              {stringTheoryUnits.map((unit) => <div key={unit}><h3>{unit}</h3>{stringTheoryLessons.filter((item) => item.unit === unit).map((item) => <button key={item.id} className={item.id === lesson.id ? "active" : ""} type="button" onClick={() => selectLesson(item.id)}><span>{item.number.toString().padStart(2, "0")}</span>{item.title}</button>)}</div>)}
            </div>
          </section>
        )}

        <aside className="st-outline">
          <div className="st-outline-title"><span>LESSON OUTLINE</span><b>{lesson.number.toString().padStart(2, "0")} / 32</b></div>
          <p className="st-unit">{lesson.unit}</p>
          <ol>
            {visibleOutline.map((item, index) => <li key={`${item}-${index}`} className={index === 4 ? "active" : index < 4 ? "done" : ""}><button type="button" onClick={() => setStage(index % lesson.phases.length)}><span>{index + 1}</span><b>{item}</b></button></li>)}
          </ol>
          <div className="st-progress"><span>LESSON PROGRESS</span><div><i style={{ width: "71%" }}/></div><strong>5 / 7</strong></div>
          <button className="st-notes-button" type="button" onClick={() => setNotesOpen((value) => !value)}>▤ <span>Notes</span><small>{note ? "Saved" : "Add"}</small></button>
        </aside>

        <section className="st-stage-column">
          <div className="st-stage-title">
            <span>{lesson.eyebrow}</span>
            <h1>{lesson.title}</h1>
            <p>{lesson.subtitle}</p>
          </div>
          <div className="st-viewport">
            {lesson.asset && <img className={`st-scene-asset st-asset-${lesson.visual}`} src={lesson.asset} alt="" />}
            {lesson.visual === "scale" && <StringTheoryThreeScene values={values} playing={playing} reducedMotion={reducedMotion} />}
            {lesson.visual === "network" && <StringTheoryNetworkThreeScene values={values} stage={stage} playing={playing} reducedMotion={reducedMotion} />}
            <StringTheoryCanvas lesson={lesson} values={values} playing={playing} speed={speed} stage={stage} reducedMotion={reducedMotion} />
            {lesson.visual === "scale" && <div className="st-scale-legend"><span>OBSERVATION SCALE</span>{["10⁻⁵ m","10⁻¹⁰ m","10⁻¹⁵ m","10⁻²⁰ m","10⁻²⁵ m","10⁻³⁰ m","10⁻³⁵ m"].map(item=><i key={item}>{item}</i>)}<strong>10⁻³⁵ m</strong></div>}
            {lesson.visual === "network" && <div className="st-network-labels" aria-hidden="true"><span>TYPE I</span><span>TYPE IIA</span><span>TYPE IIB</span><span>HETEROTIC<br/>SO(32)</span><span>HETEROTIC<br/>E8×E8</span></div>}
            <div className="st-viewport-tools"><button type="button" title="Pointer interaction">⌖</button><button type="button" onClick={resetLesson} title="Reset view">↺</button></div>
          {captions && <div className="st-caption"><b>{lesson.phases[stage]}</b><span>{lesson.observations[stage % lesson.observations.length]}</span></div>}
          <p className="st-sr-state" aria-live="polite">
            {lesson.title}. {lesson.controls[0].label}: {formatValue(values[0], lesson.controls[0].step)}. {lesson.controls[1].label}: {formatValue(values[1], lesson.controls[1].step)}. Current phase: {lesson.phases[stage]}.
          </p>
          </div>
        </section>

        <aside className={`st-controls st-${lesson.visual}-controls`}>
          <div className="st-controls-head"><span>{lesson.visual === "scale" ? "LAB CONTROLS" : lesson.visual === "network" ? "THEORY CONTROLS" : "EXPERIMENT CONTROLS"}</span><i>LIVE</i></div>
          {lesson.visual === "network" && <div className="st-theory-picker"><span>Theory</span>{["Type I","Type IIA","Type IIB","Heterotic SO(32)","Heterotic E8×E8"].map((item,index)=><button type="button" className={index===stage%5?"active":""} key={item} onClick={()=>setStage(index)}><i/>{item}</button>)}</div>}
          {lesson.controls.map((item, index) => (
            <label className="st-control" key={item.label}>
              <span><b>{item.label}</b><output>{formatValue(values[index], item.step)}{item.unit}</output></span>
              <input aria-label={item.label} type="range" min={item.min} max={item.max} step={item.step} value={values[index]} onChange={(event) => setValues((current) => index === 0 ? [Number(event.target.value), current[1]] : [current[0], Number(event.target.value)])} />
              <small><i>{item.min}{item.unit}</i><i>{item.max}{item.unit}</i></small>
            </label>
          ))}
          {lesson.visual === "scale" && <label className="st-control st-derived-control"><span><b>Energy</b><output>10¹⁹ GeV</output></span><input aria-label="Energy" type="range" min="0" max="100" value={Math.round((35 + values[0]) / 30 * 100)} onChange={(event)=>setValues([Math.round(-35 + Number(event.target.value) * .3),values[1]])}/></label>}
          {lesson.visual !== "scale" && lesson.visual !== "network" && <div className="st-formula"><span>ACTIVE RELATION</span><strong>{lesson.formula}</strong></div>}
          {lesson.visual !== "network" && <div className={`st-observe ${lesson.visual === "scale" ? "st-seeing" : ""}`}><span>{lesson.visual === "scale" ? "WHAT YOU’RE SEEING" : "WHAT TO OBSERVE"}</span><ol>{(lesson.visual === "scale" ? ["Atomic structure — electrons orbit the nucleus","Nucleus — protons and neutrons","Quarks — constituents of hadronic matter","Planck scale — quantum gravity regime"] : lesson.observations).map((item, index) => <li key={item}><b>{(index + 1).toString().padStart(2, "0")}</b>{item}</li>)}</ol></div>}
          <button className="st-reset" type="button" onClick={resetLesson}>↺ RESET EXPERIMENT</button>
          <div className="st-status"><i/><span>MODEL RUNNING LOCALLY</span></div>
        </aside>

        <footer className="st-timeline">
          <div className="st-transport"><button type="button" onClick={() => moveLesson(-1)} title="Previous lesson">|◀</button><button className="primary" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Ⅱ" : "▶"}</button><button type="button" onClick={() => setStage((value) => (value + 1) % lesson.phases.length)} title="Next phase">▶|</button></div>
          <div className="st-timeline-track">
            <div className="st-track-line"><i style={{ width: `${stage / Math.max(1, lesson.phases.length - 1) * 100}%` }}/><b style={{ left: `${stage / Math.max(1, lesson.phases.length - 1) * 100}%` }}/></div>
            <div className="st-phase-labels">{timelineLabels.map((item, index) => <button key={item} className={index === stage % timelineLabels.length ? "active" : ""} type="button" onClick={() => setStage(index % lesson.phases.length)}><i>{index + 1}</i><span>{item}</span><small>{["10⁻¹⁰ m","10⁻¹⁴ m","10⁻¹⁸ m","10⁻³⁵ m","10⁻⁴⁰ m"][index]}</small></button>)}</div>
          </div>
          <div className="st-playback"><label>SPEED<select value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value="0.5">0.5×</option><option value="1">1×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label><button className={captions ? "active" : ""} type="button" onClick={() => setCaptions((value) => !value)}>CC</button><span title="This studio intentionally has no sounds">◉ MUTED</span></div>
        </footer>

        {notesOpen && <aside className="st-drawer"><div><span>LESSON NOTES</span><button type="button" onClick={() => setNotesOpen(false)}>×</button></div><h2>{lesson.title}</h2><textarea value={note} onChange={(event) => saveNote(event.target.value)} placeholder="Write an observation, prediction, or question…"/><small>Saved automatically on this device.</small></aside>}
        {helpOpen && <aside className="st-help"><button type="button" onClick={() => setHelpOpen(false)}>×</button><span>INTERACTION GUIDE</span><h2>Explore {lesson.title}</h2><p>Change both controls and watch the model update from the same state. Play the sequence, select timeline phases, or use Space and arrow keys.</p><dl><div><dt>Space</dt><dd>Play / pause</dd></div><div><dt>← →</dt><dd>Change phase</dd></div><div><dt>R</dt><dd>Reset lesson</dd></div></dl></aside>}
      </main>
    </div>
  );
}

function formatValue(value: number, step: number) {
  if (step >= 1) return Math.round(value).toString();
  return value.toFixed(step < .1 ? 2 : 1);
}
