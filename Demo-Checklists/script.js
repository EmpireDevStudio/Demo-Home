"use strict";

/* ==========================================================================
   1. CENTRALISED APPLICATION CONFIGURATION
   All runtime settings, repositories, thresholds and audio feedback
   ========================================================================== */
const APP_CONFIG = {
  // Identity
  APP_NAME: "Checkpoint Pro",
  APP_VERSION: "v2.5 Production",
  
  // Repository source detection (if left empty, auto-detects from GitHub Pages)
  GITHUB_OWNER: "",
  GITHUB_REPO: "",
  GITHUB_BRANCH: "main",

  // Directory path inside repo. Empty string ("") = repository root
  CHECKLISTS_PATH: "",

  // Header detection: 'auto' | 'always' | 'never'
  CSV_HAS_HEADER: "auto",

  // Background auto-refresh interval in ms (5 minutes; 0 to disable)
  AUTO_REFRESH_INTERVAL: 300000,

  // Save progress locally in browser localStorage
  SAVE_PROGRESS: true,

  // Audio tactile feedback
  ENABLE_SOUND: true,

  // Storage key prefix
  STORAGE_PREFIX: "checkpoint_ops_v2_",

  
};

/* ==========================================================================
   2. APPLICATION STATE
   ========================================================================== */
const State = {
  owner: "",
  repo: "",
  branch: APP_CONFIG.GITHUB_BRANCH,
  checklists: new Map(), // filename -> ChecklistModel
  activeChecklistId: null,
  activeFilter: "all",   // 'all' | 'remaining' | 'completed'
  searchQuery: "",
  checklistSearchQuery: "",
  isSyncing: false,
  soundEnabled: APP_CONFIG.ENABLE_SOUND,
  audioContext: null,
  lastFocusedElement: null
};

/**
 * Task Item Model
 */
class TaskItem {
  constructor(rawTitle, rawDescription, occurrenceIndex, checklistId) {
    this.title = (rawTitle || "").trim();
    this.description = (rawDescription || "").trim();
    this.index = occurrenceIndex;
    this.checklistId = checklistId;
    this.id = this.generateId();
    this.completed = false;
    this.completedAt = null;
  }

  generateId() {
    const cleanTitle = this.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const baseSlug = cleanTitle.length > 0 ? cleanTitle.slice(0, 30) : "step";
    return `t_${baseSlug}_${this.index}`;
  }
}

/**
 * Checklist Model
 */
class ChecklistModel {
  constructor(filename, path, downloadUrl = "#", size = 0, isBundled = false) {
    this.filename = filename;
    this.path = path;
    this.downloadUrl = downloadUrl;
    this.size = size;
    this.isBundled = isBundled;
    this.displayName = this.formatDisplayName(filename);
    this.tasks = [];
    this.isLoaded = false;
  }

  formatDisplayName(name) {
    const withoutExt = name.replace(/\.csv$/i, "");
    const clean = withoutExt.replace(/[_-]+/g, " ").trim();
    return clean.replace(/\b\w/g, c => c.toUpperCase()) || name;
  }

  get totalCount() {
    return this.tasks.length;
  }

  get completedCount() {
    return this.tasks.filter(t => t.completed).length;
  }

  get remainingCount() {
    return Math.max(0, this.totalCount - this.completedCount);
  }

  get percent() {
    if (this.totalCount === 0) return 0;
    return Math.round((this.completedCount / this.totalCount) * 100);
  }

  get isFullyComplete() {
    return this.totalCount > 0 && this.completedCount === this.totalCount;
  }
}

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZED TACTILE FEEDBACK (ZERO EXTERNAL ASSETS)
   ========================================================================== */
function playTactileFeedback(type = "tick") {
  if (!State.soundEnabled) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!State.audioContext) {
      State.audioContext = new AudioCtx();
    }

    if (State.audioContext.state === "suspended") {
      State.audioContext.resume();
    }

    const ctx = State.audioContext;
    const now = ctx.currentTime;

    if (type === "complete") {
      // Harmonic chord for procedure completion
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.38);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.4);
      });
    } else if (type === "tick") {
      // Subtle Apple-like mechanical haptic click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === "untick") {
      // Soft release click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.035);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch (err) {
    // Non-fatal if audio context is blocked by browser policy
  }
}

/* ==========================================================================
   4. REPOSITORY IDENTITY AUTO-DETECTION
   ========================================================================== */
