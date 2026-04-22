let playersRenderToken = 0;

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
      </div>

      <div id="playersTable" class="player-list"></div>
    </section>
  `;

  renderPlayersTable(token);

  try {
    const sorted = sortPlayers([...players]);

    // 🔥 Fetch best rated wins in background
    for (const p of sorted) {
      if (!p.bestRatedWin) {
        fetchBestRatedWin(p.username).then(val => {
          p.bestRatedWin = val || 0;

          // re-render when data arrives
          if (token === playersRenderToken) {
            renderPlayersTable(token);
          }
        });
      }
    }

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
        const mainTitle = getMainTitle(p);
        const extraTitles = getSpecialTitles(p);

        const mainBadge = mainTitle !== "NONE"
          ? `<span class="badge">${escapeHtml(mainTitle)}</span>`
          : "";

        const extraBadges = extraTitles.map(t =>
          `<span class="badge special">${escapeHtml(t)}</span>`
        ).join(" ");

        return `
          <div class="player-row ${getTitleClass(mainTitle)}" id="player-${escapeHtml(p.username)}">
            <span class="player-rank">#${index + 1}</span>

            <span class="player-name">
              ${escapeHtml(p.username)} ${mainBadge} ${extraBadges}
            </span>

            <span class="player-rating rating-col">
              ${formatRating(p.rating)}
            </span>
          </div>
        `;
      }).join("")
    : `<div class="muted">No players available.</div>`;
}
