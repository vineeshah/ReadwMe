"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import validbook from "../components/validbook";

function AddBookPage() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const { data: session } = useSession(); 
  const userId = session?.user?.id

  const handleSearch = async (e) => {
    e.preventDefault();
    const isValid = await validbook({ name: name, author: author });
  
    if (isValid === "Yes") {
      setName(name.toLowerCase());
      setAuthor(author.toLowerCase());
  
      let unique; // Initialize the variable outside the try block
  
      try {
        const r1 = await fetch(`/api/requests/bookname/${encodeURIComponent(name)}`, {
          method: "GET",
          headers: {
            author: author,
            userId : userId
          },
        });
  
        if (!r1.ok) {
          throw new Error("Failed to check book uniqueness");
        }
  
        unique = await r1.json();
        if (unique["status"]==false) {alert("book already exists!!");return}
        console.log("Unique response:", unique);
      } catch (error) {
        console.error("Error checking book uniqueness:", error);
        alert("Error checking book uniqueness");
        return; 
      }
  
      if (unique["status"]==true) { 
        try {
          const date = new Date().toISOString();
          const userId = session?.user?.id;
          const response = await fetch(`/api/requests`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name, author: author, userId: userId, publishDate: date }),
          });
  
          if (!response.ok) {
            throw new Error("Failed to add the book");
          }
  
          const data = await response.json();
          alert("Book Added!!");
          setAuthor("");
          setName("");
          console.log("Book added:", data);
        } catch (error) {
          console.error("Error adding the book:", error);
          alert("Error adding the book in the book route");
        }
      } else {
        alert("Be more specific or check spelling!");
      }
    } else if (isValid === "No") {
      alert("Invalid book. Please check the details and try again! Make sure you enter the exact name of the book and the author.");
    } else {
      alert("Be more specific or check spelling or make sure this is the correct author!");
    }
  };

  return (
    <div data-theme="synthwave" className="min-h-screen bg-base-100">
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col w-full max-w-2xl">
          <form onSubmit={handleSearch} className="card w-full bg-base-300 shadow-2xl rounded-lg border-2 border-primary p-10">
            <h2 className="text-3xl font-bold text-center text-secondary mb-8">Add a New Book</h2>
            
            <div className="mb-8">
              <label className="block font-semibold text-lg mb-3 text-accent">
                Book Name:
              </label>
              <input
                type="text"
                placeholder="Enter book name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered input-secondary w-full text-lg py-6"
              />
            </div>
            
            <div className="mb-10">
              <label className="block font-semibold text-lg mb-3 text-accent">
                Author Name:
              </label>
              <input
                type="text"
                placeholder="Enter author name..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input input-bordered input-secondary w-full text-lg py-6"
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-secondary btn-lg w-full text-lg hover:scale-105 transition-transform"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddBookPage;

