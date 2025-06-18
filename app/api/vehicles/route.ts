import { NextResponse } from "next/server"

// Mock data - In a real app, this would come from your database
const mockVehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage: 45000,
    condition: "Excellent",
    startingBid: 18000,
    currentBid: 22500,
    auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    make: "Honda",
    model: "Civic",
    year: 2019,
    mileage: 32000,
    condition: "Good",
    startingBid: 16000,
    currentBid: 19800,
    auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    make: "Ford",
    model: "F-150",
    year: 2021,
    mileage: 28000,
    condition: "Excellent",
    startingBid: 32000,
    currentBid: 38500,
    auctionEndTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "ended" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    make: "BMW",
    model: "3 Series",
    year: 2018,
    mileage: 55000,
    condition: "Good",
    startingBid: 25000,
    currentBid: 25000,
    auctionEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "upcoming" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 5,
    make: "Mercedes",
    model: "C-Class",
    year: 2019,
    mileage: 41000,
    condition: "Excellent",
    startingBid: 28000,
    currentBid: 33200,
    auctionEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 6,
    make: "Audi",
    model: "A4",
    year: 2020,
    mileage: 35000,
    condition: "Excellent",
    startingBid: 30000,
    currentBid: 34500,
    auctionEndTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active" as const,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export async function GET() {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(mockVehicles)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In a real app, you would validate the data and save to database
    const newVehicle = {
      id: mockVehicles.length + 1,
      ...body,
      currentBid: body.startingBid,
      status: "upcoming" as const,
      image: "/placeholder.svg?height=200&width=300",
    }

    mockVehicles.push(newVehicle)

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create vehicle" }, { status: 500 })
  }
}
