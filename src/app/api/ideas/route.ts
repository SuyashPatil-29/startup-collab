import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const ideas = await prisma.idea.findMany({
      include: {
        founder: true,
        applications : true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Failed to fetch ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}
