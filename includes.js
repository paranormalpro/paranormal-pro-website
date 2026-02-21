(async function () {
  async function inject(selector, url) {
    const host = document.querySelector(selector);
    if (!host) return;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Failed to load ${url}:`, res.status);
      return;
    }

    host.innerHTML = await res.text();
  }

  await inject("#site-header", "header.html");
  await inject("#site-footer", "footer.html");

  // Optional: allow per-page title/subtitle without duplicating header markup
  // Use <meta name="pp:title" content="..."> and <meta name="pp:subtitle" content="...">
  const titleMeta = document.querySelector('meta[name="pp:title"]');
  const subtitleMeta = document.querySelector('meta[name="pp:subtitle"]');

  if (titleMeta) {
    const t = document.getElementById("page-title");
    if (t) t.textContent = titleMeta.content;
  }

  if (subtitleMeta) {
    const s = document.getElementById("page-subtitle");
    if (s) s.textContent = subtitleMeta.content;
  }
})();