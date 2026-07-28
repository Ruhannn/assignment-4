import type { Role } from "../../prisma/generated/prisma/enums";
import type { UserJwtPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {};
