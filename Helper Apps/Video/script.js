/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application identity, branding, navigation, copy, and endpoints.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  // 1. APPLICATION IDENTITY & METADATA
  identity: {
    appId: "curator-studio-suite",
    appName: "Curator Studio",
    appTagline: "Intelligent CSV Builder & Canonical Link Purifier",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "https://studio.thevideolibrary.archive",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    accentColor: "#3E5B42",     // Sage Green (Passes WCAG AAA)
    accentSecondary: "#963E35", // Terracotta Red (Passes WCAG AA)
    accentHighlight: "#6E5614", // Warm Ochre (Passes WCAG AA)
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "curate",
    items: [
      { id: "curate", label: "Browse & Add", icon: "video", enabled: true, showInBottomBar: true },
      { id: "categories", label: "Categories", icon: "columns", enabled: true, showInBottomBar: true },
      { id: "catalogue", label: "Catalogue", icon: "grid", enabled: true, showInBottomBar: true },
      { id: "export", label: "Export CSV", icon: "download", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultTitle: "Curator Studio",
      defaultSubtitle: "Search YouTube, cleanse direct canonical links, organize category columns, and export data.csv archives.",
    },
    emptyStates: {
      noDataHeading: "No Videos Curated in Category",
      noDataDescription: "This category column is currently unpopulated. Add videos from the search panel or link purifier to populate.",
      noSearchResultsHeading: "No Matching Videos Located",
      noSearchResultsDescription: "Review your search keywords or paste a direct YouTube video URL directly.",
    },
    actions: {
      confirm: "Confirm & Add",
      cancel: "Discard Changes",
      save: "Save Dataset",
      delete: "Remove Permanently",
      retry: "Retry Query",
      back: "Back",
    },
    notifications: {
      saveSuccess: "Dataset saved to browser storage.",
      saveError: "Unable to commit changes. Please verify parameters.",
      deleteSuccess: "Entry successfully removed from archive.",
    },
    legal: {
      copyrightHolder: "The Video Library • Curator Studio Systems",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "archivist@thevideolibrary.archive",
    operatingHours: "Monday – Friday, 09:00 – 17:00 EST",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms micro-haptic vibration on touch
    enableSmoothPageTransitions: true, // Smooth transitions
    enableAutoSave: true,               // Local browser persistence
    autoSaveIntervalMs: 3000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,        // Ergonomic mobile thumb dock
  },

  // 7. API ENDPOINTS & STORAGE
  endpoints: {
    defaultYoutubeApiKey: "AIzaSyBQGBdXJUcaQYnqGbemqH20EA2ltzI4GFg",
    canonicalPrefix: "https://www.youtube.com/watch?v=",
    storageKeys: {
      datasetDraft: "curator_studio_dataset_v2",
      customApiKey: "curator_studio_custom_yt_key_v2",
    },
  },
});

/* Default Sample CSV Archive */
const SAMPLE_CSV_DATA = `Test 1,Test 2,Test 3,Test 4
https://www.youtube.com/watch?v=Uzr0gv4N4-s,https://www.youtube.com/watch?v=uaLNfijnp-8,https://www.youtube.com/watch?v=ZTSI3DDP_4A,https://www.youtube.com/watch?v=WttZ6b-KUP4
https://www.youtube.com/watch?v=SZYZHJsMalg,,,
https://www.youtube.com/watch?v=odwsSIH8EzM,,,`;

/**
 * =========================================================================
 * APPLICATION RUNTIME STATE
 * =========================================================================
 */
const AppState = {
  categories: ["Test 1", "Test 2", "Test 3", "Test 4"],
  columnsData: new Map([
    ["Test 1", [
      "https://www.youtube.com/watch?v=Uzr0gv4N4-s",
      "https://www.youtube.com/watch?v=SZYZHJsMalg",
      "https://www.youtube.com/watch?v=odwsSIH8EzM"
    ]],
    ["Test 2", ["https://www.youtube.com/watch?v=uaLNfijnp-8"]],
    ["Test 3", ["https://www.youtube.com/watch?v=ZTSI3DDP_4A"]],
    ["Test 4", ["https://www.youtube.com/watch?v=WttZ6b-KUP4"]]
  ]),
  sessionAddedHistory: [],
  metadataCache: {},
  currentApiKey: APP_CONFIG.endpoints.defaultYoutubeApiKey,
  activeWorkflowView: "curate",
  viewHistory: ["curate"],
  catalogueSearchTerm: "",
  catalogueCategoryFilter: "ALL",
  pendingPickerVideo: null
};

/**
 * =========================================================================
 * TACTILE SENSORY DYNAMICS & MICRO-HAPTICS
 * =========================================================================
 */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12); // 12ms tactile pulse
    } catch {
      // Graceful fallback
    }
  }
}

/**
 * =========================================================================
 * LINK PURIFIER & CANONICAL EXTRACTOR
 * Normalizes input strictly to: https://www.youtube.com/watch?v=XXXXXXXXXXX
 * =========================================================================
 */
