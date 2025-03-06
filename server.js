const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 4000;
const games = {}; // Store game rooms and their states

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Handle game page requests
app.get("/:gameID", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function to check if a player has won
function checkWin(board, color) {
    // Check vertical win
    for (let c = 0; c < 7; c++) {
        for (let r = 0; r < 3; r++) {
            if (board[c][r] === color && board[c][r + 1] === color &&
                board[c][r + 2] === color && board[c][r + 3] === color) {
                return true;
            }
        }
    }

    // Check horizontal win
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[c][r] === color && board[c + 1][r] === color &&
                board[c + 2][r] === color && board[c + 3][r] === color) {
                return true;
            }
        }
    }

    // Check diagonal win (↘)
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 3; r++) {
            if (board[c][r] === color && board[c + 1][r + 1] === color &&
                board[c + 2][r + 2] === color && board[c + 3][r + 3] === color) {
                return true;
            }
        }
    }

    // Check diagonal win (↙)
    for (let c = 0; c < 4; c++) {
        for (let r = 3; r < 6; r++) {
            if (board[c][r] === color && board[c + 1][r - 1] === color &&
                board[c + 2][r - 2] === color && board[c + 3][r - 3] === color) {
                return true;
            }
        }
    }
    return false; // No winner yet
}

// Handle player connections
io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    // When a player joins a game
    socket.on("joinGame", (room) => {
        socket.join(room); // Join the game room

        // If the room doesn't exist, create a new game
        if (!games[room]) {
            games[room] = {
                board: Array(7).fill(null).map(() => Array(6).fill(null)), // Empty board
                currentPlayer: "red", // Red starts first
                players: []
            };
        }

        // Assign player a color (red or yellow)
        if (games[room].players.length < 2) {
            const playerColor = games[room].players.length === 0 ? "red" : "yellow";
            games[room].players.push({ id: socket.id, color: playerColor });
            socket.emit("playerColor", playerColor);
        }

        // Send updated board to all players
        io.to(room).emit("updateBoard", games[room]);
    });

    // When a player makes a move
    socket.on("playerMove", ({ room, col }) => {
        const game = games[room];
        if (!game) return;

        // Find the player making the move
        const player = game.players.find(p => p.id === socket.id);
        if (!player || player.color !== game.currentPlayer) {
            socket.emit("invalidMove", "It's not your turn!");
            return;
        }

        // Find the lowest empty row in the selected column
        for (let row = 5; row >= 0; row--) {
            if (!game.board[col][row]) {
                game.board[col][row] = game.currentPlayer; // Place piece

                // Check if the move wins the game
                if (checkWin(game.board, game.currentPlayer)) {
                    io.to(room).emit("gameOver", { winner: game.currentPlayer });
                    return;
                }

                // Switch to the next player's turn
                game.currentPlayer = game.currentPlayer === "red" ? "yellow" : "red";
                io.to(room).emit("updateBoard", game);
                return;
            }
        }
    });

    // Handle game restart
    socket.on("restartGame", (room) => {
        if (games[room]) {
            games[room].board = Array(7).fill(null).map(() => Array(6).fill(null)); // Reset board
            games[room].currentPlayer = "red"; // Red starts first again
            io.to(room).emit("updateBoard", games[room]);
        }
    });

    // Handle player disconnection
    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        
        // Remove player from their game room
        for (const room in games) {
            games[room].players = games[room].players.filter(p => p.id !== socket.id);

            // If no players are left, delete the game room
            if (games[room].players.length === 0) delete games[room];
        }
    });
});

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
