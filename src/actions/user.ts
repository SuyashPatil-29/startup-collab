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

export const getDeveloperById = async (id: string) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  })
}

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
          githubUsername: data.githubUsername ? data.githubUsername : "",
        },
      }),
      prisma.idea.create({
        data: {
          title: data.ideaTitle,
          description: data.ideaDescription,
          equity: data.equity || "0",
          salary: data.salary ? data.salary : null,
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

export const createNewPost = async (data: {
  title: string;
  description: string;
  equity: string;
  requirements: string;
  salary?: string | undefined;
}) => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const post = await prisma.idea.create({
      data: {
        title: data.title,
        description: data.description,
        equity: data.equity || "0",
        salary: data.salary ? data.salary : null,
        requirements: data.requirements,
        founderId: session.user.id,
      }
    })
    return { status: "success", post };
  } catch (error) {
    console.error(error);
    return { status: "error", error: error };
  }
}

export const applyToApplication = async (data: {
  proposal: string,
  ideaId: string,
}) => {
  try {
    const session = await getSession();

    const user = session?.user;

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Check if user has already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        ideaId: data.ideaId,
        developerId: session.user.id,
      },
    })

    if (existingApplication) {
      return { status: "Applied", existingApplication }
    }

    // Create new application
    const application = await prisma.application.create({
      data: {
        ideaId: data.ideaId,
        developerId: session.user.id,
        proposal: data.proposal,
        status: "PENDING",
      },
    })

    return { status: "Success", application }
  } catch (error) {
    console.error('Failed to submit application:', error)
  }
}

export const setApplicationState = async (data: {
  type: string,
  id: string
}) => {
  if (data.type === "Accept") {
    const res = await prisma.application.update({
      where: {
        id: data.id
      },
      data: {
        status: "ACCEPTED",
      }
    })
    return res
  } else {
    const res = await prisma.application.update({
      where: {
        id: data.id
      },
      data: {
        status: "REJECTED",
      }
    })
    return res
  }
}

export const populateDeveloperData = async (data: {
  bio: string;
  linkedinProfile: string;
  phoneNumber: string;
  githubUsername: string;
  skills: string;
  experience: string;
}): Promise<SAPayload<Profile>> => {
  const session = await getSession();

  const user = session?.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        bio: data.bio,
        linkedinProfile: data.linkedinProfile,
        phoneNumber: data.phoneNumber,
        githubUsername: data.githubUsername,
        skills: data.skills,
        experience: data.experience,
      },
    });

    return { status: "success", data: profile };
  } catch (error) {
    console.error(error);
    return { status: "error", error: error };
  }
};
