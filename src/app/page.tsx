"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Home() {
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = useSession();
  const router = useRouter();
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button
        onClick={() =>
          signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          })
        }
      >
        Sign Out
      </button>
    </div>
  );
}
