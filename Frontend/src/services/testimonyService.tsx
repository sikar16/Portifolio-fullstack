import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const testimonialApi = createApi({
    reducerPath: 'testimonialApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}testimony/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['testimony'],
    endpoints: (build) => ({
        gettestimonyial: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['testimony'],
        }),


        createtestimonyial: build.mutation({
            query: (newtestimonyial) => ({
                url: '/create',
                method: 'POST',
                body: newtestimonyial,
            }),
            invalidatesTags: ['testimony'],
        }),

        updatetestimonyial: build.mutation({
            query: ({ id, ...updatedtestimonyial }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedtestimonyial,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'testimony', id },
                'testimony'
            ],
        }),
        deletetestimonyial: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'testimony', id },
                'testimony'
            ],
        }),
    }),
});

export const {
    useCreatetestimonyialMutation,
    useGettestimonyialQuery,
    useUpdatetestimonyialMutation,
    useDeletetestimonyialMutation
} = testimonialApi;