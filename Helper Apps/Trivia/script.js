/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  identity: {
    appId: "daily-quiz-editorial-architect",
    appName: "Daily Quiz CSV Architect",
    appTagline: "Calibrated 5-Question Cocktail Challenge Engine",
    version: "3.0.0",
    environment: "production",
    canonicalUrl: "https://cocktails.app/builder",
    language: "en-US",
    locale: "en-US",
  },

  branding: {
    accentColor: "#963E35",       // Accessible Terracotta Red
    accentSecondary: "#3E5B42",   // Accessible Sage Green
    accentHighlight: "#6E5614",   // Accessible Warm Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilySerif: "Charter, Cambria, Georgia, serif",
  },

  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "startView",
    items: [
      { id: "startView", label: "Start", route: "#start", enabled: true },
      { id: "builderView", label: "Architect", route: "#builder", enabled: true },
      { id: "managerView", label: "Catalog", route: "#catalog", enabled: true },
      { id: "previewView", label: "Export", route: "#export", enabled: true }
    ],
  },

  content: {
    headers: {
      startView: {
        eyebrow: "EDITORIAL ARCHITECT",
        title: "Cocktail Challenge Builder",
        subtitle: "Create, inspect, and export verified 5-question daily trivia rounds conforming to the production quiz engine."
      },
      builderView: {
        eyebrow: "QUESTION ARCHITECT",
        title: "Compose Challenge Record",
        subtitle: "Formulate prompt, designate solution key, and document historical reference context."
      },
      managerView: {
        eyebrow: "DATASET INVENTORY",
        title: "Question Catalog",
        subtitle: "Audit question balance, reorder challenge sequences, and inspect round completeness."
      },
      previewView: {
        eyebrow: "QUALITY AUDIT & SERIALIZATION",
        title: "Validation & Export",
        subtitle: "Confirm strict RFC 4180 conformity before production download or clipboard distribution."
      }
    },
    notifications: {
      saveSuccess: "Question committed to workspace dataset.",
      saveUpdated: "Question successfully updated.",
      deleteSuccess: "Record permanently removed from catalog.",
      clearSuccess: "All records cleared from workspace.",
      exportSuccess: "Dataset exported successfully.",
      clipboardSuccess: "RFC 4180 CSV copied to system clipboard."
    }
  },

  features: {
    enableHapticFeedback: true,       // 12ms tactile micro-pulse on mobile touches
    enableAutoSave: true,              // Auto-saves session to localStorage
    autoSaveIntervalMs: 4000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,
    questionsPerRound: 5,              // Invariant Daily Quiz round calibration
  },

  endpoints: {
    storageKeys: {
      draftCache: "daily_quiz_editorial_builder_draft_v3",
    },
    exportDefaultName: "puzzles_updated.csv"
  }
});

/**
 * =========================================================================
 * CORE BUSINESS RULES & SCHEMA SPECIFICATION
 * =========================================================================
 */
const SCHEMA = Object.freeze({
  expectedHeaders: ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer', 'explanation'],
  questionsPerRound: APP_CONFIG.features.questionsPerRound
});

const TEMPLATES = Object.freeze({
  cocktail: {
    question: "Which classic cocktail pairs rye whiskey with sweet vermouth and aromatic bitters?",
    option_a: "Manhattan",
    option_b: "Old Fashioned",
    option_c: "Sazerac",
    option_d: "Boulevardier",
    answer: "A",
    explanation: "The Manhattan originated in New York during the 1870s, establishing the classic 2:1 ratio of whiskey to sweet red vermouth."
  },
  spirit: {
    question: "What minimum percentage of corn must be present in the grain mash bill to legally qualify as American Bourbon?",
    option_a: "40 percent",
    option_b: "70 percent",
    option_c: "51 percent",
    option_d: "80 percent",
    answer: "C",
    explanation: "Under the US Federal Standards of Identity for Distilled Spirits, Bourbon whiskey must be produced from a fermented mash of not less than 51 percent corn."
  },
  technique: {
    question: "Why do bartenders stir spirit-forward cocktails like the Martini rather than shake them?",
    option_a: "To maximize aeration and surface foam",
    option_b: "To lower temperature below zero degrees instantly",
    option_c: "To chill and dilute while preserving optical clarity and a velvety mouthfeel",
    option_d: "To evaporate ethanol rapidly",
    answer: "C",
    explanation: "Stirring chills and integrates spirit-forward cocktails cleanly without incorporating air bubbles that cause persistent cloudiness."
  },
  glassware: {
    question: "Which stemmed glassware featuring curved sides and a narrower rim than a coupe is named after a fictional detective couple?",
    option_a: "Snifter",
    option_b: "Highball tumbler",
    option_c: "Coupe",
    option_d: "Nick & Nora",
    answer: "D",
    explanation: "The Nick & Nora glass takes its name from Nick and Nora Charles, the cocktail-sipping sleuths created by Dashiell Hammett in The Thin Man."
  }
});

