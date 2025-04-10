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

// new player function
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

// Update player table 
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
    const successRate = 0.5 + Math.random() * 0.4; 
    for (let i = 0; i < attempts; i++) {
        if (Math.random() < successRate) {
            score++;
        }
    }
    return Math.min(score, attempts);
}


function simulateTiebreakerShots() {
    return Math.floor(Math.random() * 3) + 1; 
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

    
    gameLog.innerHTML = "";
    players.forEach(player => player.score = 0);
    updatePlayerTable();

    let round = 1;  
    let winnerDeclared = false;

    
    while (!winnerDeclared) {
        logMessage(`<span class="highlight-round">Round ${round} begins!</span>`);
        players.forEach((player, index) => {
            player.score = simulateShots(5);  
            logMessage(`${player.name} scored ${player.score} points.`);
        });
        updatePlayerTable();
        displayRankings(players);

        const maxScore = Math.max(...players.map(p => p.score));
        const tiedPlayers = players.filter(p => p.score === maxScore);

        if (tiedPlayers.length === 1) {
            
            logMessage(`${TROPHY} The champion is ${tiedPlayers[0].name} with ${tiedPlayers[0].score} points!`, "log-winner");
            winnerDeclared = true;
        } else {
            
            logMessage(`${FIRE} Tie detected! Round ${round + 1} will be played for: ${tiedPlayers.map(p => p.name).join(", ")}`);

            
            players = tiedPlayers;

            round++;
        }
    }
}


addPlayerButton.addEventListener("click", addPlayer);
startGameButton.addEventListener("click", playGame);
