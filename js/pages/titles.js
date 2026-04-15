function renderTitles() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Titles</h1>

    <div>
      <h2>RKGM</h2>
      <p>Racing Kings Grandmaster</p>

      <h2>RKM</h2>
      <p>Racing Kings Master</p>

      <h2>RKCM</h2>
      <p>Candidate Master</p>
    </div>
  `;
}
function renderAbout() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>About RK Titles</h1>

    <p>A community ranking system for Racing Kings players.</p>
    <p>Not affiliated with Lichess.</p>
  `;
}
