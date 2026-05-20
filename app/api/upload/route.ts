import { NextResponse } from "next/server"
import { verifyToken, AUTH_COOKIE_NAME } from "@/lib/auth"
import { importMarkdownFile, importHtmlFile } from "@/lib/importer"
import { getUploadsDir } from "@/lib/db"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  // Authenticate
  const cookieHeader = request.headers.get("cookie") || ""
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map(c => c.split("="))
  )
  const token = cookies[AUTH_COOKIE_NAME]
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 })
  }

  try {
    const contentType = request.headers.get("content-type") || ""

    if (contentType.includes("multipart/form-data")) {
      // File upload
      const formData = await request.formData()
      const file = formData.get("file") as File
      const title = formData.get("title") as string || ""
      const category = formData.get("category") as string || "未分类"
      const tags = (formData.get("tags") as string || "").split(",").map(t => t.trim()).filter(Boolean)

      if (!file) {
        return NextResponse.json({ error: "请选择文件" }, { status: 400 })
      }

      const uploadsDir = getUploadsDir()
      const fileName = `${Date.now()}-${file.name}`
      const filePath = path.join(uploadsDir, fileName)

      const buffer = Buffer.from(await file.arrayBuffer())
      fs.writeFileSync(filePath, buffer)

      const ext = path.extname(file.name).toLowerCase()

      if (ext === ".md") {
        const post = importMarkdownFile(filePath)
        if (!post) {
          return NextResponse.json({ error: "Markdown 解析失败" }, { status: 400 })
        }
        // Override with user-provided metadata
        if (title) {
          const { updatePost } = await import("@/lib/db")
          updatePost(post.id, { title, category, tags })
        }
        return NextResponse.json(post, { status: 201 })
      }

      if (ext === ".html" || ext === ".htm") {
        if (!title) {
          return NextResponse.json({ error: "HTML 文件需要提供标题" }, { status: 400 })
        }
        const post = importHtmlFile(filePath, title, { category, tags })
        if (!post) {
          return NextResponse.json({ error: "HTML 导入失败" }, { status: 400 })
        }
        return NextResponse.json(post, { status: 201 })
      }

      return NextResponse.json({ error: "不支持的文件格式，仅支持 .md 和 .html" }, { status: 400 })
    }

    return NextResponse.json({ error: "无效的请求" }, { status: 400 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}
