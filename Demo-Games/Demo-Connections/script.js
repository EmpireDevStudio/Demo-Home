/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  identity: {
    appId: "connections-tactile-suite",
    appName: "Connections",
    appTagline: "Artisanal Association & Categorical Ledger",
    version: "2.4.0",
    environment: "production",
    canonicalUrl: "../",
    language: "en-US",
    locale: "en-US"
  },
  branding: {
    logoUrl: "",
    logoAlt: "Connections Stationery Seal",
    accentPrimary: "#2A2D27",
    accentSecondary: "#3E5B42",
    accentHighlight: "#CCA048"
  },
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "menu",
    routes: {
      menu: {
        eyebrow: "OVERVIEW",
        title: "Daily Tasting",
        subtitle: "Find groups of four items that share a common connection."
      },
      game: {
        eyebrow: "ACTIVE PUZZLE",
        title: "Daily Association",
        subtitle: "Select four tiles and submit to discover the shared pattern."
      },
      vault: {
        eyebrow: "ARCHIVE",
        title: "Puzzle Ledger",
        subtitle: "Review historical editions and test previous associations."
      },
      settings: {
        eyebrow: "PREFERENCES",
        title: "System Settings",
        subtitle: "Configure tactile haptics, motion, and interaction physics."
      }
    }
  },
  content: {
    headers: {
      defaultTitle: "Connections",
      defaultSubtitle: "Find groups of four items that share a common connection."
    },
    actions: {
      submit: "Submit",
      deselect: "Deselect All",
      shuffle: "Shuffle",
      back: "Overview"
    },
    notifications: {
      alreadyGuessed: "Association already evaluated.",
      oneAway: "One away...",
      won: "Splendid! Puzzle Solved.",
      lost: "Revealed. Review the completed ledger.",
      linkCopied: "Application link copied to clipboard.",
      resultCopied: "Puzzle result grid copied to clipboard."
    },
    legal: {
      copyrightHolder: "Connections Architectural Suite",
      establishedYear: 2026,
      supportUrl: ""
    }
  },
  features: {
    enableHapticFeedback: true,
    enableSmoothPageTransitions: true,
    maxMistakes: 4,
    cacheMode: "no-cache",
    dataSourceUrl: "puzzles.csv"
  },
  dailyCycle: {
    anchorYear: 2024,
    anchorMonth: 1,
    anchorDay: 1,
    startIndex: 0
  },
  display: {
    levelEmojis: {
      1: "🟨", // Ochre (Level 1)
      2: "🟩", // Sage (Level 2)
      3: "🟥", // Terracotta (Level 3)
      4: "🟪"  // Plum (Level 4)
    }
  },
  storageKeys: {
    appState: "connections_tactile_app_state_v2"
  }
});

