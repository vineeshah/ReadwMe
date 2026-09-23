import { getAllBooks, postABook } from "@/app/services/bookService";
import { NextResponse } from "next/server";
import prisma from "@/app/config/db";

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
    if (!body.userId) {
      return NextResponse.json(
        { error: "userId is required to create a book" },
        { status: 400 }
      );
    }
    const newBook = await postABook(body); 
    return NextResponse.json(newBook, { status: 201 }); 
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create book in the requests" },
      { status: 500 }
    );
  }
}

export async function PATCH(request){
    try{
        const body = await request.json()
        const { id, ...data } = body

        const updated = await prisma.book.update({
            where : { id },
            data,
        })
        return NextResponse.json(updated, { status: 200 });
    }catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Failed to update book in the requests" },
          { status: 500 }
        );
    }
}

// DELETE /api/requests?id=<bookId>  (also accepts { id } in the body for older clients)
export async function DELETE(request){
    try{
        const { searchParams } = new URL(request.url)
        let id = searchParams.get("id")
        if (!id) {
            const body = await request.json()
            id = body.id
        }
        const deleted = await prisma.book.deleteMany({
            where : { OR: [{ id }, { name: id }] },
        })
        return NextResponse.json(deleted, { status: 200 });
    }catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Failed to delete book in the requests" },
          { status: 500 }
        );
    }
}
