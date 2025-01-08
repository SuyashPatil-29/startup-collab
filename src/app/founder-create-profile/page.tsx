"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

const FormSchema = z.object({
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
    message: "Please provide a detailed description of at least 200 characters.",
  }),
  equity: z.number().min(1).max(100).default(0),
  salary: z.number().optional(),
  requirements: z.string().min(50, {
    message: "Please specify detailed requirements for potential co-founders.",
  }),
  tags: z.string().transform((str) => str.split(',').map(tag => tag.trim())),
})

export default function FounderProfileForm() {
  const { data: session } = authClient.useSession()
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      bio: "",
      linkedinProfile: "",
      phoneNumber: "",
      githubUsername: "",
      githubRepos: [],
      githubBio: "",
      ideaTitle: "",
      ideaDescription: "",
      equity: 0,
      requirements: "",
      tags: [],
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await fetch('/api/create-founder-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create profile')
      }

      toast("Profile created successfully!")
    } catch (error) {
      toast.error("Failed to create profile")
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to Startup Collab! Founder</h2>
            <h3 className="text-xl font-bold">Let's get started by creating your profile.</h3>

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about yourself, your background, and your entrepreneurial journey..."
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

            <FormField
              control={form.control}
              name="linkedinProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
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

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Startup Idea</h2>

            <FormField
              control={form.control}
              name="ideaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idea Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give your startup idea a catchy title" {...field} />
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
                      className="h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include the problem you're solving, target market, and potential revenue streams.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="equity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Equity Offered (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="100"
                        placeholder="20"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
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
                  <FormItem className="flex-1">
                    <FormLabel>Monthly Salary (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Technologies/Skills</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, Node.js, AWS, Marketing (comma-separated)"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter technologies and skills required, separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full">Create Profile & Post Idea</Button>
        </form>
      </Form >
    </Card>
  )
}
