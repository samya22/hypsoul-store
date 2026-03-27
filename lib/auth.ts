import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export const AUTH_COOKIE = "hypsoul_user_session";

function getUserModel() {
  if (mongoose.models.User) return mongoose.models.User;
  const schema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    createdAt: { type: Date, default: Date.now },
  });
  return mongoose.model("User", schema);
}

export function createSessionToken(userId: string, email: string): string {
  const payload = JSON.stringify({ userId, email, ts: Date.now() });
  return Buffer.from(payload).toString("base64");
}

export function parseSessionToken(token: string): { userId: string; email: string } | null {
  try {
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (!payload.userId || !payload.email) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) return null;

    const parsed = parseSessionToken(token);
    if (!parsed) return null;

    await connectDB();
    const User = getUserModel();
    const user = await User.findById(parsed.userId).select("-password").lean() as any;
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  } catch {
    return null;
  }
}
