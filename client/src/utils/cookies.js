/* Tiny cookie utility — no external package needed */

export function setCookie(name, value, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  if (!m) return null;
  try { return JSON.parse(decodeURIComponent(m[1])); } catch { return null; }
}

export function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

/* ── Named helpers ── */

/** Remember user's preferred area for 30 days */
export function saveAreaPref(area)  { setCookie('kg_area', area, 30); }
export function getAreaPref()       { return getCookie('kg_area'); }

/** Store last 5 searches (session: 7 days) */
export function addSearchHistory(q) {
  const prev = getCookie('kg_searches') || [];
  const next = [q, ...prev.filter((x) => x !== q)].slice(0, 5);
  setCookie('kg_searches', next, 7);
}
export function getSearchHistory()  { return getCookie('kg_searches') || []; }

/** Store last 5 viewed worker IDs + names (7 days) */
export function addRecentWorker(id, name, category) {
  const prev = getCookie('kg_recent') || [];
  const next = [{ id, name, category }, ...prev.filter((x) => x.id !== id)].slice(0, 5);
  setCookie('kg_recent', next, 7);
}
export function getRecentWorkers()  { return getCookie('kg_recent') || []; }
