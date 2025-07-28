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
            equals: name
              .normalize("NFKD")                         // Normalize accents (é → e)
              .replace(/[\u0300-\u036f]/g, "")           // Remove diacritics
              .trim()                                    // Remove leading/trailing spaces
              .split(/[\s\-_/]+/)                        // Split on space, hyphen, slash, underscore
              .filter(Boolean)                           // Remove empty parts
              .map(word =>
                word.charAt(0).toUpperCase() + 
                word.slice(1).toLowerCase()
              )
              .join(" "),
            mode: "insensitive", // Case-insensitive search 
          },
        author: {
        equals: author
        .normalize("NFKD")                         // Normalize accents (é → e)
        .replace(/[\u0300-\u036f]/g, "")           // Remove diacritics
        .trim()                                    // Remove leading/trailing spaces
        .split(/[\s\-_/]+/)                        // Split on space, hyphen, slash, underscore
        .filter(Boolean)                           // Remove empty parts
        .map(word =>
          word.charAt(0).toUpperCase() + 
          word.slice(1).toLowerCase()
        )
        .join(" "),
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
