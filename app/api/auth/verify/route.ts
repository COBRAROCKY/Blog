import { NextResponse } from "next/server"
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth"

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map(c => c.split("="))
  )
  const token = cookies[AUTH_COOKIE_NAME]

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
