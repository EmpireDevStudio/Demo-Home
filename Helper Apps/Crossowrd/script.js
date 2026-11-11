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
    appId: "speakeasy-crossword-studio",
    appName: "Editorial Crossword Ledger",
    appTagline: "Artisanal Lexicon & Bulk Compilation Studio",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "https://studio.editorialledger.com",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoAlt: "Editorial Crossword Signature Seal",
    accentColor: "#963E35",       // Accessible Terracotta
    accentSecondary: "#3E5B42",   // Accessible Sage
    accentHighlight: "#6E5614",   // Accessible Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilyMono: "'JetBrains Mono', Consolas, monospace",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "tab-lexicon",
    items: [
      { id: "tab-lexicon", label: "Lexicon", icon: "book", showInBottomBar: true },
      { id: "tab-compiler", label: "Single", icon: "grid", showInBottomBar: true },
      { id: "tab-bulk-maker", label: "Bulk", icon: "batch", showInBottomBar: true },
      { id: "tab-deck", label: "Deck", icon: "deck", showInBottomBar: true },
      { id: "tab-export", label: "Export", icon: "export", showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultEyebrow: "EDITORIAL ARCHIVE",
      defaultTitle: "Crossword Lexicon & Bulk Builder",
      defaultSubtitle: "Authoritative lexicographical inventory, layout compilation, and turnkey publication exports.",
    },
    emptyStates: {
      noDataHeading: "No Puzzles Documented in Deck",
      noDataDescription: "Use the Single Compiler or Bulk Puzzle Maker to synthesize crosswords from your lexicon database.",
      noSearchResultsHeading: "No Matching Lexicon Records Found",
      noSearchResultsDescription: "Review your filter parameters or search terms and attempt the query again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Entry",
      delete: "Remove Permanently",
      retry: "Retry Layout Synthesis",
      back: "Back",
    },
    notifications: {
      saveSuccess: "Entry successfully committed to operational lexicon.",
      saveError: "Unable to commit changes. Please verify required fields and retry.",
      deleteSuccess: "Record permanently removed from workspace.",
    },
    legal: {
      copyrightHolder: "The Speakeasy Ledger Systems LLC",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SOCIAL
  support: {
    contactEmail: "editorial@editorialledger.com",
    documentationUrl: "https://docs.editorialledger.com",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,        // Subtle 12ms navigator.vibrate() pulse
    enableSmoothPageTransitions: true,
    enableAutoSave: true,
    autoSaveIntervalMs: 5000,
    enableDetailedDiagnostics: false,
    enableStickyBottomBar: true,
  },

  // 7. API ENDPOINTS & STORAGE KEYS
  endpoints: {
    storageKeys: {
      lexiconDb: "speakeasy_crossword_lexicon_db_v4",
      puzzlesDeck: "speakeasy_crossword_puzzles_deck_v4",
    },
  },
});

/**
 * =========================================================================
 * CORE CROSSWORD ENGINE & APPLICATION CONTROLLER
 * =========================================================================
 */
