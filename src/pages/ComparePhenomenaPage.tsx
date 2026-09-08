import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ComparePhenomenaIcon } from '../components/ComparePhenomenaIcon';
import { ComparePhenomenaScene } from '../components/ComparePhenomenaScene';
import { ComparePhenomenaGraph } from '../components/ComparePhenomenaGraph';
import { COMPARE_CONTROLS, COMPARE_DEFAULTS, COMPARE_EXPLANATIONS, COMPARE_KEYS, COMPARE_QUESTIONS, PHENOMENA, compareDisplay, compareModel, makeCompareCards, type CompareCard, type CompareParameters, type Phenomenon, type SharedQuantity } from '../lib/comparePhenomena';
import '../compare-phenomena.css';

function CompareDialog({ title, close, children }: { title: string; close: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null), closeRef = useRef(close); closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; ref.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      if (e.key !== 'Tab') return;
      const controls = [...(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,textarea,a[href]') ?? [])].filter(el => el.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', key); previous?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<div className="cp-backdrop" data-ui-theme="dark" onClick={e => { if (e.target === e.currentTarget) close(); }}><div ref={ref} className="cp-dialog" role="dialog" aria-modal="true" aria-label={title}><header><h2>{title}</h2><button aria-label="Close dialog" onClick={close}>×</button></header>{children}</div></div>, document.body);
}

