const TITLE_ORDER = {
  RKWC: 1,
  RKSGM: 2,
  RKGM: 3,
  RKIM: 4,
  RKM: 5,
  RKCM: 6,
  RKV: 7,
  RKHM: 8,
  Member: 9
};

const TITLE_CLASS = {
  RKWC: "title-rkwc",
  RKSGM: "title-rksgm",
  RKGM: "title-rkgm",
  RKIM: "title-rkim",
  RKM: "title-rkm",
  RKCM: "title-rkcm",
  RKV: "title-rkv",
  RKHM: "title-rkhm",
  Member: "title-member"
};

const LICHESS_RK_TOP_URL = "https://lichess.org/player/top/racingKings";
const TOP10_CACHE_KEY = "rk-top10-cache-v1";
const TOP10_CACHE_MS = 60 * 1000;

let titlePlayers = [];
let top10Players = [];
let ratingCache = new Map();

const els = {
  mode: document.getElementById("modeFilter"),
  title: document.getElementById("titleFilter"),
  country: document.getElementById("countryFilter"),
  sort: document.getElementById("sortFilter"),
  body: document.getElementById("leaderboardBody")
};

function getMainTitle(player) {
  return player?.currentTitles?.main?.[0] || "Member";
}

function getSpecialTitles(player) {
  return Array.isArray(player?.currentTitles?.special) ? player.currentTitles.special : [];
}

function titleSortValue(player) {
  return TITLE_ORDER[getMainTitle(player)] ?? 999;
}

