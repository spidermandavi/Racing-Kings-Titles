let homeRenderToken = 0;

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
    const top = sortPlayers([...players]);

    await loadPlayersProgressively(titled, () => {
      if (token !== homeRenderToken) return;
      renderHomeLists(token);
    });

    await loadPlayersProgressively(top, () => {
      if (token !== homeRenderToken) return;
      renderHomeLists(token);
    });
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
    const top = sortPlayers([...players]);
    topEl.innerHTML = top.length
      ? top.map(renderHomeRow).join("")
      : `<div class="muted">No players yet.</div>`;
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
