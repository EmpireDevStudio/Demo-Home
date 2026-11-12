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
    appId: "system-directory-portal",
    appName: "System Directory",
    appTagline: "Tactile Paper Material Portal & System Navigation",
    version: "2.4.0",
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
      eyebrow: "SYSTEM ARCHITECTURE",
      title: "Directory",
      subtitle: "",
    },
    intro: {
      title: "SYSTEM DIRECTORY",
      subtitle: "Archives \u2022 Broadcasts \u2022 Simulations \u2022 Protocols",
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
        description: "Visual broadcasts & cinematic releases",
      },
      games: {
        category: "SIMULATION",
        name: "GAMES",
        description: "Puzzle Games",
      },
      checklists: {
        category: "AUDIT",
        name: "CHECKLISTS",
        description: "Operational protocols & readiness workflows",
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

  // 6. CONTACT LINK (set recipient, subject, and body for the email app)
  contact: {
    recipient: "EmpireDevStudio@gmail.com", // Set this to the destination email address.
    subject: "System Directory inquiry",
    body: "Hello,\n\nI would like to get in touch.",
    transitionDurationMs: 300,
  },

  // 7. FEATURE SWITCHES & UX BEHAVIOURAL CONTROLS
  features: {
    enableHapticFeedback: true,
    enableParallax: true,
    navigationDelayMs: 340,
  },

  // 8. STORAGE KEYS
  storage: {
    visitedIntroKey: "system_directory_intro_dismissed_v2",
  },
});

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
  // DOM References
  const introScreen = document.getElementById("introScreen");
  const introDismissBtn = document.getElementById("introDismissBtn");
  const introTitle = document.getElementById("introTitle");
  const introSubtitle = document.getElementById("introSubtitle");
  const mastheadBackBtn = document.getElementById("mastheadBackBtn");
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

  /* --- 4. BACK NAVIGATION CONTROLLER --- */
  if (mastheadBackBtn) {
    mastheadBackBtn.addEventListener("click", () => {
      triggerHapticPulse();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = APP_CONFIG.navigation.defaultFallbackRoute;
      }
    });
  }

  /* --- 5. RESPONSIVE VINYL SIZING --- */
  function getDimensions() {
    const isMobile = window.innerWidth <= APP_CONFIG.physics.mobileBreakpointPx;
    return isMobile ? APP_CONFIG.physics.mobile : APP_CONFIG.physics.desktop;
  }

  let dims = getDimensions();
  let isContacting = false;

  function applySizes(size) {
    const cutoutRadius = (size / 2) + dims.cutoutClearance;
    document.documentElement.style.setProperty("--disc-size", `${size.toFixed(2)}px`);
    document.documentElement.style.setProperty("--cutout-r", `${cutoutRadius.toFixed(2)}px`);
  }

  applySizes(dims.normalDiscSize);

  window.addEventListener("resize", () => {
    dims = getDimensions();
    if (!isContacting) applySizes(dims.normalDiscSize);
  }, { passive: true });

  function launchContact() {
    if (isContacting) return;
    isContacting = true;
    triggerHapticPulse();
    recordDisc.disabled = true;
    recordDisc.setAttribute("aria-busy", "true");

    const discDiameter = recordDisc.getBoundingClientRect().width;
    const coverScale = (Math.hypot(window.innerWidth, window.innerHeight) * 1.08) / discDiameter;
    recordDisc.style.setProperty("--launch-scale", coverScale.toString());
    document.documentElement.style.setProperty(
      "--contact-transition-duration",
      `${APP_CONFIG.contact.transitionDurationMs}ms`,
    );
    if (recordWrap) recordWrap.classList.add("is-launching");

    const recipient = encodeURIComponent(APP_CONFIG.contact.recipient.trim());
    const subject = encodeURIComponent(APP_CONFIG.contact.subject);
    const body = encodeURIComponent(APP_CONFIG.contact.body);
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    const transitionDelay = prefersReduced ? 80 : APP_CONFIG.contact.transitionDurationMs;

    window.setTimeout(() => {
      window.location.href = mailtoUrl;
    }, transitionDelay);
  }

  if (recordDisc) {
    recordDisc.addEventListener("click", (e) => {
      e.stopPropagation();
      launchContact();
    });
  }

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
    if (e.persisted) {
      isNavigating = false;
      document.body.classList.remove("is-leaving");
      tiles.forEach((t) => t.classList.remove("is-selected"));
      updateNetworkStatus();
    }
  });
});
