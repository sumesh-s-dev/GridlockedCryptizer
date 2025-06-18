import { NextResponse } from "next/server"

export async function GET() {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock stats - In a real app, this would be calculated from your database
  const stats = {
    totalVehicles: 156,
    activeAuctions: 23,
    totalUsers: 1247,
    totalRevenue: 2847500,
  }

  return NextResponse.json(stats)
}
