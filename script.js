// Player class
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}

// DOM elements
const playerNameInput = document.getElementById("player-name");
const addPlayerButton = document.getElementById("add-player-button");
const startGameButton = document.getElementById("start-game-button");
const playersBody = document.getElementById("players-body");
const gameLog = document.getElementById("game-log");

let players = [];
const TROPHY = "🏆";
const FIRE = "🔥";
const BASKETBALL = "🏀";

function addPlayer() {
    const name = playerNameInput.value.trim();
    if (name) {
        players.push(new Player(name));
        playerNameInput.value = "";
        updatePlayerTable();
        logMessage(`Added new player: ${name}`);
    } else {
        logMessage("Please enter a player name.");
    }
}

function updatePlayerTable() {
    playersBody.innerHTML = "";
    players.forEach((player, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.name}</td>
            <td id="score-${index}">${player.score}</td>
        `;
        playersBody.appendChild(row);
    });
}

function logMessage(message, className = "") {
    const div = document.createElement("div");
    div.className = `log-item ${className}`;
    div.innerHTML = message;
    gameLog.appendChild(div);
    gameLog.scrollTop = gameLog.scrollHeight;
}

function simulateShots(attempts) {
    let score = 0;
    const successRate = 0.6 + Math.random() * 0.2;
    for (let i = 0; i < attempts; i++) {
        if (Math.random() < successRate) {
            score++;
        }
    }
    return Math.min(score, 3);
}

function simulateTiebreakerShots() {
    return Math.floor(Math.random() * 3) + 1; // 1 to 3
}

function displayRankings(playersList) {
    logMessage(`${TROPHY} Rankings after this round:`);
    playersList.sort((a, b) => b.score - a.score);
    let message = "<table width='100%'><tr><th>Rank</th><th>Player</th><th>Score</th></tr>";
    playersList.forEach((p, i) => {
        message += `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.score}</td></tr>`;
    });
    message += "</table>";
    logMessage(message);
}

function playGame() {
    if (players.length < 2) {
        logMessage("At least 2 players are needed to play.");
        return;
    }

    // Reset scores
    players.forEach(player => player.score = 0);
    updatePlayerTable();
    gameLog.innerHTML = "";

    logMessage("Round 1 begins!");
    players.forEach((player, index) => {
        player.score = simulateShots(5);
        logMessage(`${player.name} scored ${player.score} points.`);
    });
    updatePlayerTable();
    displayRankings(players);

    const maxScore = Math.max(...players.map(p => p.score));
    const tiedPlayers = players.filter(p => p.score === maxScore);

    if (tiedPlayers.length > 1) {
        logMessage(`${FIRE} Tiebreaker! Round 2 for: ${tiedPlayers.map(p => p.name).join(", ")}`);

        tiedPlayers.forEach(p => p.score = simulateTiebreakerShots());
        tiedPlayers.forEach(p => logMessage(`${p.name} scored ${p.score} in round 2.`));

        updatePlayerTable();
        displayRankings(tiedPlayers);

        const finalMax = Math.max(...tiedPlayers.map(p => p.score));
        const winners = tiedPlayers.filter(p => p.score === finalMax);

        if (winners.length === 1) {
            logMessage(`${TROPHY} The champion is ${winners[0].name} with ${winners[0].score} points!`, "log-winner");
        } else {
            logMessage(`${TROPHY} Tie again! But no further rounds. Co-winners: ${winners.map(p => p.name).join(", ")}`, "log-winner");
        }
    } else {
        logMessage(`${TROPHY} The champion is ${tiedPlayers[0].name} with ${tiedPlayers[0].score} points!`, "log-winner");
    }
}

addPlayerButton.addEventListener("click", addPlayer);
startGameButton.addEventListener("click", playGame);
