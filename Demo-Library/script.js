/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  // 1. APPLICATION IDENTITY & METADATA
  identity: {
    appId: "curated-folio-archive",
    appName: "Editorial Archive & Document Index",
    appTagline: "Curated Archival Management & Operational Document Library",
    eyebrowText: "FOLIO VOL. IV",
    version: "4.2.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    accentColor: "#963E35",       // Accessible Terracotta
    accentSecondary: "#3E5B42",   // Accessible Sage
    accentHighlight: "#6E5614",   // Accessible Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilySerif: "'Newsreader', Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "#archive",
    backLabel: "Index",
    items: [
      { id: "archive", label: "Catalog", icon: "icon-catalog", route: "#archive", enabled: true, showInBottomBar: true },
      { id: "categories", label: "Categories", icon: "icon-folders", route: "#categories", enabled: true, showInBottomBar: true },
      { id: "recent", label: "Inspected", icon: "icon-history", route: "#recent", enabled: true, showInBottomBar: true },
      { id: "settings", label: "Storage", icon: "icon-storage", route: "#storage", enabled: true, showInBottomBar: true }
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultTitle: "Editorial Archive & Index",
      defaultSubtitle: "Master inventory of verified documents, sheets, source media, and analytical records.",
      inspectTitle: "Document Inspector",
    },
    emptyStates: {
      noDataHeading: "No Archival Records Discovered",
      noDataDescription: "No catalog files were located inside the assets/ directory path. Verify your folder structure or mount an operational folder using the action above.",
      noSearchResultsHeading: "No Matching Records Discovered",
      noSearchResultsDescription: "Review your filter parameters or search terms and attempt the query again.",
    },
    actions: {
      inspect: "Inspect",
      download: "Download",
      copyLink: "Copy Link",
      rescan: "Rescan Assets",
      mount: "Mount Assets",
      back: "Navigate Back",
    },
    notifications: {
      scanning: "Scanning assets directory structure…",
      synced: "Catalog synchronized successfully.",
      linkCopied: "Resource URL successfully copied to clipboard.",
      localMounted: "Local folder assets mounted successfully.",
      localPrompt: "Local Protocol Active: Click 'Mount Assets' to choose your directory.",
    },
    legal: {
      copyrightHolder: "Editorial Ledger Archival Systems",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "",
    documentationUrl: "",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms micro-haptics on mobile
    enableAutoScanOnLoad: true,        // Automatic discovery on DOM ready
    enableOfficeLiveViewer: true,      // Remote office document viewer
    defaultSortCriteria: "name-asc",
    defaultViewLayout: "grid",         // 'grid' | 'list'
  },

  // 7. PATHS & STORAGE KEYS
  paths: {
    assetsRoot: "./assets/",
    manifestJson: "./assets.json",
  },
  storageKeys: {
    viewPreference: "folio_archive_view_mode",
    sortPreference: "folio_archive_sort_mode",
  }
});

/**
 * =========================================================================
 * APPLICATION STATE MANAGEMENT
 * =========================================================================
 */
const AppState = {
  documents: [],
  categories: new Set(),
  activeCategory: "ALL",
  activeFormatChip: "ALL",
  searchQuery: "",
  activeSort: APP_CONFIG.features.defaultSortCriteria,
  activeView: APP_CONFIG.features.defaultViewLayout,
  inspectedHistory: []
};

// MIME / Format Extension Definitions
const FORMAT_SPECS = {
  document: ["pdf", "doc", "docx", "odt", "rtf", "pages"],
  sheet: ["xls", "xlsx", "csv", "numbers", "tsv"],
  slides: ["ppt", "pptx", "key"],
  media: ["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov", "mp3", "wav", "ogg", "m4a", "flac"],
  code: ["txt", "md", "json", "html", "css", "js", "ts", "py", "sql", "sh", "yaml", "yml", "xml"]
};

// ==============================================================
// INITIALIZATION
// ==============================================================
document.addEventListener("DOMContentLoaded", () => {
  hydrateAppConfig();
  setupUIEventListeners();
  if (APP_CONFIG.features.enableAutoScanOnLoad) {
    startAssetDiscovery();
  }
});

/**
 * Triggers a subtle tactile pulse on modern mobile devices.
 * Simulates mechanical click feedback.
 */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12);
    } catch (_) {}
  }
}

/**
 * Hydrates static document elements from APP_CONFIG
 */
