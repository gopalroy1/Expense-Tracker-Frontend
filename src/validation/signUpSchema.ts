import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be 10 digits").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
});

export type SignupFormType = z.infer<typeof signupSchema>;
