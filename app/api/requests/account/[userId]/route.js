import { NextResponse } from "next/server";
import prisma from "@/app/config/db";

export async function PATCH(request, {params}){
    try{
        const body = await request.json()
        const { userId } = params;
      
        const updated = await prisma.user.update({
            where : {id:userId},
            data : body,
        })
        return NextResponse.json(updated, { status: 201 }); 
    }catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: "Failed to update username in the requests" },
          { status: 500 }
        );
      }
}
