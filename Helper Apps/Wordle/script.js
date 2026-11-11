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
    appId: "curator-word-guess-studio",
    appName: "Curator Studio",
    appTagline: "Artisanal Dataset Manager & Word Guess Companion",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "https://studio.wordguesspuzzles.com",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-seal.svg",
    logoAlt: "Curator Studio Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#A25750",      // Terracotta
    accentSecondary: "#526F56",  // Sage
    accentHighlight: "#7B641F",  // Ochre
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "welcome",
    items: [
      { id: "nav-item-welcome", label: "Launcher", icon: "icon-home", panel: "welcome", enabled: true, showInBottomBar: true },
      { id: "nav-item-form", label: "Add Entry", icon: "icon-compose", panel: "form", enabled: true, showInBottomBar: true },
      { id: "nav-item-table", label: "Catalog", icon: "icon-catalog", panel: "table", enabled: true, showInBottomBar: true },
      { id: "nav-item-export", label: "Export", icon: "icon-export", panel: "export", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultEyebrow: "DATASET WORKSPACE",
      defaultTitle: "Word Guess CSV Builder",
      defaultSubtitle: "Craft, inspect, and export verified five-letter puzzle catalogues with sensory tasting definitions.",
    },
    emptyStates: {
      noDataHeading: "No Matching Records Found",
      noDataDescription: "Adjust your search query or clear active filters to inspect records.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Puzzle Record",
      update: "Update Puzzle Record",
      delete: "Delete Permanently",
      back: "Back",
    },
    notifications: {
      saveSuccess: "Entry successfully committed to operational ledger.",
      updateSuccess: "Puzzle record verified and updated.",
      deleteSuccess: "Record permanently removed from catalog.",
      csvParseError: "The uploaded file does not comply with the required schema.",
      clipboardSuccess: "Dataset CSV copied to clipboard successfully.",
    },
    legal: {
      copyrightHolder: "Curator Systems LLC",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS & SUPPORT
  support: {
    contactEmail: "curator@wordguesspuzzles.com",
    documentationUrl: "https://docs.wordguesspuzzles.com",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms micro-haptics on mobile
    enableAutoSave: true,              // Automatic localStorage draft persistence
    autoSaveIntervalMs: 5000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,
  },

  // 7. STORAGE KEYS & SCHEMA
  endpoints: {
    storageKeys: {
      localDraft: "curator_word_guess_draft_v2",
      userPreferences: "curator_user_prefs_v2",
    },
  },
});

