export interface CauseEffectPanelProps {
  cause: string;
  effect: string;
  because: string;
}

export function CauseEffectPanel({ cause, effect, because }: CauseEffectPanelProps) {
  return (
    <section className="cause-effect-panel" aria-label="Cause and effect">
      <p className="premium-mini-label">Cause to effect</p>
      <div className="cause-effect-flow">
        <div>
          <span>Cause</span>
          <strong>{cause}</strong>
        </div>
        <div className="cause-effect-arrow" aria-hidden="true">-&gt;</div>
        <div>
          <span>Effect</span>
          <strong>{effect}</strong>
        </div>
      </div>
      <p>{because}</p>
    </section>
  );
}
