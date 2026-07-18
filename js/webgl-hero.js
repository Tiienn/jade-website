/* Jade Group — localized WebGL highlights for Barclays and Alexander House */

(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  var media = document.querySelector(".hero__media");
  if (!hero || !media) return;

  var canvas = media.querySelector(".hero__webgl");
  var image = media.querySelector(".hero__image");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canvas || !image || reduceMotion) return;

  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance"
  });
  if (!gl) return;

  var vertexSource = [
    "attribute vec2 a_position;",
    "varying vec2 v_uv;",
    "void main() {",
    "  v_uv = a_position * 0.5 + 0.5;",
    "  gl_Position = vec4(a_position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var fragmentSource = [
    "precision mediump float;",
    "uniform sampler2D u_image;",
    "uniform vec2 u_resolution;",
    "uniform vec2 u_imageResolution;",
    "uniform vec2 u_pointer;",
    "uniform float u_hover;",
    "varying vec2 v_uv;",
    "vec2 coverUv(vec2 uv) {",
    "  float screenAspect = u_resolution.x / u_resolution.y;",
    "  float imageAspect = u_imageResolution.x / u_imageResolution.y;",
    "  if (screenAspect > imageAspect) {",
    "    float visibleHeight = imageAspect / screenAspect;",
    "    uv.y = uv.y * visibleHeight;",
    "  } else {",
    "    uv.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;",
    "  }",
    "  return uv;",
    "}",
    "void main() {",
    "  vec2 uv = coverUv(v_uv);",
    "  vec2 focusUv = coverUv(u_pointer);",
    "  vec2 lensVector = v_uv - u_pointer;",
    "  float aspect = u_resolution.x / u_resolution.y;",
    "  float lensDistance = length(vec2(lensVector.x * aspect, lensVector.y));",
    "  float lens = 1.0 - smoothstep(0.055, 0.245, lensDistance);",
    "  float strength = lens * u_hover;",
    "  uv -= (uv - focusUv) * strength * 0.052;",
    "  uv = clamp(uv, vec2(0.002), vec2(0.998));",
    "  vec3 color = texture2D(u_image, uv).rgb;",
    "  color *= 1.0 + strength * 0.015;",
    "  gl_FragColor = vec4(color, 1.0);",
    "}"
  ].join("\n");

  function makeShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = makeShader(gl.VERTEX_SHADER, vertexSource);
  var fragmentShader = makeShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  var position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  var uniforms = {
    image: gl.getUniformLocation(program, "u_image"),
    resolution: gl.getUniformLocation(program, "u_resolution"),
    imageResolution: gl.getUniformLocation(program, "u_imageResolution"),
    pointer: gl.getUniformLocation(program, "u_pointer"),
    hover: gl.getUniformLocation(program, "u_hover")
  };

  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uniforms.image, 0);

  var pointer = { x: 0.13, y: 0.42 };
  var pointerTarget = { x: 0.13, y: 0.42 };
  var hover = 0;
  var hoverTarget = 0;
  var raf = 0;
  var visible = true;
  var ready = false;

  function resize() {
    var rect = canvas.getBoundingClientRect();
    var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    var width = Math.max(1, Math.round(rect.width * ratio));
    var height = Math.max(1, Math.round(rect.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function requestFrame() {
    if (!raf && visible && !document.hidden) raf = window.requestAnimationFrame(draw);
  }

  function draw() {
    raf = 0;
    if (!visible || document.hidden) return;

    resize();
    pointer.x += (pointerTarget.x - pointer.x) * 0.14;
    pointer.y += (pointerTarget.y - pointer.y) * 0.14;
    hover += (hoverTarget - hover) * 0.13;

    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.imageResolution, image.naturalWidth, image.naturalHeight);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.hover, hover);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (!ready) {
      ready = true;
      media.classList.add("is-webgl");
    }
    raf = window.requestAnimationFrame(draw);
  }

  function prepareTexture() {
    if (!image.naturalWidth || !image.naturalHeight) return;
    try {
      for (var errorCount = 0; errorCount < 4 && gl.getError() !== gl.NO_ERROR; errorCount += 1) {}
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      if (gl.getError() !== gl.NO_ERROR) {
        canvas.dataset.webgl = "texture-unavailable";
        return;
      }
    } catch (error) {
      canvas.dataset.webgl = "image-unavailable";
      return;
    }
    resize();
    requestFrame();
  }

  function imagePoint(event) {
    var rect = media.getBoundingClientRect();
    var scale = Math.max(
      rect.width / image.naturalWidth,
      rect.height / image.naturalHeight
    );
    var drawnWidth = image.naturalWidth * scale;
    var drawnHeight = image.naturalHeight * scale;
    var offsetX = (rect.width - drawnWidth) * 0.5;
    var offsetY = rect.height - drawnHeight;
    var localX = event.clientX - rect.left;
    var localY = event.clientY - rect.top;

    return {
      sourceX: (localX - offsetX) / drawnWidth,
      sourceY: (localY - offsetY) / drawnHeight
    };
  }

  function sourceToScreen(sourceX, sourceY) {
    var rect = media.getBoundingClientRect();
    var scale = Math.max(
      rect.width / image.naturalWidth,
      rect.height / image.naturalHeight
    );
    var drawnWidth = image.naturalWidth * scale;
    var drawnHeight = image.naturalHeight * scale;
    var offsetX = (rect.width - drawnWidth) * 0.5;
    var offsetY = rect.height - drawnHeight;
    var localX = offsetX + sourceX * drawnWidth;
    var localY = offsetY + sourceY * drawnHeight;

    return {
      x: Math.max(0, Math.min(1, localX / rect.width)),
      y: 1 - Math.max(0, Math.min(1, localY / rect.height))
    };
  }

  hero.addEventListener("pointermove", function (event) {
    if (event.pointerType === "touch") return;

    var point = imagePoint(event);
    var overBarclays =
      point.sourceX >= 0.013 && point.sourceX <= 0.281 &&
      point.sourceY >= 0.342 && point.sourceY <= 0.649;
    var overAlexander =
      point.sourceX >= 0.725 && point.sourceX <= 0.924 &&
      point.sourceY >= 0.377 && point.sourceY <= 0.517;
    var focus = null;

    if (overBarclays) {
      focus = sourceToScreen(0.147, 0.496);
      media.dataset.buildingHover = "barclays";
    } else if (overAlexander) {
      focus = sourceToScreen(0.825, 0.447);
      media.dataset.buildingHover = "alexander";
    } else {
      delete media.dataset.buildingHover;
    }

    if (focus) {
      pointerTarget.x = focus.x;
      pointerTarget.y = focus.y;
      hoverTarget = 1;
    } else {
      hoverTarget = 0;
    }
  }, { passive: true });

  hero.addEventListener("pointerleave", function () {
    hoverTarget = 0;
    delete media.dataset.buildingHover;
  }, { passive: true });

  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", requestFrame);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) requestFrame();
    }, { threshold: 0 }).observe(media);
  }

  canvas.addEventListener("webglcontextlost", function () {
    visible = false;
    media.classList.remove("is-webgl");
    if (raf) window.cancelAnimationFrame(raf);
    raf = 0;
  });

  function decodeAndPrepareTexture() {
    if (typeof image.decode === "function") {
      image.decode().then(prepareTexture, prepareTexture);
    } else {
      prepareTexture();
    }
  }

  if (image.complete) decodeAndPrepareTexture();
  else image.addEventListener("load", decodeAndPrepareTexture, { once: true });
})();
