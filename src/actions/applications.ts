"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const getSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

export async function getIdeas() {
  const session = await getSession();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const ideas = await prisma.idea.findMany({
      include: {
        founder: true,
        applications: {
          include: {
            developer: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ideas;
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    throw new Error("Failed to fetch ideas");
  }
}
