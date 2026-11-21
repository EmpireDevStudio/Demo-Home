/**
 * =========================================================================
 * SERVICE WORKER (sw.js)
 * Offline-First & Installable PWA Caching Engine
 * =========================================================================
 */

const CACHE_VERSION = "training-workspace-v1";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Essential shell files required for offline boot
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./logo.png",
];

// Icon assets cached opportunistically so missing sizes won't block SW install
const ICON_ASSETS = [
  "./icons/favicon-16x16.png",
  "./icons/favicon-32x32.png",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./icons/icon-maskable-192x192.png",
  "./icons/icon-maskable-512x512.png",
];

/**
 * Install: Precache core app shell and icons
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE);
      const allAssets = [...CORE_ASSETS, ...ICON_ASSETS];
      const results = await Promise.allSettled(
        allAssets.map((url) =>
          cache.add(new Request(url, { cache: "reload" }))
        )
      );
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.warn("SW precache failed for:", allAssets[index], result.reason);
        }
      });
      await self.skipWaiting();
    })()
  );
});

/**
 * Activate: Purge outdated caches and take immediate control of clients
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CORE_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

/**
 * Fetch:
 * - Same-origin GET requests only
 * - Navigations: Network-First with cache fallback (and ./index.html fallback)
 * - Static assets: Stale-While-Revalidate
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip partial range requests (e.g., video streaming)
  if (request.headers.has("range")) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  event.respondWith(handleAssetRequest(request));
});

async function handleNavigationRequest(request) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      runtimeCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (_) {
    const cachedPage = await caches.match(request);
    if (cachedPage) return cachedPage;

    const fallbackShell = await caches.match("./index.html");
    if (fallbackShell) return fallbackShell;

    return new Response("Offline — please reconnect to load this page.", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

async function handleAssetRequest(request) {
  const cached = await caches.match(request);

  const networkPromise = fetch(request)
    .then(async (networkResponse) => {
      // Only cache complete 200 OK responses (avoids 206 partial or error responses)
      if (networkResponse && networkResponse.status === 200) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response("", { status: 504, statusText: "Offline" });
}

/**
 * Message handler: Allow client to trigger immediate activation
 */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});