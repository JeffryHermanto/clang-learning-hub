const DOCS = [
  { id: "tutorial", title: "Tutorial C", icon: "\u{1F4D8}", file: "content/tutorial.md" },
  { id: "cheatsheet", title: "Cheatsheet", icon: "⚡", file: "content/cheatsheet.md" },
  { id: "projects", title: "Mini Project", icon: "\u{1F6E0}️", file: "content/projects.md" },
];

const docEl = document.getElementById("doc");
const navListEl = document.getElementById("nav-doc-list");
const tocEl = document.getElementById("toc-list");
const searchInput = document.getElementById("search-input");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleIcon = themeToggleBtn.querySelector(".theme-toggle-icon");
const hljsThemeLink = document.getElementById("hljs-theme");

const THEME_KEY = "theme-preference";
const HLJS_THEMES = {
  dark: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css",
  light: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css",
};

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  hljsThemeLink.href = HLJS_THEMES[theme];
  themeToggleIcon.textContent = theme === "light" ? "🌞" : "🌙";
  themeToggleBtn.title = theme === "light" ? "Ganti ke mode gelap" : "Ganti ke mode terang";
  localStorage.setItem(THEME_KEY, theme);
}

themeToggleBtn.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
});

applyTheme(document.documentElement.getAttribute("data-theme") || "dark");

const cache = {};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function currentDocId() {
  const hash = window.location.hash.replace("#", "");
  const [docId] = hash.split(":");
  return DOCS.find((d) => d.id === docId) ? docId : DOCS[0].id;
}

function renderNav(activeId) {
  navListEl.innerHTML = "";
  DOCS.forEach((doc) => {
    const wrap = document.createElement("div");

    const link = document.createElement("a");
    link.className = "nav-doc-link" + (doc.id === activeId ? " active" : "");
    link.href = `#${doc.id}`;
    link.innerHTML = `<span class="icon">${doc.icon}</span><span>${doc.title}</span>`;
    wrap.appendChild(link);

    const headingsBox = document.createElement("div");
    headingsBox.className = "nav-headings" + (doc.id === activeId ? " open" : "");
    headingsBox.id = `nav-headings-${doc.id}`;
    wrap.appendChild(headingsBox);

    navListEl.appendChild(wrap);
  });
}

function renderMobileHeadings(doc, headings) {
  const box = document.getElementById(`nav-headings-${doc.id}`);
  if (!box) return;
  box.innerHTML = "";
  headings
    .filter((h) => h.level === 2)
    .forEach((h) => {
      const a = document.createElement("a");
      a.href = `#${doc.id}:${h.slug}`;
      a.textContent = h.text;
      box.appendChild(a);
    });
}

function renderToc(doc, headings) {
  tocEl.innerHTML = "";
  headings.forEach((h) => {
    const a = document.createElement("a");
    a.href = `#${doc.id}:${h.slug}`;
    a.textContent = h.text;
    a.className = h.level === 3 ? "h3" : "h2";
    a.dataset.slug = h.slug;
    tocEl.appendChild(a);
  });
}

function extractHeadings(container) {
  const headings = [];
  container.querySelectorAll("h2, h3").forEach((el) => {
    const slug = slugify(el.textContent);
    el.id = slug;
    headings.push({ text: el.textContent, level: el.tagName === "H2" ? 2 : 3, slug });
  });
  return headings;
}

function setupScrollSpy(doc) {
  const links = Array.from(tocEl.querySelectorAll("a"));
  if (!links.length) return;
  const headingEls = links
    .map((l) => document.getElementById(l.dataset.slug))
    .filter(Boolean);

  function onScroll() {
    let activeSlug = headingEls[0] && headingEls[0].id;
    for (const el of headingEls) {
      if (el.getBoundingClientRect().top < 120) {
        activeSlug = el.id;
      } else {
        break;
      }
    }
    links.forEach((l) => l.classList.toggle("active", l.dataset.slug === activeSlug));
  }

  window.removeEventListener("scroll", window.__scrollSpyHandler || (() => {}));
  window.__scrollSpyHandler = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

async function loadDoc(id) {
  const doc = DOCS.find((d) => d.id === id) || DOCS[0];

  renderNav(doc.id);
  docEl.innerHTML = `<div class="state-msg">Memuat ${doc.title}...</div>`;

  try {
    let md = cache[doc.id];
    if (!md) {
      const res = await fetch(doc.file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      md = await res.text();
      cache[doc.id] = md;
    }

    const html = marked.parse(md, { headerIds: false, mangle: false });
    docEl.innerHTML = html;

    // Rewrite internal .html links (tutorial.html / cheatsheet.html) to hash routes
    docEl.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      const match = href && href.match(/^([\w-]+)\.html$/);
      if (match) {
        const targetId = match[1] === "tutorial" ? "tutorial" : match[1] === "cheatsheet" ? "cheatsheet" : match[1];
        a.setAttribute("href", `#${targetId}`);
      }
    });

    docEl.querySelectorAll("pre code").forEach((block) => {
      if (window.hljs) hljs.highlightElement(block);
    });

    const headings = extractHeadings(docEl);
    renderToc(doc, headings);
    renderMobileHeadings(doc, headings);
    setupScrollSpy(doc);

    const [, target] = window.location.hash.replace("#", "").split(":");
    if (target) {
      const el = document.getElementById(target);
      if (el) setTimeout(() => el.scrollIntoView({ block: "start" }), 30);
    } else {
      window.scrollTo(0, 0);
    }

    document.title = `${doc.title} — Belajar C`;
  } catch (err) {
    docEl.innerHTML = `<div class="state-msg">
      Gagal memuat <code>${doc.file}</code>.<br><br>
      File markdown perlu diakses lewat server lokal (bukan dibuka langsung sebagai file://).<br><br>
      Jalankan salah satu perintah berikut di folder proyek ini, lalu buka <code>http://localhost:8000</code>:<br><br>
      <code>python3 -m http.server 8000</code><br>
      <code>npx serve .</code>
    </div>`;
    console.error(err);
  }
}

function handleRoute() {
  loadDoc(currentDocId());
}

window.addEventListener("hashchange", handleRoute);

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  const blocks = docEl.querySelectorAll("h1, h2, h3, p, li, pre, table");
  if (!q) {
    blocks.forEach((el) => (el.style.display = ""));
    return;
  }
  blocks.forEach((el) => {
    el.style.display = el.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});

if (!window.location.hash) {
  window.location.hash = DOCS[0].id;
}
handleRoute();
