import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const portifolioApi = createApi({
    reducerPath: 'portifolioApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}portifolio/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['portifolio'],
    endpoints: (build) => ({
        getUserPortifolio: build.query({
            query: (firstName) => ({ url: firstName, method: 'GET' }), // Use firstName in the URL
            providesTags: ['portifolio'],
        }),
    }),
});

// Export the generated query hook
export const { useGetUserPortifolioQuery } = portifolioApi;