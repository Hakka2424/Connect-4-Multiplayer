const socket = io();
const room = window.location.pathname.substring(1) || "default";
socket.emit("joinGame", room);

let playerColor = null;
let currentTurn = "red"; // Track whose turn it is

// Assign player color
socket.on("playerColor", (color) => {
    playerColor = color;
    updateTurnText();
});

// Update board and turn after each move
socket.on("updateBoard", (game) => {
    board = game.board;
    currentTurn = game.currentPlayer; // Update the turn
    renderBoard();
    updateTurnText();
});

// Handle game over
socket.on("gameOver", ({ winner }) => {
    alert(`${winner.toUpperCase()} wins!`);
    socket.emit("restartGame", room);
});

// Ensure only the correct player can place a piece
document.querySelectorAll(".column").forEach((column, colIndex) => {
    column.addEventListener("click", () => {
        if (playerColor === currentTurn) { // Only allow the current player to move
            socket.emit("playerMove", { room, col: colIndex });
        } else {
            alert("It's not your turn!");
        }
    });
});

// Render board visually
function renderBoard() {
    for (let col = 0; col < 7; col++) {
        for (let row = 0; row < 6; row++) {
            let cell = document.getElementById(`c${col + 1}r${6 - row}`);
            cell.style.backgroundColor = board[col][row] ? board[col][row] : "white";
        }
    }
}

// Update turn text
function updateTurnText() {
    if (playerColor === currentTurn) {
        document.getElementById("whosturn").innerText = `Your Turn (${playerColor.toUpperCase()})`;
    } else {
        document.getElementById("whosturn").innerText = `Opponent's Turn (${currentTurn.toUpperCase()})`;
    }
}

// Restart game
document.getElementById("restart-btn").addEventListener("click", () => {
    socket.emit("restartGame", room);
});

// Function to create twinkling stars
function createStars(numStars) {
    for (let i = 0; i < numStars; i++) {
        let star = document.createElement("div");
        star.classList.add("star");

        // Random position
        star.style.top = `${Math.random() * 100}vh`;
        star.style.left = `${Math.random() * 100}vw`;

        // Random animation duration for variation
        let duration = Math.random() * 3 + 2; // Between 2s and 5s
        star.style.animationDuration = `${duration}s`;

        document.body.appendChild(star);
    }
}

// Create 50 twinkling stars
createStars(50);
