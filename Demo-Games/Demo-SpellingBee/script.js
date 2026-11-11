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
    appId: "artisanal-spelling-bee-suite",
    appName: "Spelling Bee",
    appTagline: "Artisanal Vocabulary Ledger & Daily Hive Challenge",
    version: "6.0.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
    currency: "USD",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    logoUrl: "./assets/brand-logo.svg",
    logoAlt: "Spelling Bee Artisanal Seal",
    faviconUrl: "./favicon.ico",
    appIconApple: "./apple-touch-icon.png",
    accentColor: "#6E5614",      // High-contrast Warm Ochre
    accentSecondary: "#3E5B42",  // High-contrast Sage Green
    accentHighlight: "#963E35",  // High-contrast Terracotta Red
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontFamilySerif: "Charter, 'Bitstream Charter', 'Sitka Text', Cambria, Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "menu",
    items: [
      { id: "menu", label: "Workspace", icon: "icon-overview", route: "#menu", enabled: true },
      { id: "game", label: "Hive", icon: "icon-hive", route: "#game", enabled: true },
      { id: "vault", label: "Vault", icon: "icon-vault", route: "#vault", enabled: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      defaultTitle: "Spelling Bee",
      defaultSubtitle: "Artisanal vocabulary challenge. Construct words with the daily hive stationery.",
      vaultTitle: "The Vault",
      vaultSubtitle: "Historical challenges. Browse, replay, or complete unfound words.",
    },
    emptyStates: {
      noDataHeading: "No Historical Hives Documented",
      noDataDescription: "The archive index is currently empty. Synchronize or load additional puzzles.",
      noSearchResultsHeading: "No Matching Honeycombs Found",
      noSearchResultsDescription: "Review your filter parameters and attempt the query again.",
    },
    actions: {
      confirm: "Confirm & Proceed",
      cancel: "Discard Changes",
      save: "Save Ledger Entry",
      delete: "Remove Permanently",
      retry: "Retry Operation",
      back: "Navigate Back",
    },
    notifications: {
      saveSuccess: "Progress committed to local ledger.",
      saveError: "Unable to commit changes. Verify storage quota.",
      streakProtected: "Streak Shield Activated! Sequence safeguarded.",
      copySuccess: "Daily ledger summary copied to clipboard.",
    },
    legal: {
      copyrightHolder: "Editorial Ledger Systems LLC",
      establishedYear: 2026,
    },
  },

  // 5. EXTERNAL LINKS, SUPPORT & SUITE
  support: {
    contactEmail: "",
    suiteUrl: "../../",
    socialLinks: {
      documentation: "",
    },
  },

  // 6. FEATURE SWITCHES & INTERACTION CONTROLS
  features: {
    enableHapticFeedback: true,        // Gentle 12ms navigator.vibrate()
    enableSmoothPageTransitions: true, // Kinetic transitions
    enableAutoSave: true,              // Automatic persistence
    autoSaveIntervalMs: 5000,
    enableDetailedDiagnostics: false,  // Telemetry logs
    enableAtmosphericLighting: true,   // Subtle top-down ambient lighting
  },

  // 7. API ENDPOINTS & STORAGE KEYS
  endpoints: {
    csvPath: "./puzzles.csv",
    dictionaryApiUrl: "https://api.dictionaryapi.dev/api/v2/entries/en/",
    storageKeys: {
      save: "artisanal_spelling_bee_save_v6",
      cachedPuzzles: "artisanal_spelling_bee_cached_puzzles_v3",
      draftPrefix: "artisanal_spelling_bee_draft_",
      settings: "artisanal_spelling_bee_settings_v2",
    },
  },

  // 8. DAILY CYCLE ANCHOR
  dailyCycle: {
    anchorDate: "2025-01-01",
    startIndex: 0,
    dateLocale: "en-US",
    dateOptions: {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  }
});

