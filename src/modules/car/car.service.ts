import type { Prisma } from "../../../prisma/generated/prisma/client";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/app-error";
import type { UserJwtPayload } from "../../utils/jwt";
import type { UpdateCarInput } from "./car.validation";


export async function getCarById(id: string) {
  const car = await prisma.car.findUnique({ where: { id } });

  if (!car) {
    throw new AppError(404, "Car not found");
  }

  return car;
}

async function assertCanMutateCar(user: UserJwtPayload, carId: string) {
  const car = await getCarById(carId);

  if (user.role !== "ADMIN" && car.ownerId !== user.id) {
    throw new AppError(403, "Forbidden - You do not own this car");
  }

  return car;
}

export async function updateCar(
  user: UserJwtPayload,
  id: string,
  input: UpdateCarInput,
) {
  await assertCanMutateCar(user, id);


  return prisma.car.update({ where: { id }, data: input as Prisma.CarUpdateInput });
}

export async function deleteCar(user: UserJwtPayload, id: string) {
  await assertCanMutateCar(user, id);

  return prisma.car.delete({ where: { id } });
}
