import { createSlice } from "@reduxjs/toolkit";
import { getMessagesThunk, sendMessageThunk } from "./messagesThunk";

const initialState = {
  conversations: [],
  selectedConversationId: null,
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      const msg = action.payload;

      const exists = state.conversations.some(
        (m) => m._id === msg._id
      );

      if (!exists) {
        state.conversations.push(msg);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.data;
        state.selectedConversationId = action.meta.arg;
      })
      .addCase(getMessagesThunk.rejected, (state) => {
        state.loading = false;
      })

      // ❗ sendMessageThunk ONLY controls loading
      .addCase(sendMessageThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedConversationId =
          action.payload.data.conversation;
      })
      .addCase(sendMessageThunk.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
