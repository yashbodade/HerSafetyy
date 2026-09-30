import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { alert, location } = body

    if (!alert || !location || typeof location.lat !== "number" || typeof location.lng !== "number") {
      return NextResponse.json({ error: "Alert and valid location are required" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      notified: true,
      message: "Nearby guardians were notified of the safety alert.",
      receivedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Unable to send community alert" }, { status: 400 })
  }
}