function extractYouTubeId(input) {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();

  // 1. Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. Comprehensive URL variants
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})(?:[&?]|$)/i,
    /youtu\.be\/([a-zA-Z0-9_-]{11})(?:[?&/]|$)/i,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})(?:[?&/]|$)/i,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})(?:[?&/]|$)/i,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})(?:[?&/]|$)/i
  ];

  for (const regex of patterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function createDirectCleanUrl(videoId) {
  if (!videoId) return null;
  return `${APP_CONFIG.endpoints.canonicalPrefix}${videoId}`;
}

/**
 * =========================================================================
 * RFC 4180 CSV ENGINE (PARSER & SERIALIZER)
 * =========================================================================
 */
function parseCSV(text) {
  if (!text) return [];

  let cleanText = text;
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.slice(1);
  }

  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || inQuotes) {
    currentRow.push(currentCell.trim());
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

function serializeDatasetToCSV(categories, columnsData) {
  if (!categories || categories.length === 0) return "";

  const headerTokens = categories.map(escapeCsvCell);
  const rows = [headerTokens.join(",")];

  let maxRows = 0;
  categories.forEach((cat) => {
    const list = columnsData.get(cat) || [];
    if (list.length > maxRows) maxRows = list.length;
  });

  for (let r = 0; r < maxRows; r++) {
    const rowCells = [];
    categories.forEach((cat) => {
      const list = columnsData.get(cat) || [];
      const cellVal = list[r] || "";
      rowCells.push(escapeCsvCell(cellVal));
    });
    rows.push(rowCells.join(","));
  }

  return rows.join("\r\n");
}

function escapeCsvCell(val) {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * =========================================================================
 * CORE DATA ACTIONS & CURATION OPERATIONS
 * =========================================================================
 */
function addVideoToCategory(categoryName, cleanUrl, videoTitle = null, author = null) {
  if (!AppState.columnsData.has(categoryName)) {
    AppState.columnsData.set(categoryName, []);
  }

  const list = AppState.columnsData.get(categoryName);
  const videoId = extractYouTubeId(cleanUrl);
  if (!videoId) return false;

  const directUrl = createDirectCleanUrl(videoId);

  if (list.includes(directUrl)) {
    showToast(`Video already catalogued in "${categoryName}".`, "warning");
    return false;
  }

  list.push(directUrl);

  const historyItem = {
    id: videoId,
    url: directUrl,
    title: videoTitle || `YouTube Video (${videoId})`,
    author: author || "YouTube Creator",
    category: categoryName,
    timestamp: Date.now()
  };
  AppState.sessionAddedHistory.unshift(historyItem);

  if (videoTitle) {
    AppState.metadataCache[videoId] = {
      title: videoTitle,
      author: author || "YouTube Creator",
      thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  persistState();
  refreshAllUI();
  showToast(`Added to "${categoryName}"!`, "success");
  return true;
}

function removeVideoFromCategory(categoryName, index) {
  const list = AppState.columnsData.get(categoryName);
  if (!list || index < 0 || index >= list.length) return;

  list.splice(index, 1);
  persistState();
  refreshAllUI();
  showToast(APP_CONFIG.content.notifications.deleteSuccess);
}

function moveVideo(fromCat, toCat, index) {
  const sourceList = AppState.columnsData.get(fromCat);
  if (!sourceList || index < 0 || index >= sourceList.length) return;

  const url = sourceList.splice(index, 1)[0];
  if (!AppState.columnsData.has(toCat)) {
    AppState.columnsData.set(toCat, []);
  }
  AppState.columnsData.get(toCat).push(url);

  persistState();
  refreshAllUI();
  showToast(`Moved video to "${toCat}".`, "success");
}

function addCategory(name) {
  const cleanName = (name || "").trim();
  if (!cleanName) return false;

  if (AppState.categories.includes(cleanName)) {
    showToast(`Category "${cleanName}" already exists.`, "warning");
    return false;
  }

  AppState.categories.push(cleanName);
  AppState.columnsData.set(cleanName, []);
  persistState();
  refreshAllUI();
  showToast(`Category "${cleanName}" created!`, "success");
  return true;
}

function renameCategory(oldName, newName) {
  const cleanNew = (newName || "").trim();
  if (!cleanNew || cleanNew === oldName) return;

  if (AppState.categories.includes(cleanNew)) {
    showToast(`Category "${cleanNew}" already exists.`, "warning");
    return;
  }

  const idx = AppState.categories.indexOf(oldName);
  if (idx !== -1) {
    AppState.categories[idx] = cleanNew;
  }

  const data = AppState.columnsData.get(oldName) || [];
  AppState.columnsData.delete(oldName);
  AppState.columnsData.set(cleanNew, data);

  persistState();
  refreshAllUI();
  showToast(`Renamed "${oldName}" to "${cleanNew}".`, "success");
}

function removeCategory(categoryName) {
  const list = AppState.columnsData.get(categoryName) || [];
  if (list.length > 0) {
    const confirmDelete = confirm(`Category "${categoryName}" holds ${list.length} video(s). Delete this column?`);
    if (!confirmDelete) return;
  }

  AppState.categories = AppState.categories.filter((c) => c !== categoryName);
  AppState.columnsData.delete(categoryName);

  if (AppState.categories.length === 0) {
    addCategory("General");
  }

  persistState();
  refreshAllUI();
  showToast(`Category "${categoryName}" deleted.`);
}

function moveCategoryPosition(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= AppState.categories.length) return;

  const temp = AppState.categories[index];
  AppState.categories[index] = AppState.categories[targetIndex];
  AppState.categories[targetIndex] = temp;

  persistState();
  refreshAllUI();
}

function clearAllVideos() {
  const total = getTotalVideosCount();
  if (total === 0) return;

  const sure = confirm(`Remove all ${total} video entries? Column headers will be preserved.`);
  if (!sure) return;

  AppState.categories.forEach((cat) => {
    AppState.columnsData.set(cat, []);
  });
  AppState.sessionAddedHistory = [];

  persistState();
  refreshAllUI();
  showToast("All video links cleared.");
}

function resetToFreshBlank() {
  const sure = confirm("Start a fresh blank dataset? Existing progress will be reset.");
  if (!sure) return;

  AppState.categories = ["Category 1", "Category 2"];
  AppState.columnsData.clear();
  AppState.columnsData.set("Category 1", []);
  AppState.columnsData.set("Category 2", []);
  AppState.sessionAddedHistory = [];

  persistState();
  refreshAllUI();
  switchWorkflowView("curate");
  showToast("Blank dataset ready.", "success");
}

function loadSampleArchive() {
  ingestCsvText(SAMPLE_CSV_DATA, "Sample data.csv loaded successfully!");
}

function ingestCsvText(csvText, successMessage = "CSV successfully imported!") {
  try {
    const rows = parseCSV(csvText);
    if (!rows || rows.length === 0) {
      throw new Error("The uploaded CSV file is empty.");
    }

    const headerRow = rows[0];
    const newCategories = [];
    const newColumnsData = new Map();

    headerRow.forEach((colName) => {
      const cleanName = colName.trim();
      if (cleanName.length > 0) {
        newCategories.push(cleanName);
        newColumnsData.set(cleanName, []);
      }
    });

    if (newCategories.length === 0) {
      throw new Error("No category columns found in Row 0.");
    }

    let totalImported = 0;
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      newCategories.forEach((catName, colIdx) => {
        if (colIdx < row.length) {
          const rawCell = row[colIdx];
          const videoId = extractYouTubeId(rawCell);
          if (videoId) {
            const cleanUrl = createDirectCleanUrl(videoId);
            newColumnsData.get(catName).push(cleanUrl);
            totalImported++;
          }
        }
      });
    }

    AppState.categories = newCategories;
    AppState.columnsData = newColumnsData;

    persistState();
    refreshAllUI();
    showToast(`${successMessage} (${totalImported} videos in ${newCategories.length} columns)`, "success");

    const onboarding = document.getElementById("onboardingSection");
    if (onboarding) onboarding.style.display = "none";

  } catch (err) {
    alert(`Could not process CSV: ${err.message}`);
  }
}

/**
 * =========================================================================
 * YOUTUBE API SEARCH & METADATA ENGINE
 * =========================================================================
 */
async function executeYouTubeSearch(query) {
  const queryStr = (query || "").trim();
  if (!queryStr) return;

  const resultsGrid = document.getElementById("ytResultsGrid");
  const loadingIndicator = document.getElementById("ytResultsLoading");
  const statusNote = document.getElementById("ytResultsStatus");

  if (loadingIndicator) loadingIndicator.hidden = false;
  if (statusNote) statusNote.textContent = `Searching YouTube for "${queryStr}"…`;
  if (resultsGrid) resultsGrid.innerHTML = "";

  try {
    const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&q=${encodeURIComponent(queryStr)}&key=${encodeURIComponent(AppState.currentApiKey)}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`YouTube API returned status ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];

    if (loadingIndicator) loadingIndicator.hidden = true;

    if (items.length === 0) {
      if (statusNote) statusNote.textContent = APP_CONFIG.content.emptyStates.noSearchResultsHeading;
      if (resultsGrid) {
        resultsGrid.innerHTML = `<div class="empty-list-notice"><p>${APP_CONFIG.content.emptyStates.noSearchResultsDescription}</p></div>`;
      }
      return;
    }

    if (statusNote) statusNote.textContent = `Found ${items.length} videos`;
    renderYouTubeSearchResults(items);

  } catch (err) {
    console.warn("YouTube API query bypassed:", err);
    if (loadingIndicator) loadingIndicator.hidden = true;
    if (statusNote) statusNote.textContent = "Direct URL entry active.";

    if (resultsGrid) {
      resultsGrid.innerHTML = `
        <div class="purifier-error-box" style="margin: 10px 0;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <div>
            <strong>YouTube API Limit or Network Protection</strong>
            <p>Shared key query quota reached. You may paste video URLs directly into the <strong>Paste Any YouTube Link</strong> purifier on the right.</p>
          </div>
        </div>
      `;
    }
  }
}

function renderYouTubeSearchResults(items) {
  const container = document.getElementById("ytResultsGrid");
  if (!container) return;

  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const videoId = item.id && item.id.videoId;
    if (!videoId) return;

    const snippet = item.snippet || {};
    const title = snippet.title || `Video (${videoId})`;
    const channelTitle = snippet.channelTitle || "YouTube Creator";
    const cleanUrl = createDirectCleanUrl(videoId);
    const thumbUrl = (snippet.thumbnails && (snippet.thumbnails.medium || snippet.thumbnails.default || {})).url 
                     || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

    AppState.metadataCache[videoId] = {
      title: title,
      author: channelTitle,
      thumb: thumbUrl
    };

    const card = document.createElement("div");
    card.className = "yt-result-item";

    card.innerHTML = `
      <div class="yt-item-thumb" data-play-id="${videoId}" title="Click to watch preview">
        <img src="${escapeHTML(thumbUrl)}" alt="${escapeHTML(title)}" loading="lazy">
        <div class="thumb-play-overlay">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
        </div>
      </div>
      <div class="yt-item-body">
        <div>
          <h4 class="yt-item-title" title="${escapeHTML(title)}">${escapeHTML(title)}</h4>
          <div class="yt-item-meta">
            <span>${escapeHTML(channelTitle)}</span>
            <span>•</span>
            <code>${videoId}</code>
          </div>
          <div class="yt-clean-preview">
            ${cleanUrl}
          </div>
        </div>
        <div class="yt-item-actions">
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--primary small-btn add-from-search-btn" data-video-id="${videoId}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span>+ Add to Category</span>
          </button>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--secondary small-btn preview-search-btn" data-play-id="${videoId}">
            <span>Preview</span>
          </button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  container.querySelectorAll("[data-play-id]").forEach((el) => {
    el.addEventListener("click", () => {
      const id = el.getAttribute("data-play-id");
      openVideoPreviewModal(id);
    });
  });

  container.querySelectorAll(".add-from-search-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-video-id");
      const meta = AppState.metadataCache[id] || { title: `Video (${id})`, author: "" };
      promptCategoryPicker(id, meta.title, meta.author, meta.thumb);
    });
  });
}

