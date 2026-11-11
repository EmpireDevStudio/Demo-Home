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
    appId: "sequence-spec-studio-ledger",
    appName: "Spec Studio",
    appTagline: "Cocktail Sequence Architecture & Curation Ledger",
    version: "3.2.0",
    environment: "production",
    canonicalUrl: "https://specstudio.sequencecocktails.com",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-seal.svg",
    logoAlt: "Spec Studio Archival Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#A25750",      // Terracotta
    accentSecondary: "#526F56",  // Sage
    accentHighlight: "#7B641F",  // Ochre
    fontFamilyBase: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilySerif: "Newsreader, Charter, Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "start",
    items: [
      { id: "start", label: "Launchpad", icon: "icon-home", route: "#start", enabled: true, showInBottomBar: true },
      { id: "ledger", label: "Ledger", icon: "icon-ledger", route: "#ledger", enabled: true, showInBottomBar: true },
      { id: "editor", label: "Author", icon: "icon-author", route: "#editor", enabled: true, showInBottomBar: true },
      { id: "export", label: "Export", icon: "icon-export", route: "#export", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      start: {
        eyebrow: "SEQUENCE ARCHITECTURE",
        title: "Curation & Authoring Console",
        subtitle: "Design verified 5-step canonical cocktail sequences without syntax corruption.",
      },
      ledger: {
        eyebrow: "ARCHIVAL VAULT",
        title: "Cocktail Specifications Ledger",
        subtitle: "Active repository of game puzzle specifications, decoys, and difficulty curves.",
      },
      editor: {
        eyebrow: "SPECIFICATION AUTHORING",
        title: "Cocktail Sequence Wizard",
        subtitle: "Assemble authentic formulas, clue hints, and distractor tokens step-by-step.",
      },
      export: {
        eyebrow: "DATA DISTRIBUTION",
        title: "Production CSV Generator",
        subtitle: "Serialize records into RFC 4180-compliant files for immediate puzzle engine ingestion.",
      },
    },
    emptyStates: {
      noDataHeading: "No Specifications Currently Documented",
      noDataDescription: "This operational ledger is clear. Create a new entry or load classic presets to initiate records.",
      noSearchResultsHeading: "No Matching Records Discovered",
      noSearchResultsDescription: "Review your search keywords or title query and attempt searching again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Specification",
      delete: "Remove Permanently",
      retry: "Retry Operation",
      back: "Return",
    },
    notifications: {
      saveSuccess: "Specification committed to active ledger.",
      saveError: "Unable to commit record. Please review highlighted fields.",
      deleteSuccess: "Specification permanently removed.",
      copySuccess: "RFC 4180 CSV string copied to clipboard.",
      sampleLoaded: "Classic cocktail baseline records loaded into ledger.",
      downloadInitiated: "Dataset download initialized successfully.",
    },
    legal: {
      copyrightHolder: "Sequence Cocktail Education Systems LLC",
      establishedYear: 2026,
      privacyPolicyUrl: "https://sequencecocktails.com/privacy",
      termsOfServiceUrl: "https://sequencecocktails.com/terms",
    },
  },

  // 5. EXTERNAL SUPPORT & METADATA
  support: {
    contactEmail: "curator@sequencecocktails.com",
    supportDeskUrl: "https://support.sequencecocktails.com",
    documentationUrl: "https://docs.sequencecocktails.com/csv-schema",
  },

  // 6. FEATURE SWITCHES & INTERACTION CONTROLS
  features: {
    enableHapticFeedback: true,        // Subtle 12ms tactile vibration
    enableSmoothPageTransitions: true, // Paper card lift animations
    enableAutoSave: true,              // Local persistence
    autoSaveIntervalMs: 4000,
    enableStickyBottomBar: true,       // Persistent thumb navigation dock
  },

  // 7. API ENDPOINTS & STORAGE
  endpoints: {
    storageKeys: {
      records: "sequence_spec_studio_records_v2",
      draft: "sequence_spec_studio_wizard_draft_v2",
    },
  },
});

