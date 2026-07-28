import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import {
  createTokenPair,
  signAccessToken,
  signRefreshToken,
  type UserJwtPayload,
} from "../../utils/jwt";
import { AppError } from "../../utils/app-error";
import type { RegisterInput, LoginInput } from "./auth.validation";

function toJwtPayload(user: {
  id: string;
  email: string;
  role: UserJwtPayload["role"];
}): UserJwtPayload {
  return { id: user.id, email: user.email, role: user.role };
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
    },
    omit: {
      password: true,
    },
  });

  return user;
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return {
    user: safeUser,
    ...createTokenPair({ email: user.email, id: user.id, role: user.role }),
  };
}
