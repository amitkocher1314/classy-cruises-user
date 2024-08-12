import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import searchReducer from './search/searchSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    
    search: searchReducer,
  },
});
