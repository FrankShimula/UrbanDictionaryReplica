import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// Paths that require authentication
const protectedPaths = ['/wordadd'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get("authorization")?.replace("Bearer ", "");

  // Debug log for token
  console.log("Token:", token);

  // If accessing a protected route
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    // If no token, redirect to login page
    if (!token) {
      return NextResponse.redirect(new URL('/Login', request.url));
    }

    try {
      // Verify JWT token
      jwt.verify(token, process.env.JWT_SECRET!);
      // Token is valid, allow the request to proceed
      return NextResponse.next();
    } catch (err) {
      // If the token is invalid, redirect to login
      return NextResponse.redirect(new URL('/Login', request.url));
    }
  }

  // Allow request to proceed if not accessing a protected route
  return NextResponse.next();
}

// Specify paths the middleware should run for
export const config = {
  matcher: ['/wordadd', '/wordadd/:path*'],
};
