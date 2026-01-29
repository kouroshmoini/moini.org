(function () {
  const input = document.getElementById("siteSearch");
  const results = document.getElementById("searchResults");
  if (!input || !results) return;

  const base =
    (document.querySelector('meta[name="site-baseurl"]')?.content || "").replace(/\/$/, "");
  const indexUrl = base + "/assets/search.json";

  let items = [];
  let open = false;
  let activeIndex = -1;

  function setOpen(next) {
    open = next;
    results.classList.toggle("is-open", open);
    input.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render(list) {
    results.innerHTML = "";

    if (!list.length) {
      results.innerHTML = '<div class="search-empty">No results</div>';
      setOpen(true);
      return;
    }

    list.slice(0, 10).forEach((it, idx) => {
      const a = document.createElement("a");
      a.className = "search-item";
      a.href = it.url;

      a.setAttribute("role", "option");
      a.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");

      const meta = it.type === "Post" && it.date ? `${it.type} · ${it.date}` : it.type;

      a.innerHTML =
        `<div class="search-item-title">${escapeHtml(it.title || "Untitled")}</div>` +
        `<div class="search-item-meta">${escapeHtml(meta)}</div>`;

      results.appendChild(a);
    });

    setOpen(true);
  }

  function scoreMatch(q, it) {
    const title = (it.title || "").toLowerCase();
    const text = (it.text || "").toLowerCase();

    let score = 0;
    if (title.includes(q)) score += 10;
    if (text.includes(q)) score += 2;
    return score;
  }

  function searchNow() {
    const q = input.value.trim().toLowerCase();
    activeIndex = -1;

    if (!q) {
      setOpen(false);
      return;
    }

    const ranked = items
      .map((it) => ({ it, s: scoreMatch(q, it) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.it);

    render(ranked);
  }

  function moveActive(delta) {
    const links = Array.from(results.querySelectorAll(".search-item"));
    if (!links.length) return;

    activeIndex = activeIndex + delta;
    if (activeIndex < 0) activeIndex = links.length - 1;
    if (activeIndex >= links.length) activeIndex = 0;

    links.forEach((el, i) => el.setAttribute("aria-selected", i === activeIndex ? "true" : "false"));
    links[activeIndex].scrollIntoView({ block: "nearest" });
  }

  async function loadIndex() {
    try {
      const res = await fetch(indexUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("search.json fetch failed");
      items = await res.json();
    } catch (e) {
      items = [];
    }
  }

  input.addEventListener("input", searchNow);

  input.addEventListener("keydown", (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === "Enter") {
      const links = results.querySelectorAll(".search-item");
      if (activeIndex >= 0 && links[activeIndex]) {
        window.location.href = links[activeIndex].href;
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      input.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (!results.contains(e.target) && e.target !== input) setOpen(false);
  });

  loadIndex();
})();
