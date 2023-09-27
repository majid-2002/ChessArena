import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  isGuest: { type: Boolean, required: true },
  userName: {
    type: mongoose.Schema.Types.String,
    required: function () {
      return !this.isGuest;
    },
    ref: "User",
  },
  socketId: {
    type: String,
    required: true,
  },
  playerColor: {
    type: String,
    required: false
  },
});

const playerModel = mongoose.model("Player", playerSchema);
export default playerModel;
