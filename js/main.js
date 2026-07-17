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

  /* ---------- Alexander House scroll drift ---------- */
  var legacyVisual = document.querySelector(".legacy-visual");
  var legacyVisualImage = legacyVisual
    ? legacyVisual.querySelector("img")
    : null;

  if (!reduceMotion && legacyVisual && legacyVisualImage) {
    var legacyRaf = 0;

    function positionLegacyVisual() {
      legacyRaf = 0;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var rect = legacyVisual.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > viewportHeight) return;

      var progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      var range = window.innerWidth <= 700 ? 40 : 64;
      var shift = Math.max(-range / 2, Math.min(range / 2, (progress - 0.5) * range));
      legacyVisualImage.style.setProperty("--legacy-shift", shift.toFixed(2) + "px");
    }

    function requestLegacyPosition() {
      if (!legacyRaf) legacyRaf = window.requestAnimationFrame(positionLegacyVisual);
    }

    window.addEventListener("scroll", requestLegacyPosition, { passive: true });
    window.addEventListener("resize", requestLegacyPosition, { passive: true });
    positionLegacyVisual();
  }
})();
