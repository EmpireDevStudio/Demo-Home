/**
 * ==========================================================================
 * THE EDITORIAL VIDEO ARCHIVE — SCRIPT.JS
 * Fully Dynamic CSV Parsing, YouTube Data API Integration & Resilient Rendering
 * ==========================================================================
 */

"use strict";

/* ==========================================================================
   1. EDITORIAL CONFIGURATION SETTINGS
   Add your YouTube Data API v3 key below to retrieve full titles, descriptions,
   view counts, and like counts.
   ========================================================================== */
const CONFIG = {
  // Candidate relative file paths for data.csv
  CSV_PATHS: ["data.csv", "./data.csv", "Data.csv"],

  // INSERT YOUR YOUTUBE DATA API V3 KEY HERE:
  // e.g. YOUTUBE_API_KEY: "AIzaSy..."
  YOUTUBE_API_KEY: "AIzaSyBQGBdXJUcaQYnqGbemqH20EA2ltzI4GFg",

  // Maximum character length for card excerpt descriptions
  DESCRIPTION_LENGTH: 150,

  // Cache duration in localStorage (24 hours)
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,

  // Local storage namespace
  CACHE_STORAGE_KEY: "editorial_video_metadata_cache_v3"
};

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */
const State = {
  categories: [],          // [{ name: string, videoIds: string[] }]
  videos: new Map(),       // compositeKey -> VideoModel
  activeCategory: "ALL",   // 'ALL' | specific category name
  searchQuery: "",         // Sanitized search query
  sortMode: "default",     // 'default' | 'liked' | 'views' | 'alpha'
  metadataCache: {}
};

/**
 * Data Model for Video Item
 */
class VideoModel {
  constructor(id, originalUrl, category) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.category = category;
    this.title = `YouTube Video (${id})`;
    this.description = `Curated video entry under ${category}. Watch directly on YouTube.`;
    this.thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    this.likeCount = null;
    this.viewCount = null;
    this.hasDetailedMeta = false;
  }
}

/* ==========================================================================
   3. ROBUST CSV PARSER
   Correctly handles escaped quotes, multiline cells, spaces, and UTF-8 BOM
   ========================================================================== */
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
          i++; // Skip escaped quote
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

/**
 * Extracts 11-character YouTube video ID across watch, shorts, embed, and live URLs
 */
