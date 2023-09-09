import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    //game refers players from playerModel there will be 2 players only in a game
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
    ],
    player1Color: {
      type: String,
      required: true,
      enum: ["w", "b"],
    },
    player2Color: {
      type: String,
      required: true,
      enum: ["w", "b"],
    },
  },
  {
    timestamps: true,
  }
);

const gameModel = mongoose.model("Game", gameSchema);
export default gameModel;
