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
    version: "4.2.1",
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
      noDataDescription: "No catalog files were automatically detected inside <code>assets/</code>. If directory indexing is disabled on your server or you are opening this locally, click <strong>Mount Assets Folder</strong> below.",
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
      localPrompt: "Local Protocol Active: Click 'Mount Assets' to choose your assets folder.",
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
  inspectedHistory: [],
  isLocalMount: false
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
  const diagEl = document.getElementById("emptyDiagnostics");

  refreshBtn.classList.add("syncing");
  badge.textContent = APP_CONFIG.content.notifications.scanning;
  hideBanner();
  if (diagEl) diagEl.classList.add("hidden");

  let discovered = [];
  const diagnostics = [];

  // Local file:// protocol fallback
  if (window.location.protocol === "file:") {
    document.getElementById("localPickerBtn").classList.remove("hidden");
    showBanner(APP_CONFIG.content.notifications.localPrompt);
    refreshBtn.classList.remove("syncing");
    badge.textContent = "0 records available";
    emptyView.classList.remove("hidden");
    document.getElementById("emptyHeading").textContent = APP_CONFIG.content.emptyStates.noDataHeading;
    document.getElementById("emptyMsg").innerHTML = APP_CONFIG.content.emptyStates.noDataDescription;
    if (diagEl) {
      diagEl.textContent = "Protocol: file:// (browsers block automatic folder scanning on local file URLs). Use 'Mount Assets Folder' or serve this folder via a local server (e.g. python3 -m http.server).";
      diagEl.classList.remove("hidden");
    }
    return;
  }

  // Build candidate roots (handles subpath hosting without trailing slash too)
  const candidateRoots = [APP_CONFIG.paths.assetsRoot, "./Assets/"];
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  if (!window.location.pathname.endsWith("/") && pathParts.length > 0 && !pathParts[pathParts.length - 1].includes(".")) {
    candidateRoots.push(`${window.location.pathname}/assets/`);
  }
  candidateRoots.push("/assets/");

  const uniqueRoots = Array.from(new Set(candidateRoots));

  // Attempt 1: Server directory crawl
  for (const rootCandidate of uniqueRoots) {
    try {
      const attempt = await crawlServerDirectory(rootCandidate);
      diagnostics.push(`Directory scan (${rootCandidate}): ${attempt.note}`);
      if (attempt.files.length > 0) {
        discovered = attempt.files;
        break;
      }
    } catch (err) {
      diagnostics.push(`Directory scan (${rootCandidate}): error (${err.message})`);
      discovered = [];
    }
  }

  // Attempt 2: Manifest JSON fallback
  if (!discovered || discovered.length === 0) {
    const manifestCandidates = [APP_CONFIG.paths.manifestJson, "./assets/assets.json", "/assets.json"];
    for (const manifestUrl of Array.from(new Set(manifestCandidates))) {
      try {
        const res = await fetch(`${manifestUrl}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          discovered = normalizeManifestData(data);
          diagnostics.push(`Manifest (${manifestUrl}): ${discovered.length} file(s)`);
          if (discovered.length > 0) break;
        } else {
          diagnostics.push(`Manifest (${manifestUrl}): HTTP ${res.status}`);
        }
      } catch (_) {
        diagnostics.push(`Manifest (${manifestUrl}): unavailable`);
      }
    }
  }

  // Attempt 3: GitHub Pages API Crawl
  if (!discovered || discovered.length === 0) {
    const ghAttempt = await crawlGitHubRepo();
    diagnostics.push(`GitHub API: ${ghAttempt.note}`);
    discovered = ghAttempt.files;
  }

  // Hydration evaluation
  if (discovered && discovered.length > 0) {
    AppState.isLocalMount = false;
    document.getElementById("exportManifestBtn").classList.add("hidden");
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
    if (diagEl) {
      diagEl.innerHTML = `<strong>Discovery Diagnostics:</strong><br>${diagnostics.map(d => escapeHTML(d)).join("<br>")}<br><br>Tip: If your server has directory listing turned off, mount your folder locally and click <strong>Export assets.json</strong>, then place <code>assets.json</code> next to <code>index.html</code>.`;
      diagEl.classList.remove("hidden");
    }
  }

  refreshBtn.classList.remove("syncing");
}

function encodePathSegments(path) {
  return path
    .split("/")
    .map(seg => encodeURIComponent(seg))
    .join("/");
}

function normalizeManifestData(data) {
  if (Array.isArray(data)) {
    return data.map(entry => {
      if (typeof entry === "string") {
        const clean = entry.replace(/^\/+/, "");
        const parts = clean.split("/").filter(Boolean);
        if (parts.length >= 3 && parts[0].toLowerCase() === "assets") {
          return {
            category: parts[1],
            filename: parts.slice(2).join("/"),
            path: clean,
            url: `./${encodePathSegments(clean)}`,
            size: 0
          };
        }
        return null;
      }
      return entry;
    }).filter(Boolean);
  }
  if (data && Array.isArray(data.files)) return normalizeManifestData(data.files);
  if (data && typeof data === "object") {
    const results = [];
    for (const [category, files] of Object.entries(data)) {
      if (!Array.isArray(files)) continue;
      for (const entry of files) {
        const filename = typeof entry === "string" ? entry : entry.filename;
        if (!filename) continue;
        const path = `assets/${category}/${filename}`;
        results.push({
          category,
          filename,
          path,
          url: entry.url || `./${encodePathSegments(path)}`,
          size: entry.size || 0
        });
      }
    }
    return results;
  }
  return [];
}

function isDirectoryLink(anchor, resolvedUrl) {
  if (resolvedUrl.pathname.endsWith("/")) return true;
  const label = (anchor.textContent || "").trim();
  if (label.endsWith("/")) return true;

  const dirPattern = /\b(dir|directory|folder|icon-directory|icon-folder)\b/i;
  if (dirPattern.test(anchor.className || "")) return true;

  const container = anchor.closest("li, tr, div");
  if (container && dirPattern.test(container.className || "")) return true;

  const childIcon = anchor.querySelector("[class]");
  if (childIcon && dirPattern.test(childIcon.className || "")) return true;

  const dataType = (anchor.getAttribute("data-type") || "").toLowerCase();
  if (dataType === "directory" || dataType === "folder") return true;

  return false;
}

function looksExtensionlessSegment(pathname) {
  const clean = pathname.replace(/\/+$/, "");
  const lastSeg = clean.split("/").pop() || "";
  return lastSeg.length > 0 && !lastSeg.includes(".");
}

function isIgnoredAssetName(name) {
  const lower = name.toLowerCase();
  return (
    !name ||
    name.startsWith(".") ||
    lower === ".gitkeep" ||
    lower === ".ds_store" ||
    lower === "thumbs.db" ||
    lower === "desktop.ini"
  );
}

async function fetchDirectoryListing(dirUrl) {
  const res = await fetch(dirUrl);
  if (!res.ok) {
    return { doc: null, finalUrl: dirUrl, reason: `HTTP ${res.status}` };
  }
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
    return { doc: null, finalUrl: res.url || dirUrl, reason: `non-HTML (${contentType})` };
  }
  const html = await res.text();
  // Prevent SPA fallback index.html from being treated as a directory listing
  if (html.includes('id="documentGrid"') || html.includes('class="app-page-header"')) {
    return { doc: null, finalUrl: res.url || dirUrl, reason: "returned SPA index.html (directory listing disabled)" };
  }
  return {
    doc: new DOMParser().parseFromString(html, "text/html"),
    finalUrl: res.url || dirUrl,
    reason: "200 OK"
  };
}

function ensureTrailingSlash(pathname) {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

async function crawlServerDirectory(rootUrl) {
  const normalizedRoot = rootUrl.endsWith("/") ? rootUrl : `${rootUrl}/`;
  const baseAssetsUrl = new URL(normalizedRoot, window.location.href);

  const rootRes = await fetchDirectoryListing(baseAssetsUrl.href);
  if (!rootRes.doc) {
    return { files: [], note: rootRes.reason };
  }

  const resolvedBaseUrl = new URL(ensureTrailingSlash(new URL(rootRes.finalUrl).pathname), baseAssetsUrl.origin);
  const categoryFolders = new Map();
  const candidateFolders = new Map();
  const links = Array.from(rootRes.doc.querySelectorAll("a[href]"));

  for (const a of links) {
    const rawHref = (a.getAttribute("href") || "").trim();
    if (!rawHref || rawHref.startsWith("?") || rawHref.startsWith("#") || rawHref.startsWith("javascript:")) {
      continue;
    }

    let resolved;
    try {
      resolved = new URL(rawHref, rootRes.finalUrl);
    } catch (_) {
      continue;
    }

    if (resolved.origin !== resolvedBaseUrl.origin || resolved.search) continue;

    const basePrefix = ensureTrailingSlash(resolvedBaseUrl.pathname);
    if (!resolved.pathname.startsWith(basePrefix) || ensureTrailingSlash(resolved.pathname) === basePrefix) {
      continue;
    }

    const relSegments = resolved.pathname
      .slice(basePrefix.length)
      .replace(/\/+$/, "")
      .split("/")
      .filter(Boolean);

    if (relSegments.length === 0) continue;
    const catName = decodeURIComponent(relSegments[0]);
    if (isIgnoredAssetName(catName)) continue;

    const dirHref = resolved.href.endsWith("/") ? resolved.href : `${resolved.href}/`;
    if (isDirectoryLink(a, resolved)) {
      if (!categoryFolders.has(dirHref)) {
        categoryFolders.set(dirHref, { catName, fallbackNoSlashUrl: resolved.href });
      }
    } else if (looksExtensionlessSegment(resolved.pathname)) {
      if (!candidateFolders.has(dirHref)) {
        candidateFolders.set(dirHref, { catName, fallbackNoSlashUrl: resolved.href });
      }
    }
  }

  for (const [href, info] of candidateFolders.entries()) {
    if (!categoryFolders.has(href)) {
      categoryFolders.set(href, info);
    }
  }

  if (categoryFolders.size === 0) {
    return { files: [], note: "HTML fetched, but 0 category folders found inside assets/" };
  }

  const results = [];
  const visitedDirs = new Set();

  async function crawlCategorySubtree(currentDirUrl, rootCatUrl, catName, fallbackNoSlashUrl = null) {
    if (visitedDirs.has(currentDirUrl.href)) return;
    visitedDirs.add(currentDirUrl.href);

    let dirRes = await fetchDirectoryListing(currentDirUrl.href);
    if (!dirRes.doc && fallbackNoSlashUrl && fallbackNoSlashUrl !== currentDirUrl.href) {
      dirRes = await fetchDirectoryListing(fallbackNoSlashUrl);
    }
    if (!dirRes.doc) return;

    const currentPrefix = ensureTrailingSlash(currentDirUrl.pathname);
    const rootCatPrefix = ensureTrailingSlash(rootCatUrl.pathname);
    const fileLinks = Array.from(dirRes.doc.querySelectorAll("a[href]"));

    for (const fa of fileLinks) {
      const fHref = (fa.getAttribute("href") || "").trim();
      if (!fHref || fHref.startsWith("?") || fHref.startsWith("#") || fHref.startsWith("javascript:")) {
        continue;
      }

      let resolved;
      try {
        resolved = new URL(fHref, dirRes.finalUrl);
      } catch (_) {
        continue;
      }

      if (resolved.origin !== currentDirUrl.origin || resolved.search) continue;
      if (!resolved.pathname.startsWith(currentPrefix) || ensureTrailingSlash(resolved.pathname) === currentPrefix) {
        continue;
      }

      if (isDirectoryLink(fa, resolved)) {
        const subDirUrl = new URL(resolved.href.endsWith("/") ? resolved.href : `${resolved.href}/`);
        await crawlCategorySubtree(subDirUrl, rootCatUrl, catName, resolved.href);
      } else {
        const relEncoded = resolved.pathname.slice(rootCatPrefix.length);
        const relParts = relEncoded.split("/").filter(Boolean).map(decodeURIComponent);
        if (relParts.length === 0) continue;

        const baseFileName = relParts[relParts.length - 1];
        if (isIgnoredAssetName(baseFileName)) continue;

        const filename = relParts.join("/");
        results.push({
          category: catName,
          filename: filename,
          path: `assets/${catName}/${filename}`,
          url: resolved.href,
          size: 0
        });
      }
    }
  }

  for (const [catHref, info] of categoryFolders.entries()) {
    try {
      const catUrl = new URL(catHref);
      await crawlCategorySubtree(catUrl, catUrl, info.catName, info.fallbackNoSlashUrl);
    } catch (_) {}
  }

  return {
    files: results,
    note: `${results.length} file(s) across ${categoryFolders.size} folder(s)`
  };
}

async function crawlGitHubRepo() {
  const host = window.location.hostname;
  if (!host.endsWith(".github.io")) {
    return { files: [], note: "not hosted on *.github.io" };
  }

  const owner = host.split(".")[0];
  const segments = window.location.pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  const candidateRepos = segments.length > 0 ? [segments[0], `${owner}.github.io`] : [`${owner}.github.io`];

  for (const repo of Array.from(new Set(candidateRepos))) {
    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoRes.ok) continue;
      const info = await repoRes.json();
      const branch = info.default_branch || "main";

      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
      if (!treeRes.ok) continue;
      const treeData = await treeRes.json();

      let repoSubdir = "";
      if (repo === segments[0] && segments.length > 1) {
        const last = segments[segments.length - 1];
        const dirSegs = last.includes(".") ? segments.slice(1, -1) : segments.slice(1);
        repoSubdir = dirSegs.join("/");
      } else if (repo === `${owner}.github.io` && segments.length > 0) {
        const last = segments[segments.length - 1];
        const dirSegs = last.includes(".") ? segments.slice(0, -1) : segments;
        repoSubdir = dirSegs.join("/");
      }
      const expectedPrefix = repoSubdir ? `${repoSubdir}/assets/` : "assets/";

      const results = [];
      (treeData.tree || []).forEach(node => {
        if (node.type !== "blob") return;
        const p = node.path.replace(/\\/g, "/");
        if (!p.toLowerCase().startsWith(expectedPrefix.toLowerCase())) return;

        const relAfterAssets = p.slice(expectedPrefix.length);
        const parts = relAfterAssets.split("/").filter(Boolean);
        if (parts.length < 2) return;

        const cat = parts[0];
        const filename = parts.slice(1).join("/");
        const baseName = parts[parts.length - 1];

        if (isIgnoredAssetName(cat) || isIgnoredAssetName(baseName)) return;

        results.push({
          category: cat,
          filename: filename,
          path: `assets/${cat}/${filename}`,
          size: node.size || 0,
          url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodePathSegments(p)}`
        });
      });

      if (results.length > 0) {
        return { files: results, note: `${results.length} file(s) from ${owner}/${repo}` };
      }
    } catch (_) {}
  }

  return { files: [], note: "0 matching files in repository tree" };
}