function resolveRepositoryCoordinates() {
  try {
    const storedOwner = localStorage.getItem("checkpoint_repo_owner");
    const storedRepo = localStorage.getItem("checkpoint_repo_name");
    const storedBranch = localStorage.getItem("checkpoint_repo_branch");
    const storedFolder = localStorage.getItem("checkpoint_repo_folder");

    if (storedOwner && storedRepo) {
      State.owner = storedOwner.trim();
      State.repo = storedRepo.trim();
      State.branch = storedBranch ? storedBranch.trim() : APP_CONFIG.GITHUB_BRANCH;
      if (storedFolder !== null) APP_CONFIG.CHECKLISTS_PATH = storedFolder.trim();
      updateRepoTargetUI();
      return;
    }
  } catch (e) {
    console.warn("Storage access warning:", e);
  }

  let owner = APP_CONFIG.GITHUB_OWNER.trim();
  let repo = APP_CONFIG.GITHUB_REPO.trim();

  // Automatic GitHub Pages URL parsing (<owner>.github.io/<repo>/)
  if (!owner || !repo) {
    const hostname = window.location.hostname || "";
    const pathname = window.location.pathname || "";

    const ghPagesMatch = hostname.match(/^([a-zA-Z0-9-]+)\.github\.io$/i);
    if (ghPagesMatch) {
      if (!owner) owner = ghPagesMatch[1];
      if (!repo) {
        const segments = pathname.split("/").filter(Boolean);
        repo = segments.length > 0 ? segments[0] : `${owner}.github.io`;
      }
    }
  }

  State.owner = owner;
  State.repo = repo;
  State.branch = APP_CONFIG.GITHUB_BRANCH;
  updateRepoTargetUI();
}

function updateRepoTargetUI() {
  const label = document.getElementById("repoTargetDisplay");
  if (label) {
    if (State.owner && State.repo) {
      label.textContent = `${State.owner}/${State.repo}`;
    } else {
      label.textContent = "Offline / Bundled Checklists";
    }
  }
}

/* ==========================================================================
   5. MULTI-SOURCE DISCOVERY ENGINE (REST API + RAW TREE + BUNDLED DEMO)
   ========================================================================== */
async function discoverChecklists(forceNetwork = false) {
  const syncNotice = document.getElementById("syncStatusNotice");
  const loadingIndicator = document.getElementById("loadingIndicator");
  const noChecklistsState = document.getElementById("noChecklistsState");

  if (syncNotice) syncNotice.textContent = "Scanning…";
  if (loadingIndicator) loadingIndicator.hidden = false;

  const cleanFolder = APP_CONFIG.CHECKLISTS_PATH.replace(/^\/+|\/+$/g, "");
  let discovered = false;

  // Strategy 1: GitHub Contents API
  if (State.owner && State.repo) {
    try {
      const contentsUrl = `https://api.github.com/repos/${encodeURIComponent(State.owner)}/${encodeURIComponent(State.repo)}/contents/${cleanFolder ? encodeURIComponent(cleanFolder) : ""}`;
      const res = await fetch(contentsUrl, { 
        headers: { "Accept": "application/vnd.github.v3+json" },
        cache: forceNetwork ? "no-cache" : "default"
      });

      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items)) {
          const csvItems = items.filter(f => f.type === "file" && f.name.toLowerCase().endsWith(".csv"));
          if (csvItems.length > 0) {
            State.checklists.clear();
            csvItems.forEach(item => {
              const checklist = new ChecklistModel(item.name, item.path, item.download_url, item.size);
              State.checklists.set(item.name, checklist);
            });
            discovered = true;
          }
        }
      }
    } catch (e) {
      console.warn("Contents API lookup error:", e);
    }

    // Strategy 2: Git Trees API (recursive scan)
    if (!discovered) {
      const candidateBranches = [State.branch, State.branch === "main" ? "master" : "main"];
      for (const branchName of candidateBranches) {
        try {
          const treeUrl = `https://api.github.com/repos/${encodeURIComponent(State.owner)}/${encodeURIComponent(State.repo)}/git/trees/${encodeURIComponent(branchName)}?recursive=1`;
          const res = await fetch(treeUrl, { 
            headers: { "Accept": "application/vnd.github.v3+json" },
            cache: forceNetwork ? "no-cache" : "default"
          });

          if (!res.ok) continue;
          const data = await res.json();
          if (!data.tree || !Array.isArray(data.tree)) continue;

          const prefix = cleanFolder ? `${cleanFolder}/` : "";
          const nodes = data.tree.filter(node => {
            if (node.type !== "blob") return false;
            if (!node.path.toLowerCase().endsWith(".csv")) return false;
            if (prefix && !node.path.startsWith(prefix)) return false;
            return true;
          });

          if (nodes.length > 0) {
            State.checklists.clear();
            nodes.forEach(node => {
              const filename = node.path.split("/").pop();
              const rawUrl = `https://raw.githubusercontent.com/${encodeURIComponent(State.owner)}/${encodeURIComponent(State.repo)}/${encodeURIComponent(branchName)}/${encodeURI(node.path)}`;
              const checklist = new ChecklistModel(filename, node.path, rawUrl, node.size);
              State.checklists.set(filename, checklist);
            });
            discovered = true;
            State.branch = branchName;
            break;
          }
        } catch (e) {
          console.warn("Tree API lookup error:", e);
        }
      }
    }
  }

  // Strategy 3: Graceful fallback to bundled high-grade operational procedures
  if (!discovered && State.checklists.size === 0) {
    APP_CONFIG.BUNDLED_DEMO_CHECKLISTS.forEach(demo => {
      const checklist = new ChecklistModel(demo.filename, demo.filename, "#", 0, true);
      checklist.tasks = parseChecklistCsv(demo.csv, demo.filename);
      checklist.isLoaded = true;
      restoreChecklistProgress(checklist);
      State.checklists.set(demo.filename, checklist);
    });
    discovered = true;
    if (syncNotice) syncNotice.textContent = "Bundled";
  }

  // Load contents of discovered CSV files if not already loaded
  if (discovered && State.checklists.size > 0) {
    await fetchAllChecklistContents();
    if (noChecklistsState) noChecklistsState.hidden = true;
    if (syncNotice && syncNotice.textContent !== "Bundled") syncNotice.textContent = "Synced";
  } else if (State.checklists.size === 0) {
    if (noChecklistsState) noChecklistsState.hidden = false;
    if (syncNotice) syncNotice.textContent = "Empty";
  }

  if (loadingIndicator) loadingIndicator.hidden = true;
  updateGlobalMetrics();
  renderSidebar();
  initializeActiveChecklist();
}

