import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { createBookingSchema } from "./booking.validation";
import { createBooking, } from "./booking.service";
import prisma from "../../lib/prisma";

export const addBooking = catchAsync(async (req: Request, res: Response) => {
  const input = createBookingSchema.parse(req.body);

  const booking = await createBooking(req.user!.id, input);

  sendResponse(
    res,
    { message: "Booking created successfully", data: { booking } },
    201,
  );
});

export const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    where: { renterId: req.user!.id },
    include: { car: true },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Bookings retrieved successfully",
    data: { bookings },
  });
});

export const getBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await prisma.booking.findMany({
    include: { car: true, renter: { omit: { password: true } } },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, {
    message: "Bookings retrieved successfully",
    data: { bookings },
  });
});
