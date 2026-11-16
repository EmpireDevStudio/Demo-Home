/**
 * ONGOING TRAINING HUB: LEFT-STAGE LUSCIOUS ROSE-GOLD TREE & EDITORIAL ENGINE
 * Studio: Empire Dev Studio
 */

/* ==========================================================================
   1. STAGE & TREE FINE-TUNING CONFIG (EDIT THESE VALUES TO ADJUST LAYOUT/GLOW)
   ========================================================================== */
const STAGE_TUNING = {
  // Left tree column width as a percentage of screen width (30 = 30% tree / 70% content)
  desktopTreeWidthPercent: 30,
  tabletTreeWidthPercent: 30,
  mobileTreeWidthPercent: 27,

  // Breakpoint thresholds (px)
  tabletMaxWidthPx: 1023,
  mobileMaxWidthPx: 720,
  // Set > 0 (e.g. 340) to stack top/bottom on tiny screens; 0 keeps left/right always
  stackBelowPx: 0,

  // How much of the tree is visible inside the left column (65 = ~65% visible, ~35% off-screen left)
  visibleTreePercent: 65,
  // Fine position nudges inside the 3D scene
  cameraOffsetXAdjust: 0.0,
  treeOffsetY: -1.9,
  treeScale: 1.02,

  // Camera framing & scroll zoom limits
  cameraFovDesktop: 40,
  cameraFovMobile: 44,
  cameraMinZ: 6.9,
  cameraMaxZ: 14.5,
  cameraLookAtYStart: 0.25,
  cameraLookAtYEnd: 1.15,

  // SVG Fallback horizontal crop when WebGL is unavailable
  svgShiftLeftPercent: -22,
  svgScale: 1.24,

  // Smoother growth & bloom glow settings
  initialGrowthFloor: 0.14,
  scrollSmoothing: 0.065,
  glowStartProgress: 0.78,
  glowMaxIntensity: 1.0,
  maxParticlesDesktop: 42,
  maxParticlesMobile: 16
};

/* ==========================================================================
   2. PRODUCT & CONTACT CONFIGURATION
   ========================================================================== */
const CONFIG = {
  contact: {
    email: 'empiredevstudio@gmail.com',
    subject: "I'm interested in the Ongoing Training Hub",
    body: [
      'Hi Empire Dev Studio,',
      '',
      "I've explored the Ongoing Training Hub and would love to register my interest and discuss how it could work for our business.",
      '',
      'Looking forward to growing something better!'
    ].join('\n')
  },
  threeCdnUrl: 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js',
  treeSeed: 1847,
  audio: {
    masterVolume: 0.04,
    fadeDuration: 1.0
  }
};

const HUB_RESOURCES = {
  library: {
    kicker: 'Resource 01: Clear Reference',
    title: 'Training Library',
    desc: 'A central place for key training documents, product guides, and reference sheets that stay current and easy to browse.',
    benefit: 'Employees find clear answers on their own without pulling a manager off the floor.',
    svg: `
      <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
        <rect x="12" y="18" width="44" height="48" rx="3" fill="#F0E9DD" stroke="#C9977F" stroke-width="1.2"/>
        <rect x="22" y="12" width="44" height="48" rx="3" fill="#FCFAF6" stroke="#96614E" stroke-width="1.4"/>
        <line x1="30" y1="26" x2="54" y2="26" stroke="#96614E" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="30" y1="36" x2="56" y2="36" stroke="#C9977F" stroke-width="1.3" stroke-linecap="round"/>
        <line x1="30" y1="45" x2="48" y2="45" stroke="#D9BD98" stroke-width="1.3" stroke-linecap="round"/>
      </svg>`
  },
  videos: {
    kicker: 'Resource 02: Visual Demonstrations',
    title: 'Training Videos',
    desc: 'Short, focused video clips that show how tasks should be done. Helpful for steps that are easier to see than to read.',
    benefit: 'Staff can watch a quick refresher anytime they need one.',
    svg: `
      <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
        <rect x="10" y="18" width="60" height="44" rx="4" fill="#FCFAF6" stroke="#96614E" stroke-width="1.4"/>
        <circle cx="40" cy="40" r="13" fill="#F0E9DD" stroke="#AD745E" stroke-width="1.2"/>
        <path d="M37 34L47 40L37 46V34Z" fill="#96614E"/>
      </svg>`
  },
  games: {
    kicker: 'Resource 03: Ongoing Learning Habit',
    title: 'Daily Knowledge Games',
    desc: 'Daily puzzles and short knowledge checks give staff a fun reason to come back each day and build a stronger learning habit.',
    benefit: 'Keeps product and workplace knowledge fresh long after initial training.',
    svg: `
      <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
        <rect x="14" y="16" width="24" height="24" rx="3" fill="#FCFAF6" stroke="#96614E" stroke-width="1.3"/>
        <rect x="42" y="16" width="24" height="24" rx="3" fill="#E5C2AE" fill-opacity="0.45" stroke="#AD745E" stroke-width="1.3"/>
        <rect x="14" y="44" width="24" height="24" rx="3" fill="#F0E9DD" stroke="#C9977F" stroke-width="1.3"/>
        <circle cx="54" cy="56" r="11" fill="#FCFAF6" stroke="#87927A" stroke-width="1.4"/>
        <path d="M49 56L52.5 59.5L59 52.5" stroke="#87927A" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`
  },
  checklists: {
    kicker: 'Resource 04: Clear Routines',
    title: 'Checklists',
    desc: 'Ordered task lists guide employees through opening, service, cleaning, and closing steps without guesswork.',
    benefit: 'Reduces confusion and helps stop important steps from being missed.',
    svg: `
      <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
        <rect x="16" y="12" width="48" height="56" rx="3" fill="#FCFAF6" stroke="#96614E" stroke-width="1.4"/>
        <path d="M25 28L28 31L34 25" stroke="#87927A" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="40" y1="28" x2="56" y2="28" stroke="#96614E" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M25 42L28 45L34 39" stroke="#87927A" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="40" y1="42" x2="54" y2="42" stroke="#C9977F" stroke-width="1.5" stroke-linecap="round"/>
        <rect x="25" y="53" width="8" height="8" rx="1.5" stroke="#C9977F" stroke-width="1.2"/>
        <line x1="40" y1="57" x2="52" y2="57" stroke="#D9BD98" stroke-width="1.5" stroke-linecap="round"/>
      </svg>`
  },
  sops: {
    kicker: 'Resource 05: Consistent Standards',
    title: 'Standard Operating Procedures',
    desc: 'Step-by-step procedures show how work should be done across every shift and every team member.',
    benefit: 'Supports consistent work and gives everyone the same clear standard.',
    svg: `
      <svg viewBox="0 0 80 80" width="56" height="56" fill="none">
        <circle cx="24" cy="24" r="8" fill="#E5C2AE" fill-opacity="0.45" stroke="#96614E" stroke-width="1.3"/>
        <line x1="24" y1="32" x2="24" y2="48" stroke="#C9977F" stroke-width="1.3" stroke-dasharray="2.5 2.5"/>
        <circle cx="24" cy="56" r="8" fill="#FCFAF6" stroke="#AD745E" stroke-width="1.3"/>
        <rect x="42" y="30" width="26" height="20" rx="2" fill="#FCFAF6" stroke="#96614E" stroke-width="1.3"/>
        <line x1="32" y1="24" x2="55" y2="24" stroke="#C9977F" stroke-width="1.2"/>
        <line x1="55" y1="24" x2="55" y2="30" stroke="#C9977F" stroke-width="1.2"/>
      </svg>`
  }
};

