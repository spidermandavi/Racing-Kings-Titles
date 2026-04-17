let homeRenderToken = 0;

// ⭐ Store Lichess top players
let topPlayers = [];

async function renderHome() {
  const app = document.getElementById("app");
  if (!app) return;

  const token = ++homeRenderToken;
  showSpinner();

  app.innerHTML = `
    <h1>RK Titles</h1>
    <p>Top Racing Kings players on Lichess</p>

    <section class="section-card">
      <h2>🏆 Top Titled Players</h2>
      <div id="homeTitled" class="player-list"></div>
    </section>

    <section class="section-card">
      <h2>📈 Top Players</h2>
      <div id="homeTop" class="player-list"></div>
    </section>
  `;

  renderHomeLists(token);

  try {
    // ✅ KEEP your original titled players logic
    const titled = sortPlayers(getTitledPlayers());

    await loadPlayersProgressively(titled, () => {
      if (token !== homeRenderToken) return;
      renderHomeLists(token);
    });

    // ⭐ NEW: fetch real top players
    const lichessTop = await fetchTopRKPlayers(10);

    // ⭐ IMPORTANT: normalize to your existing player format
    topPlayers = lichessTop.map(p => ({
      username: p.username,
      rating: p.rating,
      title: p.title,
      country: p.country
    }));

    if (token !== homeRenderToken) return;
    renderHomeLists(token);

  } finally {
    if (token === homeRenderToken) {
      hideSpinner();
    }
  }
}

function renderHomeLists(token = homeRenderToken) {
  if (token !== homeRenderToken) return;

  const titledEl = document.getElementById("homeTitled");
  const topEl = document.getElementById("homeTop");

  // 🏆 Titled players (unchanged logic)
  if (titledEl) {
    const titled = sortPlayers(getTitledPlayers());

    titledEl.innerHTML = titled.length
      ? titled.map((p, i) => renderHomeRow(p, i + 1)).join("")
      : `<div class="muted">No titled players yet.</div>`;
  }

  // 📈 Top players (NOW from Lichess)
  if (topEl) {
    const top = sortPlayers([...topPlayers]);

    topEl.innerHTML = top.length
      ? top.map((p, i) => renderHomeRow(p, i + 1)).join("")
      : `<div class="muted">No players yet.</div>`;
  }
}

// ⭐ Flag helper (safe)
function getFlagEmoji(code) {
  if (!code) return "";
  try {
    return code
      .toUpperCase()
      .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
  } catch {
    return "";
  }
}

function renderHomeRow(player, rank = "") {
  const badge = player.title
    ? `<span class="badge">${escapeHtml(player.title)}</span>`
    : "";

  const flag = player.country
    ? `<span class="flag">${getFlagEmoji(player.country)}</span>`
    : "";

  const isTitled = !!player.title;

  return `
    <div class="player-row ${isTitled ? "titled" : ""}">
      <span class="player-rank">${rank ? "#" + rank : ""}</span>
      <span class="player-name">
        ${flag} ${escapeHtml(player.username)} ${badge}
      </span>
      <span class="player-rating">${player.rating ?? "..."}</span>
    </div>
  `;
}
