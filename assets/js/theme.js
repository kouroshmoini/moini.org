(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("themeToggle");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const dark = () => root.dataset.theme ? root.dataset.theme === "dark" : systemTheme.matches;

  function updateButton() {
    const label = dark() ? "Switch to light mode" : "Switch to dark mode";
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.firstElementChild.textContent = dark() ? "☀" : "☾";
  }

  themeButton.addEventListener("click", () => {
    root.dataset.theme = dark() ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch {}
    updateButton();
  });
  systemTheme.addEventListener("change", updateButton);
  updateButton();
  themeButton.hidden = false;

  const printButton = document.getElementById("printResume");
  if (printButton) {
    printButton.addEventListener("click", () => window.print());
    printButton.hidden = false;
  }
})();
