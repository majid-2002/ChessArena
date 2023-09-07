import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { Server } from "socket.io";

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

  var players = [];
  var games = [];

  io.on("connection", (socket) => {
    console.log("a user connected" + socket.id);

    socket.on("fen", (fen) => {
      console.log(fen)
      for (const player of players) {
        socket.to(player).emit("fen", fen);
      }
    })

    socket.on("join", (userId) => {
      for(const player of players){
        if(player.userId === userId){
          player.socketId = socket.id;
        }
      }

      if (!players.includes({userId: userId, socketId: socket.id})) {
        players.push({ userId: userId, socketId: socket.id });
      }

      console.log("players: ", players);

      if (players.length > 1) {
        const gameId = generateUniqueGameId();
        const game = {
          gameId: gameId,
          player1: { id: players.reverse().pop().socketId, color: "b" },
          player2: { id: players.reverse().pop().socketId, color: "w" },
        };
        games.push(game);
        console.log("sending game to players: " + game.player1.id + " " + game.player2.id)
        socket.to(game.player1.id).emit("game", { color: game.player1.color, game: game});
        socket.to(game.player2.id).emit("game", { color: game.player2.color, game: game});
        console.log(games)
      }
    })
  });
}

// // GAME LOGIC
// function startNewGame(lobby, socket) {
//   console.log("starting new game");
//   console.log(lobby);

//   const gameId = generateUniqueGameId();

//   const player1 = {
//     playerId: lobby[0],
//     color: "w",
//   };
//   const player2 = {
//     playerId: lobby[1],
//     color: "b",
//   };


//   socket.emit("gameId", gameId, player1, player2);
// }

function generateUniqueGameId() {
  const timestamp = new Date().getTime().toString(); // Get current timestamp
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string

  // Combine timestamp and random string to create a unique ID
  const uniqueId = timestamp + randomString;
  return uniqueId;
}

app.get("/", (req, res) => {
  res.send("Hello world!");
});
