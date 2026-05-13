(function () {
  var STORAGE_KEY = "resume-lang";
  var body = document.body;

  function applyLang(lang) {
    var isEn = lang === "en";
    body.classList.toggle("lang-en", isEn);
    body.classList.toggle("lang-zh", !isEn);
    document.documentElement.lang = isEn ? "en" : "zh-CN";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", isEn ? "true" : "false");
      var zh = btn.querySelector(".btn-zh");
      var en = btn.querySelector(".btn-en");
      if (zh && en) {
        zh.hidden = !isEn;
        en.hidden = isEn;
      }
    }
  }

  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    var preferEn = saved === "en";
    applyLang(preferEn ? "en" : "zh");

    var btn = document.getElementById("lang-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        applyLang(body.classList.contains("lang-en") ? "zh" : "en");
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("href").slice(1);
        var el = document.getElementById(id);
        if (el) {
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
