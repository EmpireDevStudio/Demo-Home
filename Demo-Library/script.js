/**
 * CURATED ARCHIVE & INDEX CONTROLLER
 * Architecture: Smart Directory Crawling, Multi-Format Media Handling,
 * Dynamic Sorting, and Mobile-Friendly Layout Transformations.
 */

const AppState = {
  documents: [],
  categories: new Set(),
  activeCategory: "ALL",
  activeFormatChip: "ALL",
  searchQuery: "",
  activeSort: "name-asc",
  activeView: "grid" // 'grid' | 'list'
};

// MIME / Format Extension Definitions
const FORMAT_SPECS = {
  document: ["pdf", "doc", "docx", "odt", "rtf", "pages"],
  sheet: ["xls", "xlsx", "csv", "numbers", "tsv"],
  slides: ["ppt", "pptx", "key"],
  media: ["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov", "mp3", "wav", "ogg", "m4a", "flac"],
  code: ["txt", "md", "json", "html", "css", "js", "ts", "py", "sql", "sh", "yaml", "yml", "xml"]
};

document.addEventListener("DOMContentLoaded", () => {
  setupUIEventListeners();
  startAssetDiscovery();
});

// ==============================================================
// 1. DISCOVERY & AUTO-CRAWLING ENGINE
// ==============================================================
async function startAssetDiscovery() {
  const badge = document.getElementById("docCountBadge");
  const refreshBtn = document.getElementById("refreshBtn");
  const emptyView = document.getElementById("emptyView");

  refreshBtn.classList.add("syncing");
  badge.textContent = "Scanning directory structure…";
  hideBanner();

  let discovered = [];

  // Local file:// protocol requires user file picker
  if (window.location.protocol === "file:") {
    document.getElementById("localPickerBtn").classList.remove("hidden");
    showBanner("Local Protocol Active: Click 'Select Assets' to choose your folder.");
    refreshBtn.classList.remove("syncing");
    emptyView.classList.remove("hidden");
    return;
  }

  // Attempt 1: Scrape local web server directory indexes (Node, LiveServer, Python, Nginx)
  try {
    discovered = await crawlServerDirectory("./assets/");
  } catch (_) {
    discovered = [];
  }

  // Attempt 2: Structured assets.json index (fallback if user provides static manifest)
  if (!discovered || discovered.length === 0) {
    try {
      const res = await fetch("./assets.json?t=" + Date.now());
      if (res.ok) discovered = await res.json();
    } catch (_) {}
  }

  // Attempt 3: GitHub Pages API Crawl (if published on GitHub)
  if (!discovered || discovered.length === 0) {
    discovered = await crawlGitHubRepo();
  }

  // Final Assessment
  if (discovered && discovered.length > 0) {
    hydrateDocuments(discovered);
    renderCategoryTrack();
    applyCatalogFilters();
    emptyView.classList.add("hidden");
  } else {
    badge.textContent = "0 items available";
    emptyView.classList.remove("hidden");
    document.getElementById("emptyMsg").innerHTML = `
      No catalog files located inside <code>assets/</code>.<br>
      Ensure resources are arranged as: <code>assets/CategoryName/Document.ext</code>
    `;
    document.getElementById("localPickerBtn").classList.remove("hidden");
  }

  refreshBtn.classList.remove("syncing");
}

async function crawlServerDirectory(rootUrl) {
  const rootRes = await fetch(rootUrl);
  if (!rootRes.ok) return [];

  const html = await rootRes.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = Array.from(doc.querySelectorAll("a"));

  const results = [];
  const categoryFolders = [];

  for (const a of links) {
    const href = a.getAttribute("href");
    if (!href || href.startsWith("?") || href.startsWith("/")) continue;
    if (href.endsWith("/") && href !== "../" && href !== "./") {
      categoryFolders.push(decodeURIComponent(href.replace(/\/$/, "")));
    }
  }

  for (const cat of categoryFolders) {
    try {
      const catRes = await fetch(`${rootUrl}${encodeURIComponent(cat)}/`);
      if (!catRes.ok) continue;
      const catHtml = await catRes.text();
      const catDoc = parser.parseFromString(catHtml, "text/html");
      const fileLinks = Array.from(catDoc.querySelectorAll("a"));

      for (const fa of fileLinks) {
        const fHref = fa.getAttribute("href");
        if (!fHref || fHref.endsWith("/") || fHref.startsWith("?") || fHref.startsWith(".")) continue;

        const fName = decodeURIComponent(fHref.split("/").pop());
        const fPath = `${rootUrl}${cat}/${fName}`;

        results.push({
          category: cat,
          filename: fName,
          path: fPath,
          url: fPath,
          size: 0
        });
      }
    } catch (_) {}
  }

  return results;
}

