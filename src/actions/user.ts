"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SAPayload } from "@/lib/types";
import { User } from "@prisma/client";

const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export const assignUserRole = async (
  role: "Co-Founder" | "Founder"
): Promise<SAPayload<User>> => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const response = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role,
      },
    });

    return { status: "success", data: response };
  } catch (error) {
    console.error(error);
    return { status: "error", error: error };
  }
};
