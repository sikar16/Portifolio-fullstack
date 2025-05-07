import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}user/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['Users'],
        }),
        createUser: build.mutation({
            query: (newUser) => ({
                url: '/create',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['Users'],
        }),
        // updateUser: build.mutation({
        //     query: (updatedUser) => ({
        //         url: '/update',
        //         method: 'PUT',
        //         body: updatedUser,
        //     }),
        //     invalidatesTags: ['Users'],
        // }),
        // deleteSocialLinks: build.mutation({
        //     query: () => ({
        //         url: '/delete',
        //         method: 'DELETE',
        //     }),
        //     invalidatesTags: ['Users'],
        // }),
    }),
});

export const {
    useGetUsersQuery,
    useCreateUserMutation,
    // useUpdateUserMutation,
} = userApi;
