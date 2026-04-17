let homeRenderToken = 0;

// Store real top players
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
    const titled = sortPlayers(getTitledPlayers());

    await loadPlayersProgressively(titled, () => {
      if (token !== homeRenderToken) return;
      renderHomeLists(token);
    });

    // Fetch real top players
    topPlayers = await fetchTopRKPlayers(10);

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

  // 🏆 Titled players
  if (titledEl) {
    const titled = sortPlayers(getTitledPlayers());

    titledEl.innerHTML = titled.length
      ? titled.map((p, i) => renderHomeRow(p, i + 1)).join("")
      : `<div class="muted">No titled players yet.</div>`;
  }

  // 📈 Top players (REAL leaderboard)
  if (topEl) {
    const top = sortPlayers([...topPlayers]);

    topEl.innerHTML = top.length
      ? top.map((p, i) => renderHomeRow(p, i + 1)).join("")
      : `<div class="muted">No players found.</div>`;
  }
}

// ⭐ Convert country code to flag emoji
function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

function renderHomeRow(player, rank) {
  const badge = player.title
    ? `<span class="badge">${escapeHtml(player.title)}</span>`
    : "";

  const flag = player.country
    ? `<span class="flag">${getFlagEmoji(player.country)}</span>`
    : "";

  // ⭐ Highlight titled players
  const highlightedClass = player.title ? "player-row titled" : "player-row";

  return `
    <div class="${highlightedClass}">
      <span class="player-rank">#${rank}</span>
      <span class="player-name">
        ${flag} ${escapeHtml(player.username)} ${badge}
      </span>
      <span class="player-rating">${player.rating ?? "..."}</span>
    </div>
  `;
}