const INDUSTRY_DATA = {
  default: {
    tabId: 'tab-default',
    kicker: 'Everyday Workplace Example',
    title: 'Default: Everyday Workplace Training',
    scenario: 'A new employee needs to understand a workplace procedure.',
    resources: 'Training documents, videos, checklists, and standard operating procedures.',
    benefit: 'Easier access to consistent knowledge and less repetitive explaining.'
  },
  hospitality: {
    tabId: 'tab-hospitality',
    kicker: 'Food, Beverage, and Guest Service',
    title: 'Hospitality: Service and Bar Teams',
    scenario: 'A bartender needs to double-check a cocktail recipe during service.',
    resources: 'Cocktail training, product guides, video demonstrations, and checklists.',
    benefit: 'Greater confidence and more consistent service on every shift.'
  },
  sales: {
    tabId: 'tab-sales',
    kicker: 'Customer Advice and Product Knowledge',
    title: 'Sales: Product and Advisory Teams',
    scenario: 'A sales assistant needs to compare product features before helping a customer.',
    resources: 'Product guides, sales training, demonstrations, and service notes.',
    benefit: 'More consistent product knowledge and clearer recommendations.'
  },
  carMechanics: {
    tabId: 'tab-car-mechanics',
    kicker: 'Workshop Routines and Safety',
    title: 'Car Mechanics: Workshop Teams',
    scenario: 'A newer technician needs to follow a workshop procedure.',
    resources: 'Technical training notes, instructional videos, workplace steps, and checklists.',
    benefit: 'Clearer routines and greater confidence in the bay.'
  },
  iceCream: {
    tabId: 'tab-ice-cream',
    kicker: 'Counter Service and Closing Duties',
    title: 'Ice Cream Store: Front-of-House Staff',
    scenario: 'A new employee reaches closing time and needs to finish all end-of-day tasks.',
    resources: 'Flavour guides, serving standards, cleaning checklists, and closing procedures.',
    benefit: 'More consistent standards and fewer missed tasks.'
  },
  clothing: {
    tabId: 'tab-clothing',
    kicker: 'Floor Support and Stock Care',
    title: 'Clothing Store: Floor and Stock Teams',
    scenario: 'An employee needs to check product details before advising a shopper.',
    resources: 'Product guides, sizing charts, customer service notes, and stock procedures.',
    benefit: 'More confident advice and a consistent customer experience.'
  }
};

/* ==========================================================================
   3. GLOBAL STATE & TUNING APPLICATOR
   ========================================================================== */
const state = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.innerWidth <= STAGE_TUNING.mobileMaxWidthPx,
  isTablet: window.innerWidth <= STAGE_TUNING.tabletMaxWidthPx,
  targetScrollProgress: 0,
  smoothScrollProgress: 0,
  pointerX: 0,
  pointerY: 0,
  isPageVisible: !document.hidden,
  audioEnabled: false
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

function applyStageTuningToCss() {
  const w = window.innerWidth;
  state.isMobile = w <= STAGE_TUNING.mobileMaxWidthPx;
  state.isTablet = w <= STAGE_TUNING.tabletMaxWidthPx;

  let colPct = STAGE_TUNING.desktopTreeWidthPercent;
  if (state.isMobile) colPct = STAGE_TUNING.mobileTreeWidthPercent;
  else if (state.isTablet) colPct = STAGE_TUNING.tabletTreeWidthPercent;

  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--tree-col-width', `${colPct}vw`);
  rootStyle.setProperty('--svg-shift-x', `${STAGE_TUNING.svgShiftLeftPercent}%`);
  rootStyle.setProperty('--svg-scale', `${STAGE_TUNING.svgScale}`);

  const shouldStack = STAGE_TUNING.stackBelowPx > 0 && w <= STAGE_TUNING.stackBelowPx;
  document.body.classList.toggle('is-stacked-mode', shouldStack);
}

function createSeededRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ==========================================================================
   4. CONTACT, NAVIGATION & UI CONTROLS
   ========================================================================== */
