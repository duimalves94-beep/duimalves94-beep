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

/* ---------- forest friends: auto chatter, joy on tap, heart bubbles ---------- */
const AUTO_LINES = {
  zh: [
    "你好，我叫陈怡天",
    "HR 捞捞我吧～",
    "HR，我会认真努力工作，请给我一次面试机会吧，谢谢！",
    "我学东西超快的！",
    "内容运营、AIGC，我都可以！",
    "简历往下滑还有更多哦～",
    "看到这里了，要不要约个面试？",
    "点点我们，有惊喜哦～"
  ],
  en: [
    "Hi, I'm Chen Yitian",
    "HR, scoop me up~",
    "HR, I'll work hard and give it my all. Please give me an interview — thank you!",
    "I learn super fast!",
    "Content ops, AIGC — I can do both!",
    "Scroll down, there's more in my resume~",
    "Made it this far? How about an interview?",
    "Tap us for a surprise~"
  ]
};
const THANK_LINES = {
  zh: ["谢谢 HR！❤", "被捞到啦！好开心～", "我会好好表现的！", "耶！今天也元气满满！", "期待和你见面哦～"],
  en: ["Thank you, HR! ❤", "Yay, I got scooped up!", "I'll do my very best!", "Yay! Full of energy today!", "Can't wait to meet you~"]
};
const HEART_COLORS = ["#e8546b", "#f27a8f", "#ff9eb0", "#d93b55", "#ffb7c5", "#f05d7a"];
const AUTO_EVERY = 3800;
const AUTO_SHOW = 3300;
const CLICK_HOLD = 4200;

