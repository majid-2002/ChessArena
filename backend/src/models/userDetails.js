import mongoose from "mongoose";

const userDetailsSchema = new mongoose.Schema({
  uid: { type: String, unique: true },
  name: { type: String },
  email: { type: String },
  photoURL: { type: String },
  token: { type: String },
});

const userDetailsModel = mongoose.model("UserDetails", userDetailsSchema);

export default userDetailsModel;
