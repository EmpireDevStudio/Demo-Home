/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application identity, copy, endpoints, toggles & defaults live here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  // 1. APPLICATION IDENTITY & METADATA
  identity: {
    appId: "connections-puzzle-studio",
    appName: "Connections Studio",
    appTagline: "Artisanal Association Architect & RFC-4180 CSV Engine",
    version: "3.0.0",
    environment: "production",
    canonicalUrl: "https://studio.connectionsledger.com",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-seal.svg",
    logoAlt: "Connections Studio Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#963E35",       // Accessible Terracotta
    accentSecondary: "#3E5B42",   // Accessible Sage
    accentHighlight: "#6E5614",   // Accessible Ochre
    fontFamilyBase: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "start",
    items: [
      { id: "editor", label: "Editor", icon: "icon-editor", route: "#editor", enabled: true, showInBottomBar: true },
      { id: "inventory", label: "Catalog", icon: "icon-catalog", route: "#inventory", enabled: true, showInBottomBar: true },
      { id: "preview", label: "Ledger", icon: "icon-preview", route: "#preview", enabled: true, showInBottomBar: true },
      { id: "export", label: "Export", icon: "icon-export", route: "#export", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultEyebrow: "PUZZLE ARCHITECT",
      defaultTitle: "Connections Studio",
      defaultSubtitle: "Design 4-tier semantic association puzzles with strict uniqueness validation and RFC-4180 CSV compliance.",
    },
    emptyStates: {
      noDataHeading: "No Puzzle Records in Catalog",
      noDataDescription: "Your editorial ledger is currently empty. Initiate a new puzzle with the editor or import an archive CSV file.",
      noSearchResultsHeading: "No Matching Puzzles Found",
      noSearchResultsDescription: "No catalog entries match your query. Adjust your filter keywords or search across categories.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Puzzle to Catalog",
      delete: "Remove Permanently",
      retry: "Retry Operation",
      back: "Overview",
    },
    notifications: {
      saveSuccess: "Puzzle successfully committed to catalog.",
      saveError: "Unable to commit puzzle. Please resolve duplicate words or missing items.",
      deleteSuccess: "Puzzle entry permanently removed from workspace.",
      importSuccess: "Imported records successfully.",
      copySuccess: "RFC-4180 CSV copied to clipboard.",
      sampleSuccess: "Curated inspiration templates loaded.",
    },
    legal: {
      copyrightHolder: "Connections Studio Editorial Systems",
      establishedYear: 2026,
      privacyPolicyUrl: "https://studio.connectionsledger.com/privacy",
      termsOfServiceUrl: "https://studio.connectionsledger.com/terms",
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "concierge@connectionsledger.com",
    supportDeskUrl: "https://support.connectionsledger.com",
    emergencyContactPhone: "+1 (800) 555-0144",
    operatingHours: "Monday – Friday, 08:00 – 18:00 EST",
    socialLinks: {
      documentation: "https://docs.connectionsledger.com",
      statusPage: "https://status.connectionsledger.com",
    },
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // 12ms micro-vibrate on mobile touches
    enableSmoothPageTransitions: true, // Fluid view transitions
    enableAutoSave: true,               // Automatic persistence
    autoSaveIntervalMs: 4000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,
  },

  // 7. API ENDPOINTS & STORAGE
  endpoints: {
    apiBaseUrl: "https://api.connectionsledger.com/v1",
    syncEndpoint: "/sync",
    telemetryEndpoint: "/telemetry",
    storageKeys: {
      state: "connections_studio_state_v2",
      userPreferences: "connections_user_prefs",
    },
  },

  // 8. DEFAULT SCHEMA & REFERENCE BLUEPRINTS
  schema: {
    expectedHeaders: ['cat1', 'words1', 'cat2', 'words2', 'cat3', 'words3', 'cat4', 'words4'],
    defaultExportFilename: 'puzzles.csv',
    sampleDataset: [
      {
        cat1: 'BAR STRAINERS',
        words1: 'CHINOIS, FINE, HAWTHORNE, JULEP',
        cat2: 'CARBONATED COCKTAIL FAMILIES',
        words2: 'BUCK, COLLINS, FIZZ, RICKEY',
        cat3: 'ORANGE LIQUEURS',
        words3: 'COINTREAU, CURACAO, GRAND MARNIER, TRIPLE SEC',
        cat4: 'MARTINI MODIFIERS',
        words4: 'DIRTY, DRY, PERFECT, WET'
      },
      {
        cat1: 'ANISE-FLAVORED SPIRITS',
        words1: 'ABSINTHE, OUZO, PASTIS, SAMBUCA',
        cat2: 'COCKTAIL ICE FORMATS',
        words2: 'CRACKED, CRUSHED, PEBBLE, SPHERE',
        cat3: 'PREPARATION TECHNIQUES',
        words3: 'BUILD, MUDDLE, SHAKE, STIR',
        cat4: 'CLASSIC COCKTAILS NAMED AFTER US LOCATIONS',
        words4: 'ALASKA, BRONX, BROOKLYN, MANHATTAN'
      },
      {
        cat1: 'CLASSIC COCKTAILS WITH CHARTREUSE',
        words1: 'BIJOU, CHAMPS-ELYSEES, LAST WORD, TIPPERARY',
        cat2: 'CLASSIC COCKTAILS WITH MARASCHINO',
        words2: 'AVIATION, CASINO, MARTINEZ, MARY PICKFORD',
        cat3: 'STEMMED COCKTAIL GLASSWARE',
        words3: 'COUPE, FLUTE, GOBLET, NICK & NORA',
        cat4: 'BAR DISPENSING TOOLS',
        words4: 'ATOMIZER, DROPPER, JIGGER, POURER'
      }
    ],
    inspirationTemplates: [
      {
        cat1: 'CITRUS PEEL GARNISHES',
        words1: ['COIN', 'TWIST', 'WEDGE', 'WHEEL'],
        cat2: 'REGIONAL WHISKEY STYLES',
        words2: ['CANADIAN', 'IRISH', 'JAPANESE', 'SCOTCH'],
        cat3: 'NATURAL COCKTAIL SWEETENERS',
        words3: ['AGAVE', 'HONEY', 'MAPLE', 'MOLASSES'],
        cat4: 'COFFEE-FORWARD COCKTAILS',
        words4: ['BLACK RUSSIAN', 'ESPRESSO MARTINI', 'REVOLVER', 'WHITE RUSSIAN']
      },
      {
        cat1: 'TRADITIONAL BAR AGITATION',
        words1: ['CHURN', 'ROLL', 'SWIZZLE', 'THROW'],
        cat2: 'LONDON DRY BOTANICALS',
        words2: ['ANGELICA', 'CORIANDER', 'JUNIPER', 'ORRIS'],
        cat3: 'MEXICAN AGAVE SPIRITS',
        words3: ['BACANORA', 'MEZCAL', 'RAICILLA', 'TEQUILA'],
        cat4: "WORDS PRECEDING 'SOUR'",
        words4: ['AMARETTO', 'BOSTON', 'NEW YORK', 'PISCO']
      }
    ]
  }
});

