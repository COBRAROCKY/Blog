import { NextResponse } from "next/server"
import { getPostById, updatePost, deletePost } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = getPostById(params.id)
  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 })
  }
  return NextResponse.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const post = updatePost(params.id, body)
    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const success = deletePost(params.id)
  if (!success) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
