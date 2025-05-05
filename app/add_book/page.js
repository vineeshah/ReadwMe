"use client"
import { useState } from "react";
import { useSession } from "next-auth/react";
import validbook from "../components/validbook";

function AddBookPage() {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const { data: session } = useSession(); 
  const userId = session.user.id;

  const handleSearch = async (e) => {
    e.preventDefault();
    const isValid = await validbook({ name: name, author: author }); 
    if (isValid) {
      try {
        const date = new Date().toISOString(); 
        const response = await fetch(`/api/requests`, {
          method: 'POST',
          body: JSON.stringify({ name: name, author: author, userId: userId, publishDate: date }),
        });
        const data = await response.json();
        console.log('Book added:', data);
      } catch (error) {
        console.error(error);
        alert('Error adding the book');
      }
    } else {
      alert('Invalid book. Please check the details and try again.');
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-lg mx-auto p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Add a New Book</h2>
      <div className="mb-6">
        <label className="block text-gray-800 font-semibold mb-2">
          Book Name:
        </label>
        <input
          type="text"
          placeholder="Enter book name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-800 font-semibold mb-2">
          Author Name:
        </label>
        <input
          type="text"
          placeholder="Enter author name..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-black py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        Submit
      </button>
    </form>
  );
}

export default AddBookPage;

