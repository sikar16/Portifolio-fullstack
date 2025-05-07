import { z } from 'zod';

const educationSchem = {
    create: z.object({
        institutionName: z.string().min(1),
        degree: z.string().min(1),
        fieldOfStudy: z.string().min(1),
        startDate: z.string(), // Use z.date() if using DateTime
        endDate: z.string(),   // Use z.date() if using DateTime
    }),
    update: z.object({
        institutionName: z.string().min(1).optional(),
        degree: z.string().min(1).optional(),
        fieldOfStudy: z.string().min(1).optional(),
        startDate: z.string().optional(), // Use z.date() if using DateTime
        endDate: z.string().optional(),   // Use z.date() if using DateTime
    }),
};

export default educationSchem;