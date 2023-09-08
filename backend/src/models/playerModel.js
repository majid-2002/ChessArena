import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  isGuest: { type: Boolean, required: true },
  socketId: { type: String, required: true },
});

const playerModel = mongoose.model("Player", playerSchema);
export default playerModel;
