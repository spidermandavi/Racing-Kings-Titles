let homeRenderToken = 0;

// ⭐ NEW: store real top players from Lichess
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

  // Initial render
  renderHomeLists(token);

  try {
    // 🏆 Your titled players (same as before)
    const titled = sortPlayers(getTitledPlayers());

    await loadPlayersProgressively(titled, () => {
      if (token !== homeRenderToken) return;
      renderHomeLists(token);
    });

    // ⭐ NEW: Fetch REAL top players from Lichess
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

  if (titledEl) {
    const titled = sortPlayers(getTitledPlayers());
    titledEl.innerHTML = titled.length
      ? titled.map(renderHomeRow).join("")
      : `<div class="muted">No titled players yet.</div>`;
  }

  if (topEl) {
    const top = sortPlayers([...topPlayers]);
    topEl.innerHTML = top.length
      ? top.map(renderHomeRow).join("")
      : `<div class="muted">No players found.</div>`;
  }
}

function renderHomeRow(player) {
  const badge = player.title
    ? `<span class="badge">${escapeHtml(player.title)}</span>`
    : "";

  return `
    <div class="player-row">
      <span class="player-name">${escapeHtml(player.username)} ${badge}</span>
      <span class="player-rating">${player.rating ?? "..."}</span>
    </div>
  `;
}
