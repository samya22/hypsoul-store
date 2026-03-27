import { NextResponse } from "next/server";

// In-memory store — swap for DB in production
const subscribers: { email: string; subscribedAt: string }[] = [];

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const already = subscribers.find((s) => s.email === email);
    if (already) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list!",
      });
    }

    subscribers.push({ email, subscribedAt: new Date().toISOString() });

    return NextResponse.json({
      success: true,
      message: "You're in! Early access drops straight to your inbox.",
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
