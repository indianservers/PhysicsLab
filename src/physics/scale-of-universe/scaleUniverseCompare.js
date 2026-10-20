export function createCompareController(root, objects, callbacks) {
  const panel = root.querySelector(".scale-compare-panel");
  const select = root.querySelector(".scale-compare-select");
  let objectA = null;
  let objectB = null;
  let extraObjects = [];

  for (const object of objects) {
    const option = document.createElement("option");
    option.value = object.id;
    option.textContent = `${object.name} (${formatPower(object.logSize)} m)`;
    select.appendChild(option);
  }

  const open = (selectedObject) => {
    objectA = selectedObject;
    extraObjects = [];
    objectB = objects.find((object) => object.id !== objectA.id && object.importance >= 9) ?? objects[0];
    select.value = objectB.id;
    render();
    panel.hidden = false;
  };

  const close = () => {
    panel.hidden = true;
  };

  const render = () => {
    if (!objectA || !objectB) return;
    const collection = [objectA, objectB, ...extraObjects].filter((object, index, all) => all.findIndex(item => item.id === object.id) === index);
    const maximum = Math.max(...collection.map(object => object.sizeMeters));
    const larger = objectA.sizeMeters >= objectB.sizeMeters ? objectA : objectB;
    const smaller = larger === objectA ? objectB : objectA;
    const ratio = larger.sizeMeters / smaller.sizeMeters;
    panel.querySelector(".scale-compare-body").innerHTML = `
      <div class="scale-compare-grid">
        ${compareCard(objectA)}
        ${compareCard(objectB)}
        ${extraObjects.map(compareCard).join("")}
      </div>
      <div class="scale-compare-physical" aria-label="Shared linear scale comparison">${collection.map(object => `<div style="width:${100 * object.sizeMeters / maximum}px;height:${100 * object.sizeMeters / maximum}px"><span>${object.name}</span></div>`).join("")}</div>
      <p class="scale-compare-measure-note">Shared linear scale: 100 px = ${formatMeters(maximum)}. Smaller dimensions below one pixel remain subpixel; they are not enlarged. Comparing declared reference lengths, which may use different axes.</p>
      <button type="button" data-compare-add ${collection.length >= 4 ? "disabled" : ""}>Keep selection and add another (up to 4)</button>
      <p class="scale-compare-ratio"><strong>${larger.name}</strong> is about <strong>${formatRatio(ratio)}</strong> larger than <strong>${smaller.name}</strong>.</p>
      <div class="scale-compare-actions">
        <button type="button" data-compare-zoom="a">Zoom to ${objectA.name}</button>
        <button type="button" data-compare-zoom="b">Zoom to ${objectB.name}</button>
      </div>
    `;
  };

  const onSelect = () => {
    objectB = objects.find((object) => object.id === select.value) ?? objectB;
    render();
  };

  const onClick = (event) => {
    if (event.target.closest("[data-compare-close]")) close();
    if (event.target.closest("[data-compare-add]") && objectB && extraObjects.length < 2) {
      if (!extraObjects.some(object => object.id === objectB.id) && objectB.id !== objectA.id) extraObjects.push(objectB);
      objectB = objects.find(object => object.id !== objectA.id && !extraObjects.some(extra => extra.id === object.id)) ?? objectB;
      select.value = objectB.id;
      render();
    }
    const zoom = event.target.closest("[data-compare-zoom]")?.dataset.compareZoom;
    if (zoom === "a" && objectA) callbacks.zoomTo(objectA);
    if (zoom === "b" && objectB) callbacks.zoomTo(objectB);
  };

  select.addEventListener("change", onSelect);
  panel.addEventListener("click", onClick);

  return {
    open,
    close,
    destroy() {
      select.removeEventListener("change", onSelect);
      panel.removeEventListener("click", onClick);
    },
  };
}

function compareCard(object) {
  return `
    <article>
      <span>${object.category}</span>
      <strong>${object.name}</strong>
      <em>${formatMeters(object.sizeMeters)}</em>
      <small>10<sup>${object.logSize.toFixed(1)}</sup> meters</small>
    </article>
  `;
}

export function formatRatio(value) {
  if (!Number.isFinite(value) || value <= 0) return "unknown";
  if (value < 1_000) return `${value.toFixed(value >= 100 ? 0 : 1).replace(/\.0$/, "")}x`;
  if (value < 1_000_000) return `${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1).replace(/\.0$/, "")} thousand times`;
  if (value < 1_000_000_000) return `${(value / 1_000_000).toFixed(value >= 100_000_000 ? 0 : 1).replace(/\.0$/, "")} million times`;
  return `10^${Math.log10(value).toFixed(1)} times`;
}

export function formatMeters(value) {
  if (value === 0) return "0 m";
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);
  return `${mantissa.toFixed(mantissa >= 10 ? 0 : 2).replace(/\.?0+$/, "")} x 10^${exponent} m`;
}

function formatPower(log) {
  return `10^${log.toFixed(1)}`;
}
