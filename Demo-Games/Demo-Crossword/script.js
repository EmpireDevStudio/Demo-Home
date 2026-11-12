/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  identity: {
    appId: "editorial-crossword-suite",
    appName: "Editorial Ledger",
    appTagline: "Artisanal Crossword Challenges & Lexical Record",
    version: "2.4.0",
    environment: "production",
    portalUrl: "../",
    language: "en-US",
    locale: "en-GB",
  },
  navigation: {
    items: [
      { id: "overview", label: "Overview", route: "#overview", showInBottomBar: true },
      { id: "game", label: "Ledger", route: "#game", showInBottomBar: true },
      { id: "vault", label: "Vault", route: "#vault", showInBottomBar: true },
      { id: "stats", label: "Stats", route: "#stats", showInBottomBar: true },
    ],
  },
  content: {
    headers: {
      overview: {
        eyebrow: "DAILY WORKSPACE",
        title: "Daily Crossword",
        subtitle: "Solve the daily word riddles arranged by size, vocabulary depth, and cadence.",
      },
      game: {
        eyebrow: "SOLVE SESSION",
        title: "Daily Crossword Grid",
        subtitle: "Select open cardstock cells to inspect hints. Tap direction to toggle Across & Down tracks.",
      },
      vault: {
        eyebrow: "LEDGER ARCHIVE",
        title: "Vault Archive",
        subtitle: "Complete archive of historical daily editions, solved records, and past puzzles.",
      },
      stats: {
        eyebrow: "PERFORMANCE LEDGER",
        title: "Solve Analytics",
        subtitle: "Track continuous solver streaks, completion tallies, and median solve durations.",
      },
      error: {
        eyebrow: "SYSTEM NOTICE",
        title: "Archive Connection",
        subtitle: "Review connection status or retry fetching the puzzle library.",
      },
    },
  },
  dailyCycle: {
    anchorDate: "2026-01-01",
    startIndex: 0,
  },
  display: {
    dateFormat: { month: "short", day: "numeric", year: "numeric" },
    toastDurationMs: 2400,
  },
  endpoints: {
    csvUrl: "./puzzles.csv",
    storageKey: "cocktail_crossword_lounge_universal_v1",
  },
});

