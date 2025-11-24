// src/components/ClearCache/ClearCeche.js
// Patched: never clears cache on BuildingComputers route; clears once-per-session elsewhere,
// and preserves critical session/localStorage keys used by that page.

import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

/** Routes that must NOT be cleared (prefix match) */
const ALLOWLIST_PREFIXES = ["/agent-smith/building-computers"];

/** Keys we should preserve if/when we clear storage */
const PRESERVE_KEYS = ["pcv_seen", "pcv_mountKey"];

export default function ClearCeche() {
  const { pathname } = useLocation();
  const clearedOnceRef = useRef(false);

  const isWhitelisted = ALLOWLIST_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isWhitelisted) {
      // Do not touch caches or storage while on the 3D page to avoid race conditions.
      // console.debug("[Cache] Skipping clear on whitelisted route:", pathname);
      return;
    }

    // Only attempt a clear once per session (first mount on a non-whitelisted route)
    if (clearedOnceRef.current) return;
    clearedOnceRef.current = true;

    clearClientCacheSoft({ preserveKeys: PRESERVE_KEYS }).catch((e) => {
      // eslint-disable-next-line no-console
      console.warn("[Cache] Soft clear failed:", e);
    });
  }, [pathname, isWhitelisted]);

  return null;
}

/* ─────────────────────────────────────────────── */
/* Cache clearing ops                             */
/* ─────────────────────────────────────────────── */

/**
 * Soft client cache clear that avoids nuking state used by critical pages.
 * - Clears Cache Storage
 * - Unregisters service workers
 * - Clears sessionStorage but re-instates specific keys
 * - Removes known localStorage blobs (e.g., redux-persist) and re-instates preserved keys
 */
export async function clearClientCacheSoft({ preserveKeys = [] } = {}) {
  // Cache Storage (best-effort)
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Cache] CacheStorage clear failed", e);
  }

  // sessionStorage — clear then restore preserved items
  try {
    const snap = new Map(
      preserveKeys.map((k) => [k, window.sessionStorage.getItem(k)])
    );
    window.sessionStorage.clear();
    snap.forEach((v, k) => {
      if (v !== null) window.sessionStorage.setItem(k, v);
    });
  } catch (e) {
    // ignore
  }

  // localStorage — remove known heavy entries, but keep preserved keys intact
  try {
    const snap = new Map(
      preserveKeys.map((k) => [k, window.localStorage.getItem(k)])
    );

    // Remove only known "big" or ephemeral entries to avoid surprising the app
    const maybeKeys = ["persist:root", "reduxPersist:root", "APP_CACHE_VERSION"];
    maybeKeys.forEach((k) => {
      try {
        if (window.localStorage.getItem(k) !== null) {
          window.localStorage.removeItem(k);
        }
      } catch {}
    });

    // Re-instate preserved items
    snap.forEach((v, k) => {
      if (v !== null) window.localStorage.setItem(k, v);
    });
  } catch (e) {
    // ignore
  }

  // Service workers — unregister all (best-effort)
  try {
    if (navigator.serviceWorker?.getRegistrations) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    }
  } catch (e) {
    // ignore
  }

  // eslint-disable-next-line no-console
  console.log("[Cache] Soft clear completed.");
}
