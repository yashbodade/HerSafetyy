import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { location } = await request.json()

    // Mock threat data - in real app, fetch from multiple sources:
    // - Police databases
    // - News APIs
    // - User reports
    // - Social media monitoring
    // - Government alerts

    const mockThreats = [
      {
        id: "threat-1",
        title: "Construction Area - Poor Lighting",
        description:
          "Road construction has resulted in reduced lighting on MG Road. Exercise caution when walking in this area after dark.",
        severity: "medium" as const,
        location: {
          lat: 28.6139,
          lng: 77.209,
          address: "MG Road, Connaught Place, New Delhi",
        },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        distance: 1.2,
        type: "infrastructure",
        verified: true,
      },
      {
        id: "threat-2",
        title: "Suspicious Activity Reported",
        description:
          "Multiple reports of suspicious individuals approaching women near the metro station. Police have been notified.",
        severity: "high" as const,
        location: {
          lat: 28.6345,
          lng: 77.2767,
          address: "Laxmi Nagar Metro Station, Delhi",
        },
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
        distance: 3.8,
        type: "security",
        verified: true,
      },
      {
        id: "threat-3",
        title: "Increased Police Patrolling",
        description:
          "Police have increased patrolling in Sector 18 area following recent incidents. Area is now considered safer.",
        severity: "low" as const,
        location: {
          lat: 28.495,
          lng: 77.089,
          address: "Sector 18, Gurgaon, Haryana",
        },
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        distance: 15.2,
        type: "security",
        verified: true,
      },
      {
        id: "threat-4",
        title: "CRITICAL: Avoid Yamuna Bank Area",
        description:
          "Multiple incidents reported near Yamuna Bank after 8 PM. Authorities advise avoiding isolated areas. Emergency services on high alert.",
        severity: "critical" as const,
        location: {
          lat: 28.6562,
          lng: 77.241,
          address: "Yamuna Bank, Delhi",
        },
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
        distance: 2.1,
        type: "emergency",
        verified: true,
      },
      {
        id: "threat-5",
        title: "Community Safety Alert",
        description:
          "Local women's group reports improved safety measures in Khan Market area. New CCTV cameras installed.",
        severity: "low" as const,
        location: {
          lat: 28.5984,
          lng: 77.2319,
          address: "Khan Market, New Delhi",
        },
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        distance: 0.8,
        type: "community",
        verified: false,
      },
    ]

    const toRadians = (value: number) => (value * Math.PI) / 180
    const distanceInKm = (lat: number, lng: number) => {
      if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") return 0
      const earthRadius = 6371
      const dLat = toRadians(lat - location.lat)
      const dLng = toRadians(lng - location.lng)
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(location.lat)) * Math.cos(toRadians(lat)) * Math.sin(dLng / 2) ** 2
      return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    const alerts = mockThreats.map((alert) => ({ ...alert, distance: Number(distanceInKm(alert.location.lat, alert.location.lng).toFixed(1)) }))

    return NextResponse.json({
      success: true,
      alerts: mockThreats,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching threat alerts:", error)
    return NextResponse.json({ error: "Failed to fetch threats" }, { status: 500 })
  }
}
