/* IRIS — team page: language, reveal, counters, parallax, tilt, confetti */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  /* ------------------------------------------------------------ header + progress */
  var head = document.getElementById("siteHead");
  var bar = document.getElementById("progressBar");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (head) head.classList.toggle("is-stuck", y > 6);
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

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
          el.style.setProperty("--d", Math.min(i * 90, 360) + "ms");
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ------------------------------------------------------------ counters */
  var counters = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
  function runCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var start = null, dur = 1300;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        runCounter(e.target);
        cio.unobserve(e.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(runCounter);
  }

  /* ------------------------------------------------------------ hero parallax */
  var heroArt = document.getElementById("heroArt");
  var floats = heroArt ? Array.prototype.slice.call(heroArt.querySelectorAll("[data-depth]")) : [];
  if (heroArt && floats.length && !reduce && window.matchMedia("(pointer:fine)").matches) {
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      floats.forEach(function (el) {
        var d = parseFloat(el.getAttribute("data-depth")) || 12;
        el.style.transform = "translate3d(" + (cx * d) + "px," + (cy * d) + "px,0)";
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }

    heroArt.addEventListener("pointermove", function (e) {
      var r = heroArt.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    heroArt.addEventListener("pointerleave", function () {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  }

  /* ------------------------------------------------------------ tilt cards */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      var base = card.style.getPropertyValue("--rot") || "0deg";
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .12s ease-out";
        card.style.transform =
          "perspective(700px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" +
          (px * 7).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "";
        card.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------ magnetic buttons */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        btn.style.transform = "translate(" + (px * 8).toFixed(1) + "px," + (py * 6 - 3).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------ confetti burst */
  var host = document.getElementById("gdgCard");
  var colors = ["#e8322e", "#1d4e9c", "#2e9a5b", "#ffc93c", "#f59b4b", "#ff8fa3"];
  var lastBurst = 0;

  function burst(x, y) {
    if (reduce) return;
    var now = Date.now();
    if (now - lastBurst < 700) return;
    lastBurst = now;

    var rect = host.getBoundingClientRect();
    var px = x === undefined ? rect.width * 0.32 : x - rect.left;
    var py = y === undefined ? rect.height * 0.4 : y - rect.top;

    for (var i = 0; i < 26; i++) {
      var p = document.createElement("i");
      p.className = "confetti-piece";
      p.style.background = colors[i % colors.length];
      p.style.left = px + "px";
      p.style.top = py + "px";
      p.style.borderRadius = i % 3 === 0 ? "50%" : "2px";
      host.appendChild(p);

      var angle = (Math.PI * 2 * i) / 26 + Math.random() * 0.4;
      var dist = 60 + Math.random() * 110;

      p.animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 },
          {
            transform:
              "translate(" + (Math.cos(angle) * dist - 50) + "%," +
              (Math.sin(angle) * dist + 60 - 50) + "%) rotate(" + (Math.random() * 540) + "deg) scale(.4)",
            opacity: 0
          }
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = (function (node) {
        return function () { node.remove(); };
      })(p);
    }
  }

  if (host && !reduce) {
    host.addEventListener("pointerenter", function (e) { burst(e.clientX, e.clientY); });
    host.addEventListener("click", function (e) { burst(e.clientX, e.clientY); });
  }

  /* ------------------------------------------------------------ smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });
})();
