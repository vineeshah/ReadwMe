import {createServer} from "http";
import { Server } from "socket.io";
import prisma from "../config/db.js";

const httpserver = createServer()//everytime you call this route this server will be created fresh with no memory of past server, which diminishes everytime you ctrl+c 
const io = new Server(httpserver, {//for conecting to a new server for websocket-ing
    cors : {
        origin : "*"//you will be able to connect to your forntend server while setting up your client
    }
}) 

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join-book", async ({ bookName, userId }) => {
        if (!bookName || !userId) return;//just a check to prevent further mess

        const normalizedBookName = bookName.toLowerCase().replace(/\s+/g, "_"); // Normalize bookName
        socket.join(`book-${normalizedBookName}`);//joining te room here which will be automatically made and joined by anyone with the same name
        //here the `book-${bookName}` becomes sorta like the password for the room
        console.log(`${userId} joined book-${bookName}`);
    });


    socket.on("send-message", async({bookName,userId, text}) => {
        try{
            const normalizedBookName = bookName.toLowerCase().replace(/\s+/g, "_");
            const message = await prisma.message.create({
                data: {
                    text,
                    bookName,
                    userId,
                    },
                    include: {
                        user: true, //including name in the result so that the create query
                    //also returns the user info so that while displaying the message posted i dont have to make a separate query to get the user info
                },
            })
            console.log("message posted succesfully!")
            io.to(`book-${normalizedBookName}`).emit("chat-message", {
                id: message.id,
                text: message.text,
                createdAt: message.createdAt,
                user: {
                    id: message.user.id,
                    name: message.user.name,
                },
            });
        }catch(error){
            console.log("error posting the message:", error)
        }
        
    })

    // socket.on("disconnect", () => {
    //     console.log("Client disconnected:", socket.id);
    // });
 
})
httpserver.listen(3001, () => {
    console.log("Socket.IO server running on http://localhost:3001");
  });    //listens for calls from frontend and creates the server on 3001 to not disturb frontned on 3000