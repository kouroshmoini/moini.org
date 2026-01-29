(function () {
  const input = document.getElementById("siteSearch");
  const box = document.getElementById("searchResults");
  if (!input || !box) return;

  let data = [];
  let open = false;
  let activeIndex = -1;
  const maxItems = 7;

  function setOpen(next) {
    open = next;
    box.classList.toggle("is-open", open);
    input.setAttribute("aria-expanded", open ? "true" : "false");
    if (!open) {
      box.innerHTML = "";
      activeIndex = -1;
    }
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(title, q) {
    if (!q) return title;
    const re = new RegExp("(" + escapeRegExp(q) + ")", "ig");
    return title.replace(re, "<mark>$1</mark>");
  }

  function render(results, q) {
    if (!results.length) {
      box.innerHTML = `<div class="search-empty">No results</div>`;
      setOpen(true);
      return;
    }

    box.innerHTML = results
      .map((item, i) => {
        const meta = item.type === "post" ? item.displayDate : "Page";
        return `
          <a class="search-item" role="option" aria-selected="${i === activeIndex ? "true" : "false"}"
             href="${item.url}">
            <div class="search-item-title">${highlight(item.title, q)}</div>
            <div class="search-item-meta">${meta}</div>
          </a>
        `;
      })
      .join("");

    setOpen(true);
  }

  function search(q) {
    const query = q.trim().toLowerCase();
    if (!query) {
      setOpen(false);
      return;
    }

    const results = data
      .filter((item) => {
        const t = (item.title || "").toLowerCase();
        const txt = (item.text || "").toLowerCase();
        return t.includes(query) || txt.includes(query);
      })
      .slice(0, maxItems);

    activeIndex = -1;
    render(results, q.trim());
  }

  async function init() {
    try {
      const res = await fetch((window.location.origin + "{{ '/assets/search.json' | relative_url }}").replace(window.location.origin, ""));
      // The line above is safe on GitHub Pages relative paths.
      const json = await res.json();
      data = Array.isArray(json) ? json : [];
    } catch (e) {
      data = [];
    }
  }

  // GitHub Pages note: liquid won’t run inside JS files.
  // So we resolve the path without liquid:
  const SEARCH_URL = "/assets/search.json";

  async function init2() {
    try {
      const res = await fetch(SEARCH_URL, { cache: "no-store" });
      const json = await res.json();
      data = Array.isArray(json) ? json : [];
    } catch (e) {
      data = [];
    }
  }

  init2();

  input.addEventListener("input", () => search(input.value));
  input.addEventListener("focus", () => search(input.value));

  document.addEventListener("click", (e) => {
    if (!open) return;
    if (e.target === input || box.contains(e.target)) return;
    setOpen(false);
  });

  input.addEventListener("keydown", (e) => {
    if (!open) return;

    const items = Array.from(box.querySelectorAll(".search-item"));
    if (!items.length) return;

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach((el, idx) => el.setAttribute("aria-selected", idx === activeIndex ? "true" : "false"));
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach((el, idx) => el.setAttribute("aria-selected", idx === activeIndex ? "true" : "false"));
      items[activeIndex].scrollIntoView({ block: "nearest" });
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      items[activeIndex].click();
    }
  });

  // Mark styling for highlights
  const style = document.createElement("style");
  style.textContent = `
    .search-results mark{
      background: transparent;
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  `;
  document.head.appendChild(style);
})();
