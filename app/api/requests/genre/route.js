import prisma from "@/app/config/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const{genreData, bookId, userId} = body;
    if (!bookId || !Array.isArray(genreData) || genreData.length === 0) {
        return NextResponse.json(
          { error: "Invalid request body. Ensure bookId and genreData are provided." },
          { status: 400 }
        );
      }
    for (const { genre, weight } of genreData) {
    
        const genre_added = await prisma.genre.upsert({
          where: { name:genre },
          update: {},
          create: { name:genre },
        });
    
        
        await prisma.bookGenre.upsert({
          where: {
            bookId_genreId: {
              bookId: bookId,
              genreId: genre_added.id,
            },
          },
          update: { weight },
          create: {
            bookId: bookId,
            genreId: genre_added.id,
            weight: weight,
          },
        });
    }

    const userBooks = await prisma.book.findMany({
        where: { userId: userId },
        include: {
          genres: {
            include: {
              genre: true,
            },
          },
        },
    });

    const userGenre = {}
    for(const book of userBooks){
        for(const bookgenre of book.genres){
            const genreName = bookgenre.genre.name;
            const weight = bookgenre.weight;
            if(!userGenre[genreName]){
                userGenre[genreName] = weight
            }else{
                userGenre[genreName] += weight
            }
            
        }
    }
    const maxWeight = Math.max(...Object.values(userGenre))
    const norUserGenre = {};
    for (const genreName in userGenre) {
    norUserGenre[genreName] = userGenre[genreName] / maxWeight;
    }

    for(const genreName in norUserGenre){
        const genre = await prisma.genre.findUnique({
            where:{
                name:genreName
            }
        })
        if(!genre){
            console.log("genre not stored in the genre table!")
            return NextResponse.json(
                { error: ": genre route error" },
                { status: 400 }
              );
        }
        else{
            const genreId = genre.id
            await prisma.userGenrePreference.upsert({
                where:{
                    userId_genreId :{
                        userId : userId,
                        genreId: genreId
                    }
                },
                update:{
                    weight: norUserGenre[genreName]
                },
                create:{
                    userId : userId,
                    genreId: genreId,
                    weight: norUserGenre[genreName]

                },

                }
            )
        }
        
    }

    return NextResponse.json({
        status:201,
    })
    
      
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create bookgenre in the requests" },
      { status: 500 }
    );
  }
}