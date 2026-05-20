import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { Post, createPost } from "./db"
import { slugify } from "./utils"

export function parseMarkdownFile(filePath: string): { data: Record<string, unknown>; content: string } | null {
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(raw)
    return { data, content }
  } catch {
    return null
  }
}

export function importMarkdownFile(filePath: string): Post | null {
  const result = parseMarkdownFile(filePath)
  if (!result) return null

  const { data, content } = result
  const title = (data.title as string) || path.basename(filePath, ".md")
  const slug = (data.slug as string) || slugify(title)

  return createPost({
    slug,
    title,
    excerpt: (data.excerpt as string) || content.slice(0, 160).replace(/[#*`\n]/g, ""),
    content,
    category: (data.category as string) || "未分类",
    tags: data.tags ? (data.tags as string[]).flatMap(t => t.split(",").map(s => s.trim())) : [],
    coverImage: (data.coverImage as string) || "/images/default-banner.jpg",
    published: data.published !== false,
    type: "markdown",
  })
}

export function importHtmlFile(filePath: string, title: string, options?: {
  category?: string
  tags?: string[]
  excerpt?: string
}): Post | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    const slug = slugify(title)

    return createPost({
      slug,
      title,
      excerpt: options?.excerpt || title,
      content,
      category: options?.category || "未分类",
      tags: options?.tags || [],
      coverImage: "/images/default-banner.jpg",
      published: true,
      type: "html",
    })
  } catch {
    return null
  }
}
