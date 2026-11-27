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
    appId: "Demo Portal",
    appName: "Training Workspace",
    appTagline: "Ongoing Training Hub",
    version: "1.1.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE
  branding: {
    logoUrl: "logo.png",
    logoAlt: "System Core Artwork",
    accentColor: "#3E5B42",     // Sage Green (Passes AAA)
    accentCinema: "#963E35",    // Terracotta (Passes AA)
    accentGames: "#6E5614",     // Ochre (Passes AA)
    accentAudit: "#2A4365",     // Slate (Passes AAA)
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE & QUADRANT ROUTES
  navigation: {
    defaultFallbackRoute: "./Demo-Library/",
    routes: {
      library: "./Demo-Library/",
      videos: "./Demo-Videos/",
      games: "./Demo-Games/",
      checklists: "./Demo-Checklists/",
    },
    items: [
      { id: "library", label: "Library", category: "ARCHIVE", route: "./Demo-Library/", icon: "book" },
      { id: "videos", label: "Videos", category: "CINEMA", route: "./Demo-Videos/", icon: "video" },
      { id: "games", label: "Games", category: "SIMULATION", route: "./Demo-Games/", icon: "gamepad" },
      { id: "checklists", label: "Checklists", category: "AUDIT", route: "./Demo-Checklists/", icon: "check" },
    ],
  },

  // 4. APPLICATION COPY & CONTENT MATRIX (ZERO-PLACEHOLDERS)
  content: {
    headers: {
      eyebrow: "Ongoing Training Hub",
      title: "Online Training Workspace",
      subtitle: "",
    },
    intro: {
      eyebrow: "Ongoing Training Hub",
      title: "Your Team's Training Hub, Ready in Minutes",
      subtitle:
        "Save hours creating and storing staff training resources—then give your team instant, pain-free access to manuals, videos, interactive practice, and checklists in one consistent place.",
      startTourAction: "Take the Tour \u2192",
      action: "Skip to Workspace",
    },
    sectors: {
      library: {
        category: "ARCHIVE",
        name: "LIBRARY",
        description: "Store a library of documents, manuals, and reference materials",
      },
      videos: {
        category: "CINEMA",
        name: "VIDEOS",
        description: "Visual Aids for training, onboarding, and reference purposes",
      },
      games: {
        category: "SIMULATION",
        name: "GAMES",
        description: "Interactive Learning Experiences",
      },
      checklists: {
        category: "AUDIT",
        name: "CHECKLISTS",
        description: "Operational protocols, safety checklists, and quality assurance workflows",
      },
    },
    actions: {
      back: "Back",
      online: "ONLINE",
      offline: "OFFLINE",
    },
  },

  // 5. TIMINGS & PHYSICAL SIMULATION
  physics: {
    mobileBreakpointPx: 640,
    desktop: {
      normalDiscSize: 116,
      cutoutClearance: 19,
    },
    mobile: {
      normalDiscSize: 84,
      cutoutClearance: 13,
    },
    parallaxStrength: 3.5,
    orbParallaxFactor: 0.28,
  },

  // 6. WEBSITE LINK
  website: {
    url: "./Engage", // Replace with the destination website URL.
    transitionDurationMs: 300,
  },

  // 7. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,
    enableParallax: true,
    enableFloatingMotifs: true,
    enableServiceWorker: true,
    serviceWorkerPath: "./sw.js",
    navigationDelayMs: 340,
  },

  // 8. STORAGE KEYS
  storage: {
    visitedIntroKey: "system_directory_intro_dismissed_v2",
    floatingMotifsKey: "training_workspace_animations_v1",
  },
});

/**
 * =========================================================================
 * ONBOARDING & DEMO FOLLOW-UP CONFIGURATION (ONBOARDING_CONFIG)
 * Edit tutorial behavior, five-minute demo timer, and CTA destinations here.
 * =========================================================================
 */
const ONBOARDING_CONFIG = Object.freeze({
  // Set to false when deploying outside demo mode to disable the 5-minute follow-up.
  demoMode: true,

  // Automatically show the welcome screen to first-time visitors.
  autoStartTutorial: true,

  // Allow users to replay the guided tour from the top bar "TOUR" button.
  allowReplay: true,

  // Delay before showing the demo follow-up notification (300000 ms = 5 minutes).
  demoNotificationDelayMs: 300000,

  // Destinations for the five-minute demo follow-up buttons.
  // websiteUrl reuses APP_CONFIG.website.url ("./Engage") by default.
  websiteUrl: APP_CONFIG.website.url,
  // Set contactUrl to your contact page or mailto link (e.g., "mailto:team@example.com").
  // Leave empty ("") until configured; the UI handles empty values safely without errors.
  contactUrl: "",

  // Application-specific storage namespace to avoid collisions on shared domains.
  storageNamespace: "training_workspace_onboarding_v1",
});

/**
 * =========================================================================
 * GUIDED TOUR STEP DEFINITIONS (DATA-DRIVEN)
 * Edit, add, remove, or reorder steps here without touching engine logic.
 * =========================================================================
 */
const TOUR_STEPS = Object.freeze([
  {
    id: "workspace-stage",
    selector: '[data-tour="workspace-stage"]',
    badge: "CENTRAL HUB",
    accent: "#3E5B42",
    preferredPosition: "right",
    padding: 10,
    radius: 26,
    title: "One Hub for Every Training Format",
    body: "This four-quadrant workspace keeps all of your team's training materials in one predictable place—no more digging through shared drives, email threads, or chat attachments.",
    benefit: "Manager benefit: Set up your structure once so staff always know exactly where to find what they need.",
  },
  {
    id: "library",
    selector: '[data-tour="library"]',
    badge: "01 • LIBRARY",
    accent: "#3E5B42",
    preferredPosition: "right",
    padding: 8,
    radius: 20,
    title: "Store Manuals & Guides Once",
    body: "Keep handbooks, SOPs, onboarding packets, and reference documents organized in the Library. Update a file once and everyone immediately sees the current version.",
    benefit: "Saves time: Eliminate duplicate handouts and stop answering the same procedural questions.",
  },
  {
    id: "videos",
    selector: '[data-tour="videos"]',
    badge: "02 • VIDEOS",
    accent: "#963E35",
    preferredPosition: "left",
    padding: 8,
    radius: 20,
    title: "Show Procedures With Training Videos",
    body: "Provide step-by-step video walkthroughs, equipment demos, and onboarding clips that staff can watch—and rewatch—whenever they need a refresher.",
    benefit: "Consistent quality: Every new hire receives the exact same demonstration without pulling a manager off the floor.",
  },
  {
    id: "games",
    selector: '[data-tour="games"]',
    badge: "03 • GAMES",
    accent: "#6E5614",
    preferredPosition: "right",
    padding: 8,
    radius: 20,
    title: "Build Confidence With Interactive Practice",
    body: "Turn passive reading into hands-on learning with scenario simulations and quick knowledge games tailored to real workplace decisions.",
    benefit: "Better retention: Staff practice safely before they're on the job, reducing costly mistakes.",
  },
  {
    id: "checklists",
    selector: '[data-tour="checklists"]',
    badge: "04 • CHECKLISTS",
    accent: "#2A4365",
    preferredPosition: "left",
    padding: 8,
    radius: 20,
    title: "Standardize Daily & Safety Protocols",
    body: "Turn opening routines, safety inspections, and quality assurance steps into clear, repeatable checklists that teams can follow on every shift.",
    benefit: "Pain-free compliance: Keep standards consistent across every shift, role, and location.",
  },
  {
    id: "center-core",
    selector: '[data-tour="center-core"]',
    badge: "PORTAL CORE",
    accent: "#3E5B42",
    preferredPosition: "bottom",
    padding: 12,
    radius: 999,
    title: "Direct Link to Your Main Portal",
    body: "The center disc connects directly to your organization's primary website or broader company portal, keeping your branding front and center.",
    benefit: "Seamless flow: Staff can jump straight to external company resources with a single tap.",
  },
  {
    id: "masthead-controls",
    selector: '[data-tour="masthead-controls"]',
    badge: "ACCESS & CONTROLS",
    accent: "#2A4365",
    preferredPosition: "bottom",
    padding: 8,
    radius: 18,
    title: "Consistent Access, Online or Installed",
    body: "Check live connection status, install the workspace onto any phone or desktop when supported, toggle background motifs, or replay this tour anytime.",
    benefit: "Always available: Fast, dependable access for staff at a desk, on the floor, or in the field.",
  },
]);

