import axiosInstance from "../../../services/apiConnectors";
import { createAsyncThunk } from "@reduxjs/toolkit";
export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async ({ email, phoneNumber, phoneSuffix }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/send-otp", {
        email,
        phoneNumber,
        phoneSuffix,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("SEND OTP ERROR:", error);
      //  return rejectWithValue("Error occured while sending otp");
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, phoneNumber, phoneSuffix, otp }, { rejectWithValue }) => {
    console.log("phone number response is",email,phoneNumber,phoneSuffix,otp)
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        phoneNumber,
        phoneSuffix,
        otp,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      console.error("Error occured while verifying otp:", error);
    }
  }
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async ({ username, agreed, about, profilePicture }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("username",username);
        formData.append("agreed",agreed);
        formData.append("about",about);
         if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
      console.log(formData);


      const response = await axiosInstance.put("/auth/updateProfile", formData,{
           headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error occured while updating profile");
    }
  }
);

export const getAllUsersThunk = createAsyncThunk(
  "auth/getAllUsers",async(_,{rejectWithValue})=>{
    try{
         const response = await axiosInstance.get('/auth/users');
         console.log(response);
         return response.data;
    }catch(error){
      console.error("Error occured while fetching users");
            return rejectWithValue("Failed to fetch users");


    }
  }
)

export const saveContactThunk = createAsyncThunk(
  "auth/saveContact",
  async ({ userName, contact, email }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/auth/save-contact",
        { userName, contact, email }
      );

      // ✅ success case
      return response.data;
    } catch (error) {
      console.error("Error while saving contact:", error);
    }
  }
);