function initContactCta() {
  const cta = document.getElementById('contact-cta');
  if (!cta) return;
  const { email, subject, body } = CONFIG.contact;
  cta.setAttribute(
    'href',
    `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  );
}

function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const setMenuOpen = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenu.hidden = !open;
  };

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    mobileLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  if ('IntersectionObserver' in window && navLinks.length) {
    const sections = ['comparison', 'hub', 'staff', 'industries', 'closing']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === entry.target.id);
          });
        });
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0.01 }
    );
    sections.forEach((sec) => observer.observe(sec));
  }
}

function initComparisonToggle() {
  const tabBefore = document.getElementById('comp-tab-before');
  const tabAfter = document.getElementById('comp-tab-after');
  const cardBefore = document.getElementById('comp-view-before');
  const cardAfter = document.getElementById('comp-view-after');
  if (!tabBefore || !tabAfter || !cardBefore || !cardAfter) return;

  const setView = (mode, sound = false) => {
    const showAfter = mode === 'after';
    tabBefore.classList.toggle('is-active', !showAfter);
    tabAfter.classList.toggle('is-active', showAfter);
    tabBefore.setAttribute('aria-selected', String(!showAfter));
    tabAfter.setAttribute('aria-selected', String(showAfter));
    cardBefore.classList.toggle('is-hidden-mobile', showAfter);
    cardAfter.classList.toggle('is-hidden-mobile', !showAfter);
    if (sound) playGentleChime(showAfter ? 523.25 : 392.0);
  };

  tabBefore.addEventListener('click', () => setView('before', true));
  tabAfter.addEventListener('click', () => setView('after', true));
  setView('before', false);
}

function initHubExplorer() {
  const pills = Array.from(document.querySelectorAll('.hub-pill'));
  const detail = document.getElementById('hub-detail');
  const iconEl = document.getElementById('hub-detail-icon');
  const kickerEl = document.getElementById('hub-detail-kicker');
  const titleEl = document.getElementById('hub-detail-title');
  const descEl = document.getElementById('hub-detail-desc');
  const benefitEl = document.getElementById('hub-detail-benefit');
  if (!pills.length || !detail) return;

  let timer = null;

  const selectResource = (key, sound = false) => {
    const data = HUB_RESOURCES[key];
    if (!data) return;

    pills.forEach((pill) => {
      const active = pill.dataset.resource === key;
      pill.classList.toggle('is-selected', active);
      pill.setAttribute('aria-selected', String(active));
    });

    const apply = () => {
      if (iconEl) iconEl.innerHTML = data.svg;
      if (kickerEl) kickerEl.textContent = data.kicker;
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (benefitEl) benefitEl.innerHTML = `<strong>Staff benefit:</strong> ${data.benefit}`;
      detail.classList.remove('is-updating');
    };

    if (state.reducedMotion) {
      apply();
    } else {
      window.clearTimeout(timer);
      detail.classList.add('is-updating');
      timer = window.setTimeout(apply, 110);
    }

    if (sound) playGentleChime(493.88);
  };

  pills.forEach((pill) => {
    pill.addEventListener('click', () => selectResource(pill.dataset.resource, true));
  });
}

function initIndustrySelector() {
  const tabs = Array.from(document.querySelectorAll('.industry-tab'));
  const panel = document.getElementById('industry-panel');
  const kickerEl = document.getElementById('industry-kicker');
  const titleEl = document.getElementById('industry-title');
  const scenarioEl = document.getElementById('industry-scenario');
  const resourcesEl = document.getElementById('industry-resources');
  const benefitEl = document.getElementById('industry-benefit');
  if (!tabs.length || !panel) return;

  let timer = null;

  const selectIndustry = (key, sound = false) => {
    const data = INDUSTRY_DATA[key];
    if (!data) return;

    tabs.forEach((tab) => {
      const selected = tab.dataset.industry === key;
      tab.classList.toggle('is-selected', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    panel.setAttribute('aria-labelledby', data.tabId);

    const apply = () => {
      if (kickerEl) kickerEl.textContent = data.kicker;
      if (titleEl) titleEl.textContent = data.title;
      if (scenarioEl) scenarioEl.textContent = data.scenario;
      if (resourcesEl) resourcesEl.textContent = data.resources;
      if (benefitEl) benefitEl.textContent = data.benefit;
      panel.classList.remove('is-updating');
    };

    if (state.reducedMotion) {
      apply();
    } else {
      window.clearTimeout(timer);
      panel.classList.add('is-updating');
      timer = window.setTimeout(apply, 110);
    }

    if (sound) playGentleChime(587.33);
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectIndustry(tab.dataset.industry, true));
    tab.addEventListener('keydown', (event) => {
      let next = null;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (next !== null) {
        event.preventDefault();
        tabs[next].focus();
        selectIndustry(tabs[next].dataset.industry, true);
      }
    });
  });

  selectIndustry('default', false);
}

/* ==========================================================================
   5. OPTIONAL WEB AUDIO AMBIENCE (DEFAULT: OFF)
   ========================================================================== */
let audioCtx = null;
let masterGain = null;

function initAudioControls() {
  const toggleBtn = document.getElementById('sound-toggle');
  const labelEl = toggleBtn ? toggleBtn.querySelector('.sound-label') : null;
  if (!toggleBtn) return;

  const startAmbience = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return false;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480, audioCtx.currentTime);
      masterGain.connect(filter);
      filter.connect(audioCtx.destination);

      [146.83, 220.0, 369.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = idx === 2 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(idx === 2 ? 0.18 : 0.4, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
      });
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.exponentialRampToValueAtTime(CONFIG.audio.masterVolume, now + CONFIG.audio.fadeDuration);
    return true;
  };

  const stopAmbience = () => {
    if (!audioCtx || !masterGain) return;
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    window.setTimeout(() => {
      if (!state.audioEnabled && audioCtx && audioCtx.state === 'running') audioCtx.suspend();
    }, 450);
  };

  toggleBtn.addEventListener('click', () => {
    if (!state.audioEnabled) {
      if (!startAmbience()) return;
      state.audioEnabled = true;
      toggleBtn.setAttribute('aria-pressed', 'true');
      if (labelEl) labelEl.textContent = 'Sound On';
      playGentleChime(440);
    } else {
      state.audioEnabled = false;
      toggleBtn.setAttribute('aria-pressed', 'false');
      if (labelEl) labelEl.textContent = 'Sound Off';
      stopAmbience();
    }
  });
}

function playGentleChime(freq = 523.25) {
  if (!state.audioEnabled || !audioCtx || audioCtx.state !== 'running') return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.022, now + 0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.9);
}

/* ==========================================================================
   6. SVG FALLBACK TREE CONTROLLER
   ========================================================================== */
const fallbackController = {
  paths: [],
  blooms: [],
  init() {
    const svg = document.getElementById('tree-fallback-svg');
    if (!svg) return;

    this.paths = Array.from(svg.querySelectorAll('.svg-grow-path')).map((path) => {
      const length = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 200;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      return {
        el: path,
        length,
        start: Number(path.dataset.start || 0),
        end: Number(path.dataset.end || 1)
      };
    });

    this.blooms = Array.from(svg.querySelectorAll('.svg-bloom-node')).map((node) => ({
      el: node,
      start: Number(node.dataset.start || 0.5),
      end: Number(node.dataset.end || 1)
    }));
  },
  update(progress) {
    this.paths.forEach((item) => {
      const local = smoothstep(item.start, item.end, progress);
      item.el.style.strokeDashoffset = `${item.length * (1 - local)}`;
      item.el.style.opacity = local > 0.01 ? '1' : '0';
    });
    this.blooms.forEach((item) => {
      item.el.style.opacity = `${smoothstep(item.start, item.end, progress)}`;
    });
  }
};

/* ==========================================================================
   7. THREE.JS LUSCIOUS TEXTURED TREE WITH RADIATING GOLD BLOOM GLOW
   ========================================================================== */
async function initThreeTree() {
  const treeStage = document.getElementById('tree-stage');
  const canvas = document.getElementById('tree-canvas');
  if (!treeStage || !canvas) return null;

  const activateFallback = () => {
    treeStage.classList.add('is-fallback');
    fallbackController.init();
    fallbackController.update(state.smoothScrollProgress);
    return null;
  };

  let testContext = null;
  try {
    testContext = canvas.getContext('webgl2') || canvas.getContext('webgl');
  } catch (err) {
    return activateFallback();
  }
  if (!testContext) return activateFallback();

  let THREE;
  try {
    THREE = await import(CONFIG.threeCdnUrl);
  } catch (err) {
    return activateFallback();
  }

  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !state.isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(STAGE_TUNING.cameraFovDesktop, 0.5, 0.1, 60);

    // Procedural Seamless Bark Grain & Roughness Texture (zero external image files)
    const rng = createSeededRng(CONFIG.treeSeed);
    const barkCanvas = document.createElement('canvas');
    barkCanvas.width = 256;
    barkCanvas.height = 256;
    const bCtx = barkCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 256, 256);

    for (let i = 0; i < 420; i++) {
      const x = rng() * 256;
      const y = rng() * 256;
      const len = 18 + rng() * 64;
      const w = 1 + rng() * 3.2;
      const shade = Math.floor(70 + rng() * 135);
      bCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
      bCtx.fillRect(x, y, w, len);
    }
    const barkTexture = new THREE.CanvasTexture(barkCanvas);
    barkTexture.wrapS = THREE.RepeatWrapping;
    barkTexture.wrapT = THREE.RepeatWrapping;
    barkTexture.repeat.set(3, 6);

    // Soft Procedural Golden Halo Texture for Full-Bloom Radiance
    const haloCanvas = document.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const hCtx = haloCanvas.getContext('2d');
    const hGrad = hCtx.createRadialGradient(128, 128, 6, 128, 128, 128);
    hGrad.addColorStop(0.0, 'rgba(255, 240, 178, 0.95)');
    hGrad.addColorStop(0.32, 'rgba(255, 206, 108, 0.52)');
    hGrad.addColorStop(0.68, 'rgba(229, 175, 110, 0.16)');
    hGrad.addColorStop(1.0, 'rgba(229, 175, 110, 0.0)');
    hCtx.fillStyle = hGrad;
    hCtx.fillRect(0, 0, 256, 256);
    const haloTexture = new THREE.CanvasTexture(haloCanvas);

    // Warm Studio PMREM Reflection Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0xf7f3eb);

    const panelGeom = new THREE.PlaneGeometry(14, 14);
    const topPanel = new THREE.Mesh(panelGeom, new THREE.MeshBasicMaterial({ color: 0xfff8ee }));
    topPanel.position.set(0, 9, 0);
    topPanel.rotation.x = Math.PI / 2;

    const keyPanel = new THREE.Mesh(panelGeom, new THREE.MeshBasicMaterial({ color: 0xf6d5c0 }));
    keyPanel.position.set(8, 4, 6);
    keyPanel.lookAt(0, 2, 0);

    const rimPanel = new THREE.Mesh(panelGeom, new THREE.MeshBasicMaterial({ color: 0xe2b298 }));
    rimPanel.position.set(-8, 3, -5);
    rimPanel.lookAt(0, 2, 0);

    envScene.add(topPanel, keyPanel, rimPanel);
    const envRT = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRT.texture;
    panelGeom.dispose();
    [topPanel, keyPanel, rimPanel].forEach((m) => m.material.dispose());
    pmremGenerator.dispose();

    scene.add(new THREE.HemisphereLight(0xfffaf2, 0xd4b69e, 1.15));
    const keyLight = new THREE.DirectionalLight(0xffe9d6, 2.2);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe5b8a0, 1.4);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Golden Core Point Light (activates smoothly when fully grown)
    const bloomGoldLight = new THREE.PointLight(0xffd275, 0, 14, 1.6);
    bloomGoldLight.position.set(0.2, 2.3, 1.2);
    scene.add(bloomGoldLight);

    // Physically Based Textured Rose-Gold & Gold-Bloom Materials
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: 0xc89076,
      metalness: 0.72,
      roughness: 0.44,
      bumpMap: barkTexture,
      bumpScale: 0.045,
      roughnessMap: barkTexture,
      emissive: 0x704118,
      emissiveIntensity: 0.04,
      envMapIntensity: 1.3
    });

    const branchMaterial = new THREE.MeshStandardMaterial({
      color: 0xd9a890,
      metalness: 0.78,
      roughness: 0.34,
      bumpMap: barkTexture,
      bumpScale: 0.025,
      emissive: 0x8f5920,
      emissiveIntensity: 0.04,
      envMapIntensity: 1.35
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.56,
      roughness: 0.30,
      emissive: 0x6e5420,
      emissiveIntensity: 0.05,
      side: THREE.DoubleSide,
      envMapIntensity: 1.25
    });

    const blossomMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.48,
      roughness: 0.22,
      emissive: 0xffc663,
      emissiveIntensity: 0.08,
      side: THREE.DoubleSide,
      envMapIntensity: 1.45
    });

    const treeRootGroup = new THREE.Group();
    treeRootGroup.position.set(0, STAGE_TUNING.treeOffsetY, 0);
    treeRootGroup.scale.setScalar(STAGE_TUNING.treeScale);
    scene.add(treeRootGroup);

    // Golden Halo Plane behind canopy
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTexture,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const haloPlane = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 7.2), haloMat);
    haloPlane.position.set(0.1, 3.3, -1.3);
    treeRootGroup.add(haloPlane);

    function createTaperedTubeGeometry(curve, tubularSegments, radiusStart, radiusEnd, radialSegments, fluteAmp = 0) {
      const frames = curve.computeFrenetFrames(tubularSegments, false);
      const positions = [];
      const uvs = [];
      const indices = [];

      for (let i = 0; i <= tubularSegments; i++) {
        const t = i / tubularSegments;
        const point = curve.getPointAt(t);
        const N = frames.normals[i];
        const B = frames.binormals[i];
        const baseRadius = lerp(radiusStart, radiusEnd, Math.pow(t, 0.80));

        for (let j = 0; j <= radialSegments; j++) {
          const angle = (j / radialSegments) * Math.PI * 2;
          const rib = fluteAmp > 0 ? 1 + fluteAmp * Math.sin(angle * 5 + t * 10) : 1;
          const radius = baseRadius * rib;
          const sin = Math.sin(angle);
          const cos = -Math.cos(angle);
          const nx = cos * N.x + sin * B.x;
          const ny = cos * N.y + sin * B.y;
          const nz = cos * N.z + sin * B.z;
          positions.push(point.x + radius * nx, point.y + radius * ny, point.z + radius * nz);
          uvs.push(t * 2.5, j / radialSegments);
        }
      }

      const stride = radialSegments + 1;
      for (let i = 0; i < tubularSegments; i++) {
        for (let j = 0; j < radialSegments; j++) {
          const a = i * stride + j;
          const b = (i + 1) * stride + j;
          const c = (i + 1) * stride + (j + 1);
          const d = i * stride + (j + 1);
          indices.push(a, b, d, b, c, d);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      return geometry;
    }

    const branchRecords = [];
    const leafNodes = [];
    const blossomNodes = [];

    const addSegment = (points, radiusStart, radiusEnd, tubularSegments, radialSegments, material, startP, endP, fluteAmp = 0) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geom = createTaperedTubeGeometry(curve, tubularSegments, radiusStart, radiusEnd, radialSegments, fluteAmp);
      const mesh = new THREE.Mesh(geom, material);
      treeRootGroup.add(mesh);

      const indicesPerRing = radialSegments * 6;
      geom.setDrawRange(0, 0);
      branchRecords.push({ geom, tubularSegments, indicesPerRing, startP, endP, lastRings: -1 });
      return curve;
    };

    const registerFoliageCluster = (anchorPos, baseStart, density = 1) => {
      const leafCount = 2 + density;
      for (let l = 0; l < leafCount; l++) {
        leafNodes.push({
          pos: anchorPos.clone().add(new THREE.Vector3((rng() - 0.5) * 0.18, (rng() - 0.5) * 0.12, (rng() - 0.5) * 0.18)),
          rot: new THREE.Euler((rng() - 0.5) * 1.1, rng() * Math.PI * 2, (rng() - 0.5) * 1.1),
          scale: 0.72 + rng() * 0.65,
          start: clamp(baseStart + rng() * 0.14, 0.38, 0.84),
          end: clamp(baseStart + 0.24 + rng() * 0.12, 0.55, 0.96),
          phase: rng() * Math.PI * 2
        });
      }

      const blossomCount = density > 1 ? 2 : 1;
      for (let b = 0; b < blossomCount; b++) {
        blossomNodes.push({
          pos: anchorPos.clone().add(new THREE.Vector3((rng() - 0.5) * 0.14, 0.03 + rng() * 0.08, (rng() - 0.5) * 0.14)),
          rot: new THREE.Euler((rng() - 0.5) * 0.85, rng() * Math.PI * 2, (rng() - 0.5) * 0.85),
          scale: 0.78 + rng() * 0.62,
          start: clamp(baseStart + 0.10 + rng() * 0.14, 0.50, 0.88),
          end: clamp(baseStart + 0.30 + rng() * 0.10, 0.72, 0.99),
          phase: rng() * Math.PI * 2
        });
      }
    };

    // 1. Textured Fluted Roots
    const rootCount = 8;
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2 + (rng() - 0.5) * 0.4;
      const reach = 1.25 + rng() * 0.9;
      addSegment(
        [
          new THREE.Vector3(Math.cos(angle) * 0.09, 0.16, Math.sin(angle) * 0.09),
          new THREE.Vector3(Math.cos(angle) * reach * 0.42, -0.02 - rng() * 0.08, Math.sin(angle) * reach * 0.42),
          new THREE.Vector3(Math.cos(angle + 0.18) * reach * 0.78, -0.18 - rng() * 0.12, Math.sin(angle + 0.18) * reach * 0.78),
          new THREE.Vector3(Math.cos(angle + 0.28) * reach, -0.30 - rng() * 0.16, Math.sin(angle + 0.28) * reach)
        ],
        0.12,
        0.015,
        28,
        8,
        barkMaterial,
        0.0 + i * 0.012,
        0.26 + i * 0.015,
        0.09
      );
    }

    // 2. Sculpted Textured Trunk
    const trunkCurve = addSegment(
      [
        new THREE.Vector3(0, -0.05, 0),
        new THREE.Vector3(-0.09, 1.0, 0.04),
        new THREE.Vector3(0.14, 2.15, -0.05),
        new THREE.Vector3(-0.04, 3.25, 0.03),
        new THREE.Vector3(0.06, 4.05, 0.0)
      ],
      0.26,
      0.09,
      48,
      12,
      barkMaterial,
      0.0,
      0.42,
      0.075
    );

    // 3. 6 Structural Limbs + 2 Dedicated Upper Crown Apex Limbs
    const limbSpecs = [
      { angle: 0.22, t: 0.54, len: 1.75, elev: 0.65 },
      { angle: 1.38, t: 0.60, len: 1.85, elev: 0.85 },
      { angle: 2.55, t: 0.66, len: 1.65, elev: 0.78 },
      { angle: 3.72, t: 0.72, len: 1.60, elev: 0.88 },
      { angle: 4.88, t: 0.78, len: 1.75, elev: 0.92 },
      { angle: 5.78, t: 0.84, len: 1.68, elev: 1.02 },
      { angle: 0.82, t: 0.94, len: 1.42, elev: 1.38 },
      { angle: 3.95, t: 0.98, len: 1.35, elev: 1.46 }
    ];

    limbSpecs.forEach((spec, pIdx) => {
      const origin = trunkCurve.getPointAt(spec.t);
      const angle = spec.angle + (rng() - 0.5) * 0.22;
      const length = spec.len + rng() * 0.25;
      const elev = spec.elev + rng() * 0.2;

      const mid1 = origin.clone().add(new THREE.Vector3(Math.cos(angle) * length * 0.42, elev * 0.55, Math.sin(angle) * length * 0.42));
      const mid2 = origin.clone().add(new THREE.Vector3(Math.cos(angle + 0.14) * length * 0.78, elev * 0.92, Math.sin(angle + 0.14) * length * 0.78));
      const tip = origin.clone().add(new THREE.Vector3(Math.cos(angle + 0.2) * length, elev * 1.18, Math.sin(angle + 0.2) * length));

      const limbStart = 0.20 + pIdx * 0.028;
      const limbEnd = 0.50 + pIdx * 0.022;
      const limbCurve = addSegment([origin, mid1, mid2, tip], 0.075, 0.020, 32, 9, barkMaterial, limbStart, limbEnd, 0.04);

      for (let s = 0; s < 4; s++) {
        const sOrigin = limbCurve.getPointAt(0.28 + s * 0.22);
        const sAngle = angle + (s % 2 === 0 ? 0.58 : -0.62) + (rng() - 0.5) * 0.28;
        const sLen = 0.68 + rng() * 0.42;
        const sElev = 0.28 + rng() * 0.45 + (pIdx >= 5 ? 0.22 : 0);
        const sMid = sOrigin.clone().add(new THREE.Vector3(Math.cos(sAngle) * sLen * 0.52, sElev * 0.52, Math.sin(sAngle) * sLen * 0.52));
        const sTip = sOrigin.clone().add(new THREE.Vector3(Math.cos(sAngle + 0.12) * sLen, sElev, Math.sin(sAngle + 0.12) * sLen));

        const sStart = 0.36 + pIdx * 0.02 + s * 0.022;
        const sEnd = 0.66 + pIdx * 0.018 + s * 0.02;
        const secCurve = addSegment([sOrigin, sMid, sTip], 0.028, 0.008, 22, 6, branchMaterial, sStart, sEnd);

        for (let tw = 0; tw < 3; tw++) {
          const twOrigin = secCurve.getPointAt(0.32 + tw * 0.28);
          const twAngle = sAngle + (tw - 1) * 0.56 + (rng() - 0.5) * 0.2;
          const twLen = 0.34 + rng() * 0.24;
          const twTip = twOrigin.clone().add(new THREE.Vector3(
            Math.cos(twAngle) * twLen,
            0.18 + rng() * 0.26,
            Math.sin(twAngle) * twLen
          ));

          const twStart = 0.48 + rng() * 0.16;
          addSegment(
            [twOrigin, twOrigin.clone().lerp(twTip, 0.5).add(new THREE.Vector3(0, 0.06, 0)), twTip],
            0.011,
            0.0035,
            14,
            5,
            branchMaterial,
            twStart,
            twStart + 0.18
          );

          registerFoliageCluster(twTip, twStart + 0.04, pIdx >= 5 ? 2 : 1);
        }

        registerFoliageCluster(sTip, sStart + 0.12, 2);
      }

      registerFoliageCluster(tip, limbStart + 0.22, 2);
    });

    // Instanced Leaves with Organic Tonal Variation
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.058, 0.048, 0.064, 0.145, 0, 0.22);
    leafShape.bezierCurveTo(-0.064, 0.145, -0.058, 0.048, 0, 0);
    const leafGeom = new THREE.ShapeGeometry(leafShape, 7);
    const leafInstanced = new THREE.InstancedMesh(leafGeom, leafMaterial, leafNodes.length);
    leafInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const leafPalette = [
      new THREE.Color(0xd9bd98),
      new THREE.Color(0xc5bea0),
      new THREE.Color(0xe3c8ad),
      new THREE.Color(0xaeb59b)
    ];
    for (let i = 0; i < leafNodes.length; i++) {
      leafInstanced.setColorAt(i, leafPalette[Math.floor(rng() * leafPalette.length)]);
    }
    if (leafInstanced.instanceColor) leafInstanced.instanceColor.needsUpdate = true;
    treeRootGroup.add(leafInstanced);

    // Instanced 5-Petal Blossoms with Champagne & Rose-Gold Color Variation
    const petalShape = new THREE.Shape();
    petalShape.moveTo(0, 0);
    petalShape.bezierCurveTo(0.048, 0.032, 0.058, 0.11, 0, 0.145);
    petalShape.bezierCurveTo(-0.058, 0.11, -0.048, 0.032, 0, 0);
    const singlePetalGeom = new THREE.ShapeGeometry(petalShape, 6);

    const mergedPositions = [];
    const mergedNormals = [];
    const basePos = singlePetalGeom.attributes.position;
    const baseNorm = singlePetalGeom.attributes.normal;
    const baseIndex = singlePetalGeom.index;
    const tempVec = new THREE.Vector3();
    const tempNorm = new THREE.Vector3();
    const petalMat4 = new THREE.Matrix4();
    const rotY = new THREE.Matrix4();
    const tiltX = new THREE.Matrix4();

    for (let p = 0; p < 5; p++) {
      rotY.makeRotationY((p / 5) * Math.PI * 2);
      tiltX.makeRotationX(0.92);
      petalMat4.multiplyMatrices(rotY, tiltX);
      for (let idx = 0; idx < baseIndex.count; idx++) {
        const vi = baseIndex.getX(idx);
        tempVec.fromBufferAttribute(basePos, vi).applyMatrix4(petalMat4);
        tempNorm.fromBufferAttribute(baseNorm, vi).transformDirection(petalMat4);
        mergedPositions.push(tempVec.x, tempVec.y, tempVec.z);
        mergedNormals.push(tempNorm.x, tempNorm.y, tempNorm.z);
      }
    }
    singlePetalGeom.dispose();

    const blossomGeom = new THREE.BufferGeometry();
    blossomGeom.setAttribute('position', new THREE.Float32BufferAttribute(mergedPositions, 3));
    blossomGeom.setAttribute('normal', new THREE.Float32BufferAttribute(mergedNormals, 3));
    const blossomInstanced = new THREE.InstancedMesh(blossomGeom, blossomMaterial, blossomNodes.length);
    blossomInstanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const blossomPalette = [
      new THREE.Color(0xf7ddd0),
      new THREE.Color(0xf2cbb8),
      new THREE.Color(0xfff1de),
      new THREE.Color(0xe8b79f)
    ];
    for (let i = 0; i < blossomNodes.length; i++) {
      blossomInstanced.setColorAt(i, blossomPalette[Math.floor(rng() * blossomPalette.length)]);
    }
    if (blossomInstanced.instanceColor) blossomInstanced.instanceColor.needsUpdate = true;
    treeRootGroup.add(blossomInstanced);

    // Golden Ambient Glint Particles
    const particleCount = state.reducedMotion ? 0 : (state.isMobile ? STAGE_TUNING.maxParticlesMobile : STAGE_TUNING.maxParticlesDesktop);
    let particlesMesh = null;
    if (particleCount > 0) {
      const pPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] = (rng() - 0.5) * 6.4;
        pPos[i * 3 + 1] = 0.4 + rng() * 5.6;
        pPos[i * 3 + 2] = (rng() - 0.5) * 4.2;
      }
      const pGeom = new THREE.BufferGeometry();
      pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      particlesMesh = new THREE.Points(
        pGeom,
        new THREE.PointsMaterial({ color: 0xffe09c, size: 0.065, transparent: true, opacity: 0.4 })
      );
      treeRootGroup.add(particlesMesh);
    }

    const dummyMatrix = new THREE.Matrix4();
    const dummyScale = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const swayEuler = new THREE.Euler();

    const resizeToStage = () => {
      const rect = treeStage.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      camera.aspect = width / height;
      camera.fov = state.isMobile ? STAGE_TUNING.cameraFovMobile : STAGE_TUNING.cameraFovDesktop;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, state.isMobile ? 1.5 : 2));
      renderer.setSize(width, height, false);
      treeRootGroup.position.y = STAGE_TUNING.treeOffsetY;
      treeRootGroup.scale.setScalar(STAGE_TUNING.treeScale);
    };

    resizeToStage();

    const updateScene = (progress, elapsedSec, glowFactor) => {
      for (let i = 0; i < branchRecords.length; i++) {
        const rec = branchRecords[i];
        const local = smoothstep(rec.startP, rec.endP, progress);
        const rings = Math.round(local * rec.tubularSegments);
        if (rings !== rec.lastRings) {
          rec.lastRings = rings;
          rec.geom.setDrawRange(0, rings * rec.indicesPerRing);
        }
      }

      const swayAmt = state.reducedMotion ? 0 : 0.065;
      for (let i = 0; i < leafNodes.length; i++) {
        const node = leafNodes[i];
        const t = smoothstep(node.start, node.end, progress);
        const s = t * node.scale;
        const unfurl = (1 - t) * 0.45;
        swayEuler.set(
          node.rot.x + unfurl + Math.sin(elapsedSec * 1.1 + node.phase) * swayAmt,
          node.rot.y,
          node.rot.z + Math.cos(elapsedSec * 0.9 + node.phase) * swayAmt
        );
        dummyQuat.setFromEuler(swayEuler);
        dummyScale.set(s, s, s);
        dummyMatrix.compose(node.pos, dummyQuat, dummyScale);
        leafInstanced.setMatrixAt(i, dummyMatrix);
      }
      leafInstanced.instanceMatrix.needsUpdate = true;

      for (let i = 0; i < blossomNodes.length; i++) {
        const node = blossomNodes[i];
        const t = smoothstep(node.start, node.end, progress);
        const s = t * node.scale;
        const unfurl = (1 - t) * 0.55;
        swayEuler.set(
          node.rot.x + unfurl + Math.sin(elapsedSec * 0.8 + node.phase) * swayAmt * 0.7,
          node.rot.y,
          node.rot.z
        );
        dummyQuat.setFromEuler(swayEuler);
        dummyScale.set(s, s, s);
        dummyMatrix.compose(node.pos, dummyQuat, dummyScale);
        blossomInstanced.setMatrixAt(i, dummyMatrix);
      }
      blossomInstanced.instanceMatrix.needsUpdate = true;

      // Radiating Gold Glow when fully grown at bottom of page
      const pulse = state.reducedMotion ? 1.0 : 0.88 + 0.12 * Math.sin(elapsedSec * 1.5);
      const glow = glowFactor * STAGE_TUNING.glowMaxIntensity * pulse;

      blossomMaterial.emissiveIntensity = lerp(0.06, 0.72, glow);
      leafMaterial.emissiveIntensity = lerp(0.04, 0.32, glow);
      branchMaterial.emissiveIntensity = lerp(0.03, 0.24, glow);
      barkMaterial.emissiveIntensity = lerp(0.02, 0.14, glow);
      bloomGoldLight.intensity = glow * 4.8;

      haloMat.opacity = glow * 0.78;
      const haloScale = 1.0 + glow * 0.22;
      haloPlane.scale.set(haloScale, haloScale, 1);

      // Horizontal & vertical framing (~65% visible on left edge)
      const visibleRatio = clamp(STAGE_TUNING.visibleTreePercent / 100, 0.35, 1.0);
      const canopySpan = 4.9 * STAGE_TUNING.treeScale;
      const visibleWidthNeeded = canopySpan * visibleRatio;
      const xCenterShift = (canopySpan * (1 - visibleRatio)) * 0.5 + STAGE_TUNING.cameraOffsetXAdjust;

      const halfFovRad = (camera.fov * Math.PI) / 360;
      const aspect = Math.max(0.18, camera.aspect || 0.5);
      const idealZForWidth = visibleWidthNeeded / (2 * Math.tan(halfFovRad) * aspect);
      const targetZ = clamp(
        lerp(STAGE_TUNING.cameraMinZ, idealZForWidth, 0.35 + progress * 0.65),
        STAGE_TUNING.cameraMinZ,
        STAGE_TUNING.cameraMaxZ
      );

      const targetY = lerp(STAGE_TUNING.cameraLookAtYStart, STAGE_TUNING.cameraLookAtYEnd, progress);
      const parallaxX = state.reducedMotion || state.isTablet ? 0 : state.pointerX * 0.16;
      const parallaxY = state.reducedMotion || state.isTablet ? 0 : state.pointerY * 0.10;

      camera.position.x = lerp(camera.position.x, xCenterShift + parallaxX, 0.08);
      camera.position.y = lerp(camera.position.y, targetY + parallaxY, 0.08);
      camera.position.z = lerp(camera.position.z, targetZ, 0.08);
      camera.lookAt(xCenterShift, targetY * 0.68, 0);

      const baseTurn = lerp(-0.14, 0.24, progress);
      const idleBreath = state.reducedMotion ? 0 : Math.sin(elapsedSec * 0.25) * 0.035;
      treeRootGroup.rotation.y = baseTurn + idleBreath;

      if (particlesMesh) {
        particlesMesh.rotation.y = elapsedSec * 0.035;
        particlesMesh.material.opacity = lerp(0.16, 0.85, Math.max(progress * 0.5, glow));
      }

      renderer.render(scene, camera);
    };

    return { update: updateScene, resize: resizeToStage };
  } catch (err) {
    return activateFallback();
  }
}

/* ==========================================================================
   8. CENTRAL SCROLL PROGRESS, GLOW RADIANCE & BOOTSTRAP
   ========================================================================== */
function getStageLabel(progress) {
  if (progress < 0.22) return 'Roots: Manager Foundation';
  if (progress < 0.44) return 'Trunk: Central Structure';
  if (progress < 0.66) return 'Branches: Shared Knowledge';
  if (progress < 0.86) return 'Leaves: Staff Confidence';
  return 'Full Bloom: Radiating Growth';
}

function computeScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return clamp(window.scrollY / scrollable, 0, 1);
}

async function bootstrap() {
  applyStageTuningToCss();
  initContactCta();
  initNavigation();
  initComparisonToggle();
  initHubExplorer();
  initIndustrySelector();
  initAudioControls();

  const progressFill = document.getElementById('growth-progress-fill');
  const stageLabelEl = document.getElementById('tree-stage-label');

  state.targetScrollProgress = computeScrollProgress();
  state.smoothScrollProgress = Math.max(STAGE_TUNING.initialGrowthFloor, state.targetScrollProgress);

  const threeController = await initThreeTree();
  const isFallback = !threeController;

  const initialGlow = smoothstep(STAGE_TUNING.glowStartProgress, 0.99, state.smoothScrollProgress);
  document.documentElement.style.setProperty('--bloom-glow', initialGlow.toFixed(3));

  if (isFallback) {
    fallbackController.update(state.smoothScrollProgress);
  } else {
    threeController.update(state.smoothScrollProgress, 0, initialGlow);
  }

  window.addEventListener(
    'scroll',
    () => {
      state.targetScrollProgress = computeScrollProgress();
    },
    { passive: true }
  );

  window.addEventListener(
    'pointermove',
    (event) => {
      if (state.isTablet || state.reducedMotion) return;
      state.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      state.pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      applyStageTuningToCss();
      if (threeController) threeController.resize();
    }, 90);
  });

  document.addEventListener('visibilitychange', () => {
    state.isPageVisible = !document.hidden;
  });

  const startTime = performance.now();
  let lastStageLabel = '';

  function frame(now) {
    window.requestAnimationFrame(frame);
    if (!state.isPageVisible) return;

    const elapsedSec = (now - startTime) * 0.001;
    const minBaseline = Math.max(STAGE_TUNING.initialGrowthFloor, state.targetScrollProgress);

    state.smoothScrollProgress = state.reducedMotion
      ? minBaseline
      : lerp(state.smoothScrollProgress, minBaseline, STAGE_TUNING.scrollSmoothing);

    const glowFactor = smoothstep(STAGE_TUNING.glowStartProgress, 0.99, state.smoothScrollProgress);
    document.documentElement.style.setProperty('--bloom-glow', (glowFactor * STAGE_TUNING.glowMaxIntensity).toFixed(3));

    if (progressFill) {
      progressFill.style.width = `${(state.targetScrollProgress * 100).toFixed(2)}%`;
    }

    const label = getStageLabel(state.smoothScrollProgress);
    if (stageLabelEl && label !== lastStageLabel) {
      lastStageLabel = label;
      stageLabelEl.textContent = label;
    }

    if (isFallback) {
      fallbackController.update(state.smoothScrollProgress);
    } else {
      threeController.update(state.smoothScrollProgress, elapsedSec, glowFactor);
    }
  }

  window.requestAnimationFrame(frame);
}

bootstrap();