"use client"
import {use, useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function summariser({params}){
    const {id} = use(params);
    const [book, setBook] = useState(null);
    const [prompt, setPrompt] = useState("")
    const [response, setResponse] = useState("")
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Summarizer</h1>
                    
                    {book && (
                        <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-lg">
                                <span className="font-semibold text-blue-800">{book.name}</span>
                                <span className="text-gray-700"> by {book.author}</span>
                            </p>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                            Ask anything about this book:
                        </label>
                        <textarea 
                            id="prompt"
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
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
                                loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        >
                            {loading ? "Analyzing..." : "Ask Away"}
                        </button>
                    </div>
                    
                    {response && (
                        <div className="mt-10 animate-fade-in">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Response</h2>
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner prose prose-black max-w-none text-black">
                                <ReactMarkdown>{response}</ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}