/**
 * =========================================================================
 * CORE ENGINE IMPLEMENTATION
 * =========================================================================
 */
(function () {
  'use strict';

  // State Management
  let catalog = [];
  let editingPuzzleId = null;
  let simShuffleOrder = [];
  let pendingConfirmAction = null;
  let activeView = 'start'; // 'start' | 'workspace'
  let activeTab = 'tab-editor'; // 'tab-editor' | 'tab-inventory' | 'tab-preview'

  // Micro-Haptic Generator (Part 4.2)
  function triggerHapticPulse() {
    if (
      APP_CONFIG.features.enableHapticFeedback &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator
    ) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Silently handled on secure context restrictions
      }
    }
  }

  function generateId() {
    return 'puz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  }

  // Persistence
  function saveStateToStorage() {
    try {
      const payload = {
        catalog,
        timestamp: Date.now()
      };
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.state, JSON.stringify(payload));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  function loadStateFromStorage() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.state);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.catalog)) {
          catalog = parsed.catalog;
          return true;
        }
      }
    } catch (e) {
      console.warn('Storage load error:', e);
    }
    return false;
  }

  // RFC-4180 Compliant CSV Parser & Serializer
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += c;
        }
      } else {
        if (c === '"') {
          inQuotes = true;
        } else if (c === ',') {
          row.push(cell.trim());
          cell = '';
        } else if (c === '\n' || c === '\r') {
          row.push(cell.trim());
          if (row.some(val => val !== '')) {
            rows.push(row);
          }
          row = [];
          cell = '';
          if (c === '\r' && text[i + 1] === '\n') {
            i++;
          }
        } else {
          cell += c;
        }
      }
    }
    if (cell !== '' || row.length > 0) {
      row.push(cell.trim());
      if (row.some(val => val !== '')) {
        rows.push(row);
      }
    }
    return rows;
  }

  function escapeCSVCell(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  function serializeToCSV(puzzleList) {
    const headers = [...APP_CONFIG.schema.expectedHeaders];
    const lines = [headers.join(',')];

    puzzleList.forEach(p => {
      const row = [
        escapeCSVCell(p.cat1),
        escapeCSVCell(p.words1),
        escapeCSVCell(p.cat2),
        escapeCSVCell(p.words2),
        escapeCSVCell(p.cat3),
        escapeCSVCell(p.words3),
        escapeCSVCell(p.cat4),
        escapeCSVCell(p.words4)
      ];
      lines.push(row.join(','));
    });

    return lines.join('\n');
  }

  function ingestCSVRows(rows, markAsNew = false) {
    if (!Array.isArray(rows) || rows.length < 2) return 0;

    let headerOffset = 1;
    const headerRow = rows[0].map(h => (h || '').toLowerCase().trim());
    if (headerRow.length >= 8 && headerRow[0].startsWith('cat')) {
      headerOffset = 0;
    }

    let addedCount = 0;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < headerOffset + 8) continue;

      const puz = {
        id: generateId(),
        cat1: (r[headerOffset] || '').trim(),
        words1: (r[headerOffset + 1] || '').trim(),
        cat2: (r[headerOffset + 2] || '').trim(),
        words2: (r[headerOffset + 3] || '').trim(),
        cat3: (r[headerOffset + 4] || '').trim(),
        words3: (r[headerOffset + 5] || '').trim(),
        cat4: (r[headerOffset + 6] || '').trim(),
        words4: (r[headerOffset + 7] || '').trim(),
        isSessionNew: markAsNew
      };

      if (puz.cat1 && puz.words1 && puz.cat2 && puz.words2 && puz.cat3 && puz.words3 && puz.cat4 && puz.words4) {
        catalog.push(puz);
        addedCount++;
      }
    }

    saveStateToStorage();
    return addedCount;
  }

  // DOM Selection Cache
  const dom = {
    toast: document.getElementById('toast'),
    sessionCountBadge: document.getElementById('session-count-badge'),
    btnQuickExport: document.getElementById('btn-quick-export'),
    btnHeaderBack: document.getElementById('btnHeaderBack'),
    headerBackLabel: document.getElementById('headerBackLabel'),

    // Headers slots
    pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
    pageTitleSlot: document.getElementById('pageTitleSlot'),
    pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),

    // Views
    viewStart: document.getElementById('view-start'),
    viewWorkspace: document.getElementById('view-workspace'),

    // Start Actions
    inputFileAppend: document.getElementById('input-file-append'),
    inputFileReview: document.getElementById('input-file-review'),
    btnStartFresh: document.getElementById('btn-start-fresh'),
    btnLoadSample: document.getElementById('btn-load-sample'),
    btnDownloadTemplate: document.getElementById('btn-download-template'),

    // Desktop Nav
    navBtnEditor: document.getElementById('nav-btn-editor'),
    navBtnInventory: document.getElementById('nav-btn-inventory'),
    navBtnPreview: document.getElementById('nav-btn-preview'),
    tabEditorLabel: document.getElementById('tab-editor-label'),
    inventoryCount: document.getElementById('inventory-count'),
    btnOpenExportModal: document.getElementById('btn-open-export-modal'),

    // Tabs
    tabEditor: document.getElementById('tab-editor'),
    tabInventory: document.getElementById('tab-inventory'),
    tabPreview: document.getElementById('tab-preview'),

    // Form
    puzzleForm: document.getElementById('puzzle-form'),
    checkUppercase: document.getElementById('check-uppercase'),
    btnCancelEdit: document.getElementById('btn-cancel-edit'),
    btnSavePuzzle: document.getElementById('btn-save-puzzle'),
    saveBtnText: document.getElementById('save-btn-text'),
    btnRandomSample: document.getElementById('btn-random-sample'),
    btnClearForm: document.getElementById('btn-clear-form'),

    // Indicators
    indWords: document.getElementById('ind-words'),
    indDupes: document.getElementById('ind-dupes'),
    indCategories: document.getElementById('ind-categories'),

    // Simulation
    simGrid: document.getElementById('sim-grid'),
    simSolvedStack: document.getElementById('sim-solved-stack'),
    btnShuffleSim: document.getElementById('btn-shuffle-sim'),

    // Catalog
    inventorySearch: document.getElementById('inventory-search'),
    catalogCardList: document.getElementById('catalog-card-list'),
    btnNewFromCatalog: document.getElementById('btn-new-from-catalog'),

    // Preview
    btnViewTable: document.getElementById('btn-view-table'),
    btnViewRaw: document.getElementById('btn-view-raw'),
    btnCopyCsv: document.getElementById('btn-copy-csv'),
    csvTableWrapper: document.getElementById('csv-table-wrapper'),
    csvTableBody: document.getElementById('csv-table-body'),
    csvRawWrapper: document.getElementById('csv-raw-wrapper'),
    csvRawCode: document.getElementById('csv-raw-code'),

    // Modals
    modalExport: document.getElementById('modal-export'),
    exportTotalCount: document.getElementById('export-total-count'),
    exportNewCount: document.getElementById('export-new-count'),
    exportFilename: document.getElementById('export-filename'),
    btnDownloadAll: document.getElementById('btn-download-all'),
    btnDownloadSessionOnly: document.getElementById('btn-download-session-only'),

    modalConfirm: document.getElementById('modal-confirm'),
    confirmMsg: document.getElementById('confirm-msg'),
    btnConfirmYes: document.getElementById('btn-confirm-yes'),
    btnConfirmNo: document.getElementById('btn-confirm-no'),

    // Bottom Navigation Dock
    bottomDock: document.getElementById('bottomDockNavItems')
  };

  const formFields = {
    cat1: {
      name: document.getElementById('input-cat1-name'),
      words: [
        document.getElementById('input-cat1-w1'),
        document.getElementById('input-cat1-w2'),
        document.getElementById('input-cat1-w3'),
        document.getElementById('input-cat1-w4')
      ]
    },
    cat2: {
      name: document.getElementById('input-cat2-name'),
      words: [
        document.getElementById('input-cat2-w1'),
        document.getElementById('input-cat2-w2'),
        document.getElementById('input-cat2-w3'),
        document.getElementById('input-cat2-w4')
      ]
    },
    cat3: {
      name: document.getElementById('input-cat3-name'),
      words: [
        document.getElementById('input-cat3-w1'),
        document.getElementById('input-cat3-w2'),
        document.getElementById('input-cat3-w3'),
        document.getElementById('input-cat3-w4')
      ]
    },
    cat4: {
      name: document.getElementById('input-cat4-name'),
      words: [
        document.getElementById('input-cat4-w1'),
        document.getElementById('input-cat4-w2'),
        document.getElementById('input-cat4-w3'),
        document.getElementById('input-cat4-w4')
      ]
    }
  };

  // Toast System
  let toastTimer = null;
  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.classList.add('hidden');
    }, 2500);
  }

  function escapeHTML(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function downloadFile(content, filename, mime = 'text/csv;charset=utf-8;') {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || APP_CONFIG.schema.defaultExportFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function openConfirm(msg, onConfirm) {
    dom.confirmMsg.textContent = msg;
    pendingConfirmAction = onConfirm;
    dom.modalConfirm.classList.remove('hidden');
    dom.modalConfirm.focus();
  }

  function closeModals() {
    dom.modalExport.classList.add('hidden');
    dom.modalConfirm.classList.add('hidden');
    pendingConfirmAction = null;
  }

  // Synchronize dynamic headers & badges
  function updateBadges() {
    const total = catalog.length;
    dom.sessionCountBadge.textContent = `${total} ${total === 1 ? 'Puzzle' : 'Puzzles'}`;
    dom.inventoryCount.textContent = total;
    dom.exportTotalCount.textContent = total;

    const sessionCount = catalog.filter(p => p.isSessionNew).length;
    dom.exportNewCount.textContent = sessionCount;
  }

  function setView(viewName) {
    activeView = viewName;
    if (viewName === 'start') {
      dom.viewStart.classList.remove('hidden');
      dom.viewWorkspace.classList.add('hidden');
      dom.headerBackLabel.textContent = "Start";
      dom.pageEyebrowSlot.textContent = "DATASET INITIALIZATION";
      dom.pageTitleSlot.textContent = APP_CONFIG.identity.appName;
      dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
    } else {
      dom.viewStart.classList.add('hidden');
      dom.viewWorkspace.classList.remove('hidden');
      dom.headerBackLabel.textContent = "Overview";
      syncTabHeaders();
    }
    updateBadges();
  }

  function syncTabHeaders() {
    if (activeTab === 'tab-editor') {
      dom.pageEyebrowSlot.textContent = editingPuzzleId ? "REVISION STUDIO" : "NEW COMPOSITION";
      dom.pageTitleSlot.textContent = editingPuzzleId ? "Edit Daily Puzzle" : "Puzzle Architect";
      dom.pageSubtitleSlot.textContent = "Compose 4 categories of exactly 4 unique words each (16 items total).";
    } else if (activeTab === 'tab-inventory') {
      dom.pageEyebrowSlot.textContent = "ARCHIVE REGISTRY";
      dom.pageTitleSlot.textContent = "Catalog Ledger";
      dom.pageSubtitleSlot.textContent = "Search, review, duplicate, and curate all operational puzzles.";
    } else if (activeTab === 'tab-preview') {
      dom.pageEyebrowSlot.textContent = "RFC-4180 COMPLIANCE";
      dom.pageTitleSlot.textContent = "CSV Ledger Source";
      dom.pageSubtitleSlot.textContent = "Exact 8-column invariant structure ready for production deployment.";
    }
  }

  function switchTab(tabId) {
    activeTab = tabId;
    const tabBtns = [dom.navBtnEditor, dom.navBtnInventory, dom.navBtnPreview];
    const tabContents = [dom.tabEditor, dom.tabInventory, dom.tabPreview];

    tabBtns.forEach(btn => {
      const match = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('tab-chip--active', match);
    });

    tabContents.forEach(c => {
      c.classList.toggle('tab-content--active', c.id === tabId);
    });

    // Synchronize bottom dock
    const route = tabId.replace('tab-', '');
    document.querySelectorAll('.app-bottom-dock .nav-tab-item').forEach(item => {
      item.classList.toggle('nav-tab-item--active', item.getAttribute('data-route') === route);
    });

    syncTabHeaders();

    if (tabId === 'tab-inventory') {
      renderCatalogList();
    } else if (tabId === 'tab-preview') {
      renderCSVPreview();
    } else if (tabId === 'tab-editor') {
      updateLiveSim();
    }
  }

  // Form Engine
  function getFormData() {
    const autoUpper = dom.checkUppercase.checked;
    const sanitize = str => {
      const val = (str || '').trim();
      return autoUpper ? val.toUpperCase() : val;
    };

    return {
      cat1: sanitize(formFields.cat1.name.value),
      words1: formFields.cat1.words.map(i => sanitize(i.value)).join(', '),
      cat2: sanitize(formFields.cat2.name.value),
      words2: formFields.cat2.words.map(i => sanitize(i.value)).join(', '),
      cat3: sanitize(formFields.cat3.name.value),
      words3: formFields.cat3.words.map(i => sanitize(i.value)).join(', '),
      cat4: sanitize(formFields.cat4.name.value),
      words4: formFields.cat4.words.map(i => sanitize(i.value)).join(', ')
    };
  }

  function setFormData(data) {
    formFields.cat1.name.value = data.cat1 || '';
    const w1 = (data.words1 || '').split(/[,;]/).map(w => w.trim());
    formFields.cat1.words.forEach((inp, idx) => inp.value = w1[idx] || '');

    formFields.cat2.name.value = data.cat2 || '';
    const w2 = (data.words2 || '').split(/[,;]/).map(w => w.trim());
    formFields.cat2.words.forEach((inp, idx) => inp.value = w2[idx] || '');

    formFields.cat3.name.value = data.cat3 || '';
    const w3 = (data.words3 || '').split(/[,;]/).map(w => w.trim());
    formFields.cat3.words.forEach((inp, idx) => inp.value = w3[idx] || '');

    formFields.cat4.name.value = data.cat4 || '';
    const w4 = (data.words4 || '').split(/[,;]/).map(w => w.trim());
    formFields.cat4.words.forEach((inp, idx) => inp.value = w4[idx] || '');

    validateLiveForm();
    updateLiveSim();
  }

  function clearForm() {
    editingPuzzleId = null;
    dom.tabEditorLabel.textContent = 'Editor';
    dom.saveBtnText.textContent = APP_CONFIG.content.actions.save;
    dom.btnCancelEdit.classList.add('hidden');

    Object.values(formFields).forEach(cat => {
      cat.name.value = '';
      cat.words.forEach(input => {
        input.value = '';
        input.classList.remove('field-error');
      });
    });

    validateLiveForm();
    updateLiveSim();
    syncTabHeaders();
  }

  function validateLiveForm() {
    const allInputs = [];
    const allWords = [];
    const titles = [
      formFields.cat1.name.value.trim(),
      formFields.cat2.name.value.trim(),
      formFields.cat3.name.value.trim(),
      formFields.cat4.name.value.trim()
    ].filter(Boolean);

    for (let c = 1; c <= 4; c++) {
      formFields[`cat${c}`].words.forEach(input => {
        const val = input.value.trim();
        allInputs.push(input);
        if (val) allWords.push(val.toUpperCase());
      });
    }

    // Word Counter
    dom.indWords.textContent = `${allWords.length} / 16 Words`;
    dom.indWords.className = 'meter-pill ' + (allWords.length === 16 ? 'ok' : '');

    // Title Counter
    dom.indCategories.textContent = `${titles.length} / 4 Titles`;
    dom.indCategories.className = 'meter-pill ' + (titles.length === 4 ? 'ok' : '');

    // Uniqueness Analysis
    const seen = new Set();
    const dupes = new Set();
    allWords.forEach(w => {
      if (seen.has(w)) dupes.add(w);
      seen.add(w);
    });

    allInputs.forEach(inp => {
      const val = inp.value.trim().toUpperCase();
      if (val && dupes.has(val)) {
        inp.classList.add('field-error');
      } else {
        inp.classList.remove('field-error');
      }
    });

    if (dupes.size > 0) {
      dom.indDupes.textContent = `${dupes.size} Duplicate Word${dupes.size > 1 ? 's' : ''}`;
      dom.indDupes.className = 'meter-pill error';
    } else {
      dom.indDupes.textContent = 'No Duplicates';
      dom.indDupes.className = 'meter-pill ' + (allWords.length > 0 ? 'ok' : '');
    }

    return {
      isValid: allWords.length === 16 && dupes.size === 0 && titles.length === 4,
      wordCount: allWords.length,
      dupeCount: dupes.size,
      titleCount: titles.length
    };
  }

  function updateLiveSim() {
    const wordsWithCat = [];
    for (let c = 1; c <= 4; c++) {
      formFields[`cat${c}`].words.forEach((input, i) => {
        const text = input.value.trim();
        wordsWithCat.push({
          word: text || `Item ${c}.${i + 1}`,
          level: c,
          isEmpty: !text
        });
      });
    }

    if (simShuffleOrder.length !== 16) {
      simShuffleOrder = Array.from({ length: 16 }, (_, i) => i);
    }

    dom.simGrid.innerHTML = '';
    simShuffleOrder.forEach(idx => {
      const item = wordsWithCat[idx] || { word: '...', isEmpty: true };
      const tile = document.createElement('div');
      tile.className = 'sim-tile' + (item.isEmpty ? ' empty' : '');
      tile.textContent = item.word;
      dom.simGrid.appendChild(tile);
    });

    dom.simSolvedStack.innerHTML = '';
    let hasAnyBanner = false;

    for (let c = 1; c <= 4; c++) {
      const name = formFields[`cat${c}`].name.value.trim();
      const items = formFields[`cat${c}`].words.map(w => w.value.trim()).filter(Boolean);

      if (name || items.length > 0) {
        hasAnyBanner = true;
        const banner = document.createElement('div');
        banner.className = `solved-banner cat-${c}`;
        banner.innerHTML = `
          <span class="banner-name">${escapeHTML(name || `Level ${c} Group`)}</span>
          <span class="banner-items">${items.map(escapeHTML).join(', ') || 'No words entered yet'}</span>
        `;
        dom.simSolvedStack.appendChild(banner);
      }
    }

    if (!hasAnyBanner) {
      dom.simSolvedStack.innerHTML = `<div class="sim-empty-state">Complete categories to inspect physical solved cardstock banners.</div>`;
    }
  }

  function shuffleSimTiles() {
    triggerHapticPulse();
    for (let i = simShuffleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [simShuffleOrder[i], simShuffleOrder[j]] = [simShuffleOrder[j], simShuffleOrder[i]];
    }
    updateLiveSim();
  }

  // Catalog Renderer
  function renderCatalogList() {
    const query = dom.inventorySearch.value.trim().toLowerCase();
    dom.catalogCardList.innerHTML = '';

    if (catalog.length === 0) {
      dom.catalogCardList.innerHTML = `
        <div class="paper-card" style="text-align: center; padding: var(--space-8);">
          <h3 class="paper-card__title">${escapeHTML(APP_CONFIG.content.emptyStates.noDataHeading)}</h3>
          <p class="paper-card__description">${escapeHTML(APP_CONFIG.content.emptyStates.noDataDescription)}</p>
        </div>
      `;
      return;
    }

    const filtered = catalog.filter(p => {
      if (!query) return true;
      const haystack = [
        p.cat1, p.words1,
        p.cat2, p.words2,
        p.cat3, p.words3,
        p.cat4, p.words4
      ].join(' ').toLowerCase();
      return haystack.includes(query);
    });

    if (filtered.length === 0) {
      dom.catalogCardList.innerHTML = `
        <div class="paper-card" style="text-align: center; padding: var(--space-6);">
          <h3 class="paper-card__title">${escapeHTML(APP_CONFIG.content.emptyStates.noSearchResultsHeading)}</h3>
          <p class="paper-card__description">${escapeHTML(APP_CONFIG.content.emptyStates.noSearchResultsDescription)}</p>
        </div>
      `;
      return;
    }

    filtered.forEach((puzzle) => {
      const realIndex = catalog.indexOf(puzzle) + 1;
      const card = document.createElement('article');
      card.className = 'paper-card catalog-puzzle-card';

      card.innerHTML = `
        <div class="catalog-puzzle-card__top">
          <div class="catalog-puzzle-card__id-group">
            <span class="catalog-puzzle-card__index">Puzzle #${realIndex}</span>
            ${puzzle.isSessionNew ? '<span class="status-pill status-pill--terracotta">Session Added</span>' : ''}
          </div>
          <div class="catalog-puzzle-card__actions">
            <button class="interactive-tactile btn-secondary btn-xs btn-edit" type="button">Edit</button>
            <button class="interactive-tactile btn-secondary btn-xs btn-dup" type="button">Duplicate</button>
            <button class="interactive-tactile btn-secondary btn-xs btn-del" type="button" style="color: var(--color-terracotta-text);">Delete</button>
          </div>
        </div>
        <div class="catalog-puzzle-card__quad">
          <div class="cat-summary-box lvl-1">
            <span class="summary-cat-title">${escapeHTML(puzzle.cat1)}</span>
            <span class="summary-words-list">${escapeHTML(puzzle.words1)}</span>
          </div>
          <div class="cat-summary-box lvl-2">
            <span class="summary-cat-title">${escapeHTML(puzzle.cat2)}</span>
            <span class="summary-words-list">${escapeHTML(puzzle.words2)}</span>
          </div>
          <div class="cat-summary-box lvl-3">
            <span class="summary-cat-title">${escapeHTML(puzzle.cat3)}</span>
            <span class="summary-words-list">${escapeHTML(puzzle.words3)}</span>
          </div>
          <div class="cat-summary-box lvl-4">
            <span class="summary-cat-title">${escapeHTML(puzzle.cat4)}</span>
            <span class="summary-words-list">${escapeHTML(puzzle.words4)}</span>
          </div>
        </div>
      `;

      card.querySelector('.btn-edit').addEventListener('click', () => editPuzzle(puzzle.id));
      card.querySelector('.btn-dup').addEventListener('click', () => duplicatePuzzle(puzzle.id));
      card.querySelector('.btn-del').addEventListener('click', () => {
        openConfirm(`Delete Puzzle #${realIndex}? This action cannot be reversed.`, () => {
          deletePuzzle(puzzle.id);
        });
      });

      dom.catalogCardList.appendChild(card);
    });
  }

  function editPuzzle(id) {
    triggerHapticPulse();
    const puz = catalog.find(p => p.id === id);
    if (!puz) return;

    editingPuzzleId = id;
    const realIndex = catalog.indexOf(puz) + 1;

    dom.tabEditorLabel.textContent = `Edit #${realIndex}`;
    dom.saveBtnText.textContent = "Save Changes";
    dom.btnCancelEdit.classList.remove('hidden');

    setFormData(puz);
    setView('workspace');
    switchTab('tab-editor');
  }

  function duplicatePuzzle(id) {
    triggerHapticPulse();
    const puz = catalog.find(p => p.id === id);
    if (!puz) return;

    const copy = Object.assign({}, puz, {
      id: generateId(),
      isSessionNew: true
    });

    const index = catalog.indexOf(puz);
    catalog.splice(index + 1, 0, copy);
    saveStateToStorage();
    updateBadges();
    renderCatalogList();
    showToast("Puzzle cloned successfully");
  }

  function deletePuzzle(id) {
    triggerHapticPulse();
    const idx = catalog.findIndex(p => p.id === id);
    if (idx > -1) {
      catalog.splice(idx, 1);
      saveStateToStorage();
      updateBadges();
      renderCatalogList();
      showToast(APP_CONFIG.content.notifications.deleteSuccess);

      if (editingPuzzleId === id) {
        clearForm();
      }
    }
  }

  // CSV Inspection Renderer
  function renderCSVPreview() {
    dom.csvTableBody.innerHTML = '';
    if (catalog.length === 0) {
      dom.csvTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--color-text-muted); padding: var(--space-4);">No records present in current catalog.</td></tr>`;
    } else {
      catalog.forEach((p, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td><code>${escapeHTML(p.cat1)}</code></td>
          <td><code>${escapeHTML(p.words1)}</code></td>
          <td><code>${escapeHTML(p.cat2)}</code></td>
          <td><code>${escapeHTML(p.words2)}</code></td>
          <td><code>${escapeHTML(p.cat3)}</code></td>
          <td><code>${escapeHTML(p.words3)}</code></td>
          <td><code>${escapeHTML(p.cat4)}</code></td>
          <td><code>${escapeHTML(p.words4)}</code></td>
        `;
        dom.csvTableBody.appendChild(tr);
      });
    }

    const rawCSV = serializeToCSV(catalog);
    dom.csvRawCode.textContent = rawCSV;
  }

  // Event Wire-up
  function bindEvents() {
    // Top standardized back navigation
    dom.btnHeaderBack.addEventListener('click', () => {
      triggerHapticPulse();
      if (activeView === 'workspace') {
        setView('start');
      } else {
        showToast("Already at overview mode.");
      }
    });

    // Desktop Tabs
    [dom.navBtnEditor, dom.navBtnInventory, dom.navBtnPreview].forEach(btn => {
      btn.addEventListener('click', (e) => {
        triggerHapticPulse();
        switchTab(e.currentTarget.getAttribute('data-tab'));
      });
    });

    // Mobile Bottom Dock
    dom.bottomDock.addEventListener('click', (e) => {
      const btn = e.target.closest('.nav-tab-item');
      if (!btn) return;
      triggerHapticPulse();
      const route = btn.getAttribute('data-route');

      if (route === 'export') {
        updateBadges();
        dom.modalExport.classList.remove('hidden');
        return;
      }

      if (activeView === 'start') {
        setView('workspace');
      }

      switchTab(`tab-${route}`);
    });

    // Form Interactions
    dom.puzzleForm.addEventListener('input', () => {
      validateLiveForm();
      updateLiveSim();
    });

    dom.checkUppercase.addEventListener('change', () => {
      triggerHapticPulse();
      validateLiveForm();
      updateLiveSim();
    });

    dom.puzzleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      triggerHapticPulse();
      const status = validateLiveForm();

      if (!status.isValid) {
        if (status.dupeCount > 0) {
          showToast("Cannot save: All 16 words must be strictly unique.");
        } else if (status.wordCount < 16) {
          showToast("Cannot save: Complete all 16 item inputs.");
        } else {
          showToast("Cannot save: Provide all 4 category classifications.");
        }
        return;
      }

      const puzzleData = getFormData();

      if (editingPuzzleId) {
        const existing = catalog.find(p => p.id === editingPuzzleId);
        if (existing) {
          Object.assign(existing, puzzleData);
          showToast(APP_CONFIG.content.notifications.saveSuccess);
        }
      } else {
        catalog.push(Object.assign({ id: generateId(), isSessionNew: true }, puzzleData));
        showToast("New puzzle successfully registered!");
      }

      saveStateToStorage();
      updateBadges();
      clearForm();
      switchTab('tab-inventory');
    });

    dom.btnCancelEdit.addEventListener('click', () => {
      triggerHapticPulse();
      clearForm();
    });

    dom.btnClearForm.addEventListener('click', () => {
      triggerHapticPulse();
      openConfirm("Reset all form input fields?", clearForm);
    });

    dom.btnRandomSample.addEventListener('click', () => {
      triggerHapticPulse();
      const templates = APP_CONFIG.schema.inspirationTemplates;
      const pick = templates[Math.floor(Math.random() * templates.length)];
      setFormData({
        cat1: pick.cat1,
        words1: pick.words1.join(', '),
        cat2: pick.cat2,
        words2: pick.words2.join(', '),
        cat3: pick.cat3,
        words3: pick.words3.join(', '),
        cat4: pick.cat4,
        words4: pick.words4.join(', ')
      });
      showToast(APP_CONFIG.content.notifications.sampleSuccess);
    });

    dom.btnShuffleSim.addEventListener('click', shuffleSimTiles);
    dom.inventorySearch.addEventListener('input', renderCatalogList);
    dom.btnNewFromCatalog.addEventListener('click', () => {
      triggerHapticPulse();
      clearForm();
      switchTab('tab-editor');
    });

    // Preview Toggles
    dom.btnViewTable.addEventListener('click', () => {
      triggerHapticPulse();
      dom.btnViewTable.classList.add('segmented-control__item--active');
      dom.btnViewRaw.classList.remove('segmented-control__item--active');
      dom.btnViewTable.setAttribute('aria-selected', 'true');
      dom.btnViewRaw.setAttribute('aria-selected', 'false');
      dom.csvTableWrapper.classList.remove('hidden');
      dom.csvRawWrapper.classList.add('hidden');
    });

    dom.btnViewRaw.addEventListener('click', () => {
      triggerHapticPulse();
      dom.btnViewRaw.classList.add('segmented-control__item--active');
      dom.btnViewTable.classList.remove('segmented-control__item--active');
      dom.btnViewRaw.setAttribute('aria-selected', 'true');
      dom.btnViewTable.setAttribute('aria-selected', 'false');
      dom.csvRawWrapper.classList.remove('hidden');
      dom.csvTableWrapper.classList.add('hidden');
    });

    dom.btnCopyCsv.addEventListener('click', () => {
      triggerHapticPulse();
      const text = serializeToCSV(catalog);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showToast(APP_CONFIG.content.notifications.copySuccess))
          .catch(() => showToast("Clipboard write permission unavailable."));
      }
    });

    // Start Mode 1: Start Fresh
    dom.btnStartFresh.addEventListener('click', () => {
      triggerHapticPulse();
      catalog = [];
      saveStateToStorage();
      clearForm();
      setView('workspace');
      switchTab('tab-editor');
      showToast("Fresh dataset initiated.");
    });

    // Start Mode 2 & 3: File Uploads
    function handleFileUpload(fileInput, markAsNew) {
      const file = fileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = parseCSV(text);
          if (rows.length < 2) {
            showToast("Uploaded CSV contains no record rows.");
            return;
          }
          const added = ingestCSVRows(rows, markAsNew);
          showToast(`Ingested ${added} puzzle records.`);
          setView('workspace');
          switchTab('tab-inventory');
        } catch (err) {
          showToast("Could not parse file as RFC-4180 CSV.");
          console.error(err);
        }
      };
      reader.readAsText(file);
    }

    dom.inputFileAppend.addEventListener('change', () => handleFileUpload(dom.inputFileAppend, false));
    dom.inputFileReview.addEventListener('change', () => handleFileUpload(dom.inputFileReview, false));

    // Sample Dataset
    dom.btnLoadSample.addEventListener('click', () => {
      triggerHapticPulse();
      catalog = APP_CONFIG.schema.sampleDataset.map(item => Object.assign({ id: generateId(), isSessionNew: false }, item));
      saveStateToStorage();
      showToast("Hydrated 3 sample puzzles.");
      setView('workspace');
      switchTab('tab-inventory');
    });

    // Download Blank CSV Schema
    dom.btnDownloadTemplate.addEventListener('click', () => {
      triggerHapticPulse();
      const template = APP_CONFIG.schema.expectedHeaders.join(',') + '\n';
      downloadFile(template, 'connections_template.csv');
      showToast("Downloaded schema template.");
    });

    // Export Modals
    const openExportModal = () => {
      triggerHapticPulse();
      updateBadges();
      dom.modalExport.classList.remove('hidden');
    };

    dom.btnQuickExport.addEventListener('click', openExportModal);
    dom.btnOpenExportModal.addEventListener('click', openExportModal);

    dom.btnDownloadAll.addEventListener('click', () => {
      triggerHapticPulse();
      if (catalog.length === 0) {
        showToast("Cannot export: Ledger is empty.");
        return;
      }
      const filename = dom.exportFilename.value.trim() || APP_CONFIG.schema.defaultExportFilename;
      const csv = serializeToCSV(catalog);
      downloadFile(csv, filename);
      closeModals();
      showToast(`Exported ${catalog.length} records.`);
    });

    dom.btnDownloadSessionOnly.addEventListener('click', () => {
      triggerHapticPulse();
      const sessionOnly = catalog.filter(p => p.isSessionNew);
      if (sessionOnly.length === 0) {
        showToast("No newly added entries in this session.");
        return;
      }
      const filename = (dom.exportFilename.value.trim() || APP_CONFIG.schema.defaultExportFilename).replace('.csv', '_session_new.csv');
      const csv = serializeToCSV(sessionOnly);
      downloadFile(csv, filename);
      closeModals();
      showToast(`Exported ${sessionOnly.length} session records.`);
    });

    // Modal Close Triggers
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHapticPulse();
        closeModals();
      });
    });

    dom.btnConfirmYes.addEventListener('click', () => {
      triggerHapticPulse();
      if (typeof pendingConfirmAction === 'function') {
        pendingConfirmAction();
      }
      closeModals();
    });

    dom.btnConfirmNo.addEventListener('click', () => {
      triggerHapticPulse();
      closeModals();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModals();
      }
    });

    // Auto-Save interval
    if (APP_CONFIG.features.enableAutoSave) {
      setInterval(() => {
        if (catalog.length > 0) {
          saveStateToStorage();
        }
      }, APP_CONFIG.features.autoSaveIntervalMs);
    }
  }

  // Initialization
  function init() {
    bindEvents();
    const hasData = loadStateFromStorage();
    if (hasData && catalog.length > 0) {
      setView('workspace');
      switchTab('tab-inventory');
    } else {
      setView('start');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();