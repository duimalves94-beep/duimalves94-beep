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
    ? "Bhone Myat Zaw · Import-Export Operations / Logistics / Business Development"
    : "Bhone Myat Zaw · 进出口运营 / 物流协调 / 业务发展";
  const btn = document.getElementById("lang-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", en ? "true" : "false");
    btn.setAttribute("aria-label", en ? "Switch to Chinese" : "切换到英文");
  }
  const nav = document.querySelector(".site-nav");
  if (nav) nav.setAttribute("aria-label", en ? "Primary" : "页面章节");
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

function initNav() {
  const header = document.querySelector(".site-header");
  const links = Array.from(document.querySelectorAll(".site-nav a"));
  const sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActive() {
    const line = (header ? header.offsetHeight : 0) + 24;
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

  document.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

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

initLang();
initNav();