export default function ComparePhenomenaPage() {
  const [cards, setCards] = useState<CompareCard[]>(makeCompareCards), [seconds, setSeconds] = useState(0), [running, setRunning] = useState(true), [zoom, setZoom] = useState(1);
  const [quantity, setQuantity] = useState<SharedQuantity>('period'), [mode, setMode] = useState('Observe'), [panel, setPanel] = useState<string | null>(null), [active, setActive] = useState(0);
  const [speed, setSpeed] = useState(1), [trails, setTrails] = useState(true), [question, setQuestion] = useState(0), [answer, setAnswer] = useState<number | null>(null), [checked, setChecked] = useState(false), [score, setScore] = useState({ correct: 0, attempts: 0 });
  const [notes, setNotes] = useState(() => { try { return localStorage.getItem('compare-phenomena-notes') || ''; } catch { return ''; } }), [notice, setNotice] = useState('');
  useEffect(() => {
    if (!running) return;
    let frame = 0, previous = performance.now();
    const tick = (now: number) => { const dt = Math.min(.05, (now - previous) / 1000); previous = now; setSeconds(t => t + dt * speed); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [running, speed]);
  const select = (index: number, kind: Phenomenon) => { setCards(cs => cs.map((card, i) => i === index ? { kind, p: { ...COMPARE_DEFAULTS } } : card)); setSeconds(0); };
  const update = (key: keyof CompareParameters, value: number) => { setCards(cs => cs.map((card, i) => i === active ? { ...card, p: { ...card.p, [key]: value } } : card)); setSeconds(0); };
  const open = (next: string) => { setMode(next); setPanel(next === 'Observe' ? null : next); setNotice(''); };
  const reset = () => { setCards(makeCompareCards()); setSeconds(0); setZoom(1); setQuantity('period'); setRunning(true); setSpeed(1); setTrails(true); setMode('Observe'); setPanel(null); setAnswer(null); setChecked(false); setNotice(''); };
  const next = () => { setQuestion(q => (q + 1) % COMPARE_QUESTIONS.length); setAnswer(null); setChecked(false); open('Predict'); };
  const q = COMPARE_QUESTIONS[question], chosen = cards[active];
  const quantityName = quantity === 'period' ? 'Period (T)' : quantity === 'frequency' ? 'Frequency (f)' : 'Angular frequency (ω)';
  const ratio = compareModel(cards[0].kind, cards[0].p)[quantity] / compareModel(cards[1].kind, cards[1].p)[quantity];
  const chooser = (i: number, label: string) => <select aria-label={label} value={cards[i].kind} onChange={e => select(i, e.target.value as Phenomenon)}>{PHENOMENA.map(s => <option value={s.id} key={s.id}>{s.label}</option>)}</select>;
  return <div className="cp-page" data-ui-theme="dark">
    <header className="cp-top"><Link to="/concept-studio"><i/> <span>CONCEPT STUDIO</span></Link><p>Explore <b>•</b> Model <b>•</b> Compare <b>•</b> Understand</p><button aria-label="Comparison settings" onClick={() => setPanel('Settings')}><ComparePhenomenaIcon name="settings"/></button></header>
    <aside className="cp-sidebar"><nav aria-label="Concept Studio navigation"><Link to="/"><ComparePhenomenaIcon name="home"/>Home</Link><Link to="/concept-studio"><ComparePhenomenaIcon name="compass"/>Explore</Link><Link to="/experiments"><ComparePhenomenaIcon name="flask"/>Simulations</Link><Link to="/comparison" className="active" aria-current="page"><ComparePhenomenaIcon name="grid"/>Compare</Link><button onClick={() => open('Predict')}><ComparePhenomenaIcon name="trophy"/>Challenges</button><Link to="/experiments?view=library"><ComparePhenomenaIcon name="book"/>Library</Link><button onClick={() => { setNotice(''); setPanel('Notebook'); }}><ComparePhenomenaIcon name="notebook"/>Notebook</button></nav></aside>
    <main id="content" className="cp-main">
      <section className="cp-intro"><div><span>CONCEPT STUDIO</span><h1>COMPARE PHENOMENA</h1><p>Different systems. The same periodic behavior.</p></div><div className="cp-modes">{(['Observe','Predict','Experiment','Explain'] as const).map((name, i) => <button key={name} className={mode === name ? 'active' : ''} aria-pressed={mode === name} onClick={() => open(name)}><ComparePhenomenaIcon name={(['eye','chart','flask','lightbulb'] as const)[i]}/>{name}</button>)}</div></section>
      <section className="cp-cards" aria-label="Four phenomena">{cards.map((card, i) => { const info = PHENOMENA.find(s => s.id === card.kind)!, model = compareModel(card.kind, card.p), time = seconds * model.playback; return <article className="cp-card" key={i} data-kind={card.kind}>
        <header><i style={{ borderColor: info.color }}/>{chooser(i, `System ${i + 1}`)}</header>
        <div className="cp-scene"><ComparePhenomenaScene card={card} seconds={time} zoom={zoom} trails={trails}/><dl><div><dt>T</dt><dd>{compareDisplay(card.kind, card.p, 'period')}</dd></div><div><dt>f</dt><dd>{compareDisplay(card.kind, card.p, 'frequency')}</dd></div><div><dt>{card.kind === 'pendulum' ? 'A' : card.kind === 'orbit' ? 'r' : card.kind === 'wave' ? 'λ' : 'V₀'}</dt><dd>{card.kind === 'pendulum' ? `${model.amplitude.toFixed(3)} m` : card.kind === 'orbit' ? `${card.p.radius.toFixed(1)} Mm` : card.kind === 'wave' ? `${model.wavelength.toFixed(2)} m` : `${card.p.voltage.toFixed(2)} V`}</dd></div></dl><span className="cp-time">{card.kind === 'orbit' ? `${(time / 86400).toFixed(1)} d · ${4 * speed} d/s` : `${time.toFixed(2)} s · ${speed}×`}</span></div>
        <ComparePhenomenaGraph card={card} seconds={time}/>
        <footer>{i < 2 && <label>Phenomenon {i === 0 ? 'A' : 'B'}{chooser(i, `Phenomenon ${i === 0 ? 'A' : 'B'}`)}</label>}</footer>
      </article>; })}</section>
      <section className="cp-summary"><div className="cp-shared"><h2>Shared Quantity</h2><div><ComparePhenomenaIcon name="wave"/><select aria-label="Shared quantity" value={quantity} onChange={e => setQuantity(e.target.value as SharedQuantity)}><option value="period">Period (T)</option><option value="frequency">Frequency (f)</option><option value="angular">Angular frequency (ω)</option></select><p>{quantity === 'period' ? <><em>T</em> is the time for one complete cycle in all four systems.</> : quantity === 'frequency' ? <><em>f</em> is the number of complete cycles per unit time.</> : <><em>ω</em> is the phase change in radians per unit time.</>}</p></div></div><div className="cp-relationship"><h2>Key Relationship</h2><div><span className="cp-equation">{quantity === 'period' ? <>T = <span><b>1</b><b>f</b></span></> : quantity === 'frequency' ? <>f = <span><b>1</b><b>T</b></span></> : <>ω = 2πf</>}</span><dl><div><dt>T</dt><dd>period (s)</dd></div><div><dt>f</dt><dd>frequency (Hz)</dd></div></dl></div></div><div className="cp-live"><h2>Live Values ({quantity === 'period' ? 'T' : quantity === 'frequency' ? 'f' : 'ω'})</h2><dl>{cards.map((c, i) => { const info = PHENOMENA.find(s => s.id === c.kind)!; return <div key={i}><dt><i style={{ background: info.color }}/>{info.short}</dt><dd>{compareDisplay(c.kind, c.p, quantity)}</dd></div>; })}</dl></div></section>
      <footer className="cp-controls"><button aria-label="Reset" onClick={reset}><span>↻</span>Reset</button><button aria-label={running ? 'Pause' : 'Play'} onClick={() => setRunning(v => !v)}><span>{running ? 'Ⅱ' : '▷'}</span>{running ? 'Pause' : 'Play'}</button><label><ComparePhenomenaIcon name="search"/><span>Zoom</span><input aria-label="Scene zoom" type="range" min=".75" max="1.25" step=".05" value={zoom} onChange={e => setZoom(Number(e.target.value))}/><output>{Math.round(zoom * 100)}%</output></label><button className="cp-next" aria-label="Next Challenge" onClick={next}>Next Challenge <span>→</span></button></footer>
    </main>
    {panel && <CompareDialog title={panel === 'Predict' ? 'Predict the relationship' : panel === 'Experiment' ? 'Change one system' : panel === 'Explain' ? 'One periodic pattern' : panel} close={() => setPanel(null)}>
      {panel === 'Experiment' && <><div className="cp-system-tabs">{cards.map((c,i) => <button key={i} aria-pressed={active===i} onClick={()=>setActive(i)}>{i+1}. {PHENOMENA.find(s=>s.id===c.kind)!.short}</button>)}</div><p className="cp-formula">{PHENOMENA.find(s=>s.id===chosen.kind)!.formula}</p><div className="cp-parameters">{COMPARE_KEYS[chosen.kind].map(key=>{const control=COMPARE_CONTROLS[key];return <label key={key}><span>{control.label}<output>{chosen.p[key]} {control.unit}</output></span><input aria-label={control.label} type="range" {...{min:control.min,max:control.max,step:control.step}} value={chosen.p[key]} onChange={e=>update(key,Number(e.target.value))}/></label>})}</div><p>Period: <strong>{compareDisplay(chosen.kind,chosen.p,'period')}</strong> · Frequency: <strong>{compareDisplay(chosen.kind,chosen.p,'frequency')}</strong></p><p>{COMPARE_EXPLANATIONS[chosen.kind]}</p><button className="cp-primary" onClick={()=>setPanel(null)}>Observe changes</button></>}
      {panel === 'Predict' && <><p className="cp-question">{q.prompt}</p><div className="cp-answers">{q.answers.map((choice,i)=><button key={choice} disabled={checked} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{choice}</button>)}</div><button className="cp-primary" disabled={answer===null||checked} onClick={()=>{setChecked(true);setScore(s=>({correct:s.correct+Number(answer===q.correct),attempts:s.attempts+1}));}}>Check prediction</button>{checked&&<p role="status"><strong>{answer===q.correct?'Correct.':'Try the relationship again.'}</strong> {q.reason}</p>}<p>{score.correct} correct / {score.attempts} checked</p><button className="cp-primary" onClick={next}>Another prediction</button><button className="cp-primary" onClick={()=>open('Experiment')}>Test in Experiment</button></>}
      {panel === 'Explain' && <><p>Period and frequency describe all four systems, even though their physical causes and time scales differ. Each graph is calculated from the displayed model; its moving point shows the current phase.</p><div className="cp-explanations">{cards.map((c,i)=><section key={i}><h3>{i+1}. {PHENOMENA.find(s=>s.id===c.kind)!.label}</h3><p className="cp-formula">{PHENOMENA.find(s=>s.id===c.kind)!.formula}</p><p>{COMPARE_EXPLANATIONS[c.kind]}</p></section>)}</div><p><strong>A/B {quantityName.toLowerCase()} ratio: {ratio.toExponential(3)}</strong>, using seconds for both systems. One day is 86,400 seconds.</p><a href="https://ssd.jpl.nasa.gov/astro_par.html" target="_blank" rel="noreferrer">JPL gravitational parameters used for the circular orbit</a></>}
      {panel === 'Settings' && <><label className="cp-setting">Playback speed<select aria-label="Playback speed" value={speed} onChange={e=>setSpeed(Number(e.target.value))}><option value=".25">0.25×</option><option value=".5">0.5×</option><option value="1">1×</option><option value="2">2×</option></select></label><label className="cp-check"><input type="checkbox" checked={trails} onChange={e=>setTrails(e.target.checked)}/>Show pendulum amplitude guides</label><p>The orbital scene uses an accelerated clock, clearly shown on its card. Pause stops every clock. Zoom changes only the apparatus view.</p><Link to="/comparison?view=benchmark">Open the preserved platform benchmark</Link></>}
      {panel === 'Notebook' && <><label>Comparison notes<textarea aria-label="Comparison notes" rows={8} value={notes} onChange={e=>setNotes(e.target.value)}/></label><button className="cp-primary" onClick={()=>{try{localStorage.setItem('compare-phenomena-notes',notes);setNotice('Notes saved on this device.');}catch{setNotice('Storage is unavailable. Keep this dialog open to copy your notes.');}}}>Save notes</button>{notice&&<p role="status">{notice}</p>}</>}
    </CompareDialog>}
  </div>;
}