function handleLocalFolderPicker(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const results = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.webkitRelativePath.replace(/\\/g, "/");
    const parts = path.split("/").filter(Boolean);

    const assetsIndex = parts.findIndex(part => part.toLowerCase() === "assets" || part.toLowerCase() === "asset");
    let category = "";
    let filename = "";

    if (assetsIndex !== -1 && parts.length >= assetsIndex + 3) {
      category = parts[assetsIndex + 1];
      filename = parts.slice(assetsIndex + 2).join("/");
    } else if (assetsIndex === -1 && parts.length >= 3) {
      category = parts[1];
      filename = parts.slice(2).join("/");
    }

    if (category && filename) {
      const baseName = filename.split("/").pop();
      if (!isIgnoredAssetName(category) && !isIgnoredAssetName(baseName)) {
        results.push({
          category: category,
          filename: filename,
          path: `assets/${category}/${filename}`,
          size: file.size,
          url: URL.createObjectURL(file)
        });
      }
    }
  }

  if (results.length > 0) {
    AppState.isLocalMount = true;
    document.getElementById("exportManifestBtn").classList.remove("hidden");
    document.getElementById("localPickerBtn").classList.remove("hidden");
    hydrateDocuments(results);
    renderCategoryTrack();
    applyCatalogFilters();
    document.getElementById("emptyView").classList.add("hidden");
    hideBanner();
    triggerHapticPulse();
  } else {
    alert("Please select your 'assets' folder (or parent folder containing 'assets/') with category subfolders and files inside.");
  }
}

