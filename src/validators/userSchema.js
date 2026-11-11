import { z } from "zod";

export const userSignUpSchema = z.object({
  email: z.email(),
  username: z.string.min(3),
  password: z.string()
});

export const userSignInSchema = z.object({
  email: z.email(),
  password: z.string()
});
