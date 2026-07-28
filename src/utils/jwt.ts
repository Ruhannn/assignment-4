import jwt from "jsonwebtoken";
import type { Role } from "../../prisma/generated/prisma/enums";
import config from "../config";

export type UserJwtPayload = {
  id: string;
  email: string;
  role: Role;
};

export function signAccessToken(payload: UserJwtPayload) {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: "5h" });
}

export function signRefreshToken(payload: UserJwtPayload) {
return jwt.sign(payload, config.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export function createTokenPair(payload: UserJwtPayload) {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.JWT_ACCESS_SECRET) as UserJwtPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as UserJwtPayload;
}