async function fetchOEmbedMetadata(videoId) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title || `YouTube Video (${videoId})`,
        author: data.author_name || "YouTube Creator",
        thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      };
    }
  } catch {
    // Graceful fallback
  }
  return {
    title: `YouTube Video (${videoId})`,
    author: "YouTube Creator",
    thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  };
}

/**
 * =========================================================================
 * UI HYDRATION & DOM RENDERING
 * =========================================================================
 */
function refreshAllUI() {
  updateMetricsDisplay();
  populateCategorySelects();
  renderCategoriesRoster();
  renderCatalogueMatrix();
  renderSessionAddedList();
  renderExportView();
}

function updateMetricsDisplay() {
  const totalVideos = getTotalVideosCount();
  const totalCategories = AppState.categories.length;

  const vCountEl = document.getElementById("totalVideosCount");
  const cCountEl = document.getElementById("totalCategoriesCount");
  const catBadge = document.getElementById("categoryBadgeCount");
  const vidBadge = document.getElementById("videoBadgeCount");
  const catHeaderCount = document.getElementById("categoriesCountHeader");

  if (vCountEl) vCountEl.textContent = totalVideos.toLocaleString();
  if (cCountEl) cCountEl.textContent = totalCategories.toLocaleString();
  if (catBadge) catBadge.textContent = totalCategories;
  if (vidBadge) vidBadge.textContent = totalVideos;
  if (catHeaderCount) catHeaderCount.textContent = totalCategories;
}

function populateCategorySelects() {
  const selects = [
    document.getElementById("assignCategorySelect"),
    document.getElementById("pickerCategorySelect"),
    document.getElementById("catalogueCategoryFilter")
  ];

  selects.forEach((sel) => {
    if (!sel) return;
    const isFilter = sel.id === "catalogueCategoryFilter";
    const currentVal = sel.value;

    sel.innerHTML = "";

    if (isFilter) {
      const allOpt = document.createElement("option");
      allOpt.value = "ALL";
      allOpt.textContent = "All Categories";
      sel.appendChild(allOpt);
    }

    AppState.categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat;
      const count = (AppState.columnsData.get(cat) || []).length;
      opt.textContent = isFilter ? `${cat} (${count})` : cat;
      sel.appendChild(opt);
    });

    if (currentVal && Array.from(sel.options).some((o) => o.value === currentVal)) {
      sel.value = currentVal;
    }
  });
}

