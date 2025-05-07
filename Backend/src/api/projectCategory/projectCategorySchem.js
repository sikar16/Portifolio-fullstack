import { z } from 'zod';

const projectCategorySchem = {
    create: z.object({
        name: z.string().min(3, "Name is required"),
    }),
    update: z.object({
        name: z.string().min(1).optional(),
    }),
};

export default projectCategorySchem;