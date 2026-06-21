export interface PhysicsHUDItem {
  label: string;
  value: string;
  unit?: string;
  tone?: "accent" | "warning" | "neutral";
}

export function PhysicsHUD({ items, title = "Live readings" }: { items: PhysicsHUDItem[]; title?: string }) {
  return (
    <section className="physics-hud" aria-label={title}>
      <p className="premium-mini-label">{title}</p>
      <div className="premium-hud-grid">
        {items.map((item) => (
          <div className="physics-hud-item" data-tone={item.tone ?? "accent"} key={`${item.label}-${item.value}`}>
            <span>{item.label}</span>
            <strong>{item.value}{item.unit ? ` ${item.unit}` : ""}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
