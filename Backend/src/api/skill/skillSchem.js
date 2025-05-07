import { z } from "zod";

const skillSchem = {
  create: z.object({
    name: z.string().min(1, "Name is required"),
    proficiency: z.string().min(1, "Proficiency is required"),
    icon: z.string().url().optional(),
    skillCategoryId: z.number().int().positive("Skill Category ID must be a positive integer"),
    userId: z.number().int().positive("User ID must be a positive integer").optional(),
  }),
  update: z.object({
    name: z.string().min(1).optional(),
    proficiency: z.string().min(1).optional(),
    icon: z.string().url().optional(),
    skillCategoryId: z.number().int().positive().optional(),
    userId: z.number().int().positive().optional(),
  }),
};

export default skillSchem;