let youRenderToken = 0;

async function renderYou() {
  const app = document.getElementById("app");
  if (!app) return;

  const username = localStorage.getItem("rk_username");

  if (!username || username === "SKIP") {
    app.innerHTML = `<h1>You</h1><p>No player selected.</p>`;
    return;
  }

  const token = ++youRenderToken;
  showSpinner();

  app.innerHTML = `
    <h1>You</h1>
    <h3>${escapeHtml(username)} <button onclick="editUsername()">Edit</button></h3>
    <div id="youStats" class="section-card">Loading...</div>
  `;

  try {
    const data = await loadPlayerData(username);

    if (token !== youRenderToken) return;

    if (!data) {
      const statsEl = document.getElementById("youStats");
      if (statsEl) statsEl.innerHTML = `<p>User not found.</p>`;
      return;
    }

    renderYouStats(data);
  } finally {
    if (token === youRenderToken) {
      hideSpinner();
    }
  }
}

function renderYouStats(data) {
  const el = document.getElementById("youStats");
  if (!el) return;

  el.innerHTML = `
    <p><strong>Rating:</strong> ${data.rating ?? "—"}</p>
    <p><strong>Peak:</strong> ${data.peakRating ?? "—"}</p>
    <p><strong>RK Games:</strong> ${data.gamesPlayed ?? "—"}</p>
    <p><strong>Win Rate:</strong> ${data.winRate ?? "—"}</p>
    <p><strong>Country:</strong> ${escapeHtml(data.country || "—")}</p>
  `;
}

function editUsername() {
  showPopup();
}
