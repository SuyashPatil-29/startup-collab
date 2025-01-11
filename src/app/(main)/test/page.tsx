"use client";
import CallAlert from "@/components/CallAlert";
import React from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers } from "@/actions/user";
import { Button } from "@/components/ui/button";

const VideoCall = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const handleStartCall = async (recipientId: string) => {
    const roomName = `room-${Date.now()}`; // Generate unique room name

    // Send call notification
    const response = await fetch("/api/call", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        from: userId,
        to: recipientId,
        roomName,
      }),
    });

    if (!response.ok) {
      console.error("Failed to initiate call");
      return;
    }

    // Handle successful call initiation
    // You might want to show an outgoing call UI here
  };

  const handleAcceptCall = (roomName: string) => {
    // Join the LiveKit room
    router.push(`/room/${roomName}`);
  };

  const handleDeclineCall = () => {
    // Handle call decline (maybe notify the caller)
  };

  return (
    <div className="p-4">
      <CallAlert
        userId={userId}
        onAccept={handleAcceptCall}
        onDecline={handleDeclineCall}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {usersData?.data?.map(
          (user) =>
            user.id !== userId && (
              <div key={user.id} className="p-4 border rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Button
                    onClick={() => handleStartCall(user.id)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start Call
                  </Button>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default VideoCall;
