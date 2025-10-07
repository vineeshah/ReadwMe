import prisma from "@/app/config/db";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 5;//option to change the limit of similarusers
    try{
        const userPrefs = await prisma.user.findUnique({
            where:{
                id:userId
            },
            include:{
                genrePrefs: {
                    orderBy:{
                        weight: 'desc'
                    },
                    take:5,//making sure to get only top 5 genres of the user to be compared
                    include: {
                        genre:true
                    }
                }
            }
        });
        // console.log("userPrefs", userPrefs)

        const similarUsers = await prisma.user.findMany({
            where:{
                NOT: {id:userId},
                genrePrefs: {
                    some:{
                        genreId: {
                            in: userPrefs.genrePrefs.map(pref => pref.genreId)
                        }
                    }
                }
            },
            include:{
                genrePrefs: {
                    include: {
                        genre: true
                    }
                }
            },
            take: limit
        });
        // console.log("similarUsers", JSON.stringify(similarUsers))

        const similarityScore = {}
        for(const otherUser of similarUsers){
            let userScore = 0;
            for(const otherGenre of otherUser.genrePrefs){
                const matchingGenre = userPrefs.genrePrefs.find(
                    userGenre => userGenre.genre.name === otherGenre.genre.name
                );
                if(matchingGenre){
                    userScore += matchingGenre.weight * otherGenre.weight
                }
            }
            similarityScore[otherUser.id] = userScore;
        };
        console.log("similarityScores", similarityScore)
        //now fetching the top 2 users with the highest similarity score
        const topUsers = Object.entries(similarityScore)
        .sort(([,a], [,b]) => b - a)  // sort by score in descending order
        .slice(0, 2)                   // taking top 2
        .map(([userId, score]) => ({
            userId,
            score,  
        }));

        const userBooks = await prisma.book.findMany({
            where: {userId:userId},
            select: {name:true}
        });
        
        //now fetching those books from the similar users which the current user hasnt read
        const similarUserBooks = await prisma.book.findMany({
            where:{
                userId:{
                    in: topUsers.map(user => user.userId)
                },
            },
        });
        // console.log("similarUserBooks", similarUserBooks)
        const userBookNames = new Set(
            userBooks.map(book => book.name.toLowerCase())//to avoid same book recs as the userbooks
        );
        const uniqueBooks = similarUserBooks.filter(book => 
            !userBookNames.has(book.name.toLowerCase())
        );
        // console.log("uniqueBooks", uniqueBooks)

        //now removing dups from the recommended books
        const uBooks = new Set();
        const uniqueFilteredBooks = [];
        for (const book of uniqueBooks) {
            const bookName = book.name.toLowerCase();
            if (!uBooks.has(bookName)) {
                uBooks.add(bookName);
                uniqueFilteredBooks.push(book);
            }
        }

        return NextResponse.json({
            users: similarUsers,
            books: uniqueFilteredBooks
        })


    }catch(e){
        console.log("error fetching similar user")
        return NextResponse.json({
            status: 500
        })
    }
}
//DIRECT_URL="postgresql://postgres:fisjId-mogho9-xutqew@db.sygumziwurxkruptgskb.supabase.co:5432/postgres?sslmode=require"
//DATABASE_URL="postgresql://postgres:fisjId-mogho9-xutqew@db.sygumziwurxkruptgskb.supabase.co:5432\/postgres?pgbouncer=true&connection_limit=1&pool_timeout=0&sslmode=require"
