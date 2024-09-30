import { createSlice } from "@reduxjs/toolkit";    //creatslice redux toolkit function which create action type itself  
//step1 initial state 
 const initialState = {
  isAuthenticated:false,
  token:null,
  userId:null,
 }

const authSlice = createSlice({
  name: 'auth',
  initialState,
 //2reducers create login and logout
  reducers :{
   login:(state,action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.userId = null;
    },
  },
});

export const { login, logout } = authSlice.actions;   //exporting login and logout reducer using authSlice.action which are then imported in our comp
export default authSlice.reducer;  
