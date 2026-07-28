import type { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  res.status(404).json({
    success: false,
    message: `Not Found - Cannot ${req.method} ${req.originalUrl} 😕`,
  });
};
