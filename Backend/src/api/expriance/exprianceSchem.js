import { z } from 'zod';

const experienceSchem = {
    create: z.object({
        companyName: z.string().min(1),
        position: z.string().min(1),
        responsibilities: z.string().min(1),
        startDate: z.string().min(1),
        endDate: z.string(),
        area: z.string().min(1),
    }),
    update: z.object({
        companyName: z.string().optional(),
        position: z.string().optional(),
        responsibilities: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        area: z.string().optional(),
    }),
};

export default experienceSchem;
