/**
 * DAILY QUIZ — COCKTAIL LOUNGE MASTER ENGINE
 * Production Release Edition: Continuous Daily Puzzle Cycle, Authoritative Local Date,
 * 12 Custom Botanical SVG Garnishes & Smoked Obsidian Cocktail Atmosphere.
 */
(function () {
  'use strict';

  // ============================================================================
  // DEVELOPER CONFIGURATION
  // Centralized control panel for application, data, cycle, and display settings.
  // ============================================================================
  const CONFIG = {
    // A. Application Settings
    app: {
      name: 'Daily Quiz',
      version: '2.1.0',
      homeUrl: 'https://tileworksgamesstudio.github.io/86/',
      plusUrl: 'https://tileworksgamesstudio.github.io/86/',
      storageKey: 'cocktail_universal_daily_quiz_state',
      storageVersion: 3
    },

    // B. Data Configuration
    data: {
      csvPath: './puzzles.csv',
      questionsPerRound: 5,
      fetchTimeoutMs: 10000
    },

    // C. Daily Challenge Cycle Configuration
    cycle: {
      // Fixed Gregorian calendar anchor date (YYYY-MM-DD) for deterministic daily rotation
      anchorDate: '2026-01-01',
      // Puzzle collection index (0-based) aligned with the anchor date
      anchorPuzzleIndex: 0
    },

    // D. Display & Atmospheric Configuration
    display: {
      dateFormatOptions: {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      },
      garnishPopulation: 8,
      midnightCheckIntervalMs: 30000
    }
  };

  // --- 12 CUSTOM SVG COCKTAIL GARNISH CATALOGUE ---
  const GARNISH_SVGS = [
    // 1. Orange Twist
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g_ot" x1="15" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFB347"/>
          <stop offset="45%" stop-color="#E86A2D"/>
          <stop offset="100%" stop-color="#9E3812"/>
        </linearGradient>
      </defs>
      <path d="M22 26C35 12 65 14 76 28C88 44 78 72 58 80C42 86 26 78 30 62C34 46 54 44 62 52" 
            stroke="url(#g_ot)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M25 24C36 14 62 16 72 28C80 40 74 62 60 70" 
            stroke="#FFF1BE" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    </svg>`,

    // 2. Lemon Twist
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g_lt" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FFF9A6"/>
          <stop offset="50%" stop-color="#F5DE8C"/>
          <stop offset="100%" stop-color="#CCA048"/>
        </linearGradient>
      </defs>
      <path d="M26 30C38 18 68 18 78 32C88 48 76 74 54 80C36 84 22 68 32 50C40 36 60 40 66 50" 
            stroke="url(#g_lt)" stroke-width="8" stroke-linecap="round"/>
      <path d="M30 26C40 18 64 20 72 30" 
            stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
    </svg>`,

    // 3. Lime Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_lw" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#A4C639"/>
          <stop offset="70%" stop-color="#558B2F"/>
          <stop offset="100%" stop-color="#2E5618"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" stroke="#7CB342" stroke-width="5" fill="none"/>
      <circle cx="50" cy="50" r="40" stroke="#F5DE8C" stroke-width="2" fill="url(#g_lw)" opacity="0.9"/>
      <circle cx="50" cy="50" r="6" fill="#F5DE8C"/>
      <line x1="50" y1="12" x2="50" y2="44" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="50" y1="56" x2="50" y2="88" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="12" y1="50" x2="44" y2="50" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="56" y1="50" x2="88" y2="50" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="23" y1="23" x2="46" y2="46" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="54" y1="54" x2="77" y2="77" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="23" y1="77" x2="46" y2="54" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="54" y1="46" x2="77" y2="23" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
    </svg>`,

    // 4. Grapefruit Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_gw" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF8A80"/>
          <stop offset="65%" stop-color="#E53935"/>
          <stop offset="100%" stop-color="#B71C1C"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="#FFA726" stroke-width="6" fill="none"/>
      <circle cx="50" cy="50" r="40" stroke="#FFF5E4" stroke-width="2" fill="url(#g_gw)" opacity="0.9"/>
      <circle cx="50" cy="50" r="7" fill="#FFF5E4"/>
      <line x1="50" y1="13" x2="50" y2="43" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
      <line x1="50" y1="57" x2="50" y2="87" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
      <line x1="13" y1="50" x2="43" y2="50" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
      <line x1="57" y1="50" x2="87" y2="50" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
      <line x1="24" y1="24" x2="45" y2="45" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
      <line x1="55" y1="55" x2="76" y2="76" stroke="#FFF5E4" stroke-width="2" opacity="0.7"/>
    </svg>`,

    // 5. Blood Orange Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_bo" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#D81B60"/>
          <stop offset="60%" stop-color="#880E4F"/>
          <stop offset="100%" stop-color="#4A0020"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="#FB8C00" stroke-width="5" fill="none"/>
      <circle cx="50" cy="50" r="41" stroke="#F5DE8C" stroke-width="2" fill="url(#g_bo)" opacity="0.92"/>
      <circle cx="50" cy="50" r="6" fill="#F5DE8C"/>
      <line x1="50" y1="12" x2="50" y2="44" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="50" y1="56" x2="50" y2="88" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="12" y1="50" x2="44" y2="50" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="56" y1="50" x2="88" y2="50" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="23" y1="23" x2="46" y2="46" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
      <line x1="54" y1="54" x2="77" y2="77" stroke="#F5DE8C" stroke-width="1.8" opacity="0.75"/>
    </svg>`,

    // 6. Dehydrated Citrus Wheel
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_dc" cx="50" cy="50" r="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#A5772D"/>
          <stop offset="70%" stop-color="#6E4416"/>
          <stop offset="100%" stop-color="#3A2107"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="44" stroke="#523612" stroke-width="6" fill="none"/>
      <circle cx="50" cy="50" r="39" stroke="#CCA048" stroke-width="1.8" fill="url(#g_dc)" opacity="0.88"/>
      <circle cx="50" cy="50" r="5" fill="#CCA048"/>
      <line x1="50" y1="13" x2="50" y2="45" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
      <line x1="50" y1="55" x2="50" y2="87" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
      <line x1="13" y1="50" x2="45" y2="50" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
      <line x1="55" y1="50" x2="87" y2="50" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
      <line x1="24" y1="24" x2="46" y2="46" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
      <line x1="54" y1="54" x2="76" y2="76" stroke="#CCA048" stroke-width="1.5" opacity="0.6"/>
    </svg>`,

    // 7. Single Cocktail Cherry
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_ch" cx="44" cy="58" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF5252"/>
          <stop offset="55%" stop-color="#B71C1C"/>
          <stop offset="100%" stop-color="#310000"/>
        </radialGradient>
      </defs>
      <path d="M50 48C48 28 62 16 74 12" stroke="#A5772D" stroke-width="3" stroke-linecap="round"/>
      <circle cx="48" cy="62" r="28" fill="url(#g_ch)"/>
      <ellipse cx="40" cy="52" rx="6" ry="3.5" transform="rotate(-30 40 52)" fill="#FFFFFF" opacity="0.75"/>
    </svg>`,

    // 8. Double Cherry
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_ch1" cx="30" cy="60" r="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF5252"/>
          <stop offset="60%" stop-color="#B71C1C"/>
          <stop offset="100%" stop-color="#310000"/>
        </radialGradient>
        <radialGradient id="g_ch2" cx="66" cy="66" r="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF5252"/>
          <stop offset="60%" stop-color="#B71C1C"/>
          <stop offset="100%" stop-color="#310000"/>
        </radialGradient>
      </defs>
      <path d="M34 52C36 32 46 20 54 14C62 20 66 38 68 54" stroke="#CCA048" stroke-width="3" stroke-linecap="round"/>
      <circle cx="34" cy="66" r="22" fill="url(#g_ch1)"/>
      <circle cx="68" cy="68" r="20" fill="url(#g_ch2)"/>
      <ellipse cx="28" cy="58" rx="5" ry="3" transform="rotate(-25 28 58)" fill="#FFF" opacity="0.7"/>
    </svg>`,

    // 9. Mint Sprig
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g_mint" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#81C784"/>
          <stop offset="60%" stop-color="#2E7D32"/>
          <stop offset="100%" stop-color="#1B5E20"/>
        </linearGradient>
      </defs>
      <path d="M50 85C50 55 50 30 50 16" stroke="#4CAF50" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 35C35 22 25 35 48 50Z" fill="url(#g_mint)" stroke="#A5D6A7" stroke-width="1"/>
      <path d="M50 35C65 22 75 35 52 50Z" fill="url(#g_mint)" stroke="#A5D6A7" stroke-width="1"/>
      <path d="M50 55C32 42 22 55 48 70Z" fill="url(#g_mint)" stroke="#A5D6A7" stroke-width="1"/>
      <path d="M50 55C68 42 78 55 52 70Z" fill="url(#g_mint)" stroke="#A5D6A7" stroke-width="1"/>
      <path d="M50 20C42 8 58 8 50 20Z" fill="#81C784"/>
    </svg>`,

    // 10. Rosemary Sprig
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 90C48 65 52 35 50 10" stroke="#33691E" stroke-width="3" stroke-linecap="round"/>
      <line x1="50" y1="75" x2="32" y2="65" stroke="#558B2F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="75" x2="68" y2="65" stroke="#558B2F" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="60" x2="30" y2="50" stroke="#689F38" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="60" x2="70" y2="50" stroke="#689F38" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="45" x2="34" y2="35" stroke="#7CB342" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="45" x2="66" y2="35" stroke="#7CB342" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="50" y1="30" x2="38" y2="20" stroke="#8BC34A" stroke-width="2" stroke-linecap="round"/>
      <line x1="50" y1="30" x2="62" y2="20" stroke="#8BC34A" stroke-width="2" stroke-linecap="round"/>
    </svg>`,

    // 11. Green Olive with Pimento
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="g_ol" cx="45" cy="45" r="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9CCC65"/>
          <stop offset="60%" stop-color="#558B2F"/>
          <stop offset="100%" stop-color="#2E5618"/>
        </radialGradient>
      </defs>
      <line x1="20" y1="85" x2="80" y2="15" stroke="#D7CCC8" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="50" cy="50" rx="30" ry="24" transform="rotate(-40 50 50)" fill="url(#g_ol)"/>
      <circle cx="56" cy="45" r="7" fill="#C62828"/>
      <ellipse cx="44" cy="42" rx="4" ry="2" transform="rotate(-30 44 42)" fill="#FFF" opacity="0.6"/>
    </svg>`,

    // 12. Flowing Cucumber Ribbon
    `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g_cuc" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#E8F5E9"/>
          <stop offset="50%" stop-color="#A5D6A7"/>
          <stop offset="100%" stop-color="#388E3C"/>
        </linearGradient>
      </defs>
      <path d="M18 25C35 45 65 15 82 35C90 45 75 75 55 70C35 65 25 85 35 90" 
            stroke="url(#g_cuc)" stroke-width="12" stroke-linecap="round" opacity="0.85"/>
      <path d="M18 25C35 45 65 15 82 35C90 45 75 75 55 70C35 65 25 85 35 90" 
            stroke="#1B5E20" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    </svg>`
  ];

  // --- AUDIO SYNTHESIZER: CRYSTAL, BRASS & HARMONIC RESONANCE ---
  class SoundManager {
    constructor(enabled = true) {
      this.enabled = enabled;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.12, gainVal = 0.08, rampDown = true) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        if (rampDown) {
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        }
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Safe failover
      }
    }

    tap() {
      this.playTone(480, 'triangle', 0.05, 0.05);
    }

    correct() {
      this.playTone(587.33, 'sine', 0.18, 0.12);
      setTimeout(() => {
        this.playTone(880.00, 'sine', 0.28, 0.10);
      }, 70);
    }

    incorrect() {
      this.playTone(220.00, 'sawtooth', 0.18, 0.06);
    }

    complete() {
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((note, idx) => {
        setTimeout(() => this.playTone(note, 'sine', 0.35, 0.10), idx * 80);
      });
    }
  }

  // --- LOCAL CALENDAR CALCULATOR ---
  const CalendarService = {
    getLocalIsoDate(date = new Date()) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    formatDisplayDate(isoDateStr) {
      try {
        const [year, month, day] = isoDateStr.split('-').map(Number);
        const localDate = new Date(year, month - 1, day, 12, 0, 0);
        return new Intl.DateTimeFormat(undefined, CONFIG.display.dateFormatOptions).format(localDate);
      } catch (e) {
        return isoDateStr;
      }
    },

    daysBetween(startDateStr, endDateStr) {
      const [sy, sm, sd] = startDateStr.split('-').map(Number);
      const [ey, em, ed] = endDateStr.split('-').map(Number);
      const startUtc = Date.UTC(sy, sm - 1, sd);
      const endUtc = Date.UTC(ey, em - 1, ed);
      return Math.floor((endUtc - startUtc) / 86400000);
    }
  };

  // --- PERSISTENCE & STORAGE MANAGER ---
  const Storage = {
    load() {
      const fallback = {
        version: CONFIG.app.storageVersion,
        sound: true,
        backgroundAnimation: true,
        streak: 0,
        bestStreak: 0,
        lastCompletedDate: null,
        history: {},
        inProgress: null
      };

      try {
        const raw = localStorage.getItem(CONFIG.app.storageKey);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return fallback;

        return {
          version: CONFIG.app.storageVersion,
          sound: typeof parsed.sound === 'boolean' ? parsed.sound : true,
          backgroundAnimation: typeof parsed.backgroundAnimation === 'boolean' ? parsed.backgroundAnimation : true,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : (parsed.streak || 0),
          lastCompletedDate: parsed.lastCompletedDate || null,
          history: parsed.history && typeof parsed.history === 'object' ? parsed.history : {},
          inProgress: parsed.inProgress && typeof parsed.inProgress === 'object' ? parsed.inProgress : null
        };
      } catch (e) {
        return fallback;
      }
    },

    save(state) {
      try {
        localStorage.setItem(CONFIG.app.storageKey, JSON.stringify(state));
      } catch (e) {
        // Safe failover
      }
    }
  };

  // --- RFC 4180 CSV PARSER ---
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field.trim());
        field = '';
      } else if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
        if (char === '\r') i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
    if (field || row.length > 0) {
      row.push(field.trim());
      rows.push(row);
    }

    if (rows.length < 2) throw new Error('Data file missing or empty.');
    const headers = rows[0].map(h => h.toLowerCase());
    const records = [];

    for (let r = 1; r < rows.length; r++) {
      if (rows[r].length === 1 && rows[r][0] === '') continue;
      const item = {};
      headers.forEach((h, idx) => {
        item[h] = rows[r][idx] !== undefined ? rows[r][idx] : '';
      });
      records.push(item);
    }
    return records;
  }

  function resolveAnswerIndex(letter) {
    const clean = String(letter).trim().toUpperCase();
    if (clean === 'A' || clean === '0') return 0;
    if (clean === 'B' || clean === '1') return 1;
    if (clean === 'C' || clean === '2') return 2;
    if (clean === 'D' || clean === '3') return 3;
    return 0;
  }

  // --- UPWARD FLOATING GARNISH FLIGHT ENGINE ---
  class GarnishFlightEngine {
    constructor(container, enabled = true) {
      this.container = container;
      this.enabled = enabled;
      this.garnishes = [];
      this.animFrame = null;
      this.lastTime = 0;
      this.isRunning = false;
    }

    init() {
      if (!this.container) return;
      this.container.innerHTML = '';
      this.garnishes = [];

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        this.enabled = false;
      }

      for (let i = 0; i < CONFIG.display.garnishPopulation; i++) {
        const item = this.createGarnish(i, true);
        this.container.appendChild(item.el);
        this.garnishes.push(item);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.stop();
        } else if (this.enabled) {
          this.start();
        }
      });

      if (this.enabled) {
        this.start();
      }
    }

    createGarnish(index, initialScatter = false) {
      const el = document.createElement('div');
      el.className = 'garnish-item';

      const depthPlane = index % 3;
      el.classList.add(depthPlane === 0 ? 'depth-back' : depthPlane === 1 ? 'depth-mid' : 'depth-fore');

      const svgIndex = (index * 3 + Math.floor(Math.random() * 3)) % GARNISH_SVGS.length;
      el.innerHTML = `
        <div class="garnish-svg-wrapper">
          <div class="garnish-glow-bloom"></div>
          <div class="garnish-svg-art">${GARNISH_SVGS[svgIndex]}</div>
        </div>
      `;

      const baseScale = depthPlane === 0 ? 0.72 : depthPlane === 1 ? 0.95 : 1.25;
      const sizePx = depthPlane === 0 ? 38 : depthPlane === 1 ? 52 : 68;
      el.style.width = `${sizePx}px`;
      el.style.height = `${sizePx}px`;

      const upwardSpeed = depthPlane === 0 ? (12 + Math.random() * 6) : depthPlane === 1 ? (18 + Math.random() * 8) : (24 + Math.random() * 10);
      const waveAmplitude = 1.2 + Math.random() * 2.5;
      const waveFreq = 0.6 + Math.random() * 0.8;
      const waveOffset = Math.random() * Math.PI * 2;
      const rotSpeed = (Math.random() - 0.5) * 16;

      const startY = initialScatter ? (Math.random() * 115) : (105 + Math.random() * 10);
      const startX = 4 + Math.random() * 90;

      return {
        el,
        x: startX,
        y: startY,
        upwardSpeed,
        waveAmplitude,
        waveFreq,
        waveOffset,
        rotation: Math.random() * 360,
        rotSpeed,
        scale: baseScale,
        depthPlane
      };
    }

    start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.lastTime = performance.now();

      const step = (now) => {
        if (!this.isRunning) return;
        const dt = Math.min((now - this.lastTime) / 1000, 0.1);
        this.lastTime = now;

        this.garnishes.forEach((g) => {
          g.y -= (g.upwardSpeed * dt) * 0.45;
          g.rotation += g.rotSpeed * dt;

          if (g.y < -15) {
            g.y = 105 + Math.random() * 8;
            g.x = 4 + Math.random() * 90;
          }

          const driftX = Math.sin(now * 0.001 * g.waveFreq + g.waveOffset) * g.waveAmplitude;
          const currentX = g.x + driftX;
          g.el.style.transform = `translate3d(${currentX}vw, ${g.y}vh, 0) rotate(${g.rotation}deg) scale(${g.scale})`;
        });

        this.animFrame = requestAnimationFrame(step);
      };

      this.animFrame = requestAnimationFrame(step);
    }

    stop() {
      this.isRunning = false;
      if (this.animFrame) {
        cancelAnimationFrame(this.animFrame);
        this.animFrame = null;
      }
    }

    setEnabled(val) {
      this.enabled = val;
      if (this.enabled) {
        this.start();
      } else {
        this.stop();
      }
    }
  }

  // --- APPLICATION ORCHESTRATOR ---
  class DailyQuizApp {
    constructor() {
      this.state = Storage.load();
      this.sound = new SoundManager(this.state.sound);

      // Shared canonical puzzle collection: each puzzle is a structured 5-question round
      this.puzzles = [];
      this.currentLocalDateStr = CalendarService.getLocalIsoDate();
      this.activeDailyPuzzle = null;

      // Active gameplay session state
      this.activeRound = null;
      this.currentIndex = 0;
      this.sessionAnswers = [];
      this.isReview = false;
      this.selectedAnswer = null;

      this.activeDrawer = null;
      this.midnightTimer = null;

      this.cacheDom();
      this.atmosphere = new GarnishFlightEngine(this.dom.floatingIconsContainer, this.state.backgroundAnimation);
      this.atmosphere.init();

      this.bindEvents();
      this.updateTogglesUI();
      this.init();
      this.startMidnightWatcher();
    }

    cacheDom() {
      this.dom = {
        appHeaderTitle: document.getElementById('appHeaderTitle'),
        headerHomeBtn: document.getElementById('headerHomeBtn'),
        headerBackBtn: document.getElementById('headerBackBtn'),
        quickSoundBtn: document.getElementById('quickSoundBtn'),
        quickSoundIcon: document.getElementById('quickSoundIcon'),
        floatingIconsContainer: document.getElementById('floatingIconsContainer'),

        statusView: document.getElementById('statusView'),
        statusTitle: document.getElementById('statusTitle'),
        statusMessage: document.getElementById('statusMessage'),
        statusRetryBtn: document.getElementById('statusRetryBtn'),

        menuView: document.getElementById('menuView'),
        playTodayBtn: document.getElementById('playTodayBtn'),
        playTodayTitle: document.getElementById('playTodayTitle'),
        menuTodayBadge: document.getElementById('menuTodayBadge'),
        menuReleaseDate: document.getElementById('menuReleaseDate'),
        openVaultBtn: document.getElementById('openVaultBtn'),
        vaultCountBadge: document.getElementById('vaultCountBadge'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        openHowToPlayBtn: document.getElementById('openHowToPlayBtn'),

        statsUtilityBtn: document.getElementById('statsUtilityBtn'),
        shareUtilityBtn: document.getElementById('shareUtilityBtn'),
        plusUtilityBtn: document.getElementById('plusUtilityBtn'),

        gameView: document.getElementById('gameView'),
        gameModeBadge: document.getElementById('gameModeBadge'),
        stepperTrack: document.getElementById('stepperTrack'),
        questionCounterLabel: document.getElementById('questionCounterLabel'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        explanationPanel: document.getElementById('explanationPanel'),
        answerIndicator: document.getElementById('answerIndicator'),
        explanationText: document.getElementById('explanationText'),
        nextQuestionBtn: document.getElementById('nextQuestionBtn'),

        resultsView: document.getElementById('resultsView'),
        resultsHeadline: document.getElementById('resultsHeadline'),
        scoreValue: document.getElementById('scoreValue'),
        scoreTotal: document.getElementById('scoreTotal'),
        resultsBreakdown: document.getElementById('resultsBreakdown'),
        resultsStreakValue: document.getElementById('resultsStreakValue'),
        resultsAccuracyValue: document.getElementById('resultsAccuracyValue'),
        shareScoreBtn: document.getElementById('shareScoreBtn'),
        reviewQuizBtn: document.getElementById('reviewQuizBtn'),
        resultsVaultBtn: document.getElementById('resultsVaultBtn'),
        resultsMenuBtn: document.getElementById('resultsMenuBtn'),

        vaultView: document.getElementById('vaultView'),
        vaultList: document.getElementById('vaultList'),
        vaultEmptyMsg: document.getElementById('vaultEmptyMsg'),
        vaultTotalBadge: document.getElementById('vaultTotalBadge'),

        panelBackdrop: document.getElementById('panelBackdrop'),
        howToPlayDrawer: document.getElementById('howToPlayDrawer'),
        closeHowToBtn: document.getElementById('closeHowToBtn'),

        settingsDrawer: document.getElementById('settingsDrawer'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        toggleAnimationBtn: document.getElementById('toggleAnimationBtn'),
        toggleSoundBtn: document.getElementById('toggleSoundBtn'),
        resetDataBtn: document.getElementById('resetDataBtn'),

        statsDrawer: document.getElementById('statsDrawer'),
        closeStatsBtn: document.getElementById('closeStatsBtn'),
        statPlayed: document.getElementById('statPlayed'),
        statAccuracy: document.getElementById('statAccuracy'),
        statCurrentStreak: document.getElementById('statCurrentStreak'),
        statBestStreak: document.getElementById('statBestStreak'),
        scoreDistributionChart: document.getElementById('scoreDistributionChart'),

        toastMessage: document.getElementById('toastMessage')
      };
    }

    bindEvents() {
      this.dom.headerBackBtn.addEventListener('click', () => {
        this.sound.tap();
        this.showView('menuView');
      });

      this.dom.quickSoundBtn.addEventListener('click', () => {
        this.toggleSound();
      });

      this.dom.statusRetryBtn.addEventListener('click', () => {
        this.sound.tap();
        this.init();
      });

      this.dom.playTodayBtn.addEventListener('click', () => {
        this.sound.tap();
        if (this.activeDailyPuzzle) {
          this.startRound(this.activeDailyPuzzle, true);
        }
      });

      this.dom.openVaultBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderVault();
      });

      this.dom.openSettingsBtn.addEventListener('click', () => {
        this.sound.tap();
        this.openDrawer(this.dom.settingsDrawer);
      });

      this.dom.openHowToPlayBtn.addEventListener('click', () => {
        this.sound.tap();
        this.openDrawer(this.dom.howToPlayDrawer);
      });

      this.dom.statsUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderStats();
        this.openDrawer(this.dom.statsDrawer);
      });

      this.dom.shareUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        this.shareGameLink();
      });

      this.dom.plusUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        window.location.href = CONFIG.app.plusUrl;
      });

      this.dom.closeHowToBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.closeSettingsBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.closeStatsBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.panelBackdrop.addEventListener('click', () => this.closeActiveDrawer());

      this.dom.toggleAnimationBtn.addEventListener('click', () => {
        this.state.backgroundAnimation = !this.state.backgroundAnimation;
        Storage.save(this.state);
        this.atmosphere.setEnabled(this.state.backgroundAnimation);
        this.updateTogglesUI();
        this.sound.tap();
      });

      this.dom.toggleSoundBtn.addEventListener('click', () => {
        this.toggleSound();
      });

      this.dom.resetDataBtn.addEventListener('click', () => {
        if (window.confirm('Reset all Daily Quiz progress, history, and streaks on this device?')) {
          localStorage.removeItem(CONFIG.app.storageKey);
          this.state = Storage.load();
          this.sound.enabled = this.state.sound;
          this.atmosphere.setEnabled(this.state.backgroundAnimation);
          this.updateTogglesUI();
          this.renderMenu();
          this.closeActiveDrawer();
          this.showToast('Progress reset.');
        }
      });

      this.dom.nextQuestionBtn.addEventListener('click', () => {
        this.sound.tap();
        this.handleNextQuestion();
      });

      this.dom.shareScoreBtn.addEventListener('click', () => this.shareScoreResult());
      this.dom.reviewQuizBtn.addEventListener('click', () => {
        this.sound.tap();
        this.startReview();
      });
      this.dom.resultsVaultBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderVault();
      });
      this.dom.resultsMenuBtn.addEventListener('click', () => {
        this.sound.tap();
        this.showView('menuView');
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeDrawer) {
          this.closeActiveDrawer();
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.checkDayTransition();
        }
      });

      window.addEventListener('focus', () => {
        this.checkDayTransition();
      });
    }

    startMidnightWatcher() {
      if (this.midnightTimer) clearInterval(this.midnightTimer);
      this.midnightTimer = setInterval(() => {
        this.checkDayTransition();
      }, CONFIG.display.midnightCheckIntervalMs);
    }

    checkDayTransition() {
      const latestLocalDateStr = CalendarService.getLocalIsoDate();
      if (latestLocalDateStr !== this.currentLocalDateStr) {
        this.currentLocalDateStr = latestLocalDateStr;
        if (this.puzzles.length > 0) {
          this.selectDailyPuzzleForDate(this.currentLocalDateStr);
          this.renderMenu();
          if (this.dom.vaultView && !this.dom.vaultView.classList.contains('hidden')) {
            this.renderVault();
          }
        }
      }
    }

    toggleSound() {
      this.sound.enabled = !this.sound.enabled;
      this.state.sound = this.sound.enabled;
      Storage.save(this.state);
      this.updateTogglesUI();
      if (this.sound.enabled) this.sound.tap();
    }

    updateTogglesUI() {
      this.dom.quickSoundIcon.innerHTML = this.sound.enabled
        ? `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>`
        : `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>`;

      this.dom.toggleSoundBtn.setAttribute('aria-checked', String(this.sound.enabled));
      this.dom.toggleSoundBtn.querySelector('.toggle-state').textContent = this.sound.enabled ? 'ON' : 'OFF';

      this.dom.toggleAnimationBtn.setAttribute('aria-checked', String(this.state.backgroundAnimation));
      this.dom.toggleAnimationBtn.querySelector('.toggle-state').textContent = this.state.backgroundAnimation ? 'ON' : 'OFF';
    }

    openDrawer(drawerEl) {
      if (this.activeDrawer && this.activeDrawer !== drawerEl) {
        this.activeDrawer.classList.remove('open');
        this.activeDrawer.hidden = true;
      }
      this.activeDrawer = drawerEl;
      this.dom.panelBackdrop.classList.remove('hidden');

      drawerEl.hidden = false;
      void drawerEl.offsetWidth;

      this.dom.panelBackdrop.classList.add('visible');
      drawerEl.classList.add('open');

      const closeBtn = drawerEl.querySelector('.drawer-close-btn');
      if (closeBtn) closeBtn.focus();
    }

    closeActiveDrawer() {
      if (!this.activeDrawer) return;
      this.sound.tap();
      const target = this.activeDrawer;
      this.activeDrawer = null;

      target.classList.remove('open');
      this.dom.panelBackdrop.classList.remove('visible');

      setTimeout(() => {
        target.hidden = true;
        this.dom.panelBackdrop.classList.add('hidden');
      }, 400);
    }

    showView(viewName) {
      const views = ['statusView', 'menuView', 'gameView', 'resultsView', 'vaultView'];
      views.forEach(v => this.dom[v].classList.add('hidden'));
      this.dom[viewName].classList.remove('hidden');

      if (viewName === 'menuView') {
        this.dom.appHeaderTitle.textContent = CONFIG.app.name;
        this.dom.headerHomeBtn.classList.remove('hidden');
        this.dom.headerBackBtn.classList.add('hidden');
        this.renderMenu();
      } else if (viewName === 'gameView') {
        this.dom.appHeaderTitle.textContent = this.activeRound
          ? (this.activeRound.isDaily ? 'Daily Challenge' : `Vault #${this.activeRound.puzzleNumber}`)
          : CONFIG.app.name;
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else if (viewName === 'vaultView') {
        this.dom.appHeaderTitle.textContent = 'The Vault';
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else if (viewName === 'resultsView') {
        this.dom.appHeaderTitle.textContent = 'Summary';
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else {
        this.dom.appHeaderTitle.textContent = CONFIG.app.name;
        this.dom.headerHomeBtn.classList.remove('hidden');
        this.dom.headerBackBtn.classList.add('hidden');
      }
      window.scrollTo(0, 0);
    }

    // --- CONTINUOUS DAILY CYCLE ARITHMETIC ---
    calculateDailyIndex(localIsoDateStr, totalPuzzles) {
      if (!totalPuzzles || totalPuzzles <= 0) return 0;
      const daysElapsed = CalendarService.daysBetween(CONFIG.cycle.anchorDate, localIsoDateStr);
      const rawIndex = (CONFIG.cycle.anchorPuzzleIndex + daysElapsed) % totalPuzzles;
      return (rawIndex + totalPuzzles) % totalPuzzles;
    }

    selectDailyPuzzleForDate(localIsoDateStr) {
      if (this.puzzles.length === 0) {
        this.activeDailyPuzzle = null;
        return;
      }
      const cycleIndex = this.calculateDailyIndex(localIsoDateStr, this.puzzles.length);
      this.activeDailyPuzzle = this.puzzles[cycleIndex];
    }

    // --- INITIALIZATION AND DATA INGESTION ---
    async init() {
      this.dom.statusTitle.textContent = 'Synchronizing';
      this.dom.statusMessage.textContent = 'Loading authoritative puzzle records...';
      this.dom.statusRetryBtn.classList.add('hidden');
      this.showView('statusView');

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.data.fetchTimeoutMs);

        const csvRes = await fetch(CONFIG.data.csvPath, {
          cache: 'no-store',
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!csvRes.ok) throw new Error('Could not retrieve puzzle data sheet.');
        const csvRaw = await csvRes.text();
        const records = parseCsv(csvRaw);

        // Filter valid question records regardless of any date column presence
        const validQuestions = [];
        records.forEach(row => {
          if (!row.question || !String(row.question).trim()) return;
          const options = [
            row.option_a || '',
            row.option_b || '',
            row.option_c || '',
            row.option_d || ''
          ];
          if (!options[0] && !options[1]) return;

          validQuestions.push({
            question: row.question.trim(),
            options: options.map(o => o.trim()),
            answerIndex: resolveAnswerIndex(row.answer),
            explanation: (row.explanation || '').trim()
          });
        });

        if (validQuestions.length === 0) {
          throw new Error('No valid questions found in the dataset.');
        }

        // Chunk valid questions sequentially into 5-question puzzle rounds
        const qPerRound = CONFIG.data.questionsPerRound;
        this.puzzles = [];
        for (let i = 0; i < validQuestions.length; i += qPerRound) {
          const slice = validQuestions.slice(i, i + qPerRound);
          if (slice.length > 0) {
            const puzzleNumber = this.puzzles.length + 1;
            this.puzzles.push({
              id: `puzzle_${puzzleNumber}`,
              puzzleNumber: puzzleNumber,
              title: `Challenge #${puzzleNumber}`,
              questions: slice
            });
          }
        }

        if (this.puzzles.length === 0) {
          throw new Error('Unable to construct puzzle challenges.');
        }

        this.currentLocalDateStr = CalendarService.getLocalIsoDate();
        this.selectDailyPuzzleForDate(this.currentLocalDateStr);
        this.showView('menuView');

      } catch (err) {
        this.dom.statusTitle.textContent = 'Connection Notice';
        this.dom.statusMessage.textContent = err.message || 'Unable to initialize puzzle data at this time.';
        this.dom.statusRetryBtn.classList.remove('hidden');
        this.showView('statusView');
      }
    }

    renderMenu() {
      this.dom.vaultCountBadge.textContent = `${this.puzzles.length} Available`;

      if (!this.activeDailyPuzzle) {
        this.dom.playTodayTitle.textContent = 'No Challenge Available';
        this.dom.menuReleaseDate.textContent = 'Please check connection';
        this.dom.playTodayBtn.disabled = true;
        return;
      }

      this.dom.playTodayBtn.disabled = false;
      const formattedDate = CalendarService.formatDisplayDate(this.currentLocalDateStr);
      this.dom.menuReleaseDate.textContent = `${formattedDate} • ${this.activeDailyPuzzle.questions.length} Questions`;

      // Check daily progress mapped strictly to today's local calendar date
      const dailyKey = `daily_${this.currentLocalDateStr}`;
      const hist = this.state.history[dailyKey];
      const inProg = this.state.inProgress && this.state.inProgress.sessionId === dailyKey;

      if (hist && hist.completed) {
        this.dom.playTodayTitle.textContent = 'View Today\'s Results';
        this.dom.menuTodayBadge.textContent = `Completed (${hist.score}/${hist.answers.length})`;
        this.dom.menuTodayBadge.className = 'badge completed';
      } else if (inProg) {
        const count = inProg.answers ? inProg.answers.length : 0;
        const total = this.activeDailyPuzzle.questions.length;
        this.dom.playTodayTitle.textContent = 'Resume Daily Challenge';
        this.dom.menuTodayBadge.textContent = `In Progress (${count}/${total})`;
        this.dom.menuTodayBadge.className = 'badge';
      } else {
        this.dom.playTodayTitle.textContent = 'Play Daily Challenge';
        this.dom.menuTodayBadge.textContent = 'Ready';
        this.dom.menuTodayBadge.className = 'badge';
      }
    }

    startRound(puzzle, isDaily = false) {
      if (!puzzle || !puzzle.questions || puzzle.questions.length === 0) return;

      const sessionId = isDaily ? `daily_${this.currentLocalDateStr}` : `vault_${puzzle.id}`;

      this.activeRound = {
        sessionId: sessionId,
        puzzleId: puzzle.id,
        puzzleNumber: puzzle.puzzleNumber,
        isDaily: isDaily,
        dateStr: isDaily ? this.currentLocalDateStr : null,
        questions: puzzle.questions
      };

      this.isReview = false;
      this.selectedAnswer = null;

      const hist = this.state.history[sessionId];
      if (hist && hist.completed) {
        this.sessionAnswers = hist.answers;
        this.showResults(hist.score);
        return;
      }

      if (isDaily && this.state.inProgress && this.state.inProgress.sessionId === sessionId) {
        this.currentIndex = this.state.inProgress.currentIndex || 0;
        this.sessionAnswers = this.state.inProgress.answers || [];
      } else {
        this.currentIndex = 0;
        this.sessionAnswers = [];
      }

      const formattedDate = CalendarService.formatDisplayDate(this.currentLocalDateStr);
      this.dom.gameModeBadge.textContent = isDaily
        ? `Daily Challenge • ${formattedDate}`
        : `Vault • Challenge #${puzzle.puzzleNumber}`;

      this.showView('gameView');
      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.activeRound.questions[this.currentIndex];
      const total = this.activeRound.questions.length;
      this.selectedAnswer = null;

      this.dom.questionCounterLabel.textContent = `Question ${this.currentIndex + 1} of ${total}`;
      this.dom.questionText.textContent = q.question;
      this.dom.explanationPanel.classList.add('hidden');
      this.dom.optionsContainer.innerHTML = '';
      this.updateStepper();

      const labels = ['A', 'B', 'C', 'D'];
      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.type = 'button';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${optText}</span>`;

        btn.addEventListener('click', () => {
          this.selectOption(idx);
        });

        this.dom.optionsContainer.appendChild(btn);
      });

      const isLast = (this.currentIndex === total - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Complete Quiz' : 'Next Question';
    }

    updateStepper() {
      this.dom.stepperTrack.innerHTML = '';
      this.activeRound.questions.forEach((_, idx) => {
        const pip = document.createElement('div');
        pip.className = 'step-pip';
        pip.textContent = idx + 1;
        pip.setAttribute('aria-label', `Question ${idx + 1}`);

        if (idx === this.currentIndex) {
          pip.classList.add('current');
        } else if (idx < this.sessionAnswers.length) {
          pip.classList.add(this.sessionAnswers[idx].isCorrect ? 'correct' : 'incorrect');
        }
        this.dom.stepperTrack.appendChild(pip);
      });
    }

    selectOption(idx) {
      if (this.selectedAnswer !== null) return;
      this.selectedAnswer = idx;

      const q = this.activeRound.questions[this.currentIndex];
      const isCorrect = (idx === q.answerIndex);
      this.sessionAnswers.push({ chosen: idx, isCorrect });

      if (isCorrect) {
        this.sound.correct();
        this.dom.answerIndicator.textContent = '✓ Correct';
        this.dom.answerIndicator.className = 'badge completed';
      } else {
        this.sound.incorrect();
        this.dom.answerIndicator.textContent = '✕ Incorrect';
        this.dom.answerIndicator.className = 'badge';
        this.dom.answerIndicator.style.borderColor = 'rgba(220, 70, 60, 0.7)';
        this.dom.answerIndicator.style.color = 'var(--color-incorrect-text)';
      }

      const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
      buttons.forEach((btn, bIdx) => {
        btn.disabled = true;
        if (bIdx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (bIdx === idx && !isCorrect) {
          btn.classList.add('incorrect');
        }
        if (bIdx === idx) {
          btn.setAttribute('aria-checked', 'true');
        }
      });

      this.dom.explanationText.textContent = q.explanation || 'Verified reference answer.';
      this.dom.explanationPanel.classList.remove('hidden');
      this.updateStepper();

      if (this.activeRound.isDaily) {
        this.state.inProgress = {
          sessionId: this.activeRound.sessionId,
          currentIndex: this.currentIndex,
          answers: this.sessionAnswers
        };
        Storage.save(this.state);
      }

      this.dom.nextQuestionBtn.focus();
    }

    handleNextQuestion() {
      if (this.isReview) {
        if (this.currentIndex < this.activeRound.questions.length - 1) {
          this.currentIndex++;
          this.renderReviewQuestion();
        } else {
          this.showView('resultsView');
        }
        return;
      }

      if (this.currentIndex < this.activeRound.questions.length - 1) {
        this.currentIndex++;
        if (this.activeRound.isDaily && this.state.inProgress) {
          this.state.inProgress.currentIndex = this.currentIndex;
          Storage.save(this.state);
        }
        this.renderQuestion();
      } else {
        this.finishRound();
      }
    }

    finishRound() {
      const score = this.sessionAnswers.filter(a => a.isCorrect).length;

      if (this.activeRound.isDaily) {
        const todayIso = this.currentLocalDateStr;
        if (this.state.lastCompletedDate) {
          const diffDays = CalendarService.daysBetween(this.state.lastCompletedDate, todayIso);
          if (diffDays === 1) {
            this.state.streak = (this.state.streak || 0) + 1;
          } else if (diffDays > 1) {
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
        answers: this.sessionAnswers
      };
      Storage.save(this.state);

      this.sound.complete();
      this.showResults(score);
    }

    showResults(score) {
      this.showView('resultsView');
      const total = this.sessionAnswers.length;
      this.dom.scoreValue.textContent = score;
      this.dom.scoreTotal.textContent = `/ ${total}`;

      this.dom.resultsStreakValue.textContent = this.state.streak || 0;
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      this.dom.resultsAccuracyValue.textContent = `${accuracy}%`;

      this.dom.resultsBreakdown.innerHTML = '';
      this.sessionAnswers.forEach((ans, idx) => {
        const pip = document.createElement('div');
        pip.className = `result-pip ${ans.isCorrect ? 'correct' : 'incorrect'}`;
        pip.textContent = ans.isCorrect ? '✓' : '✕';
        pip.setAttribute('aria-label', `Question ${idx + 1}: ${ans.isCorrect ? 'Correct' : 'Incorrect'}`);
        this.dom.resultsBreakdown.appendChild(pip);
      });
    }

    startReview() {
      this.isReview = true;
      this.currentIndex = 0;
      this.showView('gameView');
      this.renderReviewQuestion();
    }

    renderReviewQuestion() {
      const q = this.activeRound.questions[this.currentIndex];
      const total = this.activeRound.questions.length;
      const ans = this.sessionAnswers[this.currentIndex] || { chosen: -1, isCorrect: false };
      this.updateStepper();

      this.dom.questionCounterLabel.textContent = `Reviewing ${this.currentIndex + 1} of ${total}`;
      this.dom.questionText.textContent = q.question;
      this.dom.optionsContainer.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.disabled = true;
        if (idx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (idx === ans.chosen && !ans.isCorrect) {
          btn.classList.add('incorrect');
        }
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${optText}</span>`;
        this.dom.optionsContainer.appendChild(btn);
      });

      if (ans.isCorrect) {
        this.dom.answerIndicator.textContent = '✓ Correct';
        this.dom.answerIndicator.className = 'badge completed';
      } else {
        this.dom.answerIndicator.textContent = '✕ Incorrect';
        this.dom.answerIndicator.className = 'badge';
        this.dom.answerIndicator.style.borderColor = 'rgba(220, 70, 60, 0.7)';
        this.dom.answerIndicator.style.color = 'var(--color-incorrect-text)';
      }

      this.dom.explanationText.textContent = q.explanation || 'Verified reference answer.';
      this.dom.explanationPanel.classList.remove('hidden');

      const isLast = (this.currentIndex === total - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Return to Summary' : 'Next Question';
    }

    renderVault() {
      this.showView('vaultView');
      this.dom.vaultList.innerHTML = '';
      this.dom.vaultTotalBadge.textContent = `${this.puzzles.length} Puzzles`;

      if (this.puzzles.length === 0) {
        this.dom.vaultEmptyMsg.classList.remove('hidden');
        return;
      }
      this.dom.vaultEmptyMsg.classList.add('hidden');

      this.puzzles.forEach(puzzle => {
        const row = document.createElement('button');
        row.className = 'vault-row';
        row.type = 'button';

        const sessionId = `vault_${puzzle.id}`;
        const hist = this.state.history[sessionId];
        const isDone = hist && hist.completed;

        const isCurrentDaily = (this.activeDailyPuzzle && this.activeDailyPuzzle.id === puzzle.id);

        row.innerHTML = `
          <div class="vault-info">
            <span class="vault-row-date">Challenge #${puzzle.puzzleNumber}</span>
            ${isCurrentDaily ? '<span class="vault-active-tag">Today\'s Cycle</span>' : ''}
          </div>
          <span class="badge ${isDone ? 'completed' : ''}">
            ${isDone ? `Score: ${hist.score}/${hist.answers.length}` : 'Play'}
          </span>
        `;

        row.addEventListener('click', () => {
          this.sound.tap();
          this.startRound(puzzle, false);
        });

        this.dom.vaultList.appendChild(row);
      });
    }

    renderStats() {
      const completedEntries = Object.values(this.state.history).filter(h => h.completed);
      const playedCount = completedEntries.length;

      let totalQuestions = 0;
      let totalCorrect = 0;
      const scoreDist = [0, 0, 0, 0, 0, 0];

      completedEntries.forEach(item => {
        const score = item.score || 0;
        if (score >= 0 && score <= 5) scoreDist[score]++;
        totalCorrect += score;
        totalQuestions += (item.answers ? item.answers.length : 5);
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      this.dom.statPlayed.textContent = playedCount;
      this.dom.statAccuracy.textContent = `${accuracy}%`;
      this.dom.statCurrentStreak.textContent = this.state.streak || 0;
      this.dom.statBestStreak.textContent = this.state.bestStreak || (this.state.streak || 0);

      this.dom.scoreDistributionChart.innerHTML = '';
      const maxDist = Math.max(...scoreDist, 1);

      for (let s = 5; s >= 0; s--) {
        const count = scoreDist[s];
        const pct = Math.max(Math.round((count / maxDist) * 100), 10);
        const row = document.createElement('div');
        row.className = 'dist-bar-row';
        row.innerHTML = `
          <span class="dist-bar-num">${s}</span>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${count > 0 ? pct : 0}%;">${count}</div>
          </div>
        `;
        this.dom.scoreDistributionChart.appendChild(row);
      }
    }

    shareGameLink() {
      const shareData = {
        title: CONFIG.app.name,
        text: 'Test your general knowledge with today\'s Daily Quiz in the Nocturne Lounge!',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => this.showToast('Link copied to clipboard!'))
          .catch(() => this.showToast('Unable to copy link.'));
      } else {
        this.showToast('Sharing not supported on this browser.');
      }
    }

    shareScoreResult() {
      const score = this.sessionAnswers.filter(a => a.isCorrect).length;
      const total = this.sessionAnswers.length;
      const pips = this.sessionAnswers.map(a => a.isCorrect ? '🟩' : '⬛').join('');
      const label = this.activeRound.isDaily
        ? `Daily Challenge • ${CalendarService.formatDisplayDate(this.currentLocalDateStr)}`
        : `Vault Challenge #${this.activeRound.puzzleNumber}`;
      const text = `${CONFIG.app.name} • ${label}\nScore: ${score}/${total}\n${pips}\n${window.location.href}`;

      if (navigator.share) {
        navigator.share({ title: 'Daily Quiz Result', text }).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => this.showToast('Result copied to clipboard!'))
          .catch(() => this.showToast('Unable to copy result.'));
      } else {
        this.showToast('Sharing not supported on this browser.');
      }
    }

    showToast(message) {
      this.dom.toastMessage.textContent = message;
      this.dom.toastMessage.classList.add('visible');
      setTimeout(() => {
        this.dom.toastMessage.classList.remove('visible');
      }, 2300);
    }
  }

  // Self-bootstrapping
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DailyQuizApp());
  } else {
    new DailyQuizApp();
  }
})();