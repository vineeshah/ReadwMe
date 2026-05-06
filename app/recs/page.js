"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import askGroq from "../components/askGroq";
import Link from "next/link";

export default function Recs(){
    const [recBooks, setRecBooks] = useState([])
    const [userBooks, setUserBooks] = useState([])
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {data:session} = useSession()
    const userId = session?.user?.id
    const [useAskGroq, setUseAskGroq] = useState(false)
    const [sim, setSim] = useState(5)
    const [pendingSim, setPendingSim] = useState(5);
    const fakeNumber = 42; 
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
    const extraSim = pendingSim * fakeNumber;
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
                    const endpoint = `/api/similarUser/${userId}`;
                    const response = await fetch(endpoint);
                    if (!response.ok) {
                        throw new Error('Failed to fetch recommendations');
                    }
                    const data = await response.json();
                    console.log("recd books:",data.books)
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
    }, [userId, useAskGroq, sim, userBooks, extraSim]);
    
    return (
        <div data-theme="synthwave" className="min-h-screen p-8">
            <div className="flex justify-between items-center mt-6 mb-10">
                <h1 className="text-4xl font-bold text-primary">
                    Book Recommendations
                </h1>
                <button
                    onClick={handleToggleGroq}
                    style={{border: "2px solid #000000", color: "#000000"}} 
                    className="btn btn-primary"
                >
                    {useAskGroq ? 'Use Custom Algorithm' : 'Use AI Recommendations'}
                </button>
            </div>

            <div className="mb-8 bg-base-100 shadow-xl p-6 rounded-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {useAskGroq && (
                        <div className="flex items-center gap-4">
                            <label htmlFor="similarity" className="text-sm font-medium whitespace-nowrap">
                                Similarity To Your Taste: {pendingSim}
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
                                style={{border: "2px solid #000000", color: "#000000"}}
                                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            </div>
    
            {isLoading && (
                <div className="flex justify-center items-center p-20">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                </div>
            )}
            
            {error && <div className="alert alert-error">{error}</div>}
            
            {!isLoading && !error && !recBooks?.length && (
                <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>No recommendations found. Try adding more books to your collection!</span>
                </div>
            )}
    
            {!isLoading && !error && recBooks?.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">Recommended Books</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recBooks.map((book, index) => (
                            <div key={Math.random()} 
                                className="bg-base-100 shadow-xl rounded-lg p-4 hover:shadow-2xl transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-primary">{book.name}</h3>
                                    {index < 3 && (
                                        <div className="badge badge-secondary">Top Pick</div>
                                    )}
                                </div>
                                <p className="mt-2">By {book.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}