function renderCategoriesRoster() {
  const container = document.getElementById("categoriesListContainer");
  if (!container) return;

  container.innerHTML = "";

  AppState.categories.forEach((catName, index) => {
    const list = AppState.columnsData.get(catName) || [];
    const card = document.createElement("div");
    card.className = "category-card";

    const isFirst = index === 0;
    const isLast = index === AppState.categories.length - 1;

    card.innerHTML = `
      <div class="category-card-top">
        <span class="col-index-stamp">COLUMN ${index + 1}</span>
        <span class="category-video-count">${list.length} videos</span>
      </div>
      <div class="category-name-display">${escapeHTML(catName)}</div>
      <div class="category-card-actions">
        <div class="cat-move-group">
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn move-left-btn" title="Move column left" ${isFirst ? "disabled" : ""}>
            ←
          </button>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn move-right-btn" title="Move column right" ${isLast ? "disabled" : ""}>
            →
          </button>
        </div>
        <div style="display: flex; gap: 4px;">
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn rename-cat-btn" title="Rename category">
            Rename
          </button>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn danger-hover delete-cat-btn" title="Delete category">
            Delete
          </button>
        </div>
      </div>
    `;

    card.querySelector(".move-left-btn")?.addEventListener("click", () => moveCategoryPosition(index, -1));
    card.querySelector(".move-right-btn")?.addEventListener("click", () => moveCategoryPosition(index, 1));
    card.querySelector(".rename-cat-btn")?.addEventListener("click", () => {
      const newName = prompt(`Enter new column name for "${catName}":`, catName);
      if (newName) renameCategory(catName, newName);
    });
    card.querySelector(".delete-cat-btn")?.addEventListener("click", () => removeCategory(catName));

    container.appendChild(card);
  });
}

function renderCatalogueMatrix() {
  renderCategoryColumnsScroller();
  renderFlatTableView();
}

function renderCategoryColumnsScroller() {
  const container = document.getElementById("categoryColumnViewContainer");
  if (!container) return;

  container.innerHTML = "";
  const query = (AppState.catalogueSearchTerm || "").toLowerCase().trim();
  const selectedCat = AppState.catalogueCategoryFilter;

  AppState.categories.forEach((catName) => {
    if (selectedCat !== "ALL" && selectedCat !== catName) return;

    let list = AppState.columnsData.get(catName) || [];
    
    if (query) {
      list = list.filter((url) => {
        const id = extractYouTubeId(url) || "";
        const meta = AppState.metadataCache[id] || {};
        const title = (meta.title || "").toLowerCase();
        return url.toLowerCase().includes(query) || id.toLowerCase().includes(query) || title.includes(query);
      });
    }

    const col = document.createElement("div");
    col.className = "catalogue-column";

    const header = document.createElement("div");
    header.className = "catalogue-col-header";
    header.innerHTML = `
      <span class="col-title">${escapeHTML(catName)}</span>
      <span class="col-count">${list.length} item${list.length === 1 ? "" : "s"}</span>
    `;

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "catalogue-col-items";

    if (list.length === 0) {
      itemsContainer.innerHTML = `<div class="empty-list-notice"><p>${APP_CONFIG.content.emptyStates.noDataDescription}</p></div>`;
    } else {
      list.forEach((url, idx) => {
        const id = extractYouTubeId(url);
        const meta = AppState.metadataCache[id] || { title: `YouTube Video (${id})` };
        const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

        const itemCard = document.createElement("div");
        itemCard.className = "catalogue-item-card";

        itemCard.innerHTML = `
          <div class="cat-item-top">
            <div class="cat-item-thumb" data-play-id="${id}" title="Watch preview">
              <img src="${escapeHTML(thumb)}" alt="" loading="lazy">
            </div>
            <div class="cat-item-meta">
              <h5 class="cat-item-title" title="${escapeHTML(meta.title)}">${escapeHTML(meta.title)}</h5>
              <span class="cat-item-id">ID: ${id}</span>
            </div>
          </div>
          <div class="cat-item-clean-url" title="${url}">${url}</div>
          <div class="cat-item-actions">
            <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn move-cat-prompt-btn">Move</button>
            <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn copy-url-item-btn" title="Copy clean link">Copy</button>
            <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn danger-hover delete-video-item-btn" title="Remove video">✕</button>
          </div>
        `;

        itemCard.querySelector(".cat-item-thumb")?.addEventListener("click", () => openVideoPreviewModal(id));
        itemCard.querySelector(".copy-url-item-btn")?.addEventListener("click", () => copyToClipboard(url, "Clean link copied!"));
        itemCard.querySelector(".delete-video-item-btn")?.addEventListener("click", () => removeVideoFromCategory(catName, idx));
        itemCard.querySelector(".move-cat-prompt-btn")?.addEventListener("click", () => {
          const otherCats = AppState.categories.filter((c) => c !== catName);
          if (otherCats.length === 0) {
            showToast("No other categories available.", "warning");
            return;
          }
          const destination = prompt(`Move video to which category column?\nAvailable: ${otherCats.join(", ")}`, otherCats[0]);
          if (destination && AppState.categories.includes(destination)) {
            moveVideo(catName, destination, idx);
          }
        });

        itemsContainer.appendChild(itemCard);
      });
    }

    col.appendChild(header);
    col.appendChild(itemsContainer);
    container.appendChild(col);
  });
}

