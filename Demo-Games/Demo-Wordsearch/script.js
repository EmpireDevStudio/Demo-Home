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
    appId: "lexical-paper-suite",
    appName: "Word Search",
    appTagline: "Tactile Lexical Discovery & Editorial Archives",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US"
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoAlt: "Editorial Ledger Seal",
    accentColor: "#963E35",       // Accessible Terracotta Text/Accent
    accentSecondary: "#3E5B42",   // Accessible Sage Green Text/Accent
    accentHighlight: "#6E5614",   // Accessible Ochre Text/Accent
    fontFamilyBase: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontFamilySerif: "'Source Serif 4', Georgia, serif"
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "menu",
    items: [
      {
        id: "nav-menu",
        label: "Overview",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        viewTarget: "menu"
      },
      {
        id: "nav-vault",
        label: "Vault",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>`,
        viewTarget: "vault"
      },
      {
        id: "nav-stats",
        label: "Ledger",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`,
        modalTarget: "modalStats"
      },
      {
        id: "nav-rules",
        label: "Etiquette",
        icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
        modalTarget: "modalRules"
      }
    ]
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      menuEyebrow: "CHALLENGE OF THE DAY",
      menuTitle: "Word Search",
      menuSubtitle: "Uncover themed lexical sequences across handcrafted orthographic grids.",
      vaultEyebrow: "ARCHIVAL RECORDS",
      vaultTitle: "The Vault",
      vaultSubtitle: "Comprehensive registry of past editions and multi-tier solutions."
    },
    notifications: {
      linkCopied: "Ledger challenge link copied to clipboard.",
      hapticsEnabled: "Tactile vibration enabled.",
      hapticsDisabled: "Tactile vibration disabled."
    },
    storageKeys: {
      userPreferences: "editorial_ws_prefs_v2",
      gameState: "editorial_ws_ledger_v2"
    }
  },

  // 5. CYCLE & DATA SOURCES
  cycle: {
    anchorYear: 2025,
    anchorMonth: 1, // January (1-based)
    anchorDay: 1,
    sourceUrl: "puzzles.csv"
  },


  // 7. FEATURE TOGGLES
  features: {
    enableHapticFeedback: true,
    enableSpecularHighlights: true
  }
});