(function () {
  "use strict";

  const RANKS = [
    { name: "Beginner", pct: 0 },
    { name: "Good Start", pct: 0.03 },
    { name: "Moving Up", pct: 0.08 },
    { name: "Good", pct: 0.16 },
    { name: "Solid", pct: 0.26 },
    { name: "Nice", pct: 0.40 },
    { name: "Great", pct: 0.55 },
    { name: "Amazing", pct: 0.70 },
    { name: "Genius", pct: 0.85 },
    { name: "Queen Bee", pct: 1.00 }
  ];


  /* ==========================================================================
     CONTINUOUS DAILY PUZZLE CYCLE ENGINE
     ========================================================================== */
  class ContinuousDailyCycleEngine {
    constructor(anchorDateStr, startIndex = 0) {
      this.startIndex = startIndex;
      const parts = (anchorDateStr || "2025-01-01").split("-");
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      this.anchorMidnightEpoch = Date.UTC(y, m, d);
    }

    getLocalMidnightEpoch(targetDate = new Date()) {
      return Date.UTC(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate()
      );
    }

    getLocalDateString(targetDate = new Date()) {
      const y = targetDate.getFullYear();
      const m = String(targetDate.getMonth() + 1).padStart(2, "0");
      const d = String(targetDate.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    formatDisplayDate(targetDate = new Date()) {
      return targetDate.toLocaleDateString(
        APP_CONFIG.dailyCycle.dateLocale,
        APP_CONFIG.dailyCycle.dateOptions
      );
    }

    getPuzzleIndexForDate(totalPuzzles, targetDate = new Date()) {
      if (!totalPuzzles || totalPuzzles <= 0) return 0;
      const currentMidnight = this.getLocalMidnightEpoch(targetDate);
      const diffDays = Math.floor((currentMidnight - this.anchorMidnightEpoch) / 86400000);
      const rawIndex = (this.startIndex + diffDays) % totalPuzzles;
      return (rawIndex + totalPuzzles) % totalPuzzles;
    }
  }

  /* ==========================================================================
     SCORING & VALIDATION ENGINE
     ========================================================================== */
  class SpellingBeeEngine {
    static calculateWordScore(word, puzzle) {
      if (!word || !puzzle) return 0;
      const isPangram = puzzle.pangrams.includes(word);
      const base = word.length === 4 ? 1 : word.length;
      return base + (isPangram ? 7 : 0);
    }

    static calculateMaxScore(puzzle) {
      if (!puzzle || !puzzle.words) return 0;
      return puzzle.words.reduce((sum, w) => sum + this.calculateWordScore(w, puzzle), 0);
    }

    static calculateWordsScore(words, puzzle) {
      if (!words || !puzzle) return 0;
      return words.reduce((sum, w) => sum + this.calculateWordScore(w, puzzle), 0);
    }

    static getRank(score, maxScore) {
      const pct = maxScore > 0 ? score / maxScore : 0;
      let currentRank = RANKS[0];
      for (let i = RANKS.length - 1; i >= 0; i--) {
        if (pct >= RANKS[i].pct) {
          currentRank = RANKS[i];
          break;
        }
      }
      return currentRank;
    }

    static validateWord(rawWord, puzzle, foundWords) {
      const word = (rawWord || "").trim().toUpperCase();
      if (!word) return { valid: false, error: "Input empty" };

      if (word.length < 4) {
        return { valid: false, error: "Too short (min 4 letters)" };
      }

      if (!word.includes(puzzle.centerLetter)) {
        return { valid: false, error: "Missing center letter" };
      }

      const allowedLetters = new Set([puzzle.centerLetter, ...puzzle.outerLetters]);
      const invalidLetter = word.split("").find(ch => !allowedLetters.has(ch));
      if (invalidLetter) {
        return { valid: false, error: `Letter '${invalidLetter}' not in hive` };
      }

      if (foundWords.includes(word)) {
        return { valid: false, error: "Already recorded" };
      }

      if (!puzzle.words.includes(word)) {
        return { valid: false, error: "Not in authorized word list" };
      }

      const points = this.calculateWordScore(word, puzzle);
      const isPangram = puzzle.pangrams.includes(word);
      const isPerfectPangram = isPangram && word.length === 7;

      return {
        valid: true,
        word,
        points,
        isPangram,
        isPerfectPangram
      };
    }
  }

  /* ==========================================================================
     PRIMARY APPLICATION CONTROLLER
     ========================================================================== */
  class SpellingBeeApp {
    constructor() {
      this.cycleEngine = new ContinuousDailyCycleEngine(
        APP_CONFIG.dailyCycle.anchorDate,
        APP_CONFIG.dailyCycle.startIndex
      );

      this.puzzles = [...FALLBACK_PUZZLES];
      this.dailyPuzzle = null;
      this.activePuzzle = null;
      this.outerLetters = [];
      this.inputWord = "";
      this.foundWords = [];
      this.revealedMissedWords = [];
      this.score = 0;
      this.maxScore = 0;
      this.sortMode = "alpha";
      this.hintsMode = "remaining";
      this.vaultFilter = "all";
      this.lastFocusedElement = null;
      this.currentView = "menu";
      this.previousView = "menu";
      this.feedbackTimer = null;
      this.isSubmitting = false;
      this.deleteHoldTimer = null;
      this.lastObservedDateString = this.cycleEngine.getLocalDateString();

      this.storage = this.loadSafeStorage();
      this.settings = this.loadSettings();

      this.cacheDom();
      this.bindEvents();
      this.renderRankTicks();

      this.loadCachedPuzzles();
      this.init();
    }

    cacheDom() {
      this.dom = {
        appRoot: document.getElementById("appRoot"),
        srAnnouncer: document.getElementById("srAnnouncer"),

        menuView: document.getElementById("menuView"),
        gameView: document.getElementById("gameView"),
        vaultView: document.getElementById("vaultView"),
        offlineIndicator: document.getElementById("offlineIndicator"),

        menuDailyDate: document.getElementById("menuDailyDate"),
        menuDailyStatus: document.getElementById("menuDailyStatus"),
        menuDailyProgressFill: document.getElementById("menuDailyProgressFill"),
        btnPlayDaily: document.getElementById("btnPlayDaily"),
        btnPlayDailyText: document.getElementById("btnPlayDailyText"),
        btnOpenVault: document.getElementById("btnOpenVault"),
        menuVaultCount: document.getElementById("menuVaultCount"),
        btnOpenSettings: document.getElementById("btnOpenSettings"),
        btnOpenHowToPlay: document.getElementById("btnOpenHowToPlay"),

        btnMenuStats: document.getElementById("btnMenuStats"),
        btnMenuShare: document.getElementById("btnMenuShare"),

        howToOverlay: document.getElementById("howToOverlay"),
        howToBackdrop: document.getElementById("howToBackdrop"),
        howToPanel: document.getElementById("howToPanel"),
        btnHowToBack: document.getElementById("btnHowToBack"),

        modalSettings: document.getElementById("modalSettings"),
        btnToggleAnimation: document.getElementById("btnToggleAnimation"),
        btnToggleHaptics: document.getElementById("btnToggleHaptics"),

        btnGameBack: document.getElementById("btnGameBack"),
        btnGameBackLabel: document.getElementById("btnGameBackLabel"),
        gamePuzzleTitle: document.getElementById("gamePuzzleTitle"),
        btnGameHints: document.getElementById("btnGameHints"),
        btnGameRules: document.getElementById("btnGameRules"),
        btnGameShare: document.getElementById("btnGameShare"),
        btnGameStats: document.getElementById("btnGameStats"),
        rankStrip: document.querySelector(".rank-strip"),
        rankName: document.getElementById("rankName"),
        badgeQueenBee: document.getElementById("badgeQueenBee"),
        currentScore: document.getElementById("currentScore"),
        maxScore: document.getElementById("maxScore"),
        rankFill: document.getElementById("rankFill"),
        rankTicksLayer: document.getElementById("rankTicksLayer"),
        rankProgressBar: document.getElementById("rankProgressBar"),
        feedback: document.getElementById("feedback"),
        inputDisplay: document.getElementById("inputDisplay"),
        btnQuickClear: document.getElementById("btnQuickClear"),
        hiveBoard: document.getElementById("hiveBoard"),
        cellCenter: document.getElementById("cellCenter"),
        outerCells: [
          document.getElementById("cell-0"),
          document.getElementById("cell-1"),
          document.getElementById("cell-2"),
          document.getElementById("cell-3"),
          document.getElementById("cell-4"),
          document.getElementById("cell-5")
        ],
        btnDelete: document.getElementById("btnDelete"),
        btnShuffle: document.getElementById("btnShuffle"),
        btnEnter: document.getElementById("btnEnter"),
        foundToggle: document.getElementById("foundToggle"),
        foundToggleIcon: document.getElementById("foundToggleIcon"),
        foundListWrap: document.getElementById("foundListWrap"),
        foundList: document.getElementById("foundList"),
        foundCount: document.getElementById("foundCount"),
        btnSortAlpha: document.getElementById("btnSortAlpha"),
        btnSortRecent: document.getElementById("btnSortRecent"),
        btnVaultReveal: document.getElementById("btnVaultReveal"),

        btnVaultBack: document.getElementById("btnVaultBack"),
        vaultHeaderCount: document.getElementById("vaultHeaderCount"),
        vaultGrid: document.getElementById("vaultGrid"),
        vaultFilterBtns: document.querySelectorAll(".vault-filter-btn"),

        modalStats: document.getElementById("modalStats"),
        modalHints: document.getElementById("modalHints"),
        modalDefinition: document.getElementById("modalDefinition"),
        modalQueenBee: document.getElementById("modalQueenBee"),
        hintsSummary: document.getElementById("hintsSummary"),
        hintsTable: document.getElementById("hintsTable"),
        hintsTwoLetter: document.getElementById("hintsTwoLetter"),
        btnHintsModeRemaining: document.getElementById("btnHintsModeRemaining"),
        btnHintsModeTotal: document.getElementById("btnHintsModeTotal"),
        statPlayed: document.getElementById("statPlayed"),
        statWords: document.getElementById("statWords"),
        statPangrams: document.getElementById("statPangrams"),
        statPoints: document.getElementById("statPoints"),
        statCurrentStreak: document.getElementById("statCurrentStreak"),
        statMaxStreak: document.getElementById("statMaxStreak"),
        btnExportData: document.getElementById("btnExportData"),
        btnImportData: document.getElementById("btnImportData"),
        backupPayloadArea: document.getElementById("backupPayloadArea"),
        defWordTitle: document.getElementById("defWordTitle"),
        defMeta: document.getElementById("defMeta"),
        defMeaningText: document.getElementById("defMeaningText"),
        defExternalLink: document.getElementById("defExternalLink")
      };
    }

    bindEvents() {
      if (this.dom.btnPlayDaily) {
        this.dom.btnPlayDaily.addEventListener("click", () => {
          if (this.dailyPuzzle) {
            this.loadPuzzle(this.dailyPuzzle);
            this.switchView("game");
          }
        });
      }

      if (this.dom.btnOpenVault) {
        this.dom.btnOpenVault.addEventListener("click", () => {
          this.renderVault();
          this.switchView("vault");
        });
      }

      if (this.dom.btnOpenSettings) {
        this.dom.btnOpenSettings.addEventListener("click", () => {
          this.openModal(this.dom.modalSettings);
        });
      }

      if (this.dom.btnOpenHowToPlay) {
        this.dom.btnOpenHowToPlay.addEventListener("click", () => this.openHowToPlayPanel());
      }
      if (this.dom.btnGameRules) {
        this.dom.btnGameRules.addEventListener("click", () => this.openHowToPlayPanel());
      }
      if (this.dom.btnHowToBack) {
        this.dom.btnHowToBack.addEventListener("click", () => this.closeHowToPlayPanel());
      }
      if (this.dom.howToBackdrop) {
        this.dom.howToBackdrop.addEventListener("click", () => this.closeHowToPlayPanel());
      }

      if (this.dom.btnMenuStats) {
        this.dom.btnMenuStats.addEventListener("click", () => {
          this.renderStats();
          this.openModal(this.dom.modalStats);
        });
      }
      if (this.dom.btnMenuShare) {
        this.dom.btnMenuShare.addEventListener("click", () => this.shareProgress());
      }

      if (this.dom.btnToggleAnimation) {
        this.dom.btnToggleAnimation.addEventListener("click", () => {
          this.settings.bgAnimation = !this.settings.bgAnimation;
          this.saveSettings();
          this.updateSettingsUi();
          const atmo = document.querySelector(".paper-atmosphere");
          if (atmo) atmo.style.display = this.settings.bgAnimation ? "block" : "none";
        });
      }

      if (this.dom.btnToggleHaptics) {
        this.dom.btnToggleHaptics.addEventListener("click", () => {
          this.settings.haptics = !this.settings.haptics;
          this.saveSettings();
          this.updateSettingsUi();
          if (this.settings.haptics) this.triggerHaptic(20);
        });
      }

      if (this.dom.btnGameBack) {
        this.dom.btnGameBack.addEventListener("click", () => {
          this.switchView(this.previousView === "vault" ? "vault" : "menu");
        });
      }
      if (this.dom.btnVaultBack) {
        this.dom.btnVaultBack.addEventListener("click", () => {
          this.switchView("menu");
        });
      }

      if (this.dom.vaultFilterBtns) {
        this.dom.vaultFilterBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            this.dom.vaultFilterBtns.forEach(b => b.classList.remove("filter-chip--active"));
            btn.classList.add("filter-chip--active");
            this.vaultFilter = btn.getAttribute("data-filter") || "all";
            this.renderVault();
          });
        });
      }

      if (this.dom.vaultGrid) {
        this.dom.vaultGrid.addEventListener("click", (e) => {
          const card = e.target.closest(".vault-card");
          if (!card) return;
          const id = card.getAttribute("data-id");
          const puzzle = this.puzzles.find(p => p.id === id);
          if (puzzle) {
            this.loadPuzzle(puzzle);
            this.switchView("game");
          }
        });
        this.dom.vaultGrid.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            const card = e.target.closest(".vault-card");
            if (card) {
              e.preventDefault();
              card.click();
            }
          }
        });
      }

      if (this.dom.btnSortAlpha) {
        this.dom.btnSortAlpha.addEventListener("click", () => {
          this.sortMode = "alpha";
          this.dom.btnSortAlpha.classList.add("filter-chip--active");
          this.dom.btnSortRecent.classList.remove("filter-chip--active");
          this.renderFoundList();
        });
      }
      if (this.dom.btnSortRecent) {
        this.dom.btnSortRecent.addEventListener("click", () => {
          this.sortMode = "recent";
          this.dom.btnSortRecent.classList.add("filter-chip--active");
          this.dom.btnSortAlpha.classList.remove("filter-chip--active");
          this.renderFoundList();
        });
      }

      if (this.dom.foundList) {
        this.dom.foundList.addEventListener("click", (e) => {
          const item = e.target.closest(".found-item");
          if (item) {
            const word = item.getAttribute("data-word");
            if (word) this.openWordDefinition(word);
          }
        });
      }

      if (this.dom.btnVaultReveal) {
        this.dom.btnVaultReveal.addEventListener("click", () => {
          if (!this.activePuzzle) return;
          if (confirm("Reveal all remaining unfound words for this historical puzzle?")) {
            const unfound = this.activePuzzle.words.filter(w => !this.foundWords.includes(w));
            this.revealedMissedWords = unfound;
            this.renderFoundList();
            this.dom.btnVaultReveal.hidden = true;
          }
        });
      }

      if (this.dom.btnHintsModeRemaining) {
        this.dom.btnHintsModeRemaining.addEventListener("click", () => {
          this.hintsMode = "remaining";
          this.dom.btnHintsModeRemaining.classList.add("filter-chip--active");
          this.dom.btnHintsModeTotal.classList.remove("filter-chip--active");
          this.renderHints();
        });
      }
      if (this.dom.btnHintsModeTotal) {
        this.dom.btnHintsModeTotal.addEventListener("click", () => {
          this.hintsMode = "total";
          this.dom.btnHintsModeTotal.classList.add("filter-chip--active");
          this.dom.btnHintsModeRemaining.classList.remove("filter-chip--active");
          this.renderHints();
        });
      }

      if (this.dom.btnGameStats) {
        this.dom.btnGameStats.addEventListener("click", () => {
          this.renderStats();
          this.openModal(this.dom.modalStats);
        });
      }
      if (this.dom.btnGameHints) {
        this.dom.btnGameHints.addEventListener("click", () => {
          this.renderHints();
          this.openModal(this.dom.modalHints);
        });
      }
      if (this.dom.btnGameShare) {
        this.dom.btnGameShare.addEventListener("click", () => this.shareProgress());
      }

      if (this.dom.btnExportData) this.dom.btnExportData.addEventListener("click", () => this.exportBackupData());
      if (this.dom.btnImportData) this.dom.btnImportData.addEventListener("click", () => this.importBackupData());

      document.querySelectorAll("[data-close]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-close");
          const target = document.getElementById(id);
          if (target) this.closeModal(target);
        });
      });

      window.addEventListener("click", e => {
        if (e.target.classList.contains("modal-backdrop")) {
          this.closeModal(e.target);
        }
      });

      if (this.dom.foundToggle) {
        this.dom.foundToggle.addEventListener("click", () => {
          const isHidden = this.dom.foundListWrap.hidden;
          this.dom.foundListWrap.hidden = !isHidden;
          this.dom.foundToggle.setAttribute("aria-expanded", String(isHidden));
          if (this.dom.foundToggleIcon) {
            this.dom.foundToggleIcon.textContent = isHidden ? "▲" : "▼";
          }
        });
      }

      if (this.dom.cellCenter) {
        this.dom.cellCenter.addEventListener("click", () => {
          if (this.activePuzzle) {
            this.triggerHaptic(14);
            this.addLetter(this.activePuzzle.centerLetter);
          }
        });
      }

      this.dom.outerCells.forEach(cell => {
        if (cell) {
          cell.addEventListener("click", () => {
            const letter = cell.getAttribute("data-letter");
            if (letter) {
              this.triggerHaptic(12);
              this.addLetter(letter);
            }
          });
        }
      });

      if (this.dom.btnQuickClear) {
        this.dom.btnQuickClear.addEventListener("click", () => {
          this.triggerHaptic(15);
          this.clearInput();
        });
      }

      if (this.dom.btnDelete) {
        const startHold = () => {
          this.deleteHoldTimer = setTimeout(() => {
            this.triggerHaptic(30);
            this.clearInput();
            this.deleteHoldTimer = null;
          }, 450);
        };
        const endHold = () => {
          if (this.deleteHoldTimer) {
            clearTimeout(this.deleteHoldTimer);
            this.deleteHoldTimer = null;
          }
        };

        this.dom.btnDelete.addEventListener("mousedown", startHold);
        this.dom.btnDelete.addEventListener("touchstart", startHold, { passive: true });
        this.dom.btnDelete.addEventListener("mouseup", endHold);
        this.dom.btnDelete.addEventListener("mouseleave", endHold);
        this.dom.btnDelete.addEventListener("touchend", endHold);

        this.dom.btnDelete.addEventListener("click", () => {
          this.triggerHaptic(8);
          this.deleteLetter();
        });
      }

      if (this.dom.btnShuffle) {
        this.dom.btnShuffle.addEventListener("click", () => {
          this.triggerHaptic(16);
          this.shuffleLetters();
        });
      }

      if (this.dom.btnEnter) {
        this.dom.btnEnter.addEventListener("click", () => this.submitWord());
      }

      if (this.dom.hiveBoard) {
        this.dom.hiveBoard.addEventListener("keydown", (e) => this.handleHiveSpatialNav(e));
      }

      window.addEventListener("keydown", e => {
        const activeOverlay = !this.dom.howToOverlay.hidden;
        if (e.key === "Escape") {
          if (activeOverlay) {
            this.closeHowToPlayPanel();
            return;
          }
          const activeModal = document.querySelector(".modal-backdrop:not([hidden])");
          if (activeModal) {
            this.closeModal(activeModal);
            return;
          }
        }

        const activeModal = document.querySelector(".modal-backdrop:not([hidden])");
        if (activeModal || activeOverlay) return;

        if (this.currentView !== "game" || !this.activePuzzle) return;
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
          e.preventDefault();
          this.handleKeyStroke(key);
        } else if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          this.deleteLetter();
        } else if (e.key === "Enter") {
          e.preventDefault();
          this.submitWord();
        } else if (e.key === " " || e.key === "/") {
          e.preventDefault();
          this.shuffleLetters();
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.checkDayRollover();
        }
      });

      window.addEventListener("focus", () => {
        this.checkDayRollover();
      });

      setInterval(() => {
        this.checkDayRollover();
      }, 30000);
    }

    checkDayRollover() {
      const todayStr = this.cycleEngine.getLocalDateString();
      if (todayStr !== this.lastObservedDateString) {
        this.lastObservedDateString = todayStr;
        this.determineDailyPuzzle();
        this.updateMenuDashboard();

        if (this.currentView === "vault") {
          this.renderVault();
        } else if (this.currentView === "game" && this.activePuzzle) {
          const isDaily = this.dailyPuzzle && this.dailyPuzzle.id === this.activePuzzle.id;
          if (isDaily && this.dom.gamePuzzleTitle) {
            this.dom.gamePuzzleTitle.textContent = `Daily Challenge • ${this.cycleEngine.formatDisplayDate()}`;
          }
        }
      }
    }

    triggerHaptic(ms = 12) {
      if (!this.settings.haptics || !APP_CONFIG.features.enableHapticFeedback) return;
      if ("vibrate" in navigator) {
        try { navigator.vibrate(ms); } catch (e) {}
      }
    }

    openHowToPlayPanel() {
      if (!this.dom.howToOverlay) return;
      this.lastFocusedElement = document.activeElement;
      this.dom.howToOverlay.hidden = false;
      this.dom.howToOverlay.setAttribute("aria-hidden", "false");

      void this.dom.howToPanel.offsetWidth;
      this.dom.howToOverlay.classList.add("open");

      if (this.dom.btnHowToBack) this.dom.btnHowToBack.focus();
    }

    closeHowToPlayPanel() {
      if (!this.dom.howToOverlay) return;
      this.dom.howToOverlay.classList.remove("open");

      setTimeout(() => {
        this.dom.howToOverlay.hidden = true;
        this.dom.howToOverlay.setAttribute("aria-hidden", "true");
        if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
          this.lastFocusedElement.focus();
        }
      }, 350);
    }

    updateSettingsUi() {
      if (this.dom.btnToggleAnimation) {
        const on = this.settings.bgAnimation;
        this.dom.btnToggleAnimation.setAttribute("aria-checked", String(on));
        const txt = this.dom.btnToggleAnimation.querySelector(".toggle-state-text");
        if (txt) txt.textContent = on ? "ON" : "OFF";
      }
      if (this.dom.btnToggleHaptics) {
        const on = this.settings.haptics;
        this.dom.btnToggleHaptics.setAttribute("aria-checked", String(on));
        const txt = this.dom.btnToggleHaptics.querySelector(".toggle-state-text");
        if (txt) txt.textContent = on ? "ON" : "OFF";
      }
    }

    async init() {
      this.updateSettingsUi();

      try {
        const res = await fetch(APP_CONFIG.endpoints.csvPath, { cache: "no-store" });
        if (!res.ok) throw new Error("Network response invalid");
        const text = await res.text();
        const parsed = this.parseCSV(text);
        if (parsed.length > 0) {
          this.puzzles = parsed;
          this.cachePuzzlesLocally(parsed);
          if (this.dom.offlineIndicator) this.dom.offlineIndicator.hidden = true;
        }
      } catch (err) {
        if (this.dom.offlineIndicator) this.dom.offlineIndicator.hidden = false;
      }

      this.determineDailyPuzzle();
      this.updateMenuDashboard();
    }

    cachePuzzlesLocally(puzzles) {
      try {
        localStorage.setItem(APP_CONFIG.endpoints.storageKeys.cachedPuzzles, JSON.stringify(puzzles));
      } catch (e) {}
    }

    loadCachedPuzzles() {
      try {
        const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.cachedPuzzles);
        if (raw) {
          const cached = JSON.parse(raw);
          if (Array.isArray(cached) && cached.length > 0) {
            this.puzzles = cached;
          }
        }
      } catch (e) {}
    }

    determineDailyPuzzle() {
      if (!this.puzzles || this.puzzles.length === 0) {
        this.dailyPuzzle = null;
        return;
      }
      const index = this.cycleEngine.getPuzzleIndexForDate(this.puzzles.length);
      this.dailyPuzzle = this.puzzles[index];
    }

    updateMenuDashboard() {
      if (this.dom.menuDailyDate) {
        this.dom.menuDailyDate.textContent = this.cycleEngine.formatDisplayDate();
      }

      if (!this.dailyPuzzle) return;

      const progress = this.storage.puzzles[this.dailyPuzzle.id] || { foundWords: [] };
      const max = SpellingBeeEngine.calculateMaxScore(this.dailyPuzzle);
      const score = SpellingBeeEngine.calculateWordsScore(progress.foundWords, this.dailyPuzzle);
      const pct = max > 0 ? Math.min(100, Math.round((score / max) * 100)) : 0;
      const rank = SpellingBeeEngine.getRank(score, max);

      if (this.dom.menuDailyStatus) {
        const qbNotice = rank.name === "Queen Bee" ? " 👑" : "";
        this.dom.menuDailyStatus.textContent = `${rank.name}${qbNotice} • ${progress.foundWords.length} words (${score} pts)`;
      }
      if (this.dom.menuDailyProgressFill) {
        this.dom.menuDailyProgressFill.style.width = `${pct}%`;
      }

      const totalVault = this.puzzles.length;
      if (this.dom.menuVaultCount) {
        this.dom.menuVaultCount.textContent = `${totalVault}`;
      }

      if (this.dom.btnPlayDailyText) {
        this.dom.btnPlayDailyText.textContent = progress.foundWords.length > 0 ? "Continue Daily Hive" : "Open Daily Hive";
      }
    }

    switchView(targetView) {
      this.previousView = this.currentView;
      this.currentView = targetView;

      if (this.dom.menuView) this.dom.menuView.hidden = targetView !== "menu";
      if (this.dom.gameView) this.dom.gameView.hidden = targetView !== "game";
      if (this.dom.vaultView) this.dom.vaultView.hidden = targetView !== "vault";

      if (targetView === "game") {
        if (this.dom.btnGameBackLabel) {
          const backLabel = this.previousView === "vault" ? "Vault" : "Menu";
          this.dom.btnGameBackLabel.textContent = backLabel;
          this.dom.btnGameBack.setAttribute("aria-label", `Back to ${backLabel}`);
        }
      } else if (targetView === "menu") {
        this.updateMenuDashboard();
      } else if (targetView === "vault") {
        this.renderVault();
      }
      window.scrollTo(0, 0);
    }

    parseCSV(text) {
      const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
      if (lines.length < 2) return [];

      const headerParts = lines[0].split(",").map(s => s.trim().toLowerCase());
      let centerIdx = -1;
      let outerIdx = -1;
      let wordsIdx = -1;

      headerParts.forEach((header, idx) => {
        if (header.includes("center")) centerIdx = idx;
        else if (header.includes("outer")) outerIdx = idx;
        else if (header.includes("word")) wordsIdx = idx;
      });

      if (centerIdx === -1 || outerIdx === -1 || wordsIdx === -1) {
        centerIdx = 1;
        outerIdx = 2;
        wordsIdx = 3;
      }

      const puzzles = [];
      let puzzleCounter = 1;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(",");
        if (parts.length <= Math.max(centerIdx, outerIdx, wordsIdx)) continue;

        const centerLetter = (parts[centerIdx] || "").trim().toUpperCase();
        const outerLetters = (parts[outerIdx] || "").trim().toUpperCase().replace(/[^A-Z]/g, "").split("");

        if (outerLetters.length !== 6 || centerLetter.length !== 1) continue;

        const validLetters = new Set([centerLetter, ...outerLetters]);
        if (validLetters.size !== 7) continue;

        const rawWords = parts.slice(wordsIdx).join(",").replace(/["\r]/g, "").trim().toUpperCase().split(/[\s,]+/).filter(Boolean);
        const words = [...new Set(rawWords.filter(w => {
          if (w.length < 4) return false;
          if (!w.includes(centerLetter)) return false;
          return w.split("").every(ch => validLetters.has(ch));
        }))];

        if (words.length === 0) continue;

        const pangrams = words.filter(w => {
          const unique = new Set(w.split(""));
          return [centerLetter, ...outerLetters].every(c => unique.has(c));
        });

        puzzles.push({
          id: `hive_${centerLetter}_${outerLetters.join("")}_${puzzleCounter}`,
          puzzleNumber: puzzleCounter,
          centerLetter,
          outerLetters,
          words,
          pangrams
        });

        puzzleCounter++;
      }

      return puzzles;
    }

    loadPuzzle(puzzle) {
      if (!puzzle) return;

      this.activePuzzle = puzzle;
      this.outerLetters = [...puzzle.outerLetters];
      this.revealedMissedWords = [];

      const progress = this.storage.puzzles[puzzle.id] || { foundWords: [] };
      const validSet = new Set(puzzle.words);
      this.foundWords = [...new Set((progress.foundWords || []).filter(w => validSet.has(w)))];

      if (this.foundWords.length !== (progress.foundWords || []).length) {
        this.saveProgress();
      }

      this.maxScore = SpellingBeeEngine.calculateMaxScore(puzzle);
      this.score = SpellingBeeEngine.calculateWordsScore(this.foundWords, puzzle);

      const draft = sessionStorage.getItem(APP_CONFIG.endpoints.storageKeys.draftPrefix + puzzle.id);
      this.inputWord = draft || "";

      const isDaily = this.dailyPuzzle && this.dailyPuzzle.id === puzzle.id;
      if (this.dom.gamePuzzleTitle) {
        this.dom.gamePuzzleTitle.textContent = isDaily
          ? `Daily Challenge • ${this.cycleEngine.formatDisplayDate()}`
          : `Hive #${puzzle.puzzleNumber}`;
      }

      if (this.dom.btnVaultReveal) {
        this.dom.btnVaultReveal.hidden = isDaily || (this.foundWords.length === puzzle.words.length);
      }

      if (this.dom.foundListWrap) this.dom.foundListWrap.hidden = true;
      if (this.dom.foundToggle) this.dom.foundToggle.setAttribute("aria-expanded", "false");
      if (this.dom.foundToggleIcon) this.dom.foundToggleIcon.textContent = "▼";

      if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
      if (this.dom.feedback) {
        this.dom.feedback.textContent = "";
        this.dom.feedback.className = "feedback";
      }

      this.renderHive();
      this.renderInput();
      this.renderRank();
      this.renderFoundList();
    }

    renderRankTicks() {
      if (!this.dom.rankTicksLayer) return;
      this.dom.rankTicksLayer.innerHTML = "";
      RANKS.forEach(rank => {
        if (rank.pct > 0 && rank.pct < 1) {
          const tick = document.createElement("div");
          tick.className = "rank-tick";
          tick.style.left = `${rank.pct * 100}%`;
          tick.setAttribute("data-rank-pct", rank.pct);
          this.dom.rankTicksLayer.appendChild(tick);
        }
      });
    }

    renderHive() {
      if (!this.activePuzzle) return;

      if (this.dom.cellCenter) {
        const svgText = this.dom.cellCenter.querySelector(".hex-svg-letter");
        if (svgText) svgText.textContent = this.activePuzzle.centerLetter;
        this.dom.cellCenter.setAttribute("data-letter", this.activePuzzle.centerLetter);
        this.dom.cellCenter.setAttribute("aria-label", `Required center letter ${this.activePuzzle.centerLetter}`);
      }

      this.dom.outerCells.forEach((cell, idx) => {
        if (!cell) return;
        const letter = this.outerLetters[idx] || "";
        const svgText = cell.querySelector(".hex-svg-letter");
        if (svgText) svgText.textContent = letter;
        cell.setAttribute("data-letter", letter);
        cell.setAttribute("aria-label", `Outer letter ${letter}`);
      });
    }

    renderInput() {
      if (!this.dom.inputDisplay) return;
      this.dom.inputDisplay.innerHTML = "";
      for (const ch of this.inputWord) {
        const span = document.createElement("span");
        span.textContent = ch;
        if (this.activePuzzle && ch === this.activePuzzle.centerLetter) {
          span.classList.add("center-ch");
        }
        this.dom.inputDisplay.appendChild(span);
      }
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      cursor.setAttribute("aria-hidden", "true");
      this.dom.inputDisplay.appendChild(cursor);

      if (this.dom.btnQuickClear) {
        this.dom.btnQuickClear.hidden = this.inputWord.length === 0;
      }
    }

    handleKeyStroke(letter) {
      if (!this.activePuzzle) return;
      const valid = [this.activePuzzle.centerLetter, ...this.activePuzzle.outerLetters];
      if (!valid.includes(letter)) {
        this.shakeInput();
        return;
      }
      this.addLetter(letter);
    }

    addLetter(letter) {
      if (!this.activePuzzle || this.inputWord.length >= 19) return;
      this.inputWord += letter;
      this.renderInput();
      this.persistDraftInput();
    }

    deleteLetter() {
      if (!this.inputWord) return;
      this.inputWord = this.inputWord.slice(0, -1);
      this.renderInput();
      this.persistDraftInput();
    }

    clearInput() {
      if (!this.inputWord) return;
      this.inputWord = "";
      this.renderInput();
      this.persistDraftInput();
    }

    persistDraftInput() {
      if (!this.activePuzzle) return;
      try {
        sessionStorage.setItem(APP_CONFIG.endpoints.storageKeys.draftPrefix + this.activePuzzle.id, this.inputWord);
      } catch (e) {}
    }

    shuffleLetters() {
      this.dom.outerCells.forEach(cell => {
        if (!cell) return;
        cell.classList.remove("shuffling");
        void cell.offsetWidth;
        cell.classList.add("shuffling");
      });

      const initial = this.outerLetters.join("");
      let attempts = 0;
      do {
        for (let i = this.outerLetters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.outerLetters[i], this.outerLetters[j]] = [this.outerLetters[j], this.outerLetters[i]];
        }
        attempts++;
      } while (this.outerLetters.join("") === initial && attempts < 10);

      this.renderHive();
      this.announceScreenReader("Hive outer letters shuffled");
    }

    submitWord() {
      if (!this.activePuzzle || this.isSubmitting) return;
      this.isSubmitting = true;

      const result = SpellingBeeEngine.validateWord(
        this.inputWord,
        this.activePuzzle,
        this.foundWords
      );

      if (!result.valid) {
        this.showFeedback(result.error, "error");
        this.shakeInput();
        this.announceScreenReader(`Word rejected: ${result.error}`);
        setTimeout(() => { this.isSubmitting = false; }, 180);
        return;
      }

      const { word, points, isPangram, isPerfectPangram } = result;
      const prevRank = SpellingBeeEngine.getRank(this.score, this.maxScore);

      this.foundWords.push(word);
      this.score += points;
      this.inputWord = "";
      this.persistDraftInput();

      this.saveProgress();
      this.updateStreakIfNeeded();

      let feedbackMsg = `+${points} points`;
      let feedbackType = "success";

      if (isPerfectPangram) {
        feedbackMsg = `Perfect Pangram! +${points} pts`;
        feedbackType = "perfect-pangram";
      } else if (isPangram) {
        feedbackMsg = `Pangram! +${points} pts`;
        feedbackType = "pangram";
      }

      this.showFeedback(feedbackMsg, feedbackType);
      this.renderInput();
      this.renderRank();
      this.renderFoundList(word);

      const newRank = SpellingBeeEngine.getRank(this.score, this.maxScore);
      if (newRank.name !== prevRank.name && this.dom.rankStrip) {
        if (newRank.name !== "Queen Bee") {
          setTimeout(() => {
            this.showFeedback(`Rank Up: ${newRank.name}!`, "success");
          }, 1100);
        }
      }

      this.announceScreenReader(`Accepted: ${word}. Plus ${points} points. Total: ${this.score} points, ${newRank.name}.`);

      if (this.score >= this.maxScore && this.maxScore > 0) {
        setTimeout(() => this.openModal(this.dom.modalQueenBee), 500);
      }

      setTimeout(() => { this.isSubmitting = false; }, 200);
    }

    shakeInput() {
      if (this.dom.inputDisplay) {
        this.dom.inputDisplay.classList.remove("shake");
        void this.dom.inputDisplay.offsetWidth;
        this.dom.inputDisplay.classList.add("shake");
      }
    }

    renderRank() {
      const rank = SpellingBeeEngine.getRank(this.score, this.maxScore);
      const pct = this.maxScore > 0 ? Math.min(100, Math.round((this.score / this.maxScore) * 100)) : 0;

      if (this.dom.rankName) this.dom.rankName.textContent = rank.name;
      if (this.dom.currentScore) this.dom.currentScore.textContent = this.score;
      if (this.dom.maxScore) this.dom.maxScore.textContent = this.maxScore;
      if (this.dom.rankFill) this.dom.rankFill.style.width = `${pct}%`;

      if (this.dom.rankTicksLayer) {
        const ticks = this.dom.rankTicksLayer.querySelectorAll(".rank-tick");
        ticks.forEach(tick => {
          const tPct = parseFloat(tick.getAttribute("data-rank-pct") || "0") * 100;
          if (pct >= tPct) {
            tick.classList.add("passed");
          } else {
            tick.classList.remove("passed");
          }
        });
      }

      if (this.dom.badgeQueenBee) {
        this.dom.badgeQueenBee.hidden = rank.name !== "Queen Bee";
      }

      if (this.dom.rankProgressBar) {
        this.dom.rankProgressBar.setAttribute("aria-valuenow", pct);
        this.dom.rankProgressBar.setAttribute("aria-valuetext", `${rank.name}, ${this.score} of ${this.maxScore} points`);
      }
    }

    renderFoundList(recentlyAddedWord = null) {
      if (this.dom.foundCount) this.dom.foundCount.textContent = this.foundWords.length;
      if (!this.dom.foundList) return;

      this.dom.foundList.innerHTML = "";

      if (this.foundWords.length === 0 && this.revealedMissedWords.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-found-msg";
        empty.textContent = "No words recorded in this ledger yet.";
        this.dom.foundList.appendChild(empty);
        return;
      }

      const displayList = this.sortMode === "recent"
        ? [...this.foundWords].reverse()
        : [...this.foundWords].sort();

      displayList.forEach(w => {
        const item = document.createElement("span");
        item.className = "found-item interactive-tactile";
        item.setAttribute("data-word", w);
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");

        const isPangram = this.activePuzzle && this.activePuzzle.pangrams.includes(w);
        const isPerfect = isPangram && w.length === 7;

        if (isPerfect) {
          item.classList.add("is-perfect-pangram");
          item.setAttribute("title", `${w}: Perfect Pangram (Tap for dictionary definition)`);
        } else if (isPangram) {
          item.classList.add("is-pangram");
          item.setAttribute("title", `${w}: Pangram (Tap for dictionary definition)`);
        } else {
          item.setAttribute("title", `${w} (Tap for dictionary definition)`);
        }

        item.textContent = w;
        this.dom.foundList.appendChild(item);
      });

      if (this.revealedMissedWords.length > 0) {
        this.revealedMissedWords.sort().forEach(w => {
          const item = document.createElement("span");
          item.className = "found-item is-revealed-missed interactive-tactile";
          item.setAttribute("data-word", w);
          item.setAttribute("role", "button");
          item.setAttribute("tabindex", "0");
          item.setAttribute("title", `${w} (Missed word - Tap for meaning)`);
          item.textContent = w + " ✕";
          this.dom.foundList.appendChild(item);
        });
      }
    }

    showFeedback(message, type) {
      if (!this.dom.feedback) return;
      clearTimeout(this.feedbackTimer);

      this.dom.feedback.textContent = message;
      this.dom.feedback.className = `feedback ${type} active`;

      this.feedbackTimer = setTimeout(() => {
        if (this.dom.feedback) {
          this.dom.feedback.classList.remove("active");
        }
      }, 1600);
    }

    announceScreenReader(message) {
      if (this.dom.srAnnouncer) {
        this.dom.srAnnouncer.textContent = message;
      }
    }

    async openWordDefinition(word) {
      if (!this.dom.modalDefinition) return;
      if (this.dom.defWordTitle) this.dom.defWordTitle.textContent = word;
      if (this.dom.defMeta) this.dom.defMeta.textContent = "Querying dictionary ledger...";
      if (this.dom.defMeaningText) this.dom.defMeaningText.textContent = "Please wait...";
      if (this.dom.defExternalLink) {
        this.dom.defExternalLink.setAttribute("href", `https://en.wiktionary.org/wiki/${encodeURIComponent(word.toLowerCase())}`);
      }

      this.openModal(this.dom.modalDefinition);

      try {
        const res = await fetch(`${APP_CONFIG.endpoints.dictionaryApiUrl}${encodeURIComponent(word.toLowerCase())}`);
        if (!res.ok) throw new Error("No definition found");
        const data = await res.json();
        const entry = data[0];
        const part = entry?.meanings?.[0]?.partOfSpeech || "vocabulary term";
        const def = entry?.meanings?.[0]?.definitions?.[0]?.definition || "Definition available on Wiktionary.";

        if (this.dom.defMeta) this.dom.defMeta.textContent = `Grammar: ${part}`;
        if (this.dom.defMeaningText) this.dom.defMeaningText.textContent = def;
      } catch (err) {
        if (this.dom.defMeta) this.dom.defMeta.textContent = "Dictionary lookup unavailable";
        if (this.dom.defMeaningText) {
          this.dom.defMeaningText.textContent = `"${word}" is an authorized solution in this puzzle ledger. You can inspect full etymology and usage citations on Wiktionary.`;
        }
      }
    }

    renderHints() {
      if (!this.activePuzzle) return;
      const puzzle = this.activePuzzle;
      const remaining = puzzle.words.filter(w => !this.foundWords.includes(w));
      const pangramCount = puzzle.pangrams.length;
      const pangramsFound = this.foundWords.filter(w => puzzle.pangrams.includes(w)).length;

      if (this.dom.hintsSummary) {
        this.dom.hintsSummary.innerHTML = `
          <strong>Total Words:</strong> ${puzzle.words.length} (${this.foundWords.length} found, ${remaining.length} remaining)<br>
          <strong>Total Points:</strong> ${this.maxScore} (${this.score} currently documented)<br>
          <strong>Pangrams:</strong> ${pangramCount} (${pangramsFound} found)
        `;
      }

      const activeWordList = this.hintsMode === "remaining" ? remaining : puzzle.words;
      const lengths = [...new Set(puzzle.words.map(w => w.length))].sort((a, b) => a - b);
      const letters = [puzzle.centerLetter, ...puzzle.outerLetters].sort();

      let tableHtml = `<thead><tr><th></th>`;
      lengths.forEach(l => { tableHtml += `<th>${l}</th>`; });
      tableHtml += `<th>Total</th></tr></thead><tbody>`;

      const colTotals = {};
      lengths.forEach(l => colTotals[l] = 0);
      let grandTotal = 0;

      letters.forEach(ltr => {
        const wordsForLtr = activeWordList.filter(w => w.startsWith(ltr));
        tableHtml += `<tr><th>${ltr}</th>`;
        let rowSum = 0;
        lengths.forEach(len => {
          const count = wordsForLtr.filter(w => w.length === len).length;
          const isComplete = this.hintsMode === "remaining" && count === 0;
          tableHtml += `<td class="${isComplete ? "cell-complete" : ""}">${count > 0 ? count : (isComplete ? "✓" : "-")}</td>`;
          colTotals[len] += count;
          rowSum += count;
        });
        tableHtml += `<td><strong>${rowSum}</strong></td></tr>`;
        grandTotal += rowSum;
      });

      tableHtml += `<tr class="total-row"><th>Total</th>`;
      lengths.forEach(len => {
        tableHtml += `<td>${colTotals[len]}</td>`;
      });
      tableHtml += `<td>${grandTotal}</td></tr></tbody>`;

      if (this.dom.hintsTable) {
        this.dom.hintsTable.innerHTML = tableHtml;
      }

      const prefixMap = {};
      const remainingPrefixMap = {};

      puzzle.words.forEach(w => {
        const pref = w.slice(0, 2);
        prefixMap[pref] = (prefixMap[pref] || 0) + 1;
      });

      remaining.forEach(w => {
        const pref = w.slice(0, 2);
        remainingPrefixMap[pref] = (remainingPrefixMap[pref] || 0) + 1;
      });

      if (this.dom.hintsTwoLetter) {
        this.dom.hintsTwoLetter.innerHTML = Object.entries(prefixMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([pref, cnt]) => {
            const remCnt = remainingPrefixMap[pref] || 0;
            const isDone = remCnt === 0;
            const displayCount = this.hintsMode === "remaining" ? remCnt : cnt;
            return `<span class="two-letter-chip ${isDone ? "chip-done" : ""}">${pref}-${displayCount}</span>`;
          })
          .join("");
      }
    }

    renderVault() {
      if (!this.dom.vaultGrid) return;
      this.dom.vaultGrid.innerHTML = "";

      let vaultPuzzles = [...this.puzzles];

      if (this.vaultFilter === "unplayed") {
        vaultPuzzles = vaultPuzzles.filter(p => !(this.storage.puzzles[p.id]?.foundWords?.length > 0));
      } else if (this.vaultFilter === "inprogress") {
        vaultPuzzles = vaultPuzzles.filter(p => {
          const count = this.storage.puzzles[p.id]?.foundWords?.length || 0;
          return count > 0 && count < p.words.length;
        });
      } else if (this.vaultFilter === "completed") {
        vaultPuzzles = vaultPuzzles.filter(p => {
          const prog = this.storage.puzzles[p.id];
          if (!prog || !prog.foundWords) return false;
          const score = SpellingBeeEngine.calculateWordsScore(prog.foundWords, p);
          const max = SpellingBeeEngine.calculateMaxScore(p);
          const rank = SpellingBeeEngine.getRank(score, max);
          return rank.pct >= 0.85;
        });
      }

      if (this.dom.vaultHeaderCount) {
        this.dom.vaultHeaderCount.textContent = `${vaultPuzzles.length} Hives`;
      }

      if (vaultPuzzles.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-found-msg";
        empty.textContent = APP_CONFIG.content.emptyStates.noSearchResultsHeading;
        this.dom.vaultGrid.appendChild(empty);
        return;
      }

      vaultPuzzles.forEach(puzzle => {
        const card = document.createElement("div");
        card.className = "vault-card interactive-tactile";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("data-id", puzzle.id);
        card.setAttribute("aria-label", `Open Hive #${puzzle.puzzleNumber}`);

        const prog = this.storage.puzzles[puzzle.id] || { foundWords: [] };
        const max = SpellingBeeEngine.calculateMaxScore(puzzle);
        const score = SpellingBeeEngine.calculateWordsScore(prog.foundWords, puzzle);
        const rank = SpellingBeeEngine.getRank(score, max);

        const isQB = rank.name === "Queen Bee";
        const isGenius = rank.pct >= 0.85 && !isQB;
        const isDaily = this.dailyPuzzle && this.dailyPuzzle.id === puzzle.id;

        card.innerHTML = `
          <div class="vault-card-info">
            <span class="vault-date">Hive #${puzzle.puzzleNumber}${isDaily ? " • Today's Challenge" : ""}</span>
            <span class="vault-letters">
              <span class="center-ltr">${puzzle.centerLetter}</span> ${puzzle.outerLetters.join(" ")}
            </span>
          </div>
          <div class="vault-card-right">
            <span class="vault-progress-tag ${isQB ? "queen-bee" : (isGenius ? "completed" : "")}">
              ${isQB ? "👑 " : ""}${prog.foundWords.length}/${puzzle.words.length} • ${rank.name}
            </span>
          </div>
        `;

        this.dom.vaultGrid.appendChild(card);
      });
    }

    calculateDerivedStats() {
      let totalWords = 0;
      let totalPoints = 0;
      let totalPangrams = 0;
      let playedCount = 0;

      for (const [id, entry] of Object.entries(this.storage.puzzles)) {
        if (entry && entry.foundWords && entry.foundWords.length > 0) {
          playedCount++;
          totalWords += entry.foundWords.length;
          const puzzle = this.puzzles.find(p => p.id === id);
          if (puzzle) {
            totalPoints += SpellingBeeEngine.calculateWordsScore(entry.foundWords, puzzle);
            totalPangrams += entry.foundWords.filter(w => puzzle.pangrams.includes(w)).length;
          }
        }
      }

      return {
        played: playedCount,
        words: totalWords,
        points: totalPoints,
        pangrams: totalPangrams
      };
    }

    renderStats() {
      const derived = this.calculateDerivedStats();
      const s = this.storage.stats;

      if (this.dom.statPlayed) this.dom.statPlayed.textContent = derived.played;
      if (this.dom.statWords) this.dom.statWords.textContent = derived.words;
      if (this.dom.statPangrams) this.dom.statPangrams.textContent = derived.pangrams;
      if (this.dom.statPoints) this.dom.statPoints.textContent = derived.points;
      if (this.dom.statCurrentStreak) this.dom.statCurrentStreak.textContent = s.currentStreak;
      if (this.dom.statMaxStreak) this.dom.statMaxStreak.textContent = s.maxStreak;
    }

    updateStreakIfNeeded() {
      if (!this.activePuzzle || !this.dailyPuzzle || this.activePuzzle.id !== this.dailyPuzzle.id) return;

      const rank = SpellingBeeEngine.getRank(this.score, this.maxScore);
      if (rank.pct < 0.26) return;

      const stats = this.storage.stats;
      const today = this.cycleEngine.getLocalDateString();

      if (stats.lastCompletedDailyDate === today) return;

      if (stats.lastCompletedDailyDate) {
        const lastParts = stats.lastCompletedDailyDate.split("-");
        const lastMidnight = Date.UTC(parseInt(lastParts[0], 10), parseInt(lastParts[1], 10) - 1, parseInt(lastParts[2], 10));
        const currMidnight = this.cycleEngine.getLocalMidnightEpoch();
        const diffDays = Math.round((currMidnight - lastMidnight) / 86400000);

        if (diffDays === 1) {
          stats.currentStreak += 1;
        } else if (diffDays === 2 && (stats.graceDaysRemaining || 0) > 0) {
          stats.graceDaysRemaining -= 1;
          stats.currentStreak += 1;
          this.showFeedback(APP_CONFIG.content.notifications.streakProtected, "success");
        } else if (diffDays > 1) {
          stats.currentStreak = 1;
        }
      } else {
        stats.currentStreak = 1;
      }

      stats.lastCompletedDailyDate = today;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      this.saveSafeStorage();
    }

    shareProgress() {
      const puzzle = this.activePuzzle || this.dailyPuzzle;
      if (!puzzle) return;

      const rank = SpellingBeeEngine.getRank(this.score, this.maxScore);
      const pangramCount = puzzle.pangrams.length;
      const pangramsFound = this.foundWords.filter(w => puzzle.pangrams.includes(w)).length;
      const isDaily = this.dailyPuzzle && this.dailyPuzzle.id === puzzle.id;
      const puzzleLabel = isDaily ? `Daily Challenge • ${this.cycleEngine.formatDisplayDate()}` : `Hive #${puzzle.puzzleNumber}`;

      const summaryText = [
        `🐝 ${APP_CONFIG.identity.appName} • ${puzzleLabel}`,
        `Rank: ${rank.name} (${this.score} pts)`,
        `Words: ${this.foundWords.length}/${puzzle.words.length}`,
        `Pangrams: ${pangramsFound}/${pangramCount} ${"★".repeat(pangramsFound)}`
      ].join("\n");

      if (navigator.share) {
        navigator.share({
          title: `${APP_CONFIG.identity.appName} Progress`,
          text: summaryText
        }).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summaryText).then(() => {
          this.showFeedback(APP_CONFIG.content.notifications.copySuccess, "success");
        }).catch(() => {
          this.showFeedback("Unable to copy summary to clipboard", "error");
        });
      }
    }

    exportBackupData() {
      if (!this.dom.backupPayloadArea) return;
      const json = JSON.stringify(this.storage, null, 2);
      this.dom.backupPayloadArea.hidden = false;
      this.dom.backupPayloadArea.value = json;
      this.dom.backupPayloadArea.select();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json);
        this.showFeedback(APP_CONFIG.content.notifications.copySuccess, "success");
      }
    }

    importBackupData() {
      if (!this.dom.backupPayloadArea) return;
      if (this.dom.backupPayloadArea.hidden) {
        this.dom.backupPayloadArea.hidden = false;
        this.dom.backupPayloadArea.value = "";
        this.dom.backupPayloadArea.focus();
        this.showFeedback("Paste backup text and click Import Ledger again", "success");
        return;
      }

      try {
        const text = this.dom.backupPayloadArea.value.trim();
        if (!text) return;
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === "object" && parsed.stats) {
          this.storage = {
            version: 6,
            stats: {
              currentStreak: Number(parsed.stats.currentStreak) || 0,
              maxStreak: Number(parsed.stats.maxStreak) || 0,
              lastCompletedDailyDate: parsed.stats.lastCompletedDailyDate || null,
              graceDaysRemaining: Number(parsed.stats.graceDaysRemaining) ?? 1
            },
            puzzles: parsed.puzzles || {}
          };
          this.saveSafeStorage();
          this.renderStats();
          this.showFeedback("Ledger restored successfully!", "success");
          this.dom.backupPayloadArea.hidden = true;
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        this.showFeedback("Invalid ledger backup format", "error");
      }
    }

    handleHiveSpatialNav(e) {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;
      e.preventDefault();

      const active = document.activeElement;
      const id = active?.id;

      const navMap = {
        "cell-0": { ArrowRight: "cell-1", ArrowDown: "cell-2", ArrowLeft: "cell-1" },
        "cell-1": { ArrowLeft: "cell-0", ArrowDown: "cellCenter", ArrowRight: "cell-0" },
        "cell-2": { ArrowUp: "cell-0", ArrowRight: "cellCenter", ArrowDown: "cell-4" },
        "cellCenter": { ArrowLeft: "cell-2", ArrowRight: "cell-3", ArrowUp: "cell-0", ArrowDown: "cell-4" },
        "cell-3": { ArrowLeft: "cellCenter", ArrowUp: "cell-1", ArrowDown: "cell-5" },
        "cell-4": { ArrowUp: "cell-2", ArrowRight: "cell-5", ArrowLeft: "cell-5" },
        "cell-5": { ArrowUp: "cell-3", ArrowLeft: "cell-4", ArrowRight: "cell-4" }
      };

      const targetId = navMap[id]?.[e.key];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) el.focus();
      }
    }

    openModal(modal) {
      if (!modal) return;
      this.lastFocusedElement = document.activeElement;
      modal.hidden = false;
      const firstBtn = modal.querySelector("button, [href], input, textarea, [tabindex]:not([tabindex='-1'])");
      if (firstBtn) firstBtn.focus();
    }

    closeModal(modal) {
      if (!modal) return;
      modal.hidden = true;
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
        this.lastFocusedElement.focus();
      }
    }

    loadSettings() {
      const fallback = {
        bgAnimation: true,
        haptics: true
      };
      try {
        const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.settings);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            bgAnimation: parsed.bgAnimation !== false,
            haptics: parsed.haptics !== false
          };
        }
      } catch (e) {}
      return fallback;
    }

    saveSettings() {
      try {
        localStorage.setItem(APP_CONFIG.endpoints.storageKeys.settings, JSON.stringify(this.settings));
      } catch (e) {}
    }

    loadSafeStorage() {
      const fallback = {
        version: 6,
        stats: {
          currentStreak: 0,
          maxStreak: 0,
          lastCompletedDailyDate: null,
          graceDaysRemaining: 1
        },
        puzzles: {}
      };

      try {
        let raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.save);
        if (!raw) raw = localStorage.getItem("cocktail_spelling_bee_save_v6");
        if (!raw) return fallback;

        const data = JSON.parse(raw);
        if (!data || typeof data !== "object") return fallback;

        return {
          version: 6,
          stats: {
            currentStreak: Number(data.stats?.currentStreak) || 0,
            maxStreak: Number(data.stats?.maxStreak) || 0,
            lastCompletedDailyDate: data.stats?.lastCompletedDailyDate || null,
            graceDaysRemaining: Number(data.stats?.graceDaysRemaining) ?? 1
          },
          puzzles: (data.puzzles && typeof data.puzzles === "object") ? data.puzzles : {}
        };
      } catch (err) {
        return fallback;
      }
    }

    saveSafeStorage() {
      try {
        localStorage.setItem(APP_CONFIG.endpoints.storageKeys.save, JSON.stringify(this.storage));
      } catch (err) {}
    }

    saveProgress() {
      if (!this.activePuzzle) return;
      if (!this.storage.puzzles[this.activePuzzle.id]) {
        this.storage.puzzles[this.activePuzzle.id] = { foundWords: [] };
      }
      this.storage.puzzles[this.activePuzzle.id].foundWords = [...this.foundWords];
      this.saveSafeStorage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new SpellingBeeApp());
  } else {
    new SpellingBeeApp();
  }
})();