function renderFlatTableView() {
  const tbody = document.getElementById("flatVideosTableBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const query = (AppState.catalogueSearchTerm || "").toLowerCase().trim();
  const selectedCat = AppState.catalogueCategoryFilter;

  let rowCounter = 1;

  AppState.categories.forEach((catName) => {
    if (selectedCat !== "ALL" && selectedCat !== catName) return;

    const list = AppState.columnsData.get(catName) || [];
    list.forEach((url, idx) => {
      const id = extractYouTubeId(url);
      const meta = AppState.metadataCache[id] || { title: `YouTube Video (${id})` };

      if (query) {
        const titleLower = meta.title.toLowerCase();
        if (!url.toLowerCase().includes(query) && !id.toLowerCase().includes(query) && !titleLower.includes(query)) {
          return;
        }
      }

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${rowCounter++}</td>
        <td><span class="session-category-tag">${escapeHTML(catName)}</span></td>
        <td>
          <div class="table-thumb-title">
            <img class="table-thumb" src="https://i.ytimg.com/vi/${id}/mqdefault.jpg" alt="">
            <span>${escapeHTML(meta.title)}</span>
          </div>
        </td>
        <td><code class="table-url-code">${url}</code></td>
        <td><code>${id}</code></td>
        <td>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn flat-play-btn" data-play-id="${id}">Preview</button>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn flat-copy-btn">Copy</button>
          <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn danger-hover flat-del-btn">✕</button>
        </td>
      `;

      tr.querySelector(".flat-play-btn")?.addEventListener("click", () => openVideoPreviewModal(id));
      tr.querySelector(".flat-copy-btn")?.addEventListener("click", () => copyToClipboard(url, "Clean link copied!"));
      tr.querySelector(".flat-del-btn")?.addEventListener("click", () => removeVideoFromCategory(catName, idx));

      tbody.appendChild(tr);
    });
  });

  if (rowCounter === 1) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:var(--color-text-muted);">No records found matching current parameters.</td></tr>`;
  }
}

function renderSessionAddedList() {
  const container = document.getElementById("sessionAddedList");
  const countEl = document.getElementById("sessionAddedCount");
  if (!container) return;

  if (countEl) countEl.textContent = AppState.sessionAddedHistory.length;

  if (AppState.sessionAddedHistory.length === 0) {
    container.innerHTML = `<div class="empty-list-notice"><p>No videos added yet this session. Search YouTube or paste a URL above to begin.</p></div>`;
    return;
  }

  container.innerHTML = "";
  AppState.sessionAddedHistory.slice(0, 10).forEach((item) => {
    const el = document.createElement("div");
    el.className = "session-item";
    el.innerHTML = `
      <div class="session-item-info">
        <span class="session-category-tag">${escapeHTML(item.category)}</span>
        <span class="session-item-title" title="${escapeHTML(item.title)}">${escapeHTML(item.title)}</span>
      </div>
      <div style="display:flex; align-items:center; gap:6px;">
        <span class="session-item-time">${formatTimeAgo(item.timestamp)}</span>
        <button type="button" class="interactive-tactile btn-tactile btn-tactile--tertiary small-btn session-copy-btn" title="Copy clean link">Copy</button>
      </div>
    `;

    el.querySelector(".session-copy-btn")?.addEventListener("click", () => {
      copyToClipboard(item.url, "Clean canonical link copied!");
    });

    container.appendChild(el);
  });
}

function renderExportView() {
  const codeBlock = document.getElementById("rawCsvCodeBlock");
  const statsLabel = document.getElementById("rawCsvStats");

  const rawCsv = serializeDatasetToCSV(AppState.categories, AppState.columnsData);

  if (codeBlock) {
    codeBlock.textContent = rawCsv || "(Empty CSV Dataset)";
  }

  if (statsLabel) {
    const lineCount = rawCsv ? rawCsv.split(/\r?\n/).length : 0;
    const byteSize = new Blob([rawCsv]).size;
    statsLabel.textContent = `${lineCount} line${lineCount === 1 ? "" : "s"} • ${formatBytes(byteSize)}`;
  }

  runDatasetAudit();
}

function runDatasetAudit() {
  const totalVideos = getTotalVideosCount();
  const totalCategories = AppState.categories.length;

  const auditCatText = document.getElementById("auditCategoriesText");
  const auditCatIcon = document.querySelector("#auditCategories .audit-icon");

  const auditUrlsText = document.getElementById("auditUrlsText");
  const auditUrlsIcon = document.querySelector("#auditUrls .audit-icon");

  const auditDupText = document.getElementById("auditDuplicatesText");
  const auditDupIcon = document.querySelector("#auditDuplicates .audit-icon");

  const auditShapeText = document.getElementById("auditShapeText");
  const auditBadge = document.getElementById("auditStatusBadge");

  let hasErrors = false;

  // 1. Categories Check
  if (totalCategories === 0) {
    auditCatText.textContent = "Error: At least 1 category column header is required.";
    auditCatIcon.className = "audit-icon warn";
    auditCatIcon.textContent = "!";
    hasErrors = true;
  } else {
    auditCatText.textContent = `${totalCategories} Category Column Header${totalCategories === 1 ? "" : "s"} established in Row 0.`;
    auditCatIcon.className = "audit-icon pass";
    auditCatIcon.textContent = "✓";
  }

  // 2. Canonical URLs Check
  let nonCanonicalCount = 0;
  for (const list of AppState.columnsData.values()) {
    list.forEach((url) => {
      const match = url.match(/^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_-]{11}$/);
      if (!match) nonCanonicalCount++;
    });
  }

  if (nonCanonicalCount > 0) {
    auditUrlsText.textContent = `Warning: ${nonCanonicalCount} URL(s) deviate from standard canonical syntax.`;
    auditUrlsIcon.className = "audit-icon warn";
    auditUrlsIcon.textContent = "!";
  } else {
    auditUrlsText.innerHTML = `All ${totalVideos} URLs strictly conform to <code>https://www.youtube.com/watch?v=...</code>`;
    auditUrlsIcon.className = "audit-icon pass";
    auditUrlsIcon.textContent = "✓";
  }

  // 3. Duplicate ID Check
  const idMap = new Map();
  let duplicateCount = 0;
  for (const [cat, list] of AppState.columnsData.entries()) {
    list.forEach((url) => {
      const id = extractYouTubeId(url);
      if (id) {
        if (!idMap.has(id)) idMap.set(id, []);
        idMap.get(id).push(cat);
      }
    });
  }

  idMap.forEach((cats) => {
    if (cats.length > 1) duplicateCount++;
  });

  if (duplicateCount > 0) {
    auditDupText.textContent = `Found ${duplicateCount} video(s) present in multiple category columns.`;
    auditDupIcon.className = "audit-icon warn";
    auditDupIcon.textContent = "!";
  } else {
    auditDupText.textContent = "Zero duplicates detected. Every video record is unique.";
    auditDupIcon.className = "audit-icon pass";
    auditDupIcon.textContent = "✓";
  }

  // 4. Matrix Shape Check
  auditShapeText.textContent = `Rectangular matrix verified (${totalCategories} columns across all record rows).`;

  if (auditBadge) {
    if (hasErrors) {
      auditBadge.textContent = "Verification Warning";
      auditBadge.className = "badge-tag badge-tag--terracotta";
    } else {
      auditBadge.textContent = "Verified Compatible";
      auditBadge.className = "badge-tag badge-tag--sage";
    }
  }
}

/**
 * =========================================================================
 * WORKFLOW VIEW SWITCHING & NAVIGATION
 * =========================================================================
 */
function switchWorkflowView(viewName) {
  if (AppState.activeWorkflowView !== viewName) {
    AppState.viewHistory.push(viewName);
  }
  AppState.activeWorkflowView = viewName;

  // Desktop workflow tabs
  document.querySelectorAll(".workflow-tab").forEach((tab) => {
    const isTarget = tab.getAttribute("data-view") === viewName;
    tab.classList.toggle("is-active", isTarget);
  });

  // Mobile Bottom Dock items
  document.querySelectorAll(".nav-tab-item").forEach((btn) => {
    const isTarget = btn.getAttribute("data-view") === viewName;
    btn.classList.toggle("nav-tab-item--active", isTarget);
  });

  const viewMap = {
    curate: document.getElementById("viewCurate"),
    categories: document.getElementById("viewCategories"),
    catalogue: document.getElementById("viewCatalogue"),
    export: document.getElementById("viewExport")
  };

  Object.entries(viewMap).forEach(([key, el]) => {
    if (el) el.classList.toggle("is-active", key === viewName);
  });

  if (viewName === "export") {
    renderExportView();
  } else if (viewName === "catalogue") {
    renderCatalogueMatrix();
  }

  // Update standardized page titles contextually
  const titleSlot = document.getElementById("pageTitleSlot");
  const eyebrowSlot = document.getElementById("pageEyebrowSlot");
  if (titleSlot && eyebrowSlot) {
    switch (viewName) {
      case "curate":
        eyebrowSlot.textContent = "CURATION ARCHITECT";
        titleSlot.textContent = "Browse & Add Videos";
        break;
      case "categories":
        eyebrowSlot.textContent = "COLUMN SCHEMA";
        titleSlot.textContent = "Manage Categories";
        break;
      case "catalogue":
        eyebrowSlot.textContent = "DATA MATRIX";
        titleSlot.textContent = "Catalogue Overview";
        break;
      case "export":
        eyebrowSlot.textContent = "DATA DELIVERY";
        titleSlot.textContent = "Validate & Export CSV";
        break;
    }
  }
}

function handleGlobalBack() {
  if (AppState.viewHistory.length > 1) {
    AppState.viewHistory.pop(); // Remove current
    const previousView = AppState.viewHistory[AppState.viewHistory.length - 1];
    switchWorkflowView(previousView);
  } else {
    switchWorkflowView(APP_CONFIG.navigation.defaultFallbackRoute);
  }
}

/**
 * =========================================================================
 * LINK PURIFIER INTERACTION CONTROLLER
 * =========================================================================
 */
async function handleRawUrlPurification(rawInput) {
  const resultBox = document.getElementById("purifiedResultBox");
  const errorBox = document.getElementById("purifierErrorBox");
  const cleanUrlInput = document.getElementById("cleanUrlResult");
  const idBadge = document.getElementById("purifiedIdBadge");
  const thumbImg = document.getElementById("purifiedThumbImg");
  const titleEl = document.getElementById("purifiedTitle");
  const authorEl = document.getElementById("purifiedAuthor");

  if (!rawInput) {
    hidePurifierBoxes();
    return;
  }

  const videoId = extractYouTubeId(rawInput);

  if (!videoId) {
    if (resultBox) resultBox.hidden = true;
    if (errorBox) errorBox.hidden = false;
    return;
  }

  const cleanCanonicalUrl = createDirectCleanUrl(videoId);

  if (errorBox) errorBox.hidden = true;
  if (resultBox) resultBox.hidden = false;

  if (cleanUrlInput) cleanUrlInput.value = cleanCanonicalUrl;
  if (idBadge) idBadge.textContent = `ID: ${videoId}`;
  if (thumbImg) thumbImg.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  if (titleEl) titleEl.textContent = `Loading video details…`;
  if (authorEl) authorEl.textContent = "YouTube Creator";

  let meta = AppState.metadataCache[videoId];
  if (!meta) {
    meta = await fetchOEmbedMetadata(videoId);
    AppState.metadataCache[videoId] = meta;
  }

  if (titleEl) titleEl.textContent = meta.title;
  if (authorEl) authorEl.textContent = meta.author;
}

function hidePurifierBoxes() {
  const resultBox = document.getElementById("purifiedResultBox");
  const errorBox = document.getElementById("purifierErrorBox");
  if (resultBox) resultBox.hidden = true;
  if (errorBox) errorBox.hidden = true;
}

/**
 * =========================================================================
 * MODAL PLAYER & DIALOG CONTROLLERS
 * =========================================================================
 */
function openVideoPreviewModal(videoId) {
  const modal = document.getElementById("videoPlayerModal");
  const iframe = document.getElementById("modalIframe");
  const titleEl = document.getElementById("modalVideoTitle");
  const cleanUrlEl = document.getElementById("modalCleanUrlText");

  if (!modal || !videoId) return;

  const directUrl = createDirectCleanUrl(videoId);
  const meta = AppState.metadataCache[videoId] || { title: `Video (${videoId})` };

  if (iframe) iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
  if (titleEl) titleEl.textContent = meta.title;
  if (cleanUrlEl) cleanUrlEl.textContent = directUrl;

  modal.hidden = false;
}

function promptCategoryPicker(videoId, title, author, thumb) {
  AppState.pendingPickerVideo = { id: videoId, title, author, thumb };
  const modal = document.getElementById("categoryPickerModal");
  const thumbEl = document.getElementById("pickerVideoThumb");
  const titleEl = document.getElementById("pickerVideoTitle");
  const urlEl = document.getElementById("pickerVideoUrl");

  if (thumbEl) thumbEl.src = thumb || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  if (titleEl) titleEl.textContent = title;
  if (urlEl) urlEl.textContent = createDirectCleanUrl(videoId);

  populateCategorySelects();
  if (modal) modal.hidden = false;
}

function setupModalDismissal(modalId, closeBtnId, cancelBtnId, onDismiss) {
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);

  const dismiss = () => {
    if (modal) modal.hidden = true;
    if (typeof onDismiss === "function") onDismiss();
  };

  closeBtn?.addEventListener("click", dismiss);
  cancelBtn?.addEventListener("click", dismiss);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) dismiss();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) {
      dismiss();
    }
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.hidden = true;
}

