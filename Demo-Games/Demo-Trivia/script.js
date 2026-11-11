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
    appId: "editorial-daily-quiz",
    appName: "Daily Quiz",
    appTagline: "Curated intellectual inquiries drawn from culture, science, and history.",
    version: "2.5.0",
    environment: "production",
    canonicalUrl: window.location.href || "../",
    language: "en-US",
    locale: "en-US",
    homeUrl: "../../",
    plusUrl: "../../"
  },

  // 2. BRANDING & ACCESSIBLE PALETTE DEFINITIONS
  branding: {
    accentTerracotta: "#963E35",
    accentSage: "#3E5B42",
    accentOchre: "#6E5614",
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilySerif: "'Cormorant Garamond', Georgia, serif"
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "menu",
    items: [
      { id: "nav-today", label: "Daily", icon: "icon-calendar", targetView: "menuView", enabled: true },
      { id: "nav-vault", label: "Vault", icon: "icon-archive", targetView: "vaultView", enabled: true },
      { id: "nav-stats", label: "Stats", icon: "icon-stats", targetDrawer: "statsDrawer", enabled: true },
      { id: "nav-guide", label: "Guide", icon: "icon-guide", targetDrawer: "howToPlayDrawer", enabled: true },
      { id: "nav-settings", label: "Settings", icon: "icon-settings", targetDrawer: "settingsDrawer", enabled: true }
    ]
  },

  // 4. CONTENT & ZERO-PLACEHOLDER COPY MATRIX
  content: {
    headers: {
      defaultEyebrow: "CHALLENGE CYCLE 2026",
      defaultTitle: "Daily Quiz",
      defaultSubtitle: "Five curated questions drawn daily from culture, sciences, and history."
    },
    notifications: {
      linkCopied: "Challenge dispatch link copied to clipboard.",
      scoreCopied: "Performance summary copied to clipboard.",
      resetCompleted: "Player ledger and streaks cleared.",
      shareUnsupported: "Native sharing unavailable on this device."
    },
    storageKey: "editorial_daily_quiz_state_v3"
  },

  // 5. DATA & CYCLE SPECIFICATIONS
  cycle: {
    csvPath: "./puzzles.csv",
    questionsPerRound: 5,
    fetchTimeoutMs: 10000,
    anchorDate: "2026-01-01",
    anchorPuzzleIndex: 0,
    midnightCheckIntervalMs: 25000
  },

  // 6. FEATURE SWITCHES & SENSORY BEHAVIORS
  features: {
    enableHapticFeedback: true,
    enableTactileAnimation: true,
    enableAcousticFeedback: true
  }
});

/**
 * =========================================================================
 * 12 TACTILE BOTANICAL & MINERAL SVG SILHOUETTES
 * Handcrafted vector assets for physical paper depth elevation.
 * =========================================================================
 */
const TACTILE_SVGS = [
  // 1. Olive Branch
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80C35 60 55 45 80 20" stroke="#3E5B42" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="42" cy="56" rx="14" ry="7" transform="rotate(-30 42 56)" fill="#D6E3D2" stroke="#3E5B42" stroke-width="2"/>
    <ellipse cx="62" cy="38" rx="14" ry="7" transform="rotate(-30 62 38)" fill="#D6E3D2" stroke="#3E5B42" stroke-width="2"/>
    <circle cx="34" cy="62" r="5" fill="#3E5B42"/>
  </svg>`,
  // 2. Laurel Wreath Folio
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 15C32 25 24 45 28 75" stroke="#6E5614" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="32" cy="35" rx="10" ry="5" transform="rotate(25 32 35)" fill="#F6EFC8" stroke="#6E5614" stroke-width="1.5"/>
    <ellipse cx="28" cy="55" rx="10" ry="5" transform="rotate(10 28 55)" fill="#F6EFC8" stroke="#6E5614" stroke-width="1.5"/>
  </svg>`,
  // 3. Botanical Citrus Slice
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" stroke="#6E5614" stroke-width="3" fill="#FFFEFA"/>
    <circle cx="50" cy="50" r="37" stroke="#E5D38F" stroke-width="2" fill="#F6EFC8"/>
    <circle cx="50" cy="50" r="6" fill="#6E5614"/>
    <line x1="50" y1="14" x2="50" y2="44" stroke="#E5D38F" stroke-width="1.8"/>
    <line x1="50" y1="56" x2="50" y2="86" stroke="#E5D38F" stroke-width="1.8"/>
    <line x1="14" y1="50" x2="44" y2="50" stroke="#E5D38F" stroke-width="1.8"/>
    <line x1="56" y1="50" x2="86" y2="50" stroke="#E5D38F" stroke-width="1.8"/>
  </svg>`,
  // 4. Terracotta Botanical Seal
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="#963E35" stroke-width="2.5" fill="#F3D8D3"/>
    <path d="M50 24C44 36 34 44 26 50C38 54 44 64 50 76C56 64 66 54 74 50C62 44 56 36 50 24Z" fill="#963E35"/>
  </svg>`,
  // 5. Pressed Rosemary Folio
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 88C48 60 52 32 50 12" stroke="#3E5B42" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="72" x2="30" y2="60" stroke="#3E5B42" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="50" y1="72" x2="70" y2="60" stroke="#3E5B42" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="28" y2="40" stroke="#3E5B42" stroke-width="2.2" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="72" y2="40" stroke="#3E5B42" stroke-width="2.2" stroke-linecap="round"/>
  </svg>`,
  // 6. Minimalist Quill
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M78 18C52 28 32 54 22 82C34 76 56 64 74 38C76 34 78 26 78 18Z" fill="#F9F7F1" stroke="#2A2D27" stroke-width="2"/>
    <path d="M22 82L18 86" stroke="#2A2D27" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`,
  // 7. Pressed Fern
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 85C45 65 60 45 75 15" stroke="#3E5B42" stroke-width="2.5"/>
    <path d="M42 68C36 60 40 54 48 62" stroke="#3E5B42" stroke-width="2" fill="#D6E3D2"/>
    <path d="M55 55C49 47 53 41 61 49" stroke="#3E5B42" stroke-width="2" fill="#D6E3D2"/>
  </svg>`,
  // 8. Architectural Compass Star
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="38" stroke="#C8C5BA" stroke-width="1.8"/>
    <polygon points="50,18 55,45 82,50 55,55 50,82 45,55 18,50 45,45" fill="#6E5614"/>
  </svg>`,
  // 9. Wax Seal Impression
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="36" stroke="#963E35" stroke-width="3" fill="#F3D8D3"/>
    <circle cx="50" cy="50" r="28" stroke="#963E35" stroke-width="1.5" stroke-dasharray="4 2"/>
    <path d="M44 42L56 58M56 42L44 58" stroke="#963E35" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  // 10. Botanical Gingko Leaf
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 85C50 70 50 60 50 50C30 48 18 32 30 18C44 26 50 36 50 42C50 36 56 26 70 18C82 32 70 48 50 50" 
          fill="#F6EFC8" stroke="#6E5614" stroke-width="2" stroke-linejoin="round"/>
  </svg>`,
  // 11. Astrolabe Ring
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" stroke="#2A2D27" stroke-width="2"/>
    <ellipse cx="50" cy="50" rx="42" ry="18" stroke="#82857B" stroke-width="1.5"/>
    <circle cx="50" cy="50" r="5" fill="#2A2D27"/>
  </svg>`,
  // 12. Faceted Gem Seal
  `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="30,22 70,22 86,45 50,82 14,45" stroke="#3E5B42" stroke-width="2.5" fill="#D6E3D2"/>
    <line x1="30" y1="22" x2="50" y2="82" stroke="#3E5B42" stroke-width="1.5"/>
    <line x1="70" y1="22" x2="50" y2="82" stroke="#3E5B42" stroke-width="1.5"/>
    <line x1="14" y1="45" x2="86" y2="45" stroke="#3E5B42" stroke-width="1.5"/>
  </svg>`
];

