import z from "zod";

const serviceSchem = {
    create: z.object({
        name: z.string().min(1, "Service name is required"),
        icon: z.string().optional(),
        description: z.string().min(1, "Service description is required"),
        general_description: z.string().optional(),
        features: z.array(z.string().min(1, "Feature name must be a non-empty string"))
            .min(1, "At least one feature is required")
    }),
    update: z.object({
        name: z.string().min(1, "Service name is required").optional(),
        icon: z.string().optional(),
        description: z.string().min(1, "Service description is required").optional(),
        general_description: z.string().optional(),
        features: z.array(z.string().min(1, "Feature name must be a non-empty string"))
            .min(1, "At least one feature is required").optional()
    }),
};
export default serviceSchem;


