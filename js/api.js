// ===== LICHESS API WRAPPER =====

const LICHESS_BASE = "https://lichess.org/api/user/";

async function fetchLichessUser(username) {
  try {
    const res = await fetch(LICHESS_BASE + username);

    if (!res.ok) {
      throw new Error("User not found");
    }

    const data = await res.json();

    return data;
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
}
function extractRacingKings(data) {
  if (!data || !data.perfs || !data.perfs.racingKings) {
    return null;
  }

  const rk = data.perfs.racingKings;

  return {
    rating: rk.rating || null,
    peakRating: rk.peak || null,
    gamesPlayed: rk.games || null,
    winRate: rk.winrate || null
  };
}
async function loadPlayerData(username) {
  const cached = getCachedPlayer(username);
  if (cached) return cached;

  const data = await fetchLichessUser(username);
  if (!data) return null;

  const rk = extractRacingKings(data);

  const result = {
    username,
    ...rk,
    country: data?.profile?.country || null
  };

  setCachedPlayer(username, result);

  return result;
}
async function loadPlayersProgressively(playerList, onUpdate) {
  const results = [];

  for (let i = 0; i < playerList.length; i++) {
    const p = playerList[i];

    // Start loading immediately
    loadPlayerData(p.username).then(data => {
      if (data) {
        results.push(data);
        onUpdate(data); // updates UI instantly
      }
    });
  }

  return results;
}
