/* Jade Group — lightweight WebGL hero lens (no dependencies) */

(function () {
  "use strict";

  var media = document.querySelector(".hero__media");
  if (!media) return;

  var canvas = media.querySelector(".hero__webgl");
  var image = media.querySelector("img");
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
    "uniform float u_time;",
    "uniform float u_velocity;",
    "varying vec2 v_uv;",
    "float noise(vec2 p) {",
    "  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);",
    "}",
    "vec2 coverUv(vec2 uv) {",
    "  float screenAspect = u_resolution.x / u_resolution.y;",
    "  float imageAspect = u_imageResolution.x / u_imageResolution.y;",
    "  if (screenAspect > imageAspect) {",
    "    uv.y = (uv.y - 0.5) * (imageAspect / screenAspect) + 0.5;",
    "  } else {",
    "    uv.x = (uv.x - 0.5) * (screenAspect / imageAspect) + 0.5;",
    "  }",
    "  return uv;",
    "}",
    "void main() {",
    "  vec2 uv = coverUv(v_uv);",
    "  vec2 lensVector = v_uv - u_pointer;",
    "  float lensDistance = length(lensVector);",
    "  float lens = 1.0 - smoothstep(0.04, 0.48, lensDistance);",
    "  uv -= lensVector * lens * 0.016;",
    "  float pulse = sin(u_time * 0.34 + v_uv.y * 5.0) * 0.00075;",
    "  uv.x += pulse + sin(v_uv.y * 17.0 + u_time * 0.42) * abs(u_velocity) * 0.0024;",
    "  uv.y += u_velocity * (v_uv.y - 0.5) * 0.018;",
    "  uv = clamp(uv, vec2(0.002), vec2(0.998));",
    "  vec2 split = vec2(u_velocity * 0.0018 + (u_pointer.x - 0.5) * 0.0009, 0.0);",
    "  float red = texture2D(u_image, clamp(uv + split, vec2(0.002), vec2(0.998))).r;",
    "  float green = texture2D(u_image, uv).g;",
    "  float blue = texture2D(u_image, clamp(uv - split, vec2(0.002), vec2(0.998))).b;",
    "  vec3 color = vec3(red, green, blue);",
    "  float jadeGlow = lens * 0.025;",
    "  color += vec3(0.0, jadeGlow, jadeGlow * 0.42);",
    "  float vignette = 1.0 - smoothstep(0.22, 0.82, distance(v_uv, vec2(0.5)));",
    "  color *= 0.88 + vignette * 0.12;",
    "  color += (noise(gl_FragCoord.xy + u_time * 37.0) - 0.5) * 0.016;",
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
    time: gl.getUniformLocation(program, "u_time"),
    velocity: gl.getUniformLocation(program, "u_velocity")
  };

  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.uniform1i(uniforms.image, 0);

  var pointer = { x: 0.5, y: 0.5 };
  var pointerTarget = { x: 0.5, y: 0.5 };
  var velocity = 0;
  var velocityTarget = 0;
  var lastScrollY = window.scrollY;
  var startedAt = window.performance.now();
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

  function draw(now) {
    raf = 0;
    if (!visible || document.hidden) return;

    resize();
    pointer.x += (pointerTarget.x - pointer.x) * 0.055;
    pointer.y += (pointerTarget.y - pointer.y) * 0.055;
    velocity += (velocityTarget - velocity) * 0.12;
    velocityTarget *= 0.9;

    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.imageResolution, image.naturalWidth, image.naturalHeight);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform1f(uniforms.time, (now - startedAt) / 1000);
    gl.uniform1f(uniforms.velocity, velocity);
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
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    } catch (error) {
      canvas.dataset.webgl = "image-unavailable";
      return;
    }
    resize();
    requestFrame();
  }

  media.addEventListener("pointermove", function (event) {
    var rect = media.getBoundingClientRect();
    pointerTarget.x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    pointerTarget.y = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
  }, { passive: true });

  media.addEventListener("pointerleave", function () {
    pointerTarget.x = 0.5;
    pointerTarget.y = 0.5;
  }, { passive: true });

  window.addEventListener("scroll", function () {
    var nextScrollY = window.scrollY;
    velocityTarget = Math.max(-1, Math.min(1, (nextScrollY - lastScrollY) / 80));
    lastScrollY = nextScrollY;
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

  if (image.complete) prepareTexture();
  else image.addEventListener("load", prepareTexture, { once: true });
})();
