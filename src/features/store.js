import { configureStore } from '@reduxjs/toolkit';   //configure store redux toolkit for reducer configuration 
import authReducer from './auth/authSlice';
import searchReducer from './search/searchSlice';
//exported store is imported in index so that accessible to all comp 
export const store = configureStore({    
   reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});
