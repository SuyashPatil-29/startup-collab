"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { assignUserRole } from "@/actions/user";

export default function RoleSelection() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role: "Co-Founder" | "Founder") => {
    try {
      setIsLoading(true);
      await assignUserRole(role);

      if (role === "Founder") {
        router.push("/founder-create-profile");
      } else {
        router.push("/");
      }

      toast.success(`Successfully registered as a ${role}`);
    } catch (error) {
      toast.error("Failed to set role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100svh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            Choose Your Role
          </CardTitle>
          <CardDescription className="text-center">
            Select how you want to participate in the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className={cn("w-full p-8 text-lg", isLoading && "opacity-50")}
              onClick={() => handleRoleSelection("Founder")}
              disabled={isLoading}
            >
              Founder
              <span className="block text-sm text-muted-foreground mt-2">
                I have an idea and I'm looking for co-founders
              </span>
            </Button>

            <Button
              variant="outline"
              className={cn("w-full p-8 text-lg", isLoading && "opacity-50")}
              onClick={() => handleRoleSelection("Co-Founder")}
              disabled={isLoading}
            >
              Co-Founder
              <span className="block text-sm text-muted-foreground mt-2">
                I want to join exciting projects as a co-founder
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
