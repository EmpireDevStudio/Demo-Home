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
    appId: "editorial-hangman-suite",
    appName: "Editorial Hangman",
    appTagline: "Artisanal Daily Word Challenge",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-logo.svg",
    logoAlt: "Editorial Hangman Monogram Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#963E35",       // Accessible Terracotta Red
    accentSecondary: "#3E5B42",   // Accessible Sage Green
    accentHighlight: "#6E5614",   // Accessible Warm Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilySerif: "'Playfair Display', Charter, Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "menu",
    items: [
      { id: "daily", label: "Daily", icon: "icon-daily", route: "#daily", enabled: true, showInBottomBar: true },
      { id: "vault", label: "Vault", icon: "icon-vault", route: "#vault", enabled: true, showInBottomBar: true },
      { id: "stats", label: "Stats", icon: "icon-stats", route: "#stats", enabled: true, showInBottomBar: true },
      { id: "rules", label: "Rules", icon: "icon-rules", route: "#rules", enabled: true, showInBottomBar: true },
      { id: "settings", label: "Prefs", icon: "icon-settings", route: "#settings", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION CONTENT MATRIX & DICTIONARY
  content: {
    headers: {
      menuEyebrow: "DAILY WORD CHALLENGE",
      menuTitle: "The Editorial Desk",
      menuSubtitle: "Unravel the secret lexicon letter by letter before the scaffold completes its print.",
      vaultEyebrow: "ARCHIVAL REPOSITORY",
      vaultTitle: "The Ledger Vault",
      vaultSubtitle: "Solve historical challenges from the permanent vocabulary compendium.",
      gameEyebrow: "ACTIVE CIPHER",
      gameTitle: "Contemporary Edition",
      gameSubtitle: "Choose letters with intentionality. Six scaffold strikes exhaust the edition.",
    },
    emptyStates: {
      noVaultDataHeading: "No Archived Challenges Available",
      noVaultDataDescription: "The archives repository is currently empty. Reload or check back shortly.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Score",
      back: "Navigate Back",
    },
    notifications: {
      copiedScore: "Scorecard successfully copied to clipboard!",
      syncReady: "Daily Active",
    },
    legal: {
      copyrightHolder: "Editorial Press Systems LLC",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS & SUPPORT
  support: {
    contactEmail: "",
    supportDeskUrl: "",
  },

  // 6. FEATURE SWITCHES & MECHANICAL CONTROLS
  features: {
    enableHapticFeedback: true,
    enableSoundEffects: true,
    enableAmbientMotes: true,
    enableSmoothPageTransitions: true,
    enableStickyBottomBar: true,
    maxStrikes: 6,
    csvDataPath: "./puzzles.csv",
    fetchTimeoutMs: 7000,
    storageKey: "editorial_hangman_ledger_v2",
    legacyStorageKeys: ["hangman_cocktail_lounge_v5", "hangman_universal_hangman_lounge_v4"],
    dailyCycleAnchor: "2026-09-08",
  },
});

(function () {
  'use strict';

  // ==========================================================================
  // FALLBACK PRODUCTION PUZZLES (Zero generic mock data)
  // ==========================================================================

  const PRODUCTION_FALLBACK_PUZZLES = Object.freeze([
    {
      category: 'Cocktail Classics',
      answer: 'NEGRONI',
      clue: 'Equal-parts Italian aperitivo of London dry gin, sweet vermouth, and Campari.',
      note: 'Conceived in Florence circa 1919 when Count Camillo Negroni requested gin in place of soda.'
    },
    {
      category: 'Bar Craft',
      answer: 'HAWTHORNE STRAINER',
      clue: 'Perforated metal bar implement mounted with an adaptable perimeter spring coil.',
      note: 'The flexible perimeter spring conforms cleanly to the mixing shaker rim to strain shaken ice.'
    },
    {
      category: 'Botanical Elixirs',
      answer: 'ORGEAT',
      clue: 'Rich almond emulsion syrup delicately aromatized with floral orange blossom water.',
      note: 'The signature emulsion that underpins the aromatic profile of the canonical 1944 Mai Tai.'
    },
    {
      category: 'Artisanal Spirits',
      answer: 'MEZCAL',
      clue: 'Ancestral Mexican spirit distilled from agaves roasted within stone-lined earthen pits.',
      note: 'Unlike single-variety blue agave tequila, authentic mezcal spans over thirty wild agave species.'
    },
    {
      category: 'Glassware Heritage',
      answer: 'COUPE',
      clue: 'Stemmed saucer vessel historically engineered for French sparkling wine service.',
      note: 'Favored in fine cocktail bars worldwide for elevated aromatic delivery of shaken drinks served up.'
    }
  ]);

  // ==========================================================================
  // CALENDAR ARITHMETIC & MIDNIGHT ENGINE
  // ==========================================================================

  class CalendarEngine {
    static getLocalDateKey(dateObj = new Date()) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    static getDaysDifference(anchorDateStr, targetDateStr) {
      const [ay, am, ad] = anchorDateStr.split('-').map(Number);
      const [ty, tm, td] = targetDateStr.split('-').map(Number);
      const anchorUtc = Date.UTC(ay, am - 1, ad);
      const targetUtc = Date.UTC(ty, tm - 1, td);
      return Math.floor((targetUtc - anchorUtc) / 86400000);
    }

    static getDailyIndex(total, targetDateStr = this.getLocalDateKey()) {
      if (!total || total <= 0) return 0;
      const daysDiff = this.getDaysDifference(APP_CONFIG.features.dailyCycleAnchor, targetDateStr);
      return ((daysDiff % total) + total) % total;
    }

    static formatDisplayDate(dateObj = new Date()) {
      try {
        return new Intl.DateTimeFormat(APP_CONFIG.identity.locale, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).format(dateObj);
      } catch (err) {
        return dateObj.toDateString();
      }
    }

    static getMillisecondsUntilMidnight(now = new Date()) {
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
      return Math.max(1000, midnight.getTime() - now.getTime());
    }
  }

  // ==========================================================================
  // HAPTIC SIMULATION & WEB AUDIO ACOUSTICS
  // ==========================================================================

  function triggerHapticPulse() {
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

  class PaperAcousticsEngine {
    constructor() {
      this.ctx = null;
    }

    ensureContext() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new Ctx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    playPaperTap() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
      try {
        this.ensureContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.035);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.035);
      } catch (e) {}
    }

    playCorrectChime() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
      try {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.05, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.16);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.16);
        });
      } catch (e) {}
    }

    playStrikeThud() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
      try {
        this.ensureContext();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(55, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playVictoryFanfare() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
      try {
        this.ensureContext();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [440, 554.37, 659.25, 880].forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.06, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.32);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.32);
        });
      } catch (e) {}
    }
  }

  // ==========================================================================
  // CSV PARSING UTILITY
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
  // PERSISTENCE ENGINE (LOCAL STORAGE)
  // ==========================================================================

  class AppStorageEngine {
    static load() {
      try {
        let raw = localStorage.getItem(APP_CONFIG.features.storageKey);
        if (!raw) {
          for (const legacyKey of APP_CONFIG.features.legacyStorageKeys) {
            raw = localStorage.getItem(legacyKey);
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
      if (dist.length !== APP_CONFIG.features.maxStrikes + 1) {
        dist = new Array(APP_CONFIG.features.maxStrikes + 1).fill(0);
      }

      return {
        version: 2,
        settings: {
          bgAnimation: settings.bgAnimation !== undefined ? Boolean(settings.bgAnimation) : true,
          soundEffects: settings.soundEffects !== undefined ? Boolean(settings.soundEffects) : true,
          haptics: settings.haptics !== undefined ? Boolean(settings.haptics) : true
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
        localStorage.setItem(APP_CONFIG.features.storageKey, JSON.stringify(data));
      } catch (e) {}
    }

    static createInitialState() {
      return {
        version: 2,
        settings: {
          bgAnimation: true,
          soundEffects: true,
          haptics: true
        },
        stats: {
          played: 0,
          won: 0,
          currentStreak: 0,
          maxStreak: 0,
          lastDailyWinDate: null,
          flawlessWins: 0,
          totalStrikesInWins: 0,
          distribution: new Array(APP_CONFIG.features.maxStrikes + 1).fill(0)
        },
        history: {}
      };
    }
  }

  // ==========================================================================
  // CONFETTI CELEBRATION ENGINE
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
      const palette = ['#963E35', '#3E5B42', '#6E5614', '#D99A91', '#A4B99C', '#E5D38F'];
      for (let i = 0; i < 48; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2 - 20,
          vx: (Math.random() - 0.5) * 11,
          vy: (Math.random() - 0.75) * 13,
          size: Math.random() * 6 + 4,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 8,
          opacity: 1
        });
      }

      cancelAnimationFrame(this.animId);
      this.render();
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let active = false;

      this.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.opacity -= 0.016;
        p.rotation += p.rotSpeed;

        if (p.opacity > 0) {
          active = true;
          this.ctx.save();
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          this.ctx.restore();
        }
      });

      if (active) {
        this.animId = requestAnimationFrame(() => this.render());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // ==========================================================================
  // AMBIENT PAPER MOTES (WATERMARK PARTICLES)
  // ==========================================================================

  const MOTE_SVGS = [
    `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#C8C5BA" stroke-width="1.2" stroke-dasharray="2 2"/><path d="M16 6v20M6 16h20" stroke="#C8C5BA" stroke-width="0.8"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="6" y="6" width="20" height="20" rx="3" stroke="#C8C5BA" stroke-width="1.2"/><circle cx="16" cy="16" r="4" fill="#E5E2D9"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><polygon points="16,4 28,26 4,26" stroke="#C8C5BA" stroke-width="1.2" fill="none"/></svg>`,
    `<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M8,16 Q16,4 24,16 T8,16" stroke="#C8C5BA" stroke-width="1.2" fill="none"/></svg>`
  ];

  class AmbientMotesEngine {
    constructor(container, isEnabled) {
      this.container = container;
      this.isEnabled = isEnabled;
      this.population = 6;
      this.init();
    }

    init() {
      if (!this.container) return;
      this.container.innerHTML = '';
      if (!this.isEnabled) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      for (let i = 0; i < this.population; i++) {
        this.spawnMote(true, i / this.population);
      }
    }

    spawnMote(isInitial = false, progressFraction = 0) {
      if (!this.isEnabled || !this.container) return;

      const mote = document.createElement('div');
      mote.className = 'paper-mote';
      const size = 28 + Math.random() * 12;
      const duration = 24 + Math.random() * 10;

      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.left = `${Math.random() * 88 + 6}%`;

      const midX = (Math.random() - 0.5) * 40;
      const endX = (Math.random() - 0.5) * 60;
      const startRot = Math.random() * 360;
      const deltaRot = (Math.random() > 0.5 ? 1 : -1) * 35;

      mote.style.setProperty('--mote-start-x', '0px');
      mote.style.setProperty('--mote-mid-x', `${midX}px`);
      mote.style.setProperty('--mote-end-x', `${endX}px`);
      mote.style.setProperty('--mote-start-rot', `${startRot}deg`);
      mote.style.setProperty('--mote-mid-rot', `${startRot + deltaRot / 2}deg`);
      mote.style.setProperty('--mote-end-rot', `${startRot + deltaRot}deg`);

      const delay = isInitial ? -1 * (duration * progressFraction) : 0;
      mote.style.animation = `moteDrift ${duration}s linear ${delay}s infinite`;

      mote.innerHTML = MOTE_SVGS[Math.floor(Math.random() * MOTE_SVGS.length)];
      this.container.appendChild(mote);
    }

    setEnabled(enabled) {
      this.isEnabled = enabled;
      this.init();
    }
  }

  // ==========================================================================
  // MASTER APPLICATION CONTROLLER
  // ==========================================================================

  class EditorialHangmanApp {
    constructor() {
      this.store = AppStorageEngine.load();
      this.puzzles = [];
      this.dailyPuzzle = null;
      this.activePuzzle = null;
      this.currentLocalDateKey = CalendarEngine.getLocalDateKey();

      this.guessedLetters = new Set();
      this.strikes = 0;
      this.isGameOver = false;
      this.isReviewMode = false;
      this.isClueVisible = true;
      this.currentRoute = 'menu';
      this.lastFocusedElement = null;
      this.midnightTimer = null;

      this.cacheDom();
      this.audio = new PaperAcousticsEngine();
      this.motes = new AmbientMotesEngine(this.dom.bgMotesContainer, this.store.settings.bgAnimation);
      this.confetti = new ConfettiCelebration(this.dom.confettiCanvas);

      this.hydrateAppConfig();
      this.initEvents();
      this.initRouting();
      this.initMidnightWatcher();
    }

    cacheDom() {
      this.dom = {
        // Screens
        menuScreen: document.getElementById('menu-screen'),
        vaultScreen: document.getElementById('vault-screen'),
        gameScreen: document.getElementById('game-screen'),
        confettiCanvas: document.getElementById('confetti-canvas'),
        bgMotesContainer: document.getElementById('bg-motes-container'),

        // Header controls
        globalBackBtn: document.getElementById('global-back-btn'),
        backNavLabel: document.getElementById('back-nav-label'),
        pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
        pageTitleSlot: document.getElementById('pageTitleSlot'),
        pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),
        clockSyncText: document.getElementById('clock-sync-text'),
        gameSummaryBtn: document.getElementById('game-summary-btn'),

        // Menu View
        menuDateDisplay: document.getElementById('menu-date-display'),
        menuPlayBtn: document.getElementById('menu-play-btn'),
        playBtnKicker: document.getElementById('play-btn-kicker'),
        playBtnTitle: document.getElementById('play-btn-title'),
        playBtnSub: document.getElementById('play-btn-sub'),
        playBtnStatus: document.getElementById('play-btn-status'),
        menuVaultBtn: document.getElementById('menu-vault-btn'),
        vaultCountBadge: document.getElementById('vault-count-badge'),
        menuRulesBtn: document.getElementById('menu-rules-btn'),
        menuSettingsBtn: document.getElementById('menu-settings-btn'),
        menuStatsBtn: document.getElementById('menu-stats-btn'),
        menuShareAppBtn: document.getElementById('menu-share-app-btn'),

        // Vault View
        vaultSummaryText: document.getElementById('vault-summary-text'),
        vaultList: document.getElementById('vault-list'),

        // Game View
        reviewBanner: document.getElementById('review-banner'),
        reviewStatusText: document.getElementById('review-status-text'),
        gameToast: document.getElementById('game-toast'),
        apparatusSection: document.getElementById('apparatus-section'),
        strikeCountText: document.getElementById('strike-count-text'),
        strikePips: document.getElementById('strike-pips'),
        wordBoard: document.getElementById('word-board'),
        gameCategoryTag: document.getElementById('game-category-tag'),
        clueToggleBtn: document.getElementById('clue-toggle-btn'),
        hintBtnLabel: document.getElementById('hint-btn-label'),
        gameClueText: document.getElementById('game-clue-text'),
        keyboard: document.getElementById('keyboard'),

        // Bottom Dock
        dockNavDaily: document.getElementById('dock-nav-daily'),
        dockNavVault: document.getElementById('dock-nav-vault'),
        dockNavStats: document.getElementById('dock-nav-stats'),
        dockNavRules: document.getElementById('dock-nav-rules'),
        dockNavSettings: document.getElementById('dock-nav-settings'),

        // Side Codex Panel
        rulesOverlay: document.getElementById('rules-overlay'),
        rulesPanel: document.getElementById('rules-panel'),
        rulesPanelClose: document.getElementById('rules-panel-close'),

        // Modals
        settingsModal: document.getElementById('settings-modal'),
        settingAnimationToggle: document.getElementById('setting-animation-toggle'),
        settingSoundToggle: document.getElementById('setting-sound-toggle'),
        settingHapticToggle: document.getElementById('setting-haptic-toggle'),

        statsModal: document.getElementById('stats-modal'),
        statPlayed: document.getElementById('stat-played'),
        statWinRate: document.getElementById('stat-win-rate'),
        statStreak: document.getElementById('stat-streak'),
        statMaxStreak: document.getElementById('stat-max-streak'),
        statFlawless: document.getElementById('stat-flawless'),
        statAvgStrikes: document.getElementById('stat-avg-strikes'),
        strikeDistributionBars: document.getElementById('strike-distribution-bars'),

        resultModal: document.getElementById('result-modal'),
        resultStatusBadge: document.getElementById('result-status-badge'),
        resultAnswer: document.getElementById('result-answer'),
        resultNote: document.getElementById('result-note'),
        resultCountdownBox: document.getElementById('result-countdown-box'),
        resultCountdownTimer: document.getElementById('result-countdown-timer'),
        resultShareBtn: document.getElementById('result-share-btn'),
        resultMenuBtn: document.getElementById('result-menu-btn'),
        shareToast: document.getElementById('share-toast'),

        // Accessibility
        announcer: document.getElementById('screen-reader-feed'),
      };
    }

    hydrateAppConfig() {
      // Dynamic Page Meta & Title Synchronization
      document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;

      if (this.dom.settingAnimationToggle) {
        this.dom.settingAnimationToggle.checked = this.store.settings.bgAnimation;
      }
      if (this.dom.settingSoundToggle) {
        this.dom.settingSoundToggle.checked = this.store.settings.soundEffects;
      }
      if (this.dom.settingHapticToggle) {
        this.dom.settingHapticToggle.checked = this.store.settings.haptics;
      }

      this.updateDateDisplay();
    }

    async init() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), APP_CONFIG.features.fetchTimeoutMs);

        const res = await fetch(APP_CONFIG.features.csvDataPath, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP status: ${res.status}`);
        const csvText = await res.text();
        this.loadPuzzlesFromCSV(csvText);
      } catch (err) {
        this.loadPuzzlesFromArray(PRODUCTION_FALLBACK_PUZZLES);
      }

      this.refreshDailySelection();
      this.navigateTo('menu', false);
    }

    loadPuzzlesFromCSV(csvText) {
      const rows = parseCSV(csvText);
      if (rows.length < 2) {
        this.loadPuzzlesFromArray(PRODUCTION_FALLBACK_PUZZLES);
        return;
      }

      const headers = rows[0].map(h => (h || '').trim().toLowerCase());
      const answerIdx = headers.indexOf('answer');
      const categoryIdx = headers.indexOf('category');
      const clueIdx = headers.indexOf('clue');
      const noteIdx = headers.indexOf('note');

      this.puzzles = [];
      let seq = 1;

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row || row.length === 0) continue;

        const raw = answerIdx >= 0 ? row[answerIdx] : row[1];
        if (!raw || !raw.trim()) continue;

        const answer = raw
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim()
          .toUpperCase();

        if (!answer.length) continue;

        const category = (categoryIdx >= 0 && row[categoryIdx] ? row[categoryIdx] : 'Vocabulary').trim();
        const clue = (clueIdx >= 0 && row[clueIdx] ? row[clueIdx] : '').trim();
        const note = (noteIdx >= 0 && row[noteIdx] ? row[noteIdx] : '').trim();

        this.puzzles.push({
          id: `edition_${seq++}`,
          answer,
          category,
          clue,
          note
        });
      }

      if (this.puzzles.length === 0) {
        this.loadPuzzlesFromArray(PRODUCTION_FALLBACK_PUZZLES);
      }
    }

    loadPuzzlesFromArray(list) {
      this.puzzles = list.map((item, idx) => ({
        id: `edition_${idx + 1}`,
        answer: (item.answer || '').toUpperCase().trim(),
        category: item.category || 'Editorial Lexicon',
        clue: item.clue || '',
        note: item.note || ''
      }));
    }

    refreshDailySelection() {
      this.currentLocalDateKey = CalendarEngine.getLocalDateKey();
      this.updateDateDisplay();

      if (this.puzzles.length === 0) return;

      const dailyIdx = CalendarEngine.getDailyIndex(this.puzzles.length, this.currentLocalDateKey);
      this.dailyPuzzle = this.puzzles[dailyIdx];

      if (this.dom.vaultCountBadge) {
        this.dom.vaultCountBadge.textContent = `${this.puzzles.length} Editions`;
      }
    }

    updateDateDisplay() {
      const now = new Date();
      const dateFormatted = CalendarEngine.formatDisplayDate(now);

      if (this.dom.menuDateDisplay) this.dom.menuDateDisplay.textContent = dateFormatted;
      if (this.dom.playBtnKicker) this.dom.playBtnKicker.textContent = `Today's Edition • ${dateFormatted}`;
      if (this.dom.clockSyncText) this.dom.clockSyncText.textContent = APP_CONFIG.content.notifications.syncReady;
    }

    initMidnightWatcher() {
      const tick = () => {
        const ms = CalendarEngine.getMillisecondsUntilMidnight();
        const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
        const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');

        if (this.dom.resultCountdownTimer) {
          this.dom.resultCountdownTimer.textContent = `${h}:${m}:${s}`;
        }

        const freshKey = CalendarEngine.getLocalDateKey();
        if (freshKey !== this.currentLocalDateKey) {
          this.refreshDailySelection();
          if (this.currentRoute === 'menu') {
            this.renderMenu();
          } else if (this.currentRoute === 'vault') {
            this.renderVault();
          }
        }
      };

      tick();
      this.midnightTimer = setInterval(tick, 1000);
    }

    // ========================================================================
    // SCREEN & ROUTING ARCHITECTURE
    // ========================================================================

    navigateTo(route, push = true) {
      this.currentRoute = route;

      const panels = [this.dom.menuScreen, this.dom.vaultScreen, this.dom.gameScreen];
      panels.forEach(p => p.classList.remove('view-panel--active'));

      // Update bottom dock active indicators
      const dockItems = [
        this.dom.dockNavDaily,
        this.dom.dockNavVault,
        this.dom.dockNavStats,
        this.dom.dockNavRules,
        this.dom.dockNavSettings
      ];
      dockItems.forEach(btn => btn?.classList.remove('nav-tab-item--active'));

      if (route === 'menu') {
        this.dom.menuScreen.classList.add('view-panel--active');
        this.dom.dockNavDaily?.classList.add('nav-tab-item--active');
        this.updateHeader(
          APP_CONFIG.content.headers.menuEyebrow,
          APP_CONFIG.content.headers.menuTitle,
          APP_CONFIG.content.headers.menuSubtitle,
          false
        );
        this.renderMenu();
      } else if (route === 'vault') {
        this.dom.vaultScreen.classList.add('view-panel--active');
        this.dom.dockNavVault?.classList.add('nav-tab-item--active');
        this.updateHeader(
          APP_CONFIG.content.headers.vaultEyebrow,
          APP_CONFIG.content.headers.vaultTitle,
          APP_CONFIG.content.headers.vaultSubtitle,
          true,
          'Menu'
        );
        this.renderVault();
      } else if (route === 'game') {
        this.dom.gameScreen.classList.add('view-panel--active');
        this.dom.dockNavDaily?.classList.add('nav-tab-item--active');
        const isDaily = this.activePuzzle === this.dailyPuzzle;
        this.updateHeader(
          isDaily ? 'DAILY DISPATCH' : 'VAULT ARCHIVE',
          this.activePuzzle ? this.activePuzzle.category : APP_CONFIG.content.headers.gameTitle,
          APP_CONFIG.content.headers.gameSubtitle,
          true,
          isDaily ? 'Desk' : 'Vault'
        );
      }

      window.scrollTo(0, 0);

      if (push && window.history) {
        window.history.pushState({ route }, '', `#${route}`);
      }
    }

    updateHeader(eyebrow, title, subtitle, showBack = true, backLabel = 'Menu') {
      if (this.dom.pageEyebrowSlot) this.dom.pageEyebrowSlot.textContent = eyebrow;
      if (this.dom.pageTitleSlot) this.dom.pageTitleSlot.textContent = title;
      if (this.dom.pageSubtitleSlot) this.dom.pageSubtitleSlot.textContent = subtitle;

      if (this.dom.globalBackBtn) {
        this.dom.globalBackBtn.style.visibility = showBack ? 'visible' : 'hidden';
      }
      if (this.dom.backNavLabel) {
        this.dom.backNavLabel.textContent = backLabel;
      }
    }

    initRouting() {
      window.addEventListener('popstate', (e) => {
        if (this.dom.rulesOverlay.classList.contains('panel-open')) {
          this.closeRulesPanel();
          return;
        }
        if (document.querySelector('dialog[open]')) {
          this.closeAllModals();
          return;
        }

        const targetRoute = e.state?.route || 'menu';
        this.navigateTo(targetRoute, false);
      });
    }

    // ========================================================================
    // MENU VIEW RENDERING
    // ========================================================================

    renderMenu() {
      if (!this.dailyPuzzle) return;

      const recordKey = `daily_${this.currentLocalDateKey}`;
      const rec = this.store.history[recordKey];

      this.dom.playBtnSub.textContent = `Subject: ${this.dailyPuzzle.category}`;

      if (rec && rec.completed) {
        this.dom.playBtnTitle.textContent = 'Review Daily Edition';
        this.dom.playBtnStatus.textContent = rec.won ? '✓ Solved' : '✕ Concluded';
        this.dom.playBtnStatus.className = `status-pill ${rec.won ? 'status-pill--sage' : 'status-pill--terracotta'}`;
      } else if (rec && rec.guesses && rec.guesses.length > 0) {
        this.dom.playBtnTitle.textContent = 'Resume Challenge';
        this.dom.playBtnStatus.textContent = 'In Progress';
        this.dom.playBtnStatus.className = 'status-pill status-pill--ochre';
      } else {
        this.dom.playBtnTitle.textContent = 'Play Daily Challenge';
        this.dom.playBtnStatus.textContent = 'Ready';
        this.dom.playBtnStatus.className = 'status-pill status-pill--sage';
      }
    }

    // ========================================================================
    // VAULT VIEW RENDERING
    // ========================================================================

    renderVault() {
      this.dom.vaultList.innerHTML = '';
      if (this.puzzles.length === 0) {
        this.dom.vaultList.innerHTML = `
          <div class="paper-card" style="text-align: center; padding: 32px 16px;">
            <p style="color: var(--color-text-secondary);">${APP_CONFIG.content.emptyStates.noVaultDataHeading}</p>
          </div>
        `;
        return;
      }

      this.dom.vaultSummaryText.textContent = `${this.puzzles.length} Archived Editions`;

      this.puzzles.forEach((puzzle, idx) => {
        const recordKey = `vault_${puzzle.id}`;
        const rec = this.store.history[recordKey];
        const card = document.createElement('div');
        card.className = 'vault-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Puzzle Edition ${idx + 1}, Category: ${puzzle.category}`);

        let pillText = 'Unplayed';
        let pillClass = 'status-pill--neutral';

        if (rec && rec.completed) {
          pillText = rec.won ? '✓ Solved' : '✕ Struck';
          pillClass = rec.won ? 'status-pill--sage' : 'status-pill--terracotta';
        } else if (rec && rec.guesses && rec.guesses.length > 0) {
          pillText = 'In Progress';
          pillClass = 'status-pill--ochre';
        }

        card.innerHTML = `
          <div class="vault-card__meta">
            <span class="vault-card__num">Edition ${idx + 1}</span>
            <span class="vault-card__category">${puzzle.category}</span>
          </div>
          <div class="vault-card__action">
            <span class="status-pill ${pillClass}">${pillText}</span>
            <svg class="chevron-glyph" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/>
            </svg>
          </div>
        `;

        const openPuzzle = () => {
          this.audio.playPaperTap();
          triggerHapticPulse();
          this.loadPuzzle(puzzle, 'vault');
        };

        card.onclick = openPuzzle;
        card.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openPuzzle();
          }
        };

        this.dom.vaultList.appendChild(card);
      });
    }

    // ========================================================================
    // GAMEPLAY CONTROLLER
    // ========================================================================

    loadPuzzle(puzzle, source = 'menu') {
      if (!puzzle) return;

      this.activePuzzle = puzzle;
      this.guessedLetters.clear();
      this.strikes = 0;
      this.isGameOver = false;
      this.isReviewMode = false;
      this.isClueVisible = true;

      const isDaily = source === 'menu' || puzzle === this.dailyPuzzle;
      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${puzzle.id}`;
      const rec = this.store.history[recordKey];

      if (rec) {
        (rec.guesses || []).forEach(letter => this.guessedLetters.add(letter));
        this.strikes = Math.min(rec.strikes || 0, APP_CONFIG.features.maxStrikes);
        this.isGameOver = Boolean(rec.completed);
        this.isReviewMode = Boolean(rec.completed);
      }

      this.dom.gameCategoryTag.textContent = puzzle.category;
      this.dom.gameClueText.textContent = puzzle.clue || '';
      this.dom.clueToggleBtn.style.display = puzzle.clue ? 'inline-flex' : 'none';

      this.renderApparatus();
      this.renderBoard();
      this.renderKeyboard();

      if (this.isReviewMode) {
        this.dom.reviewBanner.style.display = 'block';
        this.dom.reviewStatusText.textContent = rec.won
          ? 'Edition Complete • Solved in Review'
          : 'Edition Complete • Exhausted in Review';
        this.dom.gameSummaryBtn.classList.remove('btn-summary-hidden');
      } else {
        this.dom.reviewBanner.style.display = 'none';
        this.dom.gameSummaryBtn.classList.add('btn-summary-hidden');

        if (rec && rec.guesses && rec.guesses.length > 0 && !rec.completed) {
          this.showGameToast(`Resumed • ${this.strikes} strike${this.strikes === 1 ? '' : 's'}`);
        }
      }

      this.navigateTo('game');
      this.announce(`Puzzle loaded. Category: ${puzzle.category}. Word length: ${puzzle.answer.replace(/[^A-Z]/g, '').length} letters.`);
    }

    renderApparatus() {
      for (let i = 1; i <= APP_CONFIG.features.maxStrikes; i++) {
        const part = document.getElementById(`strike-${i}`);
        if (part) part.classList.toggle('active', i <= this.strikes);
      }

      this.dom.strikeCountText.textContent = `${this.strikes} of ${APP_CONFIG.features.maxStrikes} Strikes`;
      this.dom.strikePips.innerHTML = '';

      for (let i = 1; i <= APP_CONFIG.features.maxStrikes; i++) {
        const pip = document.createElement('div');
        const struck = i <= this.strikes;
        pip.className = `strike-pip ${struck ? 'pip-struck' : ''}`;
        pip.setAttribute('aria-label', `Strike ${i}: ${struck ? 'Struck' : 'Clear'}`);
        pip.textContent = struck ? '✕' : '';
        this.dom.strikePips.appendChild(pip);
      }
    }

    renderBoard(highlightLetter = null) {
      this.dom.wordBoard.innerHTML = '';
      const phrase = (this.activePuzzle.answer || '').toUpperCase();
      const words = phrase.split(' ');

      let slotIndex = 0;
      words.forEach((word, wordIdx) => {
        const group = document.createElement('div');
        group.className = 'word-group';
        group.setAttribute('role', 'group');
        group.setAttribute('aria-label', `Word ${wordIdx + 1} of ${words.length}`);

        for (let i = 0; i < word.length; i++) {
          const char = word[i];
          const slot = document.createElement('div');
          slot.className = 'letter-slot';

          if (/^[A-Z]$/.test(char)) {
            const isGuessed = this.guessedLetters.has(char);
            const showMissed = this.isGameOver && !isGuessed;

            if (isGuessed || showMissed) {
              slot.textContent = char;
              slot.classList.add('revealed');
              if (showMissed) slot.classList.add('missed');

              if (char === highlightLetter) {
                slot.classList.add('pop-in');
              }
              slot.setAttribute('aria-label', `Letter ${i + 1}: ${char}`);
            } else {
              slot.textContent = '';
              slot.setAttribute('aria-label', `Letter ${i + 1}: Blank`);
            }
          } else {
            slot.textContent = char;
            slot.classList.add('punctuation');
            slot.setAttribute('aria-label', `Punctuation: ${char}`);
          }

          group.appendChild(slot);
          slotIndex++;
        }
        this.dom.wordBoard.appendChild(group);
      });
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
          btn.type = 'button';
          btn.className = 'key-btn';
          btn.textContent = letter;
          btn.setAttribute('data-key', letter);
          btn.setAttribute('aria-label', `Select letter ${letter}`);

          if (this.guessedLetters.has(letter)) {
            btn.disabled = true;
            btn.classList.add(answer.includes(letter) ? 'key-correct' : 'key-wrong');
          }

          btn.onclick = () => {
            this.audio.playPaperTap();
            triggerHapticPulse();
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
        this.audio.playStrikeThud();
        this.triggerApparatusShake();
        this.announce(`Incorrect. Letter ${letter} is not present in the phrase.`);
      } else {
        this.audio.playCorrectChime();
        this.announce(`Correct. Letter ${letter} placed.`);
      }

      this.renderApparatus();
      this.renderBoard(isCorrect ? letter : null);

      const keyEl = this.dom.keyboard.querySelector(`button[data-key="${letter}"]`);
      if (keyEl) {
        keyEl.disabled = true;
        keyEl.classList.add(isCorrect ? 'key-correct' : 'key-wrong');
      }

      this.checkResolution();
      this.saveProgressState();
    }

    triggerApparatusShake() {
      this.dom.apparatusSection.classList.remove('shake');
      void this.dom.apparatusSection.offsetWidth;
      this.dom.apparatusSection.classList.add('shake');
    }

    checkResolution() {
      const cleanLetters = (this.activePuzzle.answer || '').toUpperCase().replace(/[^A-Z]/g, '');
      const isWon = cleanLetters.split('').every(l => this.guessedLetters.has(l));

      if (isWon) {
        this.resolveGame(true);
      } else if (this.strikes >= APP_CONFIG.features.maxStrikes) {
        this.resolveGame(false);
      }
    }

    resolveGame(isWon) {
      this.isGameOver = true;
      this.saveProgressState(true, isWon);

      const isDaily = this.activePuzzle === this.dailyPuzzle;
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
            const diff = CalendarEngine.getDaysDifference(stats.lastDailyWinDate, this.currentLocalDateKey);
            if (diff === 1) stats.currentStreak++;
            else if (diff > 1) stats.currentStreak = 1;
          }
          stats.lastDailyWinDate = this.currentLocalDateKey;
          stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        }

        if (stats.distribution[this.strikes] !== undefined) {
          stats.distribution[this.strikes]++;
        }
      } else {
        if (isDaily) stats.currentStreak = 0;
        if (stats.distribution[APP_CONFIG.features.maxStrikes] !== undefined) {
          stats.distribution[APP_CONFIG.features.maxStrikes]++;
        }
      }
      AppStorageEngine.save(this.store);

      this.renderBoard();

      if (isWon) {
        this.audio.playVictoryFanfare();
        const slots = this.dom.wordBoard.querySelectorAll('.letter-slot');
        slots.forEach((s, idx) => {
          setTimeout(() => s.classList.add('celebrate'), idx * 30);
        });
        this.confetti.fire();
        setTimeout(() => this.showResolutionModal(true), 1100);
      } else {
        setTimeout(() => this.showResolutionModal(false), 600);
      }
    }

    saveProgressState(isCompleted = false, isWon = false) {
      const isDaily = this.activePuzzle === this.dailyPuzzle;
      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${this.activePuzzle.id}`;
      const prev = this.store.history[recordKey] || {};

      this.store.history[recordKey] = {
        completed: isCompleted || prev.completed || false,
        won: isCompleted ? isWon : (prev.won || false),
        strikes: this.strikes,
        guesses: Array.from(this.guessedLetters)
      };
      AppStorageEngine.save(this.store);
    }

    showResolutionModal(isWon) {
      this.dom.resultStatusBadge.textContent = isWon ? '✓ Edition Solved' : '✕ Edition Exhausted';
      this.dom.resultStatusBadge.className = `result-banner ${isWon ? 'result-banner--win' : 'result-banner--loss'}`;
      this.dom.resultAnswer.textContent = (this.activePuzzle.answer || '').toUpperCase();
      this.dom.resultNote.textContent = this.activePuzzle.note || '';

      const isDaily = this.activePuzzle === this.dailyPuzzle;
      this.dom.resultCountdownBox.style.display = isDaily ? 'block' : 'none';

      this.openModal(this.dom.resultModal);
    }

    openStatsModal() {
      const stats = this.store.stats;
      this.dom.statPlayed.textContent = stats.played;
      this.dom.statWinRate.textContent = `${stats.played ? Math.round((stats.won / stats.played) * 100) : 0}%`;
      this.dom.statStreak.textContent = stats.currentStreak;
      this.dom.statMaxStreak.textContent = stats.maxStreak;
      this.dom.statFlawless.textContent = stats.flawlessWins;

      const avg = stats.won > 0 ? (stats.totalStrikesInWins / stats.won).toFixed(1) : '0.0';
      this.dom.statAvgStrikes.textContent = avg;

      this.dom.strikeDistributionBars.innerHTML = '';
      const maxVal = Math.max(...stats.distribution, 1);

      for (let i = 0; i <= APP_CONFIG.features.maxStrikes; i++) {
        const row = document.createElement('div');
        row.className = 'dist-bar-item';
        const val = stats.distribution[i] || 0;
        const pct = Math.max(Math.round((val / maxVal) * 100), val > 0 ? 6 : 0);
        const label = i === APP_CONFIG.features.maxStrikes ? '✕' : `${i}`;

        row.innerHTML = `
          <span style="width: 16px; text-align: center; color: var(--color-text-secondary);">${label}</span>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${pct}%;"></div>
          </div>
          <span style="width: 24px; text-align: right; color: var(--color-text-muted);">${val}</span>
        `;
        this.dom.strikeDistributionBars.appendChild(row);
      }

      this.openModal(this.dom.statsModal);
    }

    async shareScorecard() {
      const isDaily = this.activePuzzle === this.dailyPuzzle;
      const puzzle = this.activePuzzle || this.dailyPuzzle;
      if (!puzzle) return;

      const recordKey = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${puzzle.id}`;
      const rec = this.store.history[recordKey];
      const strikeCount = rec?.strikes || 0;
      const statusLine = rec?.won
        ? `Solved (${strikeCount}/${APP_CONFIG.features.maxStrikes})`
        : `Exhausted (${APP_CONFIG.features.maxStrikes}/${APP_CONFIG.features.maxStrikes})`;

      const blocks = Array.from({ length: APP_CONFIG.features.maxStrikes })
        .map((_, i) => (i < strikeCount ? '🟥' : '🟩'))
        .join('');

      const title = isDaily
        ? `Editorial Hangman • Daily ${CalendarEngine.formatDisplayDate()}`
        : `Editorial Hangman • ${puzzle.category}`;

      const shareText = `${title}\n${statusLine}\n${blocks}\n${window.location.href.split('#')[0]}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: 'Editorial Hangman Score', text: shareText });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareText);
          this.dom.shareToast?.classList.add('show');
          setTimeout(() => this.dom.shareToast?.classList.remove('show'), 2400);
          this.showGameToast('Scorecard copied to clipboard!');
          return;
        } catch (e) {}
      }

      prompt('Copy scorecard score:', shareText);
    }

    showGameToast(msg) {
      if (!this.dom.gameToast) return;
      this.dom.gameToast.textContent = msg;
      this.dom.gameToast.classList.add('show');
      setTimeout(() => this.dom.gameToast?.classList.remove('show'), 2400);
    }

    openRulesPanel() {
      this.lastFocusedElement = document.activeElement;
      this.dom.rulesOverlay.setAttribute('aria-hidden', 'false');
      this.dom.rulesOverlay.classList.add('panel-open');
      this.dom.rulesPanelClose?.focus();
    }

    closeRulesPanel() {
      this.dom.rulesOverlay.classList.remove('panel-open');
      this.dom.rulesOverlay.setAttribute('aria-hidden', 'true');
      if (this.lastFocusedElement?.focus) this.lastFocusedElement.focus();
    }

    openModal(dialog) {
      this.lastFocusedElement = document.activeElement;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', 'true');
      }
      dialog.querySelector('[data-close]')?.focus();
    }

    closeModal(dialog) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
      if (this.lastFocusedElement?.focus) this.lastFocusedElement.focus();
    }

    closeAllModals() {
      document.querySelectorAll('dialog[open]').forEach(d => this.closeModal(d));
    }

    announce(msg) {
      if (this.dom.announcer) this.dom.announcer.textContent = msg;
    }

    // ========================================================================
    // EVENT BINDINGS
    // ========================================================================

    initEvents() {
      // Standardized Back Navigation Button
      this.dom.globalBackBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        if (this.currentRoute === 'game') {
          if (this.activePuzzle === this.dailyPuzzle) {
            this.navigateTo('menu');
          } else {
            this.navigateTo('vault');
          }
        } else {
          this.navigateTo('menu');
        }
      };

      // Header summary button
      this.dom.gameSummaryBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        const isDaily = this.activePuzzle === this.dailyPuzzle;
        const key = isDaily ? `daily_${this.currentLocalDateKey}` : `vault_${this.activePuzzle.id}`;
        const rec = this.store.history[key];
        this.showResolutionModal(rec?.won || false);
      };

      // Primary Menu Actions
      this.dom.menuPlayBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        if (this.dailyPuzzle) this.loadPuzzle(this.dailyPuzzle, 'menu');
      };

      this.dom.menuVaultBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.navigateTo('vault');
      };

      this.dom.menuRulesBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openRulesPanel();
      };

      this.dom.menuSettingsBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openModal(this.dom.settingsModal);
      };

      this.dom.menuStatsBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openStatsModal();
      };

      this.dom.menuShareAppBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.shareScorecard();
      };

      // Bottom Dock Navigation
      this.dom.dockNavDaily.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        if (this.dailyPuzzle) this.loadPuzzle(this.dailyPuzzle, 'menu');
      };

      this.dom.dockNavVault.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.navigateTo('vault');
      };

      this.dom.dockNavStats.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openStatsModal();
      };

      this.dom.dockNavRules.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openRulesPanel();
      };

      this.dom.dockNavSettings.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.openModal(this.dom.settingsModal);
      };

      // Codex Drawer Close
      this.dom.rulesPanelClose.onclick = () => {
        this.audio.playPaperTap();
        this.closeRulesPanel();
      };

      this.dom.rulesOverlay.onclick = (e) => {
        if (e.target === this.dom.rulesOverlay) {
          this.closeRulesPanel();
        }
      };

      // Settings Toggles
      this.dom.settingAnimationToggle.onchange = (e) => {
        const val = e.target.checked;
        this.store.settings.bgAnimation = val;
        AppStorageEngine.save(this.store);
        this.motes.setEnabled(val);
      };

      this.dom.settingSoundToggle.onchange = (e) => {
        const val = e.target.checked;
        this.store.settings.soundEffects = val;
        AppStorageEngine.save(this.store);
      };

      this.dom.settingHapticToggle.onchange = (e) => {
        const val = e.target.checked;
        this.store.settings.haptics = val;
        AppStorageEngine.save(this.store);
      };

      // Clue toggle
      this.dom.clueToggleBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.isClueVisible = !this.isClueVisible;
        this.dom.gameClueText.style.display = this.isClueVisible ? 'block' : 'none';
        this.dom.hintBtnLabel.textContent = this.isClueVisible ? 'Hide Clue' : 'Show Clue';
      };

      // Resolution Modal Actions
      this.dom.resultShareBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.shareScorecard();
      };

      this.dom.resultMenuBtn.onclick = () => {
        this.audio.playPaperTap();
        triggerHapticPulse();
        this.closeModal(this.dom.resultModal);
        this.navigateTo('menu');
      };

      // Generic Modal Dismiss
      document.querySelectorAll('[data-close]').forEach(btn => {
        btn.onclick = (e) => {
          this.audio.playPaperTap();
          this.closeModal(e.target.closest('dialog'));
        };
      });

      document.querySelectorAll('dialog').forEach(d => {
        d.onclick = (e) => {
          if (e.target === d) this.closeModal(d);
        };
      });

      // Physical Hardware Keyboard Input
      window.addEventListener('keydown', (e) => {
        if (this.dom.rulesOverlay.classList.contains('panel-open')) {
          if (e.key === 'Escape') this.closeRulesPanel();
          return;
        }

        if (document.querySelector('dialog[open]')) {
          if (e.key === 'Escape') this.closeAllModals();
          return;
        }

        if (!this.dom.gameScreen.classList.contains('view-panel--active')) return;

        const letter = e.key.toUpperCase();
        if (/^[A-Z]$/.test(letter) && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const keyBtn = this.dom.keyboard.querySelector(`button[data-key="${letter}"]`);
          if (keyBtn && !keyBtn.disabled) {
            keyBtn.classList.add('key-pressed');
            setTimeout(() => keyBtn.classList.remove('key-pressed'), 120);
          }
          this.audio.playPaperTap();
          triggerHapticPulse();
          this.handleGuess(letter);
        }
      });
    }
  }

  // Self-booting initialization upon DOM readiness
  document.addEventListener('DOMContentLoaded', () => {
    new EditorialHangmanApp().init();
  });
})();