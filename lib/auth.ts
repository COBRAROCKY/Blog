import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getSettings, updateSettings } from "./db"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "blog-secret-key-change-in-production"
const TOKEN_NAME = "admin-token"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function setupAdmin(username: string, password: string): Promise<void> {
  const hashedPassword = await hashPassword(password)
  updateSettings({
    adminUsername: username,
    adminPassword: hashedPassword,
  })
}

export async function authenticate(username: string, password: string): Promise<string | null> {
  const settings = getSettings()
  if (settings.adminUsername !== username) return null
  const valid = await verifyPassword(password, settings.adminPassword)
  if (!valid) return null

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" })
  return token
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function getSession(): Promise<boolean> {
  const cookieStore = cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value
  if (!token) return false
  return verifyToken(token)
}

export function setAuthCookie(token: string): void {
  // This will be handled in the API route
}

export const AUTH_COOKIE_NAME = TOKEN_NAME
