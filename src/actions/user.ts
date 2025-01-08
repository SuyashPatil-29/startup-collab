"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SAPayload } from "@/lib/types";
import { User, Profile, Idea } from "@prisma/client";

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

export const populateFounderData = async (data: {
  bio: string;
  linkedinProfile: string;
  phoneNumber: string;
  ideaTitle: string;
  ideaDescription: string;
  equity: string;
  requirements: string;
  githubUsername?: string | undefined;
  githubRepos?: string[] | undefined;
  githubBio?: string | undefined;
  salary?: string | undefined;
}): Promise<SAPayload<{ profile: Profile; idea: Idea }>> => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const [profile, idea] = await Promise.all([
      prisma.profile.create({
        data: {
          userId: user.id,
          bio: data.bio,
          linkedinProfile: data.linkedinProfile,
          phoneNumber: data.phoneNumber,
          githubProfile: data.githubUsername,
        },
      }),
      prisma.idea.create({
        data: {
          title: data.ideaTitle,
          description: data.ideaDescription,
          equity: parseFloat(data.equity) || 0,
          salary: data.salary ? parseFloat(data.salary) : null,
          requirements: data.requirements,
          founderId: session.user.id,
        },
      }),
    ]);

    return { status: "success", data: { profile, idea } };
  } catch (error) {
    console.error(error);
    return { status: "error", error: error };
  }
};
