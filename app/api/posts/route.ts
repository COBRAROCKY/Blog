import { NextResponse } from "next/server"
import { getPosts, getAllPosts, createPost, searchPosts } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const all = searchParams.get("all")

  if (query) {
    return NextResponse.json(searchPosts(query))
  }

  if (all === "true") {
    return NextResponse.json(getAllPosts())
  }

  return NextResponse.json(getPosts())
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, content, category, tags, coverImage, type, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    const post = createPost({
      title,
      slug,
      excerpt: excerpt || "",
      content,
      category: category || "未分类",
      tags: tags || [],
      coverImage: coverImage || "/images/default-banner.jpg",
      published: published !== false,
      type: type || "markdown",
    })

    return NextResponse.json(post, { status: 201 })
  } catch {
    return NextResponse.json({ error: "创建失败" }, { status: 500 })
  }
}
