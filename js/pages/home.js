async function renderHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>RK Titles</h1>
    <p>Top Racing Kings players on Lichess</p>

    <h2>🏆 Top Titled Players</h2>
    <div id="homeTitled">Loading...</div>

    <h2>📈 Top Players</h2>
    <div id="homeTop">Loading...</div>
  `;

  // Load data progressively
  const titled = sortPlayers(getTitledPlayers());
  const top = [...players];

  // TITLED PLAYERS (progressive)
  loadPlayersProgressively(titled, updateTitledHome);

  // ALL PLAYERS (progressive)
  loadPlayersProgressively(top, updateTopHome);
}

// Update functions
function updateTitledHome(data) {
  const el = document.getElementById("homeTitled");
  if (!el) return;

  el.innerHTML += `
    <div>${data.username} - ${data.rating || "..."}</div>
  `;
}

function updateTopHome(data) {
  const el = document.getElementById("homeTop");
  if (!el) return;

  el.innerHTML += `
    <div>${data.username} - ${data.rating || "..."}</div>
  `;
}
