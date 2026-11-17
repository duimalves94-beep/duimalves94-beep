var TITLES = {
  zh: "Bhone Myat Zaw · 进出口运营 / 物流协调 / 业务发展",
  en: "Bhone Myat Zaw · Import-Export Operations / Logistics / Business Development",
  fr: "Bhone Myat Zaw · Opérations import-export / coordination logistique / développement commercial"
};

var HTML_LANG = { zh: "zh-CN", en: "en", fr: "fr" };

var NAV_LABEL = { zh: "页面章节", en: "Primary", fr: "Navigation" };

var GROUP_LABEL = { zh: "语言", en: "Language", fr: "Langue" };

function currentLang() {
  var root = document.documentElement;
  if (root.classList.contains("lang-fr")) return "fr";
  if (root.classList.contains("lang-en")) return "en";
  return "zh";
}

function applyLang(lang) {
  if (lang !== "en" && lang !== "fr") lang = "zh";
  var root = document.documentElement;
  root.classList.toggle("lang-zh", lang === "zh");
  root.classList.toggle("lang-en", lang === "en");
  root.classList.toggle("lang-fr", lang === "fr");
  root.lang = HTML_LANG[lang];
  document.title = TITLES[lang];
  var group = document.getElementById("lang-switch");
  if (group) group.setAttribute("aria-label", GROUP_LABEL[lang]);
  document.querySelectorAll("#lang-switch button").forEach(function (btn) {
    var on = btn.getAttribute("data-lang") === lang;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  var nav = document.querySelector(".site-nav");
  if (nav) nav.setAttribute("aria-label", NAV_LABEL[lang]);
  try {
    localStorage.setItem("resume-lang", lang);
  } catch (e) {}
}

function initLang() {
  applyLang(currentLang());
  document.querySelectorAll("#lang-switch button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLang(btn.getAttribute("data-lang"));
    });
  });
}

function initNav() {
  var header = document.querySelector(".site-header");
  var links = Array.from(document.querySelectorAll(".site-nav a"));
  var sections = links
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function updateActive() {
    var line = (header ? header.offsetHeight : 0) + 24;
    var current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    links.forEach(function (a) {
      var on = current && a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  document.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () {
      var id = a.getAttribute("href").slice(1);
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    });
  });
}

initLang();
initNav();
