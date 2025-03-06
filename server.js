const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 4000;
const games = {};

app.use(express.static(path.join(__dirname, "public")));

app.get("/:gameID", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Function to check for a win
function checkWin(board, color) {
    for (let c = 0; c < 7; c++) {
        for (let r = 0; r < 3; r++) {
            if (board[c][r] === color && board[c][r + 1] === color &&
                board[c][r + 2] === color && board[c][r + 3] === color) {
                return true;
            }
        }
    }
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[c][r] === color && board[c + 1][r] === color &&
                board[c + 2][r] === color && board[c + 3][r] === color) {
                return true;
            }
        }
    }
    for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 3; r++) {
            if (board[c][r] === color && board[c + 1][r + 1] === color &&
                board[c + 2][r + 2] === color && board[c + 3][r + 3] === color) {
                return true;
            }
        }
    }
    for (let c = 0; c < 4; c++) {
        for (let r = 3; r < 6; r++) {
            if (board[c][r] === color && board[c + 1][r - 1] === color &&
                board[c + 2][r - 2] === color && board[c + 3][r - 3] === color) {
                return true;
            }
        }
    }
    return false;
}

io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    socket.on("joinGame", (room) => {
        socket.join(room);

        if (!games[room]) {
            games[room] = {
                board: Array(7).fill(null).map(() => Array(6).fill(null)),
                currentPlayer: "red",
                players: []
            };
        }

        if (games[room].players.length < 2) {
            const playerColor = games[room].players.length === 0 ? "red" : "yellow";
            games[room].players.push({ id: socket.id, color: playerColor });
            socket.emit("playerColor", playerColor);
        }

        io.to(room).emit("updateBoard", games[room]);
    });

    socket.on("playerMove", ({ room, col }) => {
        const game = games[room];
        if (!game) return;

        const player = game.players.find(p => p.id === socket.id);
        if (!player || player.color !== game.currentPlayer) {
            socket.emit("invalidMove", "It's not your turn!");
            return;
        }

        for (let row = 5; row >= 0; row--) {
            if (!game.board[col][row]) {
                game.board[col][row] = game.currentPlayer;

                if (checkWin(game.board, game.currentPlayer)) {
                    io.to(room).emit("gameOver", { winner: game.currentPlayer });
                    return;
                }

                game.currentPlayer = game.currentPlayer === "red" ? "yellow" : "red";
                io.to(room).emit("updateBoard", game);
                return;
            }
        }
    });

    socket.on("restartGame", (room) => {
        if (games[room]) {
            games[room].board = Array(7).fill(null).map(() => Array(6).fill(null));
            games[room].currentPlayer = "red";
            io.to(room).emit("updateBoard", games[room]);
        }
    });

    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        for (const room in games) {
            games[room].players = games[room].players.filter(p => p.id !== socket.id);
            if (games[room].players.length === 0) delete games[room];
        }
    });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