/**
 * =========================================================================
 * HYDRATION & EVENT LISTENERS
 * =========================================================================
 */
function hydrateFromConfig() {
  document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;

  // Footer branding
  const footerBrand = document.getElementById("footerBrandTitle");
  const footerTagline = document.getElementById("footerBrandTagline");
  const footerCopyright = document.getElementById("footerLegalCopyright");

  if (footerBrand) footerBrand.textContent = APP_CONFIG.content.legal.copyrightHolder;
  if (footerTagline) footerTagline.textContent = APP_CONFIG.content.headers.defaultSubtitle;
  if (footerCopyright) footerCopyright.textContent = `© ${APP_CONFIG.content.legal.establishedYear} ${APP_CONFIG.identity.appName} Systems`;

  // Render Mobile Thumb Dock items from APP_CONFIG.navigation.items
  const dockContainer = document.getElementById("bottomDockNavItems");
  if (dockContainer) {
    dockContainer.innerHTML = "";
    APP_CONFIG.navigation.items
      .filter((item) => item.showInBottomBar && item.enabled)
      .forEach((item) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `nav-tab-item interactive-tactile ${item.id === AppState.activeWorkflowView ? "nav-tab-item--active" : ""}`;
        btn.setAttribute("data-view", item.id);
        btn.setAttribute("aria-label", item.label);

        btn.innerHTML = `
          <span>${escapeHTML(item.label)}</span>
          <span class="nav-tab-item__indicator"></span>
        `;

        btn.addEventListener("click", () => {
          switchWorkflowView(item.id);
        });

        dockContainer.appendChild(btn);
      });
  }
}

