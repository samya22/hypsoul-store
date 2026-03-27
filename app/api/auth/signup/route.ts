import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

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

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    await connectDB();
    const User = getUserModel();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomUUID();
    const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
      verifyToken,
      verifyTokenExpiry,
    });

    await sendVerificationEmail(email.toLowerCase(), verifyToken);

    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify your account before logging in.",
    });
  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}