const CANONICAL_STARTER_DATA = Object.freeze([
  {
    id: "q_starter_1",
    question: "Which classic cocktail is traditionally made with equal parts gin, sweet vermouth, and Campari?",
    option_a: "Boulevardier",
    option_b: "Negroni",
    option_c: "Americano",
    option_d: "Martinez",
    answer: "B",
    explanation: "The Negroni was created in Florence around 1919 when Count Camillo Negroni requested gin in place of soda water in his Americano.",
    isNew: false
  },
  {
    id: "q_starter_2",
    question: "Which stemmed glassware featuring curved sides and a narrower rim than a coupe is named after a fictional detective couple?",
    option_a: "Snifter",
    option_b: "Highball tumbler",
    option_c: "Coupe",
    option_d: "Nick & Nora",
    answer: "D",
    explanation: "The Nick & Nora glass takes its name from Nick and Nora Charles, the cocktail-sipping sleuths in The Thin Man.",
    isNew: false
  },
  {
    id: "q_starter_3",
    question: "What specific agave variety must legally be used to produce certified 100% Tequila?",
    option_a: "Blue Agave (Weber Azul)",
    option_b: "Agave Espadin",
    option_c: "Agave Salmiana",
    option_d: "Agave Tobala",
    answer: "A",
    explanation: "Mexican Norma Oficial Mexicana (NOM) mandates that Tequila can solely be fermented from Agave Tequilana Weber blue variety.",
    isNew: false
  },
  {
    id: "q_starter_4",
    question: "Why do bartenders stir spirit-forward cocktails like the Manhattan rather than shake them?",
    option_a: "To maximize aeration and surface foam",
    option_b: "To lower temperature below zero degrees instantly",
    option_c: "To chill and dilute while preserving optical clarity and a silky texture",
    option_d: "To evaporate ethanol rapidly",
    answer: "C",
    explanation: "Stirring chills and dilutes spirit-forward cocktails cleanly without incorporating air bubbles that cause persistent cloudiness.",
    isNew: false
  },
  {
    id: "q_starter_5",
    question: "Who authored the landmark 1862 work 'How to Mix Drinks', widely acknowledged as the first cocktail manual?",
    option_a: "Harry Craddock",
    option_b: "Jerry Thomas",
    option_c: "Ada Coleman",
    option_d: "Victor Bergeron",
    answer: "B",
    explanation: "Jerry Thomas, revered as the pioneer of American mixology, published the first comprehensive guide to bar service in 1862.",
    isNew: false
  }
]);

/**
 * =========================================================================
 * RFC 4180 CSV SERIALIZER & PARSER ENGINE
 * =========================================================================
 */
const CsvEngine = {
  parse(text) {
    if (!text || !text.trim()) {
      throw new Error("The submitted CSV source is empty.");
    }

    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field.trim());
        field = "";
      } else if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
        if (char === '\r') i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }

    if (field || row.length > 0) {
      row.push(field.trim());
      rows.push(row);
    }

    if (rows.length < 1) {
      throw new Error("No readable records found in CSV file.");
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const missing = SCHEMA.expectedHeaders.filter(eh => !headers.includes(eh));
    if (missing.length > 0) {
      throw new Error(`Incompatible schema. Missing required headers: ${missing.join(', ')}`);
    }

    const records = [];
    for (let r = 1; r < rows.length; r++) {
      const line = rows[r];
      if (line.length === 1 && line[0] === '') continue;

      const item = {};
      headers.forEach((h, idx) => {
        item[h] = line[idx] !== undefined ? line[idx] : "";
      });

      let normAnswer = String(item.answer || "A").trim().toUpperCase();
      if (normAnswer === "0") normAnswer = "A";
      if (normAnswer === "1") normAnswer = "B";
      if (normAnswer === "2") normAnswer = "C";
      if (normAnswer === "3") normAnswer = "D";
      if (!['A', 'B', 'C', 'D'].includes(normAnswer)) {
        normAnswer = "A";
      }

      records.push({
        id: `q_rec_${Date.now()}_${r}`,
        question: (item.question || "").trim(),
        option_a: (item.option_a || "").trim(),
        option_b: (item.option_b || "").trim(),
        option_c: (item.option_c || "").trim(),
        option_d: (item.option_d || "").trim(),
        answer: normAnswer,
        explanation: (item.explanation || "").trim(),
        isNew: false
      });
    }

    return records;
  },

  serialize(records) {
    const headers = SCHEMA.expectedHeaders;
    const escapeCell = (val) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [headers.join(',')];
    records.forEach(rec => {
      const line = [
        escapeCell(rec.question),
        escapeCell(rec.option_a),
        escapeCell(rec.option_b),
        escapeCell(rec.option_c),
        escapeCell(rec.option_d),
        escapeCell(rec.answer),
        escapeCell(rec.explanation)
      ];
      lines.push(line.join(','));
    });

    return lines.join('\n');
  }
};

/**
 * =========================================================================
 * SESSION STORAGE / LOCAL STORAGE DRAFT ADAPTER
 * =========================================================================
 */
const SessionStore = {
  load() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.draftCache);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    } catch (e) {
      return null;
    }
  },

  save(items) {
    if (!APP_CONFIG.features.enableAutoSave) return;
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.draftCache, JSON.stringify(items));
    } catch (e) {}
  },

  clear() {
    try {
      localStorage.removeItem(APP_CONFIG.endpoints.storageKeys.draftCache);
    } catch (e) {}
  }
};

/**
 * =========================================================================
 * TACTILE SENSORY HAPTIC SIMULATOR
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
    } catch (e) {}
  }
}

/**
 * =========================================================================
 * MASTER CONTROLLER APPLICATION
 * =========================================================================
 */
class EditorialCsvApp {
  constructor() {
    this.questions = [];
    this.editingId = null;
    this.currentView = "startView";
    this.previewMode = "friendly";

    this.cacheDom();
    this.bindEvents();
    this.initApp();
  }

