import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { createSessionToken, AUTH_COOKIE } from "@/lib/auth";
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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    await connectDB();
    const User = getUserModel();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Block unverified users — resend a fresh token
    if (user.isVerified === false) {
      const verifyToken = crypto.randomUUID();
      const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      user.verifyToken = verifyToken;
      user.verifyTokenExpiry = verifyTokenExpiry;
      await user.save();
      await sendVerificationEmail(user.email, verifyToken);

      return NextResponse.json(
        { error: "Please verify your email before logging in. A new verification link has been sent to your inbox." },
        { status: 403 }
      );
    }

    const token = createSessionToken(user._id.toString(), user.email);

    const response = NextResponse.json({
      success: true,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });

    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}