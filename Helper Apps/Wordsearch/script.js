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
    appId: "word-search-curator-suite",
    appName: "Curator Ledger",
    appTagline: "Word Search CSV Studio & Puzzle Engine",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "https://ledger.wordsearchstudio.internal",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "",
    logoAlt: "Word Search Curator Seal",
    accentColor: "#963E35",       // Accessible Terracotta Red
    accentSecondary: "#3E5B42",   // Accessible Sage Green
    accentHighlight: "#6E5614",   // Accessible Warm Ochre
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', sans-serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "overview",
    items: [
      { id: "overview", label: "Overview", icon: "icon-overview", route: "#overview", enabled: true, showInBottomBar: true },
      { id: "ledger", label: "Ledger", icon: "icon-ledger", route: "#ledger", enabled: true, showInBottomBar: true },
      { id: "audit", label: "Audit", icon: "icon-audit", route: "#audit", enabled: true, showInBottomBar: true },
      { id: "guide", label: "Guide", icon: "icon-guide", route: "#guide", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultTitle: "Curator Ledger",
      defaultSubtitle: "Curate, validate, and simulate grid-compliant CSV ledgers tailored for word search engines.",
      welcomeEyebrow: "PUZZLE ENGINE SUITE",
      workspaceEyebrow: "OPERATIONAL LEDGER",
    },
    emptyStates: {
      noDataHeading: "No Records Currently Documented",
      noDataDescription: "This operational log is clear. Create a new entry using the primary action below to initiate records.",
      noSearchResultsHeading: "No Matching Records Found",
      noSearchResultsDescription: "Review your filter parameters or search terms and attempt the query again.",
    },
    notifications: {
      saveSuccess: "Puzzle entry successfully committed to active ledger.",
      duplicateSuccess: "Theme record duplicated with operational safety.",
      deleteSuccess: "Record permanently removed from workspace ledger.",
      restoreDraftSuccess: "Restored your previously active ledger draft.",
      copySuccess: "RFC 4180 CSV copied cleanly to system clipboard.",
      emptyFileWarning: "Uploaded file appears empty or lacks headers.",
      headerMismatchWarning: "File header mismatch! Expected: title,mini,midi,main",
    },
    legal: {
      copyrightHolder: "Editorial Ledger Systems LLC",
      establishedYear: 2026,
    },
  },

  // 5. ENGINE RULES & SCHEMA CONSTRAINTS
  schema: {
    expectedHeaders: ["title", "mini", "midi", "main"],
    tiers: {
      mini: { name: "Mini", gridSize: 8, maxWordLen: 8, minWordLen: 2, recWords: 6 },
      midi: { name: "Midi", gridSize: 10, maxWordLen: 10, minWordLen: 2, recWords: 7 },
      main: { name: "Main", gridSize: 12, maxWordLen: 12, minWordLen: 2, recWords: 8 },
    },
    defaultFilename: "puzzles.csv",
    storageKeys: {
      draft: "els_wordsearch_draft_v2",
    },
  },

  // 6. FEATURE SWITCHES & INTERACTION CONTROLS
  features: {
    enableHapticFeedback: true,         // Gentle navigator.vibrate() on mobile touches
    enableAutoSave: true,                // Automatic localStorage sync
    enableStrictRFC4180Escaping: true,   // Full double-quote escaping for commas/breaks
  },
});

/**
 * =========================================================================
 * PRE-CURATED REFERENCE COCKTAIL DATASET (RFC 4180 PRODUCTION COMPLIANT)
 * =========================================================================
 */
const DEFAULT_SAMPLE_CSV = `title,mini,midi,main
Classic Cocktails,"SOUR,FIZZ,MULE,PUNCH,GIMLET,SMASH","NEGRONI,MARTINI,DAIQUIRI,SIDECAR,PALOMA,COLLINS,SAZERAC","MANHATTAN,MARGARITA,BOULEVARDIER,VIEUXCARRE,COSMOPOLITAN,AVIATION,MAITAI"
Bar Tools,"SPOON,TINS,JIGGER,BLADE,POUR,TONGS","SHAKER,MUDDLER,PEELER,STRAINER,CHANNEL,ZESTER,MALLET","MIXINGGLASS,HAWTHORNE,JULEPSTRAINER,FINESTRAINER,CITRUSPRESS,SPEEDPOURER,BARFORK,ICEPICK"
Gin & Botanicals,"GIN,BERRY,PINE,BARK,HERB,PEEL","JUNIPER,GENEVER,CORIANDER,ANGELICA,BOTANICAL,CITRUS,OLDTOM","LONDONDRY,ORRISROOT,CARDAMOM,CASSIABARK,DISTILLERY,PLYMOUTH,GRAINSPIRIT"
Whiskies of the World,"PEAT,CASK,MALT,CORN,RYE,OAK","SCOTCH,BOURBON,BARREL,SINGLE,ISLAY,POTSTILL,BLENDED","DISTILLATION,SINGLEMALT,SPEYSIDE,CHARREDOAK,KENTUCKY,MATURATION,HIGHLAND"
Agave Spirits,"AGAVE,PINA,SMOKE,EARTH,CLAY,FIRE","BLANCO,REPOSADO,MEZCAL,TEQUILA,OAXACA,COPITA,ESPADIN","BLUEAGAVE,JALISCO,EXTRAANEJO,TERROIR,DISTILLERY,TOBALA,PITROASTED"`;

/**
 * =========================================================================
 * APP STATE CONTAINER
 * =========================================================================
 */
const STATE = {
  records: [],           // [{ id, title, mini, midi, main, isNew }]
  activeRecordIndex: -1, // -1: creating new, >= 0: editing existing
  currentStep: 1,        // Wizard step: 1 - 5
  viewMode: "friendly",  // "friendly" | "technical"
  searchQuery: "",
  simTier: "mini",       // "mini" | "midi" | "main"
  tempDraft: {
    title: "",
    mini: [],
    midi: [],
    main: []
  }
};

/**
 * DOM ELEMENT SELECTORS
 */