function titleBadgeClass(title) {
  return TITLE_CLASS[title] || TITLE_CLASS.Member;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function playerProfileLink(player) {
  if (player?.playerId) {
    return `profile.html?id=${encodeURIComponent(player.playerId)}`;
  }
  if (player?.player) {
    return `https://lichess.org/@/${encodeURIComponent(player.player)}`;
  }
  return "#";
}

function renderBadge(title) {
  return `<span class="title-badge ${titleBadgeClass(title)}">${escapeHtml(title)}</span>`;
}

function parseJoinedDate(joined) {
  const d = new Date(joined);
  return Number.isNaN(d.getTime()) ? 0 : d.getTime();
}

async function fetchLichessRating(username) {
  if (!username) return 0;

  if (ratingCache.has(username)) {
    return ratingCache.get(username);
  }

  try {
    const res = await fetch(`https://lichess.org/api/user/${encodeURIComponent(username)}`);
    if (!res.ok) throw new Error(`Lichess user fetch failed: ${res.status}`);
    const data = await res.json();
    const rating = data?.perfs?.racingKings?.rating ?? 0;
    ratingCache.set(username, rating);
    return rating;
  } catch {
    ratingCache.set(username, 0);
    return 0;
  }
}

async function enrichTitlePlayerRatings(players) {
  await Promise.all(
    players.map(async player => {
      player.rating = await fetchLichessRating(player.player);
    })
  );
}

function populateCountries(players) {
  const countries = [...new Set(players.map(p => p.country).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  const existing = new Set([...els.country.options].map(opt => opt.value));
  countries.forEach(country => {
    if (existing.has(country)) return;
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    els.country.appendChild(option);
  });
}

function applyTitleFilters(players) {
  let filtered = [...players];

  const titleFilter = els.title.value;
  const countryFilter = els.country.value;
  const sort = els.sort.value;

  if (titleFilter !== "all") {
    filtered = filtered.filter(player => getMainTitle(player) === titleFilter);
  }

  if (countryFilter !== "all") {
    filtered = filtered.filter(player => player.country === countryFilter);
  }

  if (sort === "title") {
    filtered.sort((a, b) => titleSortValue(a) - titleSortValue(b));
  } else if (sort === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === "country") {
    filtered.sort((a, b) => (a.country || "").localeCompare(b.country || ""));
  } else if (sort === "joined") {
    filtered.sort((a, b) => parseJoinedDate(a.joined) - parseJoinedDate(b.joined));
  }

  return filtered;
}

function renderTitleLeaderboard() {
  const rows = applyTitleFilters(titlePlayers);

  if (!rows.length) {
    els.body.innerHTML = `<tr><td colspan="5">No players match these filters.</td></tr>`;
    return;
  }

  els.body.innerHTML = rows
    .map((player, index) => {
      const main = getMainTitle(player);
      const specials = getSpecialTitles(player);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <a class="player-link" href="${playerProfileLink(player)}">
              ${escapeHtml(player.player)}
            </a>
          </td>
          <td>${escapeHtml(player.country || "")}</td>
          <td>${Number(player.rating || 0)}</td>
          <td>
            ${renderBadge(main)}
            ${specials.map(renderBadge).join(" ")}
          </td>
        </tr>
      `;
    })
    .join("");
}

function parseTopLeaderboardHTML(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const text = (doc.body?.innerText || "").replace(/\u00a0/g, " ");
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  const rows = [];

  for (const line of lines) {
    // Matches rows like: "1 RoyalManiac 2609 7"
    // or: "101 gooliver10 2005 33"
    const m = line.match(/^(\d{1,3})\s+([A-Za-z0-9_\-]+)\s+(\d{3,4})(?:\s+\d+)?$/);
    if (!m) continue;

    rows.push({
      rank: Number(m[1]),
      username: m[2],
      rating: Number(m[3])
    });
  }

  return rows;
}

function readTop10Cache() {
  try {
    const raw = localStorage.getItem(TOP10_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !Array.isArray(parsed?.rows)) return null;

    if (Date.now() - parsed.ts > TOP10_CACHE_MS) return null;
    return parsed.rows;
  } catch {
    return null;
  }
}

function writeTop10Cache(rows) {
  try {
    localStorage.setItem(
      TOP10_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), rows })
    );
  } catch {
    // ignore storage failures
  }
}

async function fetchTop10FromLichess() {
  const cached = readTop10Cache();
  if (cached && cached.length >= 10) {
    return cached.slice(0, 10);
  }

  const page1 = await fetch(`${LICHESS_RK_TOP_URL}`)
    .then(res => {
      if (!res.ok) throw new Error(`Top leaderboard fetch failed: ${res.status}`);
      return res.text();
    });

  let rows = parseTopLeaderboardHTML(page1);

  // Page 2 continues the ranking list starting at 101.
  // We only need the first 10 for this mode, but this also proves the page is paginated.
  if (rows.length < 10) {
    const page2 = await fetch(`${LICHESS_RK_TOP_URL}?page=2`)
      .then(res => {
        if (!res.ok) throw new Error(`Top leaderboard page 2 fetch failed: ${res.status}`);
        return res.text();
      });

    rows = rows.concat(parseTopLeaderboardHTML(page2));
  }

  const top10 = rows.slice(0, 10);
  writeTop10Cache(top10);
  return top10;
}

function renderTop10Leaderboard(rows) {
  if (!rows.length) {
    els.body.innerHTML = `<tr><td colspan="5">Could not load the live Lichess top 10.</td></tr>`;
    return;
  }

  els.body.innerHTML = rows
    .map(row => {
      const username = row.username;
      return `
        <tr>
          <td>${row.rank}</td>
          <td>
            <a class="player-link" href="https://lichess.org/@/${encodeURIComponent(username)}" target="_blank" rel="noopener noreferrer">
              ${escapeHtml(username)}
            </a>
          </td>
          <td>Lichess</td>
          <td>${row.rating}</td>
          <td><span class="title-badge title-member">Top 10</span></td>
        </tr>
      `;
    })
    .join("");
}

function setFilterStateForMode(mode) {
  const titleDisabled = mode === "top10";
  const countryDisabled = mode === "top10";
  const sortDisabled = mode === "top10";

  els.title.disabled = titleDisabled;
  els.country.disabled = countryDisabled;
  els.sort.disabled = sortDisabled;

  if (mode === "top10") {
    els.title.value = "all";
    els.country.value = "all";
    els.sort.value = "rating";
  }
}

async function render() {
  const mode = els.mode.value;

  if (mode === "top10") {
    setFilterStateForMode(mode);
    els.body.innerHTML = `<tr><td colspan="5">Loading live Lichess top 10...</td></tr>`;
    try {
      const rows = await fetchTop10FromLichess();
      renderTop10Leaderboard(rows);
    } catch (err) {
      els.body.innerHTML = `<tr><td colspan="5">Failed to load Lichess top 10.</td></tr>`;
      console.error(err);
    }
    return;
  }

  setFilterStateForMode(mode);
  renderTitleLeaderboard();
}

async function init() {
  try {
    const res = await fetch("../../json/players.json");
    if (!res.ok) throw new Error(`players.json fetch failed: ${res.status}`);
    const data = await res.json();

    titlePlayers = Array.isArray(data.players) ? data.players : [];
    populateCountries(titlePlayers);

    await enrichTitlePlayerRatings(titlePlayers);
    render();
  } catch (err) {
    els.body.innerHTML = `<tr><td colspan="5">Failed to load players.json.</td></tr>`;
    console.error(err);
  }
}

els.mode.addEventListener("change", render);
els.title.addEventListener("change", render);
els.country.addEventListener("change", render);
els.sort.addEventListener("change", render);

init();
