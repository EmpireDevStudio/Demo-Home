"use strict";

/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  identity: {
    appId: "checkpoint-studio-v2",
    appName: "Checkpoint Studio",
    appTagline: "Operational Procedure & Data Architect for Checkpoint Pro",
    version: "2.5.0",
    environment: "production",
    canonicalUrl: "https://studio.checkpointpro.com",
    language: "en-US",
    locale: "en-US",
  },

  branding: {
    appEdition: "Pro Suite",
    headerEyebrow: "PROCEDURE DESIGNER",
    primaryAccent: "#2A2D27",
    sageAccent: "#3E5B42",
    terracottaAccent: "#963E35",
    ochreAccent: "#6E5614",
    fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  },

  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "onboarding",
    items: [
      { id: "navBuilder", label: "Builder", icon: "builder", route: "#builder", enabled: true, showInBottomBar: true },
      { id: "navBlueprints", label: "Blueprints", icon: "blueprints", route: "#blueprints", enabled: true, showInBottomBar: true },
      { id: "navBatch", label: "Batch Paste", icon: "batch", route: "#batch", enabled: true, showInBottomBar: true },
      { id: "navExport", label: "Export", icon: "export", route: "#export", enabled: true, showInBottomBar: true },
    ],
  },

  content: {
    headers: {
      defaultTitle: "Operational Procedure Architect",
      defaultSubtitle: "Author, inspect, and export RFC 4180 checklist spreadsheets with verified step sequences.",
    },
    emptyStates: {
      noStepsTitle: "No Steps Staged in Procedure",
      noStepsDescription: "Use the editor on the left or load a blueprint to populate this sequence.",
      noSearchResultsHeading: "No Matching Steps Found",
      noSearchResultsDescription: "Review your search keywords or clear the active filter to view all steps.",
    },
    notifications: {
      stepAdded: "Step committed to checklist sequence.",
      stepUpdated: "Verification parameters successfully updated.",
      stepDeleted: "Step removed from checklist sequence.",
      stepDuplicated: "Step duplicated and placed next in sequence.",
      draftRestored: "Restored active procedure draft.",
      exportSuccess: "CSV procedure file exported successfully.",
      clipboardSuccess: "CSV stream copied to system clipboard.",
      resetConfirmed: "Procedure workspace cleared and reset.",
    },
    actions: {
      back: "Home",
      addStep: "Add Step to Checklist",
      saveChanges: "Save Changes",
    }
  },

  support: {
    contactEmail: "ops@checkpointpro.com",
    documentationUrl: "https://docs.checkpointpro.com",
  },

  features: {
    enableHapticFeedback: true,
    enableSoundEffects: true,
    enableAutoSave: true,
    autoSaveIntervalMs: 3000,
  },

  endpoints: {
    storageKeys: {
      draftKey: "checkpoint_studio_draft_v2",
      soundPrefKey: "checkpoint_sound_pref",
    }
  }
});

/**
 * Standard Operational Blueprints
 */
const BLUEPRINTS = Object.freeze({
  closing: {
    title: "Hospitality Closing",
    filename: "closing.csv",
    includeHeader: false,
    steps: [
      { title: "close bar", desc: "verify locks on alcohol wells and secure back cages" },
      { title: "close fridge", desc: "confirm line coolers and walk-in doors are latched" },
      { title: "clean down", desc: "sanitize all surface prep stations and floor drains" }
    ]
  },
  kitchen_open: {
    title: "Kitchen Opening",
    filename: "kitchen_open.csv",
    includeHeader: true,
    steps: [
      { title: "Inspect refrigeration temps", desc: "Walk-in cooler must sit at or below 38°F (3.3°C). Record in HACCP log." },
      { title: "Sanitize prep workstations", desc: "Apply food-safe chlorine quat solution (200-400 ppm). Allow 60s contact time." },
      { title: "Power up exhaust ventilation", desc: "Engage primary grease hood fan and verify make-up airflow damper is open." },
      { title: "Pre-heat fryers and convection ovens", desc: "Set oven banks to 350°F. Confirm oil level sits above minimum fill line." },
      { title: "Handwash stations readiness", desc: "Verify hot water exceeds 100°F, antimicrobial soap is full, and towels are stocked." }
    ]
  },
  facility_safety: {
    title: "Facility Safety Protocol",
    filename: "facility_safety.csv",
    includeHeader: true,
    steps: [
      { title: "Emergency egress paths clear", desc: "Ensure all fire escape exits and hallways have zero storage obstructions." },
      { title: "Exit door panic hardware check", desc: "Push crash bar on each perimeter emergency door. Must swing open smoothly." },
      { title: "AED & First Aid inspection", desc: "Green status indicator active on AED. First aid cabinet seals intact." },
      { title: "Fire extinguisher gauge check", desc: "Needle in the green zone. Pin locked in place with intact plastic tamper tie." },
      { title: "Slip and trip hazard scan", desc: "Entryway rugs laid flat with rubber non-slip backing. Wet floor signage available." }
    ]
  },
  it_server_shutdown: {
    title: "IT Infrastructure Maintenance",
    filename: "server_maintenance.csv",
    includeHeader: true,
    steps: [
      { title: "Verify offsite backup completion", desc: "Confirm snapshot SHA-256 matches remote cloud storage target before proceeding." },
      { title: "Notify active operations channels", desc: "Broadcast 15-minute maintenance window alert on Slack/Teams ops room." },
      { title: "Graceful database cluster drain", desc: "Run drain command on replica nodes; verify in-flight transactions are committed." },
      { title: "Inspect UPS battery health", desc: "Check voltage level and verify zero battery alarm indicator warnings." }
    ]
  }
});

