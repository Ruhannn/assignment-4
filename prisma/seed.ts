import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import { BookingStatus, PaymentStatus, Role } from "./generated/prisma/enums";
import prisma from "../src/lib/prisma";

async function main() {
  const password = await bcrypt.hash("password123", 10);

  const [owner1, owner2, renter1, renter2, admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Spider Man",
        email: "spider.man@gmail.com",
        password,
        role: Role.OWNER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Super Man",
        email: "super.man@gmail.com",
        password,
        role: Role.OWNER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Bat Man",
        email: "bat.man@gmail.com",
        password,
        role: Role.RENTER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Iron Man",
        email: "iron.man@gmail.com",
        password,
        role: Role.RENTER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password,
        role: Role.ADMIN,
      },
    }),
  ]);

  console.log("Created 5 users");

  const carsToCreate = [
    {
      brand: "Toyota",
      model: "Supra MK5",
      dailyRate: 12000,
      location: "Gulshan, Dhaka",
      ownerId: owner1.id,
    },
    {
      brand: "Land Rover",
      model: "Range Rover",
      dailyRate: 10000,
      location: "Mirpur, Dhaka",
      ownerId: owner2.id,
    },
    {
      brand: "Mercedes-Benz",
      model: "G-Class G63 AMG",
      dailyRate: 18000,
      location: "Banani, Dhaka",
      ownerId: owner1.id,
    },
    {
      brand: "BMW",
      model: "M4 Competition",
      dailyRate: 14000,
      location: "Dhanmondi, Dhaka",
      ownerId: owner2.id,
    },
    {
      brand: "Honda",
      model: "Civic Type R",
      dailyRate: 8000,
      location: "Uttara, Dhaka",
      ownerId: owner1.id,
    },
  ];

  const cars = [];
  for (const carData of carsToCreate) {
    const car = await prisma.car.create({ data: carData });
    cars.push(car);
  }

  console.log(`Created ${cars.length} cars`);

  const bookingsToCreate = [
    {
      car: cars[0],
      renterId: renter1.id,
      startDate: new Date("2026-08-01"),
      endDate: new Date("2026-08-11"),
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.COMPLETED,
    },
    {
      car: cars[1],
      renterId: renter2.id,
      startDate: new Date("2026-08-10"),
      endDate: new Date("2026-08-20"),
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    },
    {
      car: cars[3],
      renterId: renter1.id,
      startDate: new Date("2026-07-15"),
      endDate: new Date("2026-07-25"),
      bookingStatus: BookingStatus.CANCELLED,
      paymentStatus: PaymentStatus.FAILED,
    },
  ];

  for (const b of bookingsToCreate) {
    if (b.car) {
      const totalPrice = 10 * b.car.dailyRate; // all bookings are 10 days

      const booking = await prisma.booking.create({
        data: {
          carId: b.car.id,
          renterId: b.renterId,
          startDate: b.startDate,
          endDate: b.endDate,
          totalPrice,
          status: b.bookingStatus,
        },
      });

      if (b.paymentStatus !== PaymentStatus.PENDING) {
        await prisma.payment.create({
          data: {
            bookingId: booking.id,
            amount: totalPrice,
            status: b.paymentStatus,
            transactionId: randomUUID(),
          },
        });
      }
    }
  }

  console.log(`Created ${bookingsToCreate.length} bookings`);
  console.log("Seed finished!");
}

main().then(() => {
  process.exit(0);
})
