import { getScaleBand } from "./scaleUniverseRenderer.js";

export function createQuizController(root, objects) {
  const panel = root.querySelector(".scale-quiz-panel");
  let questions = [];
  let index = 0;
  let score = 0;
  let answered = false;

  const start = () => {
    questions = buildQuestions(objects).slice(0, 10);
    index = 0;
    score = 0;
    answered = false;
    panel.hidden = false;
    render();
  };

  const close = () => {
    panel.hidden = true;
  };

  const render = (feedback = "") => {
    const question = questions[index];
    if (!question) {
      panel.innerHTML = `
        <button type="button" class="scale-info-close" data-quiz-close>Close</button>
        <p class="scale-eyebrow">Quiz complete</p>
        <h3>Score: ${score}/10</h3>
        <p>${score >= 8 ? "Excellent scale thinking." : "Good practice. Try again to strengthen powers-of-ten intuition."}</p>
        <button type="button" data-quiz-restart>Restart Quiz</button>
      `;
      return;
    }
    panel.innerHTML = `
      <button type="button" class="scale-info-close" data-quiz-close aria-label="Exit quiz">Close</button>
      <p class="scale-eyebrow">Quiz Mode</p>
      <h3>Question ${index + 1} of 10</h3>
      <p>${question.prompt}</p>
      <div class="scale-quiz-options">
        ${question.options.map((option) => `<button type="button" data-answer="${option.id}">${option.label}</button>`).join("")}
      </div>
      ${feedback ? `<p class="scale-quiz-feedback">${feedback}</p>` : ""}
      <div class="scale-quiz-footer">
        <strong>Score: ${score}</strong>
        <button type="button" data-quiz-next ${answered ? "" : "disabled"}>${index === 9 ? "Finish" : "Next"}</button>
      </div>
    `;
  };

  const answer = (id) => {
    if (answered) return;
    const question = questions[index];
    answered = true;
    const correct = id === question.answerId;
    if (correct) score += 1;
    render(`${correct ? "Correct." : "Not quite."} ${question.explanation}`);
  };

  const next = () => {
    if (!answered) return;
    index += 1;
    answered = false;
    render();
  };

  const onClick = (event) => {
    if (event.target.closest("[data-quiz-close]")) close();
    if (event.target.closest("[data-quiz-restart]")) start();
    if (event.target.closest("[data-quiz-next]")) next();
    const id = event.target.closest("[data-answer]")?.dataset.answer;
    if (id) answer(id);
  };

  panel.addEventListener("click", onClick);

  return {
    start,
    close,
    destroy() {
      panel.removeEventListener("click", onClick);
    },
  };
}

function buildQuestions(objects) {
  const important = objects.filter((object) => object.importance >= 8);
  const largerQuestions = [
    pair("earth", "mount-everest"),
    pair("human", "red-blood-cell"),
    pair("sun", "earth"),
    pair("milky-way", "solar-system"),
    pair("elephant", "ant"),
  ]
    .map(([aId, bId]) => {
      const a = objects.find((object) => object.id === aId);
      const b = objects.find((object) => object.id === bId);
      if (!a || !b) return null;
      const answer = a.sizeMeters > b.sizeMeters ? a : b;
      return {
        type: "larger",
        prompt: `Which is larger: ${a.name} or ${b.name}?`,
        options: [
          { id: a.id, label: a.name },
          { id: b.id, label: b.name },
        ],
        answerId: answer.id,
        explanation: `${answer.name} is larger because it measures about ${answer.bestUnitLabel}.`,
      };
    })
    .filter(Boolean);

  const bandQuestions = important.slice(0, 8).map((object) => {
    const band = getScaleBand(object.logSize);
    const choices = unique([band, "Subatomic", "Atomic", "Molecular", "Cellular / Microscopic", "Human Scale", "Planetary", "Galactic", "Cosmic"]).slice(0, 4);
    return {
      type: "band",
      prompt: `Which scale band best matches ${object.name}?`,
      options: choices.map((choice) => ({ id: choice, label: choice })),
      answerId: band,
      explanation: `${object.name} belongs near 10^${Math.round(object.logSize)} meters, which is ${band}.`,
    };
  });

  return [...largerQuestions, ...bandQuestions];
}

function pair(a, b) {
  return [a, b];
}

function unique(values) {
  return [...new Set(values)];
}
