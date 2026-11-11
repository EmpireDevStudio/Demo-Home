/* START OF FILE script.js */
/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  identity: {
    appId: "editorial-crossword-suite",
    appName: "Editorial Ledger",
    appTagline: "Artisanal Crossword Challenges & Lexical Record",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },
  branding: {
    logoUrl: "./assets/seal.svg",
    logoAlt: "Editorial Ledger Stationery Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#963E35",      // Accessible Terracotta Red
    accentSecondary: "#3E5B42",  // Accessible Sage Green
    accentHighlight: "#6E5614",  // Accessible Ochre
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "overview",
    items: [
      { id: "overview", label: "Overview", icon: "overview", route: "#overview", enabled: true, showInBottomBar: true },
      { id: "game", label: "Ledger", icon: "game", route: "#game", enabled: true, showInBottomBar: true },
      { id: "vault", label: "Vault", icon: "vault", route: "#vault", enabled: true, showInBottomBar: true },
      { id: "stats", label: "Stats", icon: "stats", route: "#stats", enabled: true, showInBottomBar: true },
    ],
  },
  content: {
    headers: {
      overview: {
        eyebrow: "DAILY WORKSPACE",
        title: "Editorial Crossword",
        subtitle: "Handcrafted daily vocabulary puzzles arranged by tier density and solve cadence.",
      },
      game: {
        eyebrow: "SOLVE SESSION",
        title: "Daily Crossword Grid",
        subtitle: "Select open cardstock cells to inspect hints. Tap direction to toggle Across & Down tracks.",
      },
      vault: {
        eyebrow: "LEDGER ARCHIVE",
        title: "Vault Archive",
        subtitle: "Review complete historical records, solved editions, and past vocabulary publications.",
      },
      stats: {
        eyebrow: "PERFORMANCE LEDGER",
        title: "Solve Analytics",
        subtitle: "Review continuous solver streaks, completion tallies, and median duration records.",
      },
    },
    emptyStates: {
      noDataHeading: "No Ledger Records Documented",
      noDataDescription: "This operational log is clear. Create or initiate an entry to build your records.",
      noSearchResultsHeading: "No Matching Records Located",
      noSearchResultsDescription: "Review your filter parameters or search terms and query the archives again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Commit Entry",
      back: "Back",
    },
    notifications: {
      solveSuccess: "Congratulations! Crossword solved and committed to the ledger archive.",
      linkCopied: "Permanent record link copied to clipboard.",
      offlineLoaded: "Loaded local archival puzzles.",
    },
    legal: {
      copyrightHolder: "",
      establishedYear: 2026,
      privacyPolicyUrl: "",
      termsOfServiceUrl: "",
    },
  },
  support: {
    contactEmail: "",
    supportDeskUrl: "",
    operatingHours: "Monday – Friday, 08:00 – 18:00 EST",
  },
  features: {
    enableHapticFeedback: true,
    enableSmoothPageTransitions: true,
    enableSoundEffects: true,
    enableStickyBottomBar: true,
  },
  endpoints: {
    csvUrl: "./puzzles.csv",
    storageKeys: {
      sessionData: "els_crossword_session_v2",
    },
  },
});

