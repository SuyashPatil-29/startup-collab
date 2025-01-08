import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "./ui/badge"
import { IdeasWithApplicationAndFounders } from "@/app/(main)/community/page"
import { ApplyNowDialog } from "./ApplyNowDialog"

export function OpenViewIdeaSheet({ idea }: { idea: IdeasWithApplicationAndFounders }) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="w-full">View Details</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-2xl w-full">
        <SheetHeader className="space-y-4">
          <div className="flex items-center gap-4">
            {idea.founder.image ? (
              <img
                src={idea.founder.image}
                alt={idea.founder.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-base font-semibold">
                {idea.founder.name.charAt(0)}
              </div>
            )}
            <div>
              <SheetTitle className="text-xl">{idea.title}</SheetTitle>
              <p className="text-xs text-gray-500">Posted by {idea.founder.name} on {formatDate(idea.createdAt)}</p>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-semibold mb-1.5">About the Idea</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{idea.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h3 className="text-base font-semibold mb-1.5">What We're Looking For</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{idea.requirements}</p>
          </div>

          {/* Offering */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="text-base font-semibold mb-2">What We're Offering</h3>
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Equity Stake:</span> {idea.equity}%
              </p>
            </div>
            {idea.salary && (
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-full">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Monthly Salary:</span> {formatCurrency(parseInt(idea.salary))}
                </p>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <ApplyNowDialog idea={idea}/>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}