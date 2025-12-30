import io from "socket.io-client";
import { createSlice } from "@reduxjs/toolkit"; 
const initialState = {
  socket: null,
  onlineUsers:[],
}

const socketSlice = createSlice({
    name: "socket",
    initialState: initialState,
    reducers: {
        initializeSocket:(state,action)=>{
            const socket = io("http://localhost:8000",{
                query:{
                    userId:action.payload
                }
            });

            state.socket = socket;
        },
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        }
    }
});


export const { initializeSocket,setOnlineUsers} = socketSlice.actions;
export default socketSlice.reducer;