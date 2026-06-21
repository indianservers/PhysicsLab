export const premiumReplaySteps = ["setup", "prediction", "change variable", "observe", "explain", "conclusion"] as const;

export function ReplayTimeline({ activeStep = "setup", onStep }: { activeStep?: string; onStep?: (step: string) => void }) {
  return (
    <section className="replay-timeline" aria-label="Replay timeline">
      <p className="premium-mini-label">Replay timeline</p>
      <ol>
        {premiumReplaySteps.map((step, index) => (
          <li key={step}>
            <button type="button" aria-current={activeStep === step ? "step" : undefined} onClick={() => onStep?.(step)}>
              {index + 1}. {step}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