const DOM = {
  // Page Header Slots
  btnHeaderBack: document.getElementById("btnHeaderBack"),
  lblBackNav: document.getElementById("lblBackNav"),
  draftIndicator: document.getElementById("draftIndicator"),
  btnQuickTour: document.getElementById("btnQuickTour"),
  btnExportMenu: document.getElementById("btnExportMenu"),
  pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
  pageTitleSlot: document.getElementById("pageTitleSlot"),
  pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),

  // Views
  viewWelcome: document.getElementById("viewWelcome"),
  viewWorkspace: document.getElementById("viewWorkspace"),

  // Welcome Uploads & Actions
  fileInputAppend: document.getElementById("fileInputAppend"),
  fileInputInspect: document.getElementById("fileInputInspect"),
  btnStartFresh: document.getElementById("btnStartFresh"),
  btnLoadDefaultDataset: document.getElementById("btnLoadDefaultDataset"),

  // Workspace Elements
  lblDatasetName: document.getElementById("lblDatasetName"),
  badgeRecordCount: document.getElementById("badgeRecordCount"),
  badgeHealthSummary: document.getElementById("badgeHealthSummary"),
  btnOpenCreator: document.getElementById("btnOpenCreator"),
  btnSwitchViewMode: document.getElementById("btnSwitchViewMode"),
  lblViewMode: document.getElementById("lblViewMode"),
  btnResetWorkspace: document.getElementById("btnResetWorkspace"),
  inputLedgerSearch: document.getElementById("inputLedgerSearch"),

  // Tabs
  tabLedger: document.getElementById("tabLedger"),
  tabRawPreview: document.getElementById("tabRawPreview"),
  tabHealthAudit: document.getElementById("tabHealthAudit"),
  tabCountLedger: document.getElementById("tabCountLedger"),
  tabCountWarnings: document.getElementById("tabCountWarnings"),

  // Content Containers
  friendlyCardContainer: document.getElementById("friendlyCardContainer"),
  techTableContainer: document.getElementById("techTableContainer"),
  techTableBody: document.getElementById("techTableBody"),
  emptyWorkspaceState: document.getElementById("emptyWorkspaceState"),
  emptyStateHeading: document.getElementById("emptyStateHeading"),
  emptyStateDesc: document.getElementById("emptyStateDesc"),
  rawCsvOutput: document.getElementById("rawCsvOutput"),
  lblRawStats: document.getElementById("lblRawStats"),
  btnCopyRawCSV: document.getElementById("btnCopyRawCSV"),
  auditReportList: document.getElementById("auditReportList"),
  bottomDockNavItems: document.getElementById("bottomDockNavItems"),

  // Creator Modal & Wizard
  modalCreator: document.getElementById("modalCreator"),
  creatorTitle: document.getElementById("creatorTitle"),
  creatorSuperTitle: document.getElementById("creatorSuperTitle"),
  btnCloseCreator: document.getElementById("btnCloseCreator"),
  btnWizardPrev: document.getElementById("btnWizardPrev"),
  btnWizardNext: document.getElementById("btnWizardNext"),
  btnWizardSave: document.getElementById("btnWizardSave"),

  // Wizard Steps
  step1: document.getElementById("step1"),
  step2: document.getElementById("step2"),
  step3: document.getElementById("step3"),
  step4: document.getElementById("step4"),
  step5: document.getElementById("step5"),
  inputPuzzleTitle: document.getElementById("inputPuzzleTitle"),
  feedbackTitle: document.getElementById("feedbackTitle"),

  // Tag Inputs
  tagInputMini: document.getElementById("tagInputMini"),
  btnAddWordMini: document.getElementById("btnAddWordMini"),
  tagsShelfMini: document.getElementById("tagsShelfMini"),
  statsRowMini: document.getElementById("statsRowMini"),
  feedbackMini: document.getElementById("feedbackMini"),

  tagInputMidi: document.getElementById("tagInputMidi"),
  btnAddWordMidi: document.getElementById("btnAddWordMidi"),
  tagsShelfMidi: document.getElementById("tagsShelfMidi"),
  statsRowMidi: document.getElementById("statsRowMidi"),
  feedbackMidi: document.getElementById("feedbackMidi"),

  tagInputMain: document.getElementById("tagInputMain"),
  btnAddWordMain: document.getElementById("btnAddWordMain"),
  tagsShelfMain: document.getElementById("tagsShelfMain"),
  statsRowMain: document.getElementById("statsRowMain"),
  feedbackMain: document.getElementById("feedbackMain"),

  // Simulation Canvas
  simGrid: document.getElementById("simGrid"),
  simStatusSummary: document.getElementById("simStatusSummary"),
  simPlacedWords: document.getElementById("simPlacedWords"),

  // Export Modal
  modalExport: document.getElementById("modalExport"),
  btnCloseExport: document.getElementById("btnCloseExport"),
  btnDismissExport: document.getElementById("btnDismissExport"),
  exportFilename: document.getElementById("exportFilename"),
  btnDownloadFullCSV: document.getElementById("btnDownloadFullCSV"),
  btnDownloadSessionCSV: document.getElementById("btnDownloadSessionCSV"),
  btnDownloadBlankTemplate: document.getElementById("btnDownloadBlankTemplate"),
  lblExportCountTotal: document.getElementById("lblExportCountTotal"),
  lblExportCountSession: document.getElementById("lblExportCountSession"),

  // Guide Modal
  modalGuide: document.getElementById("modalGuide"),
  btnCloseGuide: document.getElementById("btnCloseGuide"),
  btnAckGuide: document.getElementById("btnAckGuide"),

  // Feedback Toast
  appToast: document.getElementById("appToast")
};

/**
 * =========================================================================
 * MICRO-HAPTIC FEEDBACK (12ms TACTILE PULSE)
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
    } catch (_) {}
  }
}

/**
 * =========================================================================
 * TOAST NOTIFICATIONS
 * =========================================================================
 */
let toastTimer = null;
function showToast(message) {
  if (!DOM.appToast) return;
  DOM.appToast.textContent = message;
  DOM.appToast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    DOM.appToast.classList.remove("visible");
  }, 2600);
}

