"use client"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton({ }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-red-600 transition-all"
      >
        Sign Out
      </button>
    );
  } else {
    return (
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-medium shadow-md hover:bg-green-600 transition-all"
      >
        Sign In
      </button>
    );
  }
}
