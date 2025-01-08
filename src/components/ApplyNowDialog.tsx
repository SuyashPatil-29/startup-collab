import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios from "axios"
import { applyToApplication } from "@/actions/user"

const ApplicationSchema = z.object({
  proposal: z.string().min(200, {
    message: "Please provide a detailed proposal of at least 200 characters.",
  }),
})

type ApplicationInput = z.infer<typeof ApplicationSchema>

export function ApplyNowDialog({ idea }: { idea: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      proposal: "",
    },
  })

  function onSubmit(data: ApplicationInput) {
    startTransition(async () => {
      try {
        const res = await applyToApplication({
          proposal: data.proposal,
          ideaId: idea.id
        })
        toast.success("Application submitted successfully!")
        setIsOpen(false)
        router.refresh()
        form.reset()
      } catch (error: any) {
        console.error("Error submitting application:", error)
        toast.error(error.response?.data?.error || "Failed to submit application")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Apply Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Apply to {idea.title}</DialogTitle>
          <DialogDescription>
            Tell the founder why you'd be a great co-founder for this startup.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Idea Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h3 className="font-medium">Idea Summary</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Equity Offered:</span> {idea.equity}%</p>
                  {idea.salary && (
                    <p><span className="font-medium">Monthly Salary:</span> ₹{idea.salary}</p>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <h3 className="font-medium">Requirements</h3>
                <p className="text-sm text-muted-foreground">{idea.requirements}</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="proposal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Proposal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe why you'd be a great fit for this role. Include your relevant experience, skills, and vision for the startup..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about your experience and how you can contribute to the startup's success.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
