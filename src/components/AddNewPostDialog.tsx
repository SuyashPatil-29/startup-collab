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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createNewPost } from "@/actions/user"

const PostCreationSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  description: z.string().min(200, {
    message: "Please provide a detailed description of at least 200 characters.",
  }),
  equity: z.string().min(1, {
    message: "Please specify the equity percentage.",
  }),
  salary: z.string().optional(),
  requirements: z.string().min(50, {
    message: "Please specify detailed requirements for potential co-founders.",
  }),
})

type PostCreationInput = z.infer<typeof PostCreationSchema>

export function AddNewPostDialog() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<PostCreationInput>({
    resolver: zodResolver(PostCreationSchema),
    defaultValues: {
      title: "",
      description: "",
      equity: "",
      salary: "",
      requirements: "",
    },
  })

  function onSubmit(data: PostCreationInput) {
    startTransition(async () => {
      try {
        const res = await createNewPost(data)
        if(res.status === "success"){
          toast.success("Successfully created new post")
          setIsOpen(false)
          router.refresh()
          form.reset()
        }
        else{
          toast.error("Failed to create a post")
        }
      } catch (error: any) {
        console.error("Error creating post:", error)
        toast.error(error.response?.data?.error || "Failed to create post")
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share your startup idea and find the perfect co-founder.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give your startup idea a catchy title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your startup idea in detail..."
                      className="min-h-[150px]"
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

            <div className="grid grid-cols-2 gap-4">
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
                        onChange={(e) => field.onChange(e.target.value.toString())}
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
                        onChange={(e) => field.onChange(e.target.value.toString())}
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
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  "Create Post"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}