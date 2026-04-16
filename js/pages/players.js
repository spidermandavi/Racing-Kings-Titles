let playersRenderToken = 0;

async function renderPlayers() {
  const app = document.getElementById("app");
  if (!app) return;

  const token = ++playersRenderToken;
  showSpinner();

  app.innerHTML = `
    <h1>Players</h1>

    <section class="section-card">
      <div class="table-header">
        <span>#</span>
        <span>Player</span>
        <span>Rating</span>
        <span>Country</span>
      </div>

      <div id="playersTable" class="player-list"></div>
    </section>
  `;

  renderPlayersTable(token);

  try {
    const sorted = sortPlayers([...players]);

    await loadPlayersProgressively(sorted, () => {
      if (token !== playersRenderToken) return;
      renderPlayersTable(token);
    });
  } finally {
    if (token === playersRenderToken) {
      hideSpinner();
    }
  }
}

function renderPlayersTable(token = playersRenderToken) {
  if (token !== playersRenderToken) return;

  const el = document.getElementById("playersTable");
  if (!el) return;

  const sorted = sortPlayers([...players]);

  el.innerHTML = sorted.length
    ? sorted.map((p, index) => {
        const badge = p.title
          ? `<span class="badge">${escapeHtml(p.title)}</span>`
          : "";

        return `
          <div class="player-row" id="player-${escapeHtml(p.username)}">
            <span class="player-rank">#${index + 1}</span>
            <span class="player-name">${escapeHtml(p.username)} ${badge}</span>
            <span class="player-rating">${p.rating ?? "..."}</span>
            <span class="player-country">${escapeHtml(p.country || "")}</span>
          </div>
        `;
      }).join("")
    : `<div class="muted">No players available.</div>`;
}