async function crawlGitHubRepo() {
  const host = window.location.hostname;
  const segments = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
  const owner = host.endsWith(".github.io") ? host.split(".")[0] : "";
  const repo = segments[0] || "";

  if (!owner || !repo) return [];

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!repoRes.ok) return [];
    const info = await repoRes.json();
    const branch = info.default_branch || "main";

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (!treeRes.ok) return [];
    const treeData = await treeRes.json();

    const results = [];
    (treeData.tree || []).forEach(node => {
      if (node.type !== "blob") return;
      const p = node.path.replace(/\\/g, "/");
      if (!p.toLowerCase().startsWith("assets/")) return;

      const parts = p.split("/");
      if (parts.length < 3) return;

      const cat = parts[1];
      const filename = parts.slice(2).join("/");

      if (filename.startsWith(".") || filename.toLowerCase().endsWith(".gitkeep")) return;

      results.push({
        category: cat,
        filename: filename,
        path: p,
        size: node.size || 0,
        url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURI(p)}`
      });
    });

    return results;
  } catch (_) {
    return [];
  }
}

function handleLocalFolderPicker(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.webkitRelativePath.replace(/\\/g, "/");
    const parts = path.split("/");

    if (parts.length >= 3) {
      const category = parts[1];
      const filename = parts.slice(2).join("/");

      if (!filename.startsWith(".") && !filename.toLowerCase().endsWith(".gitkeep")) {
        results.push({
          category: category,
          filename: filename,
          path: path,
          size: file.size,
          url: URL.createObjectURL(file)
        });
      }
    }
  }

  if (results.length > 0) {
    hydrateDocuments(results);
    renderCategoryTrack();
    applyCatalogFilters();
    document.getElementById("emptyView").classList.add("hidden");
    hideBanner();
  } else {
    alert("Please select an 'assets' directory that contains category subfolders.");
  }
}

// ==============================================================
// 2. PARSING & FILTERS
// ==============================================================
function hydrateDocuments(rawList) {
  AppState.categories.clear();
  AppState.documents = rawList.map(item => {
    AppState.categories.add(item.category);
    const ext = (item.filename.split(".").pop() || "").toLowerCase();
    const cleanTitle = item.filename.substring(0, item.filename.lastIndexOf(".")) || item.filename;

    return {
      category: item.category,
      filename: item.filename,
      title: cleanTitle.replace(/[_-]+/g, " ").trim(),
      path: item.path,
      ext: ext,
      size: item.size || 0,
      url: item.url || item.path,
      typeGroup: detectTypeGroup(ext)
    };
  });
}

function detectTypeGroup(ext) {
  for (const [group, exts] of Object.entries(FORMAT_SPECS)) {
    if (exts.includes(ext)) return group;
  }
  return "other";
}

function renderCategoryTrack() {
  const track = document.getElementById("categoryTrack");
  track.innerHTML = "";

  const createPill = (catName, label, count) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab-pill ${AppState.activeCategory === catName ? "active" : ""}`;
    btn.textContent = `${label} (${count})`;
    btn.onclick = () => {
      AppState.activeCategory = catName;
      renderCategoryTrack();
      applyCatalogFilters();
    };
    return btn;
  };

  track.appendChild(createPill("ALL", "All Assets", AppState.documents.length));

  Array.from(AppState.categories).sort().forEach(cat => {
    const count = AppState.documents.filter(d => d.category === cat).length;
    track.appendChild(createPill(cat, cat, count));
  });
}

function applyCatalogFilters() {
  const q = AppState.searchQuery.toLowerCase().trim();
  const cat = AppState.activeCategory;
  const chipFormat = AppState.activeFormatChip;

  let filtered = AppState.documents.filter(doc => {
    const matchesCat = cat === "ALL" || doc.category === cat;
    const matchesChip = chipFormat === "ALL" || doc.typeGroup === chipFormat;
    const matchesSearch = !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.ext.includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.filename.toLowerCase().includes(q);

    return matchesCat && matchesChip && matchesSearch;
  });

  filtered = sortDocuments(filtered, AppState.activeSort);
  renderCatalogDOM(filtered);
}

function sortDocuments(list, criteria) {
  return [...list].sort((a, b) => {
    switch (criteria) {
      case "name-asc": return a.title.localeCompare(b.title);
      case "name-desc": return b.title.localeCompare(a.title);
      case "size-desc": return b.size - a.size;
      case "size-asc": return a.size - b.size;
      case "category": return a.category.localeCompare(b.category);
      case "ext": return a.ext.localeCompare(b.ext);
      default: return 0;
    }
  });
}

// ==============================================================
// 3. RENDERING DOM
// ==============================================================
function renderCatalogDOM(docs) {
  const grid = document.getElementById("documentGrid");
  const countBadge = document.getElementById("docCountBadge");
  const heading = document.getElementById("currentCategoryTitle");

  heading.textContent = AppState.activeCategory === "ALL" ? "All Documents" : AppState.activeCategory;
  countBadge.textContent = `${docs.length} ${docs.length === 1 ? "item" : "items"} available`;

  grid.innerHTML = "";

  if (docs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem 1rem; color: var(--text-dim);">
        <p>No resources correspond with your query criteria.</p>
      </div>`;
    return;
  }

  docs.forEach(doc => {
    const card = document.createElement("article");
    card.className = "doc-card";

    card.innerHTML = `
      <div class="doc-top-block">
        <div class="doc-badge-row">
          <div class="doc-ext-glyph">${escapeHTML(doc.ext.toUpperCase())}</div>
          <div class="doc-titles">
            <span class="doc-category-tag">${escapeHTML(doc.category)}</span>
            <h3 class="doc-name">${escapeHTML(doc.title)}</h3>
          </div>
        </div>
      </div>
      <div class="doc-card-meta">
        <span class="doc-size-tag">${formatBytes(doc.size)}</span>
        <div class="doc-action-group">
          <button type="button" class="doc-btn preview-trigger">Inspect</button>
          <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="doc-btn">Download</a>
        </div>
      </div>
    `;

    card.querySelector(".preview-trigger").onclick = () => openInspector(doc);
    grid.appendChild(card);
  });
}

// ==============================================================
// 4. EXPANDED MULTI-FORMAT VIEWER
// ==============================================================
function openInspector(doc) {
  const modal = document.getElementById("readerModal");
  const stage = document.getElementById("modalStage");

  document.getElementById("modalCategory").textContent = doc.category;
  document.getElementById("modalExtBadge").textContent = doc.ext.toUpperCase();
  document.getElementById("modalTitle").textContent = doc.filename;
  document.getElementById("modalMetaSize").textContent = `Size: ${formatBytes(doc.size)}`;
  document.getElementById("modalMetaPath").textContent = doc.path;

  const dl = document.getElementById("modalDownload");
  dl.href = doc.url;
  dl.setAttribute("download", doc.filename);

  document.getElementById("modalCopyLink").onclick = () => {
    navigator.clipboard.writeText(window.location.origin + "/" + doc.path);
    alert("Resource path copied to clipboard.");
  };

  stage.innerHTML = "";

  // 1. PDF
  if (doc.ext === "pdf") {
    stage.innerHTML = `<iframe src="${doc.url}#view=FitH" title="PDF Preview"></iframe>`;
  }
  // 2. High-res Images & Vectors
  else if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(doc.ext)) {
    stage.innerHTML = `<img src="${doc.url}" alt="${escapeHTML(doc.title)}">`;
  }
  // 3. Audio Player
  else if (["mp3", "wav", "ogg", "m4a", "flac"].includes(doc.ext)) {
    stage.innerHTML = `
      <div class="audio-stage-card">
        <div class="audio-glyph">♬</div>
        <h4 style="margin-bottom:0.4rem;">${escapeHTML(doc.title)}</h4>
        <span class="doc-category-tag">${escapeHTML(doc.category)}</span>
        <audio controls src="${doc.url}" style="margin-top:1.5rem;"></audio>
      </div>`;
  }
  // 4. Video Player
  else if (["mp4", "webm", "mov"].includes(doc.ext)) {
    stage.innerHTML = `<video controls autoplay playsinline src="${doc.url}"></video>`;
  }
  // 5. Office Documents via Office Live Viewer
  else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(doc.ext)) {
    if (doc.url.startsWith("http")) {
      stage.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(doc.url)}"></iframe>`;
    } else {
      stage.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--text-dim);">
          <p>Office Web Viewer requires active online hosting to parse remote formats.</p>
          <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="glass-btn-primary" style="margin-top:1rem; display:inline-block;">Download File</a>
        </div>`;
    }
  }
  // 6. Source Code, Markdown & Plain Text
  else if (FORMAT_SPECS.code.includes(doc.ext) || ["csv", "tsv"].includes(doc.ext)) {
    fetch(doc.url)
      .then(res => res.text())
      .then(text => { stage.innerHTML = `<pre><code>${escapeHTML(text)}</code></pre>`; })
      .catch(() => { stage.innerHTML = `<p style="color:var(--text-dim); padding:2rem;">Unable to render text source preview.</p>`; });
  }
  // 7. Fallback Binary
  else {
    stage.innerHTML = `
      <div style="text-align:center; padding:2.5rem; color:var(--text-dim);">
        <p>No inline preview exists for <strong>.${escapeHTML(doc.ext)}</strong> documents.</p>
        <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="glass-btn-primary" style="margin-top:1rem; display:inline-block;">Download ${escapeHTML(doc.filename)}</a>
      </div>`;
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeInspector() {
  document.getElementById("readerModal").classList.add("hidden");
  document.getElementById("modalStage").innerHTML = "";
  document.body.style.overflow = "";
}

// ==============================================================
// 5. USER CONTROLS & EVENT BINDINGS
// ==============================================================
function setupUIEventListeners() {
  const searchInput = document.getElementById("searchInput");
  const clearBtn = document.getElementById("clearSearchBtn");

  searchInput.addEventListener("input", e => {
    AppState.searchQuery = e.target.value;
    clearBtn.classList.toggle("hidden", !AppState.searchQuery);
    applyCatalogFilters();
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    AppState.searchQuery = "";
    clearBtn.classList.add("hidden");
    applyCatalogFilters();
    searchInput.focus();
  });

  // Type Filter Chips
  document.getElementById("formatChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    AppState.activeFormatChip = chip.dataset.format;
    applyCatalogFilters();
  });

  // Sorting Handler
  document.getElementById("sortSelect").addEventListener("change", e => {
    AppState.activeSort = e.target.value;
    applyCatalogFilters();
  });

  // Layout Switcher
  const gridBtn = document.getElementById("viewGridBtn");
  const listBtn = document.getElementById("viewListBtn");
  const gridContainer = document.getElementById("documentGrid");

  gridBtn.onclick = () => {
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
    gridContainer.className = "document-grid view-grid";
    AppState.activeView = "grid";
  };

  listBtn.onclick = () => {
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
    gridContainer.className = "document-grid view-list";
    AppState.activeView = "list";
  };

  document.getElementById("refreshBtn").onclick = startAssetDiscovery;
  document.getElementById("modalClose").onclick = closeInspector;
  window.addEventListener("keydown", e => { if (e.key === "Escape") closeInspector(); });

  const folderInput = document.getElementById("folderInput");
  if (folderInput) folderInput.addEventListener("change", handleLocalFolderPicker);
}

function showBanner(msg) {
  const b = document.getElementById("statusBanner");
  document.getElementById("statusMsg").textContent = msg;
  b.classList.remove("hidden");
}

function hideBanner() {
  document.getElementById("statusBanner").classList.add("hidden");
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "—";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}