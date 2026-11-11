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
    appId: "curator-asset-studio",
    appName: "Asset & Folder Studio",
    appTagline: "Archive Directory Compiler & Asset Staging Architecture",
    version: "2.5.0",
    environment: "production",
    canonicalUrl: "https://studio.curatorarchive.internal",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    eyebrowText: "ASSET ARCHITECT",
    accentColor: "#963E35",      // Accessible Terracotta Red
    accentSecondary: "#3E5B42",  // Accessible Sage Green
    accentHighlight: "#6E5614",  // Accessible Warm Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilyMono: "'JetBrains Mono', monospace",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "welcome",
    items: [
      { id: "workbench", label: "Workbench", icon: "grid", route: "#workbench", enabled: true, showInBottomBar: true },
      { id: "addFolder", label: "New Folder", icon: "folder-plus", route: "#addFolder", enabled: true, showInBottomBar: true },
      { id: "upload", label: "Stage", icon: "upload", route: "#upload", enabled: true, showInBottomBar: true },
      { id: "export", label: "Export", icon: "download", route: "#export", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultTitle: "Asset & Folder Studio",
      defaultSubtitle: "Structure category subdirectories, normalize filenames, inspect binaries, and compile deployment-ready archives.",
      workbenchTitle: "Catalog Workbench",
      workbenchSubtitle: "Review staged assets, audit normalized document titles, and compile archives.",
    },
    emptyStates: {
      noDataHeading: "No Staged Assets in Workspace",
      noDataDescription: "Select 'New Folder' to establish a category or drop documents to stage them immediately.",
      noSearchResultsHeading: "No Matching Assets Located",
      noSearchResultsDescription: "Review your filter parameters or query terms and attempt the search again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Category",
      delete: "Remove Permanently",
      retry: "Retry Operation",
      back: "Return to Welcome",
    },
    notifications: {
      folderCreated: "Created folder directory: ",
      filesStaged: "Document(s) successfully staged into: ",
      fileRenamed: "Asset filename normalized to: ",
      fileRemoved: "Asset removed from active session.",
      zipGenerated: "assets.zip compiled and downloaded successfully.",
      jsonExported: "assets.json catalog manifest exported.",
      directFsSuccess: "All assets and category subdirectories written directly to disk.",
    },
    wizard: {
      step1Title: "Select Destination Directory",
      step2Title: "Select Files from Workstation",
      step3Title: "Review Clean Title Normalization",
    }
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "archivist@curatorstudio.internal",
    documentationUrl: "https://curatorstudio.internal/docs",
    specVersion: "Directory Hierarchy Specification v2.1",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms mobile micro-vibrations
    enableSmoothPageTransitions: true, // Kinetic transitions
    enableDirectFileSystemAccess: true,// Chromium showDirectoryPicker
    enableZipCompression: true,        // Built-in zero-dependency PKZIP
    defaultCategory: "General",
  },

  // 7. RECOGNIZED FORMAT SPECS
  formatSpecs: {
    document: ["pdf", "doc", "docx", "odt", "rtf", "pages"],
    sheet: ["xls", "xlsx", "csv", "numbers", "tsv"],
    slides: ["ppt", "pptx", "key"],
    media: ["jpg", "jpeg", "png", "webp", "gif", "svg", "mp4", "webm", "mov", "mp3", "wav", "ogg", "m4a", "flac"],
    code: ["txt", "md", "json", "html", "css", "js", "ts", "py", "sql", "sh", "yaml", "yml", "xml"]
  }
});

/**
 * =========================================================================
 * APPLICATION STATE MANAGEMENT
 * =========================================================================
 */
const StudioState = {
  categories: new Set([APP_CONFIG.features.defaultCategory]),
  activeCategory: "ALL",
  activeFormatChip: "ALL",
  searchQuery: "",
  stagedFiles: [], // Array of { id, category, filename, title, ext, size, fileBlob, url, typeGroup }
  wizardData: {
    category: "",
    files: []
  },
  currentView: "welcome" // "welcome" | "workbench"
};

