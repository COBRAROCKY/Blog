import { NextResponse } from "next/server"
import { getComments, addComment, deleteComment, approveComment, getAllComments } from "@/lib/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("postId")
  const all = searchParams.get("all")

  if (all === "true") {
    return NextResponse.json(getAllComments())
  }

  if (postId) {
    return NextResponse.json(getComments(postId))
  }

  return NextResponse.json([])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { postId, author, content } = body

    if (!postId || !author || !content) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 })
    }

    const comment = addComment({ postId, author, content })
    return NextResponse.json(comment, { status: 201 })
  } catch {
    return NextResponse.json({ error: "评论失败" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, action } = body

    if (action === "approve") {
      const success = approveComment(id)
      if (!success) {
        return NextResponse.json({ error: "评论不存在" }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "未知操作" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "操作失败" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "缺少评论ID" }, { status: 400 })
  }

  const success = deleteComment(id)
  if (!success) {
    return NextResponse.json({ error: "评论不存在" }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
