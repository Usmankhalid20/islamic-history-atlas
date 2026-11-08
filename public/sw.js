// Islamic History Atlas - Service Worker v1.0.0
const CACHE_NAME = "islamic-history-atlas-v1";

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/events",
  "/campaigns",
  "/routes",
  "/monuments",
  "/scholars",
  "/rulers",
  "/polities",
  "/compare",
  "/uncertainty",
  "/sources",
];

// Install Event: Precache core application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Precache error handled gracefully
        console.warn("[SW] Precache notice:", err);
      })
  );
});

// Activate Event: Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch Event: Intelligent offline caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // 1. Next.js Static Chunks & Assets: Cache-First
  if (url.pathname.startsWith("/_next/static/") || url.pathname.endsWith(".png") || url.pathname.endsWith(".svg")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 2. Map Tiles: Stale-While-Revalidate for offline cartography
  if (url.hostname.includes("cartocdn.com") || url.hostname.includes("openstreetmap.org")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. Application Pages & API Queries: Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          if (request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/");
          }
          return new Response(JSON.stringify({ error: "Offline: Network unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        });
      })
  );
});
