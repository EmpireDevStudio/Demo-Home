/**
 * =========================================================================
 * CLIENT CONFIGURATION ENGINE (APP_CONFIG)
 * Production-Ready White-Label Master Configuration
 * All application copy, branding, endpoints, and toggles are managed here.
 * =========================================================================
 */
const APP_CONFIG = Object.freeze({
  // 1. APPLICATION IDENTITY & METADATA
  identity: {
    appId: "cocktail-memory-match-architect",
    appName: "Memory Match CSV Architect",
    appTagline: "Artisanal Reserve Edition Curation Suite",
    version: "2.5.0",
    environment: "production",
    canonicalUrl: "https://cocktail-lounge.example.com/builder",
    language: "en-US",
    locale: "en-US",
  },

  // 2. BRANDING & VISUAL PALETTE OVERRIDES
  branding: {
    eyebrow: "The Reserve Collection",
    defaultTitle: "Memory Match CSV Architect",
    defaultSubtitle: "Intelligent Puzzle Authoring & Collection Manager",
    fontFamilyBase: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    fontFamilySerif: "'Cormorant Garamond', Georgia, serif",
    accentColor: "#A25750",      // Terracotta Red
    accentSecondary: "#3E5B42",  // Sage Green
    accentHighlight: "#6E5614",  // Warm Ochre
  },

  // 3. GLOBAL NAVIGATION ARCHITECTURE (MOBILE THUMB-DOCK & WORKFLOW)
  navigation: {
    enableTopBackNavigation: true,
    defaultFallbackRoute: "view-manager",
    items: [
      { id: "nav-start", viewId: "view-start", label: "Start", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`, enabled: true },
      { id: "nav-cellar", viewId: "view-manager", label: "Cellar", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`, enabled: true },
      { id: "nav-compose", viewId: "view-editor", label: "Compose", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`, enabled: true },
      { id: "nav-export", viewId: "view-export", label: "Export", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`, enabled: true }
    ]
  },

  // 4. PRODUCTION CONTENT MATRIX & SCHEMA
  content: {
    schema: {
      requiredPairCount: 8,
      totalCards: 16,
      headers: [
        'title',
        'item_1', 'svg_1',
        'item_2', 'svg_2',
        'item_3', 'svg_3',
        'item_4', 'svg_4',
        'item_5', 'svg_5',
        'item_6', 'svg_6',
        'item_7', 'svg_7',
        'item_8', 'svg_8'
      ]
    },
    notifications: {
      savedDraft: "Edition saved to cellar collection",
      updatedDraft: "Reserve edition updated",
      removedDraft: "Edition removed from cellar",
      csvImportSuccess: "Successfully parsed CSV editions",
      csvExportSuccess: "CSV export generated",
      clipboardSuccess: "Raw 17-column CSV copied to clipboard",
      errorDuplicates: "Engine error: All 8 pairs must have unique labels",
      errorMissingTitle: "Engine error: Missing edition theme title"
    },
    legal: {
      copyrightHolder: "The Cocktail Lounge Curation Guild",
      establishedYear: 2026
    }
  },

  // 5. FEATURE SWITCHES & INTERACTION CONTROLS
  features: {
    enableHapticFeedback: true,
    enableAutoSave: true,
    autoSaveIntervalMs: 4000,
    enableSmoothBoardFlip: true
  },

  // 6. STORAGE & ENDPOINTS
  endpoints: {
    storageKeys: {
      collection: "cocktail_memory_match_cellar_records_v2"
    }
  }
});

