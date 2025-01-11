type CallStatus = "idle" | "incoming" | "outgoing" | "connected";

interface CallNotification {
  from: string;
  to: string;
  roomName: string;
  timestamp: number;
}
