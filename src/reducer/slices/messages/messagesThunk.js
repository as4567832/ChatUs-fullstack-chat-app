import axiosInstance from "../../../services/apiConnectors";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const getMessagesThunk = createAsyncThunk(
  "messages/getMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      // console.log("📡 getMessagesThunk called");

      const res = await axiosInstance.get(`/chat/conversations/${conversationId}/messages`); // or your endpoint

      // console.log("✅ API response:", res.data);

      return res.data;
    } catch (error) {
      console.log("❌ API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data);
    }
  }
);


export const sendMessageThunk = createAsyncThunk(
  "messages/sendMessage",
  async(formData,{rejectWithValue})=>{
    try{
     const response = await axiosInstance.post(
        "/chat/send-message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
        return response.data;
    }catch(error){
      console.log("❌ API error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data);
    }
  }
)


