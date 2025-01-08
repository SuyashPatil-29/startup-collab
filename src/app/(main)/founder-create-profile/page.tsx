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
import { Briefcase, Loader2, Rocket, Tags, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { populateFounderData } from "@/actions/user";
import { useTransition } from "react";

const ProfileCreationSchema = z.object({
  // Profile Information
  bio: z.string().min(50, {
    message: "Bio must be at least 50 characters.",
  }),
  linkedinProfile: z.string().url({
    message: "Please enter a valid LinkedIn URL.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  githubUsername: z.string().optional(),
  githubRepos: z.array(z.string()).optional(),
  githubBio: z.string().optional(),

  // Idea Information
  ideaTitle: z.string().min(10, {
    message: "Idea title must be at least 10 characters.",
  }),
  ideaDescription: z.string().min(200, {
    message:
      "Please provide a detailed description of at least 200 characters.",
  }),
  equity: z.string().default("0"),
  salary: z.string().optional(),
  requirements: z.string().min(50, {
    message: "Please specify detailed requirements for potential co-founders.",
  }),
});

export default function FounderProfileForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof ProfileCreationSchema>>({
    resolver: zodResolver(ProfileCreationSchema),
    defaultValues: {
      bio: "",
      linkedinProfile: "",
      phoneNumber: "",
      githubUsername: "",
      githubRepos: [],
      githubBio: "",
      ideaTitle: "",
      ideaDescription: "",
      equity: "0",
      salary: "",
      requirements: "",
    },
  });

  const [isSubmitting, startSubMitting] = useTransition();

  function onSubmit(data: z.infer<typeof ProfileCreationSchema>) {
    startSubMitting(async () => {
      try {
        const response = await populateFounderData(data);

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
          Let's create your founder profile and post your startup idea.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                        placeholder="Tell us about yourself, your background, and your entrepreneurial journey..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share your experience and what makes you a great founder.
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
                        Will only be shared with accepted co-founders.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-2xl font-semibold">
                <Rocket className="w-6 h-6" />
                <h2>Startup Idea</h2>
              </div>

              <FormField
                control={form.control}
                name="ideaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Give your startup idea a catchy title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ideaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your startup idea in detail..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include the problem you're solving, target market, and
                      potential revenue streams.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="equity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Equity Offered (%)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toString())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Salary (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="50000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toString())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-2xl font-semibold">
                <Briefcase className="w-6 h-6" />
                <h2>Co-founder Requirements</h2>
              </div>

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Co-founder Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the skills, experience, and commitment you're looking for in a co-founder..."
                        className="min-h-[100px]"
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
          disabled={form.formState.isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="mr-2">Creating...</span>
              <Loader2 className="h-4 w-4 animate-spin" />
            </>
          ) : (
            "Create Profile & Post Idea"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