/**
 * Downloads and parses every remote CSV file
 */
async function fetchAllChecklistContents() {
  const promises = Array.from(State.checklists.values()).map(async (checklist) => {
    if (checklist.isLoaded) return;

    try {
      const cleanRelativePath = checklist.path.replace(/^\/+/, "");
      let res = await fetch(encodeURI(cleanRelativePath), { cache: "no-store" });
      
      if (!res.ok && checklist.downloadUrl && checklist.downloadUrl !== "#") {
        res = await fetch(checklist.downloadUrl, { cache: "no-store" });
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      checklist.tasks = parseChecklistCsv(text, checklist.filename);
      checklist.isLoaded = true;

      restoreChecklistProgress(checklist);
    } catch (err) {
      console.warn(`Could not read ${checklist.filename}:`, err);
    }
  });

  await Promise.all(promises);
}

/* ==========================================================================
   6. RFC 4180 COMPLIANT CSV PARSER
   Column A = Task / Title, Column B = Instructions / Description
   ========================================================================== */
function parseChecklistCsv(rawCsvText, checklistId) {
  if (!rawCsvText) return [];

  // Strip Byte Order Mark (BOM)
  let cleanText = rawCsvText;
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.slice(1);
  }

  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++; // Escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === '\r') {
        if (nextChar === '\n') i++;
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else if (char === '\n') {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || inQuotes) {
    currentRow.push(currentCell.trim());
  }
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];

  // Header detection
  let startIndex = 0;
  if (APP_CONFIG.CSV_HAS_HEADER === "always") {
    startIndex = 1;
  } else if (APP_CONFIG.CSV_HAS_HEADER === "auto") {
    const firstRowA = (rows[0][0] || "").toLowerCase().trim();
    const firstRowB = (rows[0][1] || "").toLowerCase().trim();
    const headerKeywordsA = ["task", "task title", "title", "todo", "item", "action", "step", "name", "protocol", "action item", "inspection point"];
    const headerKeywordsB = ["description", "details", "desc", "instructions", "notes", "summary", "spec", "procedure details", "verification protocol"];

    const isHeaderA = headerKeywordsA.includes(firstRowA);
    const isHeaderB = headerKeywordsB.includes(firstRowB);

    if (isHeaderA || (isHeaderA && isHeaderB)) {
      startIndex = 1;
    }
  }

  const taskList = [];
  let occurrenceCounter = 0;

  for (let r = startIndex; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    const taskTitle = row[0] ? row[0].trim() : "";
    const taskDesc = row[1] ? row[1].trim() : "";

    if (taskTitle.length > 0) {
      occurrenceCounter++;
      const task = new TaskItem(taskTitle, taskDesc, occurrenceCounter, checklistId);
      taskList.push(task);
    }
  }

  return taskList;
}

/* ==========================================================================
   7. PROGRESS PERSISTENCE (LOCALSTORAGE)
   ========================================================================== */
function getStorageKey(checklistId) {
  const repoSlug = `${State.owner || 'local'}_${State.repo || 'ops'}_`.replace(/[^a-zA-Z0-9_]/g, "");
  return `${APP_CONFIG.STORAGE_PREFIX}${repoSlug}${checklistId}`;
}

function restoreChecklistProgress(checklist) {
  if (!APP_CONFIG.SAVE_PROGRESS) return;

  try {
    const rawSaved = localStorage.getItem(getStorageKey(checklist.filename));
    if (!rawSaved) return;

    const data = JSON.parse(rawSaved);
    if (!Array.isArray(data)) return;

    const completedMap = new Map();
    data.forEach(item => {
      if (typeof item === "string") {
        completedMap.set(item, null);
      } else if (item && item.id) {
        completedMap.set(item.id, item.completedAt || null);
      }
    });

    checklist.tasks.forEach(task => {
      if (completedMap.has(task.id)) {
        task.completed = true;
        task.completedAt = completedMap.get(task.id);
      }
    });
  } catch (err) {
    console.warn("Storage restoration warning:", err);
  }
}

function saveChecklistProgress(checklist) {
  if (!APP_CONFIG.SAVE_PROGRESS) return;

  try {
    const completedRecords = checklist.tasks
      .filter(t => t.completed)
      .map(t => ({ id: t.id, completedAt: t.completedAt || new Date().toISOString() }));

    localStorage.setItem(getStorageKey(checklist.filename), JSON.stringify(completedRecords));
    showAutosaveToast("Progress Saved");
  } catch (err) {
    console.warn("LocalStorage save error:", err);
    showAutosaveToast("Storage Restricted");
  }
}

