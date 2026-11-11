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
    appId: "spelling-bee-csv-studio",
    appName: "Spelling Bee Studio",
    appTagline: "Production Honeycomb Generator & Lexicon Compiler",
    version: "3.0.0",
    environment: "production",
    canonicalUrl: "https://studio.spellingbee.org",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoAlt: "Spelling Bee Studio Monogram",
    accentColor: "#B84717",      /* Primary Honeycomb Terracotta */
    accentSecondary: "#3E5B42",  /* Sage Green for Verified Words */
    accentHighlight: "#6E5614",  /* Ochre for Center Focus Letters */
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilySerif: "'Cormorant Garamond', Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "welcomeView",
    items: [
      { id: "panelWizard", label: "Creator", icon: "✏️", route: "#wizard", enabled: true, showInBottomBar: true },
      { id: "panelManager", label: "Library", icon: "📋", route: "#library", enabled: true, showInBottomBar: true },
      { id: "panelPreview", label: "CSV Export", icon: "👁️", route: "#preview", enabled: true, showInBottomBar: true },
      { id: "panelSettings", label: "Lexicon", icon: "🌐", route: "#lexicon", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultEyebrow: "HIVE ARCHITECT",
      defaultTitle: "Spelling Bee Studio",
      defaultSubtitle: "Craft, auto-solve with live online dictionaries, validate, and compile pristine CSV datasets for Spelling Bee engines.",
    },
    emptyStates: {
      noDataHeading: "No Honeycombs in Library",
      noDataDescription: "Start building your collection using the guided creator or import a pre-existing CSV file.",
      noSearchResultsHeading: "No Matching Honeycombs",
      noSearchResultsDescription: "Review your letter filters or search queries and attempt the lookup again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Commit to Library",
      delete: "Remove Permanently",
      back: "Home",
    },
    notifications: {
      saveSuccess: "Honeycomb successfully committed to session library.",
      deleteSuccess: "Honeycomb removed from workspace.",
      clipboardSuccess: "CSV content copied to clipboard.",
      clipboardError: "Clipboard access denied. Please copy manually.",
      dictionaryLoaded: "Online dictionary loaded successfully.",
      dictionaryError: "Unable to load online lexicon. Check internet connectivity.",
    },
    legal: {
      copyrightHolder: "Spelling Bee Architecture Group",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "architect@spellingbee.org",
    documentationUrl: "https://docs.spellingbee.org",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,       /* Gentle 12ms tactile vibration on mobile */
    enableAutoSave: true,              /* Persist state to localStorage */
    enableStickyBottomBar: true,       /* Mobile ergonomic bottom dock */
    maxWordlistCacheSize: 200000,
  },

  // 7. ONLINE LEXICON ENDPOINTS & STORAGE
  endpoints: {
    dictionaries: {
      scrabble: "https://cdn.jsdelivr.net/gh/raun/Scrabble@master/words.txt",
      common: "https://cdn.jsdelivr.net/gh/first20hours/google-10000-english@master/20k.txt"
    },
    storageKeys: {
      puzzles: "sb_studio_puzzles_v3",
      preferences: "sb_studio_prefs_v3"
    }
  }
});

/* ==========================================================================
   TACTILE MICRO-HAPTIC PULSE
   ========================================================================== */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12);
    } catch (e) {
      /* Gracefully silent on unsupported security contexts */
    }
  }
}

/* ==========================================================================
   ON-DEMAND ONLINE DICTIONARY ENGINE
   ========================================================================== */
class OnlineDictionaryEngine {
  constructor() {
    this.wordsSet = new Set();
    this.isLoaded = false;
    this.isLoading = false;
    this.activeSourceKey = "scrabble";
    this.customUrl = "";
  }

  getSourceUrl() {
    if (this.activeSourceKey === "custom" && this.customUrl) {
      return this.customUrl;
    }
    return APP_CONFIG.endpoints.dictionaries[this.activeSourceKey] || APP_CONFIG.endpoints.dictionaries.scrabble;
  }

