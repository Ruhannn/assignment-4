import { z } from "zod";

export const createCarSchema = z.object({
  brand: z.string().trim().min(1, "brand is required"),
  model: z.string().trim().min(1, "model is required"),
  dailyRate: z.number().positive("dailyRate must be greater than 0"),
  location: z.string().trim().min(1, "location is required"),
});

export const updateCarSchema = createCarSchema.partial().extend({
  isAvailable: z.boolean().optional(),
});

export const carIdParamSchema = z.object({
  id: z.uuid("invalid car id"),
});

export type CreateCarInput = z.infer<typeof createCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