let toastTimer = null;
function showAutosaveToast(message) {
  const toast = document.getElementById("autosaveToast");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.hidden = false;
  toast.classList.add("is-visible");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
    toast.classList.remove("is-visible");
  }, 1400);
}

/* ==========================================================================
   8. CHECKLIST REGISTRY & SIDEBAR
   ========================================================================== */
function renderSidebar() {
  const listEl = document.getElementById("checklistItemsList");
  if (!listEl) return;

  listEl.innerHTML = "";

  const query = State.checklistSearchQuery.toLowerCase().trim();
  const checklistArray = Array.from(State.checklists.values()).filter(c => {
    if (!query) return true;
    return c.displayName.toLowerCase().includes(query) || c.filename.toLowerCase().includes(query);
  });

  const fragment = document.createDocumentFragment();

  checklistArray.forEach(checklist => {
    const li = document.createElement("li");
    li.setAttribute("role", "presentation");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `checklist-select-card ${checklist.filename === State.activeChecklistId ? "is-active" : ""}`;
    if (checklist.isFullyComplete) {
      btn.classList.add("is-complete");
    }
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", checklist.filename === State.activeChecklistId ? "true" : "false");
    btn.setAttribute("data-checklist-id", checklist.filename);

    const topLine = document.createElement("div");
    topLine.className = "card-top-line";

    const nameSpan = document.createElement("span");
    nameSpan.className = "card-checklist-name";
    nameSpan.title = checklist.displayName;
    nameSpan.textContent = checklist.displayName;

    const ratioSpan = document.createElement("span");
    ratioSpan.className = "card-ratio-badge";
    ratioSpan.textContent = `${checklist.completedCount}/${checklist.totalCount}`;

    topLine.appendChild(nameSpan);
    topLine.appendChild(ratioSpan);

    const progressBar = document.createElement("div");
    progressBar.className = "card-progress-bar";
    progressBar.setAttribute("aria-hidden", "true");

    const progressFill = document.createElement("div");
    progressFill.className = "card-progress-fill";
    progressFill.style.width = `${checklist.percent}%`;

    progressBar.appendChild(progressFill);

    btn.appendChild(topLine);
    btn.appendChild(progressBar);

    btn.addEventListener("click", () => {
      selectChecklist(checklist.filename);
      closeMobileDrawer();
    });

    li.appendChild(btn);
    fragment.appendChild(li);
  });

  listEl.appendChild(fragment);

  const mobileBadge = document.getElementById("mobileListCountBadge");
  if (mobileBadge) {
    mobileBadge.textContent = State.checklists.size;
  }
}

function updateSidebarItemProgress(checklist) {
  const btn = document.querySelector(`.checklist-select-card[data-checklist-id="${CSS.escape(checklist.filename)}"]`);
  if (!btn) return;

  const countEl = btn.querySelector(".card-ratio-badge");
  const fillEl = btn.querySelector(".card-progress-fill");

  if (countEl) countEl.textContent = `${checklist.completedCount}/${checklist.totalCount}`;
  if (fillEl) fillEl.style.width = `${checklist.percent}%`;

  btn.classList.toggle("is-complete", checklist.isFullyComplete);
}

function initializeActiveChecklist() {
  if (State.checklists.size === 0) {
    const titleEl = document.getElementById("activeChecklistTitle");
    const subEl = document.getElementById("activeChecklistDescription");
    const fileStamp = document.getElementById("activeFileIndicator");

    if (titleEl) titleEl.textContent = "No Checklist Selected";
    if (subEl) subEl.textContent = "Select or load a procedure from your catalog to begin execution.";
    if (fileStamp) fileStamp.textContent = "NO_CSV_LOADED";
    return;
  }

  let targetId = State.activeChecklistId;
  if (!targetId || !State.checklists.has(targetId)) {
    targetId = State.checklists.keys().next().value;
  }

  selectChecklist(targetId);
}

