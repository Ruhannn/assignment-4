
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import  jwt from 'jsonwebtoken';
import config from "../config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { PrismaClientValidationError } from "../../prisma/generated/prisma/internal/prismaNamespace";
import { AppError } from "../utils/app-error";



export const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong';
  let errorDetails: unknown = null;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errorDetails = err.issues.map((i) => ({ path: i.path.join('.'), message: i.message }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = err.errorDetails ?? null;
  } else if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': // unique constraint
        statusCode = 409;
        message = `Duplicate value for: ${(err.meta?.target as string[] | undefined)?.join(', ') ?? 'field'}`;
        break;
      case 'P2025': // record not found
        statusCode = 404;
        message = 'Requested record not found';
        break;
      case 'P2003': // FK constraint
        statusCode = 400;
        message = 'Related record does not exist';
        break;
      default:
        statusCode = 400;
        message = 'Database request error';
        errorDetails = { code: err.code };
    }
  } else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided to database query';
  } else if (err instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = 'Token expired';
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err instanceof Error) {
    message = err.message;
  }


  if (statusCode === 500 && config.NODE_ENV === 'production') {
    message = 'Internal server error';
    errorDetails = null;
  } else if (config.NODE_ENV !== 'production' && err instanceof Error && errorDetails === null) {
    errorDetails = { stack: err.stack };
  }

  res.status(statusCode).json({ success: false, message, errorDetails });
};
