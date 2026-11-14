(() => {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const article = document.querySelector(".post, .case-study");
  const progress = document.querySelector(".reading-progress");
  const themeButton = document.getElementById("themeToggle");
  const downloadLink = article?.querySelector(".quickDownload__link");
  const revealTargets = [
    ".section-heading", ".work-card", ".writing-row", ".year-label",
    ".profile-section", ".fact-strip", ".case-body > section",
    ".post-body > section", ".post-body > h2", ".post-body > figure",
    ".report-nav", ".chinatown-visuals > figure", ".footer-inner"
  ].join(", ");
  const active = new Map();
  let observer;
  let frame = 0;
  let reflection;
  let reflectingImage;
  let reflectionFrame = 0;

  function stopReflection() {
    cancelAnimationFrame(reflectionFrame);
    reflection?.remove();
    reflection = null;
    reflectingImage = null;
  }

  function positionReflection() {
    const bounds = reflectingImage.getBoundingClientRect();
    // Cover only the visible portion of a cropped image, such as a project card.
    const clip = reflectingImage.closest(".work-media, .hero-figure, .chinatown-visuals > figure");
    const crop = clip?.getBoundingClientRect() ?? bounds;
    const left = Math.max(bounds.left, crop.left);
    const top = Math.max(bounds.top, crop.top);
    reflection.style.left = left + "px";
    reflection.style.top = top + "px";
    reflection.style.width = Math.max(0, Math.min(bounds.right, crop.right) - left) + "px";
    reflection.style.height = Math.max(0, Math.min(bounds.bottom, crop.bottom) - top) + "px";
    reflection.style.borderRadius = getComputedStyle(clip ?? reflectingImage).borderRadius;
    reflectionFrame = requestAnimationFrame(positionReflection);
  }

  function reflect(image) {
    if (preference.matches || !image?.naturalWidth || !image.getBoundingClientRect().width) return;
    stopReflection();
    reflectingImage = image;
    reflection = document.createElement("span");
    reflection.className = "image-reflection";
    reflection.setAttribute("aria-hidden", "true");
    reflection.addEventListener("animationend", stopReflection, { once: true });
    document.body.append(reflection);
    positionReflection();
  }

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch" || !(event.target instanceof HTMLImageElement)) return;
    reflect(event.target);
  });

  document.addEventListener("focusin", (event) => {
    if (event.target.matches("a:focus-visible, button:focus-visible")) reflect(event.target.querySelector("img"));
  });

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

        if (target.classList.contains("corridor-diagram")) target.classList.add("route-in-view");

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
      if (target.classList.contains("corridor-diagram") || target.getBoundingClientRect().top >= window.innerHeight) observer.observe(target);
    }
  }

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest(revealTargets);
    active.get(target)?.cancel();
  });

  if (downloadLink && "ResizeObserver" in window) {
    downloadLink.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = downloadLink.hash;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      // The native link sets the fragment. Keep it in place while lazy maps resize.
      const layout = new ResizeObserver(() => {
        if (window.location.hash !== hash) return;
        const top = target.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * .75) {
          target.scrollIntoView({ behavior: "instant", block: "start" });
        }
      });
      const listeners = new AbortController();
      const stop = () => {
        layout.disconnect();
        listeners.abort();
      };

      layout.observe(article);
      for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) {
        window.addEventListener(type, stop, { passive: true, signal: listeners.signal });
      }
      window.setTimeout(stop, 2200);
    });
  }

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
    stopReflection();
    for (const animation of active.values()) animation.cancel();
    themeButton.classList.remove("is-switching");
    observeReveals();
    queueProgress();
  });

  observeReveals();
})();
