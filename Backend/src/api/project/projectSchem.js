import { z } from "zod";

const projectSchema = {
  create: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    demoLink: z.string().url().optional(),
    technology: z.string().optional(),
    projectCategoryId: z.number(),
    projectImage: z.array(z.string()).optional(), // Expect array of image URLs
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    demoLink: z.string().url().optional(),
    technology: z.string().optional(),
    projectCategoryId: z.number().optional(),
    projectImage: z.array(z.string()).optional(),
  }),
};

export default projectSchema;
