"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function recs(){
    const [recBooks, setRecBooks] = useState()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {data:session} = useSession()
    const userId = session?.user?.id


    useEffect(()=>{
        const fetchSimilarUserBooks = async() =>{
            try {
                setIsLoading(true);
                const response = await fetch(`/api/similarUser/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }
                const data = await response.json();
                setRecBooks(data.books || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
            
        };
        fetchSimilarUserBooks()
    },[userId])

    if (isLoading) return <div className="p-4">Loading recommendations...</div>;
    if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    if (!recBooks?.length) return <div className="p-4">No recommendations found</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Book Recommendations</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recBooks.map((book) => (
                    <div key={book.id} className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">{book.name}</h2>
                        <p className="text-gray-600 mb-3">By {book.author}</p>
                        {book.genres && book.genres.length > 0 && (
                            <div>
                                <p className="text-sm text-gray-500 mb-2">Genres:</p>
                                <div className="flex flex-wrap gap-2">
                                    {book.genres.map((genre, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}