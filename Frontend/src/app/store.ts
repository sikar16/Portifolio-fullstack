// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import { authApi }     from '../services/loginService';    // your loginService slice
import { serviceProviderApi }     from '../services/serviceProviderService';    // the service_p slice
import { userApi } from '@/services/userProfileService';
import { serviceApi } from '@/services/ServicessService';
import { skillCategoryApi } from '@/services/skillCategoryService';
import { skillApi } from '@/services/skillService';
import { testimonialApi } from '@/services/testimonyService';
import { blogApi } from '@/services/blogService';
import { educationApi } from '@/services/educationService';
import { exprianceApi } from '@/services/exprianceService';
import { projectCategoryApi } from '@/services/projectCategoryService';
import { projectApi } from '@/services/projectService';
import { portifolioApi } from '@/services/portifolioService';

export const store = configureStore({
  reducer: {
    // RTK Query reducers:
    [authApi.reducerPath]: authApi.reducer,
    [serviceProviderApi.reducerPath]: serviceProviderApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [skillCategoryApi.reducerPath]: skillCategoryApi.reducer,
    [skillApi.reducerPath]: skillApi.reducer,
    [testimonialApi.reducerPath]: testimonialApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [educationApi.reducerPath]: educationApi.reducer,
    [exprianceApi.reducerPath]: exprianceApi.reducer,
    [projectCategoryApi.reducerPath]: projectCategoryApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [portifolioApi.reducerPath]: portifolioApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(serviceProviderApi.middleware)
      .concat(userApi.middleware)
      .concat(serviceApi.middleware)
      .concat(skillCategoryApi.middleware)
      .concat(skillApi.middleware)
      .concat(testimonialApi.middleware)
      .concat(blogApi.middleware)
      .concat(educationApi.middleware)
      .concat(exprianceApi.middleware)
      .concat(projectCategoryApi.middleware)
      .concat(projectApi.middleware)
      .concat(portifolioApi.middleware),
});
