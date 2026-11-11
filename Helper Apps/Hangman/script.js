/**
 * ============================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * ============================================================================
 */
const APP_CONFIG = Object.freeze({
  // 1. APPLICATION IDENTITY & METADATA
  identity: {
    appId: "cocktail-lounge-curator-v2",
    appName: "Hangman Curator",
    appTagline: "Cocktail Lounge CSV Data Studio & Cellar Vault",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "https://cocktail-hangman.local/curator",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    sealIcon: "🍸",
    accentColor: "#963E35",     // Accessible Terracotta
    accentSecondary: "#3E5B42", // Accessible Sage
    accentHighlight: "#6E5614", // Accessible Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilySerif: "'Charter', 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "welcome",
    items: [
      { id: "nav-welcome", label: "Setup Vault", icon: "icon-overview", route: "#welcome", enabled: true, showInBottomBar: true },
      { id: "nav-workspace", label: "Catalogue", icon: "icon-ledger", route: "#workspace", enabled: true, showInBottomBar: true },
      { id: "nav-export", label: "Export CSV", icon: "icon-export", route: "#export", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. PRODUCTION COPY & CONTENT MATRIX (ZERO-PLACEHOLDERS)
  content: {
    headers: {
      welcomeEyebrow: "MIXOLOGIST'S PUZZLE VAULT",
      welcomeTitle: "Cocktail Cellar Curator",
      welcomeSubtitle: "Curate, expand, and audit daily challenge riddles and vault puzzles for the Cocktail Lounge Hangman game. Zero spreadsheet hassle required.",
      workspaceEyebrow: "ACTIVE CELLAR REPOSITORY",
      workspaceTitle: "Puzzle Archive & Ledger",
      workspaceSubtitle: "Organize secret drinks, refine mixologist clues, and audit daily calendar rotation.",
    },
    emptyStates: {
      noDataHeading: "No Records Currently Documented",
      noDataDescription: "This operational log is clear. Create a new entry using the primary action below to initiate records.",
      noSearchResultsHeading: "No Matching Records Found",
      noSearchResultsDescription: "Review your filter parameters or search terms and attempt the query again.",
    },
    actions: {
      confirmDelete: "Delete Riddle Permanently",
      cancel: "Discard Changes",
      saveRiddle: "Save Puzzle to Ledger",
      saveAndAddAnother: "Save & Add Another",
      exportData: "Download RFC 4180 CSV",
    },
    notifications: {
      draftRestored: "Restored active working cellar draft",
      riddleSaved: "Puzzle committed to cellar vault",
      riddleDeleted: "Puzzle permanently removed from ledger",
      riddleDuplicated: "Riddle duplicated into consecutive slot",
      csvExported: "Export generated successfully",
      csvCopied: "Raw RFC 4180 CSV copied to clipboard",
      workspaceReset: "Working cellar cleared from browser storage",
    },
    legal: {
      copyrightHolder: "Cocktail Lounge Hangman Project",
      targetSchema: "category, answer, clue, note (RFC 4180 Escaped)",
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "curator@cocktaillounge.internal",
    operatingHours: "Autonomous In-Browser Studio",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms micro-haptics on mobile devices
    enableAutoSave: true,               // Automatic persistence to localStorage
    autoSaveIntervalMs: 3000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,
  },

  // 7. SPECIFICATIONS & SEED DATA
  specs: {
    canonicalHeaders: ['category', 'answer', 'clue', 'note'],
    defaultFileName: 'puzzles.csv',
    draftStorageKey: 'cocktail_curator_cellar_v2_draft',
    toastDurationMs: 2400,
    seedCellarPuzzles: [
      {
        category: 'Cocktails',
        answer: 'NEGRONI',
        clue: 'Equal-parts Italian classic of gin, sweet vermouth, and Campari.',
        note: 'Invented in Florence circa 1919 when Count Camillo Negroni asked to stiffen his Americano with gin instead of soda.',
        isNew: false
      },
      {
        category: 'Bar Tools',
        answer: 'HAWTHORNE STRAINER',
        clue: 'Perforated metal bar tool fitted with a flexible wire coil.',
        note: 'The spring adapts to the shaker rim to hold back shaken ice and broken fruit pulp.',
        isNew: false
      },
      {
        category: 'Ingredients',
        answer: 'ORGEAT',
        clue: 'Almond syrup delicately scented with rose water or orange flower water.',
        note: 'A fundamental sweetener in tropical tiki drinks like the classic 1944 Mai Tai.',
        isNew: false
      },
      {
        category: 'Spirits',
        answer: 'MEZCAL',
        clue: 'Traditional Mexican spirit distilled from agave roasted in earthen pit ovens.',
        note: 'Unlike tequila, it can be made from over thirty varieties of agave and carries a distinctive smoky profile.',
        isNew: false
      },
      {
        category: 'Glassware',
        answer: 'COUPE',
        clue: 'Stemmed shallow-bowled glass originally designed for champagne.',
        note: 'Widely favored in modern cocktail service for drinks served up without ice.',
        isNew: false
      }
    ]
  }
});

/**
 * ============================================================================
 * RFC 4180 COMPLIANT CSV ENGINE (Parsing & Serialization)
 * ============================================================================
 */
class CSVEngine {
  /**
   * Parses RFC 4180 formatted text into an array of string arrays.
   */
  static parse(text) {
    if (!text || !text.trim()) return [];
    const rows = [];
    let row = [''];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          cell += '"';
          i++; // skip escaped double quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(cell);
        cell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(cell);
        cell = '';
        if (row.length > 1 || row[0] !== '') {
          rows.push(row);
        }
        row = [];
      } else {
        cell += char;
      }
    }

    if (cell.length > 0 || row.length > 0) {
      row.push(cell);
      rows.push(row);
    }

    if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
      rows.pop();
    }

    return rows;
  }

  /**
   * Serializes an array of objects to strict RFC 4180 CSV format.
   */
  static serialize(records, headers = APP_CONFIG.specs.canonicalHeaders) {
    const escapeCell = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headerLine = headers.join(',');
    const dataLines = records.map(record => {
      return headers.map(key => escapeCell(record[key] || '')).join(',');
    });

    return [headerLine, ...dataLines].join('\r\n') + '\r\n';
  }
}

/**
 * ============================================================================
 * STATE MANAGEMENT & PERSISTENCE
 * ============================================================================
 */
class CellarState {
  constructor() {
    this.puzzles = [];
    this.activeFilter = { search: '', category: 'ALL' };
    this.editingIndex = null;
    this.currentBuilderStep = 1;
    this.activeView = 'welcome';
  }

  saveDraft() {
    if (!APP_CONFIG.features.enableAutoSave) return;
    try {
      const payload = {
        puzzles: this.puzzles,
        timestamp: Date.now()
      };
      localStorage.setItem(APP_CONFIG.specs.draftStorageKey, JSON.stringify(payload));
    } catch (err) {
      console.warn('Draft save unavailable:', err);
    }
  }

  loadDraft() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.specs.draftStorageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.puzzles) && parsed.puzzles.length > 0) {
        return parsed.puzzles;
      }
    } catch (err) {
      return null;
    }
    return null;
  }

  clearDraft() {
    try {
      localStorage.removeItem(APP_CONFIG.specs.draftStorageKey);
    } catch (e) {}
  }

  getCategories() {
    const set = new Set();
    this.puzzles.forEach(p => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set).sort();
  }
}

