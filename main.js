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

  scene.add(new THREE.HemisphereLight(0xe7f3d4, 0x1a3324, 1.7));
  const key = new THREE.DirectionalLight(0xfff8e8, 2.4);
  key.position.set(3.2, 5.4, 4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9dcc78, 1.1);
  fill.position.set(-4, 2, -2);
  scene.add(fill);

  const mobile = window.matchMedia("(max-width: 760px)").matches;
  const bark = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.92, flatShading: true });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.38, 0.95, 7), bark);
  trunk.position.y = -1.15;
  const root = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), bark);
  root.position.y = -1.58;
  root.scale.set(1.5, 0.45, 1.5);
  group.add(trunk, root);

  const foliageColors = [
    new THREE.MeshStandardMaterial({ color: 0x3d8f4c, emissive: 0x14321c, emissiveIntensity: 0.35, roughness: 0.78, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x5aaa5c, emissive: 0x1a4024, emissiveIntensity: 0.3, roughness: 0.74, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0x8fce78, emissive: 0x245c30, emissiveIntensity: 0.22, roughness: 0.7, flatShading: true }),
    new THREE.MeshStandardMaterial({ color: 0xc6e89a, emissive: 0x2f6a38, emissiveIntensity: 0.15, roughness: 0.66, flatShading: true }),
  ];
  const blobs = [
    [1.05, 0, 0.28, 0, 0],
    [0.78, 0.62, 0.12, 0.18, 1],
    [0.74, -0.58, 0.18, -0.12, 1],
    [0.62, 0.12, 0.78, 0.08, 2],
    [0.58, -0.18, -0.08, 0.48, 2],
    [0.52, 0.28, 0.42, -0.5, 3],
    [0.46, -0.42, 0.55, 0.28, 3],
    [0.4, 0.48, -0.02, -0.22, 0],
  ];
  blobs.forEach(function (b) {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(b[0], 1), foliageColors[b[4]]);
    mesh.position.set(b[1], b[2], b[3]);
    group.add(mesh);
  });

  const leafCount = mobile ? 120 : 240;
  const leafGeo = new THREE.IcosahedronGeometry(1, 0);
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x2a6a3c,
    emissiveIntensity: 0.4,
    roughness: 0.62,
    flatShading: true,
    vertexColors: true,
  });
  const leaves = new THREE.InstancedMesh(leafGeo, leafMat, leafCount);
  const leafColors = new Float32Array(leafCount * 3);
  const leafPalette = [
    new THREE.Color("#4e9a55"),
    new THREE.Color("#6fbf63"),
    new THREE.Color("#8fd56e"),
    new THREE.Color("#b6e48a"),
    new THREE.Color("#dff5c4"),
  ];
  const leafDummy = new THREE.Object3D();
  for (let i = 0; i < leafCount; i++) {
    const t = (i + 0.5) / leafCount;
    const y = 1 - t * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 0.92 + (i % 6) * 0.055;
    const size = 0.085 + (i % 5) * 0.02;
    leafDummy.position.set(
      Math.cos(theta) * ring * radius,
      y * radius * 0.78 + 0.32,
      Math.sin(theta) * ring * radius
    );
    leafDummy.scale.setScalar(size);
    leafDummy.rotation.set(i * 0.4, i * 0.7, i * 0.2);
    leafDummy.updateMatrix();
    leaves.setMatrixAt(i, leafDummy.matrix);
    const tint = leafPalette[i % leafPalette.length];
    leafColors[i * 3] = tint.r;
    leafColors[i * 3 + 1] = tint.g;
    leafColors[i * 3 + 2] = tint.b;
  }
  leaves.instanceMatrix.needsUpdate = true;
  leaves.instanceColor = new THREE.InstancedBufferAttribute(leafColors, 3);
  group.add(leaves);

  const count = mobile ? 48 : 90;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);
  const palette = [new THREE.Color("#c5e08a"), new THREE.Color("#7dba62"), new THREE.Color("#e7f3cf")];
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const theta = Math.random() * Math.PI * 2;
    const rad = 1.15 + Math.random() * 0.85;
    positions[i3] = Math.cos(theta) * rad;
    positions[i3 + 1] = -0.2 + Math.random() * 1.8;
    positions[i3 + 2] = Math.sin(theta) * rad * 0.75;
    const color = palette[i % palette.length];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
    scales[i] = 0.7 + (i % 4) * 0.18;
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
        "  vec3 p = position;",
        "  p.y += sin(uTime * 0.6 + position.x * 2.0) * 0.12 + uScroll * 0.25;",
        "  p.x += sin(uTime * 0.4 + position.y) * 0.06 + uMouse.x * 0.18;",
        "  p.z += cos(uTime * 0.35 + position.y) * 0.05;",
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
    spin += 0.0022;
    group.rotation.y = spin + smooth.x * 0.28;
    group.rotation.z = Math.sin(time * 0.7) * 0.035 + smooth.x * 0.03;
    group.rotation.x = Math.sin(time * 0.45) * 0.025 - smooth.y * 0.12;
    group.position.y = baseY + Math.sin(time * 0.6) * 0.05 - scroll * 0.2;
    leaves.rotation.y = Math.sin(time * 0.35) * 0.04;
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
