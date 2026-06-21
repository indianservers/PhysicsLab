const STORAGE_KEY = "scaleUniverseBookmarks";

export function createBookmarkController(root, objects, callbacks) {
  const panel = root.querySelector(".scale-bookmarks-panel");
  let bookmarks = loadBookmarks();

  const isBookmarked = (id) => bookmarks.includes(id);
  const toggle = (object) => {
    bookmarks = isBookmarked(object.id)
      ? bookmarks.filter((id) => id !== object.id)
      : [...bookmarks, object.id];
    saveBookmarks(bookmarks);
    render();
    return isBookmarked(object.id);
  };

  const open = () => {
    render();
    panel.hidden = false;
  };

  const close = () => {
    panel.hidden = true;
  };

  const clear = () => {
    bookmarks = [];
    saveBookmarks(bookmarks);
    render();
  };

  const render = () => {
    const savedObjects = bookmarks
      .map((id) => objects.find((object) => object.id === id))
      .filter(Boolean);
    panel.innerHTML = `
      <button type="button" class="scale-info-close" data-bookmarks-close aria-label="Close bookmarks">Close</button>
      <p class="scale-eyebrow">Saved objects</p>
      <h3>Bookmarks</h3>
      <div class="scale-bookmark-list">
        ${
          savedObjects.length
            ? savedObjects.map((object) => `<button type="button" data-bookmark-id="${object.id}"><strong>${object.name}</strong><span>${object.bestUnitLabel}</span></button>`).join("")
            : `<p class="scale-empty-state">No bookmarks yet. Open any object and tap Bookmark.</p>`
        }
      </div>
      <button type="button" data-bookmarks-clear>Clear All Bookmarks</button>
    `;
  };

  const onClick = (event) => {
    if (event.target.closest("[data-bookmarks-close]")) close();
    if (event.target.closest("[data-bookmarks-clear]")) clear();
    const id = event.target.closest("[data-bookmark-id]")?.dataset.bookmarkId;
    if (id) {
      const object = objects.find((candidate) => candidate.id === id);
      if (object) callbacks.zoomTo(object);
    }
  };

  panel.addEventListener("click", onClick);
  render();

  return {
    open,
    close,
    toggle,
    isBookmarked,
    list: () => [...bookmarks],
    destroy() {
      panel.removeEventListener("click", onClick);
    },
  };
}

function loadBookmarks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}
