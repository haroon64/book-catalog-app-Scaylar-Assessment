import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  
  try {
 
   const { id } = await context.params; 
   
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const bookId = Number(id);

    

    if (!bookId || Number.isNaN(bookId)) {
      return NextResponse.json({ message: "Invalid Book ID" }, { status: 400 });
    }

    const book = await prisma.books.findUnique({
      where: { id: bookId }
    });

 

    if (!book) {
      return NextResponse.json({ message: "Book not found" }, { status: 404 });
    }

    if (book.userId !== Number(session.user.id)) {
      return NextResponse.json({ message: "Not allowed" }, { status: 403 });
    }


    await prisma.books.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Book deleted successfully" });

  } catch (error) {
    
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