(() => {
  'use strict';

  const EXPECTED_HEADERS = ['tier', 'title', 'grid', 'clues_across', 'clues_down'];

  const TIER_SPECS = {
    mini: { size: 5,  label: 'Mini (5×5)',   minWords: 4,  maxWords: 7 },
    midi: { size: 11, label: 'Midi (11×11)', minWords: 7,  maxWords: 14 },
    main: { size: 15, label: 'Main (15×15)', minWords: 10, maxWords: 24 }
  };

  const SEED_LEXICON = [
    { word: 'NEGRONI', clue: 'Equal-parts Italian classic of gin, sweet vermouth, and Campari', category: 'Classic Cocktails', usage: 0 },
    { word: 'MARTINI', clue: 'Dry, stirred pairing of gin and dry vermouth garnished with an olive or twist', category: 'Classic Cocktails', usage: 0 },
    { word: 'MANHATTAN', clue: 'Whiskey classic traditionally stirred with sweet vermouth and aromatic bitters', category: 'Classic Cocktails', usage: 0 },
    { word: 'DAIQUIRI', clue: 'Canonical Cuban trio of rum, fresh lime juice, and simple syrup', category: 'Classic Cocktails', usage: 0 },
    { word: 'SAZERAC', clue: 'New Orleans rye whiskey drink served in an absinthe-rinsed chilled glass', category: 'Classic Cocktails', usage: 0 },
    { word: 'CAMPARI', clue: 'Vibrant crimson Italian aperitivo famous for bitter orange and gentian', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'BITTERS', clue: 'Liquid spice cabinet of botanical extracts dispensed by the dash', category: 'Ingredients', usage: 0 },
    { word: 'ORANGE', clue: 'Citrus fruit whose expressed peel traditionally oils the rim of an Old Fashioned', category: 'Garnishes', usage: 0 },
    { word: 'SHAKER', clue: 'Stainless steel two-piece or three-piece vessel used for agitation with ice', category: 'Bar Tools', usage: 0 },
    { word: 'GIMLET', clue: 'Historic British naval pairing of dry gin and preserved lime cordial', category: 'Classic Cocktails', usage: 0 },
    { word: 'BOULEVARDIER', clue: 'Stirred 1920s Paris classic swapping the Negroni\'s gin for bourbon or rye', category: 'Classic Cocktails', usage: 0 },
    { word: 'COLLINS', clue: 'Tall, sour highball finished with club soda and served over ice', category: 'Classic Cocktails', usage: 0 },
    { word: 'PISCO', clue: 'South American unaged grape brandy claimed by Peru and Chile', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'JIGGER', clue: 'Double-ended hourglass metal tool used for precision cocktail measurements', category: 'Bar Tools', usage: 0 },
    { word: 'MINT', clue: 'Aromatic herb clapped between palms before being tucked into a Julep or Mojito', category: 'Garnishes', usage: 0 },
    { word: 'CRUSHED', clue: 'Fast-diluting pebble ice format ideal for packing high-proof tropical swizzles', category: 'Ice & Chilling', usage: 0 },
    { word: 'VERMOUTH', clue: 'Aromatized, fortified wine essential to Martinis and Manhattans', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'STIR', clue: 'Chill and dilute spirit-forward drinks smoothly with a spiral bar spoon', category: 'Technique', usage: 0 },
    { word: 'STRAINER', clue: 'Bar tool such as a Hawthorne or Julep used to hold back spent ice', category: 'Bar Tools', usage: 0 },
    { word: 'PEEL', clue: 'Outer skin of citrus cut to express aromatic oils over a finished cocktail', category: 'Garnishes', usage: 0 },
    { word: 'RUM', clue: 'Spirit distilled directly from fermented sugarcane juice or molasses', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'GIN', clue: 'Spirit whose dominant flavoring must legally come from juniper berries', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'ICE', clue: 'Essential chilling and diluting medium of the bar', category: 'Ice & Chilling', usage: 0 },
    { word: 'RYE', clue: 'Grain whiskey with a spicy, dry profile that anchored 19th-century American cocktails', category: 'Spirits & Liqueurs', usage: 0 },
    { word: 'SODA', clue: 'Carbonated water used to lengthen spirits without adding calories or sugar', category: 'Ingredients', usage: 0 }
  ];

  /* ==========================================================================
     APPLICATION STATE
     ========================================================================== */
  const state = {
    lexicon: [],
    selectedLexiconIds: new Set(),
    stagedWords: [],
    currentCompiledBoard: null,
    bulkPool: [],
    puzzles: [],
    activeTab: 'tab-lexicon',
    navigationHistory: []
  };

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const el = {
    // Standardized Page Header
    btnGlobalBack: document.getElementById('btn-global-back'),
    backButtonLabel: document.getElementById('backButtonLabel'),
    pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
    pageTitleSlot: document.getElementById('pageTitleSlot'),
    pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),
    appVersionBadge: document.getElementById('appVersionBadge'),
    statTotalLexicon: document.getElementById('stat-total-lexicon'),
    statTotalPuzzles: document.getElementById('stat-total-puzzles'),
    navLexiconPill: document.getElementById('nav-lexicon-pill'),
    navDeckPill: document.getElementById('nav-deck-pill'),
    btnSeedLexicon: document.getElementById('btn-seed-lexicon'),
    fileInputCsv: document.getElementById('file-input-csv'),
    btnQuickExportHead: document.getElementById('btn-quick-export-head'),
    navTabs: document.querySelectorAll('.nav-tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    bottomDockNavItems: document.getElementById('bottomDockNavItems'),

    // Lexicon Tab
    formAddLexicon: document.getElementById('form-add-lexicon'),
    lexInputWord: document.getElementById('lex-input-word'),
    lexInputClue: document.getElementById('lex-input-clue'),
    lexInputCategory: document.getElementById('lex-input-category'),
    btnOpenBulkModal: document.getElementById('btn-open-bulk-modal'),
    statUnusedCount: document.getElementById('stat-unused-count'),
    statLowCount: document.getElementById('stat-low-count'),
    statHighCount: document.getElementById('stat-high-count'),
    lexSearchInput: document.getElementById('lex-search-input'),
    lexFilterUsage: document.getElementById('lex-filter-usage'),
    lexFilterLength: document.getElementById('lex-filter-length'),
    lexSortOrder: document.getElementById('lex-sort-order'),
    tbodyLexicon: document.getElementById('tbody-lexicon'),
    checkAllLexicon: document.getElementById('check-all-lexicon'),
    selectedLexiconCount: document.getElementById('selected-lexicon-count'),
    btnBatchSendBulk: document.getElementById('btn-batch-send-bulk'),
    btnBatchSendCompiler: document.getElementById('btn-batch-send-compiler'),
    btnBatchDelete: document.getElementById('btn-batch-delete'),

    // Compiler Tab
    compPuzzleTitle: document.getElementById('comp-puzzle-title'),
    compPuzzleTier: document.getElementById('comp-puzzle-tier'),
    compilerStatusBadge: document.getElementById('compiler-status-badge'),
    btnPullUnused: document.getElementById('btn-pull-unused'),
    btnClearStaging: document.getElementById('btn-clear-staging'),
    btnAddStagedRow: document.getElementById('btn-add-staged-row'),
    stagedWordsList: document.getElementById('staged-words-list'),
    btnRunCompiler: document.getElementById('btn-run-compiler'),
    btnReshuffleCompile: document.getElementById('btn-reshuffle-compile'),
    boardMetaCaption: document.getElementById('board-meta-caption'),
    badgeBoardFit: document.getElementById('badge-board-fit'),
    compilerGridCanvas: document.getElementById('compiler-grid-canvas'),
    countAcrossClues: document.getElementById('count-across-clues'),
    countDownClues: document.getElementById('count-down-clues'),
    listAcrossEditor: document.getElementById('list-across-editor'),
    listDownEditor: document.getElementById('list-down-editor'),
    compilerErrorBox: document.getElementById('compiler-error-box'),
    btnDiscardBoard: document.getElementById('btn-discard-board'),
    btnCommitToLedger: document.getElementById('btn-commit-to-ledger'),

    // Bulk Maker Tab
    bulkPuzzleTier: document.getElementById('bulk-puzzle-tier'),
    bulkTitlePrefix: document.getElementById('bulk-title-prefix'),
    bulkMaxPuzzles: document.getElementById('bulk-max-puzzles'),
    bulkDefaultCap: document.getElementById('bulk-default-cap'),
    btnBulkLoadAllDb: document.getElementById('btn-bulk-load-all-db'),
    btnBulkApplyCaps: document.getElementById('btn-bulk-apply-caps'),
    btnBulkClearSelection: document.getElementById('btn-bulk-clear-selection'),
    btnRunBulkGenerator: document.getElementById('btn-run-bulk-generator'),
    bulkStatusBadge: document.getElementById('bulk-status-badge'),
    bulkWordCountBadge: document.getElementById('bulk-word-count-badge'),
    tbodyBulkWords: document.getElementById('tbody-bulk-words'),
    bulkProgressText: document.getElementById('bulk-progress-text'),
    bulkLogConsole: document.getElementById('bulk-log-console'),

    // Deck Tab
    deckSearchInput: document.getElementById('deck-search-input'),
    deckTierFilter: document.getElementById('deck-tier-filter'),
    btnGotoCompiler: document.getElementById('btn-goto-compiler'),
    btnGotoBulk: document.getElementById('btn-goto-bulk'),
    btnDeckClearAll: document.getElementById('btn-deck-clear-all'),
    deckTableBody: document.getElementById('deck-table-body'),
    deckEmptyState: document.getElementById('deck-empty-state'),
    btnDeckCreateFirst: document.getElementById('btn-deck-create-first'),

    // Export Tab
    auditTotalPuzzles: document.getElementById('audit-total-puzzles'),
    auditValidPuzzles: document.getElementById('audit-valid-puzzles'),
    auditErrorPuzzles: document.getElementById('audit-error-puzzles'),
    exportValidationFeedback: document.getElementById('export-validation-feedback'),
    exportFilenameInput: document.getElementById('export-filename-input'),
    btnDownloadAll: document.getElementById('btn-download-all'),
    btnCopyClipboard: document.getElementById('btn-copy-clipboard'),
    btnExportLexiconJson: document.getElementById('btn-export-lexicon-json'),
    btnDownloadTemplate: document.getElementById('btn-download-template'),
    btnViewTable: document.getElementById('btn-view-table'),
    btnViewRaw: document.getElementById('btn-view-raw'),
    previewModeTable: document.getElementById('preview-mode-table'),
    previewModeRaw: document.getElementById('preview-mode-raw'),
    previewTableBody: document.getElementById('preview-table-body'),
    rawCsvTextarea: document.getElementById('raw-csv-textarea'),

    // Modals & Toast
    modalBulkPaste: document.getElementById('modal-bulk-paste'),
    textareaBulkInput: document.getElementById('textarea-bulk-input'),
    btnApplyBulk: document.getElementById('btn-apply-bulk'),
    modalEditLexicon: document.getElementById('modal-edit-lexicon'),
    editLexId: document.getElementById('edit-lex-id'),
    editLexWord: document.getElementById('edit-lex-word'),
    editLexClue: document.getElementById('edit-lex-clue'),
    editLexCategory: document.getElementById('edit-lex-category'),
    editLexUsage: document.getElementById('edit-lex-usage'),
    btnSaveEditLexicon: document.getElementById('btn-save-edit-lexicon'),
    toastNotify: document.getElementById('toast-notify')
  };

  /* ==========================================================================
     PHYSICAL MICRO-HAPTIC PULSE SIMULATOR
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
        // Silent on restricted contexts
      }
    }
  }

  /* ==========================================================================
     AUTONOMOUS CROSSWORD COMPILER ENGINE
     ========================================================================== */
  class AutoCrosswordCompiler {
    constructor(size, wordCluePairs) {
      this.size = size;
      this.items = wordCluePairs
        .map(p => ({
          word: (p.word || '').replace(/[^A-Z]/gi, '').toUpperCase(),
          clue: (p.clue || '').trim(),
          sourceId: p.sourceId || null
        }))
        .filter(p => p.word.length >= 2 && p.word.length <= size && p.clue.length > 0);
    }

    compile(maxAttempts = 180) {
      if (!this.items.length) return null;

      let bestLayout = null;
      let highestPlaced = -1;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const layout = this.tryBuildSingleLayout(attempt > 0);
        if (layout && layout.placedWords.length > highestPlaced) {
          highestPlaced = layout.placedWords.length;
          bestLayout = layout;

          if (bestLayout.placedWords.length === this.items.length) {
            break;
          }
        }
      }

      if (!bestLayout || bestLayout.placedWords.length < 2) {
        return null;
      }

      return this.finalizeLayout(bestLayout);
    }

    tryBuildSingleLayout(shuffle = false) {
      const size = this.size;
      const grid = Array.from({ length: size }, () => Array(size).fill(null));
      const placedWords = [];

      const pool = [...this.items];
      if (shuffle) {
        pool.sort(() => Math.random() - 0.5);
      } else {
        pool.sort((a, b) => b.word.length - a.word.length);
      }

      const first = pool[0];
      const startR = Math.floor(size / 2);
      const startC = Math.max(0, Math.floor((size - first.word.length) / 2));

      if (!this.canPlaceWord(grid, first.word, startR, startC, 'across')) {
        return null;
      }
      this.placeWord(grid, first.word, startR, startC, 'across');
      placedWords.push({ ...first, r: startR, c: startC, dir: 'across' });

      for (let i = 1; i < pool.length; i++) {
        const candidate = pool[i];
        const placement = this.findBestIntersection(grid, candidate.word, placedWords);
        if (placement) {
          this.placeWord(grid, candidate.word, placement.r, placement.c, placement.dir);
          placedWords.push({ ...candidate, r: placement.r, c: placement.c, dir: placement.dir });
        }
      }

      return { grid, placedWords };
    }

    findBestIntersection(grid, word, placedWords) {
      const candidates = [];
      const size = this.size;

      for (const placed of placedWords) {
        const targetDir = placed.dir === 'across' ? 'down' : 'across';

        for (let wIdx = 0; wIdx < word.length; wIdx++) {
          const char = word[wIdx];

          for (let pIdx = 0; pIdx < placed.word.length; pIdx++) {
            if (placed.word[pIdx] === char) {
              const r = targetDir === 'down' ? placed.r - wIdx : placed.r + pIdx;
              const c = targetDir === 'down' ? placed.c + pIdx : placed.c - wIdx;

              if (r >= 0 && c >= 0 && 
                  (targetDir === 'down' ? r + word.length <= size : c + word.length <= size)) {
                if (this.canPlaceWord(grid, word, r, c, targetDir)) {
                  candidates.push({ r, c, dir: targetDir });
                }
              }
            }
          }
        }
      }

      if (!candidates.length) return null;
      candidates.sort((a, b) => {
        const distA = Math.abs(a.r - size / 2) + Math.abs(a.c - size / 2);
        const distB = Math.abs(b.r - size / 2) + Math.abs(b.c - size / 2);
        return distA - distB;
      });

      return candidates[0];
    }

    canPlaceWord(grid, word, r, c, dir) {
      const size = this.size;

      if (dir === 'across') {
        if (c > 0 && grid[r][c - 1] !== null) return false;
        if (c + word.length < size && grid[r][c + word.length] !== null) return false;
      } else {
        if (r > 0 && grid[r - 1][c] !== null) return false;
        if (r + word.length < size && grid[r + word.length][c] !== null) return false;
      }

      for (let i = 0; i < word.length; i++) {
        const curR = dir === 'across' ? r : r + i;
        const curC = dir === 'across' ? c + i : c;
        const existing = grid[curR][curC];

        if (existing !== null && existing !== word[i]) {
          return false;
        }

        if (existing === null) {
          if (dir === 'across') {
            const up = curR > 0 ? grid[curR - 1][curC] : null;
            const down = curR + 1 < size ? grid[curR + 1][curC] : null;
            if (up !== null || down !== null) return false;
          } else {
            const left = curC > 0 ? grid[curR][curC - 1] : null;
            const right = curC + 1 < size ? grid[curR][curC + 1] : null;
            if (left !== null || right !== null) return false;
          }
        }
      }
      return true;
    }

    placeWord(grid, word, r, c, dir) {
      for (let i = 0; i < word.length; i++) {
        const curR = dir === 'across' ? r : r + i;
        const curC = dir === 'across' ? c + i : c;
        grid[curR][curC] = word[i];
      }
    }

    finalizeLayout(layout) {
      const size = this.size;
      const solutionGrid = Array.from({ length: size }, () => Array(size).fill(''));
      const blockGrid = Array.from({ length: size }, () => Array(size).fill(true));

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (layout.grid[r][c] !== null) {
            solutionGrid[r][c] = layout.grid[r][c];
            blockGrid[r][c] = false;
          }
        }
      }

      let counter = 1;
      const numbering = {};
      const acrossClues = [];
      const downClues = [];
      const usedWordsList = [];

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          if (blockGrid[r][c]) continue;

          const isAcrossStart = (c === 0 || blockGrid[r][c - 1]) && (c + 1 < size && !blockGrid[r][c + 1]);
          const isDownStart   = (r === 0 || blockGrid[r - 1][c]) && (r + 1 < size && !blockGrid[r + 1][c]);

          if (isAcrossStart || isDownStart) {
            numbering[`${r},${c}`] = counter;

            if (isAcrossStart) {
              let sc = c;
              let word = '';
              while (sc < size && !blockGrid[r][sc]) {
                word += solutionGrid[r][sc];
                sc++;
              }
              const matched = layout.placedWords.find(w => w.dir === 'across' && w.r === r && w.c === c) ||
                              this.items.find(w => w.word === word) ||
                              { clue: `Lexical term for ${word}`, sourceId: null };
              acrossClues.push({ num: counter, word, clue: matched.clue, sourceId: matched.sourceId });
              usedWordsList.push(word);
            }

            if (isDownStart) {
              let sr = r;
              let word = '';
              while (sr < size && !blockGrid[sr][c]) {
                word += solutionGrid[sr][c];
                sr++;
              }
              const matched = layout.placedWords.find(w => w.dir === 'down' && w.r === r && w.c === c) ||
                              this.items.find(w => w.word === word) ||
                              { clue: `Lexical term for ${word}`, sourceId: null };
              downClues.push({ num: counter, word, clue: matched.clue, sourceId: matched.sourceId });
              usedWordsList.push(word);
            }

            counter++;
          }
        }
      }

      const rows = [];
      for (let r = 0; r < size; r++) {
        let rowStr = '';
        for (let c = 0; c < size; c++) {
          rowStr += blockGrid[r][c] ? '#' : solutionGrid[r][c];
        }
        rows.push(rowStr);
      }

      return {
        size,
        gridString: rows.join('/'),
        solutionGrid,
        blockGrid,
        numbering,
        acrossClues,
        downClues,
        placedCount: layout.placedWords.length,
        totalItems: this.items.length,
        usedWords: [...new Set(usedWordsList)]
      };
    }
  }

  /* ==========================================================================
     RFC-4180 COMPLIANT CSV PARSER & SERIALIZER
     ========================================================================== */
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = '', inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (inQuotes) {
        if (char === '"' && nextChar === '"') { cell += '"'; i++; }
        else if (char === '"') { inQuotes = false; }
        else { cell += char; }
      } else {
        if (char === '"') { inQuotes = true; }
        else if (char === ',') { row.push(cell.trim()); cell = ''; }
        else if (char === '\n' || char === '\r') {
          if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
          row = []; cell = '';
          if (char === '\r' && nextChar === '\n') i++;
        } else { cell += char; }
      }
    }
    if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
    return rows;
  }

  function serializeToCSV(records) {
    const escapeField = (val) => {
      if (val == null) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [EXPECTED_HEADERS.join(',')];
    records.forEach(rec => {
      const row = EXPECTED_HEADERS.map(h => escapeField(rec[h] || ''));
      lines.push(row.join(','));
    });
    return lines.join('\n');
  }

  /* ==========================================================================
     LEXICON DATABASE MANAGEMENT
     ========================================================================== */
  function renderLexiconView() {
    const tbody = el.tbodyLexicon;
    tbody.innerHTML = '';

    const searchText = el.lexSearchInput.value.toLowerCase().trim();
    const usageFilter = el.lexFilterUsage.value;
    const lengthFilter = el.lexFilterLength.value;
    const sortOrder = el.lexSortOrder.value;

    let items = [...state.lexicon];

    if (searchText) {
      items = items.filter(item => 
        item.word.toLowerCase().includes(searchText) ||
        item.clue.toLowerCase().includes(searchText) ||
        (item.category || '').toLowerCase().includes(searchText)
      );
    }

    if (usageFilter === 'unused') {
      items = items.filter(item => (item.usage || 0) === 0);
    } else if (usageFilter === 'rare') {
      items = items.filter(item => (item.usage || 0) >= 1 && (item.usage || 0) <= 2);
    } else if (usageFilter === 'frequent') {
      items = items.filter(item => (item.usage || 0) >= 3);
    }

    if (lengthFilter === '3-5') {
      items = items.filter(item => item.word.length >= 3 && item.word.length <= 5);
    } else if (lengthFilter === '6-8') {
      items = items.filter(item => item.word.length >= 6 && item.word.length <= 8);
    } else if (lengthFilter === '9+') {
      items = items.filter(item => item.word.length >= 9);
    }

    items.sort((a, b) => {
      if (sortOrder === 'usage-asc') return (a.usage || 0) - (b.usage || 0);
      if (sortOrder === 'usage-desc') return (b.usage || 0) - (a.usage || 0);
      if (sortOrder === 'alpha-asc') return a.word.localeCompare(b.word);
      if (sortOrder === 'date-desc') return (b.createdAt || 0) - (a.createdAt || 0);
      return 0;
    });

    items.forEach(item => {
      const tr = document.createElement('tr');
      const isChecked = state.selectedLexiconIds.has(item.id);

      let usageChipClass = 'status-chip--sage';
      if ((item.usage || 0) >= 3) usageChipClass = 'status-chip--terracotta';
      else if ((item.usage || 0) > 0) usageChipClass = 'status-chip--ochre';

      tr.innerHTML = `
        <td><input type="checkbox" class="paper-checkbox check-lex-item" data-id="${item.id}" ${isChecked ? 'checked' : ''} aria-label="Select ${escapeHTML(item.word)}"></td>
        <td><strong class="paper-input-mono">${escapeHTML(item.word)}</strong></td>
        <td>${item.word.length}</td>
        <td>${escapeHTML(item.clue)}</td>
        <td><span class="category-tag">${escapeHTML(item.category || 'General')}</span></td>
        <td><span class="usage-counter-tag status-chip ${usageChipClass}">${item.usage || 0}×</span></td>
        <td>
          <div class="table-actions">
            <button type="button" class="interactive-tactile btn-secondary btn-sm btn-lex-stage" data-id="${item.id}" title="Send word to single compiler">Stage</button>
            <button type="button" class="interactive-tactile btn-secondary btn-sm btn-lex-edit" data-id="${item.id}">Edit</button>
            <button type="button" class="interactive-tactile btn-danger btn-sm btn-lex-del" data-id="${item.id}" title="Delete record">&times;</button>
          </div>
        </td>
      `;

      tr.querySelector('.check-lex-item').addEventListener('change', (e) => {
        if (e.target.checked) state.selectedLexiconIds.add(item.id);
        else state.selectedLexiconIds.delete(item.id);
        updateBatchCount();
      });

      tr.querySelector('.btn-lex-stage').addEventListener('click', () => {
        stageSingleWord(item);
      });
      tr.querySelector('.btn-lex-edit').addEventListener('click', () => {
        openEditLexiconModal(item);
      });
      tr.querySelector('.btn-lex-del').addEventListener('click', () => {
        deleteLexiconEntry(item.id);
      });

      tbody.appendChild(tr);
    });

    updateLexiconStats();
    updateBatchCount();
  }

  function updateLexiconStats() {
    const total = state.lexicon.length;
    const unused = state.lexicon.filter(i => (i.usage || 0) === 0).length;
    const low = state.lexicon.filter(i => (i.usage || 0) >= 1 && (i.usage || 0) <= 2).length;
    const high = state.lexicon.filter(i => (i.usage || 0) >= 3).length;

    el.statTotalLexicon.textContent = `${total} Words in DB`;
    el.navLexiconPill.textContent = total;
    el.statUnusedCount.textContent = unused;
    el.statLowCount.textContent = low;
    el.statHighCount.textContent = high;
  }

  function updateBatchCount() {
    const count = state.selectedLexiconIds.size;
    el.selectedLexiconCount.textContent = `${count} word${count === 1 ? '' : 's'} selected`;
    el.checkAllLexicon.checked = count > 0 && count === state.lexicon.length;
  }

  function addLexiconEntry(word, clue, category) {
    const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '').trim();
    const cleanClue = clue.trim();
    if (!cleanWord || !cleanClue) return false;

    const existing = state.lexicon.find(i => i.word === cleanWord);
    if (existing) {
      existing.clue = cleanClue;
      if (category) existing.category = category.trim();
      showToast(`Updated entry for "${cleanWord}".`);
    } else {
      state.lexicon.push({
        id: `lex_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        word: cleanWord,
        clue: cleanClue,
        category: category ? category.trim() : 'General',
        usage: 0,
        createdAt: Date.now()
      });
      showToast(APP_CONFIG.content.notifications.saveSuccess);
    }

    persistLexicon();
    renderLexiconView();
    return true;
  }

  function deleteLexiconEntry(id) {
    const item = state.lexicon.find(i => i.id === id);
    if (!item) return;
    if (confirm(`Permanently remove "${item.word}" from your lexicon database?`)) {
      state.lexicon = state.lexicon.filter(i => i.id !== id);
      state.selectedLexiconIds.delete(id);
      persistLexicon();
      renderLexiconView();
      showToast(APP_CONFIG.content.notifications.deleteSuccess);
    }
  }

  function openEditLexiconModal(item) {
    el.editLexId.value = item.id;
    el.editLexWord.value = item.word;
    el.editLexClue.value = item.clue;
    el.editLexCategory.value = item.category || '';
    el.editLexUsage.value = item.usage || 0;
    openModal(el.modalEditLexicon);
  }

  /* ==========================================================================
     BULK PUZZLE MAKER ENGINE
     ========================================================================== */
  function renderBulkWordsPool() {
    const tbody = el.tbodyBulkWords;
    tbody.innerHTML = '';

    el.bulkWordCountBadge.textContent = `${state.bulkPool.length} Words in Batch`;

    if (!state.bulkPool.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding:28px;">No words currently selected for bulk generator. Select entries in the Lexicon table and click "Send to Bulk Maker", or click "Load Entire Database Pool" below.</td></tr>`;
      return;
    }

    state.bulkPool.forEach((item, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong class="paper-input-mono">${escapeHTML(item.word)}</strong></td>
        <td>${item.word.length}</td>
        <td>${escapeHTML(item.clue)}</td>
        <td>
          <input type="number" class="paper-input paper-input-sm bulk-cap-input" min="1" max="25" value="${item.allowedCount || 1}" data-idx="${idx}">
          <span class="field-help" style="margin-left:4px;">time(s) max</span>
        </td>
        <td><span class="status-chip status-chip--ochre">${item.usage || 0}×</span></td>
        <td>
          <button type="button" class="interactive-tactile btn-danger btn-sm btn-del-bulk-row" data-idx="${idx}" title="Remove word">&times;</button>
        </td>
      `;

      tr.querySelector('.bulk-cap-input').addEventListener('input', (e) => {
        state.bulkPool[idx].allowedCount = Math.max(1, parseInt(e.target.value, 10) || 1);
      });

      tr.querySelector('.btn-del-bulk-row').addEventListener('click', () => {
        state.bulkPool.splice(idx, 1);
        renderBulkWordsPool();
      });

      tbody.appendChild(tr);
    });
  }

  function loadAllLexiconIntoBulk() {
    const defaultCap = parseInt(el.bulkDefaultCap.value, 10) || 1;
    state.bulkPool = state.lexicon.map(item => ({
      id: item.id,
      word: item.word,
      clue: item.clue,
      usage: item.usage || 0,
      allowedCount: defaultCap,
      remainingCount: defaultCap
    }));
    renderBulkWordsPool();
    showToast(`Loaded ${state.bulkPool.length} database entries into Bulk Maker.`);
  }

  function applyDefaultCapToAllBulk() {
    const cap = parseInt(el.bulkDefaultCap.value, 10) || 1;
    state.bulkPool.forEach(item => { item.allowedCount = cap; });
    renderBulkWordsPool();
    showToast(`Set allowed quota to ${cap}× for all batch words.`);
  }

  async function executeBulkGeneration() {
    if (!state.bulkPool.length) {
      alert('Please load words into the Bulk Maker pool first.');
      return;
    }

    const tier = el.bulkPuzzleTier.value;
    const targetSize = TIER_SPECS[tier].size;
    const maxPuzzlesToGenerate = parseInt(el.bulkMaxPuzzles.value, 10) || 10;
    const prefix = el.bulkTitlePrefix.value.trim() || 'Speakeasy Edition';

    const candidates = state.bulkPool.filter(w => w.word.length >= 2 && w.word.length <= targetSize);
    if (candidates.length < 4) {
      alert(`The selected tier (${targetSize}×${targetSize}) requires terms with length <= ${targetSize}. Only ${candidates.length} suitable words found in pool.`);
      return;
    }

    el.bulkStatusBadge.className = 'status-chip status-chip--ochre';
    el.bulkStatusBadge.textContent = 'Synthesizing...';
    el.bulkLogConsole.innerHTML = '';
    logBulkConsole(`Initializing batch synthesis for ${tier.toUpperCase()} (${targetSize}×${targetSize})...`, 'info');
    logBulkConsole(`Eligible word pool: ${candidates.length} terms.`, 'info');

    candidates.forEach(c => {
      c.remainingCount = c.allowedCount;
    });

    let generatedPuzzlesCount = 0;
    let failedAttempts = 0;
    const MAX_CONSECUTIVE_FAILURES = 14;

    while (generatedPuzzlesCount < maxPuzzlesToGenerate && failedAttempts < MAX_CONSECUTIVE_FAILURES) {
      const activeCandidates = candidates.filter(c => c.remainingCount > 0);
      if (activeCandidates.length < 3) {
        logBulkConsole(`Process terminated: Word quotas exhausted. Less than 3 available terms remain.`, 'warn');
        break;
      }

      activeCandidates.sort(() => (Math.random() - 0.5));
      activeCandidates.sort((a, b) => b.remainingCount - a.remainingCount);

      const compiler = new AutoCrosswordCompiler(targetSize, activeCandidates);
      const result = compiler.compile(150);

      if (result && result.placedCount >= 3) {
        const puzzleKey = result.usedWords.sort().join('|');
        const alreadyExists = state.puzzles.some(p => p.usedWords && p.usedWords.sort().join('|') === puzzleKey);

        if (!alreadyExists) {
          generatedPuzzlesCount++;
          failedAttempts = 0;

          result.usedWords.forEach(w => {
            const bulkItem = candidates.find(c => c.word === w);
            if (bulkItem) {
              bulkItem.remainingCount = Math.max(0, bulkItem.remainingCount - 1);
            }
            const dbItem = state.lexicon.find(i => i.word === w);
            if (dbItem) {
              dbItem.usage = (dbItem.usage || 0) + 1;
            }
          });

          const acrossCluesFormatted = result.acrossClues.map(c => `${c.num}. ${c.clue.trim()}`).join(' | ');
          const downCluesFormatted   = result.downClues.map(c => `${c.num}. ${c.clue.trim()}`).join(' | ');

          const newPuzzle = {
            id: `puz_bulk_${Date.now()}_${generatedPuzzlesCount}`,
            tier,
            title: `${prefix} #${state.puzzles.length + 1}`,
            grid: result.gridString,
            clues_across: acrossCluesFormatted,
            clues_down: downCluesFormatted,
            size: targetSize,
            wordCount: result.acrossClues.length + result.downClues.length,
            usedWords: result.usedWords
          };

          state.puzzles.push(newPuzzle);
          logBulkConsole(`✔ Compiled Puzzle #${state.puzzles.length}: "${newPuzzle.title}" with ${result.usedWords.length} words.`, 'success');
        } else {
          failedAttempts++;
        }
      } else {
        failedAttempts++;
      }

      await new Promise(r => setTimeout(r, 10));
    }

    persistLexicon();
    persistPuzzles();
    renderLexiconView();
    updateDeckView();
    updateExportAuditView();
    renderBulkWordsPool();

    el.bulkStatusBadge.className = 'status-chip status-chip--sage';
    el.bulkStatusBadge.textContent = 'Batch Ready';
    logBulkConsole(`Batch completed! Synthesized ${generatedPuzzlesCount} new unique puzzles. Added to Ledger Deck.`, 'success');
    showToast(`Bulk Generator added ${generatedPuzzlesCount} unique puzzles!`);
  }

  function logBulkConsole(msg, type = 'info') {
    const p = document.createElement('div');
    p.className = `bulk-log-item ${type}`;
    p.textContent = msg;
    el.bulkLogConsole.appendChild(p);
    el.bulkLogConsole.scrollTop = el.bulkLogConsole.scrollHeight;
  }

  /* ==========================================================================
     SINGLE COMPILER WORKSPACE
     ========================================================================== */
  function renderStagedWords() {
    const container = el.stagedWordsList;
    container.innerHTML = '';

    state.stagedWords.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'staged-word-card';
      card.innerHTML = `
        <input type="text" class="paper-input paper-input-sm paper-input-mono staged-word-input" value="${escapeHTML(item.word)}" maxlength="15" spellcheck="false">
        <input type="text" class="paper-input paper-input-sm staged-clue-input" value="${escapeHTML(item.clue)}" placeholder="Clue definition...">
        <button type="button" class="btn-remove-staged" aria-label="Remove term">&times;</button>
      `;

      card.querySelector('.staged-word-input').addEventListener('input', (e) => {
        state.stagedWords[idx].word = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        e.target.value = state.stagedWords[idx].word;
      });

      card.querySelector('.staged-clue-input').addEventListener('input', (e) => {
        state.stagedWords[idx].clue = e.target.value;
      });

      card.querySelector('.btn-remove-staged').addEventListener('click', () => {
        state.stagedWords.splice(idx, 1);
        renderStagedWords();
      });

      container.appendChild(card);
    });
  }

  function stageSingleWord(item) {
    if (!state.stagedWords.some(w => w.word === item.word)) {
      state.stagedWords.push({ word: item.word, clue: item.clue });
      renderStagedWords();
      showToast(`Staged "${item.word}" for compilation.`);
    } else {
      showToast(`"${item.word}" is already in staging.`);
    }
  }

  function pullLeastUsedWords() {
    const tier = el.compPuzzleTier.value;
    const targetSize = TIER_SPECS[tier].size;
    const targetCount = tier === 'mini' ? 6 : (tier === 'midi' ? 10 : 16);

    const compatible = state.lexicon.filter(i => i.word.length >= 2 && i.word.length <= targetSize);
    if (compatible.length < 3) {
      alert(`Database requires at least 3 words of length <= ${targetSize}. Add more entries to the lexicon first.`);
      return;
    }

    compatible.sort((a, b) => {
      const diff = (a.usage || 0) - (b.usage || 0);
      return diff !== 0 ? diff : (Math.random() - 0.5);
    });

    state.stagedWords = compatible.slice(0, targetCount).map(i => ({ word: i.word, clue: i.clue }));
    renderStagedWords();
    showToast(`Staged ${state.stagedWords.length} least-used terms!`);
  }

  function runCompilerWorkflow() {
    const tier = el.compPuzzleTier.value;
    const targetSize = TIER_SPECS[tier].size;

    const validWords = state.stagedWords.filter(p => p.word.trim().length >= 2 && p.clue.trim().length > 0);
    if (validWords.length < 3) {
      alert(`Staging pool requires at least 3 valid word-clue pairs.`);
      return;
    }

    el.compilerStatusBadge.className = 'status-chip status-chip--ochre';
    el.compilerStatusBadge.textContent = 'Compiling...';

    const compiler = new AutoCrosswordCompiler(targetSize, validWords);
    const result = compiler.compile(200);

    if (!result) {
      el.compilerErrorBox.classList.remove('hidden');
      el.compilerErrorBox.innerHTML = `<strong>Could not build connected ${targetSize}×${targetSize} layout.</strong><br>Words may lack common intersecting characters. Try pulling more candidates or clicking "Reshuffle Layout".`;
      el.btnCommitToLedger.disabled = true;
      el.badgeBoardFit.className = 'status-chip status-chip--terracotta';
      el.badgeBoardFit.textContent = 'Fit Failed';
      el.compilerStatusBadge.className = 'status-chip status-chip--terracotta';
      el.compilerStatusBadge.textContent = 'Error';
      return;
    }

    el.compilerErrorBox.classList.add('hidden');
    state.currentCompiledBoard = result;
    el.btnCommitToLedger.disabled = false;
    el.compilerStatusBadge.className = 'status-chip status-chip--sage';
    el.compilerStatusBadge.textContent = 'Board Ready';

    renderBoardDisplay(result);
    renderLiveClueEditors(result);
    showToast(`Compiled ${targetSize}×${targetSize} layout with ${result.placedCount} words!`);
  }

  function renderBoardDisplay(result) {
    const { size, solutionGrid, blockGrid, numbering, placedCount, totalItems } = result;
    const canvas = el.compilerGridCanvas;
    canvas.innerHTML = '';
    canvas.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    canvas.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'board-cell';

        if (blockGrid[r][c]) {
          cell.classList.add('cell-black');
        } else {
          const num = numbering[`${r},${c}`];
          if (num) {
            const numEl = document.createElement('span');
            numEl.className = 'board-cell-num';
            numEl.textContent = num;
            cell.appendChild(numEl);
          }
          const char = solutionGrid[r][c];
          if (char) {
            const charEl = document.createElement('span');
            charEl.className = 'board-cell-char';
            charEl.textContent = char;
            cell.appendChild(charEl);
          }
        }
        canvas.appendChild(cell);
      }
    }

    el.badgeBoardFit.className = 'status-chip status-chip--sage';
    el.badgeBoardFit.textContent = `${placedCount}/${totalItems} Placed`;
    el.boardMetaCaption.textContent = `${size}×${size} grid with ${result.acrossClues.length + result.downClues.length} total active clues.`;
  }

  function renderLiveClueEditors(result) {
    el.countAcrossClues.textContent = result.acrossClues.length;
    el.countDownClues.textContent   = result.downClues.length;

    const renderColumn = (container, clues, dir) => {
      container.innerHTML = '';
      clues.forEach((c, idx) => {
        const card = document.createElement('div');
        card.className = 'clue-edit-card';
        card.innerHTML = `
          <div class="clue-edit-meta">
            <span class="clue-num-tag">${c.num}. ${dir.toUpperCase()}</span>
            <span class="clue-word-tag">${escapeHTML(c.word)} (${c.word.length})</span>
          </div>
          <input type="text" class="clue-live-input" value="${escapeHTML(c.clue)}">
        `;
        card.querySelector('.clue-live-input').addEventListener('input', (e) => {
          clues[idx].clue = e.target.value;
        });
        container.appendChild(card);
      });
    };

    renderColumn(el.listAcrossEditor, result.acrossClues, 'across');
    renderColumn(el.listDownEditor, result.downClues, 'down');
  }

  function commitBoardToLedgerDeck() {
    if (!state.currentCompiledBoard) return;

    const title = el.compPuzzleTitle.value.trim() || 'Speakeasy Edition';
    const tier = el.compPuzzleTier.value;
    const { gridString, acrossClues, downClues, size, usedWords } = state.currentCompiledBoard;

    const acrossCluesFormatted = acrossClues.map(c => `${c.num}. ${c.clue.trim()}`).join(' | ');
    const downCluesFormatted   = downClues.map(c => `${c.num}. ${c.clue.trim()}`).join(' | ');

    const newPuzzle = {
      id: `puz_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      tier,
      title,
      grid: gridString,
      clues_across: acrossCluesFormatted,
      clues_down: downCluesFormatted,
      size,
      wordCount: acrossClues.length + downClues.length,
      usedWords
    };

    usedWords.forEach(w => {
      const dbMatch = state.lexicon.find(i => i.word === w);
      if (dbMatch) {
        dbMatch.usage = (dbMatch.usage || 0) + 1;
      }
    });

    state.puzzles.push(newPuzzle);
    persistLexicon();
    persistPuzzles();

    renderLexiconView();
    updateDeckView();
    updateExportAuditView();

    showToast(`Committed "${title}" to deck & updated word usage!`);
    switchTab('tab-deck');
  }

  /* ==========================================================================
     DECK & EXPORT PIPELINE
     ========================================================================== */
  function updateDeckView() {
    const tbody = el.deckTableBody;
    tbody.innerHTML = '';

    const filterText = el.deckSearchInput.value.toLowerCase().trim();
    const filterTier = el.deckTierFilter.value;

    const filtered = state.puzzles.filter(p => {
      const matchTier = (filterTier === 'all' || p.tier === filterTier);
      const matchText = !filterText || p.title.toLowerCase().includes(filterText);
      return matchTier && matchText;
    });

    el.deckEmptyState.classList.toggle('hidden', state.puzzles.length > 0);
    el.navDeckPill.textContent = state.puzzles.length;
    el.statTotalPuzzles.textContent = `${state.puzzles.length} Puzzles`;

    filtered.forEach((puz, idx) => {
      const tr = document.createElement('tr');
      const rows = puz.grid.split('/');
      const sizeStr = `${rows[0].length}×${rows.length}`;

      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td><strong>${escapeHTML(puz.title)}</strong></td>
        <td><span class="tier-pill-badge tier-${puz.tier}">${puz.tier}</span></td>
        <td>${sizeStr}</td>
        <td>${puz.wordCount} words</td>
        <td><span class="status-chip status-chip--sage">Ready</span></td>
        <td>
          <div class="table-actions">
            <button type="button" class="interactive-tactile btn-danger btn-sm btn-del-puz" data-idx="${state.puzzles.indexOf(puz)}" title="Remove puzzle">&times;</button>
          </div>
        </td>
      `;

      tr.querySelector('.btn-del-puz').addEventListener('click', () => {
        if (confirm(`Remove "${puz.title}" from active deck?`)) {
          state.puzzles.splice(state.puzzles.indexOf(puz), 1);
          persistPuzzles();
          updateDeckView();
          updateExportAuditView();
          showToast('Puzzle removed.');
        }
      });

      tbody.appendChild(tr);
    });
  }

  function updateExportAuditView() {
    let validCount = 0;
    let errorCount = 0;
    const issues = [];

    state.puzzles.forEach((rec, idx) => {
      const recIssues = [];
      if (!rec.title?.trim()) recIssues.push('Empty title');
      if (!['mini', 'midi', 'main', 'standard'].includes(rec.tier?.toLowerCase())) {
        recIssues.push(`Non-standard tier: "${rec.tier}"`);
      }
      
      const rows = (rec.grid || '').split(/[\/\r\n]+/).filter(Boolean);
      if (rows.length < 3) {
        recIssues.push('Grid has fewer than 3 rows');
      } else {
        const expectedW = rows[0].length;
        if (rows.some(r => r.length !== expectedW)) {
          recIssues.push('Unequal row widths in grid');
        }
      }

      if (!rec.clues_across?.trim()) recIssues.push('Missing Across clues');
      if (!rec.clues_down?.trim()) recIssues.push('Missing Down clues');

      if (recIssues.length > 0) {
        errorCount++;
        issues.push(`<strong>#${idx + 1} (${escapeHTML(rec.title || 'Untitled')}):</strong> ${recIssues.join(', ')}`);
      } else {
        validCount++;
      }
    });

    el.auditTotalPuzzles.textContent = state.puzzles.length;
    el.auditValidPuzzles.textContent = validCount;
    el.auditErrorPuzzles.textContent = errorCount;

    if (issues.length === 0) {
      el.exportValidationFeedback.innerHTML = `<span class="text-sage">✔ All ${state.puzzles.length} records conform strictly to the Cocktail Lounge engine standard.</span>`;
    } else {
      el.exportValidationFeedback.innerHTML = issues.join('<br>');
    }

    const pBody = el.previewTableBody;
    pBody.innerHTML = '';
    state.puzzles.slice(0, 25).forEach(rec => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHTML(rec.tier)}</td>
        <td>${escapeHTML(rec.title)}</td>
        <td>${escapeHTML(rec.grid)}</td>
        <td>${escapeHTML(rec.clues_across)}</td>
        <td>${escapeHTML(rec.clues_down)}</td>
      `;
      pBody.appendChild(tr);
    });

    el.rawCsvTextarea.value = serializeToCSV(state.puzzles);
  }

  /* ==========================================================================
     STORAGE PERSISTENCE
     ========================================================================== */
  function loadStoredData() {
    try {
      const lexRaw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.lexiconDb);
      if (lexRaw) {
        state.lexicon = JSON.parse(lexRaw);
      } else {
        state.lexicon = SEED_LEXICON.map((item, idx) => ({
          id: `seed_${idx + 1}`,
          ...item,
          createdAt: Date.now() - (SEED_LEXICON.length - idx) * 1000
        }));
        persistLexicon();
      }

      const puzRaw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.puzzlesDeck);
      if (puzRaw) {
        state.puzzles = JSON.parse(puzRaw);
      }
    } catch {}
  }

  function persistLexicon() {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.lexiconDb, JSON.stringify(state.lexicon));
    } catch {}
  }

  function persistPuzzles() {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.puzzlesDeck, JSON.stringify(state.puzzles));
    } catch {}
  }

  /* ==========================================================================
     UNIVERSAL NAVIGATION & UI DYNAMICS
     ========================================================================== */
  function switchTab(targetTabId, pushHistory = true) {
    if (pushHistory && state.activeTab !== targetTabId) {
      state.navigationHistory.push(state.activeTab);
    }
    state.activeTab = targetTabId;

    el.navTabs.forEach(t => {
      const isActive = t.dataset.tab === targetTabId;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    el.tabContents.forEach(c => {
      c.classList.toggle('active', c.id === targetTabId);
    });

    // Sync Bottom Dock
    const dockButtons = document.querySelectorAll('.nav-tab-item');
    dockButtons.forEach(btn => {
      btn.classList.toggle('nav-tab-item--active', btn.dataset.tab === targetTabId);
    });

    if (targetTabId === 'tab-export') {
      updateExportAuditView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackNavigation() {
    triggerHapticPulse();
    if (state.navigationHistory.length > 0) {
      const previousTab = state.navigationHistory.pop();
      switchTab(previousTab, false);
    } else {
      switchTab(APP_CONFIG.navigation.defaultFallbackRoute, false);
    }
  }

  function renderMobileBottomDock() {
    const container = el.bottomDockNavItems;
    container.innerHTML = '';

    const iconMap = {
      book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
      grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      batch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      deck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>`,
      export: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`
    };

    APP_CONFIG.navigation.items.filter(item => item.showInBottomBar).forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `nav-tab-item ${item.id === state.activeTab ? 'nav-tab-item--active' : ''}`;
      btn.dataset.tab = item.id;
      btn.innerHTML = `
        ${iconMap[item.icon] || ''}
        <span>${escapeHTML(item.label)}</span>
        <span class="nav-tab-item__indicator"></span>
      `;
      btn.addEventListener('click', () => {
        triggerHapticPulse();
        switchTab(item.id);
      });
      container.appendChild(btn);
    });
  }

  function hydrateBrandingFromConfig() {
    document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;
    el.pageEyebrowSlot.textContent = APP_CONFIG.content.headers.defaultEyebrow;
    el.pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
    el.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
    el.appVersionBadge.textContent = `v${APP_CONFIG.identity.version}`;
    el.backButtonLabel.textContent = APP_CONFIG.content.actions.back;
  }

  function showToast(msg) {
    el.toastNotify.textContent = msg;
    el.toastNotify.classList.remove('hidden');
    el.toastNotify.style.opacity = '1';
    setTimeout(() => {
      el.toastNotify.style.opacity = '0';
      setTimeout(() => el.toastNotify.classList.add('hidden'), 200);
    }, 2400);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function openModal(m) { if (m) m.classList.remove('hidden'); }
  function closeModal(m) { if (m) m.classList.add('hidden'); }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  }

  /* ==========================================================================
     GLOBAL EVENT LISTENERS
     ========================================================================== */
  function bindEvents() {
    // Universal Back Navigation
    el.btnGlobalBack.addEventListener('click', handleBackNavigation);

    // Desktop Tab Switching
    el.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        triggerHapticPulse();
        switchTab(tab.dataset.tab);
      });
    });

    // Tactile Audio/Vibration simulation on all primary triggers
    document.addEventListener('click', (e) => {
      if (e.target.closest('.interactive-tactile, .btn-pill-action, .btn-back-nav')) {
        triggerHapticPulse();
      }
    });

    el.btnQuickExportHead.addEventListener('click', () => switchTab('tab-export'));
    el.btnGotoCompiler.addEventListener('click', () => switchTab('tab-compiler'));
    el.btnGotoBulk.addEventListener('click', () => switchTab('tab-bulk-maker'));
    el.btnDeckCreateFirst.addEventListener('click', () => switchTab('tab-bulk-maker'));

    // Lexicon Form Addition
    el.formAddLexicon.addEventListener('submit', (e) => {
      e.preventDefault();
      const word = el.lexInputWord.value;
      const clue = el.lexInputClue.value;
      const category = el.lexInputCategory.value;

      if (addLexiconEntry(word, clue, category)) {
        el.lexInputWord.value = '';
        el.lexInputClue.value = '';
        el.lexInputWord.focus();
      }
    });

    el.lexSearchInput.addEventListener('input', renderLexiconView);
    el.lexFilterUsage.addEventListener('change', renderLexiconView);
    el.lexFilterLength.addEventListener('change', renderLexiconView);
    el.lexSortOrder.addEventListener('change', renderLexiconView);

    el.checkAllLexicon.addEventListener('change', (e) => {
      const checked = e.target.checked;
      const visibleCheckboxes = el.tbodyLexicon.querySelectorAll('.check-lex-item');
      visibleCheckboxes.forEach(cb => {
        cb.checked = checked;
        const id = cb.dataset.id;
        if (checked) state.selectedLexiconIds.add(id);
        else state.selectedLexiconIds.delete(id);
      });
      updateBatchCount();
    });

    // Send selection to Bulk Maker
    el.btnBatchSendBulk.addEventListener('click', () => {
      if (!state.selectedLexiconIds.size) {
        alert('Please select words from the lexicon table first.');
        return;
      }
      const defaultCap = parseInt(el.bulkDefaultCap.value, 10) || 1;
      let added = 0;
      state.selectedLexiconIds.forEach(id => {
        const item = state.lexicon.find(i => i.id === id);
        if (item && !state.bulkPool.some(w => w.word === item.word)) {
          state.bulkPool.push({
            id: item.id,
            word: item.word,
            clue: item.clue,
            usage: item.usage || 0,
            allowedCount: defaultCap,
            remainingCount: defaultCap
          });
          added++;
        }
      });
      renderBulkWordsPool();
      switchTab('tab-bulk-maker');
      showToast(`Staged ${added} words into Bulk Maker.`);
    });

    // Send selection to Single Compiler
    el.btnBatchSendCompiler.addEventListener('click', () => {
      if (!state.selectedLexiconIds.size) {
        alert('Please select words from the lexicon table first.');
        return;
      }
      let added = 0;
      state.selectedLexiconIds.forEach(id => {
        const item = state.lexicon.find(i => i.id === id);
        if (item && !state.stagedWords.some(w => w.word === item.word)) {
          state.stagedWords.push({ word: item.word, clue: item.clue });
          added++;
        }
      });
      renderStagedWords();
      switchTab('tab-compiler');
      showToast(`Staged ${added} words into single compiler.`);
    });

    el.btnBatchDelete.addEventListener('click', () => {
      if (!state.selectedLexiconIds.size) return;
      if (confirm(`Permanently delete ${state.selectedLexiconIds.size} terms from lexicon database?`)) {
        state.lexicon = state.lexicon.filter(i => !state.selectedLexiconIds.has(i.id));
        state.selectedLexiconIds.clear();
        persistLexicon();
        renderLexiconView();
        showToast('Selected entries removed.');
      }
    });

    // Bulk Paste Modal
    el.btnOpenBulkModal.addEventListener('click', () => openModal(el.modalBulkPaste));
    el.btnApplyBulk.addEventListener('click', () => {
      const lines = el.textareaBulkInput.value.split(/\r?\n/).filter(l => l.trim());
      let count = 0;

      lines.forEach(line => {
        const catMatch = line.match(/\[(.*?)\]/);
        const category = catMatch ? catMatch[1] : 'General';
        const stripped = line.replace(/\[(.*?)\]/, '').trim();

        const match = stripped.match(/^([^:\-]+)[:\-]\s*(.+)$/);
        if (match) {
          const word = match[1].trim();
          const clue = match[2].trim();
          if (word && clue) {
            addLexiconEntry(word, clue, category);
            count++;
          }
        }
      });

      if (count > 0) {
        closeModal(el.modalBulkPaste);
        el.textareaBulkInput.value = '';
        renderLexiconView();
        showToast(`Imported ${count} records into Lexicon.`);
      } else {
        alert('Could not find valid lines. Format should be: ANSWER: Clue definition [Category]');
      }
    });

    // Edit Lexicon Modal Save
    el.btnSaveEditLexicon.addEventListener('click', () => {
      const id = el.editLexId.value;
      const item = state.lexicon.find(i => i.id === id);
      if (item) {
        item.word = el.editLexWord.value.toUpperCase().replace(/[^A-Z]/g, '').trim();
        item.clue = el.editLexClue.value.trim();
        item.category = el.editLexCategory.value.trim();
        item.usage = parseInt(el.editLexUsage.value, 10) || 0;
        persistLexicon();
        renderLexiconView();
        closeModal(el.modalEditLexicon);
        showToast('Lexicon entry updated.');
      }
    });

    // Single Compiler Controls
    el.btnPullUnused.addEventListener('click', pullLeastUsedWords);
    el.btnClearStaging.addEventListener('click', () => {
      state.stagedWords = [];
      renderStagedWords();
    });
    el.btnAddStagedRow.addEventListener('click', () => {
      state.stagedWords.push({ word: '', clue: '' });
      renderStagedWords();
    });
    el.btnRunCompiler.addEventListener('click', runCompilerWorkflow);
    el.btnReshuffleCompile.addEventListener('click', runCompilerWorkflow);
    el.btnDiscardBoard.addEventListener('click', () => {
      state.currentCompiledBoard = null;
      el.compilerGridCanvas.innerHTML = '';
      el.listAcrossEditor.innerHTML = '';
      el.listDownEditor.innerHTML = '';
      el.btnCommitToLedger.disabled = true;
      el.badgeBoardFit.textContent = 'Awaiting Compile';
      el.badgeBoardFit.className = 'status-chip status-chip--ochre';
      el.boardMetaCaption.textContent = 'No board generated yet. Click "Auto-Compile Crossword Board" to build.';
    });
    el.btnCommitToLedger.addEventListener('click', commitBoardToLedgerDeck);

    // Bulk Maker Controls
    el.btnBulkLoadAllDb.addEventListener('click', loadAllLexiconIntoBulk);
    el.btnBulkApplyCaps.addEventListener('click', applyDefaultCapToAllBulk);
    el.btnBulkClearSelection.addEventListener('click', () => {
      state.bulkPool = [];
      renderBulkWordsPool();
    });
    el.btnRunBulkGenerator.addEventListener('click', executeBulkGeneration);

    // Deck Controls
    el.deckSearchInput.addEventListener('input', updateDeckView);
    el.deckTierFilter.addEventListener('change', updateDeckView);
    el.btnDeckClearAll.addEventListener('click', () => {
      if (confirm('Clear all puzzles from the deck? (Lexicon database records are preserved).')) {
        state.puzzles = [];
        persistPuzzles();
        updateDeckView();
        updateExportAuditView();
        showToast('Deck cleared.');
      }
    });

    // Export Controls
    el.btnViewTable.addEventListener('click', () => {
      el.btnViewTable.classList.add('active');
      el.btnViewRaw.classList.remove('active');
      el.previewModeTable.classList.remove('hidden');
      el.previewModeRaw.classList.add('hidden');
    });

    el.btnViewRaw.addEventListener('click', () => {
      el.btnViewRaw.classList.add('active');
      el.btnViewTable.classList.remove('active');
      el.previewModeRaw.classList.remove('hidden');
      el.previewModeTable.classList.add('hidden');
      el.rawCsvTextarea.value = serializeToCSV(state.puzzles);
    });

    el.btnDownloadAll.addEventListener('click', () => {
      if (!state.puzzles.length) {
        alert('Deck has no puzzles. Compile puzzles first!');
        return;
      }
      const filename = el.exportFilenameInput.value.trim() || 'puzzles.csv';
      downloadFile(serializeToCSV(state.puzzles), filename, 'text/csv;charset=utf-8;');
    });

    el.btnCopyClipboard.addEventListener('click', async () => {
      const csv = serializeToCSV(state.puzzles);
      try {
        await navigator.clipboard.writeText(csv);
        showToast('CSV copied to clipboard!');
      } catch {
        alert('Failed to copy to clipboard.');
      }
    });

    el.btnExportLexiconJson.addEventListener('click', () => {
      const json = JSON.stringify(state.lexicon, null, 2);
      downloadFile(json, 'lexicon_backup.json', 'application/json');
    });

    el.btnDownloadTemplate.addEventListener('click', () => {
      downloadFile(EXPECTED_HEADERS.join(',') + '\n', 'puzzles_template.csv', 'text/csv;charset=utf-8;');
    });

    el.btnSeedLexicon.addEventListener('click', () => {
      if (confirm('Seed default architectural cocktail glossary entries into lexicon?')) {
        let added = 0;
        SEED_LEXICON.forEach(seed => {
          if (!state.lexicon.some(i => i.word === seed.word)) {
            state.lexicon.push({
              id: `seed_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              ...seed,
              createdAt: Date.now()
            });
            added++;
          }
        });
        persistLexicon();
        renderLexiconView();
        showToast(`Added ${added} glossary entries.`);
      }
    });

    // CSV File Upload Ingestion
    el.fileInputCsv.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const rows = parseCSV(ev.target.result);
          if (!rows.length) throw new Error('File is empty.');

          const headers = rows[0].map(h => h.toLowerCase());
          if (!EXPECTED_HEADERS.every(h => headers.includes(h))) {
            throw new Error(`CSV must include headers: ${EXPECTED_HEADERS.join(', ')}`);
          }

          const tierIdx = headers.indexOf('tier');
          const titleIdx = headers.indexOf('title');
          const gridIdx = headers.indexOf('grid');
          const acrossIdx = headers.indexOf('clues_across');
          const downIdx = headers.indexOf('clues_down');

          const importedPuzzles = [];
          rows.slice(1).forEach((cols, idx) => {
            if (!cols || !cols.some(c => c.trim())) return;
            importedPuzzles.push({
              id: `import_${idx + 1}`,
              tier: cols[tierIdx] || 'standard',
              title: cols[titleIdx] || `Imported #${idx + 1}`,
              grid: cols[gridIdx] || '',
              clues_across: cols[acrossIdx] || '',
              clues_down: cols[downIdx] || '',
              size: cols[gridIdx]?.split('/')[0]?.length || 15,
              wordCount: (cols[acrossIdx]?.split('|').length || 0) + (cols[downIdx]?.split('|').length || 0),
              usedWords: []
            });
          });

          state.puzzles = importedPuzzles;
          persistPuzzles();
          updateDeckView();
          updateExportAuditView();
          switchTab('tab-deck');
          showToast(`Imported ${importedPuzzles.length} puzzles into deck!`);
        } catch (err) {
          alert('CSV Import Error: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    // Modal Close Directives
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
    });
  }

  /* ==========================================================================
     APPLICATION BOOTSTRAP
     ========================================================================== */
  function init() {
    hydrateBrandingFromConfig();
    renderMobileBottomDock();
    loadStoredData();
    bindEvents();
    renderLexiconView();
    renderStagedWords();
    renderBulkWordsPool();
    updateDeckView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();