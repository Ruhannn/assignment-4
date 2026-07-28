import { z } from "zod";
import { Role } from "../../../prisma/generated/prisma/enums";

export const loginSchema = z.object({
  email: z.email("email is required"),
  password: z.string().min(1, "password is required"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, "name is required"),
  role: z.enum(Role).default(Role.RENTER)
})

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
