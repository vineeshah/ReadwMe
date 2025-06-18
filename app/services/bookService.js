import prisma from "@/app/config/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export async function getAllBooks() {
  try {
    const session = await getServerSession(authOptions); 
    const userId = session?.user?.id;
    console.log(userId)
    const books = await prisma.book.findMany({
      where:{
        userId:userId
      },
      orderBy: {
        publishDate: "desc",
      },
    });
    return books;
  } catch (error) {
    throw new Error("Failed to fetch books");
  }
}

export async function postABook(data) {
  try {
    const newBook = await prisma.book.create({
      data: {
        name: data.name,
        author: data.author,
        userId: data.userId,
        publishDate: data.publishDate, 
      },
    });
    return newBook;
  } catch (error) {
    console.log(error)
  }
}
