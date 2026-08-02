import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import {
  carIdParamSchema,
  createCarSchema,
  updateCarSchema,
} from "./car.validation";
import {
  deleteCar,
  getCarById,
  updateCar,
} from "./car.service";
import prisma from "../../lib/prisma";

export const getCars = catchAsync(async (_req: Request, res: Response) => {
  const cars = await prisma.car.findMany({
    where: { isAvailable: true },
    orderBy: { createdAt: "desc" },
  });

  sendResponse(res, { message: "Cars retrieved successfully", data: { cars } });
});

export const getCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = carIdParamSchema.parse(req.params);

  const car = await getCarById(id);

  sendResponse(res, { message: "Car retrieved successfully", data: { car } });
});

export const addCar = catchAsync(async (req: Request, res: Response) => {
  const input = createCarSchema.parse(req.body);

  const car = await prisma.car.create({ data: { ...input, ownerId: req.user!.id } });

  sendResponse(res, { message: "Car created successfully", data: { car } }, 201);
});

export const editCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = carIdParamSchema.parse(req.params);
  const input = updateCarSchema.parse(req.body);

  const car = await updateCar(req.user!, id, input);

  sendResponse(res, { message: "Car updated successfully", data: { car } });
});

export const removeCar = catchAsync(async (req: Request, res: Response) => {
  const { id } = carIdParamSchema.parse(req.params);

  await deleteCar(req.user!, id);

  sendResponse(res, { message: "Car deleted successfully" });
});
