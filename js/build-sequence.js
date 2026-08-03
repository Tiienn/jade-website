/* Jade Group — Alexander House assembling on scroll.

   Frames are pre-rendered stills, not a <video>. Scrubbing a video by scroll
   is unreliable — iOS Safari in particular stalls or refuses to seek smoothly,
   and encoding one that *does* scrub well (all keyframes) is larger than this
   whole sequence. Stills scrub exactly, everywhere.

   48 frames, ~870 KB total, fetched only as the section approaches. */

(function () {
  "use strict";

  var section = document.querySelector(".build");
  if (!section) return;

  var host = section.querySelector("#build-frames");
  var levelEl = section.querySelector("#build-level");
  var total = parseInt(section.dataset.frames, 10) || 48;
  var path = section.dataset.path;
  if (!host || !path) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Begin with the preparatory construction stage, then rise floor by floor
  // to Jade Group's office on Level 5.
  var LEVELS = [
    [0.00, "Under construction"],
    [0.10, "Level 1"],
    [0.25, "Level 2"],
    [0.40, "Level 3"],
    [0.55, "Level 4"],
    [0.70, "Level 5"]
  ];

  var frames = [];
  var loaded = 0;
  var current = -1;
  var built = false;

  function labelFor(p) {
    var name = LEVELS[0][1];
    for (var i = 0; i < LEVELS.length; i++) {
      if (p >= LEVELS[i][0]) name = LEVELS[i][1];
    }
    return name;
  }

  function show(i) {
    if (i === current || !frames[i]) return;
    if (frames[current]) frames[current].classList.remove("is-shown");
    frames[i].classList.add("is-shown");
    current = i;
  }

  function build() {
    if (built) return;
    built = true;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < total; i++) {
      var img = new Image();
      img.src = path + "/" + String(i).padStart(2, "0") + ".webp";
      img.alt = i === total - 1
        ? "The structure of Alexander House, complete, seen from the front"
        : "";
      if (i !== total - 1) img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      img.addEventListener("load", function () {
        loaded++;
        // reveal the first frame as soon as anything is ready
        if (current === -1) show(0);
      });
      frames.push(img);
      frag.appendChild(img);
    }
    host.appendChild(frag);
    show(0);
  }

  if (reduceMotion) {
    // No scrubbing: just the finished structure.
    var still = new Image();
    still.src = path + "/" + String(total - 1).padStart(2, "0") + ".webp";
    still.alt = "The structure of Alexander House, complete, seen from the front";
    still.className = "is-shown";
    host.appendChild(still);
    if (levelEl) levelEl.textContent = "Level 5";
    return;
  }

  // Only fetch the sequence once the section is near.
  if ("IntersectionObserver" in window) {
    var pre = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { build(); pre.disconnect(); }
    }, { rootMargin: "150% 0px" });
    pre.observe(section);
  } else {
    build();
  }

  var raf = 0;

  function update() {
    raf = 0;
    var rect = section.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top > vh) return;

    build();

    var travel = Math.max(1, rect.height - vh);
    var p = Math.max(0, Math.min(1, -rect.top / travel));

    show(Math.min(total - 1, Math.round(p * (total - 1))));
    section.style.setProperty("--build-progress", p.toFixed(4));
    if (levelEl) {
      var name = labelFor(p);
      if (levelEl.textContent !== name) levelEl.textContent = name;
    }
  }

  function request() {
    if (!raf) raf = window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  update();
})();