function hydrateAppConfig() {
  document.title = APP_CONFIG.identity.appName;
  document.getElementById("pageEyebrowSlot").textContent = APP_CONFIG.identity.eyebrowText;
  document.getElementById("pageTitleSlot").textContent = APP_CONFIG.content.headers.defaultTitle;
  document.getElementById("pageSubtitleSlot").textContent = APP_CONFIG.content.headers.defaultSubtitle;
  document.getElementById("backNavLabel").textContent = APP_CONFIG.navigation.backLabel;

  // Restore saved view and sort preferences if available
  try {
    const savedView = localStorage.getItem(APP_CONFIG.storageKeys.viewPreference);
    if (savedView === "grid" || savedView === "list") {
      AppState.activeView = savedView;
    }
    const savedSort = localStorage.getItem(APP_CONFIG.storageKeys.sortPreference);
    if (savedSort) {
      AppState.activeSort = savedSort;
      const sortSelect = document.getElementById("sortSelect");
      if (sortSelect) sortSelect.value = savedSort;
    }
  } catch (_) {}

  renderBottomDock();
}

/**
 * Renders the persistent mobile thumb dock from configuration
 */
function renderBottomDock() {
  const dockContainer = document.getElementById("bottomDockNavItems");
  if (!dockContainer) return;
  dockContainer.innerHTML = "";

  APP_CONFIG.navigation.items.filter(item => item.showInBottomBar && item.enabled).forEach((item, index) => {
    const btn = document.createElement("a");
    btn.href = item.route;
    btn.className = `nav-tab-item interactive-tactile ${index === 0 ? "nav-tab-item--active" : ""}`;
    btn.setAttribute("data-tab-id", item.id);

    btn.innerHTML = `
      <span>${escapeHTML(item.label)}</span>
      <span class="nav-tab-item__indicator" aria-hidden="true"></span>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerHapticPulse();
      document.querySelectorAll(".nav-tab-item").forEach(t => t.classList.remove("nav-tab-item--active"));
      btn.classList.add("nav-tab-item--active");

      if (item.id === "categories") {
        document.getElementById("categoryTrack").scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else if (item.id === "recent") {
        renderInspectedHistory();
      } else if (item.id === "archive") {
        AppState.activeCategory = "ALL";
        renderCategoryTrack();
        applyCatalogFilters();
      }
    });

    dockContainer.appendChild(btn);
  });
}

// ==============================================================
// 1. ASSET DISCOVERY & AUTO-CRAWLING ENGINE
// ==============================================================
async function startAssetDiscovery() {
  const badge = document.getElementById("docCountBadge");
  const refreshBtn = document.getElementById("refreshBtn");
  const emptyView = document.getElementById("emptyView");

  refreshBtn.classList.add("syncing");
  badge.textContent = APP_CONFIG.content.notifications.scanning;
  hideBanner();

  let discovered = [];

  // Local file:// protocol fallback
  if (window.location.protocol === "file:") {
    document.getElementById("localPickerBtn").classList.remove("hidden");
    showBanner(APP_CONFIG.content.notifications.localPrompt);
    refreshBtn.classList.remove("syncing");
    emptyView.classList.remove("hidden");
    return;
  }

  // Attempt 1: Server directory crawl
  try {
    discovered = await crawlServerDirectory(APP_CONFIG.paths.assetsRoot);
  } catch (_) {
    discovered = [];
  }

  // Attempt 2: Manifest JSON fallback
  if (!discovered || discovered.length === 0) {
    try {
      const res = await fetch(`${APP_CONFIG.paths.manifestJson}?t=${Date.now()}`);
      if (res.ok) discovered = await res.json();
    } catch (_) {}
  }

  // Attempt 3: GitHub Pages API Crawl
  if (!discovered || discovered.length === 0) {
    discovered = await crawlGitHubRepo();
  }

  // Hydration evaluation
  if (discovered && discovered.length > 0) {
    hydrateDocuments(discovered);
    renderCategoryTrack();
    applyCatalogFilters();
    emptyView.classList.add("hidden");
  } else {
    badge.textContent = "0 records available";
    emptyView.classList.remove("hidden");
    document.getElementById("emptyHeading").textContent = APP_CONFIG.content.emptyStates.noDataHeading;
    document.getElementById("emptyMsg").innerHTML = APP_CONFIG.content.emptyStates.noDataDescription;
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
    triggerHapticPulse();
  } else {
    alert("Please select an assets directory that contains category subfolders.");
  }
}

// ==============================================================
// 2. DATA HYDRATION & FILTERING
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
    btn.className = `tab-pill interactive-tactile ${AppState.activeCategory === catName ? "tab-pill--active" : ""}`;
    btn.textContent = `${label} (${count})`;
    btn.onclick = () => {
      triggerHapticPulse();
      AppState.activeCategory = catName;
      renderCategoryTrack();
      applyCatalogFilters();
    };
    return btn;
  };

  track.appendChild(createPill("ALL", "Complete Index", AppState.documents.length));

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
// 3. CATALOG RENDERING & DOM ARCHITECTURE
// ==============================================================
function renderCatalogDOM(docs) {
  const grid = document.getElementById("documentGrid");
  const countBadge = document.getElementById("docCountBadge");
  const heading = document.getElementById("currentCategoryTitle");

  heading.textContent = AppState.activeCategory === "ALL" ? "Complete Index" : AppState.activeCategory;
  countBadge.textContent = `${docs.length} ${docs.length === 1 ? "record" : "records"} available`;

  grid.innerHTML = "";

  if (docs.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: var(--space-10) var(--space-4);">
        <h4 style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: var(--space-1);">${escapeHTML(APP_CONFIG.content.emptyStates.noSearchResultsHeading)}</h4>
        <p style="color: var(--color-text-secondary); font-size: 0.875rem;">${escapeHTML(APP_CONFIG.content.emptyStates.noSearchResultsDescription)}</p>
      </div>`;
    return;
  }

  docs.forEach(doc => {
    const card = document.createElement("article");
    card.className = "paper-card";
    card.setAttribute("data-component", "archival-card");

    card.innerHTML = `
      <div class="paper-card__top">
        <div class="paper-card__glyph">${escapeHTML(doc.ext.toUpperCase())}</div>
        <div class="paper-card__meta-group">
          <span class="paper-card__category">${escapeHTML(doc.category)}</span>
          <h3 class="paper-card__title">${escapeHTML(doc.title)}</h3>
        </div>
      </div>
      <div class="paper-card__footer">
        <span class="paper-card__size">${formatBytes(doc.size)}</span>
        <div class="paper-card__actions">
          <button type="button" class="btn-paper-secondary interactive-tactile inspect-btn">${escapeHTML(APP_CONFIG.content.actions.inspect)}</button>
          <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="btn-paper-primary interactive-tactile">${escapeHTML(APP_CONFIG.content.actions.download)}</a>
        </div>
      </div>
    `;

    card.querySelector(".inspect-btn").onclick = () => {
      triggerHapticPulse();
      openInspector(doc);
    };

    grid.appendChild(card);
  });
}

function renderInspectedHistory() {
  const heading = document.getElementById("currentCategoryTitle");
  heading.textContent = "Recently Inspected";
  const uniqueHistory = Array.from(new Set(AppState.inspectedHistory));
  const docs = AppState.documents.filter(d => uniqueHistory.includes(d.path));
  renderCatalogDOM(docs);
}

// ==============================================================
// 4. MULTI-FORMAT PAPER INSPECTOR MODAL
// ==============================================================
function openInspector(doc) {
  const modal = document.getElementById("readerModal");
  const stage = document.getElementById("modalStage");

  // Track inspected history
  if (!AppState.inspectedHistory.includes(doc.path)) {
    AppState.inspectedHistory.unshift(doc.path);
  }

  document.getElementById("modalCategory").textContent = doc.category;
  document.getElementById("modalExtBadge").textContent = doc.ext.toUpperCase();
  document.getElementById("modalTitle").textContent = doc.filename;
  document.getElementById("modalMetaSize").textContent = `Size: ${formatBytes(doc.size)}`;
  document.getElementById("modalMetaPath").textContent = doc.path;

  const dl = document.getElementById("modalDownload");
  dl.href = doc.url;
  dl.setAttribute("download", doc.filename);

  document.getElementById("modalCopyLink").onclick = () => {
    triggerHapticPulse();
    navigator.clipboard.writeText(window.location.origin + "/" + doc.path);
    alert(APP_CONFIG.content.notifications.linkCopied);
  };

  stage.innerHTML = "";

  // 1. PDF
  if (doc.ext === "pdf") {
    stage.innerHTML = `<iframe src="${doc.url}#view=FitH" title="PDF Preview"></iframe>`;
  }
  // 2. Images & Vectors
  else if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(doc.ext)) {
    stage.innerHTML = `<img src="${doc.url}" alt="${escapeHTML(doc.title)}">`;
  }
  // 3. Audio Media
  else if (["mp3", "wav", "ogg", "m4a", "flac"].includes(doc.ext)) {
    stage.innerHTML = `
      <div class="audio-stage-card">
        <div class="audio-stage-glyph">♬</div>
        <h4 style="margin-bottom: var(--space-1);">${escapeHTML(doc.title)}</h4>
        <span class="paper-status-pill paper-status-pill--ochre">${escapeHTML(doc.category)}</span>
        <audio controls src="${doc.url}"></audio>
      </div>`;
  }
  // 4. Video Media
  else if (["mp4", "webm", "mov"].includes(doc.ext)) {
    stage.innerHTML = `<video controls autoplay playsinline src="${doc.url}"></video>`;
  }
  // 5. Office Documents via Office Live Viewer
  else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(doc.ext)) {
    if (APP_CONFIG.features.enableOfficeLiveViewer && doc.url.startsWith("http")) {
      stage.innerHTML = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(doc.url)}" title="Office Viewer"></iframe>`;
    } else {
      stage.innerHTML = `
        <div style="text-align: center; padding: var(--space-6);">
          <p style="color: var(--color-text-secondary); margin-bottom: var(--space-3);">Remote Office Web Viewer requires active public web hosting.</p>
          <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="btn-paper-primary interactive-tactile">Download File</a>
        </div>`;
    }
  }
  // 6. Source Code, Markdown & Plain Text
  else if (FORMAT_SPECS.code.includes(doc.ext) || ["csv", "tsv"].includes(doc.ext)) {
    fetch(doc.url)
      .then(res => res.text())
      .then(text => { stage.innerHTML = `<pre><code>${escapeHTML(text)}</code></pre>`; })
      .catch(() => { stage.innerHTML = `<p style="padding: var(--space-6); color: var(--color-text-secondary);">Unable to render text source preview.</p>`; });
  }
  // 7. Binary Fallback
  else {
    stage.innerHTML = `
      <div style="text-align: center; padding: var(--space-8);">
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">No direct inline preview engine available for <strong>.${escapeHTML(doc.ext)}</strong> documents.</p>
        <a href="${doc.url}" download="${escapeHTML(doc.filename)}" class="btn-paper-primary interactive-tactile">Download ${escapeHTML(doc.filename)}</a>
      </div>`;
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  stage.focus();
}

