import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const educationApi = createApi({
    reducerPath: 'educationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}education/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['education'],
    endpoints: (build) => ({
        geteducation: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['education'],
        }),


        createeducation: build.mutation({
            query: (neweducation) => ({
                url: '/create',
                method: 'POST',
                body: neweducation,
            }),
            invalidatesTags: ['education'],
        }),

        updateeducation: build.mutation({
            query: ({ id, ...updatededucation }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatededucation,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'education', id },
                'education'
            ],
        }),
        deleteeducation: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'education', id },
                'education'
            ],
        }),
    }),
});

export const {
    useCreateeducationMutation,
    useGeteducationQuery,
    useDeleteeducationMutation,
    useUpdateeducationMutation
} = educationApi;