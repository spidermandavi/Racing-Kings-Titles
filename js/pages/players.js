async function renderPlayers() {
  const app = document.getElementById("app");

  const sorted = sortPlayers(players);

  app.innerHTML = `
    <h1>Players</h1>

    <div id="playersTable">
      ${sorted.map(p => `
        <div id="player-${p.username}">
          ${p.username} - loading...
        </div>
      `).join("")}
    </div>
  `;

  // progressive loading per player
  loadPlayersProgressively(sorted, updatePlayerRow);
}

// update each row
function updatePlayerRow(data) {
  const el = document.getElementById(`player-${data.username}`);
  if (!el) return;

  el.innerHTML = `
    ${data.username} | ${data.rating || "..."} | ${data.country || ""}
  `;
}
