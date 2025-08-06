"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthButton from "./components/AuthButton";

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(null);
  const [editBook, setEditBook] = useState({ name: "", author: "" });
  const [openDropdown, setOpenDropdown] = useState(null);
  const {status} = useSession()
  
  const toggleDropdown = (idx) => {
    setOpenDropdown(openDropdown === idx ? null : idx);
  };

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("/api/requests", { 
          method: "GET",
        }); 
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if(status=="authenticated"){
      fetchBooks();
    }
    
  }, [status]);

  const handleDelete = async(id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this book?");
    
    if (!isConfirmed) {
      return; 
    }
    
    try{
      const response = await fetch("/api/requests", {
        method : "DELETE",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({id: id})
      });
      setIndex(null)
      const data = await response.json()
      console.log('Book deleted:', data);
      alert('book deleted!')
      window.location.reload()
    }catch(error){
      console.log(error);
    }
  }
  if(status=="unauthenticated"){
    return (
      <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
        {/* Hero Section */}
        <div className="hero min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse max-w-7xl">
            <div className="text-center lg:text-left lg:w-1/2">
              <h1 className="text-5xl font-bold text-primary">ReadwMe</h1>
              <div className="badge badge-secondary my-2">Beta Version</div>
              <p className="py-6 text-lg">
                Your intelligent reading companion powered by AI. Track your books, discover personalized recommendations, 
                and connect with a community that shares your literary passion.
              </p>
              <div className="stats shadow my-4 bg-base-100">
                <div className="stat">
                  <div className="stat-figure text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <div className="stat-title">Books Tracked</div>
                  <div className="stat-value text-primary">10K+</div>
                </div>
                
                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  </div>
                  <div className="stat-title">Active Users</div>
                  <div className="stat-value text-secondary">2.5K</div>
                </div>
              </div>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 lg:w-1/2">
              <div className="card-body">
                <h2 className="card-title text-2xl">Get Started Today!</h2>
                <p className="text-sm text-base-content/70 mb-4">Join thousands of readers who have transformed their reading experience.</p>
                <AuthButton />
                <div className="divider">OR</div>
                <div className="text-center">
                  <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} className="btn btn-ghost btn-sm">
                    Learn more about our features
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
                <div className="card-body">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="card-title">Intelligent Tracking</h3>
                  <p>Easily catalog your books and track reading progress with our intuitive interface. Never lose track of what you've read again.</p>
                </div>
                <div className="card-actions justify-end p-4">
                  <div className="badge badge-outline">AI-Powered</div>
                  <div className="badge badge-primary">Free</div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
                <div className="card-body">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Smart Recommendations</h3>
                  <p>Get personalized book recommendations based on your reading history and preferences using our advanced algorithm.</p>
                </div>
                <div className="card-actions justify-end p-4">
                  <div className="badge badge-outline">Personalized</div>
                  <div className="badge badge-secondary">Trending</div>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all">
                <div className="card-body">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="card-title">Spotify Integration</h3>
                  <p>Discover curated playlists that match the mood and genre of your current book for an immersive reading experience.</p>
                </div>
                <div className="card-actions justify-end p-4">
                  <div className="badge badge-outline">Music</div>
                  <div className="badge badge-accent">Unique</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">How ReadwMe Works</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="steps steps-vertical md:steps-horizontal">
                <div className="step step-primary">
                  <div className="step-circle">1</div>
                  <h3 className="mt-4 font-medium">Create Account</h3>
                  <p className="text-sm mt-2">Sign up in seconds with Google or GitHub</p>
                </div>
                <div className="step step-primary">
                  <div className="step-circle">2</div>
                  <h3 className="mt-4 font-medium">Add Books</h3>
                  <p className="text-sm mt-2">Build your personal library</p>
                </div>
                <div className="step step-primary">
                  <div className="step-circle">3</div>
                  <h3 className="mt-4 font-medium">Get Recommendations</h3>
                  <p className="text-sm mt-2">Discover new books you'll love</p>
                </div>
                <div className="step step-primary">
                  <div className="step-circle">4</div>
                  <h3 className="mt-4 font-medium">Enhance Experience</h3>
                  <p className="text-sm mt-2">Access AI tools and music playlists</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-base-100">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-primary">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="collapse collapse-arrow bg-base-200 mb-4">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                  Is ReadwMe free to use?
                </div>
                <div className="collapse-content"> 
                  <p>Yes! ReadwMe is completely free for all users. We believe in making reading tools accessible to everyone.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 mb-4">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                  How does the recommendation system work?
                </div>
                <div className="collapse-content"> 
                  <p>Our recommendation engine analyzes your reading history, preferences, and book metadata to suggest titles that align with your taste. We also incorporate collaborative filtering to find books enjoyed by readers with similar preferences.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 mb-4">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                  Do I need a Spotify account to use music features?
                </div>
                <div className="collapse-content"> 
                  <p>Yes, to access the book-matched playlists feature, you'll need to connect your Spotify account. This allows us to generate playlists that match your book's mood and genre.</p>
                </div>
              </div>
              
              <div className="collapse collapse-arrow bg-base-200 mb-4">
                <input type="checkbox" /> 
                <div className="collapse-title text-xl font-medium">
                  How secure is my reading data?
                </div>
                <div className="collapse-content"> 
                  <p>We take data privacy seriously. Your reading data is used only to improve your experience and provide recommendations. We never sell your personal information to third parties.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-primary text-primary-content">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Reading Experience?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">Join thousands of readers who have discovered new books and enhanced their reading journey with ReadwMe.</p>
            <AuthButton />
          </div>
        </section>
        
        <footer className="footer p-10 bg-neutral text-neutral-content">
          <div>
            <span className="footer-title">ReadwMe</span>
            <p>Making reading smart and social since 2025</p>
            <p className="text-sm mt-2">© 2025 ReadwMe. All rights reserved.</p>
          </div> 
          <div>
            <span className="footer-title">Features</span> 
            <a className="link link-hover">Book Tracking</a> 
            <a className="link link-hover">AI Recommendations</a> 
            <a className="link link-hover">Spotify Playlists</a> 
            <a className="link link-hover">Reading Analytics</a>
          </div> 
          <div>
            <span className="footer-title">Contact</span> 
            <a className="link link-hover" href="mailto:support@readwme.com">support@readwme.com</a>
            <div className="flex mt-2 gap-4">
              <a className="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </a>
              <a className="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
              </a>
              <a className="btn btn-circle btn-ghost btn-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }else if (status=="authenticated"){
    return (
      <div data-theme="synthwave" className="min-h-screen">
        <div className="p-8 min-h-screen">
          <div className="flex justify-between items-center mt-6 mb-10">
            <h1 className="text-5xl font-bold text-primary font-extrabold">
              ReadwMe
              <div className="badge badge-secondary ml-4">Your Book Companion</div>
            </h1>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Book Collection</h2>
            <h3 className="text-l mb-4 text-primary">(Click on the book titles for tools access!)</h3>
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : books.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-lg">Title</th>
                      <th className="text-lg">Author</th>
                      <th className="text-lg">Added At</th>
                      <th className="text-lg">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book, idx) => (
                      <tr key={idx}>
                        <td>
                          <Link href={`/book-features/${book.id}`} className="link link-primary">
                            {book.name}
                          </Link>
                        </td>
                        <td>{book.author}</td>
                        <td>{book.publishDate.slice(0, 10)}</td>
                        <td>
                          <button 
                            onClick={() => handleDelete(book.id)} 
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>No books available for this user</span>
              </div>
            )}
          </div>
          
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Explore Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <h3 className="card-title text-primary">Book Recommendations</h3>
                  <p>Discover new books based on your reading preferences using a custom algorithm.</p>
                  <div className="card-actions justify-end mt-4">
                    <Link href="/recs" style={{border: "2px solid #000000", color: "#000000"}} className="btn btn-primary">Explore Recommendations</Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <h3 className="card-title text-primary">Spotify Playlists</h3>
                  <p>Find the perfect soundtrack for your reading experience with curated playlists.</p>
                  <div className="card-actions justify-end mt-4">
                    <Link href="/spotify" style={{border: "2px solid #000000", color: "#000000"}} className="btn btn-primary">Browse Playlists</Link>
                  </div>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all">
                <div className="card-body">
                  <h3 className="card-title text-primary">AI Powered Tools</h3>
                  <p>Enhance your reading with an AI summariser, a pop culture hub and a community chatroom.</p>
                  <div className="card-actions justify-end mt-4">
                    {books.length > 0 ? (
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} style={{border: "2px solid #000000", color: "#000000"}} className="btn btn-primary">Select a Book</label>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 mt-2">
                          {books.map((book, idx) => (
                            <li key={idx}>
                              <Link href={`/book-features/${book.id}`}>
                                {book.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <button disabled className="btn btn-primary">Add Books First</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}
