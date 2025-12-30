import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './slices/user/userSlice';
import messagesReducer from './slices/messages/messagesSlice';
import socketReducer from './slices/socket/socket.slice';
const rootReducer = combineReducers({
    auth:authReducer,
    messages:messagesReducer,
    socket:socketReducer
});

export default rootReducer;