  cacheDom() {
    this.dom = {
      // Header controls
      btnUniversalBack: document.getElementById("btnUniversalBack"),
      backNavLabel: document.getElementById("backNavLabel"),
      pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
      pageTitleSlot: document.getElementById("pageTitleSlot"),
      pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
      saveDraftIndicator: document.getElementById("saveDraftIndicator"),
      draftStatusText: document.getElementById("draftStatusText"),

      // Views
      startView: document.getElementById("startView"),
      builderView: document.getElementById("builderView"),
      managerView: document.getElementById("managerView"),
      previewView: document.getElementById("previewView"),

      // Navigation Dock
      bottomDockNavItems: document.getElementById("bottomDockNavItems"),
      tabBuilderNavLabel: document.getElementById("tabBuilderNavLabel"),
      dockCountBadge: document.getElementById("dockCountBadge"),

      // Start view triggers
      csvFileInputAppend: document.getElementById("csvFileInputAppend"),
      csvFileInputEdit: document.getElementById("csvFileInputEdit"),
      csvFileInputEmpty: document.getElementById("csvFileInputEmpty"),
      btnCreateNew: document.getElementById("btnCreateNew"),
      btnLoadSampleData: document.getElementById("btnLoadSampleData"),
      resumeDraftBanner: document.getElementById("resumeDraftBanner"),
      resumeDraftDetails: document.getElementById("resumeDraftDetails"),
      btnResumeDraft: document.getElementById("btnResumeDraft"),
      btnDiscardDraft: document.getElementById("btnDiscardDraft"),

      // Question Form Elements
      editorModeTag: document.getElementById("editorModeTag"),
      editorHeading: document.getElementById("editorHeading"),
      roundBadgeText: document.getElementById("roundBadgeText"),
      questionForm: document.getElementById("questionForm"),
      inputQuestion: document.getElementById("inputQuestion"),
      inputOptionA: document.getElementById("inputOptionA"),
      inputOptionB: document.getElementById("inputOptionB"),
      inputOptionC: document.getElementById("inputOptionC"),
      inputOptionD: document.getElementById("inputOptionD"),
      inputAnswerLetter: document.getElementById("inputAnswerLetter"),
      inputExplanation: document.getElementById("inputExplanation"),
      feedbackQuestion: document.getElementById("feedbackQuestion"),
      feedbackOptions: document.getElementById("feedbackOptions"),
      feedbackExplanation: document.getElementById("feedbackExplanation"),
      btnSaveQuestion: document.getElementById("btnSaveQuestion"),
      btnSaveText: document.getElementById("btnSaveText"),
      btnSaveAndNew: document.getElementById("btnSaveAndNew"),
      btnCancelEdit: document.getElementById("btnCancelEdit"),
      btnClearForm: document.getElementById("btnClearForm"),

      // In-Game Mirror Simulation
      simCounterTag: document.getElementById("simCounterTag"),
      simQuestionText: document.getElementById("simQuestionText"),
      simOptionsList: document.getElementById("simOptionsList"),
      simExplanationText: document.getElementById("simExplanationText"),

      // Catalog Elements
      catalogQuestionsTotal: document.getElementById("catalogQuestionsTotal"),
      catalogRoundsTotal: document.getElementById("catalogRoundsTotal"),
      roundBalanceNotice: document.getElementById("roundBalanceNotice"),
      roundBalanceNoticeText: document.getElementById("roundBalanceNoticeText"),
      catalogSearchInput: document.getElementById("catalogSearchInput"),
      btnNewQuestionFromCatalog: document.getElementById("btnNewQuestionFromCatalog"),
      btnClearAllQuestions: document.getElementById("btnClearAllQuestions"),
      catalogItemsContainer: document.getElementById("catalogItemsContainer"),
      catalogEmptyState: document.getElementById("catalogEmptyState"),
      btnEmptyCreate: document.getElementById("btnEmptyCreate"),

      // Preview & Export Elements
      btnViewFriendly: document.getElementById("btnViewFriendly"),
      btnViewTechnical: document.getElementById("btnViewTechnical"),
      validationAuditBanner: document.getElementById("validationAuditBanner"),
      auditIcon: document.getElementById("auditIcon"),
      auditTitle: document.getElementById("auditTitle"),
      auditSubtitle: document.getElementById("auditSubtitle"),
      auditIssueList: document.getElementById("auditIssueList"),
      exportFilenameInput: document.getElementById("exportFilenameInput"),
      btnDownloadFullCsv: document.getElementById("btnDownloadFullCsv"),
      btnDownloadNewOnly: document.getElementById("btnDownloadNewOnly"),
      btnDownloadTemplate: document.getElementById("btnDownloadTemplate"),
      btnCopyCsvClipboard: document.getElementById("btnCopyCsvClipboard"),
      btnExportFullCount: document.getElementById("btnExportFullCount"),
      btnExportNewCount: document.getElementById("btnExportNewCount"),
      friendlyPreviewSection: document.getElementById("friendlyPreviewSection"),
      friendlyTableBody: document.getElementById("friendlyTableBody"),
      technicalPreviewSection: document.getElementById("technicalPreviewSection"),
      rawCsvCode: document.getElementById("rawCsvCode"),

      // Modal Elements
      confirmModalBackdrop: document.getElementById("confirmModalBackdrop"),
      confirmDialogTitle: document.getElementById("confirmDialogTitle"),
      confirmDialogMessage: document.getElementById("confirmDialogMessage"),
      btnConfirmCancel: document.getElementById("btnConfirmCancel"),
      btnConfirmProceed: document.getElementById("btnConfirmProceed"),

      // Toast Feedback
      toastMessage: document.getElementById("toastMessage")
    };
  }

