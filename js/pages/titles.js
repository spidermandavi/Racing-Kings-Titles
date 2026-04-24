function renderTitles() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>Titles</h1>

    <div class="titles-grid">

      <div class="title-card elite">
        <h2>RKSGM</h2>
        <p class="title-name">Racing Kings Super Grandmaster</p>
        <p class="req"><strong>Requirements:</strong> At least 500 rated RK games, reached 2400 rating, won 3 rated RK tournaments with a performance of at least 2400 and with at least 15 games.</p>
      </div>

      <div class="title-card grand">
        <h2>RKGM</h2>
        <p class="title-name">Racing Kings Grandmaster</p>
        <p class="req"><strong>Requirements:</strong> At least 500 rated RK games, reached 2200 rating, won 3 rated RK tournaments with a performance of at least 2200 and with at least 15 games.</p>
      </div>

      <div class="title-card master">
        <h2>RKM</h2>
        <p class="title-name">Racing Kings Master</p>
        <p class="req"><strong>Requirements:</strong> At least 300 rated RK games, reached 2100 rating, won 3 rated RK tournaments with a performance of at least 2100 and with at least 15 games.</p>
      </div>

      <div class="title-card candidate">
        <h2>RKCM</h2>
        <p class="title-name">Racing Kings Candidate Master</p>
        <p class="req"><strong>Requirements:</strong> At least 200 rated RK games, reached 2000 rating, won 3 rated RK tournaments with a performance of at least 2000 and with at least 15 games.</p>
      </div>

      <div class="title-card candidate-light">
        <h2>RKC</h2>
        <p class="title-name">Racing Kings Candidate</p>
        <p class="req"><strong>Requirements:</strong> At least 100 rated RK games, reached 1900 rating, won 1 tournament with at least 15 games.</p>
      </div>

      <div class="title-card intermediate">
        <h2>RKI</h2>
        <p class="title-name">Racing Kings Intermediate</p>
        <p class="req"><strong>Requirements:</strong> At least 100 rated RK games, reached 1800 rating.</p>
      </div>

      <div class="title-card beginner">
        <h2>RKB</h2>
        <p class="title-name">Racing Kings Beginner</p>
        <p class="req"><strong>Requirements:</strong> Played at least 30 rated RK games and applied for the title.</p>
      </div>

    </div>

    <h2 style="margin-top:40px;">Special Titles</h2>

    <div class="titles-grid">

      <div class="title-card special">
        <h2>RKK</h2>
        <p class="title-name">Racing Kings King</p>
        <p class="req"><strong>Requirements:</strong> Reached 2600 rating or won at least one Racing Kings World Championship (RKWC).</p>
      </div>

      <div class="title-card special">
        <h2>RKV</h2>
        <p class="title-name">Racing Kings Veteran</p>
        <p class="req"><strong>Requirements:</strong> Played at least 10,000 RK games or played Racing Kings for at least 5 years.</p>
      </div>

      <div class="title-card special">
        <h2>RKHM</h2>
        <p class="title-name">Racing Kings Honorary Master</p>
        <p class="req"><strong>Requirements:</strong> Accomplished something great for the Racing Kings community.</p>
      </div>

    </div>
  `;
}

function renderAbout() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>About RK Titles</h1>

    <div class="about-card">
      <p class="about-main">
        A community-driven ranking system for Racing Kings players.
      </p>

      <p class="about-sub">
        Not affiliated with Lichess.
      </p>

      <p>
        Created by 
        <a href="https://lichess.org/@/Mysterious_Past" target="_blank">Mysterious_Past</a>
        (with help from 
        <a href="https://lichess.org/@/spidermandavi" target="_blank">spidermandavi</a>, 
        <a href="https://lichess.org/@/Rank-8_RK" target="_blank">Rank-8_RK</a>, 
        <a href="https://lichess.org/@/SpiderM8_DJC" target="_blank">SpiderM8_DJC</a>)
      </p>

      <p>
        Please contact 
        <a href="https://lichess.org/@/Mysterious_Past" target="_blank">Mysterious_Past</a> 
        for suggestions, problems, questions, or to apply for a title.
      </p>
    </div>
  `;
}
