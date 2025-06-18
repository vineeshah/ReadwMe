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
      <div className="min-h-screen bg-base-200">
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">ReadwMe</h1>
              <p className="py-6">
                Your personal reading companion. Track your books, discover new titles, and connect with fellow readers.
                Join our community today to organize your reading journey and never lose track of what you're reading.
              </p>
              <div className="space-y-2">
                <p className="text-lg">✓ Track books you've read</p>
                <p className="text-lg">✓ Discover new recommendations</p>
                <p className="text-lg">✓ Set reading goals</p>
                <p className="text-lg">✓ Join a community of book lovers</p>
              </div>
            </div>
            <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
              <div className="card-body">
                <h2 className="card-title">Start using:</h2>
                <AuthButton />
              </div>
            </div>
          </div>
        </div>
        
        <footer className="footer p-10 bg-neutral text-neutral-content">
          <div>
            <span className="footer-title">ReadwMe</span>
            <p>Making reading social since 2025</p>
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
            {error ? (
              <p className="text-red-500 text-center">{error}</p>
            ) : books.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-lg">Title</th>
                      <th className="text-lg">Author</th>
                      <th className="text-lg">Created At</th>
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
        </div>
      </div>
    );
  }
  
}
