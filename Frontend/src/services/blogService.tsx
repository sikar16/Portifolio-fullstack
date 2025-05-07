import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const blogApi = createApi({
    reducerPath: 'blogApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}blog/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['blog'],
    endpoints: (build) => ({
        getblog: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['blog'],
        }),


        createblog: build.mutation({
            query: (newblog) => ({
                url: '/create',
                method: 'POST',
                body: newblog,
            }),
            invalidatesTags: ['blog'],
        }),

        updateblog: build.mutation({
            query: ({ id, ...updatedblog }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedblog,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'blog', id },
                'blog'
            ],
        }),
        deleteblog: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'blog', id },
                'blog'
            ],
        }),
    }),
});

export const {
    useCreateblogMutation,
    useGetblogQuery,
    useUpdateblogMutation,
    useDeleteblogMutation
} = blogApi;