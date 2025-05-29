// middleware.ts
import { auth } from "@/auth"; // Import dari auth config Anda
import { NextResponse } from "next/server";

export default auth((req) => {
  console.log("🔥 Middleware running for:", req.nextUrl.pathname);
  console.log("🔑 Session:", req.auth ? "exists" : "null");

  const { pathname } = req.nextUrl;

  // Izinkan akses ke halaman login dan API auth
  if (pathname === "/login" || pathname.startsWith("/api/auth")) {
    console.log("✅ Allowing access to login/auth pages");
    return NextResponse.next();
  }

  // Jika tidak ada session, redirect ke /login
  if (!req.auth) {
    console.log("❌ No session, redirecting to login");
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ Session found, allowing access");
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
