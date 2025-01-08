import { getDeveloperById } from "@/actions/user"
import { IdeasWithApplicationAndFounders } from "@/app/(main)/community/page"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus, User } from "@prisma/client"
import { formatDistance } from "date-fns"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ViewApplicationsSheet({ idea }: { idea: IdeasWithApplicationAndFounders }) {
  // Get status color
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

  const [developer, setDeveloper] = useState<any | null>(null)

  if (!idea.applications && !developer) {
    <p>No applications yet</p>
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">View Applications ({idea.applications.length})</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl w-full">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">Applications for {idea.title}</SheetTitle>
          <p className="text-sm text-gray-500">
            {idea.applications.length} {idea.applications.length === 1 ? 'application' : 'applications'} received
          </p>
        </SheetHeader>

        {idea.applications.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-gray-500">Applications will appear here when developers apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {idea.applications.map(async (application) => {

              useEffect(() => {
                getDeveloperById(application.developerId).then(data => {
                  setDeveloper(data)
                })
              }, [])

              if (!developer) {
                return null
              }

              return (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {developer ? (
                        <img
                          src={developer.image ?? ""}
                          alt={developer.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold">
                          {developer.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{developer.name}</h3>
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
                      <Button variant="default" className="w-full" size="sm">
                        Accept
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
