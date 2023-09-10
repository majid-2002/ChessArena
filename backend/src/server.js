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

  let players = [];

  io.on("connection", (socket) => {
    console.log("a user connected \n\n");

    socket.on("newPlayer", async (isGuest, cb) => {
      console.log(socket.id);
      const player = new playerModel({
        isGuest: isGuest,
        socketId: socket.id,
      });
      const newPlayer = await player.save();
      cb(newPlayer._id);
    });

    socket.on("joinGame", async (playerId, cb) => {
      if (!playerId) {
        return;
      }

      let player = await playerModel.findById(playerId).exec();
      console.log(player);

      if (players.find((p) => p._id === player._id)) {
        return;
      } else {
        players.push(player);
      }

      if (players.length >= 2) {
        const existingGame = await gameModel
          .findOne({
            players: { $all: players.map((p) => p._id) },
          })
          .populate("players")
          .exec();

        if (!existingGame) {
          const roomId = generateUniqueRoomId();

          const newGame = new gameModel({
            roomId: roomId,
            players: players.map((p) => p._id),
            player1Color: "w",
            player2Color: "b",
          });

          await newGame.save();

          const game = await gameModel
            .findOne({
              roomId: roomId,
            })
            .populate("players")
            .exec();

          socket.join(roomId);
          game.players.forEach((p, index) => {
            io.to(p.socketId).emit("gameStart", {
              roomId: roomId,
              color: index === 0 ? game.player1Color : game.player2Color,
            });
          });
        } else {
          socket.join(existingGame.roomId);
          existingGame.players.forEach((p, index) => {
            io.to(p.socketId).emit("gameStart", {
              roomId: existingGame.roomId,
              color:
                index === 0
                  ? existingGame.player1Color
                  : existingGame.player2Color,
            });
          });
        }
      }

      cb("Joined Game Successfully");
    });
  });
}

function generateUniqueRoomId() {
  return Math.random().toString(36).substring(2, 8);
}

app.get("/", (req, res) => {
  res.send("Hello world!");
});
