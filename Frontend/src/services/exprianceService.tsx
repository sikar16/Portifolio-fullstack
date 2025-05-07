import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const exprianceApi = createApi({
    reducerPath: 'exprianceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}expriance/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['expriance'],
    endpoints: (build) => ({
        getexpriance: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['expriance'],
        }),


        createexpriance: build.mutation({
            query: (newexpriance) => ({
                url: '/create',
                method: 'POST',
                body: newexpriance,
            }),
            invalidatesTags: ['expriance'],
        }),

        updateexpriance: build.mutation({
            query: ({ id, ...updatedexpriance }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedexpriance,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'expriance', id },
                'expriance'
            ],
        }),
        deleteexpriance: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'expriance', id },
                'expriance'
            ],
        }),
    }),
});

export const {
    useCreateexprianceMutation,
    useDeleteexprianceMutation,
    useGetexprianceQuery,
    useUpdateexprianceMutation
} = exprianceApi;