/* IRIS — language, reveal, parallax, magnetic buttons, confetti */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;
  var root = document.documentElement;

  /* ------------------------------------------------------------ language */
  var toggle = document.getElementById("langToggle");
  var KEY = "iris-lang";

  function applyLang(lang) {
    var en = lang === "en";
    root.setAttribute("data-lang", en ? "en" : "ar");
    root.setAttribute("lang", en ? "en" : "ar");
    root.setAttribute("dir", en ? "ltr" : "rtl");
    if (toggle) {
      toggle.textContent = en ? "ع" : "EN";
      toggle.setAttribute("aria-label", en ? "التبديل إلى العربية" : "Switch to English");
    }
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  applyLang(saved === "en" ? "en" : "ar");

  if (toggle) {
    toggle.addEventListener("click", function () {
      applyLang(root.getAttribute("data-lang") === "en" ? "ar" : "en");
    });
  }

  /* ------------------------------------------------------------ reveal */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentElement
          ? Array.prototype.slice.call(el.parentElement.children).filter(function (n) {
              return n.hasAttribute && n.hasAttribute("data-reveal");
            })
          : [];
        var i = siblings.indexOf(el);
        if (!el.style.getPropertyValue("--d") && i > 0) {
          el.style.setProperty("--d", Math.min(i * 110, 330) + "ms");
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ------------------------------------------------------------ parallax doodles */
  var stage = document.getElementById("stage");
  var layers = stage ? Array.prototype.slice.call(stage.querySelectorAll("[data-depth]")) : [];

  if (stage && layers.length && !reduce && fine) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function loop() {
      cx += (tx - cx) * 0.09;
      cy += (ty - cy) * 0.09;
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 12;
        el.style.translate = (cx * d).toFixed(2) + "px " + (cy * d).toFixed(2) + "px";
      });
      if (Math.abs(tx - cx) > 0.002 || Math.abs(ty - cy) > 0.002) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    stage.addEventListener("pointerleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  /* ------------------------------------------------------------ magnetic buttons */
  if (!reduce && fine) {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = "translate(" + (px * 7).toFixed(1) + "px," + (py * 5 - 2).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ------------------------------------------------------------ confetti feedback */
  var colors = ["#e8322e", "#1d4e9c", "#2e9a5b", "#ffc93c", "#f59b4b", "#ff9aae"];

  function burst(x, y) {
    if (reduce) return;
    for (var i = 0; i < 22; i++) {
      var p = document.createElement("i");
      p.className = "confetti-piece";
      p.style.background = colors[i % colors.length];
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.borderRadius = i % 3 === 0 ? "50%" : "2px";
      document.body.appendChild(p);

      var angle = (Math.PI * 2 * i) / 22 + Math.random() * 0.5;
      var dist = 55 + Math.random() * 95;

      p.animate([
        { transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 },
        {
          transform:
            "translate(" + (Math.cos(angle) * dist - 50) + "%," +
            (Math.sin(angle) * dist + 55 - 50) + "%) rotate(" + (Math.random() * 520) + "deg) scale(.35)",
          opacity: 0
        }
      ], { duration: 850 + Math.random() * 450, easing: "cubic-bezier(.2,.7,.3,1)" })
        .onfinish = (function (node) { return function () { node.remove(); }; })(p);
    }
  }

  document.querySelectorAll(".confetti").forEach(function (el) {
    el.addEventListener("click", function (e) { burst(e.clientX, e.clientY); });
  });

  /* ------------------------------------------------------------ smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });
})();
