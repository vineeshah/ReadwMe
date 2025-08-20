"use client"
import {use, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import { useRouter } from "next/navigation";

export default function Summariser({params}){
    const {id} = use(params);
    const [book, setBook] = useState(null);
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false);
    const router = useRouter();

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

    const handleSubmit = async(text) => {
        if (!text.trim()) return;
        
        setLoading(true);
        const pr = `with ${book.name} from ${book.author}in context, answer the following prompt from the user: ${text}`;
        
        try {
            const res = await fetch("/api/summariser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({prompt: pr})
            });
            
            const answer = await res.json();
            setResponse(answer.result);
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponse("Sorry, there was an error processing your request.");
        } finally {
            setLoading(false);
            setPrompt("")
        }
    }
    
    return (
        <div data-theme="synthwave" className="min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => router.push(`/book-features/${id}`)}
                    className="flex items-center text-primary hover:text-primary-focus mb-6 transition-colors duration-200"
                >
                    ← Back to Tools
                </button>
                <div className="bg-base-100 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-primary mb-6 text-center">Book Summarizer</h1>
                        
                        {book && (
                            <div className="mb-8 p-4 bg-base-200 rounded-lg border border-primary border-opacity-30">
                                <p className="text-lg text-center">
                                    <span className="font-semibold text-primary">{book.name}</span>
                                    <span className="text-white"> by {book.author}</span>
                                </p>
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <label htmlFor="prompt" className="block text-sm font-medium text-white mb-2">
                                Ask anything about this book:
                            </label>
                            <textarea 
                                id="prompt"
                                rows="4"
                                className="w-full px-3 py-2 bg-base-300 text-white border border-primary border-opacity-30 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                onChange={(e) => setPrompt(e.target.value)} 
                                placeholder="E.g., Summarize the main themes, Explain the character development..."
                                value={prompt}
                            />
                        </div>
                        
                        <div className="flex justify-center">
                            <button 
                                onClick={() => handleSubmit(prompt)}
                                disabled={loading}
                                className={`px-6 py-2 rounded-md text-white font-medium ${
                                    loading ? 'bg-gray-600' : 'bg-primary hover:bg-primary-focus transform hover:scale-105 transition-all'
                                } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                            >
                                {loading ? "Analyzing..." : "Ask Away"}
                            </button>
                        </div>
                        
                        {response && (
                            <div className="mt-10 animate-fade-in">
                                <h2 className="text-2xl font-semibold text-secondary mb-4">Response</h2>
                                <div className="bg-base-200 p-6 rounded-lg border border-secondary border-opacity-30 shadow-inner prose prose-invert max-w-none">
                                    <ReactMarkdown>{response}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}