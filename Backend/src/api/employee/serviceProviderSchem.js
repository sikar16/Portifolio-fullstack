import z from "zod";

const serviceProviderSchema = {
  create: z.object({
    email: z.string().email("Invalid email"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

export default serviceProviderSchema;
