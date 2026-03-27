import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

function getUserModel() {
  if (mongoose.models.User) return mongoose.models.User;
  const schema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    createdAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
  });
  return mongoose.model("User", schema);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const User = getUserModel();
    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      // No user found with that token — either already verified or invalid
      return NextResponse.json({ message: "Email already verified" }, { status: 200 });
    }

    // Check expiry
    if (user.verifyTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Verification link has expired. Please log in to get a new one." },
        { status: 410 }
      );
    }

    // Mark verified and clear token
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Verify error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}