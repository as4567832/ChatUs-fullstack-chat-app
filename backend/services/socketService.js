const{Server} = require('socket.io');
const User = require('../models/User');
const Message = require('../models/Messages');

//map to store online users

const onlineUsers = new Map();


//map to track typing status

const typingUsers = new Map();



const initializeSocket = (server) =>{
    const io = new Server(server,{
        cors:{
            origin:[
                "http://localhost:5173",
      "https://chatus-igfh.onrender.com"
            ],
            credentials:true,
            method:['GET','POST','DELETE','OPTIONS'],
        },
        pingTimeout:60000,   //disconnect inactive user after 60sec
    });


    //when a new socket connection is establish

    io.on('connection',(socket)=>{
        console.log("User connected to",socket.id);
        let userId = null;


        //handle user connection and mark it online in db

        socket.on("user_connected",async(connectingUserId)=>{
            try{
              userId = connectingUserId
              onlineUsers.set(userId,socket.id);
              socket.join(userId);  //join a personal room for direct emits


            //   update user status in db
            await User.findByIdAndUpdate(userId,{
                isOnline:true,
                lastSeen:new Date()

            });

            //notify user that he is online

            io.emit("user_status",{userId,isOnline:true})


            }catch(error){
       console.error("error handling user connection",error)
            }
        })

        //return online status of requested user

        socket.on('get_user_status',(equestedUserId,callback)=>{
                
        })
    })
}