import {createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({ baseUrl: ''});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User'],
  endpoints : (builder)=>({}),
})


// setting up an API slice
// fetchBaseQuery - For creating a baseQuery
// createApi - function that creates an API slice.