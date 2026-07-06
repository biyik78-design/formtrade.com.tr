/* =========================================================
   FORM — Sub-page script (hakkimizda, ik, kvkk, ebulten)
   Handles: language toggle, scroll-reveal, year
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Language switch ---------- */
  const langButtons = document.querySelectorAll("[data-lang]");

  const root = document.documentElement;

  const setLang = (lang) => {
    const isEn = lang === "en";
    root.classList.toggle("lang-en", isEn);
    root.lang = lang;
    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    // update <title> and meta description if data attributes are present
    const titleKey = isEn ? "titleEn" : "titleTr";
    const descKey  = isEn ? "descEn"  : "descTr";
    if (root.dataset[titleKey]) document.title = root.dataset[titleKey];
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && root.dataset[descKey]) metaDesc.setAttribute("content", root.dataset[descKey]);

    try { localStorage.setItem("formtrade-lang", lang); } catch (e) {}
  };

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });

  // Restore saved preference, fallback to browser language
  let saved;
  try { saved = localStorage.getItem("formtrade-lang"); } catch (e) {}
  const browser = navigator.language?.toLowerCase().startsWith("en") ? "en" : "tr";
  setLang(saved === "en" || saved === "tr" ? saved : browser);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
