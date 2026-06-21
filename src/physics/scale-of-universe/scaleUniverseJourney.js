export const scaleJourneys = [
  {
    id: "atom-to-human",
    name: "From Atom to Human",
    objectIds: ["hydrogen-atom", "dna-width", "virus", "e-coli", "red-blood-cell", "human-hair-width", "human"],
  },
  {
    id: "cell-to-elephant",
    name: "From Cell to Elephant",
    objectIds: ["red-blood-cell", "human-hair-width", "grain-of-sand", "ant", "human", "giraffe", "elephant"],
  },
  {
    id: "earth-to-sun",
    name: "From Earth to Sun",
    objectIds: ["moon", "earth", "jupiter", "earth-sun-distance", "sun"],
  },
  {
    id: "solar-to-galaxy",
    name: "From Solar System to Galaxy",
    objectIds: ["sun", "earth-sun-distance", "solar-system", "light-year", "milky-way"],
  },
  {
    id: "human-to-observable",
    name: "From Human to Observable Universe",
    objectIds: ["human", "mount-everest", "earth", "sun", "solar-system", "light-year", "milky-way", "local-group", "observable-universe"],
  },
];

export function createJourneyController(root, objects, callbacks) {
  const picker = root.querySelector(".scale-journey-picker");
  const status = root.querySelector(".scale-journey-status");
  let activeJourney = null;
  let stepIndex = 0;

  picker.innerHTML = scaleJourneys
    .map((journey) => `<button type="button" data-journey-id="${journey.id}">${journey.name}</button>`)
    .join("");

  const openPicker = () => {
    picker.hidden = false;
    status.hidden = true;
  };

  const closePicker = () => {
    picker.hidden = true;
  };

  const start = (journeyId) => {
    activeJourney = scaleJourneys.find((journey) => journey.id === journeyId) ?? scaleJourneys[0];
    stepIndex = 0;
    picker.hidden = true;
    status.hidden = false;
    goToCurrentStep();
  };

  const exit = () => {
    activeJourney = null;
    stepIndex = 0;
    status.hidden = true;
  };

  const next = () => {
    if (!activeJourney) return;
    stepIndex = Math.min(activeJourney.objectIds.length - 1, stepIndex + 1);
    goToCurrentStep();
  };

  const previous = () => {
    if (!activeJourney) return;
    stepIndex = Math.max(0, stepIndex - 1);
    goToCurrentStep();
  };

  const goToCurrentStep = () => {
    const object = getCurrentObject(objects, activeJourney, stepIndex);
    if (!object) return;
    callbacks.zoomTo(object);
    renderStatus(object);
  };

  const renderStatus = (object) => {
    status.innerHTML = `
      <p class="scale-eyebrow">Guided Journey</p>
      <h3>${activeJourney.name}</h3>
      <strong>Step ${stepIndex + 1} of ${activeJourney.objectIds.length}</strong>
      <p>${object.name}</p>
      <small>Size: 10<sup>${object.logSize.toFixed(1)}</sup> m</small>
      <div class="scale-journey-actions">
        <button type="button" data-journey-action="previous" ${stepIndex === 0 ? "disabled" : ""}>Previous</button>
        <button type="button" data-journey-action="next" ${stepIndex === activeJourney.objectIds.length - 1 ? "disabled" : ""}>Next</button>
        <button type="button" data-journey-action="exit">Exit Journey</button>
      </div>
    `;
  };

  const onPickerClick = (event) => {
    const id = event.target.closest("[data-journey-id]")?.dataset.journeyId;
    if (id) start(id);
  };

  const onStatusClick = (event) => {
    const action = event.target.closest("[data-journey-action]")?.dataset.journeyAction;
    if (action === "previous") previous();
    if (action === "next") next();
    if (action === "exit") exit();
  };

  picker.addEventListener("click", onPickerClick);
  status.addEventListener("click", onStatusClick);

  return {
    openPicker,
    closePicker,
    start,
    next,
    previous,
    exit,
    destroy() {
      picker.removeEventListener("click", onPickerClick);
      status.removeEventListener("click", onStatusClick);
    },
  };
}

function getCurrentObject(objects, journey, index) {
  if (!journey) return null;
  return objects.find((object) => object.id === journey.objectIds[index]) ?? null;
}
