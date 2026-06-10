/* =========================================================
   FORM TRADE / FORS — main.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Back to top ---------- */
  const backToTop = document.querySelector(".back-to-top");
  function toggleBackToTop() {
    backToTop.classList.toggle("show", window.scrollY > 600);
  }
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Header scroll state ---------- */
  const header = document.querySelector(".header");
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    toggleBackToTop();
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open") ? "hidden" : "";
  });
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      toggle.classList.remove("open");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((sec) => navObserver.observe(sec));

  /* ---------- Language switch (TR / EN) ---------- */
  const langButtons = document.querySelectorAll("[data-lang]");
  const setLang = (lang) => {
    document.documentElement.classList.toggle("lang-en", lang === "en");
    document.documentElement.lang = lang;
    document.title = lang === "en" ? document.title.replace(/.*\| /, "") || document.title : document.title;
    langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
    localStorage.setItem("formtrade-lang", lang);

    // swap input placeholders / titles
    document.querySelectorAll("[data-ph-tr]").forEach((el) => {
      el.setAttribute("placeholder", lang === "en" ? el.dataset.phEn : el.dataset.phTr);
    });

    // swap <select> option labels
    document.querySelectorAll("option[data-tr]").forEach((opt) => {
      opt.textContent = lang === "en" ? opt.dataset.en : opt.dataset.tr;
    });
    document.title = lang === "en" ? TITLE_EN : TITLE_TR;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", lang === "en" ? DESC_EN : DESC_TR);
  };

  const TITLE_TR = "FORM | FORS Mobilya Aksesuarları — Menteşe, Çekmece ve Ray Sistemleri";
  const TITLE_EN = "FORM | FORS Furniture Fittings — Hinges, Drawer & Slide Systems";
  const DESC_TR =
    "FORM Ticari ve Sınai Ürünler — 1977'den bu yana FORS markasıyla menteşe, çekmece sistemleri, ray ve mobilya aksesuarları üretip 50'den fazla ülkeye ihraç ediyoruz.";
  const DESC_EN =
    "FORM Ticari ve Sınai Ürünler — Manufacturing hinges, drawer systems, slide rails and furniture fittings under the FORS brand since 1977, exporting to 50+ countries.";

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  const savedLang = localStorage.getItem("formtrade-lang");
  const browserLang = navigator.language?.toLowerCase().startsWith("en") ? "en" : "tr";
  setLang(savedLang || browserLang);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const start = performance.now();
    const isInt = Number.isInteger(target);

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isInt ? Math.floor(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (isInt ? target : target.toFixed(1)) + suffix;
    };
    requestAnimationFrame(tick);
  };
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  /* ---------- Cursor glow (desktop only) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);
    let gx = window.innerWidth / 2,
      gy = window.innerHeight / 2,
      tx = gx,
      ty = gy;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    const loop = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });

    /* ---------- Tilt cards ---------- */
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Scroll-driven 3D showcase card ---------- */
  const scrollCard = document.getElementById("scrollCard");
  if (scrollCard) {
    let ticking = false;
    const updateTilt = () => {
      const rect = scrollCard.getBoundingClientRect();
      const vh = window.innerHeight;
      let progress = (vh - rect.top) / (vh * 0.85);
      progress = Math.min(Math.max(progress, 0), 1);
      const rotate = 26 * (1 - progress);
      const scale = 0.94 + 0.06 * progress;
      scrollCard.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateTilt);
          ticking = true;
        }
      },
      { passive: true }
    );
    updateTilt();
  }

  /* ---------- Dashboard progress bars ---------- */
  const dashLines = document.querySelectorAll(".dash-line .fill");
  const dashObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          fill.style.width = fill.dataset.percent + "%";
          obs.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 }
  );
  dashLines.forEach((el) => dashObserver.observe(el));

  /* ---------- Contact form ---------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const formHead = form.parentElement.querySelector(".form-head");
      const success = form.parentElement.querySelector(".form-success");
      form.classList.add("hide");
      if (formHead) formHead.classList.add("hide");
      success.classList.add("show");
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
