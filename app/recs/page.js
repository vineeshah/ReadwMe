"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import askGroq from "../components/askGroq";

export default function recs(){
    const [recBooks, setRecBooks] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {data:session} = useSession()
    const userId = session?.user?.id
    const [useAskGroq, setUseAskGroq] = useState(false)
    const [sim, setSim] = useState(5)
    const [pendingSim, setPendingSim] = useState(5);
    const handleToggleGroq = () => {
        setUseAskGroq(!useAskGroq);
        setRecBooks([]); 
        setIsLoading(true);
    };
    const handleSimChange = (event) => {
        setPendingSim(parseInt(event.target.value));
    };
    const handleApplyChanges = () => {
        setSim(pendingSim); 
    };
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!userId) return;

            try {
                setIsLoading(true);
                setError(null);

                if (useAskGroq) {
                    const response = await fetch("/api/requests");
                    const b = await response.json();
                    setUserBooks(b);
                    
                    const aiRecs = await askGroq({
                        id: userId,
                        sim: sim,
                        books: userBooks
                    });
                    setRecBooks(aiRecs);
                } else {
                    const response = await fetch(`/api/similarUser/${userId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch recommendations');
                    }
                    const data = await response.json();
                    setRecBooks(data.books || []);
                }
            } catch (err) {
                setError(err.message);
                console.error("Error fetching recommendations:", err);
                setRecBooks([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, [userId, useAskGroq, sim]);
    
    

    // if (isLoading) return <div className="p-4">Loading recommendations...</div>;
    // if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
    // if (!recBooks?.length) return <div className="p-4">No recommendations found</div>;

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    {useAskGroq ? 'AI Recommendations' : 'User-Based Recommendations'}
                </h1>

                <div className="mt-4 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <button
                            onClick={handleToggleGroq}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            {useAskGroq ? 'Use Custom Recommendation Algorithm' : 'Use AI Recommendations'}
                        </button>
                        
                        {useAskGroq && (
                            <div className="flex items-center gap-4">
                                <label htmlFor="similarity" className="text-sm font-medium whitespace-nowrap">
                                    Similarity To Your Taste - {pendingSim}
                                </label>
                                <input
                                    type="range"
                                    id="similarity"
                                    min="1"
                                    max="10"
                                    value={pendingSim}
                                    onChange={handleSimChange}
                                    className="w-48 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <button
                                    onClick={handleApplyChanges}
                                    disabled={pendingSim === sim}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 
                                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Fetch
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
    
            
            {isLoading && <div className="p-4">Loading recommendations...</div>}
            {error && <div className="p-4 text-red-500">Error: {error}</div>}
            {!isLoading && !error && !recBooks?.length && (
                <div className="p-4">No recommendations found</div>
            )}
    
            
            {!isLoading && !error && recBooks?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recBooks.map((book, index) => (
                        <div key = {Math.random()} 
                             className={`border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow
                                 ${index < 3 ? 'border-yellow-400' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-xl font-semibold">{book.name}</h2>
                                {index < 3 && (
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
                                        Top Pick
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600 mb-3">By {book.author}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}