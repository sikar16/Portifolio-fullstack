// src/services/userApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const serviceProviderApi = createApi({
    reducerPath: 'serviceProviderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}service_p/`,
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
                url: '',
                method: 'POST',
                body: newUser,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useGetUsersQuery, useCreateUserMutation } = serviceProviderApi;
