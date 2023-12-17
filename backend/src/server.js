import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import playerModel from "./models/playerModel.js";
import gameModel from "./models/gameModel.js";
import userRoutes from "./routes/user.js";

//* CONFIGURATIONS
const app = express();

dotenv.config();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.json());
app.use(morgan("dev"));

//* MONGOOSE CONFIGURATION
mongoose.set("strictQuery", true);

const PORT = 6001;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    setupSocketIO(server);
  })
  .catch((error) => console.log(`${error} did not connect`));

app.get("/", (req, res) => {
  res.json({ message: "Welcome from ChessArena!" });
});

// SOCKET.IO CONFIGURATION
export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let lobby = [];
  let playersInRoom = [];
  const connectedPlayers = {};

  io.on("connection", (socket) => {
    console.log("a user connected \n\n");

    socket.on("newPlayer", async (isGuest, cb) => {
      const player = new playerModel({
        isGuest: isGuest,
        socketId: socket.id,
      });
      const newPlayer = await player.save();
      cb(newPlayer._id);
    });

    socket.on("createGame", async (playerId, fen, capturedPieces, cb) => {
      try {
        const player = await playerModel.findById(playerId).exec();

        if (!player) {
          return cb("Player not found");
        }

        player.socketId = socket.id;
        await player.save();

        if (!lobby.some((p) => p._id.toString() === player._id.toString())) {
          lobby.push(player);
        }

        if (lobby.length >= 2) {
          const selectedPlayers = lobby.splice(0, 2);
          const roomId = generateUniqueRoomId();

          for (const selectedPlayer of selectedPlayers) {
            selectedPlayer.playerColor = ["w", "b"][
              selectedPlayers.indexOf(selectedPlayer)
            ];
            await selectedPlayer.save();
          }

          const newGame = new gameModel({
            roomId: roomId,
            players: selectedPlayers.map((p) => p._id),
            fen: fen,
            capturedPieces: capturedPieces,
          });

          await newGame.save();

          console.log(newGame);

          selectedPlayers.forEach((p) => {
            io.to(p.socketId).emit("gameCreated", {
              roomId: roomId,
              color: p.playerColor,
            });
          });
          cb("Created game successfully");
        } else {
          cb("Waiting for more players");
        }
      } catch (error) {
        console.error(error);
        cb("An error occurred");
      }
    });

    socket.on("joinRoom", async (roomId, playerId, cb) => {
      socket.join(roomId);

      if (!playerId) {
        return cb("Player not found");
      }

      let game = await gameModel
        .findOne({ roomId: roomId })
        .populate("players");

      connectedPlayers[socket.id] = playerId;

      if (playersInRoom.length == 0) playersInRoom.push(playerId);
      else {
        if (!playersInRoom.some((p) => p == playerId))
          playersInRoom.push(playerId);
      }

      if (!game) {
        return cb("Game not found");
      }

      if (playersInRoom.length == 2) {
        io.to(roomId).emit("startGame", {
          gameReady: true,
          players: game.players,
          fen: game.fen,
          capturedPieces: game.capturedPieces,
        });
      } else {
        socket.emit("startGame", {
          gameReady: false,
        });
      }

      socket.on("disconnect", () => {
        const disconnectedPlayerId = connectedPlayers[socket.id];

        if (disconnectedPlayerId) {
          socket.leave(roomId);
          const index = playersInRoom.indexOf(disconnectedPlayerId); //? check if player is in room
          if (index > -1) {
            playersInRoom.splice(index, 1); //? remove player from room if they disconnect
            io.to(roomId).emit("startGame", {
              gameReady: false,
            });
          }
          delete connectedPlayers[socket.id]; //? remove player from connected players
        }
        socket.disconnect();
      });

      cb(`joined room ${roomId}`);
    });

    socket.on("gameUpdate", async (roomId, fen, capturedPieces, cb) => {
      console.log("updated fen", fen);

      console.log(capturedPieces);

      let game = await gameModel
        .findOne({ roomId: roomId })
        .populate("players");

      if (!game) {
        return cb("Game not found");
      }

      game.fen = fen;
      game.capturedPieces = capturedPieces;
      await game.save();

      socket.to(roomId).emit("gameUpdate", fen, capturedPieces);

      cb("Game updated");
    });
  });
}

function generateUniqueRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

//* ROUTES
app.use("/api", userRoutes);