(function () {
  'use strict';

  // ==========================================================================
  // EMBEDDED PRODUCTION PUZZLE REPOSITORY (OFFLINE FALLBACK SUITE)
  // Ensures 100% immediate playability without dummy placeholders.
  // ==========================================================================
  

  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let puzzles = [];
  let todayPuzzle = null;
  let activePuzzle = null;
  let currentScreen = "menu";
  let isArchiveMode = false;
  let lastEvaluatedCalendarDay = null;

  let unsolvedWords = [];
  let selectedWords = [];
  let solvedCategories = [];
  let mistakesRemaining = APP_CONFIG.features.maxMistakes;
  let guessHistory = [];
  let isComplete = false;
  let isWon = false;

  function loadStorage() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.storageKeys.appState);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
          return {
            stats: data.stats || { played: 0, won: 0, streak: 0, maxStreak: 0 },
            games: data.games || {},
            settings: Object.assign({
              haptics: APP_CONFIG.features.enableHapticFeedback,
              animations: APP_CONFIG.features.enableSmoothPageTransitions
            }, data.settings)
          };
        }
      }
    } catch (e) {
      // Graceful local access fallback
    }
    return {
      stats: { played: 0, won: 0, streak: 0, maxStreak: 0 },
      games: {},
      settings: {
        haptics: APP_CONFIG.features.enableHapticFeedback,
        animations: APP_CONFIG.features.enableSmoothPageTransitions
      }
    };
  }

  function saveStorage(data) {
    try {
      localStorage.setItem(APP_CONFIG.storageKeys.appState, JSON.stringify(data));
    } catch (e) {
      // Graceful local access fallback
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
  // HAPTIC SIMULATION PROTOCOL
  // ==========================================================================
  function triggerHapticPulse() {
    const store = loadStorage();
    if (
      store.settings.haptics &&
      typeof navigator !== "undefined" &&
      "vibrate" in navigator
    ) {
      try {
        navigator.vibrate(12); // Subtle tactile mechanical click
      } catch (e) {
        // Silently handled
      }
    }
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
      APP_CONFIG.dailyCycle.anchorYear,
      APP_CONFIG.dailyCycle.anchorMonth - 1,
      APP_CONFIG.dailyCycle.anchorDay
    );
    const localMidnightUtc = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const msPerDay = 86400000;
    const elapsedDays = Math.floor((localMidnightUtc - anchorMidnightUtc) / msPerDay);
    const rawIndex = (elapsedDays + APP_CONFIG.dailyCycle.startIndex) % totalPuzzles;
    return (rawIndex + totalPuzzles) % totalPuzzles;
  }

  function formatDisplayDate(d) {
    try {
      return d.toLocaleDateString(APP_CONFIG.identity.locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return getLocalCalendarDateKey(d);
    }
  }

  // ==========================================================================
  // DOM REFERENCES & SELECTION
  // ==========================================================================
  const screens = {
    menu: document.getElementById('screen-menu'),
    game: document.getElementById('screen-game'),
    vault: document.getElementById('screen-vault'),
    settings: document.getElementById('screen-settings')
  };

  const dom = {
    // Standard Header Slots
    pageEyebrowSlot: document.getElementById('pageEyebrowSlot'),
    pageTitleSlot: document.getElementById('pageTitleSlot'),
    pageSubtitleSlot: document.getElementById('pageSubtitleSlot'),
    btnHeaderBack: document.getElementById('btnHeaderBack'),
    btnBackNavLabel: document.getElementById('btnBackNavLabel'),
    headerEditionText: document.getElementById('headerEditionText'),

    // Toast
    toast: document.getElementById('toast'),

    // Menu Screen Elements
    menuPuzzleDate: document.getElementById('menu-puzzle-date'),
    btnPlayGame: document.getElementById('btn-play-game'),
    btnPlayTitle: document.getElementById('btn-play-title'),
    menuPlayStatus: document.getElementById('menu-play-status'),
    btnOpenVault: document.getElementById('btn-open-vault'),
    btnOpenHowToPlay: document.getElementById('btn-open-howtoplay'),
    btnOpenSettings: document.getElementById('btn-open-settings'),
    btnOpenStats: document.getElementById('btn-open-stats'),
    btnShareGame: document.getElementById('btn-share-game'),

    // Game Board Elements
    gamePuzzleTitle: document.getElementById('game-puzzle-title'),
    mistakeDots: document.getElementById('mistake-dots'),
    solvedStack: document.getElementById('solved-stack'),
    grid: document.getElementById('grid'),
    btnShuffle: document.getElementById('btn-shuffle'),
    btnDeselect: document.getElementById('btn-deselect'),
    btnSubmit: document.getElementById('btn-submit'),

    // Vault & Settings
    vaultList: document.getElementById('vault-list'),
    btnToggleHaptics: document.getElementById('btn-toggle-haptics'),
    btnToggleAnim: document.getElementById('btn-toggle-animation'),
    clientOrgTitle: document.getElementById('clientOrgTitle'),
    clientVersionTag: document.getElementById('clientVersionTag'),
    clientSupportLink: document.getElementById('clientSupportLink'),

    // Bottom Navigation Dock
    bottomDock: document.getElementById('bottomDockNavItems'),

    // Modals & Drawers
    howToBackdrop: document.getElementById('howtoplay-backdrop'),
    howToWrapper: document.getElementById('howtoplay-wrapper'),
    howToPanel: document.getElementById('panel-howtoplay'),
    btnCloseHowTo: document.getElementById('btn-close-howtoplay'),
    btnCloseHowToIcon: document.getElementById('btn-close-howtoplay-icon'),
    modalStats: document.getElementById('modal-stats'),
    statPlayed: document.getElementById('stat-played'),
    statWinPct: document.getElementById('stat-win-pct'),
    statStreak: document.getElementById('stat-streak'),
    statMaxStreak: document.getElementById('stat-max-streak'),
    modalResult: document.getElementById('modal-result'),
    resultMsg: document.getElementById('result-msg'),
    resultGrid: document.getElementById('result-grid'),
    btnShareResult: document.getElementById('btn-share-result'),
    btnResultMenu: document.getElementById('btn-result-menu')
  };

  // ==========================================================================
  // PRESENTATION & VIEW ROUTING
  // ==========================================================================
  function setView(screenKey) {
    currentScreen = screenKey;
    Object.keys(screens).forEach(key => {
      screens[key].classList.toggle('hidden', key !== screenKey);
    });

    // Update Standardized Header based on APP_CONFIG
    const routeMeta = APP_CONFIG.navigation.routes[screenKey] || APP_CONFIG.navigation.routes.menu;
    dom.pageEyebrowSlot.textContent = routeMeta.eyebrow;
    dom.pageTitleSlot.textContent = routeMeta.title;
    dom.pageSubtitleSlot.textContent = routeMeta.subtitle;

    // Header Back navigation controls
    if (screenKey === "menu") {
      dom.btnHeaderBack.style.visibility = "hidden";
      dom.btnBackNavLabel.textContent = APP_CONFIG.content.actions.back;
    } else {
      dom.btnHeaderBack.style.visibility = "visible";
      dom.btnBackNavLabel.textContent = APP_CONFIG.content.actions.back;
    }

    // Synchronize Bottom Dock Active State
    const dockButtons = dom.bottomDock.querySelectorAll('.nav-tab-item');
    dockButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-route') === screenKey;
      btn.classList.toggle('nav-tab-item--active', isTarget);
      btn.setAttribute('aria-current', isTarget ? 'page' : 'false');
    });

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  let toastTimer = null;
  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.classList.add('hidden');
    }, 2400);
  }

  function showModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  let isPanelAnimating = false;
  function openHowToPlay() {
    if (isPanelAnimating) return;
    isPanelAnimating = true;
    dom.howToBackdrop.classList.remove('hidden');
    dom.howToWrapper.classList.remove('hidden');
    void dom.howToPanel.offsetWidth;
    dom.howToPanel.classList.add('panel-open');
    setTimeout(() => {
      isPanelAnimating = false;
      dom.btnCloseHowTo.focus();
    }, 380);
  }

  function closeHowToPlay() {
    if (isPanelAnimating) return;
    isPanelAnimating = true;
    dom.howToPanel.classList.remove('panel-open');
    setTimeout(() => {
      dom.howToWrapper.classList.add('hidden');
      dom.howToBackdrop.classList.add('hidden');
      isPanelAnimating = false;
      dom.btnOpenHowToPlay.focus();
    }, 380);
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
  // DATA PARSING & HYDRATION
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
      ? `Ledger: Puzzle ${puzzle.puzzleNumber}`
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
        : APP_CONFIG.features.maxMistakes;
      guessHistory = Array.isArray(saved.guessHistory) ? saved.guessHistory : [];
      isComplete = Boolean(saved.isComplete);
      isWon = Boolean(saved.isWon);
    } else {
      solvedCategories = [];
      mistakesRemaining = APP_CONFIG.features.maxMistakes;
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
    setView('game');
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
      tile.className = 'interactive-tactile tile';
      const isSelected = selectedWords.includes(word);
      if (isSelected) tile.classList.add('selected');
      if (isComplete) tile.disabled = true;
      tile.textContent = word;
      tile.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      tile.addEventListener('click', () => toggleTile(word));
      dom.grid.appendChild(tile);
    });

    const dots = dom.mistakeDots.querySelectorAll('.mistake-pip');
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < mistakesRemaining);
    });
    dom.mistakeDots.setAttribute('aria-label', `${mistakesRemaining} attempts remaining`);
  }

  function toggleTile(word) {
    if (isComplete) return;
    triggerHapticPulse();
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
    triggerHapticPulse();
    selectedWords = [];
    renderBoard();
    updateControls();
  }

  function shuffleTiles() {
    triggerHapticPulse();
    shuffleArray(unsolvedWords);
    renderBoard();
  }

  function submitGuess() {
    if (selectedWords.length !== 4 || isComplete) return;
    triggerHapticPulse();

    const guessKey = [...selectedWords].sort().join('|');
    if (guessHistory.some(g => [...g].sort().join('|') === guessKey)) {
      showToast(APP_CONFIG.content.notifications.alreadyGuessed);
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
        showToast(APP_CONFIG.content.notifications.oneAway);
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
    dom.resultMsg.textContent = isWon
      ? APP_CONFIG.content.notifications.won
      : APP_CONFIG.content.notifications.lost;

    dom.resultGrid.innerHTML = '';
    const wordLevelMap = {};
    activePuzzle.categories.forEach(c => {
      c.items.forEach(w => {
        wordLevelMap[w] = c.level;
      });
    });

    guessHistory.forEach(guess => {
      const line = guess.map(w => APP_CONFIG.display.levelEmojis[wordLevelMap[w]] || '⬜').join('');
      const div = document.createElement('div');
      div.textContent = line;
      dom.resultGrid.appendChild(div);
    });
    showModal(dom.modalResult);
  }

  // ==========================================================================
  // SHARING & UTILITIES
  // ==========================================================================
  async function shareGeneralGame() {
    triggerHapticPulse();
    const shareData = {
      title: APP_CONFIG.identity.appName,
      text: `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`,
      url: window.location.href.split('#')[0]
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (e) {
        // User dismiss handled silently
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareData.url)
        .then(() => showToast(APP_CONFIG.content.notifications.linkCopied))
        .catch(() => showToast("Link ready for sharing"));
    } else {
      showToast("Ready to share");
    }
  }

  function shareResultGrid() {
    triggerHapticPulse();
    const wordLevelMap = {};
    activePuzzle.categories.forEach(c => {
      c.items.forEach(w => {
        wordLevelMap[w] = c.level;
      });
    });
    const lines = guessHistory.map(g =>
      g.map(w => APP_CONFIG.display.levelEmojis[wordLevelMap[w]] || '⬜').join('')
    );
    const text = `${APP_CONFIG.identity.appName}\nPuzzle ${activePuzzle.puzzleNumber}\n${lines.join('\n')}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => showToast(APP_CONFIG.content.notifications.resultCopied))
        .catch(() => showToast("Result copied"));
    } else {
      showToast("Result ready");
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
    dom.headerEditionText.textContent = "Daily Edition";

    updateMenuStatus();

    if (lastEvaluatedCalendarDay && lastEvaluatedCalendarDay !== currentKey) {
      if (currentScreen === 'game' && !isArchiveMode) {
        startPuzzle(todayPuzzle, false);
      }
      if (currentScreen === 'vault') {
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
      dom.btnPlayTitle.textContent = 'Begin Daily Puzzle';
    } else if (saved.isComplete) {
      dom.menuPlayStatus.textContent = saved.isWon ? 'Solved' : 'Revealed';
      dom.btnPlayTitle.textContent = 'Review Daily Puzzle';
    } else {
      const solvedCount = (saved.solvedLevels || []).length;
      dom.menuPlayStatus.textContent = `${solvedCount}/4 Solved`;
      dom.btnPlayTitle.textContent = 'Resume Daily Puzzle';
    }
  }

  function renderVault() {
    dom.vaultList.innerHTML = '';
    if (puzzles.length === 0) {
      dom.vaultList.innerHTML = '<p class="vault-header-desc">No puzzles documented in ledger archive.</p>';
      return;
    }

    puzzles.forEach(p => {
      const item = document.createElement('div');
      item.className = 'interactive-tactile vault-card-item';
      item.setAttribute('role', 'button');
      item.tabIndex = 0;

      const saved = getSavedGame(p.id);
      let badge = '<span class="vault-status-badge unplayed">Unplayed</span>';
      if (saved && saved.isComplete) {
        badge = saved.isWon
          ? '<span class="vault-status-badge won">Solved</span>'
          : '<span class="vault-status-badge revealed">Revealed</span>';
      }

      item.innerHTML = `<span>Puzzle Edition ${p.puzzleNumber}</span>${badge}`;
      const playArchive = () => {
        triggerHapticPulse();
        startPuzzle(p, true);
      };
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

  function toggleSetting(key, btnEl) {
    triggerHapticPulse();
    const store = loadStorage();
    store.settings[key] = !store.settings[key];
    saveStorage(store);
    syncSettingsUI();
  }

  function syncSettingsUI() {
    const store = loadStorage();

    // Haptics Switch
    const hapticsActive = Boolean(store.settings.haptics);
    dom.btnToggleHaptics.setAttribute('aria-checked', hapticsActive ? 'true' : 'false');
    dom.btnToggleHaptics.querySelector('.switch-toggle__text').textContent = hapticsActive ? 'On' : 'Off';
    dom.btnToggleHaptics.classList.toggle('off', !hapticsActive);

    // Animations Switch
    const animActive = Boolean(store.settings.animations);
    dom.btnToggleAnim.setAttribute('aria-checked', animActive ? 'true' : 'false');
    dom.btnToggleAnim.querySelector('.switch-toggle__text').textContent = animActive ? 'On' : 'Off';
    dom.btnToggleAnim.classList.toggle('off', !animActive);
  }

  // ==========================================================================
  // INITIALIZATION & EVENT BINDING
  // ==========================================================================
  async function init() {
    // Populate Client Identity Metadata from APP_CONFIG
    document.title = `${APP_CONFIG.identity.appName} — ${APP_CONFIG.identity.appTagline}`;
    dom.clientOrgTitle.textContent = APP_CONFIG.content.legal.copyrightHolder;
    dom.clientVersionTag.textContent = `Version ${APP_CONFIG.identity.version} • Material Stationery Engine`;
    dom.clientSupportLink.href = APP_CONFIG.content.legal.supportUrl;

    syncSettingsUI();

    // Data Hydration: Attempt fetch, gracefully fallback to embedded production data
    try {
      const res = await fetch(APP_CONFIG.features.dataSourceUrl, { cache: APP_CONFIG.features.cacheMode });
      if (!res.ok) throw new Error('Data file load failure');
      const csv = await res.text();
      puzzles = loadPuzzleData(parseCSV(csv));
      if (!puzzles || puzzles.length === 0) throw new Error('Empty CSV');
    } catch (e) {
      // Offline fallback: Use pristine embedded production puzzles
      puzzles = FALLBACK_PRODUCTION_PUZZLES;
    }

    refreshDailyChallenge();
    bindEvents();
    setView('menu');
  }

  function bindEvents() {
    // Top Page Back Control
    dom.btnHeaderBack.addEventListener('click', () => {
      triggerHapticPulse();
      updateMenuStatus();
      setView('menu');
    });

    // Primary Actions
    dom.btnPlayGame.addEventListener('click', () => {
      triggerHapticPulse();
      startPuzzle(todayPuzzle, false);
    });

    dom.btnOpenVault.addEventListener('click', () => {
      triggerHapticPulse();
      renderVault();
      setView('vault');
    });

    dom.btnOpenSettings.addEventListener('click', () => {
      triggerHapticPulse();
      syncSettingsUI();
      setView('settings');
    });

    dom.btnOpenHowToPlay.addEventListener('click', () => {
      triggerHapticPulse();
      openHowToPlay();
    });

    dom.btnOpenStats.addEventListener('click', () => {
      triggerHapticPulse();
      renderStats();
      showModal(dom.modalStats);
    });

    dom.btnShareGame.addEventListener('click', shareGeneralGame);

    // Board Actions
    dom.btnShuffle.addEventListener('click', shuffleTiles);
    dom.btnDeselect.addEventListener('click', deselectAll);
    dom.btnSubmit.addEventListener('click', submitGuess);

    // Drawer Controls
    dom.btnCloseHowTo.addEventListener('click', () => {
      triggerHapticPulse();
      closeHowToPlay();
    });
    dom.btnCloseHowToIcon.addEventListener('click', () => {
      triggerHapticPulse();
      closeHowToPlay();
    });
    dom.howToBackdrop.addEventListener('click', closeHowToPlay);

    // Settings Switches
    dom.btnToggleHaptics.addEventListener('click', () => toggleSetting('haptics', dom.btnToggleHaptics));
    dom.btnToggleAnim.addEventListener('click', () => toggleSetting('animations', dom.btnToggleAnim));

    // Bottom Navigation Dock Delegation
    dom.bottomDock.addEventListener('click', (e) => {
      const targetTab = e.target.closest('.nav-tab-item');
      if (!targetTab) return;
      triggerHapticPulse();
      const route = targetTab.getAttribute('data-route');
      if (route === 'game') {
        startPuzzle(todayPuzzle, false);
      } else if (route === 'vault') {
        renderVault();
        setView('vault');
      } else if (route === 'settings') {
        syncSettingsUI();
        setView('settings');
      } else {
        updateMenuStatus();
        setView('menu');
      }
    });

    // Global Modal Closures
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        triggerHapticPulse();
        const modal = document.getElementById(e.currentTarget.getAttribute('data-close'));
        if (modal) closeModal(modal);
      });
    });

    dom.btnShareResult.addEventListener('click', shareResultGrid);
    dom.btnResultMenu.addEventListener('click', () => {
      triggerHapticPulse();
      closeModal(dom.modalResult);
      updateMenuStatus();
      setView('menu');
    });

    // Keyboard Operability (Escape to close modals/drawers)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeHowToPlay();
        const activeModal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (activeModal) closeModal(activeModal);
      }
    });

    // Lifecycle Synchronization
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