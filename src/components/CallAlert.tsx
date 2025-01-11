import React, { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";
import { DialogContent, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CallAlertProps {
  userId?: string;
  onAccept: (roomName: string) => void;
  onDecline: () => void;
}

const CallAlert: React.FC<CallAlertProps> = ({
  userId,
  onAccept,
  onDecline,
}) => {
  const [incomingCall, setIncomingCall] = useState<CallNotification | null>(
    null
  );

  useEffect(() => {
    // Subscribe to user's channel
    const channel = pusherClient.subscribe(`user-${userId}`);

    // Listen for incoming calls
    channel.bind("incoming-call", (data: CallNotification) => {
      setIncomingCall(data);
      // Play notification sound
      const audio = new Audio("/notification.mp3");
      audio.play().catch(console.error);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId]);

  if (!incomingCall) return null;

  return (
    <Dialog open={true} onOpenChange={() => setIncomingCall(null)}>
      <DialogContent>
        <h2 className="text-xl font-bold">Incoming Call</h2>
        <p>{incomingCall.from} is calling...</p>
        <div className="mt-4 flex space-x-4">
          <Button
            onClick={() => {
              onAccept(incomingCall.roomName);
              setIncomingCall(null);
            }}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Accept
          </Button>
          <Button
            onClick={() => {
              onDecline();
              setIncomingCall(null);
            }}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallAlert;