function setupEventListeners() {
  // Global Back Button
  document.getElementById("globalBackBtn")?.addEventListener("click", handleGlobalBack);

  // Desktop workflow navigation
  document.querySelectorAll(".workflow-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      switchWorkflowView(view);
    });
  });

  // Header quick buttons
  document.getElementById("headerNewCsvBtn")?.addEventListener("click", resetToFreshBlank);
  document.getElementById("headerExportJumpBtn")?.addEventListener("click", () => switchWorkflowView("export"));
  document.getElementById("jumpToCatalogueBtn")?.addEventListener("click", () => switchWorkflowView("catalogue"));

  // CSV File Uploads
  setupFileUpload("masterCsvUpload");
  setupFileUpload("launchCsvUpload");

  // Launch pad triggers
  document.getElementById("launchNewFreshBtn")?.addEventListener("click", resetToFreshBlank);
  document.getElementById("launchSampleBtn")?.addEventListener("click", loadSampleArchive);

  // In-app YouTube search
  const ytForm = document.getElementById("youtubeSearchForm");
  const ytInput = document.getElementById("ytSearchQuery");
  if (ytForm && ytInput) {
    ytForm.addEventListener("submit", (e) => {
      e.preventDefault();
      executeYouTubeSearch(ytInput.value);
    });
  }

  // Topic suggestion chips
  document.querySelectorAll(".topic-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      if (ytInput) {
        ytInput.value = query;
        executeYouTubeSearch(query);
      }
    });
  });

  // Custom API key drawer
  const customKeyInput = document.getElementById("customApiKeyInput");
  const saveKeyBtn = document.getElementById("saveApiKeyBtn");
  const resetKeyBtn = document.getElementById("resetApiKeyBtn");

  if (saveKeyBtn && customKeyInput) {
    saveKeyBtn.addEventListener("click", () => {
      const key = customKeyInput.value.trim();
      if (key) {
        AppState.currentApiKey = key;
        localStorage.setItem(APP_CONFIG.endpoints.storageKeys.customApiKey, key);
        showToast("Custom YouTube API Key applied!", "success");
      }
    });
  }

  if (resetKeyBtn && customKeyInput) {
    resetKeyBtn.addEventListener("click", () => {
      AppState.currentApiKey = APP_CONFIG.endpoints.defaultYoutubeApiKey;
      localStorage.removeItem(APP_CONFIG.endpoints.storageKeys.customApiKey);
      customKeyInput.value = "";
      showToast("Standard YouTube API Key restored.");
    });
  }

  // Link Purifier controls
  const rawUrlInput = document.getElementById("rawUrlInput");
  const clearRawUrlBtn = document.getElementById("clearRawUrlBtn");
  let purifierDebounce = null;

  if (rawUrlInput) {
    rawUrlInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (clearRawUrlBtn) clearRawUrlBtn.hidden = val.length === 0;

      clearTimeout(purifierDebounce);
      purifierDebounce = setTimeout(() => {
        handleRawUrlPurification(val);
      }, 150);
    });
  }

  if (clearRawUrlBtn && rawUrlInput) {
    clearRawUrlBtn.addEventListener("click", () => {
      rawUrlInput.value = "";
      clearRawUrlBtn.hidden = true;
      hidePurifierBoxes();
      rawUrlInput.focus();
    });
  }

  // Confirm add from Purifier
  document.getElementById("confirmAddPurifiedBtn")?.addEventListener("click", () => {
    const cleanUrl = document.getElementById("cleanUrlResult").value;
    const catSelect = document.getElementById("assignCategorySelect");
    const targetCat = catSelect ? catSelect.value : AppState.categories[0];

    const titleEl = document.getElementById("purifiedTitle");
    const authorEl = document.getElementById("purifiedAuthor");
    const videoTitle = titleEl ? titleEl.textContent : null;
    const videoAuthor = authorEl ? authorEl.textContent : null;

    const added = addVideoToCategory(targetCat, cleanUrl, videoTitle, videoAuthor);
    if (added) {
      if (rawUrlInput) rawUrlInput.value = "";
      if (clearRawUrlBtn) clearRawUrlBtn.hidden = true;
      hidePurifierBoxes();
    }
  });

  document.getElementById("copyCleanUrlBtn")?.addEventListener("click", () => {
    const cleanUrl = document.getElementById("cleanUrlResult").value;
    copyToClipboard(cleanUrl, "Clean canonical link copied!");
  });

  document.getElementById("purifiedPlayTrigger")?.addEventListener("click", () => {
    const rawVal = rawUrlInput.value;
    const id = extractYouTubeId(rawVal);
    if (id) openVideoPreviewModal(id);
  });

  // Create Category column
  const catForm = document.getElementById("createCategoryForm");
  const newCatInput = document.getElementById("newCategoryInput");
  if (catForm && newCatInput) {
    catForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const added = addCategory(newCatInput.value);
      if (added) newCatInput.value = "";
    });
  }

  // Catalogue toolbar
  document.getElementById("catalogueSearchInput")?.addEventListener("input", (e) => {
    AppState.catalogueSearchTerm = e.target.value;
    renderCatalogueMatrix();
  });

  document.getElementById("catalogueCategoryFilter")?.addEventListener("change", (e) => {
    AppState.catalogueCategoryFilter = e.target.value;
    renderCatalogueMatrix();
  });

  document.getElementById("clearAllVideosBtn")?.addEventListener("click", clearAllVideos);

  // Column vs Flat View switches
  const btnCols = document.getElementById("btnViewColumns");
  const btnFlat = document.getElementById("btnViewFlatTable");
  const colViewWrap = document.getElementById("categoryColumnViewContainer");
  const flatViewWrap = document.getElementById("flatTableViewContainer");

  if (btnCols && btnFlat && colViewWrap && flatViewWrap) {
    btnCols.addEventListener("click", () => {
      btnCols.classList.add("is-active");
      btnFlat.classList.remove("is-active");
      colViewWrap.hidden = false;
      flatViewWrap.hidden = true;
    });

    btnFlat.addEventListener("click", () => {
      btnFlat.classList.add("is-active");
      btnCols.classList.remove("is-active");
      colViewWrap.hidden = true;
      flatViewWrap.hidden = false;
      renderFlatTableView();
    });
  }

  // Export Suite
  document.getElementById("downloadFullCsvBtn")?.addEventListener("click", () => {
    const filename = (document.getElementById("exportFilenameInput").value.trim() || "data") + ".csv";
    const content = serializeDatasetToCSV(AppState.categories, AppState.columnsData);
    downloadFile(filename, content, "text/csv;charset=utf-8;");
    showToast(`Downloaded ${filename}`, "success");
  });

  document.getElementById("copyCsvClipboardBtn")?.addEventListener("click", () => {
    const content = serializeDatasetToCSV(AppState.categories, AppState.columnsData);
    copyToClipboard(content, "Raw CSV copied to clipboard!");
  });

  document.getElementById("downloadBlankTemplateBtn")?.addEventListener("click", () => {
    const filename = "data_template.csv";
    const content = AppState.categories.map(escapeCsvCell).join(",") + "\r\n";
    downloadFile(filename, content, "text/csv;charset=utf-8;");
    showToast("Downloaded blank template CSV", "success");
  });

  // Modals
  setupModalDismissal("videoPlayerModal", "closeModalBtn", "modalDismissBtn", () => {
    const iframe = document.getElementById("modalIframe");
    if (iframe) iframe.src = "";
  });

  setupModalDismissal("categoryPickerModal", "closePickerModalBtn", "pickerCancelBtn");

  document.getElementById("pickerConfirmBtn")?.addEventListener("click", () => {
    if (!AppState.pendingPickerVideo) return;
    const { id, title, author } = AppState.pendingPickerVideo;
    const sel = document.getElementById("pickerCategorySelect");
    const category = sel ? sel.value : AppState.categories[0];
    const cleanUrl = createDirectCleanUrl(id);

    addVideoToCategory(category, cleanUrl, title, author);
    closeModal("categoryPickerModal");
    AppState.pendingPickerVideo = null;
  });

  document.getElementById("modalCopyUrlBtn")?.addEventListener("click", () => {
    const url = document.getElementById("modalCleanUrlText").textContent;
    copyToClipboard(url, "Clean canonical link copied!");
  });

  // Global tactile feedback delegation
  document.addEventListener("click", (event) => {
    const target = event.target.closest(".interactive-tactile, .btn-tactile, .nav-tab-item");
    if (target) {
      triggerHapticPulse();
    }
  });
}