  bindEvents() {
    // Universal Back Navigation (Part 5.1 Architecture)
    this.dom.btnUniversalBack.addEventListener("click", () => {
      triggerHapticPulse();
      if (this.currentView === "builderView" && this.editingId) {
        this.editingId = null;
        this.resetForm();
        this.switchView("managerView");
      } else {
        this.switchView(APP_CONFIG.navigation.defaultFallbackRoute);
      }
    });

    // Bottom Navigation Bar items
    this.dom.bottomDockNavItems.addEventListener("click", (e) => {
      const tabBtn = e.target.closest(".nav-tab-item");
      if (!tabBtn) return;
      triggerHapticPulse();
      const targetView = tabBtn.getAttribute("data-target-view");
      if (targetView) {
        this.switchView(targetView);
      }
    });

    // Start Screen Actions
    this.dom.btnCreateNew.addEventListener("click", () => {
      triggerHapticPulse();
      this.questions = [];
      this.editingId = null;
      this.resetForm();
      this.switchView("builderView");
      this.showToast("Initiated fresh challenge workspace.");
    });

    this.dom.btnLoadSampleData.addEventListener("click", () => {
      triggerHapticPulse();
      this.questions = JSON.parse(JSON.stringify(CANONICAL_STARTER_DATA));
      this.editingId = null;
      this.persistDraft();
      this.switchView("managerView");
      this.showToast("Loaded 5 canonical challenge questions.");
    });

    const fileReaderHandler = (file, appendMode) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const records = CsvEngine.parse(e.target.result);
          if (appendMode && this.questions.length > 0) {
            records.forEach(r => r.isNew = true);
            this.questions = this.questions.concat(records);
            this.showToast(`Appended ${records.length} records.`);
          } else {
            this.questions = records;
            this.showToast(`Imported ${records.length} questions.`);
          }
          this.persistDraft();
          this.switchView("managerView");
        } catch (err) {
          this.showToast(`Import Error: ${err.message}`);
        }
      };
      reader.readAsText(file);
    };

    this.dom.csvFileInputAppend.addEventListener("change", (e) => {
      fileReaderHandler(e.target.files[0], true);
      e.target.value = "";
    });

    this.dom.csvFileInputEdit.addEventListener("change", (e) => {
      fileReaderHandler(e.target.files[0], false);
      e.target.value = "";
    });

    this.dom.csvFileInputEmpty.addEventListener("change", (e) => {
      fileReaderHandler(e.target.files[0], false);
      e.target.value = "";
    });

    // Draft Resumption & Clear
    this.dom.btnResumeDraft.addEventListener("click", () => {
      triggerHapticPulse();
      const draft = SessionStore.load();
      if (draft) {
        this.questions = draft;
        this.switchView("managerView");
        this.showToast("Workspace draft restored.");
      }
    });

    this.dom.btnDiscardDraft.addEventListener("click", () => {
      triggerHapticPulse();
      this.confirmDialog(
        "Discard Saved Workspace Draft?",
        "This will permanently erase all unexported records stored in this browser session.",
        () => {
          SessionStore.clear();
          this.dom.resumeDraftBanner.classList.add("hidden");
          this.showToast("Draft successfully cleared.");
        }
      );
    });

    // Quick Templates
    document.querySelectorAll(".template-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        triggerHapticPulse();
        const type = chip.getAttribute("data-template");
        if (TEMPLATES[type]) {
          this.applyTemplate(TEMPLATES[type]);
        }
      });
    });

    // Correct Key Selector Radio Emblems
    document.querySelectorAll(".btn-key-select").forEach(btn => {
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        const letter = btn.getAttribute("data-letter");
        this.setAnswerLetter(letter);
      });
    });

    // Live In-Game Mirror Mirroring & Realtime Validation
    const liveFields = [
      this.dom.inputQuestion,
      this.dom.inputOptionA,
      this.dom.inputOptionB,
      this.dom.inputOptionC,
      this.dom.inputOptionD,
      this.dom.inputExplanation
    ];

    liveFields.forEach(field => {
      field.addEventListener("input", () => {
        this.updateSimulationMirror();
        this.validateRealtime();
      });
    });

    // Form Submissions
    this.dom.questionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      triggerHapticPulse();
      this.handleFormCommit(false);
    });

    this.dom.btnSaveAndNew.addEventListener("click", () => {
      triggerHapticPulse();
      this.handleFormCommit(true);
    });

    this.dom.btnCancelEdit.addEventListener("click", () => {
      triggerHapticPulse();
      this.editingId = null;
      this.resetForm();
      this.switchView("managerView");
    });

    this.dom.btnClearForm.addEventListener("click", () => {
      triggerHapticPulse();
      this.resetForm();
      this.showToast("Form fields reset.");
    });

    // Catalog Search & Clear
    this.dom.catalogSearchInput.addEventListener("input", () => {
      this.renderCatalogList();
    });

    this.dom.btnNewQuestionFromCatalog.addEventListener("click", () => {
      triggerHapticPulse();
      this.editingId = null;
      this.resetForm();
      this.switchView("builderView");
    });

    this.dom.btnEmptyCreate.addEventListener("click", () => {
      triggerHapticPulse();
      this.editingId = null;
      this.resetForm();
      this.switchView("builderView");
    });

    this.dom.btnClearAllQuestions.addEventListener("click", () => {
      if (this.questions.length === 0) return;
      triggerHapticPulse();
      this.confirmDialog(
        "Clear All Workspace Questions?",
        "This action will permanently delete all records currently loaded into the workspace.",
        () => {
          this.questions = [];
          this.editingId = null;
          this.persistDraft();
          this.renderCatalogList();
          this.updateMetrics();
          this.showToast(APP_CONFIG.content.notifications.clearSuccess);
        }
      );
    });

    // Validation & Export Mode Switchers
    this.dom.btnViewFriendly.addEventListener("click", () => {
      triggerHapticPulse();
      this.previewMode = "friendly";
      this.dom.btnViewFriendly.classList.add("active");
      this.dom.btnViewTechnical.classList.remove("active");
      this.dom.friendlyPreviewSection.classList.remove("hidden");
      this.dom.technicalPreviewSection.classList.add("hidden");
    });

    this.dom.btnViewTechnical.addEventListener("click", () => {
      triggerHapticPulse();
      this.previewMode = "technical";
      this.dom.btnViewTechnical.classList.add("active");
      this.dom.btnViewFriendly.classList.remove("active");
      this.dom.friendlyPreviewSection.classList.add("hidden");
      this.dom.technicalPreviewSection.classList.remove("hidden");
      this.renderTechnicalPreview();
    });

    // Export Actions
    this.dom.btnDownloadFullCsv.addEventListener("click", () => {
      triggerHapticPulse();
      this.downloadCsv(this.questions);
    });

    this.dom.btnDownloadNewOnly.addEventListener("click", () => {
      triggerHapticPulse();
      const newItems = this.questions.filter(q => q.isNew);
      if (newItems.length === 0) {
        this.showToast("No newly added questions found.");
        return;
      }
      this.downloadCsv(newItems, "puzzles_new_additions.csv");
    });

    this.dom.btnDownloadTemplate.addEventListener("click", () => {
      triggerHapticPulse();
      this.downloadCsv([], "puzzles_canonical_template.csv");
    });

    this.dom.btnCopyCsvClipboard.addEventListener("click", () => {
      triggerHapticPulse();
      this.copyToClipboard();
    });
  }

  initApp() {
    // Dynamic Meta Synchronizer
    document.title = `${APP_CONFIG.identity.appName} — Production Edition`;
    
    // Check saved draft
    const draft = SessionStore.load();
    if (draft && draft.length > 0) {
      this.dom.resumeDraftDetails.textContent = `You have ${draft.length} questions saved in this browser from a previous editing session.`;
      this.dom.resumeDraftBanner.classList.remove("hidden");
    }

    this.switchView("startView");
    this.updateMetrics();
  }

  // =========================================================================
  // VIEW ROUTING & HEADER HYDRATION
  // =========================================================================
  switchView(viewName) {
    this.currentView = viewName;
    const views = ["startView", "builderView", "managerView", "previewView"];
    views.forEach(v => {
      if (this.dom[v]) this.dom[v].classList.add("hidden");
    });

    if (this.dom[viewName]) {
      this.dom[viewName].classList.remove("hidden");
    }

    // Hydrate Header Strings from APP_CONFIG
    const headerCopy = APP_CONFIG.content.headers[viewName] || APP_CONFIG.content.headers.startView;
    this.dom.pageEyebrowSlot.textContent = headerCopy.eyebrow;
    this.dom.pageTitleSlot.textContent = headerCopy.title;
    this.dom.pageSubtitleSlot.textContent = headerCopy.subtitle;

    // Back Button Contextual Visage
    if (viewName === "startView") {
      this.dom.btnUniversalBack.classList.add("hidden");
    } else {
      this.dom.btnUniversalBack.classList.remove("hidden");
      this.dom.backNavLabel.textContent = viewName === "builderView" && this.editingId ? "Cancel" : "Menu";
    }

    // Update Bottom Dock Tab Highlights
    document.querySelectorAll(".nav-tab-item").forEach(tab => {
      const target = tab.getAttribute("data-target-view");
      tab.classList.toggle("nav-tab-item--active", target === viewName);
    });

    this.dom.tabBuilderNavLabel.textContent = this.editingId ? "Edit Q" : "Architect";

    // View-specific initialization
    if (viewName === "builderView") {
      this.updateRoundIndicator();
      this.updateSimulationMirror();
    } else if (viewName === "managerView") {
      this.renderCatalogList();
    } else if (viewName === "previewView") {
      this.renderAuditReport();
    }

    this.updateMetrics();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateMetrics() {
    const count = this.questions.length;
    this.dom.dockCountBadge.textContent = count;
    this.dom.catalogQuestionsTotal.textContent = `${count} Question${count === 1 ? '' : 's'}`;

    const completeRounds = Math.floor(count / SCHEMA.questionsPerRound);
    const remainder = count % SCHEMA.questionsPerRound;
    this.dom.catalogRoundsTotal.textContent = `${completeRounds} Round${completeRounds === 1 ? '' : 's'}`;

    if (count === 0) {
      this.dom.roundBalanceNotice.className = "round-balance-banner";
      this.dom.roundBalanceNoticeText.textContent = "Daily Quiz serves 5 questions per day. Start by drafting your first question.";
    } else if (remainder === 0) {
      this.dom.roundBalanceNotice.className = "round-balance-banner";
      this.dom.roundBalanceNoticeText.textContent = `Balanced Calibration: Your dataset contains exactly ${completeRounds} complete 5-question Daily Quiz challenge${completeRounds === 1 ? '' : 's'}.`;
    } else {
      const needed = SCHEMA.questionsPerRound - remainder;
      this.dom.roundBalanceNotice.className = "round-balance-banner warning";
      this.dom.roundBalanceNoticeText.textContent = `Round Incomplete: Workspace contains ${remainder} extra question${remainder === 1 ? '' : 's'}. Add ${needed} more to complete Round #${completeRounds + 1}.`;
    }

    this.dom.btnExportFullCount.textContent = count;
    const newCount = this.questions.filter(q => q.isNew).length;
    this.dom.btnExportNewCount.textContent = newCount;
  }

  persistDraft() {
    SessionStore.save(this.questions);
    this.dom.saveDraftIndicator.classList.remove("unsaved");
    this.dom.draftStatusText.textContent = "Saved";
  }

  // =========================================================================
  // QUESTION FORM & LIVE SIMULATION
  // =========================================================================
  updateRoundIndicator() {
    const total = this.questions.length;
    if (this.editingId) {
      const idx = this.questions.findIndex(q => q.id === this.editingId);
      const roundNum = Math.floor(idx / SCHEMA.questionsPerRound) + 1;
      const qInRound = (idx % SCHEMA.questionsPerRound) + 1;
      this.dom.editorModeTag.textContent = `Editing Record #${idx + 1}`;
      this.dom.editorHeading.textContent = `Edit Question #${idx + 1}`;
      this.dom.roundBadgeText.textContent = `Challenge #${roundNum} • Q${qInRound} of 5`;
      this.dom.btnCancelEdit.classList.remove("hidden");
      this.dom.btnSaveText.textContent = "Commit Edits";
    } else {
      const nextIdx = total;
      const roundNum = Math.floor(nextIdx / SCHEMA.questionsPerRound) + 1;
      const qInRound = (nextIdx % SCHEMA.questionsPerRound) + 1;
      this.dom.editorModeTag.textContent = "New Challenge Entry";
      this.dom.editorHeading.textContent = "Question Architect";
      this.dom.roundBadgeText.textContent = `Target: Challenge #${roundNum} • Q${qInRound} of 5`;
      this.dom.btnCancelEdit.classList.add("hidden");
      this.dom.btnSaveText.textContent = "Commit Question";
    }
  }

  applyTemplate(tpl) {
    this.dom.inputQuestion.value = tpl.question;
    this.dom.inputOptionA.value = tpl.option_a;
    this.dom.inputOptionB.value = tpl.option_b;
    this.dom.inputOptionC.value = tpl.option_c;
    this.dom.inputOptionD.value = tpl.option_d;
    this.dom.inputExplanation.value = tpl.explanation;
    this.setAnswerLetter(tpl.answer);
    this.updateSimulationMirror();
    this.validateRealtime();
    this.showToast("Blueprint values populated.");
  }

  setAnswerLetter(letter) {
    this.dom.inputAnswerLetter.value = letter;
    document.querySelectorAll(".btn-key-select").forEach(b => {
      const isSelected = b.getAttribute("data-letter") === letter;
      b.classList.toggle("selected", isSelected);
    });
    this.updateSimulationMirror();
  }

  updateSimulationMirror() {
    const q = this.dom.inputQuestion.value.trim();
    const a = this.dom.inputOptionA.value.trim() || "Option A";
    const b = this.dom.inputOptionB.value.trim() || "Option B";
    const c = this.dom.inputOptionC.value.trim() || "Option C";
    const d = this.dom.inputOptionD.value.trim() || "Option D";
    const letter = this.dom.inputAnswerLetter.value || "A";
    const exp = this.dom.inputExplanation.value.trim() || "Verified reference answer.";

    this.dom.simQuestionText.textContent = q || "Your question prompt will preview here...";
    this.dom.simExplanationText.textContent = exp;

    const items = [
      { key: "A", val: a },
      { key: "B", val: b },
      { key: "C", val: c },
      { key: "D", val: d }
    ];

    this.dom.simOptionsList.innerHTML = "";
    items.forEach(item => {
      const isCorrect = (item.key === letter);
      const row = document.createElement("div");
      row.className = `sim-choice-card ${isCorrect ? 'is-correct-key' : ''}`;
      row.innerHTML = `
        <span class="sim-choice-key">${item.key}</span>
        <span class="sim-choice-text">${escapeHtml(item.val)}</span>
      `;
      this.dom.simOptionsList.appendChild(row);
    });
  }

  validateRealtime() {
    let isValid = true;
    const qVal = this.dom.inputQuestion.value.trim();
    if (!qVal) {
      this.dom.feedbackQuestion.textContent = "Question prompt is required.";
      isValid = false;
    } else {
      this.dom.feedbackQuestion.textContent = "";
    }

    const a = this.dom.inputOptionA.value.trim();
    const b = this.dom.inputOptionB.value.trim();
    const c = this.dom.inputOptionC.value.trim();
    const d = this.dom.inputOptionD.value.trim();

    const options = [a, b, c, d];
    if (options.some(opt => !opt)) {
      this.dom.feedbackOptions.textContent = "All 4 answer options (A, B, C, D) are mandatory.";
      isValid = false;
    } else {
      const unique = new Set(options.map(opt => opt.toLowerCase()));
      if (unique.size < 4) {
        this.dom.feedbackOptions.textContent = "Options must have distinct values without duplicates.";
        isValid = false;
      } else {
        this.dom.feedbackOptions.textContent = "";
      }
    }

    return isValid;
  }

  handleFormCommit(continueAdding) {
    if (!this.validateRealtime()) {
      this.showToast("Please complete highlighted mandatory fields.");
      return;
    }

    const payload = {
      question: this.dom.inputQuestion.value.trim(),
      option_a: this.dom.inputOptionA.value.trim(),
      option_b: this.dom.inputOptionB.value.trim(),
      option_c: this.dom.inputOptionC.value.trim(),
      option_d: this.dom.inputOptionD.value.trim(),
      answer: this.dom.inputAnswerLetter.value || "A",
      explanation: this.dom.inputExplanation.value.trim()
    };

    if (this.editingId) {
      const idx = this.questions.findIndex(q => q.id === this.editingId);
      if (idx !== -1) {
        this.questions[idx] = { ...this.questions[idx], ...payload };
        this.showToast(`Updated Question #${idx + 1}.`);
      }
      this.editingId = null;
    } else {
      const newRecord = {
        id: `q_rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ...payload,
        isNew: true
      };
      this.questions.push(newRecord);
      this.showToast(`Saved Question #${this.questions.length}.`);
    }

    this.persistDraft();
    this.updateMetrics();

    if (continueAdding) {
      this.resetForm();
      this.updateRoundIndicator();
      this.dom.inputQuestion.focus();
    } else {
      this.switchView("managerView");
    }
  }

  resetForm() {
    this.dom.questionForm.reset();
    this.dom.inputAnswerLetter.value = "A";
    this.setAnswerLetter("A");
    this.dom.feedbackQuestion.textContent = "";
    this.dom.feedbackOptions.textContent = "";
    this.dom.feedbackExplanation.textContent = "";
    this.updateSimulationMirror();
    this.updateRoundIndicator();
  }

  loadForEdit(id) {
    const q = this.questions.find(item => item.id === id);
    if (!q) return;

    this.editingId = id;
    this.dom.inputQuestion.value = q.question;
    this.dom.inputOptionA.value = q.option_a;
    this.dom.inputOptionB.value = q.option_b;
    this.dom.inputOptionC.value = q.option_c;
    this.dom.inputOptionD.value = q.option_d;
    this.dom.inputExplanation.value = q.explanation || "";
    this.setAnswerLetter(q.answer || "A");

    this.switchView("builderView");
    this.updateRoundIndicator();
    this.updateSimulationMirror();
  }

  duplicateItem(id) {
    const q = this.questions.find(item => item.id === id);
    if (!q) return;

    const dup = {
      ...q,
      id: `q_rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      question: `${q.question} (Duplicate)`,
      isNew: true
    };

    const originalIdx = this.questions.findIndex(item => item.id === id);
    this.questions.splice(originalIdx + 1, 0, dup);
    this.persistDraft();
    this.renderCatalogList();
    this.updateMetrics();
    this.showToast("Record duplicated.");
  }

  deleteItem(id) {
    const idx = this.questions.findIndex(item => item.id === id);
    if (idx === -1) return;

    this.confirmDialog(
      "Delete Challenge Record?",
      `Are you sure you want to permanently delete Question #${idx + 1}?`,
      () => {
        this.questions.splice(idx, 1);
        if (this.editingId === id) {
          this.editingId = null;
          this.resetForm();
        }
        this.persistDraft();
        this.renderCatalogList();
        this.updateMetrics();
        this.showToast(APP_CONFIG.content.notifications.deleteSuccess);
      }
    );
  }

  moveItem(id, direction) {
    const idx = this.questions.findIndex(q => q.id === id);
    if (idx === -1) return;
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.questions.length) return;

    const temp = this.questions[idx];
    this.questions[idx] = this.questions[targetIdx];
    this.questions[targetIdx] = temp;

    this.persistDraft();
    this.renderCatalogList();
    this.showToast(`Shifted record to position #${targetIdx + 1}.`);
  }

  // =========================================================================
  // CATALOG RECORD RENDERING
  // =========================================================================
  renderCatalogList() {
    const query = (this.dom.catalogSearchInput.value || "").trim().toLowerCase();
    this.dom.catalogItemsContainer.innerHTML = "";

    if (this.questions.length === 0) {
      this.dom.catalogEmptyState.classList.remove("hidden");
      return;
    }
    this.dom.catalogEmptyState.classList.add("hidden");

    const filtered = this.questions.map((q, idx) => ({ q, idx })).filter(({ q }) => {
      if (!query) return true;
      const corpus = [q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.explanation].join(" ").toLowerCase();
      return corpus.includes(query);
    });

    if (filtered.length === 0) {
      const noMatch = document.createElement("div");
      noMatch.className = "paper-card empty-catalog-card";
      noMatch.innerHTML = `
        <h3 class="paper-card__title">No Matching Records Found</h3>
        <p class="empty-catalog-description">No trivia questions matched the search phrase "${escapeHtml(query)}".</p>
      `;
      this.dom.catalogItemsContainer.appendChild(noMatch);
      return;
    }

    filtered.forEach(({ q, idx }) => {
      const roundNum = Math.floor(idx / SCHEMA.questionsPerRound) + 1;
      const qInRound = (idx % SCHEMA.questionsPerRound) + 1;
      const isRoundStart = (qInRound === 1);

      const card = document.createElement("article");
      card.className = "catalog-question-card";

      const opts = [
        { key: "A", text: q.option_a, isCorrect: q.answer === "A" },
        { key: "B", text: q.option_b, isCorrect: q.answer === "B" },
        { key: "C", text: q.option_c, isCorrect: q.answer === "C" },
        { key: "D", text: q.option_d, isCorrect: q.answer === "D" }
      ];

      card.innerHTML = `
        <div class="catalog-card-header">
          <div class="catalog-round-meta">
            <span class="paper-card__status-indicator ${isRoundStart ? 'paper-card__status-indicator--sage' : 'paper-card__status-indicator--ochre'}">
              Round #${roundNum}
            </span>
            <span class="catalog-q-num">#${idx + 1} (Q${qInRound}/5)</span>
            ${q.isNew ? '<span class="paper-card__status-indicator paper-card__status-indicator--terracotta">New</span>' : ''}
          </div>
          <div class="catalog-card-actions">
            <button type="button" class="interactive-tactile btn-move-up" title="Move Up" ${idx === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="interactive-tactile btn-move-down" title="Move Down" ${idx === this.questions.length - 1 ? 'disabled' : ''}>▼</button>
            <button type="button" class="interactive-tactile btn-edit">Edit</button>
            <button type="button" class="interactive-tactile btn-dup" title="Duplicate">Copy</button>
            <button type="button" class="interactive-tactile btn-del" title="Delete">✕</button>
          </div>
        </div>

        <h3 class="catalog-q-text">${escapeHtml(q.question)}</h3>

        <div class="catalog-options-chips">
          ${opts.map(o => `
            <div class="catalog-option-chip ${o.isCorrect ? 'is-correct' : ''}">
              <strong>${o.key}:</strong> ${escapeHtml(o.text)}
              ${o.isCorrect ? ' ✓' : ''}
            </div>
          `).join('')}
        </div>

        ${q.explanation ? `
          <p class="catalog-explanation-preview">
            <strong>Factoid:</strong> ${escapeHtml(q.explanation)}
          </p>
        ` : ''}
      `;

      card.querySelector(".btn-edit").addEventListener("click", () => {
        triggerHapticPulse();
        this.loadForEdit(q.id);
      });

      card.querySelector(".btn-dup").addEventListener("click", () => {
        triggerHapticPulse();
        this.duplicateItem(q.id);
      });

      card.querySelector(".btn-del").addEventListener("click", () => {
        triggerHapticPulse();
        this.deleteItem(q.id);
      });

      const upBtn = card.querySelector(".btn-move-up");
      if (upBtn) upBtn.addEventListener("click", () => {
        triggerHapticPulse();
        this.moveItem(q.id, -1);
      });

      const downBtn = card.querySelector(".btn-move-down");
      if (downBtn) downBtn.addEventListener("click", () => {
        triggerHapticPulse();
        this.moveItem(q.id, 1);
      });

      this.dom.catalogItemsContainer.appendChild(card);
    });
  }

  // =========================================================================
  // QUALITY AUDIT & PREVIEW RENDERER
  // =========================================================================
  runQualityAudit() {
    const issues = [];
    if (this.questions.length === 0) {
      issues.push("Dataset contains 0 records. Draft questions before downloading.");
    }

    this.questions.forEach((q, idx) => {
      const num = idx + 1;
      if (!q.question || !q.question.trim()) {
        issues.push(`Record #${num} has an empty question prompt.`);
      }
      if (!q.option_a || !q.option_b || !q.option_c || !q.option_d) {
        issues.push(`Record #${num} is missing one or more of its 4 answer choices.`);
      }
      if (!['A', 'B', 'C', 'D'].includes(q.answer)) {
        issues.push(`Record #${num} has an invalid answer key "${q.answer}". Must be A, B, C, or D.`);
      }
    });

    const remainder = this.questions.length % SCHEMA.questionsPerRound;
    if (remainder !== 0) {
      const needed = SCHEMA.questionsPerRound - remainder;
      issues.push(`Round Calibration Disparity: Workspace contains ${remainder} leftover question${remainder === 1 ? '' : 's'}. Daily Quiz demands increments of 5 questions per day. Add ${needed} question${needed === 1 ? '' : 's'} to form a complete challenge round.`);
    }

    return issues;
  }

  renderAuditReport() {
    const issues = this.runQualityAudit();
    const hasWarnings = issues.length > 0;

    if (hasWarnings) {
      this.dom.validationAuditBanner.className = "audit-status-card has-errors";
      this.dom.auditIcon.textContent = "!";
      this.dom.auditTitle.textContent = `${issues.length} Schema Warning${issues.length === 1 ? '' : 's'} Identified`;
      this.dom.auditSubtitle.textContent = "Review and address items before production deployment:";
      this.dom.auditIssueList.innerHTML = issues.map(err => `<div class="audit-issue-row">• ${escapeHtml(err)}</div>`).join("");
      this.dom.auditIssueList.classList.remove("hidden");
    } else {
      this.dom.validationAuditBanner.className = "audit-status-card";
      this.dom.auditIcon.textContent = "✓";
      this.dom.auditTitle.textContent = "Production Calibration Verified";
      this.dom.auditSubtitle.textContent = `All ${this.questions.length} questions form ${this.questions.length / SCHEMA.questionsPerRound} complete, compliant 5-question rounds.`;
      this.dom.auditIssueList.classList.add("hidden");
    }

    this.renderFriendlyTable();
    if (this.previewMode === "technical") {
      this.renderTechnicalPreview();
    }
  }

  renderFriendlyTable() {
    this.dom.friendlyTableBody.innerHTML = "";
    if (this.questions.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="8" style="text-align:center; padding: 24px; color: var(--color-text-muted);">No records currently documented in dataset.</td>`;
      this.dom.friendlyTableBody.appendChild(row);
      return;
    }

    this.questions.forEach((q, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-family: var(--font-mono); font-weight:700;">#${idx + 1}</td>
        <td><strong>${escapeHtml(q.question)}</strong></td>
        <td>${escapeHtml(q.option_a)}</td>
        <td>${escapeHtml(q.option_b)}</td>
        <td>${escapeHtml(q.option_c)}</td>
        <td>${escapeHtml(q.option_d)}</td>
        <td class="table-key-cell">${q.answer}</td>
        <td>${escapeHtml(q.explanation || '—')}</td>
      `;
      this.dom.friendlyTableBody.appendChild(tr);
    });
  }

  renderTechnicalPreview() {
    this.dom.rawCsvCode.textContent = CsvEngine.serialize(this.questions);
  }

  // =========================================================================
  // EXPORT & CLIPBOARD PIPELINE
  // =========================================================================
  downloadCsv(dataset, customFilename) {
    if (dataset.length === 0 && !customFilename?.includes("template")) {
      this.showToast("No records available to export.");
      return;
    }

    let filename = customFilename || this.dom.exportFilenameInput.value.trim() || APP_CONFIG.endpoints.exportDefaultName;
    if (!filename.toLowerCase().endsWith(".csv")) {
      filename += ".csv";
    }

    const csvContent = CsvEngine.serialize(dataset);
    // Prepend UTF-8 Byte Order Mark for universal Excel & Sheet compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);

    this.showToast(`${APP_CONFIG.content.notifications.exportSuccess} (${filename})`);
  }

  copyToClipboard() {
    const csvContent = CsvEngine.serialize(this.questions);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(csvContent)
        .then(() => this.showToast(APP_CONFIG.content.notifications.clipboardSuccess))
        .catch(() => this.showToast("Clipboard access denied."));
    } else {
      this.showToast("Clipboard API unavailable.");
    }
  }

  // =========================================================================
  // MODAL CONFIRMATION & TOAST UTILITIES
  // =========================================================================
  confirmDialog(title, message, onProceed) {
    this.dom.confirmDialogTitle.textContent = title;
    this.dom.confirmDialogMessage.textContent = message;
    this.dom.confirmModalBackdrop.classList.remove("hidden");

    const close = () => {
      this.dom.confirmModalBackdrop.classList.add("hidden");
      this.dom.btnConfirmProceed.removeEventListener("click", proceedHandler);
      this.dom.btnConfirmCancel.removeEventListener("click", cancelHandler);
    };

    const proceedHandler = () => {
      triggerHapticPulse();
      close();
      if (typeof onProceed === "function") onProceed();
    };

    const cancelHandler = () => {
      triggerHapticPulse();
      close();
    };

    this.dom.btnConfirmProceed.addEventListener("click", proceedHandler);
    this.dom.btnConfirmCancel.addEventListener("click", cancelHandler);
  }

  showToast(msg) {
    this.dom.toastMessage.textContent = msg;
    this.dom.toastMessage.classList.add("visible");
    setTimeout(() => {
      this.dom.toastMessage.classList.remove("visible");
    }, 2400);
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Bootstrap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new EditorialCsvApp());
} else {
  new EditorialCsvApp();
}