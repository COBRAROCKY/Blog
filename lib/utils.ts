import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function estimateReadTime(content: string): number {
  const wordsPerMinute = 250
  const chineseCharsPerMinute = 500
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
  const words = content.replace(/[\u4e00-\u9fa5]/g, "").split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(chineseChars / chineseCharsPerMinute + words / wordsPerMinute)
  return Math.max(1, minutes)
}
