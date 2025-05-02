"use client";

import AuthButton from "./components/AuthButton";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Home to ReadwMe
      </h1>
      <div className="flex justify-center mt-4">
        <AuthButton />
      </div>
      <button
              onClick={() => router.push('/add_book')}
              className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-red-600 transition-all"
            >
              Add book
      </button>
    </div>
  );
}
