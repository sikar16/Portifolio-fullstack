import { z } from "zod";

const testimonialSchema = {
  create: z.object({
    reviewerFullName: z.string().min(1),
    reviewerTitle: z.string().min(1),
    feedback: z.string().min(1),
    rate:z.number(),
  }),

  update: z.object({
    reviewerFullName: z.string().min(1),
    reviewerTitle: z.string().min(1),
    feedback: z.string().min(1),
    rate:z.number(),
  }),
};

export default testimonialSchema;
