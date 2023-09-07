import express from "express";
const router = express.Router();

router.post("/joinGame", (req, res) => {
  const { username, room } = req.body;
  console.log(username, room);
  res.send("Hello world!");
});
