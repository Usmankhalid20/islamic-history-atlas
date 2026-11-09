"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(() => {
            // Service worker successfully registered in production
          })
          .catch((err) => {
            console.warn("ServiceWorker registration failed:", err);
          });
      });
    } else {
      // In development mode, automatically unregister active service workers and flush stale caches
      // to prevent caching old JS bundles (like stale map tile providers) and broken HMR chunks.
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });

      if ("caches" in window) {
        caches.keys().then((cacheNames) => {
          for (const cacheName of cacheNames) {
            caches.delete(cacheName);
          }
        });
      }
    }
  }, []);

  return null;
}
