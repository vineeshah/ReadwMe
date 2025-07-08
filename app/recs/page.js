import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function recs(){
    const [recBooks, setrecBooks] = useState()
    const {data:session} = useSession()
    const userId = session?.user?.id


    useEffect(()=>{
        const fetchSimilarUserBooks = async() =>{
            const response = await fetch(`api/similarUser/${userId}`)
            const data = await response.json()
            setrecBooks(data.books)
            
        }
    },[])

    return(
        <div>

        </div>
    )
}