import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  number: {
    type: Number,
    unique: true,
  },
  profileImage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile",
  },
  experience: String,
  age: Number,
  specialty: String,
  surgeryHistory: String,
  illnessHistory: String,
  password: String,
  image: String,
  accountType: {
    type: String,
    enum: ["Doctor", "Admin", "Patient"],
  },
});

const User = mongoose.model("user", userSchema);

export default User;
