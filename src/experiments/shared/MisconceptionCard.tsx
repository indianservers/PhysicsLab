export function MisconceptionCard({ misconception, correction }: { misconception: string; correction: string }) {
  return (
    <section className="misconception-card" aria-label="Common misconception">
      <p className="premium-mini-label">Misconception watch</p>
      <h3>{misconception}</h3>
      <p>{correction}</p>
    </section>
  );
}
