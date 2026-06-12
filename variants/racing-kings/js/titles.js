fetch("../../json/players.json")
.then(response => response.json())
.then(data => {

    const awards = [];

    data.players.forEach(player => {

        player.certificates.forEach(cert => {

            awards.push({
                player: player.player,
                title: cert.title,
                date: cert.date
            });

        });

    });

    awards.sort(
        (a,b) =>
        new Date(b.date) - new Date(a.date)
    );

    const latest = awards.slice(0,5);

    const container =
      document.getElementById("latest-titles");

    if(!container) return;

    latest.forEach(item => {

        container.innerHTML += `
            <div class="latest-card">
                <h3>${item.player}</h3>
                <div class="title">${item.title}</div>
                <div class="date">${item.date}</div>
            </div>
        `;

    });

});
