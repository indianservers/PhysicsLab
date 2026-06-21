export const classroomLessons = [
  {
    id: "powers-of-ten-atom-to-human",
    title: "Powers of Ten: Atom to Human",
    steps: [
      step("hydrogen-atom", "Atoms are around 10^-10 meters, far too small to see directly."),
      step("dna-width", "DNA width is measured in nanometers."),
      step("red-blood-cell", "Cells move us into micrometers."),
      step("human", "Human size is the everyday meter-scale reference."),
    ],
  },
  {
    id: "biology-scale-molecule-to-cell",
    title: "Biology Scale: Molecule to Cell",
    steps: [
      step("water-molecule", "Molecules are nanoscale arrangements of atoms."),
      step("protein-molecule", "Proteins are larger molecular machines."),
      step("virus", "Viruses bridge molecular scale and living cells."),
      step("e-coli", "Bacteria are usually micrometer-scale organisms."),
      step("red-blood-cell", "Human cells can be compared directly under microscopes."),
    ],
  },
  {
    id: "space-scale-earth-to-observable",
    title: "Space Scale: Earth to Observable Universe",
    steps: [
      step("earth", "Earth is a planet-scale object measured in kilometers."),
      step("earth-sun-distance", "Astronomical units help with Solar System distances."),
      step("light-year", "Light years help with distances between stars."),
      step("milky-way", "Galaxies contain billions of stars."),
      step("observable-universe", "The observable universe is the largest scale in this module."),
    ],
  },
];

export function createTeacherMode(root, objects, callbacks) {
  const panel = root.querySelector(".scale-teacher-panel");
  let enabled = false;
  let lesson = classroomLessons[0];
  let stepIndex = 0;

  const open = () => {
    enabled = true;
    root.classList.add("scale-teacher-mode");
    renderPicker();
    panel.hidden = false;
  };

  const close = () => {
    enabled = false;
    root.classList.remove("scale-teacher-mode");
    panel.hidden = true;
  };

  const startLesson = (lessonId) => {
    lesson = classroomLessons.find((item) => item.id === lessonId) ?? classroomLessons[0];
    stepIndex = 0;
    showStep();
  };

  const showStep = () => {
    const current = lesson.steps[stepIndex];
    const object = objects.find((candidate) => candidate.id === current.objectId);
    if (object) callbacks.zoomTo(object);
    panel.innerHTML = `
      <p class="scale-eyebrow">Teacher Mode</p>
      <h3>${lesson.title}</h3>
      <strong>Step ${stepIndex + 1} of ${lesson.steps.length}</strong>
      <p>${current.teachingNote}</p>
      <div class="scale-journey-actions">
        <button type="button" data-teacher-action="previous" ${stepIndex === 0 ? "disabled" : ""}>Previous</button>
        <button type="button" data-teacher-action="next" ${stepIndex === lesson.steps.length - 1 ? "disabled" : ""}>Next</button>
        <button type="button" data-teacher-action="exit">Exit Teacher Mode</button>
      </div>
      <small>Keyboard: Left/Right arrows move steps, F fullscreen, Escape exits.</small>
    `;
  };

  const renderPicker = () => {
    panel.innerHTML = `
      <p class="scale-eyebrow">Teacher Mode</p>
      <h3>Choose a classroom lesson</h3>
      <div class="scale-teacher-lessons">
        ${classroomLessons.map((item) => `<button type="button" data-teacher-lesson="${item.id}">${item.title}</button>`).join("")}
      </div>
      <button type="button" data-teacher-action="exit">Exit Teacher Mode</button>
      <small>Keyboard: Left/Right arrows move steps, F fullscreen, Escape exits.</small>
    `;
  };

  const next = () => {
    stepIndex = Math.min(lesson.steps.length - 1, stepIndex + 1);
    showStep();
  };

  const previous = () => {
    stepIndex = Math.max(0, stepIndex - 1);
    showStep();
  };

  const onClick = (event) => {
    const lessonId = event.target.closest("[data-teacher-lesson]")?.dataset.teacherLesson;
    if (lessonId) startLesson(lessonId);
    const action = event.target.closest("[data-teacher-action]")?.dataset.teacherAction;
    if (action === "next") next();
    if (action === "previous") previous();
    if (action === "exit") close();
  };

  const onKey = (event) => {
    if (!enabled) return;
    if (event.key === "ArrowRight") next();
    if (event.key === "ArrowLeft") previous();
    if (event.key === "Escape") close();
    if (event.key.toLowerCase() === "f") root.requestFullscreen?.();
  };

  panel.addEventListener("click", onClick);
  window.addEventListener("keydown", onKey);

  return {
    open,
    close,
    isEnabled: () => enabled,
    destroy() {
      panel.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
    },
  };
}

function step(objectId, teachingNote) {
  return { objectId, teachingNote };
}
