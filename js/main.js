/* Jade Group — scroll reveals & image depth (no dependencies) */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- navigation contrast across light and dark sections ---------- */
  var nav = document.querySelector(".nav");
  var darkSections = document.querySelectorAll(".hero, .legacy-visual, .orbit, .people, .contact, .footer");
  var navRaf = 0;

  function updateNavTheme() {
    navRaf = 0;
    if (!nav) return;
    var sampleY = Math.min(nav.getBoundingClientRect().bottom / 2, 44);
    var isDark = false;

    darkSections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= sampleY && rect.bottom > sampleY) isDark = true;
    });

    nav.classList.toggle("nav--dark", isDark);
  }

  function requestNavTheme() {
    if (!navRaf) navRaf = window.requestAnimationFrame(updateNavTheme);
  }

  if (nav) {
    window.addEventListener("scroll", requestNavTheme, { passive: true });
    window.addEventListener("resize", requestNavTheme, { passive: true });
    updateNavTheme();
  }

  /* ---------- pinned hero: image pan + copy reveal ---------- */
  var hero = document.querySelector(".hero");

  if (hero && !reduceMotion && window.innerWidth > 700) {
    var heroRaf = 0;

    function updateHeroSequence() {
      heroRaf = 0;
      var rect = hero.getBoundingClientRect();
      var travel = Math.max(1, rect.height - window.innerHeight);
      var progress = Math.max(0, Math.min(1, -rect.top / travel));
      var copy = Math.max(0, Math.min(1, (progress - 0.08) / 0.62));
      var easedCopy = 1 - Math.pow(1 - copy, 3);

      hero.style.setProperty("--hero-pan", (progress * 100).toFixed(2) + "%");
      hero.style.setProperty("--hero-pan-progress", progress.toFixed(4));
      hero.style.setProperty("--hero-copy", easedCopy.toFixed(4));
      hero.style.setProperty("--hero-copy-y", ((1 - easedCopy) * 32).toFixed(2) + "px");
    }

    function requestHeroSequence() {
      if (!heroRaf) heroRaf = window.requestAnimationFrame(updateHeroSequence);
    }

    window.addEventListener("scroll", requestHeroSequence, { passive: true });
    window.addEventListener("resize", requestHeroSequence, { passive: true });
    updateHeroSequence();
  } else if (hero) {
    hero.style.setProperty("--hero-pan", "52%");
    hero.style.setProperty("--hero-pan-progress", "0.52");
    hero.style.setProperty("--hero-copy", "1");
    hero.style.setProperty("--hero-copy-y", "0px");
  }

  /* ---------- cursor daylight reveal over the night hero ---------- */
  var heroSticky = hero ? hero.querySelector(".hero__sticky") : null;
  var heroMedia = hero ? hero.querySelector(".hero__media") : null;
  var daylightImage = hero ? hero.querySelector(".hero__image--day") : null;
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (heroSticky && heroMedia && daylightImage && canHover && !reduceMotion) {
    var daylightRaf = 0;
    var daylightX = 0;
    var daylightY = 0;

    function positionDaylightReveal() {
      daylightRaf = 0;
      var rect = heroMedia.getBoundingClientRect();
      var x = Math.max(0, Math.min(rect.width, daylightX - rect.left));
      var y = Math.max(0, Math.min(rect.height, daylightY - rect.top));

      heroMedia.style.setProperty("--daylight-x", x.toFixed(1) + "px");
      heroMedia.style.setProperty("--daylight-y", y.toFixed(1) + "px");
    }

    heroSticky.addEventListener("pointerenter", function (event) {
      daylightX = event.clientX;
      daylightY = event.clientY;
      heroSticky.classList.add("is-daylight-active");
      positionDaylightReveal();
    });

    heroSticky.addEventListener("pointermove", function (event) {
      daylightX = event.clientX;
      daylightY = event.clientY;
      heroSticky.classList.add("is-daylight-active");
      if (!daylightRaf) daylightRaf = window.requestAnimationFrame(positionDaylightReveal);
    });

    heroSticky.addEventListener("pointerleave", function () {
      heroSticky.classList.remove("is-daylight-active");
    });
  }

  /* ---------- reliable back-to-top controls ---------- */
  document.querySelectorAll('a[href="#top"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  });

  /* ---------- static-site contact form ---------- */
  var contactForm = document.querySelector(".contact__form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      var data = new FormData(contactForm);
      var enquiry = data.get("enquiry") || "General enquiry";
      var body = [
        "Name: " + (data.get("name") || ""),
        "Email: " + (data.get("email") || ""),
        "Phone: " + (data.get("phone") || "Not provided"),
        "Enquiry about: " + enquiry,
        "",
        "Message:",
        data.get("message") || ""
      ].join("\n");

      window.location.href =
        "mailto:info@jadegroup.mu?subject=" +
        encodeURIComponent("Jade Group enquiry — " + enquiry) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    // Stagger siblings that enter together: give each a small delay
    // based on its index among .reveal elements inside the same parent.
    revealEls.forEach(function (el) {
      var siblings = el.parentElement
        ? el.parentElement.querySelectorAll(":scope > .reveal")
        : [];
      var i = Array.prototype.indexOf.call(siblings, el);
      if (i > 0) el.style.setProperty("--d", Math.min(i * 0.12, 0.6) + "s");
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- scroll-reading highlight for the Jade story ---------- */
  var legacyStatement = document.querySelector("[data-scroll-highlight]");
  var legacyStory = legacyStatement ? legacyStatement.closest(".legacy") : null;

  if (!reduceMotion && legacyStatement && legacyStory && window.innerWidth > 900) {
    var textNodes = [];
    var walker = document.createTreeWalker(
      legacyStatement,
      NodeFilter.SHOW_TEXT,
      null
    );
    var textNode;

    while ((textNode = walker.nextNode())) textNodes.push(textNode);

    textNodes.forEach(function (node) {
      var parts = node.nodeValue.split(/(\s+)/);
      var fragment = document.createDocumentFragment();

      parts.forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
          return;
        }

        var word = document.createElement("span");
        word.className = "legacy__word";
        word.textContent = part;
        fragment.appendChild(word);
      });

      node.parentNode.replaceChild(fragment, node);
    });

    var legacyWords = legacyStatement.querySelectorAll(".legacy__word");
    var storyRaf = 0;

    function updateStoryHighlight() {
      storyRaf = 0;
      var rect = legacyStory.getBoundingClientRect();
      var travel = Math.max(1, rect.height - window.innerHeight);
      var progress = Math.max(0, Math.min(1, -rect.top / travel));
      var wordCount = legacyWords.length;

      legacyWords.forEach(function (word, index) {
        var local = Math.max(
          0,
          Math.min(1, (progress * (wordCount + 5) - index) / 5)
        );
        var opacity = 0.16 + local * 0.84;
        word.style.setProperty("--word-opacity", opacity.toFixed(3));
      });
    }

    function requestStoryHighlight() {
      if (!storyRaf) storyRaf = window.requestAnimationFrame(updateStoryHighlight);
    }

    window.addEventListener("scroll", requestStoryHighlight, { passive: true });
    window.addEventListener("resize", requestStoryHighlight, { passive: true });
    updateStoryHighlight();
  }

  /* ---------- native-scroll depth on project photography ---------- */
  var depthPhotos = document.querySelectorAll(".gallery .project-photo");

  if (!reduceMotion && depthPhotos.length) {
    var depthRaf = 0;

    function positionDepthPhotos() {
      depthRaf = 0;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      depthPhotos.forEach(function (photo) {
        var rect = photo.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        var center = rect.top + rect.height / 2;
        var progress = (center - viewportHeight / 2) / (viewportHeight + rect.height);
        var shift = Math.max(-18, Math.min(18, progress * -42));
        photo.style.setProperty("--photo-shift", shift.toFixed(2) + "px");
      });
    }

    function requestDepthPosition() {
      if (!depthRaf) depthRaf = window.requestAnimationFrame(positionDepthPhotos);
    }

    window.addEventListener("scroll", requestDepthPosition, { passive: true });
    window.addEventListener("resize", requestDepthPosition, { passive: true });
    positionDepthPhotos();
  }

  /* ---------- Alexander House: blueprint-to-built scroll sequence ---------- */
  var legacyVisual = document.querySelector(".legacy-visual");
  var legacyVisualImages = legacyVisual
    ? legacyVisual.querySelectorAll(".legacy-visual__image")
    : [];

  if (!reduceMotion && legacyVisual && legacyVisualImages.length) {
    var legacyRaf = 0;

    function positionLegacyVisual() {
      legacyRaf = 0;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var rect = legacyVisual.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      var travel = Math.max(1, rect.height - viewportHeight);
      var progress = Math.max(0, Math.min(1, -rect.top / travel));
      var photoProgress = Math.max(0, Math.min(1, (progress - 0.16) / 0.7));
      var range = window.innerWidth <= 700 ? 26 : 42;
      var shift = (progress - 0.5) * range;

      legacyVisual.style.setProperty(
        "--photo-clip",
        (100 - photoProgress * 100).toFixed(2) + "%"
      );
      legacyVisual.style.setProperty(
        "--drawing-line-left",
        (photoProgress * 100).toFixed(2) + "%"
      );
      legacyVisual.style.setProperty(
        "--drawing-line-opacity",
        photoProgress > 0.01 && photoProgress < 0.995 ? "1" : "0"
      );
      legacyVisual.style.setProperty("--legacy-shift", shift.toFixed(2) + "px");
    }

    function requestLegacyPosition() {
      if (!legacyRaf) legacyRaf = window.requestAnimationFrame(positionLegacyVisual);
    }

    window.addEventListener("scroll", requestLegacyPosition, { passive: true });
    window.addEventListener("resize", requestLegacyPosition, { passive: true });
    positionLegacyVisual();
  }
})();
