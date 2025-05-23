import {io} from "socket.io-client";

const socket = io("http://localhost:3001", {
    autoConnect : false //connects only when you do socket.connect()
});
export default socket;