/**
 * Application State Container
 */
const StudioState = {
  procedureName: "Bar Closing Checklist",
  filename: "closing.csv",
  includeHeader: true,
  steps: [],
  soundEnabled: true,
  audioContext: null,
  activeFilterQuery: "",
  editingIndex: -1
};

/* ==========================================================================
   HAPTIC & AUDIO INTERACTION ENGINES
   ========================================================================== */

function triggerHapticPulse() {
  if (APP_CONFIG.features.enableHapticFeedback && typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(12);
    } catch (e) {
      // Graceful fallback on blocked permissions
    }
  }
}

function playTactileAudio(type = "tick") {
  if (!StudioState.soundEnabled || !APP_CONFIG.features.enableSoundEffects) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!StudioState.audioContext) {
      StudioState.audioContext = new AudioCtx();
    }
    if (StudioState.audioContext.state === "suspended") {
      StudioState.audioContext.resume();
    }

    const ctx = StudioState.audioContext;
    const now = ctx.currentTime;

    if (type === "tick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } else if (type === "success") {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.045);
        gain.gain.setValueAtTime(0, now + idx * 0.045);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.045 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.045 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.045);
        osc.stop(now + idx * 0.045 + 0.28);
      });
    } else if (type === "remove") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    }
  } catch (err) {
    // Non-fatal if audio context is blocked
  }
}

/* ==========================================================================
   RFC 4180 CSV SERIALIZER & PARSER
   ========================================================================== */

function escapeCsvCell(value) {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n") || stringValue.includes("\r")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function serializeStepsToCsv(includeHeader = StudioState.includeHeader) {
  const lines = [];
  if (includeHeader) {
    lines.push("Task,Description");
  }
  StudioState.steps.forEach(step => {
    const colA = escapeCsvCell(step.title.trim());
    const colB = escapeCsvCell(step.desc ? step.desc.trim() : "");
    lines.push(`${colA},${colB}`);
  });
  return lines.join("\r\n");
}

function parseRawCsv(rawText) {
  if (!rawText) return { steps: [], hasHeader: false };

  let cleanText = rawText;
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
          i++;
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

  if (rows.length === 0) return { steps: [], hasHeader: false };

  const firstRowA = (rows[0][0] || "").toLowerCase().trim();
  const firstRowB = (rows[0][1] || "").toLowerCase().trim();
  const headerKeywordsA = ["task", "task title", "title", "todo", "item", "action", "step", "name", "protocol"];
  const headerKeywordsB = ["description", "details", "desc", "instructions", "notes", "summary", "spec"];

  const hasHeader = headerKeywordsA.includes(firstRowA) || (headerKeywordsA.includes(firstRowA) && headerKeywordsB.includes(firstRowB));
  const parsedSteps = [];
  const startIdx = hasHeader ? 1 : 0;

  for (let r = startIdx; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;
    const title = row[0] ? row[0].trim() : "";
    const desc = row[1] ? row[1].trim() : "";
    if (title.length > 0) {
      parsedSteps.push({ title, desc });
    }
  }

  return { steps: parsedSteps, hasHeader };
}

/* ==========================================================================
   UI SYNCHRONIZATION & RENDERING
   ========================================================================== */

function updateHeaderTelemetry() {
  const stepCountEl = document.getElementById("telemetryStepCount");
  const filenameEl = document.getElementById("telemetryFilename");
  const badgeCountEl = document.getElementById("stepsCountBadge");

  const total = StudioState.steps.length;
  if (stepCountEl) stepCountEl.textContent = total;
  if (badgeCountEl) badgeCountEl.textContent = `${total} Step${total === 1 ? "" : "s"}`;
  if (filenameEl) filenameEl.textContent = StudioState.filename || "procedure.csv";
}

