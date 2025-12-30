import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersThunk, sendOtpThunk } from "../user/userThunk"; // adjust path
import { getMessagesThunk, sendMessageThunk } from "./messagesThunk";
const initialState = {
    conversations:[],
    selectedConversationId: null,
    loading: false,
    error: null,
    messages:null

};

const messagesSlice = createSlice({
  name: "messages",
  initialState: initialState,
  reducers: {
    addNewMessage:(state,action)=>{
      const newMessage = action.payload;

      const exists = state.conversations.some(
              (msg) => msg._id === newMessage._id
      );
      if (!exists) {
      state.conversations.push(newMessage);
    }
    }
    
  },
  extraReducers: (builder) => {
    builder.addCase(getMessagesThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getMessagesThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.conversations = action.payload.data;
      // localStorage.setItem("conversations", JSON.stringify(action.payload || []));
    });
    builder.addCase(getMessagesThunk.rejected,(state,action)=>{
        state.loading = false;
    });

    builder.addCase(sendMessageThunk.pending,(state,action)=>{
        state.loading = true;
    });
    builder.addCase(sendMessageThunk.fulfilled,(state,action)=>{
        state.loading = false;
        const newMessage = action.payload.data;
        const exists = state.conversations.some(
    (msg) => msg._id === newMessage._id
  );

  if (!exists) {
    state.conversations.push(newMessage);
  }
        // state.messages.push(action.payload.data);
    });
    builder.addCase(sendMessageThunk.rejected,(state,action)=>{
        state.loading = false;
    });
  },
});

export const { addNewMessage} = messagesSlice.actions;
export default messagesSlice.reducer;
