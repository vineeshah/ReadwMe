"use client"
import AuthButton from "./AuthButton";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import Image from "next/image";

const AVATAR_WRAPPER_CLASSES = "w-10 rounded-full flex items-center justify-center";
const SPOTIFY_ICON_CLASSES = "w-6 h-6";
const ACCOUNT_ICON_CLASSES = "w-5 h-5";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {data:session, status} = useSession()
  const userImage = session?.user?.image;
  const spotifyToken = session?.user?.spotifyToken;
  // console.log("spotifyToken: ",spotifyToken)
  
  if(status=="authenticated"){
    return (
      <nav data-theme="synthwave" className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <ul className="flex gap-4">
          <li><Link href="/" className="hover:underline">Home/</Link></li>
          <li><Link href="/recs" className="hover:underline">Recommendations</Link></li>
        </ul>
        <div className="flex items-center gap-4 ">
        {!spotifyToken ? (
            <button
              onClick={() => router.push("/api/spotify/connect")}
              className="btn btn-success"
            >
              Connect Spotify
            </button>
          ) : (
            <button
              onClick={() => router.push("/spotify")}
              className="btn btn-ghost btn-circle avatar"
            >
              <div className={AVATAR_WRAPPER_CLASSES}>
              <Image
                src="/spotify-icon.svg"
                alt="Spotify Connected"
                className={SPOTIFY_ICON_CLASSES}
              />
            </div>
            </button>
          )}
          
          {pathname === '/' && (
            <button
              onClick={() => router.push("/add_book")}
              className="btn btn-primary"
            >
              Add Book
            </button>
          )}
          
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className={AVATAR_WRAPPER_CLASSES}>
                {/* User account icon */}
                <Image src={userImage} alt="User" />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-black">
              <li>
                <button 
                  onClick={() => router.push("/account")} 
                  className="flex items-center gap-2 btn btn-ghost justify-start px-4 py-3 w-full text-left font-semibold text-primary hover:bg-base-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={ACCOUNT_ICON_CLASSES}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Account
                </button>
              </li>
              <li className="p-2">
                <AuthButton />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }else{
    return(
      <nav data-theme="synthwave" className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <ul className="flex gap-4">
          <li><Link href="/" className="hover:underline">Home</Link></li>
        </ul>
      </nav>
    );
  }
}