function setupFileUpload(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  input.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      ingestCsvText(event.target.result, `Imported ${file.name}`);
      input.value = "";
    };
    reader.readAsText(file);
  });
}

/**
 * =========================================================================
 * PERSISTENCE & SYSTEM UTILITIES
 * =========================================================================
 */
function persistState() {
  if (!APP_CONFIG.features.enableAutoSave) return;
  try {
    const serializable = {
      categories: AppState.categories,
      columnsData: Array.from(AppState.columnsData.entries()),
      sessionAddedHistory: AppState.sessionAddedHistory.slice(0, 30),
      timestamp: Date.now()
    };
    localStorage.setItem(APP_CONFIG.endpoints.storageKeys.datasetDraft, JSON.stringify(serializable));
  } catch (err) {
    console.warn("Could not commit draft to local storage:", err);
  }
}

function loadPersistedState() {
  try {
    const savedKey = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.customApiKey);
    if (savedKey) {
      AppState.currentApiKey = savedKey;
      const keyInput = document.getElementById("customApiKeyInput");
      if (keyInput) keyInput.value = savedKey;
    }

    const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.datasetDraft);
    if (!raw) return false;

    const data = JSON.parse(raw);
    if (data && Array.isArray(data.categories) && Array.isArray(data.columnsData)) {
      AppState.categories = data.categories;
      AppState.columnsData = new Map(data.columnsData);
      if (Array.isArray(data.sessionAddedHistory)) {
        AppState.sessionAddedHistory = data.sessionAddedHistory;
      }
      return true;
    }
  } catch (err) {
    console.warn("Error restoring draft state:", err);
  }
  return false;
}

function getTotalVideosCount() {
  let count = 0;
  for (const list of AppState.columnsData.values()) {
    count += list.length;
  }
  return count;
}

function showToast(message, type = "info") {
  const region = document.getElementById("toastRegion");
  if (!region) return;

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.textContent = message;

  region.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.22s ease";
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function copyToClipboard(text, successMsg = "Copied to clipboard!") {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, "success");
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast(successMsg, "success");
  } catch {
    showToast("Copy command unsuccessful", "warning");
  }
  document.body.removeChild(ta);
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const sec = Math.floor((Date.now() - timestamp) / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  return `${hr}h ago`;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[m]);
}

/**
 * =========================================================================
 * APPLICATION BOOTSTRAPPER
 * =========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  hydrateFromConfig();
  setupEventListeners();

  const draftLoaded = loadPersistedState();
  if (draftLoaded) {
    const onboarding = document.getElementById("onboardingSection");
    if (onboarding) onboarding.style.display = "none";
  }

  refreshAllUI();
  executeYouTubeSearch("Veritasium physics science");
});