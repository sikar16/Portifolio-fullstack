// src/services/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}public/`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: 'login',
                method: 'POST',
                body: { email, password },
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
