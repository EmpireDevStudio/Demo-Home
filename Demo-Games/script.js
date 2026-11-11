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
    appId: "game-lounge-parlor",
    appName: "The Game Lounge",
    appTagline: "Curated Artisanal Daily Puzzles",
    version: "2.5.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    accentColor: "#A25750",      // Terracotta
    accentSecondary: "#526F56",  // Sage
    accentHighlight: "#7B641F",  // Warm Ochre
    fontFamilyBase: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontFamilySerif: "'Playfair Display', Georgia, serif",
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "../",
    backNavLabel: "Parlor",
    items: [
      { id: "home", label: "Home", icon: "home", route: "./Demo-Home/", enabled: true, showInBottomBar: true },
      { id: "puzzles", label: "Games", icon: "grid", route: "#mainContentArea", enabled: true, showInBottomBar: true, isActive: true },
      { id: "settings", label: "Preferences", icon: "settings", route: "#settings-modal", enabled: true, showInBottomBar: true },
      { id: "patronage", label: "Patronage", icon: "heart", route: "#donate-modal", enabled: true, showInBottomBar: true },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDER PRODUCTION DATA)
  content: {
    headers: {
      eyebrow: "CURATED ARCHIVE",
      defaultTitle: "Game Collection",
      defaultSubtitle: "Select a stationery puzzle to unwind",
      greetings: {
        morning: "Good morning! Document today's morning puzzle",
        afternoon: "Good afternoon! A peaceful moment in the lounge",
        evening: "Good evening! Unwind with an artisanal puzzle"
      }
    },
    actions: {
      confirm: "Confirm & Proceed",
      close: "Close Dialog",
      contribute: "Contribute Patronage",
      recentBadge: "Recent",
      doneBadge: "✓",
    },
    notifications: {
      openingGame: "Preparing puzzle parlor...",
      soundEnabled: "Tactile acoustic chimes enabled",
      soundDisabled: "Sound muted",
      animationsEnabled: "Atmospheric motion enabled",
      animationsDisabled: "Atmospheric motion suspended",
      hapticsEnabled: "Micro-haptic pulses enabled",
      hapticsDisabled: "Micro-haptics disabled",
    },
    catalog: [
      { id: "crossword",    name: "Crossword",   desc: "Daily mini puzzle",    url: "./Demo-Crossword/",   enabled: true,  icon: "grid" },
      { id: "connections",  name: "Connections", desc: "Find groups of 4",     url: "./Demo-Connections/", enabled: true,  icon: "nodes" },
      { id: "trivia",       name: "Trivia",      desc: "Knowledge test",       url: "./Demo-Trivia/",      enabled: true,  icon: "help" },
      { id: "hangman",      name: "Hangman",     desc: "Guess the phrase",     url: "./Demo-Hangman/",     enabled: true,  icon: "text" },
      { id: "specs",        name: "SPECS Training", desc: "Cocktail training", url: "./Demo-Specs/",       enabled: true,  icon: "check" },
      { id: "memory",       name: "Memory",      desc: "Pair identical cards", url: "./Demo-Memory/",      enabled: true,  icon: "cards" },
      { id: "spelling-bee", name: "Letters",     desc: "Form 4+ letter words", url: "./Demo-SpellingBee/", enabled: true,  icon: "hex" },
      { id: "wordle",       name: "Word Guess",  desc: "5-letter challenge",   url: "./Demo-Wordle/",      enabled: true,  icon: "rows" },
      { id: "wordsearch",   name: "Wordsearch",  desc: "Find hidden words",    url: "./Demo-Wordsearch/",  enabled: true,  icon: "dice" }
    ]
  },

  // 5. EXTERNAL LINKS, SUPPORT & PATRONAGE
  support: {
    contactEmail: "empiredevstudio@gmail.com",
    stripeDonateUrl: "https://buy.stripe.com/14AbJ0czm3Ct3ARdPgefC0U",
  },

  // 6. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,
    enableSmoothPageTransitions: true,
    enableAutoSave: true,
    enableStickyBottomBar: true,
    enableSoundEffects: true,
    enableAnimations: true
  },

  // 7. API ENDPOINTS & STORAGE
  endpoints: {
    storageKeys: {
      settings: "game_hub_settings_v2",
      progress: "hub_daily_progress_v2",
      lastPlayed: "hub_last_played_v2",
    },
  },
});

