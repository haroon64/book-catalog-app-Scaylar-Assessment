import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://book-catalog-app-scaylar-assessment-cha4-cmxhwxy7v.vercel.app"] // change to your real domains
    : ["http://localhost:3000", "http://localhost:3001"];

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // Origin not allowed
  return new Response(null, {
    status: 403,
  });
}

export async function POST(req: Request) {
  try {
    const origin = req.headers.get("origin");

    // Set CORS for allowed origins
    const corsHeaders: Record<string, string> = {};
    if (origin && allowedOrigins.includes(origin)) {
      corsHeaders["Access-Control-Allow-Origin"] = origin;
      corsHeaders["Access-Control-Allow-Credentials"] = "true";
    }

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists. Please login." },
        { status: 400, headers: corsHeaders }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json(
      { message: "Signup successful", user },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
