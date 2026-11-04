/**
 * ==========================================================================
 * SYSTEM DIRECTORY — STREAMLINED VINYL CORE NAVIGATION
 * Architecture & Interaction Controller (Production Release)
 * ==========================================================================
 */

"use strict";

/* --------------------------------------------------------------------------
   1. CENTRALISED CONFIGURATION SYSTEM
   -------------------------------------------------------------------------- */
const CONFIG = {
  routes: {
    library: "./Demo-Library/",
    videos: "./Demo-Videos/",
    games: "./Demo-Games/",
    checklists: "./Demo-Checklists/"
  },
  timings: {
    navDelayMs: 380,
    expandDurationMs: 2800,
    statusCheckIntervalMs: 12000
  },
  physics: {
    mobileBreakpointPx: 640,
    desktop: {
      normalDiscSize: 116,
      expandedDiscSize: 204,
      cutoutClearance: 19
    },
    mobile: {
      normalDiscSize: 84,
      expandedDiscSize: 152,
      cutoutClearance: 13
    },
    springForce: 0.14,
    springDamping: 0.74,
    parallaxStrength: 4.0,
    orbParallaxFactor: 0.32
  },
  storage: {
    visitedIntroKey: "system_directory_intro_dismissed"
  }
};

/* --------------------------------------------------------------------------
   2. RUNTIME APPLICATION CONTROLLER
   -------------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  // Primary DOM Elements
  const introScreen = document.getElementById("introScreen");
  const recordWrap = document.getElementById("centerRecordWrap");
  const recordDisc = document.getElementById("recordDisc");
  const vinylImg = document.getElementById("vinylCoreImg");
  const tiles = Array.from(document.querySelectorAll(".square-tile"));
  const orbs = Array.from(document.querySelectorAll(".ambient-canvas .orb"));
  const statusEl = document.getElementById("systemStatus");

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isNavigating = false;

  /* --- 2.1 ASSET ERROR RESILIENCE --- */
  if (vinylImg) {
    vinylImg.addEventListener("error", () => {
      // Graceful fallback to CSS radial aesthetic if logo asset is unavailable
      vinylImg.style.display = "none";
      const artLayer = vinylImg.parentElement;
      if (artLayer) {
        artLayer.style.background = "radial-gradient(circle, #2a3142 0%, #10141d 80%)";
      }
    }, { once: true });
  }

  /* --- 2.2 INTRO SCREEN DISMISSAL --- */
  function dismissIntro() {
    if (!document.body.classList.contains("intro-active")) return;
    document.body.classList.remove("intro-active");
    try {
      sessionStorage.setItem(CONFIG.storage.visitedIntroKey, "true");
    } catch (_) {
      // Safe storage access fallback
    }
  }

  const hasVisited = (() => {
    try {
      return sessionStorage.getItem(CONFIG.storage.visitedIntroKey) === "true";
    } catch (_) {
      return false;
    }
  })();

  if (hasVisited || prefersReduced) {
    dismissIntro();
  } else if (introScreen) {
    introScreen.addEventListener("click", dismissIntro);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        dismissIntro();
      }
    }, { once: true });
  }

  /* --- 2.3 SPRING EXPANSION CONTROLLER --- */
  function getDimensions() {
    const isMobile = window.innerWidth <= CONFIG.physics.mobileBreakpointPx;
    return isMobile ? CONFIG.physics.mobile : CONFIG.physics.desktop;
  }

  let dims = getDimensions();
  let currentDiscSize = dims.normalDiscSize;
  let targetDiscSize = dims.normalDiscSize;
  let discVelocity = 0;
  let isSpringRunning = false;
  let isExpanded = false;
  let collapseTimer = null;

  function applySizes(size) {
    const cutoutRadius = (size / 2) + dims.cutoutClearance;
    document.documentElement.style.setProperty("--disc-size", `${size.toFixed(2)}px`);
    document.documentElement.style.setProperty("--cutout-r", `${cutoutRadius.toFixed(2)}px`);
  }

  applySizes(currentDiscSize);

  window.addEventListener("resize", () => {
    dims = getDimensions();
    if (!isExpanded) {
      currentDiscSize = dims.normalDiscSize;
      targetDiscSize = dims.normalDiscSize;
      applySizes(currentDiscSize);
    }
  }, { passive: true });

  function springStep() {
    const force = (targetDiscSize - currentDiscSize) * CONFIG.physics.springForce;
    discVelocity = (discVelocity + force) * CONFIG.physics.springDamping;
    currentDiscSize += discVelocity;

    applySizes(currentDiscSize);

    if (Math.abs(targetDiscSize - currentDiscSize) > 0.08 || Math.abs(discVelocity) > 0.08) {
      requestAnimationFrame(springStep);
    } else {
      currentDiscSize = targetDiscSize;
      discVelocity = 0;
      applySizes(currentDiscSize);
      isSpringRunning = false;
    }
  }

  function triggerSpring() {
    if (!isSpringRunning) {
      isSpringRunning = true;
      requestAnimationFrame(springStep);
    }
  }

  function expandRecord() {
    isExpanded = true;
    if (recordWrap) recordWrap.classList.add("is-expanded");
    targetDiscSize = dims.expandedDiscSize;
    triggerSpring();

    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(shrinkRecord, CONFIG.timings.expandDurationMs);
  }

  function shrinkRecord() {
    isExpanded = false;
    if (recordWrap) recordWrap.classList.remove("is-expanded");
    targetDiscSize = dims.normalDiscSize;
    triggerSpring();
  }

  if (recordDisc) {
    recordDisc.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!isExpanded) expandRecord();
      else shrinkRecord();
    });
  }

  /* --- 2.4 SPOTLIGHT, TILE PARALLAX & AMBIENT MOTION --- */
  if (!prefersReduced) {
    tiles.forEach((tile) => {
      tile.addEventListener("pointermove", (e) => {
        const rect = tile.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        tile.style.setProperty("--mouse-x", `${x}px`);
        tile.style.setProperty("--mouse-y", `${y}px`);

        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const pX = (((x - midX) / midX) * CONFIG.physics.parallaxStrength).toFixed(2);
        const pY = (((y - midY) / midY) * CONFIG.physics.parallaxStrength).toFixed(2);

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
        const factor = (i + 1) * CONFIG.physics.orbParallaxFactor;
        orb.style.transform = `translate3d(${normX * factor}px, ${normY * factor}px, 0)`;
      });
    }, { passive: true });
  }

  /* --- 2.5 ROUTE SELECTION & NAVIGATION --- */
  function navigateSector(tile, event) {
    if (event) event.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    const targetKey = tile.getAttribute("data-target");
    const targetUrl = CONFIG.routes[targetKey] || tile.getAttribute("href") || "#";

    if (prefersReduced) {
      window.location.href = targetUrl;
      return;
    }

    document.body.classList.add("is-leaving");
    tile.classList.add("is-selected");

    setTimeout(() => {
      window.location.href = targetUrl;
    }, CONFIG.timings.navDelayMs);
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", (e) => navigateSector(tile, e));
    tile.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        navigateSector(tile, e);
      }
    });
  });

  /* --- 2.6 KEYBOARD GRID NAVIGATION (UP, DOWN, LEFT, RIGHT) --- */
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
      tiles[nextIndex].focus();
    }
  });

  /* --- 2.7 NETWORK ONLINE STATUS MONITOR --- */
  function updateNetworkStatus() {
    if (!statusEl) return;
    if (navigator.onLine) {
      statusEl.textContent = "ONLINE";
      statusEl.style.color = "";
    } else {
      statusEl.textContent = "OFFLINE";
      statusEl.style.color = "var(--accent-amber)";
    }
  }

  window.addEventListener("online", updateNetworkStatus);
  window.addEventListener("offline", updateNetworkStatus);
  updateNetworkStatus();

  /* --- 2.8 PAGESHOW CACHE RESTORATION --- */
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      isNavigating = false;
      document.body.classList.remove("is-leaving");
      shrinkRecord();
      tiles.forEach((t) => t.classList.remove("is-selected"));
      updateNetworkStatus();
    }
  });
});