import { z } from 'zod';

const userInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

const userDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  heroImage: z.string().url('Hero image must be a valid URL').optional(),
  yearsOfExperience: z.number().int().min(0, 'Years of experience must be a non-negative integer'),
  aboutMe: z.string().min(1, 'About me is required'),
  cv: z.string().url('CV must be a valid URL').optional(),
});

const socialMediaLinkSchema = z.array(
  z.object({
    name: z.string().url('social media image must be a valid URL').optional(),
    link: z.string().url('Link must be a valid URL'),
  })
);

const register = z.object({
    email: z.string().email('Invalid email address'),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9]{10,14}$/, 'Phone number must be valid'),
    userInfo: userInfoSchema,
    userDetails: userDetailsSchema,
    socialMediaLink: socialMediaLinkSchema,
  });
  
  const update = z.object({
    email: z.string().email('Invalid email address').optional(),
    phoneNumber: z
      .string()
      .regex(/^\+?[0-9]{10,14}$/, 'Phone number must be valid')
      .optional(),
    userInfo: userInfoSchema.partial(),
    userDetails: userDetailsSchema.partial(),
    socialMediaLink: socialMediaLinkSchema.optional(),
  });

export default {
  register,
  update,
};