/**
 * =========================================================================
 * INITIALIZATION & HYDRATION
 * =========================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
  hydrateAppConfig();
  initEventListeners();
});

function hydrateAppConfig() {
  document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.branding.eyebrowText}`;
  
  const eyebrow = document.getElementById("pageEyebrowSlot");
  if (eyebrow) eyebrow.textContent = APP_CONFIG.branding.eyebrowText;

  const titleSlot = document.getElementById("pageTitleSlot");
  if (titleSlot) titleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;

  const subtitleSlot = document.getElementById("pageSubtitleSlot");
  if (subtitleSlot) subtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;

  const emptyHeading = document.getElementById("emptyStateHeading");
  if (emptyHeading) emptyHeading.textContent = APP_CONFIG.content.emptyStates.noDataHeading;

  const emptyDesc = document.getElementById("emptyStateDesc");
  if (emptyDesc) emptyDesc.textContent = APP_CONFIG.content.emptyStates.noDataDescription;
}

function initEventListeners() {
  // Navigation & Back Button
  const globalBackBtn = document.getElementById("globalBackBtn");
  globalBackBtn.addEventListener("click", handleGlobalBack);

  // Opening Starter Actions
  document.getElementById("startFreshBtn").addEventListener("click", () => enterWorkspace());
  document.getElementById("openWizardBtn").addEventListener("click", openWizardModal);

  // Folder & JSON Importers
  document.getElementById("importFolderInput").addEventListener("change", handleImportFolder);
  document.getElementById("importJsonInput").addEventListener("change", handleImportJson);

  // Header System Actions
  document.getElementById("resetWorkspaceBtn").addEventListener("click", confirmResetWorkspace);
  document.getElementById("quickGuideBtn").addEventListener("click", () => toggleModal("guideModal", true));
  document.getElementById("closeGuideModal").addEventListener("click", () => toggleModal("guideModal", false));
  document.getElementById("closeGuideBtn").addEventListener("click", () => toggleModal("guideModal", false));

  // Category Creation Modal
  document.getElementById("addCategoryBtn").addEventListener("click", openCategoryModal);
  document.getElementById("closeCategoryModal").addEventListener("click", () => toggleModal("categoryModal", false));
  document.getElementById("cancelCategoryBtn").addEventListener("click", () => toggleModal("categoryModal", false));
  document.getElementById("saveCategoryBtn").addEventListener("click", saveCategoryModal);

  // Suggestion Pills
  document.querySelectorAll(".sug-pill").forEach(pill => {
    pill.addEventListener("click", e => {
      document.getElementById("categoryNameInput").value = e.target.dataset.name;
    });
  });

  // Batch Staging Actions
  const batchInput = document.getElementById("batchFileInput");
  document.getElementById("uploadFilesBtn").addEventListener("click", () => batchInput.click());
  batchInput.addEventListener("change", e => handleBatchFilesSelected(e.target.files));

  // Drag and Drop Zone
  const dropZone = document.getElementById("dropZone");
  dropZone.addEventListener("click", () => batchInput.click());
  dropZone.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      batchInput.click();
    }
  });
  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleBatchFilesSelected(e.dataTransfer.files);
    }
  });

  // Export Menu Toggle
  const exportMainBtn = document.getElementById("exportMainBtn");
  const exportMenu = document.getElementById("exportMenu");
  exportMainBtn.addEventListener("click", e => {
    e.stopPropagation();
    const isHidden = exportMenu.classList.toggle("hidden");
    exportMainBtn.setAttribute("aria-expanded", (!isHidden).toString());
  });
  document.addEventListener("click", () => {
    exportMenu.classList.add("hidden");
    exportMainBtn.setAttribute("aria-expanded", "false");
  });

  // Export Action Handlers
  document.getElementById("exportZipBtn").addEventListener("click", exportAssetsZip);
  document.getElementById("exportDirectFsBtn").addEventListener("click", exportDirectFileSystem);
  document.getElementById("exportJsonBtn").addEventListener("click", exportAssetsJson);

  // Search & Filter
  const searchInput = document.getElementById("studioSearchInput");
  const clearSearchBtn = document.getElementById("clearStudioSearch");
  searchInput.addEventListener("input", e => {
    StudioState.searchQuery = e.target.value.toLowerCase().trim();
    clearSearchBtn.classList.toggle("hidden", !StudioState.searchQuery);
    renderStagedFiles();
  });
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    StudioState.searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    renderStagedFiles();
    searchInput.focus();
  });

  // Format Filter Chips
  document.getElementById("studioFormatChips").addEventListener("click", e => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    document.querySelectorAll("#studioFormatChips .filter-chip").forEach(c => c.classList.remove("filter-chip--active"));
    chip.classList.add("filter-chip--active");
    StudioState.activeFormatChip = chip.dataset.format;
    renderStagedFiles();
  });

  // Mobile Bottom Dock Controls
  document.getElementById("dockBtnWorkbench").addEventListener("click", () => {
    enterWorkspace();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("dockBtnAddFolder").addEventListener("click", openCategoryModal);
  document.getElementById("dockBtnUpload").addEventListener("click", () => batchInput.click());
  document.getElementById("dockBtnExport").addEventListener("click", () => {
    exportMainBtn.click();
    window.scrollTo({ top: exportMainBtn.offsetTop - 80, behavior: "smooth" });
  });

  // Wizard & Inspector Listeners
  initWizardEvents();
  document.getElementById("closePreviewModal").addEventListener("click", () => toggleModal("previewModal", false));

  // Global Tactile Micro-Haptics
  document.addEventListener("click", e => {
    if (e.target.closest(".interactive-tactile, .filter-chip, .tab-pill, .nav-tab-item")) {
      triggerHapticPulse();
    }
  });
}

function handleGlobalBack() {
  if (StudioState.currentView === "workbench") {
    document.getElementById("workspaceSection").classList.add("hidden");
    document.getElementById("onboardingSection").classList.remove("hidden");
    document.getElementById("backBtnLabel").textContent = "Back";
    document.getElementById("pageTitleSlot").textContent = APP_CONFIG.content.headers.defaultTitle;
    document.getElementById("pageSubtitleSlot").textContent = APP_CONFIG.content.headers.defaultSubtitle;
    StudioState.currentView = "welcome";
  } else {
    showBanner("Already at the root welcome view.");
  }
}

function enterWorkspace() {
  document.getElementById("onboardingSection").classList.add("hidden");
  document.getElementById("workspaceSection").classList.remove("hidden");
  document.getElementById("backBtnLabel").textContent = "Overview";
  document.getElementById("pageTitleSlot").textContent = APP_CONFIG.content.headers.workbenchTitle;
  document.getElementById("pageSubtitleSlot").textContent = APP_CONFIG.content.headers.workbenchSubtitle;
  StudioState.currentView = "workbench";
  renderCategoryTrack();
  renderStagedFiles();
}

function confirmResetWorkspace() {
  if (StudioState.stagedFiles.length === 0) {
    location.reload();
    return;
  }
  if (confirm("Reset current studio workspace? Any unsaved staging configurations will be cleared.")) {
    location.reload();
  }
}

/**
 * =========================================================================
 * CATEGORY TRACK & STAGING ARCHITECTURE
 * =========================================================================
 */
