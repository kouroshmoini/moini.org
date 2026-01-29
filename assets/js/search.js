(() => {
  const input = document.getElementById("siteSearch");
  const resultsBox = document.getElementById("searchResults");
  if (!input || !resultsBox) return;

  let index = [];
  let active = -1;

  fetch("/assets/search.json", { cache: "no-store" })
    .then(r => r.json())
    .then(data => index = data)
    .catch(() => {});

  function closeResults() {
    resultsBox.classList.remove("is-open");
    resultsBox.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    active = -1;
  }

  function openResults() {
    resultsBox.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
  }

  function render(items) {
    if (!items.length) {
      resultsBox.innerHTML = `<div class="search-empty">No results</div>`;
      openResults();
      return;
    }

    resultsBox.innerHTML = items.map((item, i) => `
      <a
        href="${item.url}"
        class="search-item"
        role="option"
        aria-selected="${i === active}">
        <div class="search-item-title">${item.title}</div>
        <div class="search-item-meta">${item.type}${item.date ? " · " + item.date : ""}</div>
      </a>
    `).join("");

    openResults();
  }

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) return closeResults();

    const matches = index
      .filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.content.toLowerCase().includes(q)
      )
      .slice(0, 8);

    render(matches);
  });

  input.addEventListener("keydown", e => {
    const items = resultsBox.querySelectorAll(".search-item");
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = (active + 1) % items.length;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      active = (active - 1 + items.length) % items.length;
    }

    if (e.key === "Enter" && active >= 0) {
      window.location = items[active].href;
    }

    items.forEach((el, i) =>
      el.setAttribute("aria-selected", i === active)
    );
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".search")) closeResults();
  });
})();
