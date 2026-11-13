(() => {
  const dialog = document.getElementById("siteSearch");
  const trigger = document.getElementById("openSearch");
  const input = document.getElementById("searchInput");
  const status = document.getElementById("searchStatus");
  const results = document.getElementById("searchResults");
  const base = document.querySelector('meta[name="site-baseurl"]').content.replace(/\/$/, "");
  const normalize = (value) => String(value || "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
  let entries;
  let loading = false;
  let failed = false;

  function render() {
    results.replaceChildren();
    if (loading || failed) {
      status.textContent = loading ? "Loading search…" : "Search is unavailable. Reopen to try again.";
      return;
    }
    const terms = normalize(input.value).trim().split(/\s+/).filter(Boolean);
    if (terms.length === 0 || !entries) {
      status.textContent = "";
      return;
    }

    const matches = entries.flatMap((entry) => {
      const scores = terms.map((term) => entry.titleSearch.includes(term) ? 3 : Number(entry.textSearch.includes(term)));
      if (scores.includes(0)) return [];
      return [{ entry, score: scores.reduce((total, score) => total + score, 0) }];
    }).sort((a, b) => b.score - a.score).slice(0, 10);

    status.textContent = matches.length === 0 ? "No results." : `${matches.length} ${matches.length === 1 ? "result" : "results"}`;
    for (const { entry } of matches) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const label = document.createElement("span");
      const type = document.createElement("small");
      link.href = entry.url;
      label.textContent = entry.title;
      type.textContent = entry.type;
      link.append(label, type);
      item.append(link);
      results.append(item);
    }
  }

  trigger.addEventListener("click", async () => {
    dialog.showModal();
    if (entries || loading) return;
    loading = true;
    failed = false;
    render();
    try {
      const response = await fetch(base + "/assets/search.json");
      if (!response.ok) throw new Error("Search index unavailable");
      entries = (await response.json()).map((entry) => ({
        ...entry,
        titleSearch: normalize(entry.title),
        textSearch: normalize(entry.text)
      }));
    } catch {
      failed = true;
    } finally {
      loading = false;
      render();
    }
  });
  input.addEventListener("input", render);
  trigger.hidden = false;
})();
