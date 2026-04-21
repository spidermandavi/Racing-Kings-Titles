let playersRenderToken = 0;

// ✅ Convert country code → flag emoji
function getFlagEmoji(countryCode) {
  if (!countryCode) return "🌍";

  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// ✅ Format rating safely
function formatRating(rating) {
  return rating !== null && rating !== undefined ? rating : "-";
}

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
        <span class="rating-col">Rating</span>
        <span class="country-col">Country</span>
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

            <span class="player-name">
              ${escapeHtml(p.username)} ${badge}
            </span>

            <span class="player-rating rating-col">
              ${formatRating(p.rating)}
            </span>

            <span class="player-country country-col">
              ${getFlagEmoji(p.country)}
            </span>
          </div>
        `;
      }).join("")
    : `<div class="muted">No players available.</div>`;
}
