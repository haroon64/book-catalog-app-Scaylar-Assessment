import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }


  const publicRoutes = ["/api/signup", "/api/auth", "/login", "/register"];
  const isPublicRoute = publicRoutes.some((path) => pathname.startsWith(path));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/book")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const res = NextResponse.next();
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}


export const config = {
  matcher: ["/book/:path*", "/api/:path*"],
};
