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

  // Inject shared header + footer
  await inject("#site-header", "header.html");
  await inject("#site-footer", "footer.html");

  // Apply per-page title/subtitle (optional)
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

  // ✅ Auto-highlight active nav link (works with injected header.html)
  const path = window.location.pathname.split("/").pop() || "index.html";

  const navLinks = document.querySelectorAll(".command-nav a");
  navLinks.forEach((a) => {
    // remove any previous state
    a.removeAttribute("aria-current");
    a.classList.remove("active");

    const href = (a.getAttribute("href") || "").split("?")[0];
    if (href === path) {
      a.setAttribute("aria-current", "page");
      a.classList.add("active");
    }
  });
})();
