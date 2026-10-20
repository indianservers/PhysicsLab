import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { theoryForRoute } from '../lib/studioTheory';
import './studio-theory-reader.css';

export function StudioTheoryReader() {
  const { pathname } = useLocation();
  const theory = theoryForRoute(pathname);
  return theory ? <TheoryReader key={pathname} theory={theory} /> : null;
}

function TheoryReader({ theory }: { theory: NonNullable<ReturnType<typeof theoryForRoute>> }) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState('principle');
  const dialog = useRef<HTMLDivElement>(null);
  const { chapter, studio, lab, labs, references } = theory;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); }
      if (event.key !== 'Tab') return;
      const nodes = [...(dialog.current?.querySelectorAll<HTMLElement>('button,a[href],summary,[tabindex="0"]') ?? [])].filter(node => node.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handle, true);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handle, true); previous?.focus(); };
  }, [open]);
  const sections = [['principle', 'Principle'], ['derivation', 'Derivation'], ['worked', 'Worked example'], ['model', 'Model & limits'], ['practice', 'Investigate & practise'], ['deeper', 'Go deeper']];
  const jump = (id: string) => { setSection(id); dialog.current?.querySelector(`#theory-${id}`)?.scrollIntoView({ behavior: 'instant', block: 'start' }); };
  return <>
    <button type="button" className="str-launch" onClick={() => setOpen(true)} aria-haspopup="dialog">▤ Theory &amp; worked examples</button>
    {open && createPortal(<div className="str-backdrop" data-ui-theme="dark" onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="str-dialog" role="dialog" aria-modal="true" aria-labelledby="studio-theory-title" ref={dialog}>
        <header className="str-header"><div><span>{studio?.name} / TEXTBOOK</span><h2 id="studio-theory-title">{lab?.title}</h2></div><button type="button" onClick={() => setOpen(false)} aria-label="Close theory">×</button></header>
        <div className="str-layout"><nav aria-label="Theory chapters">{sections.map(([id, label]) => <button type="button" key={id} aria-current={section === id ? 'location' : undefined} onClick={() => jump(id)}>{label}</button>)}<Link to={`/concept-studio/${chapter.studio}`}>← Studio home</Link></nav>
          <article className="str-body">
            <section id="theory-principle"><span className="str-kicker">01 / UNDERSTAND</span><h3>The physical principle</h3><p>{chapter.core}</p><figure><div className="str-equation">{chapter.equation}</div><figcaption>{chapter.symbols}</figcaption></figure></section>
            <section id="theory-derivation"><span className="str-kicker">02 / BUILD THE EQUATION</span><h3>Reasoning step by step</h3><ol>{chapter.derivation.map(step => <li key={step}>{step}</li>)}</ol><div className="str-misconception"><strong>Common misconception</strong><p>{chapter.misconception}</p></div></section>
            <section id="theory-worked"><span className="str-kicker">03 / CALCULATE</span><h3>A worked example</h3><ol className="str-example">{chapter.example.map(step => <li key={step}>{step}</li>)}</ol><p className="str-note">These are reference calculations. Set the same parameters in the lab to compare; they are not live measurements of your current run.</p></section>
            <section id="theory-model"><span className="str-kicker">04 / INTERPRET THE SIMULATION</span><h3>Assumptions and validity</h3><p>{chapter.assumptions}</p><p>Check the units and sign convention above before comparing results. A schematic drawing can exaggerate dimensions or motion; numerical predictions follow the stated model.</p></section>
            <section id="theory-practice"><span className="str-kicker">05 / TEST YOUR UNDERSTANDING</span><h3>Make a prediction, then investigate</h3><p>{chapter.investigation}</p><div className="str-question"><strong>Try this before revealing the answer</strong><p>{chapter.question}</p><details><summary>Reveal reasoning</summary><p>{chapter.answer}</p></details></div></section>
            <section id="theory-deeper"><span className="str-kicker">06 / EXTEND</span><h3>Beyond the basic model</h3><p>{chapter.extension}</p><h4>Further reading</h4><p className="str-note">Continue with these textbook, university and standards resources.</p><ul>{references.map(reference => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.title} ↗</a></li>)}</ul><h4>Continue in this studio</h4><div className="str-related">{labs.filter(item => item !== lab).map(item => <Link key={item.route} to={item.route}>{item.title} →</Link>)}</div></section>
          </article>
        </div>
      </div>
    </div>, document.body)}
  </>;
}
