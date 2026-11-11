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
    appId: "editorial-video-archive",
    appName: "The Editorial Video Archive",
    appTagline: "A curated repository of recorded knowledge, lectures, and cultural works.",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-logo.svg",
    logoAlt: "Editorial Video Archive Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#963E35",      // Accessible Terracotta Red
    accentSecondary: "#3E5B42",  // Accessible Sage Green
    accentHighlight: "#6E5614",  // Accessible Warm Ochre
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "overview",
    items: [
      { id: "overview", label: "Archive", icon: "icon-collection", route: "#overview", enabled: true, showInBottomBar: true },
      { id: "categories", label: "Categories", icon: "icon-shelf", route: "#categories", enabled: true, showInBottomBar: true },
      { id: "search", label: "Search", icon: "icon-search", route: "#search", enabled: true, showInBottomBar: true },
      { id: "colophon", label: "Colophon", icon: "icon-info", route: "#colophon", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultEyebrow: "CURATED REPOSITORY",
      defaultTitle: "The Video Archive",
      defaultSubtitle: "An artisanal catalog of recorded knowledge, lectures, and cultural works.",
    },
    emptyStates: {
      noDataHeading: "No Matching Records Found",
      noDataDescription: "No video entries match your current search parameters. Clear your filters or explore other subjects.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Entry",
      delete: "Remove Permanently",
      retry: "Retry Query",
      back: "Catalogue",
    },
    notifications: {
      saveSuccess: "Record committed to archive.",
      saveError: "Unable to complete action.",
      deleteSuccess: "Record removed from view.",
    },
    legal: {
      copyrightHolder: "",
      establishedYear: 2026,
      privacyPolicyUrl: "",
      termsOfServiceUrl: "",
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "",
    supportDeskUrl: "",
    emergencyContactPhone: "+1 (800) 555-0199",
    operatingHours: "Monday – Friday, 08:00 – 18:00 EST",
    socialLinks: {
      documentation: "",
      statusPage: "",
    },
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // Subtle 12ms navigator.vibrate() on mobile actions
    enableSmoothPageTransitions: true, // Kinetic transitions
    enableAutoSave: true,
    autoSaveIntervalMs: 5000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,        // Ergonomic mobile thumb dock
    enableSoundEffects: false,
  },

  // 7. API ENDPOINTS & STORAGE
  endpoints: {
    csvCandidatePaths: ["data.csv", "./data.csv", "Data.csv"],
    youtubeApiKey: "AIzaSyBQGBdXJUcaQYnqGbemqH20EA2ltzI4GFg",
    excerptMaxCharacters: 150,
    storageKeys: {
      cacheKey: "editorial_video_metadata_cache_v4",
      userPreferences: "ev_user_prefs_v1",
    },
    cacheTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  },
});

"use strict";

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */
const AppState = {
  categories: [],          // [{ index: number, name: string, videoIds: string[] }]
  videos: new Map(),       // compositeKey -> VideoModel
  activeCategory: "ALL",   // 'ALL' | specific category name
  searchQuery: "",         // Sanitized search query
  sortMode: "default",     // 'default' | 'liked' | 'views' | 'alpha'
  metadataCache: {},
  activeRoute: "overview"
};

/**
 * Data Model for Video Item
 */
class VideoModel {
  constructor(id, originalUrl, category) {
    this.id = id;
    this.originalUrl = originalUrl;
    this.category = category;
    this.title = `Curated Entry (${id})`;
    this.description = `Curated video entry under ${category}. Watch directly on YouTube.`;
    this.thumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    this.likeCount = null;
    this.viewCount = null;
    this.hasDetailedMeta = false;
  }
}

/* ==========================================================================
   3. TACTILE SENSORY PROTOCOLS
   ========================================================================== */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12);
    } catch {
      // Gracefully silent when unavailable
    }
  }
}

/* ==========================================================================
   4. ROBUST CSV PARSER
   Preserves escaped quotes, multiline content, and UTF-8 BOM
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
 * Extracts 11-character YouTube video ID
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
   5. METADATA PERSISTENCE (LOCAL STORAGE)
   ========================================================================== */
