"use client"
import { use, useState, useEffect } from "react";
// import Snoowrap from "snoowrap";
import { NextResponse } from "next/server";

export default function senti({params}){
    const [book, setBook] = useState(null)
    const [posts, setPosts] = useState([])
    // const [link, setLink] = useState(null)
    // const [snippet, setSnippet] = useState(null) 
    // const[title, setTitle] = useState(null)
    const [loading, setLoading] = useState(false)
    // const [screenshot, setScreenshot] = useState(null)
    const {id} = use(params);

    // const reddit = new Snoowrap({
    //     userAgent: 'nextjs-app(by /u/vineeshah)',
    //     clientId: process.env.REDDIT_CLIENT_ID,
    //     clientSecret: process.env.REDDIT_CLIENT_SECRET,
    //     username: process.env.REDDIT_USERNAME,
    //     password: process.env.REDDIT_PASSWORD
    // })
    // reddit.getHot().map(post => post.title).then(console.log);
    
    useEffect(() => {
        const fetchData = async() => { 
            try{
                const response = await fetch(`/api/requests/${id}`,{
                    method:"GET"
                })
                const data = await response.json();
                setBook(data);
            }catch(e){
                console.log("book fetching error", e)
            }
        };
        fetchData();   
    }, [id])
    
    
    const handleSearch = async (retryWithAuthor = false) => {
        if (book?.name) {
            try {
                setLoading(true);
                console.log("retryWithAuthor", retryWithAuthor)
                const searchQuery = retryWithAuthor 
                ? book.author 
                : book.name
                console.log("using this search query:", searchQuery)
                const redditRes = await fetch(`/api/reddit?q=${encodeURIComponent(searchQuery)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (!redditRes.ok) {
                    throw new Error(`Reddit API returned ${redditRes.status}`);
                }
                
                const redditData = await redditRes.json();
                console.log("redditData", redditData)
                const posts = redditData.data.children.map(child => child.data);
                if(posts.length==0 && !retryWithAuthor){
                    console.log("No results with book name, trying author...");
                    return handleSearch(true);
                }
                console.log("posts", posts)
                setPosts(posts);
            } catch (error) {
                console.error("Error fetching Reddit posts:", error);
            } finally {
                setLoading(false);
            }
        }
    };
    
    return(
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Pop Culture Hub</h1>
                    
                    {book ? (
                        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-xl text-center mb-6">
                                <span className="font-semibold text-blue-800">{book.name}</span>
                                <span className="text-gray-700"> by {book.author}</span>
                            </p>
                            
                            <div className="text-center mb-8">
                                <button 
                                    onClick={() => handleSearch(false)}
                                    disabled={loading}
                                    className={`
                                        px-6 py-3 
                                        ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
                                        text-white font-medium rounded-lg
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                                        transition-colors duration-200
                                        disabled:cursor-not-allowed
                                    `}
                                >
                                    {loading ? 'Finding discussions...' : 'Find Reddit Discussions'}
                                </button>
                            </div>
                            
                                
                            {loading && (
                                <div className="mt-4 text-center">
                                    <p className="text-gray-600">Tea Time...</p>
                                </div>
                            )}
                  
                            {posts.length > 0 && !loading && (
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Reddit Discussions</h2>
                                    <div className="space-y-4">
                                        {posts.map((post, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                                        <a 
                                                            href={`https://reddit.com${post.permalink}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                        >
                                                            {post.title}
                                                        </a>
                                                    </h3>
                                                    <span className="text-sm text-gray-500">
                                                        {post.score} points
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-2 text-sm text-gray-600">
                                                    Posted by u/{post.author} in r/{post.subreddit}
                                                </div>
                                                
                                                {post.selftext && (
                                                    <p className="mt-3 text-gray-700 line-clamp-3">
                                                        {post.selftext}
                                                    </p>
                                                )}
                                                
                                                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>{post.num_comments} comments</span>
                                                    <span>• {new Date(post.created_utc * 1000).toLocaleDateString()}</span>
                                                </div>
                                            </div>
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