/**
 * ============================================================================
 * MASTER CURATOR STUDIO APPLICATION CONTROLLER
 * ============================================================================
 */
class CuratorStudioApp {
  constructor() {
    this.state = new CellarState();
    this.cacheDom();
    this.hydrateFromConfig();
    this.bindEvents();
    this.checkForDraftRecovery();
  }

  /**
   * Caches all essential DOM pointers
   */
  cacheDom() {
    this.dom = {
      toast: document.getElementById('toast'),
      btnGlobalBack: document.getElementById('btn-global-back'),
      backNavLabel: document.getElementById('back-nav-label'),
      datasetStatusPill: document.getElementById('dataset-status-pill'),
      datasetStatusText: document.getElementById('dataset-status-text'),
      headerDraftClearBtn: document.getElementById('header-draft-clear-btn'),
      pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
      pageTitleSlot: document.getElementById('pageTitleSlot'),
      pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),
      bottomDockNavItems: document.getElementById('bottomDockNavItems'),

      // Views
      welcomeView: document.getElementById('welcome-view'),
      workspaceView: document.getElementById('workspace-view'),

      // Welcome actions
      fileUploadAppend: document.getElementById('file-upload-append'),
      fileUploadReview: document.getElementById('file-upload-review'),
      choiceCreateBtn: document.getElementById('choice-create-btn'),

      // Workspace Toolbar
      toolbarNewRecordBtn: document.getElementById('toolbar-new-record-btn'),
      toolbarExportBtn: document.getElementById('toolbar-export-btn'),
      catalogueSearchInput: document.getElementById('catalogue-search-input'),
      catalogueCategoryFilter: document.getElementById('catalogue-category-filter'),
      btnQuickImport: document.getElementById('btn-quick-import'),

      // Metrics
      metricTotalCount: document.getElementById('metric-total-count'),
      metricNewCount: document.getElementById('metric-new-count'),
      metricCategoryCount: document.getElementById('metric-category-count'),
      metricCycleDays: document.getElementById('metric-cycle-days'),

      // Subview Tabs
      tabVaultView: document.getElementById('tab-vault-view'),
      tabTableView: document.getElementById('tab-table-view'),
      tabTechnicalView: document.getElementById('tab-technical-view'),
      tabCountCards: document.getElementById('tab-count-cards'),
      subviewCards: document.getElementById('subview-cards'),
      subviewTable: document.getElementById('subview-table'),
      subviewTechnical: document.getElementById('subview-technical'),
      recordsCardsContainer: document.getElementById('records-cards-container'),
      curatorTableBody: document.getElementById('curator-table-body'),
      rawCsvPreview: document.getElementById('raw-csv-preview'),
      btnCopyRawCsv: document.getElementById('btn-copy-raw-csv'),

      // Builder Modal
      builderModal: document.getElementById('builder-modal'),
      builderModalTitle: document.getElementById('builder-modal-title'),
      builderModeEyebrow: document.getElementById('builder-mode-eyebrow'),
      builderModalClose: document.getElementById('builder-modal-close'),
      builderForm: document.getElementById('builder-form'),
      stepIndicators: document.querySelectorAll('.step-indicator'),
      builderStepPanes: document.querySelectorAll('.builder-step-pane'),
      stepPrevBtn: document.getElementById('step-prev-btn'),
      stepNextBtn: document.getElementById('step-next-btn'),
      saveAnotherBtn: document.getElementById('save-another-btn'),
      saveRecordBtn: document.getElementById('save-record-btn'),

      // Form Controls
      inputCategory: document.getElementById('input-category'),
      knownCategoriesList: document.getElementById('known-categories-list'),
      categoryQuickPills: document.getElementById('category-quick-pills'),
      inputAnswer: document.getElementById('input-answer'),
      answerValidationFeedback: document.getElementById('answer-validation-feedback'),
      miniSlotsStrip: document.getElementById('mini-slots-strip'),
      slotLetterCount: document.getElementById('slot-letter-count'),
      slotWordCount: document.getElementById('slot-word-count'),
      inputClue: document.getElementById('input-clue'),
      clueCharCount: document.getElementById('clue-char-count'),
      inputNote: document.getElementById('input-note'),
      noteCharCount: document.getElementById('note-char-count'),

      // Simulation Frame
      simCatDisplay: document.getElementById('sim-cat-display'),
      simSlotsDisplay: document.getElementById('sim-slots-display'),
      simHintDisplay: document.getElementById('sim-hint-display'),
      simNoteDisplay: document.getElementById('sim-note-display'),

      // Export Dialog
      exportModal: document.getElementById('export-modal'),
      exportTotalRecords: document.getElementById('export-total-records'),
      exportNewRecords: document.getElementById('export-new-records'),
      exportFilename: document.getElementById('export-filename'),
      btnExportFull: document.getElementById('btn-export-full'),
      btnExportNewOnly: document.getElementById('btn-export-new-only'),
      btnExportBlankTemplate: document.getElementById('btn-export-blank-template'),

      // Confirm Dialog
      confirmModal: document.getElementById('confirm-modal'),
      confirmPromptMessage: document.getElementById('confirm-prompt-message'),
      confirmAcceptBtn: document.getElementById('confirm-accept-btn'),
    };
  }

  /**
   * Dynamically populates copy, titles, and nav docks from APP_CONFIG
   */
  hydrateFromConfig() {
    document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;

    // Render mobile bottom thumb dock
    if (this.dom.bottomDockNavItems) {
      this.dom.bottomDockNavItems.innerHTML = '';
      APP_CONFIG.navigation.items.forEach(item => {
        if (!item.showInBottomBar) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'nav-tab-item';
        btn.setAttribute('data-route-id', item.id);
        btn.innerHTML = `
          <span>${item.label}</span>
          <span class="nav-tab-item__indicator" aria-hidden="true"></span>
        `;
        btn.onclick = () => {
          this.triggerHapticPulse();
          if (item.id === 'nav-welcome') this.switchView('welcome');
          else if (item.id === 'nav-workspace') this.activateWorkspace();
          else if (item.id === 'nav-export') this.openExportModal();
        };
        this.dom.bottomDockNavItems.appendChild(btn);
      });
    }

    this.updateHeaderContent('welcome');
  }

  triggerHapticPulse() {
    if (
      APP_CONFIG.features.enableHapticFeedback &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator
    ) {
      try {
        navigator.vibrate(12);
      } catch (e) {}
    }
  }

  showToast(message) {
    if (!this.dom.toast) return;
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('show');
    setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, APP_CONFIG.specs.toastDurationMs);
  }

  checkForDraftRecovery() {
    const draft = this.state.loadDraft();
    if (draft && draft.length > 0) {
      this.state.puzzles = draft;
      this.showToast(`${APP_CONFIG.content.notifications.draftRestored} (${draft.length} items)`);
      this.activateWorkspace();
    }
  }

  updateHeaderContent(viewName) {
    if (viewName === 'workspace') {
      this.dom.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.workspaceEyebrow;
      this.dom.pageTitleSlot.textContent = APP_CONFIG.content.headers.workspaceTitle;
      this.dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.workspaceSubtitle;
      this.dom.btnGlobalBack.style.display = 'inline-flex';
      this.dom.backNavLabel.textContent = 'Welcome Overview';
    } else {
      this.dom.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.welcomeEyebrow;
      this.dom.pageTitleSlot.textContent = APP_CONFIG.content.headers.welcomeTitle;
      this.dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.welcomeSubtitle;
      this.dom.btnGlobalBack.style.display = 'none';
    }

    // Update bottom dock active state
    const dockButtons = document.querySelectorAll('.nav-tab-item');
    dockButtons.forEach(btn => {
      const routeId = btn.getAttribute('data-route-id');
      const isActive = (viewName === 'workspace' && routeId === 'nav-workspace') ||
                       (viewName === 'welcome' && routeId === 'nav-welcome');
      btn.classList.toggle('nav-tab-item--active', isActive);
    });
  }

  switchView(viewName) {
    this.state.activeView = viewName;
    this.dom.welcomeView.classList.remove('view-active');
    this.dom.workspaceView.classList.remove('view-active');

    if (viewName === 'workspace') {
      this.dom.workspaceView.classList.add('view-active');
      this.updateHeaderContent('workspace');
    } else {
      this.dom.welcomeView.classList.add('view-active');
      this.updateHeaderContent('welcome');
    }
  }

  switchSubView(tabName) {
    const tabs = [this.dom.tabVaultView, this.dom.tabTableView, this.dom.tabTechnicalView];
    const panels = [this.dom.subviewCards, this.dom.subviewTable, this.dom.subviewTechnical];

    tabs.forEach(t => {
      t.classList.remove('tab-pill--active');
      t.setAttribute('aria-selected', 'false');
    });
    panels.forEach(p => p.classList.remove('subview-panel--active'));

    if (tabName === 'cards') {
      this.dom.tabVaultView.classList.add('tab-pill--active');
      this.dom.tabVaultView.setAttribute('aria-selected', 'true');
      this.dom.subviewCards.classList.add('subview-panel--active');
    } else if (tabName === 'table') {
      this.dom.tabTableView.classList.add('tab-pill--active');
      this.dom.tabTableView.setAttribute('aria-selected', 'true');
      this.dom.subviewTable.classList.add('subview-panel--active');
    } else if (tabName === 'technical') {
      this.dom.tabTechnicalView.classList.add('tab-pill--active');
      this.dom.tabTechnicalView.setAttribute('aria-selected', 'true');
      this.dom.subviewTechnical.classList.add('subview-panel--active');
      this.renderTechnicalCsvPreview();
    }
  }

  activateWorkspace() {
    this.switchView('workspace');
    this.dom.headerDraftClearBtn.style.display = 'inline-flex';
    this.dom.datasetStatusPill.className = 'status-pill status-pill--active';
    this.dom.datasetStatusText.textContent = `${this.state.puzzles.length} Vault Puzzles`;
    this.refreshCategoriesDatalist();
    this.renderAllViews();
  }

  resetWorkspace() {
    if (confirm('Start completely over? This clears the working draft from your browser.')) {
      this.state = new CellarState();
      this.state.clearDraft();
      this.dom.headerDraftClearBtn.style.display = 'none';
      this.dom.datasetStatusPill.className = 'status-pill status-pill--idle';
      this.dom.datasetStatusText.textContent = 'Cellar Empty';
      this.switchView('welcome');
      this.showToast(APP_CONFIG.content.notifications.workspaceReset);
    }
  }

  /**
   * ========================================================================
   * CSV INGESTION & PARSING
   * ========================================================================
   */
  async handleFileUpload(file, isAppend = false) {
    if (!file) return;

    try {
      const text = await file.text();
      const rows = CSVEngine.parse(text);

      if (rows.length < 1) {
        throw new Error('The selected CSV file is completely empty.');
      }

      const headerRow = rows[0].map(h => (h || '').trim().toLowerCase());
      const answerIndex = headerRow.indexOf('answer');
      const categoryIndex = headerRow.indexOf('category');
      const clueIndex = headerRow.indexOf('clue');
      const noteIndex = headerRow.indexOf('note');

      if (answerIndex === -1 && headerRow.length < 2) {
        throw new Error('CSV is missing the mandatory "answer" column header.');
      }

      const importedPuzzles = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const rawAnswer = answerIndex >= 0 ? row[answerIndex] : row[1];
        if (!rawAnswer || !rawAnswer.trim()) continue;

        const answer = rawAnswer
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toUpperCase();

        const category = (categoryIndex >= 0 && row[categoryIndex] ? row[categoryIndex] : 'Cocktail Lounge').trim();
        const clue = (clueIndex >= 0 && row[clueIndex] ? row[clueIndex] : '').trim();
        const note = (noteIndex >= 0 && row[noteIndex] ? row[noteIndex] : '').trim();

        importedPuzzles.push({
          category,
          answer,
          clue,
          note,
          isNew: isAppend
        });
      }

      if (importedPuzzles.length === 0) {
        throw new Error('No valid puzzle records found under the CSV headers.');
      }

      if (isAppend && this.state.puzzles.length > 0) {
        this.state.puzzles = [...this.state.puzzles, ...importedPuzzles];
        this.showToast(`Merged ${importedPuzzles.length} records into current ledger`);
      } else {
        this.state.puzzles = importedPuzzles;
        this.showToast(`Loaded ${importedPuzzles.length} puzzles from ${file.name}`);
      }

      this.state.saveDraft();
      this.activateWorkspace();

    } catch (err) {
      alert(`CSV Ingestion Error: ${err.message}`);
    }
  }

  /**
   * ========================================================================
   * RENDERING & METRIC PIPELINE
   * ========================================================================
   */
  renderAllViews() {
    this.updateMetrics();
    this.renderCategoryFilter();
    this.renderCardsView();
    this.renderTableView();
  }

  getFilteredPuzzles() {
    const q = (this.state.activeFilter.search || '').trim().toLowerCase();
    const cat = this.state.activeFilter.category;

    return this.state.puzzles.map((p, index) => ({ ...p, originalIndex: index }))
      .filter(item => {
        const matchCat = (cat === 'ALL' || item.category.toLowerCase() === cat.toLowerCase());
        if (!matchCat) return false;

        if (!q) return true;
        return (
          item.answer.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.clue.toLowerCase().includes(q) ||
          item.note.toLowerCase().includes(q)
        );
      });
  }

  updateMetrics() {
    const total = this.state.puzzles.length;
    const newCount = this.state.puzzles.filter(p => p.isNew).length;
    const categories = this.state.getCategories();

    this.dom.metricTotalCount.textContent = total;
    this.dom.metricNewCount.textContent = newCount;
    this.dom.metricCategoryCount.textContent = categories.length;
    this.dom.metricCycleDays.textContent = total;
    this.dom.tabCountCards.textContent = total;
  }

  renderCategoryFilter() {
    const current = this.state.activeFilter.category;
    const categories = this.state.getCategories();

    this.dom.catalogueCategoryFilter.innerHTML = '<option value="ALL">All Categories</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      if (cat === current) opt.selected = true;
      this.dom.catalogueCategoryFilter.appendChild(opt);
    });
  }

  refreshCategoriesDatalist() {
    const categories = this.state.getCategories();
    this.dom.knownCategoriesList.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      this.dom.knownCategoriesList.appendChild(opt);
    });

    const defaults = ['Cocktails', 'Bar Tools', 'Ingredients', 'Spirits', 'Glassware', 'Technique', 'Agave', 'Whisky', 'Gin', 'History'];
    const mergedPills = Array.from(new Set([...defaults, ...categories])).slice(0, 10);

    this.dom.categoryQuickPills.innerHTML = '';
    mergedPills.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quick-pill interactive-tactile';
      btn.textContent = cat;
      btn.onclick = () => {
        this.triggerHapticPulse();
        this.dom.inputCategory.value = cat;
        this.validateStep1();
      };
      this.dom.categoryQuickPills.appendChild(btn);
    });
  }

  renderCardsView() {
    const container = this.dom.recordsCardsContainer;
    container.innerHTML = '';

    const filtered = this.getFilteredPuzzles();

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="paper-card" style="grid-column: 1 / -1; padding: 48px; text-align: center; color: var(--color-text-secondary);">
          <h3 class="paper-card__title" style="margin-bottom: 6px;">${APP_CONFIG.content.emptyStates.noSearchResultsHeading}</h3>
          <p class="paper-card__description">${APP_CONFIG.content.emptyStates.noSearchResultsDescription}</p>
        </div>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = `paper-card ${p.isNew ? 'is-new-session' : ''}`;
      
      card.innerHTML = `
        <div class="paper-card__header">
          <span class="riddle-index-tag">Vault #${p.originalIndex + 1}</span>
          <span class="paper-card__status-indicator ${p.isNew ? 'paper-card__status-indicator--ochre' : 'paper-card__status-indicator--sage'}">
            <span class="status-dot"></span>
            <span>${p.category || 'Cocktail Lounge'}</span>
          </span>
        </div>

        <h3 class="paper-card__title">${p.answer}</h3>
        <p class="paper-card__description"><strong>💡 Hint:</strong> ${p.clue || '<em>No clue provided</em>'}</p>
        <p class="paper-card__lore"><strong>📜 Lore:</strong> ${p.note || '<em>No lore note provided</em>'}</p>

        <div class="paper-card__footer">
          <span class="riddle-index-tag">${p.isNew ? '★ Session New' : 'Cellar Stock'}</span>
          <div class="paper-card__actions">
            <button type="button" class="interactive-tactile btn-secondary btn-sm" data-action="duplicate" data-index="${p.originalIndex}" title="Duplicate riddle">Copy</button>
            <button type="button" class="interactive-tactile btn-secondary btn-sm" data-action="edit" data-index="${p.originalIndex}" title="Edit riddle">Edit</button>
            <button type="button" class="interactive-tactile btn-danger btn-sm" data-action="delete" data-index="${p.originalIndex}" title="Delete riddle">✕</button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  renderTableView() {
    const tbody = this.dom.curatorTableBody;
    tbody.innerHTML = '';

    const filtered = this.getFilteredPuzzles();

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 32px; color: var(--color-text-secondary);">${APP_CONFIG.content.emptyStates.noSearchResultsHeading}</td></tr>`;
      return;
    }

    filtered.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="riddle-index-tag">${p.originalIndex + 1}</span></td>
        <td><span class="paper-card__status-indicator paper-card__status-indicator--sage">${p.category}</span></td>
        <td class="td-answer">${p.answer}</td>
        <td>${p.clue || '—'}</td>
        <td style="font-style: italic;">${p.note || '—'}</td>
        <td class="td-actions">
          <button type="button" class="interactive-tactile btn-secondary btn-sm" data-action="edit" data-index="${p.originalIndex}">Edit</button>
          <button type="button" class="interactive-tactile btn-danger btn-sm" data-action="delete" data-index="${p.originalIndex}">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  renderTechnicalCsvPreview() {
    const csv = CSVEngine.serialize(this.state.puzzles);
    this.dom.rawCsvPreview.value = csv;
  }

  /**
   * ========================================================================
   * GUIDED STEP-BY-STEP RIDDLE BUILDER MODAL
   * ========================================================================
   */
  openBuilder(indexToEdit = null) {
    this.state.editingIndex = indexToEdit;
    this.state.currentBuilderStep = 1;

    if (indexToEdit !== null && this.state.puzzles[indexToEdit]) {
      const p = this.state.puzzles[indexToEdit];
      this.dom.builderModeEyebrow.textContent = `EDITING PUZZLE #${indexToEdit + 1}`;
      this.dom.builderModalTitle.textContent = `Edit "${p.answer}"`;
      this.dom.inputCategory.value = p.category || '';
      this.dom.inputAnswer.value = p.answer || '';
      this.dom.inputClue.value = p.clue || '';
      this.dom.inputNote.value = p.note || '';
      this.dom.saveAnotherBtn.style.display = 'none';
    } else {
      this.dom.builderModeEyebrow.textContent = 'GUIDED RIDDLE CREATOR';
      this.dom.builderModalTitle.textContent = 'New Cocktail Riddle';
      this.dom.inputCategory.value = '';
      this.dom.inputAnswer.value = '';
      this.dom.inputClue.value = '';
      this.dom.inputNote.value = '';
      this.dom.saveAnotherBtn.style.display = 'inline-flex';
    }

    this.updateStepView(1);
    this.validateStep1();
    this.updateCharCounts();
    this.openDialog(this.dom.builderModal);
  }

  updateStepView(stepNumber) {
    this.state.currentBuilderStep = stepNumber;

    this.dom.stepIndicators.forEach(ind => {
      const step = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.toggle('step-indicator--active', step === stepNumber);
    });

    this.dom.builderStepPanes.forEach(pane => {
      const paneStep = parseInt(pane.getAttribute('data-pane'), 10);
      pane.classList.toggle('pane-active', paneStep === stepNumber);
    });

    this.dom.stepPrevBtn.style.display = stepNumber > 1 ? 'inline-flex' : 'none';
    if (stepNumber === 4) {
      this.dom.stepNextBtn.style.display = 'none';
      this.renderSimulation();
    } else {
      this.dom.stepNextBtn.style.display = 'inline-flex';
    }
  }

  validateStep1() {
    const rawAns = this.dom.inputAnswer.value;
    const normalizedAns = rawAns
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    const cat = this.dom.inputCategory.value.trim();
    const cleanLetters = normalizedAns.replace(/[^A-Z]/g, '');

    let errorMsg = '';
    if (!cat) {
      errorMsg = 'Category is required.';
    } else if (!cleanLetters.length) {
      errorMsg = 'Answer must contain at least one guessable letter (A–Z).';
    } else {
      const duplicateIdx = this.state.puzzles.findIndex((p, idx) => {
        return idx !== this.state.editingIndex && p.answer.toUpperCase() === normalizedAns.trim();
      });
      if (duplicateIdx >= 0) {
        errorMsg = `Notice: "${normalizedAns.trim()}" already exists at Vault #${duplicateIdx + 1}.`;
      }
    }

    const feedback = this.dom.answerValidationFeedback;
    if (errorMsg) {
      feedback.textContent = errorMsg;
      feedback.className = errorMsg.startsWith('Notice') ? 'field-feedback ok' : 'field-feedback err';
    } else {
      feedback.textContent = '✓ Answer silhouette valid for Cocktail Lounge Hangman';
      feedback.className = 'field-feedback ok';
    }

    this.renderMiniSlots(normalizedAns);
    return !errorMsg || errorMsg.startsWith('Notice');
  }

  renderMiniSlots(answer) {
    const container = this.dom.miniSlotsStrip;
    container.innerHTML = '';

    if (!answer) {
      this.dom.slotLetterCount.textContent = '0 Letters';
      this.dom.slotWordCount.textContent = '0 Words';
      return;
    }

    const words = answer.trim().split(' ');
    let letterCount = 0;

    words.forEach(w => {
      const group = document.createElement('div');
      group.className = 'mini-word-group';

      for (let i = 0; i < w.length; i++) {
        const char = w[i];
        const slot = document.createElement('div');
        if (/^[A-Z]$/.test(char)) {
          slot.className = 'mini-slot';
          slot.textContent = char;
          letterCount++;
        } else {
          slot.className = 'mini-slot punct';
          slot.textContent = char;
        }
        group.appendChild(slot);
      }
      container.appendChild(group);
    });

    this.dom.slotLetterCount.textContent = `${letterCount} Hidden Letters`;
    this.dom.slotWordCount.textContent = `${words.length} Word${words.length === 1 ? '' : 's'}`;
  }

  updateCharCounts() {
    this.dom.clueCharCount.textContent = this.dom.inputClue.value.length;
    this.dom.noteCharCount.textContent = this.dom.inputNote.value.length;
  }

  renderSimulation() {
    const ans = this.dom.inputAnswer.value.toUpperCase().trim();
    const cat = this.dom.inputCategory.value.trim() || 'COCKTAILS';
    const clue = this.dom.inputClue.value.trim() || 'No clue provided.';
    const note = this.dom.inputNote.value.trim() || 'No post-game lore note provided.';

    this.dom.simCatDisplay.textContent = cat;
    this.dom.simHintDisplay.textContent = clue;
    this.dom.simNoteDisplay.textContent = note;

    const board = this.dom.simSlotsDisplay;
    board.innerHTML = '';

    const words = ans.split(' ');
    words.forEach(w => {
      const group = document.createElement('div');
      group.className = 'mini-word-group';
      for (let i = 0; i < w.length; i++) {
        const c = w[i];
        const slot = document.createElement('div');
        if (/^[A-Z]$/.test(c)) {
          slot.className = 'mini-slot';
          slot.textContent = '_';
        } else {
          slot.className = 'mini-slot punct';
          slot.textContent = c;
        }
        group.appendChild(slot);
      }
      board.appendChild(group);
    });
  }

  saveCurrentRecord(keepOpenForAnother = false) {
    if (!this.validateStep1()) {
      this.updateStepView(1);
      this.dom.inputAnswer.focus();
      return;
    }

    const answer = this.dom.inputAnswer.value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();

    const category = this.dom.inputCategory.value.trim() || 'Cocktails';
    const clue = this.dom.inputClue.value.trim();
    const note = this.dom.inputNote.value.trim();

    const newRecord = {
      category,
      answer,
      clue,
      note,
      isNew: true
    };

    if (this.state.editingIndex !== null) {
      const origNew = this.state.puzzles[this.state.editingIndex]?.isNew;
      newRecord.isNew = origNew !== undefined ? origNew : false;
      this.state.puzzles[this.state.editingIndex] = newRecord;
      this.showToast(`Updated "${answer}"`);
    } else {
      this.state.puzzles.push(newRecord);
      this.showToast(APP_CONFIG.content.notifications.riddleSaved);
    }

    this.state.saveDraft();
    this.renderAllViews();

    if (keepOpenForAnother) {
      this.dom.inputAnswer.value = '';
      this.dom.inputClue.value = '';
      this.dom.inputNote.value = '';
      this.updateStepView(1);
      this.validateStep1();
      this.dom.inputAnswer.focus();
    } else {
      this.closeDialog(this.dom.builderModal);
    }
  }

  deleteRecord(index) {
    const p = this.state.puzzles[index];
    if (!p) return;

    this.dom.confirmPromptMessage.textContent = `Are you sure you wish to permanently delete "${p.answer}" from the cellar?`;
    this.dom.confirmAcceptBtn.onclick = () => {
      this.triggerHapticPulse();
      this.state.puzzles.splice(index, 1);
      this.state.saveDraft();
      this.renderAllViews();
      this.closeDialog(this.dom.confirmModal);
      this.showToast(APP_CONFIG.content.notifications.riddleDeleted);
    };
    this.openDialog(this.dom.confirmModal);
  }

  duplicateRecord(index) {
    const orig = this.state.puzzles[index];
    if (!orig) return;

    const copy = {
      ...orig,
      answer: `${orig.answer} (COPY)`,
      isNew: true
    };

    this.state.puzzles.splice(index + 1, 0, copy);
    this.state.saveDraft();
    this.renderAllViews();
    this.showToast(APP_CONFIG.content.notifications.riddleDuplicated);
  }

  /**
   * ========================================================================
   * EXPORT PIPELINE
   * ========================================================================
   */
  openExportModal() {
    const total = this.state.puzzles.length;
    const newCount = this.state.puzzles.filter(p => p.isNew).length;

    this.dom.exportTotalRecords.textContent = `${total} puzzles`;
    this.dom.exportNewRecords.textContent = `${newCount} puzzles`;
    this.openDialog(this.dom.exportModal);
  }

  triggerDownload(csvContent, filename) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast(APP_CONFIG.content.notifications.csvExported);
    this.closeDialog(this.dom.exportModal);
  }

  exportFullDataset() {
    const fname = this.dom.exportFilename.value.trim() || APP_CONFIG.specs.defaultFileName;
    const csv = CSVEngine.serialize(this.state.puzzles);
    this.triggerDownload(csv, fname);
  }

  exportNewOnly() {
    const fname = `${(this.dom.exportFilename.value.trim() || 'puzzles')}_session_new.csv`;
    const newItems = this.state.puzzles.filter(p => p.isNew);
    if (newItems.length === 0) {
      alert('There are no newly created session items in this catalogue.');
      return;
    }
    const csv = CSVEngine.serialize(newItems);
    this.triggerDownload(csv, fname);
  }

  exportBlankTemplate() {
    const csv = CSVEngine.serialize([]);
    this.triggerDownload(csv, 'puzzles_template.csv');
  }

  /**
   * ========================================================================
   * DIALOG HELPERS
   * ========================================================================
   */
  openDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', 'true');
    }
  }

  closeDialog(dialog) {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  /**
   * ========================================================================
   * EVENT BINDINGS
   * ========================================================================
   */
  bindEvents() {
    // Standard Back Navigation
    this.dom.btnGlobalBack.onclick = () => {
      this.triggerHapticPulse();
      this.switchView('welcome');
    };

    // Welcome Choices
    this.dom.fileUploadAppend.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this.handleFileUpload(file, true);
      e.target.value = '';
    };

    this.dom.fileUploadReview.onchange = (e) => {
      const file = e.target.files[0];
      if (file) this.handleFileUpload(file, false);
      e.target.value = '';
    };

    this.dom.choiceCreateBtn.onclick = () => {
      this.triggerHapticPulse();
      this.state.puzzles = [...APP_CONFIG.specs.seedCellarPuzzles];
      this.state.saveDraft();
      this.showToast('Started fresh dataset with cocktail seed puzzles');
      this.activateWorkspace();
    };

    this.dom.headerDraftClearBtn.onclick = () => {
      this.triggerHapticPulse();
      this.resetWorkspace();
    };

    // Workspace Actions
    this.dom.toolbarNewRecordBtn.onclick = () => {
      this.triggerHapticPulse();
      this.openBuilder(null);
    };

    this.dom.toolbarExportBtn.onclick = () => {
      this.triggerHapticPulse();
      this.openExportModal();
    };

    this.dom.catalogueSearchInput.oninput = (e) => {
      this.state.activeFilter.search = e.target.value;
      this.renderCardsView();
      this.renderTableView();
    };

    this.dom.catalogueCategoryFilter.onchange = (e) => {
      this.state.activeFilter.category = e.target.value;
      this.renderCardsView();
      this.renderTableView();
    };

    this.dom.btnQuickImport.onclick = () => {
      this.triggerHapticPulse();
      this.dom.fileUploadAppend.click();
    };

    // Subview Tabs
    this.dom.tabVaultView.onclick = () => {
      this.triggerHapticPulse();
      this.switchSubView('cards');
    };
    this.dom.tabTableView.onclick = () => {
      this.triggerHapticPulse();
      this.switchSubView('table');
    };
    this.dom.tabTechnicalView.onclick = () => {
      this.triggerHapticPulse();
      this.switchSubView('technical');
    };

    this.dom.btnCopyRawCsv.onclick = async () => {
      this.triggerHapticPulse();
      try {
        await navigator.clipboard.writeText(this.dom.rawCsvPreview.value);
        this.showToast(APP_CONFIG.content.notifications.csvCopied);
      } catch (err) {
        this.dom.rawCsvPreview.select();
        document.execCommand('copy');
        this.showToast(APP_CONFIG.content.notifications.csvCopied);
      }
    };

    // Record Card & Table Action Delegation
    const handleActionClick = (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      this.triggerHapticPulse();
      const action = btn.getAttribute('data-action');
      const index = parseInt(btn.getAttribute('data-index'), 10);
      if (isNaN(index)) return;

      if (action === 'edit') this.openBuilder(index);
      else if (action === 'delete') this.deleteRecord(index);
      else if (action === 'duplicate') this.duplicateRecord(index);
    };

    this.dom.recordsCardsContainer.onclick = handleActionClick;
    this.dom.curatorTableBody.onclick = handleActionClick;

    // Builder Stepper
    this.dom.stepIndicators.forEach(btn => {
      btn.onclick = () => {
        this.triggerHapticPulse();
        const step = parseInt(btn.getAttribute('data-step'), 10);
        this.updateStepView(step);
      };
    });

    this.dom.stepPrevBtn.onclick = () => {
      this.triggerHapticPulse();
      if (this.state.currentBuilderStep > 1) {
        this.updateStepView(this.state.currentBuilderStep - 1);
      }
    };

    this.dom.stepNextBtn.onclick = () => {
      this.triggerHapticPulse();
      if (this.state.currentBuilderStep === 1 && !this.validateStep1()) return;
      if (this.state.currentBuilderStep < 4) {
        this.updateStepView(this.state.currentBuilderStep + 1);
      }
    };

    this.dom.inputAnswer.oninput = () => this.validateStep1();
    this.dom.inputCategory.oninput = () => this.validateStep1();
    this.dom.inputClue.oninput = () => this.updateCharCounts();
    this.dom.inputNote.oninput = () => this.updateCharCounts();

    // Template Inspirations
    document.querySelectorAll('[data-tpl-clue]').forEach(btn => {
      btn.onclick = () => {
        this.triggerHapticPulse();
        this.dom.inputClue.value = btn.getAttribute('data-tpl-clue');
        this.updateCharCounts();
      };
    });

    this.dom.saveRecordBtn.onclick = () => {
      this.triggerHapticPulse();
      this.saveCurrentRecord(false);
    };

    this.dom.saveAnotherBtn.onclick = () => {
      this.triggerHapticPulse();
      this.saveCurrentRecord(true);
    };

    this.dom.builderModalClose.onclick = () => {
      this.closeDialog(this.dom.builderModal);
    };

    // Export Options
    this.dom.btnExportFull.onclick = () => {
      this.triggerHapticPulse();
      this.exportFullDataset();
    };
    this.dom.btnExportNewOnly.onclick = () => {
      this.triggerHapticPulse();
      this.exportNewOnly();
    };
    this.dom.btnExportBlankTemplate.onclick = () => {
      this.triggerHapticPulse();
      this.exportBlankTemplate();
    };

    // Dialog Closers
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.onclick = (e) => {
        this.closeDialog(e.target.closest('dialog'));
      };
    });

    document.querySelectorAll('dialog').forEach(d => {
      d.onclick = (e) => {
        if (e.target === d) this.closeDialog(d);
      };
    });
  }
}

// Bootstrap on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  new CuratorStudioApp();
});