// ============================================================================
// CURATED VECTOR ICON LIBRARY (50+ HAND-CRAFTED COCKTAIL TOKENS)
// All SVGs adhere strictly to: viewBox="0 0 24 24" stroke="currentColor" fill="none"
// ============================================================================
const ICON_LIBRARY = [
  // --- BAR TOOLS ---
  { id: 'shaker', name: 'Cocktail Shaker', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4h8v2H8zM6 8h12l-1.5 13H7.5L6 8zM9 2h6v2H9z"/><line x1="6" y1="8" x2="18" y2="8"/></svg>` },
  { id: 'jigger', name: 'Japanese Jigger', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="7 3 17 3 14 11 10 11 7 3"/><polygon points="10 13 14 13 18 21 6 21 10 13"/><line x1="10" y1="11" x2="10" y2="13"/><line x1="14" y1="11" x2="14" y2="13"/></svg>` },
  { id: 'strainer', name: 'Hawthorne Strainer', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="6"/><line x1="12" y1="16" x2="12" y2="22"/><path d="M6 6c-1.5 1.5-2 4-2 4M18 6c1.5 1.5 2 4 2 4M9 4l-2-2M15 4l2-2"/></svg>` },
  { id: 'spoon', name: 'Bar Spoon', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="4" rx="3" ry="2"/><path d="M12 6c0 5-2 7 0 11s0 5 0 5"/></svg>` },
  { id: 'muddler', name: 'Muddler', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="3" width="4" height="12" rx="1"/><path d="M8 15h8l1 6H7l1-6z"/><line x1="8" y1="21" x2="16" y2="21"/></svg>` },
  { id: 'mixing_glass', name: 'Mixing Glass', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12l-1.5 16h-9L6 4z"/><line x1="6" y1="7" x2="18" y2="7"/><path d="M6 4l-2-1"/></svg>` },
  { id: 'peeler', name: 'Y-Peeler', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 3l4 8v10h2V11l4-8"/><line x1="8" y1="5" x2="16" y2="5"/></svg>` },
  { id: 'tongs', name: 'Ice Tongs', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3a3 3 0 0 1 6 0v9l-2 9h-2l-2-9V3z"/><circle cx="12" cy="3" r="1"/></svg>` },
  { id: 'julep_strainer', name: 'Julep Strainer', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="9" rx="5" ry="6"/><line x1="12" y1="15" x2="12" y2="22"/><circle cx="11" cy="8" r="0.5" fill="currentColor"/><circle cx="13" cy="8" r="0.5" fill="currentColor"/></svg>` },
  { id: 'fine_mesh', name: 'Fine Mesh Strainer', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 0 12 0H6z"/><line x1="18" y1="8" x2="22" y2="8"/><line x1="2" y1="8" x2="6" y2="8"/><line x1="12" y1="14" x2="12" y2="21"/></svg>` },
  { id: 'channel_knife', name: 'Channel Knife', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="10" width="4" height="11" rx="1"/><path d="M12 10V4l2 1-2 2"/></svg>` },
  { id: 'atomizer', name: 'Atomizer Mist', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="9" width="8" height="12" rx="1"/><rect x="10" y="5" width="4" height="4"/><path d="M14 6h2a2 2 0 0 1 2 2v1"/><circle cx="19" cy="9" r="1"/></svg>` },
  { id: 'speed_pour', name: 'Speed Pour Spout', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="12" width="6" height="8" rx="1"/><line x1="8" y1="12" x2="16" y2="12"/><path d="M12 12V4l4-2"/></svg>` },
  { id: 'corkscrew', name: 'Waiters Corkscrew', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="14" width="12" height="4" rx="1"/><path d="M18 14l3-8"/><path d="M12 14c0-4 2-5 0-8"/></svg>` },
  { id: 'citrus_press', name: 'Citrus Squeezer', category: 'tools', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8l10 2 6-4"/><path d="M4 14l10-2 6 4"/><circle cx="13" cy="11" r="3"/></svg>` },

  // --- GLASSWARE ---
  { id: 'coupe', name: 'Coupe Glass', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6a8 8 0 0 0 16 0H4z"/><line x1="12" y1="14" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg>` },
  { id: 'nick_nora', name: 'Nick & Nora', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 5c0 5 2.5 7 6 7s6-2 6-7H6z"/><line x1="12" y1="12" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg>` },
  { id: 'rocks', name: 'Lowball Rocks', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h12l-1 14H7L6 6z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>` },
  { id: 'highball_glass', name: 'Collins Glass', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="4" width="8" height="16" rx="1"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="13" y1="2" x2="11" y2="20"/></svg>` },
  { id: 'flute', name: 'Champagne Flute', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 4h8l-1 9a3 3 0 0 1-6 0L8 4z"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="9" y1="21" x2="15" y2="21"/></svg>` },
  { id: 'snifter', name: 'Snifter Glass', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7c-3 4-2 8 4 8s7-4 4-8H8z"/><line x1="12" y1="15" x2="12" y2="20"/><line x1="9" y1="20" x2="15" y2="20"/></svg>` },
  { id: 'tiki_mug', name: 'Ceramic Tiki Mug', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="4" width="10" height="16" rx="2"/><line x1="9" y1="8" x2="11" y2="8"/><line x1="13" y1="8" x2="15" y2="8"/><path d="M9 13c1 1 4 1 6 0"/></svg>` },
  { id: 'julep_cup', name: 'Pewter Julep Cup', category: 'glassware', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 5h12l-2 15H8L6 5z"/><line x1="5" y1="5" x2="19" y2="5"/><line x1="7" y1="20" x2="17" y2="20"/></svg>` },

  // --- DRINKS ---
  { id: 'martini', name: 'Classic Martini', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="4 4 20 4 12 13 4 4"/><line x1="12" y1="13" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><circle cx="12" cy="7" r="1.5" fill="currentColor"/></svg>` },
  { id: 'old_fashioned', name: 'Old Fashioned', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="8" width="12" height="12" rx="1"/><line x1="6" y1="11" x2="18" y2="11"/><rect x="9" y="13" width="6" height="5" rx="0.5"/></svg>` },
  { id: 'margarita', name: 'Margarita', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h14l-2 5c-1 2-2 3-5 3s-4-1-5-3L5 4z"/><line x1="12" y1="12" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><circle cx="16" cy="4" r="1.5"/></svg>` },
  { id: 'negroni', name: 'Negroni', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="7" width="12" height="13" rx="1"/><rect x="8.5" y="10" width="7" height="7" rx="1"/><path d="M15 7c-1-2-3-3-5-2"/></svg>` },
  { id: 'manhattan', name: 'Manhattan', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 6a7 7 0 0 0 14 0H5z"/><line x1="12" y1="13" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><circle cx="12" cy="8" r="1.5" fill="currentColor"/></svg>` },
  { id: 'daiquiri', name: 'Daiquiri', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 6c0 4.5 3.5 7 7 7s7-2.5 7-7H5z"/><line x1="12" y1="13" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="10" y1="4" x2="14" y2="8"/></svg>` },
  { id: 'espresso_martini', name: 'Espresso Martini', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="4 5 20 5 12 13 4 5"/><line x1="12" y1="13" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/><ellipse cx="11" cy="7" rx="1" ry="0.6" fill="currentColor"/><ellipse cx="13" cy="7" rx="1" ry="0.6" fill="currentColor"/></svg>` },
  { id: 'mai_tai', name: 'Mai Tai', category: 'drinks', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 6h10l-1 14H8L7 6z"/><line x1="12" y1="6" x2="12" y2="2"/><path d="M10 2l4 4M14 2l-4 4"/></svg>` },

  // --- GARNISHES ---
  { id: 'citrus_twist', name: 'Citrus Twist', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18c4 2 8-2 8-6s4-8 8-6"/><path d="M7 20c3 1 6-2 6-5s3-6 7-5"/></svg>` },
  { id: 'olives', name: 'Cocktail Olives', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="20" x2="20" y2="4"/><circle cx="9" cy="15" r="2.5" fill="currentColor"/><circle cx="13" cy="11" r="2.5" fill="currentColor"/></svg>` },
  { id: 'cherry', name: 'Luxardo Cherry', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="15" r="4" fill="currentColor"/><path d="M10 11c1-4 4-7 8-8"/><path d="M18 3c-1 3 0 5 1 6"/></svg>` },
  { id: 'mint', name: 'Mint Sprig', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="22" x2="12" y2="8"/><path d="M12 14c-4 0-6-3-6-5 3 0 6 2 6 5z" fill="currentColor"/><path d="M12 11c4 0 6-3 6-5-3 0-6 2-6 5z" fill="currentColor"/></svg>` },
  { id: 'lime_wheel', name: 'Lime Wheel', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="6" stroke-dasharray="2 2"/><line x1="12" y1="6" x2="12" y2="18"/><line x1="6" y1="12" x2="18" y2="12"/></svg>` },
  { id: 'rosemary', name: 'Rosemary Spear', category: 'garnishes', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="22" x2="12" y2="2"/><path d="M12 18l4-2M12 16l-4-2M12 13l4-2M12 11l-4-2"/></svg>` },

  // --- SPIRITS ---
  { id: 'gin_bottle', name: 'London Dry Gin', category: 'spirits', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="9" width="10" height="12" rx="1"/><path d="M9 9V5h6v4"/><rect x="10" y="2" width="4" height="3"/></svg>` },
  { id: 'bourbon_bottle', name: 'Bourbon Decanter', category: 'spirits', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 10h10l-1 11H8L7 10z"/><path d="M10 10V6c0-1 1-2 2-2s2 1 2 2v4"/><rect x="10.5" y="2" width="3" height="2"/></svg>` },
  { id: 'tequila_bottle', name: 'Highland Tequila', category: 'spirits', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12c0-2 2-4 6-4s6 2 6 4v9H6v-9z"/><rect x="10" y="4" width="4" height="4"/><rect x="9" y="2" width="6" height="2"/></svg>` },
  { id: 'bitters_bottle', name: 'Aromatic Bitters', category: 'spirits', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="10" width="8" height="11" rx="1"/><path d="M9 10V5h6v5"/><rect x="10" y="2" width="4" height="3"/><rect x="6" y="9" width="12" height="8"/></svg>` },

  // --- ICE CRAFT ---
  { id: 'king_cube', name: 'Carved King Cube', category: 'ice', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 3 19 7 19 17 12 21 5 17 5 7 12 3"/><polyline points="12 3 12 21"/><polyline points="19 7 12 11 5 7"/></svg>` },
  { id: 'ice_sphere', name: 'Crystal Ice Sphere', category: 'ice', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><ellipse cx="12" cy="12" rx="8" ry="3" stroke-dasharray="2 2"/></svg>` },
  { id: 'ice_spear', name: 'Collins Ice Spear', category: 'ice', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="10 3 14 3 15 20 9 20"/><line x1="12" y1="3" x2="12" y2="20"/></svg>` },
  { id: 'ice_pick', name: 'Ice Carving Pick', category: 'ice', svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="10" y="12" width="4" height="9" rx="1"/><polygon points="12 2 11 12 13 12 12 2" fill="currentColor"/></svg>` }
];

// ============================================================================
// APPLICATION STATE MACHINE
// ============================================================================
const state = {
  editions: [],
  originalCount: 0,
  editingIndex: -1,
  currentStep: 1,
  activeView: 'view-start',
  previousView: 'view-start',
  pickerPairIndex: 1,
  filterSearch: '',
  filterStatus: 'all',
  boardShuffleSeed: 42
};

// ============================================================================
// HAPTIC FEEDBACK SIMULATION PROTOCOL
// ============================================================================
function triggerHapticPulse() {
  if (APP_CONFIG.features.enableHapticFeedback && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(12);
    } catch (e) {}
  }
}

// Bind haptic pulse to interactive clicks
document.addEventListener('click', (e) => {
  if (e.target.closest('.interactive-tactile, .btn-back-nav, .nav-dock-item, .filter-chip, .step-pill, .icon-choice-card')) {
    triggerHapticPulse();
  }
});

// ============================================================================
// RFC 4180 COMPLIANT CSV PARSER & SERIALIZER
// ============================================================================
const CSVEngine = {
  parse(text) {
    if (!text || typeof text !== 'string') return [];
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
  },

  serializeValue(val) {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  },

  stringify(records) {
    const lines = [];
    const headers = APP_CONFIG.content.schema.headers;
    lines.push(headers.join(','));

    records.forEach(rec => {
      const rowCells = [];
      headers.forEach(h => {
        rowCells.push(CSVEngine.serializeValue(rec[h] || ''));
      });
      lines.push(rowCells.join(','));
    });

    return lines.join('\r\n');
  }
};

// ============================================================================
// SVG SANITIZER & SCHEMA AUDITOR
// ============================================================================
function sanitizeSVG(svgStr) {
  if (!svgStr || typeof svgStr !== 'string') return '';
  const trimmed = svgStr.trim();
  if (!trimmed.includes('<svg') || !trimmed.includes('</svg>')) return '';

  try {
    const template = document.createElement('template');
    template.innerHTML = trimmed;
    const svg = template.content.querySelector('svg');
    if (!svg) return '';

    const dangerous = ['script', 'foreignobject', 'iframe', 'object', 'embed', 'audio', 'video', 'style'];
    dangerous.forEach(tag => svg.querySelectorAll(tag).forEach(el => el.remove()));

    const allNodes = [svg, ...svg.querySelectorAll('*')];
    allNodes.forEach(el => {
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
    if (!svg.getAttribute('stroke')) svg.setAttribute('stroke', 'currentColor');
    if (!svg.getAttribute('fill')) svg.setAttribute('fill', 'none');
    if (!svg.getAttribute('stroke-width')) svg.setAttribute('stroke-width', '2');

    return svg.outerHTML;
  } catch (e) {
    return '';
  }
}

function auditPuzzleRecord(puzzle) {
  const issues = [];
  const warnings = [];

  if (!puzzle.title || !puzzle.title.trim()) {
    issues.push('Missing edition theme title.');
  }

  const items = [];
  const requiredCount = APP_CONFIG.content.schema.requiredPairCount;
  for (let i = 1; i <= requiredCount; i++) {
    const val = (puzzle[`item_${i}`] || '').trim();
    const svg = (puzzle[`svg_${i}`] || '').trim();

    if (!val) {
      issues.push(`Pair ${i} is missing an item name.`);
    } else {
      items.push(val.toLowerCase());
    }

    if (!svg) {
      warnings.push(`Pair ${i} (${val || 'unnamed'}) has no visual icon token.`);
    } else if (!svg.includes('<svg')) {
      issues.push(`Pair ${i} has malformed SVG code.`);
    }
  }

  const uniqueSet = new Set(items);
  if (items.length === requiredCount && uniqueSet.size !== requiredCount) {
    issues.push('Duplicate item names detected. The game engine rejects puzzles with duplicate labels.');
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
}

// ============================================================================
// NAVIGATION & VIEW CONTROLLER
// ============================================================================
function navigateToView(viewId) {
  state.previousView = state.activeView;
  state.activeView = viewId;

  document.querySelectorAll('.workflow-view').forEach(v => v.classList.add('hidden'));
  const target = document.getElementById(viewId);
  if (target) target.classList.remove('hidden');

  // Sync Bottom Dock Active State
  document.querySelectorAll('.nav-dock-item').forEach(item => {
    const isTarget = item.dataset.targetView === viewId;
    item.classList.toggle('nav-dock-item--active', isTarget);
    item.setAttribute('aria-current', isTarget ? 'page' : 'false');
  });

  // Hydrate header context dynamically
  hydrateHeaderContext(viewId);

  if (viewId === 'view-manager') {
    renderManagerTable();
  } else if (viewId === 'view-export') {
    renderExportSuite();
  }
  updateDatasetBadges();
}

function hydrateHeaderContext(viewId) {
  const eyebrow = document.getElementById('pageEyebrowSlot');
  const title = document.getElementById('pageTitleSlot');
  const subtitle = document.getElementById('pageSubtitleSlot');
  const backLabel = document.getElementById('btnHeaderBackLabel');

  switch (viewId) {
    case 'view-start':
      eyebrow.textContent = APP_CONFIG.branding.eyebrow;
      title.textContent = APP_CONFIG.branding.defaultTitle;
      subtitle.textContent = APP_CONFIG.branding.defaultSubtitle;
      backLabel.textContent = "Home";
      break;
    case 'view-manager':
      eyebrow.textContent = "Reserve Collection";
      title.textContent = "Cellar Repository";
      subtitle.textContent = "Review, search, and verify all loaded 17-column puzzle editions.";
      backLabel.textContent = "Start";
      break;
    case 'view-editor':
      eyebrow.textContent = "Authoring Suite";
      title.textContent = state.editingIndex >= 0 ? "Edit Reserve Edition" : "Compose Reserve Edition";
      subtitle.textContent = "Configure the 8 matching pairs and calibrate vector visual tokens.";
      backLabel.textContent = "Cellar";
      break;
    case 'view-export':
      eyebrow.textContent = "Pre-Flight Validation";
      title.textContent = "CSV Export Suite";
      subtitle.textContent = "Inspect technical data integrity and generate game-ready files.";
      backLabel.textContent = "Cellar";
      break;
  }
}

function handleBackNavigation() {
  if (state.activeView === 'view-editor' || state.activeView === 'view-export') {
    navigateToView('view-manager');
  } else if (state.activeView === 'view-manager') {
    navigateToView('view-start');
  } else {
    navigateToView(APP_CONFIG.navigation.defaultFallbackRoute);
  }
}

function showToast(message) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add('hidden'), 2800);
}

function updateDatasetBadges() {
  const summary = document.getElementById('txtDatasetSummary');
  const totalBadge = document.getElementById('badge-total-records');
  const count = state.editions.length;
  if (summary) summary.textContent = `${count} Edition${count === 1 ? '' : 's'} Loaded`;
  if (totalBadge) totalBadge.textContent = `${count} Edition${count === 1 ? '' : 's'}`;
}

// ============================================================================
// MANAGER VIEW (REPOSITORY DATA TABLE)
// ============================================================================
function renderManagerTable() {
  const tbody = document.getElementById('tbody-editions');
  const emptyNotice = document.getElementById('table-empty-notice');
  if (!tbody) return;
  tbody.innerHTML = '';

  const q = state.filterSearch.toLowerCase();
  const statusFilter = state.filterStatus;

  let filtered = state.editions.map((ed, idx) => ({ ed, idx }));

  if (q) {
    filtered = filtered.filter(({ ed }) => {
      const titleMatch = (ed.title || '').toLowerCase().includes(q);
      let itemMatch = false;
      for (let i = 1; i <= 8; i++) {
        if ((ed[`item_${i}`] || '').toLowerCase().includes(q)) {
          itemMatch = true;
          break;
        }
      }
      return titleMatch || itemMatch;
    });
  }

  if (statusFilter === 'valid') {
    filtered = filtered.filter(({ ed }) => auditPuzzleRecord(ed).isValid);
  } else if (statusFilter === 'invalid') {
    filtered = filtered.filter(({ ed }) => !auditPuzzleRecord(ed).isValid);
  }

  if (filtered.length === 0) {
    emptyNotice.classList.remove('hidden');
    return;
  }
  emptyNotice.classList.add('hidden');

  filtered.forEach(({ ed, idx }) => {
    const audit = auditPuzzleRecord(ed);
    const tr = document.createElement('tr');

    let tokensHtml = '<div class="tokens-inline-cluster">';
    for (let i = 1; i <= 8; i++) {
      tokensHtml += `<span class="paper-token">${escapeHtml(ed[`item_${i}`] || `Pair ${i}`)}</span>`;
    }
    tokensHtml += '</div>';

    let iconPips = '<div class="icon-pip-tray">';
    for (let i = 1; i <= 8; i++) {
      const hasSvg = !!ed[`svg_${i}`];
      iconPips += `<span class="icon-pip" title="Pair ${i}: ${hasSvg ? 'SVG Assigned' : 'No SVG'}">${hasSvg ? ed[`svg_${i}`] : '•'}</span>`;
    }
    iconPips += '</div>';

    const statusPill = audit.isValid
      ? `<span class="badge-pill badge-pill--sage">✓ Game Ready</span>`
      : `<span class="badge-pill badge-pill--terracotta" title="${escapeHtml(audit.issues.join(' | '))}">⚠ Needs Fix (${audit.issues.length})</span>`;

    tr.innerHTML = `
      <td><strong>#${idx + 1}</strong></td>
      <td>
        <div class="record-title-text">${escapeHtml(ed.title || 'Untitled Edition')}</div>
      </td>
      <td>${tokensHtml}</td>
      <td>${iconPips}</td>
      <td>${statusPill}</td>
      <td class="row-actions-group">
        <button class="interactive-tactile btn-secondary btn-sm btn-edit-edition" data-idx="${idx}" type="button">Edit</button>
        <button class="interactive-tactile btn-secondary btn-sm btn-dup-edition" data-idx="${idx}" type="button" title="Duplicate edition">Copy</button>
        <button class="interactive-tactile btn-danger-subtle btn-sm btn-del-edition" data-idx="${idx}" type="button" title="Delete edition">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-edit-edition').forEach(b => {
    b.onclick = () => openEditorForRecord(parseInt(b.dataset.idx, 10));
  });
  tbody.querySelectorAll('.btn-dup-edition').forEach(b => {
    b.onclick = () => duplicateRecord(parseInt(b.dataset.idx, 10));
  });
  tbody.querySelectorAll('.btn-del-edition').forEach(b => {
    b.onclick = () => deleteRecord(parseInt(b.dataset.idx, 10));
  });
}

function duplicateRecord(idx) {
  const orig = state.editions[idx];
  if (!orig) return;
  const copy = JSON.parse(JSON.stringify(orig));
  copy.title = `${copy.title} (Copy)`;
  state.editions.splice(idx + 1, 0, copy);
  persistDraft();
  renderManagerTable();
  showToast("Edition duplicated in cellar");
}

function deleteRecord(idx) {
  const item = state.editions[idx];
  if (!confirm(`Are you sure you wish to delete "${item.title || 'Untitled'}"?`)) return;
  state.editions.splice(idx, 1);
  persistDraft();
  renderManagerTable();
  showToast(APP_CONFIG.content.notifications.removedDraft);
}

// ============================================================================
// STEPPED EDITION BUILDER CONTROLLER
// ============================================================================
function openEditorForRecord(idx) {
  state.editingIndex = idx;
  state.currentStep = 1;

  const heading = document.getElementById('editor-heading');
  const badge = document.getElementById('editor-mode-badge');
  const titleInput = document.getElementById('input-puzzle-title');

  if (idx >= 0 && state.editions[idx]) {
    const ed = state.editions[idx];
    heading.textContent = 'Edit Reserve Edition';
    badge.textContent = `Editing #${idx + 1}`;
    badge.className = 'badge-pill badge-pill--ochre';
    titleInput.value = ed.title || '';

    for (let i = 1; i <= 8; i++) {
      const itemInp = document.querySelector(`.pair-item-name[data-pair="${i}"]`);
      const svgVal = document.querySelector(`.pair-svg-val[data-pair="${i}"]`);
      if (itemInp) itemInp.value = ed[`item_${i}`] || '';
      if (svgVal) svgVal.value = ed[`svg_${i}`] || '';
      updatePairAperturePreview(i, ed[`svg_${i}`] || '');
    }
  } else {
    state.editingIndex = -1;
    heading.textContent = 'Compose Reserve Edition';
    badge.textContent = `New #${state.editions.length + 1}`;
    badge.className = 'badge-pill badge-pill--sage';
    titleInput.value = '';

    for (let i = 1; i <= 8; i++) {
      const itemInp = document.querySelector(`.pair-item-name[data-pair="${i}"]`);
      const svgVal = document.querySelector(`.pair-svg-val[data-pair="${i}"]`);
      if (itemInp) itemInp.value = '';
      if (svgVal) svgVal.value = '';
      updatePairAperturePreview(i, '');
    }
  }

  jumpToEditorStep(1);
  navigateToView('view-editor');
}

function jumpToEditorStep(step) {
  state.currentStep = step;
  document.querySelectorAll('.editor-stage-panel').forEach(p => p.classList.add('hidden'));
  const activePanel = document.getElementById(`step-panel-${step}`);
  if (activePanel) activePanel.classList.remove('hidden');

  document.querySelectorAll('.step-pill').forEach(pill => {
    const s = parseInt(pill.dataset.step, 10);
    pill.classList.toggle('active', s === step);
    pill.classList.toggle('completed', s < step);
  });

  if (step === 4) {
    renderStep4Checklist();
    renderSimulatedMiniBoard();
  }
}

function updatePairAperturePreview(pairIdx, svgStr) {
  const aperture = document.getElementById(`pair-preview-${pairIdx}`);
  if (!aperture) return;
  if (svgStr && svgStr.includes('<svg')) {
    aperture.innerHTML = svgStr;
  } else {
    aperture.innerHTML = '<span class="empty-mark">?</span>';
  }
}

function extractEditorData() {
  const title = (document.getElementById('input-puzzle-title').value || '').trim();
  const ed = { title };
  for (let i = 1; i <= 8; i++) {
    const itemInp = document.querySelector(`.pair-item-name[data-pair="${i}"]`);
    const svgVal = document.querySelector(`.pair-svg-val[data-pair="${i}"]`);
    ed[`item_${i}`] = (itemInp ? itemInp.value : '').trim();
    ed[`svg_${i}`] = sanitizeSVG(svgVal ? svgVal.value : '');
  }
  return ed;
}

function saveEditionFromEditor(andAddAnother = false) {
  const data = extractEditorData();
  const audit = auditPuzzleRecord(data);

  if (!audit.isValid) {
    jumpToEditorStep(4);
    showToast(audit.issues[0]);
    return false;
  }

  if (state.editingIndex >= 0) {
    state.editions[state.editingIndex] = data;
    showToast(APP_CONFIG.content.notifications.updatedDraft);
  } else {
    state.editions.push(data);
    showToast(APP_CONFIG.content.notifications.savedDraft);
  }

  persistDraft();
  updateDatasetBadges();

  if (andAddAnother) {
    openEditorForRecord(-1);
  } else {
    navigateToView('view-manager');
  }
  return true;
}

function renderStep4Checklist() {
  const container = document.getElementById('editor-checklist');
  if (!container) return;
  const data = extractEditorData();
  const audit = auditPuzzleRecord(data);
  container.innerHTML = '';

  const titleOk = !!data.title.trim();
  const item1 = document.createElement('div');
  item1.className = `check-item ${titleOk ? 'ok' : 'error'}`;
  item1.innerHTML = `<span>${titleOk ? '✓' : '✗'}</span> <span><strong>Theme Title:</strong> ${titleOk ? escapeHtml(data.title) : 'Missing title'}</span>`;
  container.appendChild(item1);

  let filledCount = 0;
  const names = [];
  for (let i = 1; i <= 8; i++) {
    if (data[`item_${i}`]) {
      filledCount++;
      names.push(data[`item_${i}`].toLowerCase());
    }
  }
  const countOk = filledCount === 8;
  const item2 = document.createElement('div');
  item2.className = `check-item ${countOk ? 'ok' : 'error'}`;
  item2.innerHTML = `<span>${countOk ? '✓' : '✗'}</span> <span><strong>Pairs Count:</strong> ${filledCount} of 8 pairs filled</span>`;
  container.appendChild(item2);

  const uniqueSet = new Set(names);
  const uniqueOk = names.length === 8 && uniqueSet.size === 8;
  const item3 = document.createElement('div');
  item3.className = `check-item ${uniqueOk ? 'ok' : 'error'}`;
  item3.innerHTML = `<span>${uniqueOk ? '✓' : '✗'}</span> <span><strong>Uniqueness Verification:</strong> ${uniqueOk ? 'All 8 names distinct' : 'Duplicate pair names detected'}</span>`;
  container.appendChild(item3);

  let iconCount = 0;
  for (let i = 1; i <= 8; i++) {
    if (data[`svg_${i}`]) iconCount++;
  }
  const iconWarn = iconCount < 8;
  const item4 = document.createElement('div');
  item4.className = `check-item ${iconWarn ? 'warn' : 'ok'}`;
  item4.innerHTML = `<span>${iconWarn ? '⚠' : '✓'}</span> <span><strong>Icon Assignment:</strong> ${iconCount} of 8 pairs have visual SVGs</span>`;
  container.appendChild(item4);
}

function renderSimulatedMiniBoard() {
  const grid = document.getElementById('editor-live-board');
  if (!grid) return;
  grid.innerHTML = '';

  const data = extractEditorData();
  const cards = [];
  for (let i = 1; i <= 8; i++) {
    const cardData = {
      name: data[`item_${i}`] || `Pair ${i}`,
      svg: data[`svg_${i}`] || ''
    };
    cards.push(cardData);
    cards.push(cardData);
  }

  const shuffled = pseudoShuffle(cards, state.boardShuffleSeed);

  shuffled.forEach(c => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'sim-tile flipped';

    tile.innerHTML = `
      <div class="sim-tile-inner">
        <div class="sim-face sim-face-back">
          <span style="font-family:var(--font-serif); font-size:1.1rem;">✦</span>
        </div>
        <div class="sim-face sim-face-front">
          <div class="sim-tile-icon-box">${c.svg || '🍸'}</div>
          <div class="sim-tile-label">${escapeHtml(c.name)}</div>
        </div>
      </div>
    `;

    tile.onclick = () => {
      tile.classList.toggle('flipped');
      triggerHapticPulse();
    };
    grid.appendChild(tile);
  });
}

// ============================================================================
// FULLSCREEN BOARD INSPECTION MODAL
// ============================================================================
function openBoardInspectionModal() {
  const modal = document.getElementById('modal-board-preview');
  const grid = document.getElementById('fullscreen-interactive-grid');
  if (!modal || !grid) return;
  grid.innerHTML = '';

  const data = extractEditorData();
  const cards = [];
  for (let i = 1; i <= 8; i++) {
    const cardData = {
      name: data[`item_${i}`] || `Pair ${i}`,
      svg: data[`svg_${i}`] || ''
    };
    cards.push(cardData);
    cards.push(cardData);
  }

  const shuffled = pseudoShuffle(cards, state.boardShuffleSeed);

  shuffled.forEach(c => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'sim-tile';

    tile.innerHTML = `
      <div class="sim-tile-inner">
        <div class="sim-face sim-face-back">
          <span style="font-family:var(--font-serif); font-size:1.3rem;">✦</span>
        </div>
        <div class="sim-face sim-face-front">
          <div class="sim-tile-icon-box" style="width:28px; height:28px;">${c.svg || '🍸'}</div>
          <div class="sim-tile-label" style="font-size:0.75rem;">${escapeHtml(c.name)}</div>
        </div>
      </div>
    `;

    tile.onclick = () => {
      tile.classList.toggle('flipped');
      triggerHapticPulse();
    };
    grid.appendChild(tile);
  });

  modal.classList.remove('hidden');
}

// ============================================================================
// ICON PICKER & CUSTOM SVG MODALS
// ============================================================================
function openIconPickerForPair(pairIdx) {
  state.pickerPairIndex = pairIdx;
  const modal = document.getElementById('modal-icon-picker');
  const searchInput = document.getElementById('icon-search-input');
  if (searchInput) searchInput.value = '';
  renderIconLibraryGrid('all', '');
  if (modal) modal.classList.remove('hidden');
}

function renderIconLibraryGrid(category = 'all', query = '') {
  const grid = document.getElementById('icons-grid-container');
  if (!grid) return;
  grid.innerHTML = '';

  const q = query.toLowerCase();
  const filtered = ICON_LIBRARY.filter(item => {
    const matchCat = category === 'all' || item.category === category;
    const matchQ = !q || item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  filtered.forEach(icon => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'icon-choice-card';
    card.innerHTML = `
      ${icon.svg}
      <span class="icon-choice-name">${escapeHtml(icon.name)}</span>
    `;
    card.onclick = () => {
      applySelectedIcon(state.pickerPairIndex, icon.svg, icon.name);
      closeAllModals();
    };
    grid.appendChild(card);
  });
}

function applySelectedIcon(pairIdx, svgCode, optName = '') {
  const clean = sanitizeSVG(svgCode);
  const svgVal = document.querySelector(`.pair-svg-val[data-pair="${pairIdx}"]`);
  const nameInp = document.querySelector(`.pair-item-name[data-pair="${pairIdx}"]`);

  if (svgVal) svgVal.value = clean;
  if (nameInp && !nameInp.value.trim() && optName) {
    nameInp.value = optName;
  }
  updatePairAperturePreview(pairIdx, clean);
  showToast(`Pair ${pairIdx} visual token updated`);
}

function openPasteSvgModal(pairIdx) {
  state.pickerPairIndex = pairIdx;
  const modal = document.getElementById('modal-paste-svg');
  const txtArea = document.getElementById('textarea-custom-svg');
  const target = document.getElementById('custom-svg-preview-target');
  const label = document.getElementById('custom-svg-validation-label');
  const applyBtn = document.getElementById('btn-apply-custom-svg');

  if (txtArea) txtArea.value = '';
  if (target) target.innerHTML = '<span class="empty-mark">—</span>';
  if (label) {
    label.textContent = 'Awaiting input...';
    label.style.color = 'var(--color-text-muted)';
  }
  if (applyBtn) applyBtn.disabled = true;

  if (modal) modal.classList.remove('hidden');
}

function validatePastedSvgInput() {
  const txtArea = document.getElementById('textarea-custom-svg');
  const target = document.getElementById('custom-svg-preview-target');
  const label = document.getElementById('custom-svg-validation-label');
  const applyBtn = document.getElementById('btn-apply-custom-svg');
  if (!txtArea || !target || !label) return;

  const raw = txtArea.value.trim();
  if (!raw) {
    target.innerHTML = '<span class="empty-mark">—</span>';
    label.textContent = 'Awaiting input...';
    label.style.color = 'var(--color-text-muted)';
    applyBtn.disabled = true;
    return;
  }

  const sanitized = sanitizeSVG(raw);
  if (sanitized && sanitized.includes('<svg')) {
    target.innerHTML = sanitized;
    label.textContent = '✓ Valid Vector SVG Ready';
    label.style.color = 'var(--color-sage-text)';
    applyBtn.disabled = false;
  } else {
    target.innerHTML = '<span class="empty-mark">✕</span>';
    label.textContent = 'Malformed SVG vector code';
    label.style.color = 'var(--color-terracotta-text)';
    applyBtn.disabled = true;
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-dialog').forEach(m => m.classList.add('hidden'));
}

// ============================================================================
// EXPORT & VALIDATION SUITE
// ============================================================================
function renderExportSuite() {
  const totalEl = document.getElementById('stat-export-total');
  const validEl = document.getElementById('stat-export-valid');
  const issuesEl = document.getElementById('stat-export-issues');
  const banner = document.getElementById('export-validation-msg');

  const total = state.editions.length;
  let validCount = 0;
  let issueCount = 0;

  state.editions.forEach(ed => {
    const audit = auditPuzzleRecord(ed);
    if (audit.isValid) validCount++;
    else issueCount++;
  });

  if (totalEl) totalEl.textContent = total;
  if (validEl) validEl.textContent = validCount;
  if (issuesEl) issuesEl.textContent = issueCount;

  if (banner) {
    if (total === 0) {
      banner.className = 'validation-banner has-errors';
      banner.textContent = 'Cellar is empty. Create or load at least 1 edition before exporting.';
    } else if (issueCount === 0) {
      banner.className = 'validation-banner ready';
      banner.textContent = `✓ All ${total} editions are 100% compliant with the Memory Match engine!`;
    } else {
      banner.className = 'validation-banner has-errors';
      banner.textContent = `⚠ ${issueCount} edition(s) contain validation errors. Puzzles with duplicate labels or missing titles will be rejected by the loader.`;
    }
  }

  renderExportTablePreview();
  renderExportRawCode();
}

function renderExportTablePreview() {
  const tbody = document.getElementById('tbody-export-preview');
  const summary = document.getElementById('txt-preview-summary');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (summary) summary.textContent = `${state.editions.length} rows loaded`;

  state.editions.forEach((ed, idx) => {
    const tr = document.createElement('tr');
    let tokens = '<div class="tokens-inline-cluster">';
    for (let i = 1; i <= 8; i++) {
      tokens += `<span class="paper-token">${escapeHtml(ed[`item_${i}`] || '')}</span>`;
    }
    tokens += '</div>';

    tr.innerHTML = `
      <td><strong>#${idx + 1}</strong></td>
      <td><strong>${escapeHtml(ed.title || 'Untitled')}</strong></td>
      <td>${tokens}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderExportRawCode() {
  const code = document.getElementById('raw-csv-code');
  if (code) code.textContent = CSVEngine.stringify(state.editions);
}

function triggerDownload(content, filename) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'puzzles.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

function exportAllEditions() {
  if (state.editions.length === 0) {
    showToast("No editions to export");
    return;
  }
  const nameInp = document.getElementById('export-filename');
  const filename = (nameInp && nameInp.value.trim()) ? nameInp.value.trim() : 'puzzles.csv';
  triggerDownload(CSVEngine.stringify(state.editions), filename);
  showToast(APP_CONFIG.content.notifications.csvExportSuccess);
}

function exportNewEditionsOnly() {
  const newItems = state.editions.slice(state.originalCount);
  if (newItems.length === 0) {
    showToast("No newly created editions in this session");
    return;
  }
  triggerDownload(CSVEngine.stringify(newItems), 'puzzles_new_additions.csv');
  showToast(`Exported ${newItems.length} new editions`);
}

function copyCsvToClipboard() {
  const csvStr = CSVEngine.stringify(state.editions);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(csvStr).then(() => {
      showToast(APP_CONFIG.content.notifications.clipboardSuccess);
    }).catch(() => fallbackCopy(csvStr));
  } else {
    fallbackCopy(csvStr);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast(APP_CONFIG.content.notifications.clipboardSuccess);
}

// ============================================================================
// CURATED TASTING PRESETS & SAMPLES
// ============================================================================
function loadCuratedSampleData() {
  const samples = [
    {
      title: 'Essential Bar Tools',
      item_1: 'Cocktail Shaker', svg_1: ICON_LIBRARY.find(i => i.id === 'shaker').svg,
      item_2: 'Jigger', svg_2: ICON_LIBRARY.find(i => i.id === 'jigger').svg,
      item_3: 'Hawthorne Strainer', svg_3: ICON_LIBRARY.find(i => i.id === 'strainer').svg,
      item_4: 'Bar Spoon', svg_4: ICON_LIBRARY.find(i => i.id === 'spoon').svg,
      item_5: 'Muddler', svg_5: ICON_LIBRARY.find(i => i.id === 'muddler').svg,
      item_6: 'Mixing Glass', svg_6: ICON_LIBRARY.find(i => i.id === 'mixing_glass').svg,
      item_7: 'Y-Peeler', svg_7: ICON_LIBRARY.find(i => i.id === 'peeler').svg,
      item_8: 'Ice Tongs', svg_8: ICON_LIBRARY.find(i => i.id === 'tongs').svg
    },
    {
      title: 'Iconic Classic Cocktails',
      item_1: 'Martini', svg_1: ICON_LIBRARY.find(i => i.id === 'martini').svg,
      item_2: 'Old Fashioned', svg_2: ICON_LIBRARY.find(i => i.id === 'old_fashioned').svg,
      item_3: 'Margarita', svg_3: ICON_LIBRARY.find(i => i.id === 'margarita').svg,
      item_4: 'Collins Highball', svg_4: ICON_LIBRARY.find(i => i.id === 'highball_glass').svg,
      item_5: 'Daiquiri', svg_5: ICON_LIBRARY.find(i => i.id === 'daiquiri').svg,
      item_6: 'Negroni', svg_6: ICON_LIBRARY.find(i => i.id === 'negroni').svg,
      item_7: 'Manhattan', svg_7: ICON_LIBRARY.find(i => i.id === 'manhattan').svg,
      item_8: 'Espresso Martini', svg_8: ICON_LIBRARY.find(i => i.id === 'espresso_martini').svg
    },
    {
      title: 'Cocktail Glassware Anatomy',
      item_1: 'Coupe Glass', svg_1: ICON_LIBRARY.find(i => i.id === 'coupe').svg,
      item_2: 'Nick and Nora', svg_2: ICON_LIBRARY.find(i => i.id === 'nick_nora').svg,
      item_3: 'Lowball Rocks', svg_3: ICON_LIBRARY.find(i => i.id === 'rocks').svg,
      item_4: 'Champagne Flute', svg_4: ICON_LIBRARY.find(i => i.id === 'flute').svg,
      item_5: 'Snifter Glass', svg_5: ICON_LIBRARY.find(i => i.id === 'snifter').svg,
      item_6: 'Tiki Mug', svg_6: ICON_LIBRARY.find(i => i.id === 'tiki_mug').svg,
      item_7: 'Julep Cup', svg_7: ICON_LIBRARY.find(i => i.id === 'julep_cup').svg,
      item_8: 'Mixing Glass', svg_8: ICON_LIBRARY.find(i => i.id === 'mixing_glass').svg
    },
    {
      title: 'Aromatic Garnishes & Accents',
      item_1: 'Citrus Twist', svg_1: ICON_LIBRARY.find(i => i.id === 'citrus_twist').svg,
      item_2: 'Cocktail Olives', svg_2: ICON_LIBRARY.find(i => i.id === 'olives').svg,
      item_3: 'Luxardo Cherry', svg_3: ICON_LIBRARY.find(i => i.id === 'cherry').svg,
      item_4: 'Slapped Mint', svg_4: ICON_LIBRARY.find(i => i.id === 'mint').svg,
      item_5: 'Dehydrated Lime Wheel', svg_5: ICON_LIBRARY.find(i => i.id === 'lime_wheel').svg,
      item_6: 'Rosemary Herb Spear', svg_6: ICON_LIBRARY.find(i => i.id === 'rosemary').svg,
      item_7: 'Atomizer Spray', svg_7: ICON_LIBRARY.find(i => i.id === 'atomizer').svg,
      item_8: 'Aromatic Bitters', svg_8: ICON_LIBRARY.find(i => i.id === 'bitters_bottle').svg
    },
    {
      title: 'Ice Architecture & Craft',
      item_1: 'Hand-Carved King Cube', svg_1: ICON_LIBRARY.find(i => i.id === 'king_cube').svg,
      item_2: 'Crystal Ice Sphere', svg_2: ICON_LIBRARY.find(i => i.id === 'ice_sphere').svg,
      item_3: 'Collins Ice Spear', svg_3: ICON_LIBRARY.find(i => i.id === 'ice_spear').svg,
      item_4: 'Ice Carving Pick', svg_4: ICON_LIBRARY.find(i => i.id === 'ice_pick').svg,
      item_5: 'Ice Tongs', svg_5: ICON_LIBRARY.find(i => i.id === 'tongs').svg,
      item_6: 'Mixing Glass', svg_6: ICON_LIBRARY.find(i => i.id === 'mixing_glass').svg,
      item_7: 'Julep Strainer', svg_7: ICON_LIBRARY.find(i => i.id === 'julep_strainer').svg,
      item_8: 'Bar Spoon', svg_8: ICON_LIBRARY.find(i => i.id === 'spoon').svg
    }
  ];

  state.editions = samples;
  state.originalCount = samples.length;
  persistDraft();
  navigateToView('view-manager');
  showToast("Loaded 5 curated reserve editions");
}

function quickFillPack(type) {
  if (type === 'tools') {
    const items = ['Cocktail Shaker', 'Japanese Jigger', 'Hawthorne Strainer', 'Bar Spoon'];
    const icons = ['shaker', 'jigger', 'strainer', 'spoon'];
    for (let i = 1; i <= 4; i++) {
      const inp = document.querySelector(`.pair-item-name[data-pair="${i}"]`);
      const svgVal = document.querySelector(`.pair-svg-val[data-pair="${i}"]`);
      const iconDef = ICON_LIBRARY.find(ic => ic.id === icons[i - 1]);
      if (inp) inp.value = items[i - 1];
      if (svgVal && iconDef) {
        svgVal.value = iconDef.svg;
        updatePairAperturePreview(i, iconDef.svg);
      }
    }
    showToast("Barware pack populated into Pairs 1 – 4");
  } else if (type === 'glasses') {
    const items = ['Coupe Glass', 'Nick and Nora', 'Lowball Rocks', 'Julep Cup'];
    const icons = ['coupe', 'nick_nora', 'rocks', 'julep_cup'];
    for (let i = 5; i <= 8; i++) {
      const idx = i - 4;
      const inp = document.querySelector(`.pair-item-name[data-pair="${i}"]`);
      const svgVal = document.querySelector(`.pair-svg-val[data-pair="${i}"]`);
      const iconDef = ICON_LIBRARY.find(ic => ic.id === icons[idx - 1]);
      if (inp) inp.value = items[idx - 1];
      if (svgVal && iconDef) {
        svgVal.value = iconDef.svg;
        updatePairAperturePreview(i, iconDef.svg);
      }
    }
    showToast("Glassware pack populated into Pairs 5 – 8");
  }
}

// ============================================================================
// CSV FILE IMPORT ENGINE
// ============================================================================
function handleCsvUpload(file, mode = 'append') {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const rows = CSVEngine.parse(text);

    if (rows.length < 2) {
      alert("The uploaded CSV contains no records or is empty.");
      return;
    }

    const headers = rows[0].map(h => h.trim().toLowerCase());
    const titleIdx = headers.indexOf('title');

    if (titleIdx === -1) {
      alert('Incompatible CSV file: Missing required "title" column header.');
      return;
    }

    let foundPairs = 0;
    for (let i = 1; i <= 8; i++) {
      if (headers.includes(`item_${i}`) || headers.includes(`item${i}`)) foundPairs++;
    }

    if (foundPairs < 4) {
      alert('Incompatible schema: Memory Match requires 8 pairs (item_1..item_8 and svg_1..svg_8).');
      return;
    }

    const parsed = [];
    const dataRows = rows.slice(1);

    dataRows.forEach(r => {
      const obj = {};
      headers.forEach((h, col) => {
        obj[h] = r[col] || '';
      });

      const normalized = {
        title: obj.title || ''
      };

      for (let i = 1; i <= 8; i++) {
        const itemKey = obj[`item_${i}`] !== undefined ? `item_${i}` : `item${i}`;
        const svgKey = obj[`svg_${i}`] !== undefined ? `svg_${i}` : (obj[`svg${i}`] !== undefined ? `svg${i}` : `icon_${i}`);
        normalized[`item_${i}`] = (obj[itemKey] || '').trim();
        normalized[`svg_${i}`] = sanitizeSVG(obj[svgKey] || '');
      }

      parsed.push(normalized);
    });

    if (mode === 'append' && state.editions.length > 0) {
      state.editions = state.editions.concat(parsed);
      showToast(`Appended ${parsed.length} editions`);
    } else {
      state.editions = parsed;
      state.originalCount = parsed.length;
      showToast(`Loaded ${parsed.length} editions from file`);
    }

    persistDraft();
    navigateToView('view-manager');
  };

  reader.readAsText(file);
}

// ============================================================================
// LOCAL STORAGE PERSISTENCE
// ============================================================================
function persistDraft() {
  try {
    const payload = {
      editions: state.editions,
      originalCount: state.originalCount,
      timestamp: Date.now()
    };
    localStorage.setItem(APP_CONFIG.endpoints.storageKeys.collection, JSON.stringify(payload));
    const draftStatus = document.getElementById('txt-draft-status');
    if (draftStatus) draftStatus.textContent = `Auto-saved at ${new Date().toLocaleTimeString()}`;
  } catch (e) {}
}

function restoreDraft() {
  try {
    const raw = localStorage.getItem(APP_CONFIG.endpoints.storageKeys.collection);
    if (raw) {
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.editions) && data.editions.length > 0) {
        state.editions = data.editions;
        state.originalCount = data.originalCount || 0;
        return true;
      }
    }
  } catch (e) {}
  return false;
}

function clearCellarCollection() {
  if (!confirm("Are you sure you wish to clear all editions in the current cellar?")) return;
  state.editions = [];
  state.originalCount = 0;
  persistDraft();
  navigateToView('view-start');
  showToast("Cellar cleared");
}

// ============================================================================
// UTILITIES & DETERMINISTIC RANDOM
// ============================================================================
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function pseudoShuffle(arr, seed) {
  const copy = [...arr];
  let s = (Math.abs(seed) % 2147483647) || 4242;
  const rng = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// ============================================================================
// DYNAMIC NAVIGATION DOCK HYDRATION
// ============================================================================
function buildBottomDockNavigation() {
  const container = document.getElementById('bottomDockNavItems');
  if (!container) return;
  container.innerHTML = '';

  APP_CONFIG.navigation.items.forEach(item => {
    if (!item.enabled) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-dock-item';
    btn.dataset.targetView = item.viewId;
    btn.innerHTML = `
      ${item.icon}
      <span>${item.label}</span>
      <span class="nav-dock-item__indicator"></span>
    `;

    btn.onclick = () => {
      if (item.viewId === 'view-editor') {
        openEditorForRecord(-1);
      } else {
        navigateToView(item.viewId);
      }
    };
    container.appendChild(btn);
  });
}

// ============================================================================
// EVENT ATTACHMENTS & RUNTIME INITIALIZATION
// ============================================================================
function setupEventListeners() {
  document.getElementById('btnHeaderBack').onclick = handleBackNavigation;
  document.getElementById('btnExportQuick').onclick = () => navigateToView('view-export');

  document.getElementById('btn-start-fresh').onclick = () => {
    state.editions = [];
    state.originalCount = 0;
    openEditorForRecord(-1);
  };

  document.getElementById('input-file-append').onchange = (e) => {
    if (e.target.files && e.target.files[0]) handleCsvUpload(e.target.files[0], 'replace');
  };
  document.getElementById('input-file-audit').onchange = (e) => {
    if (e.target.files && e.target.files[0]) handleCsvUpload(e.target.files[0], 'replace');
  };
  document.getElementById('input-file-merge').onchange = (e) => {
    if (e.target.files && e.target.files[0]) handleCsvUpload(e.target.files[0], 'append');
  };

  document.getElementById('btn-quick-import-more').onclick = () => {
    document.getElementById('input-file-merge').click();
  };

  document.getElementById('btn-load-sample-data').onclick = loadCuratedSampleData;
  document.getElementById('btn-quick-blank-template').onclick = () => {
    const blank = APP_CONFIG.content.schema.headers.join(',') + '\r\n';
    triggerDownload(blank, 'puzzles_template.csv');
    showToast("Blank template downloaded");
  };

  document.getElementById('btn-nav-create-new').onclick = () => openEditorForRecord(-1);
  document.getElementById('btn-nav-export-view').onclick = () => navigateToView('view-export');
  document.getElementById('btn-reset-dataset').onclick = clearCellarCollection;

  document.getElementById('filter-search').oninput = (e) => {
    state.filterSearch = e.target.value;
    renderManagerTable();
  };

  document.getElementById('filter-status').onchange = (e) => {
    state.filterStatus = e.target.value;
    renderManagerTable();
  };

  document.getElementById('btn-back-to-manager').onclick = () => navigateToView('view-manager');
  document.getElementById('btn-save-record').onclick = () => saveEditionFromEditor(false);
  document.getElementById('btn-save-record-final').onclick = () => saveEditionFromEditor(false);
  document.getElementById('btn-save-and-add-another').onclick = () => saveEditionFromEditor(true);

  document.querySelectorAll('.step-pill').forEach(pill => {
    pill.onclick = () => jumpToEditorStep(parseInt(pill.dataset.step, 10));
  });

  document.querySelectorAll('.btn-next-step').forEach(btn => {
    btn.onclick = () => jumpToEditorStep(parseInt(btn.dataset.target, 10));
  });
  document.querySelectorAll('.btn-prev-step').forEach(btn => {
    btn.onclick = () => jumpToEditorStep(parseInt(btn.dataset.target, 10));
  });

  document.querySelectorAll('.filter-chip[data-title]').forEach(chip => {
    chip.onclick = () => {
      const inp = document.getElementById('input-puzzle-title');
      if (inp) inp.value = chip.dataset.title;
    };
  });

  document.getElementById('btn-quick-fill-tools').onclick = () => quickFillPack('tools');
  document.getElementById('btn-quick-fill-glasses').onclick = () => quickFillPack('glasses');

  document.querySelectorAll('.btn-open-picker').forEach(b => {
    b.onclick = () => openIconPickerForPair(parseInt(b.dataset.pair, 10));
  });
  document.querySelectorAll('.btn-paste-custom-svg').forEach(b => {
    b.onclick = () => openPasteSvgModal(parseInt(b.dataset.pair, 10));
  });
  document.querySelectorAll('.btn-clear-icon').forEach(b => {
    b.onclick = () => {
      const p = parseInt(b.dataset.pair, 10);
      const svgVal = document.querySelector(`.pair-svg-val[data-pair="${p}"]`);
      if (svgVal) svgVal.value = '';
      updatePairAperturePreview(p, '');
    };
  });

  document.getElementById('textarea-custom-svg').oninput = validatePastedSvgInput;
  document.getElementById('btn-apply-custom-svg').onclick = () => {
    const code = document.getElementById('textarea-custom-svg').value;
    applySelectedIcon(state.pickerPairIndex, code);
    closeAllModals();
  };

  document.getElementById('btn-editor-preview-board').onclick = openBoardInspectionModal;
  document.getElementById('btn-fullscreen-shuffle').onclick = () => {
    state.boardShuffleSeed = Math.floor(Math.random() * 99999);
    openBoardInspectionModal();
  };
  document.getElementById('btn-shuffle-preview').onclick = () => {
    state.boardShuffleSeed = Math.floor(Math.random() * 99999);
    renderSimulatedMiniBoard();
  };

  document.getElementById('icon-search-input').oninput = (e) => {
    const activeChip = document.querySelector('.filter-chip-tray .filter-chip--active');
    const cat = activeChip ? activeChip.dataset.cat : 'all';
    renderIconLibraryGrid(cat, e.target.value);
  };

  document.querySelectorAll('.filter-chip-tray .filter-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.filter-chip-tray .filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
      const q = document.getElementById('icon-search-input').value;
      renderIconLibraryGrid(chip.dataset.cat, q);
    };
  });

  document.getElementById('btn-back-from-export').onclick = () => navigateToView('view-manager');
  document.getElementById('btn-do-export-all').onclick = exportAllEditions;
  document.getElementById('btn-do-export-new-only').onclick = exportNewEditionsOnly;
  document.getElementById('btn-copy-csv-clipboard').onclick = copyCsvToClipboard;

  document.getElementById('tab-btn-friendly').onclick = () => {
    document.getElementById('tab-btn-friendly').classList.add('active');
    document.getElementById('tab-btn-raw').classList.remove('active');
    document.getElementById('tab-content-friendly').classList.remove('hidden');
    document.getElementById('tab-content-raw').classList.add('hidden');
  };

  document.getElementById('tab-btn-raw').onclick = () => {
    document.getElementById('tab-btn-raw').classList.add('active');
    document.getElementById('tab-btn-friendly').classList.remove('active');
    document.getElementById('tab-content-raw').classList.remove('hidden');
    document.getElementById('tab-content-friendly').classList.add('hidden');
    renderExportRawCode();
  };

  document.querySelectorAll('.modal-dismiss').forEach(btn => {
    btn.onclick = closeAllModals;
  });
  document.querySelectorAll('.modal-backdrop').forEach(b => {
    b.onclick = closeAllModals;
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

function initApplication() {
  buildBottomDockNavigation();
  setupEventListeners();

  const copyright = document.getElementById('footerCopyright');
  if (copyright) {
    copyright.textContent = `${APP_CONFIG.content.legal.copyrightHolder} \u00A9 ${APP_CONFIG.content.legal.establishedYear}. All rights reserved.`;
  }

  const restored = restoreDraft();
  if (restored && state.editions.length > 0) {
    navigateToView('view-manager');
    showToast(`Restored ${state.editions.length} editions from browser session`);
  } else {
    navigateToView('view-start');
  }
}

document.addEventListener('DOMContentLoaded', initApplication);