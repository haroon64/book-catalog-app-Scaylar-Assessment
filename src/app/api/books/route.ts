import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust path if different
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";  // adjust path if needed

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in Book GET:", session);

    if (!session?.user?.id) {
       
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const books = await prisma.books.findMany({
      where: { userId: Number(session.user.id) }, // ✅ fetch only logged-in user's books
      orderBy: { id: "desc" },
      include: { user: true }
    });

    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("Session in Book POST:", session);


    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User Email from Session:", session.user.email);

    const body = await req.json();
    const { book_name, author, book_description, publication_year, rating, genre } = body;

    if (!book_name || !author || !publication_year || !genre || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Get logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newBook = await prisma.books.create({
      data: {
        book_name,
        author,
        book_description,
        publication_year: Number(publication_year),
        rating: Number(rating) || 0,
        genre,
        userId: user.id
      },
    });

    return NextResponse.json(newBook, { status: 201 });

  } catch (error) {
    console.log("Book POST Error:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}
