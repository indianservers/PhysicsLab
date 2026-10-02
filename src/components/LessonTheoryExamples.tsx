import type { ExperimentDefinition } from "../types";
import { lessonTeachingContent } from "../lib/lessonTeachingContent";
import "./lesson-theory-examples.css";

export function LessonTheoryExamples({ experiment }: { experiment: ExperimentDefinition }) {
  const content = lessonTeachingContent[experiment.id];
  if (!content) return null;
  return (
    <section className="lesson-teaching" aria-labelledby={`lesson-theory-${experiment.id}`}>
      <details open>
        <summary>
          <span>Lesson theory &amp; examples</span>
          <strong id={`lesson-theory-${experiment.id}`}>{content.title}</strong>
          <small>Connect the animation to a calculation and a real situation</small>
        </summary>
        <div className="lesson-teaching-grid">
          <article className="lesson-theory-card">
            <span>WHY IT HAPPENS</span>
            <p>{content.theory}</p>
            <p className="lesson-theory-link"><b>Watch in the lab:</b> {content.watchFor}</p>
          </article>
          <article className="lesson-worked-card">
            <span>WORKED EXAMPLE</span>
            <h3>{content.worked.title}</h3>
            <p>{content.worked.question}</p>
            <ol>{content.worked.steps.map((step) => <li key={step}>{step}</li>)}</ol>
            <output>{content.worked.answer}</output>
          </article>
          <article className="lesson-application-card">
            <span>REAL-WORLD EXAMPLE</span>
            <h3>{content.application.title}</h3>
            <p>{content.application.explanation}</p>
            <details>
              <summary>Check your understanding</summary>
              <p><b>Question:</b> {content.check.question}</p>
              <p><b>Answer:</b> {content.check.answer}</p>
            </details>
          </article>
        </div>
      </details>
    </section>
  );
}
