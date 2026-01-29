(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const storageKey = "theme";

  function apply(theme) {
    if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (btn) btn.setAttribute("aria-label", "Switch to dark mode");
      if (btn) btn.setAttribute("title", "Switch to dark mode");
    } else {
      root.removeAttribute("data-theme");
      if (btn) btn.setAttribute("aria-label", "Switch to light mode");
      if (btn) btn.setAttribute("title", "Switch to light mode");
    }
  }

  function getPreferred() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;

    // default to system preference
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  // init
  apply(getPreferred());

  if (!btn) return;

  btn.addEventListener("click", function () {
    const isLight = root.getAttribute("data-theme") === "light";
    const next = isLight ? "dark" : "light";
    localStorage.setItem(storageKey, next);
    apply(next);
  });
})();