function renderCategoryTrack() {
  const track = document.getElementById("studioCategoryTrack");
  track.innerHTML = "";

  const createPill = (catName, count) => {
    const btn = document.createElement("button");
    btn.type = "button";
    const isActive = StudioState.activeCategory === catName;
    btn.className = `tab-pill interactive-tactile ${isActive ? "tab-pill--active" : ""}`;
    btn.textContent = `${catName} (${count})`;
    btn.onclick = () => {
      StudioState.activeCategory = catName;
      document.getElementById("activeTargetCategoryLabel").textContent = catName;
      renderCategoryTrack();
      renderStagedFiles();
    };
    return btn;
  };

  track.appendChild(createPill("ALL", StudioState.stagedFiles.length));

  Array.from(StudioState.categories).sort().forEach(cat => {
    const count = StudioState.stagedFiles.filter(f => f.category === cat).length;
    track.appendChild(createPill(cat, count));
  });

  document.getElementById("activeTargetCategoryLabel").textContent = StudioState.activeCategory;
}

function openCategoryModal() {
  const input = document.getElementById("categoryNameInput");
  input.value = "";
  document.getElementById("categoryErrorMsg").classList.add("hidden");
  toggleModal("categoryModal", true);
  setTimeout(() => input.focus(), 50);
}

