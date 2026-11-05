/**
 * Word Guess — Cocktail Lounge Universal Edition
 * Release Version
 */

(function () {
  "use strict";

  // ==========================================================================
  // DEVELOPER CONFIGURATION
  // ==========================================================================
  const CONFIG = {
    app: {
      name: "Word Guess",
      edition: "Cocktail Lounge Edition",
      storageKey: "cocktail_word_guess_data_v1",
      settingsKey: "cocktail_word_guess_settings_v1",
      homeHubUrl: "../Demo-Games/"
    },

    data: {
      puzzlesFile: "puzzles.csv",
      wordsFile: "words.txt",
      fallbackPuzzles: [
        { id: "P001", word: "PRIDE", definition: "A feeling of deep satisfaction from one's achievements." },
        { id: "P002", word: "CLEAN", definition: "Free from dirt, marks, or unwanted matter." },
        { id: "P003", word: "LIGHT", definition: "The natural agent that stimulates sight." },
        { id: "P004", word: "BRAVE", definition: "Ready to face danger or pain; showing courage." },
        { id: "P005", word: "SHARP", definition: "Having an edge or point that is able to cut or pierce." },
        { id: "P006", word: "SWIFT", definition: "Happening quickly or moving with great speed." },
        { id: "P007", word: "CRANE", definition: "A large tall machine used for moving heavy objects." }
      ]
    },

    dailyCycle: {
      // Anchor calendar day (Local YYYY-MM-DD) for deterministic sequential cycling
      anchorDate: "2025-01-01",
      startIndex: 0
    },

    display: {
      dateFormatOptions: {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      },
      toastDurationMs: 2200
    },

    atmosphere: {
      defaultEnabled: true,
      targetPopulation: 8,
      maxPopulation: 10
    }
  };

  const VALID_WORDS = new Set();

  const GARNISH_SVGS = [
    // 1: Orange Twist
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 78C22 52 48 30 76 24C86 22 88 32 76 38C52 50 34 70 30 84C28 88 16 88 18 78Z" fill="#E86A2D"/>
      <path d="M22 75C28 54 52 35 78 28C84 26 84 32 76 36C56 46 38 64 34 80C32 82 20 84 22 75Z" fill="#FFA726"/>
      <path d="M30 68C38 52 56 38 74 34" stroke="#FFF1BE" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    // 2: Lemon Twist
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 80C26 50 54 26 80 20C88 18 90 28 80 34C56 48 36 68 32 86C30 90 20 90 22 80Z" fill="#FBC02D"/>
      <path d="M25 76C30 52 56 32 80 25C85 23 85 29 78 33C58 45 40 62 36 80C34 83 24 84 25 76Z" fill="#FFEE58"/>
      <path d="M34 66C42 50 60 36 78 30" stroke="#FFFDE7" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    // 3: Lime Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#2E7D32" stroke="#A5D6A7" stroke-width="2"/>
      <circle cx="50" cy="50" r="39" fill="#1B5E20"/>
      <circle cx="50" cy="50" r="37" fill="#C8E6C9"/>
      <circle cx="50" cy="50" r="9" fill="#E8F5E9"/>
      <path d="M50 14C50 14 43 36 44 41C45 46 48 48 50 48C52 48 55 46 56 41C57 36 50 14 50 14Z" fill="#43A047"/>
      <path d="M50 86C50 86 43 64 44 59C45 54 48 52 50 52C52 52 55 54 56 59C57 64 50 86 50 86Z" fill="#43A047"/>
      <path d="M14 50C14 50 36 43 41 44C46 45 48 48 48 50C48 52 46 55 41 56C36 57 14 50 14 50Z" fill="#43A047"/>
      <path d="M86 50C86 50 64 43 59 44C54 45 52 48 52 50C52 52 54 55 59 56C64 57 86 50 86 50Z" fill="#43A047"/>
      <path d="M24 24C24 24 43 38 45 42C47 46 46 49 44 51C42 53 39 52 35 48C31 44 24 24 24 24Z" fill="#388E3C"/>
      <path d="M76 76C76 76 57 62 55 58C53 54 54 51 56 49C58 47 61 48 65 52C69 56 76 76 76 76Z" fill="#388E3C"/>
      <path d="M76 24C76 24 62 43 58 45C54 47 51 46 49 44C47 42 48 39 52 35C56 31 76 24 76 24Z" fill="#388E3C"/>
      <path d="M24 76C24 76 38 57 42 55C46 53 49 54 51 56C53 58 52 61 48 65C44 69 24 76 24 76Z" fill="#388E3C"/>
    </svg>`,

    // 4: Grapefruit Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#EF6C00" stroke="#FFE0B2" stroke-width="2"/>
      <circle cx="50" cy="50" r="40" fill="#E64A19"/>
      <circle cx="50" cy="50" r="38" fill="#FFF3E0"/>
      <circle cx="50" cy="50" r="9" fill="#FFE0B2"/>
      <path d="M50 14C50 14 43 36 44 41C45 46 48 48 50 48C52 48 55 46 56 41C57 36 50 14 50 14Z" fill="#FF7043"/>
      <path d="M50 86C50 86 43 64 44 59C45 54 48 52 50 52C52 52 55 54 56 59C57 64 50 86 50 86Z" fill="#FF7043"/>
      <path d="M14 50C14 50 36 43 41 44C46 45 48 48 48 50C48 52 46 55 41 56C36 57 14 50 14 50Z" fill="#FF7043"/>
      <path d="M86 50C86 50 64 43 59 44C54 45 52 48 52 50C52 52 54 55 59 56C64 57 86 50 86 50Z" fill="#FF7043"/>
      <path d="M24 24C24 24 43 38 45 42C47 46 46 49 44 51C42 53 39 52 35 48C31 44 24 24 24 24Z" fill="#F4511E"/>
      <path d="M76 76C76 76 57 62 55 58C53 54 54 51 56 49C58 47 61 48 65 52C69 56 76 76 76 76Z" fill="#F4511E"/>
      <path d="M76 24C76 24 62 43 58 45C54 47 51 46 49 44C47 42 48 39 52 35C56 31 76 24 76 24Z" fill="#F4511E"/>
      <path d="M24 76C24 76 38 57 42 55C46 53 49 54 51 56C53 58 52 61 48 65C44 69 24 76 24 76Z" fill="#F4511E"/>
    </svg>`,

    // 5: Blood Orange Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="#E65100" stroke="#FFCCBC" stroke-width="2"/>
      <circle cx="50" cy="50" r="40" fill="#BF360C"/>
      <circle cx="50" cy="50" r="38" fill="#FBE9E7"/>
      <circle cx="50" cy="50" r="8" fill="#FFCCBC"/>
      <path d="M50 15C50 15 44 36 45 41C46 46 48 48 50 48C52 48 54 46 55 41C56 36 50 15 50 15Z" fill="#880E4F"/>
      <path d="M50 85C50 85 44 64 45 59C46 54 48 52 50 52C52 52 54 54 55 59C56 64 50 85 50 85Z" fill="#880E4F"/>
      <path d="M15 50C15 50 36 44 41 45C46 46 48 48 48 50C48 52 46 54 41 55C36 56 15 50 15 50Z" fill="#880E4F"/>
      <path d="M85 50C85 50 64 44 59 45C54 46 52 48 52 50C52 52 54 54 59 55C64 56 85 50 85 50Z" fill="#880E4F"/>
      <path d="M25 25C25 25 43 39 45 43C47 47 46 49 44 51C42 53 39 52 35 48C31 44 25 25 25 25Z" fill="#B71C1C"/>
      <path d="M75 75C75 75 57 61 55 57C53 53 54 51 56 49C58 47 61 48 65 52C69 56 75 75 75 75Z" fill="#B71C1C"/>
      <path d="M75 25C75 25 61 43 57 45C53 47 51 46 49 44C47 42 48 39 52 35C56 31 75 25 75 25Z" fill="#B71C1C"/>
      <path d="M25 75C25 75 39 57 43 55C47 53 49 54 51 56C53 58 52 61 48 65C44 69 25 75 25 75Z" fill="#B71C1C"/>
    </svg>`,

    // 6: Dehydrated Citrus Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#6D4C41" stroke="#D7CCC8" stroke-width="1.8"/>
      <circle cx="50" cy="50" r="39" fill="#4E342E"/>
      <circle cx="50" cy="50" r="37" fill="#8D6E63"/>
      <circle cx="50" cy="50" r="8" fill="#BCAAA4"/>
      <path d="M50 16C50 16 44 36 45 41C46 46 48 48 50 48C52 48 54 46 55 41C56 36 50 16 50 16Z" fill="#A1887F"/>
      <path d="M50 84C50 84 44 64 45 59C46 54 48 52 50 52C52 52 54 54 55 59C56 64 50 84 50 84Z" fill="#A1887F"/>
      <path d="M16 50C16 50 36 44 41 45C46 46 48 48 48 50C48 52 46 54 41 55C36 56 16 50 16 50Z" fill="#A1887F"/>
      <path d="M84 50C84 50 64 44 59 45C54 46 52 48 52 50C52 52 54 54 59 55C64 56 84 50 84 50Z" fill="#A1887F"/>
      <path d="M26 26C26 26 43 39 45 43C47 47 46 49 44 51C42 53 39 52 35 48C31 44 26 26 26 26Z" fill="#5D4037"/>
      <path d="M74 74C74 74 57 61 55 57C53 53 54 51 56 49C58 47 61 48 65 52C69 56 74 74 74 74Z" fill="#5D4037"/>
      <path d="M74 26C74 26 61 43 57 45C53 47 51 46 49 44C47 42 48 39 52 35C56 31 74 26 74 26Z" fill="#5D4037"/>
      <path d="M26 74C26 74 39 57 43 55C47 53 49 54 51 56C53 58 52 61 48 65C44 69 26 74 26 74Z" fill="#5D4037"/>
    </svg>`,

    // 7: Cocktail Cherry
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52 56C58 34 74 20 86 16" stroke="#5D4037" stroke-width="3" stroke-linecap="round"/>
      <circle cx="48" cy="66" r="26" fill="#B71C1C"/>
      <circle cx="48" cy="66" r="24" fill="#D32F2F"/>
      <ellipse cx="40" cy="56" rx="8" ry="5" transform="rotate(-30 40 56)" fill="#FFCDD2" opacity="0.8"/>
      <circle cx="36" cy="54" r="2" fill="#FFF"/>
    </svg>`,

    // 8: Double Cherry
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M34 60C38 34 50 18 64 14" stroke="#4E342E" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M68 64C66 40 60 24 64 14" stroke="#4E342E" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="32" cy="68" r="20" fill="#B71C1C"/>
      <circle cx="32" cy="68" r="18" fill="#C62828"/>
      <ellipse cx="26" cy="60" rx="6" ry="4" transform="rotate(-25 26 60)" fill="#FFEBEE" opacity="0.85"/>
      <circle cx="68" cy="72" r="18" fill="#880E4F"/>
      <circle cx="68" cy="72" r="16" fill="#AD1457"/>
      <ellipse cx="62" cy="65" rx="5" ry="3" transform="rotate(-25 62 65)" fill="#FCE4EC" opacity="0.85"/>
    </svg>`,

    // 9: Mint Sprig
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90V20" stroke="#2E7D32" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M50 20C40 28 40 40 50 48C60 40 60 28 50 20Z" fill="#43A047" stroke="#81C784" stroke-width="1.2"/>
      <path d="M48 40C32 38 24 50 34 60C44 60 48 48 48 40Z" fill="#388E3C" stroke="#A5D6A7" stroke-width="1.2"/>
      <path d="M52 46C68 44 76 56 66 66C56 66 52 54 52 46Z" fill="#4CAF50" stroke="#C8E6C9" stroke-width="1.2"/>
      <path d="M48 64C34 66 28 78 38 86C48 84 50 72 48 64Z" fill="#2E7D32" stroke="#81C784" stroke-width="1.2"/>
    </svg>`,

    // 10: Rosemary Sprig
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 92C50 60 48 30 46 12" stroke="#33691E" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M48 80C34 74 26 64 24 56" stroke="#558B2F" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M49 76C64 70 72 60 74 52" stroke="#558B2F" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M48 62C34 54 26 44 26 36" stroke="#689F38" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M48 58C62 50 70 40 72 32" stroke="#689F38" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M47 42C36 34 30 26 32 18" stroke="#7CB342" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M47 38C58 30 64 22 64 14" stroke="#7CB342" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    // 11: Green Olive
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="50" cy="50" rx="30" ry="38" fill="#558B2F"/>
      <ellipse cx="50" cy="50" rx="27" ry="35" fill="#689F38"/>
      <circle cx="50" cy="30" r="9" fill="#B71C1C" stroke="#D32F2F" stroke-width="1.5"/>
      <circle cx="50" cy="30" r="4.5" fill="#FF5252"/>
      <ellipse cx="38" cy="46" rx="6" ry="14" transform="rotate(-15 38 46)" fill="#DCEDC8" opacity="0.6"/>
    </svg>`,

    // 12: Cucumber Ribbon
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 78C34 76 38 52 50 50C62 48 64 26 82 22C86 24 84 34 74 38C58 42 56 64 44 68C30 72 24 84 18 78Z" fill="#C8E6C9" stroke="#2E7D32" stroke-width="2.5"/>
      <path d="M24 74C38 72 42 54 52 52C64 50 68 30 80 26" stroke="#81C784" stroke-width="2" stroke-linecap="round"/>
      <path d="M26 66C36 64 42 48 54 46" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" opacity="0.75"/>
    </svg>`
  ];

  function loadSettings() {
    try {
      const raw = localStorage.getItem(CONFIG.app.settingsKey);
      if (!raw) return { bgAnimation: CONFIG.atmosphere.defaultEnabled };
      const parsed = JSON.parse(raw);
      return { bgAnimation: parsed.bgAnimation !== false };
    } catch (e) {
      return { bgAnimation: CONFIG.atmosphere.defaultEnabled };
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(CONFIG.app.settingsKey, JSON.stringify(settings));
    } catch (e) {}
  }

  function loadGameState() {
    try {
      const raw = localStorage.getItem(CONFIG.app.storageKey);
      if (!raw) return getInitialState();
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || !parsed.stats) {
        return getInitialState();
      }
      return parsed;
    } catch (e) {
      return getInitialState();
    }
  }

  function saveGameState(state) {
    try {
      localStorage.setItem(CONFIG.app.storageKey, JSON.stringify(state));
    } catch (e) {}
  }

  function getInitialState() {
    return {
      version: 2,
      stats: {
        played: 0,
        wins: 0,
        streak: 0,
        maxStreak: 0,
        distribution: [0, 0, 0, 0, 0, 0],
        lastCompletedDayKey: null
      },
      puzzles: {}
    };
  }

  function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === "," && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if ((c === "\n" || c === "\r") && !inQuotes) {
        if (c === "\r" && text[i + 1] === "\n") i++;
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += c;
      }
    }
    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      if (currentRow.some((f) => f.length > 0)) rows.push(currentRow);
    }
    if (rows.length < 2) return [];

    const headers = rows[0].map((h) => h.toLowerCase());
    return rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = row[idx] || "";
      });
      return obj;
    });
  }

  function getLocalDayKey(dateObj) {
    const d = dateObj || new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateObj) {
    const d = dateObj || new Date();
    try {
      return new Intl.DateTimeFormat(undefined, CONFIG.display.dateFormatOptions).format(d);
    } catch (e) {
      return getLocalDayKey(d);
    }
  }

  function calculateDaysDifference(anchorStr, currentStr) {
    const [ay, am, ad] = anchorStr.split("-").map(Number);
    const [cy, cm, cd] = currentStr.split("-").map(Number);
    const anchorUtc = Date.UTC(ay, am - 1, ad);
    const currentUtc = Date.UTC(cy, cm - 1, cd);
    const msPerDay = 86400000;
    return Math.floor((currentUtc - anchorUtc) / msPerDay);
  }

  // ==========================================================================
  // CONTINUOUS BOTTOM-TO-TOP FLOATING GARNISH SYSTEM
  // ==========================================================================
  class CocktailGarnishAtmosphere {
    constructor(containerEl, isEnabled) {
      this.container = containerEl;
      this.enabled = isEnabled;
      this.activeGarnishes = [];
      this.targetPopulation = CONFIG.atmosphere.targetPopulation;
      this.maxPopulation = CONFIG.atmosphere.maxPopulation;
      this.animFrameId = null;
      this.lastSpawn = 0;

      if (this.enabled) {
        this.init();
      }
    }

    setEnabled(enabled) {
      this.enabled = enabled;
      if (enabled) {
        if (!this.animFrameId) {
          this.init();
          this.loop(performance.now());
        }
      } else {
        if (this.animFrameId) {
          cancelAnimationFrame(this.animFrameId);
          this.animFrameId = null;
        }
        this.container.innerHTML = "";
        this.activeGarnishes = [];
      }
    }

    init() {
      this.container.innerHTML = "";
      this.activeGarnishes = [];
      const initialCount = 7;
      for (let i = 0; i < initialCount; i++) {
        const y = (window.innerHeight / initialCount) * i + (Math.random() * 40 - 20);
        this.spawnGarnish(y);
      }
      this.loop(performance.now());
    }

    spawnGarnish(forcedY) {
      if (this.activeGarnishes.length >= this.maxPopulation) return;

      const el = document.createElement("div");
      el.className = "float-garnish";

      const svgMarkup = GARNISH_SVGS[Math.floor(Math.random() * GARNISH_SVGS.length)];
      el.innerHTML = svgMarkup;

      const depthRand = Math.random();
      let size, speed, opacity, blur, bloomGlow;

      if (depthRand < 0.35) {
        size = 32 + Math.random() * 6;
        speed = 0.32 + Math.random() * 0.15;
        opacity = 0.35;
        blur = 1.2;
        bloomGlow = "drop-shadow(0 0 8px rgba(196, 81, 29, 0.4))";
      } else if (depthRand < 0.75) {
        size = 44 + Math.random() * 8;
        speed = 0.50 + Math.random() * 0.20;
        opacity = 0.60;
        blur = 0.4;
        bloomGlow = "drop-shadow(0 0 14px rgba(223, 130, 53, 0.6))";
      } else {
        size = 56 + Math.random() * 10;
        speed = 0.70 + Math.random() * 0.25;
        opacity = 0.85;
        blur = 0;
        bloomGlow = "drop-shadow(0 0 18px rgba(232, 106, 45, 0.75))";
      }

      const screenWidth = window.innerWidth;
      const x = Math.random() * (screenWidth - size);
      const y = forcedY !== undefined ? forcedY : window.innerHeight + size + 10;

      const driftAmplitude = 18 + Math.random() * 22;
      const driftSpeed = 0.0012 + Math.random() * 0.0012;
      const driftPhase = Math.random() * Math.PI * 2;
      const rotationSpeed = (Math.random() - 0.5) * 0.18;
      let currentRotation = Math.random() * 360;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.opacity = opacity;
      if (blur > 0) el.style.filter = `blur(${blur}px)`;
      const svgEl = el.querySelector("svg");
      if (svgEl) svgEl.style.filter = bloomGlow;

      this.container.appendChild(el);
      this.activeGarnishes.push({
        el,
        baseX: x,
        y,
        size,
        speed,
        driftAmplitude,
        driftSpeed,
        driftPhase,
        rotationSpeed,
        currentRotation
      });
    }

    loop(timestamp) {
      if (!this.enabled) return;

      if (
        (this.activeGarnishes.length < 6 ||
          (timestamp - this.lastSpawn > 2200 && this.activeGarnishes.length < this.targetPopulation)) &&
        this.activeGarnishes.length < 9
      ) {
        this.spawnGarnish();
        this.lastSpawn = timestamp;
      }

      for (let i = this.activeGarnishes.length - 1; i >= 0; i--) {
        const item = this.activeGarnishes[i];
        item.y -= item.speed;
        item.currentRotation += item.rotationSpeed;

        const currentX = item.baseX + Math.sin(timestamp * item.driftSpeed + item.driftPhase) * item.driftAmplitude;
        item.el.style.transform = `translate3d(${currentX}px, ${item.y}px, 0) rotate(${item.currentRotation}deg)`;

        if (item.y < -item.size - 30) {
          item.el.remove();
          this.activeGarnishes.splice(i, 1);
        }
      }

      this.animFrameId = requestAnimationFrame((ts) => this.loop(ts));
    }
  }

  // ==========================================================================
  // MAIN WORD GUESS CONTROLLER
  // ==========================================================================
  class WordGuessApp {
    constructor() {
      this.settings = loadSettings();
      this.state = loadGameState();
      this.puzzles = [];
      this.activePuzzle = null;
      this.activeIsDaily = false;
      this.activeDayKey = null;
      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;
      this.toastTimeout = null;
      this.currentLocalDayKey = getLocalDayKey();

      this.cacheElements();
      this.initAtmosphere();
      this.setupHomeLink();
      this.initBoard();
      this.initKeyboard();
      this.attachEvents();
      this.initApplication();
    }

    cacheElements() {
      this.views = {
        menu: document.getElementById("view-menu"),
        vault: document.getElementById("view-vault"),
        game: document.getElementById("view-game")
      };

      this.dom = {
        homeBtn: document.getElementById("btn-home"),
        headerGameControls: document.getElementById("header-game-controls"),

        navDaily: document.getElementById("nav-daily"),
        navVault: document.getElementById("nav-vault"),
        navSettings: document.getElementById("nav-settings"),
        navRules: document.getElementById("nav-rules"),

        menuDailyStatus: document.getElementById("menu-daily-status"),
        menuVaultCount: document.getElementById("menu-vault-count"),

        btnUtilityStats: document.getElementById("btn-utility-stats"),
        btnUtilityShare: document.getElementById("btn-utility-share"),
        btnUtilityPlus: document.getElementById("btn-utility-plus"),

        btnVaultBack: document.getElementById("btn-vault-back"),
        vaultList: document.getElementById("vault-list"),

        btnGameBack: document.getElementById("btn-game-back"),
        btnGameRules: document.getElementById("btn-game-rules"),
        btnGameStats: document.getElementById("btn-game-stats"),
        gamePuzzleTitle: document.getElementById("game-puzzle-title"),
        gamePuzzleDate: document.getElementById("game-puzzle-date"),
        gameStatusPill: document.getElementById("game-status-pill"),
        board: document.getElementById("board"),
        keyboard: document.getElementById("keyboard"),

        panelRulesOverlay: document.getElementById("panel-rules-overlay"),
        btnRulesClose: document.getElementById("btn-rules-close"),
        btnRulesDone: document.getElementById("btn-rules-done"),

        modalSettings: document.getElementById("modal-settings"),
        settingAnimOn: document.getElementById("setting-anim-on"),
        settingAnimOff: document.getElementById("setting-anim-off"),

        modalStats: document.getElementById("modal-stats"),
        statPlayed: document.getElementById("stat-played"),
        statWinrate: document.getElementById("stat-winrate"),
        statStreak: document.getElementById("stat-streak"),
        statMaxstreak: document.getElementById("stat-maxstreak"),
        distributionChart: document.getElementById("distribution-chart"),

        modalResult: document.getElementById("modal-result"),
        resultTitle: document.getElementById("result-title"),
        resultWord: document.getElementById("result-word"),
        resultDefinition: document.getElementById("result-definition"),
        resultSummary: document.getElementById("result-summary"),
        btnShareResult: document.getElementById("btn-share-result"),
        btnResultVault: document.getElementById("btn-result-vault"),

        toast: document.getElementById("toast")
      };
    }

    initAtmosphere() {
      const container = document.getElementById("bg-icons");
      this.atmosphere = new CocktailGarnishAtmosphere(container, this.settings.bgAnimation);
      this.updateSettingUI();
    }

    setupHomeLink() {
      if (this.dom.homeBtn) {
        this.dom.homeBtn.setAttribute("href", CONFIG.app.homeHubUrl);
      }
    }

    async initApplication() {
      await Promise.all([this.loadPuzzleData(), this.loadWordList()]);
      this.checkCalendarRollover();
      this.updateMenuSummary();
    }

    async loadWordList() {
      try {
        const response = await fetch(CONFIG.data.wordsFile);
        if (!response.ok) throw new Error("Dictionary request failed");
        const text = await response.text();
        const lines = text.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const w = lines[i].trim().toUpperCase();
          if (w.length === 5) VALID_WORDS.add(w);
        }
      } catch (err) {
        // Fallback: Word validation remains operational with puzzle answers
      }
    }

    async loadPuzzleData() {
      try {
        const response = await fetch(CONFIG.data.puzzlesFile);
        if (!response.ok) throw new Error("Puzzle data request failed");
        const text = await response.text();
        const parsed = parseCSV(text);

        const list = parsed
          .filter((p) => p.word && p.word.trim().length === 5)
          .map((p, index) => {
            const word = p.word.toUpperCase().trim();
            const id = p.id ? String(p.id).trim() : `PZ-${String(index + 1).padStart(3, "0")}`;
            return {
              id,
              puzzleIndex: index + 1,
              word,
              definition: p.definition ? p.definition.trim() : ""
            };
          });

        this.puzzles = list.length > 0 ? list : CONFIG.data.fallbackPuzzles;
      } catch (err) {
        this.puzzles = CONFIG.data.fallbackPuzzles.map((p, idx) => ({
          ...p,
          puzzleIndex: idx + 1
        }));
      }

      this.puzzles.forEach((p) => VALID_WORDS.add(p.word));
    }

    /**
     * Determines daily challenge puzzle via continuous sequential cycle.
     */
    getDailyChallengeInfo(dateObj) {
      if (!this.puzzles || this.puzzles.length === 0) return null;

      const date = dateObj || new Date();
      const dayKey = getLocalDayKey(date);
      const totalPuzzles = this.puzzles.length;
      const daysElapsed = calculateDaysDifference(CONFIG.dailyCycle.anchorDate, dayKey);

      // Robust modulo arithmetic handling forward and backward anchor offsets
      const normalizedIndex =
        (((CONFIG.dailyCycle.startIndex + daysElapsed) % totalPuzzles) + totalPuzzles) % totalPuzzles;

      const puzzle = this.puzzles[normalizedIndex];
      return {
        puzzle,
        dayKey,
        formattedDate: formatDisplayDate(date),
        index: normalizedIndex
      };
    }

    checkCalendarRollover() {
      const todayKey = getLocalDayKey();
      if (todayKey !== this.currentLocalDayKey) {
        this.currentLocalDayKey = todayKey;

        // If active in daily game across midnight, refresh state
        if (this.activeIsDaily && !this.views.game.classList.contains("hidden")) {
          const dailyInfo = this.getDailyChallengeInfo();
          if (dailyInfo) {
            this.startPuzzle(dailyInfo.puzzle, true, dailyInfo);
          }
        }

        this.updateMenuSummary();
        if (!this.views.vault.classList.contains("hidden")) {
          this.renderVault();
        }
      }
    }

    getPuzzleStorageKey(puzzle, isDaily, dayKey) {
      return isDaily ? `daily_${dayKey}` : `vault_${puzzle.id}`;
    }

    updateMenuSummary() {
      const dailyInfo = this.getDailyChallengeInfo();

      if (!dailyInfo) {
        this.dom.menuDailyStatus.textContent = "No puzzle available";
        this.dom.navDaily.classList.add("disabled");
      } else {
        this.dom.navDaily.classList.remove("disabled");
        const key = this.getPuzzleStorageKey(dailyInfo.puzzle, true, dailyInfo.dayKey);
        const record = this.state.puzzles[key];

        if (record && record.completed) {
          this.dom.menuDailyStatus.textContent = record.won
            ? `Completed (${record.guesses.length}/6)`
            : "Completed (X/6)";
        } else if (record && record.guesses && record.guesses.length > 0) {
          this.dom.menuDailyStatus.textContent = `In Progress (${record.guesses.length}/6)`;
        } else {
          this.dom.menuDailyStatus.textContent = "Ready to play";
        }
      }

      this.dom.menuVaultCount.textContent = `${this.puzzles.length} available`;
    }

    switchView(viewName) {
      this.checkCalendarRollover();

      Object.keys(this.views).forEach((key) => {
        if (key === viewName) {
          this.views[key].classList.remove("hidden");
        } else {
          this.views[key].classList.add("hidden");
        }
      });

      if (viewName === "game") {
        this.dom.headerGameControls.classList.remove("hidden");
      } else {
        this.dom.headerGameControls.classList.add("hidden");
      }

      if (viewName === "menu") {
        this.updateMenuSummary();
      } else if (viewName === "vault") {
        this.renderVault();
      }
    }

    initBoard() {
      this.dom.board.innerHTML = "";
      for (let r = 0; r < 6; r++) {
        const row = document.createElement("div");
        row.className = "board-row";
        row.setAttribute("role", "row");
        for (let c = 0; c < 5; c++) {
          const tile = document.createElement("div");
          tile.className = "tile";
          tile.setAttribute("role", "gridcell");
          tile.setAttribute("aria-label", "Empty");
          row.appendChild(tile);
        }
        this.dom.board.appendChild(row);
      }
    }

    initKeyboard() {
      const layout = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
      ];

      this.dom.keyboard.innerHTML = "";
      layout.forEach((rowKeys) => {
        const rowEl = document.createElement("div");
        rowEl.className = "keyboard-row";
        rowKeys.forEach((key) => {
          const btn = document.createElement("button");
          btn.className = "key";
          btn.dataset.key = key;
          btn.setAttribute("type", "button");
          btn.textContent = key === "BACK" ? "⌫" : key;
          btn.setAttribute("aria-label", key === "BACK" ? "Backspace" : key);

          if (key === "ENTER" || key === "BACK") {
            btn.classList.add("key-wide");
          }

          btn.addEventListener("click", () => this.handleInput(key));
          rowEl.appendChild(btn);
        });
        this.dom.keyboard.appendChild(rowEl);
      });
    }

    attachEvents() {
      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const activeDialog = document.querySelector("dialog[open]");
        const rulesPanelOpen = this.dom.panelRulesOverlay.classList.contains("active");
        if (activeDialog || rulesPanelOpen) return;

        if (this.views.game.classList.contains("hidden")) return;

        if (e.key === "Enter") {
          this.handleInput("ENTER");
        } else if (e.key === "Backspace") {
          this.handleInput("BACK");
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          this.handleInput(e.key.toUpperCase());
        }
      });

      window.addEventListener("focus", () => this.checkCalendarRollover());
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          this.checkCalendarRollover();
        }
      });

      this.dom.navDaily.addEventListener("click", () => {
        const dailyInfo = this.getDailyChallengeInfo();
        if (dailyInfo) {
          this.startPuzzle(dailyInfo.puzzle, true, dailyInfo);
        } else {
          this.showToast("No puzzle currently available");
        }
      });

      this.dom.navVault.addEventListener("click", () => this.switchView("vault"));
      this.dom.navSettings.addEventListener("click", () => this.openDialog(this.dom.modalSettings));
      this.dom.navRules.addEventListener("click", () => this.openRulesPanel());

      this.dom.btnUtilityStats.addEventListener("click", () => this.renderStatsModal());
      this.dom.btnUtilityShare.addEventListener("click", () => this.shareGameLink());
      this.dom.btnUtilityPlus.addEventListener("click", () => {
        this.showToast("Cocktail Lounge Games Suite");
      });

      this.dom.btnVaultBack.addEventListener("click", () => this.switchView("menu"));
      this.dom.btnGameBack.addEventListener("click", () => this.switchView("menu"));
      this.dom.btnGameRules.addEventListener("click", () => this.openRulesPanel());
      this.dom.btnGameStats.addEventListener("click", () => this.renderStatsModal());

      this.dom.btnRulesClose.addEventListener("click", () => this.closeRulesPanel());
      this.dom.btnRulesDone.addEventListener("click", () => this.closeRulesPanel());
      this.dom.panelRulesOverlay.addEventListener("click", (e) => {
        if (e.target === this.dom.panelRulesOverlay) {
          this.closeRulesPanel();
        }
      });

      this.dom.settingAnimOn.addEventListener("click", () => this.setAnimationPreference(true));
      this.dom.settingAnimOff.addEventListener("click", () => this.setAnimationPreference(false));

      this.dom.btnShareResult.addEventListener("click", () => this.shareResult());
      this.dom.btnResultVault.addEventListener("click", () => {
        this.dom.modalResult.close();
        this.switchView("vault");
      });

      document.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = document.getElementById(btn.dataset.close);
          if (target && typeof target.close === "function") target.close();
        });
      });
    }

    openRulesPanel() {
      this.dom.panelRulesOverlay.classList.add("active");
      this.dom.panelRulesOverlay.setAttribute("aria-hidden", "false");
    }

    closeRulesPanel() {
      this.dom.panelRulesOverlay.classList.remove("active");
      this.dom.panelRulesOverlay.setAttribute("aria-hidden", "true");
    }

    setAnimationPreference(on) {
      this.settings.bgAnimation = on;
      saveSettings(this.settings);
      this.atmosphere.setEnabled(on);
      this.updateSettingUI();
    }

    updateSettingUI() {
      if (this.settings.bgAnimation) {
        this.dom.settingAnimOn.classList.add("active");
        this.dom.settingAnimOff.classList.remove("active");
      } else {
        this.dom.settingAnimOn.classList.remove("active");
        this.dom.settingAnimOff.classList.add("active");
      }
    }

    startPuzzle(puzzle, isDaily, dailyInfo) {
      if (!puzzle) return;

      this.activePuzzle = puzzle;
      this.activeIsDaily = !!isDaily;
      this.activeDayKey = isDaily ? (dailyInfo ? dailyInfo.dayKey : getLocalDayKey()) : null;
      this.activeInput = "";
      this.guesses = [];
      this.isComplete = false;

      const displayDate = isDaily
        ? (dailyInfo ? dailyInfo.formattedDate : formatDisplayDate(new Date()))
        : `Puzzle #${puzzle.puzzleIndex || puzzle.id}`;

      this.dom.gamePuzzleTitle.textContent = isDaily ? "DAILY PUZZLE" : `VAULT PUZZLE`;
      this.dom.gamePuzzleDate.textContent = displayDate;

      this.resetBoardAndKeyboard();

      const storageKey = this.getPuzzleStorageKey(puzzle, isDaily, this.activeDayKey);
      const saved = this.state.puzzles[storageKey];

      if (saved && Array.isArray(saved.guesses)) {
        saved.guesses.forEach((guess) => this.applyGuess(guess));

        if (saved.completed) {
          this.isComplete = true;
          this.dom.gameStatusPill.textContent = saved.won ? "SOLVED" : "GAME OVER";
          this.dom.gameStatusPill.classList.remove("hidden");
        } else {
          this.dom.gameStatusPill.classList.add("hidden");
        }
      } else {
        this.dom.gameStatusPill.classList.add("hidden");
      }

      this.switchView("game");
    }

    resetBoardAndKeyboard() {
      const tiles = this.dom.board.querySelectorAll(".tile");
      tiles.forEach((t) => {
        t.textContent = "";
        t.className = "tile";
        t.removeAttribute("data-state");
        t.setAttribute("aria-label", "Empty");
      });

      const keys = this.dom.keyboard.querySelectorAll(".key");
      keys.forEach((k) => k.classList.remove("correct", "present", "absent"));
    }

    handleInput(key) {
      if (this.isComplete) return;

      if (key === "ENTER") {
        this.submitGuess();
      } else if (key === "BACK") {
        if (this.activeInput.length > 0) {
          this.activeInput = this.activeInput.slice(0, -1);
          this.renderActiveRow();
        }
      } else if (/^[A-Z]$/.test(key)) {
        if (this.activeInput.length < 5) {
          this.activeInput += key;
          this.renderActiveRow();
        }
      }
    }

    renderActiveRow() {
      const rowIndex = this.guesses.length;
      if (rowIndex >= 6) return;

      const row = this.dom.board.children[rowIndex];
      for (let c = 0; c < 5; c++) {
        const tile = row.children[c];
        const letter = this.activeInput[c] || "";
        tile.textContent = letter;
        tile.dataset.state = letter ? "active" : "";
        tile.setAttribute("aria-label", letter || "Empty");
      }
    }

    submitGuess() {
      if (this.activeInput.length !== 5) {
        this.showToast("Not enough letters");
        return;
      }

      const guess = this.activeInput.toUpperCase();
      if (!VALID_WORDS.has(guess)) {
        this.showToast("Not in word list");
        return;
      }

      this.applyGuess(guess);
      this.activeInput = "";

      const won = guess === this.activePuzzle.word;
      const lost = !won && this.guesses.length >= 6;

      if (won || lost) {
        this.isComplete = true;
        this.dom.gameStatusPill.textContent = won ? "SOLVED" : "GAME OVER";
        this.dom.gameStatusPill.classList.remove("hidden");
        this.recordProgress(won);
        setTimeout(() => this.openResultModal(won), 450);
      } else {
        this.saveCurrentProgress(false, false);
      }
    }

    evaluateGuess(guess, target) {
      const evaluation = Array(5).fill("absent");
      const targetLetters = target.split("");
      const guessLetters = guess.split("");
      const targetFreq = {};

      for (const char of targetLetters) {
        targetFreq[char] = (targetFreq[char] || 0) + 1;
      }

      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          evaluation[i] = "correct";
          targetFreq[guessLetters[i]]--;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (evaluation[i] !== "correct" && targetFreq[guessLetters[i]] > 0) {
          evaluation[i] = "present";
          targetFreq[guessLetters[i]]--;
        }
      }

      return evaluation;
    }

    applyGuess(guess) {
      const rowIndex = this.guesses.length;
      if (rowIndex >= 6) return;

      const row = this.dom.board.children[rowIndex];
      const evaluation = this.evaluateGuess(guess, this.activePuzzle.word);

      this.guesses.push(guess);

      for (let c = 0; c < 5; c++) {
        const tile = row.children[c];
        const status = evaluation[c];
        tile.textContent = guess[c];
        tile.className = `tile ${status}`;
        tile.removeAttribute("data-state");
        tile.setAttribute("aria-label", `${guess[c]}, ${status}`);

        const keyBtn = this.dom.keyboard.querySelector(`[data-key="${guess[c]}"]`);
        if (keyBtn) {
          const isCorrect = keyBtn.classList.contains("correct");
          const isPresent = keyBtn.classList.contains("present");

          if (status === "correct") {
            keyBtn.className = "key correct";
          } else if (status === "present" && !isCorrect) {
            keyBtn.className = "key present";
          } else if (status === "absent" && !isCorrect && !isPresent) {
            keyBtn.className = "key absent";
          }
        }
      }
    }

    saveCurrentProgress(completed, won) {
      const storageKey = this.getPuzzleStorageKey(this.activePuzzle, this.activeIsDaily, this.activeDayKey);
      this.state.puzzles[storageKey] = {
        puzzleId: this.activePuzzle.id,
        guesses: this.guesses,
        completed,
        won
      };
      saveGameState(this.state);
    }

    recordProgress(won) {
      this.saveCurrentProgress(true, won);

      if (this.activeIsDaily && this.activeDayKey) {
        const stats = this.state.stats;
        if (stats.lastCompletedDayKey !== this.activeDayKey) {
          stats.played++;
          stats.lastCompletedDayKey = this.activeDayKey;
          if (won) {
            stats.wins++;
            stats.streak++;
            if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
            const guessIdx = this.guesses.length - 1;
            if (guessIdx >= 0 && guessIdx < 6) {
              stats.distribution[guessIdx]++;
            }
          } else {
            stats.streak = 0;
          }
          saveGameState(this.state);
        }
      }
    }

    renderVault() {
      this.dom.vaultList.innerHTML = "";

      if (this.puzzles.length === 0) {
        const msg = document.createElement("p");
        msg.className = "section-note";
        msg.textContent = "No puzzles available in register.";
        this.dom.vaultList.appendChild(msg);
        return;
      }

      this.puzzles.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "vault-card";
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        const vaultStorageKey = this.getPuzzleStorageKey(p, false, null);
        const progress = this.state.puzzles[vaultStorageKey];
        let badgeClass = "unplayed";
        let badgeText = "UNPLAYED";
        let statusText = "Tap to solve";

        if (progress && progress.completed) {
          if (progress.won) {
            badgeClass = "solved";
            badgeText = `${progress.guesses.length}/6`;
            statusText = "Completed";
          } else {
            badgeClass = "failed";
            badgeText = "FAILED";
            statusText = "Not solved";
          }
        } else if (progress && progress.guesses && progress.guesses.length > 0) {
          badgeClass = "unplayed";
          badgeText = `${progress.guesses.length}/6`;
          statusText = "In progress";
        }

        const puzzleNum = p.puzzleIndex || idx + 1;
        card.innerHTML = `
          <div class="vault-card-info">
            <span class="vault-card-date">Vault Puzzle #${puzzleNum}</span>
            <span class="vault-card-status">${statusText}</span>
          </div>
          <span class="vault-badge ${badgeClass}">${badgeText}</span>
        `;

        const startAction = () => this.startPuzzle(p, false, null);
        card.addEventListener("click", startAction);
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            startAction();
          }
        });

        this.dom.vaultList.appendChild(card);
      });
    }

    renderStatsModal() {
      const stats = this.state.stats;
      this.dom.statPlayed.textContent = stats.played;
      this.dom.statWinrate.textContent =
        stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) + "%" : "0%";
      this.dom.statStreak.textContent = stats.streak;
      this.dom.statMaxstreak.textContent = stats.maxStreak;

      this.dom.distributionChart.innerHTML = "";
      const maxCount = Math.max(...stats.distribution, 1);

      stats.distribution.forEach((count, i) => {
        const row = document.createElement("div");
        row.className = "dist-row";

        const label = document.createElement("span");
        label.textContent = i + 1;

        const track = document.createElement("div");
        track.className = "dist-bar-track";

        const bar = document.createElement("div");
        bar.className = "dist-bar-fill";
        bar.style.width = `${Math.max((count / maxCount) * 100, 8)}%`;
        bar.textContent = count;

        const currentSolvedIndex = this.guesses.length - 1;
        const currentKey = this.getPuzzleStorageKey(this.activePuzzle, this.activeIsDaily, this.activeDayKey);
        if (
          this.isComplete &&
          this.state.puzzles[currentKey]?.won &&
          currentSolvedIndex === i
        ) {
          bar.classList.add("highlight");
        }

        track.appendChild(bar);
        row.appendChild(label);
        row.appendChild(track);
        this.dom.distributionChart.appendChild(row);
      });

      this.openDialog(this.dom.modalStats);
    }

    openResultModal(won) {
      this.dom.resultTitle.textContent = won ? "WELL DONE!" : "BETTER LUCK NEXT TIME";
      this.dom.resultWord.textContent = this.activePuzzle.word;
      this.dom.resultDefinition.textContent = this.activePuzzle.definition || "";
      this.dom.resultSummary.textContent = won
        ? `Solved in ${this.guesses.length} of 6 attempts.`
        : "Did not guess the word in 6 attempts.";

      this.openDialog(this.dom.modalResult);
    }

    shareResult() {
      const storageKey = this.getPuzzleStorageKey(this.activePuzzle, this.activeIsDaily, this.activeDayKey);
      const record = this.state.puzzles[storageKey];
      const count = record && record.won ? this.guesses.length : "X";
      const identifier = this.activeIsDaily
        ? formatDisplayDate(new Date())
        : `Vault #${this.activePuzzle.puzzleIndex || this.activePuzzle.id}`;

      let text = `Word Guess (${identifier}) ${count}/6\n\n`;

      this.guesses.forEach((guess) => {
        const evalResult = this.evaluateGuess(guess, this.activePuzzle.word);
        evalResult.forEach((status) => {
          text += status === "correct" ? "🟩" : status === "present" ? "🟨" : "⬛";
        });
        text += "\n";
      });

      if (navigator.share) {
        navigator.share({ title: CONFIG.app.name, text: text.trim() }).catch(() => {
          this.copyToClipboard(text.trim());
        });
      } else {
        this.copyToClipboard(text.trim());
      }
    }

    shareGameLink() {
      const shareData = {
        title: CONFIG.app.name,
        text: "Can you solve today's Word Guess puzzle?",
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {
          this.copyToClipboard(window.location.href);
        });
      } else {
        this.copyToClipboard(window.location.href);
      }
    }

    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast("Link copied to clipboard!");
        });
      } else {
        this.showToast("Clipboard unavailable");
      }
    }

    showToast(message) {
      this.dom.toast.textContent = message;
      this.dom.toast.classList.remove("hidden");
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.dom.toast.classList.add("hidden");
      }, CONFIG.display.toastDurationMs);
    }

    openDialog(modal) {
      if (modal && typeof modal.showModal === "function") {
        modal.showModal();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new WordGuessApp();
  });
})();