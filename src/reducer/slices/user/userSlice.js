import { createSlice } from "@reduxjs/toolkit";
import { getAllUsersThunk, saveContactThunk, verifyOtpThunk } from "../user/userThunk"; // adjust path
const initialState = {
  signUpData: null,
  loading: false,
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token"))
    : null,
  users:localStorage.getItem("users") ? JSON.parse(localStorage.getItem("users")) : [],
  selectedUser:null,
  userDetails:localStorage.getItem("userDetails") ? JSON.parse(localStorage.getItem("userDetails")) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignUpData(state, value) {
      state.signUpData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
    setSelectedUser(state,value){
      state.selectedUser = value.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(verifyOtpThunk.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(verifyOtpThunk.fulfilled, (state, action) => {
      state.loading = false;
      if(action.payload?.data?.token){
        state.token = action.payload.data.token; 
        state.userDetails = action.payload.data.user;
        localStorage.setItem("userDetails",JSON.stringify(action.payload.data.user));
      }

    });
    builder.addCase(verifyOtpThunk.rejected, (state, action) => {
      state.loading = false;
    });
    builder.addCase(getAllUsersThunk.pending,(state,action)=>{
      state.loading = true;
    });
    builder.addCase(getAllUsersThunk.fulfilled,(state,action)=>{
      state.loading = false;
      state.users = action.payload || [];
      localStorage.setItem("users", JSON.stringify(action.payload || []));
    });
      builder.addCase(getAllUsersThunk.rejected,(state,action)=>{
      state.loading = false;
    });
   builder
  .addCase(saveContactThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(saveContactThunk.fulfilled, (state, action) => {
    state.loading = false;
    state.success = action.payload; // backend ka success object
  })
  .addCase(saveContactThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload; // 👈 FULL backend error object
  });
  },
});

export const { setSignUpData, setLoading, setToken,setSelectedUser } = authSlice.actions;
export default authSlice.reducer;
