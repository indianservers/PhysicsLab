export const scaleCategoryFilters = [
  "Particles",
  "Atoms",
  "Molecules",
  "Cells and Microbes",
  "Human Scale",
  "Animals",
  "Earth and Geography",
  "Planets and Moons",
  "Stars",
  "Galaxies",
  "Cosmic Structures",
  "Distances",
];

export function createFilterController(root, state, callbacks) {
  const panel = root.querySelector(".scale-filter-panel");
  const active = new Set(scaleCategoryFilters);

  const render = () => {
    panel.innerHTML = `
      <div class="scale-filter-head">
        <p class="scale-eyebrow">Categories</p>
        <button type="button" data-filter-reset>Reset Filters</button>
      </div>
      <div class="scale-filter-chips">
        ${scaleCategoryFilters
          .map((category) => `<button type="button" data-filter="${category}" aria-pressed="${active.has(category)}">${category}</button>`)
          .join("")}
      </div>
    `;
  };

  const syncState = () => {
    state.categoryFilters = new Set(active);
    callbacks.onChange?.();
  };

  const onClick = (event) => {
    const reset = event.target.closest("[data-filter-reset]");
    if (reset) {
      active.clear();
      for (const category of scaleCategoryFilters) active.add(category);
      render();
      syncState();
      return;
    }
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    const category = button.dataset.filter;
    if (active.has(category)) active.delete(category);
    else active.add(category);
    render();
    syncState();
  };

  panel.addEventListener("click", onClick);
  render();
  syncState();

  return {
    reset() {
      active.clear();
      for (const category of scaleCategoryFilters) active.add(category);
      render();
      syncState();
    },
    destroy() {
      panel.removeEventListener("click", onClick);
    },
  };
}
