import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const serviceApi = createApi({
    reducerPath: 'serviceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}service/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['Service'],
    endpoints: (build) => ({
        getService: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['Service'],
        }),
        getgeneralDes: build.query({
            query: () => ({ url: '/generaldes', method: 'GET' }),
            providesTags: ['Service'],
        }),
        getSingleService: build.query({
            query: (id) => ({ url: `/${id}`, method: 'GET' }),
            providesTags: (id) => [{ type: 'Service', id }],
        }),
        createService: build.mutation({
            query: (newService) => ({
                url: '/create',
                method: 'POST',
                body: newService,
            }),
            invalidatesTags: ['Service'],
        }),
        createGeneralDescribtion: build.mutation({
            query: (description) => ({
                url: '/createGeneralservice',
                method: 'POST',
                body: description,
            }),
            invalidatesTags: ['Service'],
        }),
        updateService: build.mutation({
            query: ({ id, ...updatedService }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedService,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'Service', id },
                'Service'
            ],
        }),
        deleteService: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'Service', id },
                'Service'
            ],
        }),
    }),
});

export const {
    useCreateServiceMutation,
    useGetServiceQuery,
    useGetSingleServiceQuery,
    useCreateGeneralDescribtionMutation,
    useGetgeneralDesQuery,
    useUpdateServiceMutation,
    useDeleteServiceMutation
} = serviceApi;