function saveCategoryModal() {
  const input = document.getElementById("categoryNameInput");
  const err = document.getElementById("categoryErrorMsg");
  const safeName = input.value.trim().replace(/[\\/:*?"<>|]+/g, "");

  if (!safeName) {
    err.textContent = "Folder name cannot be empty or contain invalid path characters (/ \\ : * ? \" < > |).";
    err.classList.remove("hidden");
    return;
  }

  StudioState.categories.add(safeName);
  StudioState.activeCategory = safeName;
  toggleModal("categoryModal", false);
  renderCategoryTrack();
  renderStagedFiles();
  showBanner(`${APP_CONFIG.content.notifications.folderCreated}"assets/${safeName}/"`);
}

function handleBatchFilesSelected(fileList) {
  if (!fileList || fileList.length === 0) return;

  let targetCat = StudioState.activeCategory;
  if (targetCat === "ALL") {
    targetCat = Array.from(StudioState.categories)[0] || APP_CONFIG.features.defaultCategory;
    StudioState.categories.add(targetCat);
  }

  Array.from(fileList).forEach(file => {
    stageNewFile(file, targetCat);
  });

  renderCategoryTrack();
  renderStagedFiles();
  showBanner(`${APP_CONFIG.content.notifications.filesStaged}"assets/${targetCat}/"`);
}

function stageNewFile(fileBlob, category, customFilename = null) {
  const rawName = customFilename || fileBlob.name;
  const ext = (rawName.split(".").pop() || "").toLowerCase();
  const cleanTitle = rawName.substring(0, rawName.lastIndexOf(".")) || rawName;
  const normalizedTitle = cleanTitle.replace(/[_-]+/g, " ").trim();

  const fileItem = {
    id: "doc_" + Math.random().toString(36).substring(2, 9),
    category: category,
    filename: rawName,
    title: normalizedTitle,
    ext: ext,
    size: fileBlob.size || 0,
    fileBlob: fileBlob,
    url: URL.createObjectURL(fileBlob),
    typeGroup: detectTypeGroup(ext)
  };

  StudioState.stagedFiles.push(fileItem);
}

function detectTypeGroup(ext) {
  for (const [group, exts] of Object.entries(APP_CONFIG.formatSpecs)) {
    if (exts.includes(ext)) return group;
  }
  return "other";
}

/**
 * =========================================================================
 * RENDERING ASSETS (PAPER CARD MATRIX)
 * =========================================================================
 */
function renderStagedFiles() {
  const container = document.getElementById("fileCatalogContainer");
  const emptyState = document.getElementById("emptyCatalogState");
  const metaCounter = document.getElementById("studioMetaCounter");

  metaCounter.textContent = `${StudioState.categories.size} folders · ${StudioState.stagedFiles.length} staged assets`;

  const q = StudioState.searchQuery;
  const cat = StudioState.activeCategory;
  const format = StudioState.activeFormatChip;

  const filtered = StudioState.stagedFiles.filter(item => {
    const matchesCat = cat === "ALL" || item.category === cat;
    const matchesFormat = format === "ALL" || item.typeGroup === format;
    const matchesSearch = !q ||
      item.title.toLowerCase().includes(q) ||
      item.filename.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.ext.includes(q);

    return matchesCat && matchesFormat && matchesSearch;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    const h = document.getElementById("emptyStateHeading");
    const d = document.getElementById("emptyStateDesc");
    if (q) {
      h.textContent = APP_CONFIG.content.emptyStates.noSearchResultsHeading;
      d.textContent = APP_CONFIG.content.emptyStates.noSearchResultsDescription;
    } else {
      h.textContent = APP_CONFIG.content.emptyStates.noDataHeading;
      d.textContent = APP_CONFIG.content.emptyStates.noDataDescription;
    }
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "paper-card";
    card.setAttribute("data-id", item.id);

    card.innerHTML = `
      <div class="doc-top-block">
        <div class="doc-badge-row">
          <div class="doc-ext-glyph">${escapeHTML(item.ext.toUpperCase())}</div>
          <div class="doc-titles">
            <span class="doc-category-tag">${escapeHTML(item.category)}</span>
            <h3 class="doc-name">${escapeHTML(item.title)}</h3>
            <span class="doc-file-raw">assets/${escapeHTML(item.category)}/${escapeHTML(item.filename)}</span>
          </div>
        </div>
      </div>
      <div class="doc-card-meta">
        <span class="doc-size-tag">${formatBytes(item.size)}</span>
        <div class="doc-action-group">
          <button type="button" class="doc-btn interactive-tactile btn-preview" aria-label="Inspect ${escapeHTML(item.title)}">Inspect</button>
          <button type="button" class="doc-btn interactive-tactile btn-rename" aria-label="Rename ${escapeHTML(item.title)}">Rename</button>
          <button type="button" class="doc-btn interactive-tactile danger btn-delete" aria-label="Remove ${escapeHTML(item.title)}">Remove</button>
        </div>
      </div>
    `;

    card.querySelector(".btn-preview").onclick = () => openInspector(item);
    card.querySelector(".btn-rename").onclick = () => promptRename(item);
    card.querySelector(".btn-delete").onclick = () => deleteStagedFile(item.id);

    container.appendChild(card);
  });
}

function promptRename(item) {
  const newName = prompt("Rename asset filename (including extension):", item.filename);
  if (!newName || newName.trim() === "" || newName === item.filename) return;

  const safe = newName.replace(/[\\/:*?"<>|]+/g, "").trim();
  item.filename = safe;
  item.ext = (safe.split(".").pop() || "").toLowerCase();
  const cleanTitle = safe.substring(0, safe.lastIndexOf(".")) || safe;
  item.title = cleanTitle.replace(/[_-]+/g, " ").trim();
  item.typeGroup = detectTypeGroup(item.ext);

  renderStagedFiles();
  showBanner(`${APP_CONFIG.content.notifications.fileRenamed}"${safe}"`);
}

function deleteStagedFile(id) {
  StudioState.stagedFiles = StudioState.stagedFiles.filter(f => f.id !== id);
  renderCategoryTrack();
  renderStagedFiles();
  showBanner(APP_CONFIG.content.notifications.fileRemoved);
}

/**
 * =========================================================================
 * IMPORT EXISTING ASSETS (assets/ FOLDER OR assets.json)
 * =========================================================================
 */
function handleImportFolder(e) {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  let count = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.webkitRelativePath.replace(/\\/g, "/");
    const parts = path.split("/");

    if (parts.length >= 3) {
      const cat = parts[1];
      const filename = parts.slice(2).join("/");

      if (!filename.startsWith(".") && !filename.toLowerCase().endsWith(".gitkeep")) {
        StudioState.categories.add(cat);
        stageNewFile(file, cat, filename);
        count++;
      }
    }
  }

  if (count > 0) {
    enterWorkspace();
    showBanner(`Mounted ${count} assets across ${StudioState.categories.size} folders.`);
  } else {
    alert("Could not identify categories. Ensure folder structure matches: assets/CategoryName/Document.ext");
  }
}

async function handleImportJson(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.category && item.filename) {
          StudioState.categories.add(item.category);
          const syntheticBlob = new Blob([""], { type: "application/octet-stream" });
          stageNewFile(syntheticBlob, item.category, item.filename);
        }
      });
      enterWorkspace();
      showBanner(`Successfully hydrated ${data.length} records from manifest.`);
    } else {
      alert("Invalid JSON format. Expected an array of records.");
    }
  } catch (err) {
    alert("Manifest error: " + err.message);
  }
}