(() => {
  'use strict';

  // ==========================================================================
  // APPLICATION STATE
  // ==========================================================================
  const STATE = {
    puzzles: [],
    todayPuzzle: null,
    activePuzzle: null,
    activeTier: 'mini',
    gridSize: 8,
    gridData: null,
    placedWords: [],
    foundWords: new Set(),
    foundCoords: new Set(),
    isSelecting: false,
    startCell: null,
    currentCoords: [],
    timerSeconds: 0,
    timerInterval: null,
    isSolved: false,
    currentView: 'menu',
    previousView: 'menu',
    settings: {
      haptics: APP_CONFIG.features.enableHapticFeedback,
      lighting: APP_CONFIG.features.enableSpecularHighlights
    },
    userData: {
      stats: { played: 0, solved: 0, streak: 0, bestStreak: 0 },
      history: {}
    }
  };

  // ==========================================================================
  // DOM ELEMENT CACHE
  // ==========================================================================
  const DOM = {
    appHeader: document.getElementById('appHeader'),
    btnHeaderBack: document.getElementById('btnHeaderBack'),
    lblHeaderBack: document.getElementById('lblHeaderBack'),
    pageEyebrow: document.getElementById('pageEyebrow'),
    pageTitle: document.getElementById('pageTitle'),
    pageSubtitle: document.getElementById('pageSubtitle'),

    viewMenu: document.getElementById('viewMenu'),
    viewGame: document.getElementById('viewGame'),
    viewVault: document.getElementById('viewVault'),
    viewError: document.getElementById('viewError'),
    errorHeading: document.getElementById('errorHeading'),
    errorMessage: document.getElementById('errorMessage'),
    btnErrorRetry: document.getElementById('btnErrorRetry'),

    lblCalendarDate: document.getElementById('lblCalendarDate'),
    lblDailyTitle: document.getElementById('lblDailyTitle'),
    btnStartDaily: document.getElementById('btnStartDaily'),
    btnNavVault: document.getElementById('btnNavVault'),
    btnNavRules: document.getElementById('btnNavRules'),
    btnNavSettings: document.getElementById('btnNavSettings'),

    tierTabs: document.querySelectorAll('.tier-tab-btn'),
    gameFoundCounter: document.getElementById('gameFoundCounter'),
    gameTimerValue: document.getElementById('gameTimerValue'),
    gameSelectionPreview: document.getElementById('gameSelectionPreview'),
    grid: document.getElementById('grid'),
    wordChipsList: document.getElementById('wordChipsList'),
    vaultFeed: document.getElementById('vaultFeed'),

    bottomDockNav: document.getElementById('bottomDockNav'),
    btnQuickStats: document.getElementById('btnQuickStats'),
    btnShareApp: document.getElementById('btnShareApp'),

    modalStats: document.getElementById('modalStats'),
    statPlayed: document.getElementById('statPlayed'),
    statSolved: document.getElementById('statSolved'),
    statStreak: document.getElementById('statStreak'),
    statBestStreak: document.getElementById('statBestStreak'),

    modalRules: document.getElementById('modalRules'),
    modalSettings: document.getElementById('modalSettings'),
    btnToggleHaptics: document.getElementById('btnToggleHaptics'),
    btnToggleLighting: document.getElementById('btnToggleLighting'),

    modalVictory: document.getElementById('modalVictory'),
    victorySubtitle: document.getElementById('victorySubtitle'),
    btnVictoryAdvance: document.getElementById('btnVictoryAdvance'),

    appToast: document.getElementById('appToast')
  };

  // ==========================================================================
  // HAPTIC ENGINE
  // ==========================================================================
  function triggerHapticPulse(duration = 12) {
    if (
      STATE.settings.haptics &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator
    ) {
      try {
        navigator.vibrate(duration);
      } catch (_) {}
    }
  }

  // ==========================================================================
  // STORAGE SYSTEM
  // ==========================================================================
  function loadStorage() {
    try {
      const rawUser = localStorage.getItem(APP_CONFIG.content.storageKeys.gameState);
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed.stats) STATE.userData.stats = { ...STATE.userData.stats, ...parsed.stats };
        if (parsed.history) STATE.userData.history = parsed.history;
      }

      const rawPrefs = localStorage.getItem(APP_CONFIG.content.storageKeys.userPreferences);
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs);
        if (typeof prefs.haptics === 'boolean') STATE.settings.haptics = prefs.haptics;
        if (typeof prefs.lighting === 'boolean') STATE.settings.lighting = prefs.lighting;
      }
    } catch (_) {}
  }

  function saveStorage() {
    try {
      localStorage.setItem(APP_CONFIG.content.storageKeys.gameState, JSON.stringify(STATE.userData));
      localStorage.setItem(APP_CONFIG.content.storageKeys.userPreferences, JSON.stringify(STATE.settings));
    } catch (_) {}
  }

  // ==========================================================================
  // CALENDAR ARITHMETIC & SELECTION
  // ==========================================================================
  function getTodayDateFormatted() {
    try {
      return new Intl.DateTimeFormat(APP_CONFIG.identity.locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(new Date());
    } catch (_) {
      return new Date().toLocaleDateString();
    }
  }

  function calculateDailyIndex(total) {
    if (total <= 0) return 0;
    const now = new Date();
    const currentUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const anchorUtc = Date.UTC(
      APP_CONFIG.cycle.anchorYear,
      APP_CONFIG.cycle.anchorMonth - 1,
      APP_CONFIG.cycle.anchorDay
    );
    const msPerDay = 86400000;
    const diffDays = Math.floor((currentUtc - anchorUtc) / msPerDay);
    return Math.abs(diffDays) % total;
  }

  // ==========================================================================
  // DETERMINISTIC BOARD GENERATOR
  // ==========================================================================
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

  function generateBoard(words, size, seedKey) {
    const rng = createRNG(seedKey);
    const grid = Array.from({ length: size }, () => Array(size).fill(''));
    const placed = [];

    const dirs = [
      [0, 1], [1, 0], [1, 1], [-1, 1],
      [0, -1], [-1, 0], [-1, -1], [1, -1]
    ];

    const cleanWords = words
      .map(w => w.trim().toUpperCase().replace(/[^A-Z]/g, ''))
      .filter(w => w.length >= 2 && w.length <= size)
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
          if (cell !== '' && cell !== word[i]) {
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
    });

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!grid[r][c]) grid[r][c] = alphabet[Math.floor(rng() * alphabet.length)];
      }
    }

    return { grid, placed };
  }

  // ==========================================================================
  // CSV PARSER
  // ==========================================================================
  function parseCSV(text) {
    const lines = [];
    let row = [], token = '', inQuote = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i + 1];
      if (inQuote) {
        if (ch === '"' && next === '"') { token += '"'; i++; }
        else if (ch === '"') { inQuote = false; }
        else { token += ch; }
      } else {
        if (ch === '"') inQuote = true;
        else if (ch === ',') { row.push(token.trim()); token = ''; }
        else if (ch === '\n' || ch === '\r') {
          if (token || row.length) { row.push(token.trim()); lines.push(row); }
          row = []; token = '';
          if (ch === '\r' && next === '\n') i++;
        } else {
          token += ch;
        }
      }
    }
    if (token || row.length) { row.push(token.trim()); lines.push(row); }
    if (lines.length < 2) return [];

    const headers = lines[0].map(h => h.trim().toLowerCase());
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.some(c => c.trim().length > 0)) continue;
      const rec = {};
      headers.forEach((h, idx) => { rec[h] = line[idx] || ''; });
      if (rec.title || rec.mini || rec.midi || rec.main) {
        records.push({
          id: rec.id ? String(rec.id).trim() : `issue_${i}`,
          title: rec.title ? rec.title.trim() : `Ledger Issue #${i}`,
          mini: rec.mini || '',
          midi: rec.midi || '',
          main: rec.main || '',
          ...rec
        });
      }
    }
    return records;
  }

  // ==========================================================================
  // NAVIGATION & VIEW CONTROLLER
  // ==========================================================================
  function showView(viewName) {
    STATE.previousView = STATE.currentView;
    STATE.currentView = viewName;

    DOM.viewMenu.classList.toggle('hidden', viewName !== 'menu');
    DOM.viewGame.classList.toggle('hidden', viewName !== 'game');
    DOM.viewVault.classList.toggle('hidden', viewName !== 'vault');
    DOM.viewError.classList.add('hidden');

    // Header Content Hydration
    if (viewName === 'menu') {
      DOM.pageEyebrow.textContent = APP_CONFIG.content.headers.menuEyebrow;
      DOM.pageTitle.textContent = APP_CONFIG.content.headers.menuTitle;
      DOM.pageSubtitle.textContent = APP_CONFIG.content.headers.menuSubtitle;
      DOM.btnHeaderBack.classList.add('hidden');
    } else if (viewName === 'game') {
      DOM.pageEyebrow.textContent = `SCALE: ${STATE.activeTier.toUpperCase()} (${STATE.gridSize}×${STATE.gridSize})`;
      DOM.pageTitle.textContent = STATE.activePuzzle ? STATE.activePuzzle.title : APP_CONFIG.content.headers.menuTitle;
      DOM.pageSubtitle.textContent = "Connect adjacent letters across straight vectors to mark off terms.";
      DOM.btnHeaderBack.classList.remove('hidden');
      DOM.lblHeaderBack.textContent = STATE.previousView === 'vault' ? 'Vault' : 'Overview';
    } else if (viewName === 'vault') {
      DOM.pageEyebrow.textContent = APP_CONFIG.content.headers.vaultEyebrow;
      DOM.pageTitle.textContent = APP_CONFIG.content.headers.vaultTitle;
      DOM.pageSubtitle.textContent = APP_CONFIG.content.headers.vaultSubtitle;
      DOM.btnHeaderBack.classList.remove('hidden');
      DOM.lblHeaderBack.textContent = 'Overview';
      renderVault();
    }

    // Synchronize bottom dock indicators
    document.querySelectorAll('.nav-tab-item').forEach(item => {
      const isTarget = item.dataset.viewTarget === viewName;
      item.classList.toggle('nav-tab-item--active', isTarget);
      item.setAttribute('aria-current', isTarget ? 'page' : 'false');
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function renderBottomDock() {
    DOM.bottomDockNav.innerHTML = '';
    APP_CONFIG.navigation.items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nav-tab-item interactive-tactile';
      btn.dataset.id = item.id;
      if (item.viewTarget) btn.dataset.viewTarget = item.viewTarget;
      if (item.modalTarget) btn.dataset.modalTarget = item.modalTarget;

      btn.innerHTML = `
        ${item.icon}
        <span>${item.label}</span>
        <span class="nav-tab-item__indicator"></span>
      `;

      btn.addEventListener('click', () => {
        triggerHapticPulse(14);
        if (item.viewTarget) {
          if (item.viewTarget === 'menu') {
            showView('menu');
          } else if (item.viewTarget === 'vault') {
            showView('vault');
          }
        } else if (item.modalTarget) {
          openModal(item.modalTarget);
        }
      });

      DOM.bottomDockNav.appendChild(btn);
    });
  }

  function renderMenu() {
    DOM.lblCalendarDate.textContent = getTodayDateFormatted();
    if (STATE.todayPuzzle) {
      DOM.lblDailyTitle.textContent = STATE.todayPuzzle.title;
    }
  }

  function renderVault() {
    DOM.vaultFeed.innerHTML = '';
    STATE.puzzles.forEach((puzzle, index) => {
      const card = document.createElement('article');
      card.className = 'vault-card interactive-tactile';
      card.setAttribute('role', 'listitem');
      card.tabIndex = 0;

      const isDone = tier => !!STATE.userData.history[`${puzzle.id}_${tier}`];

      card.innerHTML = `
        <div>
          <h3 class="vault-card__title">${puzzle.title}</h3>
          <p class="vault-card__meta">Archive Entry #${index + 1}</p>
        </div>
        <div class="vault-badges-group">
          <span class="vault-tier-badge ${isDone('mini') ? 'solved' : ''}">Mini</span>
          <span class="vault-tier-badge ${isDone('midi') ? 'solved' : ''}">Midi</span>
          <span class="vault-tier-badge ${isDone('main') ? 'solved' : ''}">Main</span>
        </div>
      `;

      const launch = () => {
        triggerHapticPulse(16);
        STATE.activePuzzle = puzzle;
        startTier('mini');
      };

      card.addEventListener('click', launch);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          launch();
        }
      });

      DOM.vaultFeed.appendChild(card);
    });
  }

  // ==========================================================================
  // GAMEPLAY ENGINE
  // ==========================================================================
  function startTier(tier) {
    STATE.activeTier = tier;
    STATE.gridSize = tier === 'mini' ? 8 : tier === 'midi' ? 10 : 12;

    const puzzle = STATE.activePuzzle || STATE.todayPuzzle;
    const rawWords = puzzle[tier] || '';
    const words = rawWords.split(',').map(w => w.trim()).filter(Boolean);

    const seed = `${puzzle.id}_${tier}`;
    const generated = generateBoard(words, STATE.gridSize, seed);

    STATE.gridData = generated.grid;
    STATE.placedWords = generated.placed;
    STATE.foundWords = new Set();
    STATE.foundCoords = new Set();
    STATE.currentCoords = [];
    STATE.isSelecting = false;
    STATE.startCell = null;

    DOM.tierTabs.forEach(tab => {
      const active = tab.dataset.tier === tier;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    const key = `${puzzle.id}_${tier}`;
    const past = STATE.userData.history[key];
    STATE.isSolved = !!past;

    if (STATE.isSolved) {
      STATE.timerSeconds = past.time || 0;
      clearInterval(STATE.timerInterval);
      STATE.placedWords.forEach(pw => {
        STATE.foundWords.add(pw.word);
        pw.coords.forEach(c => STATE.foundCoords.add(c));
      });
    } else {
      STATE.timerSeconds = 0;
      startTimer();
    }

    updateTimerDisplay();
    renderBoard();
    renderWordList();
    updateStatus();
    showView('game');
  }

  function renderBoard() {
    DOM.grid.innerHTML = '';
    DOM.grid.className = `word-grid grid-${STATE.gridSize}`;

    for (let r = 0; r < STATE.gridSize; r++) {
      for (let c = 0; c < STATE.gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell interactive-tactile';
        cell.textContent = STATE.gridData[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.setAttribute('role', 'gridcell');
        if (STATE.foundCoords.has(`${r},${c}`)) cell.classList.add('found');
        DOM.grid.appendChild(cell);
      }
    }
  }

  function renderWordList() {
    DOM.wordChipsList.innerHTML = '';
    STATE.placedWords.forEach(({ word }) => {
      const li = document.createElement('li');
      li.className = 'word-chip';
      li.dataset.word = word;
      li.textContent = word;
      if (STATE.foundWords.has(word)) li.classList.add('found');
      DOM.wordChipsList.appendChild(li);
    });
  }

  function updateStatus() {
    DOM.gameFoundCounter.textContent = `${STATE.foundWords.size} / ${STATE.placedWords.length}`;
    if (STATE.currentCoords.length > 0) {
      const currentWord = STATE.currentCoords.map(c => STATE.gridData[c.r][c.c]).join('');
      DOM.gameSelectionPreview.textContent = currentWord;
    } else {
      DOM.gameSelectionPreview.textContent = STATE.isSolved ? 'Complete' : '—';
    }
  }

  function startTimer() {
    clearInterval(STATE.timerInterval);
    STATE.timerInterval = setInterval(() => {
      if (!STATE.isSolved) {
        STATE.timerSeconds++;
        updateTimerDisplay();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = String(Math.floor(STATE.timerSeconds / 60)).padStart(2, '0');
    const s = String(STATE.timerSeconds % 60).padStart(2, '0');
    DOM.gameTimerValue.textContent = `${m}:${s}`;
  }

  // ==========================================================================
  // VECTOR GEOMETRY & SELECTION
  // ==========================================================================
  function getLine(r0, c0, r1, c1) {
    const dr = r1 - r0;
    const dc = c1 - c0;
    const absR = Math.abs(dr);
    const absC = Math.abs(dc);

    if (absR !== 0 && absC !== 0 && absR !== absC) return null;

    const stepR = dr === 0 ? 0 : dr / absR;
    const stepC = dc === 0 ? 0 : dc / absC;
    const len = Math.max(absR, absC);

    const coords = [];
    for (let i = 0; i <= len; i++) {
      coords.push({ r: r0 + stepR * i, c: c0 + stepC * i });
    }
    return coords;
  }

  function getCellFromPoint(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    if (el && el.classList.contains('grid-cell')) {
      return { r: parseInt(el.dataset.row, 10), c: parseInt(el.dataset.col, 10) };
    }
    return null;
  }

  function applyHighlight(coords) {
    const cells = DOM.grid.children;
    for (let i = 0; i < cells.length; i++) cells[i].classList.remove('selecting');
    if (!coords) return;
    coords.forEach(({ r, c }) => {
      const idx = r * STATE.gridSize + c;
      if (cells[idx]) cells[idx].classList.add('selecting');
    });
  }

  function checkSelection(coords) {
    const forward = coords.map(p => STATE.gridData[p.r][p.c]).join('');
    const backward = [...forward].reverse().join('');

    const match = STATE.placedWords.find(pw =>
      !STATE.foundWords.has(pw.word) && (pw.word === forward || pw.word === backward)
    );

    if (match) {
      triggerHapticPulse(25);
      STATE.foundWords.add(match.word);
      coords.forEach(p => {
        STATE.foundCoords.add(`${p.r},${p.c}`);
        const idx = p.r * STATE.gridSize + p.c;
        if (DOM.grid.children[idx]) DOM.grid.children[idx].classList.add('found');
      });

      const chip = DOM.wordChipsList.querySelector(`[data-word="${match.word}"]`);
      if (chip) chip.classList.add('found');

      if (STATE.foundWords.size >= STATE.placedWords.length) {
        onTierCompleted();
      }
    }
  }

  function onTierCompleted() {
    STATE.isSolved = true;
    clearInterval(STATE.timerInterval);
    triggerHapticPulse(45);

    const key = `${STATE.activePuzzle.id}_${STATE.activeTier}`;
    if (!STATE.userData.history[key]) {
      STATE.userData.history[key] = { time: STATE.timerSeconds, solved: true };
      STATE.userData.stats.played++;
      STATE.userData.stats.solved++;
      STATE.userData.stats.streak++;
      if (STATE.userData.stats.streak > STATE.userData.stats.bestStreak) {
        STATE.userData.stats.bestStreak = STATE.userData.stats.streak;
      }
      saveStorage();
    }

    DOM.victorySubtitle.textContent = `All hidden lexical terms uncovered in ${DOM.gameTimerValue.textContent}.`;
    DOM.btnVictoryAdvance.textContent = STATE.activeTier === 'mini' ? 'Advance to Midi' :
                                        STATE.activeTier === 'midi' ? 'Advance to Main' : 'Return to Overview';
    openModal('modalVictory');
  }

  // ==========================================================================
  // MODALS & TOASTS
  // ==========================================================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === 'modalStats') {
      DOM.statPlayed.textContent = STATE.userData.stats.played;
      DOM.statSolved.textContent = STATE.userData.stats.solved;
      DOM.statStreak.textContent = STATE.userData.stats.streak;
      DOM.statBestStreak.textContent = STATE.userData.stats.bestStreak;
    } else if (modalId === 'modalSettings') {
      DOM.btnToggleHaptics.setAttribute('aria-checked', STATE.settings.haptics ? 'true' : 'false');
      DOM.btnToggleLighting.setAttribute('aria-checked', STATE.settings.lighting ? 'true' : 'false');
    }

    modal.showModal();
  }

  let toastTimer = null;
  function showToast(message) {
    DOM.appToast.textContent = message;
    DOM.appToast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      DOM.appToast.classList.remove('visible');
    }, 2400);
  }

  // ==========================================================================
  // SOCIAL SHARING
  // ==========================================================================
  async function handleShare() {
    triggerHapticPulse(14);
    const shareData = {
      title: `${APP_CONFIG.identity.appName} — ${STATE.activePuzzle ? STATE.activePuzzle.title : 'Daily Edition'}`,
      text: "Solve today's tactile word search puzzle in the Editorial Ledger.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        showToast(APP_CONFIG.content.notifications.linkCopied);
      }
    } catch (_) {
      showToast(APP_CONFIG.content.notifications.linkCopied);
    }
  }

  // ==========================================================================
  // EVENT LISTENERS & LIFECYCLE
  // ==========================================================================
  function bindEvents() {
    // Header Back
    DOM.btnHeaderBack.addEventListener('click', () => {
      triggerHapticPulse(12);
      if (STATE.currentView === 'game') {
        clearInterval(STATE.timerInterval);
        showView(STATE.previousView === 'vault' ? 'vault' : 'menu');
      } else {
        showView('menu');
      }
    });

    // Overview buttons
    DOM.btnStartDaily.addEventListener('click', () => {
      triggerHapticPulse(16);
      STATE.activePuzzle = STATE.todayPuzzle;
      startTier('mini');
    });

    DOM.btnNavVault.addEventListener('click', () => {
      triggerHapticPulse(14);
      showView('vault');
    });

    DOM.btnNavRules.addEventListener('click', () => {
      triggerHapticPulse(14);
      openModal('modalRules');
    });

    DOM.btnNavSettings.addEventListener('click', () => {
      triggerHapticPulse(14);
      openModal('modalSettings');
    });

    // Top action triggers
    DOM.btnQuickStats.addEventListener('click', () => {
      triggerHapticPulse(14);
      openModal('modalStats');
    });

    DOM.btnShareApp.addEventListener('click', handleShare);

    // Tier segment tabs
    DOM.tierTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        triggerHapticPulse(12);
        const tier = tab.dataset.tier;
        if (tier !== STATE.activeTier) startTier(tier);
      });
    });

    // Modal dismissers
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        triggerHapticPulse(12);
        const modal = document.getElementById(btn.dataset.close);
        if (modal) modal.close();
      });
    });

    // Victory modal advance
    DOM.btnVictoryAdvance.addEventListener('click', () => {
      DOM.modalVictory.close();
      if (STATE.activeTier === 'mini') startTier('midi');
      else if (STATE.activeTier === 'midi') startTier('main');
      else showView('menu');
    });

    // Settings switches
    DOM.btnToggleHaptics.addEventListener('click', () => {
      STATE.settings.haptics = !STATE.settings.haptics;
      DOM.btnToggleHaptics.setAttribute('aria-checked', STATE.settings.haptics ? 'true' : 'false');
      saveStorage();
      triggerHapticPulse(16);
      showToast(STATE.settings.haptics ? APP_CONFIG.content.notifications.hapticsEnabled : APP_CONFIG.content.notifications.hapticsDisabled);
    });

    DOM.btnToggleLighting.addEventListener('click', () => {
      STATE.settings.lighting = !STATE.settings.lighting;
      DOM.btnToggleLighting.setAttribute('aria-checked', STATE.settings.lighting ? 'true' : 'false');
      document.body.classList.toggle('no-specular', !STATE.settings.lighting);
      saveStorage();
      triggerHapticPulse(16);
    });

    // Pointer Selection in Grid
    DOM.grid.addEventListener('pointerdown', e => {
      if (STATE.isSolved) return;
      const cell = getCellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      STATE.isSelecting = true;
      STATE.startCell = cell;
      STATE.currentCoords = [cell];
      applyHighlight(STATE.currentCoords);
      updateStatus();
      triggerHapticPulse(10);
    });

    window.addEventListener('pointermove', e => {
      if (!STATE.isSelecting || !STATE.startCell) return;
      const cell = getCellFromPoint(e.clientX, e.clientY);
      if (!cell) return;
      const line = getLine(STATE.startCell.r, STATE.startCell.c, cell.r, cell.c);
      if (line) {
        if (line.length !== STATE.currentCoords.length) {
          triggerHapticPulse(6);
        }
        STATE.currentCoords = line;
        applyHighlight(line);
        updateStatus();
      }
    });

    const finalizeSelection = () => {
      if (!STATE.isSelecting) return;
      STATE.isSelecting = false;
      applyHighlight(null);
      if (STATE.currentCoords.length > 1) {
        checkSelection(STATE.currentCoords);
      }
      STATE.currentCoords = [];
      STATE.startCell = null;
      updateStatus();
    };

    window.addEventListener('pointerup', finalizeSelection);
    window.addEventListener('pointercancel', finalizeSelection);

    DOM.btnErrorRetry.addEventListener('click', () => {
      initApp();
    });
  }

  // ==========================================================================
  // BOOTSTRAP INITIALIZATION
  // ==========================================================================
  async function initApp() {
    loadStorage();
    renderBottomDock();

    try {
      const response = await fetch(APP_CONFIG.cycle.sourceUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('Remote archive unavailable');
      const text = await response.text();
      const parsed = parseCSV(text);
      if (!parsed.length) throw new Error('Dataset empty');
      STATE.puzzles = parsed;
    } catch (_) {
      // Graceful fallback to verified built-in production records
      STATE.puzzles = [...APP_CONFIG.fallbackPuzzles];
    }

    const dailyIndex = calculateDailyIndex(STATE.puzzles.length);
    STATE.todayPuzzle = STATE.puzzles[dailyIndex] || STATE.puzzles[0];
    STATE.activePuzzle = STATE.todayPuzzle;

    bindEvents();
    renderMenu();
    showView('menu');
  }

  initApp();
})();