/**
 * =========================================================================
 * AUDIO SYNTHESIZER: ACOUSTIC RESONANCE ENGINE
 * Web Audio API synthesized notes for non-distracting physical validation.
 * =========================================================================
 */
class AcousticToneEngine {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playHarmonic(freq, type = "sine", duration = 0.12, gainPeak = 0.08) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainPeak, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Graceful silence on restricted contexts
    }
  }

  tap() {
    this.playHarmonic(520, "triangle", 0.04, 0.04);
  }

  correct() {
    this.playHarmonic(659.25, "sine", 0.16, 0.09); // E5
    setTimeout(() => {
      this.playHarmonic(987.77, "sine", 0.24, 0.08); // B5
    }, 70);
  }

  incorrect() {
    this.playHarmonic(233.08, "sawtooth", 0.18, 0.05);
  }

  conclude() {
    const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
    chord.forEach((note, idx) => {
      setTimeout(() => this.playHarmonic(note, "sine", 0.32, 0.07), idx * 75);
    });
  }
}

/**
 * =========================================================================
 * LOCAL CALENDAR SERVICE
 * Strict Gregorian day boundaries according to local calendar calculations.
 * =========================================================================
 */
const CalendarLedger = {
  getLocalIso(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },

  formatHuman(isoStr) {
    try {
      const [year, month, day] = isoStr.split("-").map(Number);
      const localDate = new Date(year, month - 1, day, 12, 0, 0);
      return new Intl.DateTimeFormat(APP_CONFIG.identity.locale, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      }).format(localDate);
    } catch (e) {
      return isoStr;
    }
  },

  daysBetween(startIso, endIso) {
    const [sy, sm, sd] = startIso.split("-").map(Number);
    const [ey, em, ed] = endIso.split("-").map(Number);
    const startUtc = Date.UTC(sy, sm - 1, sd);
    const endUtc = Date.UTC(ey, em - 1, ed);
    return Math.floor((endUtc - startUtc) / 86400000);
  }
};

/**
 * =========================================================================
 * RFC 4180 COMPLIANT CSV PARSER
 * Robust parser handling quotes, line breaks, and whitespace safely.
 * =========================================================================
 */
function parseRFC4180Csv(rawText) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < rawText.length; i++) {
    const char = rawText[i];
    const next = rawText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field.trim());
      field = "";
    } else if ((char === "\n" || (char === "\r" && next === "\n")) && !inQuotes) {
      if (char === "\r") i++;
      row.push(field.trim());
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  if (rows.length < 2) throw new Error("Dataset is empty or malformed.");
  const headers = rows[0].map(h => h.toLowerCase());
  const records = [];

  for (let r = 1; r < rows.length; r++) {
    if (rows[r].length === 1 && rows[r][0] === "") continue;
    const item = {};
    headers.forEach((hdr, idx) => {
      item[hdr] = rows[r][idx] !== undefined ? rows[r][idx] : "";
    });
    records.push(item);
  }
  return records;
}

function resolveAnswerOptionIndex(val) {
  const clean = String(val).trim().toUpperCase();
  if (clean === "A" || clean === "0") return 0;
  if (clean === "B" || clean === "1") return 1;
  if (clean === "C" || clean === "2") return 2;
  if (clean === "D" || clean === "3") return 3;
  return 0;
}

/**
 * =========================================================================
 * FLOATING TACTILE PAPER ENGINE
 * Upward subtle elevation of stationery botanicals and geometric foils.
 * =========================================================================
 */
class TactilePaperDepthEngine {
  constructor(container, enabled = true) {
    this.container = container;
    this.enabled = enabled;
    this.items = [];
    this.animId = null;
    this.lastTimestamp = 0;
    this.isRunning = false;
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = "";
    this.items = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.enabled = false;
    }

