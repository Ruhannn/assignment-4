import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import { calcTotalPrice } from "../../utils/calc-total-price";
import { getCarById } from "../car/car.service";
import type { CreateBookingInput } from "./booking.validation";



export async function createBooking(
  renterId: string,
  input: CreateBookingInput,
) {
  const car = await getCarById(input.carId);

  if (!car.isAvailable) {
    throw new AppError(400, "Car is not available");
  }

  if (car.ownerId === renterId) {
    throw new AppError(400, "You cannot book your own car");
  }

  const overlapping = await prisma.booking.findFirst({
    where: {
      carId: car.id,
      status: { not: "CANCELLED" },
      startDate: { lt: input.endDate },
      endDate: { gt: input.startDate },
    },
  });

  if (overlapping) {
    throw new AppError(409, "Car is already booked for those dates");
  }

  return prisma.booking.create({
    data: {
      carId: car.id,
      renterId,
      startDate: input.startDate,
      endDate: input.endDate,
      totalPrice: calcTotalPrice(input.startDate, input.endDate, car.dailyRate),
    },
  });
}
