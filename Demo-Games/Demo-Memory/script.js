/**
 * Memory Match — Cocktail Lounge Reserve Edition
 * Continuous Sequential Daily Puzzle Cycle Release
 */

(function () {
  'use strict';

  // ==========================================================================
  // DEVELOPER CONFIGURATION
  // ==========================================================================
  const CONFIG = {
    // A. Application Settings
    app: {
      name: 'Memory Match',
      collectionName: 'The Reserve Collection',
      storageKey: 'memory_match_vault_v2',
      soundPrefKey: 'memory_match_sound_enabled',
      bgAnimPrefKey: 'memory_match_bg_anim_enabled'
    },

    // B. Data Configuration
    data: {
      csvPath: './puzzles.csv',
      offlineCacheKey: 'memory_match_csv_offline_cache',
      requiredPairs: 8,
      totalCards: 16
    },

    // C. Daily Challenge Configuration
    dailyCycle: {
      anchorDate: '2026-01-01',
      cycleStartIndex: 0,
      rolloverCheckIntervalMs: 1000
    },

    // D. Display Configuration
    display: {
      dateLocale: 'en-US',
      dateFormatOptions: {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      },
      ratings: {
        threeStarThreshold: 12,
        twoStarThreshold: 18
      }
    },

    // E. Development & Diagnostics
    diagnostics: {
      enableDebugLogging: false
    }
  };

  // ==========================================================================
  // GAME PHASES & RUNTIME STATE
  // ==========================================================================
  const GamePhase = {
    IDLE: 'IDLE',
    ONE_UP: 'ONE_UP',
    EVALUATING: 'EVALUATING',
    LOCKED: 'LOCKED',
    COMPLETED: 'COMPLETED'
  };

  const state = {
    phase: GamePhase.IDLE,
    puzzles: [],
    todayDateString: '',
    todayCycleIndex: 0,
    todayPuzzle: null,
    activePuzzle: null,
    isReplay: false,
    boardCards: [],
    flippedIndices: [],
    focusedCardIndex: 0,
    matchedCardCount: 0,
    turns: 0,
    evalTimer: null,
    mismatchTimer: null,
    countdownTimer: null,
    soundEnabled: true,
    bgAnimEnabled: true,
    lastActiveElement: null,
    audioCtx: null,
    dailySession: null,
    vaultSession: null,
    stats: {
      schemaVersion: 2,
      played: 0,
      completed: 0,
      currentStreak: 0,
      bestStreak: 0,
      bestTurns: null,
      lastDailyCompletedDate: '',
      turnHistory: [],
      history: {}
    }
  };

  // ==========================================================================
  // LOCAL CALENDAR & DETERMINISTIC CYCLE ENGINE
  // ==========================================================================
  function getLocalDate() {
    return new Date();
  }

  function formatLocalDateISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function formatLocalDateDisplay(d) {
    try {
      return new Intl.DateTimeFormat(CONFIG.display.dateLocale, CONFIG.display.dateFormatOptions).format(d);
    } catch (e) {
      return formatLocalDateISO(d);
    }
  }

  function getDaysBetweenAnchorAndDate(anchorDateStr, targetDate) {
    const parts = anchorDateStr.split('-').map(Number);
    const anchorYear = parts[0];
    const anchorMonth = parts[1] - 1;
    const anchorDay = parts[2];

    const anchorUtc = Date.UTC(anchorYear, anchorMonth, anchorDay);
    const targetUtc = Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

    const diffMs = targetUtc - anchorUtc;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  function calculateCycleIndex(puzzleCount, localDate) {
    if (puzzleCount <= 0) return 0;
    const dayDiff = getDaysBetweenAnchorAndDate(CONFIG.dailyCycle.anchorDate, localDate);
    const adjusted = dayDiff + CONFIG.dailyCycle.cycleStartIndex;
    return ((adjusted % puzzleCount) + puzzleCount) % puzzleCount;
  }

  function getTimeUntilLocalMidnight() {
    const now = getLocalDate();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    let diffMs = midnight.getTime() - now.getTime();
    if (diffMs <= 0) diffMs = 0;

    const remainingSec = Math.floor(diffMs / 1000);
    const hours = Math.floor(remainingSec / 3600);
    const minutes = Math.floor((remainingSec % 3600) / 60);
    const seconds = remainingSec % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0')
    };
  }

  // ==========================================================================
  // WEB AUDIO SOUND EFFECTS
  // ==========================================================================
  function initAudio() {
    if (!state.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) state.audioCtx = new AudioContext();
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!state.audioCtx) return;

      const ctx = state.audioCtx;
      const now = ctx.currentTime;

      if (type === 'flip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(640, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'match') {
        [880, 1320].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + (i * 0.025));
          gain.gain.setValueAtTime(0.12, now + (i * 0.025));
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + (i * 0.025));
          osc.stop(now + 0.43);
        });
      } else if (type === 'mismatch') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(196, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'complete') {
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const t = now + (idx * 0.09);
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.14, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.4);
        });
      }
    } catch (e) {}
  }

  function triggerHaptic(type) {
    if (!navigator.vibrate) return;
    try {
      if (type === 'tap') navigator.vibrate(10);
      else if (type === 'match') navigator.vibrate([12, 28, 16]);
      else if (type === 'mismatch') navigator.vibrate(30);
      else if (type === 'complete') navigator.vibrate([25, 35, 25, 35, 45]);
    } catch (e) {}
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    try {
      localStorage.setItem(CONFIG.app.soundPrefKey, state.soundEnabled ? '1' : '0');
    } catch (e) {}
    updateSoundUI();
    showToast(state.soundEnabled ? 'Bar audio enabled' : 'Bar audio muted');
  }

  function toggleBgAnimation() {
    state.bgAnimEnabled = !state.bgAnimEnabled;
    try {
      localStorage.setItem(CONFIG.app.bgAnimPrefKey, state.bgAnimEnabled ? '1' : '0');
    } catch (e) {}
    updateBgAnimUI();
    showToast(state.bgAnimEnabled ? 'Botanicals active' : 'Botanicals paused');
  }

  function updateSoundUI() {
    const glyph = state.soundEnabled ? '🔊' : '🔇';
    const mainIcon = document.getElementById('sound-icon-glyph');
    if (mainIcon) mainIcon.textContent = glyph;

    const btnSetting = document.getElementById('btn-toggle-sound-setting');
    const lblSetting = document.getElementById('lbl-sound-setting');
    if (btnSetting && lblSetting) {
      btnSetting.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
      lblSetting.textContent = state.soundEnabled ? 'On' : 'Off';
    }
  }

  function updateBgAnimUI() {
    document.body.classList.toggle('bg-anim-off', !state.bgAnimEnabled);
    const btnToggle = document.getElementById('btn-toggle-bg-anim');
    const lblToggle = document.getElementById('lbl-bg-anim');
    if (btnToggle && lblToggle) {
      btnToggle.setAttribute('aria-pressed', state.bgAnimEnabled ? 'true' : 'false');
      lblToggle.textContent = state.bgAnimEnabled ? 'On' : 'Off';
    }
  }

  // ==========================================================================
  // BOTANICAL FLOATING CANVAS
  // ==========================================================================
  const BOTANICAL_SVGS = [
    `<svg viewBox="0 0 48 48" fill="none" stroke="#E86A2D" stroke-width="2.5" stroke-linecap="round"><path d="M12 36c4-12 12-22 24-22 6 0 8 5 3 10s-16 6-18 12c-2 6 4 9 11 6" /><path d="M14 34c3-10 10-18 20-18" stroke="#F5DE8C" stroke-width="1.2"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#F5DE8C" stroke-width="2.2" stroke-linecap="round"><path d="M14 38c6-14 16-24 22-22s-2 12-10 16-14 2-12 6c1 3 5 4 10 2" /><path d="M17 32c4-9 11-15 17-15" stroke="#FFF1BE" stroke-width="1"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#CCA048" stroke-width="2"><circle cx="24" cy="24" r="18" stroke="#87B048" stroke-width="2.2"/><circle cx="24" cy="24" r="14" stroke="#CCA048" stroke-width="1"/><circle cx="24" cy="24" r="2.5" fill="#87B048"/><line x1="24" y1="10" x2="24" y2="21.5" stroke="#CCA048"/><line x1="24" y1="26.5" x2="24" y2="38" stroke="#CCA048"/><line x1="10" y1="24" x2="21.5" y2="24" stroke="#CCA048"/><line x1="26.5" y1="24" x2="38" y2="24" stroke="#CCA048"/><line x1="14" y1="14" x2="22" y2="22" stroke="#CCA048"/><line x1="26" y1="26" x2="34" y2="34" stroke="#CCA048"/><line x1="34" y1="14" x2="26" y2="22" stroke="#CCA048"/><line x1="22" y1="26" x2="14" y2="34" stroke="#CCA048"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#DF8235" stroke-width="2"><circle cx="24" cy="24" r="19" stroke="#E86A2D" stroke-width="2.2"/><circle cx="24" cy="24" r="14.5" stroke="#F5DE8C" stroke-width="1"/><circle cx="24" cy="24" r="2.8" fill="#E86A2D"/><line x1="24" y1="9.5" x2="24" y2="21.2"/><line x1="24" y1="26.8" x2="24" y2="38.5"/><line x1="9.5" y1="24" x2="21.2" y2="24"/><line x1="26.8" y1="24" x2="38.5" y2="24"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#C4511D" stroke-width="2"><circle cx="24" cy="24" r="18" stroke="#E86A2D" stroke-width="2.5"/><circle cx="24" cy="24" r="13" stroke="#9E3812" stroke-width="1.2"/><circle cx="24" cy="24" r="2" fill="#9E3812"/><path d="M15 15l18 18M33 15l-18 18M24 11v26M11 24h26" stroke="#C4511D" stroke-width="1"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#A5772D" stroke-width="1.8"><circle cx="24" cy="24" r="18" stroke="#CCA048" stroke-width="2"/><circle cx="24" cy="24" r="13" stroke="#73501D" stroke-dasharray="2 3"/><circle cx="24" cy="24" r="3" stroke="#CCA048"/><line x1="24" y1="11" x2="24" y2="37"/><line x1="11" y1="24" x2="37" y2="24"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round"><circle cx="20" cy="30" r="11" fill="rgba(196, 81, 29, 0.45)" stroke="#C4511D" stroke-width="2.2"/><path d="M22 19c2-9 10-13 16-13" stroke="#CCA048" stroke-width="2"/><circle cx="16" cy="26" r="2.5" fill="#FFF1BE" opacity="0.6"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round"><circle cx="16" cy="32" r="9" fill="rgba(196, 81, 29, 0.35)" stroke="#C4511D" stroke-width="2"/><circle cx="32" cy="30" r="8.5" fill="rgba(196, 81, 29, 0.35)" stroke="#C4511D" stroke-width="2"/><path d="M18 23c4-11 8-15 14-17" stroke="#CCA048" stroke-width="1.8"/><path d="M30 22c-2-8-2-12 2-16" stroke="#CCA048" stroke-width="1.8"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#87B048" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 40c0-14 4-22 14-26M24 28c-6-2-12-8-10-14 6 0 10 4 10 14M24 20c6-3 10-8 8-14-6 0-8 5-8 14"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#7A9A4A" stroke-width="1.8" stroke-linecap="round"><path d="M14 40c6-10 14-20 22-30" stroke="#CCA048" stroke-width="2"/><path d="M20 33l-7-4M22 30l8-5M26 23l-7-5M28 20l8-4M31 14l-6-5M33 11l6-3"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke-linecap="round"><ellipse cx="24" cy="24" rx="12" ry="16" transform="rotate(-25 24 24)" fill="rgba(110, 148, 71, 0.35)" stroke="#87B048" stroke-width="2.2"/><circle cx="21" cy="21" r="3.5" fill="#E86A2D"/><line x1="8" y1="40" x2="40" y2="8" stroke="#CCA048" stroke-width="1.8"/></svg>`,
    `<svg viewBox="0 0 48 48" fill="none" stroke="#87B048" stroke-width="2.2" stroke-linecap="round"><path d="M10 16c8-4 16 2 18 10s8 12 14 6" /><path d="M10 20c8-4 16 2 18 10s8 12 14 6" stroke="#CCA048" stroke-width="1"/></svg>`
  ];

  function initFloatingBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    canvas.innerHTML = '';

    const populationCount = 8;
    const depthTiers = [
      { className: 'garnish-depth-far', durationRange: [32, 42], size: 28 },
      { className: 'garnish-depth-mid', durationRange: [24, 32], size: 40 },
      { className: 'garnish-depth-near', durationRange: [18, 25], size: 52 }
    ];

    for (let i = 0; i < populationCount; i++) {
      const tier = depthTiers[i % depthTiers.length];
      const el = document.createElement('div');
      el.className = `bg-garnish-item ${tier.className}`;
      el.style.width = `${tier.size}px`;
      el.style.height = `${tier.size}px`;

      const leftPercent = (i * (100 / populationCount)) + (Math.random() * 5 - 2.5);
      el.style.left = `${Math.max(3, Math.min(92, leftPercent))}%`;

      const minDur = tier.durationRange[0];
      const maxDur = tier.durationRange[1];
      const durationSec = minDur + (Math.random() * (maxDur - minDur));
      const delaySec = -(Math.random() * durationSec);
      el.style.animationDuration = `${durationSec.toFixed(1)}s`;
      el.style.animationDelay = `${delaySec.toFixed(1)}s`;

      const driftX = (Math.random() * 50 - 25);
      const rotDeg = (Math.random() * 180 - 90);
      el.style.setProperty('--drift-x', `${driftX}px`);
      el.style.setProperty('--rot-deg', `${rotDeg}deg`);

      el.innerHTML = BOTANICAL_SVGS[i % BOTANICAL_SVGS.length];
      canvas.appendChild(el);
    }
  }

  // ==========================================================================
  // SVG SANITIZATION
  // ==========================================================================
  function sanitizeAndCreateSVG(svgStr) {
    if (!svgStr || typeof svgStr !== 'string') return null;
    const trimmed = svgStr.trim();
    if (!trimmed.includes('<svg') || !trimmed.includes('</svg>')) return null;

    try {
      const template = document.createElement('template');
      template.innerHTML = trimmed;
      const svg = template.content.querySelector('svg');
      if (!svg) return null;

      const dangerousTags = ['script', 'foreignobject', 'iframe', 'object', 'embed', 'audio', 'video', 'style'];
      dangerousTags.forEach(tag => {
        svg.querySelectorAll(tag).forEach(el => el.remove());
      });

      const allElements = [svg, ...svg.querySelectorAll('*')];
      allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          const name = attr.name.toLowerCase();
          const val = attr.value.toLowerCase();
          if (name.startsWith('on') || ((name === 'href' || name === 'xlink:href') && val.includes('javascript:'))) {
            el.removeAttribute(attr.name);
          }
        });
      });

      if (!svg.getAttribute('viewBox')) {
        const w = svg.getAttribute('width') || '24';
        const h = svg.getAttribute('height') || '24';
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      }

      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      svg.classList.add('card-icon-svg');

      return document.importNode(svg, true);
    } catch (e) {
      return null;
    }
  }

  // ==========================================================================
  // PERSISTENCE & STORAGE
  // ==========================================================================
  function sanitizeStats(raw) {
    if (!raw || typeof raw !== 'object') return { ...state.stats };
    return {
      schemaVersion: 2,
      played: Number.isInteger(raw.played) && raw.played >= 0 ? raw.played : 0,
      completed: Number.isInteger(raw.completed) && raw.completed >= 0 ? raw.completed : 0,
      currentStreak: Number.isInteger(raw.currentStreak) && raw.currentStreak >= 0 ? raw.currentStreak : 0,
      bestStreak: Number.isInteger(raw.bestStreak) && raw.bestStreak >= 0 ? raw.bestStreak : 0,
      bestTurns: Number.isInteger(raw.bestTurns) && raw.bestTurns > 0 ? raw.bestTurns : null,
      lastDailyCompletedDate: typeof raw.lastDailyCompletedDate === 'string' ? raw.lastDailyCompletedDate : '',
      turnHistory: Array.isArray(raw.turnHistory) ? raw.turnHistory.filter(n => Number.isInteger(n) && n > 0) : [],
      history: (raw.history && typeof raw.history === 'object') ? raw.history : {}
    };
  }

  function loadPersistence() {
    try {
      const soundPref = localStorage.getItem(CONFIG.app.soundPrefKey);
      if (soundPref !== null) state.soundEnabled = soundPref === '1';

      const bgAnimPref = localStorage.getItem(CONFIG.app.bgAnimPrefKey);
      if (bgAnimPref !== null) state.bgAnimEnabled = bgAnimPref === '1';

      const raw = localStorage.getItem(CONFIG.app.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.stats) state.stats = sanitizeStats(parsed.stats);
          if (parsed.dailySession && typeof parsed.dailySession === 'object') {
            state.dailySession = parsed.dailySession;
          }
          if (parsed.vaultSession && typeof parsed.vaultSession === 'object') {
            state.vaultSession = parsed.vaultSession;
          }
        }
      }
    } catch (err) {
      if (CONFIG.diagnostics.enableDebugLogging) console.warn('Storage read error:', err);
    }
  }

  function savePersistence() {
    try {
      const payload = {
        stats: state.stats,
        dailySession: state.dailySession,
        vaultSession: state.vaultSession
      };
      localStorage.setItem(CONFIG.app.storageKey, JSON.stringify(payload));
    } catch (err) {
      if (CONFIG.diagnostics.enableDebugLogging) console.warn('Storage save error:', err);
    }
  }

  // ==========================================================================
  // DETERMINISTIC SHUFFLE (PRNG)
  // ==========================================================================
  function createRng(seed) {
    let s = (Math.abs(seed) % 2147483647) || 1;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function shuffle(array, seedVal) {
    const copy = [...array];
    const rng = createRng(seedVal);
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  // ==========================================================================
  // CSV PARSING & SEQUENTIAL PUZZLE COLLECTION
  // ==========================================================================
  function parseCSV(text) {
    text = text.replace(/^\uFEFF/, '');
    const rows = [];
    let curRow = [];
    let curCell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          curCell += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          curCell += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          curRow.push(curCell.trim());
          curCell = '';
        } else if (char === '\n' || char === '\r') {
          curRow.push(curCell.trim());
          if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
            rows.push(curRow);
          }
          curRow = [];
          curCell = '';
          if (char === '\r' && nextChar === '\n') i++;
        } else {
          curCell += char;
        }
      }
    }
    if (curCell.length || curRow.length) {
      curRow.push(curCell.trim());
      if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
        rows.push(curRow);
      }
    }
    return rows;
  }

  function mapAndValidateRecords(rows) {
    if (rows.length < 2) return [];
    const rawHeaders = rows[0].map(h => h.trim());

    const validPuzzles = [];
    const rowRecords = rows.slice(1);

    rowRecords.forEach((row, rowIndex) => {
      const record = {};
      rawHeaders.forEach((h, i) => {
        record[h] = row[i] ? row[i].trim() : '';
      });

      const findVal = (prefix, idx) => {
        const target = `${prefix}${idx}`.toLowerCase();
        for (const k of Object.keys(record)) {
          const norm = k.toLowerCase().replace(/[\s_-]/g, '');
          if (norm === target) return record[k];
        }
        return '';
      };

      const title = record.title || `Reserve Puzzle ${rowIndex + 1}`;
      const items = [];
      const icons = [];

      for (let i = 1; i <= CONFIG.data.requiredPairs; i++) {
        const itemVal = findVal('item', i) || `Item ${i}`;
        const iconVal = findVal('svg', i) || findVal('icon', i) || findVal('itemsvg', i) || '';
        items.push(itemVal);
        icons.push(iconVal);
      }

      const uniqueItems = new Set(items.map(s => s.trim().toLowerCase()));
      if (uniqueItems.size !== CONFIG.data.requiredPairs) {
        return;
      }

      validPuzzles.push({
        id: `puzzle_${validPuzzles.length + 1}`,
        editionNumber: validPuzzles.length + 1,
        title,
        items,
        icons
      });
    });

    return validPuzzles;
  }

  async function loadPuzzles() {
    let text = '';

    try {
      const res = await fetch(CONFIG.data.csvPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      text = await res.text();
      try {
        localStorage.setItem(CONFIG.data.offlineCacheKey, text);
      } catch (e) {}
    } catch (netErr) {
      const cached = localStorage.getItem(CONFIG.data.offlineCacheKey);
      if (cached) {
        text = cached;
        showToast('Playing in offline cellar mode');
      } else {
        throw new Error('Unable to connect and no offline puzzles found.');
      }
    }

    const rows = parseCSV(text);
    const parsed = mapAndValidateRecords(rows);
    if (!parsed.length) throw new Error('No valid puzzle records found in collection.');

    state.puzzles = parsed;
    updateActiveDailySelection();
  }

  function updateActiveDailySelection() {
    const localNow = getLocalDate();
    state.todayDateString = formatLocalDateISO(localNow);
    state.todayCycleIndex = calculateCycleIndex(state.puzzles.length, localNow);
    state.todayPuzzle = state.puzzles[state.todayCycleIndex] || state.puzzles[0];
  }

  // ==========================================================================
  // CARD RENDERING & ACCESSIBILITY
  // ==========================================================================
  function renderCardDOM(btn, card, index) {
    btn.innerHTML = '';

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const back = document.createElement('div');
    back.className = 'card-face card-face-back';
    const mark = document.createElement('span');
    mark.className = 'card-back-mark';
    mark.textContent = '✦';
    back.appendChild(mark);

    const front = document.createElement('div');
    front.className = 'card-face card-face-front';

    const content = document.createElement('div');
    content.className = 'card-content';

    if (card && card.icon) {
      const iconEl = sanitizeAndCreateSVG(card.icon);
      if (iconEl) {
        const iconWrap = document.createElement('div');
        iconWrap.className = 'card-icon';
        iconWrap.appendChild(iconEl);
        content.appendChild(iconWrap);
      }
    }

    const word = document.createElement('div');
    word.className = 'card-word';
    word.textContent = card.name;
    content.appendChild(word);
    front.appendChild(content);

    const badge = document.createElement('div');
    badge.className = 'card-match-badge hidden';
    badge.textContent = '✓';
    front.appendChild(badge);

    inner.appendChild(back);
    inner.appendChild(front);
    btn.appendChild(inner);

    btn.setAttribute('aria-label', `Tile ${index + 1}`);
  }

  function updateCardAria(btn, card, stateType) {
    if (stateType === 'face-down') {
      btn.setAttribute('aria-label', `Tile ${parseInt(btn.dataset.index, 10) + 1}`);
    } else if (stateType === 'flipped') {
      btn.setAttribute('aria-label', `${card.name}`);
    } else if (stateType === 'matched') {
      btn.setAttribute('aria-label', `${card.name}, matched pair`);
      const badge = btn.querySelector('.card-match-badge');
      if (badge) badge.classList.remove('hidden');
    }
  }

  // ==========================================================================
  // VIEW ROUTING & TOAST NOTIFICATIONS
  // ==========================================================================
  function showView(viewId) {
    document.querySelectorAll('.app-main .view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');

    if (viewId === 'view-menu') {
      renderMenuView();
    } else if (viewId === 'view-vault') {
      renderVaultView();
    }
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.add('hidden'), 2400);
  }

  // ==========================================================================
  // MAIN MENU CONTROLLER
  // ==========================================================================
  function renderMenuView() {
    updateActiveDailySelection();
    const p = state.todayPuzzle;
    if (!p) return;

    const displayDateEl = document.getElementById('menu-daily-date');
    if (displayDateEl) {
      displayDateEl.textContent = formatLocalDateDisplay(getLocalDate());
    }

    const titleEl = document.getElementById('menu-daily-title');
    if (titleEl) titleEl.textContent = p.title;

    const completed = state.stats.history[p.id];
    const statusDesc = document.getElementById('menu-daily-status');
    const playLabel = document.getElementById('btn-play-label');
    const countdownWrap = document.getElementById('menu-countdown-wrap');

    if (completed) {
      statusDesc.textContent = `Completed in ${completed.turns} turns (Rating: ${'★'.repeat(completed.stars || 2)})`;
      playLabel.textContent = 'Replay Memory Match';
      countdownWrap.classList.remove('hidden');
      updateCountdownDisplays();
    } else if (state.dailySession && state.dailySession.puzzleId === p.id && state.dailySession.date === state.todayDateString) {
      statusDesc.textContent = `In Progress (${state.dailySession.matchedCardCount / 2} / 8 pairs found)`;
      playLabel.textContent = 'Resume Memory Match';
      countdownWrap.classList.add('hidden');
    } else {
      statusDesc.textContent = 'Ready to play';
      playLabel.textContent = 'Play Memory Match';
      countdownWrap.classList.add('hidden');
    }

    const vaultCountTag = document.getElementById('vault-count-tag');
    if (vaultCountTag) {
      vaultCountTag.textContent = `${state.puzzles.length} Sets`;
    }
  }

  function updateCountdownDisplays() {
    const rem = getTimeUntilLocalMidnight();
    const txt = `${rem.hours}h ${rem.minutes}m ${rem.seconds}s`;

    const el1 = document.getElementById('menu-countdown-val');
    const el2 = document.getElementById('complete-countdown-val');
    if (el1) el1.textContent = txt;
    if (el2) el2.textContent = txt;
  }

  // ==========================================================================
  // VAULT (CELLAR ARCHIVE) CONTROLLER
  // ==========================================================================
  function renderVaultView() {
    const container = document.getElementById('vault-list');
    if (!container) return;
    container.innerHTML = '';

    if (!state.puzzles.length) {
      container.innerHTML = '<div class="lounge-card status-card"><p class="status-text">No reserve puzzles found in the collection.</p></div>';
      return;
    }

    state.puzzles.forEach((p, index) => {
      const item = document.createElement('div');
      item.className = 'vault-item';

      const isDaily = state.todayPuzzle && state.todayPuzzle.id === p.id;
      const record = state.stats.history[p.id];
      let statusText = 'Unplayed';
      if (record) {
        statusText = `Solved (${record.turns} turns)`;
      } else if (isDaily) {
        statusText = 'Daily Challenge';
      }

      item.innerHTML = `
        <div class="vault-info">
          <span class="meta-date">Edition #${index + 1}</span>
          <span class="vault-title">${p.title}</span>
          <span class="vault-badge">${statusText}</span>
        </div>
        <button class="btn btn-sm ${record ? '' : 'btn-primary'}" type="button">
          ${record ? 'Replay' : 'Play'}
        </button>
      `;

      item.querySelector('button').onclick = () => loadPuzzle(p);
      container.appendChild(item);
    });
  }

  // ==========================================================================
  // GAMEPLAY ENGINE
  // ==========================================================================
  function cancelPendingTimers() {
    if (state.evalTimer) {
      clearTimeout(state.evalTimer);
      state.evalTimer = null;
    }
    if (state.mismatchTimer) {
      clearTimeout(state.mismatchTimer);
      state.mismatchTimer = null;
    }
  }

  function loadPuzzle(puzzle) {
    cancelPendingTimers();
    state.activePuzzle = puzzle;
    state.flippedIndices = [];
    state.phase = GamePhase.IDLE;
    state.focusedCardIndex = 0;

    const isDaily = puzzle.id === state.todayPuzzle.id;
    const pastRecord = state.stats.history[puzzle.id];
    state.isReplay = !!pastRecord;

    document.getElementById('gameplay-title').textContent = puzzle.title;
    document.getElementById('game-practice-badge').classList.toggle('hidden', !state.isReplay);

    const raw = [];
    puzzle.items.forEach((label, id) => {
      const icon = (puzzle.icons && puzzle.icons[id]) ? puzzle.icons[id] : '';
      raw.push({ id, name: label, icon });
      raw.push({ id, name: label, icon });
    });

    const seedVal = (puzzle.editionNumber * 7919) || 4242;
    state.boardCards = shuffle(raw, seedVal);

    const sessionKey = isDaily ? 'dailySession' : 'vaultSession';
    const existing = state[sessionKey];
    const isResuming = existing && existing.puzzleId === puzzle.id && existing.matchedCardCount < CONFIG.data.totalCards;

    if (isResuming) {
      state.turns = existing.turns || 0;
      state.matchedCardCount = existing.matchedCardCount || 0;
    } else {
      state.turns = 0;
      state.matchedCardCount = 0;
      state[sessionKey] = {
        puzzleId: puzzle.id,
        date: state.todayDateString,
        turns: 0,
        matchedCardCount: 0,
        matchedIds: []
      };
      savePersistence();
    }

    document.getElementById('stat-turns').textContent = state.turns;
    document.getElementById('stat-pairs').textContent = `${state.matchedCardCount / 2} / ${CONFIG.data.requiredPairs}`;
    document.getElementById('game-feedback').textContent = 'Flip cards to match all 8 pairs.';

    const board = document.getElementById('game-board');
    board.innerHTML = '';

    state.boardCards.forEach((card, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'card-tile';
      btn.dataset.index = index;
      btn.setAttribute('tabindex', index === 0 ? '0' : '-1');

      renderCardDOM(btn, card, index);

      if (isResuming && state[sessionKey].matchedIds.includes(card.id)) {
        btn.classList.add('matched');
        updateCardAria(btn, card, 'matched');
        btn.setAttribute('aria-disabled', 'true');
      } else {
        updateCardAria(btn, card, 'face-down');
      }

      btn.onclick = () => handleCardInteraction(index);
      board.appendChild(btn);
    });

    showView('view-game');
  }

  function handleCardInteraction(index) {
    if (state.phase === GamePhase.EVALUATING || state.phase === GamePhase.LOCKED || state.phase === GamePhase.COMPLETED) {
      return;
    }
    if (state.flippedIndices.includes(index)) return;

    const board = document.getElementById('game-board');
    const btn = board.children[index];
    if (btn.classList.contains('matched')) return;

    playSound('flip');
    triggerHaptic('tap');

    state.flippedIndices.push(index);
    btn.classList.add('flipped');
    updateCardAria(btn, state.boardCards[index], 'flipped');

    if (state.flippedIndices.length === 1) {
      state.phase = GamePhase.ONE_UP;
      document.getElementById('game-feedback').textContent = 'Seek the matching companion...';
    } else if (state.flippedIndices.length === 2) {
      state.phase = GamePhase.EVALUATING;
      state.turns++;
      document.getElementById('stat-turns').textContent = state.turns;

      state.evalTimer = setTimeout(() => {
        state.evalTimer = null;
        evaluateCardPair();
      }, 360);
    }
  }

  function evaluateCardPair() {
    if (state.flippedIndices.length < 2) return;
    const [idx1, idx2] = state.flippedIndices;
    const card1 = state.boardCards[idx1];
    const card2 = state.boardCards[idx2];
    const board = document.getElementById('game-board');
    if (!board) return;

    const btn1 = board.children[idx1];
    const btn2 = board.children[idx2];
    if (!btn1 || !btn2) return;

    const isDaily = state.activePuzzle.id === state.todayPuzzle.id;
    const sessionKey = isDaily ? 'dailySession' : 'vaultSession';

    if (card1.id === card2.id) {
      btn1.classList.add('matched', 'pulse-match');
      btn2.classList.add('matched', 'pulse-match');
      btn1.setAttribute('aria-disabled', 'true');
      btn2.setAttribute('aria-disabled', 'true');
      updateCardAria(btn1, card1, 'matched');
      updateCardAria(btn2, card2, 'matched');

      playSound('match');
      triggerHaptic('match');

      state.matchedCardCount += 2;
      const pairs = state.matchedCardCount / 2;
      document.getElementById('stat-pairs').textContent = `${pairs} / ${CONFIG.data.requiredPairs}`;
      document.getElementById('game-feedback').textContent = `Match: ${card1.name}!`;

      setTimeout(() => {
        btn1.classList.remove('pulse-match');
        btn2.classList.remove('pulse-match');
      }, 350);

      state.flippedIndices = [];
      state.phase = GamePhase.IDLE;

      if (state[sessionKey]) {
        state[sessionKey].turns = state.turns;
        state[sessionKey].matchedCardCount = state.matchedCardCount;
        if (!state[sessionKey].matchedIds.includes(card1.id)) {
          state[sessionKey].matchedIds.push(card1.id);
        }
        savePersistence();
      }

      if (state.matchedCardCount === CONFIG.data.totalCards) {
        state.phase = GamePhase.COMPLETED;
        setTimeout(handlePuzzleCompletion, 450);
      }
    } else {
      playSound('mismatch');
      triggerHaptic('mismatch');
      btn1.classList.add('shake-mismatch');
      btn2.classList.add('shake-mismatch');
      document.getElementById('game-feedback').textContent = 'Not a match.';

      state.mismatchTimer = setTimeout(() => {
        btn1.classList.remove('flipped', 'shake-mismatch');
        btn2.classList.remove('flipped', 'shake-mismatch');
        updateCardAria(btn1, card1, 'face-down');
        updateCardAria(btn2, card2, 'face-down');
        state.flippedIndices = [];
        state.phase = GamePhase.IDLE;
        state.mismatchTimer = null;
        document.getElementById('game-feedback').textContent = 'Flip cards to match all 8 pairs.';
      }, 850);
    }
  }

  // ==========================================================================
  // ARROW-KEY ACCESSIBILITY
  // ==========================================================================
  function handleGridKeydown(e) {
    const board = document.getElementById('game-board');
    if (!board || state.phase === GamePhase.COMPLETED) return;

    const cur = state.focusedCardIndex;
    let next = cur;

    switch (e.key) {
      case 'ArrowRight':
        next = (cur + 1) % CONFIG.data.totalCards;
        e.preventDefault();
        break;
      case 'ArrowLeft':
        next = (cur - 1 + CONFIG.data.totalCards) % CONFIG.data.totalCards;
        e.preventDefault();
        break;
      case 'ArrowDown':
        next = (cur + 4) % CONFIG.data.totalCards;
        e.preventDefault();
        break;
      case 'ArrowUp':
        next = (cur - 4 + CONFIG.data.totalCards) % CONFIG.data.totalCards;
        e.preventDefault();
        break;
      case 'Home':
        next = 0;
        e.preventDefault();
        break;
      case 'End':
        next = CONFIG.data.totalCards - 1;
        e.preventDefault();
        break;
      default:
        return;
    }

    if (next !== cur) {
      board.children[cur].setAttribute('tabindex', '-1');
      board.children[next].setAttribute('tabindex', '0');
      board.children[next].focus();
      state.focusedCardIndex = next;
    }
  }

  // ==========================================================================
  // COMPLETION & STREAKS
  // ==========================================================================
  function updateDailyStreak(solvedDateStr) {
    const s = state.stats;
    if (!s.lastDailyCompletedDate) {
      s.currentStreak = 1;
    } else {
      const partsLast = s.lastDailyCompletedDate.split('-').map(Number);
      const partsCurr = solvedDateStr.split('-').map(Number);

      const lastUtc = Date.UTC(partsLast[0], partsLast[1] - 1, partsLast[2]);
      const currUtc = Date.UTC(partsCurr[0], partsCurr[1] - 1, partsCurr[2]);
      const diffDays = Math.round((currUtc - lastUtc) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        s.currentStreak++;
      } else if (diffDays === 0) {
        // Same calendar day completion
      } else {
        s.currentStreak = 1;
      }
    }
    s.lastDailyCompletedDate = solvedDateStr;
    if (s.currentStreak > s.bestStreak) s.bestStreak = s.currentStreak;
  }

  function handlePuzzleCompletion() {
    playSound('complete');
    triggerHaptic('complete');

    const turns = state.turns;
    const accuracy = `${Math.max(0, Math.round((8 / turns) * 100))}%`;
    const puzzleKey = state.activePuzzle.id;
    const isDaily = puzzleKey === state.todayPuzzle.id;
    const s = state.stats;

    let stars = 1;
    let ratingText = 'Solved!';
    if (turns <= CONFIG.display.ratings.threeStarThreshold) {
      stars = 3;
      ratingText = 'Masterful Recall!';
    } else if (turns <= CONFIG.display.ratings.twoStarThreshold) {
      stars = 2;
      ratingText = 'Distinguished Game!';
    }

    let isNewBest = false;
    if (!s.history[puzzleKey]) {
      s.played++;
      s.completed++;
      if (isDaily) updateDailyStreak(state.todayDateString);

      if (s.bestTurns === null || turns < s.bestTurns) {
        if (s.completed > 1) isNewBest = true;
        s.bestTurns = turns;
      }
      s.turnHistory.push(turns);
      s.history[puzzleKey] = { turns, accuracy, stars, date: state.todayDateString };
    }

    if (isDaily) state.dailySession = null;
    else state.vaultSession = null;
    savePersistence();

    document.getElementById('complete-turns').textContent = turns;
    document.getElementById('complete-accuracy').textContent = accuracy;
    document.getElementById('complete-rating-label').textContent = ratingText;
    document.getElementById('complete-pb-banner').classList.toggle('hidden', !isNewBest);
    document.getElementById('complete-replay-note').classList.toggle('hidden', !state.isReplay);

    const starsBox = document.getElementById('complete-stars');
    starsBox.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
      const sp = document.createElement('span');
      sp.className = i <= stars ? 'star-glyph' : 'star-glyph star-empty';
      sp.textContent = '★';
      starsBox.appendChild(sp);
    }

    const list = document.getElementById('complete-items-list');
    list.innerHTML = '';
    state.activePuzzle.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });

    updateCountdownDisplays();
    openModal('modal-complete');
  }

  // ==========================================================================
  // SHARING
  // ==========================================================================
  function shareResult() {
    const p = state.activePuzzle || state.todayPuzzle;
    const turns = state.turns || (state.stats.history[p.id] ? state.stats.history[p.id].turns : 0);
    const dateFormatted = formatLocalDateDisplay(getLocalDate());
    const shareText = `Memory Match — ${dateFormatted}\nSolved in ${turns} turns!\n🍸🍸🍸🍸\n🍸🍸🍸🍸`;

    if (navigator.share) {
      navigator.share({
        title: 'Memory Match — Cocktail Lounge Result',
        text: shareText
      }).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Result copied to clipboard');
      }).catch(() => {
        showToast('Unable to copy result');
      });
    } else {
      showToast('Sharing not supported on this browser');
    }
  }

  // ==========================================================================
  // HOW TO PLAY PANEL
  // ==========================================================================
  function openHowToPlayPanel() {
    state.lastActiveElement = document.activeElement;
    const panel = document.getElementById('panel-how-to-play');
    const overlay = document.getElementById('modal-overlay');
    if (!panel || !overlay) return;

    panel.classList.remove('hidden');
    overlay.classList.remove('hidden');

    void panel.offsetWidth;
    panel.classList.add('panel-open');

    const focusable = panel.querySelectorAll('button, [href]');
    if (focusable.length) focusable[0].focus();
  }

  function closeHowToPlayPanel() {
    const panel = document.getElementById('panel-how-to-play');
    if (!panel) return;

    panel.classList.remove('panel-open');
    setTimeout(() => {
      panel.classList.add('hidden');
      const activeModal = document.querySelector('.modal:not(.hidden)');
      if (!activeModal) {
        document.getElementById('modal-overlay').classList.add('hidden');
      }
      if (state.lastActiveElement && typeof state.lastActiveElement.focus === 'function') {
        state.lastActiveElement.focus();
      }
    }, 400);
  }

  // ==========================================================================
  // MODALS & FOCUS MANAGEMENT
  // ==========================================================================
  function openModal(modalId) {
    state.lastActiveElement = document.activeElement;
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));

    const target = document.getElementById(modalId);
    if (target) {
      target.classList.remove('hidden');
      document.getElementById('modal-overlay').classList.remove('hidden');
      const focusable = target.querySelectorAll('button, [href], input, textarea');
      if (focusable.length) focusable[0].focus();
    }
  }

  function closeAllModals() {
    closeHowToPlayPanel();
    document.querySelectorAll('.modal').forEach(el => el.classList.add('hidden'));
    document.getElementById('modal-overlay').classList.add('hidden');
    if (state.lastActiveElement && typeof state.lastActiveElement.focus === 'function') {
      state.lastActiveElement.focus();
    }
  }

  function handleModalTrap(e) {
    const activeModal = document.querySelector('.modal:not(.hidden)') || document.querySelector('.slide-panel.panel-open');
    if (!activeModal) return;

    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = Array.from(activeModal.querySelectorAll('button, [href], input, textarea')).filter(
        el => !el.disabled && el.offsetParent !== null
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // ==========================================================================
  // STATS & BACKUP IMPORT/EXPORT
  // ==========================================================================
  function renderStatsModal() {
    const s = state.stats;
    document.getElementById('stat-modal-played').textContent = s.played;
    document.getElementById('stat-modal-completed').textContent = s.completed;
    document.getElementById('stat-modal-streak').textContent = s.currentStreak;
    document.getElementById('stat-modal-best-streak').textContent = s.bestStreak;
    document.getElementById('stat-modal-best-turns').textContent = s.bestTurns !== null ? s.bestTurns : '—';

    const avg = s.turnHistory.length
      ? (s.turnHistory.reduce((a, b) => a + b, 0) / s.turnHistory.length).toFixed(1)
      : '—';
    document.getElementById('stat-modal-avg-turns').textContent = avg;
    document.getElementById('import-block').classList.add('hidden');
  }

  function exportBackupData() {
    const payload = JSON.stringify(state.stats);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(payload).then(() => {
        showToast('Backup JSON copied to clipboard');
      }).catch(() => {
        showToast('Failed copying to clipboard.');
      });
    } else {
      prompt('Copy your backup string:', payload);
    }
  }

  function applyImportedData() {
    const txtArea = document.getElementById('import-data-text');
    const raw = txtArea.value.trim();
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      state.stats = sanitizeStats(parsed);
      savePersistence();
      renderStatsModal();
      txtArea.value = '';
      showToast('Records imported successfully');
    } catch (e) {
      showToast('Invalid backup code');
    }
  }

  // ==========================================================================
  // MIDNIGHT ROLLOVER & INACTIVITY REFRESH
  // ==========================================================================
  function checkDayRollover() {
    const currentISO = formatLocalDateISO(getLocalDate());
    if (state.todayDateString && currentISO !== state.todayDateString) {
      updateActiveDailySelection();
      const menuView = document.getElementById('view-menu');
      if (menuView && !menuView.classList.contains('hidden')) {
        renderMenuView();
      }
      showToast("Today's Reserve Selection has unlocked!");
    }
  }

  // ==========================================================================
  // EVENT REGISTRATION
  // ==========================================================================
  function setupEvents() {
    document.getElementById('btn-sound-toggle').onclick = toggleSound;
    document.getElementById('btn-toggle-sound-setting').onclick = toggleSound;
    document.getElementById('btn-toggle-bg-anim').onclick = toggleBgAnimation;
    updateSoundUI();
    updateBgAnimUI();

    document.getElementById('btn-play-game').onclick = () => loadPuzzle(state.todayPuzzle);
    document.getElementById('btn-open-vault').onclick = () => showView('view-vault');
    document.getElementById('btn-open-settings').onclick = () => openModal('modal-settings');
    document.getElementById('btn-open-how-to-play').onclick = openHowToPlayPanel;

    document.getElementById('btn-util-stats').onclick = () => {
      renderStatsModal();
      openModal('modal-stats');
    };
    document.getElementById('btn-util-share').onclick = shareResult;
    document.getElementById('btn-util-plus').onclick = () => openModal('modal-plus');

    document.getElementById('btn-vault-back').onclick = () => showView('view-menu');

    document.getElementById('btn-game-back').onclick = () => {
      cancelPendingTimers();
      showView('view-menu');
    };
    document.getElementById('btn-game-rules').onclick = openHowToPlayPanel;
    document.getElementById('btn-reset-board').onclick = () => openModal('modal-reset');
    document.getElementById('btn-reset-cancel').onclick = closeAllModals;
    document.getElementById('btn-reset-confirm').onclick = () => {
      closeAllModals();
      cancelPendingTimers();
      const isDaily = state.activePuzzle.id === state.todayPuzzle.id;
      if (isDaily) state.dailySession = null;
      else state.vaultSession = null;
      savePersistence();
      loadPuzzle(state.activePuzzle);
    };

    document.getElementById('game-board').addEventListener('keydown', handleGridKeydown);

    document.getElementById('btn-close-htp').onclick = closeHowToPlayPanel;
    document.getElementById('btn-htp-got-it').onclick = closeHowToPlayPanel;

    document.getElementById('btn-complete-share').onclick = shareResult;
    document.getElementById('btn-complete-vault').onclick = () => {
      closeAllModals();
      showView('view-vault');
    };
    document.getElementById('btn-complete-menu').onclick = () => {
      closeAllModals();
      showView('view-menu');
    };

    document.getElementById('modal-overlay').onclick = closeAllModals;
    document.querySelectorAll('.btn-close').forEach(b => {
      b.onclick = closeAllModals;
    });
    document.addEventListener('keydown', handleModalTrap);

    document.getElementById('btn-export-backup').onclick = exportBackupData;
    document.getElementById('btn-import-backup-toggle').onclick = () => {
      const blk = document.getElementById('import-block');
      blk.classList.toggle('hidden');
    };
    document.getElementById('btn-import-apply').onclick = applyImportedData;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkDayRollover();
        updateCountdownDisplays();
      }
    });
    window.addEventListener('focus', () => {
      checkDayRollover();
      updateCountdownDisplays();
    });

    state.countdownTimer = setInterval(() => {
      updateCountdownDisplays();
      checkDayRollover();
    }, CONFIG.dailyCycle.rolloverCheckIntervalMs);
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  async function init() {
    loadPersistence();
    initFloatingBackground();
    setupEvents();

    try {
      await loadPuzzles();
      showView('view-menu');
    } catch (err) {
      if (CONFIG.diagnostics.enableDebugLogging) console.error('Initialization error:', err);
      const msgEl = document.getElementById('status-message');
      msgEl.textContent = 'Unable to connect to puzzle collection.';
      const retryBtn = document.getElementById('btn-retry');
      retryBtn.classList.remove('hidden');
      retryBtn.onclick = () => {
        retryBtn.classList.add('hidden');
        msgEl.textContent = 'Connecting...';
        init();
      };
      showView('view-status');
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();