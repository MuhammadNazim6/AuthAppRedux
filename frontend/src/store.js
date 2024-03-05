import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import {apiSlice} from './slices/apiSlice.js'

console.log("apislice",apiSlice);
const store = configureStore({
  reducer:{
    auth:authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware().concat(apiSlice.middleware),
  devTools : true
});

export default store

// The usage of [apiSlice.reducerPath]: is a form of dynamic key assignment,
//  which can be useful if you want the key to be determined by the reducerPath property of the apiSlice dynamically.