import { z } from "zod";

const blogSchem = {
  create: z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    categoryName: z.string().optional(),
    images: z.array(z.string().url("Must be a valid URL")).optional(), // Validate images as an array of URLs
  }),
  update: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    categoryName: z.string().optional(),
    images: z.array(z.string().url("Must be a valid URL")).optional(), // Validate images as an array of URLs
  }),
};

export default blogSchem;