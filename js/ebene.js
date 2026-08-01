const LANDMARKS = {
  "alexander-house": {
    number: "01",
    name: "Alexander House",
    meta: "Ebène Cybercity · G+4",
    project: "project.html?p=alexander-house",
    views: [
      { label: "Aerial", src: "img/tours/alexander-house/01-aerial-v2.jpg", alt: "Alexander House and its private roundabout at night" },
      { label: "Facade", src: "img/tours/alexander-house/02-facade.jpg", alt: "Curved front facade of Alexander House" },
      { label: "Night", src: "img/tours/alexander-house/03-night.jpg", alt: "Alexander House illuminated at night" },
      { label: "Interior", src: "img/tours/alexander-house/04-interior.jpg", alt: "Reception interior at Alexander House" }
    ]
  },
  "barclays-house": {
    number: "02",
    name: "Barclays House",
    meta: "Ebène Cybercity · G+6",
    project: "project.html?p=barclays-house",
    views: [
      { label: "Aerial", src: "img/tours/barclays-house/01-aerial.jpg", alt: "Barclays House at blue hour" },
      { label: "Facade", src: "img/tours/barclays-house/02-facade.jpg", alt: "Front facade of Barclays House" },
      { label: "Approach", src: "img/tours/barclays-house/03-approach.jpg", alt: "Approach to Barclays House" },
      { label: "Detail", src: "img/tours/barclays-house/04-detail.jpg", alt: "Architectural detail of Barclays House" }
    ]
  },
  "raffles-tower": {
    number: "03",
    name: "Raffles Tower",
    meta: "Ebène Cybercity · G+12",
    project: "project.html?p=raffles-tower",
    views: [
      { label: "Aerial", src: "img/tours/raffles-tower/01-aerial.jpg", alt: "Raffles Tower beside its large parking site at blue hour" },
      { label: "Facade", src: "img/tours/raffles-tower/02-facade.jpg", alt: "Low-angle view of the real Raffles Tower facade and entrance canopy" },
      { label: "Atrium", src: "img/tours/raffles-tower/03-atrium.jpg", alt: "Central glazed atrium and Raffles Tower signage" },
      { label: "Architecture", src: "img/tours/raffles-tower/04-architecture.jpg", alt: "Architectural view of Raffles Tower" }
    ]
  }
};

const map = document.getElementById("landmark-map");
const pins = Array.from(document.querySelectorAll("[data-map-select]"));
const tour = document.getElementById("building-tour");
const stage = document.getElementById("tour-stage");
const image = document.getElementById("tour-image");
const eyebrow = document.getElementById("tour-eyebrow");
const title = document.getElementById("tour-title");
const meta = document.getElementById("tour-meta");
const project = document.getElementById("tour-project");
const views = document.getElementById("tour-views");
const current = document.getElementById("tour-current");
const total = document.getElementById("tour-total");
const close = document.getElementById("close-tour");

let activeSlug = "alexander-house";
let activeView = 0;
let lastTrigger = null;
let dragStart = null;
let closeTimer = null;

function pad(number) {
  return String(number).padStart(2, "0");
}

function preloadBuilding(building) {
  building.views.forEach((view) => {
    const preload = new Image();
    preload.src = view.src;
  });
}

function renderView(index, immediate = false) {
  const building = LANDMARKS[activeSlug];
  const nextIndex = (index + building.views.length) % building.views.length;
  const view = building.views[nextIndex];
  activeView = nextIndex;

  if (!immediate) image.classList.add("is-changing");
  window.setTimeout(() => {
    image.src = view.src;
    image.alt = view.alt;
    current.textContent = pad(nextIndex + 1);
    views.querySelectorAll("button").forEach((button, buttonIndex) => {
      const selected = buttonIndex === nextIndex;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-current", selected ? "true" : "false");
    });
  }, immediate ? 0 : 180);
}

image.addEventListener("load", () => {
  image.classList.remove("is-changing");
});

function renderBuilding(slug) {
  const building = LANDMARKS[slug];
  if (!building) return;

  activeSlug = slug;
  activeView = 0;
  eyebrow.textContent = `Jade landmark ${building.number}`;
  title.textContent = building.name;
  meta.textContent = building.meta;
  project.href = building.project;
  total.textContent = pad(building.views.length);
  views.replaceChildren();

  building.views.forEach((view, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.innerHTML = `<span>${pad(index + 1)}</span>${view.label}`;
    button.addEventListener("click", () => renderView(index));
    views.append(button);
  });

  renderView(0, true);
  preloadBuilding(building);
}

function openTour(slug, trigger) {
  window.clearTimeout(closeTimer);
  lastTrigger = trigger;
  pins.forEach((pin) => pin.classList.toggle("is-active", pin.dataset.mapSelect === slug));
  renderBuilding(slug);
  tour.hidden = false;
  tour.setAttribute("aria-modal", "true");
  map.setAttribute("aria-hidden", "true");
  document.body.classList.add("tour-open");
  // Focus has to wait for `is-open`: until that class lands the panel is still
  // visually hidden, and focusing a hidden element silently fails — which left
  // keyboard users stranded on <body> with the tour open.
  requestAnimationFrame(() => {
    tour.classList.add("is-open");
    close.focus({ preventScroll: true });
  });
}

function closeTour() {
  tour.classList.remove("is-open");
  tour.removeAttribute("aria-modal");
  map.removeAttribute("aria-hidden");
  document.body.classList.remove("tour-open");
  pins.forEach((pin) => pin.classList.remove("is-active"));
  closeTimer = window.setTimeout(() => {
    tour.hidden = true;
    image.removeAttribute("src");
  }, 520);
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}

pins.forEach((pin) => {
  pin.addEventListener("click", () => openTour(pin.dataset.mapSelect, pin));
});

close.addEventListener("click", closeTour);

stage.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || dragStart) return;
  const bounds = stage.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * -2;
  const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -2;
  stage.style.setProperty("--look-x", `${x * 1.2}%`);
  stage.style.setProperty("--look-y", `${y * 1.2}%`);
});

stage.addEventListener("pointerleave", () => {
  stage.style.setProperty("--look-x", "0%");
  stage.style.setProperty("--look-y", "0%");
});

stage.addEventListener("pointerdown", (event) => {
  dragStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  stage.setPointerCapture(event.pointerId);
  stage.classList.add("is-dragging");
});

stage.addEventListener("pointerup", (event) => {
  if (!dragStart) return;
  const distance = event.clientX - dragStart.x;
  if (Math.abs(distance) > 55) renderView(activeView + (distance < 0 ? 1 : -1));
  stage.releasePointerCapture(dragStart.pointerId);
  dragStart = null;
  stage.classList.remove("is-dragging");
});

stage.addEventListener("pointercancel", () => {
  dragStart = null;
  stage.classList.remove("is-dragging");
});

document.addEventListener("keydown", (event) => {
  if (tour.hidden) return;
  if (event.key === "Escape") closeTour();
  if (event.key === "ArrowRight") renderView(activeView + 1);
  if (event.key === "ArrowLeft") renderView(activeView - 1);
});

window.__ebeneModuleLoaded = true;