function renderStagedSteps() {
  const listEl = document.getElementById("stagedList");
  const emptyState = document.getElementById("emptyStepsPlaceholder");
  if (!listEl) return;

  const query = StudioState.activeFilterQuery.toLowerCase().trim();
  const filteredSteps = StudioState.steps
    .map((step, originalIndex) => ({ step, originalIndex }))
    .filter(({ step }) => {
      if (!query) return true;
      return step.title.toLowerCase().includes(query) || step.desc.toLowerCase().includes(query);
    });

  listEl.innerHTML = "";

  if (filteredSteps.length === 0) {
    if (emptyState) {
      emptyState.hidden = false;
      const titleEl = emptyState.querySelector(".empty-title");
      const descEl = emptyState.querySelector(".empty-desc");
      if (query) {
        if (titleEl) titleEl.textContent = APP_CONFIG.content.emptyStates.noSearchResultsHeading;
        if (descEl) descEl.textContent = APP_CONFIG.content.emptyStates.noSearchResultsDescription;
      } else {
        if (titleEl) titleEl.textContent = APP_CONFIG.content.emptyStates.noStepsTitle;
        if (descEl) descEl.textContent = APP_CONFIG.content.emptyStates.noStepsDescription;
      }
    }
    listEl.hidden = true;
  } else {
    if (emptyState) emptyState.hidden = true;
    listEl.hidden = false;

    const frag = document.createDocumentFragment();

    filteredSteps.forEach(({ step, originalIndex }) => {
      const row = document.createElement("div");
      row.className = "staged-row";
      if (StudioState.editingIndex === originalIndex) {
        row.classList.add("is-editing");
      }

      row.innerHTML = `
        <span class="staged-number">${originalIndex + 1}</span>
        <div class="staged-content">
          <div class="staged-title">${escapeHtml(step.title)}</div>
          ${step.desc ? `<div class="staged-desc">${escapeHtml(step.desc)}</div>` : ""}
        </div>
        <div class="staged-actions">
          <button type="button" class="icon-action-btn edit-step-btn interactive-tactile" title="Edit Step Parameters" data-idx="${originalIndex}" aria-label="Edit step ${originalIndex + 1}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button type="button" class="icon-action-btn move-up-btn interactive-tactile" title="Move Step Up" data-idx="${originalIndex}" ${originalIndex === 0 ? "disabled" : ""} aria-label="Move step ${originalIndex + 1} up">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button type="button" class="icon-action-btn move-down-btn interactive-tactile" title="Move Step Down" data-idx="${originalIndex}" ${originalIndex === StudioState.steps.length - 1 ? "disabled" : ""} aria-label="Move step ${originalIndex + 1} down">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <button type="button" class="icon-action-btn duplicate-step-btn interactive-tactile" title="Duplicate Step" data-idx="${originalIndex}" aria-label="Duplicate step ${originalIndex + 1}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button type="button" class="icon-action-btn danger delete-step-btn interactive-tactile" title="Remove Step" data-idx="${originalIndex}" aria-label="Remove step ${originalIndex + 1}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      frag.appendChild(row);
    });

    listEl.appendChild(frag);
  }

  updateHeaderTelemetry();
  updateRawCsvPreview();
  persistDraftSession();
}

function updateRawCsvPreview() {
  const codeEl = document.getElementById("rawCsvPreview");
  const sizeBadge = document.getElementById("csvSizeBadge");
  if (!codeEl) return;

  const raw = serializeStepsToCsv();
  codeEl.textContent = raw || "# Empty CSV Sequence";

  if (sizeBadge) {
    const bytes = new Blob([raw]).size;
    sizeBadge.textContent = `${bytes} bytes`;
  }
}

function updateSimulator(title, desc) {
  const simTitle = document.getElementById("simTitle");
  const simDesc = document.getElementById("simDesc");

  if (simTitle) {
    simTitle.textContent = title.trim() || "Step Title Preview";
  }
  if (simDesc) {
    if (desc.trim()) {
      simDesc.textContent = desc.trim();
      simDesc.hidden = false;
    } else {
      simDesc.textContent = "";
      simDesc.hidden = true;
    }
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function showToast(message) {
  const toast = document.getElementById("toastNotification");
  const msgEl = document.getElementById("toastMessage");
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.hidden = false;

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

function activateWorkspace() {
  const onboarding = document.getElementById("onboardingSection");
  const workspace = document.getElementById("workspaceSection");

  if (onboarding) onboarding.hidden = true;
  if (workspace) workspace.hidden = false;

  renderStagedSteps();
}

function resetForm() {
  const form = document.getElementById("stepForm");
  const editIndexInput = document.getElementById("editingIndex");
  const formHeading = document.getElementById("formHeading");
  const formModeBadge = document.getElementById("formModeBadge");
  const saveBtnText = document.getElementById("saveStepBtnText");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (form) form.reset();
  if (editIndexInput) editIndexInput.value = "-1";
  if (formHeading) formHeading.textContent = "Add Verification Step";
  if (formModeBadge) {
    formModeBadge.innerHTML = `<span class="status-dot"></span><span class="status-label">New Step</span>`;
  }
  if (saveBtnText) saveBtnText.textContent = APP_CONFIG.content.actions.addStep;
  if (cancelBtn) cancelBtn.hidden = true;

  StudioState.editingIndex = -1;
  updateSimulator("", "");
}

function startEditingStep(index) {
  const step = StudioState.steps[index];
  if (!step) return;

  StudioState.editingIndex = index;

  const titleInput = document.getElementById("stepTitleInput");
  const descInput = document.getElementById("stepDescInput");
  const editIndexInput = document.getElementById("editingIndex");
  const formHeading = document.getElementById("formHeading");
  const formModeBadge = document.getElementById("formModeBadge");
  const saveBtnText = document.getElementById("saveStepBtnText");
  const cancelBtn = document.getElementById("cancelEditBtn");

  if (titleInput) titleInput.value = step.title;
  if (descInput) descInput.value = step.desc;
  if (editIndexInput) editIndexInput.value = index;

  if (formHeading) formHeading.textContent = `Edit Step #${index + 1}`;
  if (formModeBadge) {
    formModeBadge.innerHTML = `<span class="status-dot"></span><span class="status-label">Editing Mode</span>`;
  }
  if (saveBtnText) saveBtnText.textContent = APP_CONFIG.content.actions.saveChanges;
  if (cancelBtn) cancelBtn.hidden = false;

  updateSimulator(step.title, step.desc);
  renderStagedSteps();

  if (titleInput) {
    titleInput.focus();
    titleInput.select();
  }
}

/* ==========================================================================
   STORAGE PERSISTENCE
   ========================================================================== */

function persistDraftSession() {
  if (!APP_CONFIG.features.enableAutoSave) return;
  try {
    const payload = {
      procedureName: StudioState.procedureName,
      filename: StudioState.filename,
      includeHeader: StudioState.includeHeader,
      steps: StudioState.steps
    };
    localStorage.setItem(APP_CONFIG.endpoints.storageKeys.draftKey, JSON.stringify(payload));
  } catch (e) {
    // Non-fatal if storage full or private mode restricts
  }
}

function restoreDraftSession() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.draftKey);
    if (!raw) return false;
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      StudioState.procedureName = parsed.procedureName || "Bar Closing Checklist";
      StudioState.filename = parsed.filename || "closing.csv";
      StudioState.includeHeader = parsed.includeHeader !== false;
      StudioState.steps = parsed.steps;

      const nameInput = document.getElementById("procedureNameInput");
      const filenameInput = document.getElementById("procedureFilenameInput");
      const headerToggle = document.getElementById("includeHeaderToggle");

      if (nameInput) nameInput.value = StudioState.procedureName;
      if (filenameInput) filenameInput.value = StudioState.filename;
      if (headerToggle) headerToggle.checked = StudioState.includeHeader;

      activateWorkspace();
      showToast(APP_CONFIG.content.notifications.draftRestored);
      return true;
    }
  } catch (e) {
    console.warn("Unable to restore local session draft:", e);
  }
  return false;
}

