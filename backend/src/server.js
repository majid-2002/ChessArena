import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";
import playerModel from "./models/playerModel.js";
import gameModel from "./models/gameModel.js";

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

// SOCKET.IO CONFIGURATION
export function setupSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  let lobby = [];
  let selectedPlayers = [];
  let playersInRoom = [];

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

    socket.on("createGame", async (playerId, fen, cb) => {
      const player = await playerModel.findById(playerId).exec();

      if (!player) {
        return;
      }

      if (player) {
        player.socketId = socket.id;
        await player.save();
      }

      if (!lobby.some((p) => p._id.toString() === player._id.toString())) {
        lobby.push(player);
      }

      if (lobby.length == 0) lobby.push(player);

      console.log(lobby);

      if (lobby.length >= 2) {
        selectedPlayers = lobby.splice(0, 2);

        const roomId = generateUniqueRoomId();

        for (const p of selectedPlayers) {
          let player = await playerModel.findById(p._id);
          player.playerColor = ["w", "b"][selectedPlayers.indexOf(p)];
          await player.save();
        }

        const newGame = new gameModel({
          roomId: roomId,
          players: selectedPlayers.map((p) => p._id),
          fen: fen,
        });

        await newGame.save();

        const game = await gameModel
          .findOne({
            roomId: roomId,
          })
          .populate("players")
          .exec();

        game.players.forEach((p) => {
          io.to(p.socketId).emit("gameCreate", {
            roomId: roomId,
            color: p.playerColor,
          });
        });
      }

      cb("created Game Successfully");
    });

    socket.on("joinRoom", async (roomId, playerId, cb) => {
      socket.join(roomId);

      if (!playerId) return;

      let game = await gameModel
        .findOne({ roomId: roomId })
        .populate("players");

      if (playersInRoom.length == 0) playersInRoom.push(playerId);
      else {
        if (!playersInRoom.some((p) => p == playerId))
          playersInRoom.push(playerId);
      }

      console.log(playersInRoom);

      if (playersInRoom.length == 2) {
        io.to(roomId).emit("gameResume", {
          state: true,
          color: game.players,
        });
      } else {
        socket.emit("gameResume", {
          state: false,
        });
      }

      socket.on("disconnect", () => {
        console.log("user disconnected");
        socket.leave(roomId);
        playersInRoom = playersInRoom.filter((p) => p != playerId);
        socket.to(roomId).emit("gameResume", {
          state: false,
        });
      });

      cb(`joined room ${roomId}, players in room: ${playersInRoom.length}`);
    });
  });
}

function generateUniqueRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
  res.send("Hello world!");
});
