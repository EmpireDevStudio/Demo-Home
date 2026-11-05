(function () {
  'use strict';

  // ==========================================================================
  // DEVELOPER CONFIGURATION
  // ==========================================================================
  const CONFIG = {
    app: {
      title: 'Connections',
      storageKey: 'cocktail_connections_app_state_v2',
      homeUrl: '../Demo-Games/',
      maxMistakes: 4
    },
    data: {
      sourceUrl: 'puzzles.csv',
      cacheMode: 'no-cache'
    },
    dailyCycle: {
      anchorYear: 2024,
      anchorMonth: 1,
      anchorDay: 1,
      startIndex: 0
    },
    display: {
      dateFormatOptions: {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      },
      levelEmojis: {
        1: '🟨',
        2: '🟩',
        3: '🟦',
        4: '🟪'
      }
    }
  };

  const SVGS = [
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5C14 4 20 8 20 14C20 19 15 22 10 22C4 22 2 17 2 12C2 6 8 2 14 2" /></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6C13 5 18 8 18 13C18 17 14 20 10 20C6 20 4 16 4 12C4 7 9 4 14 4" /></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 2L12 10 M12 14L12 22 M2 12L10 12 M14 12L22 12 M4.93 4.93L10.59 10.59 M13.41 13.41L19.07 19.07 M4.93 19.07L10.59 13.41 M13.41 10.59L19.07 4.93"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="11"/><circle cx="12" cy="12" r="8"/><path d="M12 4L12 10 M12 14L12 20 M4 12L10 12 M14 12L20 12 M6.34 6.34L10.59 10.59 M13.41 13.41L17.66 17.66 M6.34 17.66L10.59 13.41 M13.41 10.59L17.66 6.34"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="M12 2L12 10 M12 14L12 22 M2 12L10 12 M14 12L22 12"/><circle cx="8" cy="8" r="0.5" fill="currentColor"/><circle cx="16" cy="16" r="0.5" fill="currentColor"/><circle cx="8" cy="16" r="0.5" fill="currentColor"/><circle cx="16" cy="8" r="0.5" fill="currentColor"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 2C14.5 1 17.5 2 19.5 4C21.5 6 22.5 9 21.5 11.5C22.5 14 21.5 17 19.5 19C17.5 21 14.5 22 12 21C9.5 22 6.5 21 4.5 19C2.5 17 1.5 14 2.5 11.5C1.5 9 2.5 6 4.5 4C6.5 2 9.5 1 12 2Z"/><circle cx="12" cy="12" r="2"/><path d="M12 5L12 10 M12 14L12 19 M5 12L10 12 M14 12L19 12"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="10" cy="16" r="5"/><path d="M11 11C13 5 18 3 20 4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="7" cy="17" r="4"/><circle cx="17" cy="17" r="4"/><path d="M8 13C10 7 14 4 16 4 M16 13C14 7 10 4 8 4" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 22V10" stroke-linecap="round"/><path d="M12 16C8 16 6 13 6 10C8 10 12 12 12 16Z"/><path d="M12 16C16 16 18 13 18 10C16 10 12 12 12 16Z"/><path d="M12 10C8 10 6 7 6 4C8 4 12 6 12 10Z"/><path d="M12 10C16 10 18 7 18 4C16 4 12 6 12 10Z"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M12 22C12 18 14 10 16 2"/><path d="M14 10L18 8 M14 14L18 12 M13 18L17 16 M14 10L10 8 M13.5 14L9 11 M13 18L9 15 M15 6L11 4 M15 6L19 5"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><ellipse cx="12" cy="12" rx="7" ry="9" transform="rotate(-30 12 12)"/><ellipse cx="15" cy="8" rx="2" ry="3" transform="rotate(-30 15 8)"/></svg>`,
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4C9 4 11 8 11 12C11 16 9 20 13 20C17 20 19 16 19 12C19 8 17 4 13 4C11 4 9 8 9 12"/></svg>`
  ];

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let puzzles = [];
  let todayPuzzle = null;
  let activePuzzle = null;
  let isArchiveMode = false;
  let lastEvaluatedCalendarDay = null;

  let unsolvedWords = [];
  let selectedWords = [];
  let solvedCategories = [];
  let mistakesRemaining = CONFIG.app.maxMistakes;
  let guessHistory = [];
  let isComplete = false;
  let isWon = false;

  function loadStorage() {
    try {
      const raw = localStorage.getItem(CONFIG.app.storageKey);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          return {
            stats: data.stats || { played: 0, won: 0, streak: 0, maxStreak: 0 },
            games: data.games || {},
            settings: Object.assign({ bgAnimation: true }, data.settings)
          };
        }
      }
    } catch (e) {
      // Storage access error fallback
    }
    return {
      stats: { played: 0, won: 0, streak: 0, maxStreak: 0 },
      games: {},
      settings: { bgAnimation: true }
    };
  }

  function saveStorage(data) {
    try {
      localStorage.setItem(CONFIG.app.storageKey, JSON.stringify(data));
    } catch (e) {
      // Storage access error fallback
    }
  }

  function getSavedGame(puzzleId) {
    return loadStorage().games[puzzleId] || null;
  }

  function saveActiveGame() {
    if (!activePuzzle) return;
    const store = loadStorage();
    const existing = store.games[activePuzzle.id] || {};

    store.games[activePuzzle.id] = {
      solvedLevels: solvedCategories.map(c => c.level),
      unsolvedWords: [...unsolvedWords],
      mistakesRemaining: mistakesRemaining,
      guessHistory: [...guessHistory],
      isComplete: isComplete,
      isWon: isWon,
      recorded: existing.recorded || false
    };

    if (isComplete && !existing.recorded && !isArchiveMode) {
      store.stats.played++;
      if (isWon) {
        store.stats.won++;
        store.stats.streak++;
        if (store.stats.streak > store.stats.maxStreak) {
          store.stats.maxStreak = store.stats.streak;
        }
      } else {
        store.stats.streak = 0;
      }
      store.games[activePuzzle.id].recorded = true;
    }
    saveStorage(store);
  }

  // ==========================================================================
  // CONTINUOUS DAILY PUZZLE CYCLE & CALENDAR DATE
  // ==========================================================================
  function getLocalCalendarDateKey(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function getDailyPuzzleIndex(totalPuzzles, now) {
    if (totalPuzzles <= 0) return 0;
    const anchorMidnightUtc = Date.UTC(
      CONFIG.dailyCycle.anchorYear,
      CONFIG.dailyCycle.anchorMonth - 1,
      CONFIG.dailyCycle.anchorDay
    );
    const localMidnightUtc = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const msPerDay = 86400000;
    const elapsedDays = Math.floor((localMidnightUtc - anchorMidnightUtc) / msPerDay);
    const rawIndex = (elapsedDays + CONFIG.dailyCycle.startIndex) % totalPuzzles;
    return (rawIndex + totalPuzzles) % totalPuzzles;
  }

  function formatDisplayDate(d) {
    try {
      return d.toLocaleDateString(undefined, CONFIG.display.dateFormatOptions);
    } catch (e) {
      return getLocalCalendarDateKey(d);
    }
  }

  // ==========================================================================
  // DOM SELECTION & REFERENCES
  // ==========================================================================
  const screens = {
    menu: document.getElementById('screen-menu'),
    game: document.getElementById('screen-game'),
    vault: document.getElementById('screen-vault'),
    settings: document.getElementById('screen-settings')
  };

  const dom = {
    toast: document.getElementById('toast'),
    appTitle: document.getElementById('app-title'),
    btnPlayGame: document.getElementById('btn-play-game'),
    btnPlayTitle: document.getElementById('btn-play-title'),
    menuPuzzleDate: document.getElementById('menu-puzzle-date'),
    menuPlayStatus: document.getElementById('menu-play-status'),
    btnOpenVault: document.getElementById('btn-open-vault'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    btnOpenHowToPlay: document.getElementById('btn-open-howtoplay'),
    btnOpenStats: document.getElementById('btn-open-stats'),
    btnShareGame: document.getElementById('btn-share-game'),
    btnReservedPlus: document.getElementById('btn-reserved-plus'),
    btnGameBack: document.getElementById('btn-game-back'),
    btnVaultBack: document.getElementById('btn-vault-back'),
    btnSettingsBack: document.getElementById('btn-settings-back'),
    gamePuzzleTitle: document.getElementById('game-puzzle-title'),
    solvedStack: document.getElementById('solved-stack'),
    grid: document.getElementById('grid'),
    mistakeDots: document.getElementById('mistake-dots'),
    btnShuffle: document.getElementById('btn-shuffle'),
    btnDeselect: document.getElementById('btn-deselect'),
    btnSubmit: document.getElementById('btn-submit'),
    vaultList: document.getElementById('vault-list'),
    btnToggleAnim: document.getElementById('btn-toggle-animation'),
    liveIndicator: document.getElementById('live-time-indicator'),
    howToBackdrop: document.getElementById('howtoplay-backdrop'),
    howToWrapper: document.getElementById('howtoplay-wrapper'),
    howToPanel: document.getElementById('panel-howtoplay'),
    btnCloseHowTo: document.getElementById('btn-close-howtoplay'),
    btnCloseHowToIcon: document.getElementById('btn-close-howtoplay-icon'),
    modalStats: document.getElementById('modal-stats'),
    modalResult: document.getElementById('modal-result'),
    statPlayed: document.getElementById('stat-played'),
    statWinPct: document.getElementById('stat-win-pct'),
    statStreak: document.getElementById('stat-streak'),
    statMaxStreak: document.getElementById('stat-max-streak'),
    resultMsg: document.getElementById('result-msg'),
    resultGrid: document.getElementById('result-grid'),
    btnShareResult: document.getElementById('btn-share-result'),
    btnResultMenu: document.getElementById('btn-result-menu')
  };

  // ==========================================================================
  // AMBIENT FLIGHT SYSTEM
  // ==========================================================================
  const AmbientSystem = {
    layer: null,
    elements: [],
    depthLayers: [
      { depth: 'depth-bg', count: 3, minDur: 30, maxDur: 45 },
      { depth: 'depth-mid', count: 3, minDur: 20, maxDur: 30 },
      { depth: 'depth-fg', count: 2, minDur: 15, maxDur: 22 }
    ],

    init() {
      this.layer = document.getElementById('ambient-icons-layer');
      if (!this.layer) return;

      this.depthLayers.forEach(cfg => {
        for (let i = 0; i < cfg.count; i++) {
          this.spawnGarnish(cfg, true);
        }
      });
      this.updateState();
    },

    spawnGarnish(cfg, isInitial) {
      const el = document.createElement('div');
      el.className = `ambient-icon ${cfg.depth}`;
      el.style.left = `${Math.floor(Math.random() * 90) + 5}%`;

      const dur = Math.random() * (cfg.maxDur - cfg.minDur) + cfg.minDur;
      const delay = isInitial ? Math.random() * -dur : 0;

      el.style.animationDuration = `${dur}s`;
      el.style.animationDelay = `${delay}s`;

      const drift = document.createElement('div');
      drift.style.animationDuration = `${dur * 0.6}s`;
      drift.style.animationDelay = `${delay * 0.6}s`;

      const rotate = document.createElement('div');
      rotate.style.animationDuration = `${dur * 1.5}s`;
      rotate.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';

      rotate.innerHTML = SVGS[Math.floor(Math.random() * SVGS.length)];

      drift.appendChild(rotate);
      el.appendChild(drift);
      this.layer.appendChild(el);
      this.elements.push({ el, drift, rotate });

      el.addEventListener('animationend', (e) => {
        if (e.animationName === 'floatUpward') {
          el.remove();
          const idx = this.elements.findIndex(x => x.el === el);
          if (idx > -1) this.elements.splice(idx, 1);
          if (loadStorage().settings.bgAnimation) {
            this.spawnGarnish(cfg, false);
          }
        }
      });
    },

    updateState() {
      const enabled = loadStorage().settings.bgAnimation;
      this.elements.forEach(item => {
        if (enabled) {
          item.el.classList.add('anim-float');
          item.drift.classList.add('anim-drift');
          item.rotate.classList.add('anim-rotate');
        } else {
          item.el.classList.remove('anim-float');
          item.drift.classList.remove('anim-drift');
          item.rotate.classList.remove('anim-rotate');
        }
      });
    }
  };

  // ==========================================================================
  // NAVIGATION & PRESENTATION
  // ==========================================================================
  function showScreen(name) {
    Object.keys(screens).forEach(key => {
      screens[key].classList.toggle('hidden', key !== name);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  let isPanelAnimating = false;
  function openHowToPlay() {
    if (isPanelAnimating) return;
    isPanelAnimating = true;
    dom.howToBackdrop.classList.remove('hidden');
    dom.howToWrapper.classList.remove('hidden');
    void dom.howToPanel.offsetWidth;
    dom.howToBackdrop.classList.add('visible');
    dom.howToPanel.classList.add('panel-open');
    setTimeout(() => {
      isPanelAnimating = false;
      dom.btnCloseHowTo.focus();
    }, 450);
  }

  function closeHowToPlay() {
    if (isPanelAnimating) return;
    isPanelAnimating = true;
    dom.howToPanel.classList.remove('panel-open');
    dom.howToBackdrop.classList.remove('visible');
    setTimeout(() => {
      dom.howToWrapper.classList.add('hidden');
      dom.howToBackdrop.classList.add('hidden');
      isPanelAnimating = false;
      dom.btnOpenHowToPlay.focus();
    }, 450);
  }

  function showModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  let toastTimer = null;
  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.classList.add('hidden');
    }, 2200);
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // ==========================================================================
  // DATA PARSING & EXTRACTION
  // ==========================================================================
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cell += c;
        }
      } else {
        if (c === '"') {
          inQuotes = true;
        } else if (c === ',') {
          row.push(cell.trim());
          cell = '';
        } else if (c === '\n' || c === '\r') {
          row.push(cell.trim());
          if (row.some(v => v !== '')) rows.push(row);
          row = [];
          cell = '';
          if (c === '\r' && text[i + 1] === '\n') i++;
        } else {
          cell += c;
        }
      }
    }
    if (cell || row.length > 0) {
      row.push(cell.trim());
      if (row.some(v => v !== '')) rows.push(row);
    }
    return rows;
  }

  function loadPuzzleData(rows) {
    if (!Array.isArray(rows) || rows.length < 2) return [];

    let headerOffset = 1;
    const headerRow = rows[0].map(h => (h || '').toLowerCase().trim());
    if (headerRow.length >= 8 && headerRow[0].startsWith('cat')) {
      headerOffset = 0;
    }

    const list = [];
    let recordIndex = 1;

    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length < headerOffset + 8) continue;

      const categories = [];
      for (let c = 0; c < 4; c++) {
        const catName = r[headerOffset + c * 2];
        const rawWords = r[headerOffset + 1 + c * 2];
        if (!catName || !rawWords) continue;
        const items = rawWords.split(/[,;]/).map(w => w.trim()).filter(Boolean);
        if (items.length === 4) {
          categories.push({
            name: catName.trim(),
            level: c + 1,
            items: items
          });
        }
      }

      if (categories.length === 4) {
        list.push({
          id: `puzzle-${recordIndex}`,
          puzzleNumber: recordIndex,
          categories: categories
        });
        recordIndex++;
      }
    }
    return list;
  }

  // ==========================================================================
  // GAMEPLAY ENGINE
  // ==========================================================================
  function startPuzzle(puzzle, isArchive) {
    if (!puzzle) return;
    activePuzzle = puzzle;
    isArchiveMode = isArchive;
    dom.gamePuzzleTitle.textContent = isArchive
      ? `Vault: Puzzle ${puzzle.puzzleNumber}`
      : `Daily Puzzle`;
    selectedWords = [];
    dom.solvedStack.innerHTML = '';

    const saved = getSavedGame(puzzle.id);
    if (saved) {
      solvedCategories = (saved.solvedLevels || [])
        .map(lvl => puzzle.categories.find(c => c.level === lvl))
        .filter(Boolean);
      unsolvedWords = Array.isArray(saved.unsolvedWords) ? saved.unsolvedWords : [];
      mistakesRemaining = typeof saved.mistakesRemaining === 'number'
        ? saved.mistakesRemaining
        : CONFIG.app.maxMistakes;
      guessHistory = Array.isArray(saved.guessHistory) ? saved.guessHistory : [];
      isComplete = Boolean(saved.isComplete);
      isWon = Boolean(saved.isWon);
    } else {
      solvedCategories = [];
      mistakesRemaining = CONFIG.app.maxMistakes;
      guessHistory = [];
      isComplete = false;
      isWon = false;
      const all = [];
      puzzle.categories.forEach(c => c.items.forEach(it => all.push(it)));
      shuffleArray(all);
      unsolvedWords = all;
    }

    renderBoard();
    updateControls();
    showScreen('game');
  }

  function renderBoard() {
    const renderedLevels = Array.from(dom.solvedStack.children).map(el =>
      parseInt(el.getAttribute('data-level'), 10)
    );
    const targetLevels = solvedCategories.map(c => c.level);

    const isPrefix = renderedLevels.length <= targetLevels.length &&
      renderedLevels.every((lvl, i) => lvl === targetLevels[i]);

    if (!isPrefix) {
      dom.solvedStack.innerHTML = '';
      renderedLevels.length = 0;
    }

    const existingSet = new Set(renderedLevels);
    solvedCategories.forEach(cat => {
      if (!existingSet.has(cat.level)) {
        const banner = document.createElement('div');
        banner.className = `solved-banner cat-${cat.level}`;
        banner.setAttribute('data-level', cat.level);
        banner.innerHTML = `
          <span class="banner-level-tag">Level ${cat.level}</span>
          <span class="banner-name">${escapeHTML(cat.name)}</span>
          <span class="banner-items">${cat.items.map(escapeHTML).join(', ')}</span>
        `;
        dom.solvedStack.appendChild(banner);
      }
    });

    dom.grid.innerHTML = '';
    unsolvedWords.forEach(word => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      const isSelected = selectedWords.includes(word);
      if (isSelected) tile.classList.add('selected');
      if (isComplete) tile.disabled = true;
      tile.textContent = word;
      tile.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      tile.addEventListener('click', () => toggleTile(word));
      dom.grid.appendChild(tile);
    });

    const dots = dom.mistakeDots.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < mistakesRemaining);
    });
    dom.mistakeDots.setAttribute('aria-label', `${mistakesRemaining} attempts left`);
  }

  function toggleTile(word) {
    if (isComplete) return;
    const idx = selectedWords.indexOf(word);
    if (idx > -1) {
      selectedWords.splice(idx, 1);
    } else {
      if (selectedWords.length >= 4) return;
      selectedWords.push(word);
    }
    renderBoard();
    updateControls();
  }

  function updateControls() {
    const len = selectedWords.length;
    dom.btnSubmit.disabled = len !== 4 || isComplete;
    dom.btnDeselect.disabled = len === 0 || isComplete;
    dom.btnShuffle.disabled = unsolvedWords.length <= 1 || isComplete;
  }

  function deselectAll() {
    selectedWords = [];
    renderBoard();
    updateControls();
  }

  function shuffleTiles() {
    shuffleArray(unsolvedWords);
    renderBoard();
  }

  function submitGuess() {
    if (selectedWords.length !== 4 || isComplete) return;
    const guessKey = [...selectedWords].sort().join('|');
    if (guessHistory.some(g => [...g].sort().join('|') === guessKey)) {
      showToast('Already guessed');
      return;
    }

    guessHistory.push([...selectedWords]);
    let matchedCat = null;
    for (const cat of activePuzzle.categories) {
      if (solvedCategories.includes(cat)) continue;
      if (selectedWords.filter(w => cat.items.includes(w)).length === 4) {
        matchedCat = cat;
        break;
      }
    }

    if (matchedCat) {
      solvedCategories.push(matchedCat);
      unsolvedWords = unsolvedWords.filter(w => !matchedCat.items.includes(w));
      selectedWords = [];
      if (solvedCategories.length === 4) {
        isComplete = true;
        isWon = true;
        finishGame();
      } else {
        saveActiveGame();
        renderBoard();
        updateControls();
      }
    } else {
      mistakesRemaining--;
      if (activePuzzle.categories.some(cat =>
        !solvedCategories.includes(cat) &&
        selectedWords.filter(w => cat.items.includes(w)).length === 3
      )) {
        showToast('One away...');
      }
      const domSelected = dom.grid.querySelectorAll('.tile.selected');
      domSelected.forEach(t => t.classList.add('shake'));
      setTimeout(() => domSelected.forEach(t => t.classList.remove('shake')), 320);

      if (mistakesRemaining <= 0) {
        isComplete = true;
        isWon = false;
        setTimeout(() => {
          solvedCategories = [...activePuzzle.categories];
          unsolvedWords = [];
          selectedWords = [];
          finishGame();
        }, 400);
      } else {
        saveActiveGame();
        renderBoard();
        updateControls();
      }
    }
  }

  function finishGame() {
    saveActiveGame();
    renderBoard();
    updateControls();
    updateMenuStatus();
    setTimeout(showResultModal, 450);
  }

  function showResultModal() {
    dom.resultMsg.textContent = isWon ? 'Splendid! Puzzle Solved.' : 'Revealed. Better luck next time!';
    dom.resultGrid.innerHTML = '';
    const wordLevelMap = {};
    activePuzzle.categories.forEach(c => {
      c.items.forEach(w => {
        wordLevelMap[w] = c.level;
      });
    });
    guessHistory.forEach(guess => {
      const line = guess.map(w => CONFIG.display.levelEmojis[wordLevelMap[w]] || '⬜').join('');
      const div = document.createElement('div');
      div.textContent = line;
      dom.resultGrid.appendChild(div);
    });
    showModal(dom.modalResult);
  }

  // ==========================================================================
  // SHARE & UTILITIES
  // ==========================================================================
  async function shareGeneralGame() {
    const shareData = {
      title: CONFIG.app.title,
      text: 'Play Connections — Find groups of four items that share a common connection.',
      url: window.location.href.split('#')[0]
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // User canceled or share unsupported
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url)
        .then(() => showToast('Game link copied to clipboard'))
        .catch(() => showToast('Link ready to share'));
    } else {
      showToast('Game ready to share');
    }
  }

  function shareResultGrid() {
    const wordLevelMap = {};
    activePuzzle.categories.forEach(c => {
      c.items.forEach(w => {
        wordLevelMap[w] = c.level;
      });
    });
    const lines = guessHistory.map(g =>
      g.map(w => CONFIG.display.levelEmojis[wordLevelMap[w]] || '⬜').join('')
    );
    const text = `${CONFIG.app.title}\nPuzzle ${activePuzzle.puzzleNumber}\n${lines.join('\n')}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Result copied to clipboard'))
        .catch(() => showToast('Result copied'));
    } else {
      showToast('Result copied');
    }
  }

  // ==========================================================================
  // DAILY REFRESH, VAULT & SETTINGS
  // ==========================================================================
  function refreshDailyChallenge() {
    if (!puzzles || puzzles.length === 0) return;
    const now = new Date();
    const currentKey = getLocalCalendarDateKey(now);

    const puzzleIndex = getDailyPuzzleIndex(puzzles.length, now);
    todayPuzzle = puzzles[puzzleIndex];

    dom.menuPuzzleDate.textContent = formatDisplayDate(now);
    dom.btnPlayTitle.textContent = 'Play Connections';
    dom.liveIndicator.textContent = 'Daily';

    updateMenuStatus();

    if (lastEvaluatedCalendarDay && lastEvaluatedCalendarDay !== currentKey) {
      if (screens.game && !screens.game.classList.contains('hidden') && !isArchiveMode) {
        startPuzzle(todayPuzzle, false);
      }
      if (screens.vault && !screens.vault.classList.contains('hidden')) {
        renderVault();
      }
    }
    lastEvaluatedCalendarDay = currentKey;
  }

  function updateMenuStatus() {
    if (!todayPuzzle) return;
    const saved = getSavedGame(todayPuzzle.id);
    if (!saved) {
      dom.menuPlayStatus.textContent = 'Ready';
    } else if (saved.isComplete) {
      dom.menuPlayStatus.textContent = saved.isWon ? 'Solved' : 'Revealed';
    } else {
      dom.menuPlayStatus.textContent = `${(saved.solvedLevels || []).length}/4 Solved`;
    }
  }

  function renderVault() {
    dom.vaultList.innerHTML = '';
    if (puzzles.length === 0) {
      dom.vaultList.innerHTML = '<p class="vault-instructions">No puzzles currently in archive.</p>';
      return;
    }

    puzzles.forEach(p => {
      const item = document.createElement('div');
      item.className = 'vault-card-item';
      item.setAttribute('role', 'button');
      item.tabIndex = 0;

      const saved = getSavedGame(p.id);
      let badge = '<span class="badge-tag unplayed">Unplayed</span>';
      if (saved && saved.isComplete) {
        badge = saved.isWon
          ? '<span class="badge-tag won">Solved</span>'
          : '<span class="badge-tag revealed">Revealed</span>';
      }

      item.innerHTML = `<span>Puzzle ${p.puzzleNumber}</span>${badge}`;
      const playArchive = () => startPuzzle(p, true);
      item.addEventListener('click', playArchive);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          playArchive();
        }
      });
      dom.vaultList.appendChild(item);
    });
  }

  function renderStats() {
    const stats = loadStorage().stats;
    dom.statPlayed.textContent = stats.played;
    dom.statWinPct.textContent = stats.played > 0
      ? `${Math.round((stats.won / stats.played) * 100)}%`
      : '0%';
    dom.statStreak.textContent = stats.streak;
    dom.statMaxStreak.textContent = stats.maxStreak;
  }

  function toggleAnimationSetting() {
    const store = loadStorage();
    store.settings.bgAnimation = !store.settings.bgAnimation;
    saveStorage(store);
    updateAnimationUI();
    AmbientSystem.updateState();
  }

  function updateAnimationUI() {
    const enabled = loadStorage().settings.bgAnimation;
    dom.btnToggleAnim.setAttribute('aria-checked', enabled ? 'true' : 'false');
    dom.btnToggleAnim.querySelector('.toggle-label').textContent = enabled ? 'On' : 'Off';
    dom.btnToggleAnim.classList.toggle('off', !enabled);
  }

  // ==========================================================================
  // INITIALIZATION & EVENT LISTENERS
  // ==========================================================================
  async function init() {
    dom.btnReservedPlus.setAttribute('href', CONFIG.app.homeUrl);

    AmbientSystem.init();
    updateAnimationUI();

    try {
      const res = await fetch(CONFIG.data.sourceUrl, { cache: CONFIG.data.cacheMode });
      if (!res.ok) throw new Error('Data file load failure');
      const csv = await res.text();
      puzzles = loadPuzzleData(parseCSV(csv));
    } catch (e) {
      dom.menuPuzzleDate.textContent = 'Offline';
      dom.menuPlayStatus.textContent = 'Catalog Error';
      dom.btnPlayGame.disabled = true;
      return;
    }

    if (puzzles.length === 0) {
      dom.menuPuzzleDate.textContent = 'Unavailable';
      dom.menuPlayStatus.textContent = 'Empty Data';
      dom.btnPlayGame.disabled = true;
      return;
    }

    refreshDailyChallenge();
    bindEvents();
    showScreen('menu');
  }

  function bindEvents() {
    dom.btnPlayGame.addEventListener('click', () => startPuzzle(todayPuzzle, false));
    dom.btnOpenVault.addEventListener('click', () => {
      renderVault();
      showScreen('vault');
    });
    dom.btnOpenSettings.addEventListener('click', () => {
      updateAnimationUI();
      showScreen('settings');
    });
    dom.btnOpenHowToPlay.addEventListener('click', openHowToPlay);
    dom.btnOpenStats.addEventListener('click', () => {
      renderStats();
      showModal(dom.modalStats);
    });
    dom.btnShareGame.addEventListener('click', shareGeneralGame);
    dom.btnReservedPlus.addEventListener('click', () => {
      window.location.href = CONFIG.app.homeUrl;
    });

    dom.btnGameBack.addEventListener('click', () => {
      updateMenuStatus();
      showScreen('menu');
    });
    dom.btnVaultBack.addEventListener('click', () => {
      updateMenuStatus();
      showScreen('menu');
    });
    dom.btnSettingsBack.addEventListener('click', () => {
      updateMenuStatus();
      showScreen('menu');
    });

    dom.btnShuffle.addEventListener('click', shuffleTiles);
    dom.btnDeselect.addEventListener('click', deselectAll);
    dom.btnSubmit.addEventListener('click', submitGuess);

    dom.btnCloseHowTo.addEventListener('click', closeHowToPlay);
    dom.btnCloseHowToIcon.addEventListener('click', closeHowToPlay);
    dom.howToBackdrop.addEventListener('click', closeHowToPlay);
    dom.btnToggleAnim.addEventListener('click', toggleAnimationSetting);

    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = document.getElementById(e.currentTarget.getAttribute('data-close'));
        if (modal) closeModal(modal);
      });
    });

    dom.btnShareResult.addEventListener('click', shareResultGrid);
    dom.btnResultMenu.addEventListener('click', () => {
      closeModal(dom.modalResult);
      updateMenuStatus();
      showScreen('menu');
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeHowToPlay();
        const activeModal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (activeModal) closeModal(activeModal);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshDailyChallenge();
      }
    });

    window.addEventListener('focus', () => {
      refreshDailyChallenge();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();