function exportManifestJson() {
  if (!AppState.documents.length) return;
  const manifest = {};
  for (const doc of AppState.documents) {
    if (!manifest[doc.category]) manifest[doc.category] = [];
    manifest[doc.category].push({
      filename: doc.filename,
      size: doc.size || 0
    });
  }
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "assets.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ==============================================================
// 2. DATA HYDRATION & FILTERING
// ==============================================================
function hydrateDocuments(rawList) {
  AppState.categories.clear();
  AppState.documents = rawList.map(item => {
    AppState.categories.add(item.category);
    const baseName = item.filename.split("/").pop() || item.filename;
    const dotIdx = baseName.lastIndexOf(".");
    const ext = dotIdx > 0 ? baseName.slice(dotIdx + 1).toLowerCase() : "";
    const cleanTitle = dotIdx > 0 ? baseName.slice(0, dotIdx) : baseName;

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
    const downloadName = doc.filename.split("/").pop() || doc.filename;

    card.innerHTML = `
      <div class="paper-card__top">
        <div class="paper-card__glyph">${escapeHTML((doc.ext || "FILE").toUpperCase())}</div>
        <div class="paper-card__meta-group">
          <span class="paper-card__category">${escapeHTML(doc.category)}</span>
          <h3 class="paper-card__title">${escapeHTML(doc.title)}</h3>
        </div>
      </div>
      <div class="paper-card__footer">
        <span class="paper-card__size">${formatBytes(doc.size)}</span>
        <div class="paper-card__actions">
          <button type="button" class="btn-paper-secondary interactive-tactile inspect-btn">${escapeHTML(APP_CONFIG.content.actions.inspect)}</button>
          <a href="${doc.url}" download="${escapeHTML(downloadName)}" class="btn-paper-primary interactive-tactile">${escapeHTML(APP_CONFIG.content.actions.download)}</a>
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
  const downloadName = doc.filename.split("/").pop() || doc.filename;

  if (!AppState.inspectedHistory.includes(doc.path)) {
    AppState.inspectedHistory.unshift(doc.path);
  }

  document.getElementById("modalCategory").textContent = doc.category;
  document.getElementById("modalExtBadge").textContent = (doc.ext || "FILE").toUpperCase();
  document.getElementById("modalTitle").textContent = downloadName;
  document.getElementById("modalMetaSize").textContent = `Size: ${formatBytes(doc.size)}`;
  document.getElementById("modalMetaPath").textContent = doc.path;

  const dl = document.getElementById("modalDownload");
  dl.href = doc.url;
  dl.setAttribute("download", downloadName);

  document.getElementById("modalCopyLink").onclick = () => {
    triggerHapticPulse();
    const copyTarget = doc.url.startsWith("blob:")
      ? doc.path
      : new URL(doc.url, window.location.href).href;
    navigator.clipboard.writeText(copyTarget);
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
          <a href="${doc.url}" download="${escapeHTML(downloadName)}" class="btn-paper-primary interactive-tactile">Download File</a>
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
        <p style="color: var(--color-text-secondary); margin-bottom: var(--space-4);">No direct inline preview engine available for <strong>.${escapeHTML(doc.ext || "unknown")}</strong> documents.</p>
        <a href="${doc.url}" download="${escapeHTML(downloadName)}" class="btn-paper-primary interactive-tactile">Download ${escapeHTML(downloadName)}</a>
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

  const emptyRescanBtn = document.getElementById("emptyRescanBtn");
  if (emptyRescanBtn) {
    emptyRescanBtn.onclick = () => {
      triggerHapticPulse();
      startAssetDiscovery();
    };
  }

  const exportManifestBtn = document.getElementById("exportManifestBtn");
  if (exportManifestBtn) {
    exportManifestBtn.onclick = () => {
      triggerHapticPulse();
      exportManifestJson();
    };
  }

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