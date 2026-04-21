// ===== PLAYERS DATA (MANUAL) =====

let players = [
  {
    id: 1,
    username: "Rank-8_RK",
    title: "RKGM",
    titleFull: "Racing Kings Grandmaster",
    titles: ["RKGM"],
    specialTitles: [],
    mainTitle: "RKGM",
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
    username: "Mysterious_Past",
    title: "RKM",
    titleFull: "Racing Kings Master",
    titles: ["RKM"],
    specialTitles: [],
    mainTitle: "RKM",
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
    username: "spidermandavi",
    title: "RKK",
    titleFull: "Racing Kings King",
    titles: ["RKK"],
    specialTitles: ["RKV"],
    mainTitle: "RKK",
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
  },
  {
    id: 4,
    username: "RoyalManiac",
    title: "RKCM",
    titleFull: "Racing Kings Candidate Master",
    titles: ["RKCM"],
    specialTitles: [],
    mainTitle: "RKCM",
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

// Main titles only.
// Higher number = higher rank.
const titleOrder = {
  RKSGM: 7,
  RKGM: 6,
  RKM: 5,
  RKCM: 4,
  RKC: 3,
  RKI: 2,
  RKE: 2, // backward-compatible alias for old spelling/use
  RKB: 1,
  NONE: 0
};

// Special titles only.
const specialTitleOrder = {
  RKV: 2,
  RKHM: 1
};

// RKK is a top status that sits above everything else.
const kingTitle = "RKK";

// ===== TITLE HELPERS =====

function normalizeTitle(value) {
  return String(value || "").trim().toUpperCase();
}

function getPlayerTitles(player) {
  const titles = [];

  if (Array.isArray(player?.titles)) {
    titles.push(...player.titles);
  }

  if (Array.isArray(player?.specialTitles)) {
    titles.push(...player.specialTitles);
  }

  if (typeof player?.title === "string" && player.title && player.title !== "NONE") {
    titles.push(player.title);
  }

  if (typeof player?.mainTitle === "string" && player.mainTitle && player.mainTitle !== "NONE") {
    titles.push(player.mainTitle);
  }

  return [...new Set(titles.map(normalizeTitle).filter(Boolean))];
}

function getMainTitle(player) {
  const titles = getPlayerTitles(player);

  // Prefer explicit mainTitle if it is a main title.
  const explicitMain = normalizeTitle(player?.mainTitle);
  if (titleOrder[explicitMain] > 0) {
    return explicitMain;
  }

  // Fall back to any title that is part of the main ladder.
  const found = titles.find(t => titleOrder[t] > 0 && t !== kingTitle);
  return found || "NONE";
}

function getSpecialTitles(player) {
  const titles = getPlayerTitles(player);
  return titles.filter(t => specialTitleOrder[t] > 0);
}

function hasKingTitle(player) {
  return getPlayerTitles(player).includes(kingTitle);
}

function getMainTitleRank(player) {
  return titleOrder[getMainTitle(player)] || 0;
}

function getSpecialTitleRank(player) {
  const specials = getSpecialTitles(player);
  let best = 0;

  for (const t of specials) {
    best = Math.max(best, specialTitleOrder[t] || 0);
  }

  return best;
}

function getWorldChampionshipWins(player) {
  return Number(player?.worldChampionshipWins || 0);
}

function getSortMetrics(player) {
  return {
    isKing: hasKingTitle(player) ? 1 : 0,
    worldChampionshipWins: getWorldChampionshipWins(player),
    mainRank: getMainTitleRank(player),
    specialRank: getSpecialTitleRank(player),
    rating: Number(player?.rating || 0),
    bestRatedWin: Number(player?.bestRatedWin || 0),
    gamesPlayed: Number(player?.gamesPlayed || 0),
    username: String(player?.username || "")
  };
}

// ===== SORT PLAYERS =====

function sortPlayers(list) {
  return [...list].sort((a, b) => {
    // 1. Rank override (manual priority)
    if (a.rankOverride != null && b.rankOverride != null) {
      return a.rankOverride - b.rankOverride;
    }
    if (a.rankOverride != null) return -1;
    if (b.rankOverride != null) return 1;

    const A = getSortMetrics(a);
    const B = getSortMetrics(b);

    // 2. RKK always comes first
    if (A.isKing !== B.isKing) return B.isKing - A.isKing;

    // 3. If both are RKK, compare WC wins first
    if (A.isKing && B.isKing && A.worldChampionshipWins !== B.worldChampionshipWins) {
      return B.worldChampionshipWins - A.worldChampionshipWins;
    }

    // 4. Main title priority
    if (A.mainRank !== B.mainRank) return B.mainRank - A.mainRank;

    // 5. Special title priority, but only after main titles match
    if (A.specialRank !== B.specialRank) return B.specialRank - A.specialRank;

    // 6. Rating (higher first)
    if (A.rating !== B.rating) return B.rating - A.rating;

    // 7. Best rated win
    if (A.bestRatedWin !== B.bestRatedWin) return B.bestRatedWin - A.bestRatedWin;

    // 8. Games played
    if (A.gamesPlayed !== B.gamesPlayed) return B.gamesPlayed - A.gamesPlayed;

    // 9. Stable fallback
    return A.username.localeCompare(B.username);
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
  return players.filter(p => {
    const titles = getPlayerTitles(p);
    return titles.some(t => t !== "NONE");
  });
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
