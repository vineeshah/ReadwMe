import prisma from "@/app/config/db";

export async function getAllBooks() {
  try {
    const books = await prisma.book.findMany({
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
    throw new Error("Failed to create book");
  }
}