(function () {
  "use strict";

  // ==========================================================================
  // SCHEMA & ARCHETYPE DEFINITIONS
  // ==========================================================================
  const SCHEMA = {
    expectedHeaders: [
      "title",
      "clue",
      "hint",
      "notes",
      "slot_1_name",
      "slot_1_answer",
      "slot_1_decoy",
      "slot_2_name",
      "slot_2_answer",
      "slot_2_decoy",
      "slot_3_name",
      "slot_3_answer",
      "slot_3_decoy",
      "slot_4_name",
      "slot_4_answer",
      "slot_4_decoy",
      "slot_5_name",
      "slot_5_answer",
      "slot_5_decoy"
    ],
  };

  const ARCHETYPES = {
    "classic-sour": {
      clue: "Assemble the balanced citrus sour archetype.",
      hint: "Emulsify citrus, modifier, and sugar thoroughly before chilling.",
      notes: "The sour ratio remains the foundation of modern craft bartending.",
      slots: [
        { name: "Base Spirit", ans: "Bourbon Whiskey", decoy: "Blended Scotch" },
        { name: "Sweetener", ans: "Rich Simple Syrup", decoy: "Grenadine" },
        { name: "Fresh Acid", ans: "Fresh Lemon Juice", decoy: "Bottled Sour Mix" },
        { name: "Method", ans: "Shake hard with ice and fine strain", decoy: "Stir gently in mixing glass" },
        { name: "Glass & Garnish", ans: "Chilled rocks glass with lemon wheel", decoy: "Hurricane glass with umbrella" }
      ]
    },
    "spirit-forward": {
      clue: "Assemble the silky stirred spirit-forward formula.",
      hint: "Stirring with dense ice maintains crystalline clarity and silky texture.",
      notes: "Spirit-forward drinks celebrate proof and aromatic botanical bitters.",
      slots: [
        { name: "Primary Spirit", ans: "Straight Rye Whiskey", decoy: "Neutral Vodka" },
        { name: "Fortified Modifier", ans: "Sweet Red Vermouth", decoy: "Dry White Vermouth" },
        { name: "Aromatic Seasoning", ans: "Angostura Aromatic Bitters", decoy: "Celery Bitters" },
        { name: "Method", ans: "Stir with solid ice and strain", decoy: "Flash blend with crushed ice" },
        { name: "Vessel & Garnish", ans: "Nick & Nora with brandied cherry", decoy: "Highball with salted rim" }
      ]
    },
    "effervescent": {
      clue: "Assemble the crisp sparkling highball.",
      hint: "Add effervescence gently to avoid dissipating natural carbonation.",
      notes: "Highballs elevate botanical distillates with chilled effervescence.",
      slots: [
        { name: "Base Spirit", ans: "London Dry Gin", decoy: "Dark Spiced Rum" },
        { name: "Citrus & Sugar", ans: "Fresh Lemon Juice & Simple Syrup", decoy: "Lime Cordial" },
        { name: "Carbonated Topper", ans: "Chilled Club Soda", decoy: "Ginger Ale" },
        { name: "Method", ans: "Shake base ingredients, strain, top with soda", decoy: "Dry shake and double strain" },
        { name: "Glass & Garnish", ans: "Collins glass with lemon wheel & cherry", decoy: "Coupe with salt rim" }
      ]
    }
  };

  const BUILTIN_SAMPLE_DATA = [
    {
      title: "Old Fashioned",
      clue: "Assemble the canonical spec for the archetype of all cocktails.",
      hint: "Demerara sugar cube muddled with aromatic bitters forms the foundation before adding whiskey.",
      notes: "The 1806 definition of a cocktail was spirits, sugar, water, and bitters; this build preserves that standard.",
      slot_1_name: "Base Spirit", slot_1_answer: "Bourbon or Rye Whiskey", slot_1_decoy: "Blended Scotch Whisky",
      slot_2_name: "Sweetener", slot_2_answer: "Demerara Sugar Cube", slot_2_decoy: "Agave Nectar",
      slot_3_name: "Seasoning", slot_3_answer: "Angostura Aromatic Bitters", slot_3_decoy: "Peychaud's Bitters",
      slot_4_name: "Method", slot_4_answer: "Stir with ice until chilled and diluted", slot_4_decoy: "Shake vigorously with ice",
      slot_5_name: "Glass & Garnish", slot_5_answer: "Rocks glass with expressed orange peel", slot_5_decoy: "Coupe with maraschino cherry",
      _isNew: false
    },
    {
      title: "Margarita",
      clue: "Build Mexico's iconic bright and zesty agave classic.",
      hint: "Orange liqueur provides sweetness and aroma while fresh lime delivers critical acid.",
      notes: "A canonical Margarita balances 100% agave tequila against fresh lime and dry orange curacao.",
      slot_1_name: "Base Spirit", slot_1_answer: "Blanco Tequila", slot_1_decoy: "Mezcal Espadín",
      slot_2_name: "Liqueur", slot_2_answer: "Triple Sec", slot_2_decoy: "Blue Curaçao",
      slot_3_name: "Citrus", slot_3_answer: "Fresh Lime Juice", slot_3_decoy: "Fresh Lemon Juice",
      slot_4_name: "Method", slot_4_answer: "Shake with ice and fine strain", slot_4_decoy: "Build directly over crushed ice",
      slot_5_name: "Glass & Garnish", slot_5_answer: "Coupe with half-salted rim", slot_5_decoy: "Highball with sugar rim",
      _isNew: false
    },
    {
      title: "Negroni",
      clue: "Construct Florence's legendary equal-parts bitter aperitivo.",
      hint: "Equal thirds of gin, sweet vermouth, and Campari create bittersweet harmony.",
      notes: "Originated at Caffè Casoni in 1919 when Count Camillo Negroni ordered gin substituted for soda in his Americano.",
      slot_1_name: "Base Spirit", slot_1_answer: "London Dry Gin", slot_1_decoy: "Vodka",
      slot_2_name: "Bitter Liqueur", slot_2_answer: "Campari", slot_2_decoy: "Aperol",
      slot_3_name: "Fortified Wine", slot_3_answer: "Sweet Red Vermouth", slot_3_decoy: "Dry White Vermouth",
      slot_4_name: "Method", slot_4_answer: "Stir with ice and strain over a large rock", slot_4_decoy: "Shake hard and double strain",
      slot_5_name: "Glass & Garnish", slot_5_answer: "Rocks glass with fresh orange peel", slot_5_decoy: "Coupe with brandied cherry",
      _isNew: false
    }
  ];

  // ==========================================================================
  // APPLICATION STATE
  // ==========================================================================
  const State = {
    records: [],
    editingIndex: null,
    currentStep: 1,
    currentView: "start",
    ledgerViewMode: "friendly", // 'friendly' | 'table' | 'technical'
    searchQuery: "",
    currentPage: 1,
    pageSize: 10,
    confirmActionCallback: null
  };

  // ==========================================================================
  // DOM REFERENCES
  // ==========================================================================
  const DOM = {
    // Header & Titles
    pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
    pageTitleSlot: document.getElementById("pageTitleSlot"),
    pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
    btnBackNav: document.getElementById("btn-back-nav"),
    btnBackNavLabel: document.getElementById("btn-back-nav-label"),
    btnQuickExport: document.getElementById("btn-quick-export"),
    bottomDockNavItems: document.getElementById("bottomDockNavItems"),

    // Views
    viewStart: document.getElementById("view-start"),
    viewEditor: document.getElementById("view-editor"),
    viewLedger: document.getElementById("view-ledger"),
    viewExport: document.getElementById("view-export"),

    // Start Screen
    cardActionAppend: document.getElementById("card-action-append"),
    cardActionFresh: document.getElementById("card-action-fresh"),
    cardActionManage: document.getElementById("card-action-manage"),
    fileUploader: document.getElementById("file-uploader"),
    btnLoadSample: document.getElementById("btn-load-sample"),
    btnDownloadBlankTmpl: document.getElementById("btn-download-blank-tmpl"),

    // Wizard
    wizardModeBadge: document.getElementById("wizard-mode-badge"),
    wizardStepTitle: document.getElementById("wizard-step-title"),
    stepNumberText: document.getElementById("step-number-text"),
    wizardProgressFill: document.getElementById("wizard-progress-fill"),
    formPuzzle: document.getElementById("form-puzzle"),
    stepPane1: document.getElementById("step-pane-1"),
    stepPane2: document.getElementById("step-pane-2"),
    stepPane3: document.getElementById("step-pane-3"),
    btnStepPrev: document.getElementById("btn-step-prev"),
    btnStepNext: document.getElementById("btn-step-next"),
    btnStepCancel: document.getElementById("btn-step-cancel"),
    btnSaveRecord: document.getElementById("btn-save-record"),

    // Inputs
    inputTitle: document.getElementById("input-title"),
    inputClue: document.getElementById("input-clue"),
    inputHint: document.getElementById("input-hint"),
    inputNotes: document.getElementById("input-notes"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackClue: document.getElementById("feedback-clue"),
    feedbackHint: document.getElementById("feedback-hint"),

    // Simulation & Audit
    simTitle: document.getElementById("sim-title"),
    simClue: document.getElementById("sim-clue"),
    simHint: document.getElementById("sim-hint"),
    simLore: document.getElementById("sim-lore"),
    simPoolTiles: document.getElementById("sim-pool-tiles"),
    auditStatusBadge: document.getElementById("audit-status-badge"),
    auditIssuesList: document.getElementById("audit-issues-list"),

    // Ledger
    ledgerStatsCaption: document.getElementById("ledger-stats-caption"),
    btnLedgerAdd: document.getElementById("btn-ledger-add"),
    btnLedgerExport: document.getElementById("btn-ledger-export"),
    inputSearch: document.getElementById("input-search"),
    btnSearchClear: document.getElementById("btn-search-clear"),
    btnModeFriendly: document.getElementById("btn-mode-friendly"),
    btnModeTable: document.getElementById("btn-mode-table"),
    btnModeTechnical: document.getElementById("btn-mode-technical"),
    ledgerContent: document.getElementById("ledger-content"),
    ledgerPagination: document.getElementById("ledger-pagination"),
    btnPagePrev: document.getElementById("btn-page-prev"),
    btnPageNext: document.getElementById("btn-page-next"),
    pageIndicator: document.getElementById("page-indicator"),

    // Export Center
    exportValidationStatus: document.getElementById("export-validation-status"),
    exportCountSummary: document.getElementById("export-count-summary"),
    exportAuditMsg: document.getElementById("export-audit-msg"),
    exportFilenameInput: document.getElementById("export-filename-input"),
    btnDownloadAll: document.getElementById("btn-download-all"),
    btnDownloadNew: document.getElementById("btn-download-new"),
    newCountBadge: document.getElementById("new-count-badge"),
    btnCopyCsv: document.getElementById("btn-copy-csv"),
    btnDownloadTemplate: document.getElementById("btn-download-template"),
    btnExpandPreview: document.getElementById("btn-expand-preview"),
    rawCsvPreview: document.getElementById("raw-csv-preview"),
    btnExportBackLedger: document.getElementById("btn-export-back-ledger"),

    // Toast & Modals
    toast: document.getElementById("toast"),
    modalConfirm: document.getElementById("modal-confirm"),
    modalConfirmTitle: document.getElementById("modal-confirm-title"),
    modalConfirmMsg: document.getElementById("modal-confirm-msg"),
    btnModalCancel: document.getElementById("btn-modal-cancel"),
    btnModalProceed: document.getElementById("btn-modal-proceed"),
  };

  // ==========================================================================
  // SENSORY HAPTIC SYSTEM
  // ==========================================================================
  function triggerHapticPulse() {
    if (
      APP_CONFIG.features.enableHapticFeedback &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Silently caught on unsupported contexts
      }
    }
  }

  // ==========================================================================
  // RFC 4180 CSV ENGINE
  // ==========================================================================
  const CSV = {
    parse(text) {
      const rows = [];
      let row = [];
      let cell = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const next = text[i + 1];

        if (c === '"' && inQuotes && next === '"') {
          cell += '"';
          i++;
        } else if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === "," && !inQuotes) {
          row.push(cell.trim());
          cell = "";
        } else if ((c === "\r" || c === "\n") && !inQuotes) {
          if (c === "\r" && next === "\n") i++;
          row.push(cell.trim());
          rows.push(row);
          row = [];
          cell = "";
        } else {
          cell += c;
        }
      }

      if (cell !== "" || (row.length > 0 && text[text.length - 1] === ",")) {
        row.push(cell.trim());
      }
      if (row.length > 0) {
        rows.push(row);
      }
      return rows;
    },

    serialize(records, headers = SCHEMA.expectedHeaders) {
      const escapeCell = (val) => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const lines = [];
      lines.push(headers.map(escapeCell).join(","));

      records.forEach((rec) => {
        const row = headers.map((h) => escapeCell(rec[h] || ""));
        lines.push(row.join(","));
      });

      return lines.join("\r\n");
    }
  };

  // ==========================================================================
  // TOAST & MODAL SERVICES
  // ==========================================================================
  let toastTimer = null;
  function showToast(msg) {
    if (toastTimer) clearTimeout(toastTimer);
    DOM.toast.textContent = msg;
    DOM.toast.classList.remove("hidden");
    toastTimer = setTimeout(() => {
      DOM.toast.classList.add("hidden");
    }, 2800);
  }

  function promptConfirm(title, message, onProceed) {
    DOM.modalConfirmTitle.textContent = title;
    DOM.modalConfirmMsg.textContent = message;
    State.confirmActionCallback = onProceed;
    DOM.modalConfirm.classList.remove("hidden");
  }

  function hideConfirm() {
    DOM.modalConfirm.classList.add("hidden");
    State.confirmActionCallback = null;
  }

  // ==========================================================================
  // STORAGE & HYDRATION
  // ==========================================================================
  function loadPersistedRecords() {
    try {
      const key = APP_CONFIG.endpoints.storageKeys.records;
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          State.records = parsed;
          return true;
        }
      }
    } catch (e) {
      console.warn("Storage recovery skipped:", e);
    }
    return false;
  }

  function savePersistedRecords() {
    try {
      const key = APP_CONFIG.endpoints.storageKeys.records;
      localStorage.setItem(key, JSON.stringify(State.records));
    } catch (e) {
      console.warn("Autosave unsuccessful:", e);
    }
  }

  // ==========================================================================
  // ROUTING & UNIFORM HEADER HYDRATION
  // ==========================================================================
  function switchView(viewName) {
    State.currentView = viewName;

    // View visibility
    DOM.viewStart.classList.add("hidden");
    DOM.viewEditor.classList.add("hidden");
    DOM.viewLedger.classList.add("hidden");
    DOM.viewExport.classList.add("hidden");

    // Standardized header copy
    const headerCopy = APP_CONFIG.content.headers[viewName] || APP_CONFIG.content.headers.start;
    DOM.pageEyebrowSlot.textContent = headerCopy.eyebrow;
    DOM.pageTitleSlot.textContent = headerCopy.title;
    DOM.pageSubtitleSlot.textContent = headerCopy.subtitle;

    // Standardized back button labels
    if (viewName === "start") {
      DOM.btnBackNavLabel.textContent = "Home";
    } else {
      DOM.btnBackNavLabel.textContent = APP_CONFIG.content.actions.back;
    }

    if (viewName === "start") {
      DOM.viewStart.classList.remove("hidden");
    } else if (viewName === "editor") {
      DOM.viewEditor.classList.remove("hidden");
    } else if (viewName === "ledger") {
      DOM.viewLedger.classList.remove("hidden");
      renderLedger();
    } else if (viewName === "export") {
      DOM.viewExport.classList.remove("hidden");
      renderExportCenter();
    }

    updateBottomDockActive();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBackNavigation() {
    if (State.currentView === "editor") {
      promptConfirm(
        "Discard Unsaved Changes",
        "Are you sure you want to navigate away? Any changes will be lost.",
        () => {
          hideConfirm();
          switchView(State.records.length > 0 ? "ledger" : "start");
        }
      );
    } else if (State.currentView === "export" || State.currentView === "ledger") {
      switchView("start");
    } else {
      switchView(APP_CONFIG.navigation.defaultFallbackRoute);
    }
  }

  function renderBottomDock() {
    DOM.bottomDockNavItems.innerHTML = "";
    APP_CONFIG.navigation.items.forEach((item) => {
      if (!item.showInBottomBar) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-tab-item interactive-tactile";
      btn.dataset.route = item.id;
      btn.setAttribute("aria-label", item.label);
      btn.innerHTML = `
        <span>${item.label}</span>
        <span class="nav-tab-item__indicator"></span>
      `;
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        if (item.id === "editor") {
          openEditor(null);
        } else {
          switchView(item.id);
        }
      });
      DOM.bottomDockNavItems.appendChild(btn);
    });
    updateBottomDockActive();
  }

  function updateBottomDockActive() {
    DOM.bottomDockNavItems.querySelectorAll(".nav-tab-item").forEach((btn) => {
      const match = btn.dataset.route === State.currentView;
      btn.classList.toggle("nav-tab-item--active", match);
      btn.setAttribute("aria-current", match ? "page" : "false");
    });
  }

  // ==========================================================================
  // CSV FILE IMPORT
  // ==========================================================================
  function handleCsvFileSelect(file, mode = "append") {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const text = e.target.result;
        const parsed = CSV.parse(text);

        if (parsed.length < 1) {
          showToast("The selected CSV file contains no readable content.");
          return;
        }

        const rawHeaders = parsed[0].map((h) => h.toLowerCase().trim());
        const missing = SCHEMA.expectedHeaders.filter((h) => !rawHeaders.includes(h));

        if (missing.length > 4) {
          showToast(`Incompatible CSV: Missing columns (${missing.slice(0, 3).join(", ")}...)`);
          return;
        }

        const imported = [];
        for (let i = 1; i < parsed.length; i++) {
          const row = parsed[i];
          if (!row || row.length === 0 || (row.length === 1 && !row[0])) continue;

          const rec = {};
          SCHEMA.expectedHeaders.forEach((colName) => {
            const colIdx = rawHeaders.indexOf(colName);
            rec[colName] = colIdx !== -1 && row[colIdx] !== undefined ? row[colIdx] : "";
          });

          rec._isNew = false;
          if (rec.title || rec.slot_1_answer) {
            imported.push(rec);
          }
        }

        if (mode === "append" && State.records.length > 0) {
          State.records = State.records.concat(imported);
          showToast(`Appended ${imported.length} specs to active ledger.`);
        } else {
          State.records = imported;
          showToast(`Imported ${imported.length} cocktail specifications.`);
        }

        savePersistedRecords();
        switchView("ledger");
      } catch (err) {
        showToast("Error processing CSV file.");
      }
    };
    reader.readAsText(file);
  }

  // ==========================================================================
  // WIZARD WORKFLOW
  // ==========================================================================
  function openEditor(index = null) {
    State.editingIndex = index;
    State.currentStep = 1;
    resetFieldErrors();

    if (index !== null && State.records[index]) {
      const rec = State.records[index];
      DOM.wizardModeBadge.textContent = "EDITING SPEC";
      DOM.wizardStepTitle.textContent = `Edit "${rec.title || "Untitled"}"`;
      populateForm(rec);
    } else {
      DOM.wizardModeBadge.textContent = "NEW SPEC";
      DOM.wizardStepTitle.textContent = "Create Cocktail Sequence";
      clearForm();
    }

    setWizardStep(1);
    switchView("editor");
  }

  function setWizardStep(step) {
    State.currentStep = step;
    DOM.stepNumberText.textContent = `Stage ${step}`;
    DOM.wizardProgressFill.style.width = `${(step / 3) * 100}%`;

    DOM.stepPane1.classList.add("hidden");
    DOM.stepPane2.classList.add("hidden");
    DOM.stepPane3.classList.add("hidden");

    if (step === 1) {
      DOM.stepPane1.classList.remove("hidden");
      DOM.btnStepPrev.classList.add("hidden");
      DOM.btnStepNext.classList.remove("hidden");
      DOM.btnStepNext.textContent = "Proceed to Slots →";
      DOM.btnSaveRecord.classList.add("hidden");
    } else if (step === 2) {
      DOM.stepPane2.classList.remove("hidden");
      DOM.btnStepPrev.classList.remove("hidden");
      DOM.btnStepNext.classList.remove("hidden");
      DOM.btnStepNext.textContent = "Review Live Simulation →";
      DOM.btnSaveRecord.classList.add("hidden");
    } else if (step === 3) {
      DOM.stepPane3.classList.remove("hidden");
      DOM.btnStepPrev.classList.remove("hidden");
      DOM.btnStepNext.classList.add("hidden");
      DOM.btnSaveRecord.classList.remove("hidden");
      updateLiveSimulation();
    }
  }

  function resetFieldErrors() {
    document.querySelectorAll(".paper-input, .paper-textarea").forEach((el) => {
      el.classList.remove("error");
    });
    document.querySelectorAll(".field-feedback-msg").forEach((el) => {
      el.classList.remove("active");
      el.textContent = "";
    });
  }

  function validateStep(step) {
    resetFieldErrors();
    let isValid = true;

    if (step === 1) {
      if (!DOM.inputTitle.value.trim()) {
        DOM.inputTitle.classList.add("error");
        DOM.feedbackTitle.textContent = "Cocktail title is required.";
        DOM.feedbackTitle.classList.add("active");
        isValid = false;
      }
      if (!DOM.inputClue.value.trim()) {
        DOM.inputClue.classList.add("error");
        DOM.feedbackClue.textContent = "Objective sequence prompt is required.";
        DOM.feedbackClue.classList.add("active");
        isValid = false;
      }
      if (!DOM.inputHint.value.trim()) {
        DOM.inputHint.classList.add("error");
        DOM.feedbackHint.textContent = "Tasting note hint is required.";
        DOM.feedbackHint.classList.add("active");
        isValid = false;
      }
    } else if (step === 2) {
      for (let s = 1; s <= 5; s++) {
        const nameInput = document.getElementById(`slot-${s}-name`);
        const ansInput = document.getElementById(`slot-${s}-answer`);
        const decoyInput = document.getElementById(`slot-${s}-decoy`);

        if (!nameInput.value.trim()) {
          nameInput.classList.add("error");
          isValid = false;
        }
        if (!ansInput.value.trim()) {
          ansInput.classList.add("error");
          isValid = false;
        }
        if (!decoyInput.value.trim()) {
          decoyInput.classList.add("error");
          isValid = false;
        }

        if (
          ansInput.value.trim() &&
          decoyInput.value.trim() &&
          ansInput.value.trim().toLowerCase() === decoyInput.value.trim().toLowerCase()
        ) {
          decoyInput.classList.add("error");
          showToast(`Slot ${s}: Decoy distractor cannot match authentic answer.`);
          isValid = false;
        }
      }

      if (!isValid) {
        showToast("Please ensure all 5 stages contain a label, answer, and distinct decoy.");
      }
    }

    return isValid;
  }

  function populateForm(rec) {
    DOM.inputTitle.value = rec.title || "";
    DOM.inputClue.value = rec.clue || "";
    DOM.inputHint.value = rec.hint || "";
    DOM.inputNotes.value = rec.notes || "";

    for (let s = 1; s <= 5; s++) {
      document.getElementById(`slot-${s}-name`).value = rec[`slot_${s}_name`] || "";
      document.getElementById(`slot-${s}-answer`).value = rec[`slot_${s}_answer`] || "";
      document.getElementById(`slot-${s}-decoy`).value = rec[`slot_${s}_decoy`] || "";
    }
  }

  function clearForm() {
    DOM.inputTitle.value = "";
    DOM.inputClue.value = "";
    DOM.inputHint.value = "";
    DOM.inputNotes.value = "";

    const defaultNames = ["Base Spirit", "Modifier", "Seasoning", "Method", "Glass & Garnish"];
    for (let s = 1; s <= 5; s++) {
      document.getElementById(`slot-${s}-name`).value = defaultNames[s - 1];
      document.getElementById(`slot-${s}-answer`).value = "";
      document.getElementById(`slot-${s}-decoy`).value = "";
    }
  }

  function getFormData() {
    const rec = {
      title: DOM.inputTitle.value.trim(),
      clue: DOM.inputClue.value.trim(),
      hint: DOM.inputHint.value.trim(),
      notes: DOM.inputNotes.value.trim(),
      _isNew: true
    };

    for (let s = 1; s <= 5; s++) {
      rec[`slot_${s}_name`] = document.getElementById(`slot-${s}-name`).value.trim();
      rec[`slot_${s}_answer`] = document.getElementById(`slot-${s}-answer`).value.trim();
      rec[`slot_${s}_decoy`] = document.getElementById(`slot-${s}-decoy`).value.trim();
    }
    return rec;
  }

  function applyPreset(presetKey) {
    const preset = ARCHETYPES[presetKey];
    if (!preset) return;

    if (!DOM.inputClue.value.trim()) DOM.inputClue.value = preset.clue;
    if (!DOM.inputHint.value.trim()) DOM.inputHint.value = preset.hint;
    if (!DOM.inputNotes.value.trim()) DOM.inputNotes.value = preset.notes;

    preset.slots.forEach((item, idx) => {
      const s = idx + 1;
      const nameEl = document.getElementById(`slot-${s}-name`);
      const ansEl = document.getElementById(`slot-${s}-answer`);
      const decoyEl = document.getElementById(`slot-${s}-decoy`);

      if (!nameEl.value.trim()) nameEl.value = item.name;
      if (!ansEl.value.trim()) ansEl.value = item.ans;
      if (!decoyEl.value.trim()) decoyEl.value = item.decoy;
    });

    showToast(`Autofilled template: ${presetKey}`);
  }

  // ==========================================================================
  // SIMULATION PREVIEW & AUDIT ENGINE
  // ==========================================================================
  function updateLiveSimulation() {
    const data = getFormData();

    DOM.simTitle.textContent = data.title || "Untitled Specification";
    DOM.simClue.textContent = data.clue || "No sequence objective recorded.";
    DOM.simHint.textContent = data.hint || "No tasting note recorded.";
    DOM.simLore.textContent = data.notes || "No victory notes recorded.";

    for (let s = 1; s <= 5; s++) {
      document.getElementById(`sim-slot-${s}-label`).textContent = data[`slot_${s}_name`] || `Slot ${s}`;
      document.getElementById(`sim-slot-${s}-val`).textContent = data[`slot_${s}_answer`] || "[Answer Pending]";
    }

    DOM.simPoolTiles.innerHTML = "";
    const pool = [];
    for (let s = 1; s <= 5; s++) {
      if (data[`slot_${s}_answer`]) pool.push({ text: data[`slot_${s}_answer`], isAnswer: true });
      if (data[`slot_${s}_decoy`]) pool.push({ text: data[`slot_${s}_decoy`], isAnswer: false });
    }

    pool.sort(() => 0.5 - Math.random());

    pool.forEach((token) => {
      const tile = document.createElement("div");
      tile.className = `sim-token-tile ${token.isAnswer ? "is-answer" : "is-decoy"}`;
      tile.textContent = token.text;
      DOM.simPoolTiles.appendChild(tile);
    });

    runAudit(data);
  }

  function runAudit(rec) {
    const issues = [];

    if (!rec.title) issues.push({ ok: false, msg: "Missing Cocktail Title" });
    else issues.push({ ok: true, msg: `Verified title: "${rec.title}"` });

    if (!rec.clue) issues.push({ ok: false, msg: "Missing Sequence Objective Clue" });
    else issues.push({ ok: true, msg: "Objective prompt configured" });

    if (!rec.hint) issues.push({ ok: false, msg: "Missing Tasting Note Hint" });
    else issues.push({ ok: true, msg: "Tasting note hint present" });

    let completeSlots = 0;
    for (let s = 1; s <= 5; s++) {
      if (rec[`slot_${s}_name`] && rec[`slot_${s}_answer`] && rec[`slot_${s}_decoy`]) {
        completeSlots++;
      }
    }

    if (completeSlots === 5) {
      issues.push({ ok: true, msg: "All 5 slots fully configured (names, answers, decoys)" });
    } else {
      issues.push({ ok: false, msg: `Incomplete slots: only ${completeSlots}/5 slots configured` });
    }

    const isDuplicateTitle = State.records.some(
      (r, idx) => idx !== State.editingIndex && r.title && r.title.toLowerCase() === rec.title.toLowerCase()
    );
    if (isDuplicateTitle) {
      issues.push({ ok: false, msg: `Notice: A cocktail titled "${rec.title}" is already in the ledger.` });
    }

    DOM.auditIssuesList.innerHTML = "";
    issues.forEach((it) => {
      const li = document.createElement("li");
      li.className = it.ok ? "valid" : "invalid";
      li.innerHTML = `<span>${it.ok ? "✦" : "⚠"}</span> ${it.msg}`;
      DOM.auditIssuesList.appendChild(li);
    });

    const allOk = issues.every((i) => i.ok);
    DOM.auditStatusBadge.textContent = allOk ? "READY FOR EXPORT" : "ISSUES FOUND";
    DOM.auditStatusBadge.className = `badge ${allOk ? "badge-sage" : "badge-terracotta"}`;
  }

  // ==========================================================================
  // RECORD CRUD OPERATIONS
  // ==========================================================================
  function saveCurrentRecord() {
    const rec = getFormData();

    if (State.editingIndex !== null && State.records[State.editingIndex]) {
      const wasNew = State.records[State.editingIndex]._isNew;
      rec._isNew = wasNew;
      State.records[State.editingIndex] = rec;
      showToast(`Updated "${rec.title}" successfully.`);
    } else {
      rec._isNew = true;
      State.records.push(rec);
      showToast(`Added "${rec.title}" to active ledger.`);
    }

    savePersistedRecords();
    switchView("ledger");
  }

  function duplicateRecord(index) {
    if (!State.records[index]) return;
    const original = State.records[index];
    const copy = Object.assign({}, original, {
      title: `${original.title} (Copy)`,
      _isNew: true
    });
    State.records.splice(index + 1, 0, copy);
    savePersistedRecords();
    showToast(`Duplicated "${original.title}".`);
    renderLedger();
  }

  function deleteRecord(index) {
    if (!State.records[index]) return;
    const title = State.records[index].title || "Untitled Spec";
    promptConfirm(
      "Confirm Removal",
      `Are you sure you want to permanently remove "${title}" from the ledger?`,
      () => {
        State.records.splice(index, 1);
        savePersistedRecords();
        hideConfirm();
        showToast(`Removed "${title}".`);
        renderLedger();
      }
    );
  }

  // ==========================================================================
  // LEDGER RENDERING
  // ==========================================================================
  function getFilteredRecords() {
    const q = State.searchQuery.toLowerCase().trim();
    if (!q) return State.records;

    return State.records.filter((r) => {
      if (r.title && r.title.toLowerCase().includes(q)) return true;
      if (r.clue && r.clue.toLowerCase().includes(q)) return true;
      if (r.notes && r.notes.toLowerCase().includes(q)) return true;
      for (let s = 1; s <= 5; s++) {
        if (r[`slot_${s}_answer`] && r[`slot_${s}_answer`].toLowerCase().includes(q)) return true;
        if (r[`slot_${s}_decoy`] && r[`slot_${s}_decoy`].toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }

  function renderLedger() {
    const filtered = getFilteredRecords();
    const total = State.records.length;
    DOM.ledgerStatsCaption.textContent = `${total} cocktail ${total === 1 ? "spec" : "specs"} in ledger (${filtered.length} matching).`;

    if (total === 0) {
      DOM.ledgerContent.innerHTML = `
        <div class="paper-card" style="text-align:center;padding:48px 24px;">
          <h3 style="font-family:var(--font-serif);font-size:1.45rem;color:var(--color-text-primary);margin-bottom:8px;">
            ${APP_CONFIG.content.emptyStates.noDataHeading}
          </h3>
          <p style="font-size:0.9375rem;color:var(--color-text-secondary);max-width:540px;margin:0 auto 20px;">
            ${APP_CONFIG.content.emptyStates.noDataDescription}
          </p>
          <button class="btn-paper-primary interactive-tactile" type="button" onclick="document.getElementById('btn-ledger-add').click()">
            + Author First Specification
          </button>
        </div>
      `;
      DOM.ledgerPagination.classList.add("hidden");
      return;
    }

    if (filtered.length === 0) {
      DOM.ledgerContent.innerHTML = `
        <div class="paper-card" style="text-align:center;padding:40px 20px;">
          <h3 style="font-family:var(--font-serif);font-size:1.25rem;color:var(--color-text-primary);margin-bottom:6px;">
            ${APP_CONFIG.content.emptyStates.noSearchResultsHeading}
          </h3>
          <p style="font-size:0.875rem;color:var(--color-text-secondary);">
            ${APP_CONFIG.content.emptyStates.noSearchResultsDescription}
          </p>
        </div>
      `;
      DOM.ledgerPagination.classList.add("hidden");
      return;
    }

    const totalPages = Math.ceil(filtered.length / State.pageSize);
    if (State.currentPage > totalPages) State.currentPage = totalPages;
    const startIdx = (State.currentPage - 1) * State.pageSize;
    const pageRecords = filtered.slice(startIdx, startIdx + State.pageSize);

    if (State.ledgerViewMode === "friendly") {
      renderCardsView(pageRecords);
    } else if (State.ledgerViewMode === "table") {
      renderTableView(pageRecords, startIdx);
    } else if (State.ledgerViewMode === "technical") {
      renderTechnicalView(filtered);
    }

    if (filtered.length > State.pageSize && State.ledgerViewMode !== "technical") {
      DOM.ledgerPagination.classList.remove("hidden");
      DOM.pageIndicator.textContent = `Page ${State.currentPage} of ${totalPages}`;
      DOM.btnPagePrev.disabled = State.currentPage === 1;
      DOM.btnPageNext.disabled = State.currentPage === totalPages;
    } else {
      DOM.ledgerPagination.classList.add("hidden");
    }
  }

  function renderCardsView(records) {
    DOM.ledgerContent.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "cards-feed-grid";

    records.forEach((rec) => {
      const realIndex = State.records.indexOf(rec);
      const card = document.createElement("article");
      card.className = "paper-card spec-ledger-card";

      card.innerHTML = `
        <div>
          <div class="spec-ledger-card__head">
            <h3 class="spec-ledger-card__title">${escapeHtml(rec.title || "Untitled")}</h3>
            ${rec._isNew ? '<span class="badge badge-terracotta">New</span>' : ""}
          </div>
          <p class="spec-ledger-card__clue">${escapeHtml(rec.clue || "")}</p>
        </div>

        <div class="spec-ledger-card__slots-summary">
          <div class="slots-summary-line"><span class="roman">I</span><span class="answer">${escapeHtml(rec.slot_1_answer || "—")}</span></div>
          <div class="slots-summary-line"><span class="roman">II</span><span class="answer">${escapeHtml(rec.slot_2_answer || "—")}</span></div>
          <div class="slots-summary-line"><span class="roman">III</span><span class="answer">${escapeHtml(rec.slot_3_answer || "—")}</span></div>
          <div class="slots-summary-line"><span class="roman">IV</span><span class="answer">${escapeHtml(rec.slot_4_answer || "—")}</span></div>
          <div class="slots-summary-line"><span class="roman">V</span><span class="answer">${escapeHtml(rec.slot_5_answer || "—")}</span></div>
        </div>

        <div class="spec-ledger-card__footer">
          <button type="button" class="btn-paper-secondary btn-sm interactive-tactile btn-action-edit" data-idx="${realIndex}">Edit</button>
          <button type="button" class="btn-paper-outline btn-sm interactive-tactile btn-action-dupe" data-idx="${realIndex}">Duplicate</button>
          <button type="button" class="btn-paper-outline btn-sm interactive-tactile btn-action-del" data-idx="${realIndex}" style="color:var(--color-terracotta-text);">Delete</button>
        </div>
      `;

      grid.appendChild(card);
    });

    DOM.ledgerContent.appendChild(grid);
    bindLedgerActionButtons();
  }

  function renderTableView(records, startOffset) {
    DOM.ledgerContent.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "ledger-table-wrap";

    const table = document.createElement("table");
    table.className = "ledger-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Cocktail Title</th>
          <th>Slot 1 (Base)</th>
          <th>Slot 2</th>
          <th>Slot 3</th>
          <th>Slot 4 (Method)</th>
          <th>Slot 5 (Glass)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    records.forEach((rec, idx) => {
      const realIndex = State.records.indexOf(rec);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="font-weight:700;color:var(--color-text-muted);">${startOffset + idx + 1}</td>
        <td><strong>${escapeHtml(rec.title || "Untitled")}</strong> ${rec._isNew ? '<span class="badge badge-terracotta">New</span>' : ""}</td>
        <td>${escapeHtml(rec.slot_1_answer || "—")}</td>
        <td>${escapeHtml(rec.slot_2_answer || "—")}</td>
        <td>${escapeHtml(rec.slot_3_answer || "—")}</td>
        <td>${escapeHtml(rec.slot_4_answer || "—")}</td>
        <td>${escapeHtml(rec.slot_5_answer || "—")}</td>
        <td>
          <button type="button" class="btn-paper-subtle btn-sm interactive-tactile btn-action-edit" data-idx="${realIndex}">Edit</button>
          <button type="button" class="btn-paper-subtle btn-sm interactive-tactile btn-action-dupe" data-idx="${realIndex}">Dupe</button>
          <button type="button" class="btn-paper-subtle btn-sm interactive-tactile btn-action-del" data-idx="${realIndex}" style="color:var(--color-terracotta-text);">Del</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    wrap.appendChild(table);
    DOM.ledgerContent.appendChild(wrap);
    bindLedgerActionButtons();
  }

  function renderTechnicalView(filteredRecords) {
    DOM.ledgerContent.innerHTML = "";
    const rawString = CSV.serialize(filteredRecords);
    const box = document.createElement("pre");
    box.className = "raw-csv-editor-box";
    box.tabIndex = 0;
    box.textContent = rawString;
    DOM.ledgerContent.appendChild(box);
  }

  function bindLedgerActionButtons() {
    DOM.ledgerContent.querySelectorAll(".btn-action-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        openEditor(parseInt(btn.dataset.idx, 10));
      });
    });
    DOM.ledgerContent.querySelectorAll(".btn-action-dupe").forEach((btn) => {
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        duplicateRecord(parseInt(btn.dataset.idx, 10));
      });
    });
    DOM.ledgerContent.querySelectorAll(".btn-action-del").forEach((btn) => {
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        deleteRecord(parseInt(btn.dataset.idx, 10));
      });
    });
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================================================
  // EXPORT ENGINE & DOWNLOAD MANAGEMENT
  // ==========================================================================
  function renderExportCenter() {
    const total = State.records.length;
    const newCount = State.records.filter((r) => r._isNew).length;

    DOM.exportCountSummary.textContent = `${total} Puzzles in Vault`;
    DOM.newCountBadge.textContent = newCount;

    let hasIssues = false;
    let missingFieldCount = 0;

    State.records.forEach((r) => {
      if (!r.title || !r.clue || !r.slot_1_answer || !r.slot_5_answer) {
        hasIssues = true;
        missingFieldCount++;
      }
    });

    if (total === 0) {
      DOM.exportValidationStatus.textContent = "Ledger Empty";
      DOM.exportValidationStatus.className = "badge";
      DOM.exportAuditMsg.textContent = "There are no records in the repository to export.";
    } else if (hasIssues) {
      DOM.exportValidationStatus.textContent = `${missingFieldCount} Records Require Review`;
      DOM.exportValidationStatus.className = "badge badge-terracotta";
      DOM.exportAuditMsg.textContent = "Notice: Some records are missing answers. The Sequence runtime requires all 5 slots.";
    } else {
      DOM.exportValidationStatus.textContent = "All Records Valid";
      DOM.exportValidationStatus.className = "badge badge-sage";
      DOM.exportAuditMsg.textContent = "Every record completely aligns with the 19-column schema. Ready for deployment.";
    }

    const previewRecords = State.records.slice(0, 5);
    DOM.rawCsvPreview.textContent = CSV.serialize(previewRecords);
  }

  function downloadCsvFile(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded "${filename}"`);
  }

  function getFilename() {
    let name = DOM.exportFilenameInput.value.trim() || "puzzles";
    if (!name.toLowerCase().endsWith(".csv")) {
      name += ".csv";
    }
    return name;
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  function bindEvents() {
    // Top Navigation
    DOM.btnBackNav.addEventListener("click", () => {
      triggerHapticPulse();
      handleBackNavigation();
    });

    DOM.btnQuickExport.addEventListener("click", () => {
      triggerHapticPulse();
      switchView("export");
    });

    // Start Screen Actions
    DOM.cardActionAppend.addEventListener("click", () => {
      triggerHapticPulse();
      DOM.fileUploader.dataset.mode = "append";
      DOM.fileUploader.click();
    });

    DOM.cardActionFresh.addEventListener("click", () => {
      triggerHapticPulse();
      promptConfirm(
        "Start Fresh Ledger",
        "Beginning a new ledger will clear currently active records from your workspace. Continue?",
        () => {
          State.records = [];
          savePersistedRecords();
          hideConfirm();
          openEditor(null);
        }
      );
    });

    DOM.cardActionManage.addEventListener("click", () => {
      triggerHapticPulse();
      if (State.records.length === 0) {
        DOM.fileUploader.dataset.mode = "replace";
        DOM.fileUploader.click();
      } else {
        switchView("ledger");
      }
    });

    DOM.fileUploader.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        handleCsvFileSelect(file, DOM.fileUploader.dataset.mode || "append");
      }
      DOM.fileUploader.value = "";
    });

    DOM.btnLoadSample.addEventListener("click", () => {
      triggerHapticPulse();
      State.records = JSON.parse(JSON.stringify(BUILTIN_SAMPLE_DATA));
      savePersistedRecords();
      showToast(APP_CONFIG.content.notifications.sampleLoaded);
      switchView("ledger");
    });

    DOM.btnDownloadBlankTmpl.addEventListener("click", () => {
      triggerHapticPulse();
      const blank = CSV.serialize([], SCHEMA.expectedHeaders);
      downloadCsvFile(blank, "sequence_template.csv");
    });

    // Wizard Controls
    DOM.btnStepNext.addEventListener("click", () => {
      triggerHapticPulse();
      if (validateStep(State.currentStep)) {
        setWizardStep(State.currentStep + 1);
      }
    });

    DOM.btnStepPrev.addEventListener("click", () => {
      triggerHapticPulse();
      setWizardStep(State.currentStep - 1);
    });

    DOM.btnStepCancel.addEventListener("click", () => {
      triggerHapticPulse();
      promptConfirm(
        "Discard Changes",
        "Are you sure you wish to exit the authoring wizard? Unsaved changes will be discarded.",
        () => {
          hideConfirm();
          switchView(State.records.length > 0 ? "ledger" : "start");
        }
      );
    });

    DOM.btnSaveRecord.addEventListener("click", () => {
      triggerHapticPulse();
      if (validateStep(1) && validateStep(2)) {
        saveCurrentRecord();
      } else {
        showToast("Please address the highlighted fields before saving.");
      }
    });

    // Preset chips
    document.querySelectorAll(".chip-archetype").forEach((chip) => {
      chip.addEventListener("click", () => {
        triggerHapticPulse();
        applyPreset(chip.dataset.preset);
      });
    });

    // Quick Slot Tag Suggestions
    document.querySelectorAll(".btn-quick-tag").forEach((btn) => {
      btn.addEventListener("click", () => {
        triggerHapticPulse();
        const input = btn.closest(".paper-input-group").querySelector(".slot-name-input");
        if (input) input.value = btn.textContent.trim();
      });
    });

    // Ledger Toolbar
    DOM.btnLedgerAdd.addEventListener("click", () => {
      triggerHapticPulse();
      openEditor(null);
    });

    DOM.btnLedgerExport.addEventListener("click", () => {
      triggerHapticPulse();
      switchView("export");
    });

    DOM.inputSearch.addEventListener("input", (e) => {
      State.searchQuery = e.target.value;
      State.currentPage = 1;
      DOM.btnSearchClear.classList.toggle("hidden", !State.searchQuery);
      renderLedger();
    });

    DOM.btnSearchClear.addEventListener("click", () => {
      triggerHapticPulse();
      DOM.inputSearch.value = "";
      State.searchQuery = "";
      DOM.btnSearchClear.classList.add("hidden");
      renderLedger();
    });

    DOM.btnModeFriendly.addEventListener("click", () => {
      triggerHapticPulse();
      State.ledgerViewMode = "friendly";
      DOM.btnModeFriendly.classList.add("active");
      DOM.btnModeTable.classList.remove("active");
      DOM.btnModeTechnical.classList.remove("active");
      renderLedger();
    });

    DOM.btnModeTable.addEventListener("click", () => {
      triggerHapticPulse();
      State.ledgerViewMode = "table";
      DOM.btnModeTable.classList.add("active");
      DOM.btnModeFriendly.classList.remove("active");
      DOM.btnModeTechnical.classList.remove("active");
      renderLedger();
    });

    DOM.btnModeTechnical.addEventListener("click", () => {
      triggerHapticPulse();
      State.ledgerViewMode = "technical";
      DOM.btnModeTechnical.classList.add("active");
      DOM.btnModeFriendly.classList.remove("active");
      DOM.btnModeTable.classList.remove("active");
      renderLedger();
    });

    DOM.btnPagePrev.addEventListener("click", () => {
      triggerHapticPulse();
      if (State.currentPage > 1) {
        State.currentPage--;
        renderLedger();
      }
    });

    DOM.btnPageNext.addEventListener("click", () => {
      triggerHapticPulse();
      const filtered = getFilteredRecords();
      const totalPages = Math.ceil(filtered.length / State.pageSize);
      if (State.currentPage < totalPages) {
        State.currentPage++;
        renderLedger();
      }
    });

    // Export Actions
    DOM.btnDownloadAll.addEventListener("click", () => {
      triggerHapticPulse();
      if (State.records.length === 0) {
        showToast("Ledger is empty. Add cocktail specifications first.");
        return;
      }
      downloadCsvFile(CSV.serialize(State.records), getFilename());
    });

    DOM.btnDownloadNew.addEventListener("click", () => {
      triggerHapticPulse();
      const newRecs = State.records.filter((r) => r._isNew);
      if (newRecs.length === 0) {
        showToast("No newly authored specifications recorded in this session.");
        return;
      }
      downloadCsvFile(CSV.serialize(newRecs), `new_${getFilename()}`);
    });

    DOM.btnCopyCsv.addEventListener("click", () => {
      triggerHapticPulse();
      if (State.records.length === 0) {
        showToast("Ledger is empty.");
        return;
      }
      const csvStr = CSV.serialize(State.records);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(csvStr)
          .then(() => showToast(APP_CONFIG.content.notifications.copySuccess))
          .catch(() => showToast("Clipboard write permission unavailable."));
      } else {
        showToast("Clipboard unavailable.");
      }
    });

    DOM.btnDownloadTemplate.addEventListener("click", () => {
      triggerHapticPulse();
      const blank = CSV.serialize([], SCHEMA.expectedHeaders);
      downloadCsvFile(blank, "sequence_template.csv");
    });

    DOM.btnExpandPreview.addEventListener("click", () => {
      triggerHapticPulse();
      DOM.rawCsvPreview.classList.toggle("expanded");
      DOM.btnExpandPreview.textContent = DOM.rawCsvPreview.classList.contains("expanded")
        ? "Collapse View"
        : "Toggle Full File";
      if (DOM.rawCsvPreview.classList.contains("expanded")) {
        DOM.rawCsvPreview.textContent = CSV.serialize(State.records);
      } else {
        DOM.rawCsvPreview.textContent = CSV.serialize(State.records.slice(0, 5));
      }
    });

    DOM.btnExportBackLedger.addEventListener("click", () => {
      triggerHapticPulse();
      switchView("ledger");
    });

    // Modal
    DOM.btnModalCancel.addEventListener("click", () => {
      triggerHapticPulse();
      hideConfirm();
    });

    DOM.btnModalProceed.addEventListener("click", () => {
      triggerHapticPulse();
      if (typeof State.confirmActionCallback === "function") {
        State.confirmActionCallback();
      }
    });

    DOM.formPuzzle.addEventListener("submit", (e) => e.preventDefault());
  }

  // ==========================================================================
  // RUNTIME INITIALIZATION
  // ==========================================================================
  function init() {
    renderBottomDock();
    bindEvents();
    const hasData = loadPersistedRecords();

    if (hasData) {
      switchView("ledger");
    } else {
      switchView("start");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();