"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

interface Idea {
  id: string
  title: string
  description: string
  equity: number
  salary: number | null
  requirements: string
  tags: string[]
  founder: {
    name: string
    image: string | null
  }
  createdAt: Date
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const { data: ideas, isLoading } = useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const { data } = await axios.get<Idea[]>('/api/ideas')
      return data
    }
  })

  // Filter ideas based on search query
  const filteredIdeas = ideas?.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="container mx-auto py-8">
      {/* Search Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Next Startup Adventure</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by title, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Ideas Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas?.map((idea) => (
            <Card key={idea.id}>
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  {idea.founder.image ? (
                    <img
                      src={idea.founder.image}
                      alt={idea.founder.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {idea.founder.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-xl">{idea.title}</CardTitle>
                    <p className="text-sm text-gray-500">by {idea.founder.name}</p>
                  </div>
                </div>
                <CardDescription className="line-clamp-3">
                  {idea.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-semibold">Equity Offered:</span> {idea.equity}%
                  </p>
                  {idea.salary && (
                    <p className="text-sm">
                      <span className="font-semibold">Monthly Salary:</span> {formatCurrency(idea.salary)}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Details & Apply</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredIdeas?.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  )
}