import userDetailsModel from "../models/userDetails.js";
import userModel from "../models/userModel.js";
import express from "express";
import bcrypt from "bcrypt";
import Joi from "joi";

const router = express.Router();

const signupSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

router
  .post("/storeUserDetails", async (req, res) => {
    const { uid, name, email, photoURL, token } = req.body;

    try {
      // Check if a user with the given uid already exists
      let user = await userDetailsModel.findOne({ uid });

      if (user) {
        // If the user exists, update their details
        user.name = name;
        user.email = email;
        user.photoURL = photoURL;
        user.token = token;
        await user.save();
      } else {
        // If the user doesn't exist, create a new user
        user = new userDetailsModel({ uid, name, email, photoURL, token });
        await userDetailsModel.save();
      }
      res.json({ message: "User details stored successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  })

  .post("/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
      const { error } = signupSchema.validate({ username, password });

      if (error) {
        return res.status(400).json({ message: error.message });
      }
      let user = await userModel.findOne({ username });

      if (user) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new userModel({ username, hashedPassword });
      await user.save();
      res.json({ message: "ok" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

export default router;
