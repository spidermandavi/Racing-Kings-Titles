// ===== PLAYERS DATA (MANUAL) =====

let players = [
  {
    id: 1,
    username: "Player1",
    title: "RKGM",
    titleFull: "Racing Kings Grandmaster",
    titleAwarded: "2026-04-10",
    bestRatedWin: 2450,
    note: "Top RK player",
    rankOverride: null,
    rating: null,
    peakRating: null,
    gamesPlayed: null,
    winRate: null,
    country: null,
    history: []
  },
  {
    id: 2,
    username: "Player2",
    title: "RKM",
    titleFull: "Racing Kings Master",
    titleAwarded: "2026-03-22",
    bestRatedWin: 2300,
    note: "Aggressive style",
    rankOverride: null,
    rating: null,
    peakRating: null,
    gamesPlayed: null,
    winRate: null,
    country: null,
    history: []
  },
  {
    id: 3,
    username: "Player3",
    title: "RKCM",
    titleFull: "Candidate Master",
    titleAwarded: "2026-02-15",
    bestRatedWin: 2100,
    note: "",
    rankOverride: null,
    rating: null,
    peakRating: null,
    gamesPlayed: null,
    winRate: null,
    country: null,
    history: []
  }
];

// ===== TITLE PRIORITY =====

const titleOrder = {
  RKGM: 4,
  RKM: 3,
  RKCM: 2,
  RKE: 1,
  NONE: 0
};

// ===== SORT PLAYERS =====

function sortPlayers(list) {
  return [...list].sort((a, b) => {
    // 1. Rank override (manual priority)
    if (a.rankOverride != null && b.rankOverride != null) {
      return a.rankOverride - b.rankOverride;
    }
    if (a.rankOverride != null) return -1;
    if (b.rankOverride != null) return 1;

    // 2. Title priority
    const titleDiff = (titleOrder[b.title] || 0) - (titleOrder[a.title] || 0);
    if (titleDiff !== 0) return titleDiff;

    // 3. Rating (higher first)
    return (b.rating || 0) - (a.rating || 0);
  });
}

// ===== CACHE =====

let playerCache = {};
const CACHE_PREFIX = "rk_cache_";

function cacheKey(username) {
  return CACHE_PREFIX + String(username).toLowerCase();
}

// Get cached player data
function getCachedPlayer(username) {
  const key = cacheKey(username);

  if (playerCache[key]) {
    return playerCache[key];
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    playerCache[key] = parsed;
    return parsed;
  } catch (err) {
    console.warn("Could not read player cache:", err);
    return null;
  }
}

// Save to cache
function setCachedPlayer(username, data) {
  const key = cacheKey(username);
  playerCache[key] = data;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn("Could not save player cache:", err);
  }
}

// Clear cache (used by reload button)
function clearCache() {
  playerCache = {};

  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn("Could not clear local cache:", err);
  }

  // Also reset dynamic fields
  players.forEach(p => {
    p.rating = null;
    p.peakRating = null;
    p.gamesPlayed = null;
    p.winRate = null;
    p.country = null;
  });
}

// Find player in manual list
function findPlayer(username) {
  const target = String(username).toLowerCase();
  return players.find(p => p.username.toLowerCase() === target);
}

function getTitledPlayers() {
  return players.filter(p => p.title && p.title !== "NONE");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => {
    return ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[ch];
  });
}
