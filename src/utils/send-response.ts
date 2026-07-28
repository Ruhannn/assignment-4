import type { Response } from "express";

export function sendResponse<T>(
  res: Response,
  { message, data, error }: { message: unknown; data?: T; error?: boolean },
  status = 200,
) {
  res.status(status).json({
    message: message,
    data: error ? undefined : data,
  });
}
