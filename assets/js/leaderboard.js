const TITLE_ORDER = {
  RKWC: 1,
  RKSGM: 2,
  RKGM: 3,
  RKIM: 4,
  RKM: 5,
  RKCM: 6,
  RKV: 7,
  RKHM: 8,
  Member: 9
};

let players = [];

async function getRKRating(username){

  try{

    const response = await fetch(
      `https://lichess.org/api/user/${username}`
    );

    const data = await response.json();

    return data?.perfs?.racingKings?.rating || 0;

  }catch{

    return 0;

  }

}

async function loadPlayers(){

  const response =
    await fetch("../../json/players.json");

  const data = await response.json();

  players = data.players;

  populateCountries();

  await loadRatings();

  render();

}

async function loadRatings(){

  const promises = players.map(async player => {

    player.rating =
      await getRKRating(player.player);

  });

  await Promise.all(promises);

}

function populateCountries(){

  const select =
    document.getElementById("countryFilter");

  const countries =
    [...new Set(players.map(p=>p.country))]
    .sort();

  countries.forEach(country=>{

    const option =
      document.createElement("option");

    option.value = country;
    option.textContent = country;

    select.appendChild(option);

  });

}

function getMainTitle(player){

  return player.currentTitles.main[0] || "Member";

}

function badge(title){

  const cls = title.toLowerCase();

  return `
    <span class="title-badge title-${cls}">
      ${title}
    </span>
  `;

}

function render(){

  const body =
    document.getElementById("leaderboardBody");

  let filtered = [...players];

  const titleFilter =
    document.getElementById("titleFilter").value;

  const countryFilter =
    document.getElementById("countryFilter").value;

  const sort =
    document.getElementById("sortFilter").value;

  if(titleFilter !== "all"){

    filtered = filtered.filter(player=>{

      const title =
        getMainTitle(player);

      return title === titleFilter;

    });

  }

  if(countryFilter !== "all"){

    filtered = filtered.filter(
      p => p.country === countryFilter
    );

  }

  if(sort === "title"){

    filtered.sort((a,b)=>{

      return (
        TITLE_ORDER[getMainTitle(a)]
        -
        TITLE_ORDER[getMainTitle(b)]
      );

    });

  }

  if(sort === "rating"){

    filtered.sort(
      (a,b)=>b.rating-a.rating
    );

  }

  if(sort === "country"){

    filtered.sort(
      (a,b)=>a.country.localeCompare(b.country)
    );

  }

  body.innerHTML = filtered.map((player,index)=>{

    const main =
      getMainTitle(player);

    const specials =
      player.currentTitles.special || [];

    return `
      <tr>

        <td>${index+1}</td>

        <td>
          <a
            class="player-link"
            href="profile.html?id=${player.playerId}">
            ${player.player}
          </a>
        </td>

        <td>${player.country}</td>

        <td>${player.rating}</td>

        <td>
          ${badge(main)}
          ${specials.map(badge).join("")}
        </td>

      </tr>
    `;

  }).join("");

}

document
.getElementById("titleFilter")
.addEventListener("change",render);

document
.getElementById("countryFilter")
.addEventListener("change",render);

document
.getElementById("sortFilter")
.addEventListener("change",render);

loadPlayers();
