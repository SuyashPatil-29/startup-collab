import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    // Get the session with proper headers
    const session = await auth.api.getSession({
      headers: await headers()
    })
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const json = await request.json()

    // First create or update the profile
    const profile = await prisma.profile.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        bio: json.bio,
        linkedinProfile: json.linkedinProfile,
        phoneNumber: json.phoneNumber,
        githubProfile: json.githubUsername || null,
      },
      create: {
        userId: session.user.id,
        bio: json.bio,
        linkedinProfile: json.linkedinProfile,
        phoneNumber: json.phoneNumber,
        githubProfile: json.githubUsername || null,
      },
    })

    // Then create the idea
    const idea = await prisma.idea.create({
      data: {
        title: json.ideaTitle,
        description: json.ideaDescription,
        equity: parseFloat(json.equity) || 0,
        salary: json.salary ? parseFloat(json.salary) : null,
        requirements: json.requirements,
        founderId: session.user.id,
      },
    })

    return NextResponse.json({
      success: true,
      profile,
      idea,
    })
  } catch (error) {
    console.error('Failed to create profile and idea:', error)
    return NextResponse.json(
      { error: 'Failed to create profile and idea' },
      { status: 500 }
    )
  }
}