// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("🔥 Middleware running for:", req.nextUrl.pathname);

  // ✅ Tambahkan cookieName eksplisit
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log("🧪 Cookie header:", req.headers.get("cookie"));
  console.log("🔑 Token:", token ? "exists" : "null");

  const { pathname } = req.nextUrl;

  // Izinkan akses ke halaman login
  if (pathname === "/login") {
    console.log("✅ Allowing access to login page");
    return NextResponse.next();
  }

  // Jika tidak ada token, redirect ke /login
  if (!token) {
    console.log("❌ No token, redirecting to login");
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ Token found, allowing access");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
