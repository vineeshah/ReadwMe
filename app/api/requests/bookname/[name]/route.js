import prisma from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    const { name } = params;
    const author = request.headers.get("author")
    const userId = request.headers.get("userId");

    if (!author || !userId) {
        return NextResponse.json({ error: "Author and userId are required" }, { status: 400 });
    }

  try {
    const book = await prisma.book.findFirst({
      where: {
        name: {
            equals: name,
            mode: "insensitive", // Case-insensitive search 
          },
        author: {
        equals: author,
        mode: "insensitive", 
        },
        userId: userId,

      },
    });

    if (!book) {
      return NextResponse.json({"status":true})
    }

    return NextResponse.json({"status":false});
  } catch (error) {
    console.error("Error fetching the book:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
