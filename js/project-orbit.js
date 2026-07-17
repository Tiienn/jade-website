/* Jade Group — scroll-scrubbed project orbit (no dependencies) */

(function () {
  "use strict";

  var section = document.querySelector(".orbit");
  if (!section) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  var sticky = section.querySelector(".orbit__sticky");
  var founding = section.querySelector(".orbit__founding");
  var centerSquare = section.querySelector(".orbit__square");
  var cards = Array.prototype.slice.call(section.querySelectorAll(".orbit__card"));
  var metrics = Array.prototype.slice.call(section.querySelectorAll(".orbit__metric"));
  var progressBar = section.querySelector(".orbit__progress-track i");
  if (!sticky || !founding || !centerSquare || !cards.length || !metrics.length) return;

  var raf = 0;
  var pointer = 0;
  var pointerTarget = 0;
  var twoPi = Math.PI * 2;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(from, to, amount) {
    return from + (to - from) * amount;
  }

  function smoothstep(from, to, value) {
    var amount = clamp((value - from) / (to - from), 0, 1);
    return amount * amount * (3 - 2 * amount);
  }

  function requestFrame() {
    if (!raf && !document.hidden) raf = window.requestAnimationFrame(render);
  }

  function render() {
    raf = 0;

    var rect = section.getBoundingClientRect();
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var scrollDistance = Math.max(1, rect.height - viewportHeight);
    var progress = clamp(-rect.top / scrollDistance, 0, 1);
    var enter = smoothstep(0.04, 0.24, progress);
    var exit = smoothstep(0.42, 0.56, progress);

    pointer += (pointerTarget - pointer) * 0.13;

    /* One radius for both axes: the orbit echoes Jade's circular emblem. */
    var radius = viewportWidth < 700
      ? Math.min(viewportWidth * 0.39, viewportHeight * 0.3)
      : Math.min(viewportWidth * 0.32, viewportHeight * 0.41);
    var radiusX = radius;
    var radiusY = radius;
    var rotation = -Math.PI * 0.68 + progress * Math.PI * 2.35 + pointer * 0.16;
    var startSpacing = Math.min(viewportWidth * 0.115, 150);

    cards.forEach(function (card, index) {
      var angle = index / cards.length * twoPi + rotation;
      var circleX = Math.cos(angle) * radiusX;
      var circleY = Math.sin(angle) * radiusY;
      var startX = (index - (cards.length - 1) / 2) * startSpacing;
      var startY = viewportHeight * 0.39 + Math.sin(index * 1.73) * viewportHeight * 0.035;
      var startRotation = (index % 3 - 1) * 7;

      var x = mix(startX, circleX, enter);
      var y = mix(startY, circleY, enter);
      var angleDegrees = angle * 180 / Math.PI + 90;
      var cardRotation = mix(startRotation, angleDegrees, enter);

      var exitDirection = index % 2 ? 1 : -1;
      var endX = circleX * 1.48 + exitDirection * viewportWidth * 0.24;
      var endY = circleY * 1.4 + viewportHeight * 0.24;
      x = mix(x, endX, exit);
      y = mix(y, endY, exit);
      cardRotation += exit * exitDirection * 42;

      var scale = mix(0.72, 1, enter) * mix(1, 0.68, exit);
      var opacity = enter * (1 - exit);

      card.style.zIndex = String(12 + Math.round((Math.sin(angle) + 1) * 10));
      card.style.opacity = opacity.toFixed(3);
      card.style.transform =
        "translate(-50%, -50%) translate3d(" + x.toFixed(2) + "px," +
        y.toFixed(2) + "px,0) rotate(" + cardRotation.toFixed(2) +
        "deg) scale(" + scale.toFixed(3) + ")";
    });

    /* Let the photographs introduce the founding year, then hold it until
       Jade's circular emblem is complete. */
    var foundingIn = smoothstep(0.08, 0.18, progress);
    var foundingOut = 1 - smoothstep(0.34, 0.43, progress);
    var foundingOpacity = foundingIn * foundingOut;
    var foundingScale = 0.955 + enter * 0.045;
    founding.style.opacity = foundingOpacity.toFixed(3);
    founding.style.transform =
      "translate(-50%, -50%) scale(" + foundingScale.toFixed(3) + ")";

    /* The blurred square resolves only after the circular emblem is formed,
       then leaves on exactly the same beat as 1976. */
    var squareIn = smoothstep(0.2, 0.3, progress);
    var squareOpacity = squareIn * foundingOpacity;
    var squareScale = 0.82 + squareIn * 0.18;
    centerSquare.style.opacity = squareOpacity.toFixed(3);
    centerSquare.style.transform =
      "translate(-50%, -50%) scale(" + squareScale.toFixed(3) + ")";

    var metricReveal = smoothstep(0.43, 0.5, progress);
    var metricPosition = clamp((progress - 0.48) / 0.46, 0, 1) * (metrics.length - 1);
    /* Keep consecutive figures far enough apart for their full type blocks.
       The previous fixed gap was shorter than the number + label at common
       laptop heights, which allowed neighboring figures to collide. */
    var metricGap = Math.min(viewportHeight * 0.72, 520);

    metrics.forEach(function (metric, index) {
      var distance = index - metricPosition;
      var distanceAbs = Math.abs(distance);
      var opacity = (1 - smoothstep(0.34, 0.82, distanceAbs)) * metricReveal;
      var y = distance * metricGap;
      var scale = 1 - Math.min(distanceAbs, 1) * 0.04;

      metric.style.opacity = opacity.toFixed(3);
      metric.style.transform =
        "translate(-50%, -50%) translate3d(0," + y.toFixed(2) +
        "px,0) scale(" + scale.toFixed(3) + ")";
    });

    if (progressBar) progressBar.style.transform = "scaleX(" + progress.toFixed(4) + ")";

    if (Math.abs(pointerTarget - pointer) > 0.002) requestFrame();
  }

  sticky.addEventListener("pointermove", function (event) {
    var rect = sticky.getBoundingClientRect();
    pointerTarget = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    requestFrame();
  }, { passive: true });

  sticky.addEventListener("pointerleave", function () {
    pointerTarget = 0;
    requestFrame();
  }, { passive: true });

  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame, { passive: true });
  document.addEventListener("visibilitychange", requestFrame);
  requestFrame();
})();