function loadMetadataCache() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.cacheKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const fresh = {};

    for (const [id, record] of Object.entries(parsed)) {
      if (record && record.timestamp && now - record.timestamp < APP_CONFIG.endpoints.cacheTtlMs) {
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
    localStorage.setItem(APP_CONFIG.endpoints.storageKeys.cacheKey, JSON.stringify(cache));
  } catch (err) {
    if (APP_CONFIG.features.enableDetailedDiagnostics) {
      console.warn("Storage quota exceeded or unavailable:", err);
    }
  }
}

/* ==========================================================================
   6. CSV INGESTION & PIPELINE ENGINE
   ========================================================================== */
function processCSVContent(csvText) {
  const loadingEl = document.getElementById("loadingSkeleton");
  const errorEl = document.getElementById("errorBanner");
  const counterEl = document.getElementById("totalCountDisplay");
  const apiStatus = document.getElementById("apiStatusBadge");

  const rows = parseCSV(csvText);
  if (!rows || rows.length === 0) {
    throw new Error("The operational dataset file contains no rows.");
  }

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
    throw new Error("No column category headers detected in dataset.");
  }

  AppState.videos.clear();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    categories.forEach((cat) => {
      if (cat.index < row.length) {
        const cell = row[cat.index];
        const videoId = extractYouTubeId(cell);
        if (videoId) {
          cat.videoIds.push(videoId);

          const compositeKey = `${cat.name}_${videoId}`;
          if (!AppState.videos.has(compositeKey)) {
            AppState.videos.set(compositeKey, new VideoModel(videoId, cell.trim(), cat.name));
          }
        }
      }
    });
  }

  AppState.categories = categories;

  const totalCount = AppState.videos.size;
  if (counterEl) {
    counterEl.textContent = totalCount.toLocaleString();
  }

  if (errorEl) errorEl.hidden = true;
  if (loadingEl) {
    loadingEl.hidden = true;
    loadingEl.remove();
  }

  renderCategoryTabs();

  // Load and apply cache
  AppState.metadataCache = loadMetadataCache();
  for (const video of AppState.videos.values()) {
    const cached = AppState.metadataCache[video.id];
    if (cached) {
      if (cached.title) video.title = cached.title;
      if (cached.description) video.description = cached.description;
      if (cached.thumbnailUrl) video.thumbnailUrl = cached.thumbnailUrl;
      video.likeCount = cached.likeCount !== undefined ? cached.likeCount : null;
      video.viewCount = cached.viewCount !== undefined ? cached.viewCount : null;
      video.hasDetailedMeta = true;
    }
  }

  renderGallery();

  if (apiStatus) {
    if (APP_CONFIG.endpoints.youtubeApiKey && APP_CONFIG.endpoints.youtubeApiKey.trim() !== "") {
      apiStatus.textContent = "YouTube Data API v3 Active";
    } else {
      apiStatus.textContent = "Direct Curation Mode (oEmbed / CDN)";
    }
  }

  enhanceMetadataInBackground();
}

async function fetchCSVWithFallbacks() {
  let lastError = null;

  for (const path of APP_CONFIG.endpoints.csvCandidatePaths) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (response.ok) {
        return await response.text();
      }
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to load dataset from candidate paths.");
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
        errorMessageText.innerHTML = "Web browsers restrict automatic file requests over <code>file:///</code> protocols. Please select <code>data.csv</code> directly using the button below:";
      } else {
        errorMessageText.innerHTML = `Could not load dataset file (<code>${escapeHTML(err.message)}</code>). Please verify that <code>data.csv</code> is deployed at the web root.`;
      }
    }
  }
}

/* ==========================================================================
   7. METADATA ENHANCEMENT (BACKGROUND BATCHING)
   ========================================================================== */
