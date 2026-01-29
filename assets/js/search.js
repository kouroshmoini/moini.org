(function () {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  let index = [];
  let open = false;
  let active = -1;

  function setOpen(next) {
    open = next;
    results.classList.toggle("is-open", open);
    input.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function render(items) {
    active = -1;

    if (!items.length) {
      results.innerHTML = `<div class="search-empty">No results</div>`;
      setOpen(true);
      return;
    }

    results.innerHTML = items
      .map((it, i) => {
        const meta = it.type === "Post" && it.date ? `${it.type} · ${it.date}` : it.type;
        return `
          <a class="search-item" role="option" aria-selected="false" href="${esc(it.url)}" data-i="${i}">
            <div class="search-item-title">${esc(it.title)}</div>
            <div class="search-item-meta">${esc(meta)}</div>
          </a>
        `;
      })
      .join("");

    setOpen(true);
  }

  function highlightActive() {
    const nodes = results.querySelectorAll(".search-item");
    nodes.forEach((n, i) => n.setAttribute("aria-selected", i === active ? "true" : "false"));
    if (active >= 0 && nodes[active]) nodes[active].scrollIntoView({ block: "nearest" });
  }

  function search(q) {
    const query = q.trim().toLowerCase();
    if (!query) {
      results.innerHTML = "";
      setOpen(false);
      return;
    }

    const hits = index
      .map((it) => {
        const hay = `${it.title} ${it.content}`.toLowerCase();
        const score = (it.title || "").toLowerCase().includes(query) ? 2 : 0;
        const match = hay.includes(query);
        return match ? { it, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((x) => x.it);

    render(hits);
  }

  // Load index
  fetch("/search.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((data) => {
      index = Array.isArray(data) ? data : [];
    })
    .catch(() => {
      index = [];
    });

  input.addEventListener("input", (e) => search(e.target.value));

  input.addEventListener("focus", () => {
    if (input.value.trim()) search(input.value);
  });

  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && e.target !== input) setOpen(false);
  });

  input.addEventListener("keydown", (e) => {
    if (!open) return;

    const items = results.querySelectorAll(".search-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, items.length - 1);
      highlightActive();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
      highlightActive();
    } else if (e.key === "Enter") {
      if (active >= 0 && items[active]) {
        e.preventDefault();
        window.location.href = items[active].getAttribute("href");
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  });
})();
