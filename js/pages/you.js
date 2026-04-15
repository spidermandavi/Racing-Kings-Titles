async function renderYou() {
  const app = document.getElementById("app");

  const username = localStorage.getItem("rk_username");

  if (!username || username === "SKIP") {
    app.innerHTML = `<h1>You</h1><p>No player selected.</p>`;
    return;
  }

  app.innerHTML = `
    <h1>You</h1>
    <h3>${username} <button onclick="editUsername()">Edit</button></h3>

    <div id="youStats">Loading...</div>
  `;

  const data = await loadPlayerData(username);

  if (!data) {
    document.getElementById("youStats").innerHTML = "User not found.";
    return;
  }

  renderYouStats(data);
}

function renderYouStats(data) {
  document.getElementById("youStats").innerHTML = `
    <p>Rating: ${data.rating}</p>
    <p>Peak: ${data.peakRating}</p>
    <p>RK Games: ${data.gamesPlayed}</p>
    <p>Win Rate: ${data.winRate}</p>
  `;
}

function editUsername() {
  showPopup();
}