async function enhanceMetadataInBackground() {
  const uncachedIds = new Set();

  for (const video of AppState.videos.values()) {
    if (!video.hasDetailedMeta) {
      uncachedIds.add(video.id);
    }
  }

  if (uncachedIds.size === 0) return;
  const idList = Array.from(uncachedIds);

  if (APP_CONFIG.endpoints.youtubeApiKey && APP_CONFIG.endpoints.youtubeApiKey.trim() !== "") {
    await fetchViaYouTubeApiBatch(idList);
  } else {
    await fetchViaOEmbedSafe(idList);
  }

  saveMetadataCache(AppState.metadataCache);
  updateRenderedCards();
}

async function fetchViaYouTubeApiBatch(ids) {
  const chunkSize = 50;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${chunk.join(",")}&key=${encodeURIComponent(APP_CONFIG.endpoints.youtubeApiKey)}`;

    try {
      const res = await fetch(endpoint);
      if (!res.ok) {
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
          title: snippet.title || `Entry (${id})`,
          description: snippet.description || "Curated educational media.",
          thumbnailUrl: thumbUrl,
          likeCount: Number.isFinite(likeVal) ? likeVal : null,
          viewCount: Number.isFinite(viewVal) ? viewVal : null,
          timestamp: Date.now()
        };

        AppState.metadataCache[id] = record;
        applyMetadataToVideos(id, record);
      }
    } catch {
      await fetchViaOEmbedSafe(chunk);
    }
  }
}

async function fetchViaOEmbedSafe(ids) {
  const targetIds = ids.slice(0, 40);

  const promises = targetIds.map(async (id) => {
    try {
      const targetUrl = `https://www.youtube.com/watch?v=${id}`;
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(oembedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const record = {
          title: data.title || `Entry (${id})`,
          description: `Authored by ${data.author_name || "original creator"} on YouTube.`,
          thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
          likeCount: null,
          viewCount: null,
          timestamp: Date.now()
        };

        AppState.metadataCache[id] = record;
        applyMetadataToVideos(id, record);
      }
    } catch {
      // Retains default model values safely
    }
  });

  await Promise.all(promises);
}

