"use client"
import { use, useState, useEffect } from "react";
import Snoowrap from "snoowrap";

export default function senti({params}){
    const [book, setBook] = useState(null)
    // const [link, setLink] = useState(null)
    // const [snippet, setSnippet] = useState(null) 
    const[title, setTitle] = useState(null)
    const [loading, setLoading] = useState(false)
    const [screenshot, setScreenshot] = useState(null)
    const {id} = use(params);

    const reddit = new Snoowrap({
        REDDIT_CLIENT_ID = ,
        REDDIT
    })
    
    useEffect(() => {
        const fetchData = async() => { 
            const response = await fetch(`/api/requests/${id}`,{
                method:"GET"
            })
            const data = await response.json();
            setBook(data);
        };
        fetchData();   
    }, [id])
    
    
    const handleSearch = async () => {
        if (book) {
            try {
                setLoading(true);
                // const result = await fetch(`/api/webscraper/`,{
                //     method:"POST",
                //     headers:{"Content-Type": "application/json"},
                //     body: JSON.stringify({book:book})
                // });
                // const data = await result.json();
                // setTitle(data.titles)
                // setScreenshot(data.screenshot)
                // setLink(data.firstLink);
                // setSnippet(data.title);
            } catch (error) {
                console.error("Error fetching link:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pop culture hub</h1>
                    
                    {book ? (
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-lg">
                                <span className="font-semibold text-blue-800">{book.name}</span>
                                <span className="text-gray-700"> by {book.author}</span>
                            </p>
                            
                            <div className="mt-4 text-center">
                                <button 
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className={`px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                >
                                    {loading ? 'Searching...' : 'Find out latest tea about your book!'}
                                </button>
                            </div>
                            
                            {loading && (
                                <div className="mt-4 text-center">
                                    <p className="text-gray-600">Tea Time...</p>
                                </div>
                            )}
                            
                            {title && !loading && (
                                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-2">Here ya go!:</h3>
                                    
                                    {screenshot && (
                                        <div className="mb-5">
                                            <p className="font-medium text-gray-700 mb-2">Search Results Screenshot:</p>
                                            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img 
                                                    src={screenshot} 
                                                    alt="Google Search Results" 
                                                    className="w-full h-auto object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="mb-3">
                                        <p className="font-medium text-gray-700">Recent News:</p>
                                        {title.map((item, index) => (
                                            <p key={index} className="text-gray-600 mb-2 py-2 border-b border-gray-100">
                                                {item}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">Loading book information...</p>
                    )}
        
                </div>
            </div>
        </div>
    );
}