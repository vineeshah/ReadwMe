"use client"
import { useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Account(){
    const[name, setName] = useState("")
    const[editName, setEditName] = useState("")
    const[isEditing, setIsEditing] = useState(false)
    const { data: session } = useSession();
    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
            setEditName(session.user.name);
        }
    }, [session]);
    const userId = session?.user?.id;
    const userImage = session?.user?.image;
    const userEmail = session?.user?.email;

    const handleSave = async(e) => {
        e.preventDefault()
        try{
            const response = await fetch(`/api/requests/account/${userId}`, {
              method : "PATCH",
              headers: {"Content-Type" : "application/json"},
              body : JSON.stringify({name : editName})
            });
            const data = await response.json()
            setName(editName)
            console.log('Name updated:', data);
            setIsEditing(false)
        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-12 px-4">
            <h1 className="text-3xl font-bold mb-8 text-blue-800">Account Settings</h1>
            
            <div className="flex flex-col md:flex-row gap-10 mb-8">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center space-y-3">
                    <Image 
                        src={userImage || "https://lh3.googleusercontent.com/a/ACg8ocLGWxJzDjxvQL5ISOisNnG6SPrMgic04qa7D4BxBVG2gdb2mQ=s96-"} 
                        alt="User Profile" 
                        className="w-24 h-24 rounded-full shadow-sm object-cover"
                    />
                </div>

                {/* User Details Section */}
                <div className="flex-grow space-y-6 w-full">
                    {/* Username Field */}
                    <div className="border-b border-gray-200 pb-5">
                        <label className="block text-blue-700 font-medium mb-2">Username</label>
                        <div className="flex items-center">
                            {isEditing ? (
                                <div className="flex w-full">
                                    <input 
                                        type="text" 
                                        value={editName} 
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="border rounded-md p-2 mr-3 flex-grow focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    />
                                    <button 
                                        onClick={handleSave} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors text-sm"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <p className="text-gray-700 font-semibold text-xl tracking-wide">{name || "Error fetching name"}</p>
                                    <button 
                                        onClick={() => setIsEditing(true)} 
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="border-b border-gray-200 pb-5">
                        <label className="block text-blue-700 font-medium mb-2">Email Address</label>
                        <p className="text-gray-700 font-semibold text-xl tracking-wide">{userEmail || "Error fetching email"}</p>
                    </div>
                    
                    {/* Account Security Info */}
                    <div className="text-sm text-blue-700 flex items-center mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p>Account secured with Google/Github Authentication</p>
                    </div>
                </div>
            </div>
        </div>
    );

}