(function () {
  "use strict";

  // ==========================================================================
  // SCHEMA SPECIFICATION
  // ==========================================================================
  const SCHEMA = {
    expectedHeaders: ["word", "definition"],
    columns: [
      {
        key: "word",
        label: "Mystery Word",
        required: true,
        type: "string",
        length: 5,
        regex: /^[A-Za-z]{5}$/,
        example: "SHAKE",
      },
      {
        key: "definition",
        label: "Tasting Note / Definition",
        required: true,
        type: "string",
        example: "A botanical liqueur infused with gentian, herbs, and alpine bark.",
      }
    ]
  };

  // High-proof verified 5-letter culinary and sensory cocktail samples
  const SAMPLE_ENTRIES = [
    { word: "VERVE", definition: "Vigor and lively spirited enthusiasm embodied in sparkling celebratory aperitifs." },
    { word: "ZESTY", definition: "Having a pleasantly sharp and invigorating citrus aromatic profile from cold-pressed oils." },
    { word: "MEZCL", definition: "Artisanal agave distillate roasted inside traditional earthen stone pit ovens." },
    { word: "FIZZY", definition: "Sparkling with fine effervescent carbonation that elevates lighter floral notes." },
    { word: "HERBY", definition: "Noted for prominent botanical aromas of garden rosemary, tarragon, and fresh thyme." },
    { word: "AGING", definition: "The slow maturation and oxygenation of spirits within charred white oak casks." },
    { word: "PROOF", definition: "A historical scale defining the measured ethanol concentration of spirits." },
    { word: "TWIST", definition: "A slender swath of fresh citrus rind expressed over a completed cocktail." },
    { word: "FLOAT", definition: "A measured layer of spirit poured gently over a bar spoon atop a drink." },
    { word: "CRUSH", definition: "Muddled fresh seasonal fruits gently pressed to release fragrant aromatics." }
  ];

  // ==========================================================================
  // CSV ENGINE
  // ==========================================================================
  const CSVEngine = {
    parse(text) {
      const rows = [];
      let currentRow = [];
      let currentField = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          if (inQuotes && text[i + 1] === '"') {
            currentField += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === "," && !inQuotes) {
          currentRow.push(currentField.trim());
          currentField = "";
        } else if ((c === "\n" || c === "\r") && !inQuotes) {
          if (c === "\r" && text[i + 1] === "\n") i++;
          currentRow.push(currentField.trim());
          if (currentRow.some(f => f.length > 0)) rows.push(currentRow);
          currentRow = [];
          currentField = "";
        } else {
          currentField += c;
        }
      }
      if (currentField.length > 0 || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        if (currentRow.some(f => f.length > 0)) rows.push(currentRow);
      }

      if (rows.length < 1) return { headers: [], records: [] };

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const records = [];

      for (let r = 1; r < rows.length; r++) {
        const row = rows[r];
        const record = {};
        headers.forEach((h, idx) => {
          record[h] = row[idx] !== undefined ? row[idx] : "";
        });
        records.push(record);
      }

      return { headers, records };
    },

    escapeField(value) {
      if (value === null || value === undefined) return "";
      const str = String(value);
      if (/[",\n\r]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    },

    serialize(headers, records) {
      const lines = [];
      lines.push(headers.join(","));
      records.forEach(rec => {
        const row = headers.map(h => this.escapeField(rec[h] || ""));
        lines.push(row.join(","));
      });
      return lines.join("\n") + "\n";
    }
  };

  // ==========================================================================
  // HAPTIC UTILITY
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
        // Silent fallback
      }
    }
  }

  // ==========================================================================
  // APPLICATION CONTROLLER
  // ==========================================================================
  class CuratorApp {
    constructor() {
      this.records = [];
      this.activeView = "welcome"; // "welcome" | "workspace"
      this.activeWorkspacePanel = "form"; // "form" | "table" | "export"
      this.editingId = null;
      this.pendingDeleteId = null;
      this.viewMode = "friendly"; // "friendly" | "raw"
      this.filterStatus = "all";
      this.searchQuery = "";

      this.cacheDOMElements();
      this.hydrateFromConfig();
      this.attachEventListeners();
      this.checkLocalDraft();
    }

    cacheDOMElements() {
      this.dom = {
        // Standardized Header
        btnHeaderBack: document.getElementById("btn-header-back"),
        btnBackLabel: document.getElementById("btn-back-label"),
        pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
        pageTitleSlot: document.getElementById("pageTitleSlot"),
        pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
        sessionCounter: document.getElementById("session-counter"),
        btnHeaderReset: document.getElementById("btn-header-reset"),

        // Views
        viewWelcome: document.getElementById("view-welcome"),
        viewWorkspace: document.getElementById("view-workspace"),

        // Welcome Cards & Draft Banner
        cardStartAppend: document.getElementById("card-start-append"),
        cardStartFresh: document.getElementById("card-start-fresh"),
        cardStartReview: document.getElementById("card-start-review"),
        fileInputCsv: document.getElementById("file-input-csv"),
        draftBanner: document.getElementById("draft-banner"),
        draftMessage: document.getElementById("draft-message"),
        btnRestoreDraft: document.getElementById("btn-restore-draft"),
        btnDiscardDraft: document.getElementById("btn-discard-draft"),

        // Sub Nav Tabs & Bottom Dock
        tabBtnForm: document.getElementById("tab-btn-form"),
        tabBtnTable: document.getElementById("tab-btn-table"),
        tabBtnExport: document.getElementById("tab-btn-export"),
        tabFormLabel: document.getElementById("tab-form-label"),
        countTabTotal: document.getElementById("count-tab-total"),
        btnQuickSample: document.getElementById("btn-quick-sample"),
        bottomDockNavItems: document.getElementById("bottomDockNavItems"),

        // Workspace Panels
        panelForm: document.getElementById("panel-form"),
        panelTable: document.getElementById("panel-table"),
        panelExport: document.getElementById("panel-export"),

        // Step Nodes
        nodeStep1: document.getElementById("node-step-1"),
        nodeStep2: document.getElementById("node-step-2"),
        nodeStep3: document.getElementById("node-step-3"),
        lineStep1: document.getElementById("line-step-1"),
        lineStep2: document.getElementById("line-step-2"),

        // Editor Form
        formModeEyebrow: document.getElementById("form-mode-eyebrow"),
        formModeTitle: document.getElementById("form-mode-title"),
        editingIndicator: document.getElementById("editing-indicator"),
        puzzleForm: document.getElementById("puzzle-form"),
        inputWord: document.getElementById("input-word"),
        inputDefinition: document.getElementById("input-definition"),
        wordCharCounter: document.getElementById("word-char-counter"),
        defCharCounter: document.getElementById("def-char-counter"),
        wordFeedback: document.getElementById("word-feedback"),
        defFeedback: document.getElementById("def-feedback"),
        simWord: document.getElementById("sim-word"),
        simDef: document.getElementById("sim-def"),
        tileStrip: [
          document.getElementById("tile-0"),
          document.getElementById("tile-1"),
          document.getElementById("tile-2"),
          document.getElementById("tile-3"),
          document.getElementById("tile-4")
        ],
        btnSaveRecord: document.getElementById("btn-save-record"),
        saveBtnText: document.getElementById("save-btn-text"),
        btnSaveAndAdd: document.getElementById("btn-save-and-add"),
        btnCancelEdit: document.getElementById("btn-cancel-edit"),

        // Table Panel
        tableSearchInput: document.getElementById("table-search-input"),
        tableFilterStatus: document.getElementById("table-filter-status"),
        viewModeFriendly: document.getElementById("view-mode-friendly"),
        viewModeRaw: document.getElementById("view-mode-raw"),
        statValidCount: document.getElementById("stat-valid-count"),
        statWarnCount: document.getElementById("stat-warn-count"),
        statErrCount: document.getElementById("stat-err-count"),
        tableHeaderRow: document.getElementById("table-header-row"),
        tableBody: document.getElementById("table-body"),
        tableEmptyState: document.getElementById("table-empty-state"),
        tableFootCount: document.getElementById("table-foot-count"),
        btnTableAddNew: document.getElementById("btn-table-add-new"),

        // Export Panel
        expTotalCount: document.getElementById("exp-total-count"),
        expSessionCount: document.getElementById("exp-session-count"),
        expErrorsCount: document.getElementById("exp-errors-count"),
        exportFilename: document.getElementById("export-filename"),
        scopeCardNewOnly: document.getElementById("scope-card-new-only"),
        rawCsvSnippet: document.getElementById("raw-csv-snippet"),
        btnCopyCsv: document.getElementById("btn-copy-csv"),
        btnDownloadCsv: document.getElementById("btn-download-csv"),

        // Modals & Feedback
        modalDelete: document.getElementById("modal-delete"),
        deleteWordDisplay: document.getElementById("delete-word-display"),
        btnConfirmDelete: document.getElementById("btn-confirm-delete"),
        modalReset: document.getElementById("modal-reset"),
        btnConfirmReset: document.getElementById("btn-confirm-reset"),
        toast: document.getElementById("toast")
      };
    }

    hydrateFromConfig() {
      // Document metadata
      document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.content.headers.defaultTitle}`;
      
      // Header typography
      this.dom.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.defaultEyebrow;
      this.dom.pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
      this.dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
      this.dom.btnBackLabel.textContent = APP_CONFIG.content.actions.back;

      // Bottom Dock items
      this.renderBottomDock();
    }

    renderBottomDock() {
      if (!this.dom.bottomDockNavItems) return;
      this.dom.bottomDockNavItems.innerHTML = "";

      const items = APP_CONFIG.navigation.items.filter(i => i.enabled && i.showInBottomBar);
      items.forEach(item => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "nav-tab-item";
        btn.id = `dock-${item.id}`;
        btn.innerHTML = `
          <span>${item.label}</span>
          <span class="nav-tab-item__indicator"></span>
        `;
        btn.addEventListener("click", () => {
          triggerHapticPulse();
          if (item.panel === "welcome") {
            this.returnToWelcome();
          } else {
            this.openWorkspace(item.panel);
          }
        });
        this.dom.bottomDockNavItems.appendChild(btn);
      });

      this.updateDockActiveState();
    }

    updateDockActiveState() {
      const items = APP_CONFIG.navigation.items.filter(i => i.enabled && i.showInBottomBar);
      items.forEach(item => {
        const btn = document.getElementById(`dock-${item.id}`);
        if (!btn) return;
        const isActive = this.activeView === "welcome" 
          ? item.panel === "welcome" 
          : this.activeWorkspacePanel === item.panel;
        btn.classList.toggle("nav-tab-item--active", isActive);
      });
    }

    attachEventListeners() {
      // Global tactile interaction listener for micro-haptics
      document.addEventListener("click", (e) => {
        if (e.target.closest(".interactive-tactile, .btn-back-nav, .nav-tab-item")) {
          triggerHapticPulse();
        }
      });

      // Back navigation button
      this.dom.btnHeaderBack.addEventListener("click", () => {
        if (this.activeView === "workspace") {
          this.returnToWelcome();
        } else {
          this.showToast("Already at initial launcher.");
        }
      });

      // Starting pathways
      this.dom.cardStartFresh.addEventListener("click", () => {
        this.records = [];
        this.openWorkspace("form");
        this.showToast("Starting pristine dataset.");
      });

      this.dom.cardStartAppend.addEventListener("click", () => {
        this.dom.fileInputCsv.value = "";
        this.dom.fileInputCsv.click();
      });

      this.dom.cardStartReview.addEventListener("click", () => {
        this.dom.fileInputCsv.value = "";
        this.dom.fileInputCsv.click();
      });

      this.dom.fileInputCsv.addEventListener("change", (e) => this.handleFileUpload(e));

      // Local draft actions
      this.dom.btnRestoreDraft.addEventListener("click", () => this.restoreLocalDraft());
      this.dom.btnDiscardDraft.addEventListener("click", () => this.discardLocalDraft());

      // Reset controls
      this.dom.btnHeaderReset.addEventListener("click", () => this.openDialog(this.dom.modalReset));
      this.dom.btnConfirmReset.addEventListener("click", () => {
        this.dom.modalReset.close();
        this.resetSession();
      });

      // Sub Nav tab switches
      this.dom.tabBtnForm.addEventListener("click", () => this.switchWorkspacePanel("form"));
      this.dom.tabBtnTable.addEventListener("click", () => this.switchWorkspacePanel("table"));
      this.dom.tabBtnExport.addEventListener("click", () => this.switchWorkspacePanel("export"));

      // Real-time form feedback
      this.dom.inputWord.addEventListener("input", () => this.handleWordInput());
      this.dom.inputDefinition.addEventListener("input", () => this.handleDefinitionInput());

      this.dom.puzzleForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.saveCurrentRecord(false);
      });

      this.dom.btnSaveAndAdd.addEventListener("click", () => this.saveCurrentRecord(true));
      this.dom.btnCancelEdit.addEventListener("click", () => this.resetFormToNew());
      this.dom.btnQuickSample.addEventListener("click", () => this.insertSampleWord());

      // Table controls
      this.dom.tableSearchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderTable();
      });

      this.dom.tableFilterStatus.addEventListener("change", (e) => {
        this.filterStatus = e.target.value;
        this.renderTable();
      });

      this.dom.viewModeFriendly.addEventListener("click", () => this.setTableViewMode("friendly"));
      this.dom.viewModeRaw.addEventListener("click", () => this.setTableViewMode("raw"));
      this.dom.btnTableAddNew.addEventListener("click", () => {
        this.resetFormToNew();
        this.switchWorkspacePanel("form");
      });

      // Delete confirmation
      this.dom.btnConfirmDelete.addEventListener("click", () => this.executeDelete());

      // Export actions
      document.querySelectorAll('input[name="export-scope"]').forEach(r => {
        r.addEventListener("change", () => this.updateExportPreview());
      });

      this.dom.btnCopyCsv.addEventListener("click", () => this.copyExportToClipboard());
      this.dom.btnDownloadCsv.addEventListener("click", () => this.downloadCSV());

      // Modal dialog closers
      document.querySelectorAll("[data-close]").forEach(btn => {
        btn.addEventListener("click", () => {
          const m = document.getElementById(btn.dataset.close);
          if (m && typeof m.close === "function") m.close();
        });
      });
    }

    // ========================================================================
    // FILE INGESTION & STRUCTURAL VERIFICATION
    // ========================================================================
    handleFileUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const { headers, records } = CSVEngine.parse(content);

          const missingHeaders = SCHEMA.expectedHeaders.filter(h => !headers.includes(h));
          if (missingHeaders.length > 0) {
            this.showToast(APP_CONFIG.content.notifications.csvParseError);
            alert(`File schema incompatible.\nRequired columns: ${SCHEMA.expectedHeaders.join(", ")}\nFound: ${headers.join(", ")}`);
            return;
          }

          this.records = records.map((r, idx) => {
            const rawWord = (r.word || "").trim().toUpperCase();
            const rawDef = (r.definition || "").trim();
            const isValidLength = rawWord.length === 5;
            const isAlpha = /^[A-Z]{5}$/.test(rawWord);
            const hasError = !isValidLength || !isAlpha || !rawDef;

            return {
              id: `rec_${Date.now()}_${idx}`,
              word: rawWord,
              definition: rawDef,
              isNew: false,
              hasError
            };
          });

          this.openWorkspace("table");
          this.showToast(`Imported ${this.records.length} records successfully.`);
          this.saveLocalDraft();
        } catch (err) {
          this.showToast("Failed to parse uploaded CSV.");
        }
      };
      reader.readAsText(file);
    }

    // ========================================================================
    // WORKSPACE & ROUTING
    // ========================================================================
    openWorkspace(defaultPanel = "form") {
      this.activeView = "workspace";
      this.dom.viewWelcome.classList.add("hidden");
      this.dom.viewWorkspace.classList.remove("hidden");
      this.dom.sessionCounter.classList.remove("hidden");
      this.dom.btnHeaderReset.classList.remove("hidden");

      this.switchWorkspacePanel(defaultPanel);
      this.updateCountsAndHealth();
      this.updateDockActiveState();
    }

    returnToWelcome() {
      this.activeView = "welcome";
      this.dom.viewWorkspace.classList.add("hidden");
      this.dom.viewWelcome.classList.remove("hidden");
      this.updateDockActiveState();
    }

    switchWorkspacePanel(panelName) {
      this.activeWorkspacePanel = panelName;

      this.dom.tabBtnForm.classList.toggle("active", panelName === "form");
      this.dom.tabBtnTable.classList.toggle("active", panelName === "table");
      this.dom.tabBtnExport.classList.toggle("active", panelName === "export");

      this.dom.panelForm.classList.toggle("hidden", panelName !== "form");
      this.dom.panelTable.classList.toggle("hidden", panelName !== "table");
      this.dom.panelExport.classList.toggle("hidden", panelName !== "export");

      if (panelName === "table") {
        this.renderTable();
      } else if (panelName === "export") {
        this.updateExportPreview();
      }

      this.updateDockActiveState();
    }

    // ========================================================================
    // FORM BEHAVIORS & REALTIME STEP PROGRESSION
    // ========================================================================
    handleWordInput() {
      let val = this.dom.inputWord.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 5);
      this.dom.inputWord.value = val;
      this.dom.wordCharCounter.textContent = `${val.length} / 5 letters`;

      for (let i = 0; i < 5; i++) {
        const tile = this.dom.tileStrip[i];
        const letter = val[i] || "";
        tile.textContent = letter;
        tile.classList.toggle("filled", !!letter);
      }

      this.dom.simWord.textContent = val || "SHAKE";
      this.validateFormFields(false);
      this.updateStepNodes();
    }

    handleDefinitionInput() {
      const def = this.dom.inputDefinition.value;
      this.dom.defCharCounter.textContent = `${def.length} characters`;
      this.dom.simDef.textContent = def.trim() || "Tasting note or definition will appear here...";

      this.validateFormFields(false);
      this.updateStepNodes();
    }

    updateStepNodes() {
      const wordVal = this.dom.inputWord.value.trim();
      const defVal = this.dom.inputDefinition.value.trim();

      const step1Done = wordVal.length === 5 && /^[A-Z]{5}$/.test(wordVal);
      const step2Done = defVal.length > 0;

      this.dom.nodeStep1.classList.toggle("active", !step1Done);
      this.dom.lineStep1.classList.toggle("filled", step1Done);

      this.dom.nodeStep2.classList.toggle("active", step1Done && !step2Done);
      this.dom.lineStep2.classList.toggle("filled", step1Done && step2Done);

      this.dom.nodeStep3.classList.toggle("active", step1Done && step2Done);
    }

    validateFormFields(showMessage = true) {
      const word = this.dom.inputWord.value.trim();
      const def = this.dom.inputDefinition.value.trim();
      let isValid = true;

      if (!word) {
        if (showMessage) this.showFieldError(this.dom.wordFeedback, "Mystery word is mandatory.");
        isValid = false;
      } else if (word.length !== 5) {
        if (showMessage) this.showFieldError(this.dom.wordFeedback, `Requires exactly 5 letters (currently ${word.length}).`);
        isValid = false;
      } else if (!/^[A-Z]{5}$/.test(word)) {
        if (showMessage) this.showFieldError(this.dom.wordFeedback, "Letters only (A-Z).");
        isValid = false;
      } else {
        const isDup = this.records.some(r => r.word === word && r.id !== this.editingId);
        if (isDup) {
          if (showMessage) this.showFieldError(this.dom.wordFeedback, `"${word}" already exists in the catalog.`);
        } else {
          this.clearFieldError(this.dom.wordFeedback);
        }
      }

      if (!def) {
        if (showMessage) this.showFieldError(this.dom.defFeedback, "Tasting note or definition is mandatory.");
        isValid = false;
      } else {
        this.clearFieldError(this.dom.defFeedback);
      }

      return isValid;
    }

    showFieldError(el, msg) {
      el.textContent = msg;
      el.classList.remove("hidden");
    }

    clearFieldError(el) {
      el.textContent = "";
      el.classList.add("hidden");
    }

    saveCurrentRecord(addAnother = false) {
      if (!this.validateFormFields(true)) {
        this.showToast("Correct required fields to save.");
        return;
      }

      const word = this.dom.inputWord.value.trim().toUpperCase();
      const definition = this.dom.inputDefinition.value.trim();

      if (this.editingId) {
        const target = this.records.find(r => r.id === this.editingId);
        if (target) {
          target.word = word;
          target.definition = definition;
          target.hasError = false;
        }
        this.showToast(`Updated "${word}".`);
      } else {
        this.records.push({
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          word,
          definition,
          isNew: true,
          hasError: false
        });
        this.showToast(`Added "${word}" to catalog.`);
      }

      this.saveLocalDraft();
      this.updateCountsAndHealth();

      if (addAnother) {
        this.resetFormToNew();
        this.dom.inputWord.focus();
      } else {
        this.switchWorkspacePanel("table");
      }
    }

    resetFormToNew() {
      this.editingId = null;
      this.dom.puzzleForm.reset();
      this.dom.inputWord.value = "";
      this.dom.inputDefinition.value = "";
      this.dom.formModeEyebrow.textContent = "NEW ENTRY";
      this.dom.formModeTitle.textContent = "Define New Puzzle";
      this.dom.saveBtnText.textContent = APP_CONFIG.content.actions.save;
      this.dom.tabFormLabel.textContent = "Add Entry";
      this.dom.editingIndicator.classList.add("hidden");
      this.dom.btnCancelEdit.classList.add("hidden");

      this.handleWordInput();
      this.handleDefinitionInput();
      this.clearFieldError(this.dom.wordFeedback);
      this.clearFieldError(this.dom.defFeedback);
    }

    startEditingRecord(recordId) {
      const rec = this.records.find(r => r.id === recordId);
      if (!rec) return;

      this.editingId = rec.id;
      this.dom.formModeEyebrow.textContent = "EDITING RECORD";
      this.dom.formModeTitle.textContent = `Edit "${rec.word}"`;
      this.dom.saveBtnText.textContent = APP_CONFIG.content.actions.update;
      this.dom.tabFormLabel.textContent = "Editing";
      this.dom.editingIndicator.classList.remove("hidden");
      this.dom.btnCancelEdit.classList.remove("hidden");

      this.dom.inputWord.value = rec.word;
      this.dom.inputDefinition.value = rec.definition;

      this.handleWordInput();
      this.handleDefinitionInput();
      this.switchWorkspacePanel("form");
    }

    insertSampleWord() {
      const unused = SAMPLE_ENTRIES.filter(s => !this.records.some(r => r.word === s.word));
      const pick = unused.length > 0
        ? unused[Math.floor(Math.random() * unused.length)]
        : SAMPLE_ENTRIES[Math.floor(Math.random() * SAMPLE_ENTRIES.length)];

      this.dom.inputWord.value = pick.word;
      this.dom.inputDefinition.value = pick.definition;
      this.handleWordInput();
      this.handleDefinitionInput();
      this.showToast(`Loaded sample "${pick.word}".`);
    }

    // ========================================================================
    // TABULAR CATALOG REVIEW
    // ========================================================================
    setTableViewMode(mode) {
      this.viewMode = mode;
      this.dom.viewModeFriendly.classList.toggle("active", mode === "friendly");
      this.dom.viewModeRaw.classList.toggle("active", mode === "raw");
      this.renderTable();
    }

    renderTable() {
      let filtered = [...this.records];

      if (this.filterStatus === "new") {
        filtered = filtered.filter(r => r.isNew);
      } else if (this.filterStatus === "original") {
        filtered = filtered.filter(r => !r.isNew);
      } else if (this.filterStatus === "duplicates") {
        const counts = {};
        this.records.forEach(r => counts[r.word] = (counts[r.word] || 0) + 1);
        filtered = filtered.filter(r => counts[r.word] > 1);
      }

      if (this.searchQuery) {
        filtered = filtered.filter(r =>
          r.word.toLowerCase().includes(this.searchQuery) ||
          r.definition.toLowerCase().includes(this.searchQuery)
        );
      }

      this.dom.tableHeaderRow.innerHTML = "";
      if (this.viewMode === "friendly") {
        this.dom.tableHeaderRow.innerHTML = `
          <th style="width: 50px;">#</th>
          <th style="width: 140px;">Mystery Word</th>
          <th>Tasting Note / Definition</th>
          <th style="width: 100px;">Status</th>
          <th style="width: 110px; text-align: right;">Actions</th>
        `;
      } else {
        this.dom.tableHeaderRow.innerHTML = `
          <th style="width: 50px;">Row</th>
          <th style="width: 140px;"><code>word</code></th>
          <th><code>definition</code></th>
          <th style="width: 110px; text-align: right;">Actions</th>
        `;
      }

      this.dom.tableBody.innerHTML = "";
      if (filtered.length === 0) {
        this.dom.tableEmptyState.classList.remove("hidden");
      } else {
        this.dom.tableEmptyState.classList.add("hidden");

        filtered.forEach((rec, idx) => {
          const tr = document.createElement("tr");
          const isDuplicate = this.records.filter(r => r.word === rec.word).length > 1;

          if (this.viewMode === "friendly") {
            const badgeHtml = rec.isNew
              ? `<span class="status-pill status-pill--sage">New</span>`
              : `<span class="status-pill status-pill--ochre">Base</span>`;
            const dupHtml = isDuplicate
              ? `<span class="status-pill status-pill--terracotta">Duplicate</span>`
              : "";

            tr.innerHTML = `
              <td>${idx + 1}</td>
              <td class="word-cell">${rec.word} ${dupHtml}</td>
              <td class="def-cell">${this.escapeHTML(rec.definition)}</td>
              <td>${badgeHtml}</td>
              <td class="actions-cell">
                <button class="btn-table-action" data-edit="${rec.id}" title="Edit Record" aria-label="Edit ${rec.word}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-table-action" data-duplicate="${rec.id}" title="Duplicate Record" aria-label="Duplicate ${rec.word}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button class="btn-table-action delete-action" data-delete="${rec.id}" title="Delete Record" aria-label="Delete ${rec.word}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            `;
          } else {
            tr.innerHTML = `
              <td>${idx + 2}</td>
              <td><code class="code-pill">${rec.word}</code></td>
              <td class="def-cell"><code>${this.escapeHTML(rec.definition)}</code></td>
              <td class="actions-cell">
                <button class="btn-table-action" data-edit="${rec.id}" title="Edit Record" aria-label="Edit ${rec.word}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-table-action delete-action" data-delete="${rec.id}" title="Delete Record" aria-label="Delete ${rec.word}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </td>
            `;
          }

          tr.querySelector("[data-edit]")?.addEventListener("click", () => this.startEditingRecord(rec.id));
          tr.querySelector("[data-duplicate]")?.addEventListener("click", () => this.duplicateRecord(rec.id));
          tr.querySelector("[data-delete]")?.addEventListener("click", () => this.promptDelete(rec.id));

          this.dom.tableBody.appendChild(tr);
        });
      }

      this.dom.tableFootCount.textContent = `Showing ${filtered.length} of ${this.records.length} catalog puzzles`;
    }

    duplicateRecord(recordId) {
      const rec = this.records.find(r => r.id === recordId);
      if (!rec) return;

      this.resetFormToNew();
      this.dom.inputWord.value = "";
      this.dom.inputDefinition.value = rec.definition;
      this.handleWordInput();
      this.handleDefinitionInput();
      this.switchWorkspacePanel("form");
      this.showToast(`Duplicated definition from "${rec.word}".`);
    }

    promptDelete(recordId) {
      const rec = this.records.find(r => r.id === recordId);
      if (!rec) return;

      this.pendingDeleteId = recordId;
      this.dom.deleteWordDisplay.textContent = rec.word;
      this.openDialog(this.dom.modalDelete);
    }

    executeDelete() {
      if (!this.pendingDeleteId) return;
      const target = this.records.find(r => r.id === this.pendingDeleteId);
      const word = target ? target.word : "";

      this.records = this.records.filter(r => r.id !== this.pendingDeleteId);
      this.pendingDeleteId = null;
      this.dom.modalDelete.close();

      this.saveLocalDraft();
      this.updateCountsAndHealth();
      this.renderTable();
      this.showToast(APP_CONFIG.content.notifications.deleteSuccess);
    }

    // ========================================================================
    // HEALTH METRICS & EXPORT GENERATION
    // ========================================================================
    updateCountsAndHealth() {
      const total = this.records.length;
      const newCount = this.records.filter(r => r.isNew).length;

      const wordCounts = {};
      this.records.forEach(r => wordCounts[r.word] = (wordCounts[r.word] || 0) + 1);
      const duplicateCount = Object.values(wordCounts).filter(c => c > 1).length;

      const errorCount = this.records.filter(r => r.hasError || !r.word || r.word.length !== 5 || !r.definition).length;
      const validCount = total - errorCount;

      this.dom.sessionCounter.textContent = `${total} puzzle${total === 1 ? "" : "s"}`;
      this.dom.countTabTotal.textContent = total;

      this.dom.statValidCount.textContent = validCount;
      this.dom.statWarnCount.textContent = duplicateCount;
      this.dom.statErrCount.textContent = errorCount;

      this.dom.expTotalCount.textContent = total;
      this.dom.expSessionCount.textContent = newCount;
      this.dom.expErrorsCount.textContent = errorCount;

      if (newCount === 0) {
        this.dom.scopeCardNewOnly.classList.add("hidden");
        const radioAll = document.querySelector('input[name="export-scope"][value="all"]');
        if (radioAll) radioAll.checked = true;
      } else {
        this.dom.scopeCardNewOnly.classList.remove("hidden");
      }
    }

    updateExportPreview() {
      this.updateCountsAndHealth();
      const scope = document.querySelector('input[name="export-scope"]:checked')?.value || "all";

      let exportRecords = [];
      if (scope === "all") {
        exportRecords = this.records;
      } else if (scope === "new-only") {
        exportRecords = this.records.filter(r => r.isNew);
      } else if (scope === "blank-template") {
        exportRecords = [];
      }

      const sample = exportRecords.slice(0, 5);
      const csvSnippet = CSVEngine.serialize(SCHEMA.expectedHeaders, sample);
      this.dom.rawCsvSnippet.textContent = csvSnippet + (exportRecords.length > 5 ? `... (${exportRecords.length - 5} additional records)\n` : "");
    }

    downloadCSV() {
      const scope = document.querySelector('input[name="export-scope"]:checked')?.value || "all";
      let exportRecords = [];

      if (scope === "all") {
        exportRecords = this.records;
      } else if (scope === "new-only") {
        exportRecords = this.records.filter(r => r.isNew);
      } else if (scope === "blank-template") {
        exportRecords = [];
      }

      const errorRows = exportRecords.filter(r => !r.word || r.word.length !== 5 || !r.definition);
      if (errorRows.length > 0) {
        const proceed = confirm(`Attention: ${errorRows.length} record(s) contain format errors.\n\nDo you wish to download anyway?`);
        if (!proceed) return;
      }

      const csvContent = CSVEngine.serialize(SCHEMA.expectedHeaders, exportRecords);
      const filename = this.dom.exportFilename.value.trim() || "puzzles.csv";

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.showToast(`Exported ${exportRecords.length} records to ${filename}`);
    }

    copyExportToClipboard() {
      const scope = document.querySelector('input[name="export-scope"]:checked')?.value || "all";
      let exportRecords = scope === "all" ? this.records : scope === "new-only" ? this.records.filter(r => r.isNew) : [];

      const fullCsv = CSVEngine.serialize(SCHEMA.expectedHeaders, exportRecords);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullCsv).then(() => {
          this.showToast(APP_CONFIG.content.notifications.clipboardSuccess);
        });
      } else {
        this.showToast("Clipboard access unavailable.");
      }
    }

    // ========================================================================
    // AUTO-SAVE DRAFT PIPELINE
    // ========================================================================
    saveLocalDraft() {
      if (!APP_CONFIG.features.enableAutoSave) return;
      try {
        localStorage.setItem(APP_CONFIG.endpoints.storageKeys.localDraft, JSON.stringify({
          savedAt: Date.now(),
          records: this.records
        }));
      } catch (e) {
        // LocalStorage quota handling
      }
    }

    checkLocalDraft() {
      if (!APP_CONFIG.features.enableAutoSave) return;
      try {
        const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.localDraft);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.records) && parsed.records.length > 0) {
          this.dom.draftMessage.textContent = `Found an unsaved draft from your previous session (${parsed.records.length} records).`;
          this.dom.draftBanner.classList.remove("hidden");
        }
      } catch (e) {
        // Fallback
      }
    }

    restoreLocalDraft() {
      try {
        const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.localDraft);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.records)) {
          this.records = parsed.records;
          this.dom.draftBanner.classList.add("hidden");
          this.openWorkspace("table");
          this.showToast(`Restored ${this.records.length} records.`);
        }
      } catch (e) {
        // Fallback
      }
    }

    discardLocalDraft() {
      try {
        localStorage.removeItem(APP_CONFIG.endpoints.storageKeys.localDraft);
        this.dom.draftBanner.classList.add("hidden");
        this.showToast("Previous draft discarded.");
      } catch (e) {
        // Fallback
      }
    }

    resetSession() {
      this.records = [];
      this.resetFormToNew();
      try {
        localStorage.removeItem(APP_CONFIG.endpoints.storageKeys.localDraft);
      } catch (e) {}

      this.activeView = "welcome";
      this.dom.viewWorkspace.classList.add("hidden");
      this.dom.viewWelcome.classList.remove("hidden");
      this.dom.sessionCounter.classList.add("hidden");
      this.dom.btnHeaderReset.classList.add("hidden");
      this.dom.draftBanner.classList.add("hidden");
      this.updateDockActiveState();
      this.showToast("Session reset successfully.");
    }

    // ========================================================================
    // UTILITIES
    // ========================================================================
    showToast(message) {
      this.dom.toast.textContent = message;
      this.dom.toast.classList.remove("hidden");
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.dom.toast.classList.add("hidden");
      }, 2600);
    }

    openDialog(dialog) {
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    }

    escapeHTML(str) {
      if (!str) return "";
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new CuratorApp();
  });
})();