/* --------------------------------------------------------------------------
   FLOATING TRAINING MOTIF SVGS (EMBOSSED PAPER STATIONERY STYLE)
   Palette-matched 48x48 inline SVGs with delicate line weights & soft fills.
   -------------------------------------------------------------------------- */
const TRAINING_MOTIF_SVGS = Object.freeze([
  // 1. Open Training Manual (Sage)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 36V13C15.5 11.2 20 12.6 24 15.5V39C20 36.2 15.5 34.8 10 36Z" fill="#3E5B42" fill-opacity="0.16" stroke="#3E5B42" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 36V13C32.5 11.2 28 12.6 24 15.5V39C28 36.2 32.5 34.8 38 36Z" fill="#3E5B42" fill-opacity="0.12" stroke="#3E5B42" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M14 20H20M14 25H19M28 20H34M29 25H34" stroke="#3E5B42" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.7"/>
  </svg>`,

  // 2. Checklist Clipboard (Slate)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="12" y="10" width="24" height="30" rx="4" fill="#2A4365" fill-opacity="0.14" stroke="#2A4365" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M19 10V8.5C19 7.67 19.67 7 20.5 7H27.5C28.33 7 29 7.67 29 8.5V10" stroke="#2A4365" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M18 20.5L21 23.5L28 16.5" stroke="#2A4365" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18 29H30M18 33.5H26" stroke="#2A4365" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.7"/>
  </svg>`,

  // 3. Training Stopwatch (Ochre)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="26" r="13" fill="#6E5614" fill-opacity="0.14" stroke="#6E5614" stroke-width="1.6"/>
    <path d="M21 9H27M24 9V13M33 16L36 13" stroke="#6E5614" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M24 26V19.5M24 26L28.5 28.5" stroke="#6E5614" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="24" cy="26" r="1.5" fill="#6E5614" fill-opacity="0.45"/>
  </svg>`,

  // 4. Video Training Frame (Terracotta)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="13" width="32" height="22" rx="4.5" fill="#963E35" fill-opacity="0.14" stroke="#963E35" stroke-width="1.6"/>
    <path d="M21 19.5L29.5 24L21 28.5V19.5Z" fill="#963E35" fill-opacity="0.32" stroke="#963E35" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M14 38.5H34" stroke="#963E35" stroke-width="1.4" stroke-linecap="round" stroke-opacity="0.65"/>
  </svg>`,

  // 5. Certification Ribbon / Award Badge (Ochre)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="19" r="9.5" fill="#6E5614" fill-opacity="0.16" stroke="#6E5614" stroke-width="1.6"/>
    <circle cx="24" cy="19" r="5" fill="#6E5614" fill-opacity="0.18" stroke="#6E5614" stroke-width="1.2" stroke-dasharray="2.5 2.5"/>
    <path d="M18.5 27.5L16.5 39L24 35.5L31.5 39L29.5 27.5" fill="#6E5614" fill-opacity="0.12" stroke="#6E5614" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 6. Goal Target (Terracotta)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="14" fill="#963E35" fill-opacity="0.12" stroke="#963E35" stroke-width="1.5"/>
    <circle cx="24" cy="24" r="8.5" fill="#963E35" fill-opacity="0.14" stroke="#963E35" stroke-width="1.4"/>
    <circle cx="24" cy="24" r="3" fill="#963E35" fill-opacity="0.4" stroke="#963E35" stroke-width="1.4"/>
    <path d="M35 13L25.5 22.5M35 13H30.5M35 13V17.5" stroke="#963E35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  // 7. Knowledge Insight Lightbulb (Sage)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 31C19 28 14.5 25.5 14.5 19.5C14.5 14.25 18.75 10 24 10C29.25 10 33.5 14.25 33.5 19.5C33.5 25.5 29 28 29 31H19Z" fill="#3E5B42" fill-opacity="0.15" stroke="#3E5B42" stroke-width="1.6" stroke-linejoin="round"/>
    <path d="M20 35H28M21.5 38.5H26.5" stroke="#3E5B42" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M24 16V22M21.5 19H26.5" stroke="#3E5B42" stroke-width="1.3" stroke-linecap="round" stroke-opacity="0.7"/>
  </svg>`,

  // 8. Onboarding Compass (Slate)
  `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="14" fill="#2A4365" fill-opacity="0.12" stroke="#2A4365" stroke-width="1.6"/>
    <polygon points="29.5,18.5 26,26 18.5,29.5 22,22" fill="#2A4365" fill-opacity="0.28" stroke="#2A4365" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="24" cy="24" r="1.4" fill="#2A4365"/>
  </svg>`,
]);

/* --------------------------------------------------------------------------
   LIVING STATIONERY / TRAINING MOTIF BACKGROUND SYSTEM
   -------------------------------------------------------------------------- */
const TrainingMotifSystem = (() => {
  const TARGET_COUNT = 7;
  const DEPTH_PLANES = [
    { className: "depth-near", scale: 1.06, speedMin: 33, speedMax: 42, rotMin: 6, rotMax: 12 },
    { className: "depth-mid",  scale: 0.94, speedMin: 25, speedMax: 33, rotMin: 4, rotMax: 10 },
    { className: "depth-far",  scale: 0.80, speedMin: 18, speedMax: 25, rotMin: 3, rotMax: 7  },
  ];

  let stage = null;
  let toggleBtn = null;
  let toggleLabel = null;
  let items = [];
  let rafId = null;
  let lastTime = 0;
  let isRunning = false;
  let viewportW = 0;
  let viewportH = 0;
  let initialized = false;

  const prefersReducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const state = {
    animations: APP_CONFIG.features.enableFloatingMotifs,
  };

  function readStoredPreference() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.storage.floatingMotifsKey);
      if (saved === "true") return true;
      if (saved === "false") return false;
    } catch (_) {
      // Storage access resilience
    }
    return APP_CONFIG.features.enableFloatingMotifs;
  }

  function writeStoredPreference(enabled) {
    try {
      localStorage.setItem(APP_CONFIG.storage.floatingMotifsKey, String(enabled));
    } catch (_) {
      // Storage access resilience
    }
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function renderItem(g) {
    const xPx = (g.xPercent / 100) * viewportW - 24;
    g.el.style.transform = `translate3d(${xPx.toFixed(2)}px, ${g.y.toFixed(2)}px, 0) rotate(${g.rotation.toFixed(2)}deg) scale(${g.scale})`;
  }

  function seedItems() {
    if (!stage) return;
    stage.innerHTML = "";
    items = [];

    viewportW = window.innerWidth;
    viewportH = window.innerHeight;

    const svgOffset = Math.floor(Math.random() * TRAINING_MOTIF_SVGS.length);

    for (let i = 0; i < TARGET_COUNT; i++) {
      const plane = DEPTH_PLANES[i % DEPTH_PLANES.length];
      const el = document.createElement("div");
      el.className = `training-motif ${plane.className}`;
      el.innerHTML = TRAINING_MOTIF_SVGS[(i + svgOffset) % TRAINING_MOTIF_SVGS.length];

      const jitter = randomRange(-10, 10);
      const item = {
        el,
        xPercent: randomRange(10, 90),
        y: (viewportH / TARGET_COUNT) * i + jitter,
        speed: randomRange(plane.speedMin, plane.speedMax),
        rotation: randomRange(0, 360),
        rotSpeed: (Math.random() < 0.5 ? -1 : 1) * randomRange(plane.rotMin, plane.rotMax),
        scale: plane.scale,
      };

      stage.appendChild(el);
      renderItem(item);
      items.push(item);
    }
  }

  function tick(now) {
    if (!isRunning) return;

    if (!document.hidden && state.animations && !prefersReducedQuery.matches) {
      const delta = Math.min((now - lastTime) / 1000, 0.08);
      for (let i = 0; i < items.length; i++) {
        const g = items[i];
        g.y -= g.speed * delta;
        g.rotation = (g.rotation + g.rotSpeed * delta) % 360;

        if (g.y < -60) {
          g.y = viewportH + 40;
          g.xPercent = randomRange(10, 90);
        }

        renderItem(g);
      }
    }

    lastTime = now;
    rafId = window.requestAnimationFrame(tick);
  }

  function updateUI() {
    if (stage) {
      stage.classList.toggle("is-disabled", !state.animations);
    }
    if (toggleBtn) {
      toggleBtn.setAttribute("aria-pressed", String(state.animations));
      toggleBtn.classList.toggle("is-off", !state.animations);
    }
    if (toggleLabel) {
      toggleLabel.textContent = state.animations ? "MOTIFS: ON" : "MOTIFS: OFF";
    }
  }

  function start() {
    updateUI();
    if (!stage || !state.animations || prefersReducedQuery.matches) return;
    if (isRunning) return;

    isRunning = true;
    lastTime = performance.now();
    rafId = window.requestAnimationFrame(tick);
  }

  function stop() {
    isRunning = false;
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    updateUI();
  }

  function setAnimationsEnabled(enabled, persist = true) {
    state.animations = Boolean(enabled);
    if (persist) {
      writeStoredPreference(state.animations);
    }
    if (state.animations && !prefersReducedQuery.matches) {
      start();
    } else {
      stop();
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    stage = document.getElementById("training-motif-stage");
    toggleBtn = document.getElementById("toggle-animations");
    toggleLabel = document.getElementById("motionToggleLabel");

    if (!stage) return;

    state.animations = readStoredPreference();
    seedItems();

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        triggerHapticPulse();
        setAnimationsEnabled(!state.animations, true);
      });
    }

    window.addEventListener("resize", () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      for (let i = 0; i < items.length; i++) {
        renderItem(items[i]);
      }
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        lastTime = performance.now();
      }
    });

    window.addEventListener("storage", (e) => {
      if (e.key === APP_CONFIG.storage.floatingMotifsKey) {
        const nextVal = e.newValue === null
          ? APP_CONFIG.features.enableFloatingMotifs
          : e.newValue === "true";
        setAnimationsEnabled(nextVal, false);
      }
    });

    const handleMotionPrefChange = () => {
      if (prefersReducedQuery.matches) {
        stop();
      } else if (state.animations) {
        start();
      }
    };

    if (typeof prefersReducedQuery.addEventListener === "function") {
      prefersReducedQuery.addEventListener("change", handleMotionPrefChange);
    } else if (typeof prefersReducedQuery.addListener === "function") {
      prefersReducedQuery.addListener(handleMotionPrefChange);
    }

    if (state.animations && !prefersReducedQuery.matches) {
      start();
    } else {
      stop();
    }
  }

  return {
    init,
    start,
    stop,
    setAnimationsEnabled,
    getState: () => ({ ...state }),
  };
})();

/* --------------------------------------------------------------------------
   TACTILE MICRO-HAPTIC CONTROLLER
   -------------------------------------------------------------------------- */
function triggerHapticPulse() {
  if (
    APP_CONFIG.features.enableHapticFeedback &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  ) {
    try {
      navigator.vibrate(12);
    } catch (_) {
      // Graceful fallback for restricted contexts
    }
  }
}

/* --------------------------------------------------------------------------
   SERVICE WORKER REGISTRATION (OFFLINE & INSTALLABLE PWA)
   -------------------------------------------------------------------------- */
function registerServiceWorker() {
  if (
    !APP_CONFIG.features.enableServiceWorker ||
    typeof navigator === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        APP_CONFIG.features.serviceWorkerPath,
        { scope: "./" }
      );

      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            newWorker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
    }
  };

  if (document.readyState === "complete") {
    register();
  } else {
    window.addEventListener("load", register);
  }
}

registerServiceWorker();

/* --------------------------------------------------------------------------
   PWA INSTALL PROMPT CONTROLLER (beforeinstallprompt)
   -------------------------------------------------------------------------- */
let deferredInstallPrompt = null;

function initInstallPrompt() {
  const installBtn = document.getElementById("installAppBtn");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (installBtn) {
      installBtn.hidden = false;
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (!deferredInstallPrompt) return;
      triggerHapticPulse();
      installBtn.disabled = true;
      try {
        await deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
      } catch (err) {
        console.warn("Install prompt failed:", err);
      } finally {
        deferredInstallPrompt = null;
        installBtn.hidden = true;
        installBtn.disabled = false;
      }
    });
  }

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    if (installBtn) {
      installBtn.hidden = true;
    }
  });
}

/* ==========================================================================
   IMMERSIVE ONBOARDING, SPOTLIGHT TOUR & DEMO FOLLOW-UP SYSTEM
   ========================================================================== */
const OnboardingSystem = (() => {
  const NS = ONBOARDING_CONFIG.storageNamespace;
  const KEYS = {
    status: `${NS}_status`,           // "completed" | "skipped"
    enteredAt: `${NS}_entered_at`,    // timestamp ms when user entered app
    followupDone: `${NS}_followup`,   // "shown" | "dismissed"
  };

  let activeSteps = [];
  let currentStepIndex = 0;
  let isTourActive = false;
  let activeTargetEl = null;
  let demoTimerId = null;
  let repositionRafId = null;
  let previousFocusEl = null;

  const prefersReducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Cached DOM references
  let els = {};

  /* --- Storage Helpers --- */
  function readStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (_) {
      // Storage resilience
    }
  }

  /* --- Step Filtering (Graceful Handling of Missing/Hidden Elements) --- */
  function resolveAvailableSteps() {
    return TOUR_STEPS.filter((step) => {
      const target = document.querySelector(step.selector);
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
  }

  /* --- Stage 1: Welcome Screen Controls --- */
  function showWelcome() {
    document.body.classList.add("intro-active");
    if (els.introStartTourBtn) {
      window.setTimeout(() => els.introStartTourBtn.focus({ preventScroll: true }), 80);
    }
  }

  function hideWelcome() {
    document.body.classList.remove("intro-active");
    try {
      sessionStorage.setItem(APP_CONFIG.storage.visitedIntroKey, "true");
    } catch (_) {
      // Storage resilience
    }
  }

  function skipOnboardingFromWelcome() {
    triggerHapticPulse();
    hideWelcome();
    writeStorage(KEYS.status, "skipped");
    enterApplicationSession();
  }

  /* --- Stage 2: Guided Tour Engine --- */
  function startTour() {
    triggerHapticPulse();
    previousFocusEl = document.activeElement;
    hideWelcome();

    activeSteps = resolveAvailableSteps();
    if (activeSteps.length === 0) {
      completeTour();
      return;
    }

    currentStepIndex = 0;
    isTourActive = true;

    if (els.tourOverlay) {
      els.tourOverlay.hidden = false;
      els.tourOverlay.setAttribute("aria-hidden", "false");
    }

    renderStep(currentStepIndex);

    if (els.tourNextBtn) {
      els.tourNextBtn.focus({ preventScroll: true });
    }
  }

  function clearActiveTarget() {
    if (activeTargetEl) {
      activeTargetEl.classList.remove("tour-target-active");
      activeTargetEl = null;
    }
  }

  function renderStep(index) {
    if (!isTourActive || index < 0 || index >= activeSteps.length) return;

    const step = activeSteps[index];
    const target = document.querySelector(step.selector);

    if (!target) {
      // Skip missing element gracefully
      if (index + 1 < activeSteps.length) {
        currentStepIndex = index + 1;
        renderStep(currentStepIndex);
      } else {
        completeTour();
      }
      return;
    }

    clearActiveTarget();
    activeTargetEl = target;
    activeTargetEl.classList.add("tour-target-active");

    // Subtle transition state on panel content
    if (els.tourPanel) {
      els.tourPanel.classList.add("is-transitioning");
      els.tourPanel.style.setProperty("--tour-accent", step.accent || "#3E5B42");
    }
    if (els.tourSpotlightRing) {
      els.tourSpotlightRing.style.setProperty("--tour-accent", step.accent || "#3E5B42");
    }

    // Visual companion reaction
    if (els.tourCompanion && !prefersReducedQuery.matches) {
      els.tourCompanion.classList.remove("is-reacting");
      void els.tourCompanion.offsetWidth;
      els.tourCompanion.classList.add("is-reacting");
      window.setTimeout(() => {
        if (els.tourCompanion) els.tourCompanion.classList.remove("is-reacting");
      }, 460);
    }

    // Update text & progress
    const total = activeSteps.length;
    const stepNum = String(index + 1).padStart(2, "0");
    const totalNum = String(total).padStart(2, "0");

    if (els.tourStepCounter) els.tourStepCounter.textContent = `${stepNum} / ${totalNum}`;
    if (els.tourStepBadge) els.tourStepBadge.textContent = step.badge;
    if (els.tourProgressFill) {
      els.tourProgressFill.style.width = `${((index + 1) / total) * 100}%`;
    }
    if (els.tourStepTitle) els.tourStepTitle.textContent = step.title;
    if (els.tourStepBody) els.tourStepBody.textContent = step.body;
    if (els.tourStepBenefit) els.tourStepBenefit.textContent = step.benefit;

    if (els.tourBackBtn) {
      els.tourBackBtn.disabled = index === 0;
    }
    if (els.tourNextBtn) {
      els.tourNextBtn.textContent = index === total - 1 ? "Finish Tour \u2192" : "Next \u2192";
    }

    // Smoothly scroll target into view if needed, then position spotlight & panel
    const rect = target.getBoundingClientRect();
    const isOffscreen =
      rect.top < 12 ||
      rect.bottom > window.innerHeight - 12 ||
      rect.left < 12 ||
      rect.right > window.innerWidth - 12;

    if (isOffscreen && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({
        behavior: prefersReducedQuery.matches ? "auto" : "smooth",
        block: "center",
        inline: "center",
      });
      window.setTimeout(() => positionSpotlightAndPanel(step, target), prefersReducedQuery.matches ? 20 : 320);
    } else {
      positionSpotlightAndPanel(step, target);
    }

    window.setTimeout(() => {
      if (els.tourPanel) els.tourPanel.classList.remove("is-transitioning");
    }, 90);
  }

  function positionSpotlightAndPanel(step, target) {
    if (!isTourActive || !target) return;

    const rect = target.getBoundingClientRect();
    const pad = step.padding ?? 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const spotX = Math.max(4, rect.left - pad);
    const spotY = Math.max(4, rect.top - pad);
    const spotW = Math.min(vw - spotX - 4, rect.width + pad * 2);
    const spotH = Math.min(vh - spotY - 4, rect.height + pad * 2);
    const radius = Math.min(step.radius ?? 16, Math.min(spotW, spotH) / 2);

    // Update SVG cutout mask
    if (els.tourMaskCutout) {
      els.tourMaskCutout.setAttribute("x", spotX.toFixed(1));
      els.tourMaskCutout.setAttribute("y", spotY.toFixed(1));
      els.tourMaskCutout.setAttribute("width", Math.max(0, spotW).toFixed(1));
      els.tourMaskCutout.setAttribute("height", Math.max(0, spotH).toFixed(1));
      els.tourMaskCutout.setAttribute("rx", radius.toFixed(1));
      els.tourMaskCutout.setAttribute("ry", radius.toFixed(1));
    }

    // Update illuminated ring
    if (els.tourSpotlightRing) {
      els.tourSpotlightRing.style.left = `${spotX.toFixed(1)}px`;
      els.tourSpotlightRing.style.top = `${spotY.toFixed(1)}px`;
      els.tourSpotlightRing.style.width = `${Math.max(0, spotW).toFixed(1)}px`;
      els.tourSpotlightRing.style.height = `${Math.max(0, spotH).toFixed(1)}px`;
      els.tourSpotlightRing.style.borderRadius = `${radius.toFixed(1)}px`;
    }

    // Position information panel intelligently
    if (!els.tourPanel) return;

    const panelRect = els.tourPanel.getBoundingClientRect();
    const panelW = panelRect.width || Math.min(370, vw - 24);
    const panelH = panelRect.height || 240;
    const gap = 16;
    const margin = 12;

    // Mobile layout: place at bottom or top so spotlight remains visible
    if (vw <= 640) {
      const spaceBelow = vh - (spotY + spotH) - margin;
      const spaceAbove = spotY - margin;

      let topPos;
      if (spaceBelow >= panelH + 10 || spaceBelow >= spaceAbove) {
        topPos = Math.min(vh - panelH - margin, spotY + spotH + 12);
      } else {
        topPos = Math.max(margin, spotY - panelH - 12);
      }
      topPos = Math.max(margin, Math.min(topPos, vh - panelH - margin));
      els.tourPanel.style.top = `${topPos.toFixed(1)}px`;
      els.tourPanel.style.left = "10px";
      return;
    }

    // Desktop / Tablet: evaluate candidate placements and pick best non-overlapping fit
    const candidates = [];
    const pref = step.preferredPosition || "bottom";
    const order = [pref, "right", "left", "bottom", "top"].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    order.forEach((pos) => {
      let x = 0;
      let y = 0;
      if (pos === "right") {
        x = spotX + spotW + gap;
        y = spotY + spotH / 2 - panelH / 2;
      } else if (pos === "left") {
        x = spotX - panelW - gap;
        y = spotY + spotH / 2 - panelH / 2;
      } else if (pos === "bottom") {
        x = spotX + spotW / 2 - panelW / 2;
        y = spotY + spotH + gap;
      } else if (pos === "top") {
        x = spotX + spotW / 2 - panelW / 2;
        y = spotY - panelH - gap;
      }

      const clampedX = Math.max(margin, Math.min(x, vw - panelW - margin));
      const clampedY = Math.max(margin, Math.min(y, vh - panelH - margin));

      // Compute overlap area with spotlight box
      const overlapW = Math.max(0, Math.min(clampedX + panelW, spotX + spotW) - Math.max(clampedX, spotX));
      const overlapH = Math.max(0, Math.min(clampedY + panelH, spotY + spotH) - Math.max(clampedY, spotY));
      const overlapArea = overlapW * overlapH;

      // Also penalize if clamping pushed it away from ideal side
      const clampShift = Math.abs(clampedX - x) + Math.abs(clampedY - y);
      candidates.push({ x: clampedX, y: clampedY, score: overlapArea * 10 + clampShift });
    });

    candidates.sort((a, b) => a.score - b.score);
    const best = candidates[0];
    els.tourPanel.style.left = `${best.x.toFixed(1)}px`;
    els.tourPanel.style.top = `${best.y.toFixed(1)}px`;
  }

  function nextStep() {
    triggerHapticPulse();
    if (!isTourActive) return;
    if (currentStepIndex + 1 < activeSteps.length) {
      currentStepIndex += 1;
      renderStep(currentStepIndex);
    } else {
      completeTour();
    }
  }

  function prevStep() {
    triggerHapticPulse();
    if (!isTourActive || currentStepIndex <= 0) return;
    currentStepIndex -= 1;
    renderStep(currentStepIndex);
  }

  function closeTour(reason = "skipped") {
    triggerHapticPulse();
    isTourActive = false;
    clearActiveTarget();

    if (els.tourOverlay) {
      els.tourOverlay.hidden = true;
      els.tourOverlay.setAttribute("aria-hidden", "true");
    }

    if (reason === "skipped") {
      const existing = readStorage(KEYS.status);
      if (existing !== "completed") {
        writeStorage(KEYS.status, "skipped");
      }
      enterApplicationSession();
    }

    if (previousFocusEl && typeof previousFocusEl.focus === "function") {
      previousFocusEl.focus({ preventScroll: true });
    }
  }

  /* --- Stage 3: Tour Completion Experience --- */
  function spawnConfetti() {
    if (!els.tourConfettiStage || prefersReducedQuery.matches) return;
    els.tourConfettiStage.innerHTML = "";
    const colors = ["#3E5B42", "#963E35", "#6E5614", "#2A4365", "#A4B99C"];
    for (let i = 0; i < 22; i++) {
      const piece = document.createElement("span");
      piece.className = "tour-confetti-piece";
      piece.style.left = `${5 + Math.random() * 90}%`;
      piece.style.backgroundColor = colors[i % colors.length];
      piece.style.animationDelay = `${(Math.random() * 0.45).toFixed(2)}s`;
      piece.style.animationDuration = `${(1.3 + Math.random() * 0.8).toFixed(2)}s`;
      els.tourConfettiStage.appendChild(piece);
    }
  }

  function completeTour() {
    isTourActive = false;
    clearActiveTarget();

    if (els.tourOverlay) {
      els.tourOverlay.hidden = true;
      els.tourOverlay.setAttribute("aria-hidden", "true");
    }

    writeStorage(KEYS.status, "completed");

    if (els.tourCompletionOverlay) {
      els.tourCompletionOverlay.hidden = false;
      spawnConfetti();
      if (els.tourCompletionDoneBtn) {
        window.setTimeout(() => els.tourCompletionDoneBtn.focus({ preventScroll: true }), 80);
      }
    } else {
      enterApplicationSession();
    }
  }

  function dismissCompletionModal() {
    triggerHapticPulse();
    if (els.tourCompletionOverlay) {
      els.tourCompletionOverlay.hidden = true;
    }
    enterApplicationSession();
  }

  /* --- Stage 4: Five-Minute Demo Follow-Up Timer --- */
  function enterApplicationSession() {
    if (!ONBOARDING_CONFIG.demoMode) return;

    const followupState = readStorage(KEYS.followupDone);
    if (followupState === "shown" || followupState === "dismissed") {
      return;
    }

    // Record entry timestamp once so replays do not reset or duplicate timers
    let enteredAt = Number(readStorage(KEYS.enteredAt));
    if (!enteredAt || Number.isNaN(enteredAt)) {
      enteredAt = Date.now();
      writeStorage(KEYS.enteredAt, enteredAt);
    }

    scheduleDemoFollowup(enteredAt);
  }

  function scheduleDemoFollowup(enteredAt) {
    if (!ONBOARDING_CONFIG.demoMode) return;
    if (demoTimerId !== null) return; // Never create duplicate timers

    const followupState = readStorage(KEYS.followupDone);
    if (followupState === "shown" || followupState === "dismissed") return;

    const elapsed = Date.now() - enteredAt;
    const remaining = Math.max(0, ONBOARDING_CONFIG.demoNotificationDelayMs - elapsed);

    demoTimerId = window.setTimeout(() => {
      demoTimerId = null;
      showDemoFollowup();
    }, remaining);
  }

  function showDemoFollowup() {
    if (!ONBOARDING_CONFIG.demoMode) return;
    if (isTourActive || document.body.classList.contains("intro-active")) {
      // Wait until user is actually in the app
      return;
    }

    const followupState = readStorage(KEYS.followupDone);
    if (followupState === "shown" || followupState === "dismissed") return;

    writeStorage(KEYS.followupDone, "shown");

    if (els.demoVisitWebsiteBtn) {
      const url = (ONBOARDING_CONFIG.websiteUrl || "").trim();
      if (url) {
        els.demoVisitWebsiteBtn.href = url;
        els.demoVisitWebsiteBtn.hidden = false;
      } else {
        els.demoVisitWebsiteBtn.hidden = true;
      }
    }

    if (els.demoContactBtn) {
      const contactUrl = (ONBOARDING_CONFIG.contactUrl || "").trim();
      if (contactUrl) {
        els.demoContactBtn.href = contactUrl;
        if (/^https?:\/\//i.test(contactUrl)) {
          els.demoContactBtn.target = "_blank";
          els.demoContactBtn.rel = "noopener noreferrer";
        }
      } else {
        els.demoContactBtn.href = "#contact-unconfigured";
      }
    }

    if (els.demoFollowupToast) {
      els.demoFollowupToast.hidden = false;
    }
  }

  function dismissDemoFollowup() {
    triggerHapticPulse();
    writeStorage(KEYS.followupDone, "dismissed");
    if (els.demoFollowupToast) {
      els.demoFollowupToast.hidden = true;
    }
  }

  /* --- Replay Functionality --- */
  function replayTour() {
    if (!ONBOARDING_CONFIG.allowReplay) return;
    triggerHapticPulse();
    if (els.tourCompletionOverlay) {
      els.tourCompletionOverlay.hidden = true;
    }
    startTour();
  }

  /* --- Viewport & Keyboard Event Wiring --- */
  function handleViewportChange() {
    if (!isTourActive || !activeSteps[currentStepIndex]) return;
    if (repositionRafId !== null) window.cancelAnimationFrame(repositionRafId);
    repositionRafId = window.requestAnimationFrame(() => {
      repositionRafId = null;
      const step = activeSteps[currentStepIndex];
      const target = document.querySelector(step.selector);
      if (target) positionSpotlightAndPanel(step, target);
    });
  }

  function handleKeydown(e) {
    // Handle Welcome Screen keys
    if (document.body.classList.contains("intro-active")) {
      if (e.key === "Escape") {
        e.preventDefault();
        skipOnboardingFromWelcome();
      }
      return;
    }

    // Handle Completion Modal keys
    if (els.tourCompletionOverlay && !els.tourCompletionOverlay.hidden) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        dismissCompletionModal();
      }
      return;
    }

    // Handle Active Guided Tour keys
    if (isTourActive) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeTour("skipped");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      }
    }
  }

  /* --- Initialization --- */
  function init() {
    els = {
      introScreen: document.getElementById("introScreen"),
      introEyebrow: document.getElementById("introEyebrow"),
      introTitle: document.getElementById("introTitle"),
      introSubtitle: document.getElementById("introSubtitle"),
      introStartTourBtn: document.getElementById("introStartTourBtn"),
      introDismissBtn: document.getElementById("introDismissBtn"),
      replayTourBtn: document.getElementById("replayTourBtn"),

      tourOverlay: document.getElementById("tourOverlay"),
      tourBackdropSvg: document.getElementById("tourBackdropSvg"),
      tourMaskCutout: document.getElementById("tourMaskCutout"),
      tourSpotlightRing: document.getElementById("tourSpotlightRing"),
      tourPanel: document.getElementById("tourPanel"),
      tourCompanion: document.getElementById("tourCompanion"),
      tourStepCounter: document.getElementById("tourStepCounter"),
      tourStepBadge: document.getElementById("tourStepBadge"),
      tourProgressFill: document.getElementById("tourProgressFill"),
      tourStepTitle: document.getElementById("tourStepTitle"),
      tourStepBody: document.getElementById("tourStepBody"),
      tourStepBenefit: document.getElementById("tourStepBenefit"),
      tourBackBtn: document.getElementById("tourBackBtn"),
      tourNextBtn: document.getElementById("tourNextBtn"),
      tourSkipBtn: document.getElementById("tourSkipBtn"),
      tourCloseBtn: document.getElementById("tourCloseBtn"),

      tourCompletionOverlay: document.getElementById("tourCompletionOverlay"),
      tourConfettiStage: document.getElementById("tourConfettiStage"),
      tourCompletionDoneBtn: document.getElementById("tourCompletionDoneBtn"),

      demoFollowupToast: document.getElementById("demoFollowupToast"),
      demoFollowupDismissBtn: document.getElementById("demoFollowupDismissBtn"),
      demoVisitWebsiteBtn: document.getElementById("demoVisitWebsiteBtn"),
      demoContactBtn: document.getElementById("demoContactBtn"),
      demoFollowupNotice: document.getElementById("demoFollowupNotice"),
    };

    // Hydrate welcome copy from APP_CONFIG
    if (els.introEyebrow) els.introEyebrow.textContent = APP_CONFIG.content.intro.eyebrow;
    if (els.introTitle) els.introTitle.textContent = APP_CONFIG.content.intro.title;
    if (els.introSubtitle) els.introSubtitle.textContent = APP_CONFIG.content.intro.subtitle;
    if (els.introStartTourBtn) els.introStartTourBtn.textContent = APP_CONFIG.content.intro.startTourAction;
    if (els.introDismissBtn) els.introDismissBtn.textContent = APP_CONFIG.content.intro.action;

    if (els.replayTourBtn && !ONBOARDING_CONFIG.allowReplay) {
      els.replayTourBtn.hidden = true;
    }

    // Wire Welcome buttons
    if (els.introStartTourBtn) {
      els.introStartTourBtn.addEventListener("click", startTour);
    }
    if (els.introDismissBtn) {
      els.introDismissBtn.addEventListener("click", skipOnboardingFromWelcome);
    }
    if (els.introScreen) {
      els.introScreen.addEventListener("click", (e) => {
        if (e.target === els.introScreen) skipOnboardingFromWelcome();
      });
    }

    // Wire Tour controls
    if (els.tourNextBtn) els.tourNextBtn.addEventListener("click", nextStep);
    if (els.tourBackBtn) els.tourBackBtn.addEventListener("click", prevStep);
    if (els.tourSkipBtn) els.tourSkipBtn.addEventListener("click", () => closeTour("skipped"));
    if (els.tourCloseBtn) els.tourCloseBtn.addEventListener("click", () => closeTour("skipped"));
    if (els.tourBackdropSvg) {
      els.tourBackdropSvg.addEventListener("click", () => closeTour("skipped"));
    }

    // Wire Completion & Replay controls
    if (els.tourCompletionDoneBtn) {
      els.tourCompletionDoneBtn.addEventListener("click", dismissCompletionModal);
    }
    if (els.replayTourBtn) {
      els.replayTourBtn.addEventListener("click", replayTour);
    }

    // Wire Demo Follow-up controls
    if (els.demoFollowupDismissBtn) {
      els.demoFollowupDismissBtn.addEventListener("click", dismissDemoFollowup);
    }
    if (els.demoContactBtn) {
      els.demoContactBtn.addEventListener("click", (e) => {
        const contactUrl = (ONBOARDING_CONFIG.contactUrl || "").trim();
        if (!contactUrl) {
          e.preventDefault();
          if (els.demoFollowupNotice) {
            els.demoFollowupNotice.textContent =
              "Contact link is not yet configured in ONBOARDING_CONFIG.contactUrl.";
            els.demoFollowupNotice.hidden = false;
          }
        }
      });
    }

    // Global listeners
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener("orientationchange", handleViewportChange, { passive: true });
    window.addEventListener("keydown", handleKeydown);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && ONBOARDING_CONFIG.demoMode) {
        const status = readStorage(KEYS.status);
        const enteredAt = Number(readStorage(KEYS.enteredAt));
        if ((status === "completed" || status === "skipped") && enteredAt) {
          if (Date.now() - enteredAt >= ONBOARDING_CONFIG.demoNotificationDelayMs) {
            showDemoFollowup();
          }
        }
      }
    });

    // Determine initial onboarding state
    const savedStatus = readStorage(KEYS.status);
    if (savedStatus === "completed" || savedStatus === "skipped" || !ONBOARDING_CONFIG.autoStartTutorial) {
      hideWelcome();
      enterApplicationSession();
    } else {
      showWelcome();
    }
  }

  return {
    init,
    startTour,
    replayTour,
    closeTour,
  };
})();

/* --------------------------------------------------------------------------
   APPLICATION RUNTIME CONTROLLER
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Background Training Motifs
  TrainingMotifSystem.init();
  initInstallPrompt();

  // DOM References
  const pageEyebrowSlot = document.getElementById("pageEyebrowSlot");
  const pageTitleSlot = document.getElementById("pageTitleSlot");
  const pageSubtitleSlot = document.getElementById("pageSubtitleSlot");
  const recordWrap = document.getElementById("centerRecordWrap");
  const recordDisc = document.getElementById("recordDisc");
  const vinylImg = document.getElementById("vinylCoreImg");
  const tiles = Array.from(document.querySelectorAll(".square-tile"));
  const orbs = Array.from(document.querySelectorAll(".ambient-canvas .orb"));
  const statusEl = document.getElementById("systemStatus");
  const bottomDockNavItems = document.getElementById("bottomDockNavItems");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isNavigating = false;

  /* --- 1. CONFIGURATION HYDRATION --- */
  function hydrateAppFromConfig() {
    document.title = APP_CONFIG.identity.appName;

    if (pageEyebrowSlot) pageEyebrowSlot.textContent = APP_CONFIG.content.headers.eyebrow;
    if (pageTitleSlot) pageTitleSlot.textContent = APP_CONFIG.content.headers.title;
    if (pageSubtitleSlot) pageSubtitleSlot.textContent = APP_CONFIG.content.headers.subtitle;

    if (recordDisc) {
      recordDisc.href = APP_CONFIG.website.url;
    }

    // Sector labels hydration
    const s = APP_CONFIG.content.sectors;
    const catLib = document.getElementById("catLabelLibrary");
    const nameLib = document.getElementById("nameLabelLibrary");
    const descLib = document.getElementById("descLabelLibrary");
    if (catLib) catLib.textContent = s.library.category;
    if (nameLib) nameLib.textContent = s.library.name;
    if (descLib) descLib.textContent = s.library.description;

    const catVid = document.getElementById("catLabelVideos");
    const nameVid = document.getElementById("nameLabelVideos");
    const descVid = document.getElementById("descLabelVideos");
    if (catVid) catVid.textContent = s.videos.category;
    if (nameVid) nameVid.textContent = s.videos.name;
    if (descVid) descVid.textContent = s.videos.description;

    const catGam = document.getElementById("catLabelGames");
    const nameGam = document.getElementById("nameLabelGames");
    const descGam = document.getElementById("descLabelGames");
    if (catGam) catGam.textContent = s.games.category;
    if (nameGam) nameGam.textContent = s.games.name;
    if (descGam) descGam.textContent = s.games.description;

    const catChk = document.getElementById("catLabelChecklists");
    const nameChk = document.getElementById("nameLabelChecklists");
    const descChk = document.getElementById("descLabelChecklists");
    if (catChk) catChk.textContent = s.checklists.category;
    if (nameChk) nameChk.textContent = s.checklists.name;
    if (descChk) descChk.textContent = s.checklists.description;

    // Bottom Dock Items Hydration
    if (bottomDockNavItems) {
      bottomDockNavItems.innerHTML = "";
      APP_CONFIG.navigation.items.forEach((item) => {
        const link = document.createElement("a");
        link.className = "nav-tab-item interactive-tactile";
        link.href = item.route;
        link.setAttribute("data-target", item.id);
        link.innerHTML = `
          <span>${item.label}</span>
          <span class="nav-tab-item__indicator" aria-hidden="true"></span>
        `;
        link.addEventListener("click", (e) => {
          triggerHapticPulse();
          const targetTile = tiles.find((t) => t.getAttribute("data-target") === item.id);
          if (targetTile) {
            navigateSector(targetTile, e);
          }
        });
        bottomDockNavItems.appendChild(link);
      });
    }
  }

  hydrateAppFromConfig();

  /* --- 2. ASSET RESILIENCE --- */
  if (vinylImg) {
    vinylImg.addEventListener("error", () => {
      vinylImg.style.display = "none";
      const artLayer = vinylImg.parentElement;
      if (artLayer) {
        artLayer.style.background = "radial-gradient(circle, #E5E2D9 0%, #C8C5BA 80%)";
      }
    }, { once: true });
  }

  /* --- 3. INITIALIZE IMMERSIVE ONBOARDING & TOUR SYSTEM --- */
  OnboardingSystem.init();

  /* --- 4. RESPONSIVE VINYL SIZING --- */
  function getDimensions() {
    const isMobile = window.innerWidth <= APP_CONFIG.physics.mobileBreakpointPx;
    return isMobile ? APP_CONFIG.physics.mobile : APP_CONFIG.physics.desktop;
  }

  let dims = getDimensions();
  let isLaunching = false;
  let launchResetTimer = null;

  function applySizes(size) {
    const cutoutRadius = (size / 2) + dims.cutoutClearance;
    document.documentElement.style.setProperty("--disc-size", `${size.toFixed(2)}px`);
    document.documentElement.style.setProperty("--cutout-r", `${cutoutRadius.toFixed(2)}px`);
  }

  applySizes(dims.normalDiscSize);

  window.addEventListener("resize", () => {
    dims = getDimensions();
    if (!isLaunching) applySizes(dims.normalDiscSize);
  }, { passive: true });

  /* --- 5. WEBSITE VINYL LAUNCH --- */
  function resetLaunchState() {
    isLaunching = false;
    if (launchResetTimer) {
      window.clearTimeout(launchResetTimer);
      launchResetTimer = null;
    }
    if (recordDisc) {
      recordDisc.removeAttribute("aria-busy");
      recordDisc.style.removeProperty("--launch-scale");
    }
    if (recordWrap) {
      recordWrap.classList.remove("is-launching");
    }
  }

  function launchWebsite(event) {
    if (isLaunching) {
      if (event) event.preventDefault();
      return;
    }

    isLaunching = true;
    triggerHapticPulse();

    if (recordDisc) {
      recordDisc.href = APP_CONFIG.website.url;
      recordDisc.setAttribute("aria-busy", "true");

      if (!prefersReduced) {
        const discDiameter = recordDisc.getBoundingClientRect().width;
        const coverScale = (Math.hypot(window.innerWidth, window.innerHeight) * 1.08) / discDiameter;
        recordDisc.style.setProperty("--launch-scale", coverScale.toString());
        document.documentElement.style.setProperty(
          "--launch-transition-duration",
          `${APP_CONFIG.website.transitionDurationMs}ms`,
        );
        if (recordWrap) recordWrap.classList.add("is-launching");
      }
    }

    const resetDelay = Math.max(APP_CONFIG.website.transitionDurationMs + 700, 1000);
    launchResetTimer = window.setTimeout(resetLaunchState, resetDelay);
  }

  if (recordDisc) {
    recordDisc.addEventListener("click", (e) => {
      e.stopPropagation();
      launchWebsite(e);
    });

    recordDisc.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        e.preventDefault();
        recordDisc.click();
      }
    });
  }

  window.addEventListener("focus", resetLaunchState);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) resetLaunchState();
  });

  /* --- 6. SPOTLIGHT & TACTILE PARALLAX --- */
  if (!prefersReduced && APP_CONFIG.features.enableParallax) {
    tiles.forEach((tile) => {
      tile.addEventListener("pointermove", (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        tile.style.setProperty("--mouse-x", `${x}px`);
        tile.style.setProperty("--mouse-y", `${y}px`);

        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const pX = (((x - midX) / midX) * APP_CONFIG.physics.parallaxStrength).toFixed(2);
        const pY = (((y - midY) / midY) * APP_CONFIG.physics.parallaxStrength).toFixed(2);

        tile.style.setProperty("--parallax-x", `${pX}px`);
        tile.style.setProperty("--parallax-y", `${pY}px`);
      });

      tile.addEventListener("pointerleave", () => {
        tile.style.setProperty("--parallax-x", "0px");
        tile.style.setProperty("--parallax-y", "0px");
      });
    });

    window.addEventListener("pointermove", (e) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 16;
      const normY = (e.clientY / window.innerHeight - 0.5) * 16;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * APP_CONFIG.physics.orbParallaxFactor;
        orb.style.transform = `translate3d(${normX * factor}px, ${normY * factor}px, 0)`;
      });
    }, { passive: true });
  }

  /* --- 7. ROUTE NAVIGATION --- */
  function navigateSector(tile, event) {
    if (event) event.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    triggerHapticPulse();

    const targetKey = tile.getAttribute("data-target");
    const targetUrl = APP_CONFIG.navigation.routes[targetKey] || tile.getAttribute("href") || "#";

    if (prefersReduced) {
      window.location.href = targetUrl;
      return;
    }

    document.body.classList.add("is-leaving");
    tile.classList.add("is-selected");

    setTimeout(() => {
      window.location.href = targetUrl;
    }, APP_CONFIG.features.navigationDelayMs);
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", (e) => navigateSector(tile, e));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        navigateSector(tile, e);
      }
    });
  });

  /* --- 8. ACCESSIBLE KEYBOARD GRID NAVIGATION --- */
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("intro-active")) return;
    const tourOverlay = document.getElementById("tourOverlay");
    if (tourOverlay && !tourOverlay.hidden) return;

    const activeEl = document.activeElement;
    const currentIndex = tiles.indexOf(activeEl);

    if (currentIndex === -1) {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        tiles[0].focus();
        e.preventDefault();
      }
      return;
    }

    let nextIndex = currentIndex;
    // Layout indices: 0: TL, 1: TR, 2: BL, 3: BR
    switch (e.key) {
      case "ArrowRight":
        if (currentIndex === 0) nextIndex = 1;
        if (currentIndex === 2) nextIndex = 3;
        break;
      case "ArrowLeft":
        if (currentIndex === 1) nextIndex = 0;
        if (currentIndex === 3) nextIndex = 2;
        break;
      case "ArrowDown":
        if (currentIndex === 0) nextIndex = 2;
        if (currentIndex === 1) nextIndex = 3;
        break;
      case "ArrowUp":
        if (currentIndex === 2) nextIndex = 0;
        if (currentIndex === 3) nextIndex = 1;
        break;
      default:
        return;
    }

    if (nextIndex !== currentIndex) {
      e.preventDefault();
      triggerHapticPulse();
      tiles[nextIndex].focus();
    }
  });

  /* --- 9. NETWORK STATUS AUDIT --- */
  function updateNetworkStatus() {
    if (!statusEl) return;
    if (navigator.onLine) {
      statusEl.textContent = APP_CONFIG.content.actions.online;
      statusEl.style.color = "";
    } else {
      statusEl.textContent = APP_CONFIG.content.actions.offline;
      statusEl.style.color = "var(--color-terracotta-text)";
    }
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
  updateNetworkStatus();

  /* --- 10. PAGESHOW CACHE RESTORATION --- */
  window.addEventListener("pageshow", (e) => {
    resetLaunchState();
    if (e.persisted) {
      isNavigating = false;
      document.body.classList.remove("is-leaving");
      tiles.forEach((t) => t.classList.remove("is-selected"));
      updateNetworkStatus();
    }
  });
});