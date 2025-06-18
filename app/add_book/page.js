"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import validbook from "../components/validbook";

function AddBookPage() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const { data: session } = useSession(); 

  const handleSearch = async (e) => {
    e.preventDefault();
    const isValid = await validbook({ name: name, author: author }); 
    if (isValid=="Yes") {
      try {
        const date = new Date().toISOString(); 
        console.log(session.user)
        const userId = session?.user?.id;
        const response = await fetch(`/api/requests`, {
          method: 'POST',
          headers: {"Content-Type" : "application/json"},
          body: JSON.stringify({ name: name, author: author, userId: userId, publishDate: date }),
        });
        const data = await response.json();
        alert("Book Added!!")
        setAuthor("")
        setName("")
        console.log('Book added:', data);
      } catch (error) {
        console.error(error);
        alert('Error adding the book in the book route');
      }
    } else if(isValid=="No"){
      alert('Invalid book. Please check the details and try again!');
    }else{
        alert('Be more specific or check spelling!')
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

