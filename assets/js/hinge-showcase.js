/* =========================================================
   FORS — Concealed Hinge Showcase
   Lightweight scroll-reveal + language toggle
   ========================================================= */

(() => {
  const TITLE_TR = "FORS Gizli Menteşe | İnteraktif Mühendislik Vitrini";
  const TITLE_EN = "FORS Concealed Hinge | Interactive Engineering Showcase";
  const DESC_TR =
    "FORS gizli mobilya menteşesinin parça parça anlatıldığı, kaydırmalı mühendislik vitrini.";
  const DESC_EN =
    "A scroll-driven engineering breakdown of the FORS concealed cabinet hinge, piece by piece.";

  const root = document.documentElement;
  const metaDesc = document.querySelector('meta[name="description"]');
  const langButtons = document.querySelectorAll(".hx-lang button");

  function setLang(lang) {
    const isEn = lang === "en";
    root.classList.toggle("lang-en", isEn);
    langButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.lang === lang));
    document.title = isEn ? TITLE_EN : TITLE_TR;
    if (metaDesc) metaDesc.setAttribute("content", isEn ? DESC_EN : DESC_TR);
    try {
      localStorage.setItem("formtrade-lang", lang);
    } catch (e) {}
  }

  langButtons.forEach((btn) => btn.addEventListener("click", () => setLang(btn.dataset.lang)));

  let initialLang = "tr";
  try {
    const stored = localStorage.getItem("formtrade-lang");
    if (stored === "en" || stored === "tr") initialLang = stored;
  } catch (e) {}
  setLang(initialLang);

  /* ---------- Scroll reveal ---------- */
  const scenes = document.querySelectorAll(".hx-scene");
  const contents = document.querySelectorAll(".hx-scene-content");
  const progressDots = document.querySelectorAll(".hx-progress span");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.25 }
    );
    contents.forEach((el) => revealObserver.observe(el));

    if (progressDots.length) {
      const progressObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const index = Array.from(scenes).indexOf(entry.target);
            progressDots.forEach((dot, i) => dot.classList.toggle("active", i === index));
          });
        },
        { threshold: 0.5 }
      );
      scenes.forEach((el) => progressObserver.observe(el));
    }
  } else {
    contents.forEach((el) => el.classList.add("visible"));
  }
})();
