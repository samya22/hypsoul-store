import { NextResponse } from "next/server";
import { isValidAdmin, SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!isValidAdmin(email, password)) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
