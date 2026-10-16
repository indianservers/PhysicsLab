/** Storage may be disabled or full. Optional local saves must not crash a lesson. */
export const safeStorage = {
  getItem(key: string): string | null { try { return localStorage.getItem(key); } catch { return null; } },
  setItem(key: string, value: string): boolean { try { localStorage.setItem(key, value); return true; } catch { return false; } },
  removeItem(key: string): boolean { try { localStorage.removeItem(key); return true; } catch { return false; } },
  readJSON<T>(key: string, fallback: T): T { try { const raw = this.getItem(key); return raw === null ? fallback : JSON.parse(raw) as T; } catch { return fallback; } },
  writeJSON(key: string, value: unknown): boolean { try { return this.setItem(key, JSON.stringify(value)); } catch { return false; } },
};
