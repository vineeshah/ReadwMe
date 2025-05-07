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
        
        const updated = await prisma.book.update({
            where : {id:body.id},
            data : body,
        })
        return NextResponse.json(updated, { status: 201 }); 
    }catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Failed to update book in the requests" },
          { status: 500 }
        );
      }
}
export async function DELETE(request){
    try{
        const body = await request.json()
        const deleted = await prisma.book.delete({
            where : {id:body.id},
        })
        return NextResponse.json(deleted, { status: 201 }); 
    }catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Failed to delete book in the requests" },
          { status: 500 }
        );
      }

    
}