function selectChecklist(filename) {
  if (!State.checklists.has(filename)) return;

  State.activeChecklistId = filename;
  State.searchQuery = "";

  const searchInput = document.getElementById("taskSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  if (searchInput) searchInput.value = "";
  if (clearSearchBtn) clearSearchBtn.hidden = true;

  const buttons = document.querySelectorAll(".checklist-select-card");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-checklist-id") === filename;
    btn.classList.toggle("is-active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  renderActiveChecklistWorkspace();
}

/* ==========================================================================
   9. ACTIVE CHECKLIST RENDERING & TELEMETRY
   ========================================================================== */
function renderActiveChecklistWorkspace() {
  const checklist = State.checklists.get(State.activeChecklistId);
  if (!checklist) return;

  const titleEl = document.getElementById("activeChecklistTitle");
  const subEl = document.getElementById("activeChecklistDescription");
  const fileStamp = document.getElementById("activeFileIndicator");
  const statusBadge = document.getElementById("activeStatusBadge");

  if (titleEl) titleEl.textContent = checklist.displayName;
  if (subEl) subEl.textContent = `${checklist.totalCount} operational procedures loaded and ready for step-by-step verification.`;
  if (fileStamp) fileStamp.textContent = checklist.filename.toUpperCase();

  if (statusBadge) {
    if (checklist.isFullyComplete) {
      statusBadge.textContent = "Verified Complete";
      statusBadge.classList.add("is-done");
    } else {
      statusBadge.textContent = "Operational Protocol";
      statusBadge.classList.remove("is-done");
    }
  }

  updateProgressUI(checklist);
  renderTaskList();
}

function updateProgressUI(checklist) {
  const totalCountEl = document.getElementById("statTotalCount");
  const completedCountEl = document.getElementById("statCompletedCount");
  const remainingCountEl = document.getElementById("statRemainingCount");
  const percentValueEl = document.getElementById("statPercentValue");

  const progressTrack = document.getElementById("progressBarTrack");
  const progressFill = document.getElementById("progressBarFill");
  const completionBanner = document.getElementById("completionBanner");
  const statusBadge = document.getElementById("activeStatusBadge");

  const countAll = document.getElementById("filterCountAll");
  const countRemaining = document.getElementById("filterCountRemaining");
  const countCompleted = document.getElementById("filterCountCompleted");

  if (totalCountEl) totalCountEl.textContent = checklist.totalCount;
  if (completedCountEl) completedCountEl.textContent = checklist.completedCount;
  if (remainingCountEl) remainingCountEl.textContent = checklist.remainingCount;
  if (percentValueEl) percentValueEl.textContent = `${checklist.percent}%`;

  if (countAll) countAll.textContent = checklist.totalCount;
  if (countRemaining) countRemaining.textContent = checklist.remainingCount;
  if (countCompleted) countCompleted.textContent = checklist.completedCount;

  if (progressTrack) {
    progressTrack.setAttribute("aria-valuenow", checklist.percent);
  }
  if (progressFill) {
    progressFill.style.width = `${checklist.percent}%`;
    progressFill.classList.toggle("is-fully-complete", checklist.isFullyComplete);
  }

  if (completionBanner) {
    completionBanner.hidden = !checklist.isFullyComplete;
    completionBanner.classList.toggle("is-visible", checklist.isFullyComplete);
  }

  if (statusBadge) {
    if (checklist.isFullyComplete) {
      statusBadge.textContent = "Verified Complete";
      statusBadge.classList.add("is-done");
    } else {
      statusBadge.textContent = "Operational Protocol";
      statusBadge.classList.remove("is-done");
    }
  }
}

function renderTaskList() {
  const checklist = State.checklists.get(State.activeChecklistId);
  const container = document.getElementById("taskListContainer");
  const emptyState = document.getElementById("emptyTaskState");

  if (!checklist || !container) return;

  const q = State.searchQuery.toLowerCase().trim();

  const filteredTasks = checklist.tasks.filter(task => {
    if (State.activeFilter === "remaining" && task.completed) return false;
    if (State.activeFilter === "completed" && !task.completed) return false;

    if (q.length > 0) {
      return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
    }
    return true;
  });

  if (filteredTasks.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();
  filteredTasks.forEach(task => {
    const card = createTaskCardElement(task, checklist);
    fragment.appendChild(card);
  });
  container.appendChild(fragment);
}

function createTaskCardElement(task, checklist) {
  const card = document.createElement("div");
  card.className = `task-card ${task.completed ? "is-completed" : ""}`;
  card.setAttribute("role", "checkbox");
  card.setAttribute("aria-checked", task.completed ? "true" : "false");
  card.setAttribute("tabindex", "0");
  card.setAttribute("data-task-id", task.id);

  const statusLabel = task.completed ? "Done" : "Pending";

  const toggleHitbox = document.createElement("div");
  toggleHitbox.className = "task-toggle-hitbox";
  toggleHitbox.setAttribute("aria-hidden", "true");

  const neoCheckbox = document.createElement("div");
  neoCheckbox.className = "neo-checkbox";

  neoCheckbox.innerHTML = `
    <svg class="neo-check-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  toggleHitbox.appendChild(neoCheckbox);

  const copyContainer = document.createElement("div");
  copyContainer.className = "task-copy";

  const titleSpan = document.createElement("span");
  titleSpan.className = "task-main-title";
  titleSpan.textContent = task.title;
  copyContainer.appendChild(titleSpan);

  if (task.description) {
    const descP = document.createElement("p");
    descP.className = "task-main-desc";
    descP.textContent = task.description;
    copyContainer.appendChild(descP);
  }

  const flagSpan = document.createElement("span");
  flagSpan.className = "task-flag";
  flagSpan.setAttribute("aria-hidden", "true");
  flagSpan.textContent = statusLabel;

  card.appendChild(toggleHitbox);
  card.appendChild(copyContainer);
  card.appendChild(flagSpan);

  const toggleAction = () => {
    const wasCompleted = task.completed;
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    card.classList.toggle("is-completed", task.completed);
    card.setAttribute("aria-checked", task.completed ? "true" : "false");
    flagSpan.textContent = task.completed ? "Done" : "Pending";

    // Audio tactile feedback
    if (task.completed) {
      if (checklist.completedCount === checklist.totalCount) {
        playTactileFeedback("complete");
      } else {
        playTactileFeedback("tick");
      }
    } else {
      playTactileFeedback("untick");
    }

    if (State.activeFilter !== "all") {
      setTimeout(() => renderTaskList(), 140);
    }

    updateProgressUI(checklist);
    updateSidebarItemProgress(checklist);
    updateGlobalMetrics();
    saveChecklistProgress(checklist);
  };

  card.addEventListener("click", toggleAction);

  card.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter" || e.code === "Space") {
      e.preventDefault();
      toggleAction();
    }
  });

  return card;
}

/* ==========================================================================
   10. GLOBAL METRICS & AUDIT EXPORT
   ========================================================================== */
function updateGlobalMetrics() {
  const globalChecklistsEl = document.getElementById("globalChecklistCount");
  const globalTasksEl = document.getElementById("globalTaskCount");

  const totalChecklists = State.checklists.size;
  let totalTasks = 0;

  for (const checklist of State.checklists.values()) {
    totalTasks += checklist.totalCount;
  }

  if (globalChecklistsEl) globalChecklistsEl.textContent = totalChecklists;
  if (globalTasksEl) globalTasksEl.textContent = totalTasks.toLocaleString();

  const mobileBadge = document.getElementById("mobileListCountBadge");
  if (mobileBadge) mobileBadge.textContent = totalChecklists;
}

function exportAuditReport() {
  const checklist = State.checklists.get(State.activeChecklistId);
  if (!checklist) return;

  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const header = `CHECKPOINT OPERATIONAL AUDIT SIGN-OFF REPORT\nProtocol: ${checklist.displayName}\nGenerated: ${now.toUTCString()}\nVerification Rate: ${checklist.completedCount}/${checklist.totalCount} (${checklist.percent}%)\nStatus: ${checklist.isFullyComplete ? "VERIFIED & CERTIFIED" : "INCOMPLETE / IN PROGRESS"}\n=======================================================\n\n`;

  const rows = checklist.tasks.map((t, idx) => {
    const status = t.completed ? "[x] DONE" : "[ ] PENDING";
    const time = t.completedAt ? `(Signed: ${t.completedAt})` : "";
    const desc = t.description ? `\n    Details: ${t.description}` : "";
    return `${String(idx + 1).padStart(2, "0")}. ${status} ${t.title} ${time}${desc}`;
  }).join("\n\n");

  const auditReport = header + rows;

  const blob = new Blob([auditReport], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `audit_${checklist.filename.replace(/\.csv$/i, "")}_${timestamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showAutosaveToast("Audit Log Exported");
}

/* ==========================================================================
   11. RESET CONFIRMATION MODAL
   ========================================================================== */
function openResetModal() {
  const checklist = State.checklists.get(State.activeChecklistId);
  if (!checklist) return;

  const modal = document.getElementById("resetModal");
  const nameEl = document.getElementById("resetTargetChecklistName");

  if (nameEl) nameEl.textContent = `"${checklist.displayName}"`;
  if (modal) {
    State.lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-open");
    const confirmBtn = document.getElementById("confirmResetBtn");
    if (confirmBtn) confirmBtn.focus();
  }
}

function closeResetModal() {
  const modal = document.getElementById("resetModal");
  if (modal) {
    modal.hidden = true;
    modal.classList.remove("is-open");
    if (State.lastFocusedElement && typeof State.lastFocusedElement.focus === "function") {
      State.lastFocusedElement.focus();
    }
  }
}

function executeResetChecklist() {
  const checklist = State.checklists.get(State.activeChecklistId);
  if (!checklist) return;

  checklist.tasks.forEach(t => {
    t.completed = false;
    t.completedAt = null;
  });

  saveChecklistProgress(checklist);
  closeResetModal();

  updateProgressUI(checklist);
  updateSidebarItemProgress(checklist);
  updateGlobalMetrics();
  renderTaskList();

  playTactileFeedback("untick");
  showAutosaveToast("Procedure Reset");
}

/* ==========================================================================
   12. REPOSITORY CONFIGURATION MODAL
   ========================================================================== */
function openRepoModal() {
  const modal = document.getElementById("repoModal");
  const inputOwner = document.getElementById("inputOwner");
  const inputRepo = document.getElementById("inputRepo");
  const inputBranch = document.getElementById("inputBranch");
  const inputFolder = document.getElementById("inputFolder");

  if (inputOwner) inputOwner.value = State.owner || "";
  if (inputRepo) inputRepo.value = State.repo || "";
  if (inputBranch) inputBranch.value = State.branch || "main";
  if (inputFolder) inputFolder.value = APP_CONFIG.CHECKLISTS_PATH || "";

  if (modal) {
    State.lastFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.classList.add("is-open");
    if (inputOwner) inputOwner.focus();
  }
}

function closeRepoModal() {
  const modal = document.getElementById("repoModal");
  if (modal) {
    modal.hidden = true;
    modal.classList.remove("is-open");
    if (State.lastFocusedElement && typeof State.lastFocusedElement.focus === "function") {
      State.lastFocusedElement.focus();
    }
  }
}

function handleRepoFormSubmit(e) {
  e.preventDefault();
  const owner = document.getElementById("inputOwner").value.trim();
  const repo = document.getElementById("inputRepo").value.trim();
  const branch = document.getElementById("inputBranch").value.trim() || "main";
  const folder = document.getElementById("inputFolder").value.trim();

  if (!owner || !repo) return;

  State.owner = owner;
  State.repo = repo;
  State.branch = branch;
  APP_CONFIG.CHECKLISTS_PATH = folder;

  try {
    localStorage.setItem("checkpoint_repo_owner", owner);
    localStorage.setItem("checkpoint_repo_name", repo);
    localStorage.setItem("checkpoint_repo_branch", branch);
    localStorage.setItem("checkpoint_repo_folder", folder);
  } catch (err) {
    console.warn("Storage write failed:", err);
  }

  updateRepoTargetUI();
  closeRepoModal();

  discoverChecklists(true);
}

/* ==========================================================================
   13. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function openMobileDrawer() {
  const sidebar = document.getElementById("sidebarPanel");
  const overlay = document.getElementById("drawerOverlay");
  const trigger = document.getElementById("mobileDrawerBtn");

  if (sidebar) sidebar.classList.add("is-open");
  if (overlay) overlay.classList.add("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "true");
  document.body.classList.add("is-drawer-locked");
}

function closeMobileDrawer() {
  const sidebar = document.getElementById("sidebarPanel");
  const overlay = document.getElementById("drawerOverlay");
  const trigger = document.getElementById("mobileDrawerBtn");

  if (sidebar) sidebar.classList.remove("is-open");
  if (overlay) overlay.classList.remove("is-open");
  if (trigger) trigger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("is-drawer-locked");
}

/* ==========================================================================
   14. EVENT LISTENERS
   ========================================================================== */
function setupEventListeners() {
  // Mobile Drawer
  const mobileDrawerBtn = document.getElementById("mobileDrawerBtn");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");
  const drawerOverlay = document.getElementById("drawerOverlay");

  if (mobileDrawerBtn) mobileDrawerBtn.addEventListener("click", openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeMobileDrawer);

  // Audio Toggle
  const audioToggleBtn = document.getElementById("audioToggleBtn");
  const audioIconOn = document.getElementById("audioIconOn");
  const audioIconOff = document.getElementById("audioIconOff");

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener("click", () => {
      State.soundEnabled = !State.soundEnabled;
      audioToggleBtn.setAttribute("aria-pressed", State.soundEnabled ? "true" : "false");
      if (audioIconOn) audioIconOn.hidden = !State.soundEnabled;
      if (audioIconOff) audioIconOff.hidden = State.soundEnabled;
      showAutosaveToast(State.soundEnabled ? "Audio Enabled" : "Audio Muted");
    });
  }

  // Sidebar Checklist Filter
  const checklistFilterInput = document.getElementById("checklistFilterInput");
  const clearChecklistFilterBtn = document.getElementById("clearChecklistFilterBtn");

  if (checklistFilterInput) {
    checklistFilterInput.addEventListener("input", (e) => {
      State.checklistSearchQuery = e.target.value;
      if (clearChecklistFilterBtn) clearChecklistFilterBtn.hidden = e.target.value.length === 0;
      renderSidebar();
    });
  }

  if (clearChecklistFilterBtn && checklistFilterInput) {
    clearChecklistFilterBtn.addEventListener("click", () => {
      checklistFilterInput.value = "";
      clearChecklistFilterBtn.hidden = true;
      State.checklistSearchQuery = "";
      checklistFilterInput.focus();
      renderSidebar();
    });
  }

  // Segmented Tabs
  const segmentTabs = document.querySelectorAll(".segment-tab");
  segmentTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-filter");
      if (mode === State.activeFilter) return;

      State.activeFilter = mode;
      segmentTabs.forEach(b => {
        const isTarget = b === btn;
        b.classList.toggle("is-active", isTarget);
        b.setAttribute("aria-selected", isTarget ? "true" : "false");
      });

      renderTaskList();
    });
  });

  // Task Search
  const taskSearchInput = document.getElementById("taskSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const resetFiltersAction = document.getElementById("resetFiltersAction");

  let searchDebounce = null;
  if (taskSearchInput) {
    taskSearchInput.addEventListener("input", (e) => {
      const val = e.target.value;
      if (clearSearchBtn) clearSearchBtn.hidden = val.length === 0;

      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        State.searchQuery = val;
        renderTaskList();
      }, 70);
    });
  }

  if (clearSearchBtn && taskSearchInput) {
    clearSearchBtn.addEventListener("click", () => {
      taskSearchInput.value = "";
      clearSearchBtn.hidden = true;
      State.searchQuery = "";
      taskSearchInput.focus();
      renderTaskList();
    });
  }

  if (resetFiltersAction && taskSearchInput) {
    resetFiltersAction.addEventListener("click", () => {
      taskSearchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.hidden = true;
      State.searchQuery = "";

      State.activeFilter = "all";
      segmentTabs.forEach(b => {
        const isAll = b.getAttribute("data-filter") === "all";
        b.classList.toggle("is-active", isAll);
        b.setAttribute("aria-selected", isAll ? "true" : "false");
      });

      renderTaskList();
    });
  }

  // Reset Modal Triggers
  const resetBtn = document.getElementById("resetChecklistBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");
  const confirmResetBtn = document.getElementById("confirmResetBtn");
  const closeResetModalBtn = document.getElementById("closeResetModalBtn");
  const resetModal = document.getElementById("resetModal");

  if (resetBtn) resetBtn.addEventListener("click", openResetModal);
  if (cancelResetBtn) cancelResetBtn.addEventListener("click", closeResetModal);
  if (confirmResetBtn) confirmResetBtn.addEventListener("click", executeResetChecklist);
  if (closeResetModalBtn) closeResetModalBtn.addEventListener("click", closeResetModal);

  if (resetModal) {
    resetModal.addEventListener("click", (e) => {
      if (e.target === resetModal) closeResetModal();
    });
  }

  // Export Audit Report
  const exportAuditBtn = document.getElementById("exportAuditBtn");
  if (exportAuditBtn) {
    exportAuditBtn.addEventListener("click", exportAuditReport);
  }

  // Repo Configuration Modal Triggers
  const repoConfigTrigger = document.getElementById("repoConfigTrigger");
  const openConfigBtn = document.getElementById("openConfigBtn");
  const closeRepoModalBtn = document.getElementById("closeRepoModalBtn");
  const cancelRepoModalBtn = document.getElementById("cancelRepoModalBtn");
  const repoModal = document.getElementById("repoModal");
  const repoConfigForm = document.getElementById("repoConfigForm");

  if (repoConfigTrigger) repoConfigTrigger.addEventListener("click", openRepoModal);
  if (openConfigBtn) openConfigBtn.addEventListener("click", openRepoModal);
  if (closeRepoModalBtn) closeRepoModalBtn.addEventListener("click", closeRepoModal);
  if (cancelRepoModalBtn) cancelRepoModalBtn.addEventListener("click", closeRepoModal);
  if (repoConfigForm) repoConfigForm.addEventListener("submit", handleRepoFormSubmit);

  if (repoModal) {
    repoModal.addEventListener("click", (e) => {
      if (e.target === repoModal) closeRepoModal();
    });
  }

  // Manual Sync Button
  const syncRepoBtn = document.getElementById("syncRepoBtn");
  const syncIcon = document.getElementById("syncIcon");

  if (syncRepoBtn) {
    syncRepoBtn.addEventListener("click", async () => {
      if (State.isSyncing) return;
      State.isSyncing = true;
      if (syncIcon) syncIcon.classList.add("is-spinning");

      await discoverChecklists(true);

      setTimeout(() => {
        State.isSyncing = false;
        if (syncIcon) syncIcon.classList.remove("is-spinning");
      }, 400);
    });
  }

  // Local File Upload Tester (Immediate Reader)
  const handleLocalCsvFiles = (files) => {
    if (!files || files.length === 0) return;

    let filesRead = 0;
    const validFiles = Array.from(files).filter(f => f.name.toLowerCase().endsWith(".csv"));
    if (validFiles.length === 0) return;

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const checklist = new ChecklistModel(file.name, file.name, "#", file.size);
        checklist.tasks = parseChecklistCsv(event.target.result, file.name);
        checklist.isLoaded = true;
        restoreChecklistProgress(checklist);
        State.checklists.set(file.name, checklist);

        filesRead++;
        if (filesRead === validFiles.length) {
          const noChecklistsState = document.getElementById("noChecklistsState");
          if (noChecklistsState) noChecklistsState.hidden = true;
          updateGlobalMetrics();
          renderSidebar();
          selectChecklist(validFiles[0].name);
          showAutosaveToast(`${validFiles.length} Checklist${validFiles.length > 1 ? "s" : ""} Loaded`);
        }
      };
      reader.readAsText(file);
    });
  };

  const localCsvUpload = document.getElementById("localCsvUpload");
  if (localCsvUpload) {
    localCsvUpload.addEventListener("change", (e) => handleLocalCsvFiles(e.target.files));
  }

  const localCsvUploadFallback = document.getElementById("localCsvUploadFallback");
  if (localCsvUploadFallback) {
    localCsvUploadFallback.addEventListener("change", (e) => handleLocalCsvFiles(e.target.files));
  }

  // Global Keydown (Escape handler & Quick Search '/' shortcut)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeResetModal();
      closeRepoModal();
      closeMobileDrawer();
    } else if (e.key === "/" && document.activeElement !== taskSearchInput && document.activeElement !== checklistFilterInput) {
      if (taskSearchInput && !taskSearchInput.offsetParent) return;
      e.preventDefault();
      if (taskSearchInput) taskSearchInput.focus();
    }
  });

  // Background Auto-Refresh
  if (APP_CONFIG.AUTO_REFRESH_INTERVAL > 0) {
    setInterval(() => {
      discoverChecklists(false);
    }, APP_CONFIG.AUTO_REFRESH_INTERVAL);
  }
}

/* ==========================================================================
   15. INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  resolveRepositoryCoordinates();
  setupEventListeners();
  discoverChecklists(false);
});