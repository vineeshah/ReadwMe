import prisma from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { id } = params;

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching the book:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
