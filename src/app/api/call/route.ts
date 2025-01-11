import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { from, to, roomName } = body;

    if (!from || !to || !roomName) {
      throw new Error("Missing required values");
    }

    await pusherServer.trigger(`user-${to}`, "incoming-call", {
      from,
      to,
      roomName,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to initiate call" },
      { status: 500 }
    );
  }
}
