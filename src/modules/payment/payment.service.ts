import prisma from "../../lib/prisma";
import stripe from "../../lib/stripe";
import config from "../../config";
import { AppError } from "../../utils/app-error";

const CURRENCY = "usd";

export async function createCheckoutSession(
  renterId: string,
  bookingId: string,
) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { car: true, payment: true },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  if (booking.renterId !== renterId) {
    throw new AppError(403, "Forbidden - This is not your booking");
  }

  if (booking.status !== "PENDING") {
    throw new AppError(400, `Cannot pay for a ${booking.status} booking`);
  }

  if (booking.payment?.status === "COMPLETED") {
    throw new AppError(409, "Booking is already paid");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    metadata: { bookingId: booking.id },
    success_url: `${config.CLIENT_URL}/payment/success`,
    cancel_url: `${config.CLIENT_URL}/payment/cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: CURRENCY,
          unit_amount: Math.round(booking.totalPrice * 100),
          product_data: {
            name: `${booking.car.brand} ${booking.car.model}`,
          },
        },
      },
    ],
  });

  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    create: {
      bookingId: booking.id,
      amount: booking.totalPrice,
      transactionId: session.id,
    },
    update: { transactionId: session.id, status: "PENDING" },
  });

  return { checkoutUrl: session.url };
}

export async function completePayment(bookingId: string, transactionId: string) {
  const payment = await prisma.payment.findUnique({ where: { bookingId } });

  // stripe re-delivers events, so completing twice must be a no-op
  if (!payment || payment.status === "COMPLETED") return;

  await prisma.$transaction([
    prisma.payment.update({
      where: { bookingId },
      data: { status: "COMPLETED", transactionId },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    }),
  ]);
}
