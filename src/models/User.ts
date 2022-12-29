import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "must provide username"],
    trim: true,
    maxlength: [20, "name cannnot be more than 20 characters"],
  },
  roles: {
    User: { type: Number, default: 2001 },
    Editor: Number,
    Admin: Number,
  },
  password: { type: String, required: true },
  refreshToken: String,
});

export default mongoose.model("User", userSchema);
