const expres = require("express");
const http = require('http');
const{Server} = require('socket.io');
const app = expres();
const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin: [
      "http://localhost:5173",
      "https://chat-us-fullstack-chat-app.vercel.app"
    ],
  }
});

const userSocketMap = {

};

io.on('connection',(socket)=>{
  const userId = socket.handshake.query.userId;
  if(!userId){
    return;
  }
  userSocketMap[userId] =socket.id;
  console.log("User connected:",userSocketMap);
  io.emit("onlineUsers",Object.keys(userSocketMap));

  socket.on("disconnect",()=>{
    delete userSocketMap[userId];
    console.log("User disconnected:",userSocketMap);
    io.emit("onlineUsers",Object.keys(userSocketMap));
  })

});


const getSocketId = (userId)=>{
  return userSocketMap[userId];
}

module.exports = {io, server,app,getSocketId};