/**
 * =========================================================================
 * GUIDED 3-STEP WIZARD
 * =========================================================================
 */
let wizardStep = 1;

function openWizardModal() {
  wizardStep = 1;
  StudioState.wizardData = { category: "", files: [] };

  const select = document.getElementById("wizardCategorySelect");
  select.innerHTML = "";
  StudioState.categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  updateWizardStepView();
  toggleModal("wizardModal", true);
}

function initWizardEvents() {
  document.getElementById("closeWizardModal").addEventListener("click", () => toggleModal("wizardModal", false));

  document.getElementById("wizardFilesInput").addEventListener("change", e => {
    const files = Array.from(e.target.files || []);
    StudioState.wizardData.files = files;
    document.getElementById("wizardFileSelectionSummary").textContent = `${files.length} file(s) staged`;

    const previewList = document.getElementById("wizardFileListPreview");
    previewList.innerHTML = "";
    files.forEach(f => {
      const row = document.createElement("div");
      row.className = "wizard-file-item";
      row.innerHTML = `<span>${escapeHTML(f.name)}</span><span class="doc-size-tag">${formatBytes(f.size)}</span>`;
      previewList.appendChild(row);
    });
  });

  document.getElementById("wizardNextBtn").addEventListener("click", () => {
    if (wizardStep === 1) {
      const newCat = document.getElementById("wizardNewCategoryInput").value.trim().replace(/[\\/:*?"<>|]+/g, "");
      const selCat = document.getElementById("wizardCategorySelect").value;
      const finalCat = newCat || selCat || APP_CONFIG.features.defaultCategory;
      StudioState.categories.add(finalCat);
      StudioState.wizardData.category = finalCat;
      wizardStep = 2;
      updateWizardStepView();
    } else if (wizardStep === 2) {
      if (StudioState.wizardData.files.length === 0) {
        alert("Please select at least one document to proceed.");
        return;
      }
      wizardStep = 3;
      buildWizardReviewStep();
      updateWizardStepView();
    } else if (wizardStep === 3) {
      StudioState.wizardData.files.forEach(f => {
        stageNewFile(f, StudioState.wizardData.category);
      });
      toggleModal("wizardModal", false);
      enterWorkspace();
      showBanner(`${APP_CONFIG.content.notifications.filesStaged}"assets/${StudioState.wizardData.category}/"`);
    }
  });

  document.getElementById("wizardPrevBtn").addEventListener("click", () => {
    if (wizardStep > 1) {
      wizardStep--;
      updateWizardStepView();
    }
  });
}

function updateWizardStepView() {
  document.getElementById("wizardStepBadge").textContent = `Step ${wizardStep} of 3`;
  document.getElementById("wizardStep1").classList.toggle("hidden", wizardStep !== 1);
  document.getElementById("wizardStep2").classList.toggle("hidden", wizardStep !== 2);
  document.getElementById("wizardStep3").classList.toggle("hidden", wizardStep !== 3);

  document.getElementById("wizardPrevBtn").classList.toggle("hidden", wizardStep === 1);
  document.getElementById("wizardNextBtn").textContent = wizardStep === 3 ? "Commit Staged Files" : "Next Step";

  const titles = [
    APP_CONFIG.content.wizard.step1Title,
    APP_CONFIG.content.wizard.step2Title,
    APP_CONFIG.content.wizard.step3Title
  ];
  document.getElementById("wizardTitle").textContent = titles[wizardStep - 1];
}

function buildWizardReviewStep() {
  const container = document.getElementById("wizardSanitizationPreview");
  container.innerHTML = "";
  const cat = StudioState.wizardData.category;

  StudioState.wizardData.files.forEach(file => {
    const rawName = file.name;
    const cleanTitle = (rawName.substring(0, rawName.lastIndexOf(".")) || rawName).replace(/[_-]+/g, " ").trim();

    const row = document.createElement("div");
    row.className = "review-row";
    row.innerHTML = `
      <div class="review-title">${escapeHTML(cleanTitle)}</div>
      <div class="review-path">Path: assets/${escapeHTML(cat)}/${escapeHTML(rawName)}</div>
    `;
    container.appendChild(row);
  });
}

/**
 * =========================================================================
 * ZERO-DEPENDENCY PKZIP ARCHIVE GENERATOR
 * =========================================================================
 */
async function exportAssetsZip() {
  if (StudioState.stagedFiles.length === 0) {
    alert("No files staged to export.");
    return;
  }

  showBanner("Compiling assets.zip archive…");

  try {
    const entries = [];

    for (const item of StudioState.stagedFiles) {
      const path = `assets/${item.category}/${item.filename}`;
      let dataUint8;

      if (item.fileBlob) {
        const buffer = await item.fileBlob.arrayBuffer();
        dataUint8 = new Uint8Array(buffer);
      } else {
        dataUint8 = new Uint8Array(0);
      }

      entries.push({ path: path, data: dataUint8 });
    }

    const zipBlob = createPkZipBlob(entries);
    downloadBlob(zipBlob, "assets.zip");
    showBanner(APP_CONFIG.content.notifications.zipGenerated);
  } catch (err) {
    alert("ZIP export failed: " + err.message);
  }
}

function createPkZipBlob(entries) {
  const localHeaders = [];
  const centralHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const encoder = new TextEncoder();
    const pathBytes = encoder.encode(entry.path);
    const dataBytes = entry.data;
    const crc = computeCrc32(dataBytes);

    // Local Header (30 bytes + path length)
    const localHeader = new Uint8Array(30 + pathBytes.length);
    const lv = new DataView(localHeader.buffer);

    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0x4800, true);
    lv.setUint16(12, 0x5800, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, pathBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(pathBytes, 30);

    localHeaders.push(localHeader);
    localHeaders.push(dataBytes);

    // Central Directory Header (46 bytes + path length)
    const centralHeader = new Uint8Array(46 + pathBytes.length);
    const cv = new DataView(centralHeader.buffer);

    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0x4800, true);
    cv.setUint16(14, 0x5800, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, pathBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(pathBytes, 46);

    centralHeaders.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  centralHeaders.forEach(ch => { cdSize += ch.length; });

  // End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, cdSize, true);
  ev.setUint32(16, cdOffset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localHeaders, ...centralHeaders, eocd], { type: "application/zip" });
}

let crcTable = null;
function computeCrc32(bytes) {
  if (!crcTable) {
    crcTable = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      crcTable[i] = c;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * =========================================================================
 * FILE SYSTEM API & MANIFEST EXPORTERS
 * =========================================================================
 */
async function exportDirectFileSystem() {
  if (!("showDirectoryPicker" in window)) {
    alert("The Direct Folder API is supported in Chromium browsers (Chrome, Edge). Please use 'Archive Package (assets.zip)'.");
    return;
  }

  if (StudioState.stagedFiles.length === 0) {
    alert("No files staged to export.");
    return;
  }

  try {
    showBanner("Select target website root directory…");
    const rootHandle = await window.showDirectoryPicker();
    const assetsHandle = await rootHandle.getDirectoryHandle("assets", { create: true });

    for (const item of StudioState.stagedFiles) {
      const catHandle = await assetsHandle.getDirectoryHandle(item.category, { create: true });
      const fileHandle = await catHandle.getFileHandle(item.filename, { create: true });
      const writable = await fileHandle.createWritable();

      if (item.fileBlob) {
        await writable.write(item.fileBlob);
      }
      await writable.close();
    }

    showBanner(APP_CONFIG.content.notifications.directFsSuccess);
  } catch (err) {
    if (err.name !== "AbortError") {
      alert("Filesystem error: " + err.message);
    }
  }
}

function exportAssetsJson() {
  if (StudioState.stagedFiles.length === 0) {
    alert("No files staged to export.");
    return;
  }

  const catalog = StudioState.stagedFiles.map(doc => ({
    category: doc.category,
    filename: doc.filename,
    title: doc.title,
    path: `assets/${doc.category}/${doc.filename}`,
    url: `assets/${doc.category}/${doc.filename}`,
    size: doc.size
  }));

  const jsonStr = JSON.stringify(catalog, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  downloadBlob(blob, "assets.json");
  showBanner(APP_CONFIG.content.notifications.jsonExported);
}

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}

/**
 * =========================================================================
 * ASSET INSPECTOR VIEWPORT
 * =========================================================================
 */
function openInspector(item) {
  document.getElementById("prevModalCat").textContent = item.category;
  document.getElementById("prevModalExt").textContent = item.ext.toUpperCase();
  document.getElementById("prevModalTitle").textContent = item.filename;
  document.getElementById("prevModalSize").textContent = `Size: ${formatBytes(item.size)}`;
  document.getElementById("prevModalPath").textContent = `assets/${item.category}/${item.filename}`;

  const stage = document.getElementById("previewStage");
  stage.innerHTML = "";

  if (item.ext === "pdf") {
    stage.innerHTML = `<iframe src="${item.url}#view=FitH" title="PDF Preview"></iframe>`;
  } else if (["png", "jpg", "jpeg", "webp", "gif", "svg"].includes(item.ext)) {
    stage.innerHTML = `<img src="${item.url}" alt="${escapeHTML(item.title)}">`;
  } else if (["mp3", "wav", "ogg", "m4a", "flac"].includes(item.ext)) {
    stage.innerHTML = `
      <div class="audio-stage-card">
        <div class="audio-glyph">♬</div>
        <h4>${escapeHTML(item.title)}</h4>
        <audio controls src="${item.url}" style="margin-top:1rem; width: 100%;"></audio>
      </div>`;
  } else if (["mp4", "webm", "mov"].includes(item.ext)) {
    stage.innerHTML = `<video controls autoplay playsinline src="${item.url}"></video>`;
  } else if (APP_CONFIG.formatSpecs.code.includes(item.ext) || ["csv", "tsv"].includes(item.ext)) {
    if (item.fileBlob) {
      item.fileBlob.text().then(txt => {
        stage.innerHTML = `<pre><code>${escapeHTML(txt)}</code></pre>`;
      });
    }
  } else {
    stage.innerHTML = `
      <div style="text-align:center; padding:2rem; color:var(--color-text-muted);">
        <p>Binary format (${item.ext.toUpperCase()}) cannot be rendered directly in the inspector.</p>
      </div>`;
  }

  document.getElementById("prevModalRenameBtn").onclick = () => {
    promptRename(item);
    openInspector(item);
  };

  document.getElementById("prevModalDeleteBtn").onclick = () => {
    deleteStagedFile(item.id);
    toggleModal("previewModal", false);
  };

  toggleModal("previewModal", true);
}

/**
 * =========================================================================
 * UTILITIES, SENSORY & ACCESSIBILITY HELPERS
 * =========================================================================
 */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12);
    } catch (e) {
      // Graceful fallback for non-supported browsers
    }
  }
}

function toggleModal(id, show) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) {
    el.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    el.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function showBanner(msg) {
  const b = document.getElementById("statusBanner");
  document.getElementById("statusMsg").textContent = msg;
  b.classList.remove("hidden");
  setTimeout(() => b.classList.add("hidden"), 4200);
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}