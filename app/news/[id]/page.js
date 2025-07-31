"use client"
import { use, useState, useEffect } from "react";
import { NextResponse } from "next/server";

export default function senti({params}){
    const [book, setBook] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const {id} = use(params);
    
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
        <div data-theme="synthwave" className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-base-100 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Pop Culture Hub</h1>
                        
                        {book ? (
                            <div className="mb-8 p-6 bg-base-200 rounded-lg border border-secondary border-opacity-30">
                                <p className="text-xl text-center mb-6">
                                    <span className="font-semibold text-primary">{book.name}</span>
                                    <span className="text-white"> by {book.author}</span>
                                </p>
                                
                                <div className="text-center mb-8">
                                    <button 
                                        onClick={() => handleSearch(false)}
                                        disabled={loading}
                                        className={`
                                            px-6 py-3 
                                            ${loading ? 'bg-gray-600' : 'bg-secondary hover:bg-secondary-focus'} 
                                            text-white font-medium rounded-lg
                                            focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50 
                                            transition-colors duration-200
                                            disabled:cursor-not-allowed
                                        `}
                                    >
                                        {loading ? 'Finding discussions...' : 'Find Reddit Discussions'}
                                    </button>
                                </div>
                                
                                    
                                {loading && (
                                    <div className="mt-4 text-center">
                                        <p className="text-secondary">Tea Time...</p>
                                    </div>
                                )}
                      
                                {posts.length > 0 && !loading && (
                                    <div className="mt-8">
                                        <h2 className="text-2xl font-bold text-secondary mb-4">Reddit Discussions</h2>
                                        <div className="space-y-4">
                                            {posts.map((post, index) => (
                                                <div key={index} className="bg-base-300 p-4 rounded-lg shadow border border-secondary border-opacity-20">
                                                    <div className="flex items-start justify-between">
                                                        <h3 className="text-lg font-semibold text-secondary hover:text-secondary-focus">
                                                            <a 
                                                                href={`https://reddit.com${post.permalink}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                            >
                                                                {post.title}
                                                            </a>
                                                        </h3>
                                                        <span className="text-sm text-white">
                                                            {post.score} points
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="mt-2 text-sm text-white text-opacity-70">
                                                        Posted by u/{post.author} in r/{post.subreddit}
                                                    </div>
                                                    
                                                    {post.selftext && (
                                                        <p className="mt-3 text-white line-clamp-3">
                                                            {post.selftext}
                                                        </p>
                                                    )}
                                                    
                                                    <div className="mt-3 flex items-center space-x-4 text-sm text-white text-opacity-70">
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
                            <p className="text-center text-white">Loading book information...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}