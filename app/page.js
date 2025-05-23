"use client";

import { useEffect, useState } from "react";
import AuthButton from "./components/AuthButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(null);
  const [editBook, setEditBook] = useState({ name: "", author: "" });
  const [openDropdown, setOpenDropdown] = useState(null);

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

    fetchBooks();
  }, []);

  const handleUpdate = (index, book) => {
    setEditBook(book);
    setIndex(index);
  }
  const handleSave = async(id) => {
    try{
      const response = await fetch("/api/requests", {
        method : "PATCH",
        headers: {"Content-Type" : "application/json"},
        body : JSON.stringify({name : editBook.name, author : editBook.author, id: id})
      });
      setIndex(null)
      const data = await response.json()
      console.log('Book updated:', data);
      window.location.reload()
    }catch(error){
      console.log(error);
    }
  }
  const handleDelete = async(id) => {
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


  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="flex justify-between items-center mt-6">
        <h1 className="text-4xl font-bold text-primary">
          ReadwMe
        </h1>
        <button
          onClick={() => router.push("/add_book")}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition-all"
        >
          Add Book
        </button>
      </div>
      <div className="mt-8">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : books.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300 text-white">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Author</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, idx) => (
                <tr key={idx} className="text-center">
                  {index === idx ? (
                    <>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={editBook.name}
                          onChange={(e) =>
                            setEditBook({ ...editBook, name: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="text"
                          value={editBook.author}
                          onChange={(e) =>
                            setEditBook({ ...editBook, author: e.target.value })
                          }
                          className="w-full px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {book.publishDate.slice(0, 10)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleSave(book.id)}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="border border-gray-300 px-4 py-2">{book.name}</td>
                      <td className="border border-gray-300 px-4 py-2">{book.author}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {book.publishDate.slice(0, 10)}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => toggleDropdown(idx)}
                            className="inline-flex justify-center w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            Check this out!
                          </button>
                          {openDropdown === idx && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg">
                              <button
                                onClick={() => handleUpdate(idx, book)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Update
                              </button>
                              <button
                                onClick={() => handleDelete(book.id)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => router.push(`/summarise/${book.id}`)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Summarize
                              </button>
                              <button
                                onClick={() => router.push(`/sentiment/${book.id}`)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Sentiment Analysis
                              </button>
                              <button
                                onClick={() => router.push(`/chatroom/${book.id}`)}
                                className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                              >
                                Chatroom
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">No books available for this user</p>
        )}
      </div>
    </div>
  );
}