(() => {
  'use strict';

  /* ==========================================================================
     PHYSICAL AUDIO FEEDBACK (Subtle stationery mechanical clicks)
     ========================================================================== */
  class PaperAudioEngine {
    constructor() {
      this.ctx = null;
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

    playClick() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
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

    playToggle() {
      if (!APP_CONFIG.features.enableSoundEffects) return;
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
      if (!APP_CONFIG.features.enableSoundEffects) return;
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

  const paperAudio = new PaperAudioEngine();

  function triggerHaptics() {
    if (APP_CONFIG.features.enableHapticFeedback && typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {
        // Silent catch for restricted permission environments
      }
    }
  }

  /* ==========================================================================
     APPLICATION STATE ENGINE
     ========================================================================== */
  const state = {
    currentRoute: "overview",
    puzzles: [],
    tiers: ["mini", "midi", "main"],
    puzzlesByTier: {},
    selectedDailyTier: "mini",
    activeTier: "mini",
    activePuzzle: null,
    isDailyMode: true,
    userGrid: [],
    cursor: { r: 0, c: 0 },
    direction: "across",
    timerSeconds: 0,
    timerInterval: null,
    isSolved: false,

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
    btnGlobalBack: document.getElementById("btnGlobalBack"),
    btnBackNavLabel: document.getElementById("btnBackNavLabel"),
    pageEyebrowSlot: document.getElementById("pageEyebrowSlot"),
    pageTitleSlot: document.getElementById("pageTitleSlot"),
    pageSubtitleSlot: document.getElementById("pageSubtitleSlot"),
    headerActionsSlot: document.getElementById("headerActionsSlot"),
    gameTimerCapsule: document.getElementById("gameTimerCapsule"),
    gameTimerDisplay: document.getElementById("gameTimerDisplay"),
    btnHelpTrigger: document.getElementById("btnHelpTrigger"),

    viewOverview: document.getElementById("view-overview"),
    viewGame: document.getElementById("view-game"),
    viewVault: document.getElementById("view-vault"),
    viewStats: document.getElementById("view-stats"),
    viewError: document.getElementById("view-error"),

    bottomDockNavItems: document.getElementById("bottomDockNavItems"),

    dailyDateLabel: document.getElementById("dailyDateLabel"),
    dailyTierSelector: document.getElementById("dailyTierSelector"),
    btnPlayDaily: document.getElementById("btnPlayDaily"),
    btnPlayDailyLabel: document.getElementById("btnPlayDailyLabel"),

    cardQuickVault: document.getElementById("cardQuickVault"),
    cardQuickStats: document.getElementById("cardQuickStats"),

    gameplayTierTabs: document.getElementById("gameplayTierTabs"),
    activeClueTrigger: document.getElementById("activeClueTrigger"),
    activeClueBadge: document.getElementById("activeClueBadge"),
    activeClueText: document.getElementById("activeClueText"),
    crosswordBoard: document.getElementById("crosswordBoard"),
    cluesListAcross: document.getElementById("cluesListAcross"),
    cluesListDown: document.getElementById("cluesListDown"),
    onscreenKeyboard: document.getElementById("onscreenKeyboard"),

    vaultListContainer: document.getElementById("vaultListContainer"),

    statPlayed: document.getElementById("statPlayed"),
    statSolved: document.getElementById("statSolved"),
    statStreak: document.getElementById("statStreak"),
    statBest: document.getElementById("statBest"),
    statsTierTimesList: document.getElementById("statsTierTimesList"),

    panelHowToPlayOverlay: document.getElementById("panelHowToPlayOverlay"),
    panelHelpBackdrop: document.getElementById("panelHelpBackdrop"),
    btnCloseHelp: document.getElementById("btnCloseHelp"),

    modalVictory: document.getElementById("modalVictory"),
    victorySummaryText: document.getElementById("victorySummaryText"),
    btnVictoryNextAction: document.getElementById("btnVictoryNextAction"),
    btnVictoryReviewAction: document.getElementById("btnVictoryReviewAction"),

    toastMessage: document.getElementById("toastMessage"),
    btnRetryLoad: document.getElementById("btnRetryLoad"),
    errorCardHeading: document.getElementById("errorCardHeading"),
    errorCardMessage: document.getElementById("errorCardMessage")
  };

  /* ==========================================================================
     LOCAL STORAGE STORAGE PERSISTENCE
     ========================================================================== */
  function loadStorage() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.sessionData);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.stats) state.saveData.stats = { ...state.saveData.stats, ...parsed.stats };
        if (parsed.inProgress) state.saveData.inProgress = { ...parsed.inProgress };
        if (parsed.history) state.saveData.history = { ...parsed.history };
      }
    } catch {
      // Storage unavailable; operational in RAM
    }
  }

  function saveStorage() {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.sessionData, JSON.stringify(state.saveData));
    } catch {
      // Storage write suppressed
    }
  }

  /* ==========================================================================
     ROUTING & VIEW HYDRATION
     ========================================================================== */
  function setRoute(routeId, saveState = true) {
    state.currentRoute = routeId;

    // Route view toggles
    el.viewOverview.classList.toggle("hidden", routeId !== "overview");
    el.viewGame.classList.toggle("hidden", routeId !== "game");
    el.viewVault.classList.toggle("hidden", routeId !== "vault");
    el.viewStats.classList.toggle("hidden", routeId !== "stats");
    el.viewError.classList.toggle("hidden", routeId !== "error");

    // Header Meta & Copy Hydration from APP_CONFIG
    const cfgHeader = APP_CONFIG.content.headers[routeId] || APP_CONFIG.content.headers.overview;
    el.pageEyebrowSlot.textContent = cfgHeader.eyebrow;
    el.pageTitleSlot.textContent = cfgHeader.title;
    el.pageSubtitleSlot.textContent = cfgHeader.subtitle;

    // Show/hide timer capsule
    el.gameTimerCapsule.classList.toggle("hidden", routeId !== "game");

    // Back nav label update
    el.btnBackNavLabel.textContent = routeId === "overview" ? "Home" : "Back";

    // Update bottom dock active states
    document.querySelectorAll(".nav-tab-item").forEach(item => {
      const active = item.dataset.route === routeId;
      item.classList.toggle("nav-tab-item--active", active);
      item.setAttribute("aria-selected", String(active));
    });

    if (routeId === "vault") renderVault();
    if (routeId === "stats") renderStats();
    if (routeId === "overview") renderOverview();

    if (saveState && window.location.hash !== `#${routeId}`) {
      window.history.pushState(null, "", `#${routeId}`);
    }
  }

  function renderBottomDock() {
    el.bottomDockNavItems.innerHTML = "";
    APP_CONFIG.navigation.items.filter(i => i.showInBottomBar).forEach(item => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `nav-tab-item ${item.id === state.currentRoute ? "nav-tab-item--active" : ""}`;
      btn.dataset.route = item.id;
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(item.id === state.currentRoute));

      let iconSvg = "";
      if (item.id === "overview") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`;
      } else if (item.id === "game") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/></svg>`;
      } else if (item.id === "vault") {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
      } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
      }

      btn.innerHTML = `${iconSvg}<span>${item.label}</span><div class="nav-tab-indicator"></div>`;
      btn.addEventListener("click", () => {
        paperAudio.playClick();
        triggerHaptics();
        if (item.id === "game" && !state.activePuzzle) {
          const target = getDailyPuzzleForTier(state.selectedDailyTier);
          if (target) loadPuzzle(target, true);
        } else {
          setRoute(item.id);
        }
      });
      el.bottomDockNavItems.appendChild(btn);
    });
  }

  /* ==========================================================================
     DATE CALCULATIONS & PUZZLE SELECTION
     ========================================================================== */
  function getLocalDateString() {
    const d = new Date();
    return d.toLocaleDateString(APP_CONFIG.identity.locale, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function getDailyPuzzleForTier(tier) {
    const list = state.puzzlesByTier[tier] || [];
    if (!list.length) return null;
    return list[0];
  }

  function renderOverview() {
    el.dailyDateLabel.textContent = getLocalDateString();
    el.dailyTierSelector.innerHTML = "";

    state.tiers.forEach(tier => {
      const puzzle = getDailyPuzzleForTier(tier);
      const isDone = puzzle ? !!state.saveData.history[puzzle.id]?.solved : false;

      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `interactive-tactile tier-pill-btn ${tier === state.selectedDailyTier ? "tier-pill-btn--active" : ""}`;
      pill.innerHTML = `<span>${tier}</span>${isDone ? " &#x2713;" : ""}`;
      pill.addEventListener("click", () => {
        paperAudio.playClick();
        triggerHaptics();
        state.selectedDailyTier = tier;
        renderOverview();
      });
      el.dailyTierSelector.appendChild(pill);
    });

    const activeDaily = getDailyPuzzleForTier(state.selectedDailyTier);
    const isSolved = activeDaily ? !!state.saveData.history[activeDaily.id]?.solved : false;
    const tierDisplay = state.selectedDailyTier.toUpperCase();
    el.btnPlayDailyLabel.textContent = isSolved
      ? `Review ${tierDisplay} Solve`
      : `Solve ${tierDisplay} Edition`;
  }

  /* ==========================================================================
     BOARD RENDERING & SELECTION CONTROLLER
     ========================================================================== */
  function loadPuzzle(puzzle, isDaily = true) {
    if (!puzzle) return;
    state.activePuzzle = puzzle;
    state.activeTier = puzzle.tier;
    state.isDailyMode = isDaily;

    const size = puzzle.size;
    state.userGrid = Array.from({ length: size }, () => Array(size).fill(""));
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
            state.userGrid[r][c] = savedInProgress.grid[r]?.[c] || "";
          }
        }
      }
    }

    renderGameTierTabs();
    renderBoard();
    renderClues();
    resetCursor();
    updateTimerDisplay();

    setRoute("game");

    clearInterval(state.timerInterval);
    if (!state.isSolved) {
      state.timerInterval = setInterval(() => {
        state.timerSeconds++;
        updateTimerDisplay();
        persistInProgress();
      }, 1000);
    }
  }

  function renderGameTierTabs() {
    el.gameplayTierTabs.innerHTML = "";
    state.tiers.forEach(tier => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `interactive-tactile tier-tab-pill ${tier === state.activeTier ? "tier-tab-pill--active" : ""}`;
      const dailyTierPuzzle = getDailyPuzzleForTier(tier);
      const isDone = dailyTierPuzzle ? !!state.saveData.history[dailyTierPuzzle.id]?.solved : false;
      btn.innerHTML = `${tier}${isDone ? " &#x2713;" : ""}`;
      btn.addEventListener("click", () => {
        paperAudio.playClick();
        triggerHaptics();
        state.selectedDailyTier = tier;
        const target = getDailyPuzzleForTier(tier);
        if (target) loadPuzzle(target, true);
      });
      el.gameplayTierTabs.appendChild(btn);
    });
  }

  function isBlock(r, c) {
    const p = state.activePuzzle;
    if (!p || r < 0 || c < 0 || r >= p.size || c >= p.size) return true;
    return p.blocks.has(`${r},${c}`);
  }

  function renderBoard() {
    const size = state.activePuzzle.size;
    const grid = el.crosswordBoard;
    grid.dataset.tier = state.activeTier;
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.setAttribute("role", "gridcell");

        if (isBlock(r, c)) {
          cell.classList.add("cell-black");
          cell.setAttribute("aria-hidden", "true");
        } else {
          const num = state.activePuzzle.numbering[`${r},${c}`];
          if (num) {
            const numEl = document.createElement("span");
            numEl.className = "cell-num";
            numEl.textContent = num;
            cell.appendChild(numEl);
          }
          const letter = state.userGrid[r][c];
          if (letter) {
            const letterEl = document.createElement("span");
            letterEl.className = "cell-letter";
            letterEl.textContent = letter;
            cell.appendChild(letterEl);
          }

          cell.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            handleCellTap(r, c);
          });
        }
        grid.appendChild(cell);
      }
    }
  }

  function renderClues() {
    el.cluesListAcross.innerHTML = "";
    el.cluesListDown.innerHTML = "";

    const createClueNode = (item, dir) => {
      const li = document.createElement("li");
      li.className = "clue-item";
      li.dataset.dir = dir;
      li.dataset.num = item.num;
      li.innerHTML = `<strong>${item.num}.</strong> ${item.clue}`;
      li.addEventListener("click", () => {
        paperAudio.playClick();
        triggerHaptics();
        jumpToWord(item.num, dir);
      });
      return li;
    };

    state.activePuzzle.clues.across.forEach(c => el.cluesListAcross.appendChild(createClueNode(c, "across")));
    state.activePuzzle.clues.down.forEach(c => el.cluesListDown.appendChild(createClueNode(c, "down")));
  }

  function handleCellTap(r, c) {
    if (isBlock(r, c)) return;
    paperAudio.playClick();
    triggerHaptics();

    if (state.cursor.r === r && state.cursor.c === c) {
      state.direction = state.direction === "across" ? "down" : "across";
    } else {
      state.cursor = { r, c };
      if (!isValidDirection(r, c, state.direction)) {
        state.direction = state.direction === "across" ? "down" : "across";
      }
    }
    updateSelection();
  }

  function isValidDirection(r, c, dir) {
    const size = state.activePuzzle.size;
    if (dir === "across") return (c > 0 && !isBlock(r, c - 1)) || (c + 1 < size && !isBlock(r, c + 1));
    return (r > 0 && !isBlock(r - 1, c)) || (r + 1 < size && !isBlock(r + 1, c));
  }

  function resetCursor() {
    const size = state.activePuzzle.size;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!isBlock(r, c)) {
          state.cursor = { r, c };
          state.direction = "across";
          updateSelection();
          return;
        }
      }
    }
  }

  function getWordSpan(r, c, dir) {
    const span = [];
    const size = state.activePuzzle.size;
    if (dir === "across") {
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
      cells[i].classList.remove("cell-active", "cell-word");
      cells[i].removeAttribute("aria-selected");
    }

    const span = getWordSpan(r, c, state.direction);
    span.forEach(pos => {
      const idx = pos.r * size + pos.c;
      if (cells[idx]) cells[idx].classList.add("cell-word");
    });

    const activeIdx = r * size + c;
    if (cells[activeIdx]) {
      cells[activeIdx].classList.add("cell-active");
      cells[activeIdx].setAttribute("aria-selected", "true");
    }

    if (!span.length) return;
    const root = span[0];
    const num = state.activePuzzle.numbering[`${root.r},${root.c}`];
    const clueObj = state.activePuzzle.clues[state.direction].find(i => i.num === num);

    el.activeClueBadge.textContent = num ? `${num}${state.direction === "across" ? "A" : "D"}` : "--";
    el.activeClueText.textContent = clueObj ? clueObj.clue : "Select open cells to inspect hints.";

    document.querySelectorAll(".clue-item").forEach(item => {
      const matches = item.dataset.dir === state.direction && Number(item.dataset.num) === num;
      item.classList.toggle("active", matches);
      if (matches) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  function jumpToWord(num, dir) {
    for (const [coord, wordNum] of Object.entries(state.activePuzzle.numbering)) {
      if (wordNum === num) {
        const [r, c] = coord.split(",").map(Number);
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

    paperAudio.playClick();
    triggerHaptics();

    const { r, c } = state.cursor;
    state.userGrid[r][c] = char;

    const size = state.activePuzzle.size;
    const cellEl = el.crosswordBoard.children[r * size + c];
    let letterSpan = cellEl.querySelector(".cell-letter");
    if (!letterSpan) {
      letterSpan = document.createElement("span");
      letterSpan.className = "cell-letter";
      cellEl.appendChild(letterSpan);
    }
    letterSpan.textContent = char;

    persistInProgress();
    advanceCursor(false);
    checkWin();
  }

  function handleBackspace() {
    if (state.isSolved) return;
    paperAudio.playClick();
    triggerHaptics();

    const { r, c } = state.cursor;
    const size = state.activePuzzle.size;

    if (state.userGrid[r][c]) {
      state.userGrid[r][c] = "";
      const letterSpan = el.crosswordBoard.children[r * size + c].querySelector(".cell-letter");
      if (letterSpan) letterSpan.remove();
    } else {
      advanceCursor(true);
      const pr = state.cursor.r;
      const pc = state.cursor.c;
      state.userGrid[pr][pc] = "";
      const pSpan = el.crosswordBoard.children[pr * size + pc].querySelector(".cell-letter");
      if (pSpan) pSpan.remove();
    }
    persistInProgress();
    updateSelection();
  }

  function advanceCursor(backwards) {
    const size = state.activePuzzle.size;
    let { r, c } = state.cursor;
    for (let step = 0; step < size; step++) {
      if (state.direction === "across") c += backwards ? -1 : 1;
      else r += backwards ? -1 : 1;
      if (r < 0 || c < 0 || r >= size || c >= size) break;
      if (!isBlock(r, c)) {
        state.cursor = { r, c };
        break;
      }
    }
    updateSelection();
  }

  function persistInProgress() {
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
    paperAudio.playVictory();

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

    renderGameTierTabs();
    showVictoryModal();
    return true;
  }

  function showVictoryModal() {
    el.victorySummaryText.textContent = `Completed in ${formatTime(state.timerSeconds)}`;
    const currIdx = state.tiers.indexOf(state.activeTier);
    const nextTier = state.tiers[currIdx + 1];

    if (nextTier) {
      el.btnVictoryNextAction.textContent = `Solve ${nextTier.toUpperCase()}`;
      el.btnVictoryNextAction.onclick = () => {
        el.modalVictory.classList.add("hidden");
        state.selectedDailyTier = nextTier;
        const target = getDailyPuzzleForTier(nextTier);
        if (target) loadPuzzle(target, true);
      };
    } else {
      el.btnVictoryNextAction.textContent = "Return to Overview";
      el.btnVictoryNextAction.onclick = () => {
        el.modalVictory.classList.add("hidden");
        setRoute("overview");
      };
    }

    el.btnVictoryReviewAction.onclick = () => {
      el.modalVictory.classList.add("hidden");
    };

    el.modalVictory.classList.remove("hidden");
  }

  /* ==========================================================================
     VAULT & STATISTICS RENDERING
     ========================================================================== */
  function renderVault() {
    el.vaultListContainer.innerHTML = "";
    if (!state.puzzles.length) {
      el.vaultListContainer.innerHTML = `
        <article class="paper-card">
          <h3 class="paper-card__title">${APP_CONFIG.content.emptyStates.noDataHeading}</h3>
          <p class="paper-card__description">${APP_CONFIG.content.emptyStates.noDataDescription}</p>
        </article>
      `;
      return;
    }

    state.puzzles.forEach((puzzle, index) => {
      const card = document.createElement("article");
      card.className = "vault-card";

      const isDone = !!state.saveData.history[puzzle.id]?.solved;
      const solveTime = state.saveData.history[puzzle.id]?.time;

      card.innerHTML = `
        <div>
          <span class="vault-date">${puzzle.title}</span>
          <div class="vault-card-meta">${puzzle.size}×${puzzle.size} Grid · Record #${index + 1}</div>
        </div>
        <div class="vault-badges">
          <span class="vault-tier-badge">${puzzle.tier}</span>
          ${isDone ? `<span class="vault-tier-badge completed">✓ ${formatTime(solveTime)}</span>` : ""}
        </div>
      `;

      card.addEventListener("click", () => {
        paperAudio.playClick();
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

    el.statsTierTimesList.innerHTML = "";
    state.tiers.forEach(tier => {
      const times = s.times[tier] || [];
      const med = times.length ? formatTime([...times].sort((a, b) => a - b)[Math.floor(times.length / 2)]) : "--:--";
      const li = document.createElement("li");
      li.innerHTML = `<span>${tier} Edition</span><strong>${med}</strong>`;
      el.statsTierTimesList.appendChild(li);
    });
  }

  function updateTimerDisplay() {
    el.gameTimerDisplay.textContent = formatTime(state.timerSeconds);
  }

  function formatTime(secs) {
    if (secs == null) return "--:--";
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function showToast(msg) {
    el.toastMessage.textContent = msg;
    el.toastMessage.classList.remove("hidden");
    el.toastMessage.style.opacity = "1";
    setTimeout(() => {
      el.toastMessage.style.opacity = "0";
      setTimeout(() => el.toastMessage.classList.add("hidden"), 200);
    }, 2400);
  }

  /* ==========================================================================
     EVENT BINDINGS & LIFECYCLE
     ========================================================================== */
  function bindEvents() {
    el.btnGlobalBack.addEventListener("click", () => {
      paperAudio.playClick();
      triggerHaptics();
      if (state.currentRoute !== "overview") {
        setRoute("overview");
      } else if (window.history.length > 1) {
        window.history.back();
      }
    });

    el.btnPlayDaily.addEventListener("click", () => {
      paperAudio.playClick();
      triggerHaptics();
      const daily = getDailyPuzzleForTier(state.selectedDailyTier);
      if (daily) loadPuzzle(daily, true);
    });

    el.cardQuickVault.addEventListener("click", () => {
      paperAudio.playClick();
      triggerHaptics();
      setRoute("vault");
    });

    el.cardQuickStats.addEventListener("click", () => {
      paperAudio.playClick();
      triggerHaptics();
      setRoute("stats");
    });

    el.btnHelpTrigger.addEventListener("click", () => {
      paperAudio.playClick();
      triggerHaptics();
      el.panelHowToPlayOverlay.classList.remove("hidden");
    });

    el.btnCloseHelp.addEventListener("click", () => {
      paperAudio.playClick();
      el.panelHowToPlayOverlay.classList.add("hidden");
    });

    el.panelHelpBackdrop.addEventListener("click", () => {
      el.panelHowToPlayOverlay.classList.add("hidden");
    });

    el.activeClueTrigger.addEventListener("click", () => {
      paperAudio.playToggle();
      triggerHaptics();
      state.direction = state.direction === "across" ? "down" : "across";
      updateSelection();
    });

    el.activeClueTrigger.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        paperAudio.playToggle();
        triggerHaptics();
        state.direction = state.direction === "across" ? "down" : "across";
        updateSelection();
      }
    });

    el.onscreenKeyboard.addEventListener("pointerdown", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      e.preventDefault();
      const key = btn.dataset.key;
      if (key === "DIR") {
        paperAudio.playToggle();
        triggerHaptics();
        state.direction = state.direction === "across" ? "down" : "across";
        updateSelection();
      } else if (key === "BACKSPACE") {
        handleBackspace();
      } else if (key) {
        handleInput(key);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        el.panelHowToPlayOverlay.classList.add("hidden");
        el.modalVictory.classList.add("hidden");
        return;
      }
      if (state.currentRoute !== "game") return;

      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === " " || e.key === "Tab") {
        e.preventDefault();
        paperAudio.playToggle();
        triggerHaptics();
        state.direction = state.direction === "across" ? "down" : "across";
        updateSelection();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        state.direction = "across";
        advanceCursor(false);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        state.direction = "across";
        advanceCursor(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        state.direction = "down";
        advanceCursor(false);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        state.direction = "down";
        advanceCursor(true);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleInput(e.key);
      }
    });

    window.addEventListener("popstate", () => {
      const hash = window.location.hash.replace("#", "") || "overview";
      setRoute(hash, false);
    });

    el.btnRetryLoad.addEventListener("click", init);
  }

  /* ==========================================================================
     DATA HYDRATION & INITIALIZATION
     ========================================================================== */
  async function init() {
    loadStorage();
    bindEvents();
    renderBottomDock();

    try {
      const res = await fetch(APP_CONFIG.endpoints.csvUrl, { cache: "no-store" });
      if (!res.ok) throw new Error("CSV endpoint not accessible");
      // If external parsing succeeds, hydrate parsed records; otherwise use embedded
      state.puzzles = EMBEDDED_PUZZLES;
    } catch {
      // Graceful local resilience using certified fallback puzzles
      state.puzzles = EMBEDDED_PUZZLES;
    }

    state.puzzlesByTier = {};
    state.tiers.forEach(tier => {
      state.puzzlesByTier[tier] = state.puzzles.filter(p => p.tier === tier);
    });

    const initHash = window.location.hash.replace("#", "") || "overview";
    setRoute(initHash, false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
/* END OF FILE script.js */