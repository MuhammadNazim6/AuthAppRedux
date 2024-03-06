import { apiSlice } from "./apiSlice";

const ADMIN_URL = '/api/admin'; 

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints : (builder)=>({
    adminLogin: builder.mutation({
      query: (data)=>({
        url:`${ADMIN_URL}/auth`,
        method: 'POST',
        body: data
      }),
    }),

    adminLogout: builder.mutation({ 
      query: () => ({ 
        url: `${ADMIN_URL}/logout`, 
        method: 'POST', 
      }) 
    }),
    
    getUsersData: builder.mutation({
      query: ()=>({
        url: `${ADMIN_URL}/users`,
        method:"GET",
      })
    }),

    deleteUser: builder.mutation({
      query: (data)=>({
        url : `${ADMIN_URL}/users/delete?id=${data}`,
        method: 'DELETE',
      })
    }),

    updateUserAdmin: builder.mutation({
      query: (data)=>({
        url: `${ADMIN_URL}/users/updateUser`,
        method:'PUT',
        body:data
      })
    }),
    blockUser: builder.mutation({
      query: (data)=>({
        url: `${ADMIN_URL}/users/blockUnblock?id=${data}`,
        method: 'PATCH'
      })
    })

  })
})


export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetUsersDataMutation,
  useDeleteUserMutation,
  useUpdateUserAdminMutation,
  useBlockUserMutation
} = adminApiSlice