import prisma from "../../lib/prisma";

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    omit: {
      password: true,
    },
  });
}