/* ==========================================================================
   HYDRATION & EVENT BINDINGS
   ========================================================================== */

function hydrateAppConfiguration() {
  // Title & Subtitles
  const pageEyebrowSlot = document.getElementById("pageEyebrowSlot");
  const appEditionSlot = document.getElementById("appEditionSlot");
  const pageTitleSlot = document.getElementById("pageTitleSlot");
  const pageSubtitleSlot = document.getElementById("pageSubtitleSlot");
  const backBtnLabel = document.getElementById("backBtnLabel");

  if (pageEyebrowSlot) pageEyebrowSlot.textContent = APP_CONFIG.branding.headerEyebrow;
  if (appEditionSlot) appEditionSlot.textContent = APP_CONFIG.branding.appEdition;
  if (pageTitleSlot) pageTitleSlot.textContent = APP_CONFIG.content.headers.defaultTitle;
  if (pageSubtitleSlot) pageSubtitleSlot.textContent = APP_CONFIG.content.headers.defaultSubtitle;
  if (backBtnLabel) backBtnLabel.textContent = APP_CONFIG.content.actions.back;

  // Hydrate Mobile Bottom Dock
  const dockContainer = document.getElementById("bottomDockNavItems");
  if (dockContainer) {
    dockContainer.innerHTML = APP_CONFIG.navigation.items
      .filter(item => item.enabled && item.showInBottomBar)
      .map((item, idx) => `
        <button type="button" class="nav-tab-item interactive-tactile ${idx === 0 ? "nav-tab-item--active" : ""}" data-route="${item.id}" aria-label="${item.label}">
          <span>${item.label}</span>
          ${idx === 0 ? '<span class="nav-tab-item__indicator" aria-hidden="true"></span>' : ""}
        </button>
      `).join("");
  }
}

