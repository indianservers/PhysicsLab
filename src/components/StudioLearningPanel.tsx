import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { theoryForRoute } from '../lib/studioTheory';
import { safeStorage } from '../lib/safeStorage';

export function StudioLearningPanel({ mode, close }: { mode: string; close: () => void }) {
  const { pathname } = useLocation();
  const theory = theoryForRoute(pathname);
  const storageKey = `studio-learning:${pathname}:${mode}`;
  const [response, setResponse] = useState(() => {
    const saved = safeStorage.readJSON<unknown>(storageKey, '');
    return typeof saved === 'string' ? saved : '';
  });
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { if (theory) safeStorage.writeJSON(storageKey, response); }, [storageKey, response]);
  if (!theory || !['Observe', 'Predict', 'Experiment', 'Explain', 'Challenge'].includes(mode)) return null;
  const { chapter, lab } = theory;
  return <section className="studio-mode-content" data-learning-mode={mode} aria-label={`${lab?.title} ${mode} content`}>
    {mode === 'Observe' && <><h3>What to look for</h3><p>{chapter.core}</p><p>{chapter.investigation}</p><button className="mc-primary" onClick={close}>Observe the apparatus</button></>}
    {(mode === 'Predict' || mode === 'Challenge') && <>
      <h3>{mode === 'Predict' ? 'Predict before running the lab' : 'Apply the physics'}</h3>
      <p>{chapter.question}</p>
      <label className="studio-mode-response">Your answer and reasoning<textarea rows={3} value={response} onChange={event => { setResponse(event.target.value); setRevealed(false); }} placeholder="State a result, its units and the physical reason." /></label>
      <button className="mc-primary" disabled={!response.trim()} onClick={() => setRevealed(true)}>Compare with the explanation</button>
      {revealed && <div className="studio-mode-feedback" role="status"><strong>Reference reasoning</strong><p>{chapter.answer}</p><p>Compare the result, units and assumptions with your prediction.</p></div>}
      <p><strong>Test it:</strong> {chapter.investigation}</p><button className="mc-primary" onClick={close}>Return to the lab to test</button>
    </>}
    {mode === 'Experiment' && <>
      <h3>{lab?.title}: an investigation</h3>
      <ol><li>Record the initial settings and the quantities shown in the live readings.</li><li>{chapter.investigation}</li><li>Use {chapter.equation} to predict a comparison value. Keep units consistent: {chapter.symbols}</li><li>Compare prediction and reading; explain a discrepancy using the stated model limits.</li></ol>
      <p><strong>Model limits:</strong> {chapter.assumptions}</p>
      <label className="studio-mode-response">Investigation plan<textarea rows={3} value={response} onChange={event => setResponse(event.target.value)} placeholder="Which variable will you change, what will you hold fixed, and what will you record?" /></label>
      <button className="mc-primary" onClick={close}>Use the lab controls</button>
    </>}
    {mode === 'Explain' && <>
      <h3>The physics of {lab?.title.toLowerCase()}</h3><p>{chapter.core}</p>
      <div className="studio-mode-equation">{chapter.equation}</div><p className="studio-mode-units">{chapter.symbols}</p>
      <h3>Derive the result</h3><ol>{chapter.derivation.map(step => <li key={step}>{step}</li>)}</ol>
      <h3>Worked example</h3><ol>{chapter.example.map(step => <li key={step}>{step}</li>)}</ol>
      <p><strong>Avoid this mistake:</strong> {chapter.misconception}</p><p><strong>Validity:</strong> {chapter.assumptions}</p>
    </>}
  </section>;
}
