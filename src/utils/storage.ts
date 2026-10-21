import { SiteConfig } from '../types';

const DB_NAME = 'BirthdayBloomDB';
const DB_VERSION = 1;
const STORE_NAME = 'site_config';
const CONFIG_KEY = 'current_active_config';
const LOCAL_STORAGE_KEY = 'birthday_memory_bloom_config_v5';

// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Save site config to IndexedDB (unlimited storage) + localStorage (fast cache)
 */
export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  // 1. Save to IndexedDB (guaranteed capacity for photos & text)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(config, CONFIG_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB:', err);
  }

  // 2. Also try localStorage as secondary backup
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    // If localStorage quota exceeded, IndexedDB has already safely saved it
    console.info('LocalStorage quota reached, saved safely in IndexedDB');
  }
}

/**
 * Load site config from IndexedDB or localStorage
 */
export async function loadSiteConfig(): Promise<SiteConfig | null> {
  // 1. Try IndexedDB first (most reliable, holds full uncompressed data)
  try {
    const db = await openDB();
    const config = await new Promise<SiteConfig | null>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CONFIG_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });

    if (config) {
      return config;
    }
  } catch (err) {
    console.warn('Could not read from IndexedDB, falling back to localStorage:', err);
  }

  // 2. Fallback to localStorage
  try {
    const localSaved =
      localStorage.getItem(LOCAL_STORAGE_KEY) ||
      localStorage.getItem('birthday_memory_bloom_config_v4') ||
      localStorage.getItem('birthday_memory_bloom_config_v3') ||
      localStorage.getItem('birthday_memory_bloom_config_v1');

    if (localSaved) {
      return JSON.parse(localSaved);
    }
  } catch (err) {
    console.warn('Could not read from localStorage:', err);
  }

  return null;
}

/**
 * Synchronous initial read from localStorage for instant render
 */
export function getInitialLocalConfig(): SiteConfig | null {
  try {
    const localSaved =
      localStorage.getItem(LOCAL_STORAGE_KEY) ||
      localStorage.getItem('birthday_memory_bloom_config_v4') ||
      localStorage.getItem('birthday_memory_bloom_config_v3') ||
      localStorage.getItem('birthday_memory_bloom_config_v1');

    if (localSaved) {
      return JSON.parse(localSaved);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Clear saved config from both IndexedDB and localStorage
 */
export async function clearSiteConfig(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CONFIG_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not clear IndexedDB:', err);
  }

  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem('birthday_memory_bloom_config_v4');
    localStorage.removeItem('birthday_memory_bloom_config_v3');
    localStorage.removeItem('birthday_memory_bloom_config_v1');
  } catch {
    // ignore
  }
}

/**
 * Save current active browser config directly to repository files in dev mode
 */
export async function saveConfigToProjectFiles(config: SiteConfig): Promise<boolean> {
  try {
    const res = await fetch('/api/save-defaults', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Generate a shareable URL containing the complete config for instant mobile sync
 */
export function exportConfigToShareUrl(config: SiteConfig): string {
  try {
    const json = JSON.stringify(config);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    const url = new URL(window.location.href);
    url.hash = `cfg=${encoded}`;
    return url.toString();
  } catch (err) {
    console.error('Failed to encode share URL', err);
    return window.location.href;
  }
}

/**
 * Check if the current page URL has an imported config and decode it
 */
export function importConfigFromUrl(): SiteConfig | null {
  try {
    if (typeof window === 'undefined') return null;
    const hash = window.location.hash;
    if (hash && hash.startsWith('#cfg=')) {
      const encoded = hash.slice(5);
      const json = decodeURIComponent(escape(atob(encoded)));
      const parsed = JSON.parse(json);
      // Clean hash from URL for cleaner look
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return parsed;
    }
  } catch (err) {
    console.warn('Could not parse config from URL hash:', err);
  }
  return null;
}

