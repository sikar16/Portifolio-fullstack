import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const projectApi = createApi({
    reducerPath: 'projectApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}project/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['project'],
    endpoints: (build) => ({
        getproject: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['project'],
        }),

        getSingleproject: build.query({
            query: (id) => ({ url: `/${id}`, method: 'GET' }),
            providesTags: (id) => [{ type: 'project', id }],
        }),
        createproject: build.mutation({
            query: (newproject) => ({
                url: '/create',
                method: 'POST',
                body: newproject,
            }),
            invalidatesTags: ['project'],
        }),

        updateproject: build.mutation({
            query: ({ id, ...updatedproject }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedproject,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'project', id },
                'project'
            ],
        }),
        deleteproject: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'project', id },
                'project'
            ],
        }),
    }),
});

export const {
    useCreateprojectMutation,
    useGetprojectQuery,
    useGetSingleprojectQuery,

    useUpdateprojectMutation,
    useDeleteprojectMutation
} = projectApi;