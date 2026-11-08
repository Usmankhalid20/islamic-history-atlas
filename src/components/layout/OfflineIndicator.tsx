"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initial check
    setIsOffline(!navigator.onLine);

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-xl border shadow-lg text-xs font-medium backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
        isOffline
          ? "bg-amber-500/90 text-white border-amber-600"
          : "bg-emerald-600/95 text-white border-emerald-700"
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-4 h-4 animate-pulse" aria-hidden="true" />
          <span>Working Offline — Serving Cached Cartography</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" aria-hidden="true" />
          <span>Connection Restored — Online</span>
        </>
      )}
    </div>
  );
}
