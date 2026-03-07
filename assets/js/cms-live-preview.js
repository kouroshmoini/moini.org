(function () {
  var storageKey = "cms_live_preview";
  var params = new URLSearchParams(window.location.search);

  if (params.get("cmslive") === "1") {
    localStorage.setItem(storageKey, "1");
  } else if (params.get("cmslive") === "0") {
    localStorage.removeItem(storageKey);
  }

  var enabled = localStorage.getItem(storageKey) === "1";
  if (!enabled) return;

  var pollMs = 10000;
  var baseline = null;
  var checking = false;

  function withCacheBuster(url) {
    var out = new URL(url);
    out.searchParams.set("__cmslive", String(Date.now()));
    return out.toString();
  }

  function hashString(str) {
    var hash = 2166136261;
    for (var i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  async function fingerprint(url) {
    try {
      var headRes = await fetch(withCacheBuster(url), {
        method: "HEAD",
        cache: "no-store",
      });

      if (headRes.ok) {
        var etag = headRes.headers.get("etag");
        var lastModified = headRes.headers.get("last-modified");
        if (etag || lastModified) {
          return "h:" + (etag || "") + "|" + (lastModified || "");
        }
      }
    } catch (e) {
      // Ignore and fallback to GET hash below.
    }

    try {
      var getRes = await fetch(withCacheBuster(url), { cache: "no-store" });
      if (!getRes.ok) return null;
      var html = await getRes.text();
      return "g:" + hashString(html);
    } catch (e) {
      return null;
    }
  }

  function renderBadge() {
    var badge = document.createElement("div");
    badge.setAttribute(
      "style",
      [
        "position:fixed",
        "right:12px",
        "bottom:12px",
        "z-index:9999",
        "padding:8px 10px",
        "border-radius:999px",
        "font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
        "background:#111",
        "color:#fff",
        "box-shadow:0 6px 18px rgba(0,0,0,0.2)",
      ].join(";")
    );
    badge.innerHTML = 'Live preview on <a href="#" id="cmsliveOff" style="color:#fff;text-decoration:underline;margin-left:6px">turn off</a>';
    document.body.appendChild(badge);

    var off = document.getElementById("cmsliveOff");
    if (!off) return;
    off.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem(storageKey);
      var next = new URL(window.location.href);
      next.searchParams.delete("cmslive");
      next.searchParams.delete("__cmslive");
      window.location.href = next.toString();
    });
  }

  async function checkForChanges() {
    if (checking || document.hidden) return;
    checking = true;

    try {
      var current = await fingerprint(window.location.href);
      if (!current) return;

      if (!baseline) {
        baseline = current;
        return;
      }

      if (current !== baseline) {
        window.location.reload();
      }
    } finally {
      checking = false;
    }
  }

  renderBadge();
  checkForChanges();
  window.setInterval(checkForChanges, pollMs);
})();
