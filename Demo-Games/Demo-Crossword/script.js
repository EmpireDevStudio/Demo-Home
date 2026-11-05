(() => {
  'use strict';

  /* ==========================================================================
     DEVELOPER CONFIGURATION
     ========================================================================== */
  const CONFIG = {
    app: {
      name: 'Cocktail Lounge Crossword',
      version: '1.2.0',
      storageKey: 'cocktail_crossword_lounge_universal_v1',
      portalUrl: '../Demo-Games/'
    },
    data: {
      csvUrl: './puzzles.csv',
      defaultTier: 'mini'
    },
    dailyCycle: {
      anchorDate: '2026-01-01',
      startIndex: 0
    },
    display: {
      locale: 'en-GB',
      dateFormat: { month: 'short', day: 'numeric', year: 'numeric' },
      ambientGarnishesMin: 6,
      ambientGarnishesMax: 9,
      spawnIntervalMs: 2200,
      toastDurationMs: 2400
    }
  };

  /* ==========================================================================
     BOTANICAL COCKTAIL GARNISH SVGS
     ========================================================================== */
  const GARNISH_ICONS = [
    `<svg viewBox="0 0 64 64" width="34" height="34" fill="none">
      <path d="M12 48 C 10 32, 26 22, 38 24 C 48 26, 52 38, 44 46 C 36 54, 22 50, 24 38 C 26 26, 42 16, 54 14" stroke="#E86A2D" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M14 46 C 12 33, 27 24, 37 25 C 45 27, 49 36, 43 43 C 37 49, 26 47, 27 38 C 28 29, 41 20, 51 16" stroke="#ECD078" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="32" height="32" fill="none">
      <path d="M16 46 C 10 34, 20 20, 36 20 C 50 20, 52 34, 42 44 C 32 54, 18 44, 26 32 C 34 20, 50 16, 54 12" stroke="#CCA048" stroke-width="3.8" stroke-linecap="round"/>
      <path d="M18 44 C 13 35, 22 23, 35 22 C 46 22, 48 32, 40 40 C 32 48, 22 41, 28 32 C 34 23, 47 18, 51 14" stroke="#FFF1BE" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <circle cx="32" cy="32" r="26" fill="#1C3012" stroke="#6E9447" stroke-width="3"/>
      <circle cx="32" cy="32" r="22" stroke="#A7D472" stroke-width="1.5" stroke-dasharray="2 3"/>
      <circle cx="32" cy="32" r="4" fill="#E2F6C2"/>
      <path d="M32 10 L32 28 M32 36 L32 54 M10 32 L28 32 M36 32 L54 32 M16 16 L29 29 M35 35 L48 48 M16 48 L29 35 M35 29 L48 16" stroke="#90C35B" stroke-width="1.4"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <circle cx="32" cy="32" r="26" fill="#42160C" stroke="#C4511D" stroke-width="3"/>
      <circle cx="32" cy="32" r="22" stroke="#E87C64" stroke-width="1.6" stroke-dasharray="2 3"/>
      <circle cx="32" cy="32" r="4.5" fill="#FFA996"/>
      <path d="M32 10 L32 27.5 M32 36.5 L32 54 M10 32 L27.5 32 M36.5 32 L54 32 M16 16 L28.5 28.5 M35.5 35.5 L48 48 M16 48 L28.5 35.5 M35.5 28.5 L48 16" stroke="#E26A50" stroke-width="1.6"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <circle cx="32" cy="32" r="26" fill="#2E0A07" stroke="#E86A2D" stroke-width="3"/>
      <circle cx="32" cy="32" r="22" stroke="#A81D1D" stroke-width="1.6"/>
      <circle cx="32" cy="32" r="4" fill="#FFA573"/>
      <path d="M32 10 L32 28 M32 36 L32 54 M10 32 L28 32 M36 32 L54 32 M16 16 L29 29 M35 35 L48 48 M16 48 L29 35 M35 29 L48 16" stroke="#C02626" stroke-width="1.8"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="35" height="35" fill="none">
      <circle cx="32" cy="32" r="25" fill="#281607" stroke="#73501D" stroke-width="3.2"/>
      <circle cx="32" cy="32" r="21" stroke="#CCA048" stroke-width="1.2" stroke-dasharray="1 3"/>
      <circle cx="32" cy="32" r="3.5" fill="#CCA048"/>
      <path d="M32 11 L32 28.5 M32 35.5 L32 53 M11 32 L28.5 32 M35.5 32 L53 32 M17 17 L29 29 M35 35 L47 47 M17 47 L29 35 M35 29 L47 17" stroke="#A5772D" stroke-width="1.4"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="34" height="34" fill="none">
      <path d="M32 34 C 36 18, 44 12, 54 8" stroke="#6E9447" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="28" cy="40" r="16" fill="#45080E" stroke="#8C1420" stroke-width="2.5"/>
      <ellipse cx="23" cy="36" rx="4" ry="7" transform="rotate(-30 23 36)" fill="#FF6B7A" opacity="0.65"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M22 36 C 26 22, 36 14, 46 8" stroke="#6E9447" stroke-width="2" stroke-linecap="round"/>
      <path d="M44 38 C 42 24, 38 16, 46 8" stroke="#557734" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="42" r="13" fill="#3D060C" stroke="#780F1B" stroke-width="2"/>
      <circle cx="44" cy="43" r="12" fill="#520A12" stroke="#8C1420" stroke-width="2"/>
      <circle cx="16" cy="38" r="3" fill="#FF7888" opacity="0.6"/>
      <circle cx="41" cy="39" r="2.5" fill="#FF7888" opacity="0.6"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M18 52 Q 32 36 46 14" stroke="#4A6C2C" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M36 30 C 24 24, 20 12, 34 14 C 42 16, 40 26, 36 30 Z" fill="#2E4A19" stroke="#7BAE4E" stroke-width="1.8"/>
      <path d="M38 34 C 48 30, 54 18, 44 16 C 36 14, 34 26, 38 34 Z" fill="#3D6322" stroke="#90C85E" stroke-width="1.8"/>
      <path d="M28 44 C 18 42, 14 30, 26 30 C 34 30, 32 40, 28 44 Z" fill="#294216" stroke="#6C9A43" stroke-width="1.8"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="34" height="34" fill="none">
      <path d="M14 54 Q 30 34 50 10" stroke="#5E4022" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 44 L 14 40 M 24 44 L 20 32" stroke="#537533" stroke-width="2" stroke-linecap="round"/>
      <path d="M32 34 L 22 28 M 32 34 L 30 22" stroke="#689340" stroke-width="2" stroke-linecap="round"/>
      <path d="M40 24 L 32 16 M 40 24 L 40 12" stroke="#7BAF4C" stroke-width="2" stroke-linecap="round"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="35" height="35" fill="none">
      <line x1="8" y1="56" x2="56" y2="8" stroke="#CCA048" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="32" cy="32" rx="14" ry="20" transform="rotate(45 32 32)" fill="#354619" stroke="#6B8838" stroke-width="2.5"/>
      <circle cx="32" cy="32" r="4.5" fill="#B32C19"/>
    </svg>`,
    `<svg viewBox="0 0 64 64" width="36" height="36" fill="none">
      <path d="M12 48 C 22 56, 34 46, 32 32 C 30 18, 44 10, 52 18" stroke="#46682B" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M12 48 C 22 56, 34 46, 32 32 C 30 18, 44 10, 52 18" stroke="#A1D678" stroke-width="2" stroke-linecap="round"/>
      <circle cx="28" cy="36" r="1.5" fill="#E2F6C2"/>
      <circle cx="36" cy="26" r="1.5" fill="#E2F6C2"/>
    </svg>`
  ];

  /* ==========================================================================
     APPLICATION STATE
     ========================================================================== */
  const state = {
    puzzles: [],
    tiers: [],
    puzzlesByTier: {},
    currentLocalDate: '',
    selectedDailyTier: CONFIG.data.defaultTier,
    activeTier: CONFIG.data.defaultTier,
    activePuzzle: null,
    isDailyMode: true,
    userGrid: [],
    cursor: { r: 0, c: 0 },
    direction: 'across',
    timerSeconds: 0,
    timerInterval: null,
    isSolved: false,

    settings: {
      backgroundAnimation: true,
      soundEnabled: true
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
     DOM ELEMENTS REFERENCE
     ========================================================================== */
  const el = {
    siteHeader: document.getElementById('site-header'),
    btnHeaderHome: document.getElementById('btn-header-home'),
    headerGameMeta: document.getElementById('header-game-meta'),
    gameTimer: document.getElementById('game-timer'),
    btnGameHelp: document.getElementById('btn-game-help'),

    screenMenu: document.getElementById('screen-menu'),
    screenGame: document.getElementById('screen-game'),
    screenVault: document.getElementById('screen-vault'),
    screenError: document.getElementById('screen-error'),
    errorMessage: document.getElementById('error-message'),
    btnRetryLoad: document.getElementById('btn-retry-load'),

    dailyDateLabel: document.getElementById('daily-date-label'),
    dailyTierSelector: document.getElementById('daily-tier-selector'),
    btnPlayGame: document.getElementById('btn-play-game'),
    btnPlayLabel: document.getElementById('btn-play-label'),
    btnMenuVault: document.getElementById('btn-menu-vault'),
    btnMenuSettings: document.getElementById('btn-menu-settings'),
    btnMenuHelp: document.getElementById('btn-menu-help'),

    btnUtilStats: document.getElementById('btn-util-stats'),
    btnUtilSound: document.getElementById('btn-util-sound'),
    soundIconOn: document.getElementById('sound-icon-on'),
    soundIconOff: document.getElementById('sound-icon-off'),
    btnUtilShare: document.getElementById('btn-util-share'),
    btnUtilPlus: document.getElementById('btn-util-plus'),

    gameActiveTitle: document.getElementById('game-active-title'),
    btnGameBack: document.getElementById('btn-game-back'),
    gameTierTabs: document.getElementById('game-tier-tabs'),
    activeClueTrigger: document.getElementById('active-clue-trigger'),
    activeClueBadge: document.getElementById('active-clue-badge'),
    activeClueText: document.getElementById('active-clue-text'),
    crosswordBoard: document.getElementById('crossword-board'),
    cluesListAcross: document.getElementById('clues-list-across'),
    cluesListDown: document.getElementById('clues-list-down'),
    onscreenKeyboard: document.getElementById('onscreen-keyboard'),

    vaultList: document.getElementById('vault-list'),
    btnVaultBack: document.getElementById('btn-vault-back'),

    panelHowToPlayOverlay: document.getElementById('panel-howtoplay-overlay'),
    panelHelpBackdrop: document.getElementById('panel-help-backdrop'),
    btnCloseHelp: document.getElementById('btn-close-help'),

    modalSettings: document.getElementById('modal-settings'),
    optAnimOn: document.getElementById('opt-anim-on'),
    optAnimOff: document.getElementById('opt-anim-off'),
    optSoundOn: document.getElementById('opt-sound-on'),
    optSoundOff: document.getElementById('opt-sound-off'),

    modalStats: document.getElementById('modal-stats'),
    statPlayed: document.getElementById('stat-played'),
    statSolved: document.getElementById('stat-solved'),
    statStreak: document.getElementById('stat-streak'),
    statBest: document.getElementById('stat-best'),
    statsTierTimes: document.getElementById('stats-tier-times'),

    modalVictory: document.getElementById('modal-victory'),
    victorySummaryText: document.getElementById('victory-summary-text'),
    btnVictoryAction: document.getElementById('btn-victory-action'),

    toastMessage: document.getElementById('toast-message'),
    bgIconStage: document.getElementById('bg-icon-stage')
  };

  /* ==========================================================================
     AUDIO SYNTHESIS ENGINE
     ========================================================================== */
  class LoungeAudioEngine {
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
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    }

    playKey() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.035);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }

    playToggle() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }

    playVictory() {
      if (this.isMuted) return;
      this.init();
      if (!this.ctx) return;

      const chords = [392.00, 493.88, 587.33, 783.99];
      chords.forEach((freq, idx) => {
        const start = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 1.25);
      });
    }
  }

  const audio = new LoungeAudioEngine();

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
    const msPerDay = 86400000;
    return Math.floor((utcT - utcA) / msPerDay);
  }

  function formatDate(isoStr) {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.toLocaleDateString(CONFIG.display.locale, {
      ...CONFIG.display.dateFormat,
      timeZone: 'UTC'
    });
  }

  /* ==========================================================================
     STORAGE PERSISTENCE
     ========================================================================== */
  function loadStorage() {
    try {
      const raw = localStorage.getItem(CONFIG.app.storageKey);
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
      // Storage access unavailable; operating in memory.
    }

    audio.isMuted = !state.settings.soundEnabled;
    updateSoundIcons();
  }

  function saveStorage() {
    try {
      const payload = {
        settings: state.settings,
        stats: state.saveData.stats,
        history: state.saveData.history,
        inProgress: state.saveData.inProgress
      };
      localStorage.setItem(CONFIG.app.storageKey, JSON.stringify(payload));
    } catch {
      // Storage save omitted.
    }
  }

  function updateSoundIcons() {
    const on = state.settings.soundEnabled;
    el.soundIconOn.classList.toggle('hidden', !on);
    el.soundIconOff.classList.toggle('hidden', on);
    el.optSoundOn.classList.toggle('active', on);
    el.optSoundOn.setAttribute('aria-checked', String(on));
    el.optSoundOff.classList.toggle('active', !on);
    el.optSoundOff.setAttribute('aria-checked', String(!on));
  }

  /* ==========================================================================
     CSV PARSER
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

  /* ==========================================================================
     GRID & CLUE PARSER ENGINE
     ========================================================================== */
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
     ATMOSPHERIC GARNISH FLIGHT SYSTEM
     ========================================================================== */
  class CocktailGarnishAtmosphereEngine {
    constructor(container) {
      this.container = container;
      this.garnishes = [];
      this.animId = null;
      this.lastSpawn = 0;
      this.isActive = true;
    }

    start() {
      if (!this.isActive) return;
      this.loop = this.loop.bind(this);
      this.animId = requestAnimationFrame(this.loop);
    }

    stop() {
      if (this.animId) cancelAnimationFrame(this.animId);
      this.animId = null;
      this.container.innerHTML = '';
      this.garnishes = [];
    }

    spawnGarnish() {
      if (this.garnishes.length >= CONFIG.display.ambientGarnishesMax) return;

      const node = document.createElement('div');
      node.className = 'ambient-garnish';
      const iconIdx = Math.floor(Math.random() * GARNISH_ICONS.length);
      node.innerHTML = GARNISH_ICONS[iconIdx];

      const depthRoll = Math.random();
      let depthClass = 'depth-mid';
      let speed = 0.42 + Math.random() * 0.28;
      let scale = 0.88 + Math.random() * 0.25;

      if (depthRoll < 0.35) {
        depthClass = 'depth-back';
        speed = 0.24 + Math.random() * 0.18;
        scale = 0.65 + Math.random() * 0.2;
      } else if (depthRoll > 0.75) {
        depthClass = 'depth-fore';
        speed = 0.62 + Math.random() * 0.32;
        scale = 1.05 + Math.random() * 0.25;
      }

      node.classList.add(depthClass);

      const x = 3 + Math.random() * 94;
      const startY = window.innerHeight + 50;
      const initialRotation = Math.random() * 360;
      const rotationSpeed = (Math.random() - 0.5) * 0.25;

      this.container.appendChild(node);

      this.garnishes.push({
        el: node,
        x,
        y: startY,
        speed,
        scale,
        rotation: initialRotation,
        rotationSpeed,
        driftPhase: Math.random() * Math.PI * 2,
        driftAmp: 1.2 + Math.random() * 1.8
      });
    }

    loop(timestamp) {
      if (!this.isActive) return;

      if (this.garnishes.length < CONFIG.display.ambientGarnishesMin || 
          (this.garnishes.length < CONFIG.display.ambientGarnishesMax && timestamp - this.lastSpawn > CONFIG.display.spawnIntervalMs)) {
        this.spawnGarnish();
        this.lastSpawn = timestamp;
      }

      for (let i = this.garnishes.length - 1; i >= 0; i--) {
        const g = this.garnishes[i];
        g.y -= g.speed;
        g.rotation += g.rotationSpeed;
        g.driftPhase += 0.015;
        const currentX = g.x + Math.sin(g.driftPhase) * g.driftAmp;

        g.el.style.transform = `translate3d(${currentX}vw, ${g.y}px, 0) scale(${g.scale}) rotate(${g.rotation}deg)`;

        if (g.y < -70) {
          g.el.remove();
          this.garnishes.splice(i, 1);
        }
      }

      this.animId = requestAnimationFrame(this.loop);
    }
  }

  let garnishEngine = null;

  function initGarnishEngine() {
    garnishEngine = new CocktailGarnishAtmosphereEngine(el.bgIconStage);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (state.settings.backgroundAnimation && !prefersReducedMotion) {
      garnishEngine.start();
    }
  }

  function setBackgroundAnimation(enabled) {
    state.settings.backgroundAnimation = enabled;
    saveStorage();

    el.optAnimOn.classList.toggle('active', enabled);
    el.optAnimOn.setAttribute('aria-checked', String(enabled));
    el.optAnimOff.classList.toggle('active', !enabled);
    el.optAnimOff.setAttribute('aria-checked', String(!enabled));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (enabled && !prefersReducedMotion) {
      if (!garnishEngine.animId) garnishEngine.start();
    } else {
      garnishEngine.stop();
    }
  }

  function setSoundEnabled(enabled) {
    state.settings.soundEnabled = enabled;
    audio.isMuted = !enabled;
    saveStorage();
    updateSoundIcons();
    if (enabled) audio.playTap();
  }

  /* ==========================================================================
     DAILY CHALLENGE RESOLUTION
     ========================================================================== */
  function getDailyPuzzleForTier(tier) {
    const list = state.puzzlesByTier[tier] || state.puzzles;
    if (!list || !list.length) return null;

    const daysElapsed = getCalendarDaysDiff(CONFIG.dailyCycle.anchorDate, state.currentLocalDate);
    const cycleOffset = CONFIG.dailyCycle.startIndex;
    const index = ((daysElapsed + cycleOffset) % list.length + list.length) % list.length;
    return list[index];
  }

  function checkCalendarDateChange() {
    const latestDate = getLocalCalendarDate();
    if (latestDate !== state.currentLocalDate) {
      state.currentLocalDate = latestDate;
      if (!el.screenMenu.classList.contains('hidden')) {
        renderMenu();
      }
    }
  }

  /* ==========================================================================
     APP INITIALIZATION & ROUTING
     ========================================================================== */
  async function init() {
    try {
      loadStorage();
      bindEvents();
      initGarnishEngine();

      state.currentLocalDate = getLocalCalendarDate();

      const res = await fetch(CONFIG.data.csvUrl, { cache: 'no-store' });
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

      renderMenu();
      showScreen('menu');
    } catch (err) {
      showError(err.message || 'Unable to connect to the cellar archive.');
    }
  }

  function showError(msg) {
    el.errorMessage.textContent = msg;
    showScreen('error');
  }

  function showScreen(screen) {
    el.screenMenu.classList.toggle('hidden', screen !== 'menu');
    el.screenGame.classList.toggle('hidden', screen !== 'game');
    el.screenVault.classList.toggle('hidden', screen !== 'vault');
    el.screenError.classList.toggle('hidden', screen !== 'error');

    el.headerGameMeta.classList.toggle('active', screen === 'game');
  }

  /* ==========================================================================
     MENU VIEW
     ========================================================================== */
  function renderMenu() {
    el.dailyDateLabel.textContent = `Daily Edition · ${formatDate(state.currentLocalDate)}`;
    el.dailyTierSelector.innerHTML = '';

    state.tiers.forEach(tier => {
      const dailyPuzzle = getDailyPuzzleForTier(tier);
      const isDone = dailyPuzzle ? !!state.saveData.history[dailyPuzzle.id]?.solved : false;

      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `tier-pill ${tier === state.selectedDailyTier ? 'selected' : ''}`;
      pill.innerHTML = `<span>${tier}</span>${isDone ? ' &#x2713;' : ''}`;
      pill.addEventListener('click', () => {
        audio.playTap();
        state.selectedDailyTier = tier;
        renderMenu();
      });
      el.dailyTierSelector.appendChild(pill);
    });

    const activeDaily = getDailyPuzzleForTier(state.selectedDailyTier);
    const isCurrentSolved = activeDaily ? !!state.saveData.history[activeDaily.id]?.solved : false;
    const tierDisplay = state.selectedDailyTier.charAt(0).toUpperCase() + state.selectedDailyTier.slice(1);

    el.btnPlayLabel.textContent = isCurrentSolved
      ? `Review ${tierDisplay} Ledger`
      : `Play ${tierDisplay} Crossword`;
  }

  /* ==========================================================================
     VAULT VIEW
     ========================================================================== */
  function renderVault() {
    el.vaultList.innerHTML = '';

    if (!state.puzzles.length) {
      el.vaultList.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 36px;">No editions archived in the vault yet.</p>';
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
          <span class="vault-card-meta">${puzzle.size}×${puzzle.size} · #${index + 1}</span>
        </div>
        <div class="vault-badges">
          <span class="vault-tier-badge tier-${puzzle.tier}">${puzzle.tier}</span>
          ${isDone ? `<span class="vault-tier-badge completed">✓ ${formatTime(solveTime)}</span>` : ''}
        </div>
      `;

      card.addEventListener('click', () => {
        audio.playTap();
        loadPuzzle(puzzle, false);
      });

      el.vaultList.appendChild(card);
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

    showScreen('game');
    updateTimerDisplay();

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
    el.gameTierTabs.innerHTML = '';

    if (state.isDailyMode) {
      state.tiers.forEach(tier => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `tier-tab-pill ${tier === state.activeTier ? 'active' : ''}`;
        const dailyTierPuzzle = getDailyPuzzleForTier(tier);
        const isDone = dailyTierPuzzle ? !!state.saveData.history[dailyTierPuzzle.id]?.solved : false;
        btn.innerHTML = `${tier}${isDone ? ' &#x2713;' : ''}`;
        btn.addEventListener('click', () => {
          audio.playTap();
          state.selectedDailyTier = tier;
          const target = getDailyPuzzleForTier(tier);
          if (target) loadPuzzle(target, true);
        });
        el.gameTierTabs.appendChild(btn);
      });
    } else {
      const badge = document.createElement('span');
      badge.className = 'tier-tab-pill active';
      badge.textContent = state.activeTier;
      el.gameTierTabs.appendChild(badge);
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
    el.activeClueText.textContent = clueObj ? clueObj.clue : 'Select any cell to inspect its clue.';

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
        el.btnVictoryAction.querySelector('.btn-text').textContent = `Play ${nextTier.toUpperCase()}`;
        el.btnVictoryAction.onclick = () => {
          closeModal(el.modalVictory);
          state.selectedDailyTier = nextTier;
          const target = getDailyPuzzleForTier(nextTier);
          if (target) loadPuzzle(target, true);
        };
      } else {
        el.btnVictoryAction.querySelector('.btn-text').textContent = 'Return to Lounge';
        el.btnVictoryAction.onclick = () => {
          closeModal(el.modalVictory);
          showScreen('menu');
          renderMenu();
        };
      }
    } else {
      el.btnVictoryAction.querySelector('.btn-text').textContent = 'Return to Vault';
      el.btnVictoryAction.onclick = () => {
        closeModal(el.modalVictory);
        renderVault();
        showScreen('vault');
      };
    }
    openModal(el.modalVictory);
  }

  /* ==========================================================================
     HOW TO PLAY INTERACTION
     ========================================================================== */
  function openHowToPlay() {
    audio.playTap();
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
    }, 430);
  }

  /* ==========================================================================
     MODALS & UTILITIES
     ========================================================================== */
  function openStatsModal() {
    audio.playTap();
    const s = state.saveData.stats;
    el.statPlayed.textContent = s.played;
    el.statSolved.textContent = s.solved;
    el.statStreak.textContent = s.streak;
    el.statBest.textContent = s.bestStreak;

    el.statsTierTimes.innerHTML = '';
    ['mini', 'midi', 'main'].forEach(tier => {
      const times = s.times[tier] || [];
      const med = times.length ? formatTime([...times].sort((a, b) => a - b)[Math.floor(times.length / 2)]) : '--:--';
      const li = document.createElement('li');
      li.innerHTML = `<span>${tier}</span><strong>${med}</strong>`;
      el.statsTierTimes.appendChild(li);
    });
    openModal(el.modalStats);
  }

  function openSettingsModal() {
    audio.playTap();
    const isAnim = state.settings.backgroundAnimation;
    el.optAnimOn.classList.toggle('active', isAnim);
    el.optAnimOn.setAttribute('aria-checked', String(isAnim));
    el.optAnimOff.classList.toggle('active', !isAnim);
    el.optAnimOff.setAttribute('aria-checked', String(!isAnim));

    updateSoundIcons();
    openModal(el.modalSettings);
  }

  async function handleShareAction() {
    audio.playTap();
    const shareData = {
      title: CONFIG.app.name,
      text: "Solve today's Speakeasy Crossword Edition!",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Ledger shared successfully!');
      } catch {
        // Share dismissed or unsupported.
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!');
      } catch {
        showToast('Failed to copy link.');
      }
    } else {
      showToast('Sharing not supported on this browser.');
    }
  }

  function handlePlusAction() {
    audio.playTap();
    showToast('Tileworks Portal: More lounge games arriving soon.');
  }

  function showToast(msg) {
    el.toastMessage.textContent = msg;
    el.toastMessage.classList.remove('hidden');
    el.toastMessage.style.opacity = '1';
    setTimeout(() => {
      el.toastMessage.style.opacity = '0';
      setTimeout(() => el.toastMessage.classList.add('hidden'), 220);
    }, CONFIG.display.toastDurationMs);
  }

  function openModal(m) { m.classList.remove('hidden'); }
  function closeModal(m) { 
    audio.playTap();
    m.classList.add('hidden'); 
  }

  function updateTimerDisplay() {
    el.gameTimer.textContent = formatTime(state.timerSeconds);
  }

  function formatTime(secs) {
    if (secs == null) return '--:--';
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ==========================================================================
     EVENT ATTACHMENTS
     ========================================================================== */
  function bindEvents() {
    el.btnHeaderHome.addEventListener('click', (e) => {
      e.preventDefault();
      audio.playTap();
      if (CONFIG.app.portalUrl && CONFIG.app.portalUrl !== '#') {
        window.location.href = CONFIG.app.portalUrl;
      } else {
        showScreen('menu');
        renderMenu();
      }
    });

    el.btnPlayGame.addEventListener('click', () => {
      audio.playTap();
      const dailyPuzzle = getDailyPuzzleForTier(state.selectedDailyTier);
      if (dailyPuzzle) loadPuzzle(dailyPuzzle, true);
    });

    el.btnMenuVault.addEventListener('click', () => {
      audio.playTap();
      renderVault();
      showScreen('vault');
    });

    el.btnMenuSettings.addEventListener('click', openSettingsModal);
    el.btnMenuHelp.addEventListener('click', openHowToPlay);
    el.btnGameHelp.addEventListener('click', openHowToPlay);

    el.btnUtilStats.addEventListener('click', openStatsModal);
    el.btnUtilSound.addEventListener('click', () => {
      setSoundEnabled(!state.settings.soundEnabled);
    });
    el.btnUtilShare.addEventListener('click', handleShareAction);
    el.btnUtilPlus.addEventListener('click', handlePlusAction);

    el.btnGameBack.addEventListener('click', () => {
      audio.playTap();
      clearInterval(state.timerInterval);
      showScreen('menu');
      renderMenu();
    });

    el.btnVaultBack.addEventListener('click', () => {
      audio.playTap();
      showScreen('menu');
      renderMenu();
    });

    el.activeClueTrigger.addEventListener('click', () => {
      audio.playToggle();
      state.direction = state.direction === 'across' ? 'down' : 'across';
      updateSelection();
    });

    el.activeClueTrigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        audio.playToggle();
        state.direction = state.direction === 'across' ? 'down' : 'across';
        updateSelection();
      }
    });

    el.btnCloseHelp.addEventListener('click', closeHowToPlay);
    el.panelHelpBackdrop.addEventListener('click', closeHowToPlay);

    el.optAnimOn.addEventListener('click', () => setBackgroundAnimation(true));
    el.optAnimOff.addEventListener('click', () => setBackgroundAnimation(false));
    el.optSoundOn.addEventListener('click', () => setSoundEnabled(true));
    el.optSoundOff.addEventListener('click', () => setSoundEnabled(false));

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', () => closeModal(document.getElementById(btn.dataset.close)));
    });

    el.btnRetryLoad.addEventListener('click', init);

    el.onscreenKeyboard.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.preventDefault();
      const key = btn.dataset.key;
      if (key === 'DIR') {
        audio.playToggle();
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
        [el.modalSettings, el.modalStats, el.modalVictory].forEach(m => {
          if (!m.classList.contains('hidden')) closeModal(m);
        });
        return;
      }

      if (el.screenGame.classList.contains('hidden')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        audio.playToggle();
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

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkCalendarDateChange();
      }
    });
    window.addEventListener('focus', checkCalendarDateChange);
    setInterval(checkCalendarDateChange, 30000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();