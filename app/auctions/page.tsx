"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Gavel, Search, Clock, DollarSign, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

interface Auction {
  id: number
  vehicleId: number
  vehicle: {
    make: string
    model: string
    year: number
    image: string
  }
  startingBid: number
  currentBid: number
  bidCount: number
  startTime: string
  endTime: string
  status: "active" | "ended" | "upcoming"
  highestBidder?: string
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchAuctions()
  }, [])

  const fetchAuctions = async () => {
    try {
      // Mock data - In a real app, this would come from your API
      const mockAuctions: Auction[] = [
        {
          id: 1,
          vehicleId: 1,
          vehicle: { make: "Toyota", model: "Camry", year: 2020, image: "/placeholder.svg?height=200&width=300" },
          startingBid: 18000,
          currentBid: 22500,
          bidCount: 15,
          startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          highestBidder: "user123",
        },
        {
          id: 2,
          vehicleId: 2,
          vehicle: { make: "Honda", model: "Civic", year: 2019, image: "/placeholder.svg?height=200&width=300" },
          startingBid: 16000,
          currentBid: 19800,
          bidCount: 23,
          startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "active",
          highestBidder: "user456",
        },
        {
          id: 3,
          vehicleId: 3,
          vehicle: { make: "Ford", model: "F-150", year: 2021, image: "/placeholder.svg?height=200&width=300" },
          startingBid: 32000,
          currentBid: 38500,
          bidCount: 31,
          startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "ended",
          highestBidder: "user789",
        },
      ]

      setAuctions(mockAuctions)
    } catch (error) {
      console.error("Error fetching auctions:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAuctions = auctions.filter((auction) =>
    `${auction.vehicle.make} ${auction.vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "ended":
        return "bg-red-500"
      case "upcoming":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading auctions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <Gavel className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Live Auctions</h1>
            </div>
            <Link href="/auctions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Auction
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Auction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctions.filter((a) => a.status === "active").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bids Today</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auctions.reduce((sum, auction) => sum + auction.bidCount, 0)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ending Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  auctions.filter((a) => {
                    const timeLeft = new Date(a.endTime).getTime() - Date.now()
                    return timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000 // Less than 24 hours
                  }).length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Auctions List */}
        <div className="space-y-6">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vehicle Image */}
                  <div className="lg:w-64 flex-shrink-0">
                    <img
                      src={auction.vehicle.image || "/placeholder.svg"}
                      alt={`${auction.vehicle.make} ${auction.vehicle.model}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>

                  {/* Auction Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {auction.vehicle.year} {auction.vehicle.make} {auction.vehicle.model}
                        </h3>
                        <p className="text-gray-600">Auction #{auction.id}</p>
                      </div>
                      <Badge className={getStatusColor(auction.status)}>{auction.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Starting Bid</p>
                        <p className="font-semibold">{formatCurrency(auction.startingBid)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Current Bid</p>
                        <p className="font-bold text-green-600 text-lg">{formatCurrency(auction.currentBid)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Bids</p>
                        <p className="font-semibold">{auction.bidCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{auction.status === "active" ? "Time Left" : "Status"}</p>
                        <p
                          className={`font-semibold ${auction.status === "active" ? "text-red-600" : "text-gray-600"}`}
                        >
                          {auction.status === "active"
                            ? formatTimeRemaining(auction.endTime)
                            : auction.status === "ended"
                              ? "Ended"
                              : "Upcoming"}
                        </p>
                      </div>
                    </div>

                    {auction.highestBidder && auction.status !== "upcoming" && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          Highest Bidder: <span className="font-medium">{auction.highestBidder}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <Link href={`/auctions/${auction.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>
                      {auction.status === "active" && (
                        <Link href={`/auctions/${auction.id}/bid`}>
                          <Button>
                            <Gavel className="h-4 w-4 mr-2" />
                            Place Bid
                          </Button>
                        </Link>
                      )}
                      {auction.status === "upcoming" && (
                        <Button variant="secondary">
                          <Clock className="h-4 w-4 mr-2" />
                          Watch Auction
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAuctions.length === 0 && (
          <div className="text-center py-12">
            <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No auctions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "Try adjusting your search terms." : "No auctions are currently available."}
            </p>
            <Link href="/auctions/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Auction
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
