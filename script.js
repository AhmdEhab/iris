/* IRIS — team page interactions */
(function () {
  "use strict";

  const root = document.documentElement;
  const toggle = document.getElementById("langToggle");
  const STORAGE_KEY = "iris-lang";

  /* ---------------------------------------------------- language */
  function applyLang(lang) {
    const isEn = lang === "en";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    root.setAttribute("dir", isEn ? "ltr" : "rtl");
    if (toggle) {
      toggle.textContent = isEn ? "ع" : "EN";
      toggle.setAttribute("aria-label", isEn ? "التبديل إلى العربية" : "Switch to English");
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  const initial = saved || (navigator.language || "").toLowerCase().startsWith("ar") ? saved || "ar" : "ar";
  applyLang(initial === "en" ? "en" : "ar");

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyLang(root.getAttribute("data-lang") === "en" ? "ar" : "en");
    });
  }

  /* ---------------------------------------------------- sticky header */
  const header = document.getElementById("siteHeader");
  const onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------- reveal on scroll */
  const items = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.prototype.slice.call(
          el.parentElement ? el.parentElement.children : []
        );
        const index = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = Math.min(index * 70, 280) + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------------------------------------------- smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
