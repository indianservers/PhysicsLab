export interface TeacherReplayStep {
  id: string;
  title: string;
  prompt: string;
  explanation: string;
}

export interface TeacherReplayProps {
  steps: TeacherReplayStep[];
  activeStepId?: string;
  onSelect?: (step: TeacherReplayStep) => void;
}

export function TeacherReplay({ steps, activeStepId, onSelect }: TeacherReplayProps) {
  const active = steps.find((step) => step.id === activeStepId) ?? steps[0];
  return (
    <section className="dedicated-teacher-replay" aria-label="Teacher replay">
      <div>
        <p className="ui-label">Teacher replay</p>
        <h3>{active?.title ?? "Replay checkpoints"}</h3>
        {active && <p>{active.explanation}</p>}
      </div>
      <div className="dedicated-replay-steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={active?.id === step.id ? "dedicated-replay-step dedicated-replay-step-active" : "dedicated-replay-step"}
            type="button"
            onClick={() => onSelect?.(step)}
          >
            <span>{index + 1}</span>
            <strong>{step.title}</strong>
            <small>{step.prompt}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
