import type { ReactNode } from "react";

export function MobileLabDock({ title = "Mobile lab controls", children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mobile-lab-dock" aria-label={title}>
      <p className="premium-mini-label">{title}</p>
      {children}
    </section>
  );
}
