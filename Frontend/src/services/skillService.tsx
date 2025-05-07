import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const skillApi = createApi({
    reducerPath: 'skillApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}skill/`,
        prepareHeaders: (headers,) => {
            const token = localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ['skill'],
    endpoints: (build) => ({
        getskill: build.query({
            query: () => ({ url: '', method: 'GET' }),
            providesTags: ['skill'],
        }),


        createskill: build.mutation({
            query: (newskill) => ({
                url: '/create',
                method: 'POST',
                body: newskill,
            }),
            invalidatesTags: ['skill'],
        }),






        // In skillService.ts
        updateSkill: build.mutation({
            query: ({ id, ...data }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ({ id }) => [
                { type: 'skill', id },
                'skill'
            ],
        }),

        deleteskill: build.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (id) => [
                { type: 'skill', id },
                'skill'
            ],
        }),
    }),
});

export const { useCreateskillMutation, useGetskillQuery, useDeleteskillMutation, useUpdateSkillMutation } = skillApi;