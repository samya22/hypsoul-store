import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // Email verification
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
  verifyTokenExpiry: { type: Date },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;