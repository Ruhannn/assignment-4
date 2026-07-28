import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";
import { sendResponse } from "../../utils/send-response";
import { catchAsync } from "../../utils/catch-async";

export const register = catchAsync(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);

  const result = await registerUser(input);

  sendResponse(
    res,
    { message: "User registered successfully", data: { user: result } },
    201,
  );
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);

  const result = await loginUser(input);

  sendResponse(res, {
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
});