/**
 * =========================================================================
 * RFC 4180 COMPLIANT CSV PARSER & SERIALIZER
 * =========================================================================
 */
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentToken = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentToken += '"';
        i++; // skip escaped double-quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentToken += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentToken.trim());
        currentToken = "";
      } else if (char === "\n" || char === "\r") {
        if (currentToken || currentRow.length > 0) {
          currentRow.push(currentToken.trim());
          rows.push(currentRow);
        }
        currentRow = [];
        currentToken = "";
        if (char === "\r" && nextChar === "\n") i++;
      } else {
        currentToken += char;
      }
    }
  }
  if (currentToken || currentRow.length > 0) {
    currentRow.push(currentToken.trim());
    rows.push(currentRow);
  }
  return rows;
}

function serializeCSV(rows) {
  return rows.map(row => {
    return row.map(field => {
      const str = String(field ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(",");
  }).join("\r\n");
}

/**
 * =========================================================================
 * WORD SANITIZATION & ENGINE SIMULATOR (DETERMINISTIC BOARD FIT)
 * =========================================================================
 */
function sanitizeWord(rawWord) {
  const trimmed = String(rawWord ?? "").trim().toUpperCase();
  const clean = trimmed.replace(/[^A-Z]/g, "");
  return {
    clean,
    hadDisallowed: trimmed !== clean,
    original: trimmed
  };
}

function createRNG(seedStr) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function simulateBoardPlacement(words, size, seedKey = "sim_preview") {
  const rng = createRNG(seedKey);
  const grid = Array.from({ length: size }, () => Array(size).fill(""));
  const placed = [];
  const dropped = [];

  const dirs = [
    [0, 1], [1, 0], [1, 1], [-1, 1],
    [0, -1], [-1, 0], [-1, -1], [1, -1]
  ];

  const cleanWords = words
    .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ""))
    .filter(w => {
      if (w.length < 2 || w.length > size) {
        dropped.push({ word: w, reason: `Length (${w.length}) violates bounds [2, ${size}].` });
        return false;
      }
      return true;
    })
    .sort((a, b) => b.length - a.length);

  cleanWords.forEach(word => {
    let isPlaced = false;
    for (let attempt = 0; attempt < 120 && !isPlaced; attempt++) {
      const [dr, dc] = dirs[Math.floor(rng() * dirs.length)];
      const minR = dr < 0 ? word.length - 1 : 0;
      const maxR = dr > 0 ? size - word.length : size - 1;
      const minC = dc < 0 ? word.length - 1 : 0;
      const maxC = dc > 0 ? size - word.length : size - 1;

      if (minR > maxR || minC > maxC) continue;

      const r = Math.floor(rng() * (maxR - minR + 1)) + minR;
      const c = Math.floor(rng() * (maxC - minC + 1)) + minC;

      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const cell = grid[r + dr * i][c + dc * i];
        if (cell !== "" && cell !== word[i]) {
          fits = false;
          break;
        }
      }

      if (fits) {
        const coords = [];
        for (let i = 0; i < word.length; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          grid[nr][nc] = word[i];
          coords.push(`${nr},${nc}`);
        }
        placed.push({ word, coords });
        isPlaced = true;
      }
    }
    if (!isPlaced) {
      dropped.push({ word, reason: "Grid saturated; no valid coordinates in 120 attempts." });
    }
  });

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(rng() * alphabet.length)];
    }
  }

  return { grid, placed, dropped };
}

/**
 * =========================================================================
 * COMPREHENSIVE DATASET HEALTH AUDIT
 * =========================================================================
 */
function auditDataset(records) {
  const issues = [];
  const titlesSet = new Set();

  records.forEach((rec, idx) => {
    const rowNum = idx + 1;
    const title = (rec.title || "").trim();

    if (!title) {
      issues.push({ level: "danger", rowNum, msg: `Entry #${rowNum} has an empty theme title.` });
    } else if (titlesSet.has(title.toLowerCase())) {
      issues.push({ level: "warning", rowNum, msg: `Duplicate title documented: "${title}".` });
    }
    titlesSet.add(title.toLowerCase());

    ["mini", "midi", "main"].forEach(tierKey => {
      const spec = APP_CONFIG.schema.tiers[tierKey];
      const rawWords = (rec[tierKey] || "").split(",").map(w => w.trim()).filter(Boolean);

      if (rawWords.length === 0) {
        issues.push({
          level: "danger",
          rowNum,
          msg: `In "${title || 'Untitled'}": Tier ${spec.name} contains 0 words.`
        });
      }

      const wordsSeenInTier = new Set();
      rawWords.forEach(w => {
        const { clean } = sanitizeWord(w);
        if (clean.length > spec.maxWordLen) {
          issues.push({
            level: "danger",
            rowNum,
            msg: `In "${title}": Word "${w}" (${clean.length}L) exceeds ${spec.name} matrix limit (${spec.maxWordLen}L). Game will reject word!`
          });
        }
        if (clean.length < spec.minWordLen) {
          issues.push({
            level: "danger",
            rowNum,
            msg: `In "${title}": Word "${w}" is shorter than minimum limit of ${spec.minWordLen} letters.`
          });
        }
        if (wordsSeenInTier.has(clean)) {
          issues.push({
            level: "warning",
            rowNum,
            msg: `In "${title}": Duplicate word "${clean}" configured in ${spec.name} tier.`
          });
        }
        wordsSeenInTier.add(clean);
      });
    });
  });

  return issues;
}

/**
 * =========================================================================
 * LOCAL DRAFT PERSISTENCE
 * =========================================================================
 */
function saveLocalDraft() {
  if (!APP_CONFIG.features.enableAutoSave) return;
  try {
    localStorage.setItem(APP_CONFIG.schema.storageKeys.draft, JSON.stringify({
      records: STATE.records,
      timestamp: Date.now()
    }));
    if (DOM.draftIndicator) {
      DOM.draftIndicator.classList.remove("hidden");
    }
  } catch (_) {}
}