(() => {
  'use strict';

  /* ==========================================================================
     TACTILE PAPER AUDIO ENGINE
     ========================================================================== */
  class PaperAudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = false;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playTap() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }

    playKey() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.032);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.042);
    }

    playToggle() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.05);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    }

    playVictory() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const notes = [329.63, 440.0, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const start = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.95);
      });
    }
  }

  const audio = new PaperAudioEngine();

  /* ==========================================================================
     APPLICATION STATE
     ========================================================================== */
  const state = {
    currentRoute: 'overview',
    puzzles: [],
    tiers: ['mini', 'midi', 'main'],
    puzzlesByTier: {},
    currentLocalDate: '',
    selectedDailyTier: 'mini',
    activeTier: 'mini',
    activePuzzle: null,
    isDailyMode: true,
    userGrid: [],
    cursor: { r: 0, c: 0 },
    direction: 'across',
    timerSeconds: 0,
    timerInterval: null,
    isSolved: false,

    settings: {
      soundEnabled: true,
      hapticEnabled: true
    },
    saveData: {
      stats: {
        played: 0,
        solved: 0,
        streak: 0,
        bestStreak: 0,
        times: { mini: [], midi: [], main: [] }
      },
      inProgress: {},
      history: {}
    }
  };

  /* ==========================================================================
     DOM ELEMENTS
     ========================================================================== */
  const el = {
    btnGlobalBack: document.getElementById('btnGlobalBack'),
    btnBackNavLabel: document.getElementById('btnBackNavLabel'),
    pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
    pageTitleSlot: document.getElementById('pageTitleSlot'),
    pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),
    gameTimerCapsule: document.getElementById('gameTimerCapsule'),
    gameTimerDisplay: document.getElementById('gameTimerDisplay'),
    btnSettingsTrigger: document.getElementById('btnSettingsTrigger'),
    btnHelpTrigger: document.getElementById('btnHelpTrigger'),

    viewOverview: document.getElementById('view-overview'),
    viewGame: document.getElementById('view-game'),
    viewVault: document.getElementById('view-vault'),
    viewStats: document.getElementById('view-stats'),
    viewError: document.getElementById('view-error'),

    bottomDockNavItems: document.getElementById('bottomDockNavItems'),

    dailyDateLabel: document.getElementById('dailyDateLabel'),
    dailyTierSelector: document.getElementById('dailyTierSelector'),
    btnPlayDaily: document.getElementById('btnPlayDaily'),
    btnPlayDailyLabel: document.getElementById('btnPlayDailyLabel'),

    cardQuickVault: document.getElementById('cardQuickVault'),
    cardQuickStats: document.getElementById('cardQuickStats'),
    btnUtilSound: document.getElementById('btnUtilSound'),
    soundIconOn: document.getElementById('soundIconOn'),
    soundIconOff: document.getElementById('soundIconOff'),
    soundLabelText: document.getElementById('soundLabelText'),
    btnUtilShare: document.getElementById('btnUtilShare'),
    btnUtilPortal: document.getElementById('btnUtilPortal'),

    gameActiveTitle: document.getElementById('gameActiveTitle'),
    gameplayTierTabs: document.getElementById('gameplayTierTabs'),
    activeClueTrigger: document.getElementById('activeClueTrigger'),
    activeClueBadge: document.getElementById('activeClueBadge'),
    activeClueText: document.getElementById('activeClueText'),
    crosswordBoard: document.getElementById('crosswordBoard'),
    cluesListAcross: document.getElementById('cluesListAcross'),
    cluesListDown: document.getElementById('cluesListDown'),
    onscreenKeyboard: document.getElementById('onscreenKeyboard'),

    vaultListContainer: document.getElementById('vaultListContainer'),

    statPlayed: document.getElementById('statPlayed'),
    statSolved: document.getElementById('statSolved'),
    statStreak: document.getElementById('statStreak'),
    statBest: document.getElementById('statBest'),
    statsTierTimesList: document.getElementById('statsTierTimesList'),

    panelHowToPlayOverlay: document.getElementById('panelHowToPlayOverlay'),
    panelHelpBackdrop: document.getElementById('panelHelpBackdrop'),
    btnCloseHelp: document.getElementById('btnCloseHelp'),

    modalSettings: document.getElementById('modalSettings'),
    optSoundOn: document.getElementById('optSoundOn'),
    optSoundOff: document.getElementById('optSoundOff'),
    optHapticOn: document.getElementById('optHapticOn'),
    optHapticOff: document.getElementById('optHapticOff'),

    modalVictory: document.getElementById('modalVictory'),
    victorySummaryText: document.getElementById('victorySummaryText'),
    btnVictoryNextAction: document.getElementById('btnVictoryNextAction'),
    btnVictoryReviewAction: document.getElementById('btnVictoryReviewAction'),

    toastMessage: document.getElementById('toastMessage'),
    btnRetryLoad: document.getElementById('btnRetryLoad'),
    errorCardMessage: document.getElementById('errorCardMessage')
  };

  function triggerHaptics() {
    if (state.settings.hapticEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Silent catch for restricted environments
      }
    }
  }

  /* ==========================================================================
     DATE & CALENDAR LOGIC
     ========================================================================== */
  function getLocalCalendarDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getCalendarDaysDiff(anchorDateStr, targetDateStr) {
    const [ay, am, ad] = anchorDateStr.split('-').map(Number);
    const [ty, tm, td] = targetDateStr.split('-').map(Number);
    const utcA = Date.UTC(ay, am - 1, ad);
    const utcT = Date.UTC(ty, tm - 1, td);
    return Math.floor((utcT - utcA) / 86400000);
  }

  function formatDate(isoStr) {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(APP_CONFIG.identity.locale, {
      ...APP_CONFIG.display.dateFormat,
      timeZone: 'UTC'
    });
  }

  /* ==========================================================================
     STORAGE PERSISTENCE
     ========================================================================== */
  function loadStorage() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.settings && typeof parsed.settings === 'object') {
            state.settings = { ...state.settings, ...parsed.settings };
          }
          if (parsed.stats && typeof parsed.stats === 'object') {
            state.saveData.stats = { ...state.saveData.stats, ...parsed.stats };
          }
          if (parsed.history && typeof parsed.history === 'object') {
            state.saveData.history = { ...parsed.history };
          }
          if (parsed.inProgress && typeof parsed.inProgress === 'object') {
            state.saveData.inProgress = { ...parsed.inProgress };
          }
        }
      }
    } catch {
      // Storage unavailable; operating in RAM
    }

    audio.isMuted = !state.settings.soundEnabled;
    updateSettingsUI();
  }

  function saveStorage() {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKey, JSON.stringify({
        settings: state.settings,
        stats: state.saveData.stats,
        history: state.saveData.history,
        inProgress: state.saveData.inProgress
      }));
    } catch {
      // Storage save suppressed
    }
  }

  function updateSettingsUI() {
    const soundOn = state.settings.soundEnabled;
    el.soundIconOn.classList.toggle('hidden', !soundOn);
    el.soundIconOff.classList.toggle('hidden', soundOn);
    el.soundLabelText.textContent = soundOn ? 'Sound On' : 'Sound Off';

    el.optSoundOn.classList.toggle('active', soundOn);
    el.optSoundOn.setAttribute('aria-checked', String(soundOn));
    el.optSoundOff.classList.toggle('active', !soundOn);
    el.optSoundOff.setAttribute('aria-checked', String(!soundOn));

    const hapticOn = state.settings.hapticEnabled;
    el.optHapticOn.classList.toggle('active', hapticOn);
    el.optHapticOn.setAttribute('aria-checked', String(hapticOn));
    el.optHapticOff.classList.toggle('active', !hapticOn);
    el.optHapticOff.setAttribute('aria-checked', String(!hapticOn));
  }

  function setSoundEnabled(enabled) {
    state.settings.soundEnabled = enabled;
    audio.isMuted = !enabled;
    saveStorage();
    updateSettingsUI();
    if (enabled) audio.playTap();
  }

  function setHapticEnabled(enabled) {
    state.settings.hapticEnabled = enabled;
    saveStorage();
    updateSettingsUI();
    audio.playTap();
    if (enabled) triggerHaptics();
  }

  /* ==========================================================================
     CSV & PUZZLE PARSER ENGINE
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
    if (!rows.length) return [];

    const headers = rows[0].map(h => h.toLowerCase());
    return rows.slice(1).map(cols => {
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
      return obj;
    });
  }

  function parsePuzzleModel(record, index) {
    if (!record || !record.grid || typeof record.grid !== 'string') return null;

    const rawLines = record.grid.split(/[\/\r\n]+/).map(s => s.trim()).filter(Boolean);
    const size = rawLines.length;
    if (size < 3) return null;

    const solution = [];
    const blocks = new Set();

    for (let r = 0; r < size; r++) {
      solution[r] = [];
      for (let c = 0; c < size; c++) {
        const char = (rawLines[r][c] || '#').toUpperCase();
        if (char === '#') blocks.add(`${r},${c}`);
        solution[r][c] = char;
      }
    }

    let counter = 1;
    const numbering = {};
    const wordsAcross = [];
    const wordsDown = [];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (blocks.has(`${r},${c}`)) continue;
        const needsAcross = (c === 0 || blocks.has(`${r},${c - 1}`)) && (c + 1 < size && !blocks.has(`${r},${c + 1}`));
        const needsDown = (r === 0 || blocks.has(`${r - 1},${c}`)) && (r + 1 < size && !blocks.has(`${r + 1},${c}`));

        if (needsAcross || needsDown) {
          numbering[`${r},${c}`] = counter;
          if (needsAcross) wordsAcross.push(counter);
          if (needsDown) wordsDown.push(counter);
          counter++;
        }
      }
    }

    const parseClueList = (str, wordNums) => {
      if (!str) return [];
      const lines = str.split(/\r?\n|\|/).map(s => s.trim()).filter(Boolean);
      return lines.map((line, idx) => {
        const match = line.match(/^(\d+)[\.\:\-]?\s*(.+)$/);
        if (match) return { num: parseInt(match[1], 10), clue: match[2].trim() };
        return { num: wordNums[idx] || (idx + 1), clue: line };
      });
    };

    const puzzleId = record.id || (record.date && record.tier ? `${record.date}_${record.tier}` : `puzzle_${index + 1}`);
    const tier = (record.tier || 'standard').toLowerCase();

    return {
      id: puzzleId,
      index,
      size,
      solution,
      blocks,
      numbering,
      clues: {
        across: parseClueList(record.clues_across, wordsAcross),
        down: parseClueList(record.clues_down, wordsDown)
      },
      title: record.title || `Puzzle ${index + 1}`,
      tier
    };
  }

  function isBlock(r, c) {
    const p = state.activePuzzle;
    if (!p || r < 0 || c < 0 || r >= p.size || c >= p.size) return true;
    return p.blocks.has(`${r},${c}`);
  }

  /* ==========================================================================
     DAILY CHALLENGE RESOLUTION
     ========================================================================== */
  function getDailyPuzzleForTier(tier) {
    const list = state.puzzlesByTier[tier] || state.puzzles;
    if (!list || !list.length) return null;

    const daysElapsed = getCalendarDaysDiff(APP_CONFIG.dailyCycle.anchorDate, state.currentLocalDate);
    const cycleOffset = APP_CONFIG.dailyCycle.startIndex;
    const index = ((daysElapsed + cycleOffset) % list.length + list.length) % list.length;
    return list[index];
  }

  function checkCalendarDateChange() {
    const latestDate = getLocalCalendarDate();
    if (latestDate !== state.currentLocalDate) {
      state.currentLocalDate = latestDate;
      if (state.currentRoute === 'overview') {
        renderOverview();
      }
    }
  }

  /* ==========================================================================
     ROUTING & BOTTOM DOCK
     ========================================================================== */
  function setRoute(routeId, pushHash = true) {
    if (routeId !== 'game' && state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    state.currentRoute = routeId;

    el.viewOverview.classList.toggle('hidden', routeId !== 'overview');
    el.viewGame.classList.toggle('hidden', routeId !== 'game');
    el.viewVault.classList.toggle('hidden', routeId !== 'vault');
    el.viewStats.classList.toggle('hidden', routeId !== 'stats');
    el.viewError.classList.toggle('hidden', routeId !== 'error');

    const cfgHeader = APP_CONFIG.content.headers[routeId] || APP_CONFIG.content.headers.overview;
    el.pageEyebrowSlot.textContent = cfgHeader.eyebrow;
    el.pageTitleSlot.textContent = cfgHeader.title;
    el.pageSubtitleSlot.textContent = cfgHeader.subtitle;

    el.gameTimerCapsule.classList.toggle('hidden', routeId !== 'game');
    el.btnBackNavLabel.textContent = routeId === 'overview' ? 'Portal' : 'Back';

    document.querySelectorAll('.nav-tab-item').forEach(item => {
      const active = item.dataset.route === routeId;
      item.classList.toggle('nav-tab-item--active', active);
      item.setAttribute('aria-selected', String(active));
    });

    if (routeId === 'vault') renderVault();
    if (routeId === 'stats') renderStats();
    if (routeId === 'overview') renderOverview();

    if (pushHash && routeId !== 'error' && window.location.hash !== `#${routeId}`) {
      window.history.pushState(null, '', `#${routeId}`);
    }
  }

  function renderBottomDock() {
    el.bottomDockNavItems.innerHTML = '';
    APP_CONFIG.navigation.items.filter(i => i.showInBottomBar).forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `nav-tab-item ${item.id === state.currentRoute ? 'nav-tab-item--active' : ''}`;
      btn.dataset.route = item.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(item.id === state.currentRoute));

      let iconSvg = '';
      if (item.id === 'overview') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
      } else if (item.id === 'game') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/></svg>`;
      } else if (item.id === 'vault') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
      } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
      }

      btn.innerHTML = `${iconSvg}<span>${item.label}</span><div class="nav-tab-indicator"></div>`;
      btn.addEventListener('click', () => {
        audio.playTap();
        triggerHaptics();
        if (item.id === 'game') {
          if (state.activePuzzle) {
            loadPuzzle(state.activePuzzle, state.isDailyMode);
          } else {
            const target = getDailyPuzzleForTier(state.selectedDailyTier);
            if (target) loadPuzzle(target, true);
          }
        } else {
          setRoute(item.id);
        }
      });
      el.bottomDockNavItems.appendChild(btn);
    });
  }

  /* ==========================================================================
     OVERVIEW, VAULT & STATS VIEWS
     ========================================================================== */
  function renderOverview() {
    el.dailyDateLabel.textContent = `Daily Edition · ${formatDate(state.currentLocalDate)}`;
    el.dailyTierSelector.innerHTML = '';

    state.tiers.forEach(tier => {
      const dailyPuzzle = getDailyPuzzleForTier(tier);
      const isDone = dailyPuzzle ? !!state.saveData.history[dailyPuzzle.id]?.solved : false;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `interactive-tactile tier-pill-btn ${tier === state.selectedDailyTier ? 'tier-pill-btn--active' : ''}`;
      pill.innerHTML = `<span>${tier}</span>${isDone ? ' &#x2713;' : ''}`;
      pill.addEventListener('click', () => {
        audio.playTap();
        triggerHaptics();
        state.selectedDailyTier = tier;
        renderOverview();
      });
      el.dailyTierSelector.appendChild(pill);
    });

    const activeDaily = getDailyPuzzleForTier(state.selectedDailyTier);
    const isCurrentSolved = activeDaily ? !!state.saveData.history[activeDaily.id]?.solved : false;
    const tierDisplay = state.selectedDailyTier.charAt(0).toUpperCase() + state.selectedDailyTier.slice(1);

    el.btnPlayDailyLabel.textContent = isCurrentSolved
      ? `Review ${tierDisplay} Ledger`
      : `Play ${tierDisplay} Crossword`;
  }

  function renderVault() {
    el.vaultListContainer.innerHTML = '';

    if (!state.puzzles.length) {
      el.vaultListContainer.innerHTML = `
        <article class="paper-card">
          <h3 class="paper-card__title">No Editions Archived</h3>
          <p class="paper-card__description">No crossword editions are archived in the vault yet.</p>
        </article>
      `;
      return;
    }

    state.puzzles.forEach((puzzle, index) => {
      const card = document.createElement('article');
      card.className = 'vault-card';

      const isDone = !!state.saveData.history[puzzle.id]?.solved;
      const solveTime = state.saveData.history[puzzle.id]?.time;

      card.innerHTML = `
        <div class="vault-card-left">
          <span class="vault-date">${puzzle.title}</span>
          <span class="vault-card-meta">${puzzle.size}×${puzzle.size} Grid · #${index + 1}</span>
        </div>
        <div class="vault-badges">
          <span class="vault-tier-badge tier-${puzzle.tier}">${puzzle.tier}</span>
          ${isDone ? `<span class="vault-tier-badge completed">✓ ${formatTime(solveTime)}</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        audio.playTap();
        triggerHaptics();
        loadPuzzle(puzzle, false);
      });

      el.vaultListContainer.appendChild(card);
    });
  }

  function renderStats() {
    const s = state.saveData.stats;
    el.statPlayed.textContent = s.played;
    el.statSolved.textContent = s.solved;
    el.statStreak.textContent = s.streak;
    el.statBest.textContent = s.bestStreak;

    el.statsTierTimesList.innerHTML = '';
    const displayTiers = state.tiers.length ? state.tiers : ['mini', 'midi', 'main'];
    displayTiers.forEach(tier => {
      const times = s.times[tier] || [];
      const med = times.length ? formatTime([...times].sort((a, b) => a - b)[Math.floor(times.length / 2)]) : '--:--';
      const li = document.createElement('li');
      li.innerHTML = `<span>${tier} Edition</span><strong>${med}</strong>`;
      el.statsTierTimesList.appendChild(li);
    });
  }

  /* ==========================================================================
     GAMEPLAY ENGINE & BOARD CONTROLLER
     ========================================================================== */
  function loadPuzzle(puzzle, isDaily = true) {
    if (!puzzle) return;

    state.activePuzzle = puzzle;
    state.activeTier = puzzle.tier;
    state.isDailyMode = isDaily;

    const size = puzzle.size;
    state.userGrid = Array.from({ length: size }, () => Array(size).fill(''));
    state.isSolved = false;
    state.timerSeconds = 0;

    const savedSolved = state.saveData.history[puzzle.id];
    const savedInProgress = state.saveData.inProgress[puzzle.id];

    if (savedSolved?.solved) {
      state.isSolved = true;
      state.timerSeconds = savedSolved.time || 0;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          state.userGrid[r][c] = puzzle.solution[r][c];
        }
      }
    } else if (savedInProgress) {
      state.timerSeconds = savedInProgress.time || 0;
      if (Array.isArray(savedInProgress.grid)) {
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            state.userGrid[r][c] = savedInProgress.grid[r]?.[c] || '';
          }
        }
      }
    }

    renderGameHeader();
    renderBoard();
    renderClues();
    resetCursor();
    updateTimerDisplay();

    setRoute('game');

    clearInterval(state.timerInterval);
    if (!state.isSolved) {
      state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        updateTimerDisplay();
        persistInProgressState();
      }, 1000);
    }
  }

  function renderGameHeader() {
    el.gameActiveTitle.textContent = `${state.activePuzzle.title} · ${state.activeTier.toUpperCase()}`;
    el.gameplayTierTabs.innerHTML = '';

    if (state.isDailyMode) {
      state.tiers.forEach(tier => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `interactive-tactile tier-tab-pill ${tier === state.activeTier ? 'tier-tab-pill--active' : ''}`;
        const dailyTierPuzzle = getDailyPuzzleForTier(tier);
        const isDone = dailyTierPuzzle ? !!state.saveData.history[dailyTierPuzzle.id]?.solved : false;
        btn.innerHTML = `${tier}${isDone ? ' &#x2713;' : ''}`;
        btn.addEventListener('click', () => {
          audio.playTap();
          triggerHaptics();
          state.selectedDailyTier = tier;
          const target = getDailyPuzzleForTier(tier);
          if (target) loadPuzzle(target, true);
        });
        el.gameplayTierTabs.appendChild(btn);
      });
    } else {
      const badge = document.createElement('span');
      badge.className = 'interactive-tactile tier-tab-pill tier-tab-pill--active';
      badge.textContent = state.activeTier;
      el.gameplayTierTabs.appendChild(badge);
    }
  }

  function renderBoard() {
    const size = state.activePuzzle.size;
    const grid = el.crosswordBoard;
    grid.dataset.tier = state.activeTier;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.setAttribute('role', 'gridcell');

        if (isBlock(r, c)) {
          cell.classList.add('cell-black');
          cell.setAttribute('aria-hidden', 'true');
        } else {
          const num = state.activePuzzle.numbering[`${r},${c}`];
          if (num) {
            const numEl = document.createElement('span');
            numEl.className = 'cell-num';
            numEl.textContent = num;
            cell.appendChild(numEl);
          }
          const letter = state.userGrid[r][c];
          if (letter) {
            const letterEl = document.createElement('span');
            letterEl.className = 'cell-letter';
            letterEl.textContent = letter;
            cell.appendChild(letterEl);
          }

          cell.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            handleCellTap(r, c);
          });
        }
        grid.appendChild(cell);
      }
    }
  }

  function renderClues() {
    el.cluesListAcross.innerHTML = '';
    el.cluesListDown.innerHTML = '';

    const createClueNode = (item, dir) => {
      const li = document.createElement('li');
      li.className = 'clue-item';
      li.dataset.dir = dir;
      li.dataset.num = item.num;
      li.innerHTML = `<strong>${item.num}.</strong> ${item.clue}`;
      li.addEventListener('click', () => {
        audio.playTap();
        triggerHaptics();
        jumpToWord(item.num, dir);
      });
      return li;
    };

    state.activePuzzle.clues.across.forEach(c => el.cluesListAcross.appendChild(createClueNode(c, 'across')));
    state.activePuzzle.clues.down.forEach(c => el.cluesListDown.appendChild(createClueNode(c, 'down')));
  }

  function handleCellTap(r, c) {
    if (isBlock(r, c)) return;
    audio.playTap();
    triggerHaptics();

    if (state.cursor.r === r && state.cursor.c === c) {
      state.direction = state.direction === 'across' ? 'down' : 'across';
    } else {
      state.cursor = { r, c };
      if (!isValidDirection(r, c, state.direction)) {
        state.direction = state.direction === 'across' ? 'down' : 'across';
      }
    }
    updateSelection();
  }

  function isValidDirection(r, c, dir) {
    const size = state.activePuzzle.size;
    if (dir === 'across') return (c > 0 && !isBlock(r, c - 1)) || (c + 1 < size && !isBlock(r, c + 1));
    return (r > 0 && !isBlock(r - 1, c)) || (r + 1 < size && !isBlock(r + 1, c));
  }

  function resetCursor() {
    const size = state.activePuzzle.size;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isBlock(r, c)) {
          state.cursor = { r, c };
          state.direction = 'across';
          updateSelection();
          return;
        }
      }
    }
  }

  function getWordSpan(r, c, dir) {
    const span = [];
    const size = state.activePuzzle.size;
    if (dir === 'across') {
      let sc = c; while (sc > 0 && !isBlock(r, sc - 1)) sc--;
      let ec = c; while (ec + 1 < size && !isBlock(r, ec + 1)) ec++;
      for (let cur = sc; cur <= ec; cur++) span.push({ r, c: cur });
    } else {
      let sr = r; while (sr > 0 && !isBlock(sr - 1, c)) sr--;
      let er = r; while (er + 1 < size && !isBlock(er + 1, c)) er++;
      for (let cur = sr; cur <= er; cur++) span.push({ r: cur, c });
    }
    return span;
  }

  function updateSelection() {
    const { r, c } = state.cursor;
    const size = state.activePuzzle.size;
    const cells = el.crosswordBoard.children;

    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove('cell-active', 'cell-word');
      cells[i].removeAttribute('aria-selected');
    }

    const span = getWordSpan(r, c, state.direction);
    span.forEach(pos => {
      const idx = pos.r * size + pos.c;
      if (cells[idx]) cells[idx].classList.add('cell-word');
    });

    const activeIdx = r * size + c;
    if (cells[activeIdx]) {
      cells[activeIdx].classList.add('cell-active');
      cells[activeIdx].setAttribute('aria-selected', 'true');
    }

    if (!span.length) return;
    const root = span[0];
    const num = state.activePuzzle.numbering[`${root.r},${root.c}`];
    const clueObj = state.activePuzzle.clues[state.direction].find(i => i.num === num);

    el.activeClueBadge.textContent = num ? `${num}${state.direction === 'across' ? 'A' : 'D'}` : '--';
    el.activeClueText.textContent = clueObj ? clueObj.clue : 'Select open cells to inspect hints.';

    document.querySelectorAll('.clue-item').forEach(item => {
      const matches = item.dataset.dir === state.direction && Number(item.dataset.num) === num;
      item.classList.toggle('active', matches);
      if (matches) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  function jumpToWord(num, dir) {
    for (const [coord, wordNum] of Object.entries(state.activePuzzle.numbering)) {
      if (wordNum === num) {
        const [r, c] = coord.split(',').map(Number);
        state.cursor = { r, c };
        state.direction = dir;
        updateSelection();
        return;
      }
    }
  }

  function handleInput(char) {
    if (state.isSolved) return;
    char = char.toUpperCase();
    if (!/^[A-Z]$/.test(char)) return;

    audio.playKey();
    triggerHaptics();

    const { r, c } = state.cursor;
    state.userGrid[r][c] = char;

    const size = state.activePuzzle.size;
    const cellEl = el.crosswordBoard.children[r * size + c];
    let letterSpan = cellEl.querySelector('.cell-letter');

    if (!letterSpan) {
      letterSpan = document.createElement('span');
      letterSpan.className = 'cell-letter';
      cellEl.appendChild(letterSpan);
    }
    letterSpan.textContent = char;

    persistInProgressState();
    advanceCursor(false);
    checkWin();
  }

  function handleBackspace() {
    if (state.isSolved) return;
    audio.playKey();
    triggerHaptics();

    const { r, c } = state.cursor;
    const size = state.activePuzzle.size;

    if (state.userGrid[r][c]) {
      state.userGrid[r][c] = '';
      const letterSpan = el.crosswordBoard.children[r * size + c].querySelector('.cell-letter');
      if (letterSpan) letterSpan.remove();
    } else {
      advanceCursor(true);
      const pr = state.cursor.r;
      const pc = state.cursor.c;
      state.userGrid[pr][pc] = '';
      const pSpan = el.crosswordBoard.children[pr * size + pc].querySelector('.cell-letter');
      if (pSpan) pSpan.remove();
    }
    persistInProgressState();
    updateSelection();
  }

  function advanceCursor(backwards) {
    const size = state.activePuzzle.size;
    let { r, c } = state.cursor;
    for (let step = 0; step < size; step++) {
      if (state.direction === 'across') c += backwards ? -1 : 1;
      else r += backwards ? -1 : 1;
      if (r < 0 || c < 0 || r >= size || c >= size) break;
      if (!isBlock(r, c)) {
        state.cursor = { r, c };
        break;
      }
    }
    updateSelection();
  }

  function persistInProgressState() {
    if (state.isSolved || !state.activePuzzle) return;
    state.saveData.inProgress[state.activePuzzle.id] = {
      grid: state.userGrid,
      time: state.timerSeconds
    };
    saveStorage();
  }

  function checkWin() {
    const size = state.activePuzzle.size;
    const sol = state.activePuzzle.solution;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isBlock(r, c) && state.userGrid[r][c] !== sol[r][c]) return false;
      }
    }

    state.isSolved = true;
    clearInterval(state.timerInterval);
    audio.playVictory();

    const puzzleKey = state.activePuzzle.id;
    delete state.saveData.inProgress[puzzleKey];

    if (!state.saveData.history[puzzleKey]) {
      state.saveData.history[puzzleKey] = { solved: true, time: state.timerSeconds };
      state.saveData.stats.played++;
      state.saveData.stats.solved++;
      state.saveData.stats.streak++;
      if (state.saveData.stats.streak > state.saveData.stats.bestStreak) {
        state.saveData.stats.bestStreak = state.saveData.stats.streak;
      }
      if (!state.saveData.stats.times[state.activeTier]) {
        state.saveData.stats.times[state.activeTier] = [];
      }
      state.saveData.stats.times[state.activeTier].push(state.timerSeconds);
      saveStorage();
    }

    renderGameHeader();
    showVictoryModal();
    return true;
  }

  function showVictoryModal() {
    el.victorySummaryText.textContent = `Solved in ${formatTime(state.timerSeconds)}!`;

    if (state.isDailyMode) {
      const currIdx = state.tiers.indexOf(state.activeTier);
      const nextTier = state.tiers[currIdx + 1];

      if (nextTier) {
        el.btnVictoryNextAction.textContent = `Play ${nextTier.toUpperCase()}`;
        el.btnVictoryNextAction.onclick = () => {
          closeModal(el.modalVictory);
          state.selectedDailyTier = nextTier;
          const target = getDailyPuzzleForTier(nextTier);
          if (target) loadPuzzle(target, true);
        };
      } else {
        el.btnVictoryNextAction.textContent = 'Return to Overview';
        el.btnVictoryNextAction.onclick = () => {
          closeModal(el.modalVictory);
          setRoute('overview');
        };
      }
    } else {
      el.btnVictoryNextAction.textContent = 'Return to Vault';
      el.btnVictoryNextAction.onclick = () => {
        closeModal(el.modalVictory);
        setRoute('vault');
      };
    }

    openModal(el.modalVictory);
  }

  /* ==========================================================================
     HOW TO PLAY SIDE SHEET & MODALS
     ========================================================================== */
  function openHowToPlay() {
    audio.playTap();
    triggerHaptics();
    el.panelHowToPlayOverlay.classList.remove('hidden');
    void el.panelHowToPlayOverlay.offsetWidth;
    el.panelHowToPlayOverlay.classList.add('active');
    el.panelHowToPlayOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeHowToPlay() {
    audio.playTap();
    el.panelHowToPlayOverlay.classList.remove('active');
    el.panelHowToPlayOverlay.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      el.panelHowToPlayOverlay.classList.add('hidden');
    }, 330);
  }

  function openSettingsModal() {
    audio.playTap();
    triggerHaptics();
    updateSettingsUI();
    openModal(el.modalSettings);
  }

  function openModal(m) {
    m.classList.remove('hidden');
  }

  function closeModal(m) {
    audio.playTap();
    m.classList.add('hidden');
  }

  /* ==========================================================================
     SHARE, PORTAL & TOAST UTILITIES
     ========================================================================== */
  async function handleShareAction() {
    audio.playTap();
    triggerHaptics();
    const shareData = {
      title: APP_CONFIG.identity.appName,
      text: "Solve today's Editorial Ledger Crossword!",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Ledger shared successfully.');
      } catch {
        // Share dismissed
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard.');
      } catch {
        showToast('Failed to copy link.');
      }
    } else {
      showToast('Sharing not supported on this browser.');
    }
  }

  function handlePortalAction() {
    audio.playTap();
    triggerHaptics();
    if (APP_CONFIG.identity.portalUrl && APP_CONFIG.identity.portalUrl !== '#') {
      window.location.href = APP_CONFIG.identity.portalUrl;
    } else {
      showToast('Tileworks Portal: More editions arriving soon.');
    }
  }

  function showToast(msg) {
    el.toastMessage.textContent = msg;
    el.toastMessage.classList.remove('hidden');
    el.toastMessage.style.opacity = '1';
    setTimeout(() => {
      el.toastMessage.style.opacity = '0';
      setTimeout(() => el.toastMessage.classList.add('hidden'), 200);
    }, APP_CONFIG.display.toastDurationMs);
  }

  function updateTimerDisplay() {
    el.gameTimerDisplay.textContent = formatTime(state.timerSeconds);
  }

  function formatTime(secs) {
    if (secs == null) return '--:--';
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function showError(msg) {
    el.errorCardMessage.textContent = msg;
    setRoute('error', false);
  }

  /* ==========================================================================
     EVENT ATTACHMENTS
     ========================================================================== */
  function bindEvents() {
    el.btnGlobalBack.addEventListener('click', () => {
      audio.playTap();
      triggerHaptics();
      if (state.currentRoute !== 'overview') {
        setRoute('overview');
      } else if (APP_CONFIG.identity.portalUrl && APP_CONFIG.identity.portalUrl !== '#') {
        window.location.href = APP_CONFIG.identity.portalUrl;
      }
    });

    el.btnPlayDaily.addEventListener('click', () => {
      audio.playTap();
      triggerHaptics();
      const dailyPuzzle = getDailyPuzzleForTier(state.selectedDailyTier);
      if (dailyPuzzle) loadPuzzle(dailyPuzzle, true);
    });

    const openVault = () => {
      audio.playTap();
      triggerHaptics();
      setRoute('vault');
    };
    const openStats = () => {
      audio.playTap();
      triggerHaptics();
      setRoute('stats');
    };

    el.cardQuickVault.addEventListener('click', openVault);
    el.cardQuickVault.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVault(); }
    });

    el.cardQuickStats.addEventListener('click', openStats);
    el.cardQuickStats.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStats(); }
    });

    el.btnUtilSound.addEventListener('click', () => {
      setSoundEnabled(!state.settings.soundEnabled);
      triggerHaptics();
    });
    el.btnUtilShare.addEventListener('click', handleShareAction);
    el.btnUtilPortal.addEventListener('click', handlePortalAction);

    el.btnSettingsTrigger.addEventListener('click', openSettingsModal);
    el.btnHelpTrigger.addEventListener('click', openHowToPlay);
    el.btnCloseHelp.addEventListener('click', closeHowToPlay);
    el.panelHelpBackdrop.addEventListener('click', closeHowToPlay);

    el.optSoundOn.addEventListener('click', () => setSoundEnabled(true));
    el.optSoundOff.addEventListener('click', () => setSoundEnabled(false));
    el.optHapticOn.addEventListener('click', () => setHapticEnabled(true));
    el.optHapticOff.addEventListener('click', () => setHapticEnabled(false));

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
    });

    el.activeClueTrigger.addEventListener('click', () => {
      audio.playToggle();
      triggerHaptics();
      state.direction = state.direction === 'across' ? 'down' : 'across';
      updateSelection();
    });

    el.activeClueTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        audio.playToggle();
        triggerHaptics();
        state.direction = state.direction === 'across' ? 'down' : 'across';
        updateSelection();
      }
    });

    el.onscreenKeyboard.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.preventDefault();
      const key = btn.dataset.key;
      if (key === 'DIR') {
        audio.playToggle();
        triggerHaptics();
        state.direction = state.direction === 'across' ? 'down' : 'across';
        updateSelection();
      } else if (key === 'BACKSPACE') {
        handleBackspace();
      } else if (key) {
        handleInput(key);
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (el.panelHowToPlayOverlay.classList.contains('active')) {
          closeHowToPlay();
          return;
        }
        [el.modalSettings, el.modalVictory].forEach(m => {
          if (!m.classList.contains('hidden')) closeModal(m);
        });
        return;
      }

      if (state.currentRoute !== 'game') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        audio.playToggle();
        triggerHaptics();
        state.direction = state.direction === 'across' ? 'down' : 'across';
        updateSelection();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        state.direction = 'across';
        advanceCursor(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        state.direction = 'across';
        advanceCursor(true);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        state.direction = 'down';
        advanceCursor(false);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        state.direction = 'down';
        advanceCursor(true);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleInput(e.key);
      }
    });

    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '') || 'overview';
      if (['overview', 'game', 'vault', 'stats'].includes(hash)) {
        if (hash === 'game' && !state.activePuzzle) {
          const target = getDailyPuzzleForTier(state.selectedDailyTier);
          if (target) loadPuzzle(target, true);
          else setRoute('overview', false);
        } else {
          setRoute(hash, false);
        }
      }
    });

    el.btnRetryLoad.addEventListener('click', init);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') checkCalendarDateChange();
    });
    window.addEventListener('focus', checkCalendarDateChange);
    setInterval(checkCalendarDateChange, 30000);
  }

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */
  let eventsBound = false;

  async function init() {
    try {
      loadStorage();
      if (!eventsBound) {
        bindEvents();
        renderBottomDock();
        eventsBound = true;
      }

      state.currentLocalDate = getLocalCalendarDate();

      const res = await fetch(APP_CONFIG.endpoints.csvUrl, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error loading crossword data.');
      const text = await res.text();
      const rawRecords = parseCSV(text);

      const parsedPuzzles = [];
      rawRecords.forEach((record, idx) => {
        const puzzle = parsePuzzleModel(record, idx);
        if (puzzle) parsedPuzzles.push(puzzle);
      });

      if (!parsedPuzzles.length) {
        throw new Error('No valid crossword records found in library.');
      }

      state.puzzles = parsedPuzzles;
      state.tiers = [...new Set(state.puzzles.map(p => p.tier))];
      state.puzzlesByTier = {};
      state.tiers.forEach(tier => {
        state.puzzlesByTier[tier] = state.puzzles.filter(p => p.tier === tier);
      });

      if (!state.tiers.includes(state.selectedDailyTier)) {
        state.selectedDailyTier = state.tiers[0] || 'standard';
      }

      const initHash = window.location.hash.replace('#', '') || 'overview';
      if (initHash === 'game') {
        const daily = getDailyPuzzleForTier(state.selectedDailyTier);
        if (daily) loadPuzzle(daily, true);
        else setRoute('overview', false);
      } else if (['overview', 'vault', 'stats'].includes(initHash)) {
        setRoute(initHash, false);
      } else {
        setRoute('overview', false);
      }
    } catch (err) {
      showError(err.message || 'Unable to connect to the puzzle archive.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();