/**
 * =========================================================================
 * CORE ENGINE CONTROLLER
 * =========================================================================
 */
(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. Semantic SVG Icon Registry
     -------------------------------------------------------------------------- */
  const ICONS = {
    grid: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
    nodes: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.8"/><circle cx="18" cy="6" r="2.8"/><circle cx="6" cy="18" r="2.8"/><circle cx="18" cy="18" r="2.8"/><line x1="9" y1="6" x2="15" y2="6"/><line x1="6" y1="9" x2="6" y2="15"/><line x1="18" y1="9" x2="18" y2="15"/><line x1="9" y1="18" x2="15" y2="18"/></svg>',
    help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M9.2 9a2.8 2.8 0 0 1 5.4.9c0 1.9-2.6 2.5-2.6 3.6"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>',
    text: '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="6" y1="17" x2="20" y2="17"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><polyline points="8 12 11 15 16 9"/></svg>',
    cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="12" height="15" rx="2.5"/><path d="M8 3h10a2.5 2.5 0 0 1 2.5 2.5v12"/></svg>',
    hex: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2.5 21 7.5 21 16.5 12 21.5 3 16.5 3 7.5 12 2.5"/></svg>',
    rows: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="4.5" rx="1.5"/><rect x="3" y="10" width="18" height="4.5" rx="1.5"/><rect x="3" y="16" width="18" height="4.5" rx="1.5"/></svg>',
    dice: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3.5"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><circle cx="16" cy="8" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="8" cy="16" r="1.4" fill="currentColor"/><circle cx="16" cy="16" r="1.4" fill="currentColor"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  };

  /* --------------------------------------------------------------------------
     2. Handcrafted Botanical Stationary SVGs (Embossed Stationery Motif)
     -------------------------------------------------------------------------- */
  const GARNISH_SVGS = [
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true"><path d="M10,38 C14,34 18,20 26,14 C34,8 39,12 37,20 C35,28 24,32 18,28 C12,24 16,10 24,8" fill="none" stroke="#A25750" stroke-width="2.5" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="rgba(82, 111, 86, 0.12)" stroke="#526F56" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="#7B641F"/><line x1="24" y1="6" x2="24" y2="42" stroke="#526F56" stroke-width="1.2"/><line x1="6" y1="24" x2="42" y2="24" stroke="#526F56" stroke-width="1.2"/></svg>`,
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true"><path d="M24,40 C24,28 24,18 24,8" fill="none" stroke="#526F56" stroke-width="2" stroke-linecap="round"/><path d="M24,26 C16,23 12,17 14,12 C19,10 23,16 24,20" fill="rgba(214, 227, 210, 0.45)" stroke="#526F56" stroke-width="1.4"/></svg>`,
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true"><path d="M21,18 Q23,6 35,5" fill="none" stroke="#7B641F" stroke-width="2"/><circle cx="20" cy="28" r="10" fill="rgba(162, 87, 80, 0.22)" stroke="#A25750" stroke-width="1.8"/></svg>`
  ];

  /* --------------------------------------------------------------------------
     3. State Management & Multi-Tab Synchronization
     -------------------------------------------------------------------------- */
  const state = {
    sound: APP_CONFIG.features.enableSoundEffects,
    animations: APP_CONFIG.features.enableAnimations,
    haptics: APP_CONFIG.features.enableHapticFeedback,
  };

  function loadSettings() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.settings);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.sound === "boolean") state.sound = parsed.sound;
        if (typeof parsed.animations === "boolean") state.animations = parsed.animations;
        if (typeof parsed.haptics === "boolean") state.haptics = parsed.haptics;
      }
    } catch (e) {}
  }

  function saveSettings() {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.settings, JSON.stringify(state));
    } catch (e) {}
  }

  function getTodayLocalDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function getCompletedGamesToday() {
    try {
      const today = getTodayLocalDate();
      const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.progress);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Object.keys(data).filter((id) => data[id] === today);
    } catch (e) {
      return [];
    }
  }

  function setLastPlayedGame(gameId) {
    try {
      localStorage.setItem(APP_CONFIG.endpoints.storageKeys.lastPlayed, gameId);
    } catch (e) {}
  }

  function getLastPlayedGame() {
    try {
      return localStorage.getItem(APP_CONFIG.endpoints.storageKeys.lastPlayed) || null;
    } catch (e) {
      return null;
    }
  }

  /* --------------------------------------------------------------------------
     4. Sensory Feedback: Acoustic Synthesis & 12ms Micro-Haptics
     -------------------------------------------------------------------------- */
  let audioCtx = null;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  function playTone(freq1, freq2, duration = 0.12, type = "sine") {
    if (!state.sound) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = type;
      osc2.type = type;
      osc1.frequency.setValueAtTime(freq1, now);
      osc2.frequency.setValueAtTime(freq2, now + duration * 0.4);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + duration * 0.5);
      osc2.start(now + duration * 0.4);
      osc2.stop(now + duration);
    } catch (e) {}
  }

  function triggerHapticPulse() {
    if (state.haptics && "vibrate" in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {}
    }
  }

  /* --------------------------------------------------------------------------
     5. Botanical Flight Atmosphere
     -------------------------------------------------------------------------- */
  class BotanicalSystem {
    constructor(containerEl) {
      this.container = containerEl;
      this.garnishes = [];
      this.targetCount = 7;
      this.rafId = null;
      this.lastTime = performance.now();
      this.viewportW = window.innerWidth;
      this.viewportH = window.innerHeight;
    }

    onResize() {
      this.viewportW = window.innerWidth;
      this.viewportH = window.innerHeight;
    }

    init() {
      if (!this.container) return;
      this.container.innerHTML = "";
      this.garnishes = [];
      this.onResize();

      for (let i = 0; i < this.targetCount; i++) {
        const initialY = (this.viewportH / this.targetCount) * i + (Math.random() * 20 - 10);
        this.createGarnish(initialY);
      }
      this.start();
    }

    createGarnish(initialY) {
      const el = document.createElement("div");
      el.className = `floating-garnish depth-mid`;
      el.innerHTML = GARNISH_SVGS[Math.floor(Math.random() * GARNISH_SVGS.length)];

      const speed = 24 + Math.random() * 18;
      const startX = 10 + Math.random() * 80;
      const rotSpeed = (Math.random() * 8 + 4) * (Math.random() > 0.5 ? 1 : -1);
      const rotation = Math.random() * 360;

      el.style.transform = `translate3d(${(startX / 100) * this.viewportW}px, ${initialY}px, 0)`;
      this.container.appendChild(el);

      this.garnishes.push({
        el,
        xPercent: startX,
        y: initialY,
        speed,
        rotation,
        rotSpeed,
      });
    }

    start() {
      if (this.rafId) return;
      this.lastTime = performance.now();
      const tick = (now) => {
        const delta = Math.min((now - this.lastTime) / 1000, 0.08);
        this.lastTime = now;

        if (state.animations && !document.hidden) {
          const h = this.viewportH;
          const w = this.viewportW;
          for (let i = 0; i < this.garnishes.length; i++) {
            const g = this.garnishes[i];
            g.y -= g.speed * delta;
            g.rotation += g.rotSpeed * delta;
            if (g.y < -60) {
              g.y = h + 40;
              g.xPercent = 10 + Math.random() * 80;
            }
            g.el.style.transform = `translate3d(${(g.xPercent / 100) * w}px, ${g.y}px, 0) rotate(${g.rotation}deg)`;
          }
        }
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }
  }

  let botanicalInstance = null;

  /* --------------------------------------------------------------------------
     6. UI Notifications & Accessible Announcer
     -------------------------------------------------------------------------- */
  function announceA11y(message) {
    const el = document.getElementById("a11y-announcer");
    if (el) {
      el.textContent = "";
      setTimeout(() => { el.textContent = message; }, 40);
    }
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast-banner");
    if (!toast) return;

    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toast.setAttribute("aria-hidden", "false");

    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.setAttribute("aria-hidden", "true");
    }, 2200);
  }

  /* --------------------------------------------------------------------------
     7. Dynamic Hydration & Renderers
     -------------------------------------------------------------------------- */
  function updateGreeting() {
    const subtitle = document.getElementById("pageSubtitleSlot");
    if (!subtitle) return;

    const hour = new Date().getHours();
    let text = APP_CONFIG.content.headers.defaultSubtitle;
    if (hour >= 5 && hour < 12) {
      text = APP_CONFIG.content.headers.greetings.morning;
    } else if (hour >= 12 && hour < 18) {
      text = APP_CONFIG.content.headers.greetings.afternoon;
    } else {
      text = APP_CONFIG.content.headers.greetings.evening;
    }
    subtitle.textContent = text;
  }

  function renderGrid() {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const completed = getCompletedGamesToday();
    const lastPlayed = getLastPlayedGame();
    const fragment = document.createDocumentFragment();

    APP_CONFIG.content.catalog.forEach((item) => {
      const li = document.createElement("li");
      li.className = "grid-cell";

      if (item.enabled) {
        const link = document.createElement("a");
        link.className = "tile interactive-tactile";
        link.href = item.url;
        link.setAttribute("aria-label", `Play ${item.name}: ${item.desc}`);
        link.setAttribute("data-id", item.id);

        if (completed.includes(item.id)) {
          const badge = document.createElement("span");
          badge.className = "tile-badge-done";
          badge.textContent = APP_CONFIG.content.actions.doneBadge;
          badge.setAttribute("aria-label", "Completed today");
          link.appendChild(badge);
        } else if (item.id === lastPlayed) {
          const badge = document.createElement("span");
          badge.className = "tile-badge-recent";
          badge.textContent = APP_CONFIG.content.actions.recentBadge;
          link.appendChild(badge);
        }

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS[item.icon] || ICONS.grid;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        const desc = document.createElement("span");
        desc.className = "tile-desc";
        desc.textContent = item.desc;

        link.appendChild(iconEl);
        link.appendChild(label);
        link.appendChild(desc);

        link.addEventListener("click", (e) => {
          setLastPlayedGame(item.id);
          playTone(523.25, 659.25, 0.12);
          triggerHapticPulse();

          if (item.url.startsWith("#")) {
            e.preventDefault();
            link.classList.add("is-loading");
            showToast(APP_CONFIG.content.notifications.openingGame);
            setTimeout(() => { link.classList.remove("is-loading"); }, 500);
          }
        });

        li.appendChild(link);
      } else {
        const div = document.createElement("div");
        div.className = "tile tile-disabled";
        div.setAttribute("aria-disabled", "true");
        div.setAttribute("aria-label", `${item.name} is coming soon`);

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS.lock;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        const desc = document.createElement("span");
        desc.className = "tile-desc";
        desc.textContent = "Coming Soon";

        div.appendChild(iconEl);
        div.appendChild(label);
        div.appendChild(desc);
        li.appendChild(div);
      }

      fragment.appendChild(li);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);

    const digestText = document.getElementById("dailyDigestText");
    if (digestText) {
      digestText.textContent = `${completed.length} of ${APP_CONFIG.content.catalog.length} puzzles documented today`;
    }
  }

  function renderBottomDock() {
    const dockContainer = document.getElementById("bottomDockNavItems");
    if (!dockContainer) return;

    dockContainer.innerHTML = "";
    APP_CONFIG.navigation.items.filter(item => item.showInBottomBar).forEach((item) => {
      const button = document.createElement("a");
      button.className = `nav-tab-item interactive-tactile ${item.isActive ? "nav-tab-item--active" : ""}`;
      button.href = item.route;
      button.setAttribute("aria-label", item.label);

      button.innerHTML = `
        ${ICONS[item.icon] || ICONS.grid}
        <span>${item.label}</span>
        ${item.isActive ? '<span class="nav-tab-item__indicator" aria-hidden="true"></span>' : ''}
      `;

      button.addEventListener("click", (e) => {
        triggerHapticPulse();
        playTone(600, 750, 0.08);

        if (item.route.startsWith("#")) {
          e.preventDefault();
          const modalId = item.route.replace("#", "");
          const targetModal = document.getElementById(modalId);
          if (targetModal) {
            openModal(targetModal, button);
          }
        }
      });

      dockContainer.appendChild(button);
    });
  }

  /* --------------------------------------------------------------------------
     8. Modal Drawer Engine & Focus Traps
     -------------------------------------------------------------------------- */
  let activeModal = null;
  let previouslyFocused = null;

  function getFocusables(el) {
    return Array.from(el.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  }

  function trapFocus(e) {
    if (!activeModal) return;
    const focusables = getFocusables(activeModal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  }

  function openModal(modalEl, triggerBtn) {
    if (!modalEl) return;
    previouslyFocused = triggerBtn || document.activeElement;
    activeModal = modalEl;

    playTone(440, 587, 0.1);
    triggerHapticPulse();

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("is-active");

    modalEl.hidden = false;
    void modalEl.offsetHeight; // Force reflow
    modalEl.classList.add("is-open");

    if (triggerBtn) triggerBtn.setAttribute("aria-expanded", "true");

    const focusables = getFocusables(modalEl);
    if (focusables.length) focusables[0].focus();

    document.addEventListener("keydown", trapFocus);
    announceA11y(`${modalEl.querySelector(".sheet-title")?.textContent || "Dialog"} opened`);
  }

  function closeModal() {
    if (!activeModal) return;
    playTone(400, 300, 0.08);
    triggerHapticPulse();

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("is-active");

    activeModal.classList.remove("is-open");
    const closing = activeModal;

    setTimeout(() => {
      if (!closing.classList.contains("is-open")) {
        closing.hidden = true;
      }
    }, 250);

    const btnSettings = document.getElementById("btn-settings-trigger");
    const btnDonate = document.getElementById("btn-donate-trigger");
    if (btnSettings) btnSettings.setAttribute("aria-expanded", "false");
    if (btnDonate) btnDonate.setAttribute("aria-expanded", "false");

    if (previouslyFocused && typeof previouslyFocused.focus === "function") {
      previouslyFocused.focus();
    }

    document.removeEventListener("keydown", trapFocus);
    activeModal = null;
  }

  function setupSwipeToDismiss(modalEl) {
    let startY = 0;
    let isTracking = false;

    const handle = modalEl.querySelector(".sheet-handle") || modalEl.querySelector(".sheet-header");
    if (!handle) return;

    handle.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        startY = e.touches[0].clientY;
        isTracking = true;
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (!isTracking || !activeModal) return;
      const deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        activeModal.style.transform = `translate(-50%, ${deltaY}px)`;
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (!isTracking || !activeModal) return;
      isTracking = false;
      const deltaY = e.changedTouches[0].clientY - startY;
      activeModal.style.transform = "";
      if (deltaY > 80) closeModal();
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     9. Event Listeners & Binding
     -------------------------------------------------------------------------- */
  function bindInteractions() {
    const btnSettings = document.getElementById("btn-settings-trigger");
    const btnDonate = document.getElementById("btn-donate-trigger");
    const modalSettings = document.getElementById("settings-modal");
    const modalDonate = document.getElementById("donate-modal");
    const btnCloseSettings = document.getElementById("close-settings");
    const btnCloseDonate = document.getElementById("close-donate");
    const backdrop = document.getElementById("modal-backdrop");

    const soundToggle = document.getElementById("toggle-sound");
    const animToggle = document.getElementById("toggle-animations");
    const hapticToggle = document.getElementById("toggle-haptics");
    const stripeLink = document.getElementById("stripe-donate-link");

    if (soundToggle) soundToggle.checked = state.sound;
    if (animToggle) animToggle.checked = state.animations;
    if (hapticToggle) hapticToggle.checked = state.haptics;

    if (soundToggle) {
      soundToggle.addEventListener("change", (e) => {
        state.sound = e.target.checked;
        saveSettings();
        if (state.sound) playTone(784, 659, 0.08);
        showToast(state.sound ? APP_CONFIG.content.notifications.soundEnabled : APP_CONFIG.content.notifications.soundDisabled);
      });
    }

    if (animToggle) {
      animToggle.addEventListener("change", (e) => {
        state.animations = e.target.checked;
        saveSettings();
        if (state.animations) {
          document.body.classList.remove("animations-disabled");
          if (botanicalInstance) botanicalInstance.start();
        } else {
          document.body.classList.add("animations-disabled");
          if (botanicalInstance) botanicalInstance.stop();
        }
        showToast(state.animations ? APP_CONFIG.content.notifications.animationsEnabled : APP_CONFIG.content.notifications.animationsDisabled);
      });
    }

    if (hapticToggle) {
      hapticToggle.addEventListener("change", (e) => {
        state.haptics = e.target.checked;
        saveSettings();
        triggerHapticPulse();
        showToast(state.haptics ? APP_CONFIG.content.notifications.hapticsEnabled : APP_CONFIG.content.notifications.hapticsDisabled);
      });
    }

    if (btnSettings && modalSettings) {
      btnSettings.addEventListener("click", () => openModal(modalSettings, btnSettings));
      setupSwipeToDismiss(modalSettings);
    }

    if (btnDonate && modalDonate) {
      btnDonate.addEventListener("click", () => openModal(modalDonate, btnDonate));
      setupSwipeToDismiss(modalDonate);
    }

    if (btnCloseSettings) btnCloseSettings.addEventListener("click", closeModal);
    if (btnCloseDonate) btnCloseDonate.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    if (stripeLink) {
      stripeLink.addEventListener("click", () => {
        playTone(523.25, 783.99, 0.15);
        triggerHapticPulse();
      });
    }

    window.addEventListener("resize", () => {
      if (botanicalInstance) botanicalInstance.onResize();
    });

    window.addEventListener("storage", (e) => {
      if (e.key === APP_CONFIG.endpoints.storageKeys.settings) {
        loadSettings();
        if (soundToggle) soundToggle.checked = state.sound;
        if (animToggle) animToggle.checked = state.animations;
        if (hapticToggle) hapticToggle.checked = state.haptics;
      } else if (e.key === APP_CONFIG.endpoints.storageKeys.progress) {
        renderGrid();
      }
    });
  }

  /* --------------------------------------------------------------------------
     10. Application Boot Routine
     -------------------------------------------------------------------------- */
  function init() {
    loadSettings();
    updateGreeting();

    const backNav = document.getElementById("btn-back-nav");
    const backNavLabel = document.getElementById("backNavLabel");
    if (backNav) backNav.href = APP_CONFIG.navigation.defaultFallbackRoute;
    if (backNavLabel) backNavLabel.textContent = APP_CONFIG.navigation.backNavLabel;

    const pageEyebrow = document.getElementById("pageEyebrowSlot");
    const pageTitle = document.getElementById("pageTitleSlot");
    if (pageEyebrow) pageEyebrow.textContent = APP_CONFIG.content.headers.eyebrow;
    if (pageTitle) pageTitle.textContent = APP_CONFIG.content.headers.defaultTitle;

    const stageEl = document.getElementById("garnish-stage");
    if (stageEl) {
      botanicalInstance = new BotanicalSystem(stageEl);
      botanicalInstance.init();
    }

    if (!state.animations) {
      document.body.classList.add("animations-disabled");
      if (botanicalInstance) botanicalInstance.stop();
    }

    renderGrid();
    renderBottomDock();
    bindInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();