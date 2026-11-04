(function () {
  'use strict';

  // ==========================================================================
  // CENTRAL DEVELOPER CONFIGURATION
  // ==========================================================================

  const APP_CONFIG = Object.freeze({
    app: {
      name: 'Hangman — Cocktail Lounge Nocturne',
      storageKey: 'hangman_cocktail_lounge_v5',
      legacyStorageKeys: ['hangman_universal_hangman_lounge_v4', 'universal_hangman_v3', 'universal_hangman_v2', 'universal_hangman_v1'],
      homeUrl: 'https://tileworksgamesstudio.github.io/86/',
      maxStrikes: 6
    },
    data: {
      csvPath: './puzzles.csv',
      fetchTimeoutMs: 8000
    },
    dailyCycle: {
      anchorDate: '2026-09-08',
      startingIndex: 0
    },
    display: {
      dateLocale: 'en-US',
      dateFormatOptions: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      },
      toastDurationMs: 2400,
      revealStaggerMs: 40
    }
  });

  // ==========================================================================
  // FALLBACK PUZZLE REPOSITORY (Used if network retrieval is unavailable)
  // ==========================================================================

  const FALLBACK_PUZZLES = Object.freeze([
    {
      category: 'Cocktails',
      answer: 'NEGRONI',
      clue: 'Equal-parts Italian classic of gin, sweet vermouth, and Campari.',
      note: 'Invented in Florence circa 1919 when Count Camillo Negroni asked to stiffen his Americano with gin instead of soda.'
    },
    {
      category: 'Bar Tools',
      answer: 'HAWTHORNE STRAINER',
      clue: 'Perforated metal bar tool fitted with a flexible wire coil.',
      note: 'The spring adapts to the shaker rim to hold back shaken ice and broken fruit pulp.'
    },
    {
      category: 'Ingredients',
      answer: 'ORGEAT',
      clue: 'Almond syrup delicately scented with rose water or orange flower water.',
      note: 'A fundamental sweetener in tropical tiki drinks like the classic 1944 Mai Tai.'
    },
    {
      category: 'Spirits',
      answer: 'MEZCAL',
      clue: 'Traditional Mexican spirit distilled from agave roasted in earthen pit ovens.',
      note: 'Unlike tequila, it can be made from over thirty varieties of agave and carries a distinctive smoky profile.'
    },
    {
      category: 'Glassware',
      answer: 'COUPE',
      clue: 'Stemmed shallow-bowled glass originally designed for champagne.',
      note: 'Widely favored in modern cocktail service for drinks served up without ice.'
    }
  ]);

  // ==========================================================================
  // CALENDAR ARITHMETIC & LOCAL CYCLE SYSTEM
  // ==========================================================================

  class CalendarCycleEngine {
    static getLocalDateKey(dateObj = new Date()) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    static getDaysBetween(anchorDateStr, targetDateStr) {
      const [ay, am, ad] = anchorDateStr.split('-').map(Number);
      const [ty, tm, td] = targetDateStr.split('-').map(Number);

      const anchorUtc = Date.UTC(ay, am - 1, ad);
      const targetUtc = Date.UTC(ty, tm - 1, td);

      return Math.floor((targetUtc - anchorUtc) / 86400000);
    }

    static getDailyIndex(totalPuzzles, targetDateStr = this.getLocalDateKey()) {
      if (!totalPuzzles || totalPuzzles <= 0) return 0;

      const daysDiff = this.getDaysBetween(APP_CONFIG.dailyCycle.anchorDate, targetDateStr);
      const offset = (daysDiff + APP_CONFIG.dailyCycle.startingIndex) % totalPuzzles;

      return (offset % totalPuzzles + totalPuzzles) % totalPuzzles;
    }

    static formatDisplayDate(dateObj = new Date()) {
      try {
        return new Intl.DateTimeFormat(
          APP_CONFIG.display.dateLocale,
          APP_CONFIG.display.dateFormatOptions
        ).format(dateObj);
      } catch (err) {
        return dateObj.toDateString();
      }
    }

    static getMillisecondsUntilMidnight(now = new Date()) {
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
      );
      return Math.max(1000, midnight.getTime() - now.getTime());
    }
  }

  // ==========================================================================
  // ROBUST CSV PARSER
  // ==========================================================================

  function parseCSV(text) {
    let cell = '', row = [''], rows = [row], i = 0, inQuotes = false;
    for (let charIndex = 0; charIndex < text.length; charIndex++) {
      const char = text[charIndex];
      const nextChar = text[charIndex + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          cell += '"';
          charIndex++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row[i++] = cell;
        cell = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') charIndex++;
        row[i] = cell;
        cell = '';
        row = [''];
        rows.push(row);
        i = 0;
      } else {
        cell += char;
      }
    }

    row[i] = cell;
    if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === '') {
      rows.pop();
    }
    return rows;
  }

  // ==========================================================================
  // STORAGE & USER STATE PERSISTENCE
  // ==========================================================================

  class GameStorage {
    static load() {
      try {
        let raw = localStorage.getItem(APP_CONFIG.app.storageKey);
        if (!raw) {
          for (const key of APP_CONFIG.app.legacyStorageKeys) {
            raw = localStorage.getItem(key);
            if (raw) break;
          }
        }
        if (!raw) return this.createInitialState();
        return this.sanitize(JSON.parse(raw));
      } catch (e) {
        return this.createInitialState();
      }
    }

    static sanitize(data) {
      const defaultState = this.createInitialState();
      if (!data || typeof data !== 'object') return defaultState;

      const stats = data.stats || {};
      const history = (data.history && typeof data.history === 'object') ? data.history : {};
      const settings = (data.settings && typeof data.settings === 'object') ? data.settings : {};

      let dist = Array.isArray(stats.distribution) ? stats.distribution.map(Number) : [];
      if (dist.length !== APP_CONFIG.app.maxStrikes + 1) {
        dist = new Array(APP_CONFIG.app.maxStrikes + 1).fill(0);
      }

      return {
        version: 5,
        settings: {
          bgAnimation: settings.bgAnimation !== undefined ? Boolean(settings.bgAnimation) : true
        },
        stats: {
          played: Number(stats.played) || 0,
          won: Number(stats.won) || 0,
          currentStreak: Number(stats.currentStreak) || 0,
          maxStreak: Number(stats.maxStreak) || 0,
          lastDailyWinDate: typeof stats.lastDailyWinDate === 'string' ? stats.lastDailyWinDate : null,
          flawlessWins: Number(stats.flawlessWins) || 0,
          totalStrikesInWins: Number(stats.totalStrikesInWins) || 0,
          distribution: dist
        },
        history
      };
    }

    static save(data) {
      try {
        localStorage.setItem(APP_CONFIG.app.storageKey, JSON.stringify(data));
      } catch (e) {}
    }

    static createInitialState() {
      return {
        version: 5,
        settings: {
          bgAnimation: true
        },
        stats: {
          played: 0,
          won: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastDailyWinDate: null,
          flawlessWins: 0,
          totalStrikesInWins: 0,
          distribution: new Array(APP_CONFIG.app.maxStrikes + 1).fill(0)
        },
        history: {}
      };
    }
  }

  // ==========================================================================
  // BOTANICAL GARNISH FLIGHT SYSTEM
  // ==========================================================================

  const GARNISH_SVGS = [
    `<svg viewBox="0 0 64 64" fill="none"><path d="M12,48 C16,28 34,14 48,18 C58,22 52,38 38,40 C22,42 16,30 24,18 C28,12 36,10 44,14" stroke="#DF8235" stroke-width="4.5" stroke-linecap="round"/><path d="M14,46 C17,30 33,18 46,20" stroke="#FFF1BE" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M18,52 C12,38 20,20 34,16 C46,12 54,24 48,36 C42,48 26,46 22,34 C18,22 28,14 42,16" stroke="#ECD078" stroke-width="3.6" stroke-linecap="round"/><path d="M20,50 C15,38 22,23 34,19" stroke="#FFF1BE" stroke-width="1" opacity="0.85"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="#6E9447" stroke-width="3"/><circle cx="32" cy="32" r="21" fill="rgba(110, 148, 71, 0.22)" stroke="#F5DE8C" stroke-width="0.8"/><path d="M32,13 L32,51 M13,32 L51,32 M19,19 L45,45 M19,45 L45,19" stroke="#ECD078" stroke-width="1.2"/><circle cx="32" cy="32" r="3.5" fill="#F5DE8C"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="25" stroke="#DF8235" stroke-width="3.5"/><circle cx="32" cy="32" r="21.5" fill="rgba(223, 130, 53, 0.26)" stroke="#FFF1BE" stroke-width="0.8"/><path d="M32,12 L32,52 M12,32 L52,32 M18,18 L46,46 M18,46 L46,18" stroke="#F5DE8C" stroke-width="1.3"/><circle cx="32" cy="32" r="3.8" fill="#FFF1BE"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="#B93826" stroke-width="3.4"/><circle cx="32" cy="32" r="20.6" fill="rgba(185, 56, 38, 0.35)" stroke="#CCA048" stroke-width="0.8"/><path d="M32,13 L32,51 M13,32 L51,32 M19,19 L45,45 M19,45 L45,19" stroke="#DF8235" stroke-width="1.2"/><circle cx="32" cy="32" r="3.6" fill="#F5DE8C"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" stroke="#73501D" stroke-width="3.8"/><circle cx="32" cy="32" r="20" fill="rgba(115, 80, 29, 0.3)" stroke="#A5772D" stroke-width="0.9"/><path d="M32,14 L32,50 M14,32 L50,32 M20,20 L44,44 M20,44 L44,20" stroke="#CCA048" stroke-width="1.4"/><circle cx="32" cy="32" r="3.5" fill="#A5772D"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M34,26 C36,14 44,8 52,9" stroke="#73501D" stroke-width="2.2" stroke-linecap="round"/><circle cx="30" cy="38" r="15" fill="#9E3812" stroke="#DF8235" stroke-width="1.2"/><ellipse cx="26" cy="32" rx="4" ry="2.2" fill="#FFF1BE" opacity="0.75" transform="rotate(-30 26 32)"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M22,34 C26,16 34,10 40,8 M44,38 C42,20 38,12 40,8" stroke="#73501D" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="40" r="11.5" fill="#9E3812" stroke="#E86A2D" stroke-width="1"/><circle cx="44" cy="42" r="12" fill="#701815" stroke="#DF8235" stroke-width="1"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M18,50 C26,38 34,24 44,14" stroke="#6E9447" stroke-width="2.2" stroke-linecap="round"/><path d="M44,14 C48,22 42,28 34,26 C32,18 38,12 44,14 Z" fill="rgba(110, 148, 71, 0.85)" stroke="#F5DE8C" stroke-width="0.8"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M16,52 Q32,32 46,14" stroke="#73501D" stroke-width="2" stroke-linecap="round"/><line x1="26" y1="42" x2="16" y2="38" stroke="#6E9447" stroke-width="2" stroke-linecap="round"/><line x1="30" y1="36" x2="38" y2="28" stroke="#6E9447" stroke-width="2" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="34" rx="16" ry="20" fill="#6E9447" stroke="#CCA048" stroke-width="1.2" transform="rotate(-15 32 34)"/><circle cx="30" cy="24" r="5" fill="#B93826" stroke="#DF8235" stroke-width="0.8"/></svg>`,
    `<svg viewBox="0 0 64 64" fill="none"><path d="M12,48 Q24,20 36,44 T54,20" stroke="#6E9447" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.85"/><path d="M12,48 Q24,20 36,44 T54,20" stroke="#FFF1BE" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.6"/></svg>`
  ];

  class AtmosphereEngine {
    constructor(container, isEnabled) {
      this.container = container;
      this.isEnabled = isEnabled;
      this.targetPopulation = 8;
      this.init();
    }

    init() {
      if (!this.container) return;
      this.container.innerHTML = '';
      if (!this.isEnabled) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (let i = 0; i < this.targetPopulation; i++) {
        this.spawnGarnish(true, i / this.targetPopulation);
      }
    }

    spawnGarnish(isInitial = false, progressFraction = 0) {
      if (!this.isEnabled || !this.container) return;

      const element = document.createElement('div');
      const depthVal = Math.random();
      let depthClass = 'plane-mid';
      let size = 44;
      let duration = 22 + Math.random() * 8;

      if (depthVal < 0.35) {
        depthClass = 'plane-distant';
        size = 32 + Math.random() * 8;
        duration = 28 + Math.random() * 10;
      } else if (depthVal > 0.75) {
        depthClass = 'plane-near';
        size = 52 + Math.random() * 12;
        duration = 18 + Math.random() * 7;
      }

      element.className = `garnish-plane ${depthClass}`;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${Math.random() * 88 + 6}%`;

      const driftMidX = (Math.random() - 0.5) * 40;
      const driftEndX = (Math.random() - 0.5) * 60;
      const rotStart = Math.random() * 360;
      const rotDelta = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 40);

      element.style.setProperty('--drift-start-x', '0px');
      element.style.setProperty('--drift-mid-x', `${driftMidX}px`);
      element.style.setProperty('--drift-end-x', `${driftEndX}px`);
      element.style.setProperty('--rot-start', `${rotStart}deg`);
      element.style.setProperty('--rot-mid', `${rotStart + rotDelta / 2}deg`);
      element.style.setProperty('--rot-end', `${rotStart + rotDelta}deg`);

      const delay = isInitial ? -1 * (duration * progressFraction) : 0;
      element.style.animation = `garnishRise ${duration}s linear ${delay}s infinite`;

      const svgMarkup = GARNISH_SVGS[Math.floor(Math.random() * GARNISH_SVGS.length)];
      element.innerHTML = `<div class="garnish-svg-wrap">${svgMarkup}</div>`;

      this.container.appendChild(element);
    }

    setEnabled(enabled) {
      this.isEnabled = enabled;
      this.init();
    }
  }

  // ==========================================================================
  // CONFETTI CELEBRATION
  // ==========================================================================

  class ConfettiCelebration {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize(), { passive: true });
    }

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    fire() {
      if (!this.ctx) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.particles = [];
      const colors = ['#FFF1BE', '#F5DE8C', '#CCA048', '#DF8235', '#C4511D', '#6E9447', '#87498C'];
      for (let i = 0; i < 50; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2 - 20,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.75) * 14,
          size: Math.random() * 6 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 9,
          opacity: 1
        });
      }

      cancelAnimationFrame(this.animId);
      this.render();
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let isAnyActive = false;

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.opacity -= 0.015;
        p.rotation += p.rotSpeed;

        if (p.opacity > 0) {
          isAnyActive = true;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          this.ctx.restore();
        }
      });

      if (isAnyActive) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // ==========================================================================
  // PHYSICAL AUDIO SYSTEM
  // ==========================================================================

  class LoungeAudioEngine {
    constructor() {
      this.audioCtx = null;
    }

    ensureContext() {
      if (!this.audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new Ctx();
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
    }

    playTap() {
      try {
        this.ensureContext();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.04);
      } catch (e) {}
    }

    playCorrect() {
      try {
        this.ensureContext();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        [587.33, 880].forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.05, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.18);
        });
      } catch (e) {}
    }

    playStrike() {
      try {
        this.ensureContext();
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, this.audioCtx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.14);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.14);
      } catch (e) {}
    }

    playWin() {
      try {
        this.ensureContext();
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.06, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.35);
        });
      } catch (e) {}
    }
  }

  // ==========================================================================
  // MASTER GAME ENGINE
  // ==========================================================================

  class HangmanEngine {
    constructor() {
      this.store = GameStorage.load();
      this.puzzles = [];
      this.dailyPuzzle = null;
      this.activePuzzle = null;
      this.currentLocalDateKey = CalendarCycleEngine.getLocalDateKey();

      this.guessedLetters = new Set();
      this.strikes = 0;
      this.isGameOver = false;
      this.isReviewMode = false;
      this.isClueVisible = true;
      this.navigationSource = 'menu';
      this.lastFocusedElement = null;
      this.midnightTimer = null;

      this.cacheDom();
      this.audio = new LoungeAudioEngine();
      this.atmosphere = new AtmosphereEngine(
        this.dom.bgIconsContainer,
        this.store.settings.bgAnimation
      );
      this.confetti = new ConfettiCelebration(this.dom.confettiCanvas);

      this.initEvents();
      this.initHistoryRouting();
      this.initMidnightWatcher();
    }

    cacheDom() {
      this.dom = {
        menuScreen: document.getElementById('menu-screen'),
        vaultScreen: document.getElementById('vault-screen'),
        gameScreen: document.getElementById('game-screen'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        bgIconsContainer: document.getElementById('bg-icons-container'),

        navHomeBtn: document.getElementById('nav-home-btn'),
        clockSyncText: document.getElementById('clock-sync-text'),
        menuDateBanner: document.getElementById('menu-date-banner'),

        menuPlayBtn: document.getElementById('menu-play-btn'),
        playBtnKicker: document.getElementById('play-btn-kicker'),
        playBtnLabel: document.getElementById('play-btn-label'),
        playBtnSub: document.getElementById('play-btn-sub'),
        playBtnStatus: document.getElementById('play-btn-status'),
        menuVaultBtn: document.getElementById('menu-vault-btn'),
        vaultCountBadge: document.getElementById('vault-count-badge'),
        menuSettingsBtn: document.getElementById('menu-settings-btn'),
        menuRulesBtn: document.getElementById('menu-rules-btn'),

        menuStatsBtn: document.getElementById('menu-stats-btn'),
        menuShareBtn: document.getElementById('menu-share-btn'),
        menuPlusBtn: document.getElementById('menu-plus-btn'),

        rulesOverlay: document.getElementById('rules-overlay'),
        rulesPanel: document.getElementById('rules-panel'),
        rulesPanelClose: document.getElementById('rules-panel-close'),

        settingsModal: document.getElementById('settings-modal'),
        settingAnimationToggle: document.getElementById('setting-animation-toggle'),

        vaultBackBtn: document.getElementById('vault-back-btn'),
        vaultList: document.getElementById('vault-list'),

        gameBackBtn: document.getElementById('game-back-btn'),
        gameSummaryBtn: document.getElementById('game-summary-btn'),
        reviewBanner: document.getElementById('review-banner'),
        reviewStatusText: document.getElementById('review-status-text'),
        gameToast: document.getElementById('game-toast'),
        puzzleTitle: document.getElementById('puzzle-title'),
        apparatusSection: document.getElementById('apparatus-section'),
        strikeCountText: document.getElementById('strike-count-text'),
        strikePips: document.getElementById('strike-pips'),
        wordBoard: document.getElementById('word-board'),
        gameCategoryTag: document.getElementById('game-category-tag'),
        clueToggleBtn: document.getElementById('clue-toggle-btn'),
        gameClueText: document.getElementById('game-clue-text'),
        keyboard: document.getElementById('keyboard'),

        statsModal: document.getElementById('stats-modal'),
        resultModal: document.getElementById('result-modal'),
        statPlayed: document.getElementById('stat-played'),
        statWinRate: document.getElementById('stat-win-rate'),
        statStreak: document.getElementById('stat-streak'),
        statMaxStreak: document.getElementById('stat-max-streak'),
        statFlawless: document.getElementById('stat-flawless'),
        statAvgStrikes: document.getElementById('stat-avg-strikes'),
        strikeDistributionBars: document.getElementById('strike-distribution-bars'),
        resultStatusBadge: document.getElementById('result-status-badge'),
        resultAnswer: document.getElementById('result-answer'),
        resultNote: document.getElementById('result-note'),
        resultCountdownBox: document.getElementById('result-countdown-box'),
        resultCountdownTimer: document.getElementById('result-countdown-timer'),
        resultShareBtn: document.getElementById('result-share-btn'),
        resultMenuBtn: document.getElementById('result-menu-btn'),
        shareToast: document.getElementById('share-toast'),
        announcer: document.getElementById('screen-reader-feed')
      };

      if (this.dom.settingAnimationToggle) {
        this.dom.settingAnimationToggle.checked = this.store.settings.bgAnimation;
      }

      this.dom.navHomeBtn.setAttribute('href', APP_CONFIG.app.homeUrl);
      this.dom.navHomeBtn.onclick = (e) => {
        if (APP_CONFIG.app.homeUrl === '#') {
          e.preventDefault();
          this.audio.playTap();
          this.showGameToast('Portal hub connected');
        }
      };
    }

    async init() {
      this.updateDateDisplay();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.data.fetchTimeoutMs);

        const res = await fetch(APP_CONFIG.data.csvPath, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        const csvText = await res.text();
        this.loadPuzzlesFromCSV(csvText);
      } catch (err) {
        this.loadPuzzlesFromArray(FALLBACK_PUZZLES);
      }

      this.refreshDailyChallengeSelection();
      this.renderMenu();
    }

    loadPuzzlesFromCSV(csvText) {
      const rows = parseCSV(csvText);
      if (rows.length < 2) {
        this.loadPuzzlesFromArray(FALLBACK_PUZZLES);
        return;
      }

      const headers = rows[0].map(h => (h || '').trim().toLowerCase());
      const answerIndex = headers.indexOf('answer');
      const categoryIndex = headers.indexOf('category');
      const clueIndex = headers.indexOf('clue');
      const noteIndex = headers.indexOf('note');

      this.puzzles = [];
      let sequenceId = 1;

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

        if (answer.length === 0) continue;

        const category = (categoryIndex >= 0 && row[categoryIndex] ? row[categoryIndex] : 'Cocktail Lounge').trim();
        const clue = (clueIndex >= 0 && row[clueIndex] ? row[clueIndex] : '').trim();
        const note = (noteIndex >= 0 && row[noteIndex] ? row[noteIndex] : '').trim();

        this.puzzles.push({
          id: `puzzle_${sequenceId++}`,
          answer,
          category,
          clue,
          note
        });
      }

      if (this.puzzles.length === 0) {
        this.loadPuzzlesFromArray(FALLBACK_PUZZLES);
      }
    }

    loadPuzzlesFromArray(puzzleList) {
      this.puzzles = puzzleList.map((item, idx) => ({
        id: `puzzle_${idx + 1}`,
        answer: (item.answer || '').toUpperCase().trim(),
        category: item.category || 'Cocktail Lounge',
        clue: item.clue || '',
        note: item.note || ''
      }));
    }

    refreshDailyChallengeSelection() {
      this.currentLocalDateKey = CalendarCycleEngine.getLocalDateKey();
      this.updateDateDisplay();

      if (this.puzzles.length === 0) return;

      const dailyIndex = CalendarCycleEngine.getDailyIndex(this.puzzles.length, this.currentLocalDateKey);
      this.dailyPuzzle = this.puzzles[dailyIndex];

      if (this.dom.vaultCountBadge) {
        this.dom.vaultCountBadge.textContent = `${this.puzzles.length} Available`;
      }
    }

    updateDateDisplay() {
      const now = new Date();
      const formattedDate = CalendarCycleEngine.formatDisplayDate(now);

      if (this.dom.menuDateBanner) {
        this.dom.menuDateBanner.textContent = formattedDate;
      }
      if (this.dom.playBtnKicker) {
        this.dom.playBtnKicker.textContent = `Daily Challenge • ${formattedDate}`;
      }
      if (this.dom.clockSyncText) {
        this.dom.clockSyncText.textContent = formattedDate;
      }
    }

    initMidnightWatcher() {
      const tick = () => {
        const msUntilMidnight = CalendarCycleEngine.getMillisecondsUntilMidnight();
        const h = String(Math.floor(msUntilMidnight / 3600000)).padStart(2, '0');
        const m = String(Math.floor((msUntilMidnight % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((msUntilMidnight % 60000) / 1000)).padStart(2, '0');

        if (this.dom.resultCountdownTimer) {
          this.dom.resultCountdownTimer.textContent = `${h}:${m}:${s}`;
        }

        const freshDateKey = CalendarCycleEngine.getLocalDateKey();
        if (freshDateKey !== this.currentLocalDateKey) {
          this.refreshDailyChallengeSelection();
          if (this.dom.menuScreen.classList.contains('screen-active')) {
            this.renderMenu();
          } else if (this.dom.vaultScreen.classList.contains('screen-active')) {
            this.renderVault();
          }
        }
      };

      tick();
      this.midnightTimer = setInterval(tick, 1000);

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const freshDateKey = CalendarCycleEngine.getLocalDateKey();
          if (freshDateKey !== this.currentLocalDateKey) {
            this.refreshDailyChallengeSelection();
            if (this.dom.menuScreen.classList.contains('screen-active')) {
              this.renderMenu();
            } else if (this.dom.vaultScreen.classList.contains('screen-active')) {
              this.renderVault();
            }
          }
        }
      });

      window.addEventListener('focus', () => {
        const freshDateKey = CalendarCycleEngine.getLocalDateKey();
        if (freshDateKey !== this.currentLocalDateKey) {
          this.refreshDailyChallengeSelection();
          if (this.dom.menuScreen.classList.contains('screen-active')) {
            this.renderMenu();
          }
        }
      });
    }

    showScreen(target, push = true) {
      const allScreens = [this.dom.menuScreen, this.dom.vaultScreen, this.dom.gameScreen];
      allScreens.forEach(s => s.classList.remove('screen-active'));
      target.classList.add('screen-active');
      window.scrollTo(0, 0);

      if (push && window.history && target.id) {
        window.history.pushState({ screenId: target.id }, '', `#${target.id.replace('-screen', '')}`);
      }
    }

    initHistoryRouting() {
      window.addEventListener('popstate', (e) => {
        if (this.dom.rulesOverlay.classList.contains('panel-open')) {
          this.closeRulesPanel();
          return;
        }
        if (document.querySelector('dialog[open]')) {
          this.closeAllDialogs();
          return;
        }

        const screenId = e.state?.screenId;
        if (screenId && this.dom[screenId]) {
          this.showScreen(this.dom[screenId], false);
        } else {
          this.showScreen(this.dom.menuScreen, false);
        }
      });
    }

    renderMenu() {
      this.showScreen(this.dom.menuScreen, false);
      if (!this.dailyPuzzle) return;

      const recordKey = `daily_${this.currentLocalDateKey}`;
      const rec = this.store.history[recordKey];

      this.dom.playBtnSub.textContent = `Category: ${this.dailyPuzzle.category}`;

      if (rec && rec.completed) {
        this.dom.playBtnLabel.textContent = 'Review Puzzle';
        this.dom.playBtnStatus.textContent = rec.won ? '✓ Solved' : '✕ Complete';
        this.dom.playBtnStatus.className = `status-badge ${rec.won ? 'badge-ready' : 'badge-done'}`;
      } else if (rec && rec.guesses && rec.guesses.length > 0) {
        this.dom.playBtnLabel.textContent = 'Resume Puzzle';
        this.dom.playBtnStatus.textContent = '● In Progress';
        this.dom.playBtnStatus.className = 'status-badge badge-progress';
      } else {
        this.dom.playBtnLabel.textContent = 'Play Daily';
        this.dom.playBtnStatus.textContent = 'Ready';
        this.dom.playBtnStatus.className = 'status-badge badge-ready';
      }
    }

    loadPuzzle(puzzle, source = 'menu') {
      if (!puzzle) return;

      this.activePuzzle = puzzle;
      this.navigationSource = source;
      this.guessedLetters.clear();
      this.strikes = 0;
      this.isGameOver = false;
      this.isReviewMode = false;
      this.isClueVisible = true;

      this.dom.gameBackBtn.textContent = source === 'vault' ? '← Vault' : '← Menu';
      this.dom.gameBackBtn.setAttribute(
        'aria-label',
        source === 'vault' ? 'Back to Vault Library' : 'Back to Main Menu'
      );

      const isDaily = source === 'menu';
      const formattedDate = CalendarCycleEngine.formatDisplayDate();
      this.dom.puzzleTitle.textContent = isDaily ? `Daily • ${formattedDate}` : `Vault • ${puzzle.category}`;
      this.dom.gameCategoryTag.textContent = puzzle.category || 'Cocktail Lounge';
      this.dom.gameClueText.textContent = puzzle.clue || '';
      this.dom.clueToggleBtn.style.display = puzzle.clue ? 'inline-flex' : 'none';

      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${puzzle.id}`;
      const rec = this.store.history[recordKey];

      if (rec) {
        (rec.guesses || []).forEach(letter => this.guessedLetters.add(letter));
        this.strikes = Math.min(rec.strikes || 0, APP_CONFIG.app.maxStrikes);
        this.isGameOver = Boolean(rec.completed);
        this.isReviewMode = Boolean(rec.completed);
      }

      this.renderApparatus();
      this.renderBoard();
      this.renderKeyboard();

      if (this.isReviewMode) {
        this.dom.reviewBanner.style.display = 'block';
        this.dom.reviewStatusText.textContent = rec.won ? '✓ Solved (Review Mode)' : '✕ Complete (Review Mode)';
        this.dom.gameSummaryBtn.classList.remove('btn-summary-hidden');
      } else {
        this.dom.reviewBanner.style.display = 'none';
        this.dom.gameSummaryBtn.classList.add('btn-summary-hidden');

        if (rec && rec.guesses && rec.guesses.length > 0 && !rec.completed) {
          this.showGameToast(`Resumed • ${this.strikes} strike${this.strikes === 1 ? '' : 's'}`);
        }
      }

      this.showScreen(this.dom.gameScreen);
      this.announceBoardState();
    }

    renderApparatus() {
      for (let i = 1; i <= APP_CONFIG.app.maxStrikes; i++) {
        const part = document.getElementById(`strike-${i}`);
        if (part) part.classList.toggle('active', i <= this.strikes);
      }
      this.dom.strikeCountText.textContent = `${this.strikes} / ${APP_CONFIG.app.maxStrikes}`;

      this.dom.strikePips.innerHTML = '';
      for (let i = 1; i <= APP_CONFIG.app.maxStrikes; i++) {
        const pip = document.createElement('div');
        const isStruck = i <= this.strikes;
        pip.className = `strike-pip ${isStruck ? 'pip-struck' : ''}`;
        pip.setAttribute('aria-label', `Strike ${i}: ${isStruck ? 'Struck' : 'Clean'}`);
        pip.textContent = isStruck ? '✕' : '';
        this.dom.strikePips.appendChild(pip);
      }
    }

    renderBoard(staggerChar = null) {
      this.dom.wordBoard.innerHTML = '';
      const phrase = (this.activePuzzle.answer || '').toUpperCase();
      const words = phrase.split(' ');

      let globalSlotIndex = 0;
      words.forEach((word, wordIndex) => {
        const group = document.createElement('div');
        group.className = 'word-group';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', `Word ${wordIndex + 1} of ${words.length}`);

        for (let charIndex = 0; charIndex < word.length; charIndex++) {
          const char = word[charIndex];
          const slot = document.createElement('div');
          slot.className = 'letter-slot';

          if (/^[A-Z]$/.test(char)) {
            const isGuessed = this.guessedLetters.has(char);
            const showMissed = this.isGameOver && !isGuessed;

            if (isGuessed || showMissed) {
              slot.textContent = char;
              slot.classList.add('revealed');
              if (showMissed) slot.classList.add('missed');

              if (char === staggerChar) {
                slot.classList.add('pop-in');
                slot.style.animationDelay = `${globalSlotIndex * APP_CONFIG.display.revealStaggerMs}ms`;
              }
              slot.setAttribute('aria-label', `Letter ${charIndex + 1}: ${char}`);
            } else {
              slot.textContent = '';
              slot.setAttribute('aria-label', `Letter ${charIndex + 1}: Blank`);
            }
          } else {
            slot.textContent = char;
            slot.classList.add('punctuation');
            slot.setAttribute('aria-label', `Symbol: ${char}`);
          }

          group.appendChild(slot);
          globalSlotIndex++;
        }
        this.dom.wordBoard.appendChild(group);
      });
    }

    announceBoardState() {
      if (!this.activePuzzle) return;
      const phrase = (this.activePuzzle.answer || '').toUpperCase();
      const words = phrase.split(' ');
      const lettersCount = phrase.replace(/[^A-Z]/g, '').length;
      this.announce(`Puzzle loaded. Category: ${this.activePuzzle.category}. ${words.length} word${words.length === 1 ? '' : 's'}, ${lettersCount} letters total.`);
    }

    renderKeyboard() {
      this.dom.keyboard.innerHTML = '';
      const rows = [
        ['Q','W','E','R','T','Y','U','I','O','P'],
        ['A','S','D','F','G','H','J','K','L'],
        ['Z','X','C','V','B','N','M']
      ];
      const answer = (this.activePuzzle.answer || '').toUpperCase();

      rows.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';

        row.forEach(letter => {
          const btn = document.createElement('button');
          btn.className = 'key-btn';
          btn.textContent = letter;
          btn.setAttribute('data-key', letter);
          btn.setAttribute('aria-label', `Letter ${letter}`);

          if (this.guessedLetters.has(letter)) {
            btn.disabled = true;
            btn.classList.add(answer.includes(letter) ? 'key-correct' : 'key-wrong');
          }

          btn.onclick = () => {
            this.audio.playTap();
            this.handleGuess(letter);
          };
          rowDiv.appendChild(btn);
        });

        this.dom.keyboard.appendChild(rowDiv);
      });
    }

    handleGuess(letter) {
      if (this.isGameOver || this.guessedLetters.has(letter)) return;
      this.guessedLetters.add(letter);

      const answer = (this.activePuzzle.answer || '').toUpperCase();
      const isCorrect = answer.includes(letter);

      if (!isCorrect) {
        this.strikes++;
        this.audio.playStrike();
        this.triggerStrikeImpact();
        this.announce(`Incorrect. Letter ${letter} is not in the puzzle.`);
      } else {
        this.audio.playCorrect();
        this.announce(`Correct. Letter ${letter} revealed.`);
      }

      this.renderApparatus();
      this.renderBoard(isCorrect ? letter : null);

      const btn = this.dom.keyboard.querySelector(`button[data-key="${letter}"]`);
      if (btn) {
        btn.disabled = true;
        btn.classList.add(isCorrect ? 'key-correct' : 'key-wrong');
      }

      this.checkGameState();
      this.saveProgress();
    }

    triggerStrikeImpact() {
      this.dom.apparatusSection.classList.remove('shake');
      void this.dom.apparatusSection.offsetWidth;
      this.dom.apparatusSection.classList.add('shake');

      if (navigator.vibrate) {
        try { navigator.vibrate(45); } catch (e) {}
      }
    }

    checkGameState() {
      const cleanLetters = (this.activePuzzle.answer || '')
        .toUpperCase()
        .replace(/[^A-Z]/g, '');

      const isWon = cleanLetters.split('').every(letter => this.guessedLetters.has(letter));

      if (isWon) {
        this.endGame(true);
      } else if (this.strikes >= APP_CONFIG.app.maxStrikes) {
        this.endGame(false);
      }
    }

    endGame(isWon) {
      this.isGameOver = true;
      this.saveProgress(true, isWon);

      const isDaily = this.navigationSource === 'menu';
      const stats = this.store.stats;
      stats.played++;

      if (isWon) {
        stats.won++;
        if (this.strikes === 0) stats.flawlessWins++;
        stats.totalStrikesInWins += this.strikes;

        if (isDaily) {
          if (!stats.lastDailyWinDate) {
            stats.currentStreak = 1;
          } else {
            const daysDiff = CalendarCycleEngine.getDaysBetween(
              stats.lastDailyWinDate,
              this.currentLocalDateKey
            );
            if (daysDiff === 1) {
              stats.currentStreak++;
            } else if (daysDiff === 0) {
              // Same calendar day re-solve
            } else {
              stats.currentStreak = 1;
            }
          }
          stats.lastDailyWinDate = this.currentLocalDateKey;
          stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        }

        if (stats.distribution[this.strikes] !== undefined) {
          stats.distribution[this.strikes]++;
        }
      } else {
        if (isDaily) {
          stats.currentStreak = 0;
        }
        if (stats.distribution[APP_CONFIG.app.maxStrikes] !== undefined) {
          stats.distribution[APP_CONFIG.app.maxStrikes]++;
        }
      }
      GameStorage.save(this.store);

      this.renderBoard();

      if (isWon) {
        this.audio.playWin();
        const slots = this.dom.wordBoard.querySelectorAll('.letter-slot');
        slots.forEach((slot, idx) => {
          setTimeout(() => slot.classList.add('celebrate'), idx * 35);
        });
        this.confetti.fire();

        if (navigator.vibrate) {
          try { navigator.vibrate([40, 50, 40, 80]); } catch (e) {}
        }
        setTimeout(() => this.showResult(true), 1100);
      } else {
        setTimeout(() => this.showResult(false), 550);
      }
    }

    saveProgress(isCompleted = false, isWon = false) {
      const isDaily = this.navigationSource === 'menu';
      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${this.activePuzzle.id}`;

      const prev = this.store.history[recordKey] || {};
      this.store.history[recordKey] = {
        completed: isCompleted || prev.completed || false,
        won: isCompleted ? isWon : (prev.won || false),
        strikes: this.strikes,
        guesses: Array.from(this.guessedLetters)
      };
      GameStorage.save(this.store);
    }

    showResult(isWon) {
      this.dom.resultStatusBadge.textContent = isWon ? '✓ Solved' : '✕ Complete';
      this.dom.resultStatusBadge.className = `result-banner ${isWon ? 'banner-win' : 'banner-loss'}`;
      this.dom.resultAnswer.textContent = (this.activePuzzle.answer || '').toUpperCase();
      this.dom.resultNote.textContent = this.activePuzzle.note || '';

      const isDaily = this.navigationSource === 'menu';
      this.dom.resultCountdownBox.style.display = isDaily ? 'block' : 'none';

      this.openDialog(this.dom.resultModal);
    }

    renderVault() {
      this.dom.vaultList.innerHTML = '';

      if (this.puzzles.length === 0) {
        this.dom.vaultList.innerHTML = '<p class="empty-state">No challenges currently in the lounge cellar library.</p>';
      } else {
        this.puzzles.forEach((puzzle, index) => {
          const recordKey = `vault_${puzzle.id}`;
          const rec = this.store.history[recordKey];
          const item = document.createElement('div');
          item.className = 'vault-item';
          item.setAttribute('tabindex', '0');
          item.setAttribute('role', 'button');
          item.setAttribute('aria-label', `Puzzle ${index + 1}, Category: ${puzzle.category}`);

          let statusTag = 'Unplayed';
          let tagClass = 'status-badge';
          if (rec && rec.completed) {
            statusTag = rec.won ? '✓ Solved' : '✕ Complete';
            tagClass = `status-badge ${rec.won ? 'badge-ready' : 'badge-done'}`;
          } else if (rec && rec.guesses && rec.guesses.length > 0) {
            statusTag = '● In Progress';
            tagClass = 'status-badge badge-progress';
          }

          item.innerHTML = `
            <div class="vault-meta">
              <span class="vault-date">Puzzle ${index + 1}</span>
              <span class="vault-category">${puzzle.category}</span>
            </div>
            <div class="vault-actions">
              <span class="${tagClass}">${statusTag}</span>
              <button class="btn btn-secondary btn-nav-back" tabindex="-1">
                ${rec?.completed ? 'Review' : 'Play'}
              </button>
            </div>
          `;

          const launch = () => {
            this.audio.playTap();
            this.loadPuzzle(puzzle, 'vault');
          };
          item.onclick = launch;
          item.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              launch();
            }
          };

          this.dom.vaultList.appendChild(item);
        });
      }

      this.showScreen(this.dom.vaultScreen);
    }

    openStats() {
      const stats = this.store.stats;
      this.dom.statPlayed.textContent = stats.played;
      this.dom.statWinRate.textContent = `${stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%`;
      this.dom.statStreak.textContent = stats.currentStreak;
      this.dom.statMaxStreak.textContent = stats.maxStreak;
      this.dom.statFlawless.textContent = stats.flawlessWins;

      const avgStrikes = stats.won > 0 ? (stats.totalStrikesInWins / stats.won).toFixed(1) : '0.0';
      this.dom.statAvgStrikes.textContent = avgStrikes;

      this.dom.strikeDistributionBars.innerHTML = '';
      const maxVal = Math.max(...stats.distribution, 1);

      for (let i = 0; i <= APP_CONFIG.app.maxStrikes; i++) {
        const row = document.createElement('div');
        row.className = 'dist-bar-row';
        const val = stats.distribution[i] || 0;
        const pct = Math.max(Math.round((val / maxVal) * 100), val > 0 ? 5 : 0);
        const label = i === APP_CONFIG.app.maxStrikes ? '✕' : `${i}`;

        row.innerHTML = `
          <span style="width: 16px; text-align: center; color: var(--brass-gold);">${label}</span>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span style="width: 24px; text-align: right; color: var(--text-muted);">${val}</span>
        `;
        this.dom.strikeDistributionBars.appendChild(row);
      }

      this.openDialog(this.dom.statsModal);
    }

    async shareResult() {
      const isDaily = this.navigationSource === 'menu';
      const puzzle = this.activePuzzle || this.dailyPuzzle;
      if (!puzzle) return;

      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${puzzle.id}`;
      const rec = this.store.history[recordKey];
      const strikesCount = rec?.strikes || 0;
      const outcome = rec?.won
        ? `Solved (${strikesCount}/${APP_CONFIG.app.maxStrikes})`
        : `Complete (${APP_CONFIG.app.maxStrikes}/${APP_CONFIG.app.maxStrikes})`;

      const strikePattern = Array.from({ length: APP_CONFIG.app.maxStrikes })
        .map((_, i) => (i < strikesCount ? '🟥' : '🟩'))
        .join('');

      const label = isDaily ? `Daily Challenge • ${CalendarCycleEngine.formatDisplayDate()}` : `Vault Challenge • ${puzzle.category}`;
      const shareText = `Hangman • ${label}\n${outcome}\n${strikePattern}\n${window.location.href.split('#')[0]}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: 'Hangman Challenge', text: shareText });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareText);
          if (this.dom.shareToast) {
            this.dom.shareToast.classList.add('show');
            setTimeout(() => this.dom.shareToast.classList.remove('show'), APP_CONFIG.display.toastDurationMs);
          }
          this.showGameToast('Results copied to clipboard!');
          return;
        } catch (e) {}
      }

      prompt('Copy result score:', shareText);
    }

    showGameToast(msg) {
      if (!this.dom.gameToast) return;
      this.dom.gameToast.textContent = msg;
      this.dom.gameToast.classList.add('show');
      setTimeout(() => this.dom.gameToast.classList.remove('show'), APP_CONFIG.display.toastDurationMs);
    }

    openRulesPanel() {
      this.lastFocusedElement = document.activeElement;
      this.dom.rulesOverlay.setAttribute('aria-hidden', 'false');
      this.dom.rulesOverlay.classList.add('panel-open');
      this.dom.rulesPanelClose.focus();
    }

    closeRulesPanel() {
      this.dom.rulesOverlay.classList.remove('panel-open');
      this.dom.rulesOverlay.setAttribute('aria-hidden', 'true');
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }

    announce(msg) {
      if (this.dom.announcer) {
        this.dom.announcer.textContent = msg;
      }
    }

    openDialog(dialog) {
      this.lastFocusedElement = document.activeElement;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'true');
      }
      const closeBtn = dialog.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    }

    closeDialog(dialog) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }

    closeAllDialogs() {
      document.querySelectorAll('dialog[open]').forEach(d => this.closeDialog(d));
    }

    initEvents() {
      this.dom.menuPlayBtn.onclick = () => {
        this.audio.playTap();
        if (this.dailyPuzzle) this.loadPuzzle(this.dailyPuzzle, 'menu');
      };

      this.dom.menuVaultBtn.onclick = () => {
        this.audio.playTap();
        this.renderVault();
      };

      this.dom.menuSettingsBtn.onclick = () => {
        this.audio.playTap();
        this.openDialog(this.dom.settingsModal);
      };

      this.dom.settingAnimationToggle.onchange = (e) => {
        const isEnabled = e.target.checked;
        this.store.settings.bgAnimation = isEnabled;
        GameStorage.save(this.store);
        this.atmosphere.setEnabled(isEnabled);
      };

      this.dom.menuRulesBtn.onclick = () => {
        this.audio.playTap();
        this.openRulesPanel();
      };

      this.dom.rulesPanelClose.onclick = () => {
        this.audio.playTap();
        this.closeRulesPanel();
      };

      this.dom.rulesOverlay.onclick = (e) => {
        if (e.target === this.dom.rulesOverlay) {
          this.closeRulesPanel();
        }
      };

      this.dom.menuStatsBtn.onclick = () => {
        this.audio.playTap();
        this.openStats();
      };

      this.dom.menuShareBtn.onclick = () => {
        this.audio.playTap();
        this.shareResult();
      };

      this.dom.menuPlusBtn.onclick = () => {
        this.audio.playTap();
        this.showGameToast('Tileworks Hub connected');
      };

      this.dom.vaultBackBtn.onclick = () => {
        this.audio.playTap();
        this.renderMenu();
      };

      this.dom.gameBackBtn.onclick = () => {
        this.audio.playTap();
        if (this.navigationSource === 'vault') {
          this.renderVault();
        } else {
          this.renderMenu();
        }
      };

      this.dom.gameSummaryBtn.onclick = () => {
        this.audio.playTap();
        const isDaily = this.navigationSource === 'menu';
        const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${this.activePuzzle.id}`;
        const rec = this.store.history[recordKey];
        this.showResult(rec?.won || false);
      };

      this.dom.clueToggleBtn.onclick = () => {
        this.audio.playTap();
        this.isClueVisible = !this.isClueVisible;
        this.dom.gameClueText.style.display = this.isClueVisible ? 'block' : 'none';
        this.dom.clueToggleBtn.innerHTML = this.isClueVisible
          ? '<span class="hint-icon" aria-hidden="true">💡</span> Hide'
          : '<span class="hint-icon" aria-hidden="true">💡</span> Hint';
      };

      this.dom.resultMenuBtn.onclick = () => {
        this.audio.playTap();
        this.closeDialog(this.dom.resultModal);
        if (this.navigationSource === 'vault') {
          this.renderVault();
        } else {
          this.renderMenu();
        }
      };

      this.dom.resultShareBtn.onclick = () => {
        this.audio.playTap();
        this.shareResult();
      };

      document.querySelectorAll('[data-close]').forEach(btn => {
        btn.onclick = (e) => {
          this.audio.playTap();
          this.closeDialog(e.target.closest('dialog'));
        };
      });

      document.querySelectorAll('dialog').forEach(d => {
        d.onclick = (e) => {
          if (e.target === d) this.closeDialog(d);
        };
      });

      window.addEventListener('keydown', (e) => {
        if (this.dom.rulesOverlay.classList.contains('panel-open')) {
          if (e.key === 'Escape') this.closeRulesPanel();
          return;
        }

        if (document.querySelector('dialog[open]')) return;
        if (!this.dom.gameScreen.classList.contains('screen-active')) return;

        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const btn = this.dom.keyboard.querySelector(`button[data-key="${key}"]`);
          if (btn && !btn.disabled) {
            btn.classList.add('key-pressed');
            setTimeout(() => btn.classList.remove('key-pressed'), 110);
          }
          this.audio.playTap();
          this.handleGuess(key);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new HangmanEngine().init();
  });
})();