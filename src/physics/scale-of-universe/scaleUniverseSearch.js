export function createSearchController(input, results, clearButton, objects, onSelect, options = {}) {
  const haystack = (object) => object.searchText ?? `${object.name} ${object.category} ${(object.learningTags ?? []).join(" ")}`.toLowerCase();
  const render = () => {
    const query = input.value.trim().toLowerCase();
    results.innerHTML = "";
    clearButton.hidden = !query;
    if (!query) {
      results.hidden = true;
      return;
    }
    const matches = objects
      .filter((object) => haystack(object).includes(query))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 8);
    results.hidden = false;
    if (matches.length === 0) {
      results.innerHTML = `<p class="scale-empty-state">No results. Try biology, micrometer, planet, galaxy, or beginner.</p>`;
      return;
    }
    const filters = options.getFilters?.() ?? new Set();
    for (const object of matches) {
      const hiddenByFilter = filters.size > 0 && !filters.has(object.categoryGroup);
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.objectId = object.id;
      button.innerHTML = `<strong>${options.isBookmarked?.(object.id) ? "* " : ""}${object.name}</strong><small>${object.category} - ${object.scaleBand} - ${object.difficultyLevel}</small><em>${object.bestUnitLabel}${hiddenByFilter ? " - hidden by filter" : ""}</em>`;
      const directChoose = (event) => {
        input.value = object.name;
        results.hidden = true;
        onSelect(object);
        event.preventDefault();
      };
      button.addEventListener("mousedown", directChoose);
      button.addEventListener("pointerdown", directChoose);
      button.addEventListener("click", directChoose);
      results.appendChild(button);
    }
  };
  const choose = (event) => {
    const button = event.target.closest?.("button[data-object-id]");
    if (!button) return;
    const object = objects.find((candidate) => candidate.id === button.dataset.objectId);
    if (!object) return;
    input.value = object.name;
    results.hidden = true;
    onSelect(object);
    event.preventDefault();
  };
  const handleKeydown = (event) => {
    if (event.key !== "Enter") return;
    const query = input.value.trim().toLowerCase();
    const object = objects.find((candidate) => haystack(candidate).includes(query));
    if (!object) return;
    input.value = object.name;
    clearButton.hidden = false;
    results.hidden = true;
    onSelect(object);
  };
  const clear = () => {
    input.value = "";
    clearButton.hidden = true;
    results.hidden = true;
    input.focus();
  };
  const handleOutsideClick = (event) => {
    if (!results.contains(event.target) && event.target !== input) results.hidden = true;
  };
  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  input.addEventListener("keydown", handleKeydown);
  clearButton.addEventListener("click", clear);
  results.addEventListener("pointerdown", choose);
  results.addEventListener("click", choose);
  document.addEventListener("click", handleOutsideClick);
  return {
    destroy() {
      input.removeEventListener("input", render);
      input.removeEventListener("focus", render);
      input.removeEventListener("keydown", handleKeydown);
      clearButton.removeEventListener("click", clear);
      results.removeEventListener("pointerdown", choose);
      results.removeEventListener("click", choose);
      document.removeEventListener("click", handleOutsideClick);
    },
  };
}
