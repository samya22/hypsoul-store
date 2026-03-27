import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE = "hypsoul_admin_session";
const AUTH_COOKIE = "hypsoul_user_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin-login") {
    const session = request.cookies.get(ADMIN_COOKIE);
    if (!session || session.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
  }

  // Protect /account route
  if (pathname.startsWith("/account")) {
    const userSession = request.cookies.get(AUTH_COOKIE);
    if (!userSession) {
      return NextResponse.redirect(new URL("/login?redirect=/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
