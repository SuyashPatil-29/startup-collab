"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Code, Loader2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { populateDeveloperData } from "@/actions/user";
import { useTransition } from "react";

const DeveloperProfileSchema = z.object({
  bio: z.string().min(50, {
    message: "Bio must be at least 50 characters.",
  }),
  linkedinProfile: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }).regex(/^\+?[1-9]\d{9,14}$/, {
    message: "Please enter a valid phone number with country code.",
  }),
  githubUsername: z.string().min(1, {
    message: "GitHub username is required.",
  }),
  skills: z.string().min(50, {
    message: "Please provide detailed information about your skills.",
  }),
  experience: z.string().min(100, {
    message: "Please provide detailed information about your experience.",
  }),
});

export default function DeveloperProfileForm() {
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const form = useForm<z.infer<typeof DeveloperProfileSchema>>({
    resolver: zodResolver(DeveloperProfileSchema),
    defaultValues: {
      bio: "",
      linkedinProfile: "",
      phoneNumber: "",
      githubUsername: "",
      skills: "",
      experience: "",
    },
  });

  function onSubmit(data: z.infer<typeof DeveloperProfileSchema>) {
    startTransition(async () => {
      try {
        const response = await populateDeveloperData(data);

        if (response.status === "success") {
          toast.success("Successfully created profile");
          router.push("/community");
          return;
        }

        if (response.status === "error") {
          toast.error(response.error.message);
          return;
        }
      } catch (error: any) {
        console.error("Error creating profile:", error);
        toast.error(error.message || "Failed to create profile");
      }
    });
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          Welcome to Startup Collab!
        </CardTitle>
        <CardDescription className="text-xl text-center">
          Let's create your developer profile to help you find the perfect startup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-2xl font-semibold">
                <User className="w-6 h-6" />
                <h2>Personal Information</h2>
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself, your background, and your journey as a developer..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your experience and what makes you a great co-founder.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkedinProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Profile</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/in/yourprofile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91" {...field} />
                      </FormControl>
                      <FormDescription>
                        Include country code (e.g., +91 for India)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Technical Background Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-2xl font-semibold">
                <Code className="w-6 h-6" />
                <h2>Technical Background</h2>
              </div>

              <FormField
                control={form.control}
                name="githubUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your-github-username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your technical skills, programming languages, frameworks, and tools..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your work experience, projects, and achievements..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Creating...</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            "Create Developer Profile"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}