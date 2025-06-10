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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
            <div className="max-w-5xl mx-auto p-6">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition-colors duration-200"
                >
                   Back to Books
                </button>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-60 bg-white bg-opacity-70 rounded-xl shadow-lg p-8">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg text-indigo-800 font-medium">Loading book information...</p>
                    </div>
                ) : book ? (
                    <>
                        <div className="mb-10 bg-white rounded-xl shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 px-8">
                                <h1 className="text-4xl font-bold mb-2">{book.name}</h1>
                                <h2 className="text-xl opacity-90 font-light">by {book.author}</h2>
                            </div>
                            <div className="p-6">
                                {book.description && (
                                    <p className="text-gray-700 mb-4 leading-relaxed">{book.description}</p>
                                )}
                                <div className="flex flex-wrap gap-3">
                                    {book.genres?.map((genre, index) => (
                                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-indigo-500">
                            Book Analysis Tools
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`../summarise/${id}`)}
                                    className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-indigo-500"
                                >
                                    <div className="p-1 bg-indigo-500 w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        </div>
                                        <div className="text-xl font-semibold text-gray-800 mb-3">Summarize</div>
                                        <p className="text-gray-600 text-sm mb-4">Generate a comprehensive summary of key points and themes in the book</p>
                                        <div className="mt-4 text-indigo-600 font-medium text-sm">View Summary →</div>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`/sentiment/${id}`)}
                                    className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-purple-500"
                                >
                                    <div className="p-1 bg-purple-500 w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                           
                                        </div>
                                        <div className="text-xl font-semibold text-gray-800 mb-3">Sentiment Analysis</div>
                                        <p className="text-gray-600 text-sm mb-4">Understand the emotional tone and mood throughout the book</p>
                                        <div className="mt-4 text-purple-600 font-medium text-sm">Analyze Sentiment →</div>
                                    </div>
                                </button>
                            </div>
                            
                            <div className="transform transition-all duration-300 hover:scale-105">
                                <button
                                    onClick={() => router.push(`/chatroom/${id}`)}
                                    className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl border-b-4 border-blue-500"
                                >
                                    <div className="p-1 bg-blue-500 w-full"></div>
                                    <div className="p-6 text-center">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            
                                        </div>
                                        <div className="text-xl font-semibold text-gray-800 mb-3">Chatroom</div>
                                        <p className="text-gray-600 text-sm mb-4">Discuss, ask questions, and explore deeper insights about the book</p>
                                        <div className="mt-4 text-blue-600 font-medium text-sm">Start Chat →</div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white bg-opacity-80 rounded-xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-500 text-2xl">!</span>
                        </div>
                        <p className="text-red-500 font-medium text-lg mb-2">Failed to load book information</p>
                        <p className="text-gray-600">There was a problem retrieving the book details.</p>
                        <button 
                            onClick={() => router.back()} 
                            className="mt-4 px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}