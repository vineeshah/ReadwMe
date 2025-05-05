"use client";

import { useEffect, useState } from "react";
import AuthButton from "./components/AuthButton";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch("api/requests", { method: "GET" });
        const data = await response.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Home to ReadwMe
      </h1>
      <div className="flex justify-center mt-4">
        <AuthButton />
      </div>
      <button
        onClick={() => router.push("/add_book")}
        className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-red-600 transition-all"
      >
        Add book
      </button>
      <div className="mt-8">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : books.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Author</th>
                <th className="border border-gray-300 px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{book.title}</td>
                  <td className="border border-gray-300 px-4 py-2">{book.user?.name || "Unknown"}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(book.createdAt).toLocaleDateString()}</td>
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
