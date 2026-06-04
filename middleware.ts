import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "./src/utils/auth";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value || getToken();
  //   const token = request.cookies.get("session-token"); // Replace with your auth check

  console.log("token", token);
  // Define routes that require authentication
  if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: ["/dashboard/:path*"],
};
