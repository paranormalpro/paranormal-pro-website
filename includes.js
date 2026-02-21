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

  // Per-page title/subtitle (optional)
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

  // Auto-active nav link (for injected header pages)
  try {
    const path = window.location.pathname;
    const current = path.split("/").pop() || "index.html";

    const nav = document.querySelector(".command-nav");
    if (nav) {
      const links = nav.querySelectorAll("a[href]");
      links.forEach(a => a.removeAttribute("aria-current"));

      links.forEach(a => {
        const href = a.getAttribute("href");
        if (!href) return;

        const hrefFile = href.split("/").pop();
        if (hrefFile === current) {
          a.setAttribute("aria-current", "page");
        }
      });
    }
  } catch (e) {
    console.warn("Nav active state failed:", e);
  }
})();
