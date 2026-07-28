/* Jade Group — Ebène interactive plan + turntable viewer (prototype, no deps) */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Buildings that have a rendered turntable declare frames + path.
     The others fall back to a photograph until their model exists. */
  var DATA = {
    "alexander-house": {
      name: "Alexander House",
      category: "Offices",
      facts: [["Location", "35 Cybercity, Ebène"], ["Scale", "Ground + 4 floors"], ["Sector", "Offices"]],
      note: "Among the first buildings built in Ebène, and home to Jade Group's own offices.",
      href: "project.html?p=alexander-house",
      frames: 24,
      path: "img/buildings/alexander-house/"
    },
    "barclays-house": {
      name: "Barclays House",
      category: "Offices",
      facts: [["Location", "Ebène Cybercity"], ["Scale", "Ground + 6 floors"], ["Sector", "Offices"]],
      note: "Also known as Jade Tower — home to the Barclays Bank Ltd. head office. 3D model in production.",
      href: "project.html?p=barclays-house",
      still: "img/projects/barclays-house-blue-sky.jpg"
    },
    "raffles-tower": {
      name: "Raffles Tower",
      category: "Offices",
      facts: [["Location", "Ebène Cybercity"], ["Scale", "Ground + 12 floors"], ["Sector", "Offices"]],
      note: "A modern tower overlooking the motorway, today known as Standard Chartered Tower. 3D model in production.",
      href: "project.html?p=raffles-tower",
      still: "img/projects/raffles-tower-blue-sky.jpg"
    }
  };

  var eb      = document.getElementById("eb");
  var enter   = document.querySelector(".eb__enter");
  var marks   = Array.prototype.slice.call(document.querySelectorAll(".eb__mark"));
  var bv      = document.getElementById("bv");
  var frames  = document.getElementById("bv-frames");
  var still   = document.getElementById("bv-still");
  var loading = document.getElementById("bv-loading");
  var dragHint= document.getElementById("bv-drag");
  var stage   = document.querySelector(".bv__stage");
  var lastFocus = null;

  /* ---------------- reveal the plan ---------------- */
  function showPlan() {
    eb.classList.add("is-plan");
    enter.setAttribute("aria-expanded", "true");
  }
  enter.addEventListener("click", showPlan);

  // reveal on first scroll too, so it feels connected to the page
  window.addEventListener("scroll", function once() {
    if (window.scrollY > 40) { showPlan(); window.removeEventListener("scroll", once); }
  }, { passive: true });

  /* ---------------- turntable ---------------- */
  var imgs = [];
  var current = 0;
  var frameCount = 0;
  var spin = 0;

  function buildFrames(cfg, done) {
    frames.innerHTML = "";
    imgs = [];
    frameCount = cfg.frames;
    var loaded = 0;
    loading.hidden = false;

    for (var i = 0; i < frameCount; i++) {
      var im = new Image();
      im.decoding = "async";
      im.alt = i === 0 ? cfg.name + " — three-dimensional model" : "";
      im.src = cfg.path + String(i).padStart(2, "0") + ".webp";
      im.addEventListener("load", function () {
        if (++loaded === frameCount) { loading.hidden = true; done && done(); }
      });
      im.addEventListener("error", function () {
        if (++loaded === frameCount) { loading.hidden = true; done && done(); }
      });
      frames.appendChild(im);
      imgs.push(im);
    }
    show(0);
  }

  function show(i) {
    if (!imgs.length) return;
    current = ((i % frameCount) + frameCount) % frameCount;
    for (var n = 0; n < imgs.length; n++) {
      imgs[n].classList.toggle("is-shown", n === current);
    }
  }

  /* gentle auto-rotation until the visitor takes over */
  function autoSpin() {
    if (reduce || !frameCount) return;
    stopSpin();
    spin = window.setInterval(function () { show(current + 1); }, 110);
  }
  function stopSpin() { if (spin) { window.clearInterval(spin); spin = 0; } }

  /* drag to turn */
  var dragging = false, startX = 0, startFrame = 0;

  function pointerDown(e) {
    if (!frameCount) return;
    dragging = true; stopSpin();
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    startFrame = current;
    stage.classList.add("is-dragging");
  }
  function pointerMove(e) {
    if (!dragging) return;
    var x = (e.touches ? e.touches[0].clientX : e.clientX);
    var dx = x - startX;
    var perFrame = stage.clientWidth / (frameCount * 1.25);
    show(startFrame + Math.round(dx / perFrame));
  }
  function pointerUp() { dragging = false; stage.classList.remove("is-dragging"); }

  stage.addEventListener("mousedown", pointerDown);
  window.addEventListener("mousemove", pointerMove);
  window.addEventListener("mouseup", pointerUp);
  stage.addEventListener("touchstart", pointerDown, { passive: true });
  stage.addEventListener("touchmove", pointerMove, { passive: true });
  stage.addEventListener("touchend", pointerUp);

  /* ---------------- open / close ---------------- */
  function open(slug) {
    var cfg = DATA[slug];
    if (!cfg) return;
    lastFocus = document.activeElement;

    document.getElementById("bv-cat").textContent = cfg.category;
    document.getElementById("bv-name").textContent = cfg.name;
    document.getElementById("bv-note").textContent = cfg.note;
    document.getElementById("bv-link").href = cfg.href;

    var dl = document.getElementById("bv-facts");
    dl.innerHTML = "";
    cfg.facts.forEach(function (f) {
      var row = document.createElement("div");
      row.innerHTML = "<dt>" + f[0] + "</dt><dd>" + f[1] + "</dd>";
      dl.appendChild(row);
    });

    marks.forEach(function (m) { m.classList.toggle("is-active", m.dataset.slug === slug); });

    if (cfg.frames) {
      still.hidden = true; frames.hidden = false; dragHint.hidden = false;
      buildFrames(cfg, autoSpin);
    } else {
      stopSpin();
      frames.innerHTML = ""; frames.hidden = true;
      loading.hidden = true; dragHint.hidden = true;
      still.hidden = false;
      still.src = cfg.still;
      still.alt = cfg.name;
    }

    bv.hidden = false;
    requestAnimationFrame(function () { bv.classList.add("is-open"); });
    document.body.style.overflow = "hidden";
    document.querySelector(".bv__close").focus();
  }

  function close() {
    stopSpin();
    bv.classList.remove("is-open");
    document.body.style.overflow = "";
    marks.forEach(function (m) { m.classList.remove("is-active"); });
    window.setTimeout(function () { bv.hidden = true; frames.innerHTML = ""; imgs = []; frameCount = 0; }, 400);
    if (lastFocus) lastFocus.focus();
  }

  marks.forEach(function (m) {
    m.addEventListener("click", function () { open(m.dataset.slug); });
    m.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(m.dataset.slug); }
    });
  });

  document.querySelector(".bv__close").addEventListener("click", close);
  bv.addEventListener("click", function (e) { if (e.target === bv) close(); });
  document.addEventListener("keydown", function (e) {
    if (bv.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") { stopSpin(); show(current + 1); }
    if (e.key === "ArrowLeft")  { stopSpin(); show(current - 1); }
  });
})();
