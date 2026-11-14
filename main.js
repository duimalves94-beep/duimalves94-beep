const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

function isEnglish() {
  return document.documentElement.classList.contains("lang-en");
}

function applyLang(lang) {
  const en = lang === "en";
  const root = document.documentElement;
  root.classList.toggle("lang-en", en);
  root.classList.toggle("lang-zh", !en);
  root.lang = en ? "en" : "zh-CN";
  document.title = en
    ? "Yitian Chen · Creator Content & Overseas Product Ops"
    : "陈怡天 · 达人内容运营 / 海外产品运营";
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", en ? "true" : "false");
    btn.setAttribute("aria-label", en ? "Switch to Chinese" : "切换到英文");
  }
  try {
    localStorage.setItem("resume-lang", en ? "en" : "zh");
  } catch (e) {}
}

function initLang() {
  applyLang(isEnglish() ? "en" : "zh");
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  btn.addEventListener("click", function () {
    applyLang(isEnglish() ? "zh" : "en");
  });
}

function initHeader() {
  const header = document.querySelector(".site-header");
  const sheet = document.querySelector(".sheet");
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function onScroll() {
    if (header && sheet) {
      header.classList.toggle("is-solid", sheet.getBoundingClientRect().top <= header.offsetHeight);
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    document.documentElement.style.setProperty("--scroll", String(p));
  }

  function updateActive() {
    const line = (header ? header.offsetHeight : 0) + 36;
    let current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    links.forEach(function (a) {
      const on = current && a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  const nav = document.querySelector(".site-nav");
  function fitNav() {
    if (!nav) return;
    nav.classList.toggle("can-scroll", nav.scrollWidth > nav.clientWidth + 4);
  }

  document.addEventListener("scroll", function () {
    onScroll();
    updateActive();
  }, { passive: true });
  window.addEventListener("resize", fitNav);
  onScroll();
  updateActive();
  fitNav();

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  });
}

function initReveal() {
  const items = Array.from(document.querySelectorAll(".reveal"));
  if (!items.length) return;
  if (reduceMotion) {
    items.forEach(function (el) {
      el.classList.add("is-in");
    });
    return;
  }
  function revealVisible() {
    const limit = window.innerHeight * 0.92;
    items.forEach(function (el) {
      if (el.classList.contains("is-in")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < limit && rect.bottom > 0) el.classList.add("is-in");
    });
  }
  document.addEventListener("scroll", revealVisible, { passive: true });
  window.addEventListener("resize", revealVisible);
  revealVisible();
}

function isCurrentLangNode(el) {
  const zhWrap = el.closest(".zh");
  const enWrap = el.closest(".en");
  if (zhWrap) return !isEnglish();
  if (enWrap) return isEnglish();
  return true;
}

function playCount(el) {
  const target = Number(el.dataset.to);
  const decimals = Number(el.dataset.decimals || 0);
  if (!Number.isFinite(target)) return;
  const start = performance.now();
  const dur = 1100;
  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals);
  }
  el.textContent = (0).toFixed(decimals);
  requestAnimationFrame(frame);
}

function initStats() {
  const stats = document.querySelector(".stats");
  if (!stats || reduceMotion) return;
  const start = function () {
    stats.querySelectorAll(".num").forEach(function (el) {
      if (!isCurrentLangNode(el) || el.dataset.played === "1") return;
      el.dataset.played = "1";
      playCount(el);
    });
  };
  if (!("IntersectionObserver" in window)) {
    start();
    return;
  }
  const io = new IntersectionObserver(
    function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      io.disconnect();
      start();
    },
    { threshold: 0.35 }
  );
  io.observe(stats);

  document.getElementById("lang-toggle")?.addEventListener("click", function () {
    if (stats.dataset.seen !== "1") return;
    stats.querySelectorAll(".num").forEach(function (el) {
      if (!isCurrentLangNode(el)) return;
      if (el.dataset.played === "1") return;
      el.dataset.played = "1";
      const target = Number(el.dataset.to);
      const decimals = Number(el.dataset.decimals || 0);
      el.textContent = target.toFixed(decimals);
    });
  });

  const mark = new IntersectionObserver(
    function (entries) {
      if (entries.some(function (entry) { return entry.isIntersecting; })) {
        stats.dataset.seen = "1";
        mark.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  mark.observe(stats);
}

function initTilt() {
  if (reduceMotion || !finePointer) return;
  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 7;
      const ry = (x - 0.5) * 9;
      card.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      card.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    });
    card.addEventListener("pointerleave", function () {
      card.style.transform = "";
    });
  });
}

