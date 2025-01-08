import { setApplicationState } from "@/actions/user"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ApplicationStatus } from "@prisma/client"
import { formatDistance } from "date-fns"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { 
  Loader2, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Calendar, 
  CheckCircle2,
  ExternalLink 
} from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface Developer {
  id: string
  name: string
  image: string | null
  email: string
  profile?: {
    phoneNumber?: string
    linkedinProfile?: string
    githubUsername?: string
    bio?: string
  }
}

interface Application {
  id: string
  status: ApplicationStatus
  proposal: string
  createdAt: Date
  developer: Developer
}

interface Idea {
  id: string
  title: string
  applications: Application[]
}

export function ViewApplicationsSheet({ idea }: { idea: Idea }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()

  // Query for fetching applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', idea.id],
    queryFn: async () => {
      return idea.applications
    },
    initialData: idea.applications,
  })

  // Mutation for updating application status
  const { mutate: updateApplication, isPending } = useMutation({
    mutationFn: async ({ applicationId, type }: { applicationId: string, type: "Accept" | "Reject" }) => {
      return await setApplicationState({
        type,
        id: applicationId
      })
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['applications', idea.id] })
      router.refresh()
      toast.success('Application status updated successfully')
    },
    onError: (error) => {
      console.error('Error updating application:', error)
      toast.error('Failed to update application status')
    }
  })

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "ACCEPTED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "WITHDRAWN":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderAcceptedCard = (application: Application) => {
    return (
      <div className="border rounded-lg p-6 space-y-4 bg-green-50">
        {/* Header with accepted status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {application.developer.image ? (
              <img
                src={application.developer.image}
                alt={application.developer.name}
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-green-200 flex items-center justify-center text-xl font-semibold">
                {application.developer.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{application.developer.name}</h3>
              <div className="flex items-center text-green-700 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span>Accepted Co-Founder</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 border-t border-green-200 pt-4">
          <h4 className="font-medium text-gray-900">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-500" />
              <a href={`mailto:${application.developer.email}`} className="text-gray-700 hover:text-black">
                {application.developer.email}
              </a>
            </div>
            {application.developer.profile?.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <a href={`tel:${application.developer.profile.phoneNumber}`} className="text-gray-700 hover:text-black">
                  {application.developer.profile.phoneNumber}
                </a>
              </div>
            )}
            {application.developer.profile?.linkedinProfile && (
              <div className="flex items-center gap-2 text-sm">
                <Linkedin className="w-4 h-4 text-gray-500" />
                <a 
                  href={application.developer.profile.linkedinProfile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-black flex items-center gap-1"
                >
                  LinkedIn Profile
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {application.developer.profile?.githubUsername && (
              <div className="flex items-center gap-2 text-sm">
                <Github className="w-4 h-4 text-gray-500" />
                <a 
                  href={`https://github.com/${application.developer.profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-black flex items-center gap-1"
                >
                  {application.developer.profile.githubUsername}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {application.developer.profile?.bio && (
          <div className="border-t border-green-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">About</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {application.developer.profile.bio}
            </p>
          </div>
        )}

        {/* Application Details */}
        <div className="border-t border-green-200 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span>Applied {formatDistance(new Date(application.createdAt), new Date(), { addSuffix: true })}</span>
          </div>
          <h4 className="font-medium text-gray-900 mb-2">Original Proposal</h4>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {application.proposal}
          </p>
        </div>
      </div>
    )
  }

  const renderPendingCard = (application: Application) => {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {application.developer.image ? (
              <img
                src={application.developer.image}
                alt={application.developer.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold">
                {application.developer.name?.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-medium">{application.developer.name}</h3>
              <p className="text-sm text-gray-500">
                Applied {formatDistance(new Date(application.createdAt), new Date(), { addSuffix: true })}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
            {application.status}
          </span>
        </div>

        <div className="text-sm text-gray-600 whitespace-pre-wrap">
          {application.proposal}
        </div>

        {application.status === "PENDING" && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="default"
              className="w-full"
              size="sm"
              disabled={isPending}
              onClick={() => updateApplication({ applicationId: application.id, type: "Accept" })}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Accepting...</span>
                </>
              ) : (
                "Accept"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled={isPending}
              onClick={() => updateApplication({ applicationId: application.id, type: "Reject" })}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Rejecting...</span>
                </>
              ) : (
                "Reject"
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">
          View Applications ({applications?.length ?? 0})
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl w-full">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Applications for {idea.title}</SheetTitle>
          <p className="text-sm text-gray-500">
            {applications?.length ?? 0} {applications?.length === 1 ? 'application' : 'applications'} received
          </p>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : applications?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-gray-500">Applications will appear here when developers apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications?.map((application) => (
              <div key={application.id}>
                {application.status === "ACCEPTED" 
                  ? renderAcceptedCard(application)
                  : renderPendingCard(application)
                }
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}