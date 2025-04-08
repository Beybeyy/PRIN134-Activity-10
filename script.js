// Emojis
const TROPHY = "🏆";
const FIRE = "🔥";
const BASKETBALL = "🏀";

// Player class
class Player {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }
}

// Players array
let players = [];

// DOM Elements
const playerNameInput = document.getElementById("player-name");
const addPlayerButton = document.getElementById("add-player-button");
const startGameButton = document.getElementById("start-game-button");
const playersBody = document.getElementById("players-body");
const gameLog = document.getElementById("game-log");

// Add Player
function addPlayer() {
    const name = playerNameInput.value.trim();
    if (name) {
        players.push(new Player(name));
        playerNameInput.value = "";
        updatePlayerTable();
        logMessage(`Added player: ${name}`);
    } else {
        logMessage("Please enter a player name.");
    }
}

// Update Table
function updatePlayerTable() {
    playersBody.innerHTML = "";
    players.forEach((player, index) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;

        const scoreCell = document.createElement("td");
        scoreCell.textContent = player.score;

        row.appendChild(nameCell);
        row.appendChild(scoreCell);
        playersBody.appendChild(row);
    });
}

// Log Message
function logMessage(message, className = "") {
    const logItem = document.createElement("div");
    logItem.className = `log-item ${className}`;
    logItem.innerHTML = message;
    gameLog.appendChild(logItem);
    gameLog.scrollTop = gameLog.scrollHeight;
}

// Play Game
function playGame(playersSubset = null, round = 1) {
    const currentPlayers = playersSubset || players;

    if (currentPlayers.length < 2) {
        logMessage("Add at least 2 players to start the game.");
        return;
    }

    if (!playersSubset) {
        players.forEach(player => player.score = 0);
        gameLog.innerHTML = "";
    }

    logMessage(`<strong>Round ${round}</strong>`);

    currentPlayers.forEach(player => {
        let score = 0;
        for (let i = 0; i < 5; i++) {
            if (Math.random() < 0.6 + Math.random() * 0.2) {
                score++;
            }
        }
        player.score = Math.min(score, 3);
        logMessage(`${player.name} scored ${player.score} points`);
    });

    updatePlayerTable();
    displayRankings(currentPlayers);

    const maxScore = Math.max(...currentPlayers.map(p => p.score));
    const topPlayers = currentPlayers.filter(p => p.score === maxScore);

    if (topPlayers.length === 1) {
        logMessage(`${TROPHY} The champion is ${topPlayers[0].name} with ${topPlayers[0].score} points!`, "log-winner");
    } else {
        logMessage(`${FIRE} It's a tie between: ${topPlayers.map(p => p.name).join(', ')}`, "log-winner");
        setTimeout(() => {
            logMessage("Tie detected! Starting Round " + (round + 1) + "...");
            playGame(topPlayers, round + 1);
        }, 1000);
    }
}

// Display Rankings
function displayRankings(playersList) {
    logMessage(`${TROPHY} Rankings after this round:`);
    playersList.sort((a, b) => b.score - a.score);
    let table = "<table><tr><th>Rank</th><th>Player</th><th>Score</th></tr>";
    playersList.forEach((player, index) => {
        table += `<tr><td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td></tr>`;
    });
    table += "</table>";
    logMessage(table);
}

// Event Listeners
addPlayerButton.addEventListener("click", addPlayer);
startGameButton.addEventListener("click", () => playGame());