function applyMetadataToVideos(id, record) {
  for (const video of AppState.videos.values()) {
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
   8. UI RENDERING & DOM UPDATES
   ========================================================================== */
function renderCategoryTabs() {
  const tabsContainer = document.getElementById("categoryTabs");
  if (!tabsContainer) return;

  tabsContainer.innerHTML = "";

  const totalCount = AppState.videos.size;
  const allLi = document.createElement("li");
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = `tab-btn interactive-tactile ${AppState.activeCategory === "ALL" ? "is-active" : ""}`;
  allBtn.setAttribute("role", "tab");
  allBtn.setAttribute("aria-selected", AppState.activeCategory === "ALL" ? "true" : "false");
  allBtn.setAttribute("data-category", "ALL");
  allBtn.innerHTML = `All Archives <span class="tab-count">${totalCount}</span>`;

  allBtn.addEventListener("click", () => handleCategoryChange("ALL"));
  allLi.appendChild(allBtn);
  tabsContainer.appendChild(allLi);

  AppState.categories.forEach((cat) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `tab-btn interactive-tactile ${AppState.activeCategory === cat.name ? "is-active" : ""}`;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", AppState.activeCategory === cat.name ? "true" : "false");
    btn.setAttribute("data-category", cat.name);
    btn.innerHTML = `${escapeHTML(cat.name)} <span class="tab-count">${cat.videoIds.length}</span>`;

    btn.addEventListener("click", () => handleCategoryChange(cat.name));
    li.appendChild(btn);
    tabsContainer.appendChild(li);
  });
}

function handleCategoryChange(categoryName) {
  if (AppState.activeCategory === categoryName) return;
  triggerHapticPulse();
  AppState.activeCategory = categoryName;

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
  const activeBadgeText = document.getElementById("activeCategoryText");
  const statusNotice = document.getElementById("resultsCountNotice");

  if (!gridEl) return;

  let list = Array.from(AppState.videos.values());
  if (AppState.activeCategory !== "ALL") {
    list = list.filter((v) => v.category === AppState.activeCategory);
  }

  const query = AppState.searchQuery.trim().toLowerCase();
  if (query.length > 0) {
    list = list.filter((v) => {
      const titleMatch = v.title.toLowerCase().includes(query);
      const descMatch = v.description.toLowerCase().includes(query);
      const catMatch = v.category.toLowerCase().includes(query);
      return titleMatch || descMatch || catMatch;
    });
  }

  if (AppState.sortMode === "liked") {
    list.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
  } else if (AppState.sortMode === "views") {
    list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (AppState.sortMode === "alpha") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (activeBadgeText) {
    activeBadgeText.textContent = AppState.activeCategory === "ALL" ? "All Archives" : AppState.activeCategory;
  }
  if (statusNotice) {
    statusNotice.textContent = `${list.length} ${list.length === 1 ? "entry" : "entries"} catalogued`;
  }

  if (list.length === 0) {
    gridEl.innerHTML = "";
    if (emptyStateEl) emptyStateEl.hidden = false;
    return;
  }

  if (emptyStateEl) emptyStateEl.hidden = true;

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
  card.className = "paper-card";
  card.href = `https://www.youtube.com/watch?v=${video.id}`;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.setAttribute("data-video-id", video.id);
  card.setAttribute("aria-label", `${video.title} (Opens on YouTube in new window)`);

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "card-media";

  const img = document.createElement("img");
  img.className = "card-thumb";
  img.alt = "";
  img.loading = "lazy";
  img.width = 480;
  img.height = 270;

  img.onload = () => {
    img.classList.add("is-loaded");
  };

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
  desc.textContent = truncateString(video.description, APP_CONFIG.endpoints.excerptMaxCharacters);

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const metricsGroup = document.createElement("div");
  metricsGroup.className = "card-metrics-group";

  const likesMetric = document.createElement("span");
  likesMetric.className = "card-metric metric-likes";
  likesMetric.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
    <span class="like-number">${formatMetric(video.likeCount)}</span>
  `;

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

  card.addEventListener("click", () => {
    triggerHapticPulse();
  });

  return card;
}

function updateRenderedCards() {
  const cards = document.querySelectorAll(".paper-card[data-video-id]");
  cards.forEach((card) => {
    const id = card.getAttribute("data-video-id");
    const video = Array.from(AppState.videos.values()).find((v) => v.id === id);
    if (!video || !video.hasDetailedMeta) return;

    const titleEl = card.querySelector(".card-title");
    const descEl = card.querySelector(".card-excerpt");
    const likeEl = card.querySelector(".like-number");
    const viewEl = card.querySelector(".view-number");
    const imgEl = card.querySelector(".card-thumb");

    if (titleEl && titleEl.textContent !== video.title) {
      titleEl.textContent = video.title;
      card.setAttribute("aria-label", `${video.title} (Opens on YouTube in new window)`);
    }
    if (descEl) {
      descEl.textContent = truncateString(video.description, APP_CONFIG.endpoints.excerptMaxCharacters);
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
   9. MOBILE DOCK NAVIGATION HYDRATION
   ========================================================================== */
function renderBottomDock() {
  const dockContainer = document.getElementById("bottomDockNavItems");
  if (!dockContainer) return;

  dockContainer.innerHTML = "";
  const items = APP_CONFIG.navigation.items.filter((item) => item.enabled && item.showInBottomBar);

  const icons = {
    "icon-collection": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
    "icon-shelf": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
    "icon-search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>',
    "icon-info": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  };

  items.forEach((item) => {
    const btn = document.createElement("a");
    btn.href = item.route;
    btn.className = `nav-tab-item ${AppState.activeRoute === item.id ? "nav-tab-item--active" : ""}`;
    btn.setAttribute("data-route", item.id);
    btn.innerHTML = `
      ${icons[item.icon] || ""}
      <span>${escapeHTML(item.label)}</span>
      <span class="nav-tab-item__indicator"></span>
    `;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      triggerHapticPulse();
      handleRouteSelection(item.id);
    });

    dockContainer.appendChild(btn);
  });
}

function handleRouteSelection(routeId) {
  AppState.activeRoute = routeId;
  const tabs = document.querySelectorAll(".nav-tab-item");
  tabs.forEach((tab) => {
    tab.classList.toggle("nav-tab-item--active", tab.getAttribute("data-route") === routeId);
  });

  if (routeId === "overview") {
    AppState.activeCategory = "ALL";
    renderCategoryTabs();
    renderGallery();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (routeId === "search") {
    const searchInput = document.getElementById("librarySearch");
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (routeId === "categories") {
    const shelf = document.querySelector(".navigation-shelf");
    if (shelf) {
      shelf.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  } else if (routeId === "colophon") {
    const footer = document.querySelector(".app-footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    }
  }
}

/* ==========================================================================
   10. HYDRATION & EVENT WIRING
   ========================================================================== */
function hydrateFromConfig() {
  document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.content.headers.defaultEyebrow}`;

  const eyebrow = document.getElementById("pageEyebrowSlot");
  if (eyebrow) eyebrow.textContent = APP_CONFIG.content.headers.defaultEyebrow;

  const title = document.getElementById("pageTitleSlot");
  if (title) title.textContent = APP_CONFIG.content.headers.defaultTitle;

  const subtitle = document.getElementById("pageSubtitleSlot");
  if (subtitle) subtitle.textContent = APP_CONFIG.content.headers.defaultSubtitle;

  const emptyHeading = document.getElementById("emptyStateHeading");
  if (emptyHeading) emptyHeading.textContent = APP_CONFIG.content.emptyStates.noDataHeading;

  const emptyDesc = document.getElementById("emptyStateDescription");
  if (emptyDesc) emptyDesc.textContent = APP_CONFIG.content.emptyStates.noDataDescription;

  const footerBrand = document.getElementById("footerBrandTitle");
  if (footerBrand) footerBrand.textContent = APP_CONFIG.identity.appName.toUpperCase();

  const footerLegal = document.getElementById("footerLegal");
  if (footerLegal) footerLegal.textContent = `© ${APP_CONFIG.content.legal.establishedYear} ${APP_CONFIG.content.legal.copyrightHolder}`;

  const backBtn = document.getElementById("globalBackButton");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      triggerHapticPulse();
      if (AppState.activeCategory !== "ALL" || AppState.searchQuery.length > 0) {
        AppState.activeCategory = "ALL";
        AppState.searchQuery = "";
        const searchInput = document.getElementById("librarySearch");
        if (searchInput) searchInput.value = "";
        renderCategoryTabs();
        renderGallery();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  renderBottomDock();
}

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
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function setupEventListeners() {
  const searchInput = document.getElementById("librarySearch");
  const clearBtn = document.getElementById("searchClearBtn");
  const sortSelect = document.getElementById("sortSelector");
  const resetBtn = document.getElementById("resetFiltersBtn");
  const fileInput = document.getElementById("csvFileInput");

  let debounceTimer = null;
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearBtn) clearBtn.hidden = val.length === 0;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        AppState.searchQuery = val;
        renderGallery();
      }, 100);
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener("click", () => {
      triggerHapticPulse();
      searchInput.value = "";
      clearBtn.hidden = true;
      AppState.searchQuery = "";
      searchInput.focus();
      renderGallery();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      triggerHapticPulse();
      AppState.sortMode = e.target.value;
      renderGallery();
    });
  }

  if (resetBtn && searchInput) {
    resetBtn.addEventListener("click", () => {
      triggerHapticPulse();
      searchInput.value = "";
      if (clearBtn) clearBtn.hidden = true;
      AppState.searchQuery = "";
      AppState.activeCategory = "ALL";
      renderCategoryTabs();
      renderGallery();
    });
  }

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

  // Global delegation for tactile haptic feedback
  document.addEventListener("click", (e) => {
    const el = e.target.closest(".interactive-tactile, .btn-back-nav, .nav-tab-item");
    if (el) {
      triggerHapticPulse();
    }
  });
}

/* ==========================================================================
   11. INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  hydrateFromConfig();
  setupEventListeners();
  initLibrary();
});