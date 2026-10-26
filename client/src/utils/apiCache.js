// Client-side API cache with localStorage persistence to prevent flickers on page refresh
const memoryCache = new Map();
const inflight = new Map();
const STORAGE_PREFIX = "bp_cache_";

function getFromStorage(url) {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + url);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveToStorage(url, data) {
  if (typeof window === "undefined" || !data) return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + url, JSON.stringify(data));
  } catch {}
}

/**
 * Returns cached data from in-memory cache or localStorage synchronously.
 */
export function getCached(url) {
  if (memoryCache.has(url)) {
    return memoryCache.get(url);
  }
  const persisted = getFromStorage(url);
  if (persisted !== null) {
    memoryCache.set(url, persisted);
    return persisted;
  }
  return null;
}

export function setCached(url, data) {
  memoryCache.set(url, data);
  saveToStorage(url, data);
}

/**
 * Fetches JSON from a URL, saving to memory and localStorage.
 * Deduplicates concurrent requests to the same URL.
 * Falls back to cached data if the network request fails.
 */
export async function fetchWithCache(url, options = {}) {
  if (inflight.has(url)) {
    return inflight.get(url);
  }

  const promise = (async () => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return getCached(url);
      const text = await res.text();
      const data = JSON.parse(text);
      if (data !== null && data !== undefined) {
        memoryCache.set(url, data);
        saveToStorage(url, data);
      }
      return data;
    } catch (err) {
      console.error(`fetchWithCache error for ${url}:`, err);
      return getCached(url);
    } finally {
      inflight.delete(url);
    }
  })();

  inflight.set(url, promise);
  return promise;
}

/**
 * Clears memory and persistent cache.
 */
export function clearCache(url) {
  if (url) {
    memoryCache.delete(url);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_PREFIX + url);
      } catch {}
    }
  } else {
    memoryCache.clear();
    if (typeof window !== "undefined") {
      try {
        const keys = Object.keys(window.localStorage);
        for (const k of keys) {
          if (k.startsWith(STORAGE_PREFIX)) {
            window.localStorage.removeItem(k);
          }
        }
      } catch {}
    }
  }
}
