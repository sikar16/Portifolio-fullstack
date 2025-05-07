import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const skillCategoryApi = createApi({
    reducerPath: 'skillCategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}skillCategory/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['skillCategory'],
    endpoints: (build) => ({
        getskillCategory: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['skillCategory'],
        }),

        getSingleskillCategory: build.query({
            query: (id) => ({ url: `/${id}`, method: 'GET' }),
            providesTags: (id) => [{ type: 'skillCategory', id }],
        }),
        createskillCategory: build.mutation({
            query: (newskillCategory) => ({
                url: '/create',
                method: 'POST',
                body: newskillCategory,
            }),
            invalidatesTags: ['skillCategory'],
        }),

        updateskillCategory: build.mutation({
            query: ({ id, ...updatedskillCategory }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedskillCategory,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'skillCategory', id },
                'skillCategory'
            ],
        }),
        deleteskillCategory: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'skillCategory', id },
                'skillCategory'
            ],
        }),
    }),
});

export const {
    useCreateskillCategoryMutation,
    useGetskillCategoryQuery,
    useGetSingleskillCategoryQuery,

    useUpdateskillCategoryMutation,
    useDeleteskillCategoryMutation
} = skillCategoryApi;