function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();
  const patterns = [
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/* ==========================================================================
   4. METADATA PERSISTENCE (LOCAL STORAGE)
   ========================================================================== */
function loadMetadataCache() {
  try {
    const raw = localStorage.getItem(CONFIG.CACHE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const fresh = {};

    for (const [id, record] of Object.entries(parsed)) {
      if (record && record.timestamp && now - record.timestamp < CONFIG.CACHE_TTL_MS) {
        fresh[id] = record;
      }
    }
    return fresh;
  } catch {
    return {};
  }
}

function saveMetadataCache(cache) {
  try {
    localStorage.setItem(CONFIG.CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn("Could not write to localStorage:", err);
  }
}

/* ==========================================================================
   5. CSV INGESTION & PIPELINE ENGINE
   ========================================================================== */
function processCSVContent(csvText) {
  const loadingEl = document.getElementById("loadingSkeleton");
  const errorEl = document.getElementById("errorBanner");
  const counterEl = document.getElementById("totalCountDisplay");
  const apiStatus = document.getElementById("apiStatusBadge");

  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) {
    throw new Error("The CSV file is empty.");
  }

  // 1. Identify category columns from row 0
  const headerRow = rows[0];
  const categories = [];

  headerRow.forEach((heading, colIndex) => {
    const cleanName = heading.trim();
    if (cleanName.length > 0) {
      categories.push({
        index: colIndex,
        name: cleanName,
        videoIds: []
      });
    }
  });

  if (categories.length === 0) {
    throw new Error("No category columns found in data.csv.");
  }

  // 2. Read each data row
  State.videos.clear();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    categories.forEach((cat) => {
      if (cat.index < row.length) {
        const cell = row[cat.index];
        const videoId = extractYouTubeId(cell);
        if (videoId) {
          cat.videoIds.push(videoId);

          const compositeKey = `${cat.name}_${videoId}`;
          if (!State.videos.has(compositeKey)) {
            State.videos.set(compositeKey, new VideoModel(videoId, cell.trim(), cat.name));
          }
        }
      }
    });
  }

  State.categories = categories;

  // 3. Update counter and hide skeletons
  const totalCount = State.videos.size;
  if (counterEl) {
    counterEl.textContent = totalCount.toLocaleString();
  }

  if (errorEl) errorEl.hidden = true;
  if (loadingEl) {
    loadingEl.hidden = true;
    loadingEl.remove(); // Remove skeleton completely from DOM
  }

  // 4. Render category tabs
  renderCategoryTabs();

  // 5. Apply any cached metadata immediately
  State.metadataCache = loadMetadataCache();
  for (const video of State.videos.values()) {
    const cached = State.metadataCache[video.id];
    if (cached) {
      if (cached.title) video.title = cached.title;
      if (cached.description) video.description = cached.description;
      if (cached.thumbnailUrl) video.thumbnailUrl = cached.thumbnailUrl;
      video.likeCount = cached.likeCount !== undefined ? cached.likeCount : null;
      video.viewCount = cached.viewCount !== undefined ? cached.viewCount : null;
      video.hasDetailedMeta = true;
    }
  }

  // 6. Immediate render: All cards render at once
  renderGallery();

  // 7. Update status badge
  if (apiStatus) {
    if (CONFIG.YOUTUBE_API_KEY && CONFIG.YOUTUBE_API_KEY.trim() !== "") {
      apiStatus.textContent = "YouTube Data API v3 Active";
    } else {
      apiStatus.textContent = "Direct Curation Mode (oEmbed / CDN)";
    }
  }

  // 8. Enhance metadata asynchronously in background
  enhanceMetadataInBackground();
}

async function fetchCSVWithFallbacks() {
  let lastError = null;

  for (const path of CONFIG.CSV_PATHS) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to load data.csv");
}

async function initLibrary() {
  const loadingEl = document.getElementById("loadingSkeleton");
  const errorEl = document.getElementById("errorBanner");
  const errorMessageText = document.getElementById("errorMessageText");

  try {
    const csvData = await fetchCSVWithFallbacks();
    processCSVContent(csvData);
  } catch (err) {
    if (loadingEl) loadingEl.hidden = true;
    if (errorEl) {
      errorEl.hidden = false;
      if (window.location.protocol === "file:") {
        errorMessageText.innerHTML = "Web browsers block automatic file loading when opened as a <code>file:///</code> URL. Use the button below to load <code>data.csv</code> directly:";
      } else {
        errorMessageText.innerHTML = `Could not load <code>data.csv</code> (${escapeHTML(err.message)}). Ensure <code>data.csv</code> is in the root directory.`;
      }
    }
    console.error("Library load error:", err);
  }
}

/* ==========================================================================
   6. METADATA ENHANCEMENT ENGINE (NON-BLOCKING)
   ========================================================================== */
async function enhanceMetadataInBackground() {
  const uncachedIds = new Set();

  for (const video of State.videos.values()) {
    if (!video.hasDetailedMeta) {
      uncachedIds.add(video.id);
    }
  }

  if (uncachedIds.size === 0) return;
  const idList = Array.from(uncachedIds);

  if (CONFIG.YOUTUBE_API_KEY && CONFIG.YOUTUBE_API_KEY.trim() !== "") {
    await fetchViaYouTubeApiBatch(idList);
  } else {
    await fetchViaOEmbedSafe(idList);
  }

  saveMetadataCache(State.metadataCache);
  updateRenderedCards();
}

/**
 * Batch request via YouTube Data API v3 (up to 50 IDs per request)
 */
async function fetchViaYouTubeApiBatch(ids) {
  const chunkSize = 50;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${chunk.join(",")}&key=${encodeURIComponent(CONFIG.YOUTUBE_API_KEY)}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
        console.warn(`YouTube Data API returned status ${res.status}. Falling back to safe resolver.`);
        await fetchViaOEmbedSafe(chunk);
        continue;
      }

      const data = await res.json();
      const items = data.items || [];

      for (const item of items) {
        const id = item.id;
        const snippet = item.snippet || {};
        const stats = item.statistics || {};

        const thumbs = snippet.thumbnails || {};
        const thumbUrl = (thumbs.maxres || thumbs.standard || thumbs.high || thumbs.medium || thumbs.default || {}).url 
                         || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

        const likeVal = stats.likeCount !== undefined ? parseInt(stats.likeCount, 10) : null;
        const viewVal = stats.viewCount !== undefined ? parseInt(stats.viewCount, 10) : null;

        const record = {
          title: snippet.title || `Video (${id})`,
          description: snippet.description || "Curated YouTube media.",
          thumbnailUrl: thumbUrl,
          likeCount: Number.isFinite(likeVal) ? likeVal : null,
          viewCount: Number.isFinite(viewVal) ? viewVal : null,
          timestamp: Date.now()
        };

        State.metadataCache[id] = record;
        applyMetadataToVideos(id, record);
      }
    } catch (err) {
      console.warn("YouTube API batch failed:", err);
      await fetchViaOEmbedSafe(chunk);
    }
  }
}

