"use client"
import socket from "../../components/socket";
import {use, useState, useEffect, useRef} from "react";
import { useSession } from "next-auth/react";

export default function chat({params}){
    // properly unwrap the params object using React.use()
    const resolvedParams = use(params);
    const bookId = resolvedParams.bookid; 
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const { data: session } = useSession();//to get current user and info just in case
    const userId = session?.user?.id;
    const userName = session?.user?.name;
    const messageContainerRef = useRef(null);
    const [book,setBook] = useState()

    useEffect(() => {
        const fetchData = async() => { 
            const response = await fetch(`/api/requests/${bookId}`,{
                method:"GET"
            })
            const data = await response.json();
            setBook(data);
        };
        fetchData();   
    }, [])
    
    //to scroll to bottom of the chat
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    };
    
    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        socket.connect()
        if (!book?.name) return;
        socket.emit("join-book", { bookName: book?.name, userId });//join everytime you go to this page however the server still exists
        const loadExistingMessages = async () => {
            try {
                const response = await fetch(`/api/messages?bookName=${book?.name}`);
                ;
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages);
                }
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        };
        loadExistingMessages();

        socket.on("chat-message", (msg) => {//for if someone sends a message, this stays active the entire time the component is mounted, and never stops listening for the messages getting posted
            setMessages((prev) => {
                // Check if this message is already in our messages array
                // This prevents duplicate messages when sender receives their own message back
                const isDuplicate = prev.some(existingMsg => 
                    existingMsg.text === msg.text && 
                    existingMsg.user.id === msg.user.id &&
                    // Check if the timestamps are close (within 2 seconds)
                    Math.abs(new Date(existingMsg.createdAt) - new Date(msg.createdAt)) < 2000
                );
                
                if (isDuplicate) return prev;
                return [...prev, msg];
            });
        });
        socket.on("error", (errMsg) => {//just some light debugging
            alert(errMsg);
        });
        //You need the return statement to cleanup which runs when: You navigate away from the page it’s on, You reload or replace it with another component.
        return () => {
            socket.off("chat-message");//to avoid overlaoding even when you're not on this page
            socket.off("error");
            socket.disconnect();
        };
    },[bookId, userId])//dependency list for when the effect comes into place

    const sendMessage = () => {
        if(!input){
            alert("input cant be blank!")
            return;
        }
        socket.emit("send-message", {bookId, userId, text:input})

        // unique temporary ID
        const tempId = `temp-${Date.now()}`;
        
        setMessages((prev) => [
            ...prev,
            {
              id: tempId, // unique ID instead of just "temp"
              text: input,
              createdAt: new Date().toISOString(),
              user: {
                id: userId,
                name: userName,
              },
            },
          ]);

        setInput("");//after posting each message it returns to blank
    }
    
    // Format timestamp to be more readable
    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 border-b pb-2">Community Chat for: {book?.name}</h2>
    
          <div 
            ref={messageContainerRef}
            className="h-[500px] overflow-y-scroll border p-4 rounded-lg mb-4 bg-gradient-to-b from-blue-50 to-white shadow-inner bg-opacity-90" 
            style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')"}}>
            <div className="flex flex-col space-y-4 items-center">
              {messages.map((msg) => {
                const isCurrentUser = msg.user.id === userId;
                return (
                  <div key={msg.id} className="w-full max-w-[85%] mx-auto">
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <div className={`font-semibold text-xs mb-1 px-2 ${
                        isCurrentUser 
                          ? 'text-blue-700' 
                          : 'text-green-700'
                      }`}>
                        {isCurrentUser ? 'You' : msg.user.name}
                      </div>
                      <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-[90%]
                        ${isCurrentUser 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-green-100 text-black border border-gray-200'}`}>
                        <div className="break-words">{msg.text}</div>
                        <div className={`text-xs mt-1 text-right ${isCurrentUser ? 'text-blue-200' : 'text-gray-600'}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
    
          <div className="flex gap-2 items-center bg-white p-3 rounded-full shadow-md">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-0 p-2 flex-1 focus:ring-0 focus:outline-none bg-transparent text-black"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow transition duration-150 ease-in-out flex items-center justify-center"
            >
              <span>Send</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
    );
}