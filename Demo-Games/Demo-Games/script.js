/**
 * Game Collection Lounge Controller
 * Universal Cocktail Lounge Design System & Living Garnish Atmosphere
 */
(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     1. Decoupled Game Catalog & Runtime Schema Validation
     -------------------------------------------------------------------------- */
  const GAME_CATALOG = [
    { id: "crossword",    name: "Crossword",   desc: "Daily mini puzzle",    url: "https://tileworksgamesstudio.github.io/86Crossword/",   enabled: true,  icon: "grid" },
    { id: "connections",  name: "Connections", desc: "Find groups of 4",     url: "https://tileworksgamesstudio.github.io/86Connections/", enabled: true,  icon: "nodes" },
    { id: "trivia",       name: "Trivia",      desc: "Knowledge test",       url: "https://tileworksgamesstudio.github.io/86Trivia/",      enabled: true,  icon: "help" },
    { id: "hangman",      name: "Hangman",     desc: "Guess the phrase",     url: "https://tileworksgamesstudio.github.io/86Hangman/",     enabled: true,  icon: "text" },
    { id: "specs",        name: "SPECS TRAINING",       desc: "Cocktail training", url: "https://tileworksgamesstudio.github.io/86Specs/",       enabled: true,  icon: "check" },
    { id: "memory",       name: "Memory",      desc: "Pair identical cards",       url: "https://tileworksgamesstudio.github.io/86Memory/",      enabled: true,  icon: "cards" },
    { id: "spelling-bee", name: "Letters",     desc: "Form 4+ letter words", url: "https://tileworksgamesstudio.github.io/86SpellingBee/", enabled: true,  icon: "hex" },
    { id: "wordle",       name: "Word Guess",  desc: "5-letter challenge",   url: "https://tileworksgamesstudio.github.io/86Wordle/",      enabled: true,  icon: "rows" },
    { id: "wordsearch",   name: "Wordsearch",  desc: "Find hidden words",    url: "https://tileworksgamesstudio.github.io/86Wordsearch/",  enabled: true,  icon: "dice" }
  ];

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
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  };

  function validateGameItem(item, index) {
    return {
      id: typeof item.id === "string" && item.id.trim() ? item.id : `game-${index}`,
      name: typeof item.name === "string" && item.name.trim() ? item.name : "New Puzzle",
      desc: typeof item.desc === "string" ? item.desc : "",
      url: typeof item.url === "string" && item.url.trim() ? item.url : "#",
      enabled: typeof item.enabled === "boolean" ? item.enabled : true,
      icon: ICONS[item.icon] ? item.icon : "grid"
    };
  }

  /* --------------------------------------------------------------------------
     2. 12 Master Botanical Cocktail Garnishes (Handcrafted Emissive SVGs)
     -------------------------------------------------------------------------- */
  const GARNISH_SVGS = [
    // 1. Orange Twist
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M10,38 C14,34 18,20 26,14 C34,8 39,12 37,20 C35,28 24,32 18,28 C12,24 16,10 24,8 C32,6 38,12 39,18" fill="none" stroke="#ea7a38" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M12,36 C16,32 19,21 26,16 C33,11 36,13 35,19" fill="none" stroke="#fff1be" stroke-width="1.2" stroke-linecap="round" opacity="0.8"/>
    </svg>`,

    // 2. Lemon Twist
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M12,36 C18,34 22,22 28,16 C34,10 38,14 36,22 C34,30 22,32 16,26 C10,20 18,10 26,8" fill="none" stroke="#ecd078" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M14,34 C19,32 23,23 28,18" fill="none" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.9"/>
    </svg>`,

    // 3. Lime Wheel
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="rgba(80, 120, 40, 0.2)" stroke="#cca048" stroke-width="2"/>
      <circle cx="24" cy="24" r="15" fill="none" stroke="#7ea349" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="3" fill="#ecd078"/>
      <line x1="24" y1="9" x2="24" y2="21" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="24" y1="27" x2="24" y2="39" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="9" y1="24" x2="21" y2="24" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="27" y1="24" x2="39" y2="24" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="13.5" y1="13.5" x2="21.8" y2="21.8" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="26.2" y1="26.2" x2="34.5" y2="34.5" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="13.5" y1="34.5" x2="21.8" y2="26.2" stroke="#ecd078" stroke-width="1.2"/>
      <line x1="26.2" y1="21.8" x2="34.5" y2="13.5" stroke="#ecd078" stroke-width="1.2"/>
    </svg>`,

    // 4. Grapefruit Wheel
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <circle cx="24" cy="24" r="19" fill="rgba(217, 94, 38, 0.22)" stroke="#ea7a38" stroke-width="2.2"/>
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="#d95e26" stroke-width="1.5"/>
      <circle cx="24" cy="24" r="3" fill="#fff1be"/>
      <line x1="24" y1="8.5" x2="24" y2="21" stroke="#fff1be" stroke-width="1.2" opacity="0.8"/>
      <line x1="24" y1="27" x2="24" y2="39.5" stroke="#fff1be" stroke-width="1.2" opacity="0.8"/>
      <line x1="8.5" y1="24" x2="21" y2="24" stroke="#fff1be" stroke-width="1.2" opacity="0.8"/>
      <line x1="27" y1="24" x2="39.5" y2="24" stroke="#fff1be" stroke-width="1.2" opacity="0.8"/>
    </svg>`,

    // 5. Blood Orange Wheel
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <circle cx="24" cy="24" r="18.5" fill="rgba(165, 32, 25, 0.35)" stroke="#ea7a38" stroke-width="2.2"/>
      <circle cx="24" cy="24" r="15" fill="none" stroke="#a52019" stroke-width="1.8"/>
      <circle cx="24" cy="24" r="3" fill="#ecd078"/>
      <line x1="24" y1="9" x2="24" y2="39" stroke="#ea7a38" stroke-width="1.2" opacity="0.7"/>
      <line x1="9" y1="24" x2="39" y2="24" stroke="#ea7a38" stroke-width="1.2" opacity="0.7"/>
      <line x1="13.4" y1="13.4" x2="34.6" y2="34.6" stroke="#ea7a38" stroke-width="1.2" opacity="0.7"/>
      <line x1="13.4" y1="34.6" x2="34.6" y2="13.4" stroke="#ea7a38" stroke-width="1.2" opacity="0.7"/>
    </svg>`,

    // 6. Dehydrated Citrus Wheel
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="rgba(115, 80, 29, 0.3)" stroke="#73501d" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="14.5" fill="none" stroke="#a5772d" stroke-width="1.4" stroke-dasharray="3 2"/>
      <circle cx="24" cy="24" r="2.8" fill="#cca048"/>
      <line x1="24" y1="9.5" x2="24" y2="38.5" stroke="#cca048" stroke-width="1.2"/>
      <line x1="9.5" y1="24" x2="38.5" y2="24" stroke="#cca048" stroke-width="1.2"/>
    </svg>`,

    // 7. Single Cocktail Cherry
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M21,18 Q23,6 35,5" fill="none" stroke="#cca048" stroke-width="2" stroke-linecap="round"/>
      <circle cx="20" cy="28" r="11" fill="rgba(176, 25, 25, 0.85)" stroke="#ea7a38" stroke-width="1.8"/>
      <circle cx="16" cy="24" r="3.5" fill="#fff1be" opacity="0.8"/>
    </svg>`,

    // 8. Double Cherry
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M16,23 C19,13 25,8 30,5 C32,12 33,18 34,25" fill="none" stroke="#cca048" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="15" cy="30" r="8.5" fill="rgba(165, 20, 20, 0.85)" stroke="#ea7a38" stroke-width="1.6"/>
      <circle cx="33" cy="31" r="8.5" fill="rgba(176, 25, 25, 0.85)" stroke="#ea7a38" stroke-width="1.6"/>
      <circle cx="13" cy="28" r="2.5" fill="#fff1be" opacity="0.75"/>
      <circle cx="31" cy="29" r="2.5" fill="#fff1be" opacity="0.75"/>
    </svg>`,

    // 9. Mint Sprig
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M24,40 C24,28 24,18 24,8" fill="none" stroke="#5b8235" stroke-width="2" stroke-linecap="round"/>
      <path d="M24,26 C16,23 12,17 14,12 C19,10 23,16 24,20" fill="rgba(91, 130, 53, 0.55)" stroke="#89b251" stroke-width="1.4"/>
      <path d="M24,22 C32,19 36,13 34,8 C29,6 25,12 24,16" fill="rgba(91, 130, 53, 0.55)" stroke="#89b251" stroke-width="1.4"/>
      <path d="M24,12 C20,7 21,3 24,2 C27,3 28,7 24,12" fill="rgba(115, 165, 68, 0.65)" stroke="#89b251" stroke-width="1.4"/>
    </svg>`,

    // 10. Rosemary Sprig
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M24,42 Q23,24 24,6" fill="none" stroke="#688045" stroke-width="2" stroke-linecap="round"/>
      <line x1="24" y1="34" x2="16" y2="30" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="24" y1="30" x2="32" y2="26" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="24" y1="24" x2="15" y2="20" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="24" y1="20" x2="33" y2="16" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="24" y1="14" x2="17" y2="10" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="24" y1="10" x2="31" y2="6" stroke="#89b251" stroke-width="1.5" stroke-linecap="round"/>
    </svg>`,

    // 11. Green Olive with Pimento
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <ellipse cx="24" cy="24" rx="13" ry="17" fill="rgba(112, 132, 54, 0.7)" stroke="#8fa843" stroke-width="1.8" transform="rotate(-15 24 24)"/>
      <ellipse cx="22" cy="17" rx="3.5" ry="4.5" fill="#d94426" stroke="#ea7a38" stroke-width="1.2"/>
      <ellipse cx="27" cy="27" rx="2.5" ry="7" fill="#fff1be" opacity="0.45" transform="rotate(-15 27 27)"/>
    </svg>`,

    // 12. Flowing Cucumber Ribbon
    `<svg viewBox="0 0 48 48" class="floating-garnish-art" aria-hidden="true">
      <path d="M10,40 C14,24 28,34 32,20 C35,10 27,6 20,8 C12,10 16,22 28,26" fill="none" stroke="#75a55b" stroke-width="3" stroke-linecap="round"/>
      <path d="M11,39 C15,25 27,33 31,21" fill="none" stroke="#e0f0d0" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
    </svg>`
  ];

  /* --------------------------------------------------------------------------
     3. High-Performance Garnish Flight System (Responsive Safe Bounds)
     -------------------------------------------------------------------------- */
  class GarnishFlightSystem {
    constructor(containerEl) {
      this.container = containerEl;
      this.garnishes = [];
      this.targetCount = 8;
      this.rafId = null;
      this.lastTime = performance.now();
      this.viewportW = window.innerWidth;
      this.viewportH = window.innerHeight;
      this.depthProfiles = [
        { name: "depth-far",  minScale: 0.60, maxScale: 0.75, minSpeed: 20, maxSpeed: 30, opacity: 0.45 },
        { name: "depth-mid",  minScale: 0.85, maxScale: 1.05, minSpeed: 30, maxSpeed: 44, opacity: 0.75 },
        { name: "depth-near", minScale: 1.15, maxScale: 1.35, minSpeed: 44, maxSpeed: 58, opacity: 0.95 }
      ];
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
        const initialY = (this.viewportH / this.targetCount) * i + (Math.random() * 30 - 15);
        this.createPooledGarnish(initialY);
      }

      this.start();
    }

    createPooledGarnish(initialY) {
      const depth = this.depthProfiles[Math.floor(Math.random() * this.depthProfiles.length)];
      const svgIndex = Math.floor(Math.random() * GARNISH_SVGS.length);

      const el = document.createElement("div");
      el.className = `floating-garnish ${depth.name}`;
      el.innerHTML = GARNISH_SVGS[svgIndex];

      const scale = depth.minScale + Math.random() * (depth.maxScale - depth.minScale);
      const speed = depth.minSpeed + Math.random() * (depth.maxSpeed - depth.minSpeed);
      const startX = 10 + Math.random() * 80;
      const rotSpeed = (Math.random() * 10 + 5) * (Math.random() > 0.5 ? 1 : -1);
      const driftAmp = 12 + Math.random() * 18;
      const driftFreq = 0.0008 + Math.random() * 0.0008;
      const rotation = Math.random() * 360;
      const phase = Math.random() * Math.PI * 2;

      const initialDrift = Math.sin(phase) * driftAmp;
      const initialX = (startX / 100) * this.viewportW + initialDrift;
      el.style.transform = `translate3d(${initialX}px, ${initialY}px, 0) scale(${scale}) rotate(${rotation}deg)`;
      el.style.opacity = "0";

      this.container.appendChild(el);

      const obj = {
        el,
        depth,
        xPercent: startX,
        y: initialY,
        scale,
        speed,
        rotation,
        rotSpeed,
        driftAmp,
        driftFreq,
        phase,
        baseOpacity: depth.opacity
      };

      this.garnishes.push(obj);
      return obj;
    }

    start() {
      if (this.rafId) return;
      this.lastTime = performance.now();
      const tick = (now) => {
        const delta = Math.min((now - this.lastTime) / 1000, 0.08);
        this.lastTime = now;

        if (state.animations && !document.hidden) {
          this.update(delta, now);
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

    update(delta, now) {
      const windowH = this.viewportH;
      const windowW = this.viewportW;

      for (let i = 0; i < this.garnishes.length; i++) {
        const g = this.garnishes[i];

        g.y -= g.speed * delta;
        g.rotation += g.rotSpeed * delta;

        const currentDrift = Math.sin(now * g.driftFreq + g.phase) * g.driftAmp;
        const currentX = (g.xPercent / 100) * windowW + currentDrift;

        if (g.y < -75) {
          g.y = windowH + 40 + Math.random() * 50;
          g.xPercent = 10 + Math.random() * 80;
          g.rotation = Math.random() * 360;
          g.phase = Math.random() * Math.PI * 2;
        }

        let edgeFade = 1;
        if (g.y > windowH - 40) {
          edgeFade = Math.max(0, (windowH + 60 - g.y) / 100);
        } else if (g.y < 50) {
          edgeFade = Math.max(0, (g.y + 70) / 120);
        }

        g.el.style.opacity = (g.baseOpacity * edgeFade).toFixed(3);
        g.el.style.transform = `translate3d(${currentX}px, ${g.y}px, 0) scale(${g.scale}) rotate(${g.rotation}deg)`;
      }
    }
  }

  let flightSystemInstance = null;

  /* --------------------------------------------------------------------------
     4. Centralized Audio Profiles & Lounge Synth Engine
     -------------------------------------------------------------------------- */
  const AUDIO_THEME = {
    CHIME_TAP:    { freq1: 523.25, freq2: 659.25, type: "sine",     duration: 0.12, gain: 0.09 },
    SHUFFLE_TAP:  { freq1: 587.33, freq2: 880.00, type: "triangle", duration: 0.14, gain: 0.08 },
    MODAL_OPEN:   { freq1: 440.00, freq2: 587.33, type: "sine",     duration: 0.10, gain: 0.07 },
    MODAL_CLOSE:  { freq1: 400.00, freq2: 300.00, type: "sine",     duration: 0.08, gain: 0.06 },
    TOGGLE_CLICK: { freq1: 784.00, freq2: 659.25, type: "triangle", duration: 0.06, gain: 0.07 },
    DONATE_TAP:   { freq1: 523.25, freq2: 783.99, type: "sine",     duration: 0.15, gain: 0.09 }
  };

  let audioCtx = null;

  function initAudio() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
        }
      }
      if (audioCtx && (audioCtx.state === "suspended" || audioCtx.state === "interrupted")) {
        audioCtx.resume();
      }
    } catch (e) {}
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  });

  function playAudioTone(profile) {
    if (!state.sound) {
      if ("vibrate" in navigator) {
        try { navigator.vibrate(8); } catch (err) {}
      }
      return;
    }

    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc1.type = profile.type || "sine";
      osc2.type = profile.type || "sine";

      osc1.frequency.setValueAtTime(profile.freq1, now);
      osc2.frequency.setValueAtTime(profile.freq2, now + profile.duration * 0.4);

      const targetGain = profile.gain || 0.08;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + profile.duration * 0.5);

      osc2.start(now + profile.duration * 0.4);
      osc2.stop(now + profile.duration);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     5. State, Persistence & Multi-Tab Synchronization
     -------------------------------------------------------------------------- */
  const SETTINGS_KEY = "game_hub_settings_v1";
  const PROGRESS_KEY = "hub_daily_progress";
  const LAST_PLAYED_KEY = "hub_last_played";

  const state = {
    version: 1,
    sound: true,
    animations: true
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.version === 1) {
          if (typeof parsed.sound === "boolean") state.sound = parsed.sound;
          if (typeof parsed.animations === "boolean") state.animations = parsed.animations;
        }
      }
    } catch (e) {
      state.sound = true;
      state.animations = true;
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function getTodayLocalDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function getCompletedGamesToday() {
    try {
      const today = getTodayLocalDate();
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw);
      return Object.keys(data).filter((id) => data[id] === today);
    } catch (e) {
      return [];
    }
  }

  function markGameCompletedToday(gameId) {
    try {
      const today = getTodayLocalDate();
      const data = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
      data[gameId] = today;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
      renderGrid();
    } catch (e) {}
  }

  function getLastPlayedGame() {
    try {
      return localStorage.getItem(LAST_PLAYED_KEY) || null;
    } catch (e) {
      return null;
    }
  }

  function setLastPlayedGame(gameId) {
    try {
      localStorage.setItem(LAST_PLAYED_KEY, gameId);
    } catch (e) {}
  }

  /* --------------------------------------------------------------------------
     6. Dynamic Mobile Viewport & Symmetric Grid Scaling
     -------------------------------------------------------------------------- */
  function applyDynamicMobileLayout() {
    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Available width accounting for side safe zones
    const availableWidth = Math.min(viewportWidth - 24, 440);
    // Calculated cell size ensuring strict 3-column symmetry
    const gap = viewportWidth < 360 ? 8 : (viewportWidth < 400 ? 10 : 12);
    const calculatedTileSize = Math.floor((availableWidth - (gap * 2)) / 3);

    const root = document.documentElement;
    root.style.setProperty("--app-width", `${availableWidth}px`);
    root.style.setProperty("--app-height", `${viewportHeight}px`);
    root.style.setProperty("--dyn-tile-size", `${calculatedTileSize}px`);
    root.style.setProperty("--dyn-grid-gap", `${gap}px`);

    // Compact scale mode for short mobile screens
    if (viewportHeight < 680) {
      document.body.classList.add("compact-screen");
    } else {
      document.body.classList.remove("compact-screen");
    }

    if (flightSystemInstance) {
      flightSystemInstance.onResize();
    }
  }

  /* --------------------------------------------------------------------------
     7. Contextual Greeting & Announcements
     -------------------------------------------------------------------------- */
  function updateTimeOfDayGreeting() {
    const subtitle = document.getElementById("hub-subtitle");
    if (!subtitle) return;

    const hour = new Date().getHours();
    let greeting = "Select a game to play";

    if (hour >= 5 && hour < 12) {
      greeting = "Good morning! Pick today's puzzle";
    } else if (hour >= 12 && hour < 18) {
      greeting = "Good afternoon! Ready for a quick break?";
    } else {
      greeting = "Good evening! Unwind in the lounge";
    }

    subtitle.textContent = greeting;
  }

  function announceA11y(message) {
    const announcer = document.getElementById("a11y-announcer");
    if (announcer) {
      announcer.textContent = "";
      setTimeout(() => {
        announcer.textContent = message;
      }, 50);
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
    }, 2400);
  }

  /* --------------------------------------------------------------------------
     8. Grid Renderer with Auto-Fitting Titles & Smoked Glass Badges
     -------------------------------------------------------------------------- */
  function renderGrid() {
    const grid = document.getElementById("game-grid");
    if (!grid) return;

    const completedList = getCompletedGamesToday();
    const lastPlayedId = getLastPlayedGame();
    const fragment = document.createDocumentFragment();

    GAME_CATALOG.forEach((rawItem, index) => {
      const item = validateGameItem(rawItem, index);
      const li = document.createElement("li");
      li.className = "grid-cell";
      // Enforce zero min-width to avoid flex / grid blowout on mobile
      li.style.minWidth = "0";

      if (item.enabled) {
        const link = document.createElement("a");
        link.className = "tile";
        link.href = item.url;
        link.setAttribute("aria-label", `Play ${item.name}: ${item.desc}`);
        link.setAttribute("data-id", item.id);
        link.style.minWidth = "0";

        if (completedList.includes(item.id)) {
          const badge = document.createElement("span");
          badge.className = "tile-badge-done";
          badge.setAttribute("aria-label", "Completed today");
          badge.textContent = "✓";
          link.appendChild(badge);
        } else if (item.id === lastPlayedId) {
          const recentBadge = document.createElement("span");
          recentBadge.className = "tile-badge-recent";
          recentBadge.textContent = "Recent";
          link.appendChild(recentBadge);
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
          playAudioTone(AUDIO_THEME.CHIME_TAP);

          if (item.url.startsWith("#")) {
            e.preventDefault();
            link.classList.add("is-loading");
            showToast(`Opening ${item.name}...`);
            setTimeout(() => {
              link.classList.remove("is-loading");
            }, 600);
          }
        });

        li.appendChild(link);
      } else {
        const disabledTile = document.createElement("div");
        disabledTile.className = "tile tile-disabled";
        disabledTile.setAttribute("aria-disabled", "true");
        disabledTile.setAttribute("aria-label", `${item.name} is coming soon`);
        disabledTile.style.minWidth = "0";

        const iconEl = document.createElement("div");
        iconEl.className = "tile-icon";
        iconEl.innerHTML = ICONS.lock;

        const label = document.createElement("span");
        label.className = "tile-label";
        label.textContent = item.name;

        const desc = document.createElement("span");
        desc.className = "tile-desc";
        desc.textContent = "Coming Soon";

        disabledTile.appendChild(iconEl);
        disabledTile.appendChild(label);
        disabledTile.appendChild(desc);
        li.appendChild(disabledTile);
      }

      fragment.appendChild(li);
    });

    grid.innerHTML = "";
    grid.appendChild(fragment);
  }

  window.addEventListener("pageshow", () => {
    document.querySelectorAll(".tile.is-loading").forEach((el) => {
      el.classList.remove("is-loading");
    });
  });

  /* --------------------------------------------------------------------------
     9. Modal Dialog Controller with Focus Trap & Swipe-to-Dismiss
     -------------------------------------------------------------------------- */
  let activeModal = null;
  let previouslyFocused = null;
  let closeTimeoutId = null;

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(e) {
    if (!activeModal) return;
    const focusables = getFocusableElements(activeModal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  }

  function openModal(modalEl, triggerBtn) {
    if (!modalEl) return;
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }

    initAudio();
    playAudioTone(AUDIO_THEME.MODAL_OPEN);

    previouslyFocused = triggerBtn || document.activeElement;
    activeModal = modalEl;

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.add("is-active");

    modalEl.hidden = false;
    void modalEl.offsetHeight;
    modalEl.classList.add("is-open");

    if (triggerBtn) {
      triggerBtn.setAttribute("aria-expanded", "true");
    }

    const focusables = getFocusableElements(modalEl);
    if (focusables.length) {
      focusables[0].focus();
    }

    document.addEventListener("keydown", trapFocus);
    announceA11y(`${modalEl.querySelector(".sheet-title")?.textContent || "Dialog"} opened`);
  }

  function closeModal() {
    if (!activeModal) return;

    playAudioTone(AUDIO_THEME.MODAL_CLOSE);

    const backdrop = document.getElementById("modal-backdrop");
    if (backdrop) backdrop.classList.remove("is-active");

    activeModal.classList.remove("is-open");
    const closingModal = activeModal;

    function handleTransitionEnd(e) {
      if (e.target === closingModal && (e.propertyName === "transform" || !e.propertyName)) {
        closingModal.removeEventListener("transitionend", handleTransitionEnd);
        if (!closingModal.classList.contains("is-open")) {
          closingModal.hidden = true;
        }
      }
    }

    closingModal.addEventListener("transitionend", handleTransitionEnd);
    closeTimeoutId = setTimeout(() => {
      closingModal.removeEventListener("transitionend", handleTransitionEnd);
      if (!closingModal.classList.contains("is-open")) {
        closingModal.hidden = true;
      }
    }, 340);

    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");
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
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;
      if (deltaY > 0) {
        activeModal.style.transform = `translate(-50%, ${deltaY}px)`;
      }
    }, { passive: true });

    window.addEventListener("touchend", (e) => {
      if (!isTracking || !activeModal) return;
      isTracking = false;
      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - startY;
      activeModal.style.transform = "";

      if (deltaY > 75) {
        closeModal();
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     10. Interactions, Settings & Multi-Tab Synchronization
     -------------------------------------------------------------------------- */
  function applyAnimationState() {
    if (state.animations) {
      document.body.classList.remove("animations-disabled");
      if (flightSystemInstance) {
        flightSystemInstance.start();
      }
    } else {
      document.body.classList.add("animations-disabled");
      if (flightSystemInstance) {
        flightSystemInstance.stop();
      }
    }
  }

  function setupInteractions() {
    const btnInstagram = document.getElementById("btn-instagram");
    const btnSettings = document.getElementById("btn-settings");
    const btnDonate = document.getElementById("btn-donate");
    const modalSettings = document.getElementById("settings-modal");
    const modalDonate = document.getElementById("donate-modal");
    const btnCloseSettings = document.getElementById("close-settings");
    const btnCloseDonate = document.getElementById("close-donate");
    const backdrop = document.getElementById("modal-backdrop");
    const soundToggle = document.getElementById("toggle-sound");
    const animToggle = document.getElementById("toggle-animations");
    const stripeLink = document.getElementById("stripe-donate-link");

    if (soundToggle) soundToggle.checked = state.sound;
    if (animToggle) animToggle.checked = state.animations;
    applyAnimationState();

    if (btnInstagram) {
      btnInstagram.addEventListener("click", () => {
        playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
      });
    }

    if (soundToggle) {
      soundToggle.addEventListener("change", (e) => {
        state.sound = e.target.checked;
        saveSettings();
        if (state.sound) {
          playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
        }
        announceA11y(state.sound ? "Sound effects enabled" : "Sound effects disabled");
      });
    }

    if (animToggle) {
      animToggle.addEventListener("change", (e) => {
        state.animations = e.target.checked;
        saveSettings();
        applyAnimationState();
        playAudioTone(AUDIO_THEME.TOGGLE_CLICK);
        announceA11y(state.animations ? "Animations enabled" : "Animations disabled");
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
        playAudioTone(AUDIO_THEME.DONATE_TAP);
      });
    }

    // Dynamic viewport recalculation on resize and mobile orientation change
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyDynamicMobileLayout, 60);
    });

    window.addEventListener("orientationchange", () => {
      setTimeout(applyDynamicMobileLayout, 100);
    });

    window.addEventListener("storage", (e) => {
      if (e.key === SETTINGS_KEY) {
        loadSettings();
        if (soundToggle) soundToggle.checked = state.sound;
        if (animToggle) animToggle.checked = state.animations;
        applyAnimationState();
      } else if (e.key === PROGRESS_KEY) {
        renderGrid();
      }
    });
  }

  /* --------------------------------------------------------------------------
     11. Initialization
     -------------------------------------------------------------------------- */
  function init() {
    loadSettings();
    applyDynamicMobileLayout();
    updateTimeOfDayGreeting();

    const stageEl = document.getElementById("garnish-stage");
    if (stageEl) {
      flightSystemInstance = new GarnishFlightSystem(stageEl);
      flightSystemInstance.init();
    }

    renderGrid();
    setupInteractions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.GameHub = {
    markCompleted: markGameCompletedToday
  };
})();