const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

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

/* ---------- hand-drawn forest: soft parallax ---------- */
function initForest() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const layers = Array.from(hero.querySelectorAll("[data-depth]")).map(function (el) {
    return { el: el, depth: Number(el.dataset.depth) || 0 };
  });
  if (reduceMotion || !layers.length) return;
  document.documentElement.classList.add("forest-live");

  const target = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let scrollY = window.scrollY;
  let visible = true;
  let raf = 0;

  if (finePointer) {
    hero.addEventListener("pointermove", function (e) {
      const r = hero.getBoundingClientRect();
      target.x = (e.clientX - r.left) / r.width - 0.5;
      target.y = (e.clientY - r.top) / r.height - 0.5;
      kick();
    });
    hero.addEventListener("pointerleave", function () {
      target.x = 0;
      target.y = 0;
      kick();
    });
  }
  document.addEventListener("scroll", function () {
    scrollY = window.scrollY;
    kick();
  }, { passive: true });

  function frame() {
    raf = 0;
    smooth.x += (target.x - smooth.x) * 0.08;
    smooth.y += (target.y - smooth.y) * 0.08;
    const sy = Math.min(scrollY, window.innerHeight);
    layers.forEach(function (l) {
      const tx = -smooth.x * 34 * l.depth;
      const ty = -smooth.y * 16 * l.depth + sy * (0.45 - l.depth * 0.45);
      l.el.style.transform = "translate3d(" + tx.toFixed(2) + "px," + ty.toFixed(2) + "px,0)";
    });
    hero.style.setProperty("--px", smooth.x.toFixed(4));
    hero.style.setProperty("--py", smooth.y.toFixed(4));
    if (Math.abs(target.x - smooth.x) > 0.001 || Math.abs(target.y - smooth.y) > 0.001) kick();
  }

  function kick() {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) kick();
    }).observe(hero);
  }
  kick();
}

/* ---------- forest friends: hover, tap, speech bubbles ---------- */
const CRITTER_LINES = {
  zh: [
    "你好，我叫陈怡天",
    "往下滑，看看我的实习经历吧～",
    "我的抖音视频单条 500 万+ 播放哦！",
    "「创作」里有两个我做的互动网页～",
    "想聊聊？邮箱就在页面最下面！"
  ],
  en: [
    "Hi, I'm Chen Yitian",
    "Scroll down to see my internships~",
    "One of my Douyin videos hit 5M+ views!",
    "Two live web projects wait in “Work”~",
    "Want to chat? My email is at the bottom!"
  ]
};
const PEEK_LINES = {
  zh: ["你好，我叫陈怡天", "发邮件给我吧，我会认真回复～", "谢谢你看完我的简历！"],
  en: ["Hi, I'm Chen Yitian", "Drop me an email — I'll reply soon~", "Thanks for reading my resume!"]
};

function initCritters() {
  const buttons = Array.from(document.querySelectorAll(".critter"));
  if (!buttons.length) return;
  const live = document.getElementById("critter-live");
  const state = new Map();

  function linesFor(btn) {
    const set = btn.dataset.critter === "peek" ? PEEK_LINES : CRITTER_LINES;
    return isEnglish() ? set.en : set.zh;
  }

  function fit(bubble) {
    bubble.style.setProperty("--shift", "0px");
    const r = bubble.getBoundingClientRect();
    const over = r.right - (document.documentElement.clientWidth - 8);
    if (over > 0) bubble.style.setProperty("--shift", -Math.ceil(over) + "px");
  }

  function say(btn, index, announce) {
    const wrap = btn.closest(".critter-wrap");
    const bubble = wrap && wrap.querySelector(".bubble");
    if (!bubble) return;
    const s = state.get(btn);
    const lines = linesFor(btn);
    // one voice at a time
    document.querySelectorAll(".bubble.is-on").forEach(function (other) {
      if (other !== bubble) other.classList.remove("is-on");
    });
    s.index = index % lines.length;
    bubble.querySelector(".bubble-text").textContent = lines[s.index];
    bubble.classList.add("is-on");
    fit(bubble);
    if (announce && live) live.textContent = lines[s.index];
    clearTimeout(s.timer);
    s.timer = setTimeout(function () {
      bubble.classList.remove("is-on");
    }, 4200);
  }

  function hop(btn) {
    btn.classList.remove("is-jump");
    void btn.offsetWidth;
    btn.classList.add("is-jump");
    clearTimeout(state.get(btn).hopTimer);
    state.get(btn).hopTimer = setTimeout(function () {
      btn.classList.remove("is-jump");
    }, reduceMotion ? 400 : 1300);
  }

  buttons.forEach(function (btn) {
    state.set(btn, { index: -1, timer: 0, hopTimer: 0 });
    btn.addEventListener("click", function () {
      const s = state.get(btn);
      const bubble = btn.closest(".critter-wrap").querySelector(".bubble");
      // a fresh tap always opens with the greeting; quick repeat taps cycle the other lines
      const next = bubble.classList.contains("is-on") ? s.index + 1 : 0;
      hop(btn);
      say(btn, next, true);
    });
  });

  function relabel() {
    const en = isEnglish();
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-label", en ? btn.dataset.labelEn : btn.dataset.labelZh);
      const s = state.get(btn);
      const bubble = btn.closest(".critter-wrap").querySelector(".bubble");
      if (bubble.classList.contains("is-on")) {
        bubble.querySelector(".bubble-text").textContent = linesFor(btn)[s.index];
        fit(bubble);
      }
    });
  }
  document.getElementById("lang-toggle")?.addEventListener("click", relabel);
  relabel();

  window.addEventListener("resize", function () {
    document.querySelectorAll(".bubble.is-on").forEach(fit);
  });

  // greet once on load
  const cat = document.querySelector(".critter-cat");
  if (cat) {
    setTimeout(function () {
      if (!reduceMotion) hop(cat);
      say(cat, 0, false);
    }, 900);
  }
}

initLang();
initHeader();
initReveal();
initStats();
initTilt();
initForest();
initCritters();
