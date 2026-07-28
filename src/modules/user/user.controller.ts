import type { Request, Response } from "express";
import { getCurrentUser } from "./user.service";
import prisma from "../../lib/prisma";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, { message: "User not authenticated" }, 401);
  }

  const user = await getCurrentUser(req.user.id);

  if (!user) {
    return sendResponse(res, { message: "User not found" }, 404);
  }

  return sendResponse(res, {
    data: { user },
    message: "User retrieved successfully",
  });
});

export const getUsers = catchAsync(async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return res.status(200).json({ users });
});
