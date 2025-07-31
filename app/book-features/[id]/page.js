"use client"
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function book({params}){
    const router = useRouter();
    const {id} = use(params); 
    const [book, setBook] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async() => { 
            setIsLoading(true);
            try {
                const response = await fetch(`/api/requests/${id}`,{
                    method:"GET"
                });
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();   
    }, [id]);

    return(
        <div data-theme="synthwave" className="min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <button 
                    onClick={() => router.push("/")} 
                    className="flex items-center text-primary hover:text-primary-focus mb-6 transition-colors duration-200"
                >
                   ← Back to Home
                </button>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-60 bg-base-100 rounded-xl shadow-lg p-8">
                        <div className="loading loading-spinner text-primary"></div>
                        <p className="text-lg font-medium mt-4">Loading book information...</p>
                    </div>
                ) : book ? (
                    <>
                        <div className="mb-6 bg-base-100 rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-6">
                                <h1 className="text-2xl font-bold mb-1">{book.name}</h1>
                                <h2 className="text-base opacity-90 font-light">by {book.author}</h2>
                            </div>
                            <div className="p-4">
                                <div className="flex flex-wrap gap-2">
                                    {book.genres?.map((genre, index) => (
                                        <span 
                                            key={genre.genreId} 
                                            className="badge badge-primary"
                                        >
                                            {genre.genre.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-primary mb-4 pl-2 border-l-4 border-primary">
                            Book Analysis Tools
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`../summarise/${id}`)}
                                    className="w-full h-full bg-base-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-primary"
                                >
                                    <div className="p-1 bg-primary w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-primary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <img
                                                src="/summarise.jpeg" 
                                                alt="Summarize"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        
                                        <div className="text-xl font-semibold text-primary mb-3">Summarize</div>
                                        <p className="text-sm mb-4">Generate a comprehensive summary of key points and themes in the book</p>
                                        <div className="mt-4 text-primary font-medium text-sm">View Summary →</div>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`/news/${id}`)}
                                    className="w-full h-full bg-base-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-secondary"
                                >
                                    <div className="p-1 bg-secondary w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-secondary bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <img
                                                src="/pop.jpeg" 
                                                alt="Pop Culture Hub"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="text-xl font-semibold text-secondary mb-3">Pop Culture Hub</div>
                                        <p className="text-sm mb-4">Get the latest and hottest tea about this book.</p>
                                        <div className="mt-4 text-secondary font-medium text-sm">Tea Time? →</div>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`/chatroom/${id}`)}
                                    className="w-full h-full bg-base-100 rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-accent"
                                >
                                    <div className="p-1 bg-accent w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-accent bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            
                                            <img
                                                src="/chatroom.jpeg" 
                                                alt="Chatroom"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                        <div className="text-xl font-semibold text-accent mb-3">Chatroom</div>
                                        <p className="text-sm mb-4">Discuss, ask questions, and explore deeper insights about the book</p>
                                        <div className="mt-4 text-accent font-medium text-sm">Start Chat →</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-base-100 rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-error bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-error text-2xl">!</span>
                        </div>
                        <p className="text-error font-medium text-lg mb-2">Failed to load book information</p>
                        <p className="opacity-70">There was a problem retrieving the book details.</p>
                        <button 
                            onClick={() => router.back()} 
                            className="mt-4 btn btn-primary"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}