function closeInspector() {
  triggerHapticPulse();
  document.getElementById("readerModal").classList.add("hidden");
  document.getElementById("modalStage").innerHTML = "";
  document.body.style.overflow = "";
}

// ==============================================================
// 5. CONTROLS & EVENT BINDINGS
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
    triggerHapticPulse();
    searchInput.value = "";
    AppState.searchQuery = "";
    clearBtn.classList.add("hidden");
    applyCatalogFilters();
    searchInput.focus();
  });

  // Format Filter Chips
  document.getElementById("formatChips").addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    triggerHapticPulse();
    document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("filter-chip--active"));
    chip.classList.add("filter-chip--active");
    AppState.activeFormatChip = chip.dataset.format;
    applyCatalogFilters();
  });

  // Sort Selection
  document.getElementById("sortSelect").addEventListener("change", e => {
    triggerHapticPulse();
    AppState.activeSort = e.target.value;
    try {
      localStorage.setItem(APP_CONFIG.storageKeys.sortPreference, AppState.activeSort);
    } catch (_) {}
    applyCatalogFilters();
  });

  // Layout View Switcher
  const gridBtn = document.getElementById("viewGridBtn");
  const listBtn = document.getElementById("viewListBtn");
  const feedContainer = document.getElementById("documentGrid");

  const setViewMode = (mode) => {
    AppState.activeView = mode;
    try {
      localStorage.setItem(APP_CONFIG.storageKeys.viewPreference, mode);
    } catch (_) {}

    if (mode === "grid") {
      gridBtn.classList.add("seg-btn--active");
      gridBtn.setAttribute("aria-pressed", "true");
      listBtn.classList.remove("seg-btn--active");
      listBtn.setAttribute("aria-pressed", "false");
      feedContainer.className = "document-feed view-grid";
    } else {
      listBtn.classList.add("seg-btn--active");
      listBtn.setAttribute("aria-pressed", "true");
      gridBtn.classList.remove("seg-btn--active");
      gridBtn.setAttribute("aria-pressed", "false");
      feedContainer.className = "document-feed view-list";
    }
  };

  gridBtn.onclick = () => { triggerHapticPulse(); setViewMode("grid"); };
  listBtn.onclick = () => { triggerHapticPulse(); setViewMode("list"); };
  setViewMode(AppState.activeView);

  // Back Navigation Behavior
  document.getElementById("btnBackNav").addEventListener("click", () => {
    triggerHapticPulse();
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = APP_CONFIG.navigation.defaultFallbackRoute;
      AppState.activeCategory = "ALL";
      renderCategoryTrack();
      applyCatalogFilters();
    }
  });

  // Modal Dismissals
  document.getElementById("modalClose").onclick = closeInspector;
  document.getElementById("readerModal").onclick = (e) => {
    if (e.target.id === "readerModal") closeInspector();
  };
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") closeInspector();
  });

  document.getElementById("refreshBtn").onclick = () => {
    triggerHapticPulse();
    startAssetDiscovery();
  };

  const folderInput = document.getElementById("folderInput");
  if (folderInput) {
    folderInput.addEventListener("change", handleLocalFolderPicker);
  }
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