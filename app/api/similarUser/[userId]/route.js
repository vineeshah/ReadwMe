import prisma from "@/app/config/db";

export async function GET(request, {params}){
    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || 2;
    try{
        const userprefs = await prisma.user.findUnique({
            where:{
                id:userId
            },
            include:{
                genrePrefs: {
                    include: {
                        genre:true
                    }
                }
            }
        });

        const similaruser = await prisma.user.findMany({
            where:{
                NOT: {id:userId},
                genrePrefs: {
                    some:{
                        genreId: {
                            in: userPreferences.genrePrefs.map(pref => pref.genreId)
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
        })
    }catch(e){
        console.log("error fetching similar user")
    }
}