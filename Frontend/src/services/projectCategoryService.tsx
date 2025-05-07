import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const projectCategoryApi = createApi({
    reducerPath: 'projectCategoryApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}projectCategory/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['projectCategory'],
    endpoints: (build) => ({
        getprojectCategory: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['projectCategory'],
        }),

        getSingleprojectCategory: build.query({
            query: (id) => ({ url: `/${id}`, method: 'GET' }),
            providesTags: (id) => [{ type: 'projectCategory', id }],
        }),
        createprojectCategory: build.mutation({
            query: (newprojectCategory) => ({
                url: '/create',
                method: 'POST',
                body: newprojectCategory,
            }),
            invalidatesTags: ['projectCategory'],
        }),

        updateprojectCategory: build.mutation({
            query: ({ id, ...updatedprojectCategory }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedprojectCategory,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'projectCategory', id },
                'projectCategory'
            ],
        }),
        deleteprojectCategory: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'projectCategory', id },
                'projectCategory'
            ],
        }),
    }),
});

export const {
    useCreateprojectCategoryMutation,
    useGetprojectCategoryQuery,
    useGetSingleprojectCategoryQuery,

    useUpdateprojectCategoryMutation,
    useDeleteprojectCategoryMutation
} = projectCategoryApi;