(() => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const article = document.querySelector(".post, .case-study");
  const progress = document.querySelector(".reading-progress");
  const themeButton = document.getElementById("themeToggle");
  const revealTargets = [
    ".section-heading", ".work-card", ".writing-row", ".year-label",
    ".profile-section", ".fact-strip", ".case-body > section",
    ".post-body > section", ".post-body > h2", ".post-body > figure", ".footer-inner"
  ].join(", ");
  const active = new Map();
  let observer;
  let frame = 0;

  function updateProgress() {
    frame = 0;
    const bounds = article.getBoundingClientRect();
    const start = bounds.top + window.scrollY;
    const distance = bounds.height - window.innerHeight;
    progress.hidden = preference.matches || distance <= 0;
    if (progress.hidden) return;

    const ratio = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    progress.firstElementChild.style.transform = `scaleX(${ratio})`;
  }

  function queueProgress() {
    if (article && !frame) frame = requestAnimationFrame(updateProgress);
  }

  function observeReveals() {
    if (preference.matches || !("IntersectionObserver" in window) || !Element.prototype.animate) return;

    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || preference.matches) continue;
        const target = entry.target;
        observer.unobserve(target);
        if (target.matches(":focus-within, :target") || target.querySelector(":target")) continue;

        const animation = target.animate(
          [{ opacity: .2, translate: "0 17px" }, { opacity: 1, translate: "0 0" }],
          { duration: 540, easing: "cubic-bezier(.2,.75,.25,1)" }
        );
        active.set(target, animation);
        animation.finished.then(
          () => active.delete(target),
          () => active.delete(target)
        );
      }
    });

    for (const target of document.querySelectorAll(revealTargets)) {
      if (target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
    }
  }

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(revealTargets);
    active.get(target)?.cancel();
  });

  if (article) {
    window.addEventListener("scroll", queueProgress, { passive: true });
    window.addEventListener("resize", queueProgress);
    if ("ResizeObserver" in window) new ResizeObserver(queueProgress).observe(article);
    queueProgress();
  }

  themeButton.addEventListener("click", () => {
    if (!preference.matches) themeButton.classList.add("is-switching");
  });
  themeButton.addEventListener("animationend", () => themeButton.classList.remove("is-switching"));

  preference.addEventListener("change", () => {
    observer?.disconnect();
    for (const animation of active.values()) animation.cancel();
    themeButton.classList.remove("is-switching");
    observeReveals();
    queueProgress();
  });

  observeReveals();
})();