async function init3D() {
  if (reduceMotion) return;
  const canvas = document.getElementById("hero-canvas");
  const hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  const loader = import(THREE_URL);
  const timeout = new Promise(function (_, reject) {
    setTimeout(function () { reject(new Error("timeout")); }, 8000);
  });
  let THREE;
  try {
    THREE = await Promise.race([loader, timeout]);
  } catch (e) {
    loader.catch(function () {});
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: window.innerWidth >= 800,
      powerPreference: "high-performance",
    });
  } catch (e) {
    return;
  }
  if (!renderer.getContext()) {
    renderer.dispose();
    return;
  }

  renderer.setClearColor(0x000000, 0);
  if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0, 0, 6.4);

  const group = new THREE.Group();
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0xfff4e8, 0x1a100e, 1.8));
  const key = new THREE.DirectionalLight(0xfff7ee, 2.6);
  key.position.set(4, 3.2, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0xff6a4a, 36, 14);
  rim.position.set(-3.2, -1.2, 2.4);
  scene.add(rim);
  const fill = new THREE.PointLight(0xf0d2a4, 22, 14);
  fill.position.set(2.4, 1.6, 3);
  scene.add(fill);

  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const tubeSeg = mobile ? 90 : 160;

  function ring(radius, tube, color) {
    return new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, mobile ? 12 : 20, tubeSeg),
      new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.28,
        metalness: 0.85,
        roughness: 0.22,
      })
    );
  }

  const ringA = ring(1.95, 0.03, 0xf3d7b0);
  ringA.rotation.x = Math.PI / 2.15;
  const ringB = ring(2.22, 0.016, 0xff9b86);
  ringB.rotation.x = Math.PI / 2.65;
  ringB.rotation.y = 0.55;
  const ringC = ring(1.62, 0.012, 0xfff6ea);
  ringC.rotation.x = Math.PI / 3.1;
  ringC.rotation.z = 0.4;
  group.add(ringA, ringB, ringC);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, mobile ? 32 : 48, mobile ? 24 : 36),
    new THREE.MeshStandardMaterial({
      color: 0x8a3a2c,
      emissive: 0xe36a4f,
      emissiveIntensity: 0.42,
      metalness: 0.32,
      roughness: 0.45,
    })
  );
  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.08, 1),
    new THREE.MeshBasicMaterial({
      color: 0xffd8c8,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    })
  );
  group.add(core, wire);

  const gemCount = mobile ? 10 : 16;
  const gems = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.05, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff6ee }),
    gemCount
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < gemCount; i++) {
    const a = (i / gemCount) * Math.PI * 2;
    dummy.position.set(Math.cos(a) * 2.22, 0, Math.sin(a) * 2.22);
    dummy.updateMatrix();
    gems.setMatrixAt(i, dummy.matrix);
  }
  gems.instanceMatrix.needsUpdate = true;
  const orbit = new THREE.Group();
  orbit.rotation.x = 1.05;
  orbit.add(gems);
  group.add(orbit);

  const count = mobile ? 420 : 980;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const palette = [new THREE.Color("#f3d7b0"), new THREE.Color("#ff8f78"), new THREE.Color("#fff6ee")];
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    if (i % 3 === 0) {
      const u = Math.random();
      const v = Math.random();
      const theta = Math.PI * 2 * u;
      const phi = Math.acos(2 * v - 1);
      const rad = 1.15 + Math.random() * 1.55;
      positions[i3] = rad * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = rad * Math.cos(phi) * 0.82;
      positions[i3 + 2] = rad * Math.sin(phi) * Math.sin(theta);
    } else {
      const t = i / count;
      const a = t * Math.PI * 2 * (i % 2 === 0 ? 5 : 7);
      const r = 1.55 + (i % 6) * 0.14;
      const y = Math.sin(t * Math.PI * 6) * 1.35;
      positions[i3] = Math.cos(a) * r;
      positions[i3 + 1] = y * 0.55;
      positions[i3 + 2] = Math.sin(a) * r * 0.78;
    }
    const color = palette[i % palette.length];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    scales[i] = i % 5 === 0 ? 1.55 : 0.75 + (i % 7) * 0.08;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2() },
    uScroll: { value: 0 },
    uPixelRatio: { value: 1 },
  };
  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      vertexShader: [
        "attribute float aScale;",
        "attribute vec3 aColor;",
        "uniform float uTime;",
        "uniform vec2 uMouse;",
        "uniform float uScroll;",
        "uniform float uPixelRatio;",
        "varying vec3 vColor;",
        "void main() {",
        "  vColor = aColor;",
        "  vec3 p = position * (1.0 + uScroll * 0.5);",
        "  p.x += sin(uTime * 0.7 + position.y * 3.0) * 0.05;",
        "  p.y += cos(uTime * 0.5 + position.x * 2.0) * 0.04;",
        "  vec2 target = uMouse * vec2(2.2, 1.5);",
        "  vec2 delta = target - p.xy;",
        "  float dist = length(delta);",
        "  p.xy += delta * smoothstep(3.2, 0.15, dist) * 0.32;",
        "  vec4 mv = modelViewMatrix * vec4(p, 1.0);",
        "  gl_PointSize = aScale * uPixelRatio * (150.0 / max(0.1, -mv.z));",
        "  gl_Position = projectionMatrix * mv;",
        "}",
      ].join("\n"),
      fragmentShader: [
        "varying vec3 vColor;",
        "void main() {",
        "  float d = length(gl_PointCoord - vec2(0.5));",
        "  float alpha = smoothstep(0.5, 0.12, d);",
        "  if (alpha < 0.02) discard;",
        "  gl_FragColor = vec4(vColor, alpha);",
        "  #include <colorspace_fragment>",
        "}",
      ].join("\n"),
    })
  );
  group.add(points);

  const mouse = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  window.addEventListener(
    "pointermove",
    function (e) {
      if (e.pointerType === "touch") return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    },
    { passive: true }
  );

  let wide = window.innerWidth >= 860;
  let baseY = 0;

  function resize() {
    const w = hero.clientWidth || window.innerWidth;
    const h = hero.clientHeight || window.innerHeight;
    const pr = Math.min(window.devicePixelRatio || 1, w < 760 ? 1.35 : 1.6);
    renderer.setPixelRatio(pr);
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();
    uniforms.uPixelRatio.value = pr;
    wide = w >= 860;
    baseY = wide ? 0.05 : 0.85;
    camera.position.z = wide ? 6.35 : 7.35;
    group.position.x = wide ? 1.28 : 0;
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  let spin = 0;
  let raf = 0;
  let looping = false;
  let heroOn = true;

  function heroProgress() {
    const rect = hero.getBoundingClientRect();
    const h = rect.height || 1;
    return Math.min(1, Math.max(0, -rect.top / h));
  }

  function frame(now) {
    if (!looping) return;
    const time = now * 0.001;
    const scroll = heroProgress();
    smooth.x += (mouse.x - smooth.x) * 0.06;
    smooth.y += (mouse.y - smooth.y) * 0.06;
    spin += 0.0018;
    group.rotation.y = spin + smooth.x * 0.45 + scroll * 0.85;
    group.rotation.x = -smooth.y * 0.28 + scroll * 0.32;
    group.position.y = baseY + Math.sin(time * 0.6) * 0.08 - scroll * 0.35;
    ringA.rotation.z = time * 0.22;
    ringB.rotation.z = -time * 0.17;
    ringC.rotation.z = time * 0.12;
    core.rotation.y = time * 0.18;
    core.rotation.x = time * 0.07;
    wire.rotation.y = -time * 0.12;
    orbit.rotation.y = time * 0.28;
    uniforms.uTime.value = time;
    uniforms.uMouse.value.set(smooth.x, -smooth.y);
    uniforms.uScroll.value = scroll;
    if (finePointer) {
      hero.style.setProperty("--px", smooth.x.toFixed(4));
      hero.style.setProperty("--py", smooth.y.toFixed(4));
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (looping) return;
    looping = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    looping = false;
    cancelAnimationFrame(raf);
  }

  canvas.addEventListener(
    "webglcontextlost",
    function (event) {
      event.preventDefault();
      stop();
      document.documentElement.classList.remove("webgl-ready");
    },
    { once: true }
  );

  try {
    renderer.render(scene, camera);
  } catch (e) {
    renderer.dispose();
    return;
  }

  document.documentElement.classList.add("webgl-ready");
  start();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      heroOn = entries[0].isIntersecting;
      if (heroOn && !document.hidden) start();
      else stop();
    });
    io.observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else if (heroOn) start();
  });
}

initLang();
initHeader();
initReveal();
initStats();
initTilt();
init3D();