function initCritters() {
  const buttons = Array.from(document.querySelectorAll(".critter"));
  if (!buttons.length) return;
  const live = document.getElementById("critter-live");
  const state = new Map();
  const visible = new Set();
  let lineIndex = -1;
  let lastSpeaker = -1;
  let loopTimer = 0;
  let thankIndex = -1;

  function lang() { return isEnglish() ? "en" : "zh"; }
  function bubbleOf(btn) { return btn.closest(".critter-wrap").querySelector(".bubble"); }

  // keep the bubble on screen; measured from layout
  // (not getBoundingClientRect) so the pop-in scale doesn't skew it
  function fit(bubble) {
    bubble.style.setProperty("--shift", "0px");
    bubble.style.setProperty("--lift", "0px");
    const wrapRect = bubble.parentElement.getBoundingClientRect();
    const left = wrapRect.left + bubble.offsetLeft;
    const limit = document.documentElement.clientWidth - 8;
    const over = left + bubble.offsetWidth - limit;
    if (over > 0) bubble.style.setProperty("--shift", -Math.ceil(over) + "px");
    // pushed far left = it would sit on a neighbour's head, so float it higher on a longer tail
    if (over > 60) bubble.style.setProperty("--lift", Math.round(Math.min(64, over * 0.34)) + "px");
  }

  function hideAll(except) {
    document.querySelectorAll(".bubble.is-on").forEach(function (b) {
      if (b !== except) b.classList.remove("is-on");
    });
  }

  // show one line; `ref` = { set, index } so it can be re-rendered on language switch
  function say(btn, set, index, ms, announce) {
    const bubble = bubbleOf(btn);
    const s = state.get(btn);
    hideAll(bubble);
    s.ref = { set: set, index: index };
    const text = set[lang()][index];
    bubble.querySelector(".bubble-text").textContent = text;
    bubble.classList.remove("is-on");
    void bubble.offsetWidth; // replay the pop-in
    bubble.classList.add("is-on");
    fit(bubble);
    if (announce && live) live.textContent = text;
    clearTimeout(s.timer);
    s.timer = setTimeout(function () { bubble.classList.remove("is-on"); }, ms);
  }

  /* --- the endless, one-at-a-time chatter loop --- */
  function canRun() { return !document.hidden && visible.size > 0; }

  function tick() {
    loopTimer = 0;
    if (!canRun()) { hideAll(null); return; }
    let next = -1;
    for (let k = 1; k <= buttons.length; k++) {
      const idx = (lastSpeaker + k) % buttons.length;
      if (visible.has(buttons[idx])) { next = idx; break; }
    }
    if (next < 0) return;
    lastSpeaker = next;
    lineIndex = (lineIndex + 1) % AUTO_LINES.zh.length;
    say(buttons[next], AUTO_LINES, lineIndex, AUTO_SHOW, false);
    schedule(AUTO_EVERY);
  }

  function schedule(ms) {
    clearTimeout(loopTimer);
    loopTimer = 0;
    if (canRun()) loopTimer = setTimeout(tick, ms);
  }

  /* --- joy: happy eyes, blush, a character-specific hop, and hearts --- */
  function hearts(btn) {
    const wrap = btn.closest(".critter-wrap");
    const count = reduceMotion ? 4 : 9;
    for (let n = 0; n < count; n++) {
      const h = document.createElement("span");
      h.className = "heart";
      h.setAttribute("aria-hidden", "true");
      const size = 13 + Math.round(Math.random() * 17);
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      h.style.setProperty("--s", size + "px");
      h.style.setProperty("--x", (22 + Math.random() * 56).toFixed(1) + "%");
      h.style.setProperty("--dx", Math.round((Math.random() - 0.5) * 110) + "px");
      h.style.setProperty("--rise", -(110 + Math.round(Math.random() * 90)) + "px");
      h.style.setProperty("--r", Math.round((Math.random() - 0.5) * 40) + "deg");
      h.style.setProperty("--dur", (1.5 + Math.random() * 0.9).toFixed(2) + "s");
      h.style.setProperty("--delay", (n * 0.07).toFixed(2) + "s");
      h.style.setProperty("--still", -(10 + Math.round(Math.random() * 60)) + "px");
      h.innerHTML = '<svg viewBox="0 0 24 22"><path d="M12 20.5C5 15.6 1.5 12 1.5 7.4 1.5 4.2 4 1.8 7 1.8c2.1 0 3.8 1.1 5 2.9 1.2-1.8 2.9-2.9 5-2.9 3 0 5.5 2.4 5.5 5.6 0 4.6-3.5 8.2-10.5 13.1Z" fill="' + color + '" stroke="#5a2430" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="7.2" cy="6.6" rx="2" ry="1.3" fill="#fff" opacity=".75" transform="rotate(-30 7.2 6.6)"/></svg>';
      h.addEventListener("animationend", function () { h.remove(); });
      wrap.appendChild(h);
    }
  }

  function joy(btn) {
    const s = state.get(btn);
    btn.classList.remove("is-joy");
    void btn.offsetWidth;
    btn.classList.add("is-joy");
    clearTimeout(s.joyTimer);
    s.joyTimer = setTimeout(function () { btn.classList.remove("is-joy"); }, 1600);
    hearts(btn);
  }

  buttons.forEach(function (btn, i) {
    state.set(btn, { timer: 0, joyTimer: 0, ref: null });
    btn.addEventListener("click", function () {
      joy(btn);
      thankIndex = (thankIndex + 1) % THANK_LINES.zh.length;
      say(btn, THANK_LINES, thankIndex, CLICK_HOLD - 400, true);
      lastSpeaker = i;
      schedule(CLICK_HOLD); // resume the chatter afterwards
    });
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      const wasIdle = !canRun();
      entries.forEach(function (e) {
        const btn = e.target.querySelector(".critter");
        if (e.isIntersecting) visible.add(btn);
        else {
          visible.delete(btn);
          bubbleOf(btn).classList.remove("is-on");
        }
      });
      if (wasIdle && canRun() && !loopTimer) schedule(lineIndex < 0 ? 900 : 600);
      if (!canRun()) { clearTimeout(loopTimer); loopTimer = 0; }
    }, { threshold: 0.6 });
    buttons.forEach(function (btn) { io.observe(btn.closest(".critter-wrap")); });
  } else {
    buttons.forEach(function (btn) { visible.add(btn); });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { clearTimeout(loopTimer); loopTimer = 0; hideAll(null); }
    else schedule(600);
  });

  function relabel() {
    const en = isEnglish();
    buttons.forEach(function (btn) {
      btn.setAttribute("aria-label", en ? btn.dataset.labelEn : btn.dataset.labelZh);
      const s = state.get(btn);
      const bubble = bubbleOf(btn);
      if (s.ref && bubble.classList.contains("is-on")) {
        bubble.querySelector(".bubble-text").textContent = s.ref.set[lang()][s.ref.index];
        fit(bubble);
      }
    });
  }
  document.getElementById("lang-toggle")?.addEventListener("click", relabel);
  relabel();

  window.addEventListener("resize", function () {
    document.querySelectorAll(".bubble.is-on").forEach(fit);
  });

  // the loop starts once a character is on screen: first line is "你好，我叫陈怡天"
}

initLang();
initHeader();
initReveal();
initStats();
initTilt();
initForest();
initCritters();
