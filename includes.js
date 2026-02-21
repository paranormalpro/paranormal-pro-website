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

  // Inject shared header/footer
  await inject("#site-header", "header.html");
  await inject("#site-footer", "footer.html");

  // Optional per-page title/subtitle without duplicating header markup
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

  // ✅ Auto-highlight active navigation link
  // Works for GitHub Pages and local file paths
  (function setActiveNav() {
    const nav = document.querySelector(".command-nav");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a[href]"));
    if (!links.length) return;

    // Current page filename (e.g., "about.html")
    const path = window.location.pathname || "";
    let current = path.split("/").pop();
    if (!current || current === "") current = "index.html";

    // If URL ends with "/" (GitHub Pages root), treat as index.html
    if (path.endsWith("/")) current = "index.html";

    links.forEach((a) => {
      a.removeAttribute("aria-current");
      a.classList.remove("active");
    });

    // Match by filename only
    const match = links.find((a) => {
      const href = (a.getAttribute("href") || "").split("#")[0].split("?")[0];
      const hrefFile = href.split("/").pop();
      return hrefFile === current;
    });

    if (match) {
      match.setAttribute("aria-current", "page");
      match.classList.add("active");
    }
  })();

  // ✅ Signal "ready" so CSS entrance animations can fire after header/footer load
  // (We'll use this in style.css with body.pp-ready …)
  document.body.classList.add("pp-ready");
})();