    const count = 7;
    for (let i = 0; i < count; i++) {
      const g = this.spawnItem(i, true);
      this.container.appendChild(g.el);
      this.items.push(g);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stop();
      else if (this.enabled) this.start();
    });

    if (this.enabled) this.start();
  }

  spawnItem(index, scatter = false) {
    const el = document.createElement("div");
    el.className = "tactile-garnish-item";

    const plane = index % 3;
    el.classList.add(plane === 0 ? "depth-back" : plane === 1 ? "depth-mid" : "depth-fore");

    const svgIndex = (index * 3) % TACTILE_SVGS.length;
    el.innerHTML = TACTILE_SVGS[svgIndex];

    const sizePx = plane === 0 ? 36 : plane === 1 ? 50 : 66;
    el.style.width = `${sizePx}px`;
    el.style.height = `${sizePx}px`;

    const speed = plane === 0 ? 10 : plane === 1 ? 16 : 22;
    const waveAmp = 1.2 + Math.random() * 2;
    const waveFreq = 0.5 + Math.random() * 0.7;
    const waveOffset = Math.random() * Math.PI * 2;
    const rotSpeed = (Math.random() - 0.5) * 12;

    const startY = scatter ? (Math.random() * 110) : (105 + Math.random() * 10);
    const startX = 6 + Math.random() * 88;

    return {
      el,
      x: startX,
      y: startY,
      speed,
      waveAmp,
      waveFreq,
      waveOffset,
      rotation: Math.random() * 360,
      rotSpeed
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTimestamp = performance.now();

    const loop = (time) => {
      if (!this.isRunning) return;
      const dt = Math.min((time - this.lastTimestamp) / 1000, 0.1);
      this.lastTimestamp = time;

      this.items.forEach(item => {
        item.y -= item.speed * dt * 0.45;
        item.rotation += item.rotSpeed * dt;

        if (item.y < -15) {
          item.y = 105 + Math.random() * 6;
          item.x = 6 + Math.random() * 88;
        }

        const drift = Math.sin(time * 0.001 * item.waveFreq + item.waveOffset) * item.waveAmp;
        item.el.style.transform = `translate3d(${item.x + drift}vw, ${item.y}vh, 0) rotate(${item.rotation}deg)`;
      });

      this.animId = requestAnimationFrame(loop);
    };

    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  setEnabled(val) {
    this.enabled = val;
    if (this.enabled) this.start();
    else this.stop();
  }
}

/**
 * =========================================================================
 * APPLICATION MASTER CONTROLLER
 * Zero-placeholder hydration, continuous cycles, and state machine.
 * =========================================================================
 */
class EditorialDailyQuizApp {
  constructor() {
    this.state = this.loadState();
    this.audio = new AcousticToneEngine(this.state.audioEnabled);
    this.puzzles = [];
    this.currentLocalDate = CalendarLedger.getLocalIso();
    this.activeDailyPuzzle = null;

    this.activeRound = null;
    this.currentIndex = 0;
    this.roundAnswers = [];
    this.isReviewMode = false;
    this.selectedChoice = null;

    this.activeDrawer = null;
    this.midnightInterval = null;

    this.cacheDom();
    this.hydrateIdentityAndNav();

    this.depthEngine = new TactilePaperDepthEngine(
      this.dom.tactileFoilContainer,
      this.state.animationEnabled
    );
    this.depthEngine.init();

    this.bindEvents();
    this.syncPreferenceToggles();
    this.initDataPipeline();
    this.initMidnightWatcher();
  }

  loadState() {
    const defaults = {
      audioEnabled: APP_CONFIG.features.enableAcousticFeedback,
      animationEnabled: APP_CONFIG.features.enableTactileAnimation,
      streak: 0,
      bestStreak: 0,
      lastCompletedDate: null,
      history: {},
      inProgress: null
    };

    try {
      const raw = localStorage.getItem(APP_CONFIG.content.storageKey);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "object" || parsed === null) return defaults;
      return { ...defaults, ...parsed };
    } catch (e) {
      return defaults;
    }
  }

  saveState() {
    try {
      localStorage.setItem(APP_CONFIG.content.storageKey, JSON.stringify(this.state));
    } catch (e) {
      // Safe fallback
    }
  }

  cacheDom() {
    this.dom = {
      headerBackBtn: document.getElementById("headerBackBtn"),
      headerHomeBtn: document.getElementById("headerHomeBtn"),
      backBtnLabel: document.getElementById("backBtnLabel"),
      pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
      pageTitleSlot: document.getElementById("pageTitleSlot"),
      pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
      quickAudioBtn: document.getElementById("quickAudioBtn"),
      quickAudioIcon: document.getElementById("quickAudioIcon"),
      tactileFoilContainer: document.getElementById("tactileFoilContainer"),

      bottomDockNavItems: document.getElementById("bottomDockNavItems"),

      statusView: document.getElementById("statusView"),
      statusTitle: document.getElementById("statusTitle"),
      statusMessage: document.getElementById("statusMessage"),
      statusRetryBtn: document.getElementById("statusRetryBtn"),

      menuView: document.getElementById("menuView"),
      playTodayBtn: document.getElementById("playTodayBtn"),
      playTodayTitle: document.getElementById("playTodayTitle"),
      menuTodayBadge: document.getElementById("menuTodayBadge"),
      menuReleaseDate: document.getElementById("menuReleaseDate"),
      openVaultBtn: document.getElementById("openVaultBtn"),
      vaultCountBadge: document.getElementById("vaultCountBadge"),
      openHowToPlayBtn: document.getElementById("openHowToPlayBtn"),
      openSettingsBtn: document.getElementById("openSettingsBtn"),

      gameView: document.getElementById("gameView"),
      gameModeBadge: document.getElementById("gameModeBadge"),
      questionCounterLabel: document.getElementById("questionCounterLabel"),
      stepperTrack: document.getElementById("stepperTrack"),
      questionText: document.getElementById("questionText"),
      optionsContainer: document.getElementById("optionsContainer"),
      explanationPanel: document.getElementById("explanationPanel"),
      answerIndicator: document.getElementById("answerIndicator"),
      explanationText: document.getElementById("explanationText"),
      nextQuestionBtn: document.getElementById("nextQuestionBtn"),

      resultsView: document.getElementById("resultsView"),
      resultsHeadline: document.getElementById("resultsHeadline"),
      scoreValue: document.getElementById("scoreValue"),
      scoreTotal: document.getElementById("scoreTotal"),
      resultsBreakdown: document.getElementById("resultsBreakdown"),
      resultsStreakValue: document.getElementById("resultsStreakValue"),
      resultsAccuracyValue: document.getElementById("resultsAccuracyValue"),
      shareScoreBtn: document.getElementById("shareScoreBtn"),
      reviewQuizBtn: document.getElementById("reviewQuizBtn"),
      resultsVaultBtn: document.getElementById("resultsVaultBtn"),
      resultsMenuBtn: document.getElementById("resultsMenuBtn"),

      vaultView: document.getElementById("vaultView"),
      vaultList: document.getElementById("vaultList"),
      vaultTotalBadge: document.getElementById("vaultTotalBadge"),
      vaultEmptyMsg: document.getElementById("vaultEmptyMsg"),

      drawerScrim: document.getElementById("drawerScrim"),
      howToPlayDrawer: document.getElementById("howToPlayDrawer"),
      closeHowToBtn: document.getElementById("closeHowToBtn"),

      settingsDrawer: document.getElementById("settingsDrawer"),
      closeSettingsBtn: document.getElementById("closeSettingsBtn"),
      toggleSoundBtn: document.getElementById("toggleSoundBtn"),
      toggleAnimationBtn: document.getElementById("toggleAnimationBtn"),
      resetDataBtn: document.getElementById("resetDataBtn"),

      statsDrawer: document.getElementById("statsDrawer"),
      closeStatsBtn: document.getElementById("closeStatsBtn"),
      statPlayed: document.getElementById("statPlayed"),
      statAccuracy: document.getElementById("statAccuracy"),
      statCurrentStreak: document.getElementById("statCurrentStreak"),
      statBestStreak: document.getElementById("statBestStreak"),
      scoreDistributionChart: document.getElementById("scoreDistributionChart"),

      toastMessage: document.getElementById("toastMessage")
    };
  }

  hydrateIdentityAndNav() {
    document.title = `${APP_CONFIG.identity.appName} — Editorial Edition`;
    this.dom.pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
    this.dom.pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;

    // Hydrate Sticky Bottom Thumb-Zone Navigation Dock
    this.dom.bottomDockNavItems.innerHTML = "";
    APP_CONFIG.navigation.items.forEach(navItem => {
      if (!navItem.enabled) return;
      const btn = document.createElement("button");
      btn.className = "nav-tab-item";
      btn.type = "button";
      btn.setAttribute("aria-label", navItem.label);

      let iconSvg = "";
      if (navItem.icon === "icon-calendar") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      } else if (navItem.icon === "icon-archive") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`;
      } else if (navItem.icon === "icon-stats") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>`;
      } else if (navItem.icon === "icon-guide") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      } else if (navItem.icon === "icon-settings") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`;
      }

      btn.innerHTML = `${iconSvg}<span>${navItem.label}</span><span class="nav-tab-item__indicator"></span>`;

      btn.addEventListener("click", () => {
        this.triggerTactilePulse();
        this.audio.tap();
        if (navItem.targetView) {
          this.closeActiveDrawer();
          if (navItem.targetView === "vaultView") this.renderVault();
          else this.showView(navItem.targetView);
        } else if (navItem.targetDrawer) {
          if (navItem.targetDrawer === "statsDrawer") this.renderStats();
          this.openDrawer(this.dom[navItem.targetDrawer]);
        }
      });

      this.dom.bottomDockNavItems.appendChild(btn);
    });
  }

  triggerTactilePulse() {
    if (APP_CONFIG.features.enableHapticFeedback && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {}
    }
  }

  bindEvents() {
    this.dom.headerBackBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.showView("menuView");
    });

    this.dom.quickAudioBtn.addEventListener("click", () => {
      this.toggleSound();
    });

    this.dom.statusRetryBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.initDataPipeline();
    });

    this.dom.playTodayBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      if (this.activeDailyPuzzle) {
        this.startRound(this.activeDailyPuzzle, true);
      }
    });

    this.dom.openVaultBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.renderVault();
    });

    this.dom.openHowToPlayBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.openDrawer(this.dom.howToPlayDrawer);
    });

    this.dom.openSettingsBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.openDrawer(this.dom.settingsDrawer);
    });

    this.dom.closeHowToBtn.addEventListener("click", () => this.closeActiveDrawer());
    this.dom.closeSettingsBtn.addEventListener("click", () => this.closeActiveDrawer());
    this.dom.closeStatsBtn.addEventListener("click", () => this.closeActiveDrawer());
    this.dom.drawerScrim.addEventListener("click", () => this.closeActiveDrawer());

    this.dom.toggleSoundBtn.addEventListener("click", () => this.toggleSound());

    this.dom.toggleAnimationBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.state.animationEnabled = !this.state.animationEnabled;
      this.saveState();
      this.depthEngine.setEnabled(this.state.animationEnabled);
      this.syncPreferenceToggles();
      this.audio.tap();
    });

    this.dom.resetDataBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      if (window.confirm("Permanently clear player records, streaks, and history?")) {
        localStorage.removeItem(APP_CONFIG.content.storageKey);
        this.state = this.loadState();
        this.audio.enabled = this.state.audioEnabled;
        this.depthEngine.setEnabled(this.state.animationEnabled);
        this.syncPreferenceToggles();
        this.renderMenuStage();
        this.closeActiveDrawer();
        this.showToast(APP_CONFIG.content.notifications.resetCompleted);
      }
    });

    this.dom.nextQuestionBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.handleQuestionAdvance();
    });

    this.dom.shareScoreBtn.addEventListener("click", () => this.shareScoreSummary());
    this.dom.reviewQuizBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.beginReviewMode();
    });
    this.dom.resultsVaultBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.renderVault();
    });
    this.dom.resultsMenuBtn.addEventListener("click", () => {
      this.triggerTactilePulse();
      this.audio.tap();
      this.showView("menuView");
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeDrawer) {
        this.closeActiveDrawer();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) this.auditDayBoundaryTransition();
    });
    window.addEventListener("focus", () => this.auditDayBoundaryTransition());
  }

  initMidnightWatcher() {
    if (this.midnightInterval) clearInterval(this.midnightInterval);
    this.midnightInterval = setInterval(() => {
      this.auditDayBoundaryTransition();
    }, APP_CONFIG.cycle.midnightCheckIntervalMs);
  }

  auditDayBoundaryTransition() {
    const freshIso = CalendarLedger.getLocalIso();
    if (freshIso !== this.currentLocalDate) {
      this.currentLocalDate = freshIso;
      if (this.puzzles.length > 0) {
        this.assignDailyPuzzleForDate(this.currentLocalDate);
        this.renderMenuStage();
        if (!this.dom.vaultView.classList.contains("hidden")) {
          this.renderVault();
        }
      }
    }
  }

  toggleSound() {
    this.triggerTactilePulse();
    this.audio.enabled = !this.audio.enabled;
    this.state.audioEnabled = this.audio.enabled;
    this.saveState();
    this.syncPreferenceToggles();
    if (this.audio.enabled) this.audio.tap();
  }

  syncPreferenceToggles() {
    this.dom.quickAudioIcon.innerHTML = this.audio.enabled
      ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

    this.dom.toggleSoundBtn.setAttribute("aria-checked", String(this.audio.enabled));
    this.dom.toggleSoundBtn.querySelector(".toggle-state").textContent = this.audio.enabled ? "ON" : "OFF";

    this.dom.toggleAnimationBtn.setAttribute("aria-checked", String(this.state.animationEnabled));
    this.dom.toggleAnimationBtn.querySelector(".toggle-state").textContent = this.state.animationEnabled ? "ON" : "OFF";
  }

  openDrawer(drawerEl) {
    if (this.activeDrawer && this.activeDrawer !== drawerEl) {
      this.activeDrawer.classList.remove("open");
      this.activeDrawer.hidden = true;
    }
    this.activeDrawer = drawerEl;
    this.dom.drawerScrim.classList.remove("hidden");

    drawerEl.hidden = false;
    void drawerEl.offsetWidth;

    this.dom.drawerScrim.classList.add("visible");
    drawerEl.classList.add("open");

    const closeBtn = drawerEl.querySelector(".drawer-close-btn");
    if (closeBtn) closeBtn.focus();
  }

  closeActiveDrawer() {
    if (!this.activeDrawer) return;
    this.triggerTactilePulse();
    this.audio.tap();
    const target = this.activeDrawer;
    this.activeDrawer = null;

    target.classList.remove("open");
    this.dom.drawerScrim.classList.remove("visible");

    setTimeout(() => {
      target.hidden = true;
      this.dom.drawerScrim.classList.add("hidden");
    }, 320);
  }

  showView(viewName) {
    const views = ["statusView", "menuView", "gameView", "resultsView", "vaultView"];
    views.forEach(v => this.dom[v].classList.add("hidden"));
    this.dom[viewName].classList.remove("hidden");

    if (viewName === "menuView") {
      this.dom.pageEyebrowSlot.textContent = "CHALLENGE CYCLE 2026";
      this.dom.pageTitleSlot.textContent = APP_CONFIG.identity.appName;
      this.dom.pageSubtitleSlot.textContent = APP_CONFIG.identity.appTagline;
      this.dom.headerHomeBtn.classList.remove("hidden");
      this.dom.headerBackBtn.classList.add("hidden");
      this.renderMenuStage();
    } else if (viewName === "gameView") {
      this.dom.pageEyebrowSlot.textContent = this.activeRound?.isDaily ? "LIVE CHALLENGE" : "VAULT ARCHIVE";
      this.dom.pageTitleSlot.textContent = this.activeRound
        ? (this.activeRound.isDaily ? "Daily Quiz" : `Challenge #${this.activeRound.puzzleNumber}`)
        : APP_CONFIG.identity.appName;
      this.dom.pageSubtitleSlot.textContent = "Evaluate each inquiry with academic precision.";
      this.dom.headerHomeBtn.classList.add("hidden");
      this.dom.headerBackBtn.classList.remove("hidden");
    } else if (viewName === "vaultView") {
      this.dom.pageEyebrowSlot.textContent = "HISTORICAL DOSSIER";
      this.dom.pageTitleSlot.textContent = "The Vault";
      this.dom.pageSubtitleSlot.textContent = "Complete archive of previous daily challenges.";
      this.dom.headerHomeBtn.classList.add("hidden");
      this.dom.headerBackBtn.classList.remove("hidden");
    } else if (viewName === "resultsView") {
      this.dom.pageEyebrowSlot.textContent = "EVALUATION SUMMARY";
      this.dom.pageTitleSlot.textContent = "Results Dossier";
      this.dom.pageSubtitleSlot.textContent = "Comprehensive performance and answer breakdown.";
      this.dom.headerHomeBtn.classList.add("hidden");
      this.dom.headerBackBtn.classList.remove("hidden");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  calculateDeterministicCycleIndex(localIsoStr, total) {
    if (!total || total <= 0) return 0;
    const elapsed = CalendarLedger.daysBetween(APP_CONFIG.cycle.anchorDate, localIsoStr);
    const raw = (APP_CONFIG.cycle.anchorPuzzleIndex + elapsed) % total;
    return (raw + total) % total;
  }

  assignDailyPuzzleForDate(localIsoStr) {
    if (this.puzzles.length === 0) {
      this.activeDailyPuzzle = null;
      return;
    }
    const idx = this.calculateDeterministicCycleIndex(localIsoStr, this.puzzles.length);
    this.activeDailyPuzzle = this.puzzles[idx];
  }

  async initDataPipeline() {
    this.dom.statusTitle.textContent = "Synchronizing Records";
    this.dom.statusMessage.textContent = "Ingesting authorized challenge matrix and calendar rotation...";
    this.dom.statusRetryBtn.classList.add("hidden");
    this.showView("statusView");

    try {
      const abortCtrl = new AbortController();
      const timer = setTimeout(() => abortCtrl.abort(), APP_CONFIG.cycle.fetchTimeoutMs);

      const resp = await fetch(APP_CONFIG.cycle.csvPath, {
        cache: "no-store",
        signal: abortCtrl.signal
      });
      clearTimeout(timer);

      if (!resp.ok) throw new Error("Unable to retrieve authorized challenge records.");
      const rawText = await resp.text();
      const records = parseRFC4180Csv(rawText);

      const validInquiries = [];
      records.forEach(row => {
        if (!row.question || !String(row.question).trim()) return;
        const opts = [
          row.option_a || "",
          row.option_b || "",
          row.option_c || "",
          row.option_d || ""
        ];
        if (!opts[0] && !opts[1]) return;

        validInquiries.push({
          question: row.question.trim(),
          options: opts.map(o => o.trim()),
          answerIndex: resolveAnswerOptionIndex(row.answer),
          explanation: (row.explanation || "").trim()
        });
      });

      if (validInquiries.length === 0) {
        throw new Error("No verified questions identified in dataset.");
      }

      const qPerRound = APP_CONFIG.cycle.questionsPerRound;
      this.puzzles = [];
      for (let i = 0; i < validInquiries.length; i += qPerRound) {
        const slice = validInquiries.slice(i, i + qPerRound);
        if (slice.length > 0) {
          const num = this.puzzles.length + 1;
          this.puzzles.push({
            id: `puzzle_${num}`,
            puzzleNumber: num,
            title: `Challenge #${num}`,
            questions: slice
          });
        }
      }

      this.currentLocalDate = CalendarLedger.getLocalIso();
      this.assignDailyPuzzleForDate(this.currentLocalDate);
      this.showView("menuView");

    } catch (err) {
      this.dom.statusTitle.textContent = "Operational Notice";
      this.dom.statusMessage.textContent = err.message || "Failed to establish puzzle ledger connection.";
      this.dom.statusRetryBtn.classList.remove("hidden");
      this.showView("statusView");
    }
  }

  renderMenuStage() {
    this.dom.vaultCountBadge.textContent = `${this.puzzles.length} Records`;

    if (!this.activeDailyPuzzle) {
      this.dom.playTodayTitle.textContent = "Challenge Offline";
      this.dom.menuReleaseDate.textContent = "Verify connection";
      this.dom.playTodayBtn.disabled = true;
      return;
    }

    this.dom.playTodayBtn.disabled = false;
    const humanDate = CalendarLedger.formatHuman(this.currentLocalDate);
    this.dom.menuReleaseDate.textContent = `${humanDate} • 5 Inquiries`;

    const dailySessionKey = `daily_${this.currentLocalDate}`;
    const historicalRun = this.state.history[dailySessionKey];
    const resumeSession = this.state.inProgress && this.state.inProgress.sessionId === dailySessionKey;

    if (historicalRun && historicalRun.completed) {
      this.dom.playTodayTitle.textContent = "Daily Challenge Completed";
      this.dom.menuTodayBadge.textContent = `Scored: ${historicalRun.score}/${historicalRun.answers.length}`;
      this.dom.menuTodayBadge.className = "status-badge status-badge--sage";
      this.dom.playTodayBtn.querySelector("span").textContent = "Inspect Today's Performance";
    } else if (resumeSession) {
      const answered = resumeSession.answers ? resumeSession.answers.length : 0;
      this.dom.playTodayTitle.textContent = "Daily Challenge In Progress";
      this.dom.menuTodayBadge.textContent = `Step ${answered + 1} of 5`;
      this.dom.menuTodayBadge.className = "status-badge status-badge--ochre";
      this.dom.playTodayBtn.querySelector("span").textContent = "Resume Challenge";
    } else {
      this.dom.playTodayTitle.textContent = "Daily Challenge";
      this.dom.menuTodayBadge.textContent = "Ready for Service";
      this.dom.menuTodayBadge.className = "status-badge status-badge--ochre";
      this.dom.playTodayBtn.querySelector("span").textContent = "Start Daily Challenge";
    }
  }

  startRound(puzzle, isDaily = false) {
    if (!puzzle || !puzzle.questions || puzzle.questions.length === 0) return;

    const sessionId = isDaily ? `daily_${this.currentLocalDate}` : `vault_${puzzle.id}`;

    this.activeRound = {
      sessionId: sessionId,
      puzzleId: puzzle.id,
      puzzleNumber: puzzle.puzzleNumber,
      isDaily: isDaily,
      dateStr: isDaily ? this.currentLocalDate : null,
      questions: puzzle.questions
    };

    this.isReviewMode = false;
    this.selectedChoice = null;

    const completedRecord = this.state.history[sessionId];
    if (completedRecord && completedRecord.completed) {
      this.roundAnswers = completedRecord.answers;
      this.showResults(completedRecord.score);
      return;
    }

    if (isDaily && this.state.inProgress && this.state.inProgress.sessionId === sessionId) {
      this.currentIndex = this.state.inProgress.currentIndex || 0;
      this.roundAnswers = this.state.inProgress.answers || [];
    } else {
      this.currentIndex = 0;
      this.roundAnswers = [];
    }

    const humanDate = CalendarLedger.formatHuman(this.currentLocalDate);
    this.dom.gameModeBadge.textContent = isDaily
      ? `Daily Challenge • ${humanDate}`
      : `Vault • Challenge #${puzzle.puzzleNumber}`;

    this.showView("gameView");
    this.renderQuestionScreen();
  }

  renderQuestionScreen() {
    const q = this.activeRound.questions[this.currentIndex];
    const total = this.activeRound.questions.length;
    this.selectedChoice = null;

    this.dom.questionCounterLabel.textContent = `Question ${this.currentIndex + 1} of ${total}`;
    this.dom.questionText.textContent = q.question;
    this.dom.explanationPanel.classList.add("hidden");
    this.dom.optionsContainer.innerHTML = "";
    this.renderStepperUI();

    const keys = ["A", "B", "C", "D"];
    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-choice-btn";
      btn.type = "button";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");
      btn.innerHTML = `<span class="option-key-badge">${keys[idx]}</span><span>${optText}</span>`;

      btn.addEventListener("click", () => {
        this.triggerTactilePulse();
        this.handleChoiceSelection(idx);
      });

      this.dom.optionsContainer.appendChild(btn);
    });

    const isLast = (this.currentIndex === total - 1);
    this.dom.nextQuestionBtn.textContent = isLast ? "Conclude Challenge" : "Continue to Next Question";
  }

  renderStepperUI() {
    this.dom.stepperTrack.innerHTML = "";
    this.activeRound.questions.forEach((_, idx) => {
      const pip = document.createElement("div");
      pip.className = "step-pip";
      pip.textContent = idx + 1;
      pip.setAttribute("aria-label", `Inquiry ${idx + 1}`);

      if (idx === this.currentIndex) {
        pip.classList.add("current");
      } else if (idx < this.roundAnswers.length) {
        pip.classList.add(this.roundAnswers[idx].isCorrect ? "correct" : "incorrect");
      }
      this.dom.stepperTrack.appendChild(pip);
    });
  }

  handleChoiceSelection(choiceIdx) {
    if (this.selectedChoice !== null) return;
    this.selectedChoice = choiceIdx;

    const q = this.activeRound.questions[this.currentIndex];
    const isCorrect = (choiceIdx === q.answerIndex);
    this.roundAnswers.push({ chosen: choiceIdx, isCorrect });

    if (isCorrect) {
      this.audio.correct();
      this.dom.answerIndicator.textContent = "✓ Verified Correct";
      this.dom.answerIndicator.className = "status-badge status-badge--sage";
    } else {
      this.audio.incorrect();
      this.dom.answerIndicator.textContent = "✕ Inaccurate Selection";
      this.dom.answerIndicator.className = "status-badge status-badge--terracotta";
    }

    const allButtons = this.dom.optionsContainer.querySelectorAll(".option-choice-btn");
    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answerIndex) {
        btn.classList.add("correct");
      } else if (idx === choiceIdx && !isCorrect) {
        btn.classList.add("incorrect");
      }
      if (idx === choiceIdx) {
        btn.setAttribute("aria-checked", "true");
      }
    });

    this.dom.explanationText.textContent = q.explanation || "Historical reference verified from source archives.";
    this.dom.explanationPanel.classList.remove("hidden");
    this.renderStepperUI();

    if (this.activeRound.isDaily) {
      this.state.inProgress = {
        sessionId: this.activeRound.sessionId,
        currentIndex: this.currentIndex,
        answers: this.roundAnswers
      };
      this.saveState();
    }

    this.dom.nextQuestionBtn.focus();
  }

  handleQuestionAdvance() {
    if (this.isReviewMode) {
      if (this.currentIndex < this.activeRound.questions.length - 1) {
        this.currentIndex++;
        this.renderReviewInquiry();
      } else {
        this.showView("resultsView");
      }
      return;
    }

    if (this.currentIndex < this.activeRound.questions.length - 1) {
      this.currentIndex++;
      if (this.activeRound.isDaily && this.state.inProgress) {
        this.state.inProgress.currentIndex = this.currentIndex;
        this.saveState();
      }
      this.renderQuestionScreen();
    } else {
      this.concludeRound();
    }
  }

  concludeRound() {
    const score = this.roundAnswers.filter(a => a.isCorrect).length;

    if (this.activeRound.isDaily) {
      const todayIso = this.currentLocalDate;
      if (this.state.lastCompletedDate) {
        const gap = CalendarLedger.daysBetween(this.state.lastCompletedDate, todayIso);
        if (gap === 1) {
          this.state.streak = (this.state.streak || 0) + 1;
        } else if (gap > 1) {
          this.state.streak = 1;
        }
      } else {
        this.state.streak = 1;
      }

      if (this.state.streak > (this.state.bestStreak || 0)) {
        this.state.bestStreak = this.state.streak;
      }
      this.state.lastCompletedDate = todayIso;
      this.state.inProgress = null;
    }

    this.state.history[this.activeRound.sessionId] = {
      completed: true,
      score: score,
      answers: this.roundAnswers
    };
    this.saveState();

    this.audio.conclude();
    this.showResults(score);
  }

  showResults(score) {
    this.showView("resultsView");
    const total = this.roundAnswers.length;
    this.dom.scoreValue.textContent = score;
    this.dom.scoreTotal.textContent = `/ ${total}`;

    this.dom.resultsStreakValue.textContent = this.state.streak || 0;
    const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
    this.dom.resultsAccuracyValue.textContent = `${accuracy}%`;

    this.dom.resultsBreakdown.innerHTML = "";
    this.roundAnswers.forEach((ans, idx) => {
      const pip = document.createElement("div");
      pip.className = `breakdown-pip ${ans.isCorrect ? "correct" : "incorrect"}`;
      pip.textContent = ans.isCorrect ? "✓" : "✕";
      pip.setAttribute("aria-label", `Inquiry ${idx + 1}: ${ans.isCorrect ? "Correct" : "Incorrect"}`);
      this.dom.resultsBreakdown.appendChild(pip);
    });
  }

  beginReviewMode() {
    this.isReviewMode = true;
    this.currentIndex = 0;
    this.showView("gameView");
    this.renderReviewInquiry();
  }

  renderReviewInquiry() {
    const q = this.activeRound.questions[this.currentIndex];
    const total = this.activeRound.questions.length;
    const recorded = this.roundAnswers[this.currentIndex] || { chosen: -1, isCorrect: false };
    this.renderStepperUI();

    this.dom.questionCounterLabel.textContent = `Reviewing ${this.currentIndex + 1} of ${total}`;
    this.dom.questionText.textContent = q.question;
    this.dom.optionsContainer.innerHTML = "";
    const keys = ["A", "B", "C", "D"];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-choice-btn";
      btn.disabled = true;
      if (idx === q.answerIndex) {
        btn.classList.add("correct");
      } else if (idx === recorded.chosen && !recorded.isCorrect) {
        btn.classList.add("incorrect");
      }
      btn.innerHTML = `<span class="option-key-badge">${keys[idx]}</span><span>${optText}</span>`;
      this.dom.optionsContainer.appendChild(btn);
    });

    if (recorded.isCorrect) {
      this.dom.answerIndicator.textContent = "✓ Verified Correct";
      this.dom.answerIndicator.className = "status-badge status-badge--sage";
    } else {
      this.dom.answerIndicator.textContent = "✕ Inaccurate Selection";
      this.dom.answerIndicator.className = "status-badge status-badge--terracotta";
    }

    this.dom.explanationText.textContent = q.explanation || "Historical reference verified from source archives.";
    this.dom.explanationPanel.classList.remove("hidden");

    const isLast = (this.currentIndex === total - 1);
    this.dom.nextQuestionBtn.textContent = isLast ? "Return to Dossier" : "Continue to Next Question";
  }

  renderVault() {
    this.showView("vaultView");
    this.dom.vaultList.innerHTML = "";
    this.dom.vaultTotalBadge.textContent = `${this.puzzles.length} Records`;

    if (this.puzzles.length === 0) {
      this.dom.vaultEmptyMsg.classList.remove("hidden");
      return;
    }
    this.dom.vaultEmptyMsg.classList.add("hidden");

    this.puzzles.forEach(puzzle => {
      const row = document.createElement("button");
      row.className = "vault-row-card";
      row.type = "button";

      const sessionId = `vault_${puzzle.id}`;
      const hist = this.state.history[sessionId];
      const isDone = hist && hist.completed;
      const isToday = (this.activeDailyPuzzle && this.activeDailyPuzzle.id === puzzle.id);

      row.innerHTML = `
        <div class="vault-row-info">
          <span class="vault-row-title">Challenge #${puzzle.puzzleNumber}</span>
          ${isToday ? '<span class="status-badge status-badge--ochre">Today</span>' : ""}
        </div>
        <span class="status-badge ${isDone ? "status-badge--sage" : ""}">
          ${isDone ? `Score: ${hist.score}/${hist.answers.length}` : "Solve"}
        </span>
      `;

      row.addEventListener("click", () => {
        this.triggerTactilePulse();
        this.audio.tap();
        this.startRound(puzzle, false);
      });

      this.dom.vaultList.appendChild(row);
    });
  }

  renderStats() {
    const records = Object.values(this.state.history).filter(h => h.completed);
    const played = records.length;

    let totalQ = 0;
    let totalC = 0;
    const distribution = [0, 0, 0, 0, 0, 0];

    records.forEach(entry => {
      const sc = entry.score || 0;
      if (sc >= 0 && sc <= 5) distribution[sc]++;
      totalC += sc;
      totalQ += (entry.answers ? entry.answers.length : 5);
    });

    const accuracy = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    this.dom.statPlayed.textContent = played;
    this.dom.statAccuracy.textContent = `${accuracy}%`;
    this.dom.statCurrentStreak.textContent = this.state.streak || 0;
    this.dom.statBestStreak.textContent = this.state.bestStreak || (this.state.streak || 0);

    this.dom.scoreDistributionChart.innerHTML = "";
    const maxVal = Math.max(...distribution, 1);

    for (let s = 5; s >= 0; s--) {
      const count = distribution[s];
      const pct = Math.max(Math.round((count / maxVal) * 100), 10);
      const row = document.createElement("div");
      row.className = "dist-bar-item";
      row.innerHTML = `
        <span class="dist-bar-label">${s}</span>
        <div class="dist-bar-well">
          <div class="dist-bar-progression" style="width: ${count > 0 ? pct : 0}%;">${count}</div>
        </div>
      `;
      this.dom.scoreDistributionChart.appendChild(row);
    }
  }

  shareScoreSummary() {
    this.triggerTactilePulse();
    const score = this.roundAnswers.filter(a => a.isCorrect).length;
    const total = this.roundAnswers.length;
    const blocks = this.roundAnswers.map(a => a.isCorrect ? "🟩" : "⬛").join("");
    const context = this.activeRound.isDaily
      ? `Daily Challenge • ${CalendarLedger.formatHuman(this.currentLocalDate)}`
      : `Vault Challenge #${this.activeRound.puzzleNumber}`;

    const text = `${APP_CONFIG.identity.appName} • ${context}\nPerformance: ${score}/${total}\n${blocks}\n${APP_CONFIG.identity.canonicalUrl}`;

    if (navigator.share) {
      navigator.share({ title: APP_CONFIG.identity.appName, text }).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => this.showToast(APP_CONFIG.content.notifications.scoreCopied))
        .catch(() => this.showToast("Clipboard unavailable."));
    } else {
      this.showToast(APP_CONFIG.content.notifications.shareUnsupported);
    }
  }

  showToast(msg) {
    this.dom.toastMessage.textContent = msg;
    this.dom.toastMessage.classList.add("visible");
    setTimeout(() => {
      this.dom.toastMessage.classList.remove("visible");
    }, 2200);
  }
}

// Self-bootstrapping
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new EditorialDailyQuizApp());
} else {
  new EditorialDailyQuizApp();
}