/**
 * Safe oEmbed resolver without blocking UI
 */
async function fetchViaOEmbedSafe(ids) {
  const targetIds = ids.slice(0, 40);

  const promises = targetIds.map(async (id) => {
    try {
      const targetUrl = `https://www.youtube.com/watch?v=${id}`;
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const record = {
          title: data.title || `Video (${id})`,
          description: `Work by ${data.author_name || "original creator"} on YouTube.`,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          likeCount: null,
          viewCount: null,
          timestamp: Date.now()
        };

        State.metadataCache[id] = record;
        applyMetadataToVideos(id, record);
      }
    } catch {
      // Retains default model values; card remains fully functional
    }
  });

  await Promise.all(promises);
}

function applyMetadataToVideos(id, record) {
  for (const video of State.videos.values()) {
    if (video.id === id) {
      video.title = record.title;
      video.description = record.description;
      video.thumbnailUrl = record.thumbnailUrl;
      video.likeCount = record.likeCount;
      video.viewCount = record.viewCount;
      video.hasDetailedMeta = true;
    }
  }
}

/* ==========================================================================
   7. UI RENDERING & DOM UPDATES
   ========================================================================== */
function renderCategoryTabs() {
  const tabsContainer = document.getElementById("categoryTabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";

  // 1. "All Archives" Tab
  const totalCount = State.videos.size;
  const allLi = document.createElement("li");
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = `tab-btn ${State.activeCategory === "ALL" ? "is-active" : ""}`;
  allBtn.setAttribute("role", "tab");
  allBtn.setAttribute("aria-selected", State.activeCategory === "ALL" ? "true" : "false");
  allBtn.setAttribute("data-category", "ALL");
  allBtn.innerHTML = `All Archives <span class="tab-count">${totalCount}</span>`;

  allBtn.addEventListener("click", () => handleCategoryChange("ALL"));
  allLi.appendChild(allBtn);
  tabsContainer.appendChild(allLi);

  // 2. Dynamic Categories from CSV
  State.categories.forEach((cat) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab-btn ${State.activeCategory === cat.name ? "is-active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", State.activeCategory === cat.name ? "true" : "false");
    btn.setAttribute("data-category", cat.name);
    btn.innerHTML = `${escapeHTML(cat.name)} <span class="tab-count">${cat.videoIds.length}</span>`;

    btn.addEventListener("click", () => handleCategoryChange(cat.name));
    li.appendChild(btn);
    tabsContainer.appendChild(li);
  });
}