function loadLocalDraft() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.schema.storageKeys.draft);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.records) && parsed.records.length > 0) {
      STATE.records = parsed.records;
      return true;
    }
  } catch (_) {}
  return false;
}

/**
 * =========================================================================
 * WORKSPACE RENDERING & DOM UPDATES
 * =========================================================================
 */
function setHeaderView(isWorkspace = false) {
  if (isWorkspace) {
    DOM.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.workspaceEyebrow;
    DOM.lblBackNav.textContent = "Overview";
  } else {
    DOM.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.welcomeEyebrow;
    DOM.lblBackNav.textContent = "Launchpad";
  }
}

function showWorkspace() {
  DOM.viewWelcome.classList.add("hidden");
  DOM.viewWorkspace.classList.remove("hidden");
  setHeaderView(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showWelcome() {
  DOM.viewWorkspace.classList.add("hidden");
  DOM.viewWelcome.classList.remove("hidden");
  setHeaderView(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderWorkspace() {
  const total = STATE.records.length;
  DOM.badgeRecordCount.textContent = `${total} Entr${total === 1 ? "y" : "ies"}`;
  DOM.tabCountLedger.textContent = total;

  const query = STATE.searchQuery.toLowerCase();
  const filtered = STATE.records.filter(rec => {
    if (!query) return true;
    const text = `${rec.title} ${rec.mini} ${rec.midi} ${rec.main}`.toLowerCase();
    return text.includes(query);
  });

  const issues = auditDataset(STATE.records);
  const dangerCount = issues.filter(i => i.level === "danger").length;
  DOM.tabCountWarnings.textContent = issues.length;

  if (dangerCount > 0) {
    DOM.badgeHealthSummary.textContent = `${dangerCount} Defect${dangerCount === 1 ? "" : "s"}`;
    DOM.badgeHealthSummary.className = "status-pill status-pill--terracotta";
  } else {
    DOM.badgeHealthSummary.textContent = issues.length > 0 ? `${issues.length} Notes` : "100% Compliant";
    DOM.badgeHealthSummary.className = "status-pill status-pill--sage";
  }

  renderFriendlyCards(filtered);
  renderTechTable(filtered);
  renderRawPreview();
  renderAuditReport(issues);

  const isEmpty = total === 0;
  DOM.emptyWorkspaceState.classList.toggle("hidden", !isEmpty);
  DOM.friendlyCardContainer.classList.toggle("hidden", isEmpty || STATE.viewMode === "technical");
  DOM.techTableContainer.classList.toggle("hidden", isEmpty || STATE.viewMode === "friendly");
}

function renderFriendlyCards(records) {
  DOM.friendlyCardContainer.innerHTML = "";
  records.forEach(rec => {
    const realIdx = STATE.records.indexOf(rec);
    const card = document.createElement("article");
    card.className = "paper-card puzzle-item-card";

    const miniWords = (rec.mini || "").split(",").map(w => w.trim()).filter(Boolean);
    const midiWords = (rec.midi || "").split(",").map(w => w.trim()).filter(Boolean);
    const mainWords = (rec.main || "").split(",").map(w => w.trim()).filter(Boolean);

    const hasMiniOverflow = miniWords.some(w => sanitizeWord(w).clean.length > 8);
    const hasMidiOverflow = midiWords.some(w => sanitizeWord(w).clean.length > 10);
    const hasMainOverflow = mainWords.some(w => sanitizeWord(w).clean.length > 12);

    card.innerHTML = `
      <div class="puzzle-item-header">
        <div>
          <span class="puzzle-item-id">Record #${realIdx + 1}</span>
          <h3 class="paper-card__title">${escapeHTML(rec.title || "Untitled")}</h3>
        </div>
        ${rec.isNew ? '<span class="badge-accent badge-accent--sage">New</span>' : ""}
      </div>

      <div class="puzzle-tiers-stack">
        <div class="tier-row ${hasMiniOverflow ? "has-overflow" : ""}">
          <span class="tier-label">Mini</span>
          <span class="tier-words-preview" title="${escapeHTML(rec.mini)}">${escapeHTML(rec.mini || "(None)")}</span>
          <span class="tier-count-badge">${miniWords.length}w</span>
        </div>
        <div class="tier-row ${hasMidiOverflow ? "has-overflow" : ""}">
          <span class="tier-label">Midi</span>
          <span class="tier-words-preview" title="${escapeHTML(rec.midi)}">${escapeHTML(rec.midi || "(None)")}</span>
          <span class="tier-count-badge">${midiWords.length}w</span>
        </div>
        <div class="tier-row ${hasMainOverflow ? "has-overflow" : ""}">
          <span class="tier-label">Main</span>
          <span class="tier-words-preview" title="${escapeHTML(rec.main)}">${escapeHTML(rec.main || "(None)")}</span>
          <span class="tier-count-badge">${mainWords.length}w</span>
        </div>
      </div>

      <div class="puzzle-item-footer">
        <button type="button" class="interactive-tactile btn-secondary-compact btn-edit-puzzle" data-index="${realIdx}">Edit</button>
        <button type="button" class="interactive-tactile btn-secondary-compact btn-duplicate-puzzle" data-index="${realIdx}">Duplicate</button>
        <button type="button" class="interactive-tactile btn-secondary-compact btn-delete-puzzle" data-index="${realIdx}" style="color:var(--color-terracotta-text);">Delete</button>
      </div>
    `;
    DOM.friendlyCardContainer.appendChild(card);
  });
}

function renderTechTable(records) {
  DOM.techTableBody.innerHTML = "";
  records.forEach(rec => {
    const realIdx = STATE.records.indexOf(rec);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td style="color:var(--color-text-muted); font-family:var(--font-mono);">${realIdx + 1}</td>
      <td><strong>${escapeHTML(rec.title)}</strong></td>
      <td class="cell-mono">${escapeHTML(rec.mini)}</td>
      <td class="cell-mono">${escapeHTML(rec.midi)}</td>
      <td class="cell-mono">${escapeHTML(rec.main)}</td>
      <td style="text-align: right; white-space: nowrap;">
        <button type="button" class="interactive-tactile btn-secondary-compact btn-edit-puzzle" data-index="${realIdx}">Edit</button>
        <button type="button" class="interactive-tactile btn-secondary-compact btn-delete-puzzle" data-index="${realIdx}" style="color:var(--color-terracotta-text);">×</button>
      </td>
    `;
    DOM.techTableBody.appendChild(tr);
  });
}

function renderRawPreview() {
  const rows = [
    APP_CONFIG.schema.expectedHeaders,
    ...STATE.records.map(r => [r.title, r.mini, r.midi, r.main])
  ];
  const csvContent = serializeCSV(rows);
  DOM.rawCsvOutput.value = csvContent;
  const byteSize = new Blob([csvContent]).size;
  DOM.lblRawStats.textContent = `${byteSize} bytes • ${STATE.records.length} records`;
}

function renderAuditReport(issues) {
  DOM.auditReportList.innerHTML = "";
  if (issues.length === 0) {
    DOM.auditReportList.innerHTML = `
      <div class="audit-item audit-item--pristine">
        <span class="audit-item__icon" aria-hidden="true">✓</span>
        <div class="audit-item__body">
          <strong>Pristine Matrix Compatibility</strong>
          <p>Every documented puzzle strictly conforms to grid dimension bounds, non-empty rules, and RFC 4180 parsing safety.</p>
        </div>
      </div>
    `;
    return;
  }

  issues.forEach(issue => {
    const item = document.createElement("div");
    item.className = `audit-item ${issue.level === "danger" ? "audit-item--danger" : "audit-item--warning"}`;
    item.innerHTML = `
      <span class="audit-item__icon" aria-hidden="true">${issue.level === "danger" ? "!" : "i"}</span>
      <div class="audit-item__body">
        <strong>${issue.level === "danger" ? "Critical Engine Defect" : "Optimization Advice"} (Record #${issue.rowNum})</strong>
        <p>${escapeHTML(issue.msg)}</p>
      </div>
    `;
    DOM.auditReportList.appendChild(item);
  });
}

/**
 * =========================================================================
 * CSV IMPORT ENGINE
 * =========================================================================
 */
function loadDatasetFromCSV(csvText, sourceName = "Uploaded File", isAppend = false) {
  const rawRows = parseCSV(csvText);
  if (rawRows.length < 2) {
    showToast(APP_CONFIG.content.notifications.emptyFileWarning);
    return false;
  }

  const headers = rawRows[0].map(h => h.trim().toLowerCase());
  const hasRequired = APP_CONFIG.schema.expectedHeaders.every(h => headers.includes(h));

  if (!hasRequired) {
    showToast(APP_CONFIG.content.notifications.headerMismatchWarning);
    return false;
  }

  const titleIdx = headers.indexOf("title");
  const miniIdx = headers.indexOf("mini");
  const midiIdx = headers.indexOf("midi");
  const mainIdx = headers.indexOf("main");

  const newRecords = [];
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || !row.some(c => c.trim().length > 0)) continue;

    newRecords.push({
      id: `puz_${Date.now()}_${i}`,
      title: row[titleIdx] || `Theme ${i}`,
      mini: row[miniIdx] || "",
      midi: row[midiIdx] || "",
      main: row[mainIdx] || "",
      isNew: isAppend
    });
  }

  if (isAppend) {
    STATE.records = [...STATE.records, ...newRecords];
    showToast(`Appended ${newRecords.length} records.`);
  } else {
    STATE.records = newRecords;
    DOM.lblDatasetName.textContent = sourceName;
    showToast(`Loaded ${newRecords.length} records successfully.`);
  }

  saveLocalDraft();
  renderWorkspace();
  showWorkspace();
  return true;
}

/**
 * =========================================================================
 * GUIDED WIZARD ASSISTANT
 * =========================================================================
 */
function openCreator(index = -1) {
  STATE.activeRecordIndex = index;
  STATE.currentStep = 1;

  if (index >= 0) {
    const existing = STATE.records[index];
    STATE.tempDraft = {
      title: existing.title,
      mini: (existing.mini || "").split(",").map(w => w.trim()).filter(Boolean),
      midi: (existing.midi || "").split(",").map(w => w.trim()).filter(Boolean),
      main: (existing.main || "").split(",").map(w => w.trim()).filter(Boolean)
    };
    DOM.creatorTitle.textContent = `Edit Entry #${index + 1}`;
    DOM.creatorSuperTitle.textContent = "Curator Editor";
  } else {
    STATE.tempDraft = { title: "", mini: [], midi: [], main: [] };
    DOM.creatorTitle.textContent = "Create New Puzzle Entry";
    DOM.creatorSuperTitle.textContent = "Curator Assistant";
  }

  DOM.inputPuzzleTitle.value = STATE.tempDraft.title;
  renderTierTags("mini");
  renderTierTags("midi");
  renderTierTags("main");
  showStep(1);

  DOM.modalCreator.showModal();
}

function showStep(stepNum) {
  STATE.currentStep = stepNum;

  document.querySelectorAll(".step-indicator").forEach(btn => {
    const s = parseInt(btn.dataset.step, 10);
    btn.classList.toggle("active", s === stepNum);
    btn.classList.toggle("completed", s < stepNum);
  });

  [DOM.step1, DOM.step2, DOM.step3, DOM.step4, DOM.step5].forEach((el, idx) => {
    el.classList.toggle("hidden", idx + 1 !== stepNum);
  });

  DOM.btnWizardPrev.disabled = (stepNum === 1);

  if (stepNum === 5) {
    DOM.btnWizardNext.classList.add("hidden");
    DOM.btnWizardSave.classList.remove("hidden");
    runLiveSimulation(STATE.simTier);
  } else {
    DOM.btnWizardNext.classList.remove("hidden");
    DOM.btnWizardSave.classList.add("hidden");
    const nextLabels = ["", "Mini Tier", "Midi Tier", "Main Tier", "Simulation"];
    DOM.btnWizardNext.textContent = `Continue to ${nextLabels[stepNum]}`;
  }

  validateCurrentStep(false);
}

function validateCurrentStep(showFeedback = true) {
  let isValid = true;

  if (STATE.currentStep === 1) {
    const val = DOM.inputPuzzleTitle.value.trim();
    if (!val) {
      if (showFeedback) {
        DOM.feedbackTitle.textContent = "Theme title is required.";
        DOM.feedbackTitle.className = "field-feedback err";
      }
      isValid = false;
    } else {
      DOM.feedbackTitle.textContent = "Title satisfies specifications.";
      DOM.feedbackTitle.className = "field-feedback ok";
    }
  } else if (STATE.currentStep === 2) {
    isValid = validateTierCount("mini", showFeedback);
  } else if (STATE.currentStep === 3) {
    isValid = validateTierCount("midi", showFeedback);
  } else if (STATE.currentStep === 4) {
    isValid = validateTierCount("main", showFeedback);
  }

  return isValid;
}

function validateTierCount(tierKey, showFeedback) {
  const words = STATE.tempDraft[tierKey];
  const feedback = DOM[`feedback${capitalize(tierKey)}`];
  const spec = APP_CONFIG.schema.tiers[tierKey];

  if (words.length === 0) {
    if (showFeedback) {
      feedback.textContent = `Add at least one word for ${spec.name} tier.`;
      feedback.className = "field-feedback err";
    }
    return false;
  }

  const hasOverflow = words.some(w => sanitizeWord(w).clean.length > spec.maxWordLen);
  if (hasOverflow) {
    if (showFeedback) {
      feedback.textContent = `One or more words exceed the ${spec.maxWordLen}-letter grid limit!`;
      feedback.className = "field-feedback err";
    }
    return false;
  }

  if (words.length < 4) {
    feedback.textContent = `Count is light (${words.length} words). Recommended: ${spec.recWords} words.`;
    feedback.className = "field-feedback warn";
  } else {
    feedback.textContent = `${words.length} compliant words configured for ${spec.name}.`;
    feedback.className = "field-feedback ok";
  }
  return true;
}

function addWordToTier(tierKey, rawInput) {
  if (!rawInput) return;
  const tokens = rawInput.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean);
  const spec = APP_CONFIG.schema.tiers[tierKey];
  const feedback = DOM[`feedback${capitalize(tierKey)}`];

  tokens.forEach(tok => {
    const { clean, hadDisallowed, original } = sanitizeWord(tok);
    if (!clean) return;

    if (clean.length > spec.maxWordLen) {
      feedback.textContent = `"${original}" is ${clean.length}L! ${spec.name} limit is ${spec.maxWordLen}L.`;
      feedback.className = "field-feedback err";
      return;
    }

    if (clean.length < spec.minWordLen) {
      feedback.textContent = `"${clean}" must be at least ${spec.minWordLen} letters long.`;
      feedback.className = "field-feedback err";
      return;
    }

    if (STATE.tempDraft[tierKey].includes(clean)) {
      feedback.textContent = `"${clean}" is already present in ${spec.name}.`;
      feedback.className = "field-feedback warn";
      return;
    }

    STATE.tempDraft[tierKey].push(clean);
    if (hadDisallowed) {
      feedback.textContent = `Stripped symbols: "${original}" → "${clean}".`;
      feedback.className = "field-feedback ok";
    }
  });

  renderTierTags(tierKey);
  validateTierCount(tierKey, false);
}

function removeWordFromTier(tierKey, word) {
  STATE.tempDraft[tierKey] = STATE.tempDraft[tierKey].filter(w => w !== word);
  renderTierTags(tierKey);
  validateTierCount(tierKey, false);
}

function renderTierTags(tierKey) {
  const shelf = DOM[`tagsShelf${capitalize(tierKey)}`];
  const stats = DOM[`statsRow${capitalize(tierKey)}`];
  const spec = APP_CONFIG.schema.tiers[tierKey];
  const words = STATE.tempDraft[tierKey];

  shelf.innerHTML = "";
  words.forEach(word => {
    const tag = document.createElement("span");
    const isOver = word.length > spec.maxWordLen;
    tag.className = `word-tag ${isOver ? "tag-warning" : ""}`;
    tag.innerHTML = `
      <span>${escapeHTML(word)}</span>
      <button type="button" class="btn-tag-remove" aria-label="Remove word ${escapeHTML(word)}">×</button>
    `;
    tag.querySelector(".btn-tag-remove").addEventListener("click", () => {
      removeWordFromTier(tierKey, word);
    });
    shelf.appendChild(tag);
  });

  stats.firstElementChild.textContent = `${words.length} word${words.length === 1 ? "" : "s"} entered`;
}

function runLiveSimulation(tierKey) {
  STATE.simTier = tierKey;
  const spec = APP_CONFIG.schema.tiers[tierKey];
  const words = STATE.tempDraft[tierKey];

  document.querySelectorAll(".sim-tier-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.sim === tierKey);
  });

  DOM.simGrid.className = `sim-grid grid-${spec.gridSize}`;
  DOM.simGrid.innerHTML = "";

  const seed = `sim_${tierKey}_${Date.now()}`;
  const { grid, placed, dropped } = simulateBoardPlacement(words, spec.gridSize, seed);

  const highlightCoords = new Set();
  placed.forEach(p => p.coords.forEach(c => highlightCoords.add(c)));

  for (let r = 0; r < spec.gridSize; r++) {
    for (let c = 0; c < spec.gridSize; c++) {
      const cell = document.createElement("div");
      const isLetterPlaced = highlightCoords.has(`${r},${c}`);
      cell.className = `sim-cell ${isLetterPlaced ? "highlight" : ""}`;
      cell.textContent = grid[r][c];
      DOM.simGrid.appendChild(cell);
    }
  }

  if (words.length === 0) {
    DOM.simStatusSummary.innerHTML = `<span style="color:var(--color-ochre-text);">No words entered for ${spec.name} tier.</span>`;
  } else if (dropped.length > 0) {
    DOM.simStatusSummary.innerHTML = `
      <span style="color:var(--color-terracotta-text); font-weight:700;">⚠️ ${dropped.length} word(s) failed matrix placement:</span>
      <ul style="margin-left:16px; margin-top:4px;">
        ${dropped.map(d => `<li><strong>${escapeHTML(d.word)}</strong>: ${escapeHTML(d.reason)}</li>`).join("")}
      </ul>
    `;
  } else {
    DOM.simStatusSummary.innerHTML = `
      <span style="color:var(--color-sage-text); font-weight:700;">✓ Perfect Matrix Fit!</span> All ${placed.length} words placed across 8 search axes.
    `;
  }

  DOM.simPlacedWords.innerHTML = "";
  words.forEach(w => {
    const isPlaced = placed.some(p => p.word === w);
    const li = document.createElement("li");
    li.className = `sim-word-badge ${isPlaced ? "placed" : "dropped"}`;
    li.textContent = `${w} (${w.length}L)`;
    DOM.simPlacedWords.appendChild(li);
  });
}

function saveCurrentWizardPuzzle() {
  STATE.tempDraft.title = DOM.inputPuzzleTitle.value.trim();

  const recordData = {
    id: STATE.activeRecordIndex >= 0 ? STATE.records[STATE.activeRecordIndex].id : `puz_${Date.now()}`,
    title: STATE.tempDraft.title,
    mini: STATE.tempDraft.mini.join(","),
    midi: STATE.tempDraft.midi.join(","),
    main: STATE.tempDraft.main.join(","),
    isNew: true
  };

  if (STATE.activeRecordIndex >= 0) {
    STATE.records[STATE.activeRecordIndex] = recordData;
  } else {
    STATE.records.push(recordData);
  }

  saveLocalDraft();
  DOM.modalCreator.close();
  renderWorkspace();
  showToast(APP_CONFIG.content.notifications.saveSuccess);
}

/**
 * =========================================================================
 * EXPORT OPERATIONS
 * =========================================================================
 */
function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || APP_CONFIG.schema.defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

function exportFullCSV() {
  const filename = DOM.exportFilename.value.trim() || APP_CONFIG.schema.defaultFilename;
  const rows = [
    APP_CONFIG.schema.expectedHeaders,
    ...STATE.records.map(r => [r.title, r.mini, r.midi, r.main])
  ];
  triggerDownload(serializeCSV(rows), filename);
  DOM.modalExport.close();
}

function exportSessionOnlyCSV() {
  const newOnly = STATE.records.filter(r => r.isNew);
  if (newOnly.length === 0) {
    showToast("No new session records found.");
    return;
  }
  const baseName = (DOM.exportFilename.value.trim() || "puzzles").replace(/\.csv$/i, "");
  const filename = `${baseName}_new_only.csv`;
  const rows = [
    APP_CONFIG.schema.expectedHeaders,
    ...newOnly.map(r => [r.title, r.mini, r.midi, r.main])
  ];
  triggerDownload(serializeCSV(rows), filename);
  DOM.modalExport.close();
}

function exportBlankTemplateCSV() {
  const content = APP_CONFIG.schema.expectedHeaders.join(",") + "\r\n";
  triggerDownload(content, "puzzles_template.csv");
  DOM.modalExport.close();
}

/**
 * =========================================================================
 * HYDRATION & EVENT DELEGATION
 * =========================================================================
 */
function hydrateFromConfig() {
  document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;
  DOM.pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
  DOM.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
  DOM.emptyStateHeading.textContent = APP_CONFIG.content.emptyStates.noDataHeading;
  DOM.emptyStateDesc.textContent = APP_CONFIG.content.emptyStates.noDataDescription;

  // Hydrate Mobile Bottom Dock
  DOM.bottomDockNavItems.innerHTML = "";
  APP_CONFIG.navigation.items.filter(item => item.showInBottomBar).forEach((item, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `nav-tab-item ${index === 0 ? "nav-tab-item--active" : ""}`;
    btn.dataset.route = item.id;
    btn.innerHTML = `
      <span>${escapeHTML(item.label)}</span>
      <span class="nav-tab-item__indicator"></span>
    `;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab-item").forEach(b => b.classList.remove("nav-tab-item--active"));
      btn.classList.add("nav-tab-item--active");
      triggerHapticPulse();

      if (item.id === "overview") showWelcome();
      else if (item.id === "ledger") showWorkspace();
      else if (item.id === "audit") {
        showWorkspace();
        const tabBtn = document.querySelector('[data-tab="tabHealthAudit"]');
        if (tabBtn) tabBtn.click();
      } else if (item.id === "guide") {
        DOM.modalGuide.showModal();
      }
    });
    DOM.bottomDockNavItems.appendChild(btn);
  });
}

function bindEvents() {
  // Global haptic binding
  document.addEventListener("click", e => {
    if (e.target.closest(".interactive-tactile, .filter-chip, .segmented-tab, .step-indicator")) {
      triggerHapticPulse();
    }
  });

  // Back Navigation Button
  DOM.btnHeaderBack.addEventListener("click", () => {
    if (!DOM.viewWorkspace.classList.contains("hidden")) {
      showWelcome();
    } else {
      showToast("Already at root launchpad view.");
    }
  });

  // Guide Dialog
  DOM.btnQuickTour.addEventListener("click", () => DOM.modalGuide.showModal());
  DOM.btnCloseGuide.addEventListener("click", () => DOM.modalGuide.close());
  DOM.btnAckGuide.addEventListener("click", () => DOM.modalGuide.close());

  // Export Dialog
  DOM.btnExportMenu.addEventListener("click", () => {
    const newCount = STATE.records.filter(r => r.isNew).length;
    DOM.lblExportCountTotal.textContent = STATE.records.length;
    DOM.lblExportCountSession.textContent = newCount;
    DOM.modalExport.showModal();
  });
  DOM.btnCloseExport.addEventListener("click", () => DOM.modalExport.close());
  DOM.btnDismissExport.addEventListener("click", () => DOM.modalExport.close());
  DOM.btnDownloadFullCSV.addEventListener("click", exportFullCSV);
  DOM.btnDownloadSessionCSV.addEventListener("click", exportSessionOnlyCSV);
  DOM.btnDownloadBlankTemplate.addEventListener("click", exportBlankTemplateCSV);

  // File Uploads
  DOM.fileInputAppend.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => loadDatasetFromCSV(ev.target.result, file.name, true);
    reader.readAsText(file);
    e.target.value = "";
  });

  DOM.fileInputInspect.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => loadDatasetFromCSV(ev.target.result, file.name, false);
    reader.readAsText(file);
    e.target.value = "";
  });

  DOM.btnStartFresh.addEventListener("click", () => {
    STATE.records = [];
    DOM.lblDatasetName.textContent = "New Custom Ledger";
    renderWorkspace();
    showWorkspace();
    openCreator(-1);
  });

  DOM.btnLoadDefaultDataset.addEventListener("click", () => {
    loadDatasetFromCSV(DEFAULT_SAMPLE_CSV, "Cocktail Reference Vault", false);
  });

  // Workspace Actions
  DOM.btnOpenCreator.addEventListener("click", () => openCreator(-1));
  document.querySelector(".btn-open-creator-empty")?.addEventListener("click", () => openCreator(-1));

  DOM.btnSwitchViewMode.addEventListener("click", () => {
    STATE.viewMode = STATE.viewMode === "friendly" ? "technical" : "friendly";
    DOM.lblViewMode.textContent = STATE.viewMode === "friendly" ? "Technical View" : "Friendly View";
    renderWorkspace();
  });

  DOM.btnResetWorkspace.addEventListener("click", () => {
    showWelcome();
  });

  DOM.inputLedgerSearch.addEventListener("input", e => {
    STATE.searchQuery = e.target.value.trim();
    renderWorkspace();
  });

  // Segmented Workspace Tabs
  document.querySelectorAll(".segmented-control .segmented-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".segmented-control .segmented-tab").forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const targetId = tab.dataset.tab;
      [DOM.tabLedger, DOM.tabRawPreview, DOM.tabHealthAudit].forEach(panel => {
        panel.classList.toggle("hidden", panel.id !== targetId);
      });
    });
  });

  // Copy CSV Text
  DOM.btnCopyRawCSV.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(DOM.rawCsvOutput.value);
      showToast(APP_CONFIG.content.notifications.copySuccess);
    } catch (_) {
      DOM.rawCsvOutput.select();
      document.execCommand("copy");
      showToast(APP_CONFIG.content.notifications.copySuccess);
    }
  });

  // Delegated Actions: Edit, Duplicate, Delete
  document.addEventListener("click", e => {
    const editBtn = e.target.closest(".btn-edit-puzzle");
    if (editBtn) {
      const idx = parseInt(editBtn.dataset.index, 10);
      openCreator(idx);
      return;
    }

    const dupBtn = e.target.closest(".btn-duplicate-puzzle");
    if (dupBtn) {
      const idx = parseInt(dupBtn.dataset.index, 10);
      const orig = STATE.records[idx];
      STATE.records.splice(idx + 1, 0, {
        ...orig,
        id: `puz_${Date.now()}`,
        title: `${orig.title} (Copy)`,
        isNew: true
      });
      saveLocalDraft();
      renderWorkspace();
      showToast(APP_CONFIG.content.notifications.duplicateSuccess);
      return;
    }

    const delBtn = e.target.closest(".btn-delete-puzzle");
    if (delBtn) {
      const idx = parseInt(delBtn.dataset.index, 10);
      const name = STATE.records[idx].title;
      if (confirm(`Permanently remove "${name}" from the active ledger?`)) {
        STATE.records.splice(idx, 1);
        saveLocalDraft();
        renderWorkspace();
        showToast(APP_CONFIG.content.notifications.deleteSuccess);
      }
    }
  });

  // Wizard Stepper Controls
  DOM.btnCloseCreator.addEventListener("click", () => DOM.modalCreator.close());

  document.querySelectorAll(".step-indicator").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetStep = parseInt(btn.dataset.step, 10);
      if (targetStep < STATE.currentStep || validateCurrentStep(true)) {
        showStep(targetStep);
      }
    });
  });

  DOM.btnWizardNext.addEventListener("click", () => {
    if (validateCurrentStep(true)) {
      showStep(STATE.currentStep + 1);
    }
  });

  DOM.btnWizardPrev.addEventListener("click", () => {
    if (STATE.currentStep > 1) {
      showStep(STATE.currentStep - 1);
    }
  });

  DOM.btnWizardSave.addEventListener("click", saveCurrentWizardPuzzle);

  // Suggestion Chips
  document.querySelectorAll(".theme-sugg-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      DOM.inputPuzzleTitle.value = chip.textContent.trim();
      validateCurrentStep(false);
    });
  });

  // Tier Tag Addition
  ["mini", "midi", "main"].forEach(tierKey => {
    const capitalized = capitalize(tierKey);
    const input = DOM[`tagInput${capitalized}`];
    const addBtn = DOM[`btnAddWord${capitalized}`];

    const commit = () => {
      addWordToTier(tierKey, input.value);
      input.value = "";
    };

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        commit();
      }
    });
    addBtn.addEventListener("click", commit);
  });

  // Word Pool Chips
  document.querySelectorAll(".chip-add-word").forEach(chip => {
    chip.addEventListener("click", () => {
      const tier = chip.dataset.tier;
      addWordToTier(tier, chip.textContent.trim());
    });
  });

  // Simulation Tabs
  document.querySelectorAll(".sim-tier-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      runLiveSimulation(tab.dataset.sim);
    });
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * =========================================================================
 * APPLICATION BOOTSTRAP
 * =========================================================================
 */
function init() {
  hydrateFromConfig();
  bindEvents();

  const restored = loadLocalDraft();
  if (restored) {
    DOM.lblDatasetName.textContent = "Restored Session Draft";
    if (DOM.draftIndicator) DOM.draftIndicator.classList.remove("hidden");
    renderWorkspace();
    showWorkspace();
    showToast(APP_CONFIG.content.notifications.restoreDraftSuccess);
  } else {
    showWelcome();
  }
}

// Kick off when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}