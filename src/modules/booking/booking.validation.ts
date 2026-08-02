import { z } from "zod";

export const createBookingSchema = z
  .object({
    carId: z.uuid("invalid car id"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((input) => input.endDate > input.startDate, {
    message: "endDate must be after startDate",
    path: ["endDate"],
  });

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