function handleCategoryChange(categoryName) {
  if (State.activeCategory === categoryName) return;
  State.activeCategory = categoryName;

  const tabButtons = document.querySelectorAll(".category-tabs .tab-btn");
  tabButtons.forEach((btn) => {
    const isTarget = btn.getAttribute("data-category") === categoryName;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  renderGallery();
}

function renderGallery() {
  const gridEl = document.getElementById("videoGrid");
  const emptyStateEl = document.getElementById("emptyState");
  const activeBadge = document.getElementById("activeCategoryBadge");
  const statusNotice = document.getElementById("resultsCountNotice");

  if (!gridEl) return;

  // 1. Filter by category
  let list = Array.from(State.videos.values());
  if (State.activeCategory !== "ALL") {
    list = list.filter((v) => v.category === State.activeCategory);
  }

  // 2. Filter by search query
  const query = State.searchQuery.trim().toLowerCase();
  if (query.length > 0) {
    list = list.filter((v) => {
      const titleMatch = v.title.toLowerCase().includes(query);
      const descMatch = v.description.toLowerCase().includes(query);
      const catMatch = v.category.toLowerCase().includes(query);
      return titleMatch || descMatch || catMatch;
    });
  }

  // 3. Sort
  if (State.sortMode === "liked") {
    list.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  } else if (State.sortMode === "views") {
    list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (State.sortMode === "alpha") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  // 4. Update Header Metrics
  if (activeBadge) {
    activeBadge.textContent = State.activeCategory === "ALL" ? "All Archives" : State.activeCategory;
  }
  if (statusNotice) {
    statusNotice.textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"} catalogued`;
  }

  // 5. Handle empty state
  if (list.length === 0) {
    gridEl.innerHTML = "";
    if (emptyStateEl) emptyStateEl.hidden = false;
    return;
  }

  if (emptyStateEl) emptyStateEl.hidden = true;

  // 6. Render Cards synchronously without fading delay
  gridEl.innerHTML = "";
  const fragment = document.createDocumentFragment();

  list.forEach((video) => {
    const card = createVideoCardElement(video);
    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
}

function createVideoCardElement(video) {
  const card = document.createElement("a");
  card.className = "video-card";
  card.href = `https://www.youtube.com/watch?v=${video.id}`;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("data-video-id", video.id);
  card.setAttribute("aria-label", `${video.title} (Opens on YouTube in new tab)`);

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "card-media";

  const img = document.createElement("img");
  img.className = "card-thumb";
  img.alt = "";
  img.loading = "lazy";

  // Deterministic thumbnail load handler: marks image loaded once ready
  img.onload = () => {
    img.classList.add("is-loaded");
  };

  // Thumbnail cascade fallback: maxres -> hqdefault -> mqdefault -> fallback art
  img.onerror = () => {
    if (!img.dataset.triedHq) {
      img.dataset.triedHq = "true";
      img.src = `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    } else if (!img.dataset.triedMq) {
      img.dataset.triedMq = "true";
      img.src = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
    } else {
      img.style.display = "none";
      mediaWrap.classList.add("has-fallback-art");
    }
  };

  // Start with default thumbnail URL
  img.src = video.thumbnailUrl;

  const playBadge = document.createElement("div");
  playBadge.className = "play-badge";
  playBadge.setAttribute("aria-hidden", "true");
  playBadge.innerHTML = `
    <div class="play-disc">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <polygon points="6 4 20 12 6 20 6 4"></polygon>
      </svg>
    </div>
  `;

  const categoryPill = document.createElement("span");
  categoryPill.className = "category-pill";
  categoryPill.textContent = video.category;

  mediaWrap.appendChild(img);
  mediaWrap.appendChild(playBadge);
  mediaWrap.appendChild(categoryPill);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h2");
  title.className = "card-title";
  title.textContent = video.title;

  const desc = document.createElement("p");
  desc.className = "card-excerpt";
  desc.textContent = truncateString(video.description, CONFIG.DESCRIPTION_LENGTH);

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const metricsGroup = document.createElement("div");
  metricsGroup.className = "card-metrics-group";

  // Likes Metric
  const likesMetric = document.createElement("span");
  likesMetric.className = "card-metric metric-likes";
  likesMetric.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
    <span class="like-number">${formatMetric(video.likeCount)}</span>
  `;

  // Views Metric
  const viewsMetric = document.createElement("span");
  viewsMetric.className = "card-metric metric-views";
  viewsMetric.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
    <span class="view-number">${formatMetric(video.viewCount)}</span>
  `;

  metricsGroup.appendChild(likesMetric);
  metricsGroup.appendChild(viewsMetric);

  const platformIndicator = document.createElement("span");
  platformIndicator.className = "card-platform";
  platformIndicator.innerHTML = `
    <span>WATCH</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  `;

  footer.appendChild(metricsGroup);
  footer.appendChild(platformIndicator);

  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(footer);

  card.appendChild(mediaWrap);
  card.appendChild(body);

  return card;
}

/**
 * Updates existing rendered cards in place when API metadata arrives
 */
function updateRenderedCards() {
  const cards = document.querySelectorAll(".video-card");
  cards.forEach((card) => {
    const id = card.getAttribute("data-video-id");
    const video = Array.from(State.videos.values()).find((v) => v.id === id);
    if (!video || !video.hasDetailedMeta) return;

    const titleEl = card.querySelector(".card-title");
    const descEl = card.querySelector(".card-excerpt");
    const likeEl = card.querySelector(".like-number");
    const viewEl = card.querySelector(".view-number");
    const imgEl = card.querySelector(".card-thumb");

    if (titleEl && titleEl.textContent !== video.title) {
      titleEl.textContent = video.title;
      card.setAttribute("aria-label", `${video.title} (Opens on YouTube in new tab)`);
    }
    if (descEl) {
      descEl.textContent = truncateString(video.description, CONFIG.DESCRIPTION_LENGTH);
    }
    if (likeEl) {
      likeEl.textContent = formatMetric(video.likeCount);
    }
    if (viewEl) {
      viewEl.textContent = formatMetric(video.viewCount);
    }
    if (imgEl && video.thumbnailUrl && imgEl.src !== video.thumbnailUrl) {
      imgEl.src = video.thumbnailUrl;
    }
  });
}

/* ==========================================================================
   8. UTILITIES & FORMATTERS
   ========================================================================== */
function truncateString(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  const sub = str.slice(0, maxLen);
  const lastSpace = sub.lastIndexOf(" ");
  return `${lastSpace > 0 ? sub.slice(0, lastSpace) : sub}…`;
}

function formatMetric(count) {
  if (count === null || count === undefined || !Number.isFinite(count)) {
    return "—";
  }
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return count.toLocaleString();
}

function escapeHTML(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* ==========================================================================
   9. INTERACTIVE BINDINGS & LOCAL FILE HELPER
   ========================================================================== */
function setupEventListeners() {
  const searchInput = document.getElementById("librarySearch");
  const clearBtn = document.getElementById("searchClearBtn");
  const sortSelect = document.getElementById("sortSelector");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const fileInput = document.getElementById("csvFileInput");

  // Search input debouncer
  let debounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.hidden = val.length === 0;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        State.searchQuery = val;
        renderGallery();
      }, 100);
    });
  }

  // Clear search
  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      clearBtn.hidden = true;
      State.searchQuery = "";
      searchInput.focus();
      renderGallery();
    });
  }

  // Sort selector
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      State.sortMode = e.target.value;
      renderGallery();
    });
  }

  // Reset filters
  if (resetBtn && searchInput) {
    resetBtn.addEventListener("click", () => {
      searchInput.value = "";
      if (clearBtn) clearBtn.hidden = true;
      State.searchQuery = "";
      State.activeCategory = "ALL";
      renderCategoryTabs();
      renderGallery();
    });
  }

  // Local File Selector Fallback (when opened as local file:/// with CORS blocked)
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          processCSVContent(event.target.result);
        } catch (err) {
          alert(`Error reading selected file: ${err.message}`);
        }
      };
      reader.readAsText(file);
    });
  }
}

/* ==========================================================================
   10. BOOTSTRAP
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  initLibrary();
});