import z from "zod";
const publicSchem = {
  login: z.object({
    password: z.string().min(6),
    email: z.string().email(),
  }),
 
};

export default publicSchem;
