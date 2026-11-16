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
    appId: "sDemo Portal",
    appName: "Training Workspace",
    appTagline: "Ongoing Training Hub",
    version: "1.0.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE
  branding: {
    logoUrl: "logo.jpg",
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
      title: "Ongoing Training Hub",
      subtitle: "On demand access to training resources, videos, and checklists for your team",
      action: "Enter Workspace \u2192",
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
    navigationDelayMs: 340,
  },

  // 8. STORAGE KEYS
  storage: {
    visitedIntroKey: "system_directory_intro_dismissed_v2",
    floatingMotifsKey: "training_workspace_animations_v1",
  },
});

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
   APPLICATION RUNTIME CONTROLLER
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Background Training Motifs
  TrainingMotifSystem.init();

  // DOM References
  const introScreen = document.getElementById("introScreen");
  const introDismissBtn = document.getElementById("introDismissBtn");
  const introTitle = document.getElementById("introTitle");
  const introSubtitle = document.getElementById("introSubtitle");
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

    if (introTitle) introTitle.textContent = APP_CONFIG.content.intro.title;
    if (introSubtitle) introSubtitle.textContent = APP_CONFIG.content.intro.subtitle;
    if (introDismissBtn) introDismissBtn.textContent = APP_CONFIG.content.intro.action;

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

  /* --- 3. INTRO SCREEN DISMISSAL --- */
  function dismissIntro() {
    triggerHapticPulse();
    if (!document.body.classList.contains("intro-active")) return;
    document.body.classList.remove("intro-active");
    try {
      sessionStorage.setItem(APP_CONFIG.storage.visitedIntroKey, "true");
    } catch (_) {
      // Storage access resilience
    }
  }

  const hasVisited = (() => {
    try {
      return sessionStorage.getItem(APP_CONFIG.storage.visitedIntroKey) === "true";
    } catch (_) {
      return false;
    }
  })();

  if (hasVisited || prefersReduced) {
    document.body.classList.remove("intro-active");
  } else {
    if (introDismissBtn) introDismissBtn.addEventListener("click", dismissIntro);
    if (introScreen) {
      introScreen.addEventListener("click", (e) => {
        if (e.target === introScreen) dismissIntro();
      });
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        dismissIntro();
      }
    }, { once: true });
  }

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