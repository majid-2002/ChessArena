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
});

const playerModel = mongoose.model("Player", playerSchema);
export default playerModel;