function setupEventBindings() {
  // Global Haptic Interceptor
  document.addEventListener("click", (event) => {
    const target = event.target.closest(".interactive-tactile, .btn-paper-primary, .btn-paper-secondary, .nav-tab-item");
    if (target) {
      triggerHapticPulse();
    }
  });

  // Simulator Checkbox Toggle
  const simCard = document.getElementById("simulatedTaskCard");
  if (simCard) {
    simCard.addEventListener("click", () => {
      simCard.classList.toggle("is-done");
      const isDone = simCard.classList.contains("is-done");
      simCard.setAttribute("aria-checked", isDone ? "true" : "false");
      const flag = simCard.querySelector(".task-flag-sim");
      if (flag) flag.textContent = isDone ? "Done" : "Pending";
      playTactileAudio(isDone ? "success" : "tick");
    });

    simCard.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        simCard.click();
      }
    });
  }

  // Audio Mute Toggle
  const audioBtn = document.getElementById("audioToggleBtn");
  const iconOn = document.getElementById("audioIconOn");
  const iconOff = document.getElementById("audioIconOff");
  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      StudioState.soundEnabled = !StudioState.soundEnabled;
      if (iconOn) iconOn.hidden = !StudioState.soundEnabled;
      if (iconOff) iconOff.hidden = StudioState.soundEnabled;
      showToast(StudioState.soundEnabled ? "Audio chimes active" : "Audio muted");
    });
  }

  // Live Input Sync to Simulator
  const titleInput = document.getElementById("stepTitleInput");
  const descInput = document.getElementById("stepDescInput");
  if (titleInput && descInput) {
    const syncInputs = () => {
      updateSimulator(titleInput.value, descInput.value);
    };
    titleInput.addEventListener("input", syncInputs);
    descInput.addEventListener("input", syncInputs);
  }

  // Suggestion Verb Chips
  document.querySelectorAll(".verb-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const verb = chip.getAttribute("data-verb");
      if (titleInput) {
        if (!titleInput.value.trim()) {
          titleInput.value = `${verb} `;
        } else {
          titleInput.value = `${verb} ${titleInput.value.trim()}`;
        }
        titleInput.focus();
        updateSimulator(titleInput.value, descInput ? descInput.value : "");
        playTactileAudio("tick");
      }
    });
  });

  // Procedure Metadata Input Listeners
  const procedureNameInput = document.getElementById("procedureNameInput");
  const procedureFilenameInput = document.getElementById("procedureFilenameInput");

  if (procedureNameInput && procedureFilenameInput) {
    procedureNameInput.addEventListener("input", (e) => {
      StudioState.procedureName = e.target.value;
      const autoSlug = e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_");
      if (autoSlug) {
        StudioState.filename = `${autoSlug}.csv`;
        procedureFilenameInput.value = StudioState.filename;
      }
      updateHeaderTelemetry();
      persistDraftSession();
    });

    procedureFilenameInput.addEventListener("input", (e) => {
      let val = e.target.value.trim();
      if (!val.endsWith(".csv")) {
        val = val ? `${val}.csv` : "procedure.csv";
      }
      StudioState.filename = val;
      updateHeaderTelemetry();
      persistDraftSession();
    });
  }

  // Include Header Row Toggle
  const includeHeaderToggle = document.getElementById("includeHeaderToggle");
  if (includeHeaderToggle) {
    includeHeaderToggle.addEventListener("change", (e) => {
      StudioState.includeHeader = e.target.checked;
      updateRawCsvPreview();
      persistDraftSession();
      playTactileAudio("tick");
      showToast(StudioState.includeHeader ? "Header row enabled (Task,Description)" : "Header row stripped");
    });
  }

  // Step Form Submission
  const stepForm = document.getElementById("stepForm");
  if (stepForm) {
    stepForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = titleInput.value.trim();
      const desc = descInput.value.trim();

      if (!title) {
        titleInput.focus();
        return;
      }

      if (StudioState.editingIndex >= 0) {
        StudioState.steps[StudioState.editingIndex] = { title, desc };
        showToast(APP_CONFIG.content.notifications.stepUpdated);
      } else {
        StudioState.steps.push({ title, desc });
        showToast(APP_CONFIG.content.notifications.stepAdded);
      }

      playTactileAudio("tick");
      resetForm();
      renderStagedSteps();
      if (titleInput) titleInput.focus();
    });
  }

  // Cancel Editing
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      resetForm();
      renderStagedSteps();
    });
  }

  // Staged Item Action Delegation (Edit, Reorder, Duplicate, Delete)
  const stagedList = document.getElementById("stagedList");
  if (stagedList) {
    stagedList.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const idx = parseInt(btn.getAttribute("data-idx"), 10);
      if (isNaN(idx)) return;

      if (btn.classList.contains("edit-step-btn")) {
        startEditingStep(idx);
      } else if (btn.classList.contains("move-up-btn")) {
        if (idx > 0) {
          const temp = StudioState.steps[idx];
          StudioState.steps[idx] = StudioState.steps[idx - 1];
          StudioState.steps[idx - 1] = temp;
          playTactileAudio("tick");
          renderStagedSteps();
        }
      } else if (btn.classList.contains("move-down-btn")) {
        if (idx < StudioState.steps.length - 1) {
          const temp = StudioState.steps[idx];
          StudioState.steps[idx] = StudioState.steps[idx + 1];
          StudioState.steps[idx + 1] = temp;
          playTactileAudio("tick");
          renderStagedSteps();
        }
      } else if (btn.classList.contains("duplicate-step-btn")) {
        const item = StudioState.steps[idx];
        StudioState.steps.splice(idx + 1, 0, { title: `${item.title} (Copy)`, desc: item.desc });
        playTactileAudio("tick");
        showToast(APP_CONFIG.content.notifications.stepDuplicated);
        renderStagedSteps();
      } else if (btn.classList.contains("delete-step-btn")) {
        StudioState.steps.splice(idx, 1);
        if (StudioState.editingIndex === idx) {
          resetForm();
        }
        playTactileAudio("remove");
        showToast(APP_CONFIG.content.notifications.stepDeleted);
        renderStagedSteps();
      }
    });
  }

  // Filter Staged Steps
  const stepSearchInput = document.getElementById("stepSearchInput");
  if (stepSearchInput) {
    stepSearchInput.addEventListener("input", (e) => {
      StudioState.activeFilterQuery = e.target.value;
      renderStagedSteps();
    });
  }

  // Clear Sequence
  const clearAllBtn = document.getElementById("clearAllStepsBtn");
  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (StudioState.steps.length === 0) return;
      if (window.confirm("Clear all staged steps in this procedure?")) {
        StudioState.steps = [];
        resetForm();
        renderStagedSteps();
        playTactileAudio("remove");
        showToast("Procedure sequence cleared.");
      }
    });
  }

  // Global Back Navigation
  const globalBackBtn = document.getElementById("globalBackBtn");
  if (globalBackBtn) {
    globalBackBtn.addEventListener("click", () => {
      const onboarding = document.getElementById("onboardingSection");
      const workspace = document.getElementById("workspaceSection");

      if (workspace && !workspace.hidden) {
        workspace.hidden = true;
        if (onboarding) onboarding.hidden = false;
        playTactileAudio("tick");
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // Reset Session
  const newSessionBtn = document.getElementById("newSessionBtn");
  if (newSessionBtn) {
    newSessionBtn.addEventListener("click", () => {
      if (StudioState.steps.length > 0 && !window.confirm("Start fresh? Any unexported steps in this session will be cleared.")) {
        return;
      }
      StudioState.steps = [];
      StudioState.procedureName = "Operational Procedure";
      StudioState.filename = "procedure.csv";
      StudioState.includeHeader = true;
      localStorage.removeItem(APP_CONFIG.endpoints.storageKeys.draftKey);

      const onboarding = document.getElementById("onboardingSection");
      const workspace = document.getElementById("workspaceSection");
      if (onboarding) onboarding.hidden = false;
      if (workspace) workspace.hidden = true;
      resetForm();
      showToast(APP_CONFIG.content.notifications.resetConfirmed);
    });
  }

  // Start Blank Canvas
  const startBlankBtn = document.getElementById("startBlankBtn");
  if (startBlankBtn) {
    startBlankBtn.addEventListener("click", () => {
      StudioState.steps = [];
      activateWorkspace();
      playTactileAudio("tick");
      if (titleInput) titleInput.focus();
    });
  }

  // CSV File Ingestion (Append / Audit)
  const handleCsvFileUpload = (file, isAudit = false) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const parsed = parseRawCsv(text);

      if (parsed.steps.length === 0) {
        alert("No valid operational steps found in CSV. Verify Column A has valid task directives.");
        return;
      }

      StudioState.filename = file.name;
      StudioState.procedureName = file.name.replace(/\.csv$/i, "").replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      StudioState.includeHeader = parsed.hasHeader;

      if (isAudit) {
        StudioState.steps = parsed.steps;
      } else {
        StudioState.steps = StudioState.steps.concat(parsed.steps);
      }

      if (procedureNameInput) procedureNameInput.value = StudioState.procedureName;
      if (procedureFilenameInput) procedureFilenameInput.value = StudioState.filename;
      if (includeHeaderToggle) includeHeaderToggle.checked = StudioState.includeHeader;

      activateWorkspace();
      playTactileAudio("success");
      showToast(`Loaded ${parsed.steps.length} step${parsed.steps.length === 1 ? "" : "s"} from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const uploadInputAppend = document.getElementById("uploadCsvInputAppend");
  if (uploadInputAppend) {
    uploadInputAppend.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleCsvFileUpload(e.target.files[0], false);
      }
    });
  }

  const uploadInputAudit = document.getElementById("uploadCsvInputAudit");
  if (uploadInputAudit) {
    uploadInputAudit.addEventListener("change", (e) => {
      if (e.target.files && e.target.files[0]) {
        handleCsvFileUpload(e.target.files[0], true);
      }
    });
  }

  // Template Blueprint Modal
  const templateModal = document.getElementById("templateModal");
  const templatePickerBtn = document.getElementById("templatePickerBtn");
  const closeTemplateModalBtn = document.getElementById("closeTemplateModalBtn");
  const closeTemplateCancelBtn = document.getElementById("closeTemplateCancelBtn");

  const openTemplateModal = () => {
    if (templateModal) templateModal.hidden = false;
  };
  const closeTemplateModal = () => {
    if (templateModal) templateModal.hidden = true;
  };

  if (templatePickerBtn) templatePickerBtn.addEventListener("click", openTemplateModal);
  if (closeTemplateModalBtn) closeTemplateModalBtn.addEventListener("click", closeTemplateModal);
  if (closeTemplateCancelBtn) closeTemplateCancelBtn.addEventListener("click", closeTemplateModal);

  document.querySelectorAll(".template-pick-card").forEach(card => {
    const handleTemplateSelection = () => {
      const key = card.getAttribute("data-template-key");
      const blueprint = BLUEPRINTS[key];
      if (!blueprint) return;

      StudioState.procedureName = blueprint.title;
      StudioState.filename = blueprint.filename;
      StudioState.includeHeader = blueprint.includeHeader;
      StudioState.steps = JSON.parse(JSON.stringify(blueprint.steps));

      if (procedureNameInput) procedureNameInput.value = blueprint.title;
      if (procedureFilenameInput) procedureFilenameInput.value = blueprint.filename;
      if (includeHeaderToggle) includeHeaderToggle.checked = blueprint.includeHeader;

      closeTemplateModal();
      activateWorkspace();
      playTactileAudio("success");
      showToast(`Loaded "${blueprint.title}" Blueprint`);
    };

    card.addEventListener("click", handleTemplateSelection);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTemplateSelection();
      }
    });
  });

  // Batch Paste Modal
  const batchModal = document.getElementById("batchModal");
  const openBatchModalBtn = document.getElementById("openBatchModalBtn");
  const closeBatchModalBtn = document.getElementById("closeBatchModalBtn");
  const cancelBatchBtn = document.getElementById("cancelBatchBtn");
  const confirmBatchBtn = document.getElementById("confirmBatchBtn");
  const batchInput = document.getElementById("batchInput");

  const openBatchModal = () => {
    if (batchModal) batchModal.hidden = false;
    if (batchInput) {
      batchInput.value = "";
      batchInput.focus();
    }
  };
  const closeBatchModal = () => {
    if (batchModal) batchModal.hidden = true;
  };

  if (openBatchModalBtn) openBatchModalBtn.addEventListener("click", openBatchModal);
  if (closeBatchModalBtn) closeBatchModalBtn.addEventListener("click", closeBatchModal);
  if (cancelBatchBtn) cancelBatchBtn.addEventListener("click", closeBatchModal);

  if (confirmBatchBtn && batchInput) {
    confirmBatchBtn.addEventListener("click", () => {
      const text = batchInput.value.trim();
      if (!text) {
        closeBatchModal();
        return;
      }

      const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
      let count = 0;

      lines.forEach(line => {
        let title = "";
        let desc = "";

        if (line.includes("\t")) {
          const parts = line.split("\t");
          title = parts[0].trim();
          desc = parts.slice(1).join(" ").trim();
        } else if (line.includes(",")) {
          const parts = line.split(",");
          title = parts[0].trim();
          desc = parts.slice(1).join(",").trim();
        } else {
          title = line.replace(/^[\s*•\-#\d.)]+/, "").trim();
        }

        if (title) {
          StudioState.steps.push({ title, desc });
          count++;
        }
      });

      closeBatchModal();
      activateWorkspace();
      renderStagedSteps();
      playTactileAudio("success");
      showToast(`Imported ${count} operational steps.`);
    });
  }

  // Export Workflow Modal
  const exportModal = document.getElementById("exportModal");
  const exportLaunchBtn = document.getElementById("exportLaunchBtn");
  const closeExportModalBtn = document.getElementById("closeExportModalBtn");
  const downloadFullCsvBtn = document.getElementById("downloadFullCsvBtn");
  const copyCsvClipboardBtn = document.getElementById("copyCsvClipboardBtn");
  const copyRawCsvBtn = document.getElementById("copyRawCsvBtn");

  const openExportModal = () => {
    if (StudioState.steps.length === 0) {
      alert("Please stage at least one operational step before exporting.");
      return;
    }

    const targetEl = document.getElementById("exportTargetFilename");
    const countEl = document.getElementById("exportTotalCount");
    const dlBtnName = document.getElementById("downloadBtnFilename");

    if (targetEl) targetEl.textContent = StudioState.filename;
    if (countEl) countEl.textContent = StudioState.steps.length;
    if (dlBtnName) dlBtnName.textContent = StudioState.filename;

    if (exportModal) exportModal.hidden = false;
  };
  const closeExportModal = () => {
    if (exportModal) exportModal.hidden = true;
  };

  if (exportLaunchBtn) exportLaunchBtn.addEventListener("click", openExportModal);
  if (closeExportModalBtn) closeExportModalBtn.addEventListener("click", closeExportModal);

  if (downloadFullCsvBtn) {
    downloadFullCsvBtn.addEventListener("click", () => {
      const csvText = serializeStepsToCsv();
      const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = StudioState.filename || "checklist.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      playTactileAudio("success");
      showToast(APP_CONFIG.content.notifications.exportSuccess);
      closeExportModal();
    });
  }

  const copyCsvAction = () => {
    const csvText = serializeStepsToCsv();
    navigator.clipboard.writeText(csvText).then(() => {
      playTactileAudio("tick");
      showToast(APP_CONFIG.content.notifications.clipboardSuccess);
      closeExportModal();
    }).catch(() => {
      alert("Clipboard access was restricted by the browser.");
    });
  };

  if (copyCsvClipboardBtn) copyCsvClipboardBtn.addEventListener("click", copyCsvAction);
  if (copyRawCsvBtn) copyRawCsvBtn.addEventListener("click", copyCsvAction);

  // Bottom Thumb Dock Routing Interceptor
  const dock = document.getElementById("bottomDockNavItems");
  if (dock) {
    dock.addEventListener("click", (e) => {
      const tab = e.target.closest(".nav-tab-item");
      if (!tab) return;
      const route = tab.getAttribute("data-route");

      dock.querySelectorAll(".nav-tab-item").forEach(t => t.classList.remove("nav-tab-item--active"));
      tab.classList.add("nav-tab-item--active");

      if (route === "navBuilder") {
        activateWorkspace();
      } else if (route === "navBlueprints") {
        openTemplateModal();
      } else if (route === "navBatch") {
        openBatchModal();
      } else if (route === "navExport") {
        openExportModal();
      }
    });
  }

  // Keyboard Shortcuts (Escape to dismiss overlays)
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeTemplateModal();
      closeBatchModal();
      closeExportModal();
    }
  });
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  hydrateAppConfiguration();
  setupEventBindings();
  const restored = restoreDraftSession();
  if (!restored) {
    updateHeaderTelemetry();
  }
});