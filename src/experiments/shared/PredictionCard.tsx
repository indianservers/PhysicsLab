export function PredictionCard({ prompt, hint }: { prompt: string; hint?: string }) {
  return (
    <section className="prediction-card" aria-label="Prediction prompt">
      <p className="premium-mini-label">Predict first</p>
      <h3>{prompt}</h3>
      {hint && <p>{hint}</p>}
    </section>
  );
}
