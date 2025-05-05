import { getAllBooks, postABook } from "@/app/services/bookService";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newBook = await postABook(body); 
    return NextResponse.json(newBook, { status: 201 }); 
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}