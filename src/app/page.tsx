"use client"
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Home() {
  const { 
    data: session, 
    isPending, //loading state
    error //error object
} = authClient.useSession() 
  return (
   <pre>{JSON.stringify(session, null, 2)}</pre>
  );
}
