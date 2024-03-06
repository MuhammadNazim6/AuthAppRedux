import { apiSlice } from "./apiSlice"; 

const USERS_URL = '/api/users'; 

export const usersApiSlice = apiSlice.injectEndpoints({ 
  endpoints : (builder)=>({ 
    // Defining API endpoints using builder.mutation
    // Each builder.mutation defines a specific API endpoint with its corresponding query function. 

    login: builder.mutation({ 
      query: (data)=>({ 
        url:`${USERS_URL}/auth`, 
        method: 'POST', 
        body: data 
      }), 
    }), 
    logout: builder.mutation({ 
      query: () => ({ 
        url: `${USERS_URL}/logout`, 
        method: 'POST', 
      }) 
    }), 
    register: builder.mutation({ 
      query: (formData)=>({ 
        url:`${USERS_URL}/`, 
        method: 'POST', 
        body: formData ,
      }), 
    }), 
    updateUser: builder.mutation({ 
      query: (formData)=>({ 
        url:`${USERS_URL}/profile`, 
        method: 'PUT', 
        body: formData 
      }), 
    }), 
    updateImage: builder.mutation({
      query: ()=>({
        url:`${USERS_URL}/addProfile`,
        method:"POST",
        body:data
      })
    })
  }),    
}) 
 
export const {useLoginMutation , 
              useLogoutMutation , 
              useRegisterMutation ,  
              useUpdateUserMutation ,
              useUpdateImageMutation
            } = usersApiSlice; 


// The injectEndpoints function is used in the context of a file that imports the original apiSlice from another file. 
// This function allows you to extend and customize the existing apiSlice by adding or modifying endpoints.