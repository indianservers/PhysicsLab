import type { ReactNode } from "react";

export interface MobileExperimentSheetProps {
  title?: string;
  open: boolean;
  children: ReactNode;
  onToggle: () => void;
}

export function MobileExperimentSheet({ title = "Experiment tools", open, children, onToggle }: MobileExperimentSheetProps) {
  return (
    <section className={open ? "mobile-experiment-sheet mobile-experiment-sheet-open" : "mobile-experiment-sheet"} aria-label={title}>
      <button className="mobile-experiment-sheet-handle" type="button" aria-expanded={open} onClick={onToggle}>
        <span>{title}</span>
        <b>{open ? "Close" : "Open"}</b>
      </button>
      {open && <div className="mobile-experiment-sheet-body">{children}</div>}
    </section>
  );
}