  async ensureLoaded(onProgress = null) {
    if (this.isLoaded && this.wordsSet.size > 0) return true;
    if (this.isLoading) return false;

    this.isLoading = true;
    const url = this.getSourceUrl();

    if (typeof onProgress === "function") {
      onProgress("Connecting to remote lexicon repository...");
    }

    try {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} from lexicon source`);
      }

      const text = await response.text();
      const rawTokens = text.split(/[\r\n\s]+/);

      for (let i = 0; i < rawTokens.length; i++) {
        const w = rawTokens[i].trim().toUpperCase().replace(/[^A-Z]/g, "");
        if (w.length >= 4) {
          this.wordsSet.add(w);
        }
      }

      this.isLoaded = true;
      this.isLoading = false;
      return true;
    } catch (err) {
      console.error("Online dictionary fetch error:", err);
      this.isLoading = false;
      throw err;
    }
  }

  addWords(wordsArray) {
    if (!Array.isArray(wordsArray)) return;
    wordsArray.forEach((w) => {
      const cleaned = (w || "").trim().toUpperCase().replace(/[^A-Z]/g, "");
      if (cleaned.length >= 4) {
        this.wordsSet.add(cleaned);
      }
    });
  }

  clear() {
    this.wordsSet.clear();
    this.isLoaded = false;
    this.isLoading = false;
  }

  solveHive(centerLetter, outerLetters) {
    const c = (centerLetter || "").trim().toUpperCase();
    const o = (outerLetters || "").trim().toUpperCase().replace(/[^A-Z]/g, "");

    if (!c || o.length !== 6) return { words: [], pangrams: [] };

    const hiveLetters = new Set([c, ...o.split("")]);
    if (hiveLetters.size !== 7) return { words: [], pangrams: [] };

    const matchingWords = [];
    const pangrams = [];

    for (const word of this.wordsSet) {
      if (word.length < 4 || !word.includes(c)) continue;

      let allValid = true;
      for (let i = 0; i < word.length; i++) {
        if (!hiveLetters.has(word[i])) {
          allValid = false;
          break;
        }
      }

      if (allValid) {
        matchingWords.push(word);
        const chars = new Set(word.split(""));
        if (chars.size === 7) {
          pangrams.push(word);
        }
      }
    }

    matchingWords.sort();
    pangrams.sort();

    return { words: matchingWords, pangrams };
  }
}

/* ==========================================================================
   RFC 4180 COMPLIANT CSV ENGINE
   ========================================================================== */
class CsvEngine {
  static parse(csvText) {
    if (!csvText || typeof csvText !== "string") return [];
    const lines = [];
    let row = [""];
    let inQuotes = false;
    let currentCh = "";

    for (let i = 0; i < csvText.length; i++) {
      currentCh = csvText[i];
      const nextCh = csvText[i + 1];

      if (currentCh === '"') {
        if (inQuotes && nextCh === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (currentCh === "," && !inQuotes) {
        row.push("");
      } else if ((currentCh === "\r" || currentCh === "\n") && !inQuotes) {
        if (currentCh === "\r" && nextCh === "\n") i++;
        if (row.length > 1 || row[0] !== "") lines.push(row);
        row = [""];
      } else {
        row[row.length - 1] += currentCh;
      }
    }

    if (row.length > 1 || row[0] !== "") lines.push(row);
    return lines;
  }

  static escapeCell(val) {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (/[",\r\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  static serialize(records) {
    const header = "center_letter,outer_letters,words";
    const rows = records.map((rec) => {
      const center = this.escapeCell(rec.centerLetter);
      const outer = this.escapeCell(rec.outerLetters);
      const wordsStr = Array.isArray(rec.words) ? rec.words.join(" ") : String(rec.words);
      const words = this.escapeCell(wordsStr);
      return `${center},${outer},${words}`;
    });
    return [header, ...rows].join("\r\n");
  }
}

/* ==========================================================================
   PUZZLE AUDIT & SCORING MODEL
   ========================================================================== */
class PuzzleModel {
  static validateLetters(centerLetter, outerLetters) {
    const c = (centerLetter || "").trim().toUpperCase();
    const o = (outerLetters || "").trim().toUpperCase().replace(/[^A-Z]/g, "");

    const errors = { center: null, outer: null, valid: false };

    if (!c) {
      errors.center = "Center letter is required.";
    } else if (!/^[A-Z]$/.test(c)) {
      errors.center = "Center letter must be a single letter A-Z.";
    }

    if (!o) {
      errors.outer = "6 outer letters are required.";
    } else if (o.length !== 6) {
      errors.outer = `Exactly 6 outer letters required (currently ${o.length}).`;
    } else {
      const outerSet = new Set(o.split(""));
      if (outerSet.size !== 6) {
        errors.outer = "All 6 outer letters must be unique.";
      } else if (c && outerSet.has(c)) {
        errors.outer = `Outer letters cannot contain center letter '${c}'.`;
      }
    }

    errors.valid = !errors.center && !errors.outer;
    return errors;
  }

  static parseAndAuditWords(rawWordsInput, centerLetter, outerLetters) {
    const c = (centerLetter || "").trim().toUpperCase();
    const o = (outerLetters || "").trim().toUpperCase();
    const hiveLetters = new Set([c, ...o.split("")]);

    let tokenList = [];
    if (Array.isArray(rawWordsInput)) {
      tokenList = rawWordsInput;
    } else if (typeof rawWordsInput === "string") {
      tokenList = rawWordsInput
        .replace(/[",\r\n\t]/g, " ")
        .split(/\s+/)
        .map((w) => w.trim().toUpperCase())
        .filter(Boolean);
    }

    const uniqueTokens = [...new Set(tokenList)];
    const validWords = [];
    const invalidWords = [];

    uniqueTokens.forEach((w) => {
      const cleaned = w.replace(/[^A-Z]/g, "");
      if (!cleaned) return;

      let reason = null;
      if (cleaned.length < 4) {
        reason = "Too short (< 4 letters)";
      } else if (c && !cleaned.includes(c)) {
        reason = `Missing center letter '${c}'`;
      } else {
        const invalidChar = cleaned.split("").find((ch) => !hiveLetters.has(ch));
        if (invalidChar) {
          reason = `Contains '${invalidChar}' (not in hive)`;
        }
      }

      if (reason) {
        invalidWords.push({ word: cleaned, reason });
      } else {
        validWords.push(cleaned);
      }
    });

    validWords.sort();

    const pangrams = validWords.filter((w) => {
      const uniqueChars = new Set(w.split(""));
      return c && [...hiveLetters].every((ch) => uniqueChars.has(ch));
    });

    const maxScore = validWords.reduce((sum, w) => {
      const base = w.length === 4 ? 1 : w.length;
      const isPangram = pangrams.includes(w);
      return sum + base + (isPangram ? 7 : 0);
    }, 0);

    return { validWords, invalidWords, pangrams, maxScore };
  }
}

/* ==========================================================================
   PRIMARY APPLICATION CONTROLLER
   ========================================================================== */
class SpellingBeeStudioApp {
  constructor() {
    this.dictionary = new OnlineDictionaryEngine();
    this.puzzles = [];
    this.currentWizardIndex = -1;
    this.wizardStep = 1;
    this.filter = "all";
    this.searchQuery = "";
    this.previewMode = "friendly";
    this.pendingConfirmCallback = null;

    this.cacheDom();
    this.hydrateFromConfig();
    this.bindEvents();
    this.loadPersistedSession();
    this.updateGlobalStats();
  }

  cacheDom() {
    this.dom = {
      srAnnouncer: document.getElementById("srAnnouncer"),
      btnHeaderBack: document.getElementById("btnHeaderBack"),
      btnBackNavLabel: document.getElementById("btnBackNavLabel"),
      topStatPuzzles: document.getElementById("topStatPuzzles"),
      topStatWords: document.getElementById("topStatWords"),
      topStatLexicon: document.getElementById("topStatLexicon"),
      btnHeaderReset: document.getElementById("btnHeaderReset"),
      btnHeaderExport: document.getElementById("btnHeaderExport"),
      pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
      pageTitleSlot: document.getElementById("pageTitleSlot"),
      pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
      flashBanner: document.getElementById("flashBanner"),
      flashMessage: document.getElementById("flashMessage"),
      btnFlashClose: document.getElementById("btnFlashClose"),
      fileCsvInput: document.getElementById("fileCsvInput"),

      welcomeView: document.getElementById("welcomeView"),
      workspaceView: document.getElementById("workspaceView"),
      btnChooseUploadAppend: document.getElementById("btnChooseUploadAppend"),
      btnChooseStartFresh: document.getElementById("btnChooseStartFresh"),
      btnChooseUploadInspect: document.getElementById("btnChooseUploadInspect"),

      desktopTabs: document.querySelectorAll(".workspace-tab-btn"),
      tabPanels: document.querySelectorAll(".tab-panel"),
      bottomDockNavItems: document.getElementById("bottomDockNavItems"),
      libraryCount: document.getElementById("libraryCount"),

      // Wizard Elements
      stepNodes: [
        document.getElementById("stepNode1"),
        document.getElementById("stepNode2"),
        document.getElementById("stepNode3"),
      ],
      wizardPane1: document.getElementById("wizardPane1"),
      wizardPane2: document.getElementById("wizardPane2"),
      wizardPane3: document.getElementById("wizardPane3"),
      inputCenterLetter: document.getElementById("inputCenterLetter"),
      inputOuterLetters: document.getElementById("inputOuterLetters"),
      centerLetterError: document.getElementById("centerLetterError"),
      outerLettersError: document.getElementById("outerLettersError"),
      btnAlphabetSortLetters: document.getElementById("btnAlphabetSortLetters"),
      btnClearHiveLetters: document.getElementById("btnClearHiveLetters"),
      btnAutoSolveStep1: document.getElementById("btnAutoSolveStep1"),
      chkAutoFillOnNext: document.getElementById("chkAutoFillOnNext"),
      previewHexCenter: document.getElementById("previewHexCenter"),
      previewHexes: [
        document.getElementById("previewHex0"),
        document.getElementById("previewHex1"),
        document.getElementById("previewHex2"),
        document.getElementById("previewHex3"),
        document.getElementById("previewHex4"),
        document.getElementById("previewHex5"),
      ],
      hiveStatusTag: document.getElementById("hiveStatusTag"),
      hiveSolverBadge: document.getElementById("hiveSolverBadge"),
      btnNextToStep2: document.getElementById("btnNextToStep2"),
      btnBackToStep1: document.getElementById("btnBackToStep1"),
      btnNextToStep3: document.getElementById("btnNextToStep3"),
      btnBackToStep2: document.getElementById("btnBackToStep2"),
      btnSaveAndAddAnother: document.getElementById("btnSaveAndAddAnother"),
      btnSaveAndFinish: document.getElementById("btnSaveAndFinish"),

      displayActiveCenter: document.getElementById("displayActiveCenter"),
      displayActiveOuter: document.getElementById("displayActiveOuter"),
      inputRawWords: document.getElementById("inputRawWords"),
      btnGenerateAllWords: document.getElementById("btnGenerateAllWords"),
      btnAppendDictionaryWords: document.getElementById("btnAppendDictionaryWords"),
      btnCleanWordList: document.getElementById("btnCleanWordList"),
      btnFilterInvalidNow: document.getElementById("btnFilterInvalidNow"),
      validWordsCount: document.getElementById("validWordsCount"),
      pangramsCount: document.getElementById("pangramsCount"),
      invalidWordsCount: document.getElementById("invalidWordsCount"),
      estimatedScore: document.getElementById("estimatedScore"),
      invalidWordsDrawer: document.getElementById("invalidWordsDrawer"),
      invalidDrawerTitle: document.getElementById("invalidDrawerTitle"),
      invalidWordsList: document.getElementById("invalidWordsList"),

      // Step 3 Audit
      revCenterLetter: document.getElementById("revCenterLetter"),
      revOuterLetters: document.getElementById("revOuterLetters"),
      revWordCount: document.getElementById("revWordCount"),
      revPangramCount: document.getElementById("revPangramCount"),
      revMaxScore: document.getElementById("revMaxScore"),
      revGeniusScore: document.getElementById("revGeniusScore"),
      revPangramsList: document.getElementById("revPangramsList"),
      revMatrixTable: document.getElementById("revMatrixTable"),

      // Manager Ledger
      librarySearchInput: document.getElementById("librarySearchInput"),
      filterChips: document.querySelectorAll(".filter-chip"),
      countFilterAll: document.getElementById("countFilterAll"),
      countFilterWarning: document.getElementById("countFilterWarning"),
      countFilterNoPangram: document.getElementById("countFilterNoPangram"),
      btnAppendNewRecord: document.getElementById("btnAppendNewRecord"),
      btnUploadAdditionalCsv: document.getElementById("btnUploadAdditionalCsv"),
      btnClearAllRecords: document.getElementById("btnClearAllRecords"),
      puzzlesTable: document.getElementById("puzzlesTable"),
      puzzlesTableBody: document.getElementById("puzzlesTableBody"),
      libraryEmptyState: document.getElementById("libraryEmptyState"),
      btnEmptyStartWizard: document.getElementById("btnEmptyStartWizard"),
      btnEmptyUpload: document.getElementById("btnEmptyUpload"),

      // Serialization
      btnModeFriendly: document.getElementById("btnModeFriendly"),
      btnModeRaw: document.getElementById("btnModeRaw"),
      btnCopyRawCsv: document.getElementById("btnCopyRawCsv"),
      btnTriggerExportFromPreview: document.getElementById("btnTriggerExportFromPreview"),
      previewFriendlyContainer: document.getElementById("previewFriendlyContainer"),
      previewRawContainer: document.getElementById("previewRawContainer"),
      friendlyPreviewBody: document.getElementById("friendlyPreviewBody"),
      rawCsvTextArea: document.getElementById("rawCsvTextArea"),

      // Lexicon Settings
      selectOnlineSource: document.getElementById("selectOnlineSource"),
      customUrlGroup: document.getElementById("customUrlGroup"),
      inputCustomUrl: document.getElementById("inputCustomUrl"),
      btnPreloadOnlineDictionary: document.getElementById("btnPreloadOnlineDictionary"),
      btnClearCachedDictionary: document.getElementById("btnClearCachedDictionary"),
      lexiconStatusBox: document.getElementById("lexiconStatusBox"),
      lexiconStatusText: document.getElementById("lexiconStatusText"),

      // Export Dialog
      modalExport: document.getElementById("modalExport"),
      exportCountPuzzles: document.getElementById("exportCountPuzzles"),
      exportCountWords: document.getElementById("exportCountWords"),
      exportFileName: document.getElementById("exportFileName"),
      radioCountAll: document.getElementById("radioCountAll"),
      btnConfirmDownload: document.getElementById("btnConfirmDownload"),

      // Confirm Dialog
      modalConfirm: document.getElementById("modalConfirm"),
      confirmModalTitle: document.getElementById("confirmModalTitle"),
      confirmModalMessage: document.getElementById("confirmModalMessage"),
      btnConfirmAction: document.getElementById("btnConfirmAction"),
    };
  }

  hydrateFromConfig() {
    document.title = `${APP_CONFIG.identity.appName} • ${APP_CONFIG.identity.appTagline}`;
    this.dom.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.defaultEyebrow;
    this.dom.pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
    this.dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
    this.dom.btnBackNavLabel.textContent = APP_CONFIG.content.actions.back;

    // Hydrate Mobile Thumb-Zone Bottom Dock
    if (this.dom.bottomDockNavItems) {
      this.dom.bottomDockNavItems.innerHTML = APP_CONFIG.navigation.items
        .filter((item) => item.showInBottomBar)
        .map(
          (item) => `
          <button type="button" class="nav-tab-item interactive-tactile" data-target="${item.id}" aria-label="${item.label}">
            <span class="nav-tab-item__icon">${item.icon}</span>
            <span class="nav-tab-item__label">${item.label}</span>
            <span class="nav-tab-item__indicator"></span>
          </button>
        `
        )
        .join("");
    }
  }

  bindEvents() {
    // Micro-haptic tactile triggers
    document.addEventListener("click", (e) => {
      if (e.target.closest(".interactive-tactile, .filter-chip, .step-node")) {
        triggerHapticPulse();
      }
    });

    // Back Navigation Control
    this.dom.btnHeaderBack.addEventListener("click", () => {
      if (!this.dom.workspaceView.hidden) {
        this.dom.workspaceView.hidden = true;
        this.dom.welcomeView.hidden = false;
        this.announce("Returned to home view.");
      }
    });

    // Welcome Screen Triggers
    this.dom.btnChooseUploadAppend.addEventListener("click", () => this.dom.fileCsvInput.click());
    this.dom.btnChooseUploadInspect.addEventListener("click", () => this.dom.fileCsvInput.click());
    this.dom.btnChooseStartFresh.addEventListener("click", () => {
      this.showWorkspace();
      this.switchTab("panelWizard");
      this.resetWizard();
    });

    this.dom.btnEmptyStartWizard.addEventListener("click", () => {
      this.switchTab("panelWizard");
      this.resetWizard();
    });
    this.dom.btnEmptyUpload.addEventListener("click", () => this.dom.fileCsvInput.click());

    // File Input Parser
    this.dom.fileCsvInput.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result;
        if (typeof text === "string") {
          this.loadCsvString(text, false);
          this.showWorkspace();
          this.switchTab("panelManager");
        }
        this.dom.fileCsvInput.value = "";
      };
      reader.readAsText(file);
    });

    this.dom.btnFlashClose.addEventListener("click", () => {
      this.dom.flashBanner.hidden = true;
    });

    // Header Controls
    this.dom.btnHeaderReset.addEventListener("click", () => {
      this.openConfirm(
        "Reset Workspace?",
        "This will clear all honeycombs from your active session. Be sure to export your CSV first if needed.",
        () => {
          this.puzzles = [];
          this.persistSession();
          this.updateGlobalStats();
          this.renderManagerTable();
          this.resetWizard();
          this.showFlash("Active session reset.", "success");
        }
      );
    });

    this.dom.btnHeaderExport.addEventListener("click", () => this.openExportModal());
    this.dom.btnTriggerExportFromPreview.addEventListener("click", () => this.openExportModal());

    // Navigation Tabs (Desktop & Mobile)
    const handleTabClick = (targetId) => {
      if (!targetId) return;
      this.showWorkspace();
      this.switchTab(targetId);
    };

    this.dom.desktopTabs.forEach((btn) => {
      btn.addEventListener("click", () => handleTabClick(btn.getAttribute("data-target")));
    });

    if (this.dom.bottomDockNavItems) {
      this.dom.bottomDockNavItems.addEventListener("click", (e) => {
        const item = e.target.closest(".nav-tab-item");
        if (item) handleTabClick(item.getAttribute("data-target"));
      });
    }

    // Wizard Stepper
    this.dom.stepNodes.forEach((node) => {
      node.addEventListener("click", () => {
        const step = parseInt(node.getAttribute("data-step"), 10);
        if (step === 2 && !this.validateStep1()) return;
        if (step === 3 && (!this.validateStep1() || !this.validateStep2())) return;
        this.goToStep(step);
      });
    });

    // Step 1 Inputs
    const onLetterInput = () => {
      const center = (this.dom.inputCenterLetter.value || "").toUpperCase().trim();
      const outer = (this.dom.inputOuterLetters.value || "").toUpperCase().replace(/[^A-Z]/g, "");
      this.dom.inputCenterLetter.value = center;
      this.dom.inputOuterLetters.value = outer;
      this.updateMiniHive(center, outer);
      this.checkAvailableMatchesIfLoaded(center, outer);
    };

    this.dom.inputCenterLetter.addEventListener("input", onLetterInput);
    this.dom.inputOuterLetters.addEventListener("input", onLetterInput);

    this.dom.btnAlphabetSortLetters.addEventListener("click", () => {
      const outer = this.dom.inputOuterLetters.value.toUpperCase().replace(/[^A-Z]/g, "");
      this.dom.inputOuterLetters.value = outer.split("").sort().join("");
      onLetterInput();
    });

    this.dom.btnClearHiveLetters.addEventListener("click", () => {
      this.dom.inputCenterLetter.value = "";
      this.dom.inputOuterLetters.value = "";
      onLetterInput();
    });

    this.dom.btnAutoSolveStep1.addEventListener("click", async () => {
      if (!this.validateStep1()) return;
      await this.executeAutoSolve(false);
      this.goToStep(2);
    });

    // Step 2 Actions
    this.dom.btnGenerateAllWords.addEventListener("click", async () => {
      await this.executeAutoSolve(false);
    });

    this.dom.btnAppendDictionaryWords.addEventListener("click", async () => {
      await this.executeAutoSolve(true);
    });

    this.dom.btnCleanWordList.addEventListener("click", () => {
      const c = this.dom.inputCenterLetter.value.trim().toUpperCase();
      const o = this.dom.inputOuterLetters.value.trim().toUpperCase();
      const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, c, o);
      this.dom.inputRawWords.value = audit.validWords.join(" ");
      this.auditCurrentWords();
      this.showFlash("Vocabulary deduplicated and sorted.", "success");
    });

    this.dom.btnFilterInvalidNow.addEventListener("click", () => {
      const c = this.dom.inputCenterLetter.value.trim().toUpperCase();
      const o = this.dom.inputOuterLetters.value.trim().toUpperCase();
      const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, c, o);
      this.dom.inputRawWords.value = audit.validWords.join(" ");
      this.auditCurrentWords();
      this.showFlash(`Pruned ${audit.invalidWords.length} rejected words.`, "success");
    });

    this.dom.inputRawWords.addEventListener("input", () => this.auditCurrentWords());

    // Wizard Navigation
    this.dom.btnNextToStep2.addEventListener("click", async () => {
      if (this.validateStep1()) {
        if (this.dom.chkAutoFillOnNext?.checked && !this.dom.inputRawWords.value.trim()) {
          await this.executeAutoSolve(false);
        }
        this.goToStep(2);
      }
    });

    this.dom.btnBackToStep1.addEventListener("click", () => this.goToStep(1));
    this.dom.btnNextToStep3.addEventListener("click", () => {
      if (this.validateStep2()) {
        this.populateStep3Review();
        this.goToStep(3);
      }
    });
    this.dom.btnBackToStep2.addEventListener("click", () => this.goToStep(2));

    // Commit Actions
    this.dom.btnSaveAndAddAnother.addEventListener("click", () => {
      this.commitCurrentPuzzle();
      this.resetWizard();
      this.goToStep(1);
      this.showFlash(APP_CONFIG.content.notifications.saveSuccess, "success");
    });

    this.dom.btnSaveAndFinish.addEventListener("click", () => {
      this.commitCurrentPuzzle();
      this.switchTab("panelManager");
      this.showFlash(APP_CONFIG.content.notifications.saveSuccess, "success");
    });

    // Manager Controls
    this.dom.btnAppendNewRecord.addEventListener("click", () => {
      this.resetWizard();
      this.switchTab("panelWizard");
    });

    this.dom.btnUploadAdditionalCsv.addEventListener("click", () => this.dom.fileCsvInput.click());

    this.dom.btnClearAllRecords.addEventListener("click", () => {
      this.openConfirm("Clear All Records?", "Permanently remove all honeycombs from memory?", () => {
        this.puzzles = [];
        this.persistSession();
        this.updateGlobalStats();
        this.renderManagerTable();
        this.showFlash("All records cleared.", "success");
      });
    });

    this.dom.librarySearchInput.addEventListener("input", (e) => {
      this.searchQuery = e.target.value.trim().toLowerCase();
      this.renderManagerTable();
    });

    this.dom.filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.dom.filterChips.forEach((c) => c.classList.remove("filter-chip--active"));
        chip.classList.add("filter-chip--active");
        this.filter = chip.getAttribute("data-filter") || "all";
        this.renderManagerTable();
      });
    });

    // Table Actions (Delegation)
    this.dom.puzzlesTableBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const index = parseInt(btn.getAttribute("data-index"), 10);
      if (isNaN(index)) return;

      if (btn.classList.contains("btn-table-edit")) {
        this.loadPuzzleIntoWizard(index);
        this.switchTab("panelWizard");
      } else if (btn.classList.contains("btn-table-dup")) {
        this.duplicatePuzzle(index);
      } else if (btn.classList.contains("btn-table-del")) {
        this.openConfirm("Delete Honeycomb?", `Permanently delete Hive #${index + 1}?`, () => {
          this.puzzles.splice(index, 1);
          this.persistSession();
          this.updateGlobalStats();
          this.renderManagerTable();
          this.showFlash(APP_CONFIG.content.notifications.deleteSuccess, "success");
        });
      }
    });

    // Preview Mode Toggles
    this.dom.btnModeFriendly.addEventListener("click", () => {
      this.previewMode = "friendly";
      this.dom.btnModeFriendly.classList.add("mode-btn--active");
      this.dom.btnModeRaw.classList.remove("mode-btn--active");
      this.dom.previewFriendlyContainer.hidden = false;
      this.dom.previewRawContainer.hidden = true;
      this.renderPreview();
    });

    this.dom.btnModeRaw.addEventListener("click", () => {
      this.previewMode = "raw";
      this.dom.btnModeRaw.classList.add("mode-btn--active");
      this.dom.btnModeFriendly.classList.remove("mode-btn--active");
      this.dom.previewFriendlyContainer.hidden = true;
      this.dom.previewRawContainer.hidden = false;
      this.renderPreview();
    });

    this.dom.btnCopyRawCsv.addEventListener("click", () => {
      const raw = CsvEngine.serialize(this.puzzles);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(raw)
          .then(() => this.showFlash(APP_CONFIG.content.notifications.clipboardSuccess, "success"))
          .catch(() => this.showFlash(APP_CONFIG.content.notifications.clipboardError, "error"));
      }
    });

    // Lexicon Settings
    this.dom.selectOnlineSource.addEventListener("change", () => {
      const val = this.dom.selectOnlineSource.value;
      this.dictionary.activeSourceKey = val;
      this.dom.customUrlGroup.hidden = val !== "custom";
      this.dictionary.clear();
      this.updateLexiconStatusUi();
    });

    this.dom.inputCustomUrl.addEventListener("change", () => {
      this.dictionary.customUrl = this.dom.inputCustomUrl.value.trim();
      this.dictionary.clear();
      this.updateLexiconStatusUi();
    });

    this.dom.btnPreloadOnlineDictionary.addEventListener("click", () => this.ensureDictionaryLoadedWithFeedback());

    this.dom.btnClearCachedDictionary.addEventListener("click", () => {
      this.dictionary.clear();
      this.updateLexiconStatusUi();
      this.showFlash("Local lexicon cache purged.", "success");
    });

    // Export Confirmation
    this.dom.btnConfirmDownload.addEventListener("click", () => this.executeDownload());

    // Modal Dismissals
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-close");
        const target = document.getElementById(id);
        if (target) target.hidden = true;
      });
    });

    this.dom.btnConfirmAction.addEventListener("click", () => {
      this.dom.modalConfirm.hidden = true;
      if (typeof this.pendingConfirmCallback === "function") {
        this.pendingConfirmCallback();
        this.pendingConfirmCallback = null;
      }
    });
  }

  /* ==========================================================================
     ONLINE SOLVER ENGINE
     ========================================================================== */
  async ensureDictionaryLoadedWithFeedback() {
    if (this.dictionary.isLoaded && this.dictionary.wordsSet.size > 0) return true;

    this.showFlash("Connecting to online dictionary...", "success");
    this.dom.topStatLexicon.textContent = "Fetching...";
    this.dom.topStatLexicon.className = "telemetry-status status--terracotta";
    this.dom.lexiconStatusText.textContent = "Connecting to remote word repository via CDN...";

    try {
      await this.dictionary.ensureLoaded((msg) => {
        this.dom.lexiconStatusText.textContent = msg;
      });

      this.updateLexiconStatusUi();
      this.showFlash(`${APP_CONFIG.content.notifications.dictionaryLoaded} (${this.dictionary.wordsSet.size.toLocaleString()} words)`, "success");
      return true;
    } catch (err) {
      this.dom.topStatLexicon.textContent = "Failed";
      this.dom.topStatLexicon.className = "telemetry-status status--terracotta";
      this.dom.lexiconStatusText.textContent = `Remote error: ${err.message}`;
      this.showFlash(APP_CONFIG.content.notifications.dictionaryError, "error");
      return false;
    }
  }

  updateLexiconStatusUi() {
    if (this.dictionary.isLoaded) {
      const count = this.dictionary.wordsSet.size.toLocaleString();
      this.dom.topStatLexicon.textContent = `${count} words`;
      this.dom.topStatLexicon.className = "telemetry-status status--sage";
      this.dom.lexiconStatusText.textContent = `Online Lexicon Active: ${count} verified words cached in memory.`;
    } else {
      this.dom.topStatLexicon.textContent = "Ready";
      this.dom.topStatLexicon.className = "telemetry-status status--sage";
      this.dom.lexiconStatusText.textContent = "Lexicon Status: Idle (Will download automatically when you run auto-solve).";
    }
  }

  checkAvailableMatchesIfLoaded(center, outer) {
    const validation = PuzzleModel.validateLetters(center, outer);
    if (!validation.valid || !this.dictionary.isLoaded) {
      this.dom.hiveSolverBadge.hidden = true;
      return;
    }

    const match = this.dictionary.solveHive(center, outer);
    this.dom.hiveSolverBadge.hidden = false;
    const pangramNotice = match.pangrams.length > 0 ? ` (${match.pangrams.length} ★ pangrams)` : " (No pangrams found)";
    this.dom.hiveSolverBadge.innerHTML = `<strong>⚡ ${match.words.length}</strong> available words in dictionary${pangramNotice}`;
  }

  async executeAutoSolve(appendOnly = false) {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase();

    const validation = PuzzleModel.validateLetters(center, outer);
    if (!validation.valid) {
      this.showFlash("Please configure a valid 7-letter honeycomb first.", "error");
      return;
    }

    const loaded = await this.ensureDictionaryLoadedWithFeedback();
    if (!loaded) return;

    const solution = this.dictionary.solveHive(center, outer);
    if (solution.words.length === 0) {
      this.showFlash("No valid anagrams found in dictionary for these 7 letters. You can still input custom words.", "error");
      return;
    }

    let finalWords = [];
    if (appendOnly && this.dom.inputRawWords.value.trim()) {
      const existing = this.dom.inputRawWords.value.split(/\s+/).map((w) => w.trim().toUpperCase());
      finalWords = [...new Set([...existing, ...solution.words])];
    } else {
      finalWords = solution.words;
    }

    this.dom.inputRawWords.value = finalWords.join(" ");
    this.auditCurrentWords();

    const pangramText = solution.pangrams.length > 0 ? ` with ${solution.pangrams.length} pangrams!` : "";
    this.showFlash(`⚡ Extracted ${solution.words.length} words from lexicon${pangramText}`, "success");
  }

  /* ==========================================================================
     VIEW MANAGEMENT
     ========================================================================== */
  showWorkspace() {
    this.dom.welcomeView.hidden = true;
    this.dom.workspaceView.hidden = false;
  }

  switchTab(panelId) {
    this.dom.desktopTabs.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-target") === panelId);
    });

    if (this.dom.bottomDockNavItems) {
      this.dom.bottomDockNavItems.querySelectorAll(".nav-tab-item").forEach((btn) => {
        btn.classList.toggle("nav-tab-item--active", btn.getAttribute("data-target") === panelId);
      });
    }

    this.dom.tabPanels.forEach((panel) => {
      panel.hidden = panel.id !== panelId;
    });

    if (panelId === "panelManager") this.renderManagerTable();
    else if (panelId === "panelPreview") this.renderPreview();
  }

  showFlash(msg, type = "success") {
    this.dom.flashMessage.textContent = msg;
    this.dom.flashBanner.className = `flash-banner ${type}`;
    this.dom.flashBanner.hidden = false;
    this.announce(msg);
    setTimeout(() => {
      this.dom.flashBanner.hidden = true;
    }, 5000);
  }

  openConfirm(title, message, callback) {
    this.dom.confirmModalTitle.textContent = title;
    this.dom.confirmModalMessage.textContent = message;
    this.pendingConfirmCallback = callback;
    this.dom.modalConfirm.hidden = false;
  }

  announce(msg) {
    if (this.dom.srAnnouncer) {
      this.dom.srAnnouncer.textContent = msg;
    }
  }

  /* ==========================================================================
     WIZARD CONTROLLER
     ========================================================================== */
  goToStep(stepNumber) {
    this.wizardStep = stepNumber;
    this.dom.stepNodes.forEach((node, idx) => {
      const nodeStep = idx + 1;
      node.classList.toggle("active", nodeStep === stepNumber);
      node.setAttribute("aria-selected", nodeStep === stepNumber ? "true" : "false");
    });

    this.dom.wizardPane1.hidden = stepNumber !== 1;
    this.dom.wizardPane2.hidden = stepNumber !== 2;
    this.dom.wizardPane3.hidden = stepNumber !== 3;

    if (stepNumber === 2) {
      const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
      const outer = this.dom.inputOuterLetters.value.trim().toUpperCase();
      this.dom.displayActiveCenter.textContent = center;
      this.dom.displayActiveOuter.textContent = outer;
      this.auditCurrentWords();
    }
  }

  validateStep1() {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase().replace(/[^A-Z]/g, "");
    const validation = PuzzleModel.validateLetters(center, outer);

    this.dom.centerLetterError.textContent = validation.center || "";
    this.dom.outerLettersError.textContent = validation.outer || "";

    if (!validation.valid) {
      this.showFlash("Please resolve letter errors before continuing.", "error");
      return false;
    }
    return true;
  }

  validateStep2() {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase();
    const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, center, outer);

    if (audit.validWords.length === 0) {
      this.showFlash("Puzzle requires at least 1 valid word adhering to hive rules.", "error");
      return false;
    }

    if (audit.pangrams.length === 0) {
      if (!confirm("Warning: No pangram using all 7 letters was detected. Quality puzzles usually contain at least one. Proceed anyway?")) {
        return false;
      }
    }
    return true;
  }

  auditCurrentWords() {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase();
    const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, center, outer);

    this.dom.validWordsCount.textContent = audit.validWords.length;
    this.dom.pangramsCount.textContent = audit.pangrams.length;
    this.dom.invalidWordsCount.textContent = audit.invalidWords.length;
    this.dom.estimatedScore.textContent = audit.maxScore;

    if (audit.invalidWords.length > 0) {
      this.dom.invalidWordsDrawer.hidden = false;
      this.dom.invalidDrawerTitle.textContent = `${audit.invalidWords.length} rejected tokens violate rules:`;
      this.dom.invalidWordsList.innerHTML = audit.invalidWords
        .slice(0, 30)
        .map((item) => `<span class="invalid-chip" title="${item.reason}">${item.word}</span>`)
        .join("");
    } else {
      this.dom.invalidWordsDrawer.hidden = true;
    }
  }

  updateMiniHive(center, outer) {
    if (this.dom.previewHexCenter) {
      this.dom.previewHexCenter.textContent = center || "-";
    }

    this.dom.previewHexes.forEach((hex, idx) => {
      const letter = outer[idx] || "-";
      hex.textContent = letter;
      hex.classList.toggle("filled", !!outer[idx]);
    });

    const validation = PuzzleModel.validateLetters(center, outer);
    if (validation.valid) {
      this.dom.hiveStatusTag.textContent = "7 Letters Verified ✓";
      this.dom.hiveStatusTag.className = "hive-status-pill ready";
    } else {
      this.dom.hiveStatusTag.textContent = "Incomplete or duplicate letters";
      this.dom.hiveStatusTag.className = "hive-status-pill";
    }
  }

  populateStep3Review() {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase();
    const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, center, outer);

    this.dom.revCenterLetter.textContent = center;
    this.dom.revOuterLetters.textContent = outer.split("").join(" ");
    this.dom.revWordCount.textContent = `${audit.validWords.length} words`;
    this.dom.revPangramCount.textContent = audit.pangrams.length;
    this.dom.revMaxScore.textContent = `${audit.maxScore} pts`;
    this.dom.revGeniusScore.textContent = `${Math.round(audit.maxScore * 0.85)} pts`;

    if (audit.pangrams.length > 0) {
      this.dom.revPangramsList.innerHTML = audit.pangrams
        .map((p) => `<span class="pangram-pill">${p} (${p.length === 7 ? "★★ Perfect" : "★ Pangram"})</span>`)
        .join("");
    } else {
      this.dom.revPangramsList.innerHTML = '<span class="text-muted">None detected (Consider adding one)</span>';
    }

    // Matrix Generation
    const lengths = [...new Set(audit.validWords.map((w) => w.length))].sort((a, b) => a - b);
    const letters = [center, ...outer.split("")].sort();

    let tableHtml = `<thead><tr><th scope="col">Letter</th>`;
    lengths.forEach((l) => { tableHtml += `<th scope="col">${l}</th>`; });
    tableHtml += `<th scope="col">Total</th></tr></thead><tbody>`;

    letters.forEach((ltr) => {
      const wordsForLtr = audit.validWords.filter((w) => w.startsWith(ltr));
      tableHtml += `<tr><th scope="row">${ltr}</th>`;
      let rowSum = 0;
      lengths.forEach((len) => {
        const count = wordsForLtr.filter((w) => w.length === len).length;
        tableHtml += `<td>${count > 0 ? count : "-"}</td>`;
        rowSum += count;
      });
      tableHtml += `<td><strong>${rowSum}</strong></td></tr>`;
    });
    tableHtml += `</tbody>`;
    this.dom.revMatrixTable.innerHTML = tableHtml;
  }

  commitCurrentPuzzle() {
    const center = this.dom.inputCenterLetter.value.trim().toUpperCase();
    const outer = this.dom.inputOuterLetters.value.trim().toUpperCase().replace(/[^A-Z]/g, "");
    const audit = PuzzleModel.parseAndAuditWords(this.dom.inputRawWords.value, center, outer);

    this.dictionary.addWords(audit.validWords);

    const record = {
      centerLetter: center,
      outerLetters: outer,
      words: audit.validWords,
      pangrams: audit.pangrams,
      maxScore: audit.maxScore,
      createdThisSession: true,
    };

    if (this.currentWizardIndex >= 0 && this.currentWizardIndex < this.puzzles.length) {
      this.puzzles[this.currentWizardIndex] = record;
    } else {
      this.puzzles.push(record);
    }

    this.persistSession();
    this.updateGlobalStats();
  }

  resetWizard() {
    this.currentWizardIndex = -1;
    this.dom.inputCenterLetter.value = "";
    this.dom.inputOuterLetters.value = "";
    this.dom.inputRawWords.value = "";
    this.dom.centerLetterError.textContent = "";
    this.dom.outerLettersError.textContent = "";
    this.dom.hiveSolverBadge.hidden = true;
    this.updateMiniHive("", "");
    this.auditCurrentWords();
    this.goToStep(1);
  }

  loadPuzzleIntoWizard(index) {
    const p = this.puzzles[index];
    if (!p) return;
    this.currentWizardIndex = index;
    this.dom.inputCenterLetter.value = p.centerLetter;
    this.dom.inputOuterLetters.value = p.outerLetters;
    this.dom.inputRawWords.value = Array.isArray(p.words) ? p.words.join(" ") : String(p.words);
    this.updateMiniHive(p.centerLetter, p.outerLetters);
    this.checkAvailableMatchesIfLoaded(p.centerLetter, p.outerLetters);
    this.auditCurrentWords();
    this.goToStep(1);
  }

  duplicatePuzzle(index) {
    const p = this.puzzles[index];
    if (!p) return;
    const clone = {
      centerLetter: p.centerLetter,
      outerLetters: p.outerLetters,
      words: [...p.words],
      pangrams: [...p.pangrams],
      maxScore: p.maxScore,
      createdThisSession: true,
    };
    this.puzzles.splice(index + 1, 0, clone);
    this.persistSession();
    this.updateGlobalStats();
    this.renderManagerTable();
    this.showFlash(`Hive #${index + 1} duplicated.`, "success");
  }

  /* ==========================================================================
     MANAGER TABLE & FILTERING
     ========================================================================== */
  renderManagerTable() {
    if (this.puzzles.length === 0) {
      this.dom.puzzlesTable.hidden = true;
      this.dom.libraryEmptyState.hidden = false;
      return;
    }

    this.dom.puzzlesTable.hidden = false;
    this.dom.libraryEmptyState.hidden = true;

    const filtered = this.puzzles.filter((p) => {
      const matchesSearch =
        !this.searchQuery ||
        p.centerLetter.toLowerCase().includes(this.searchQuery) ||
        p.outerLetters.toLowerCase().includes(this.searchQuery) ||
        p.words.some((w) => w.toLowerCase().includes(this.searchQuery));

      if (!matchesSearch) return false;

      if (this.filter === "nopangram") return p.pangrams.length === 0;
      if (this.filter === "warning") return p.words.length < 5 || p.pangrams.length === 0;
      return true;
    });

    this.dom.puzzlesTableBody.innerHTML = filtered
      .map((p) => {
        const originalIndex = this.puzzles.indexOf(p);
        const hasWarning = p.words.length < 5 || p.pangrams.length === 0;
        const statusBadge = hasWarning
          ? `<span class="label-badge label-badge--terracotta">Needs Audit</span>`
          : `<span class="telemetry-status status--sage">Verified</span>`;

        return `
          <tr>
            <td><strong>#${originalIndex + 1}</strong></td>
            <td><strong class="font-serif highlight-amber">${p.centerLetter}</strong></td>
            <td><span class="font-mono">${p.outerLetters}</span></td>
            <td>${p.words.length} words</td>
            <td>${p.pangrams.length} ${p.pangrams.length > 0 ? "★" : ""}</td>
            <td>${p.maxScore} pts</td>
            <td>${statusBadge}</td>
            <td>
              <div class="table-action-strip">
                <button type="button" class="interactive-tactile btn-secondary btn-xs btn-table-edit" data-index="${originalIndex}">Edit</button>
                <button type="button" class="interactive-tactile btn-secondary btn-xs btn-table-dup" data-index="${originalIndex}">Copy</button>
                <button type="button" class="interactive-tactile btn-secondary btn-xs btn-destructive btn-table-del" data-index="${originalIndex}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  /* ==========================================================================
     LIVE SERIALIZATION PREVIEW
     ========================================================================== */
  renderPreview() {
    if (this.previewMode === "friendly") {
      this.dom.friendlyPreviewBody.innerHTML = this.puzzles
        .map((p, idx) => {
          const sample = p.words.slice(0, 5).join(", ") + (p.words.length > 5 ? " ..." : "");
          return `
            <tr>
              <td><strong>#${idx + 1}</strong></td>
              <td><strong>${p.centerLetter}</strong></td>
              <td><code>${p.outerLetters}</code></td>
              <td><span style="font-size: 0.8125rem; color: var(--color-text-secondary);">${sample}</span></td>
              <td>${p.words.length}</td>
              <td>${p.pangrams.length}</td>
            </tr>
          `;
        })
        .join("");
    } else {
      this.dom.rawCsvTextArea.value = CsvEngine.serialize(this.puzzles);
    }
  }

  /* ==========================================================================
     CSV IMPORT PARSER
     ========================================================================== */
  loadCsvString(csvText, clearExisting = false) {
    const rows = CsvEngine.parse(csvText);
    if (rows.length < 2) {
      this.showFlash("Uploaded CSV file contains no valid data rows.", "error");
      return;
    }

    const headers = rows[0].map((h) => (h || "").trim().toLowerCase());
    let centerIdx = -1;
    let outerIdx = -1;
    let wordsIdx = -1;

    headers.forEach((h, idx) => {
      if (h.includes("center")) centerIdx = idx;
      else if (h.includes("outer")) outerIdx = idx;
      else if (h.includes("word")) wordsIdx = idx;
    });

    if (centerIdx === -1 || outerIdx === -1 || wordsIdx === -1) {
      centerIdx = 0;
      outerIdx = 1;
      wordsIdx = 2;
    }

    const parsedPuzzles = [];
    let rejectedRows = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length <= Math.max(centerIdx, outerIdx, wordsIdx)) continue;

      const centerLetter = (row[centerIdx] || "").trim().toUpperCase();
      const outerLetters = (row[outerIdx] || "").trim().toUpperCase().replace(/[^A-Z]/g, "");

      const validation = PuzzleModel.validateLetters(centerLetter, outerLetters);
      if (!validation.valid) {
        rejectedRows++;
        continue;
      }

      const rawWords = row.slice(wordsIdx).join(" ");
      const audit = PuzzleModel.parseAndAuditWords(rawWords, centerLetter, outerLetters);

      if (audit.validWords.length === 0) {
        rejectedRows++;
        continue;
      }

      this.dictionary.addWords(audit.validWords);

      parsedPuzzles.push({
        centerLetter,
        outerLetters,
        words: audit.validWords,
        pangrams: audit.pangrams,
        maxScore: audit.maxScore,
        createdThisSession: false,
      });
    }

    if (clearExisting) {
      this.puzzles = parsedPuzzles;
    } else {
      this.puzzles = [...this.puzzles, ...parsedPuzzles];
    }

    this.persistSession();
    this.updateGlobalStats();
    this.renderManagerTable();

    let msg = `Loaded ${parsedPuzzles.length} valid honeycombs.`;
    if (rejectedRows > 0) msg += ` (${rejectedRows} malformed rows excluded)`;
    this.showFlash(msg, rejectedRows > 0 ? "error" : "success");
  }

  /* ==========================================================================
     GLOBAL STATS & PERSISTENCE
     ========================================================================== */
  updateGlobalStats() {
    const totalPuzzles = this.puzzles.length;
    const totalWords = this.puzzles.reduce((sum, p) => sum + p.words.length, 0);

    this.dom.topStatPuzzles.textContent = totalPuzzles;
    this.dom.topStatWords.textContent = totalWords;
    this.dom.libraryCount.textContent = totalPuzzles;
    this.dom.countFilterAll.textContent = totalPuzzles;

    const warnings = this.puzzles.filter((p) => p.words.length < 5 || p.pangrams.length === 0).length;
    const noPangrams = this.puzzles.filter((p) => p.pangrams.length === 0).length;

    this.dom.countFilterWarning.textContent = warnings;
    this.dom.countFilterNoPangram.textContent = noPangrams;
  }

  persistSession() {
    if (!APP_CONFIG.features.enableAutoSave) return;
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.puzzles, JSON.stringify(this.puzzles));
    } catch (e) {
      console.warn("Storage write failed:", e);
    }
  }

  loadPersistedSession() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.puzzles);
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) {
          this.puzzles = data;
          data.forEach((p) => this.dictionary.addWords(p.words));
          this.showWorkspace();
          this.switchTab("panelManager");
        }
      }
    } catch (e) {}
  }

  /* ==========================================================================
     CSV EXPORT
     ========================================================================== */
  openExportModal() {
    const totalWords = this.puzzles.reduce((sum, p) => sum + p.words.length, 0);
    this.dom.exportCountPuzzles.textContent = this.puzzles.length;
    this.dom.exportCountWords.textContent = totalWords;
    this.dom.radioCountAll.textContent = this.puzzles.length;
    this.dom.modalExport.hidden = false;
  }

  executeDownload() {
    const mode = document.querySelector('input[name="exportMode"]:checked')?.value || "all";
    let exportDataset = [];

    if (mode === "template") {
      exportDataset = [];
    } else if (mode === "newOnly") {
      exportDataset = this.puzzles.filter((p) => p.createdThisSession);
      if (exportDataset.length === 0) {
        this.showFlash("No new honeycombs created this session. Exporting all records instead.", "error");
        exportDataset = this.puzzles;
      }
    } else {
      exportDataset = this.puzzles;
    }

    const csvContent = CsvEngine.serialize(exportDataset);
    const filename = (this.dom.exportFileName.value || "puzzles.csv").trim();

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.dom.modalExport.hidden = true;
    this.showFlash(`File '${filename}' exported successfully.`, "success");
  }
}

// Self-boot on DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new SpellingBeeStudioApp());
} else {
  new SpellingBeeStudioApp();
}