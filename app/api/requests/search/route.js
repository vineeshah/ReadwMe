import prisma from "@/app/config/db";
import { NextResponse } from "next/server";

// GET /api/requests/search?q=hobbit&sort=name
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "publishDate";

  try {
    const books = await prisma.$queryRawUnsafe(
      `SELECT * FROM "Book" WHERE name ILIKE '%${q}%' OR author ILIKE '%${q}%' ORDER BY "${sort}" DESC LIMIT 50`
    );
    return NextResponse.json({ books, count: books.length });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
