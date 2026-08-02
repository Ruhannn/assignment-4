import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catch-async";
import type { Role } from "../../prisma/generated/prisma/enums";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "../utils/app-error";

const auth = (...roles: Role[]) =>
  catchAsync(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized - No token provided");
    }

    const token = authHeader.slice(7);

    try {
      const decoded = verifyAccessToken(token);

      if (roles.length && !roles.includes(decoded.role)) {
        throw new AppError(403, "Forbidden - Unauthorized access");
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(401, "Unauthorized - Invalid token");
    }
  });

export default auth;
