import express from "express";
import gameModel from "../models/gameModel";

const router = express.Router();

router.get("/api/games/:roomId/fen", async (req, res) => {
  console.log(req.params.roomId);
});
