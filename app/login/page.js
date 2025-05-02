"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-800 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-center text-primary mb-6">
        Login to ReadwMe
      </h1>
      <button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-blue-600 transition-all mb-4"
      >
        Login with Google
      </button>
      <button
        onClick={() => signIn("github", { callbackUrl: "/" })}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg text-lg font-medium shadow-md hover:bg-gray-900 transition-all"
      >
        Login with GitHub
      </button>
    </div>
  );
}
